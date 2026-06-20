import { createError, defineEventHandler, readBody, setHeader, type H3Event } from 'h3'
import { sha256Hex } from '../../utils/hash'
import { buildSystemPrompt, type AIUserContext } from '../../utils/prompt-builder'
import { embedWithOllama } from '../../utils/ollama-embed'
import { getQdrantClient, searchPoints, type VectorHit } from '../../utils/qdrant'
import { retrieveRag, type RagHit } from '../../utils/rag'
import { getRagConfig } from '../../utils/rag-config'

type ChatReq = {
  question?: string
  mode?: 'chat' | 'summarize' | 'draft'
}

type HybridHit = {
  cite: string
  source: string
  sourceName: string
  sourceType: string
  heading: string
  text: string
  chunk: number
  preview: string
  fusedScore: number
  vectorScore?: number
  lexicalScore?: number
}

function replyPlainText(event: H3Event, text: string) {
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return text
}

function buildMessages(args: {
  mode: NonNullable<ChatReq['mode']>
  question: string
  ragContextText: string
  userCtx?: AIUserContext
}) {
  const { mode, question, ragContextText, userCtx } = args

  let systemPrompt = buildSystemPrompt(mode, userCtx)
  
  if (mode === 'summarize') {
    systemPrompt += '\nTambahan: Ringkas isi dokumen menjadi 5-8 bullet dalam Bahasa Indonesia.'
  } else if (mode === 'draft') {
    systemPrompt += '\nTambahan: Buat draft rapi dengan bagian 1) Ringkasan, 2) Temuan Utama, 3) Analisis, 4) Rekomendasi.'
  }

  return [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `PERTANYAAN:\n${question}\n\nKONTEKS DOKUMEN:\n${ragContextText}`,
    },
  ]
}

function buildNoContextReply(mode: NonNullable<ChatReq['mode']>) {
  if (mode === 'summarize') return 'Tidak ditemukan di dokumen untuk diringkas.'
  if (mode === 'draft') return 'Tidak ditemukan di dokumen untuk dibuat draft.'
  return 'Tidak ditemukan di dokumen.'
}

async function getVectorHits(question: string) {
  const config = getRagConfig()
  const client = getQdrantClient(config.qdrantUrl)
  const qVec = await embedWithOllama({
    baseUrl: config.ollamaBase,
    model: config.embedModel,
    input: question,
  })

  return searchPoints({
    client,
    collection: config.collection,
    vector: qVec,
    topK: config.vectorTopK,
    scoreThreshold: config.vectorScoreThreshold,
  })
}

async function getLexicalHits(question: string) {
  const config = getRagConfig()
  return retrieveRag(question, config.lexicalTopK)
}

function mergeHybridHits(vectorHits: VectorHit[], lexicalHits: RagHit[], topK: number) {
  const merged = new Map<string, HybridHit>()

  function ensureHit(key: string, base: Omit<HybridHit, 'cite' | 'fusedScore'>) {
    const existing = merged.get(key)
    if (existing) return existing

    const created: HybridHit = {
      cite: '',
      fusedScore: 0,
      ...base,
    }

    merged.set(key, created)
    return created
  }

  vectorHits.forEach((hit, index) => {
    const key = sha256Hex(`${hit.source}|${hit.heading}|${hit.text}`)
    const mergedHit = ensureHit(key, {
      source: hit.source,
      sourceName: hit.sourceName || hit.source,
      sourceType: hit.sourceType || 'vector',
      heading: hit.heading || 'Dokumen',
      text: hit.text,
      chunk: Number.isFinite(hit.chunk) ? hit.chunk : -1,
      preview: hit.preview || hit.text.slice(0, 180),
      vectorScore: hit.score,
    })

    mergedHit.fusedScore += 1 / (60 + index + 1)
    mergedHit.vectorScore = hit.score
  })

  lexicalHits.forEach((hit, index) => {
    const key = sha256Hex(`${hit.source}|${hit.heading}|${hit.text}`)
    const mergedHit = ensureHit(key, {
      source: hit.source,
      sourceName: hit.sourceName || hit.source,
      sourceType: hit.sourceType || 'doc',
      heading: hit.heading || 'Dokumen',
      text: hit.text,
      chunk: Number.isFinite(hit.chunk) ? hit.chunk : -1,
      preview: hit.preview || hit.text.slice(0, 180),
      lexicalScore: hit.score,
    })

    mergedHit.fusedScore += 1 / (60 + index + 1)
    mergedHit.lexicalScore = hit.score
  })

  return Array.from(merged.values())
    .sort((a, b) => {
      if (b.fusedScore !== a.fusedScore) return b.fusedScore - a.fusedScore
      return (b.vectorScore ?? b.lexicalScore ?? 0) - (a.vectorScore ?? a.lexicalScore ?? 0)
    })
    .slice(0, topK)
    .map((hit, index) => ({
      ...hit,
      cite: `[${index + 1}]`,
    }))
}

