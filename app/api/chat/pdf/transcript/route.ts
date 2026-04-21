import { NextRequest, NextResponse } from 'next/server'
import { buildChatTranscriptPdf } from '@/lib/pdf-church'
import { clientKeyFromRequest, parsePositiveInt, rateLimitOr429 } from '@/lib/rate-limit'

const WINDOW_MS = 60_000
const PDF_LIMIT = () => parsePositiveInt(process.env.CHAT_PDF_RATE_LIMIT_PER_MINUTE, 25)
const MAX_TURNS = 40
const MAX_CONTENT = 4000

type Turn = { role: 'user' | 'assistant'; content: string }

function sanitizeTurns(raw: unknown): Turn[] | null {
  if (!Array.isArray(raw)) return null
  const out: Turn[] = []
  for (const item of raw) {
    if (typeof item !== 'object' || item === null) continue
    const role = (item as { role?: string }).role
    const content = (item as { content?: string }).content
    if (role !== 'user' && role !== 'assistant') continue
    if (typeof content !== 'string' || !content.trim()) continue
    out.push({ role, content: content.trim().slice(0, MAX_CONTENT) })
  }
  return out.length ? out.slice(-MAX_TURNS) : null
}

export async function POST(req: NextRequest) {
  const ip = clientKeyFromRequest(req)
  const rl = rateLimitOr429(`pdf_transcript:${ip}`, PDF_LIMIT(), WINDOW_MS)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many PDF requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
    )
  }

  try {
    const body = await req.json()
    const turns = sanitizeTurns(body.messages)
    if (!turns) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    const bytes = await buildChatTranscriptPdf(turns, 'Church website chat transcript')
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="harvest-chat-transcript.pdf"',
        'Cache-Control': 'no-store',
      },
    })
  } catch (e) {
    console.error('[pdf transcript]', e)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
