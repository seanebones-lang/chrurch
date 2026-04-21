/** OpenAI embeddings for optional vector RAG (1536-dim text-embedding-3-small). */

const MODEL = 'text-embedding-3-small'

export async function embedTextOpenAI(text: string): Promise<number[] | null> {
  const key = process.env.OPENAI_API_KEY?.trim()
  if (!key || !text.trim()) return null

  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ model: MODEL, input: text.slice(0, 8000) }),
  })

  if (!res.ok) {
    const t = await res.text().catch(() => '')
    console.error('[embeddings]', res.status, t.slice(0, 300))
    return null
  }

  const data = (await res.json()) as {
    data?: { embedding?: number[] }[]
  }
  const emb = data.data?.[0]?.embedding
  return Array.isArray(emb) && emb.length ? emb : null
}
