<script setup lang="ts">
import { useAuthStore } from "#stores/auth";

definePageMeta({
  layout: false,
  middleware: 'guest',
});

const route = useRoute()
const authStore = useAuthStore()
const localePath = useLocalePath()

const loading = ref(false)
const errorMsg = ref('')
const toast = useToast()

const err = route.query.error;

if (err === "user-not-found") {
  toast.add({
    title: "Akses Ditolak",
    description: "User tidak ditemukan atau tidak memiliki akses",
    color: "error",
  });
}

// 🔹 Ambil error dari query (callback gagal, dll)
onMounted(() => {
  if (route.query.error === "callback") {
    errorMsg.value = "Terjadi kesalahan saat login Google"
  }

  if (route.query.error === "not-registered") {
    errorMsg.value = "Akun belum terdaftar"
  }
})

// 🔹 Trigger login
const handleLogin = () => {
  loading.value = true
  authStore.loginWithGoogle()
}
</script>

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
            <p class="text-[22px] font-extrabold tracking-wide">SI IMUT</p>
            <p class="text-[13px] font-medium text-white/85">{{ $t('univ') }}</p>
          </div>
        </div>

        <div class="absolute bottom-20 left-10 right-10 text-white">
          <div class="w-12 h-0.75 bg-cyan-400 mb-5" />
          <h2 class="text-[44px] leading-[1.05] font-extrabold">
            {{ $t('sistem_monitoring') }}<br>
            LPM &amp; SPI UMC
          </h2>
        </div>

        <div class="absolute bottom-8 left-10 right-10 flex items-center justify-between">
          <p class="text-white/70 text-xs">© 2026 {{ $t('univ') }}</p>
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
            {{ $t('kembali') }}
          </button>
        </NuxtLink>

        <div class="w-full max-w-105 relative">

          <div class="flex justify-center">
            <div class="w-16 h-16 rounded-2xl bg-[#eef4ff] flex items-center justify-center shadow-sm">
              <img src="/img/logo-umc.jpg" class="w-14 h-14 rounded-full object-cover ring ring-white/40">
            </div>
          </div>

          <h1 class="mt-6 text-center text-[34px] font-extrabold text-gray-900">{{ $t('selamat_datang') }}</h1>
          <p class="mt-2 text-center text-sm text-gray-500">{{ $t('silahkan_login') }}</p>

          <div class="mt-8">
            <button
              class="w-full h-12 rounded-2xl border border-gray-200 bg-white flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              type="button" :disabled="loading" @click="handleLogin">
              <img src="https://developers.google.com/identity/images/g-logo.png" class="w-5 h-5">
              <span>{{ loading ? $t('mengalihkan') : $t('masuk_dengan_google') }}</span>
            </button>

            <p class="mt-6 text-center text-xs text-gray-400">
              {{ $t('gunakan_email') }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
