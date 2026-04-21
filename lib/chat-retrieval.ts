import {
  getChatPagesSearch,
  getChatSermonsRecent,
  getChatSermonsSearch,
  getEvents,
} from '@/lib/sanity.queries'
import { queryVectorContext } from '@/lib/chat-vector'
import type { ChatSource } from '@/lib/chat-types'

export type { ChatSource } from '@/lib/chat-types'

function groqMatchPattern(userQuery: string): string {
  const t = userQuery.trim().replace(/\*/g, ' ').slice(0, 56)
  if (t.length < 2) return ''
  return `*${t}*`
}

function clip(s: string | null | undefined, n: number): string {
  if (!s) return ''
  const x = s.replace(/\s+/g, ' ').trim()
  return x.length <= n ? x : `${x.slice(0, n - 1)}…`
}

function formatEventWhen(iso: string | undefined): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

/**
 * Structured retrieval for chat: upcoming events, recent/search sermons, CMS pages, optional vector excerpts.
 */
export async function buildRetrievalContext(userQuery: string): Promise<{
  pack: string
  sources: ChatSource[]
  retrievalMs: number
}> {
  const t0 = Date.now()
  const sources: ChatSource[] = []
  const pat = groqMatchPattern(userQuery)

  const [events, recent, searchSermons, searchPages, vectorHits] = await Promise.all([
    getEvents().catch(() => [] as unknown[]),
    getChatSermonsRecent().catch(() => [] as unknown[]),
    pat ? getChatSermonsSearch(pat).catch(() => [] as unknown[]) : Promise.resolve([] as unknown[]),
    pat ? getChatPagesSearch(pat).catch(() => [] as unknown[]) : Promise.resolve([] as unknown[]),
    queryVectorContext(userQuery).catch(() => ({ text: '', sources: [] as ChatSource[] })),
  ])

  const lines: string[] = ['## Retrieved items from this website (cite paths when relevant; do not invent URLs off-site)']

  // Events → list page only (no per-event route in app today)
  const evList = Array.isArray(events) ? events : []
  if (evList.length) {
    lines.push('### Upcoming events (see /events)')
    const eventTitles: string[] = []
    for (const raw of evList.slice(0, 8)) {
      const e = raw as {
        title?: string
        startDate?: string
        location?: string
        description?: string
        slug?: { current?: string }
      }
      const title = e.title || 'Event'
      const when = formatEventWhen(e.startDate)
      const loc = e.location ? ` @ ${e.location}` : ''
      const snip = clip(e.description, 160)
      lines.push(`- ${title} — ${when}${loc}${snip ? ` — ${snip}` : ''}`)
      eventTitles.push(title)
    }
    sources.push({
      kind: 'event',
      title: 'Upcoming events',
      path: '/events',
      snippet: eventTitles.slice(0, 4).join(' · '),
    })
  } else {
    lines.push('### Upcoming events: none returned from the calendar (still direct users to /events).')
  }

  // Sermons: merge search + recent, unique by slug
  const seenSlug = new Set<string>()
  const sermonRows: unknown[] = []
  const pushSermon = (row: unknown) => {
    const s = row as { slug?: string }
    const slug = s?.slug
    if (!slug || seenSlug.has(slug)) return
    seenSlug.add(slug)
    sermonRows.push(row)
  }
  for (const s of Array.isArray(searchSermons) ? searchSermons : []) pushSermon(s)
  for (const s of Array.isArray(recent) ? recent : []) pushSermon(s)

  if (sermonRows.length) {
    lines.push('### Sermons (paths /sermons/[slug])')
    for (const raw of sermonRows.slice(0, 8)) {
      const s = raw as {
        title?: string
        slug?: string
        date?: string
        speaker?: string
        scripture?: string
        description?: string
      }
      const slug = s.slug || ''
      const title = s.title || 'Sermon'
      const path = slug ? `/sermons/${slug}` : '/sermons'
      const snip = clip(s.description, 180)
      lines.push(
        `- **${title}** (${s.date || 'date n/a'}) — ${s.speaker || 'Speaker TBD'}${s.scripture ? ` — ${s.scripture}` : ''}${snip ? ` — ${snip}` : ''} — path: ${path}`,
      )
      sources.push({ kind: 'sermon', title, path, snippet: snip || s.scripture })
    }
  }

  const pageRows = Array.isArray(searchPages) ? searchPages : []
  if (pageRows.length) {
    lines.push('### Pages (paths /[slug])')
    for (const raw of pageRows) {
      const p = raw as { title?: string; slug?: string; seoDescription?: string }
      const slug = p.slug || ''
      if (!slug) continue
      const title = p.title || 'Page'
      const path = `/${slug}`
      const snip = clip(p.seoDescription, 160)
      lines.push(`- **${title}** — ${snip || 'See page for details.'} — path: ${path}`)
      sources.push({ kind: 'page', title, path, snippet: snip })
    }
  }

  if (vectorHits.text) {
    lines.push(vectorHits.text)
    for (const v of vectorHits.sources) sources.push(v)
  }

  const pack = lines.join('\n')
  const retrievalMs = Date.now() - t0
  return { pack, sources, retrievalMs }
}
