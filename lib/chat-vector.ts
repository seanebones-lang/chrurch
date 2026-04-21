import { Index } from '@upstash/vector'
import { embedTextOpenAI } from '@/lib/embeddings-openai'
import type { ChatSource } from '@/lib/chat-types'

function getIndex(): Index | null {
  const url = process.env.UPSTASH_VECTOR_REST_URL?.trim()
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN?.trim()
  if (!url || !token) return null
  return new Index({ url, token })
}

export type VectorHit = { id: string; score: number; text: string; path?: string; title?: string }

/** Query Upstash Vector + format for chat context. */
export async function queryVectorContext(userQuery: string): Promise<{ text: string; sources: ChatSource[] }> {
  const index = getIndex()
  if (!index || userQuery.trim().length < 3) return { text: '', sources: [] }

  const vector = await embedTextOpenAI(userQuery)
  if (!vector) return { text: '', sources: [] }

  const topK = Math.min(8, Math.max(3, Number.parseInt(process.env.CHAT_VECTOR_TOP_K || '5', 10) || 5))
  const matches = await index.query({
    vector,
    topK,
    includeMetadata: true,
  })

  if (!Array.isArray(matches) || !matches.length) return { text: '', sources: [] }

  const lines: string[] = ['### Semantic excerpts (from sermon notes/transcripts; cite paths)']
  const sources: ChatSource[] = []

  for (const m of matches) {
    const meta = (m.metadata || {}) as Record<string, unknown>
    const title = typeof meta.title === 'string' ? meta.title : 'Sermon excerpt'
    const path = typeof meta.path === 'string' ? meta.path : '/sermons'
    const chunk = typeof meta.text === 'string' ? meta.text : ''
    if (!chunk.trim()) continue
    lines.push(`- (${Math.round((m.score ?? 0) * 1000) / 1000}) **${title}** — ${path}\n  > ${chunk.replace(/\s+/g, ' ').trim().slice(0, 500)}`)
    sources.push({
      kind: 'vector',
      title,
      path,
      snippet: chunk.slice(0, 220),
    })
  }

  if (lines.length <= 1) return { text: '', sources: [] }
  return { text: lines.join('\n'), sources }
}
