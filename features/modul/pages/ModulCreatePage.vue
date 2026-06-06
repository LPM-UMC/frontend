<template>
  <div>
    <div class="h-[56px] w-full sm:h-[64px] md:h-[70px]">
      <div class="h-full w-full bg-repeat-x bg-top"
        style="background-image: url('/img/batik.png'); background-size: auto clamp(72px, 8vw, 90px);" />
    </div>

    <section
      class="mx-auto w-full max-w-[1880px] bg-[#f4f4f4] px-3 pb-8 pt-5 sm:px-5 sm:pt-7 md:px-6 md:pt-8 lg:px-8 xl:px-10 2xl:px-12">
      <div class="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
        <NuxtLink :to="localePath('/dashboard/manajemen-modul')" class="inline-flex items-center gap-1.5 transition hover:text-[#e1121b]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6" />
          </svg>
          <span>{{ $t('manajemenModul.judul') }}</span>
        </NuxtLink>
        <span>/</span>
        <span class="font-semibold text-[#e1121b]">{{ $t('manajemenModul.create.judul') }}</span>
      </div>

    <!-- Hero -->
    <section
:dir="isRTL ? 'rtl' : 'ltr'"
      class="mt-4 rounded-xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 shadow-[0_1px_4px_rgba(15,23,42,0.08)] sm:px-5 sm:py-6">
      <h1 class="text-xl font-semibold text-[#11141b] sm:text-2xl lg:text-3xl">
        {{ $t('manajemenModul.create.judul') }}
      </h1>

      <p class="mt-2 text-sm leading-relaxed text-[#556173] sm:text-base">
        {{ $t('manajemenModul.create.deskripsi') }}
      </p>
    </section>

    <!-- Form -->
    <section
      class="mt-5 rounded-xl border border-[#dadde3] bg-[#f4f4f5] px-3 py-4 shadow-[0_1px_4px_rgba(15,23,42,0.08)] sm:px-5 sm:py-6"
      :dir="isRTL ? 'rtl' : 'ltr'">
      <form
        class="mx-auto mt-4 w-full max-w-4xl rounded-2xl border border-dashed border-[#d7dbe4] bg-[#f8f8f8] px-4 py-5 sm:px-6 sm:py-7"
        @submit.prevent="handleSubmit">
        <h3 class="text-center text-lg font-semibold text-[#151922] sm:text-xl md:text-2xl">
          {{ $t('manajemenModul.create.judulForm') }}
        </h3>

        <div class="mt-5 space-y-4">

          <!-- Nama -->
          <div>
            <label class="text-sm font-semibold text-[#3f4b5f]">
              {{ $t('manajemenModul.model.nama') }}
              <span class="text-[#e1121b]">*</span>
            </label>

            <input
v-model="form.nama" type="text" maxlength="50" :placeholder="$t('manajemenModul.placeholder.nama')"
              class="mt-1.5 h-11 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3">

            <p class="mt-1 flex justify-between text-xs text-[#98a1b1]">
              <span>{{ form.nama.length }}/50</span>
            </p>

            <p v-if="formErrors.nama" class="mt-1 text-xs text-[#e1121b]">
              {{ formErrors.nama }}
            </p>
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="text-sm font-semibold text-[#3f4b5f]">
              {{ $t('manajemenModul.model.deskripsi') }}
              <span class="text-[#e1121b]">*</span>
            </label>

            <textarea
v-model="form.deskripsi" maxlength="500" rows="4"
              :placeholder="$t('manajemenModul.placeholder.deskripsi')"
              class="mt-1.5 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3 py-2" />

            <p class="mt-1 flex justify-between text-xs text-[#98a1b1]">
              <span>{{ form.deskripsi.length }}/500</span>
            </p>

            <p v-if="formErrors.deskripsi" class="mt-1 text-xs text-[#e1121b]">
              {{ formErrors.deskripsi }}
            </p>
          </div>

          <!-- LINGKUP EVALUASI -->
          <div>
            <label class="text-sm font-semibold text-[#3f4b5f]">
              {{ $t('manajemenModul.model.lingkup') }}
              <span class="text-[#e1121b]">*</span>
            </label>

            <label class="relative mt-2 block">
              <select
v-model="form.lingkup_id"
                class="h-12 w-full appearance-none rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 pr-12 text-[1rem] text-[#2b3340] outline-none">
                <option value="" disabled>
                  {{ $t('manajemenModul.create.pilihLingkup') }}
                </option>

                <option v-for="option in lingkupOptions" :key="option.id" :value="option.id">
                  {{ option.nama }}
                </option>
              </select>

              <svg