function formatHybridContext(hits: HybridHit[]) {
  return hits
    .map((hit) => {
      const parts = [hit.sourceType.toUpperCase(), hit.sourceName]
      if (hit.heading) parts.push(hit.heading)
      if (hit.chunk >= 0) parts.push(`chunk ${hit.chunk}`)
      return `${hit.cite} (${parts.join(' | ')})\n${hit.text}`
    })
    .join('\n\n')
}

async function getHybridContext(question: string) {
  const config = getRagConfig()

  const [vectorResult, lexicalResult] = await Promise.allSettled([
    getVectorHits(question),
    getLexicalHits(question),
  ])

  const vectorHits = vectorResult.status === 'fulfilled' ? vectorResult.value : []
  const lexicalHits = lexicalResult.status === 'fulfilled' ? lexicalResult.value : []
  const hits = mergeHybridHits(vectorHits, lexicalHits, config.hybridTopK)

  return {
    hits,
    contextText: hits.length ? formatHybridContext(hits) : null,
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ChatReq>(event)
  const question = String(body?.question ?? '').trim()
  const mode = (body?.mode ?? 'chat') as NonNullable<ChatReq['mode']>

  if (!question) {
    throw createError({ statusCode: 400, statusMessage: 'question is required' })
  }

  // Ekstrak konteks user dari middleware auth
  const rawUser = event.context.user
  let userCtx: AIUserContext | undefined = undefined
  
  if (rawUser) {
    // rawUser.roles mungkin dari Prisma jika Hono mereturnnya
    const roles = Array.isArray(rawUser.roles) ? rawUser.roles : 
                 (typeof rawUser.role === 'string' ? [rawUser.role] : [])
    userCtx = {
      name: rawUser.nama || rawUser.name || 'Dosen',
      roles,
    }
  }

  const cacheKey = 'ai:chat:' + sha256Hex(`${question.toLowerCase()}|${mode}|${userCtx?.roles?.join(',') || ''}`)
  const cachedResponse = await useStorage().getItem(cacheKey)
  
  if (cachedResponse) {
    return replyPlainText(event, String(cachedResponse))
  }

  const { contextText } = await getHybridContext(question)
  if (!contextText) {
    return replyPlainText(event, buildNoContextReply(mode))
  }

  const config = getRagConfig()
  const messages = buildMessages({ mode, question, ragContextText: contextText, userCtx })

  const upstream = await fetch(`${config.ollamaBase}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: config.chatModel,
      stream: true,
      messages,
      temperature: 0.15,
    }),
  })

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => '')
    throw createError({
      statusCode: 500,
      statusMessage: errText || 'Upstream error',
    })
  }

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-cache, no-transform')
  setHeader(event, 'Connection', 'keep-alive')

  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  const reader = upstream.body.getReader()
  let buffer = ''
  let fullGeneratedText = ''

  const out = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        while (true) {
          const { value, done } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            const text = line.trim()
            if (!text || !text.startsWith('data:')) continue

            const data = text.replace(/^data:\s*/, '')
            if (data === '[DONE]') {
              if (fullGeneratedText) {
                // Simpan jawaban utuh ke dalam Cache
                await useStorage().setItem(cacheKey, fullGeneratedText)
              }
              controller.close()
              return
            }

            try {
              const obj = JSON.parse(data)
              const token = obj?.choices?.[0]?.delta?.content ?? ''
              if (token) {
                fullGeneratedText += token
                controller.enqueue(encoder.encode(token))
              }
            } catch {
              // ignore malformed chunks from upstream
            }
          }
        }
        
        // Jaga-jaga jika stream berakhir tanpa '[DONE]'
        if (fullGeneratedText) {
          await useStorage().setItem(cacheKey, fullGeneratedText)
        }
      } catch (error: any) {
        controller.error(error)
      } finally {
        try {
          reader.releaseLock()
        } catch {
          // ignore lock release errors
        }
      }

      controller.close()
    },
  })

  return new Response(out)
})
