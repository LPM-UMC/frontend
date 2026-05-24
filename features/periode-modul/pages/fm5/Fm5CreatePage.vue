<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import { useFm5GkmfRepository } from '#features/periode-modul/composables/useFm5GkmfRepository'
import {
  FM5_ACTIVE_DUMMY_ROLE,
  type Fm5CreateFormDefaultValues,
  type Fm5CreatePageDummyData,
  type Fm5DashboardContext,
  type Fm5DummyRole,
} from '#features/periode-modul/data/fm5GkmfDummy'

type CalendarField = 'tanggalPelaksanaan' | 'batasWaktuTandaTangan'

interface CalendarCell {
  key: string
  day: number
  iso: string
  inCurrentMonth: boolean
}

const route = useRoute()
const repository = useFm5GkmfRepository('auto')

const activeDummyRole = ref<Fm5DummyRole>(FM5_ACTIVE_DUMMY_ROLE)
const createPageData = ref<Fm5CreatePageDummyData | null>(null)
const loading = ref(true)

const form = reactive<Fm5CreateFormDefaultValues>({
  programStudiId: 'dalam-proses',
  tanggalPelaksanaan: '',
  batasWaktuTandaTangan: '',
})

const openCalendarField = ref<CalendarField>('tanggalPelaksanaan')
const calendarYear = ref(2027)
const calendarMonthIndex = ref(3)
const yearListRef = ref<HTMLElement | null>(null)
const monthListRef = ref<HTMLElement | null>(null)

const calendarWeekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const monthOptions = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const yearOptions = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032]

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

