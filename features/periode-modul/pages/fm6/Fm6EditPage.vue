<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '#stores/auth'
import { useToast, useLocalePath } from '#imports'
import { useI18n } from 'vue-i18n'
import { useFm6Repository, type Fm6Context } from '../../composables/useFm6Repository'
import { useFm6Store } from '#stores/fm6'
import type { Fm6CreateDataResponse, Fm6CreatePayload, Fm6PertanyaanPayload, TipePertanyaan, Fm6PertanyaanResponse, Fm6OpsiJawabanResponse } from '../../services/fm6.api'


interface QuestionBlock {
  localId: string
  urutan: number
  pertanyaan: string
  tipe: TipePertanyaan
  placeholder: string
  opsiJawabans: { localId: string; label: string; bobot: number }[]
}

const route = useRoute()
const router = useRouter()
const repository = useFm6Repository()
const { t } = useI18n()
const localePath = useLocalePath()
const authStore = useAuthStore()
const toast = useToast()
const fm6Store = useFm6Store()

const loading = ref(true)
const submitting = ref(false)
const createData = ref<Fm6CreateDataResponse | null>(null)

const form = reactive({
  judul: '',
  deskripsi: '',
})

const questions = ref<QuestionBlock[]>([])

const periodeModulId = computed(() => route.params.periode_modul_id as string)
const unitId = computed(() => route.params.unit_id as string)
const surveyId = computed(() => route.params.survey_id as string)

