<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="isIndicatorModalOpen" class="fixed inset-0 z-[40] bg-black/55 px-2 py-3 sm:px-4 sm:py-6" @click.self="closeIndicatorModal">
        <div class="mx-auto flex max-h-full w-full max-w-[95vw] xl:max-w-[1400px] flex-col overflow-hidden rounded-[14px] bg-[#f6f7f8] shadow-[0_22px_50px_rgba(0,0,0,0.4)]">

          <div class="shrink-0 px-4 pt-4 sm:px-6 sm:pt-6">
            <header class="flex items-start justify-between gap-2.5">
              <div>
                <h2 class="text-[18px] font-bold text-[#111a2f] sm:text-[21px]">
                  {{ $t('periodeModul.indikatoEvaluasi') }}
                </h2>
                <p class="mt-0.5 text-[11px] text-[#6b7689] sm:text-[12px]">
                  {{ $t('periodeModul.pastikanIndikatorDinilai') }}
                </p>
              </div>
              <button type="button" aria-label="Close" class="text-[#9ca4b4] transition hover:text-[#6b7280] cursor-pointer" @click="closeIndicatorModal">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </header>
            <div class="mt-3 border-t border-[#d5dae2]" />
          </div>

          <div class="flex-1 overflow-y-auto px-4 pb-4 pt-3 sm:px-6 sm:pb-6 sm:pt-3">
            <section class="space-y-4">
              
              <div v-if="fm1Store.isLoadingJawaban" class="flex justify-center py-10">
                <svg class="h-8 w-8 animate-spin text-[#e60000]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              
              <article v-else-if="fm1Store.jawabanIndikator.length === 0" class="py-10 text-center text-sm text-gray-500">
                Tidak ada indikator untuk objek ini.
              </article>

              <template v-else>
                <article v-for="(item, index) in fm1Store.jawabanIndikator" :key="item.id" class="rounded-[14px] border border-[#dbe0e6] bg-[#eff1f4] p-3 sm:p-4">
                  <div class="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
                    <div class="flex items-start gap-2.5">
                      <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#15b9ad] text-[14px] font-semibold text-white sm:h-9 sm:w-9 sm:text-[15px]">
                        {{ index + 1 }}
                      </span>
                      <div>
                        <h3 class="text-[14px] font-semibold leading-tight text-[#111a2f] sm:text-[16px]">
                          {{ item.indikator.nama }}
                        </h3>
                        <p v-if="item.indikator.deskripsi" class="mt-0.5 max-w-[480px] text-[11px] leading-[1.5] text-[#546174] sm:text-[12px]">
                          {{ item.indikator.deskripsi }}
                        </p>
                      </div>
                    </div>
                    <span class="inline-flex shrink-0 rounded-full bg-[#f2e1c7] px-3 py-1 text-[10px] font-semibold text-[#d45200] sm:text-[11px]">
                      {{ $t(`fmMonitoring.evaluasi.tipe${item.indikator.tipe_evaluasi.charAt(0) + item.indikator.tipe_evaluasi.slice(1).toLowerCase()}`) }}
                    </span>
                  </div>

                  <!-- BINER TYPE -->
                  <div v-if="item.indikator.tipe_evaluasi === 'BINER' && localForms[item.id]" class="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
                    <button type="button" class="rounded-[10px] border px-4 py-2.5 text-[12px] font-semibold transition sm:text-[13px]"
                      :class="[localForms[item.id]?.biner === true ? 'border-[#15b9ad] bg-[#15b9ad] text-white hover:bg-[#13a89d]' : 'border-[#c5ccd6] bg-white text-[#3d485c] hover:bg-[#f8f9fa]', fm1Store.isEvaluator ? 'cursor-pointer' : 'opacity-80']"
                      :disabled="!fm1Store.isEvaluator"
                      @click="setBiner(item, true)">
                      {{ $t('util.boolean.true') }}
                    </button>
                    <button type="button" class="rounded-[10px] border px-4 py-2.5 text-[12px] font-semibold transition sm:text-[13px]"
                      :class="[localForms[item.id]?.biner === false ? 'border-[#e60000] bg-[#e60000] text-white hover:bg-[#cc0000]' : 'border-[#c5ccd6] bg-white text-[#3d485c] hover:bg-[#f8f9fa]', fm1Store.isEvaluator ? 'cursor-pointer' : 'opacity-80']"
                      :disabled="!fm1Store.isEvaluator"
                      @click="setBiner(item, false)">
                      {{ $t('util.boolean.false') }}
                    </button>
                  </div>
                  <p v-if="formErrors[item.id]?.biner" class="mt-1 text-xs text-[#e30000] sm:text-sm">
                    {{ formErrors[item.id]?.biner }}
                  </p>

                  <!-- SKALA TYPE -->
                  <div v-if="item.indikator.tipe_evaluasi === 'SKALA' && localForms[item.id]" class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <button v-for="skala in item.opsi.skalas" :key="skala.id" type="button"
                      class="rounded-[10px] border px-2 py-3 text-center transition" 
                      :class="[localForms[item.id]?.skala_id === skala.id ? 'border-[#e60000] bg-[#fff2f2]' : 'border-[#c8cfda] bg-[#f8f9fb]', fm1Store.isEvaluator ? 'cursor-pointer hover:bg-white' : 'opacity-80']"
                      :disabled="!fm1Store.isEvaluator"
                      @click="setSkala(item, skala.id)">
                      <span class="block text-[16px] font-bold text-[#111] sm:text-[18px]">
                        {{ skala.nilai }}
                      </span>
                      <span class="mt-1 block text-[10px] font-medium leading-[1.25] text-[#222] sm:text-[12px]">
                        {{ skala.nama }}
                      </span>
                    </button>
                  </div>
                  <p v-if="formErrors[item.id]?.skala_id" class="mt-1 text-xs text-[#e30000] sm:text-sm">
                    {{ formErrors[item.id]?.skala_id }}
                  </p>

                  <!-- CEK TYPE -->
                  <div v-if="item.indikator.tipe_evaluasi === 'CEK' && localForms[item.id]" class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <button v-for="cek in item.opsi.checklists" :key="cek.id" type="button"
                      class="flex items-center gap-3 rounded-[10px] px-3 py-2 text-left transition"
                      :class="fm1Store.isEvaluator ? 'cursor-pointer hover:bg-[#f7f7f7]' : 'opacity-80'"
                      :disabled="!fm1Store.isEvaluator"
                      @click="toggleCek(item, cek.id)">
                      <span class="grid h-8 w-8 place-items-center rounded-[8px] text-white sm:h-8 sm:w-8 shrink-0"
                        :class="isCekChecked(item.id, cek.id) ? 'bg-[#e60000]' : 'bg-[#4f4f50]'">
                        <svg v-if="isCekChecked(item.id, cek.id)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </span>
                      <span class="text-[12px] font-medium text-[#3e495d] sm:text-[13px]">
                        {{ cek.nama }}
                      </span>
                    </button>
                  </div>
                  <p v-if="formErrors[item.id]?.cek_ids" class="mt-1 text-xs text-[#e30000] sm:text-sm">
                    {{ formErrors[item.id]?.cek_ids }}
                  </p>

                  <!-- CATATAN -->
                  <div v-if="localForms[item.id]" class="mt-4">
                    <label class="block text-[13px] font-semibold text-[#3e495d] mb-1.5">
                      {{ $t('fmMonitoring.evaluasi.catatanLabel') }} <span class="text-[#e60000]">*</span>
                    </label>
                    <textarea v-model="localForms[item.id]!.catatan" rows="3"
                      class="w-full rounded-[12px] border border-[#c8cfda] bg-[#f9fafb] px-4 py-3 text-[12px] text-[#3f4a5e] outline-none placeholder:text-[#8f98a8] focus:border-[#b8c0cb] sm:text-[13px] disabled:opacity-80 disabled:bg-[#f1f3f5]"
                      :disabled="!fm1Store.isEvaluator"
                      :placeholder="$t('fmMonitoring.placeholder.berikanJustifikasi')"
                      @input="validateFieldSingle(item, 'catatan')" />
                    <p v-if="formErrors[item.id]?.catatan" class="mt-1 text-xs text-[#e30000] sm:text-sm">
                      {{ formErrors[item.id]?.catatan }}
                    </p>
                  </div>

                  <!-- SIMPAN BUTTON -->
                  <div v-if="fm1Store.isEvaluator" class="mt-4 flex justify-end">
                    <button type="button"
                      class="flex items-center gap-1.5 rounded-[10px] bg-[#e60000] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#ca0000] disabled:opacity-50 disabled:cursor-not-allowed sm:text-[13px] cursor-pointer"
                      :disabled="isSaving[item.id] || !localForms[item.id]" @click="saveIndicator(item)">
                      <svg v-if="isSaving[item.id]" class="h-3.5 w-3.5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>{{ isSaving[item.id] ? $t('fmMonitoring.evaluasi.menyimpan') : $t('fmMonitoring.evaluasi.simpan') }}</span>
                    </button>
                  </div>
                </article>
              </template>

            </section>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { useFm1Store } from '#stores/fm1'
