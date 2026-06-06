<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from '#imports'
import { useI18n } from 'vue-i18n'
import { useAspekApi } from '#features/modul/services/aspek.api'

const route = useRoute()
const { t, locale } = useI18n()
const aspekApi = useAspekApi()

const isRTL = computed(() => locale.value.startsWith('ar'))

const modulId = computed(() => {
  const id = route.params.modul_id
  return Array.isArray(id) ? id[0] : id
})

const aspekId = computed(() => {
  const id = route.params.aspek_id
  return Array.isArray(id) ? id[0] : id
})

const pageLoading = ref(true)
const isSubmitting = ref(false)
const submitError = ref('')

const form = reactive({
  name: '',
  description: '',
})

const formErrors = reactive({
  name: '',
  description: '',
})

async function loadDetail() {
  if (!modulId.value || !aspekId.value) return
  pageLoading.value = true
  try {
    const detail = await aspekApi.getAspek(modulId.value, aspekId.value)
    if (detail) {
      form.name = detail.name
      form.description = detail.description || ''
    }
  } catch(e) {
    console.error(e)
  } finally {
    pageLoading.value = false
  }
}

function validateForm() {
  Object.keys(formErrors).forEach(k => {
    formErrors[k as keyof typeof formErrors] = ''
  })
  
  if (!form.name.trim()) {
    formErrors.name = 'Nama aspek wajib diisi.'
  } else if (form.name.length > 100) {
    formErrors.name = 'Nama aspek maksimal 100 karakter.'
  }

  if (!form.description.trim()) {
    formErrors.description = 'Deskripsi aspek wajib diisi.'
  } else if (form.description.length > 500) {
    formErrors.description = 'Deskripsi aspek maksimal 500 karakter.'
  }

  return !formErrors.name && !formErrors.description
}

const isFormValid = computed(() => {
  return form.name.trim().length > 0 && form.description.trim().length > 0
})

async function handleSubmit() {
  if (!validateForm()) return
  isSubmitting.value = true
  submitError.value = ''
  try {
    await aspekApi.updateAspek(modulId.value, aspekId.value, {
      name: form.name,
      description: form.description
    })
    const basePath = useRoute().path.replace(/\/edit$/, '')
    window.location.href = basePath
  } catch (error: any) {
    submitError.value = error.message || 'Gagal mengubah aspek'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadDetail()
})
</script>

<template>
  <div v-if="pageLoading" class="p-8 text-center text-[1.1rem] text-slate-500">Memuat formulir...</div>
  <div v-else>
    <div class="h-[56px] w-full sm:h-[64px] md:h-[70px]">
      <div class="h-full w-full bg-repeat-x bg-top" style="background-image: url('/img/batik.png'); background-size: auto clamp(72px, 8vw, 90px);" />
    </div>

    <section class="mx-auto w-full max-w-[1880px] bg-[#f4f4f4] px-3 pb-8 pt-5 sm:px-5 sm:pt-7 md:px-6 md:pt-8 lg:px-8 xl:px-10 2xl:px-12">
      <div class="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
        <NuxtLink to="/dashboard/manajemen-modul" class="inline-flex items-center gap-1.5 transition hover:text-[#e1121b]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6" />
          </svg>
          <span>{{ $t('manajemenModul.judul') }}</span>
        </NuxtLink>
        <span>/</span>
        <NuxtLink :to="`/dashboard/manajemen-modul/${modulId}`" class="transition hover:text-[#e1121b]">Modul</NuxtLink>
        <span>/</span>
        <NuxtLink :to="`/dashboard/manajemen-modul/${modulId}/aspek/${aspekId}`" class="transition hover:text-[#e1121b]">{{ form.name }}</NuxtLink>
        <span>/</span>
        <span class="font-semibold text-[#e1121b]">Edit Aspek</span>
      </div>

      <section :dir="isRTL ? 'rtl' : 'ltr'" class="mt-4 rounded-xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 shadow-[0_1px_4px_rgba(15,23,42,0.08)] sm:px-5 sm:py-6">
        <h1 class="text-xl font-semibold text-[#11141b] sm:text-2xl lg:text-3xl">Edit Aspek</h1>
        <p class="mt-2 text-sm leading-relaxed text-[#556173] sm:text-base">Gunakan halaman ini untuk memperbarui aspek evaluasi.</p>
      </section>

      <section class="mt-5 rounded-xl border border-[#dadde3] bg-[#f4f4f5] px-3 py-4 shadow-[0_1px_4px_rgba(15,23,42,0.08)] sm:px-5 sm:py-6" :dir="isRTL ? 'rtl' : 'ltr'">
        <form class="mx-auto mt-4 w-full max-w-4xl rounded-2xl border border-dashed border-[#d7dbe4] bg-[#f8f8f8] px-4 py-5 sm:px-6 sm:py-7" @submit.prevent="handleSubmit">
          <h3 class="text-center text-lg font-semibold text-[#151922] sm:text-xl md:text-2xl">Form Aspek</h3>
          
          <div v-if="submitError" class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{{ submitError }}</div>

          <div class="mt-5 space-y-4">
            <!-- Nama -->
            <div>
              <label class="text-sm font-semibold text-[#3f4b5f]">
                Nama Aspek
                <span class="text-[#e1121b]">*</span>
              </label>
              <input v-model="form.name" type="text" maxlength="100" placeholder="Masukkan nama aspek" class="mt-1.5 h-11 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3">
              <p class="mt-1 flex justify-between text-xs text-[#98a1b1]">
                <span>{{ form.name.length }}/100</span>
              </p>
              <p v-if="formErrors.name" class="mt-1 text-xs text-[#e1121b]">{{ formErrors.name }}</p>
            </div>

            <!-- Deskripsi -->
            <div>
              <label class="text-sm font-semibold text-[#3f4b5f]">
                Deskripsi
                <span class="text-[#e1121b]">*</span>
              </label>
              <textarea v-model="form.description" maxlength="500" rows="4" placeholder="Masukkan deskripsi aspek" class="mt-1.5 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3 py-2" />
              <p class="mt-1 flex justify-between text-xs text-[#98a1b1]">
                <span>{{ form.description.length }}/500</span>
              </p>
              <p v-if="formErrors.description" class="mt-1 text-xs text-[#e1121b]">{{ formErrors.description }}</p>
            </div>
          </div>

          <div class="mt-6 flex justify-center gap-3">
            <NuxtLink :to="`/dashboard/manajemen-modul/${modulId}/aspek/${aspekId}`" class="inline-flex h-10 min-w-28 items-center justify-center rounded-xl border border-[#d7dbe4] bg-[#f3f4f6] px-5 text-sm font-semibold text-[#1f2634] transition sm:h-11 sm:min-w-32 sm:px-6 sm:text-base hover:bg-[#e0e0e0] cursor-pointer">
              Batal
            </NuxtLink>
            <button type="submit" :disabled="!isFormValid || isSubmitting" :class="[
              'inline-flex h-10 min-w-28 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition sm:h-11 sm:min-w-32 sm:px-6 sm:text-base',
              isFormValid && !isSubmitting ? 'bg-[#e1121b] hover:bg-[#cc0f17] cursor-pointer' : 'bg-gray-400 cursor-not-allowed opacity-60'
            ]">
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </section>
    </section>
  </div>
</template>
