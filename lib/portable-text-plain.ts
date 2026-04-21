/** Minimal portable text → plain string for search / RAG (no portable-text package). */

type PtChild = { text?: string; children?: PtChild[] }
type PtBlock = { children?: PtChild[] }

function walkChildren(children: PtChild[] | undefined, out: string[]): void {
  if (!Array.isArray(children)) return
  for (const c of children) {
    if (!c || typeof c !== 'object') continue
    if (typeof c.text === 'string') out.push(c.text)
    walkChildren(c.children, out)
  }
}

export function portableTextToPlain(blocks: unknown): string {
  if (!Array.isArray(blocks)) return ''
  const parts: string[] = []
  for (const b of blocks) {
    if (!b || typeof b !== 'object') continue
    walkChildren((b as PtBlock).children, parts)
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}
