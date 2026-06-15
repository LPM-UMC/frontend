<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { navigateTo, useRoute, useToast } from '#imports'
import { useFm1Store } from '#stores/fm1'
import { simpanBuktiInstrumenValidation } from '#validations/fm1-validation'
import { useI18n } from 'vue-i18n'

interface Fm1BuktiFormState {
  link: string
  catatan: string
  errors?: {
    link?: string
    catatan?: string
  }
}

const FORM_PER_PAGE = 5
const NOTE_MAX_LENGTH = 2000

const route = useRoute()
const toast = useToast()
const fm1Store = useFm1Store()
const { t } = useI18n()

const routePeriodeModulId = computed(() => route.params.periode_modul_id as string)
const routeUnitId = computed(() => route.params.unit_id as string)

const canInput = computed(() => {
  const fm = fm1Store.informasi?.fm?.fm;
  const status = fm1Store.informasi?.fm?.status_pelaksanaan?.kode;
  return status === 'SEDANG_BERLANGSUNG';
})

const currentPage = computed(() => {
  const raw = route.query.page as string
  if (!raw) return 1
  const parsed = Number.parseInt(raw, 10)
  return (!Number.isFinite(parsed) || parsed < 1) ? 1 : parsed
})

const formStateByAspect = ref<Record<string, Fm1BuktiFormState>>({})
const isSavingByAspect = ref<Record<string, boolean>>({})

function initializeFormState() {
  fm1Store.buktiInstrumenList.forEach((item) => {
    if (!formStateByAspect.value[item.id]) {
      formStateByAspect.value[item.id] = {
        link: item.bukti_instrumen?.link || '',
        catatan: item.bukti_instrumen?.catatan || '',
      }
    }
    if (isSavingByAspect.value[item.id] == null) {
      isSavingByAspect.value[item.id] = false
    }
  })
}

const paginatedForms = computed(() => {
  return fm1Store.buktiInstrumenList.map((item, index) => {
    const globalIndex = showingFrom.value + index
    return {
      id: item.id,
      number: globalIndex,
      title: item.aspek.nama,
      description: item.aspek.deskripsi || '',
      badgeLabel: t('fmMonitoring.buktiInstrumen.dokumenBukti'),
      panduan: item.panduan,
      form: formStateByAspect.value[item.id] || { link: '', catatan: '' },
    }
  })
})

const totalForms = computed(() => fm1Store.buktiInstrumenMeta?.total || 0)
const totalPages = computed(() => fm1Store.buktiInstrumenMeta?.total_pages || 1)

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

function updateCatatan(aspectId: string, value: string) {
  const state = formStateByAspect.value[aspectId]
  if (!state) return

  state.catatan = value.slice(0, NOTE_MAX_LENGTH)
  validateField(aspectId, 'catatan', state.catatan)
}

function updateLink(aspectId: string, value: string) {
  const state = formStateByAspect.value[aspectId]
  if (!state) return
  
  state.link = value
  validateField(aspectId, 'link', value)
}

function validateField(aspectId: string, field: keyof Fm1BuktiFormState, value: string) {
  const state = formStateByAspect.value[aspectId]
  if (!state) return

  const mockPayload = { ...state, [field]: value }
  const result = simpanBuktiInstrumenValidation(t).safeParse(mockPayload)
  
  if (!state.errors) state.errors = {}
  
  if (!result.success) {
    const errorMsg = result.error.flatten().fieldErrors[field]?.[0]
    if (errorMsg) {
      state.errors[field] = errorMsg
    } else {
      delete state.errors[field]
    }
  } else {
    delete state.errors[field]
  }
}

function validateForm(aspectId: string) {
  const state = formStateByAspect.value[aspectId]
  if (!state) return false

  const result = simpanBuktiInstrumenValidation(t).safeParse({ link: state.link, catatan: state.catatan })
  
  state.errors = {}
  if (!result.success) {
    state.errors.link = result.error.flatten().fieldErrors.link?.[0]
    state.errors.catatan = result.error.flatten().fieldErrors.catatan?.[0]
    return false
  }
  
  return true
}

