<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useLocalePath } from '#imports'
import { useI18n } from 'vue-i18n'
import { useAspekApi } from '#features/modul/services/aspek.api'
import { useModulApi } from '#features/modul/services/modul.api'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const aspekApi = useAspekApi()
const modulApi = useModulApi()

const isRTL = computed(() => locale.value.startsWith('ar'))

const modulId = computed(() => {
  const id = route.params.modul_id
  return Array.isArray(id) ? id[0] : id
})

const modulName = ref('')

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

const form = reactive({
  nama: '',
  deskripsi: '',
})

const formErrors = reactive({
  nama: '',
  deskripsi: '',
})

function validateForm() {
  Object.keys(formErrors).forEach(k => {
    formErrors[k as keyof typeof formErrors] = ''
  })
  
  if (!form.nama.trim()) {
    formErrors.nama = 'Nama aspek wajib diisi.'
  } else if (form.nama.length > 100) {
    formErrors.nama = 'Nama aspek maksimal 100 karakter.'
  }

  if (!form.deskripsi.trim()) {
    formErrors.deskripsi = 'Deskripsi aspek wajib diisi.'
  } else if (form.deskripsi.length > 500) {
    formErrors.deskripsi = 'Deskripsi aspek maksimal 500 karakter.'
  }

  return !formErrors.nama && !formErrors.deskripsi
}

const isFormValid = computed(() => {
  return form.nama.trim().length > 0 && form.deskripsi.trim().length > 0
})

async function handleSubmit() {
  if (!validateForm()) return
  isSubmitting.value = true
  submitError.value = ''
  try {
    if (!modulId.value) return
    await aspekApi.createAspek({
      modulId: modulId.value,
      nama: form.nama,
      deskripsi: form.deskripsi
    })
    const basePath = useRoute().path.split('/aspek')[0] || '/'
    window.location.href = basePath
  } catch (error: any) {
    submitError.value = error.message || 'Gagal membuat aspek'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  if (!modulId.value) return
  try {
    const modulRes = await modulApi.getModul(modulId.value)
    modulName.value = modulRes?.nama || 'Modul'
  } catch (error) {
    console.error('Failed to fetch modul', error)
  }
})
</script>

<template>
  <div>
    <!-- <div class="h-[56px] w-full sm:h-[64px] md:h-[70px]">
      <div class="h-full w-full bg-repeat-x bg-top" style="background-image: url('/img/batik.png'); background-size: auto clamp(72px, 8vw, 90px);" />
    </div> -->

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
            <!-- Nama -->
            <div>
              <label class="text-sm font-semibold text-[#3f4b5f]">
                {{ t('manajemenAspek.namaAspek') }}
                <span class="text-[#e1121b]">*</span>
              </label>
              <input v-model="form.nama" type="text" maxlength="100" placeholder="Masukkan nama aspek" class="mt-1.5 h-11 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3">
              <p class="mt-1 flex justify-between text-xs text-[#98a1b1]">
                <span>{{ form.nama.length }}/100</span>
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
