import { sha256Hex } from './hash'
import { buildKnowledgeChunksForFile, listKnowledgeFiles, type KnowledgeChunk } from './knowledge-base'

export type RagHit = {
  cite: string
  source: string
  sourceName: string
  sourceType: string
  heading: string
  text: string
  score: number
  chunk: number
  preview: string
}

type IndexedChunk = KnowledgeChunk & {
  headingTokens: Set<string>
  tokenFreq: Map<string, number>
}

type RagIndexCache = {
  signature: string
  docs: number
  chunks: IndexedChunk[]
  docFreq: Map<string, number>
}

const STOPWORDS = new Set([
  'yang',
  'dan',
  'atau',
  'untuk',
  'dari',
  'dengan',
  'pada',
  'dalam',
  'adalah',
  'agar',
  'sebagai',
  'karena',
  'jika',
  'maka',
  'saat',
  'serta',
  'para',
  'oleh',
  'ke',
  'di',
  'ini',
  'itu',
  'apa',
  'siapa',
  'kapan',
  'berapa',
  'bagaimana',
  'sebutkan',
])

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((t) => t.length >= 2)
    .filter((t) => !STOPWORDS.has(t))
}

function toFreqMap(tokens: string[]) {
  const freq = new Map<string, number>()

  for (const token of tokens) {
    freq.set(token, (freq.get(token) ?? 0) + 1)
  }

  return freq
}

function idf(token: string, state: RagIndexCache) {
  const df = state.docFreq.get(token) ?? 0
  return Math.log(1 + (state.chunks.length + 1) / (df + 1))
}

function scoreChunk(question: string, qTokens: string[], chunk: IndexedChunk, state: RagIndexCache) {
  let score = 0
  const seen = new Set(qTokens)

  for (const token of seen) {
    const tf = chunk.tokenFreq.get(token) ?? 0
    if (!tf) continue

    const tokenIdf = idf(token, state)
    score += tokenIdf * (1 + Math.log(1 + tf))

    if (chunk.headingTokens.has(token)) {
      score += tokenIdf * 1.5
    }
  }

  const comparableQuestion = question.toLowerCase().replace(/[^\p{L}\p{N}\s]+/gu, ' ').trim()
  const comparableText = chunk.text.toLowerCase().replace(/[^\p{L}\p{N}\s]+/gu, ' ').trim()
  if (comparableQuestion.length >= 12 && comparableText.includes(comparableQuestion)) {
    score += 3
  }

  return score
}

function buildSignature() {
  const files = listKnowledgeFiles()
  return {
    files,
    signature: sha256Hex(
      files
        .map((file) => `${file.source}:${file.stat.size}:${Math.round(file.stat.mtimeMs)}`)
        .join('|')
    ),
  }
}

let CACHE: RagIndexCache | null = null

export async function buildRagIndex(args?: { force?: boolean }) {
  const { force = false } = args ?? {}
  const { files, signature } = buildSignature()

  if (!force && CACHE?.signature === signature) {
    return { docs: CACHE.docs, chunks: CACHE.chunks.length, cached: true }
  }

  const loaded = await Promise.all(files.map((file) => buildKnowledgeChunksForFile(file)))
  const rawChunks = loaded.flatMap((entry) => entry.chunks)
  const docFreq = new Map<string, number>()

  const chunks = rawChunks.map((chunk) => {
    const tokens = tokenize(`${chunk.heading}\n${chunk.text}`)
    const tokenFreq = toFreqMap(tokens)
    const uniqueTokens = new Set(tokens)

    for (const token of uniqueTokens) {
      docFreq.set(token, (docFreq.get(token) ?? 0) + 1)
    }

    return {
      ...chunk,
      tokenFreq,
      headingTokens: new Set(tokenize(chunk.heading)),
    } satisfies IndexedChunk
  })

  CACHE = {
    signature,
    docs: files.length,
    chunks,
    docFreq,
  }

  return { docs: files.length, chunks: chunks.length, cached: false }
}

export async function retrieveRag(question: string, topK = 6): Promise<RagHit[]> {
  await buildRagIndex()
  const state = CACHE
  if (!state) return []

  const qTokens = tokenize(question)
  if (!qTokens.length) return []

  const scored = state.chunks
    .map((chunk) => ({ chunk, score: scoreChunk(question, qTokens, chunk, state) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)

  return scored.map((entry, i) => ({
    cite: `[${i + 1}]`,
    source: entry.chunk.source,
    sourceName: entry.chunk.sourceName,
    sourceType: entry.chunk.sourceType,
    heading: entry.chunk.heading,
    text: entry.chunk.text,
    score: entry.score,
    chunk: entry.chunk.chunk,
    preview: entry.chunk.preview,
  }))
}

export function clearRagIndexCache() {
  CACHE = null
}
