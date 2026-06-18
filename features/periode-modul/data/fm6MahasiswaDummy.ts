export type Fm6MahasiswaRole = 'mahasiswa'

export type Fm6MahasiswaListMode = 'empty' | 'list' | 'after_submit'

export type Fm6MahasiswaCardAction = 'answer' | 'view'

export interface Fm6MahasiswaContext {
  periodeModulId: string
  unitId: string
}

export interface Fm6MahasiswaHeroData {
  title: string
  description: string
}

export interface Fm6MahasiswaSurveyCard {
  id: string
  title: string
  description: string
  action: Fm6MahasiswaCardAction
  actionLabel: string
}

export interface Fm6MahasiswaJawabPageDummyData {
  context: Fm6MahasiswaContext
  role: Fm6MahasiswaRole
  mode: Fm6MahasiswaListMode
  hero: Fm6MahasiswaHeroData
  showSurveyList: boolean
  listTitle: string
  cards: Fm6MahasiswaSurveyCard[]
}

export type Fm6MahasiswaQuestionType = 'multiple_choice' | 'essay'

export interface Fm6MahasiswaChoiceOption {
  id: string
  label: string
}

export interface Fm6MahasiswaQuestionBase {
  id: string
  order: number
  type: Fm6MahasiswaQuestionType
  title: string
  required: boolean
}

export interface Fm6MahasiswaChoiceQuestion extends Fm6MahasiswaQuestionBase {
  type: 'multiple_choice'
  options: Fm6MahasiswaChoiceOption[]
}

export interface Fm6MahasiswaEssayQuestion extends Fm6MahasiswaQuestionBase {
  type: 'essay'
  placeholder: string
  maxLength: number
}

export type Fm6MahasiswaSurveyQuestion = Fm6MahasiswaChoiceQuestion | Fm6MahasiswaEssayQuestion

export interface Fm6MahasiswaSubmitPanelData {
  warningMessage: string
  ctaTitle: string
  ctaDescription: string
  submitLabel: string
}

export interface Fm6MahasiswaDetailDummyData {
  context: Fm6MahasiswaContext
  role: Fm6MahasiswaRole
  jawabId: string
  surveyTitle: string
  questions: Fm6MahasiswaSurveyQuestion[]
  submitPanel: Fm6MahasiswaSubmitPanelData
  isReadOnly: boolean
  readOnlyNotice: string
  prefilledAnswers: Record<string, string>
}

export interface Fm6MahasiswaSubmitPayload {
  answers: Array<{
    questionId: string
    type: Fm6MahasiswaQuestionType
    choiceId?: string
    essayAnswer?: string
  }>
}

export interface Fm6MahasiswaSubmitResult {
  submitted: boolean
}

export const FM6_MAHASISWA_ACTIVE_DUMMY_ROLE: Fm6MahasiswaRole = 'mahasiswa'

export const FM6_MAHASISWA_DEFAULT_LIST_MODE: Fm6MahasiswaListMode = 'empty'

const heroTemplate: Fm6MahasiswaHeroData = {
  title: 'Form 06 Survei Mahasiswa',
  description:
    'Identitas Anda dienkripsi untuk menjamin privasi dan objektivitas. Jawaban Anda tidak dapat dilacak kembali kepada Anda secara personal.',
}

const listCardsTemplate: Omit<Fm6MahasiswaSurveyCard, 'action' | 'actionLabel'>[] = [
  {
    id: 'jawab-001',
    title: 'Evaluasi Pembelajaran',
    description:
      'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
  },
  {
    id: 'jawab-002',
    title: 'Kesiapan RPS',
    description:
      'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
  },
  {
    id: 'jawab-003',
    title: 'Kontrak Perkuliahan',
    description:
      'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
  },
  {
    id: 'jawab-004',
    title: 'Evaluasi Pembelajaran',
    description:
      'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
  },
  {
    id: 'jawab-005',
    title: 'Kesiapan RPS',
    description:
      'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
  },
  {
    id: 'jawab-006',
    title: 'Kontrak Perkuliahan',
    description:
      'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
  },
  {
    id: 'jawab-007',
    title: 'Evaluasi Pembelajaran',
    description:
      'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
  },
  {
    id: 'jawab-008',
    title: 'Kesiapan RPS',
    description:
      'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
  },
  {
    id: 'jawab-009',
    title: 'Kontrak Perkuliahan',
    description:
      'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
  },
  {
    id: 'jawab-010',
    title: 'Evaluasi Pembelajaran',
    description:
      'Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
  },
]

const doneSurveyIds = new Set(['jawab-001', 'jawab-002'])

