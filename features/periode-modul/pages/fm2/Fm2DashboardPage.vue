<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from '#imports'
import {
  FM2_SCORE_FILTER_OPTIONS,
  getFm2DashboardDummyData,
  matchesFm2ScoreFilter,
  resolveFm2Band,
  type Fm2AspekTableRow,
  type Fm2ScoreFilterValue,
} from '#features/periode-modul/data/fm2DashboardDummy'

const route = useRoute()

const pageSize = 10
const radarCenter = { x: 210, y: 200 }
const radarRadius = 120
const radarLevels = [25, 50, 75, 100]

const searchKeyword = ref('')
const selectedAspekCategory = ref('')
const selectedFaculty = ref('')
const selectedStudyProgram = ref('')
const selectedScoreRange = ref<Fm2ScoreFilterValue | ''>('')
const currentPage = ref(1)

function normalizeRouteParam(
  value: string | string[] | undefined,
  fallbackValue: string
): string {
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
  normalizeRouteParam(route.params.unit_id as string | string[] | undefined, 'unit-tif')
)

const dashboardData = computed(() =>
  getFm2DashboardDummyData({
    periodeModulId: periodeModulId.value,
    unitId: unitId.value,
  })
)

const scoreFilterOptions = FM2_SCORE_FILTER_OPTIONS

const aspekCategoryOptions = computed(() => {
  const unique = new Map<string, string>()
  dashboardData.value.tableRows.forEach((row) => {
    unique.set(row.aspectCategoryCode, row.aspectCategoryLabel)
  })
  return Array.from(unique, ([value, label]) => ({ value, label }))
})

const facultyOptions = computed(() => {
  const unique = new Map<string, string>()
  dashboardData.value.tableRows.forEach((row) => {
    unique.set(row.facultyCode, row.facultyLabel)
  })
  return Array.from(unique, ([value, label]) => ({ value, label }))
})

const studyProgramOptions = computed(() => {
  const unique = new Map<string, string>()
  dashboardData.value.tableRows.forEach((row) => {
    unique.set(row.studyProgramCode, row.studyProgramLabel)
  })
  return Array.from(unique, ([value, label]) => ({ value, label }))
})

