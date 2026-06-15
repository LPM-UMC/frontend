<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useLocalePath, useRuntimeConfig } from '#imports'
import { useI18n } from 'vue-i18n'
import { useAspekStore } from '../../../app/stores/aspek'
import { useModulStore } from '../../../app/stores/modul'
import { useAuthStore } from '../../../app/stores/auth'
import type { ObjekResponse } from '#types/objek-evaluasi'
import type { IndikatorResponse } from '#types/indikator-evaluasi'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl as string || 'http://localhost:3001'
const aspekStore = useAspekStore()
const modulStore = useModulStore()
const authStore = useAuthStore()

const isRTL = computed(() => locale.value.startsWith('ar'))

const modulId = computed(() => {
  const id = route.params.modul_id
  return Array.isArray(id) ? id[0] : id
})

const modulName = ref('')
const lingkupId = ref('')

const breadcrumbItems = computed(() => [
  {
    label: t('navigasi.dasbor'),
    to: '/dashboard',
  },
  {
    label: t('manajemenModul.judul'),
    to: '/dashboard/manajemen-modul',
  },
  {
    label: modulName.value || 'Modul',
    to: `/dashboard/manajemen-modul/${modulId.value}`,
  },
  {
    label: t('manajemenAspek.buatAspek'),
    active: true,
  },
])

const isSubmitting = ref(false)
const submitError = ref('')

const availableObjeks = ref<ObjekResponse[]>([])
const availableIndikators = ref<IndikatorResponse[]>([])

const form = reactive({
  objek_id: '',
  nama: '',
  deskripsi: '',
  link_panduan_bukti_istrumen: '',
  catatan_panduan_bukti_istrumen: '',
  link_panduan_bukti_rtl: '',
  catatan_panduan_bukti_rtl: '',
  indikator_evaluasi_ids: [] as string[]
})

const formErrors = reactive({
  objek_id: '',
  nama: '',
  deskripsi: '',
  link_panduan_bukti_istrumen: '',
  catatan_panduan_bukti_istrumen: '',
  link_panduan_bukti_rtl: '',
  catatan_panduan_bukti_rtl: '',
  indikator_evaluasi_ids: ''
})

function validateForm() {
  Object.keys(formErrors).forEach(k => {
    formErrors[k as keyof typeof formErrors] = ''
  })
  
  if (!form.objek_id) formErrors.objek_id = 'Pilih objek evaluasi.'
  
  if (!form.nama.trim()) formErrors.nama = 'Nama aspek wajib diisi.'
  else if (form.nama.length > 50) formErrors.nama = 'Nama aspek maksimal 50 karakter.'

  if (!form.deskripsi.trim()) formErrors.deskripsi = 'Deskripsi aspek wajib diisi.'
  else if (form.deskripsi.length > 500) formErrors.deskripsi = 'Deskripsi aspek maksimal 500 karakter.'

  if (!form.link_panduan_bukti_istrumen.trim()) formErrors.link_panduan_bukti_istrumen = 'Link instrumen wajib diisi.'
  else if (form.link_panduan_bukti_istrumen.length < 10) formErrors.link_panduan_bukti_istrumen = 'Minimal 10 karakter.'

  if (!form.catatan_panduan_bukti_istrumen.trim()) formErrors.catatan_panduan_bukti_istrumen = 'Catatan instrumen wajib diisi.'
  else if (form.catatan_panduan_bukti_istrumen.length < 10) formErrors.catatan_panduan_bukti_istrumen = 'Minimal 10 karakter.'
  else if (form.catatan_panduan_bukti_istrumen.length > 500) formErrors.catatan_panduan_bukti_istrumen = 'Maksimal 500 karakter.'

  if (!form.link_panduan_bukti_rtl.trim()) formErrors.link_panduan_bukti_rtl = 'Link RTL wajib diisi.'
  else if (form.link_panduan_bukti_rtl.length < 10) formErrors.link_panduan_bukti_rtl = 'Minimal 10 karakter.'

  if (!form.catatan_panduan_bukti_rtl.trim()) formErrors.catatan_panduan_bukti_rtl = 'Catatan RTL wajib diisi.'
  else if (form.catatan_panduan_bukti_rtl.length < 10) formErrors.catatan_panduan_bukti_rtl = 'Minimal 10 karakter.'
  else if (form.catatan_panduan_bukti_rtl.length > 500) formErrors.catatan_panduan_bukti_rtl = 'Maksimal 500 karakter.'

  if (form.indikator_evaluasi_ids.length === 0) formErrors.indikator_evaluasi_ids = 'Pilih minimal 1 indikator.'
  else if (form.indikator_evaluasi_ids.length > 30) formErrors.indikator_evaluasi_ids = 'Maksimal 30 indikator.'

  return !Object.values(formErrors).some(err => err !== '')
}

