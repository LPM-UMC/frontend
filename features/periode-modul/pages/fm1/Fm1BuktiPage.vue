<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import { getFm01DummyPageData } from '#features/dashboard/data/fm01Dummy'
import { useFormSubmission } from '../../composables/useFormSubmission'
import type { Fm01PageData, Fm01RouteContext } from '../../types/form'

interface Fm1BuktiFormState {
  fileName: string
  driveLink: string
  note: string
}

const FORM_PER_PAGE = 2
const NOTE_MAX_LENGTH = 100
const DEFAULT_DRIVE_LINK = 'https://drive.google.com/drive/folders/1UB-hyfGDCGupa1vSI8zi4yEb-qiUUTf'
const DEFAULT_NOTE = 'Semua dokumen RPS sudah sesuai dengan standar KKNI. Perlu ditambahkan rubrik penilaian untuk setiap mata kuliah yang lebih detail.'

const repository = useFormSubmission('auto')
const route = useRoute()

const pageData = ref<Fm01PageData>(getFm01DummyPageData())
const formStateByAspect = reactive<Record<string, Fm1BuktiFormState>>({})
const isSavingByAspect = reactive<Record<string, boolean>>({})

function normalizeRouteParam(value: string | string[] | undefined): string | null {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

function normalizeQueryParam(value: string | string[] | undefined): string | null {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

const routePeriodeModulId = computed(() =>
  normalizeRouteParam(route.params.periode_modul_id as string | string[] | undefined)
)

const routeUnitId = computed(() =>
  normalizeRouteParam(route.params.unit_id as string | string[] | undefined)
)

const pageFromQuery = computed(() => {
  const raw = normalizeQueryParam(route.query.page as string | string[] | undefined)
  if (!raw) return 1

  const parsed = Number.parseInt(raw, 10)
  if (!Number.isFinite(parsed) || parsed < 1) return 1
  return parsed
})

function getBadgeLabel(index: number): string {
  if (index <= 1 || index === 6) {
    return 'PERANGKAT ASSESMEN & RUBRIK'
  }

  return 'Loremipsun'
}

function createDefaultFormState(index: number): Fm1BuktiFormState {
  return {
    fileName: index === 0 ? 'RPS' : 'Loremipsun',
    driveLink: DEFAULT_DRIVE_LINK,
    note: DEFAULT_NOTE,
  }
}

function initializeFormState() {
  pageData.value.aspectOptions.forEach((aspect, index) => {
    if (!formStateByAspect[aspect.id]) {
      formStateByAspect[aspect.id] = createDefaultFormState(index)
    }

    if (isSavingByAspect[aspect.id] == null) {
      isSavingByAspect[aspect.id] = false
    }
  })
}

const allForms = computed(() => {
  return pageData.value.aspectOptions.map((aspect, index) => {
    const detail = pageData.value.aspectDetails[aspect.id]

    return {
      id: aspect.id,
      number: index + 1,
      title: detail?.title ?? aspect.label,
      description: detail?.description ?? 'Loremipsun',
      badgeLabel: getBadgeLabel(index),
      form: formStateByAspect[aspect.id] ?? createDefaultFormState(index),
    }
  })
})

const totalForms = computed(() => allForms.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalForms.value / FORM_PER_PAGE)))
const currentPage = computed(() => Math.min(pageFromQuery.value, totalPages.value))

const paginatedForms = computed(() => {
  const start = (currentPage.value - 1) * FORM_PER_PAGE
  return allForms.value.slice(start, start + FORM_PER_PAGE)
})

const showingFrom = computed(() => {
  if (!totalForms.value) return 0
  return (currentPage.value - 1) * FORM_PER_PAGE + 1
})

const showingTo = computed(() => {
  if (!totalForms.value) return 0
  return Math.min(currentPage.value * FORM_PER_PAGE, totalForms.value)
})

function buildBuktiRoutePath(): string | null {
  if (!routePeriodeModulId.value || !routeUnitId.value) return null

  return `/dashboard/periode-modul/${encodeURIComponent(routePeriodeModulId.value)}/unit/${encodeURIComponent(routeUnitId.value)}/fm1/bukti`
}

function buildPageQuery(page: number): Record<string, string> {
  if (page <= 1) return {}
  return { page: String(page) }
}

async function goToPage(nextPage: number) {
  if (nextPage < 1 || nextPage > totalPages.value) return

  const targetPath = buildBuktiRoutePath() ?? route.path
  await navigateTo({
    path: targetPath,
    query: buildPageQuery(nextPage),
  })
}