const context = computed<Fm6Context>(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

onMounted(() => {
  const role = authStore.activeRole?.kode
  if (role !== 'admin-lpm' && role !== 'lpm' && role !== 'ketua-lpm') {
    router.replace(buildDashboardRoute())
  }
})

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function createDefaultOptions(): QuestionBlock['opsiJawabans'] {
  return [
    { localId: generateId('opt'), label: 'Sangat Tidak Setuju', bobot: 1 },
    { localId: generateId('opt'), label: 'Tidak Setuju', bobot: 2 },
    { localId: generateId('opt'), label: 'Setuju', bobot: 3 },
    { localId: generateId('opt'), label: 'Sangat Setuju', bobot: 4 },
  ]
}

function addQuestion() {
  questions.value.push({
    localId: generateId('q'),
    urutan: questions.value.length + 1,
    pertanyaan: '',
    tipe: 'PILIHAN_GANDA',
    placeholder: '',
    opsiJawabans: createDefaultOptions(),
  })
}

function removeQuestion(localId: string) {
  questions.value = questions.value.filter((q) => q.localId !== localId)
  if (questions.value.length === 0) {
    addQuestion()
  }
  resequence()
}

function resequence() {
  questions.value.forEach((q, i) => {
    q.urutan = i + 1
  })
}

function handleTypeChange(localId: string, newType: TipePertanyaan) {
  const q = questions.value.find((item) => item.localId === localId)
  if (!q) return
  q.tipe = newType
  if (newType === 'PILIHAN_GANDA' && q.opsiJawabans.length === 0) {
    q.opsiJawabans = createDefaultOptions()
  } else if (newType === 'ESAI') {
    q.opsiJawabans = []
  }
}

function addOption(questionLocalId: string) {
  const q = questions.value.find((item) => item.localId === questionLocalId)
  if (!q) return
  const nextBobot = q.opsiJawabans.length > 0 ? Math.max(...q.opsiJawabans.map(o => o.bobot)) + 1 : 1
  q.opsiJawabans.push({ localId: generateId('opt'), label: '', bobot: nextBobot })
}

function removeOption(questionLocalId: string, optionLocalId: string) {
  const q = questions.value.find((item) => item.localId === questionLocalId)
  if (!q) return
  q.opsiJawabans = q.opsiJawabans.filter((o) => o.localId !== optionLocalId)
}

function buildDashboardRoute() {
  return {
    name: 'dashboard-periode-modul-periode_modul_id-unit-unit_id-fm6',
    params: {
      periode_modul_id: periodeModulId.value,
      unit_id: unitId.value
    }
  }
}

function buildDetailRoute(detailId: string) {
  return {
    name: 'dashboard-periode-modul-periode_modul_id-unit-unit_id-fm6-detail-detail_id',
    params: {
      periode_modul_id: periodeModulId.value,
      unit_id: unitId.value,
      detail_id: detailId
    }
  }
}

const canSubmit = computed(() => {
  if (!form.judul.trim() || !form.deskripsi.trim()) return false
  if (questions.value.length === 0) return false
  return questions.value.every((q) => {
    if (!q.pertanyaan.trim()) return false
    if (q.tipe === 'PILIHAN_GANDA' && q.opsiJawabans.length < 2) return false
    if (q.tipe === 'PILIHAN_GANDA' && q.opsiJawabans.some((o) => !o.label.trim())) return false
    return true
  })
})

async function handleSubmit() {
  if (!canSubmit.value || submitting.value) return

  submitting.value = true
  try {
    const payload: Fm6CreatePayload = {
      judul: form.judul.trim(),
      deskripsi: form.deskripsi.trim(),
      pertanyaans: questions.value.map((q): Fm6PertanyaanPayload => ({
        urutan: q.urutan,
        pertanyaan: q.pertanyaan.trim(),
        tipe: q.tipe,
        placeholder: q.tipe === 'ESAI' ? q.placeholder || undefined : undefined,
        opsiJawabans: q.tipe === 'PILIHAN_GANDA'
          ? q.opsiJawabans.map((o) => ({ label: o.label, bobot: o.bobot }))
          : undefined,
      })),
    }

    const result = await repository.updateSurvey(surveyId.value, payload)
    if (result) {
      toast.add({
        title: 'Berhasil',
        description: 'Perubahan survei berhasil disimpan.',
        color: 'success',
      })
      await router.push(localePath(buildDetailRoute(surveyId.value) as any))
    }
  } catch (error) {
    console.error('Gagal membuat survei:', error)
  } finally {
    submitting.value = false
  }
}

async function fetchCreateData() {
  loading.value = true
  try {
    const [resCreate, resDetail] = await Promise.all([
      repository.getCreatePageData(context.value),
      repository.getDetailData(surveyId.value)
    ])
    
    if (resCreate) {
      createData.value = resCreate
    }
    
    if (resDetail) {
      if (resDetail.status !== 'DRAFT') {
        router.replace(localePath(buildDetailRoute(surveyId.value) as any))
        return
      }

      form.judul = resDetail.judul
      form.deskripsi = resDetail.deskripsi
      
      questions.value = resDetail.pertanyaans.map((q: Fm6PertanyaanResponse) => ({
        localId: generateId('q'),
        urutan: q.urutan,
        pertanyaan: q.pertanyaan,
        tipe: q.tipe,
        placeholder: q.placeholder || '',
        opsiJawabans: q.opsiJawabans.map((o: Fm6OpsiJawabanResponse) => ({
          localId: generateId('opt'),
          label: o.label,
          bobot: o.bobot
        }))
      }))
    }
    if (questions.value.length === 0) {
      addQuestion()
    }
  } catch (error) {
    console.error('Gagal memuat data form:', error)
  } finally {
    loading.value = false
  }
}

watch(context, () => {
  fetchCreateData()
  if (periodeModulId.value && unitId.value) {
    fm6Store.fetchInformasi(periodeModulId.value, unitId.value)
  }
}, { immediate: true })

const breadcrumbItems = computed(() => {
  const isAmi = fm6Store.informasi?.periode_modul?.modul?.tipe_modul?.kode === 'AMI'
  const namaModul = fm6Store.informasi?.periode_modul?.modul?.nama || 'Form Survei'
  
  return [
    {
      label: t('navigasi.dasbor', 'Dasbor'),
      to: '/dashboard',
    },
    {
      label: isAmi ? t('ami.judul', 'AMI') : t('monev.judul', 'Monitoring dan Evaluasi'),
      to: isAmi ? '/dashboard/ami' : '/dashboard/monev',
    },
    {
      label: namaModul,
      to: buildDashboardRoute(),
    },
    {
      label: 'Edit Survei',
      active: true,
    },
  ]
})
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Header with Breadcrumb -->
    <div dir="ltr" class="flex flex-wrap items-center gap-2 mb-5 px-4 md:px-5 xl:px-6 pt-4">
      <NuxtLink :to="localePath(buildDashboardRoute() as any)">
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
          <NuxtLink v-if="item.to" :to="localePath(item.to as any)" class="text-[#9aa2b1] transition hover:text-[#6e7788] hover:underline">
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

    <section class="fm6-page mx-auto w-full max-w-[1600px] space-y-4 px-4 pb-7 md:space-y-5 md:px-5 2xl:max-w-[1720px] xl:px-6">
      <!-- Intro Card -->
      <section v-if="createData" class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-5 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6">
        <h1 class="text-[clamp(1.5rem,1.9vw,2.2rem)] font-semibold leading-tight text-[#10131b]">
          {{ t('fm6.edit.title', 'Edit Survei') }}
        </h1>
        <p class="mt-3 max-w-[1400px] text-[clamp(0.92rem,0.98vw,1.08rem)] leading-relaxed text-[#5b6679]">
          Buat template survei untuk program studi <strong class="text-[#d50000]">{{ createData.unit.nama }}</strong> pada periode <strong>{{ createData.periode.tahun_ajaran }} — {{ createData.periode.semester }}</strong>.
        </p>
      </section>

      <!-- Form Builder -->
      <section v-if="createData" class="space-y-4">
        <section class="rounded-[22px] border-2 border-dashed border-[#d6dae2] bg-[#f7f7f8] px-4 py-5 shadow-[0_10px_20px_rgba(15,23,42,0.1)] md:px-6 md:py-6">
          <h2 class="text-[clamp(1.5rem,1.9vw,2.2rem)] font-semibold text-[#121722]">
            {{ t('fm6.create.basicInfo', 'Informasi Survei') }}
          </h2>

          <form class="mx-auto mt-5 w-full max-w-[1180px] rounded-[22px] border-2 border-dashed border-[#d6dae2] bg-[#f6f6f7] px-4 py-5 md:px-6 md:py-6" @submit.prevent="handleSubmit">
            <div class="mt-2 space-y-4">
              <!-- Judul Survei -->
              <div>
                <label class="text-[clamp(1rem,1.05vw,1.12rem)] font-semibold text-[#445066]">
                  {{ t('fm6.create.surveyTitle', 'Judul Survei') }} <span class="text-[#df0000]">*</span>
                </label>
                <input
                  v-model="form.judul"
                  type="text"
                  maxlength="255"
                  placeholder="Masukkan judul survei..."
                  class="mt-2 h-[52px] w-full rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#1d2430] outline-none placeholder:text-[#98a2b3]"
                >
                <div class="mt-2 flex items-center justify-between text-[0.95rem] text-[#8b95a7]">
                  <span>Maks. 255 karakter</span>
                  <span class="font-semibold">{{ form.judul.length }}/255</span>
                </div>
              </div>

              <!-- Program Studi (Auto-detected) -->
              <div>
                <label class="text-[clamp(1rem,1.05vw,1.12rem)] font-semibold text-[#445066]">
                  Program Studi
                </label>
                <div class="mt-2 flex h-[52px] w-full items-center rounded-[18px] border border-[#cfd5de] bg-[#e8e8ea] px-4 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#3b4050] font-medium">
                  {{ createData.unit.nama }}
                </div>
                <p class="mt-2 text-[0.9rem] text-[#8b95a7]">
                  Program studi otomatis berdasarkan unit yang dipilih
                </p>
              </div>

              <!-- Deskripsi -->
              <div>
                <label class="text-[clamp(1rem,1.05vw,1.12rem)] font-semibold text-[#445066]">
                  {{ t('fm6.create.description', 'Deskripsi') }} <span class="text-[#df0000]">*</span>
                </label>
                <textarea
                  v-model="form.deskripsi"
                  rows="4"
                  maxlength="2000"
                  placeholder="Jelaskan tujuan dan cakupan survei ini..."
                  class="mt-2 w-full rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 py-3 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#1d2430] outline-none placeholder:text-[#98a2b3]"
                />
                <div class="mt-2 flex items-center justify-between text-[0.95rem] text-[#8b95a7]">
                  <span>Maks. 2000 karakter</span>
                  <span class="font-semibold">{{ form.deskripsi.length }}/2000</span>
                </div>
              </div>
            </div>
          </form>
        </section>

        <!-- Question Cards -->
        <article
          v-for="question in questions"
          :key="question.localId"
          class="rounded-[22px] border-2 border-dashed border-[#d6dae2] bg-[#f7f7f8] px-4 py-5 shadow-[0_10px_20px_rgba(15,23,42,0.1)] md:px-6 md:py-6"
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ef0010] text-[1.1rem] font-semibold text-white shadow-[0_6px_12px_rgba(239,0,16,0.28)]">
                {{ question.urutan }}
              </span>
              <h3 class="text-[clamp(1.25rem,1.5vw,1.75rem)] font-semibold text-[#374356]">
                Pertanyaan {{ question.urutan }}
              </h3>
            </div>

            <button
              type="button"
              class="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#ed1020] transition hover:bg-[#ffe9e9]"
              @click="removeQuestion(question.localId)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16m-1 0-.8 12.2a2 2 0 0 1-2 1.8H8.6a2 2 0 0 1-2-1.8L5.8 7m3.2 0V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" />
              </svg>
            </button>
          </div>

          <div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
            <!-- Pertanyaan -->
            <div>
              <label class="text-[clamp(0.98rem,1vw,1.05rem)] font-semibold text-[#445066]">
                {{ t('fm6.create.questionText', 'Pertanyaan') }} <span class="text-[#df0000]">*</span>
              </label>
              <input
                v-model="question.pertanyaan"
                type="text"
                :placeholder="t('fm6.create.questionPlaceholder', 'Tuliskan pertanyaan...')"
                class="mt-2 h-[50px] w-full rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#1d2430] outline-none placeholder:text-[#98a2b3]"
              >
            </div>

            <!-- Tipe Pertanyaan -->
            <div>
              <label class="text-[clamp(0.98rem,1vw,1.05rem)] font-semibold text-[#445066]">
                Tipe
              </label>
              <label class="relative mt-2 block">
                <select
                  :value="question.tipe"
                  class="h-[50px] w-full appearance-none rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 pr-11 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#1d2430] outline-none"
                  @change="handleTypeChange(question.localId, ($event.target as HTMLSelectElement).value as TipePertanyaan)"
                >
                  <option v-for="t in (createData?.tipePertanyaan || [])" :key="t.value" :value="t.value">
                    {{ t.label }}
                  </option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#2e3440]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </label>
            </div>
          </div>

          <!-- Multiple Choice Options -->
          <template v-if="question.tipe === 'PILIHAN_GANDA'">
            <p class="mt-4 text-[clamp(0.98rem,1vw,1.05rem)] font-semibold text-[#445066]">
              Opsi Jawaban
            </p>

            <div class="mt-2 space-y-3">
              <div
                v-for="(option, index) in question.opsiJawabans"
                :key="option.localId"
                class="grid grid-cols-[36px_minmax(0,1fr)_90px_36px] items-center gap-3 md:grid-cols-[42px_minmax(0,1fr)_108px_42px]"
              >
                <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ffdada] text-[1rem] font-semibold text-[#d7212b] md:h-10 md:w-10">
                  {{ index + 1 }}
                </span>

                <input
                  v-model="option.label"
                  type="text"
                  placeholder="Label opsi..."
                  class="h-[50px] rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#1d2430] outline-none"
                >

                <div class="inline-flex h-[50px] items-center justify-center rounded-[18px] border border-[#f1c2c2] bg-[#fff3f3] px-2 text-[clamp(0.9rem,0.95vw,1rem)] font-medium text-[#626d80]">
                  Bobot: <strong class="ml-1 text-[#df0000]">{{ option.bobot }}</strong>
                </div>

                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#999] transition hover:bg-[#ffe5e5] hover:text-[#d00] md:h-10 md:w-10"
                  @click="removeOption(question.localId, option.localId)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="button"
              class="mt-3 inline-flex items-center gap-2 rounded-[14px] border border-dashed border-[#ccc] px-4 py-2 text-[0.92rem] font-medium text-[#5c687b] transition hover:bg-[#f0f0f2]"
              @click="addOption(question.localId)"
            >
              + Tambah Opsi
            </button>
          </template>

          <!-- Essay Placeholder -->
          <template v-else>
            <p class="mt-4 text-[clamp(0.98rem,1vw,1.05rem)] font-semibold text-[#445066]">
              Placeholder Jawaban Esai
            </p>
            <textarea
              v-model="question.placeholder"
              rows="3"
              placeholder="Masukkan placeholder untuk jawaban esai..."
              class="mt-2 w-full rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 py-3 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#1d2430] outline-none placeholder:text-[#98a2b3]"
            />
          </template>
        </article>

        <!-- Action Buttons -->
        <section class="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            class="inline-flex h-[52px] min-w-[210px] items-center justify-center rounded-[18px] border-2 border-[#1f2937] bg-[#f8f9fa] px-6 text-[clamp(1.05rem,1.12vw,1.25rem)] font-bold text-[#1f2937] shadow-[0_5px_15px_rgba(31,41,55,0.15)] transition hover:bg-[#e2e8f0] disabled:cursor-not-allowed disabled:opacity-50"
            @click="addQuestion"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {{ t('fm6.create.addQuestion', 'Tambah Pertanyaan') }}
          </button>

          <button
            type="button"
            :disabled="!canSubmit || submitting"
            class="inline-flex h-[52px] min-w-[210px] items-center justify-center rounded-[18px] bg-[linear-gradient(180deg,#ef0000_0%,#d30000_100%)] px-6 text-[clamp(1.05rem,1.12vw,1.25rem)] font-bold text-white shadow-[0_5px_15px_rgba(227,0,0,0.35)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            @click="handleSubmit"
          >
            {{ submitting ? t('fm6.create.saving', 'Menyimpan...') : t('fm6.edit.save', 'Simpan Perubahan') }}
          </button>
        </section>
      </section>

      <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
        Memuat form survei...
      </section>
    </section>
  </div>
</template>
