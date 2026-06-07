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
            <p class="text-[13px] font-medium text-white/85">{{ $t('basic.namaKampus') || 'Universitas Muhammadiyah Cirebon' }}</p>
          </div>
        </div>

        <div class="absolute bottom-20 left-10 right-10 text-white">
          <div class="w-40 h-1 bg-white mb-5" />
          <h2 class="text-4xl leading-[1.05] font-extrabold">
            {{ $t('basic.namaAplikasi') || 'Lembaga Penjaminan Mutu' }}<br>
          </h2>
        </div>

        <div class="absolute bottom-8 left-10 right-10 flex items-center justify-between">
          <p class="text-white/70 text-sm">© 2026 {{ $t('basic.namaKampus') || 'Universitas Muhammadiyah Cirebon' }}</p>
        </div>
      </section>

      <!-- RIGHT -->
      <section class="relative flex items-center justify-center bg-white px-6">

        <NuxtLink :to="localePath('/')" class="absolute top-6 left-4">
          <button
            class="cursor-pointer transition absolute -top-2 left-0 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 px-2 py-2 rounded-xl hover:bg-gray-50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            {{ $t('login.kembali') || 'Kembali' }}
          </button>
        </NuxtLink>

        <div class="w-full max-w-105 relative">

          <div class="flex justify-center">
            <div class="w-16 h-16 rounded-2xl bg-[#eef4ff] flex items-center justify-center shadow-sm">
              <img src="/img/logo-umc.jpg" class="w-14 h-14 rounded-full object-cover ring ring-white/40">
            </div>
          </div>

          <h1 class="mt-6 text-center text-[34px] font-extrabold text-gray-900">
            {{ $t('login.welcome') || 'Selamat Datang' }}
          </h1>

          <p class="mt-2 text-center text-sm text-gray-500">
            {{ $t('login.silahkanMasuk') || 'Silakan masuk untuk melanjutkan' }}
          </p>

          <form @submit.prevent="handleLogin" class="mt-8 space-y-4">
            <button
              class="w-full h-12 rounded-2xl border border-gray-200 bg-white flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              type="button"
              @click="handleGoogleLogin"
              :disabled="loading">
              <img src="https://developers.google.com/identity/images/g-logo.png" class="w-5 h-5">
              <span>{{ loading ? ($t('login.mengalihkan') || 'Mengalihkan...') : ($t('login.masukGoogle') || 'Masuk dengan Google') }}</span>
            </button>

            <!-- Separator -->
            <div class="relative py-2 flex items-center justify-center">
              <div class="absolute inset-x-0 h-px bg-gray-100"></div>
              <span class="relative px-3 bg-white text-xs text-gray-400 font-semibold uppercase tracking-wider">{{ $t('login.atau') || 'atau' }}</span>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">{{ $t('login.email') || 'Email' }}</label>
              <div class="relative">
                <input
                  type="email"
                  v-model="form.email"
                  :disabled="loading"
                  autocomplete="email"
                  maxlength="255"
                  placeholder="nama@umc.ac.id"
                  class="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
              <p v-if="validationErrors.email" class="text-red-500 text-xs mt-1">{{ validationErrors.email }}</p>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">{{ $t('login.password') || 'Password' }}</label>
              <div class="relative">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="form.password"
                  :disabled="loading"
                  autocomplete="current-password"
                  maxlength="255"
                  placeholder="••••••••"
                  class="w-full h-12 px-4 pr-12 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.5 3.5m10.9-1.9l-3.5 3.5m-3.5 3.5L19 19" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <p v-if="validationErrors.password" class="text-red-500 text-xs mt-1">{{ validationErrors.password }}</p>
            </div>

            <!-- Remember Me -->
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  v-model="form.rememberMe"
                  :disabled="loading"
                  class="w-4.5 h-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 accent-blue-600"
                />
                <span class="text-xs font-semibold text-gray-500">{{ $t('login.rememberMe') || 'Ingat Saya' }}</span>
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full h-12 rounded-2xl bg-red-600 text-white font-bold text-sm shadow-md hover:bg-red-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ loading ? ($t('login.mengalihkan') || 'Memproses...') : ($t('login.masuk') || 'Masuk') }}</span>
            </button>
          </form>

        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useAuthStore } from '#stores/auth'
import { navigateTo } from 'nuxt/app'
import { useI18n } from 'vue-i18n'
import { useToast, useRoute } from '#imports'
import { loginValidation } from '#validations/auth.validation'

