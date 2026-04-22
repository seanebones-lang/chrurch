import { NextRequest, NextResponse } from 'next/server'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { getSermonIngestRowById } from '@/lib/sanity.queries'
import { deleteSermonVectorsBySanityId, reindexSermonRow, type IngestSermonRow } from '@/lib/sermon-ingest'
import { rateLimitOr429Async, webhookLimit } from '@/lib/rate-limit-distributed'

const WINDOW_MS = 60_000

/**
 * GROQ-powered Sanity webhook: revalidate sermon vectors on publish/update/delete.
 * Configure in sanity.io/manage with the same secret as SANITY_WEBHOOK_SECRET.
 * Uses signed body verification (@sanity/webhook) and `sanity-document-id` / `sanity-operation` headers.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET?.trim()
  if (!secret) {
    return NextResponse.json({ ok: false, error: 'Webhook secret not configured' }, { status: 503 })
  }

  const rl = await rateLimitOr429Async('webhook', req, webhookLimit(), WINDOW_MS)
  if (!rl.ok) {
    return NextResponse.json({ ok: false }, { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } })
  }

  const rawBody = await req.text()
  const signature = req.headers.get(SIGNATURE_HEADER_NAME) || ''
  const valid = await isValidSignature(rawBody, signature, secret).catch(() => false)
  if (!valid) {
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 })
  }

  const op = (req.headers.get('sanity-operation') || 'update').toLowerCase()
  const docId = req.headers.get('sanity-document-id')?.trim()
  if (!docId) {
    return NextResponse.json({ ok: true, skipped: 'no sanity-document-id header' })
  }

  try {
    if (op === 'delete') {
      const { deleted } = await deleteSermonVectorsBySanityId(docId)
      return NextResponse.json({ ok: true, operation: 'delete', docId, deleted })
    }

    const row = await getSermonIngestRowById(docId).catch(() => null)
    if (!row || typeof row !== 'object') {
      return NextResponse.json({ ok: true, skipped: 'not a sermon or not found', docId })
    }

    const { upserted, errors } = await reindexSermonRow(row as IngestSermonRow)
    return NextResponse.json({ ok: true, operation: op, docId, upserted, errors })
  } catch (e) {
    console.error('[sanity webhook]', e)
    return NextResponse.json({ ok: false, error: 'Processing failed' }, { status: 500 })
  }
}