const isFormValid = computed(() => {
  return form.objek_id &&
    form.nama.trim().length > 0 && 
    form.deskripsi.trim().length > 0 &&
    form.link_panduan_bukti_istrumen.trim().length >= 10 &&
    form.catatan_panduan_bukti_istrumen.trim().length >= 10 &&
    form.link_panduan_bukti_rtl.trim().length >= 10 &&
    form.catatan_panduan_bukti_rtl.trim().length >= 10 &&
    form.indikator_evaluasi_ids.length > 0
})

async function fetchObjeks() {
  if (!lingkupId.value) return
  const lang = locale.value || 'id'
  try {
    const res = await $fetch<{ data: ObjekResponse[] }>(`/api/${lang}/lingkup/${lingkupId.value}/objek?size=100`, {
      baseURL,
      headers: { Authorization: `Bearer ${authStore.accessToken}` }
    })
    availableObjeks.value = res.data || []
  } catch (error) {
    console.error('Failed to fetch objeks', error)
  }
}

async function fetchIndikators() {
  if (!form.objek_id) {
    availableIndikators.value = []
    form.indikator_evaluasi_ids = []
    return
  }
  const lang = locale.value || 'id'
  try {
    const res = await $fetch<{ data: IndikatorResponse[] }>(`/api/objek/${form.objek_id}/indikator?size=100`, {
      baseURL,
      headers: { 
        "Accept-Language": lang,
        Authorization: `Bearer ${authStore.accessToken}` 
      }
    })
    availableIndikators.value = res.data || []
    form.indikator_evaluasi_ids = []
  } catch (error) {
    console.error('Failed to fetch indikators', error)
  }
}

watch(() => form.objek_id, () => {
  fetchIndikators()
})

async function handleSubmit() {
  if (!validateForm()) return
  isSubmitting.value = true
  submitError.value = ''
  try {
    if (!modulId.value) return
    const lang = locale.value || 'id'
    await aspekStore.createAspek(lang, baseURL, modulId.value, {
      objek_id: form.objek_id,
      nama: form.nama,
      deskripsi: form.deskripsi,
      link_panduan_bukti_istrumen: form.link_panduan_bukti_istrumen,
      catatan_panduan_bukti_istrumen: form.catatan_panduan_bukti_istrumen,
      link_panduan_bukti_rtl: form.link_panduan_bukti_rtl,
      catatan_panduan_bukti_rtl: form.catatan_panduan_bukti_rtl,
      indikator_evaluasi_ids: form.indikator_evaluasi_ids
    })
    const basePath = useRoute().path.split('/aspek')[0] || '/'
    window.location.href = basePath
  } catch (error: any) {
    submitError.value = error?.data?.errors || error.message || 'Gagal membuat aspek'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  if (!modulId.value) return
  try {
    const lang = locale.value || 'id'
    const modulRes = await modulStore.fetchModulById(lang, baseURL, modulId.value)
    modulName.value = modulRes?.nama || 'Modul'
    lingkupId.value = modulRes?.lingkup?.id || ''
    if (lingkupId.value) {
      await fetchObjeks()
    }
  } catch (error) {
    console.error('Failed to fetch modul', error)
  }
})
</script>

