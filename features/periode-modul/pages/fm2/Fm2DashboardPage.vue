<template>
  <section class="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 md:gap-6 lg:px-8 lg:py-8">
    <div v-if="fm2Store.isLoadingInfo || fm2Store.isLoadingAspeks" class="flex justify-center p-8">
      <span class="text-gray-500">{{ t('loading', 'Loading...') }}</span>
    </div>
    <template v-else>
      <section
        class="rounded-xl bg-gradient-to-br from-[#d90000] to-[#f30000] px-5 py-6 text-white shadow-md sm:px-6 lg:p-8">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div class="max-w-3xl">
            <h1 class="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
              {{ t('fm2.title') }}
            </h1>
            <p class="mt-2 text-sm leading-relaxed text-white/90 sm:text-base">
              {{ t('fm2.description') }}
            </p>
          </div>
          
          <div class="flex-shrink-0">
            <button
              @click="handleExportPdf"
              :disabled="isExporting"
              class="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl border border-transparent bg-white/20 px-4 py-2 text-sm sm:text-[0.95rem] font-semibold text-white backdrop-blur-sm shadow-[0_2px_6px_rgba(15,23,42,0.1)] transition hover:bg-white/30 disabled:opacity-50 cursor-pointer">
              <svg v-if="!isExporting" xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <svg v-else class="mr-2 h-4.5 w-4.5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Export PDF
            </button>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:mt-8 lg:gap-4">
          <article class="rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
            <p class="text-xs font-medium uppercase tracking-wider text-white/80">
              {{ t('fm2.startTime') }}
            </p>
            <p class="mt-1 text-base font-bold sm:text-lg">
              {{ fm2Store.informasi?.fm?.tanggal_mulai ? new Date(fm2Store.informasi.fm.tanggal_mulai).toLocaleString(locale) : '-' }}
            </p>
          </article>
          <article class="rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
            <p class="text-xs font-medium uppercase tracking-wider text-white/80">
              {{ t('fm2.endTime') }}
            </p>
            <p class="mt-1 text-base font-bold sm:text-lg">
              {{ fm2Store.informasi?.fm?.tanggal_selesai ? new Date(fm2Store.informasi.fm.tanggal_selesai).toLocaleString(locale) : '-' }}
            </p>
          </article>
          <article class="rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
            <p class="text-xs font-medium uppercase tracking-wider text-white/80">
              {{ t('fm2.status') }}
            </p>
            <p class="mt-1 text-base font-bold sm:text-lg">
              {{ fm2Store.informasi?.fm?.status_pelaksanaan?.kode === 'SEDANG_BERLANGSUNG' ? t('fm2.active') : t('fm2.inactive') }}
            </p>
          </article>
        </div>
      </section>

      <section class="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm sm:p-5 lg:p-6">
        <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <article class="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
            <p class="text-xs font-semibold text-gray-600 sm:text-sm" :class="isRTL ? 'text-right' : 'text-left'">
              {{ t('fm2.aspectVeryGood') }}
            </p>
            <p class="mt-1.5 text-xl font-bold text-red-700 sm:text-2xl lg:text-3xl"
              :class="isRTL ? 'text-left' : 'text-right'">
              {{ formatNumber(countSangatBaik) }}
            </p>
          </article>

          <article class="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
            <p class="text-xs font-semibold text-gray-600 sm:text-sm">
              {{ t('fm2.aspectGood') }}
            </p>
            <p class="mt-1.5 text-xl font-bold text-red-700 sm:text-2xl lg:text-3xl"
              :class="isRTL ? 'text-left' : 'text-right'">
              {{ formatNumber(countBaik) }}
            </p>
          </article>

          <article class="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
            <p class="text-xs font-semibold text-gray-600 sm:text-sm">
              {{ t('fm2.aspectFair') }}
            </p>
            <p class="mt-1.5 text-xl font-bold text-red-700 sm:text-2xl lg:text-3xl"
              :class="isRTL ? 'text-left' : 'text-right'">
              {{ formatNumber(countCukup) }}
            </p>
          </article>

          <article class="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
            <p class="text-xs font-semibold text-gray-600 sm:text-sm">
              {{ t('fm2.aspectPoor') }}
            </p>
            <p class="mt-1.5 text-xl font-bold text-red-700 sm:text-2xl lg:text-3xl"
              :class="isRTL ? 'text-left' : 'text-right'">
              {{ formatNumber(countKurang) }}
            </p>
          </article>
        </div>
      </section>

      <section class="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm sm:p-5 lg:p-6">
        <h2 class="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
          {{ t('fm2.chartTitle') }}
        </h2>

        <div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
          <article
            class="flex flex-col justify-center rounded-xl bg-[#e60000] p-5 text-white shadow-md sm:p-6 lg:col-span-1">
            <div>
              <p class="text-sm font-medium opacity-90 sm:text-base">{{ t('fm2.totalReadinessScore') }}</p>
              <p class="mt-1 text-4xl font-bold tracking-tight sm:text-5xl">
                {{ fm2Store.skorMonitoring?.skor ? fm2Store.skorMonitoring.skor.toFixed(2) : '0' }}
                <span class="text-lg font-medium opacity-80 sm:text-xl">/ 4.0</span>
              </p>
            </div>
            <div class="mt-6">
              <p class="text-sm font-medium opacity-90 sm:text-base">{{ t('fm2.readinessPercentage') }}</p>
              <p class="mt-1 text-3xl font-bold sm:text-4xl">{{ fm2Store.skorMonitoring?.persentase ? fm2Store.skorMonitoring.persentase.toFixed(1) : '0' }}%</p>
            </div>
            <div class="mt-6" v-if="fm2Store.skorMonitoring?.kategori">
              <span
                class="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-sm font-bold text-[#e60000] shadow-sm">
                {{ t('fm2.category') }}: {{ fm2Store.skorMonitoring.kategori }}
              </span>
            </div>
          </article>

          <article
            class="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 lg:col-span-1">
            <h3 class="w-full text-base font-bold text-gray-800 sm:text-lg">
              {{ t('fm2.reviewerProfile') }}
            </h3>
            <svg v-if="radarAxes.length > 0" viewBox="0 0 420 360" class="mt-4 w-full max-w-[320px]" role="img" aria-label="Radar chart capaian FM02">
              <g>
                <polygon v-for="polygon in radarGridPolygons" :key="polygon.id" :points="polygon.points"
                  class="fill-none stroke-[#d7dce2] stroke-[1.5]" />
              </g>
              <g>
                <line v-for="line in radarAxisLines" :key="line.id" :x1="radarCenter.x" :y1="radarCenter.y" :x2="line.x2"
                  :y2="line.y2" class="stroke-[#d2d8de] stroke-[1.5]" />
              </g>
              <g>
                <polygon :points="radarDataPolygon" class="fill-[#e80000]/20 stroke-[#e40000] stroke-[2]" />
                <circle v-for="point in radarDataPoints" :key="point.id" :cx="point.x" :cy="point.y" r="5"
                  class="fill-[#ffd4d4] stroke-[#e40000] stroke-[2]" />
              </g>
              <g>
                <text v-for="label in radarLabelPoints" :key="label.id" :x="label.x" :y="label.y"
                  :text-anchor="label.textAnchor" class="fill-gray-600 text-[10px] sm:text-xs">
                  {{ label.label.substring(0, 15) }}{{ label.label.length > 15 ? '...' : '' }}
                </text>
              </g>
              <g>
                <text v-for="level in radarLevelLabels" :key="level.id" :x="level.x" :y="level.y"
                  class="fill-gray-400 text-[10px]">
                  {{ level.level }}
                </text>
              </g>
            </svg>
            <div v-else class="flex h-full w-full items-center justify-center">
              <p class="text-sm text-gray-400">{{ t('fm2.table.empty') }}</p>
            </div>
          </article>

          <article class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 lg:col-span-1">
            <h3 class="text-base font-bold text-gray-800 sm:text-lg">
              {{ t('fm2.assessmentIndicators') }}
            </h3>
            <ul class="mt-4 flex flex-col gap-3.5">
              <li class="flex items-center gap-3 text-sm font-medium text-gray-700 sm:text-base">
                <span class="block h-3.5 w-3.5 shrink-0 rounded-full bg-[#148c42]" />
                <span>90 - 100% {{ t('fm2.aspectVeryGood') }}</span>
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-gray-700 sm:text-base">
                <span class="block h-3.5 w-3.5 shrink-0 rounded-full bg-[#1590d0]" />
                <span>75 - 90% {{ t('fm2.aspectGood') }}</span>
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-gray-700 sm:text-base">
                <span class="block h-3.5 w-3.5 shrink-0 rounded-full bg-[#e7b208]" />
                <span>50 - 75% {{ t('fm2.aspectFair') }}</span>
              </li>
              <li class="flex items-center gap-3 text-sm font-medium text-gray-700 sm:text-base">
                <span class="block h-3.5 w-3.5 shrink-0 rounded-full bg-[#e10000]" />
                <span>0 - 50% {{ t('fm2.aspectPoor') }}</span>
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section class="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm sm:p-5 lg:p-6">
        <h2 class="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
          {{ t('fm2.aspectEvaluationResult') }}
        </h2>

        <div class="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table class="w-full min-w-[800px] border-collapse text-left">
            <thead class="bg-gray-100">
              <tr>
                <th
                  class="w-12 border-b border-gray-200 px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-600">
                  {{ t('fm2.table.no') }}</th>
                <th class="border-b border-gray-200 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-600">
                  {{ t('fm2.table.aspect') }}</th>
                <th
                  class="w-40 border-b border-gray-200 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-600">
                  {{ t('fm2.table.achievement') }}</th>
                <th
                  class="w-32 border-b border-gray-200 px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-600">
                  {{ t('fm2.table.action') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="row in paginatedRows" :key="row.id" class="transition hover:bg-gray-50">
                <td class="px-4 py-4 text-center text-sm text-gray-600 align-top">
                  {{ row.rowNumber }}
                </td>
                <td class="px-4 py-4 align-top">
                  <p class="text-sm font-bold text-gray-900">{{ row.nama }}</p>
                  <p class="mt-1 text-xs leading-relaxed text-gray-500">{{ row.deskripsi }}</p>
                </td>
                <td class="px-4 py-4 align-top">
                  <p class="text-sm font-bold text-gray-900">{{ row.skor?.persentase ? row.skor.persentase.toFixed(1) : 0 }}%</p>
                  <div class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <span class="block h-full rounded-full transition-all duration-300"
                      :style="{ width: `${row.skor?.persentase ?? 0}%`, backgroundColor: resolveFm2Band(row.skor?.persentase ?? 0).barColor }" />
                  </div>
                  <p class="mt-1 text-xs font-medium" :style="{ color: resolveFm2Band(row.skor?.persentase ?? 0).textColor }">
                    {{ row.skor?.kategori || resolveFm2Band(row.skor?.persentase ?? 0).label }}
                  </p>
                </td>
                <td class="px-4 py-4 text-center align-top">
                  <button v-if="canCalculate && !row.skor?.skor" @click="calculateAspect(row.aspek_periode_modul_id)"
                    class="inline-flex w-full items-center justify-center rounded-lg border border-red-600 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                    :disabled="fm2Store.isCalculating">
                    {{ t('fm2.table.calculateScore') }}
                  </button>
                  <span v-else-if="row.skor?.skor" class="inline-flex w-full items-center justify-center px-3 py-1.5 text-xs font-semibold text-gray-500">
                    -
                  </span>
                </td>
              </tr>
              <tr v-if="paginatedRows.length === 0">
                <td colspan="4" class="px-4 py-8 text-center text-sm text-gray-500">
                  {{ t('fm2.table.empty') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="canCalculate && allAspectsCalculated && !fm2Store.skorMonitoring?.skor" class="mt-4 flex justify-end">
          <button @click="calculateMonitoring"
            class="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-50"
            :disabled="fm2Store.isCalculating">
            {{ t('fm2.table.calculateAllScore') }}
          </button>
        </div>

        <div
          class="mt-4 flex flex-col-reverse gap-4 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-end">
          <div class="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <div class="flex items-center gap-2">
              <button type="button"
                class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="currentPage === 1" @click="goToPreviousPage">
                {{ t('fm2.pagination.previous') }}
              </button>
              <span
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white shadow-sm">
                {{ currentPage }}
              </span>
              <button type="button"
                class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="currentPage >= totalPages" @click="goToNextPage">
                {{ t('fm2.pagination.next') }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from '#imports'
import { resolveFm2Band } from '../../data/fm2DashboardDummy'
import { useI18n } from 'vue-i18n'
import { useFm2Store } from '#stores/fm2'
import { useToast } from '#imports'

const { locale, t } = useI18n()
const toast = useToast()
const localePath = useLocalePath()
const fm2Store = useFm2Store()
const route = useRoute()

const routeUnitId = computed(() => route.params.unit_id as string)
const isExporting = ref(false)

async function handleExportPdf() {
  if (isExporting.value) return
  isExporting.value = true
  try {
    const blob = await fm2Store.exportPdf(routeUnitId.value)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Hasil_Evaluasi_${routeUnitId.value}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    toast.add({
      title: 'Berhasil',
      description: 'Laporan berhasil diunduh.',
      color: 'green'
    })
  } catch (err) {
    console.error('Export failed:', err)
    toast.add({
      title: 'Gagal',
      description: 'Terjadi kesalahan saat mengunduh laporan.',
      color: 'red'
    })
  } finally {
    isExporting.value = false
  }
}

const isRTL = computed(() => locale.value === 'ar')

function formatNumber(value: number) {
  return new Intl.NumberFormat(
    locale.value === 'ar'
      ? 'ar-SA'
      : locale.value === 'ja'
        ? 'ja-JP'
        : locale.value === 'en'
          ? 'en-US'
          : 'id-ID'
  ).format(value)
}

const pageSize = 10
const radarCenter = { x: 210, y: 200 }
const radarRadius = 120
const radarLevels = [25, 50, 75, 100]

const currentPage = ref(1)

function normalizeRouteParam(
  value: string | string[] | undefined,
  fallbackValue: string
): string {
  if (!value) return fallbackValue
  if (Array.isArray(value)) return fallbackValue
  return value
}

const periodeModulId = computed(() =>
  normalizeRouteParam(route.params.periode_modul_id as string | string[] | undefined, '')
)

const unitId = computed(() =>
  normalizeRouteParam(route.params.unit_id as string | string[] | undefined, '')
)

onMounted(async () => {
  if (periodeModulId.value && unitId.value) {
    await Promise.all([
      fm2Store.fetchInformasi(periodeModulId.value, unitId.value),
      fm2Store.checkIsAuditee(unitId.value),
      fm2Store.fetchSkorAspeks(unitId.value),
      fm2Store.fetchSkorMonitoring(unitId.value)
    ])
  }
})

const isAuditee = computed(() => fm2Store.isAuditee)
const isBerlangsung = computed(() => fm2Store.informasi?.periode_modul?.status_pelaksanaan?.kode === 'SEDANG_BERLANGSUNG' && fm2Store.informasi?.fm?.status_pelaksanaan?.kode === 'SEDANG_BERLANGSUNG')
const canCalculate = computed(() => isAuditee.value && isBerlangsung.value)

const allAspectsCalculated = computed(() => {
  if (!fm2Store.skorAspeks.length) return false;
  return fm2Store.skorAspeks.every(a => a.skor?.skor != null);
})

const filteredRows = computed(() => fm2Store.skorAspeks)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize)))

const paginatedRows = computed(() => {
  const offset = (currentPage.value - 1) * pageSize
  return filteredRows.value.slice(offset, offset + pageSize).map((row, index) => ({
    ...row,
    rowNumber: offset + index + 1,
  }))
})

const countSangatBaik = computed(() => fm2Store.skorAspeks.filter(a => a.skor?.skor != null && a.skor.persentase! >= 90).length)
const countBaik = computed(() => fm2Store.skorAspeks.filter(a => a.skor?.skor != null && a.skor.persentase! >= 75 && a.skor.persentase! < 90).length)
const countCukup = computed(() => fm2Store.skorAspeks.filter(a => a.skor?.skor != null && a.skor.persentase! >= 50 && a.skor.persentase! < 75).length)
const countKurang = computed(() => fm2Store.skorAspeks.filter(a => a.skor?.skor != null && a.skor.persentase! < 50).length)

const radarAxes = computed(() => {
  if (!fm2Store.skorAspeks.length) return []
  return fm2Store.skorAspeks.map((a) => ({
    id: a.id,
    label: a.nama,
    value: a.skor?.persentase ?? 0,
  }))
})

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

function goToPreviousPage() {
  if (currentPage.value === 1) return
  currentPage.value -= 1
}

function goToNextPage() {
  if (currentPage.value >= totalPages.value) return
  currentPage.value += 1
}

async function calculateAspect(aspekPeriodeModulId: string) {
  try {
    await fm2Store.calculateSkorAspek(unitId.value, aspekPeriodeModulId)
    toast.add({
      title: t('fm2.toast.calculateSuccess'),
      color: 'green'
    })
  } catch (error) {
    toast.add({
      title: t('fm2.toast.calculateError'),
      color: 'red'
    })
  }
}

async function calculateMonitoring() {
  try {
    await fm2Store.calculateSkorMonitoring(unitId.value)
    toast.add({
      title: t('fm2.toast.calculateAllSuccess'),
      color: 'green'
    })
  } catch (error) {
    toast.add({
      title: t('fm2.toast.calculateAllError'),
      color: 'red'
    })
  }
}
</script>
