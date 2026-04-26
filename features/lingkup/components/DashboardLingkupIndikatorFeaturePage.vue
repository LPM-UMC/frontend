<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import {
  getDashboardLingkupIndikatorCreateDefaultForm,
  getDashboardLingkupIndikatorDummyDetail,
  getDashboardLingkupIndikatorEditDefaultForm,
  type DashboardLingkupIndikatorFormData,
  type DashboardLingkupIndikatorScaleItem,
} from '../data/dashboardLingkupDummy'

type DashboardLingkupIndikatorPageMode = 'create' | 'edit'

interface BreadcrumbItem {
  label: string
  to?: string
  active?: boolean
}

const props = defineProps<{
  mode: DashboardLingkupIndikatorPageMode
}>()

const route = useRoute()

const nameLimit = 100
const descriptionLimit = 100
const questionLimit = 100

const form = reactive<DashboardLingkupIndikatorFormData>(
  getDashboardLingkupIndikatorCreateDefaultForm()
)

const formErrors = reactive({
  name: '',
  description: '',
  question: '',
  type: '',
})

const scaleErrors = reactive<Record<string, string>>({})

function normalizeRouteParam(value: string | string[] | undefined): string | null {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

function createScaleId(): string {
  return `scale-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

const lingkupId = computed(() =>
  normalizeRouteParam(route.params.lingkup_id as string | string[] | undefined)
)

const objekId = computed(() =>
  normalizeRouteParam(route.params.objek_id as string | string[] | undefined)
)

const indikatorId = computed(() =>
  normalizeRouteParam(route.params.indikator_id as string | string[] | undefined)
)

const detailBundle = computed(() =>
  getDashboardLingkupIndikatorDummyDetail(lingkupId.value, objekId.value, indikatorId.value)
)

const detailInfo = computed(() => detailBundle.value.info)
const typeOptions = computed(() => detailBundle.value.typeOptions)

const lingkupDetailPath = computed(() => {
  if (!lingkupId.value) return '/dashboard/lingkup'
  return `/dashboard/lingkup/${encodeURIComponent(lingkupId.value)}`
})

const objekDetailPath = computed(() => {
  const resolvedLingkupId = lingkupId.value ?? detailInfo.value.lingkupName.toLowerCase().replace(/\s+/g, '-')
  const resolvedObjekId = objekId.value ?? detailInfo.value.objekName.toLowerCase().replace(/\s+/g, '-')
  return `/dashboard/lingkup/${encodeURIComponent(resolvedLingkupId)}/objek/${encodeURIComponent(resolvedObjekId)}`
})

const indikatorCreatePath = computed(() => `${objekDetailPath.value}/indikator/create`)

const pageTitle = computed(() => {
  if (props.mode === 'edit') return 'Edit Indikator Evaluasi'
  return 'Indikator Evaluasi Baru'
})

const pageDescription = computed(() => {
  if (props.mode === 'edit') {
    return `Gunakan halaman ini untuk memperbarui indikator evaluasi, termasuk nama, deskripsi, dan pertanyaan kuesioner yang digunakan pada proses penilaian. Perubahan yang disimpan akan memengaruhi tampilan dan hasil rekap evaluasi pada modul yang menggunakan indikator ini.`
  }

  return `Gunakan halaman ini untuk membuat indikator evaluasi baru pada objek evaluasi ${detailInfo.value.objekName}. Indikator yang dibuat akan digunakan dalam proses penilaian, pelaporan, dan pemantauan evaluasi pada modul yang terkait, sehingga hasil evaluasi lebih terukur dan konsisten.`
})

const sectionTitle = computed(() => {
  if (props.mode === 'edit') return 'Edit Indikator Evaluasi'
  return 'Buat Indikator Evaluasi Baru'
})

const formTitle = computed(() => {
  if (props.mode === 'edit') return 'Form Edit Indikator Evaluasi'
  if (form.type === 'scale') return 'Form Indikator Evaluasi Tipe Skala Penilaian Baru'
  return 'Form Buat Indikator Evaluasi Baru'
})

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const base: BreadcrumbItem[] = [
    { label: 'Home', to: '/dashboard' },
    { label: 'Lingkup Evaluasi', to: '/dashboard/lingkup' },
    { label: detailInfo.value.lingkupName, to: lingkupDetailPath.value },
    { label: 'Objek Evaluasi' },
    { label: detailInfo.value.objekName, to: objekDetailPath.value },
    { label: 'Indikator' },
  ]

  if (props.mode === 'edit') {
    return [...base, { label: detailInfo.value.name }, { label: 'Edit', active: true }]
  }

  return [...base, { label: 'Buat', active: true }]
})

const backPath = computed(() => objekDetailPath.value)

const showQuestionField = computed(() =>
  props.mode === 'edit' || form.type === 'scale'
)

const showScaleSection = computed(() => form.type === 'scale')

const showTypeField = computed(() => props.mode === 'create')

const submitLabel = computed(() => 'Buat')

const nameCount = computed(() => form.name.length)
const descriptionCount = computed(() => form.description.length)
const questionCount = computed(() => form.question.length)

function getScaleCount(scale: DashboardLingkupIndikatorScaleItem): number {
  return scale.label.length
}

function getScaleLabel(index: number): string {
  return `Skala ${index + 1}`
}

function resetScaleErrors() {
  Object.keys(scaleErrors).forEach((key) => {
    delete scaleErrors[key]
  })
}

function resetErrors() {
  formErrors.name = ''
  formErrors.description = ''
  formErrors.question = ''
  formErrors.type = ''
  resetScaleErrors()
}

function setupFormByMode() {
  const defaults = props.mode === 'edit'
    ? getDashboardLingkupIndikatorEditDefaultForm(lingkupId.value, objekId.value, indikatorId.value)
    : getDashboardLingkupIndikatorCreateDefaultForm(lingkupId.value, objekId.value, indikatorId.value)

  form.name = defaults.name
  form.description = defaults.description
  form.question = defaults.question
  form.type = defaults.type
  form.scales.splice(0, form.scales.length, ...defaults.scales.map((item) => ({ ...item })))

  resetErrors()
}

function validateForm(): boolean {
  resetErrors()

  const trimmedName = form.name.trim()
  const trimmedDescription = form.description.trim()
  const trimmedQuestion = form.question.trim()

  if (!trimmedName) {
    formErrors.name = 'Nama indikator wajib diisi.'
  } else if (trimmedName.length > nameLimit) {
    formErrors.name = 'Nama indikator maksimal 100 karakter.'
  }

  if (!trimmedDescription) {
    formErrors.description = 'Deskripsi indikator wajib diisi.'
  } else if (trimmedDescription.length > descriptionLimit) {
    formErrors.description = 'Deskripsi indikator maksimal 100 karakter.'
  }

  if (showQuestionField.value) {
    if (!trimmedQuestion) {
      formErrors.question = 'Pertanyaan kuesioner wajib diisi.'
    } else if (trimmedQuestion.length > questionLimit) {
      formErrors.question = 'Pertanyaan kuesioner maksimal 100 karakter.'
    }
  }

  if (showTypeField.value && !form.type) {
    formErrors.type = 'Tipe evaluasi wajib dipilih.'
  }

  if (showScaleSection.value) {
    form.scales.forEach((scale, index) => {
      const trimmedScale = scale.label.trim()
      if (!trimmedScale) {
        scaleErrors[scale.id] = `${getScaleLabel(index)} wajib diisi.`
      } else if (trimmedScale.length > nameLimit) {
        scaleErrors[scale.id] = `${getScaleLabel(index)} maksimal 100 karakter.`
      }
    })
  }

  return !formErrors.name
    && !formErrors.description
    && !formErrors.question
    && !formErrors.type
    && Object.keys(scaleErrors).length === 0
}

function addScale() {
  form.scales.push({
    id: createScaleId(),
    label: '',
  })
}

async function navigateBack() {
  await navigateTo(backPath.value)
}

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function handleSubmit() {
  if (!validateForm()) return

  const resolvedLingkupId = lingkupId.value ?? toSlug(detailInfo.value.lingkupName)
  const resolvedObjekId = objekId.value ?? toSlug(detailInfo.value.objekName)
  const nextIndicatorId = indikatorId.value ?? (toSlug(form.name) || 'indikator-baru')

  await navigateTo(
    `/dashboard/lingkup/${encodeURIComponent(resolvedLingkupId)}/objek/${encodeURIComponent(resolvedObjekId)}/indikator/${encodeURIComponent(nextIndicatorId)}/edit`
  )
}

watch(
  [() => props.mode, lingkupId, objekId, indikatorId],
  () => {
    setupFormByMode()
  },
  { immediate: true }
)

watch(
  () => form.type,
  (nextType) => {
    if (nextType !== 'scale') {
      resetScaleErrors()
    }
  }
)
</script>

<template>
  <section class="mx-auto w-full max-w-[1520px] px-4 pb-8 pt-6 sm:px-6 lg:px-8">
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
            class="text-[clamp(0.95rem,1.2vw,1.05rem)] text-[#9aa2b1] hover:text-[#6e7788]"
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
        {{ pageTitle }}
      </h1>
      <p class="mt-3 max-w-[1200px] text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-[#556173]">
        {{ pageDescription }}
      </p>
    </section>

    <section class="mt-6 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <h2 class="text-[clamp(1.45rem,1.9vw,2rem)] font-semibold text-[#11141b]">
        {{ sectionTitle }}
      </h2>

      <form
        class="mx-auto mt-6 w-full max-w-[980px] rounded-[24px] border-2 border-dashed border-[#d7dbe4] bg-[#f8f8f8] px-5 py-8 shadow-[0_6px_16px_rgba(15,23,42,0.12)] sm:px-8"
        @submit.prevent="handleSubmit"
      >
        <h3 class="text-center text-[clamp(1.6rem,2vw,2.2rem)] font-semibold text-[#151922]">
          {{ formTitle }}
        </h3>

        <div class="mt-7">
          <h4 v-if="showScaleSection" class="text-[clamp(1.45rem,1.7vw,1.9rem)] font-semibold text-[#11141b]">
            Informasi Indikator
          </h4>

          <div class="mt-5">
            <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
              Nama<span class="text-[#e30000]">*</span>
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

          <div
            v-if="showQuestionField"
            class="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2"
          >
            <div>
              <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
                Deskripsi<span class="text-[#e30000]">*</span>
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

            <div>
              <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
                Kuesioner Evaluasi<span class="text-[#e30000]">*</span>
              </label>
              <textarea
                v-model="form.question"
                rows="4"
                :maxlength="questionLimit"
                placeholder="Masukkan deskripsi di sini"
                class="mt-2 w-full rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5 py-4 text-[1.05rem] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
              />
              <p class="mt-2 flex items-center justify-between text-[0.9rem] text-[#98a1b1]">
                <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                <span class="font-semibold">{{ questionCount }}/100</span>
              </p>
              <p v-if="formErrors.question" class="mt-1 text-[0.875rem] text-[#e30000]">
                {{ formErrors.question }}
              </p>
            </div>
          </div>

          <div v-else class="mt-5">
            <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
              Deskripsi<span class="text-[#e30000]">*</span>
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

          <div v-if="showTypeField" class="mt-5">
            <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
              Tipe Evaluasi<span class="text-[#e30000]">*</span>
            </label>

            <label class="relative mt-2 block">
              <select
                v-model="form.type"
                class="h-14 w-full appearance-none rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5 pr-12 text-[1.05rem] text-[#9aa3b3] outline-none"
              >
                <option value="">Pilih Tipe</option>
                <option
                  v-for="option in typeOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </label>
            <p class="mt-2 text-[0.9rem] text-[#98a1b1]">
              Pilihlah tipe berdasarkan kebutuhan
            </p>
            <p v-if="formErrors.type" class="mt-1 text-[0.875rem] text-[#e30000]">
              {{ formErrors.type }}
            </p>
          </div>
        </div>

        <div v-if="showScaleSection" class="mt-6 border-t border-[#dfe5ee] pt-6">
          <h4 class="text-[clamp(1.6rem,1.9vw,2rem)] font-semibold text-[#11141b]">
            Skala Penilaian
          </h4>
          <p class="mt-2 max-w-[1200px] text-[1.05rem] leading-relaxed text-[#556173]">
            Tambahkan label untuk setiap tingkat skala (mis. 1-5). Urutan skala akan digunakan pada tampilan dan rekap evaluasi.
          </p>

          <div class="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div
              v-for="(scale, index) in form.scales"
              :key="scale.id"
            >
              <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
                {{ getScaleLabel(index) }}<span class="text-[#e30000]">*</span>
              </label>
              <input
                v-model="scale.label"
                type="text"
                :maxlength="nameLimit"
                :placeholder="`Masukkan ${getScaleLabel(index).toLowerCase()} di sini`"
                class="mt-2 h-14 w-full rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5 text-[1.05rem] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
              >
              <p class="mt-2 flex items-center justify-between text-[0.9rem] text-[#98a1b1]">
                <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                <span class="font-semibold">{{ getScaleCount(scale) }}/100</span>
              </p>
              <p v-if="scaleErrors[scale.id]" class="mt-1 text-[0.875rem] text-[#e30000]">
                {{ scaleErrors[scale.id] }}
              </p>
            </div>
          </div>

          <button
            type="button"
            class="mt-6 inline-flex h-14 w-full items-center justify-center rounded-[16px] bg-[#e30000] px-8 text-[1.25rem] font-semibold text-white shadow-[0_10px_20px_rgba(227,0,0,0.22)] transition hover:bg-[#c90000]"
            @click="addScale"
          >
            Tambah Skala
          </button>
        </div>

        <div class="mt-5 rounded-[12px] border border-[#f0a3a3] bg-[#fff3f3] px-4 py-3 text-[#c52222]">
          <p class="text-[0.98rem] leading-relaxed">
            <span class="font-semibold">Catatan:</span>
            {{ props.mode === 'edit'
              ? 'Setelah disimpan, perubahan pada indikator akan langsung diterapkan pada lingkup evaluasi yang menggunakan indikator ini. Pastikan nama, deskripsi, dan pertanyaan kuesioner sudah sesuai sebelum menekan tombol Simpan.'
              : 'Setelah dibuat, indikator evaluasi akan langsung tersedia pada daftar indikator objek evaluasi ini. Pastikan nama, deskripsi, dan tipe evaluasi sudah sesuai sebelum menekan tombol Buat.' }}
          </p>
        </div>

        <p class="mt-4 inline-flex items-center gap-2 text-[0.95rem] text-[#98a1b1]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="9" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2" />
          </svg>
          Terakhir disimpan: {{ detailInfo.lastSavedAt }}
        </p>

        <p class="mt-5 text-center text-[1rem] text-[#6a7384]">
          Butuh Indikator yang terintegrasi GS?
          <NuxtLink :to="indikatorCreatePath" class="text-[#2a64e5] underline">Hubungi Developer</NuxtLink>
        </p>

        <div class="mt-6 flex justify-center">
          <button
            type="submit"
            class="inline-flex h-12 min-w-[160px] items-center justify-center rounded-[18px] bg-[#e30000] px-8 text-[1.25rem] font-semibold text-white shadow-[0_10px_20px_rgba(227,0,0,0.22)] transition hover:bg-[#c90000]"
          >
            {{ submitLabel }}
          </button>
        </div>
      </form>
    </section>
  </section>
</template>
