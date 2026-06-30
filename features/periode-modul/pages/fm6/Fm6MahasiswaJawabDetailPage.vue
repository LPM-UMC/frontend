<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast, useLocalePath } from '#imports'
import { useI18n } from 'vue-i18n'
import { useFm6Repository, type Fm6Context } from '../../composables/useFm6Repository'
import type { Fm6MahasiswaSurveyDetailResponse, Fm6JawabanPayload, Fm6PertanyaanResponse } from '../../services/fm6.api'
import { useFm6Store } from '#stores/fm6'

const route = useRoute()
const router = useRouter()
const repository = useFm6Repository()
const toast = useToast()
const { t } = useI18n()
const localePath = useLocalePath()
const fm6Store = useFm6Store()

const detailData = ref<Fm6MahasiswaSurveyDetailResponse | null>(null)
const answerMap = ref<Record<string, string>>({})
const loading = ref(true)
const attemptedSubmit = ref(false)
const submitting = ref(false)

const periodeModulId = computed(() => route.params.periode_modul_id as string)
const unitId = computed(() => route.params.unit_id as string)
const jawabId = computed(() => route.params.jawab_id as string) // This is the surveyId

const context = computed<Fm6Context>(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

const missingRequiredCount = computed(() => {
  if (!detailData.value) return 0

  return detailData.value.pertanyaans.filter((question: Fm6PertanyaanResponse) => {
    // Semua pertanyaan dianggap wajib
    const value = answerMap.value[question.id] ?? ''
    return value.trim().length === 0
  }).length
})

const isSubmitDisabled = computed(() => {
  if (!detailData.value || detailData.value.sudahDijawab || submitting.value) return true
  return missingRequiredCount.value > 0
})

function buildListRouteWithDoneState() {
  return '/dashboard/survei'
}

function setEssayAnswer(questionId: string, value: string) {
  if (detailData.value?.sudahDijawab) return
  answerMap.value = {
    ...answerMap.value,
    [questionId]: value,
  }
}

function selectChoice(questionId: string, optionId: string) {
  if (detailData.value?.sudahDijawab) return
  answerMap.value = {
    ...answerMap.value,
    [questionId]: optionId,
  }
}

function getEssayLength(questionId: string): number {
  return (answerMap.value[questionId] ?? '').length
}

function isChoiceSelected(questionId: string, optionId: string): boolean {
  return (answerMap.value[questionId] ?? '') === optionId
}

function isQuestionInvalid(question: Fm6PertanyaanResponse): boolean {
  if (!attemptedSubmit.value) return false
  return (answerMap.value[question.id] ?? '').trim().length === 0
}

function toSubmitPayload(): Fm6JawabanPayload {
  if (!detailData.value) return { answers: [] }

  return {
    answers: detailData.value.pertanyaans.map((question: Fm6PertanyaanResponse) => {
      const value = answerMap.value[question.id] ?? ''

      if (question.tipe === 'PILIHAN_GANDA') {
        return {
          pertanyaanId: question.id,
          opsiJawabanId: value || undefined,
        }
      }

      return {
        pertanyaanId: question.id,
        jawabanTeks: value || undefined,
      }
    }),
  }
}

async function submitAnswers() {
  if (!detailData.value || detailData.value.sudahDijawab || submitting.value) return

  attemptedSubmit.value = true
  if (missingRequiredCount.value > 0) {
    toast.add({
      title: 'Validasi Gagal',
      description: 'Mohon lengkapi semua pertanyaan sebelum mengirimkan survei.',
      color: 'warning'
    })
    return
  }

  submitting.value = true
  try {
    const payload = toSubmitPayload()
    await repository.submitJawaban(jawabId.value, payload)
    toast.add({
      title: 'Berhasil',
      description: 'Survei berhasil dikirim.',
      color: 'success'
    })
    await router.push(localePath(buildListRouteWithDoneState() as any))
  } catch (error) {
    console.error('Gagal mengirim jawaban:', error)
  } finally {
    submitting.value = false
  }
}

async function fetchDetail() {
  loading.value = true
  attemptedSubmit.value = false
  try {
    const res = await repository.getMahasiswaSurveyDetail(jawabId.value)
    if (res) {
      detailData.value = res
      
      if (res.sudahDijawab && res.userAnswers) {
        const newAnswerMap: Record<string, string> = {}
        res.userAnswers.forEach((ans) => {
          if (ans.opsiJawabanId) {
            newAnswerMap[ans.pertanyaanId] = ans.opsiJawabanId
          } else if (ans.jawabanTeks) {
            newAnswerMap[ans.pertanyaanId] = ans.jawabanTeks
          }
        })
        answerMap.value = newAnswerMap
      }
    }
  } catch (error) {
    console.error('Gagal memuat detail survei:', error)
  } finally {
    loading.value = false
  }
}

watch(jawabId, () => {
  if (jawabId.value) fetchDetail()
  if (periodeModulId.value && unitId.value) {
    fm6Store.fetchInformasi(periodeModulId.value, unitId.value)
  }
}, { immediate: true })

const breadcrumbItems = computed(() => {
  return [
    {
      label: t('navigasi.dasbor', 'Dasbor'),
      to: '/dashboard',
    },
    {
      label: 'Isi Survei',
      to: '/dashboard/survei',
    },
    {
      label: detailData.value?.judul || 'Pengisian Survei',
      active: true,
    },
  ]
})
</script>

<template>
  <div class="flex h-full flex-col pt-6 sm:pt-10">
    <!-- Header with Breadcrumb -->
    <div dir="ltr" class="flex flex-wrap items-center gap-2 mb-5 px-4 md:px-5 xl:px-6">
      <NuxtLink :to="localePath(buildListRouteWithDoneState() as any)">
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

    <section class="fm6-page mx-auto w-full max-w-[1580px] space-y-4 px-4 pb-7 md:space-y-5 md:px-5 xl:px-6 2xl:max-w-[1660px]">
      <section v-if="detailData" class="space-y-4">
        <section class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-5 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6">
          <h1 class="text-[clamp(1.55rem,2vw,2.65rem)] font-semibold leading-tight text-[#0f1522]">
            {{ detailData.judul }}
          </h1>
          <p class="mt-2 text-[clamp(0.95rem,1vw,1.1rem)] text-[#5b6679]">
            {{ detailData.deskripsi }}
          </p>
        </section>

        <article
          v-if="detailData.sudahDijawab"
          class="rounded-[16px] border border-[#cfd5de] bg-[#eef2f6] px-4 py-4 text-[clamp(0.95rem,1vw,1.1rem)] text-[#4d5a6f] md:px-5 md:py-5"
        >
          Anda sudah mengisi survei ini. Jawaban Anda telah tersimpan dan tidak dapat diubah lagi.
        </article>

        <article
          v-for="question in detailData.pertanyaans"
          :key="question.id"
          class="rounded-[24px] border-2 border-dashed border-[#d6dce4] bg-[#f3f4f6] px-4 py-4 md:px-5 md:py-5 xl:px-6 xl:py-6"
        >
          <div class="flex items-start gap-3.5 md:gap-4">
            <span class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff1425] text-[1.3rem] font-medium text-white shadow-[0_8px_16px_rgba(255,20,37,0.24)] md:h-12 md:w-12 md:text-[1.6rem]">
              {{ question.urutan }}
            </span>

            <div class="min-w-0 flex-1">
              <h2 class="text-[clamp(1.2rem,1.45vw,1.95rem)] font-semibold leading-tight text-[#2c374a]">
                {{ question.pertanyaan }}
              </h2>
              <p class="mt-1 text-[clamp(0.98rem,1vw,1.2rem)] text-[#ef0010]">
                * Wajib diisi
              </p>
            </div>
          </div>

          <template v-if="question.tipe === 'PILIHAN_GANDA'">
            <div class="mt-4 space-y-3">
              <button
                v-for="option in question.opsiJawabans"
                :key="option.id"
                type="button"
                class="flex h-[66px] w-full items-center gap-3 rounded-[22px] border px-4 text-left transition md:h-[74px] md:gap-4 md:rounded-[24px] md:px-5"
                :class="[
                  isChoiceSelected(question.id, option.id)
                    ? 'border-[#e10000] bg-[#fff0f0]'
                    : 'border-[#c1c8d2] bg-[#f0f2f5]',
                  isQuestionInvalid(question) ? 'border-[#ed4040]' : '',
                ]"
                :disabled="detailData.sudahDijawab"
                @click="selectChoice(question.id, option.id)"
              >
                <span
                  class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition md:h-9 md:w-9"
                  :class="isChoiceSelected(question.id, option.id) ? 'bg-[#ef0010]' : 'bg-[#4b4d52]'"
                >
                  <span v-if="isChoiceSelected(question.id, option.id)" class="h-3 w-3 rounded-full bg-white" />
                </span>

                <span class="text-[clamp(1.02rem,1.2vw,1.45rem)] font-medium text-[#3b4558]">
                  {{ option.label }}
                </span>
              </button>
            </div>
          </template>

          <template v-else>
            <div class="mt-4">
              <textarea
                :value="answerMap[question.id] ?? ''"
                :placeholder="question.placeholder || 'Ketikkan jawaban Anda di sini...'"
                :disabled="detailData.sudahDijawab"
                rows="7"
                class="w-full rounded-[22px] border border-[#c1c8d2] bg-[#f0f2f5] px-4 py-3.5 text-[clamp(1rem,1.08vw,1.25rem)] text-[#3f4754] outline-none placeholder:text-[#a4adbb] md:rounded-[24px] md:px-5 md:py-4"
                :class="isQuestionInvalid(question) ? 'border-[#ed4040]' : ''"
                @input="setEssayAnswer(question.id, ($event.target as HTMLTextAreaElement).value)"
              />

              <div class="mt-3 flex items-center justify-between text-[clamp(0.9rem,0.95vw,1.02rem)] text-[#9aa3b3]">
                <span>Gunakan bahasa yang sopan dan jelas.</span>
              </div>
            </div>
          </template>
        </article>

        <section
          v-if="!detailData.sudahDijawab"
          class="rounded-[20px] border border-[#f0cb76] bg-[#fff4d8] px-4 py-3.5 text-[clamp(1rem,1.1vw,1.22rem)] text-[#be6808] md:px-5 md:py-4"
        >
          <p class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 text-[#f0a000] md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z" />
            </svg>
            Pastikan seluruh data sudah benar sebelum dikirimkan. Survei yang sudah dikirim tidak dapat diubah lagi.
          </p>
        </section>

        <section
          v-if="!detailData.sudahDijawab"
          class="grid gap-4 rounded-[22px] border border-[#f1d2d2] bg-[#f8f8f8] px-4 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:px-6 md:py-5"
        >
          <div>
            <h3 class="text-[clamp(1.25rem,1.45vw,1.7rem)] font-medium text-[#4a5669]">
              Selesaikan Survei
            </h3>
            <p class="mt-1 text-[clamp(0.98rem,1.02vw,1.15rem)] text-[#7b8597]">
              Kirim jawaban Anda sekarang
            </p>
          </div>

          <button
            type="button"
            class="inline-flex h-[58px] items-center justify-center gap-2.5 rounded-[22px] px-6 text-[clamp(1.15rem,1.2vw,1.45rem)] font-semibold text-white transition md:h-[64px] md:min-w-[280px] md:rounded-[24px] md:px-7"
            :class="isSubmitDisabled ? 'cursor-not-allowed bg-[#f4a8a8] opacity-75' : 'bg-[linear-gradient(180deg,#ef0000_0%,#d30000_100%)] hover:brightness-95'"
            :disabled="isSubmitDisabled"
            @click="submitAnswers"
          >
            {{ submitting ? 'Mengirim...' : 'Kirim Jawaban' }}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.1">
              <path stroke-linecap="round" stroke-linejoin="round" d="m22 2-7 20-4-9-9-4 20-7zM22 2l-11 11" />
            </svg>
          </button>
        </section>
      </section>

      <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
        Memuat pertanyaan survei...
      </section>
    </section>
  </div>
</template>
