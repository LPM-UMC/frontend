<!-- dashboardAiCard.vue -->
<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-black">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="text-sm font-semibold text-gray-800">AI Admin (LPM & SPI)</h3>
        <p class="text-xs text-gray-500">
          Mode: chat / ringkas / draft.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <select v-model="mode" class="rounded-xl border px-3 py-2 text-xs">
          <option value="chat">Chat</option>
          <option value="summarize">Ringkas</option>
          <option value="draft">Draft</option>
        </select>

        <button
          type="button"
          class="text-xs px-3 py-2 rounded-xl border border-black hover:bg-gray-50"
          @click="clearChat"
        >
          Clear
        </button>
      </div>
    </div>

    <div ref="box" class="mt-4 h-64 overflow-auto rounded-xl p-3 bg-gray-50 space-y-3">
      <div
        v-for="(m, i) in messages"
        :key="i"
        class="text-sm flex"
        :class="m.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div class="max-w-[85%]">
          <div
            class="rounded-2xl px-3 py-2"
            :class="m.role === 'user' ? 'bg-red-600 text-white' : 'bg-gray-200 '"
          >
            <div class="whitespace-pre-wrap">{{ m.text }}</div>
          </div>

          <!-- tombol copy hanya untuk jawaban AI -->
          <div v-if="m.role === 'ai'" class="mt-1 flex gap-2 text-[11px] text-gray-500">
            <button type="button" class="hover:underline" @click="copyText(m.text)">
              Copy
            </button>
            <span v-if="copiedIndex === i">✓ tersalin</span>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-xs text-gray-500">AI mengetik...</div>
      <div v-if="error" class="text-xs text-red-600">{{ error }}</div>
    </div>

    <form class="mt-3 flex gap-2" @submit.prevent="send">
      <input
        v-model="q"
        class="flex-1 rounded-xl border px-3 py-2 text-sm text-black-500"
        placeholder="Tulis pertanyaan..."
        @keydown.enter.prevent="send"
      />
      <button
        class="rounded-xl bg-black text-white px-4 py-2 text-sm disabled:opacity-60"
        :disabled="loading || !q.trim()"
      >
        Kirim
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

type Mode = 'chat' | 'summarize' | 'draft'
type Msg = { role: 'user' | 'ai'; text: string }

const STORAGE_KEY = 'admin-ai-chat-v1'

const q = ref('')
const mode = ref<Mode>('chat')
const loading = ref(false)
const error = ref<string | null>(null)
const copiedIndex = ref<number | null>(null)

const messages = ref<Msg[]>([
  { role: 'ai', text: 'Halo! Saya AI admin. Pilih mode di kanan atas, lalu tanya sesuatu.' },
])

const box = ref<HTMLElement | null>(null)

async function scrollBottom() {
  await nextTick()
  if (box.value) box.value.scrollTop = box.value.scrollHeight
}

function clearChat() {
  messages.value = [{ role: 'ai', text: 'Chat direset. Silakan tanya lagi.' }]
  q.value = ''
  error.value = null
  copiedIndex.value = null
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    // tandai "copied" sebentar
    copiedIndex.value = messages.value.findIndex((m) => m.text === text && m.role === 'ai')
    setTimeout(() => (copiedIndex.value = null), 900)
  } catch {
    error.value = 'Gagal copy. Coba manual select/copy.'
  }
}

async function send() {
  const text = q.value.trim()
  if (!text || loading.value) return

  error.value = null
  loading.value = true

  messages.value.push({ role: 'user', text })
  // placeholder untuk jawaban AI
  messages.value.push({ role: 'ai', text: '' })

  q.value = ''
  await scrollBottom()

  try {
    const res = await fetch('/api/ai/chat-stream', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question: text, mode: mode.value }),
    })

    if (!res.ok || !res.body) {
      const errText = await res.text().catch(() => '')
      throw new Error(errText || 'Stream response invalid')
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      // append ke pesan AI terakhir
      const last = messages.value[messages.value.length - 1]
      if (last?.role === 'ai') last.text += chunk

      await scrollBottom()
    }
  } catch (e: any) {
    error.value = e?.message || 'Unknown error'
    // kalau error, isi placeholder jadi pesan error
    const last = messages.value[messages.value.length - 1]
    if (last?.role === 'ai' && !last.text) last.text = 'Maaf, terjadi error saat streaming.'
  } finally {
    loading.value = false
    await scrollBottom()
  }
}


// (opsional) simpan chat di localStorage supaya tidak hilang saat refresh
onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) messages.value = JSON.parse(raw)
  } catch {
    // ignore
  }
  scrollBottom()
})

watch(
  messages,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    } catch {
      // ignore
    }
  },
  { deep: true }
)
</script>
