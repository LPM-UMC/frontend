<template>
  <ClientOnly>
    <Transition name="chat-panel">
      <section
        v-if="isOpen"
        class="fixed inset-x-4 bottom-[92px] z-50 flex max-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-[18px] border border-gray-200 bg-white text-gray-900 shadow-2xl sm:left-auto sm:right-6 sm:w-[420px]"
        aria-label="Popup chat AI"
      >
        <header class="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-3">
          <div class="flex min-w-0 items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Icon name="lucide:bot" size="22" aria-hidden="true" />
            </div>
            <div class="min-w-0">
              <h2 class="truncate text-sm font-semibold text-gray-900">
                AI SI IMOET
              </h2>
              <p class="mt-0.5 truncate text-xs text-gray-500">
                Asisten dokumen mutu
              </p>
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
              title="Bersihkan chat"
              aria-label="Bersihkan chat"
              @click="clearChat"
            >
              <Icon name="lucide:trash-2" size="17" aria-hidden="true" />
            </button>
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
              title="Tutup chat"
              aria-label="Tutup chat"
              @click="isOpen = false"
            >
              <Icon name="lucide:x" size="18" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div class="border-b border-gray-100 px-4 py-3">
          <label class="sr-only" for="chat-mode">Mode chat</label>
          <select
            id="chat-mode"
            v-model="mode"
            class="h-10 w-full rounded-[10px] border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
          >
            <option value="chat">Chat</option>
            <option value="summarize">Ringkas</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div
          ref="box"
          class="min-h-[280px] flex-1 space-y-3 overflow-y-auto bg-gray-50 px-4 py-4 sm:min-h-[360px]"
        >
          <div
            v-for="(message, index) in messages"
            :key="`${message.role}-${index}`"
            class="flex text-sm"
            :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div class="max-w-[84%]">
              <div
                class="rounded-[16px] px-3.5 py-2.5 leading-6"
                :class="message.role === 'user'
                  ? 'bg-red-600 text-white'
                  : 'border border-gray-200 bg-white text-gray-800 shadow-sm'"
              >
                <div class="whitespace-pre-wrap break-words">{{ getMessageText(message) }}</div>
              </div>

              <div
                v-if="message.role === 'assistant' && getMessageText(message)"
                class="mt-1.5 flex items-center gap-2 text-[11px] text-gray-500"
              >
                <button
                  type="button"
                  class="inline-flex items-center gap-1 hover:text-gray-900"
                  @click="copyText(getMessageText(message), index)"
                >
                  <Icon name="lucide:copy" size="13" aria-hidden="true" />
                  Copy
                </button>
                <span v-if="copiedIndex === index">tersalin</span>
              </div>
            </div>
          </div>

          <div v-if="loading" class="flex items-center gap-2 text-xs text-gray-500">
            <Icon name="lucide:loader-circle" size="14" class="animate-spin" aria-hidden="true" />
            AI mengetik...
          </div>
          <div v-if="error" class="rounded-[10px] bg-red-50 px-3 py-2 text-xs text-red-700">
            {{ error.message || 'Terjadi kesalahan.' }}
          </div>
        </div>

        <form class="flex gap-2 border-t border-gray-100 bg-white p-3" @submit.prevent="send">
          <label class="sr-only" for="chat-question">Pertanyaan</label>
          <input
            id="chat-question"
            v-model="q"
            autocomplete="off"
            class="h-11 min-w-0 flex-1 rounded-[10px] border border-gray-200 px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            placeholder="Tulis pertanyaan..."
          >
          <button
            v-if="!loading"
            type="submit"
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="!q.trim()"
            title="Kirim"
            aria-label="Kirim"
          >
            <Icon name="lucide:send" size="18" aria-hidden="true" />
          </button>
          <button
            v-else
            type="button"
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-600 text-white transition hover:bg-gray-700"
            title="Berhenti"
            aria-label="Berhenti"
            @click="stopGeneration"
          >
            <Icon name="lucide:square" size="16" aria-hidden="true" class="fill-current" />
          </button>
        </form>
      </section>
    </Transition>

    <button
      type="button"
      class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-600/25 transition hover:-translate-y-0.5 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
      :aria-expanded="isOpen"
      aria-label="Buka chat AI"
      title="Buka chat AI"
      @click="toggleChat"
    >
      <Icon v-if="isOpen" name="lucide:x" size="24" aria-hidden="true" />
      <Icon v-else name="lucide:message-circle" size="25" aria-hidden="true" />
    </button>
  </ClientOnly>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '#stores/auth'

