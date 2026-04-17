// server/api/ai/chat-stream.post.ts
import { defineEventHandler, readBody, createError, setHeader } from 'h3'

type ChatReq = {
  question?: string
  mode?: 'chat' | 'summarize' | 'draft'
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ChatReq>(event)
  const question = String(body?.question ?? '').trim()
  const mode = (body?.mode ?? 'chat') as ChatReq['mode']

  if (!question) throw createError({ statusCode: 400, statusMessage: 'question is required' })

  const config = useRuntimeConfig()
  const base = (config.ollamaBase as string) || 'http://127.0.0.1:11434'
  const model = (config.ollamaModel as string) || 'qwen2.5:3b-instruct'

  const systemPrompt =
    mode === 'summarize'
      ? `Kamu AI admin LPM(lembaga Penjaminan Mutu) & SPI(Satuan Pengawasan Internal). Ringkas menjadi 5-8 bullet. Bahasa Indonesia.`
      : mode === 'draft'
      ? `Kamu AI LPM(lembaga Penjaminan Mutu) & SPI(Satuan Pengawasan Internal). Buat draft rapi:
1) Ringkasan
2) Temuan Utama
3) Analisis
4) Rekomendasi`
      : `Kamu AI LPM(lembaga Penjaminan Mutu) & SPI(Satuan Pengawasan Internal). Jawab ringkas, jelas, faktual. Kalau tidak tahu bilang tidak tahu.`

  // Panggil Ollama dengan stream: true
  const upstream = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
    }),
  })

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => '')
    throw createError({
      statusCode: 500,
      statusMessage: errText || 'Ollama upstream error',
    })
  }

  // Header untuk streaming text
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-cache, no-transform')
  setHeader(event, 'Connection', 'keep-alive')

  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  const reader = upstream.body.getReader()
  let buffer = ''

  // Transform stream JSON-lines Ollama -> plain text token
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
            const s = line.trim()
            if (!s) continue

            // Tiap line biasanya JSON: { message: { content: "..." }, done: false }
            try {
              const obj = JSON.parse(s)
              const token = obj?.message?.content ?? ''
              if (token) controller.enqueue(encoder.encode(token))

              if (obj?.done) {
                controller.close()
                return
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      } catch (e: any) {
        controller.error(e)
      } finally {
        try { reader.releaseLock() } catch {}
      }

      controller.close()
    },
  })

  return new Response(out)
})
