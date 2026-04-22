import { NextRequest, NextResponse } from 'next/server'
import { buildVisitorHandoutPdf } from '@/lib/pdf-church'
import { buildVisitorHandoutPayload } from '@/lib/church-live-facts'
import { getSettings } from '@/lib/sanity.queries'
import { rateLimitOr429Async, pdfLimit } from '@/lib/rate-limit-distributed'

const WINDOW_MS = 60_000

export async function GET(req: NextRequest) {
  const rl = await rateLimitOr429Async('pdfGet', req, pdfLimit(), WINDOW_MS)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many PDF requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } },
    )
  }

  try {
    const settings = await getSettings().catch(() => null)
    const payload = buildVisitorHandoutPayload(settings)
    const bytes = await buildVisitorHandoutPdf(payload)
    const safeName = payload.churchName.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') || 'church'
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName}-visitor-info.pdf"`,
        'Cache-Control': 'private, max-age=300',
      },
    })
  } catch (e) {
    console.error('[pdf visitor]', e)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
}
