<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, navigateTo, useLocalePath, useToast } from '#imports'
import { useI18n } from 'vue-i18n'
import { useLingkup } from '#features/lingkup/composables/useLingkup'
import { useUnit } from '#features/lingkup/composables/useUnit'

const route = useRoute()
const localePath = useLocalePath()
const toast = useToast()
const { t } = useI18n()

const lingkupId = computed(() => {
  const id = route.params.lingkup_id
  return Array.isArray(id) ? id[0] : id
})

const { rows: lingkupRows, fetchLingkup } = useLingkup()
const { saveUnit } = useUnit(lingkupId.value)

const lingkupName = ref('Lingkup')
const pageLoading = ref(true)

const isSubmitting = ref(false)
const submitError = ref('')

const form = reactive({
  name: '',
  description: ''
})

const formErrors = reactive({
  name: '',
  description: ''
})

const nameCount = computed(() => form.name.length)
const descriptionCount = computed(() => form.description.length)
const nameLimit = 100
const descriptionLimit = 100

async function loadInitialData() {
  pageLoading.value = true
  try {
    await fetchLingkup()
    const detail = lingkupRows.value.find((r: any) => r.id === lingkupId.value)
    if (detail) {
      lingkupName.value = detail.nama
    }
  } catch (e) {
    console.error(e)
  } finally {
    pageLoading.value = false
  }
}

function validateForm() {
  formErrors.name = ''
  formErrors.description = ''
  
  if (!form.name.trim()) {
    formErrors.name = 'Nama unit evaluasi wajib diisi.'
  } else if (form.name.length > nameLimit) {
    formErrors.name = 'Nama unit evaluasi maksimal 100 karakter.'
  }

  if (!form.description.trim()) {
    formErrors.description = 'Deskripsi unit evaluasi wajib diisi.'
  } else if (form.description.length > descriptionLimit) {
    formErrors.description = 'Deskripsi unit evaluasi maksimal 100 karakter.'
  }

  return !formErrors.name && !formErrors.description
}

const isFormValid = computed(() => {
  return form.name.trim().length > 0 && 
         form.description.trim().length > 0
})