type Mode = 'chat' | 'summarize' | 'draft'

const STORAGE_KEY = 'admin-ai-chat-v1'

const q = ref('')
const mode = ref<Mode>('chat')
const copiedIndex = ref<number | null>(null)
const isOpen = ref(false)
const box = ref<HTMLElement | null>(null)
const loading = ref(false)
const error = ref<any>(null)

const authStore = useAuthStore()
let abortController: AbortController | null = null

const initialHistory: any[] = []
try {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const validMessages = parsed.filter(m => m && m.role && (m.content || m.text));
      // Migrate old { text } to { content }
      const migrated = validMessages.map(m => ({
        ...m,
        content: m.content || m.text || ''
      }));
      initialHistory.push(...migrated);
    }
  }
} catch {}

if (initialHistory.length === 0) {
  initialHistory.push({ id: '1', role: 'assistant', content: 'Halo! Saya AI admin. Silakan tanya seputar dokumen dan kebutuhan LPM.' })
}

const messages = ref<any[]>(initialHistory)
const config = useRuntimeConfig()

async function scrollBottom() {
  await nextTick()
  if (box.value) box.value.scrollTop = box.value.scrollHeight
}

function toggleChat() {
  isOpen.value = !isOpen.value
  if (isOpen.value) scrollBottom()
}

function clearChat() {
  messages.value = [{ id: Date.now().toString(), role: 'assistant', content: 'Chat direset. Silakan tanya lagi.' }]
  q.value = ''
  error.value = null
  scrollBottom()
}

function stopGeneration() {
  if (abortController) {
    abortController.abort()
    abortController = null
  }
}

async function copyText(text: string, index: number) {
  try {
    await navigator.clipboard.writeText(text)
    copiedIndex.value = index
    setTimeout(() => (copiedIndex.value = null), 900)
  } catch {
    // Ignore
  }
}

async function send() {
  const text = q.value.trim()
  if (!text || loading.value) return;
  
  q.value = '';
  error.value = null;
  loading.value = true;
  
  messages.value.push({ id: Date.now().toString(), role: 'user', content: text });
  messages.value.push({ id: (Date.now() + 1).toString(), role: 'assistant', content: '' });
  
  await scrollBottom();

  abortController = new AbortController()

  try {
    const token = authStore.accessToken ? `Bearer ${authStore.accessToken}` : ''
    
    const messagesToSend = messages.value.slice(0, -1).map(m => ({
      role: m.role,
      content: m.content
    }))
    
    const res = await fetch(`${config.public.apiBaseUrl}/api/ai/chat-stream`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ mode: mode.value, messages: messagesToSend }),
      signal: abortController.signal
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

      const nearBottom = box.value ? box.value.scrollHeight - box.value.scrollTop - box.value.clientHeight < 60 : true;

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')
      
      const last = messages.value[messages.value.length - 1]
      
      for (const line of lines) {
        const textChunk = line.trim()
        if (!textChunk || !textChunk.startsWith('data:')) continue
        
        const dataStr = textChunk.replace(/^data:\s*/, '')
        if (dataStr === '[DONE]') break
        
        try {
          const parsed = JSON.parse(dataStr)
          if (parsed.type === 'text-delta') {
            if (last && last.role === 'assistant') {
              last.content += parsed.delta
            }
          } else if (parsed.type === 'error') {
            throw new Error(parsed.error || 'Server error in stream')
          }
        } catch (err) {
           // ignore json parse error for partial lines
        }
      }
      
      if (nearBottom) {
        await scrollBottom()
      }
    }
  } catch (e: any) {
    if (e.name !== 'AbortError') {
      error.value = { message: e?.message || 'Unknown error' }
      const last = messages.value[messages.value.length - 1]
      if (last && last.role === 'assistant' && !last.content) {
        last.content = 'Maaf, terjadi error saat mengambil respons dari server.'
      }
    }
  } finally {
    loading.value = false
    abortController = null
    await scrollBottom()
  }
}

function getMessageText(message: any): string {
  if (message.content) return message.content;
  if (message.parts && Array.isArray(message.parts)) {
    return message.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('');
  }
  return '';
}

onMounted(() => {
  scrollBottom()
})

watch(
  messages,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    } catch {
      // Local history is optional.
    }
  },
  { deep: true }
)
</script>

<style scoped>
.chat-panel-enter-active,
.chat-panel-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.chat-panel-enter-from,
.chat-panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
</style>