function handleFileChange(aspectId: string, event: Event) {
  const input = event.target as HTMLInputElement | null
  const selectedFile = input?.files?.[0] ?? null
  if (!selectedFile) return

  const state = formStateByAspect[aspectId]
  if (!state) return

  state.fileName = selectedFile.name
}

function updateNote(aspectId: string, value: string) {
  const state = formStateByAspect[aspectId]
  if (!state) return

  state.note = value.slice(0, NOTE_MAX_LENGTH)
}

async function saveBukti(aspectId: string) {
  if (isSavingByAspect[aspectId]) return

  isSavingByAspect[aspectId] = true
  isSavingByAspect[aspectId] = false
}

async function loadPageData() {
  if (!routePeriodeModulId.value || !routeUnitId.value) {
    pageData.value = getFm01DummyPageData()
    return
  }

  const context: Fm01RouteContext = {
    periodeModulId: routePeriodeModulId.value,
    unitId: routeUnitId.value,
    aspekId: pageData.value.activeAspectId,
  }

  pageData.value = await repository.getPageData(context)
  initializeFormState()
}

watch([routePeriodeModulId, routeUnitId], async () => {
  await loadPageData()
})

watch(
  [currentPage, totalPages],
  async () => {
    if (currentPage.value !== pageFromQuery.value) {
      await goToPage(currentPage.value)
    }
  },
  { immediate: true }
)

onMounted(async () => {
  initializeFormState()
  await loadPageData()
})
</script>

