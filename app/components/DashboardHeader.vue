<script setup lang="ts">
defineProps<{
  avatar: string
}>()

defineEmits<{
  (e: 'open-profile'): void
}>()

const currentLang = ref<'ENG' | 'ID'>('ENG')
const showLangMenu = ref(false)

const changeLanguage = (lang: 'ENG' | 'ID') => {
  currentLang.value = lang
  showLangMenu.value = false
}
</script>

<template>
  <div class="sticky top-0 z-40 bg-[#efefef]">
    <header class="flex flex-col gap-4 bg-[#f5f5f5] px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
      <div class="flex items-center gap-4">
        <img src="/images/logo-umc.png" alt="Logo UMC" class="h-14 w-14 rounded-full object-cover md:h-16 md:w-16">

        <div class="text-sm font-bold leading-6 text-[#161616] md:text-[16px]">
          <p>SI IMUT</p>
        </div>
      </div>

      <div class="flex items-center justify-end gap-4 md:gap-6">
        <button type="button" class="rounded-full p-2 text-slate-600 transition hover:bg-white/80">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M21 12.79A9 9 0 1111.21 3c0 .34.02.67.06 1A7 7 0 0020 12c.33 0 .66-.02 1-.06z" />
          </svg>
        </button>

        <div class="relative">
          <button type="button"
            class="flex items-center gap-2 rounded-full px-2 py-2 text-sm font-medium text-slate-700 transition hover:bg-white/80 md:text-base"
            @click="showLangMenu = !showLangMenu">
            <span>{{ currentLang }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </button>

          <div v-if="showLangMenu"
            class="absolute right-0 top-12 min-w-27.5 rounded-2xl bg-[#f7f7f7] p-3 shadow-[0_14px_40px_rgba(0,0,0,0.14)]">
            <button class="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
              @click="changeLanguage('ENG')">
              ENG
            </button>
            <button class="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
              @click="changeLanguage('ID')">
              ID
            </button>
          </div>
        </div>

        <button type="button" class="relative h-11 w-11 rounded-full" @click="$emit('open-profile')">
          <img :src="avatar" alt="Profile" class="h-11 w-11 rounded-full object-cover">
          <span class="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
        </button>
      </div>
    </header>

    <div class="h-58 w-full bg-cover bg-center shadow-[inset_0_-10px_18px_rgba(255,255,255,0.28)]"
      style="background-image: url('/images/ornament-red.png');" />
  </div>
</template>
