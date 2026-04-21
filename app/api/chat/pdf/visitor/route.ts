import { NextRequest, NextResponse } from 'next/server'
import { buildVisitorHandoutPdf } from '@/lib/pdf-church'
import { buildVisitorHandoutPayload } from '@/lib/church-live-facts'
import { getSettings } from '@/lib/sanity.queries'
import { clientKeyFromRequest, parsePositiveInt, rateLimitOr429 } from '@/lib/rate-limit'

const WINDOW_MS = 60_000
const PDF_LIMIT = () => parsePositiveInt(process.env.CHAT_PDF_RATE_LIMIT_PER_MINUTE, 25)

export async function GET(req: NextRequest) {
  const ip = clientKeyFromRequest(req)
  const rl = rateLimitOr429(`pdf_visitor:${ip}`, PDF_LIMIT(), WINDOW_MS)
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
