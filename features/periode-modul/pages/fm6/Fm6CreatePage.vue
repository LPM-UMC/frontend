<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import { useFm6AdminRepository } from '#features/periode-modul/composables/useFm6AdminRepository'
import {
  FM6_ACTIVE_DUMMY_ROLE,
  type Fm6AdminRole,
  type Fm6CreateChoiceOption,
  type Fm6CreatePageDummyData,
  type Fm6CreateQuestionBlock,
  type Fm6CreateTemplatePayload,
  type Fm6DashboardContext,
  type Fm6QuestionType,
} from '#features/periode-modul/data/fm6AdminDummy'

interface Fm6CreateFormState {
  surveyTitle: string
  programStudiId: string
  description: string
}

const route = useRoute()
const repository = useFm6AdminRepository('auto')

const activeDummyRole = ref<Fm6AdminRole>(FM6_ACTIVE_DUMMY_ROLE)
const createPageData = ref<Fm6CreatePageDummyData | null>(null)
const loading = ref(true)

const form = reactive<Fm6CreateFormState>({
  surveyTitle: '',
  programStudiId: '',
  description: '',
})

const questions = ref<Fm6CreateQuestionBlock[]>([])

function generateLocalId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 10)
  return `${prefix}-${Date.now()}-${random}`
}

function normalizeRouteParam(value: string | string[] | undefined, fallbackValue: string): string {
  if (!value) return fallbackValue
  if (Array.isArray(value)) return value[0] ?? fallbackValue
  return value
}

const periodeModulId = computed(() =>
  normalizeRouteParam(
    route.params.periode_modul_id as string | string[] | undefined,
    'pm-2026-genap'
  )
)

const unitId = computed(() =>
  normalizeRouteParam(
    route.params.unit_id as string | string[] | undefined,
    'unit-tif'
  )
)