import type { IndikatorAndAnswerResponse, JawabInstrumenRequest } from '#types/fm1'
import { useToast } from '#imports'
import { useI18n } from 'vue-i18n'
import { jawabInstrumenValidation } from '#validations/fm1-validation'

const fm1Store = useFm1Store()
const toast = useToast()
const { t } = useI18n()

const isIndicatorModalOpen = defineModel<boolean>('isOpen', { default: false })
const selectedObject = defineModel<any>('selectedRow', { default: null })

const localForms = ref<Record<string, {
  biner: boolean | null;
  skala_id: string | null;
  cek_ids: string[];
  catatan: string;
}>>({})

const formErrors = reactive<Record<string, {
  biner?: string;
  skala_id?: string;
  cek_ids?: string;
  catatan?: string;
}>>({})

const isSaving = ref<Record<string, boolean>>({})

watch(isIndicatorModalOpen, async (isOpen) => {
  if (isOpen && selectedObject.value?.id) {
    document.body.style.overflow = 'hidden'
    await fm1Store.fetchJawaban(selectedObject.value.id, fm1Store.detailAspek?.id as string)
    
    const newForms: Record<string, any> = {}
    for (const item of fm1Store.jawabanIndikator) {
      newForms[item.id] = {
        biner: item.jawaban?.selected_biner ?? null,
        skala_id: item.jawaban?.selected_skala_id ?? null,
        cek_ids: [...(item.jawaban?.selected_checklist_ids || [])],
        catatan: item.jawaban?.catatan ?? ''
      }
      formErrors[item.id] = {
        biner: '',
        skala_id: '',
        cek_ids: '',
        catatan: ''
      }
    }
    localForms.value = newForms
  } else {
    document.body.style.overflow = ''
  }
})

