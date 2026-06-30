<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="isOpen" class="fixed inset-0 z-[40] bg-black/55 px-2 py-3 sm:px-4 sm:py-6 flex items-center justify-center" @click.self="closeModal">
        <div class="flex w-full max-w-[800px] flex-col overflow-visible rounded-[14px] bg-[#f6f7f8] shadow-[0_22px_50px_rgba(0,0,0,0.4)]">
          <div class="p-6">
            <h2 class="text-center text-[18px] font-bold text-[#111a2f] sm:text-[21px] mb-6">
              Data Form Berita Acara
            </h2>

            <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-[12px] border border-[#d8dbe2] bg-white p-4">
               <div>
                  <label class="text-[13px] font-medium text-[#4a515d] block mb-1">Periode Evaluasi</label>
                  <p v-if="createData" class="text-[14px] text-[#1d2430] font-medium">{{ createData.periode.tahun_ajaran }} - {{ createData.periode.semester }}</p>
                  <p v-else class="text-[14px] text-[#1d2430]">-</p>
               </div>
               <div>
                  <label class="text-[13px] font-medium text-[#4a515d] block mb-1">Unit Program Studi</label>
                  <p v-if="createData" class="text-[14px] text-[#1d2430] font-medium">{{ createData.unit.nama }}</p>
                  <p v-else class="text-[14px] text-[#1d2430]">-</p>
               </div>
            </div>

            <div class="space-y-4">
              <label class="flex flex-col gap-1.5 relative">
                <span class="text-[13px] font-medium text-[#4a515d]">
                  Tanggal Pelaksanaan Evaluasi <span class="text-[#e1121b]">*</span>
                </span>
                <ClientOnly>
                  <div class="relative">
                    <VueDatePicker 
                      v-model="form.tanggalPelaksanaan" 
                      model-type="yyyy-MM-dd"
                      format="dd / MM / yyyy"
                      :enable-time-picker="false" 
                      auto-apply
                      :teleport="true"
                      hide-input-icon
                      input-class-name="h-11 rounded-[10px] border border-[#d8dbe2] bg-[#f4f5f7] pl-10 pr-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b] w-full"
                      placeholder="Pilih Tanggal"
                    >
                      <template #input-icon>
                        <UIcon name="i-lucide-calendar" class="w-4.5 h-4.5 text-[#e1121b] ml-3 pointer-events-none" />
                      </template>
                      <template #clear-icon>
                        <span></span>
                      </template>
                    </VueDatePicker>
                  </div>
                </ClientOnly>
              </label>

              <label class="flex flex-col gap-1.5 relative">
                <span class="text-[13px] font-medium text-[#4a515d]">
                  Batas Waktu Penandatanganan Dokumen <span class="text-[#e1121b]">*</span>
                </span>
                <ClientOnly>
                  <div class="relative">
                    <VueDatePicker 
                      v-model="form.batasWaktuTandaTangan" 
                      model-type="yyyy-MM-dd"
                      format="dd / MM / yyyy"
                      :enable-time-picker="false" 
                      auto-apply
                      :teleport="true"
                      hide-input-icon
                      input-class-name="h-11 rounded-[10px] border border-[#d8dbe2] bg-[#f4f5f7] pl-10 pr-3 text-[13px] text-[#2f3744] outline-none transition focus:border-[#e1121b] w-full"
                      placeholder="Pilih Tanggal"
                    >
                      <template #input-icon>
                        <UIcon name="i-lucide-calendar" class="w-4.5 h-4.5 text-[#e1121b] ml-3 pointer-events-none" />
                      </template>
                      <template #clear-icon>
                        <span></span>
                      </template>
                    </VueDatePicker>
                  </div>
                </ClientOnly>
              </label>

              <label class="flex flex-col gap-1.5 mt-2">
                <span class="text-[13px] font-medium text-[#4a515d]">
                  Lampiran Dokumen PDF (Opsional)
                </span>
                <input 
                  type="file" 
                  multiple 
                  accept="application/pdf" 
                  class="block w-full text-sm text-[#4a515d] file:mr-4 file:py-2 file:px-4 file:rounded-[10px] file:border-0 file:text-sm file:font-semibold file:bg-[#e1121b]/10 file:text-[#e1121b] hover:file:bg-[#e1121b]/20"
                  @change="handleFileChange"
                />
                <div v-if="selectedFiles.length > 0" class="mt-2 space-y-1">
                  <div v-for="(file, index) in selectedFiles" :key="index" class="text-xs text-[#2f3744] flex items-center gap-2 bg-[#f4f5f7] p-2 rounded-lg">
                     <UIcon name="i-heroicons-document" class="w-4 h-4 text-[#e1121b]" />
                     <span class="truncate flex-1">{{ file.name }}</span>
                     <button type="button" @click.prevent="removeFile(index)" class="text-[#4a515d] hover:text-[#e1121b]">
                        <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                     </button>
                  </div>
                </div>
              </label>
            </div>

            <div class="mt-8 flex items-center justify-center gap-4">
              <button 
                type="button" 
                class="rounded-[24px] border border-[#d8dbe2] bg-white px-8 py-2 text-[14px] font-medium text-[#6b7689] transition-all duration-200 hover:bg-[#e2e5ea] hover:text-[#2f3744] hover:shadow-sm active:scale-95 min-w-[120px]"
                @click="closeModal"
              >
                Batal
              </button>
              <button 
                type="button" 
                class="rounded-[24px] bg-[#e1121b] px-8 py-2 text-[14px] font-medium text-white transition hover:bg-[#c80f17] disabled:opacity-50 min-w-[160px] flex justify-center items-center gap-2"
                :disabled="!isValid || submitting"
                @click="submit"
              >
                <svg v-if="submitting" class="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Buat Berita Acara
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useFm5Repository } from '#features/periode-modul/composables/useFm5Repository'
import type { Fm5CreateDataResponse } from '#features/periode-modul/services/fm5.api'

