<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from '#imports'
import { useI18n } from 'vue-i18n'
import { useLingkup } from '#features/manajemen-lingkup/composables/useLingkup'
import { useRole } from '#features/manajemen-role/composables/useRole'

const route = useRoute()
const { t, locale } = useI18n()

const { saveLingkup } = useLingkup()
const { rows: roleRows, fetchRoles } = useRole()

const isRTL = computed(() => locale.value.startsWith('ar'))

const isSubmitting = ref(false)
const submitError = ref('')

const form = reactive({
  name: '',
  description: '',
  rolePenanggungJawab: '',
  roleEvaluator: '',
})

const formErrors = reactive({
  name: '',
  description: '',
  rolePenanggungJawab: '',
  roleEvaluator: '',
})

const roleOptions = computed(() => roleRows.value.map(r => r.name))

const nameCount = computed(() => form.name.length)
const descriptionCount = computed(() => form.description.length)

function validateForm() {
  Object.keys(formErrors).forEach(k => {
    formErrors[k as keyof typeof formErrors] = ''
  })
  
  if (!form.name.trim()) {
    formErrors.name = 'Nama lingkup wajib diisi.'
  } else if (form.name.length > 100) {
    formErrors.name = 'Nama lingkup maksimal 100 karakter.'
  }

  if (!form.description.trim()) {
    formErrors.description = 'Deskripsi lingkup wajib diisi.'
  } else if (form.description.length > 100) {
    formErrors.description = 'Deskripsi lingkup maksimal 100 karakter.'
  }

  if (!form.rolePenanggungJawab.trim()) {
    formErrors.rolePenanggungJawab = 'Role penanggung jawab wajib dipilih.'
  }

  if (!form.roleEvaluator.trim()) {
    formErrors.roleEvaluator = 'Role evaluator wajib dipilih.'
  }

  return !formErrors.name && !formErrors.description && !formErrors.rolePenanggungJawab && !formErrors.roleEvaluator
}

const isFormValid = computed(() => {
  return form.name.trim().length > 0 && 
         form.description.trim().length > 0 &&
         form.rolePenanggungJawab.trim().length > 0 &&
         form.roleEvaluator.trim().length > 0
})

async function handleSubmit() {
  if (!validateForm()) return
  isSubmitting.value = true
  submitError.value = ''
  try {
    // API expects nama and deskripsi instead of name and description
    await saveLingkup({
      nama: form.name,
      deskripsi: form.description,
      // For real API, role bindings should be mapped here as the API expects
    })
    window.location.href = '/dashboard/manajemen-lingkup'
  } catch (error: any) {
    submitError.value = error.message || 'Gagal menyimpan lingkup'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchRoles({ size: 100 })
})
</script>