definePageMeta({
  layout: false,
  middleware: ['guest']
})

const localePath = useLocalePath()
const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const authStore = useAuthStore()
const loading = ref(false)
const showPassword = ref(false)

onMounted(() => {
  if (route.query.error === 'user-not-found') {
    toast.add({
      title: t('login.masuk') || 'Masuk',
      description: t('toast.auth.invalidCredentials') || 'Akun tidak terdaftar atau kombinasi email/password salah.',
      color: 'error'
    })
  } else if (route.query.error) {
    toast.add({
      title: t('login.masuk') || 'Masuk',
      description: t('toast.common.unexpectedError') || 'Terjadi kendala saat memproses permintaan Anda. Silakan coba beberapa saat lagi.',
      color: 'error'
    })
  }
})

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const validationErrors = reactive({
  email: '',
  password: ''
})

function validateField(field: 'email' | 'password') {
  validationErrors[field] = ''
  const schema = loginValidation(t as any)
  const result = schema.safeParse(form)
  if (result.success) return
  
  const issue = result.error.issues.find(issue => issue.path[0] === field)
  if (issue) validationErrors[field] = issue.message
}

watch(() => form.email, () => validateField('email'))
watch(() => form.password, () => validateField('password'))

async function handleLogin() {
  if (loading.value) return
  
  validationErrors.email = ''
  validationErrors.password = ''

  const schema = loginValidation(t as any)
  const result = schema.safeParse(form)
  
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    if (errors.email) validationErrors.email = errors.email[0] || ''
    if (errors.password) validationErrors.password = errors.password[0] || ''
    return
  }

  loading.value = true

  try {
    await authStore.login(form)
    toast.add({
      title: t('login.masuk') || 'Masuk',
      description: t('toast.auth.loginSuccess') || 'Selamat datang kembali. Anda berhasil masuk ke sistem.',
      color: 'success'
    })
    await navigateTo('/dashboard')
  } catch (error: any) {
    console.log('LOGIN ERROR', error)
    console.log('LOGIN ERROR DATA', error.response?._data)
    console.log('LOGIN ERROR CODE', error.response?._data?.code)

    const beError = error.response?._data
    let errorMsg = ''
    
    const mapErrorCode = (code: string) => {
        switch(code) {
            case 'email-required':
                return { field: 'email', msg: t('login.emailRequired') || 'Email wajib diisi' }
            case 'invalid-email':
                return { field: 'email', msg: t('login.invalidEmail') || 'Format email tidak valid' }
            case 'password-required':
                return { field: 'password', msg: t('login.passwordRequired') || 'Password wajib diisi' }
            case 'user-not-found':
            case 'invalid-password':
            case 'account-disabled':
            case 'account-locked':
            case 'unauthorized':
                return { field: 'general', msg: t('toast.auth.invalidCredentials') || 'Akun tidak terdaftar atau kombinasi email/password salah.' }
            default:
                return { field: 'general', msg: t('toast.common.unexpectedError') || 'Terjadi kendala saat memproses permintaan Anda. Silakan coba beberapa saat lagi.' }
        }
    }

    if (beError && beError.errors && beError.errors.fieldErrors) {
        // Zod Validation Error format from backend
        if (beError.errors.fieldErrors.email) {
            const res = mapErrorCode(beError.errors.fieldErrors.email[0] || '')
            validationErrors.email = res.msg
        }
        if (beError.errors.fieldErrors.password) {
            const res = mapErrorCode(beError.errors.fieldErrors.password[0] || '')
            validationErrors.password = res.msg
        }
    } else if (beError && beError.code) {
        // HTTPException format from backend
        const res = mapErrorCode(beError.code)
        if (res.field === 'email') validationErrors.email = res.msg
        else if (res.field === 'password') validationErrors.password = res.msg
        else errorMsg = res.msg
    } else if (beError && typeof beError.message === 'string') {
        const res = mapErrorCode(beError.message)
        errorMsg = res.msg
    } else {
        errorMsg = t('toast.common.unexpectedError') || 'Terjadi kendala saat memproses permintaan Anda. Silakan coba beberapa saat lagi.'
    }

    if (errorMsg) {
      toast.add({
        title: t('login.masuk') || 'Masuk',
        description: errorMsg,
        color: 'error'
      })
    }
  } finally {
    loading.value = false
  }
}

function handleGoogleLogin() {
  loading.value = true
  authStore.loginGoogle()
}
</script>
