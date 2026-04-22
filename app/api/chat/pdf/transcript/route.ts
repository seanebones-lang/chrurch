import { NextRequest, NextResponse } from 'next/server'
import { buildChatTranscriptPdf } from '@/lib/pdf-church'
import { rateLimitOr429Async, pdfLimit } from '@/lib/rate-limit-distributed'

const WINDOW_MS = 60_000
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
  const rl = await rateLimitOr429Async('pdfPost', req, pdfLimit(), WINDOW_MS)
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