const filteredRows = computed(() => {
  const normalizedKeyword = searchKeyword.value.trim().toLowerCase()

  return dashboardData.value.tableRows.filter((row) => {
    const searchableText = `${row.aspectTitle} ${row.aspectDescription} ${row.note}`.toLowerCase()
    const scoreFilterValue = selectedScoreRange.value
    const matchesKeyword = normalizedKeyword.length === 0
      || searchableText.includes(normalizedKeyword)
    const matchesAspek = selectedAspekCategory.value.length === 0
      || row.aspectCategoryCode === selectedAspekCategory.value
    const matchesFaculty = selectedFaculty.value.length === 0
      || row.facultyCode === selectedFaculty.value
    const matchesStudyProgram = selectedStudyProgram.value.length === 0
      || row.studyProgramCode === selectedStudyProgram.value
    const matchesScore = scoreFilterValue === ''
      ? true
      : matchesFm2ScoreFilter(row.achievement, scoreFilterValue)

    return (
      matchesKeyword
      && matchesAspek
      && matchesFaculty
      && matchesStudyProgram
      && matchesScore
    )
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize)))

const paginatedRows = computed(() => {
  const offset = (currentPage.value - 1) * pageSize
  return filteredRows.value.slice(offset, offset + pageSize).map((row, index) => ({
    ...row,
    rowNumber: offset + index + 1,
  }))
})

const radarAxes = computed(() => dashboardData.value.chart.radarAxes)

function getRadarAngle(axisIndex: number, totalAxis: number): number {
  return -Math.PI / 2 + (axisIndex * Math.PI * 2) / totalAxis
}

function getRadarPoint(level: number, axisIndex: number, totalAxis: number) {
  const angle = getRadarAngle(axisIndex, totalAxis)
  const normalizedRadius = (radarRadius * level) / 100
  return {
    x: radarCenter.x + Math.cos(angle) * normalizedRadius,
    y: radarCenter.y + Math.sin(angle) * normalizedRadius,
  }
}

const radarGridPolygons = computed(() => {
  const totalAxis = radarAxes.value.length
  return radarLevels.map((level) => {
    const points = radarAxes.value.map((_, axisIndex) => {
      const point = getRadarPoint(level, axisIndex, totalAxis)
      return `${point.x},${point.y}`
    })
    return {
      id: `grid-${level}`,
      points: points.join(' '),
    }
  })
})

const radarAxisLines = computed(() => {
  const totalAxis = radarAxes.value.length
  return radarAxes.value.map((axis, axisIndex) => {
    const point = getRadarPoint(100, axisIndex, totalAxis)
    return {
      id: axis.id,
      x2: point.x,
      y2: point.y,
    }
  })
})

const radarLabelPoints = computed(() => {
  const totalAxis = radarAxes.value.length
  return radarAxes.value.map((axis, axisIndex) => {
    const point = getRadarPoint(116, axisIndex, totalAxis)
    const textAnchor = Math.abs(point.x - radarCenter.x) < 10
      ? 'middle'
      : point.x > radarCenter.x ? 'start' : 'end'

    return {
      id: axis.id,
      label: axis.label,
      x: point.x,
      y: point.y,
      textAnchor,
    }
  })
})

const radarDataPolygon = computed(() => {
  const totalAxis = radarAxes.value.length
  return radarAxes.value.map((axis, axisIndex) => {
    const point = getRadarPoint(axis.value, axisIndex, totalAxis)
    return `${point.x},${point.y}`
  }).join(' ')
})

const radarDataPoints = computed(() => {
  const totalAxis = radarAxes.value.length
  return radarAxes.value.map((axis, axisIndex) => {
    const point = getRadarPoint(axis.value, axisIndex, totalAxis)
    return {
      id: axis.id,
      x: point.x,
      y: point.y,
    }
  })
})

const radarLevelLabels = computed(() =>
  [100, 75, 50, 25, 0].map((level) => ({
    id: `label-${level}`,
    level,
    x: radarCenter.x + 10,
    y: radarCenter.y - (radarRadius * level) / 100 + 4,
  }))
)

function buildAspekDetailRoute(row: Fm2AspekTableRow): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm2/aspek/${encodeURIComponent(row.id)}`
}

function goToPreviousPage() {
  if (currentPage.value === 1) return
  currentPage.value -= 1
}

function goToNextPage() {
  if (currentPage.value >= totalPages.value) return
  currentPage.value += 1
}

function handleDownloadResult() {
  const payload = {
    generatedAt: new Date().toISOString(),
    context: dashboardData.value.context,
    hero: dashboardData.value.hero,
    chart: dashboardData.value.chart,
    filters: {
      search: searchKeyword.value,
      aspek: selectedAspekCategory.value,
      fakultas: selectedFaculty.value,
      programStudi: selectedStudyProgram.value,
      rentangSkor: selectedScoreRange.value,
    },
    rows: filteredRows.value,
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `fm2-hasil-${dashboardData.value.context.unitId}.json`
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

watch(
  [searchKeyword, selectedAspekCategory, selectedFaculty, selectedStudyProgram, selectedScoreRange],
  () => {
    currentPage.value = 1
  }
)

watch(totalPages, (nextTotalPage) => {
  if (currentPage.value > nextTotalPage) {
    currentPage.value = nextTotalPage
  }
})
</script>

<template>
  <section class="mx-auto grid w-full max-w-[1720px] gap-5 px-4 pb-7 pt-4 md:gap-6 md:px-5 md:pb-8 md:pt-5 xl:px-6 xl:pb-9">
    <section class="rounded-xl bg-[linear-gradient(165deg,#f30000_0%,#d90000_100%)] px-4 py-5 text-white shadow-[0_6px_18px_rgba(15,23,42,0.16)] md:px-5 md:py-6 xl:px-6 xl:py-7">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div>
          <h1 class="text-[clamp(1.5rem,2.3vw,2.25rem)] font-bold leading-tight">
            {{ dashboardData.hero.title }}
          </h1>
          <p class="mt-2 max-w-[760px] text-[clamp(0.9rem,1.15vw,1rem)] text-white/[0.93]">
            {{ dashboardData.hero.description }}
          </p>
        </div>

        <aside class="min-w-[150px] justify-self-start rounded-xl bg-white/20 px-3 py-3 md:justify-self-end md:px-4">
          <span class="block text-[0.72rem] uppercase tracking-[0.06em] text-white/[0.78]">{{ dashboardData.hero.statusLabel }}</span>
          <strong class="mt-1.5 block text-[1.45rem] font-bold uppercase leading-tight">{{ dashboardData.hero.statusValue }}</strong>
          <span class="mt-1.5 block text-sm">{{ dashboardData.hero.statusDate }}</span>
        </aside>
      </div>

      <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <article class="rounded-lg bg-[linear-gradient(152deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.12)_100%)] px-3.5 py-3 md:px-4">
          <p class="text-[0.72rem] uppercase tracking-[0.02em] text-white/80">{{ dashboardData.hero.currentStageLabel }}</p>
          <p class="mt-1.5 text-[1.1rem] font-bold leading-snug md:text-[1.2rem]">{{ dashboardData.hero.currentStageValue }}</p>
        </article>
        <article class="rounded-lg bg-[linear-gradient(152deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.12)_100%)] px-3.5 py-3 md:px-4">
          <p class="text-[0.72rem] uppercase tracking-[0.02em] text-white/80">{{ dashboardData.hero.deadlineLabel }}</p>
          <p class="mt-1.5 text-[1.1rem] font-bold leading-snug md:text-[1.2rem]">{{ dashboardData.hero.deadlineValue }}</p>
        </article>
        <article class="rounded-lg bg-[linear-gradient(152deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.12)_100%)] px-3.5 py-3 md:px-4">
          <p class="text-[0.72rem] uppercase tracking-[0.02em] text-white/80">{{ dashboardData.hero.noteLabel }}</p>
          <p class="mt-1.5 text-[1.1rem] font-bold leading-snug md:text-[1.2rem]">{{ dashboardData.hero.noteValue }}</p>
        </article>
      </div>
    </section>

    <section class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-4 md:p-5 xl:p-6">
      <h2 class="text-[clamp(1.3rem,1.9vw,1.75rem)] font-semibold leading-tight text-[#080b12]">
        Capaian Indikator
      </h2>

      <div class="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        <article
          v-for="item in dashboardData.indicatorSummary"
          :key="item.id"
          class="rounded-xl bg-[#f3f3f3] px-4 pb-4 pt-4 shadow-[inset_0_0_0_1px_#ebebeb]"
        >
          <div class="flex items-start justify-between gap-2.5">
            <h3 class="text-[clamp(1rem,1.4vw,1.2rem)] font-semibold text-[#4a4b4f]">
              {{ item.title }}
            </h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" class="h-[18px] w-[18px] text-[#67696d]">
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 17L17 7M9 7h8v8"
              />
            </svg>
          </div>

          <p class="mt-3 text-[clamp(1.9rem,2.7vw,2.4rem)] font-semibold leading-none text-[#06090f]">
            {{ item.score }}
          </p>

          <div class="mt-3 h-[10px] w-[150px] overflow-hidden rounded-full bg-[#dce2e9]">
            <span class="block h-full rounded-full bg-[#45cf74]" :style="{ width: `${item.progressPercent}%` }" />
          </div>

          <p class="mt-2.5 text-[1.1rem] text-[#1f76aa]">
            {{ item.subtitle }}
          </p>
        </article>
      </div>
    </section>

    <section class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-4 md:p-5 xl:p-6">
      <h2 class="text-[clamp(1.3rem,1.9vw,1.75rem)] font-semibold leading-tight text-[#080b12]">
        Chart Capaian
      </h2>

      <div class="mt-3.5 grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-[minmax(250px,1fr)_minmax(470px,1.35fr)_minmax(280px,0.9fr)] 2xl:gap-5">
        <article class="rounded-xl border border-[#ff3f43] bg-[#ff4145] p-4 text-white shadow-[0_6px_14px_rgba(15,23,42,0.1)]">
          <p class="text-[clamp(1rem,1.3vw,1.2rem)]">Total Skor Kesiapan</p>
          <p class="mt-1 text-[clamp(2.35rem,4.8vw,3.45rem)] font-bold leading-[0.98]">
            {{ dashboardData.chart.totalScore.toFixed(2) }}
            <span class="text-[0.56em] font-semibold">/ {{ dashboardData.chart.maxScore.toFixed(1) }}</span>
          </p>

          <p class="mt-5 text-[clamp(1rem,1.3vw,1.2rem)]">Persentase Kesiapan</p>
          <p class="mt-1 text-[clamp(2rem,4.2vw,3rem)] font-bold leading-none">
            {{ dashboardData.chart.readinessPercentage.toFixed(1) }}%
          </p>

          <div class="mt-6 inline-flex items-center rounded-full bg-white px-3.5 py-1.5 text-[0.95rem] font-semibold text-[#d90000]">
            Kategori: {{ dashboardData.chart.readinessCategory }}
          </div>
        </article>

        <article class="rounded-xl border border-[#dadde2] bg-[#f2f2f2] p-4 shadow-[0_6px_14px_rgba(15,23,42,0.1)]">
          <h3 class="text-[clamp(1.25rem,1.6vw,1.5rem)] font-bold text-[#1a2130]">
            Profil Pemeriksa
          </h3>

          <svg viewBox="0 0 420 360" class="mt-2 w-full" role="img" aria-label="Radar chart capaian FM02">
            <g>
              <polygon
                v-for="polygon in radarGridPolygons"
                :key="polygon.id"
                :points="polygon.points"
                class="fill-none stroke-[#d7dce2] [stroke-width:1.8]"
              />
            </g>

            <g>
              <line
                v-for="line in radarAxisLines"
                :key="line.id"
                :x1="radarCenter.x"
                :y1="radarCenter.y"
                :x2="line.x2"
                :y2="line.y2"
                class="stroke-[#d2d8de] [stroke-width:1.5]"
              />
            </g>

            <g>
              <polygon
                :points="radarDataPolygon"
                class="fill-[rgba(232,0,0,0.4)] stroke-[#e40000] [stroke-width:3]"
              />

              <circle
                v-for="point in radarDataPoints"
                :key="point.id"
                :cx="point.x"
                :cy="point.y"
                r="6"
                class="fill-[#ffd4d4] stroke-[#e40000] [stroke-width:3]"
              />
            </g>

            <g>
              <text
                v-for="label in radarLabelPoints"
                :key="label.id"
                :x="label.x"
                :y="label.y"
                :text-anchor="label.textAnchor"
                class="fill-[#6b7484] text-[0.95rem]"
              >
                {{ label.label }}
              </text>
            </g>

            <g>
              <text
                v-for="level in radarLevelLabels"
                :key="level.id"
                :x="level.x"
                :y="level.y"
                class="fill-[#9da5b2] text-[0.75rem]"
              >
                {{ level.level }}
              </text>
            </g>
          </svg>
        </article>

        <article class="rounded-xl border border-[#dadde2] bg-[#f2f2f2] p-4 shadow-[0_6px_14px_rgba(15,23,42,0.1)] lg:col-span-2 2xl:col-span-1">
          <h3 class="text-[clamp(1.25rem,1.6vw,1.5rem)] font-bold text-[#1a2130]">
            Indikator Penilaian
          </h3>

          <ul class="mt-4 grid gap-3">
            <li
              v-for="legend in dashboardData.legend"
              :key="legend.id"
              class="flex items-center gap-2.5 text-[0.95rem] font-semibold text-[#202938] lg:text-[1rem]"
            >
              <span class="inline-block h-4 w-4 rounded-full" :style="{ backgroundColor: legend.dotColor }" />
              <span>{{ legend.rangeLabel }} {{ legend.label }}</span>
            </li>
          </ul>
        </article>
      </div>
    </section>

    <section class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-4 md:p-5 xl:p-6">
      <h2 class="text-[clamp(1.3rem,1.9vw,1.75rem)] font-semibold leading-tight text-[#080b12]">
        Nilai Aspek dan Indikator
      </h2>

      <div class="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-6">
        <label class="relative h-10 rounded-[11px] border border-[#d3d7de] bg-[#f8f8f8] pr-[42px] xl:col-span-2">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="Search"
            class="h-full w-full rounded-[11px] border-none bg-transparent px-3.5 text-[0.92rem] text-[#444f63] outline-none placeholder:text-[#8f95a3]"
          >
          <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9399a7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.55-5.4a6.95 6.95 0 1 1-13.9 0 6.95 6.95 0 0 1 13.9 0Z" />
          </svg>
        </label>

        <label class="relative h-10 rounded-[11px] border border-[#d3d7de] bg-[#f8f8f8]">
          <select v-model="selectedAspekCategory" class="h-full w-full cursor-pointer appearance-none rounded-[11px] border-none bg-transparent px-3.5 pr-8 text-[0.92rem] text-[#444f63] outline-none">
            <option value="">Aspek</option>
            <option
              v-for="option in aspekCategoryOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9399a7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </label>

        <label class="relative h-10 rounded-[11px] border border-[#d3d7de] bg-[#f8f8f8]">
          <select v-model="selectedFaculty" class="h-full w-full cursor-pointer appearance-none rounded-[11px] border-none bg-transparent px-3.5 pr-8 text-[0.92rem] text-[#444f63] outline-none">
            <option value="">Fakultas</option>
            <option
              v-for="option in facultyOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9399a7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </label>

        <label class="relative h-10 rounded-[11px] border border-[#d3d7de] bg-[#f8f8f8]">
          <select v-model="selectedStudyProgram" class="h-full w-full cursor-pointer appearance-none rounded-[11px] border-none bg-transparent px-3.5 pr-8 text-[0.92rem] text-[#444f63] outline-none">
            <option value="">TIF</option>
            <option
              v-for="option in studyProgramOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9399a7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </label>

        <label class="relative h-10 rounded-[11px] border border-[#d3d7de] bg-[#f8f8f8]">
          <select v-model="selectedScoreRange" class="h-full w-full cursor-pointer appearance-none rounded-[11px] border-none bg-transparent px-3.5 pr-8 text-[0.92rem] text-[#444f63] outline-none">
            <option value="">&lt; 50%</option>
            <option
              v-for="option in scoreFilterOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9399a7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </label>
      </div>

      <div class="mt-3 overflow-x-auto rounded-xl border border-[#d7dce3] bg-white">
        <table class="w-full min-w-[920px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th class="w-12 border-b border-[#dfe4ea] bg-[#ebebeb] px-2.5 py-2.5 text-center text-[0.83rem] font-bold text-[#373b42]">No</th>
              <th class="border-b border-[#dfe4ea] bg-[#ebebeb] px-2.5 py-2.5 text-left text-[0.83rem] font-bold text-[#373b42]">Aspek &amp; Indikator</th>
              <th class="border-b border-[#dfe4ea] bg-[#ebebeb] px-2.5 py-2.5 text-left text-[0.83rem] font-bold text-[#373b42]">Jumlah Matkul &amp; Dosen</th>
              <th class="border-b border-[#dfe4ea] bg-[#ebebeb] px-2.5 py-2.5 text-left text-[0.83rem] font-bold text-[#373b42]">Capaian &amp; Skor</th>
              <th class="border-b border-[#dfe4ea] bg-[#ebebeb] px-2.5 py-2.5 text-left text-[0.83rem] font-bold text-[#373b42]">Catatan</th>
              <th class="w-[120px] border-b border-[#dfe4ea] bg-[#ebebeb] px-2.5 py-2.5 text-center text-[0.83rem] font-bold text-[#373b42]">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in paginatedRows" :key="row.id">
              <td class="w-12 border-b border-[#e8ebf0] px-2.5 py-3 text-center align-top text-[0.82rem]">
                {{ row.rowNumber }}
              </td>

              <td class="border-b border-[#e8ebf0] px-2.5 py-3 align-top text-[0.82rem]">
                <p class="text-[0.98rem] font-bold leading-[1.2] text-[#383c45]">{{ row.aspectTitle }}</p>
                <p class="mt-1 max-w-[520px] text-[0.82rem] leading-[1.55] text-[#555c6b]">{{ row.aspectDescription }}</p>
              </td>

              <td class="border-b border-[#e8ebf0] px-2.5 py-3 align-top text-[0.82rem]">
                <p class="max-w-[88px] text-[0.98rem] font-bold leading-[1.3] text-[#353942]">
                  {{ row.totalCourses }} Mata Kuliah
                </p>
                <p class="mt-1.5 text-[0.9rem] text-[#2568e3]">
                  {{ row.totalLecturers }} Dosen
                </p>
              </td>

              <td class="border-b border-[#e8ebf0] px-2.5 py-3 align-top text-[0.82rem]">
                <p class="text-[0.9rem] font-bold text-[#222836]">
                  {{ row.achievement }}%
                </p>
                <div class="mt-1.5 h-[9px] w-[96px] overflow-hidden rounded-full bg-[#dde3ea]">
                  <span
                    class="block h-full rounded-full"
                    :style="{
                      width: `${row.achievement}%`,
                      backgroundColor: resolveFm2Band(row.achievement).barColor,
                    }"
                  />
                </div>
                <p
                  class="mt-1 text-[0.84rem]"
                  :style="{ color: resolveFm2Band(row.achievement).textColor }"
                >
                  {{ resolveFm2Band(row.achievement).label }}
                </p>
              </td>

              <td class="border-b border-[#e8ebf0] px-2.5 py-3 align-top text-[0.98rem] font-bold text-[#393f49]">
                {{ row.note }}
              </td>

              <td class="w-[120px] border-b border-[#e8ebf0] px-2.5 py-3 text-center align-top">
                <NuxtLink :to="buildAspekDetailRoute(row)" class="inline-flex items-center justify-center rounded-lg border-2 border-[#f03b3d] px-3 py-[5px] text-[0.82rem] font-semibold text-[#f10f12] transition hover:bg-[#f10f12] hover:text-white">
                  Lihat Detail
                </NuxtLink>
              </td>
            </tr>

            <tr v-if="paginatedRows.length === 0">
              <td colspan="6" class="px-2.5 py-5 text-center text-sm text-[#6a7280]">
                Data aspek tidak ditemukan untuk filter yang dipilih.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-3 flex justify-end">
        <button type="button" class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-none bg-[#e00000] px-3.5 py-2 text-[0.9rem] font-semibold text-white" @click="handleDownloadResult">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-[15px] w-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v10m0 0 4-4m-4 4-4-4M4 19h16" />
          </svg>
          Download Hasil
        </button>
      </div>

      <div class="mt-3 flex flex-col gap-2 border-t border-[#dfe3ea] pt-3 md:flex-row md:items-center md:justify-between">
        <p class="text-[0.86rem] text-[#5a6474]">
          Menampilkan <strong>{{ paginatedRows.length }}</strong> dari
          <strong>{{ filteredRows.length }}</strong> data
        </p>

        <div class="ml-auto inline-flex items-center gap-1.5">
          <button
            type="button"
            class="min-w-[76px] rounded-[9px] border border-[#d8dde5] bg-[#f7f7f7] px-3 py-1.5 text-[0.82rem] text-[#9198a4] disabled:cursor-not-allowed disabled:opacity-80"
            :disabled="currentPage === 1"
            @click="goToPreviousPage"
          >
            Previous
          </button>
          <span class="inline-flex h-[34px] min-w-[34px] items-center justify-center rounded-[10px] bg-[#ea0000] text-[0.88rem] font-semibold text-white">{{ currentPage }}</span>
          <button
            type="button"
            class="min-w-[76px] rounded-[9px] border border-[#d8dde5] bg-[#f7f7f7] px-3 py-1.5 text-[0.82rem] text-[#9198a4] disabled:cursor-not-allowed disabled:opacity-80"
            :disabled="currentPage >= totalPages"
            @click="goToNextPage"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  </section>
</template>
