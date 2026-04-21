import { NextRequest, NextResponse } from 'next/server'
import { plainTextForTts } from '@/lib/tts-plain-text'
import { clientKeyFromRequest, parsePositiveInt, rateLimitOr429 } from '@/lib/rate-limit'

const MAX_IN = 12000
const WINDOW_MS = 60_000
const TTS_LIMIT = () => parsePositiveInt(process.env.CHAT_TTS_RATE_LIMIT_PER_MINUTE, 30)

export async function POST(req: NextRequest) {
  try {
    const ip = clientKeyFromRequest(req)
    const rl = rateLimitOr429(`tts:${ip}`, TTS_LIMIT(), WINDOW_MS)
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many voice requests. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
      )
    }

    const body = await req.json()
    const raw = typeof body.text === 'string' ? body.text : ''
    const text = plainTextForTts(raw, MAX_IN)
    if (!text.trim()) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 })
    }

    const apiKey = process.env.XAI_API_KEY?.trim()
    if (!apiKey) {
      return NextResponse.json({ error: 'Voice is not configured' }, { status: 503 })
    }

    const voiceId = process.env.XAI_TTS_VOICE?.trim() || 'ara'
    const language = process.env.XAI_TTS_LANGUAGE?.trim() || 'en'

    const res = await fetch('https://api.x.ai/v1/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text,
        voice_id: voiceId,
        language,
      }),
    })

    const buf = Buffer.from(await res.arrayBuffer())

    if (!res.ok) {
      let msg = `TTS failed (${res.status})`
      try {
        const err = JSON.parse(buf.toString('utf8')) as { error?: { message?: string } }
        if (err?.error?.message) msg = err.error.message
      } catch {
        /* ignore */
      }
      console.error('[tts]', res.status, msg)
      return NextResponse.json({ error: msg }, { status: 502 })
    }

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (e) {
    console.error('[tts]', e)
    return NextResponse.json({ error: 'Voice request failed' }, { status: 500 })
  }
}