const context = computed<Fm5DashboardContext>(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

const isGkmfMode = computed(() => activeDummyRole.value === 'gkmf')

const calendarMonthLabel = computed(() => monthOptions[calendarMonthIndex.value] ?? 'January')

const selectedCalendarIso = computed(() => {
  if (openCalendarField.value === 'batasWaktuTandaTangan') {
    return form.batasWaktuTandaTangan
  }

  return form.tanggalPelaksanaan
})

const calendarCells = computed<CalendarCell[]>(() => {
  const firstDate = new Date(calendarYear.value, calendarMonthIndex.value, 1)
  const firstWeekday = (firstDate.getDay() + 6) % 7
  const daysInCurrentMonth = new Date(calendarYear.value, calendarMonthIndex.value + 1, 0).getDate()
  const daysInPreviousMonth = new Date(calendarYear.value, calendarMonthIndex.value, 0).getDate()

  const cells: CalendarCell[] = []

  for (let i = 0; i < 42; i += 1) {
    let day = 0
    let monthOffset = 0

    if (i < firstWeekday) {
      day = daysInPreviousMonth - firstWeekday + i + 1
      monthOffset = -1
    } else if (i >= firstWeekday + daysInCurrentMonth) {
      day = i - (firstWeekday + daysInCurrentMonth) + 1
      monthOffset = 1
    } else {
      day = i - firstWeekday + 1
      monthOffset = 0
    }

    const cellDate = new Date(calendarYear.value, calendarMonthIndex.value + monthOffset, day)

    cells.push({
      key: `${cellDate.getFullYear()}-${cellDate.getMonth()}-${day}`,
      day,
      iso: toIsoDate(cellDate),
      inCurrentMonth: monthOffset === 0,
    })
  }

  return cells
})

function toIsoDate(value: Date): string {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const date = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${date}`
}

function parseIsoDate(value: string): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null

  const [year, month, day] = value.split('-').map((item) => Number(item))
  if (!year || !month || !day) return null

  return new Date(year, month - 1, day)
}

function formatDisplayDate(value: string): string {
  const parsed = parseIsoDate(value)
  if (!parsed) return ''

  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  const year = String(parsed.getFullYear()).slice(-2)

  return `${month}/${day}/${year}`
}

function openCalendar(field: CalendarField) {
  openCalendarField.value = field

  const existingDate = parseIsoDate(
    field === 'tanggalPelaksanaan' ? form.tanggalPelaksanaan : form.batasWaktuTandaTangan
  )

  if (existingDate) {
    calendarYear.value = existingDate.getFullYear()
    calendarMonthIndex.value = existingDate.getMonth()
  }

  void syncCalendarOptionViewport()
}

function selectCalendarDay(cell: CalendarCell) {
  if (!cell.inCurrentMonth) return

  if (openCalendarField.value === 'batasWaktuTandaTangan') {
    form.batasWaktuTandaTangan = cell.iso
    return
  }

  form.tanggalPelaksanaan = cell.iso

  if (!form.batasWaktuTandaTangan) {
    const baseDate = parseIsoDate(cell.iso)
    if (baseDate) {
      baseDate.setDate(baseDate.getDate() + 7)
      form.batasWaktuTandaTangan = toIsoDate(baseDate)
    }
  }
}

function goToPreviousMonth() {
  if (calendarMonthIndex.value === 0) {
    calendarMonthIndex.value = 11
    calendarYear.value -= 1
    return
  }

  calendarMonthIndex.value -= 1
}

function goToNextMonth() {
  if (calendarMonthIndex.value === 11) {
    calendarMonthIndex.value = 0
    calendarYear.value += 1
    return
  }

  calendarMonthIndex.value += 1
}

function isSelectedDay(cell: CalendarCell): boolean {
  return selectedCalendarIso.value === cell.iso
}

function setMonth(monthIndex: number) {
  calendarMonthIndex.value = monthIndex
}

function setYear(year: number) {
  calendarYear.value = year
}

function scrollActiveCalendarOption(listElement: HTMLElement | null) {
  if (!listElement) return

  const activeOption = listElement.querySelector<HTMLElement>('[data-active="true"]')
  activeOption?.scrollIntoView({
    block: 'center',
    inline: 'nearest',
  })
}

async function syncCalendarOptionViewport() {
  if (!import.meta.client) return

  await nextTick()
  scrollActiveCalendarOption(yearListRef.value)
  scrollActiveCalendarOption(monthListRef.value)
}

function buildDashboardRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm5`
}

function buildDetailRoute(beritaAcaraId: string): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm5/${encodeURIComponent(beritaAcaraId)}`
}

async function handleSubmit() {
  if (!createPageData.value) return

  const payload = {
    programStudiId: form.programStudiId,
    tanggalPelaksanaan: form.tanggalPelaksanaan,
    batasWaktuTandaTangan: form.batasWaktuTandaTangan,
  }

  const result = await repository.createBeritaAcara(context.value, payload)
  await navigateTo(buildDetailRoute(result.id))
}

async function handleBack() {
  await navigateTo(buildDashboardRoute())
}

watch(context, async (nextContext) => {
  loading.value = true
  createPageData.value = await repository.getCreatePageData(nextContext)

  form.programStudiId = createPageData.value.defaultValues.programStudiId
  form.tanggalPelaksanaan = createPageData.value.defaultValues.tanggalPelaksanaan
  form.batasWaktuTandaTangan = createPageData.value.defaultValues.batasWaktuTandaTangan

  loading.value = false
}, { immediate: true })

watch([calendarYear, calendarMonthIndex], () => {
  void syncCalendarOptionViewport()
})
</script>

<template>
  <section class="fm5-page mx-auto w-full max-w-[1600px] space-y-4 px-4 pb-7 pt-4 md:space-y-5 md:px-5 2xl:max-w-[1720px] xl:px-6">
    <template v-if="isGkmfMode">
      <section
        v-if="createPageData"
        class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-5 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6"
      >
        <h1 class="text-[clamp(1.5rem,1.9vw,2.2rem)] font-semibold leading-tight text-[#10131b]">
          {{ createPageData.headerTitle }}
        </h1>
        <p class="mt-3 max-w-[1400px] text-[clamp(0.92rem,0.98vw,1.08rem)] leading-relaxed text-[#5b6679]">
          {{ createPageData.headerDescription }}
        </p>
      </section>

      <section
        v-if="createPageData"
        class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-5 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6"
      >
        <h2 class="text-[clamp(1.5rem,1.9vw,2.2rem)] font-semibold leading-tight text-[#10131b]">
          {{ createPageData.sectionTitle }}
        </h2>

        <form
          class="mx-auto mt-5 w-full max-w-[1100px] rounded-[22px] border-2 border-dashed border-[#d6dae2] bg-[#f7f7f8] px-5 py-6 shadow-[0_8px_18px_rgba(15,23,42,0.12)] md:px-7 md:py-7"
          @submit.prevent="handleSubmit"
        >
          <h3 class="text-center text-[clamp(1.25rem,1.55vw,1.75rem)] font-semibold text-[#151922]">
            {{ createPageData.formTitle }}
          </h3>

          <div class="mt-7 space-y-4">
            <div>
              <label class="text-[clamp(0.95rem,1vw,1.05rem)] font-semibold text-[#445066]">
                {{ createPageData.programStudiLabel }}
              </label>
              <label class="relative mt-2 block">
                <select
                  v-model="form.programStudiId"
                  class="fm5-control h-[48px] w-full appearance-none rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 pr-11 text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#1d2430] outline-none"
                >
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
            </div>

            <div>
              <label class="text-[clamp(0.95rem,1vw,1.05rem)] font-semibold text-[#445066]">
                {{ createPageData.tanggalPelaksanaanLabel }}
              </label>
              <button
                type="button"
                class="fm5-control mt-2 flex h-[48px] w-full items-center justify-between rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 text-left text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#1d2430]"
                @click="openCalendar('tanggalPelaksanaan')"
              >
                <span>{{ formatDisplayDate(form.tanggalPelaksanaan) || 'mm/dd/yy' }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 3v4M8 3v4M3 9h18" />
                </svg>
              </button>
            </div>

            <div>
              <label class="text-[clamp(0.95rem,1vw,1.05rem)] font-semibold text-[#445066]">
                {{ createPageData.batasWaktuLabel }}
              </label>
              <button
                type="button"
                class="fm5-control mt-2 flex h-[48px] w-full items-center justify-between rounded-[18px] border border-[#cfd5de] bg-[#f3f4f6] px-4 text-left text-[clamp(0.92rem,0.95vw,1.05rem)] text-[#1d2430]"
                @click="openCalendar('batasWaktuTandaTangan')"
              >
                <span>{{ formatDisplayDate(form.batasWaktuTandaTangan) || '7 Hari Setelah Dibuat' }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 3v4M8 3v4M3 9h18" />
                </svg>
              </button>
            </div>
          </div>

          <div class="mt-6 flex flex-col gap-3 2xl:flex-row">
            <article class="w-full rounded-[16px] border border-[#d7dce5] bg-white p-4 shadow-[0_6px_16px_rgba(15,23,42,0.12)] md:p-5 2xl:flex-[1.7]">
              <div class="flex items-center justify-between">
                <h4 class="text-[clamp(1.15rem,1.25vw,1.4rem)] font-semibold text-[#111827]">
                  {{ calendarMonthLabel }} {{ calendarYear }}
                </h4>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#e30000] transition hover:bg-[#fff2f2]"
                    @click="goToPreviousMonth"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#e30000] transition hover:bg-[#fff2f2]"
                    @click="goToNextMonth"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="mt-4 grid grid-cols-7 gap-y-3 text-center text-[clamp(0.8rem,0.88vw,0.92rem)] text-[#8b92a0]">
                <span v-for="weekday in calendarWeekdays" :key="weekday">{{ weekday }}</span>

                <button
                  v-for="cell in calendarCells"
                  :key="cell.key"
                  type="button"
                  class="fm5-calendar-day mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-[clamp(0.9rem,0.95vw,1.02rem)] transition md:h-10 md:w-10"
                  :class="[
                    cell.inCurrentMonth ? 'text-[#171d2a]' : 'text-[#b7bfcb]',
                    isSelectedDay(cell) ? 'bg-[#e30000] font-semibold text-white' : 'hover:bg-[#f1f3f8]',
                  ]"
                  @click="selectCalendarDay(cell)"
                >
                  {{ cell.day }}
                </button>
              </div>
            </article>

            <div class="grid w-full gap-3 sm:grid-cols-2 sm:items-start 2xl:w-[360px] 2xl:min-w-[360px]">
              <article class="fm5-calendar-list flex h-[320px] flex-col overflow-hidden rounded-[14px] border border-[#d7dce5] bg-white shadow-[0_6px_16px_rgba(15,23,42,0.1)] md:h-[356px]">
                <p class="border-b border-[#e2e7ef] px-4 py-2 text-[0.83rem] font-semibold uppercase tracking-[0.06em] text-[#677286]">
                  Tahun
                </p>
                <div ref="yearListRef" class="flex-1 overflow-y-auto p-2 pr-1">
                  <button
                    v-for="year in yearOptions"
                    :key="year"
                    type="button"
                    :data-active="year === calendarYear ? 'true' : 'false'"
                    class="flex h-9 w-full items-center rounded-[10px] px-3 text-left text-[0.92rem] leading-none transition md:h-10 md:text-[0.98rem]"
                    :class="year === calendarYear ? 'bg-[#e30000] font-semibold text-white' : 'text-[#2a3242] hover:bg-[#f5f7fb]'"
                    @click="setYear(year)"
                  >
                    {{ year }}
                  </button>
                </div>
              </article>

              <article class="fm5-calendar-list flex h-[320px] flex-col overflow-hidden rounded-[14px] border border-[#d7dce5] bg-white shadow-[0_6px_16px_rgba(15,23,42,0.1)] md:h-[356px]">
                <p class="border-b border-[#e2e7ef] px-4 py-2 text-[0.83rem] font-semibold uppercase tracking-[0.06em] text-[#677286]">
                  Bulan
                </p>
                <div ref="monthListRef" class="flex-1 overflow-y-auto p-2 pr-1">
                  <button
                    v-for="(month, index) in monthOptions"
                    :key="month"
                    type="button"
                    :data-active="index === calendarMonthIndex ? 'true' : 'false'"
                    class="flex h-9 w-full items-center rounded-[10px] px-3 text-left text-[0.92rem] leading-none transition md:h-10 md:text-[0.98rem]"
                    :class="index === calendarMonthIndex ? 'bg-[#e30000] font-semibold text-white' : 'text-[#2a3242] hover:bg-[#f5f7fb]'"
                    @click="setMonth(index)"
                  >
                    {{ month }}
                  </button>
                </div>
              </article>
            </div>
          </div>

          <div class="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              class="fm5-submit-secondary inline-flex h-[46px] min-w-[130px] items-center justify-center rounded-[14px] border border-[#d0d6df] bg-[#f6f6f7] px-6 text-[clamp(0.92rem,0.95vw,1rem)] font-medium text-[#626d80] transition hover:bg-[#eceef2] md:h-[50px] md:min-w-[150px] md:rounded-[18px] md:px-8"
              @click="handleBack"
            >
              Batal
            </button>
            <button
              type="submit"
              class="fm5-submit-primary inline-flex h-[46px] min-w-[180px] items-center justify-center rounded-[14px] bg-[#e30000] px-6 text-[clamp(0.95rem,0.98vw,1.08rem)] font-semibold text-white shadow-[0_10px_20px_rgba(227,0,0,0.22)] transition hover:bg-[#ca0000] md:h-[50px] md:min-w-[210px] md:rounded-[18px] md:px-8"
            >
              {{ createPageData.submitLabel }}
            </button>
          </div>
        </form>
      </section>

      <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
        Memuat form FM5...
      </section>
    </template>

    <section
      v-else
      class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]"
    >
      <h2 class="text-[1.35rem] font-semibold text-[#121826]">Mode Role Belum Aktif</h2>
      <p class="mt-2 text-[1rem] leading-relaxed">
        Tampilan saat ini disiapkan untuk role <strong>gkmf</strong>. Untuk simulasi role lain, ubah nilai
        <code class="rounded bg-white px-1.5 py-0.5 text-[0.9rem]">FM5_ACTIVE_DUMMY_ROLE</code>
        pada file data FM5 secara manual.
      </p>
    </section>
  </section>
</template>