xmlns="http://www.w3.org/2000/svg"
                class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#9ca5b5]" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </label>

            <div class="mt-2 text-[0.95rem] text-[#95a0b1]">
              <p v-if="formErrors.lingkup_id" class="mt-1 text-xs text-[#e1121b]">
                {{ formErrors.lingkup_id }}
              </p>
            </div>
          </div>


        </div>

        <div class="mt-6 flex justify-center gap-3">
          <NuxtLink
:to="localePath('/dashboard/manajemen-modul')"
            class="inline-flex h-10 min-w-28 items-center justify-center rounded-xl border border-[#d7dbe4] bg-[#f3f4f6] px-5 text-sm font-semibold text-[#1f2634] transition sm:h-11 sm:min-w-32 sm:px-6 sm:text-base hover:bg-[#e0e0e0] cursor-pointer">
            {{ $t('util.batal') }}
          </NuxtLink>
          <button
type="submit" :disabled="!isFormValid" :class="[
            'inline-flex h-10 min-w-28 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition sm:h-11 sm:min-w-32 sm:px-6 sm:text-base',
            isFormValid
              ? 'bg-[#e1121b] hover:bg-[#cc0f17] cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed opacity-60'
          ]">
            {{ $t('util.buat') }}
          </button>
        </div>

      </form>
    </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, reactive, watch, onMounted } from 'vue'
import { navigateTo, useLocalePath, useToast } from '#imports'
import { createModulValidation } from '#validations/modul.validation'

const localePath = useLocalePath()
const toast = useToast()
const { locale, t } = useI18n()

const isRTL = computed(() => locale.value.startsWith('ar'))

// =====================
// BREADCRUMB
// =====================
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
    label: t('manajemenModul.create.judul'),
    active: true,
  },
])

import { useModul } from '../composables/useModul'
import { useLingkup } from '#features/manajemen-lingkup/composables/useLingkup'

const { saveModul } = useModul()
const { rows: lingkupOptions, fetchLingkup } = useLingkup()

onMounted(() => {
  fetchLingkup()
})

// =====================
// FORM
// =====================
const form = reactive({
  lingkup_id: '',
  nama: '',
  deskripsi: '',
})

// =====================
// ERROR STATE
// =====================
const formErrors = reactive({
  lingkup_id: '',
  nama: '',
  deskripsi: '',
})

// =====================
// RESET ERROR HELPER
// =====================
function resetError(field: keyof typeof formErrors) {
  formErrors[field] = ''
}

// =====================
// VALIDATE SINGLE FIELD
// =====================
function validateField(field: keyof typeof formErrors) {
  const schema = createModulValidation(t as any)
  const result = schema.safeParse(form)

  resetError(field)

  if (!result.success) {
    const issue = result.error.issues.find(i => i.path[0] === field)
    if (issue) {
      formErrors[field] = issue.message
    }
  }
}

// =====================
// VALIDATE FULL FORM
// =====================
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

// =====================
// WATCHERS (FIXED)
// =====================
watch(() => form.lingkup_id, () => validateField('lingkup_id'))
watch(() => form.nama, () => validateField('nama'))
watch(() => form.deskripsi, () => validateField('deskripsi'))

// =====================
// FORM VALID STATE (FIXED ERROR SOURCE)
// =====================
const isFormValid = computed(() => {
  const schema = createModulValidation(t as any)
  return schema.safeParse(form).success
})

// =====================
// SUBMIT
// =====================
async function handleSubmit() {
  const isValid = validateForm()

  if (!isValid) {
    toast.add({
      title: t('util.gagal'),
      description: t('util.periksaKembaliForm'),
      color: 'error',
    })
    return
  }

  try {
    await saveModul({
      lingkup_id: form.lingkup_id,
      nama: form.nama,
      deskripsi: form.deskripsi,
    })

    toast.add({
      title: t('util.berhasil'),
      description: 'Modul berhasil dibuat',
      color: 'success',
    })

    setTimeout(() => {
      navigateTo('/dashboard/manajemen-modul')
    }, 1000)
  } catch (error: any) {
    toast.add({
      title: t('util.gagal'),
      description: error?.message || t('util.periksaKembaliForm'),
      color: 'error',
    })
  }
}
</script>