<template>
  <section class="mx-auto w-full max-w-280 px-2.5 pb-4 pt-3.5 sm:px-3.5 sm:pb-5 md:px-4.5 lg:px-5">
    <article class="overflow-hidden rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8]">
      <template v-for="(item, index) in paginatedForms" :key="item.id">
        <header class="px-3 pb-3 pt-3 sm:px-6 sm:pb-4 sm:pt-4.5">
          <div class="flex items-start gap-3">
            <span class="grid h-8 w-8 place-items-center rounded-full bg-[#e60000] text-[13px] font-semibold text-white">
              {{ item.number }}
            </span>

            <div>
              <span class="inline-flex rounded-full bg-[#f8dddf] px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-[#e60000]">
                {{ item.badgeLabel }}
              </span>
              <h2 class="mt-1.5 text-[20px] font-bold leading-tight text-[#182132] sm:text-[23px] lg:text-[25px]">
                {{ item.title }}
              </h2>
              <p class="mt-1 text-[12px] leading-normal text-[#5f697d] sm:text-[13px]">
                {{ item.description }}
              </p>
            </div>
          </div>
        </header>

        <div class="border-t border-[#dbe0e8] px-3 pb-4 pt-3 sm:px-6 sm:pb-5 sm:pt-4">
          <div class="flex items-start gap-2.5">
            <span class="grid h-8 w-8 place-items-center rounded-full bg-[#d8e8ff] text-[#4b75db]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m5.25 2.25c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9Z" />
              </svg>
            </span>

            <div>
              <h3 class="text-[16px] font-semibold text-[#182132] sm:text-[17px] lg:text-[18px]">
                Bukti Pendukung Integrasi
              </h3>
              <p class="text-[12px] text-[#626d80] sm:text-[14px] lg:text-[15px]">
                Unggah dokumen dan link pendukung yang menunjukkan integrasi pembelajaran
              </p>
            </div>
          </div>

          <div class="mt-3 space-y-2.5">
            <div>
              <p class="text-[12px] font-semibold text-[#2b3446] sm:text-[13px] lg:text-[14px]">
                Dokumen Bukti (PDF)<span class="text-[#e60000]">*</span>
              </p>

              <label
                :for="`bukti-file-${item.id}`"
                class="mt-1.5 block cursor-pointer rounded-[12px] border border-[#d6dce6] bg-[#f4f6f9] px-3 py-2.5 transition hover:bg-[#eef2f7]"
              >
                <div class="flex items-center gap-3">
                  <span
                    class="grid h-8 w-8 place-items-center rounded-[10px] bg-[#e8edf3] text-[#8590a2]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5v-9m0 0L8.625 10.875M12 7.5l3.375 3.375M3.75 15.75v2.625A1.875 1.875 0 0 0 5.625 20.25h12.75a1.875 1.875 0 0 0 1.875-1.875V15.75" />
                    </svg>
                  </span>

                  <div>
                    <p class="text-[12px] font-semibold text-[#2a3446] sm:text-[14px] lg:text-[15px]">
                      Pilih Berkas
                    </p>
                    <p class="text-[10px] text-[#6f7b8e] sm:text-[12px] lg:text-[13px]">
                      ({{ item.form.fileName }})
                    </p>
                  </div>
                </div>

                <input
                  :id="`bukti-file-${item.id}`"
                  type="file"
                  accept=".pdf,application/pdf"
                  class="hidden"
                  @change="handleFileChange(item.id, $event)"
                >
              </label>

              <p class="mt-1 text-[10px] text-[#8a95a8] sm:text-[11px] lg:text-[12px]">
                Tidak ada file yang dipilih. Maksimal 10 MB
              </p>
            </div>

            <div>
              <p class="text-[12px] font-semibold text-[#2b3446] sm:text-[13px] lg:text-[14px]">
                Link Dokumen Google Drive
              </p>

              <div class="relative mt-1.5">
                <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b7]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.99 14.51 6.02-6.02m-4.51 9.03-1.77 1.77a3 3 0 1 1-4.24-4.24l1.77-1.77m9.03-4.51 1.77-1.77a3 3 0 1 1 4.24 4.24l-1.77 1.77" />
                  </svg>
                </span>
                <input
                  v-model="item.form.driveLink"
                  type="url"
                  class="h-10 w-full rounded-[12px] border border-[#d2d8e2] bg-[#f8f9fb] px-9 text-[11px] text-[#3f4a5d] outline-none placeholder:text-[#97a2b4] sm:text-[12px] lg:text-[13px]"
                >
              </div>

              <p class="mt-1 text-[10px] text-[#8a95a8] sm:text-[11px] lg:text-[12px]">
                Lihat Format Bukti <span class="text-[#5f86da]">Disini</span>
              </p>
            </div>

            <div>
              <p class="text-[12px] font-semibold text-[#2b3446] sm:text-[13px] lg:text-[14px]">
                Catatan Kaprodi
              </p>

              <textarea
                :value="item.form.note"
                rows="4"
                class="mt-1.5 w-full rounded-[12px] border border-[#d2d8e2] bg-[#f8f9fb] px-3 py-2.5 text-[11px] text-[#3f4a5d] outline-none placeholder:text-[#97a2b4] sm:text-[12px] lg:text-[13px]"
                @input="updateNote(item.id, ($event.target as HTMLTextAreaElement).value)"
              />

              <div class="mt-1 flex items-center justify-between text-[10px] text-[#8a95a8] sm:text-[11px] lg:text-[12px]">
                <p>Berikan catatan atau keterangan tambahan, dengan maksimal karakter 100</p>
                <p>{{ item.form.note.length }} karakter</p>
              </div>
            </div>

            <div class="flex justify-end pt-1">
              <button
                type="button"
                class="rounded-[12px] bg-[#e60000] px-4 py-2 text-[11px] font-semibold text-white transition hover:brightness-95 disabled:opacity-70 sm:text-[12px] lg:px-5 lg:py-2.5 lg:text-[13px]"
                :disabled="isSavingByAspect[item.id]"
                @click="saveBukti(item.id)"
              >
                {{ isSavingByAspect[item.id] ? 'Menyimpan...' : 'Simpan Bukti Pendukung' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="index < paginatedForms.length - 1" class="px-3 pb-3 sm:px-6 sm:pb-4">
          <div class="relative flex items-center justify-center">
            <span class="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#dde2ea]" />
            <span class="relative bg-[#f6f7f8] px-2 text-[10px] font-semibold tracking-wide text-[#9aa5b7] sm:text-[11px]">
              DOKUMEN LAINNYA
            </span>
          </div>
        </div>
      </template>

      <footer class="flex flex-wrap items-center justify-between gap-2.5 border-t border-[#dde2ea] px-3 py-3 sm:px-6 sm:py-3.5">
        <p class="text-[11px] text-[#4f5c6f] sm:text-[12px] lg:text-[13px]">
          Form Pengisian <strong>{{ showingFrom }}-{{ showingTo }}</strong> dari <strong>{{ totalForms }}</strong> data
        </p>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-[10px] border border-[#d5dae3] px-3 py-1 text-[11px] font-semibold text-[#9aa4b5] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:text-[12px] lg:text-[13px]"
            :disabled="currentPage <= 1"
            @click="goToPage(currentPage - 1)"
          >
            Previous
          </button>

          <button
            type="button"
            class="rounded-[10px] bg-[#e60000] px-3 py-1 text-[11px] font-semibold text-white sm:text-[12px] lg:text-[13px]"
          >
            {{ currentPage }}
          </button>

          <button
            type="button"
            class="rounded-[10px] border border-[#d5dae3] px-3 py-1 text-[11px] font-semibold text-[#9aa4b5] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:text-[12px] lg:text-[13px]"
            :disabled="currentPage >= totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </footer>
    </article>
  </section>
</template>
