import { NextRequest, NextResponse } from 'next/server'
import { getSermonsForIngest } from '@/lib/sanity.queries'
import { upsertSermonChunks } from '@/lib/sermon-ingest'

/**
 * POST /api/chat/ingest — re-index sermon text into Upstash Vector (optional).
 * Headers: Authorization: Bearer <CHAT_INGEST_SECRET>
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CHAT_INGEST_SECRET?.trim()
  const auth = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim()
  if (!secret || auth !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const rows = await getSermonsForIngest().catch(() => [])
    const list = Array.isArray(rows) ? rows : []
    const { upserted, errors } = await upsertSermonChunks(list)
    return NextResponse.json({
      ok: true,
      sermonDocs: list.length,
      upserted,
      errors,
    })
  } catch (e) {
    console.error('[ingest]', e)
    return NextResponse.json({ error: 'Ingest failed' }, { status: 500 })
  }
}