async function handleSubmit() {
  if (!validateForm()) return
  isSubmitting.value = true
  submitError.value = ''
  try {
    const result = await saveUnit({
      name: form.name,
      description: form.description
    })

    if (!result) {
      throw new Error('Gagal menyimpan unit evaluasi')
    }

    toast.add({
      title: 'Berhasil',
      description: 'Unit evaluasi berhasil dibuat.',
      color: 'green'
    })

    navigateTo(localePath(`/dashboard/manajemen-lingkup/${lingkupId.value}`))
  } catch (error: any) {
    submitError.value = error.message || 'Gagal menyimpan unit evaluasi'
    toast.add({
      title: 'Gagal',
      description: submitError.value,
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}

async function navigateBack() {
  await navigateTo(localePath(`/dashboard/manajemen-lingkup/${lingkupId.value}`))
}

const breadcrumbItems = computed(() => [
  { label: t('navigasi.dasbor', 'Dasbor'), to: localePath('/dashboard') },
  { label: t('manajemenLingkup.judul', 'Lingkup Evaluasi'), to: localePath('/dashboard/manajemen-lingkup') },
  { label: lingkupName.value, to: localePath(`/dashboard/manajemen-lingkup/${lingkupId.value}`) },
  { label: t('manajemenLingkup.detail.daftarUnit', 'Unit Evaluasi').replace('Daftar ', ''), to: localePath(`/dashboard/manajemen-lingkup/${lingkupId.value}`) },
  { label: t('umum.buat', 'Buat'), active: true }
])

onMounted(() => {
  loadInitialData()
})
</script>

<template>
  <div v-if="pageLoading" class="p-8 text-center text-slate-500">Memuat data...</div>
  <section v-else class="mx-auto w-full max-w-[1520px] px-4 pb-8 pt-6 sm:px-6 lg:px-8">
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d6dae2] bg-[#efeff1] text-[#596273] shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:bg-white"
        aria-label="Kembali"
        @click="navigateBack"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19 8 12l7-7" />
        </svg>
      </button>

      <nav class="flex flex-wrap items-center gap-1">
        <template v-for="(item, index) in breadcrumbItems" :key="`${item.label}-${index}`">
          <NuxtLink
            v-if="item.to"
            :to="item.to"
            class="text-[clamp(0.95rem,1.2vw,1.05rem)] text-[#9aa2b1] hover:text-[#6e7788] hover:underline cursor-pointer transition-colors"
          >
            {{ item.label }}
          </NuxtLink>
          <span
            v-else
            class="text-[clamp(0.95rem,1.2vw,1.05rem)]"
            :class="item.active ? 'font-semibold text-[#e30000]' : 'text-[#9aa2b1]'"
          >
            {{ item.label }}
          </span>
          <span
            v-if="index !== breadcrumbItems.length - 1"
            class="px-1 text-[clamp(0.95rem,1.2vw,1.05rem)] text-[#c5cad4]"
          >/</span>
        </template>
      </nav>
    </div>

    <section class="mt-5 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <h1 class="text-[clamp(1.55rem,2.1vw,2rem)] font-semibold leading-tight text-[#11141b]">
        Buat Unit Evaluasi {{ lingkupName }} Baru
      </h1>
      <p class="mt-3 max-w-[1200px] text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-[#556173]">
        Gunakan fitur ini untuk menambahkan unit evaluasi pada lingkup {{ lingkupName }} sebagai sub-bagian dari lingkup tersebut. Unit evaluasi yang dibuat akan dapat dipilih saat menyusun objek evaluasi pada periode berikutnya, sehingga proses pemantauan dan evaluasi lebih terarah dan konsisten.
      </p>
    </section>

    <section class="mt-6 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <form
        class="mx-auto mt-2 w-full max-w-[920px] rounded-[24px] border-2 border-dashed border-[#d7dbe4] bg-[#f8f8f8] px-5 py-8 shadow-[0_6px_16px_rgba(15,23,42,0.12)] sm:px-8"
        @submit.prevent="handleSubmit"
      >
        <h3 class="text-center text-[clamp(1.55rem,1.8vw,2rem)] font-semibold text-[#151922]">
          Form Unit Evaluasi {{ lingkupName }}
        </h3>

        <div v-if="submitError" class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 text-center">{{ submitError }}</div>

        <div class="mt-7 space-y-5">
          <div>
            <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
              Nama Unit Evaluasi<span class="text-[#e30000]">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              :maxlength="nameLimit"
              placeholder="Masukkan nama di sini"
              class="mt-2 h-14 w-full rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5 text-[1.05rem] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
            >
            <p class="mt-2 flex items-center justify-between text-[0.9rem] text-[#98a1b1]">
              <span>Maks. 100 karakter. Gunakan format konsisten.</span>
              <span class="font-semibold">{{ nameCount }}/100</span>
            </p>
            <p v-if="formErrors.name" class="mt-1 text-[0.875rem] text-[#e30000]">
              {{ formErrors.name }}
            </p>
          </div>

          <div>
            <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
              Deskripsi Unit Evaluasi<span class="text-[#e30000]">*</span>
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              :maxlength="descriptionLimit"
              placeholder="Masukkan deskripsi di sini"
              class="mt-2 w-full rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5 py-4 text-[1.05rem] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
            />
            <p class="mt-2 flex items-center justify-between text-[0.9rem] text-[#98a1b1]">
              <span>Maks. 100 karakter. Gunakan format konsisten.</span>
              <span class="font-semibold">{{ descriptionCount }}/100</span>
            </p>
            <p v-if="formErrors.description" class="mt-1 text-[0.875rem] text-[#e30000]">
              {{ formErrors.description }}
            </p>
          </div>
        </div>

        <p class="mt-5 text-center text-[1rem] text-[#6a7384]">
          Butuh Unit Evaluasi yang terintegrasi GS?
          <NuxtLink to="#" class="text-[#2a64e5] underline">Hubungi Developer</NuxtLink>
        </p>

        <div class="mt-6 flex justify-center">
          <button
            type="submit"
            :disabled="!isFormValid || isSubmitting"
            class="inline-flex h-12 min-w-[160px] items-center justify-center rounded-[18px] px-8 text-[1.25rem] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            :class="isFormValid && !isSubmitting ? 'bg-[#e30000] shadow-[0_10px_20px_rgba(227,0,0,0.22)] hover:bg-[#c90000]' : 'bg-gray-400 opacity-50'"
          >
            <UIcon v-if="isSubmitting" name="i-lucide-loader-2" class="mr-2 h-5 w-5 animate-spin" />
            Buat
          </button>
        </div>
      </form>
    </section>
  </section>
</template>