<template>
  <div>
    <div class="h-[56px] w-full sm:h-[64px] md:h-[70px]">
      <div class="h-full w-full bg-repeat-x bg-top" style="background-image: url('/img/batik.png'); background-size: auto clamp(72px, 8vw, 90px);" />
    </div>

    <section class="mx-auto w-full max-w-[1880px] bg-[#f4f4f4] px-3 pb-8 pt-5 sm:px-5 sm:pt-7 md:px-6 md:pt-8 lg:px-8 xl:px-10 2xl:px-12">
      <div class="mb-4 flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
        <NuxtLink to="/dashboard/manajemen-lingkup" class="inline-flex items-center gap-1.5 transition hover:text-[#e1121b]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6" />
          </svg>
          <span>Lingkup Evaluasi</span>
        </NuxtLink>
        <span>/</span>
        <span class="font-semibold text-[#e1121b]">Buat Lingkup</span>
      </div>

      <section class="mt-5 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <h2 class="text-[clamp(1.45rem,1.9vw,1.9rem)] font-semibold leading-tight text-[#11141b]">
          Buat Lingkup Evaluasi Baru
        </h2>
        <p class="mt-3 max-w-[1200px] text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-[#556173]">
          Gunakan fitur ini untuk membuat lingkup evaluasi baru sebagai batasan (scope) objek yang akan dinilai, seperti Program Studi, Fakultas, atau Unit. Lingkup yang dibuat akan digunakan pada modul saat menentukan objek evaluasi dan membantu proses monitoring serta penilaian berjalan lebih terstruktur dan konsisten.
        </p>
      </section>

      <section class="mt-6 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <div class="flex justify-center">
          <form
            class="w-full max-w-[940px] rounded-[16px] border-2 border-dashed border-[#d3d8e1] bg-[#f8f8f8] px-5 py-6 shadow-[0_4px_12px_rgba(15,23,42,0.12)]"
            @submit.prevent="handleSubmit"
          >
            <h3 class="text-center text-[clamp(1.25rem,1.6vw,1.6rem)] font-semibold text-[#161a22]">
              Form Lingkup Evaluasi
            </h3>

            <div v-if="submitError" class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{{ submitError }}</div>

            <div class="mt-7 space-y-4">
              <div>
                <div class="flex items-center justify-between">
                  <label class="text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-[#3d485d]">
                    Nama<span class="text-[#e1121b]">*</span>
                  </label>
                  <span class="text-[0.875rem] text-[#95a0b1]">{{ nameCount }}/100</span>
                </div>
                <input
                  v-model="form.name"
                  maxlength="100"
                  type="text"
                  placeholder="Masukkan nama di sini"
                  class="mt-2 h-12 w-full rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 text-[1rem] text-[#2b3340] outline-none placeholder:text-[#a0a8b6]"
                >
                <div class="mt-1.5 flex items-center justify-between text-[0.95rem] text-[#95a0b1]">
                  <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                  <span v-if="formErrors.name" class="text-[#d70000]">{{ formErrors.name }}</span>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between">
                  <label class="text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-[#3d485d]">
                    Deskripsi<span class="text-[#e1121b]">*</span>
                  </label>
                  <span class="text-[0.875rem] text-[#95a0b1]">{{ descriptionCount }}/100</span>
                </div>
                <textarea
                  v-model="form.description"
                  maxlength="100"
                  rows="4"
                  placeholder="Masukkan deskripsi di sini"
                  class="mt-2 w-full rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 py-3 text-[1rem] text-[#2b3340] outline-none placeholder:text-[#a0a8b6]"
                />
                <div class="mt-1.5 flex items-center justify-between text-[0.95rem] text-[#95a0b1]">
                  <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                  <span v-if="formErrors.description" class="text-[#d70000]">{{ formErrors.description }}</span>
                </div>
              </div>

              <div>
                <label class="text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-[#3d485d]">
                  Pilih Role Penanggung Jawab<span class="text-[#e1121b]">*</span>
                </label>
                <label class="relative mt-2 block">
                  <select
                    v-model="form.rolePenanggungJawab"
                    class="h-12 w-full appearance-none rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 pr-12 text-[1rem] text-[#2b3340] outline-none"
                  >
                    <option value="">Pilih</option>
                    <option
                      v-for="option in roleOptions"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                  </svg>
                </label>
                <p v-if="formErrors.rolePenanggungJawab" class="mt-1 text-[0.95rem] text-[#d70000]">
                  {{ formErrors.rolePenanggungJawab }}
                </p>
              </div>

              <div>
                <label class="text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-[#3d485d]">
                  Pilih Role Evaluator<span class="text-[#e1121b]">*</span>
                </label>
                <label class="relative mt-2 block">
                  <select
                    v-model="form.roleEvaluator"
                    class="h-12 w-full appearance-none rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 pr-12 text-[1rem] text-[#2b3340] outline-none"
                  >
                    <option value="">Pilih</option>
                    <option
                      v-for="option in roleOptions"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                  </svg>
                </label>
                <p v-if="formErrors.roleEvaluator" class="mt-1 text-[0.95rem] text-[#d70000]">
                  {{ formErrors.roleEvaluator }}
                </p>
              </div>
            </div>

            <p class="mt-5 text-center text-[1rem] text-[#6f788a]">
              Butuh lingkup yang terintegrasi GS?
              <NuxtLink to="/dashboard/lingkup/create" class="text-[#1e63e8] underline">Hubungi Developer</NuxtLink>
            </p>

            <div class="mt-8 flex justify-end gap-3">
              <NuxtLink
                to="/dashboard/manajemen-lingkup"
                class="rounded-full border border-[#d3d8e1] px-6 py-2.5 font-semibold text-[#3d485d] transition hover:bg-[#eceff3]"
              >
                Batal
              </NuxtLink>
              <button
                type="submit"
                :disabled="!isFormValid || isSubmitting"
                class="rounded-[18px] px-8 py-2.5 font-semibold text-white shadow-[0_8px_16px_rgba(227,0,0,0.22)] transition disabled:cursor-not-allowed disabled:opacity-60"
                :class="isFormValid && !isSubmitting ? 'bg-[#e30000] hover:bg-[#c90000]' : 'bg-[#e30000] opacity-50'"
              >
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </section>
    </section>
  </div>
</template>