async function saveBukti(aspectId: string) {
  if (isSavingByAspect.value[aspectId]) return
  if (!validateForm(aspectId)) return

  isSavingByAspect.value[aspectId] = true

  const state = formStateByAspect.value[aspectId]
  const payload = {
    link: state.link,
    catatan: state.catatan
  }

  const success = await fm1Store.simpanBuktiInstrumen(aspectId, routeUnitId.value, payload)

  if (success) {
    toast.add({
      title: 'Berhasil',
      description: t('fmMonitoring.buktiInstrumen.berhasilMenyimpan'),
      color: 'primary'
    })
  } else {
    toast.add({
      title: 'Gagal Menyimpan',
      description: t('fmMonitoring.buktiInstrumen.gagalMenyimpan'),
      color: 'error'
    })
  }

  isSavingByAspect.value[aspectId] = false
}

async function loadData() {
  if (!routeUnitId.value) return
  await fm1Store.fetchBuktiInstrumenList(routeUnitId.value, currentPage.value, FORM_PER_PAGE)
  initializeFormState()
}

watch(
  () => route.fullPath,
  async () => {
    await loadData()
  }
)

onMounted(async () => {
  await loadData()
})
</script>

<template>
  <section class="mx-auto w-full max-w-4xl px-3 pb-4 pt-3.5 sm:px-4 sm:pb-5">
    <article class="overflow-hidden rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8]">
      <template v-for="(item, index) in paginatedForms" :key="item.id">
        <header class="px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-5">
          <div class="flex items-start gap-3">
            <span class="grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-full bg-[#e60000] text-[12px] sm:text-[13px] font-semibold text-white">
              {{ item.number }}
            </span>

            <div>
              <span class="inline-flex rounded-full bg-[#f8dddf] px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold tracking-wide text-[#e60000]">
                {{ item.badgeLabel }}
              </span>
              <h2 class="mt-1 text-[16px] font-bold leading-tight text-[#182132] sm:text-[18px] lg:text-[20px]">
                {{ item.title }}
              </h2>
              <p class="mt-1 text-[11px] leading-relaxed text-[#5f697d] sm:text-[12px]">
                {{ item.description }}
              </p>
            </div>
          </div>
        </header>

        <div class="border-t border-[#dbe0e8] px-4 pb-4 pt-3 sm:px-6 sm:pb-5 sm:pt-4">
          <div class="flex items-start gap-2.5">
            <span class="grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-full bg-[#d8e8ff] text-[#4b75db]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-4.5 sm:w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m5.25 2.25c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9Z" />
              </svg>
            </span>

            <div>
              <h3 class="text-[14px] font-semibold text-[#182132] sm:text-[15px] lg:text-[16px]">
                {{ $t('fmMonitoring.buktiInstrumen.buktiPendukung') }}
              </h3>
              <p class="text-[11px] text-[#626d80] sm:text-[12px] lg:text-[13px]">
                {{ $t('fmMonitoring.buktiInstrumen.cantumkanLink') }}
              </p>
            </div>
          </div>

          <div class="mt-3.5 space-y-4">
            <div>
              <p class="text-[11px] font-semibold text-[#2b3446] sm:text-[12px] lg:text-[13px]">
                {{ $t('fmMonitoring.buktiInstrumen.linkGoogleDrive') }} <span class="text-[#e60000]">*</span>
              </p>

              <div class="relative mt-1.5">
                <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa5b7]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.99 14.51 6.02-6.02m-4.51 9.03-1.77 1.77a3 3 0 1 1-4.24-4.24l1.77-1.77m9.03-4.51 1.77-1.77a3 3 0 1 1 4.24 4.24l-1.77 1.77" />
                  </svg>
                </span>
                <input
                  :value="item.form.link"
                  type="url"
                  class="h-9 w-full rounded-[10px] border bg-[#f8f9fb] px-8 text-[11px] text-[#3f4a5d] outline-none placeholder:text-[#97a2b4] transition focus:border-[#4b75db] disabled:opacity-80 disabled:cursor-not-allowed sm:h-10 sm:px-9 sm:text-[12px]"
                  :class="item.form.errors?.link ? 'border-[#e60000] focus:border-[#e60000]' : 'border-[#d2d8e2]'"
                  :disabled="!canInput"
                  @input="updateLink(item.id, ($event.target as HTMLInputElement).value)"
                  placeholder="https://drive.google.com/..."
                >
              </div>
              
              <p v-if="item.form.errors?.link" class="mt-1 text-[10px] text-[#e60000]">
                {{ item.form.errors.link }}
              </p>

              <p v-if="item.panduan?.link" class="mt-1.5 text-[10px] text-[#8a95a8] sm:text-[11px]">
                {{ $t('fmMonitoring.buktiInstrumen.lihatFormatBukti') }} <a :href="item.panduan.link" target="_blank" rel="noopener" class="text-[#5f86da] hover:underline">Disini</a>
              </p>
              <p v-if="item.panduan?.catatan" class="mt-1 text-[10px] text-[#8a95a8] sm:text-[11px]">
                {{ $t('fmMonitoring.buktiInstrumen.catatanPanduan') }} {{ item.panduan.catatan }}
              </p>
            </div>

            <div>
              <p class="text-[11px] font-semibold text-[#2b3446] sm:text-[12px] lg:text-[13px]">
                {{ $t('fmMonitoring.buktiInstrumen.catatanTambahan') }}
              </p>

              <textarea
                :value="item.form.catatan"
                rows="3"
                class="mt-1.5 w-full rounded-[10px] border bg-[#f8f9fb] px-3 py-2 text-[11px] text-[#3f4a5d] outline-none placeholder:text-[#97a2b4] transition focus:border-[#4b75db] disabled:opacity-80 disabled:cursor-not-allowed sm:py-2.5 sm:text-[12px]"
                :class="item.form.errors?.catatan ? 'border-[#e60000] focus:border-[#e60000]' : 'border-[#d2d8e2]'"
                :disabled="!canInput"
                @input="updateCatatan(item.id, ($event.target as HTMLTextAreaElement).value)"
                :placeholder="$t('fmMonitoring.buktiInstrumen.berikanDeskripsi')"
              />
              
              <p v-if="item.form.errors?.catatan" class="mt-1 text-[10px] text-[#e60000]">
                {{ item.form.errors.catatan }}
              </p>

              <div class="mt-1 flex items-center justify-between text-[9px] text-[#8a95a8] sm:text-[10px]">
                <p>{{ $t('fmMonitoring.buktiInstrumen.maksimal2000Karakter') }}</p>
                <p>{{ item.form.catatan.length }} / 2000</p>
              </div>
            </div>

            <div v-if="canInput" class="flex justify-end pt-1">
              <button
                type="button"
                class="rounded-[10px] bg-[#e60000] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#ca0000] disabled:cursor-not-allowed disabled:opacity-70 sm:text-[12px] cursor-pointer"
                :disabled="isSavingByAspect[item.id]"
                @click="saveBukti(item.id)"
              >
                <span class="flex items-center gap-1.5">
                  <svg v-if="isSavingByAspect[item.id]" class="h-3 w-3 animate-spin text-white sm:h-3.5 sm:w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isSavingByAspect[item.id] ? $t('fmMonitoring.buktiInstrumen.menyimpan') : $t('fmMonitoring.buktiInstrumen.simpanBukti') }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div v-if="index < paginatedForms.length - 1" class="px-4 pb-3 sm:px-6 sm:pb-4">
          <div class="relative flex items-center justify-center">
            <span class="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#dde2ea]" />
            <span class="relative bg-[#f6f7f8] px-2 text-[9px] font-semibold tracking-wider text-[#9aa5b7] sm:text-[10px]">
              {{ $t('fmMonitoring.buktiInstrumen.dokumenLainnya') }}
            </span>
          </div>
        </div>
      </template>

      <footer class="flex flex-col gap-3 border-t border-[#dde2ea] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-3.5">
        <p class="text-[10px] text-[#4f5c6f] sm:text-[11px] lg:text-[12px] text-center sm:text-left">
        </p>

        <div class="flex items-center justify-center gap-2">
          <button
            type="button"
            class="rounded-[8px] border border-[#d5dae3] px-3 py-1 text-[10px] font-semibold text-[#9aa4b5] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 sm:py-1 sm:text-[11px] cursor-pointer"
            :disabled="currentPage <= 1"
            @click="goToPage(currentPage - 1)"
          >
            {{ $t('fmMonitoring.buktiInstrumen.previous') }}
          </button>

          <button
            type="button"
            class="rounded-[8px] bg-[#e60000] px-3 py-1 text-[10px] font-semibold text-white sm:text-[11px]"
          >
            {{ currentPage }}
          </button>

          <button
            type="button"
            class="rounded-[8px] border border-[#d5dae3] px-3 py-1 text-[10px] font-semibold text-[#9aa4b5] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 sm:py-1 sm:text-[11px] cursor-pointer"
            :disabled="currentPage >= totalPages"
            @click="goToPage(currentPage + 1)"
          >
            {{ $t('fmMonitoring.buktiInstrumen.next') }}
          </button>
        </div>
      </footer>
    </article>
  </section>
</template>