const context = computed<Fm6DashboardContext>(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

const selectedProgramLabel = computed(() => {
  if (!createPageData.value || !form.programStudiId) return ''
  const selected = createPageData.value.programStudiOptions.find((item) => item.id === form.programStudiId)
  return selected?.label ?? ''
})

const surveyTitleCount = computed(() => form.surveyTitle.length)
const programCount = computed(() => selectedProgramLabel.value.length)
const descriptionCount = computed(() => form.description.length)

function createDefaultChoiceOptions(): Fm6CreateChoiceOption[] {
  return [
    { id: generateLocalId('choice'), label: 'Sangat Tidak Setuju', weight: 1 },
    { id: generateLocalId('choice'), label: 'Tidak Setuju', weight: 2 },
    { id: generateLocalId('choice'), label: 'Setuju', weight: 3 },
    { id: generateLocalId('choice'), label: 'Sangat Setuju', weight: 4 },
  ]
}

function cloneQuestion(question: Fm6CreateQuestionBlock): Fm6CreateQuestionBlock {
  return {
    ...question,
    options: question.options.map((option) => ({ ...option })),
  }
}

function resequenceQuestionOrder() {
  questions.value = questions.value.map((question, index) => ({
    ...question,
    order: index + 1,
  }))
}

function ensureQuestionOptions(question: Fm6CreateQuestionBlock) {
  if (question.type === 'multiple_choice' && question.options.length === 0) {
    question.options = createDefaultChoiceOptions()
    return
  }

  if (question.type === 'essay') {
    question.options = []
  }
}

function handleQuestionTypeChange(questionId: string, nextType: Fm6QuestionType) {
  const target = questions.value.find((item) => item.id === questionId)
  if (!target) return

  target.type = nextType
  ensureQuestionOptions(target)
}

function addQuestion() {
  const aspectId = createPageData.value?.aspectOptions[0]?.id ?? ''

  questions.value.push({
    id: generateLocalId('fm6-question'),
    order: questions.value.length + 1,
    title: '',
    type: 'multiple_choice',
    aspectId,
    options: createDefaultChoiceOptions(),
  })
}

function removeQuestion(questionId: string) {
  questions.value = questions.value.filter((item) => item.id !== questionId)

  if (questions.value.length === 0) {
    addQuestion()
  } else {
    resequenceQuestionOrder()
  }
}

function resolveQuestionTypeLabel(type: Fm6QuestionType): string {
  if (!createPageData.value) return ''
  const selected = createPageData.value.questionTypeOptions.find((item) => item.value === type)
  return selected?.label ?? ''
}

function resolveAspectLabel(aspectId: string): string {
  if (!createPageData.value) return ''
  const selected = createPageData.value.aspectOptions.find((item) => item.id === aspectId)
  return selected?.label ?? ''
}

function buildDetailRoute(detailId: string): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm6/detail/${encodeURIComponent(detailId)}`
}

async function handleSubmit() {
  if (!createPageData.value) return

  const payload: Fm6CreateTemplatePayload = {
    surveyTitle: form.surveyTitle.trim(),
    programStudiId: form.programStudiId,
    description: form.description.trim(),
    questions: questions.value.map((question) => ({
      order: question.order,
      question: question.title.trim(),
      type: question.type,
      aspectId: question.aspectId,
      choices:
        question.type === 'multiple_choice'
          ? question.options.map((option) => ({
              label: option.label,
              weight: option.weight,
            }))
          : undefined,
      essayPlaceholder: question.type === 'essay' ? question.essayPlaceholder : undefined,
    })),
  }

  const result = await repository.createTemplate(context.value, payload)
  await navigateTo(buildDetailRoute(result.id))
}

watch(
  [context, activeDummyRole],
  async ([nextContext, nextRole]) => {
    loading.value = true
    createPageData.value = await repository.getCreatePageData(nextContext, nextRole)

    form.surveyTitle = createPageData.value.defaultSurveyTitle
    form.programStudiId = createPageData.value.defaultProgramStudiId
    form.description = createPageData.value.defaultDescription

    questions.value = createPageData.value.questions.map((question) => cloneQuestion(question))
    questions.value.forEach((question) => ensureQuestionOptions(question))
    resequenceQuestionOrder()
    loading.value = false
  },
  { immediate: true }
)
</script>

<template>
  <section class="fm6-page mx-auto w-full max-w-[1600px] space-y-4 px-4 pb-7 pt-4 md:space-y-5 md:px-5 2xl:max-w-[1720px] xl:px-6">
    <section
      v-if="createPageData"
      class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-5 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6"
    >
      <h1 class="text-[clamp(1.5rem,1.9vw,2.2rem)] font-semibold leading-tight text-[#10131b]">
        {{ createPageData.introCard.title }}
      </h1>
      <p class="mt-3 max-w-[1400px] text-[clamp(0.92rem,0.98vw,1.08rem)] leading-relaxed text-[#5b6679]">
        {{ createPageData.introCard.description }}
      </p>
    </section>

    <section
      v-if="createPageData && createPageData.showBuilder"
      class="space-y-4"
    >
      <section class="rounded-[22px] border-2 border-dashed border-[#d6dae2] bg-[#f7f7f8] px-4 py-5 shadow-[0_10px_20px_rgba(15,23,42,0.1)] md:px-6 md:py-6">
        <h2 class="text-[clamp(1.5rem,1.9vw,2.2rem)] font-semibold text-[#121722]">
          {{ createPageData.templateForm.pageTitle }}
        </h2>

        <form class="mx-auto mt-5 w-full max-w-[1180px] rounded-[22px] border-2 border-dashed border-[#d6dae2] bg-[#f6f6f7] px-4 py-5 md:px-6 md:py-6" @submit.prevent="handleSubmit">
          <h3 class="text-center text-[clamp(1.35rem,1.65vw,2rem)] font-semibold text-[#151922]">
            {{ createPageData.templateForm.formTitle }}
          </h3>

          <div class="mt-6 space-y-4">
            <div>
              <label class="text-[clamp(1rem,1.05vw,1.12rem)] font-semibold text-[#445066]">
                {{ createPageData.templateForm.surveyTitleLabel }} <span class="text-[#df0000]">*</span>
              </label>
              <input
                v-model="form.surveyTitle"
                type="text"
                maxlength="100"
                :placeholder="createPageData.templateForm.surveyTitlePlaceholder"
                class="mt-2 h-[52px] w-full rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#1d2430] outline-none placeholder:text-[#98a2b3]"
              >
              <div class="mt-2 flex items-center justify-between text-[0.95rem] text-[#8b95a7]">
                <span>{{ createPageData.templateForm.maxLengthHint }}</span>
                <span class="font-semibold">{{ surveyTitleCount }}/100</span>
              </div>
            </div>

            <div>
              <label class="text-[clamp(1rem,1.05vw,1.12rem)] font-semibold text-[#445066]">
                {{ createPageData.templateForm.programStudiLabel }}
              </label>
              <label class="relative mt-2 block">
                <select
                  v-model="form.programStudiId"
                  class="h-[52px] w-full appearance-none rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 pr-11 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#1d2430] outline-none"
                >
                  <option disabled value="">{{ createPageData.templateForm.programStudiPlaceholder }}</option>
                  <option
                    v-for="option in createPageData.programStudiOptions"
                    :key="option.id"
                    :value="option.id"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#2e3440]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </label>
              <div class="mt-2 flex items-center justify-between text-[0.95rem] text-[#8b95a7]">
                <span>{{ createPageData.templateForm.maxLengthHint }}</span>
                <span class="font-semibold">{{ programCount }}/100</span>
              </div>
            </div>

            <div>
              <label class="text-[clamp(1rem,1.05vw,1.12rem)] font-semibold text-[#445066]">
                {{ createPageData.templateForm.deskripsiLabel }}<span class="text-[#df0000]">*</span>
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                maxlength="100"
                :placeholder="createPageData.templateForm.deskripsiPlaceholder"
                class="mt-2 w-full rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 py-3 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#1d2430] outline-none placeholder:text-[#98a2b3]"
              />
              <div class="mt-2 flex items-center justify-between text-[0.95rem] text-[#8b95a7]">
                <span>{{ createPageData.templateForm.maxLengthHint }}</span>
                <span class="font-semibold">{{ descriptionCount }}/100</span>
              </div>
            </div>
          </div>

          <article class="mt-4 rounded-[14px] border border-[#f0a4a4] bg-[#fbefef] px-4 py-3 text-[#c91f1f]">
            <p class="flex items-center gap-2 text-[clamp(0.95rem,1vw,1.05rem)]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01" />
              </svg>
              <strong>{{ createPageData.templateForm.warningLabel }}:</strong>
              <span>{{ createPageData.templateForm.warningMessage }}</span>
            </p>
          </article>

          <p class="mt-4 flex items-center gap-2 text-[0.95rem] text-[#8b95a7]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="9" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l2.5 2.5" />
            </svg>
            {{ createPageData.templateForm.lastSavedAt }}
          </p>
        </form>
      </section>

      <article
        v-for="question in questions"
        :key="question.id"
        class="rounded-[22px] border-2 border-dashed border-[#d6dae2] bg-[#f7f7f8] px-4 py-5 shadow-[0_10px_20px_rgba(15,23,42,0.1)] md:px-6 md:py-6"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ef0010] text-[1.1rem] font-semibold text-white shadow-[0_6px_12px_rgba(239,0,16,0.28)]">
              {{ question.order }}
            </span>
            <h3 class="text-[clamp(1.25rem,1.5vw,1.75rem)] font-semibold text-[#374356]">
              {{ createPageData.templateForm.questionTitlePrefix }} {{ question.order }} / Indikator
            </h3>
          </div>

          <div class="flex items-center gap-2 text-[clamp(1rem,1.05vw,1.12rem)] text-[#677286]">
            <span>{{ createPageData.templateForm.questionTypeLabel }}</span>
            <button
              type="button"
              class="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#ed1020] transition hover:bg-[#ffe9e9]"
              @click="removeQuestion(question.id)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16m-1 0-.8 12.2a2 2 0 0 1-2 1.8H8.6a2 2 0 0 1-2-1.8L5.8 7m3.2 0V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" />
              </svg>
            </button>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div>
            <label class="text-[clamp(0.98rem,1vw,1.05rem)] font-semibold text-[#445066]">
              {{ createPageData.templateForm.questionLabel }}
            </label>
            <input
              v-model="question.title"
              type="text"
              :placeholder="createPageData.templateForm.questionPlaceholder"
              class="mt-2 h-[50px] w-full rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#1d2430] outline-none placeholder:text-[#98a2b3]"
            >
          </div>

          <div>
            <label class="text-[clamp(0.98rem,1vw,1.05rem)] font-semibold text-[#445066]">
              {{ createPageData.templateForm.questionTypeLabel }}
            </label>
            <label class="relative mt-2 block">
              <select
                :value="question.type"
                class="h-[50px] w-full appearance-none rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 pr-11 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#1d2430] outline-none"
                @change="handleQuestionTypeChange(question.id, ($event.target as HTMLSelectElement).value as Fm6QuestionType)"
              >
                <option
                  v-for="option in createPageData.questionTypeOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#2e3440]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
              </svg>
            </label>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div>
            <label class="text-[clamp(0.98rem,1vw,1.05rem)] font-semibold text-[#445066]">
              {{ createPageData.templateForm.aspectLabel }}
            </label>
            <label class="relative mt-2 block">
              <select
                v-model="question.aspectId"
                class="h-[50px] w-full appearance-none rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 pr-11 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#1d2430] outline-none"
              >
                <option
                  v-for="option in createPageData.aspectOptions"
                  :key="option.id"
                  :value="option.id"
                >
                  {{ option.label }}
                </option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-7 w-7 -translate-y-1/2 text-[#2e3440]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
              </svg>
            </label>
          </div>

          <div class="self-center text-[0.95rem] text-[#7e8797]">
            <p>
              {{ createPageData.templateForm.questionTypeLabel }}: <strong class="text-[#4b5565]">{{ resolveQuestionTypeLabel(question.type) }}</strong>
            </p>
            <p class="mt-1">
              {{ createPageData.templateForm.aspectLabel }}: <strong class="text-[#4b5565]">{{ resolveAspectLabel(question.aspectId) }}</strong>
            </p>
          </div>
        </div>

        <template v-if="question.type === 'multiple_choice'">
          <p class="mt-4 text-[clamp(0.98rem,1vw,1.05rem)] font-semibold text-[#445066]">
            {{ createPageData.templateForm.answerOptionLabel }}
          </p>

          <div class="mt-2 space-y-3">
            <div
              v-for="(option, index) in question.options"
              :key="option.id"
              class="grid grid-cols-[36px_minmax(0,1fr)_90px] items-center gap-3 md:grid-cols-[42px_minmax(0,1fr)_108px]"
            >
              <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ffdada] text-[1rem] font-semibold text-[#d7212b] md:h-10 md:w-10">
                {{ index + 1 }}
              </span>

              <input
                v-model="option.label"
                type="text"
                class="h-[50px] rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#1d2430] outline-none"
              >

              <div class="inline-flex h-[50px] items-center justify-center rounded-[18px] border border-[#f1c2c2] bg-[#fff3f3] px-2 text-[clamp(0.9rem,0.95vw,1rem)] font-medium text-[#626d80]">
                Bobot: <strong class="ml-1 text-[#df0000]">{{ option.weight }}</strong>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <p class="mt-4 text-[clamp(0.98rem,1vw,1.05rem)] font-semibold text-[#445066]">
            {{ createPageData.templateForm.essayAnswerLabel }}
          </p>
          <textarea
            v-model="question.essayPlaceholder"
            rows="5"
            :placeholder="createPageData.templateForm.essayAnswerPlaceholder"
            class="mt-2 w-full rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 py-3 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#1d2430] outline-none placeholder:text-[#98a2b3]"
          />
          <div class="mt-2 flex items-center justify-between text-[0.95rem] text-[#8b95a7]">
            <span>{{ createPageData.templateForm.maxLengthHint }}</span>
            <span class="font-semibold">0/100</span>
          </div>
        </template>
      </article>

      <section class="rounded-[20px] border border-[#b6bcc9] bg-[#f7f7f8]">
        <button
          type="button"
          class="flex h-[56px] w-full items-center justify-center rounded-[20px] border-2 border-dashed border-[#ff9b9b] bg-white text-[clamp(1.15rem,1.35vw,1.7rem)] font-semibold text-[#e30000] transition hover:bg-[#fff5f5]"
          @click="addQuestion"
        >
          {{ createPageData.templateForm.addQuestionLabel }}
        </button>

        <button
          type="button"
          class="flex h-[56px] w-full items-center justify-center rounded-b-[20px] rounded-t-[14px] bg-[linear-gradient(180deg,#f20000_0%,#d90000_100%)] text-[clamp(1.1rem,1.25vw,1.6rem)] font-semibold text-white transition hover:brightness-95"
          @click="handleSubmit"
        >
          {{ createPageData.templateForm.submitLabel }}
        </button>
      </section>
    </section>

    <section
      v-if="createPageData && !createPageData.showBuilder"
      class="min-h-[64vh]"
    />

    <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
      Memuat form FM6...
    </section>
  </section>
</template>