const props = defineProps<{
  periodeModulId: string
  unitId: string
}>()

const emit = defineEmits<{
  (e: 'created', id: string): void
}>()

const repository = useFm5Repository()

const isOpen = defineModel<boolean>('isOpen', { default: false })
const createData = ref<Fm5CreateDataResponse | null>(null)

const form = reactive({
  tanggalPelaksanaan: '',
  batasWaktuTandaTangan: ''
})

const submitting = ref(false)

const isValid = computed(() => {
  return form.tanggalPelaksanaan && form.batasWaktuTandaTangan
})

const selectedFiles = ref<File[]>([])

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files).filter(f => f.type === 'application/pdf')
    selectedFiles.value = [...selectedFiles.value, ...newFiles]
    target.value = '' // reset input
  }
}

function removeFile(index: number) {
  selectedFiles.value.splice(index, 1)
}

watch(isOpen, async (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
    form.tanggalPelaksanaan = ''
    form.batasWaktuTandaTangan = ''
    selectedFiles.value = []
    try {
      createData.value = (await repository.getCreatePageData({ periodeModulId: props.periodeModulId, unitId: props.unitId })) || null
    } catch (e) {
      console.error(e)
    }
  } else {
    document.body.style.overflow = ''
  }
})

function closeModal() {
  isOpen.value = false
}

async function submit() {
  if (!isValid.value) return
  submitting.value = true
  try {
    const result = await repository.createBeritaAcara({ periodeModulId: props.periodeModulId, unitId: props.unitId }, {
      tanggalPelaksanaan: new Date(form.tanggalPelaksanaan).toISOString(),
      batasWaktuTandaTangan: new Date(form.batasWaktuTandaTangan).toISOString(),
    })
    
    if (result?.id) {
      // Upload lampiran if any
      if (selectedFiles.value.length > 0) {
        for (const file of selectedFiles.value) {
          try {
            await repository.uploadLampiran(result.id, file)
          } catch (uploadError) {
            console.error('Failed to upload a file:', uploadError)
          }
        }
      }
      
      emit('created', result.id)
      closeModal()
    }
  } catch (error) {
    console.error(error)
    alert('Gagal membuat berita acara.')
  } finally {
    submitting.value = false
  }
}
</script>
