<template>
  <main class="min-h-screen bg-white">
    <div class="w-full h-screen grid md:grid-cols-2">
      <!-- LEFT -->
      <section class="relative hidden md:block">
        <img src="/img/gedung-umc.jpg" class="absolute inset-0 w-full h-full object-cover">
        <div class="absolute inset-0 bg-black/35" />
        <div class="absolute inset-0 bg-linier-to-t from-black/55 via-black/10 to-black/20" />

        <div class="absolute top-8 left-8 flex items-center gap-4">
          <img src="/img/logo-umc.jpg" class="w-12 h-12 rounded-full object-cover ring-2 ring-white/40">
          <div class="text-white leading-tight">
            <p class="text-[22px] font-extrabold tracking-wide">SI-IMOET</p>
            <p class="text-[13px] font-medium text-white/85">{{ $t('basic.namaKampus') }}</p>
          </div>
        </div>

        <div class="absolute bottom-20 left-10 right-10 text-white">
          <div class="w-40 h-1 bg-white mb-5" />
          <h2 class="text-4xl leading-[1.05] font-extrabold">
            {{ $t('basic.namaAplikasi') }}<br>
          </h2>
        </div>

        <div class="absolute bottom-8 left-10 right-10 flex items-center justify-between">
          <p class="text-white/70 text-sm">© 2026 {{ $t('basic.namaKampus') }}</p>
        </div>
      </section>

      <!-- RIGHT (GOOGLE ONLY) -->
      <section class="relative flex items-center justify-center bg-white px-6">

        <NuxtLink :to="localePath('/')" class="absolute top-6 left-4">
          <button
            class="cursor-pointer transition absolute -top-2 left-0 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 px-2 py-2 rounded-xl hover:bg-gray-50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            {{ $t('login.kembali') }}
          </button>
        </NuxtLink>

        <div class="w-full max-w-105 relative">

          <div class="flex justify-center">
            <div class="w-16 h-16 rounded-2xl bg-[#eef4ff] flex items-center justify-center shadow-sm">
              <img src="/img/logo-umc.jpg" class="w-14 h-14 rounded-full object-cover ring ring-white/40">
            </div>
          </div>

          <h1 class="mt-6 text-center text-[34px] font-extrabold text-gray-900">{{ $t('login.welcome') }}</h1>
          <p class="mt-2 text-center text-sm text-gray-500">{{ $t('login.silahkanMasuk') }}</p>

          <div class="mt-8">
            <button
              class="w-full h-12 rounded-2xl border border-gray-200 bg-white flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              type="button" :disabled="loading" @click="handleLogin">
              <img src="https://developers.google.com/identity/images/g-logo.png" class="w-5 h-5">
              <span>{{ loading ? $t('login.mengalihkan') : $t('login.masukGoogle') }}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '#stores/auth'

definePageMeta({ layout: false, middleware: 'guest' })

const localePath = useLocalePath()
const authStore = useAuthStore()
const loading = ref(false)

const handleLogin = () => {
  loading.value = true
  authStore.loginWithGoogle()
}
</script>
