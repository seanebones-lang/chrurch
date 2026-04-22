import { Index } from '@upstash/vector'
import { portableTextToPlain } from '@/lib/portable-text-plain'
import { embedTextOpenAI } from '@/lib/embeddings-openai'

const CHUNK = 900
const STEP = 650

function chunkText(text: string): string[] {
  const t = text.replace(/\s+/g, ' ').trim()
  if (!t) return []
  const out: string[] = []
  for (let i = 0; i < t.length; i += STEP) {
    out.push(t.slice(i, i + CHUNK))
    if (i + CHUNK >= t.length) break
  }
  return out
}

function getIndex(): Index | null {
  const url = process.env.UPSTASH_VECTOR_REST_URL?.trim()
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN?.trim()
  if (!url || !token) return null
  return new Index({ url, token })
}

export type IngestSermonRow = {
  _id?: string
  slug?: string
  title?: string
  speaker?: string
  scripture?: string
  series?: string
  description?: string
  transcript?: unknown
}

async function upsertChunksForRow(
  index: NonNullable<ReturnType<typeof getIndex>>,
  row: IngestSermonRow,
  errors: string[],
): Promise<number> {
  const id = row._id
  const slug = row.slug
  const title = row.title || 'Sermon'
  if (!id || !slug) return 0

  const plain = [
    title,
    row.speaker,
    row.scripture,
    row.series,
    row.description,
    portableTextToPlain(row.transcript),
  ]
    .filter(Boolean)
    .join('\n')

  const chunks = chunkText(plain)
  if (!chunks.length) return 0

  let upserted = 0
  const batch: { id: string; vector: number[]; metadata: Record<string, string> }[] = []

  const flushBatch = async () => {
    if (!batch.length) return
    const take = batch.splice(0, 20)
    await index.upsert(take)
  }

  let i = 0
  for (const text of chunks) {
    const vector = await embedTextOpenAI(text)
    if (!vector) {
      errors.push(`No embedding for sermon ${slug} chunk ${i}`)
      break
    }
    const path = `/sermons/${slug}`
    batch.push({
      id: `${id}_c${i}`,
      vector,
      metadata: {
        type: 'sermon',
        sermonId: id,
        slug,
        title,
        path,
        text: text.slice(0, 4000),
        chunkIndex: String(i),
      },
    })
    upserted += 1
    i += 1
    if (batch.length >= 20) await flushBatch()
  }

  while (batch.length) await flushBatch()
  return upserted
}

/** Remove all vector chunks for a Sanity document id (chunk ids are `${id}_cN`). */
export async function deleteSermonVectorsBySanityId(sanityDocId: string): Promise<{ deleted: number }> {
  const index = getIndex()
  if (!index) return { deleted: 0 }
  try {
    const res = await index.delete({ prefix: `${sanityDocId}_` })
    return { deleted: res.deleted ?? 0 }
  } catch (e) {
    console.error('[vector delete]', e)
    return { deleted: 0 }
  }
}

export async function upsertSermonChunks(rows: IngestSermonRow[]): Promise<{ upserted: number; errors: string[] }> {
  const index = getIndex()
  const errors: string[] = []
  if (!index) {
    errors.push('UPSTASH_VECTOR_REST_URL / UPSTASH_VECTOR_REST_TOKEN not configured')
    return { upserted: 0, errors }
  }

  let upserted = 0
  for (const row of rows) {
    upserted += await upsertChunksForRow(index, row, errors)
  }
  return { upserted, errors }
}

/** Re-index a single sermon (e.g. Sanity webhook): delete old chunks then upsert. */
export async function reindexSermonRow(row: IngestSermonRow | null): Promise<{ upserted: number; errors: string[] }> {
  const errors: string[] = []
  const index = getIndex()
  if (!index) {
    errors.push('UPSTASH_VECTOR_REST_URL / UPSTASH_VECTOR_REST_TOKEN not configured')
    return { upserted: 0, errors }
  }
  if (!row?._id) {
    return { upserted: 0, errors }
  }
  await deleteSermonVectorsBySanityId(row._id)
  const n = await upsertChunksForRow(index, row, errors)
  return { upserted: n, errors }
}