<template>
  <div>
    <section class="mx-auto w-full max-w-[1880px] bg-[#f4f4f4] px-3 pb-8 pt-5 sm:px-5 sm:pt-7 md:px-6 md:pt-8 lg:px-8 xl:px-10 2xl:px-12">
    <!-- Breadcrumb -->
    <div class="mb-4 flex flex-wrap items-center gap-2">
      <NuxtLink :to="localePath(`/dashboard/manajemen-modul/${modulId}`)">
        <button
          class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d6dae2] bg-[#efeff1] text-[#596273] shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:bg-white cursor-pointer sm:h-9 sm:w-9">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19 8 12l7-7" />
          </svg>
        </button>
      </NuxtLink>

      <nav class="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
        <template v-for="(item, index) in breadcrumbItems" :key="`${item.label}-${index}`">
          <NuxtLink v-if="item.to" :to="localePath(item.to)" class="text-[#9aa2b1] transition hover:text-[#6e7788] hover:underline">
            {{ item.label }}
          </NuxtLink>

          <span v-else :class="item.active
            ? 'font-semibold text-[#e30000] underline'
            : 'text-[#9aa2b1]'
            ">
            {{ item.label }}
          </span>

          <span v-if="index !== breadcrumbItems.length - 1" class="px-1 text-[#c5cad4]">
            /
          </span>
        </template>
      </nav>
    </div>

      <section :dir="isRTL ? 'rtl' : 'ltr'" class="mt-4 rounded-xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 shadow-[0_1px_4px_rgba(15,23,42,0.08)] sm:px-5 sm:py-6">
        <div>
          <h1 class="text-[clamp(1.55rem,2.1vw,2rem)] font-semibold leading-tight text-[#11141b]">
            {{ t('manajemenAspek.buatAspek') }}
          </h1>
          <p class="mt-3 max-w-[1200px] text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-[#556173]">
            {{ t('manajemenAspek.deskripsiBuat') }}
          </p>
        </div>
      </section>

      <section class="mt-5 rounded-xl border border-[#dadde3] bg-[#f4f4f5] px-3 py-4 shadow-[0_1px_4px_rgba(15,23,42,0.08)] sm:px-5 sm:py-6" :dir="isRTL ? 'rtl' : 'ltr'">
        <form class="mx-auto mt-4 w-full max-w-4xl rounded-2xl border border-dashed border-[#d7dbe4] bg-[#f8f8f8] px-4 py-5 sm:px-6 sm:py-7" @submit.prevent="handleSubmit">
          <h3 class="text-center text-lg font-semibold text-[#151922] sm:text-xl md:text-2xl">Form Aspek</h3>
          
          <div v-if="submitError" class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{{ submitError }}</div>

          <div class="mt-5 space-y-4">
            
            <!-- Objek -->
            <div>
              <label class="text-sm font-semibold text-[#3f4b5f]">
                Objek Evaluasi
                <span class="text-[#e1121b]">*</span>
              </label>
              <select v-model="form.objek_id" class="mt-1.5 h-11 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3">
                <option value="" disabled>Pilih objek evaluasi</option>
                <option v-for="obj in availableObjeks" :key="obj.id" :value="obj.id">{{ obj.nama }} ({{ obj.kode }})</option>
              </select>
              <p v-if="formErrors.objek_id" class="mt-1 text-xs text-[#e1121b]">{{ formErrors.objek_id }}</p>
            </div>

            <!-- Nama -->
            <div>
              <label class="text-sm font-semibold text-[#3f4b5f]">
                {{ t('manajemenAspek.namaAspek') }}
                <span class="text-[#e1121b]">*</span>
              </label>
              <input v-model="form.nama" type="text" maxlength="50" placeholder="Masukkan nama aspek" class="mt-1.5 h-11 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3">
              <p class="mt-1 flex justify-between text-xs text-[#98a1b1]">
                <span>{{ form.nama.length }}/50</span>
              </p>
              <p v-if="formErrors.nama" class="mt-1 text-xs text-[#e1121b]">{{ formErrors.nama }}</p>
            </div>

            <!-- Deskripsi -->
            <div>
              <label class="text-sm font-semibold text-[#3f4b5f]">
                {{ t('manajemenAspek.deskripsi') }}
                <span class="text-[#e1121b]">*</span>
              </label>
              <textarea v-model="form.deskripsi" maxlength="500" rows="4" placeholder="Masukkan deskripsi aspek" class="mt-1.5 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3 py-2" />
              <p class="mt-1 flex justify-between text-xs text-[#98a1b1]">
                <span>{{ form.deskripsi.length }}/500</span>
              </p>
              <p v-if="formErrors.deskripsi" class="mt-1 text-xs text-[#e1121b]">{{ formErrors.deskripsi }}</p>
            </div>

            <div class="h-px w-full bg-[#d7dbe4] my-2"></div>

            <!-- Link Panduan Instrumen -->
            <div>
              <label class="text-sm font-semibold text-[#3f4b5f]">Link Panduan Bukti Instrumen <span class="text-[#e1121b]">*</span></label>
              <input v-model="form.link_panduan_bukti_istrumen" type="text" placeholder="https://..." class="mt-1.5 h-11 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3">
              <p v-if="formErrors.link_panduan_bukti_istrumen" class="mt-1 text-xs text-[#e1121b]">{{ formErrors.link_panduan_bukti_istrumen }}</p>
            </div>

            <!-- Catatan Panduan Instrumen -->
            <div>
              <label class="text-sm font-semibold text-[#3f4b5f]">Catatan Panduan Bukti Instrumen <span class="text-[#e1121b]">*</span></label>
              <textarea v-model="form.catatan_panduan_bukti_istrumen" rows="3" placeholder="Masukkan catatan panduan instrumen..." class="mt-1.5 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3 py-2" />
              <p v-if="formErrors.catatan_panduan_bukti_istrumen" class="mt-1 text-xs text-[#e1121b]">{{ formErrors.catatan_panduan_bukti_istrumen }}</p>
            </div>

            <div class="h-px w-full bg-[#d7dbe4] my-2"></div>

            <!-- Link Panduan RTL -->
            <div>
              <label class="text-sm font-semibold text-[#3f4b5f]">Link Panduan Bukti RTL <span class="text-[#e1121b]">*</span></label>
              <input v-model="form.link_panduan_bukti_rtl" type="text" placeholder="https://..." class="mt-1.5 h-11 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3">
              <p v-if="formErrors.link_panduan_bukti_rtl" class="mt-1 text-xs text-[#e1121b]">{{ formErrors.link_panduan_bukti_rtl }}</p>
            </div>

            <!-- Catatan Panduan RTL -->
            <div>
              <label class="text-sm font-semibold text-[#3f4b5f]">Catatan Panduan Bukti RTL <span class="text-[#e1121b]">*</span></label>
              <textarea v-model="form.catatan_panduan_bukti_rtl" rows="3" placeholder="Masukkan catatan panduan RTL..." class="mt-1.5 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3 py-2" />
              <p v-if="formErrors.catatan_panduan_bukti_rtl" class="mt-1 text-xs text-[#e1121b]">{{ formErrors.catatan_panduan_bukti_rtl }}</p>
            </div>

            <div class="h-px w-full bg-[#d7dbe4] my-2"></div>

            <!-- Indikator -->
            <div>
              <label class="text-sm font-semibold text-[#3f4b5f]">
                Indikator Evaluasi (Pilih 1 - 30)
                <span class="text-[#e1121b]">*</span>
              </label>
              <div v-if="!form.objek_id" class="mt-1.5 rounded-xl border border-[#cfd5de] bg-[#f3f4f6] p-4 text-center text-sm text-[#556173]">
                Pilih objek evaluasi terlebih dahulu untuk melihat indikator.
              </div>
              <div v-else-if="availableIndikators.length === 0" class="mt-1.5 rounded-xl border border-[#cfd5de] bg-[#f3f4f6] p-4 text-center text-sm text-[#556173]">
                Tidak ada indikator yang tersedia untuk objek ini.
              </div>
              <div v-else class="mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-[#cfd5de] bg-white p-3 shadow-inner">
                <div v-for="ind in availableIndikators" :key="ind.id" class="mb-2 flex items-start gap-2 last:mb-0">
                  <input type="checkbox" :id="`ind-${ind.id}`" :value="ind.id" v-model="form.indikator_evaluasi_ids" class="mt-1 cursor-pointer">
                  <label :for="`ind-${ind.id}`" class="cursor-pointer text-sm text-[#3f4b5f] leading-snug">{{ ind.nama || ind.pertanyaan || ind.id }}</label>
                </div>
              </div>
              <p class="mt-1 text-xs text-[#98a1b1]">Terpilih: {{ form.indikator_evaluasi_ids.length }}</p>
              <p v-if="formErrors.indikator_evaluasi_ids" class="mt-1 text-xs text-[#e1121b]">{{ formErrors.indikator_evaluasi_ids }}</p>
            </div>

          </div>

          <div class="mt-6 flex justify-center gap-3">
            <NuxtLink :to="`/dashboard/manajemen-modul/${modulId}`" class="inline-flex h-10 min-w-28 items-center justify-center rounded-xl border border-[#d7dbe4] bg-[#f3f4f6] px-5 text-sm font-semibold text-[#1f2634] transition sm:h-11 sm:min-w-32 sm:px-6 sm:text-base hover:bg-[#e0e0e0] cursor-pointer">
              {{ t('manajemenAspek.batal') }}
            </NuxtLink>
            <button type="submit" :disabled="!isFormValid || isSubmitting" :class="[
              'inline-flex h-10 min-w-28 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition sm:h-11 sm:min-w-32 sm:px-6 sm:text-base',
              isFormValid && !isSubmitting ? 'bg-[#e1121b] hover:bg-[#cc0f17] cursor-pointer' : 'bg-gray-400 cursor-not-allowed opacity-60'
            ]">
              <span v-if="isSubmitting" class="flex items-center gap-2">
                <svg class="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </span>
              <span v-else>{{ t('manajemenAspek.simpan') }}</span>
            </button>
          </div>
        </form>
      </section>
    </section>
  </div>
</template>
