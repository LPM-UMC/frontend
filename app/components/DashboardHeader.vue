<template>
  <div class="sticky top-0 z-40 bg-[#efefef] shadow-sm">
    <header
      dir="ltr"
      class="mx-auto flex w-full flex-wrap items-center justify-between gap-3 bg-[#f5f5f5] px-4 py-3 sm:px-5 md:px-6 lg:px-8"
    >
      <!-- Logo + Nama -->
      <NuxtLink
        :to="localePath('/')"
        class="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90"
      >
        <div
          class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm sm:h-13 sm:w-13 md:h-15 md:w-15"
        >
          <img
            src="/images/logo-umc.png"
            :alt="$t('basic.namaKampus')"
            class="h-full w-full object-cover"
          >
        </div>

        <div class="min-w-0 leading-tight">
          <p
            class="truncate text-sm font-extrabold tracking-wide text-red-700 sm:text-base md:text-lg"
          >
            SI-IMOET
          </p>

          <p
            class="hidden truncate text-[11px] font-semibold text-gray-500 sm:block md:text-xs"
          >
            {{ $t('basic.namaKampus') }}
          </p>
        </div>
      </NuxtLink>

      <!-- Right Section -->
      <div
        class="flex flex-wrap items-center justify-end gap-2 sm:gap-3 md:gap-4"
      >
        <!-- Locale -->
        <ULocaleSelect
          :model-value="locale"
          :locales="locales"
          class="min-w-fit"
          @update:model-value="setLocale($event as 'id' | 'en' | 'ar' | 'ja')"
        />

        <!-- Profile -->
        <button
          type="button"
          class="relative shrink-0 rounded-full transition hover:scale-[1.03] cursor-pointer"
          @click="$emit('open-profile')"
        >
          <img
            :src="avatar"
            :alt="$t('navigasi.profil')"
            class="h-10 w-10 rounded-full border border-gray-200 object-cover shadow-sm sm:h-11 sm:w-11"
          >

          <span
            class="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500"
          />
        </button>
      </div>
    </header>

    <!-- Ornament -->
    <div
      class="h-10 w-full bg-cover bg-center sm:h-12 md:h-14 shadow-[inset_0_-10px_18px_rgba(255,255,255,0.28)]"
      style="background-image:url('/images/ornament-red.png')"
    />
  </div>
</template>

<script setup lang="ts">
import { en, id, ar, ja } from '@nuxt/ui/locale'
import { useI18n } from 'vue-i18n'

defineProps<{
  avatar: string
}>()

defineEmits<{
  (e: 'open-profile'): void
}>()

const { locale, setLocale } = useI18n()
const localePath = useLocalePath()

const locales = [
  id,
  en,
  ar,
  ja,
]
</script>
