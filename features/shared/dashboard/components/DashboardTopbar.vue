<script setup lang="ts">
import type { DashboardUser, LocaleOption } from '../types/dashboard'

interface Props {
  user: DashboardUser
  currentLocale: 'id' | 'en'
  locales: LocaleOption[]
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'open-profile'): void
  (e: 'change-locale', value: 'id' | 'en'): void
}>()

const isLocaleOpen = ref(false)

function handleSelectLocale(value: 'id' | 'en') {
  emit('change-locale', value)
  isLocaleOpen.value = false
}

function handleClickOutside() {
  isLocaleOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header
    id="dashboard-topbar"
    class="flex flex-col gap-4 bg-[#f3f3f3] px-4 py-4 md:flex-row md:items-center md:justify-between md:px-7"
  >
    <!-- Logo & Institution Name -->
    <div class="flex items-center gap-3">
      <div
        class="shrink-0 overflow-hidden rounded-full"
        style="width: 70px; height: 70px; min-width: 70px; min-height: 70px;"
      >
        <img
          src="/img/logo-umc.jpg"
          alt="Logo UMC"
          style="width: 70px; height: 70px; object-fit: cover; display: block;"
        />
      </div>

      <div class="text-[14px] font-bold leading-[1.25] text-[#151515]">
        <p>Lembaga Penjaminan Mutu</p>
        <p>dan Satuan Pengawas Internal</p>
        <p>Universitas Muhammadiyah Cirebon</p>
      </div>
    </div>

    <!-- Right Actions -->
    <div class="flex items-center gap-3 self-end md:self-auto">
      <!-- Dark mode toggle (placeholder) -->
      <button
        id="btn-theme-toggle"
        type="button"
        aria-label="Theme toggle"
        class="grid h-9 w-9 place-items-center rounded-full text-slate-600 transition-colors duration-200 hover:bg-slate-200 hover:text-slate-900"
      >
        <svg viewBox="0 0 24 24" class="h-5 w-5">
          <path
            d="M20 15.5A8.5 8.5 0 1 1 12.5 4a7 7 0 1 0 7.5 11.5Z"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
          />
        </svg>
      </button>

      <!-- Language Switcher -->
      <div class="relative" @click.stop>
        <button
          id="btn-locale-toggle"
          type="button"
          class="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-200"
          @click="isLocaleOpen = !isLocaleOpen"
        >
          <span>{{ currentLocale === 'en' ? 'ENG' : 'ID' }}</span>
          <svg
            viewBox="0 0 24 24"
            class="h-4 w-4 transition-transform duration-200"
            :class="{ 'rotate-180': isLocaleOpen }"
          >
            <path
              d="M7 10l5 5 5-5"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
            />
          </svg>
        </button>

        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-if="isLocaleOpen"
            class="absolute right-0 top-[calc(100%+10px)] z-20 grid w-28 gap-1 rounded-2xl bg-white p-2 shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
          >
            <button
              v-for="locale in locales"
              :key="locale.code"
              type="button"
              class="rounded-xl px-3 py-2 text-left text-sm text-slate-900 transition-colors duration-150 hover:bg-slate-100"
              @click="handleSelectLocale(locale.code)"
            >
              {{ locale.label }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- Profile Avatar -->
      <button
        id="btn-open-profile"
        type="button"
        class="relative shrink-0 rounded-full ring-2 ring-transparent transition-all duration-200 hover:ring-red-400 hover:ring-offset-2"
        style="width: 44px; height: 44px;"
        @click="emit('open-profile')"
      >
        <img
          :src="user.avatar"
          :alt="user.name"
          class="rounded-full"
          style="width: 44px; height: 44px; object-fit: cover; display: block;"
        />
        <span
          v-if="user.isOnline"
          class="absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white bg-green-500"
          style="width: 12px; height: 12px;"
        />
      </button>
    </div>
  </header>
</template>