function closeIndicatorModal() {
  isIndicatorModalOpen.value = false
  selectedObject.value = null
}

function setBiner(item: IndikatorAndAnswerResponse, val: boolean) {
  if (localForms.value[item.id]) {
    localForms.value[item.id]!.biner = val
    validateFieldSingle(item, 'biner')
  }
}

function setSkala(item: IndikatorAndAnswerResponse, skalaId: string) {
  if (localForms.value[item.id]) {
    localForms.value[item.id]!.skala_id = skalaId
    validateFieldSingle(item, 'skala_id')
  }
}

function isCekChecked(id: string, cekId: string) {
  return localForms.value[id]?.cek_ids.includes(cekId)
}

function toggleCek(item: IndikatorAndAnswerResponse, cekId: string) {
  if (!localForms.value[item.id]) return
  const current = localForms.value[item.id]!.cek_ids
  if (current.includes(cekId)) {
    localForms.value[item.id]!.cek_ids = current.filter(c => c !== cekId)
  } else {
    localForms.value[item.id]!.cek_ids.push(cekId)
  }
  validateFieldSingle(item, 'cek_ids')
}

function validateForm(item: IndikatorAndAnswerResponse) {
  if (!formErrors[item.id]) {
    formErrors[item.id] = {}
  }
  
  Object.keys(formErrors[item.id]!).forEach((key) => {
    formErrors[item.id]![key as keyof typeof formErrors[string]] = ''
  })

  const form = localForms.value[item.id]
  const schema = jawabInstrumenValidation(t as any, item.indikator.tipe_evaluasi)
  const result = schema.safeParse(form || {})

  if (result.success) {
    return true
  }

  result.error.issues.forEach((issue) => {
    const field = issue.path[0]
    if (field && formErrors[item.id]) {
      formErrors[item.id]![field as keyof typeof formErrors[string]] = issue.message
    }
  })

  return false
}

function validateFieldSingle(item: IndikatorAndAnswerResponse, field: keyof typeof formErrors[string]) {
  if (!formErrors[item.id]) {
    formErrors[item.id] = {}
  }
  formErrors[item.id]![field] = ''

  const form = localForms.value[item.id]
  const schema = jawabInstrumenValidation(t as any, item.indikator.tipe_evaluasi)
  const result = schema.safeParse(form || {})

  if (!result.success) {
    const issue = result.error.issues.find(i => i.path[0] === field)
    if (issue) {
      formErrors[item.id]![field] = issue.message
    }
  }
}

async function saveIndicator(item: IndikatorAndAnswerResponse) {
  if (!selectedObject.value?.id) return

  const isValid = validateForm(item)
  if (!isValid) {
    toast.add({
      title: t('fmMonitoring.evaluasi.toast.gagalJudul'),
      description: t('fmMonitoring.evaluasi.toast.validasiGagal'),
      color: 'error',
    })
    return
  }

  isSaving.value[item.id] = true
  const form = localForms.value[item.id]!

  const payload: JawabInstrumenRequest = {
    catatan: form.catatan,
  }

  if (item.indikator.tipe_evaluasi === 'BINER' && form.biner !== null) {
    payload.biner = form.biner
  }
  if (item.indikator.tipe_evaluasi === 'SKALA' && form.skala_id !== null) {
    payload.skala_id = form.skala_id
  }
  if (item.indikator.tipe_evaluasi === 'CEK') {
    payload.cek_ids = form.cek_ids
  }

  const success = await fm1Store.saveJawaban(item.id, selectedObject.value.id, payload)
  
  if (success) {
    toast.add({
      title: t('util.berhasil'),
      description: t('fmMonitoring.evaluasi.toast.berhasilMenyimpan'),
      color: 'primary',
    })
  } else {
    toast.add({
      title: t('fmMonitoring.evaluasi.toast.gagalJudul'),
      description: t('fmMonitoring.evaluasi.toast.gagalMenyimpan'),
      color: 'error',
    })
  }

  isSaving.value[item.id] = false
}
</script>
