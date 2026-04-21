import { NextRequest, NextResponse } from 'next/server'
import { buildChatBaseSystemPrompt } from '@/lib/chat-system-prompt'
import { formatLiveSiteFactsBlock } from '@/lib/church-live-facts'
import { buildRetrievalContext } from '@/lib/chat-retrieval'
import { getSettings } from '@/lib/sanity.queries'
import { CHURCH_PHONE_DISPLAY } from '@/lib/church-info'
import { clientKeyFromRequest, parsePositiveInt, rateLimitOr429 } from '@/lib/rate-limit'
import type { ChatSource } from '@/lib/chat-types'

const MAX_MESSAGE_CHARS = 2000
const MAX_HISTORY = 12
const MAX_SYSTEM_CHARS = 95000

const WINDOW_MS = 60_000
const CHAT_LIMIT = () => parsePositiveInt(process.env.CHAT_RATE_LIMIT_PER_MINUTE, 45)

type ChatTurn = { role: 'user' | 'assistant' | 'system'; content: string }

function sanitizeMessages(raw: unknown): ChatTurn[] | null {
  if (!Array.isArray(raw)) return null
  const out: ChatTurn[] = []
  for (const item of raw) {
    if (typeof item !== 'object' || item === null) continue
    const role = (item as { role?: string }).role
    const content = (item as { content?: string }).content
    if (role !== 'user' && role !== 'assistant') continue
    if (typeof content !== 'string' || !content.trim()) continue
    const trimmed = content.trim().slice(0, MAX_MESSAGE_CHARS)
    out.push({ role, content: trimmed })
  }
  return out.length ? out : null
}

function lastUserContent(turns: ChatTurn[]): string {
  for (let i = turns.length - 1; i >= 0; i--) {
    if (turns[i].role === 'user') return turns[i].content
  }
  return ''
}

export async function POST(req: NextRequest) {
  try {
    const ip = clientKeyFromRequest(req)
    const rl = rateLimitOr429(`chat:${ip}`, CHAT_LIMIT(), WINDOW_MS)
    if (!rl.ok) {
      return NextResponse.json(
        { message: 'Too many messages right now. Please wait a minute and try again.', sources: [] as ChatSource[] },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
      )
    }

    const body = await req.json()
    const sanitized = sanitizeMessages(body.messages)
    if (!sanitized) {
      return NextResponse.json({ message: 'Please send a short message so I can help.', sources: [] as ChatSource[] }, { status: 400 })
    }

    const apiKey = process.env.XAI_API_KEY?.trim()
    if (!apiKey) {
      return NextResponse.json(
        {
          message: `Thanks for reaching out! The chat assistant is not configured yet. Please call us at ${CHURCH_PHONE_DISPLAY} or use the contact form on the About page (/about#contact).`,
          sources: [] as ChatSource[],
        },
        { status: 200 },
      )
    }

    const model = process.env.XAI_CHAT_MODEL?.trim() || 'grok-3-mini'
    const history = sanitized.slice(-MAX_HISTORY)
    const userQ = lastUserContent(history)

    const t0 = Date.now()
    const settings = await getSettings().catch(() => null)
    const liveFacts = formatLiveSiteFactsBlock(settings)
    const { pack, sources, retrievalMs } = await buildRetrievalContext(userQ)
    console.log(
      JSON.stringify({
        tag: 'chat_retrieval',
        retrievalMs,
        sourceCount: sources.length,
        userQueryLen: userQ.length,
      }),
    )

    const systemCore = buildChatBaseSystemPrompt()
    const system = `${systemCore}\n\n${liveFacts}\n\n${pack}`.trim().slice(0, MAX_SYSTEM_CHARS)
    const prepMs = Date.now() - t0
    if (prepMs > 800) console.warn('[chat] slow_context_ms', prepMs)

    const res = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: system }, ...history],
        max_tokens: 400,
        temperature: 0.35,
      }),
    })

    const rawText = await res.text()
    let data: {
      choices?: { message?: { content?: string | null } }[]
      error?: { message?: string }
    }
    try {
      data = JSON.parse(rawText) as typeof data
    } catch {
      console.error('[chat] xAI non-JSON response', res.status, rawText.slice(0, 500))
      throw new Error('Invalid response from chat provider')
    }

    if (!res.ok) {
      console.error('[chat] xAI error', res.status, data)
      throw new Error(data.error?.message || `HTTP ${res.status}`)
    }

    const message =
      typeof data.choices?.[0]?.message?.content === 'string'
        ? data.choices[0].message.content.trim()
        : ''

    if (!message) {
      return NextResponse.json(
        {
          message: `I did not get a clear answer for that. Try rephrasing, or call ${CHURCH_PHONE_DISPLAY} — or use the contact form at /about#contact.`,
          sources,
        },
        { status: 200 },
      )
    }

    return NextResponse.json({ message, sources })
  } catch (e) {
    console.error('[chat]', e)
    return NextResponse.json(
      {
        message: `Something went wrong on our side. Please call ${CHURCH_PHONE_DISPLAY} or visit /about#contact to send a message.`,
        sources: [] as ChatSource[],
      },
      { status: 200 },
    )
  }
}
