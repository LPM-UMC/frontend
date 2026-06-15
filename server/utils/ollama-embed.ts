import { sha256Hex } from './hash'

const EMBED_CACHE = new Map<string, number[]>()
const MAX_EMBED_CACHE = 256

function getCachedEmbedding(key: string) {
  const cached = EMBED_CACHE.get(key)
  if (!cached) return null

  EMBED_CACHE.delete(key)
  EMBED_CACHE.set(key, cached)
  return [...cached]
}

function setCachedEmbedding(key: string, value: number[]) {
  if (EMBED_CACHE.has(key)) EMBED_CACHE.delete(key)
  EMBED_CACHE.set(key, [...value])

  if (EMBED_CACHE.size <= MAX_EMBED_CACHE) return

  const oldestKey = EMBED_CACHE.keys().next().value
  if (oldestKey) EMBED_CACHE.delete(oldestKey)
}

export async function embedWithOllama(args: {
  baseUrl: string
  model: string
  input: string
  useCache?: boolean
}) {
  const { baseUrl, model, input, useCache = true } = args
  const cacheKey = `${baseUrl}|${model}|${sha256Hex(input)}`

  if (useCache) {
    const cached = getCachedEmbedding(cacheKey)
    if (cached) return cached
  }

  const res = await fetch(`${baseUrl}/api/embeddings`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ model, prompt: input }),
  })

  if (!res.ok) {
    const t = await res.text().catch(() => '')
    throw new Error(t || `Ollama embeddings error: ${res.status}`)
  }

  const data = await res.json()
  const embedding = data?.embedding as number[] | undefined
  if (!embedding || !Array.isArray(embedding)) throw new Error('No embedding returned from Ollama')

  if (useCache) setCachedEmbedding(cacheKey, embedding)

  return [...embedding]
}