const detailTitleById: Record<string, string> = {
  'jawab-001': 'Evaluasi Pembelajaran Semester Genap 2025/2026',
  'jawab-002': 'Kesiapan RPS Semester Genap 2025/2026',
  'jawab-003': 'Kontrak Perkuliahan Semester Genap 2025/2026',
}

const questionTemplate: Fm6MahasiswaSurveyQuestion[] = [
  {
    id: 'q-1',
    order: 1,
    type: 'multiple_choice',
    title: 'Bagaimana penilaian Anda terhadap kualitas materi pembelajaran yang diberikan?',
    required: true,
    options: [
      { id: 'q-1-o-1', label: 'Kurang Baik' },
      { id: 'q-1-o-2', label: 'Cukup Baik' },
      { id: 'q-1-o-3', label: 'Baik' },
      { id: 'q-1-o-4', label: 'Sangat Baik' },
    ],
  },
  {
    id: 'q-2',
    order: 2,
    type: 'essay',
    title: 'Berikan saran dan masukan Anda untuk peningkatan kualitas pembelajaran',
    required: true,
    placeholder: 'Ketik saran dan masukan Anda di sini...',
    maxLength: 100,
  },
]

const submitPanelTemplate: Fm6MahasiswaSubmitPanelData = {
  warningMessage: 'Silakan jawab semua pertanyaan yang wajib diisi sebelum mengirim',
  ctaTitle: 'Lengkapi pertanyaan wajib',
  ctaDescription: 'Pastikan semua jawaban sudah sesuai sebelum mengirim',
  submitLabel: 'Kirim Jawaban',
}

function resolveContext(context: Partial<Fm6MahasiswaContext>): Fm6MahasiswaContext {
  return {
    periodeModulId: context.periodeModulId ?? 'pm-2026-genap',
    unitId: context.unitId ?? 'unit-tif',
  }
}

function cloneQuestion(question: Fm6MahasiswaSurveyQuestion): Fm6MahasiswaSurveyQuestion {
  if (question.type === 'multiple_choice') {
    return {
      ...question,
      options: question.options.map((option) => ({ ...option })),
    }
  }

  return { ...question }
}

function resolveCards(mode: Fm6MahasiswaListMode): Fm6MahasiswaSurveyCard[] {
  if (mode === 'empty') return []

  return listCardsTemplate.map((item) => {
    const isDone = mode === 'after_submit' && doneSurveyIds.has(item.id)

    return {
      ...item,
      action: isDone ? 'view' : 'answer',
      actionLabel: isDone ? 'Lihat' : 'Jawab Survei',
    }
  })
}

export function getFm6MahasiswaJawabPageDummyData(
  params: {
    context?: Partial<Fm6MahasiswaContext>
    mode?: Fm6MahasiswaListMode
    role?: Fm6MahasiswaRole
  } = {}
): Fm6MahasiswaJawabPageDummyData {
  const context = resolveContext(params.context ?? {})
  const mode = params.mode ?? FM6_MAHASISWA_DEFAULT_LIST_MODE
  const role = params.role ?? FM6_MAHASISWA_ACTIVE_DUMMY_ROLE
  const cards = resolveCards(mode)

  return {
    context,
    role,
    mode,
    hero: { ...heroTemplate },
    showSurveyList: mode !== 'empty',
    listTitle: 'List Survei Mahasiswa',
    cards,
  }
}

export function getFm6MahasiswaDetailDummyData(
  params: {
    context?: Partial<Fm6MahasiswaContext>
    jawabId?: string
    role?: Fm6MahasiswaRole
  } = {}
): Fm6MahasiswaDetailDummyData {
  const context = resolveContext(params.context ?? {})
  const jawabId = params.jawabId ?? 'jawab-001'
  const role = params.role ?? FM6_MAHASISWA_ACTIVE_DUMMY_ROLE
  const isReadOnly = doneSurveyIds.has(jawabId)
  const surveyTitle = detailTitleById[jawabId] ?? 'Evaluasi Pembelajaran Semester Genap 2025/2026'

  return {
    context,
    role,
    jawabId,
    surveyTitle,
    questions: questionTemplate.map((question) => cloneQuestion(question)),
    submitPanel: { ...submitPanelTemplate },
    isReadOnly,
    readOnlyNotice: 'Jawaban survei ini sudah dikirim. Anda hanya dapat melihat hasil isian.',
    prefilledAnswers: isReadOnly
      ? {
          'q-1': 'q-1-o-3',
          'q-2': 'Materi pembelajaran sudah baik. Mohon ditambah sesi studi kasus yang lebih aplikatif.',
        }
      : {},
  }
}
