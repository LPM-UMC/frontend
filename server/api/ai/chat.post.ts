// server/api/ai/chat.post.ts
import { defineEventHandler, readBody, createError } from 'h3'

type ChatReq = {
  question?: string
  mode?: 'chat' | 'summarize' | 'draft'
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ChatReq>(event)
  const question = String(body?.question ?? '').trim()
  const mode = (body?.mode ?? 'chat') as ChatReq['mode']

  if (!question) return { answer: 'Tulis pertanyaan dulu ya.' }

  const config = useRuntimeConfig()
  const base = (config.ollamaBase as string) || 'http://127.0.0.1:11434'
  const model = (config.ollamaModel as string) || 'qwen2.5:3b-instruct'

  const systemPrompt =
    mode === 'summarize'
      ? `Kamu adalah AI asisten admin LPM & SPI.
Tugas: MERINGKAS teks/isi menjadi 5-8 poin bullet.
Gunakan Bahasa Indonesia, singkat, jelas.`
      : mode === 'draft'
      ? `Kamu adalah AI asisten admin LPM & SPI.
Tugas: BUAT DRAFT laporan yang rapi dengan struktur:
1) Ringkasan
2) Temuan Utama
3) Analisis
4) Rekomendasi
Gunakan Bahasa Indonesia, formal, tapi tetap mudah dibaca.`
      : `Kamu adalah AI asisten admin LPM & SPI.
Jawab ringkas, rapi, dan faktual dalam Bahasa Indonesia.
Jika tidak tahu atau tidak yakin, bilang "saya belum punya data yang cukup".`

  // timeout biar tidak ngegantung
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), 120_000)

  try {
    const res = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
      }),
    })

    const text = await res.text()

    if (!res.ok) {
      // error dari Ollama biar kebaca jelas
      throw createError({ statusCode: 500, statusMessage: text })
    }

    const data = JSON.parse(text)
    return { answer: data?.message?.content ?? '(tidak ada jawaban)' }
  } catch (err: any) {
    const msg =
      err?.name === 'AbortError'
        ? 'Timeout: Ollama terlalu lama merespons.'
        : err?.message || 'Unknown server error'
    throw createError({ statusCode: 500, statusMessage: msg })
  } finally {
    clearTimeout(t)
  }
})
