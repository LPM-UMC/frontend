<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from '#imports'
import { useI18n } from 'vue-i18n'
import { useModulApi } from '#features/modul/services/modul.api'
import { createModulValidation } from '#validations/modul.validation'
import { useLingkup } from '#features/manajemen-lingkup/composables/useLingkup'

const route = useRoute()
const { t, locale } = useI18n()
const modulApi = useModulApi()
const { rows: lingkupOptions, fetchLingkup } = useLingkup()

const isRTL = computed(() => locale.value.startsWith('ar'))

const modulId = computed(() => {
  const id = route.params.modul_id
  return Array.isArray(id) ? id[0] : id
})

const pageLoading = ref(true)
const isSubmitting = ref(false)
const submitError = ref('')

const form = reactive({
  lingkup_id: '',
  nama: '',
  deskripsi: '',
})

const formErrors = reactive({
  lingkup_id: '',
  nama: '',
  deskripsi: '',
})

async function loadDetail() {
  if (!modulId.value) return
  pageLoading.value = true
  try {
    const modul = await modulApi.getModul(modulId.value)
    if (modul) {
      form.nama = modul.name
      form.deskripsi = modul.description || ''
      // We don't have lingkup_id natively mapped in dummy backend responses to ModulRecord yet,
      // but if it exists, populate it here.
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
  const schema = createModulValidation(t as any)
  const result = schema.safeParse(form)
  if (!result.success) {
    result.error.issues.forEach(issue => {
      const field = issue.path[0] as keyof typeof formErrors
      if (field in formErrors) {
        formErrors[field] = issue.message
      }
    })
    return false
  }
  return true
}

const isFormValid = computed(() => {
  return form.nama.trim().length > 0 && form.deskripsi.trim().length > 0
})

async function handleSubmit() {
  if (!validateForm()) return
  isSubmitting.value = true
  submitError.value = ''
  try {
    // API Expects { name, description } for update
    await modulApi.updateModul(modulId.value, {
      name: form.nama,
      description: form.deskripsi
    })
    const localePath = useRoute().path.replace(/\/edit$/, '')
    // Redirect back to detail page
    window.location.href = localePath
  } catch (error: any) {
    submitError.value = error.message || 'Gagal menyimpan perubahan modul'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchLingkup()
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
        <NuxtLink :to="`/dashboard/manajemen-modul/${modulId}`" class="transition hover:text-[#e1121b]">{{ form.nama }}</NuxtLink>
        <span>/</span>
        <span class="font-semibold text-[#e1121b]">Edit</span>
      </div>

      <section :dir="isRTL ? 'rtl' : 'ltr'" class="mt-4 rounded-xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 shadow-[0_1px_4px_rgba(15,23,42,0.08)] sm:px-5 sm:py-6">
        <h1 class="text-xl font-semibold text-[#11141b] sm:text-2xl lg:text-3xl">Edit Modul Evaluasi</h1>
        <p class="mt-2 text-sm leading-relaxed text-[#556173] sm:text-base">Gunakan halaman ini untuk memperbarui informasi modul evaluasi.</p>
      </section>

      <section class="mt-5 rounded-xl border border-[#dadde3] bg-[#f4f4f5] px-3 py-4 shadow-[0_1px_4px_rgba(15,23,42,0.08)] sm:px-5 sm:py-6" :dir="isRTL ? 'rtl' : 'ltr'">
        <form class="mx-auto mt-4 w-full max-w-4xl rounded-2xl border border-dashed border-[#d7dbe4] bg-[#f8f8f8] px-4 py-5 sm:px-6 sm:py-7" @submit.prevent="handleSubmit">
          <h3 class="text-center text-lg font-semibold text-[#151922] sm:text-xl md:text-2xl">Form Edit Modul</h3>
          
          <div v-if="submitError" class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{{ submitError }}</div>

          <div class="mt-5 space-y-4">
            <!-- Nama -->
            <div>
              <label class="text-sm font-semibold text-[#3f4b5f]">
                {{ $t('manajemenModul.model.nama') }}
                <span class="text-[#e1121b]">*</span>
              </label>
              <input v-model="form.nama" type="text" maxlength="50" :placeholder="$t('manajemenModul.placeholder.nama')" class="mt-1.5 h-11 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3">
              <p class="mt-1 flex justify-between text-xs text-[#98a1b1]">
                <span>{{ form.nama.length }}/50</span>
              </p>
              <p v-if="formErrors.nama" class="mt-1 text-xs text-[#e1121b]">{{ formErrors.nama }}</p>
            </div>

            <!-- Deskripsi -->
            <div>
              <label class="text-sm font-semibold text-[#3f4b5f]">
                {{ $t('manajemenModul.model.deskripsi') }}
                <span class="text-[#e1121b]">*</span>
              </label>
              <textarea v-model="form.deskripsi" maxlength="500" rows="4" :placeholder="$t('manajemenModul.placeholder.deskripsi')" class="mt-1.5 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3 py-2" />
              <p class="mt-1 flex justify-between text-xs text-[#98a1b1]">
                <span>{{ form.deskripsi.length }}/500</span>
              </p>
              <p v-if="formErrors.deskripsi" class="mt-1 text-xs text-[#e1121b]">{{ formErrors.deskripsi }}</p>
            </div>

            <!-- LINGKUP EVALUASI -->
            <div>
              <label class="text-sm font-semibold text-[#3f4b5f]">
                {{ $t('manajemenModul.model.lingkup') }}
                <span class="text-[#e1121b]">*</span>
              </label>
              <label class="relative mt-2 block">
                <select v-model="form.lingkup_id" class="h-12 w-full appearance-none rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 pr-12 text-[1rem] text-[#2b3340] outline-none">
                  <option value="" disabled>{{ $t('manajemenModul.create.pilihLingkup') }}</option>
                  <option v-for="option in lingkupOptions" :key="option.id" :value="option.id">{{ option.nama }}</option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                </svg>
              </label>
              <p v-if="formErrors.lingkup_id" class="mt-1 text-xs text-[#e1121b]">{{ formErrors.lingkup_id }}</p>
            </div>
          </div>

          <div class="mt-6 flex justify-center gap-3">
            <NuxtLink :to="`/dashboard/manajemen-modul/${modulId}`" class="inline-flex h-10 min-w-28 items-center justify-center rounded-xl border border-[#d7dbe4] bg-[#f3f4f6] px-5 text-sm font-semibold text-[#1f2634] transition sm:h-11 sm:min-w-32 sm:px-6 sm:text-base hover:bg-[#e0e0e0] cursor-pointer">
              {{ $t('util.batal') }}
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
