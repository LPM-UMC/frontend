<template>
  <main class="min-h-screen bg-white">
    <div class="w-full h-screen grid md:grid-cols-2">
      <!-- LEFT -->
      <section class="relative hidden md:block">
        <img src="/img/gedung-umc.jpg" class="absolute inset-0 w-full h-full object-cover">
        <div class="absolute inset-0 bg-black/35" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />

        <div class="absolute top-8 left-8 flex items-center gap-4">
          <img src="/img/logo-umc.jpg" class="w-12 h-12 rounded-full object-cover ring-2 ring-white/40">
          <div class="text-white leading-tight">
            <p class="text-[22px] font-extrabold tracking-wide">Lembaga Penjaminan Mutu</p>
            <p class="text-[13px] font-medium text-white/85">Universitas Muhammadiyah Cirebon</p>
          </div>
        </div>

        <div class="absolute bottom-20 left-10 right-10 text-white">
          <div class="w-12 h-[3px] bg-cyan-400 mb-5" />
          <h2 class="text-[44px] leading-[1.05] font-extrabold">
            Sistem Monitoring<br>
            LPM &amp; SPI
          </h2>
        </div>

        <div class="absolute bottom-8 left-10 right-10 flex items-center justify-between">
          <p class="text-white/70 text-xs">© 2025 Universitas Muhammadiyah Cirebon</p>
          <span
            class="text-white/70 text-[10px] tracking-[0.18em] uppercase px-4 py-2 rounded-full bg-white/10 backdrop-blur">
            Secure Access
          </span>
        </div>
      </section>

      <!-- RIGHT (GOOGLE ONLY) -->
      <section class="flex items-center justify-center bg-white px-6">
        <div class="w-full max-w-[420px] relative">
          <button type="button"
            class="absolute -top-2 left-0 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 px-2 py-2 rounded-xl hover:bg-gray-50 transition"
            @click="goBack">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            Kembali
          </button>

          <div class="flex justify-center">
            <div class="w-16 h-16 rounded-2xl bg-[#eef4ff] flex items-center justify-center shadow-sm">
              <img src="/img/logo-umc.jpg" class="w-11 h-11 object-cover rounded-xl">
            </div>
          </div>

          <h1 class="mt-6 text-center text-[34px] font-extrabold text-gray-900">Selamat Datang</h1>
          <p class="mt-2 text-center text-sm text-gray-500">Silakan login menggunakan akun Google</p>

          <div v-if="errorMsg" class="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ errorMsg }}
          </div>

          <div class="mt-8">
            <button
              class="w-full h-12 rounded-2xl border border-gray-200 bg-white flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              type="button" :disabled="loading" @click="authStore.login()">
              <img src="https://developers.google.com/identity/images/g-logo.png" class="w-5 h-5">
              <span>{{ loading ? 'Mengalihkan...' : 'Masuk dengan Google' }}</span>
            </button>

            <p class="mt-6 text-center text-xs text-gray-400">
              Gunakan email institusi <span class="font-semibold">@umc.ac.id</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from "#stores/auth";

definePageMeta({ layout: false })

const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')
const authStore = useAuthStore();

const goBack = () => {
  if (import.meta.client && window.history.length > 1) router.back()
  else router.push('/')
}
</script>
