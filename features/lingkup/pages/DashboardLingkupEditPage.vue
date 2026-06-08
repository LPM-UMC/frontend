<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, navigateTo, useLocalePath } from '#imports'
import { useI18n } from 'vue-i18n'
import { useLingkup } from '#features/lingkup/composables/useLingkup'
import { useRole } from '#features/manajemen-role/composables/useRole'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const lingkupId = computed(() => {
  const id = route.params.lingkup_id
  return Array.isArray(id) ? id[0] : id
})

const { saveLingkup, rows: lingkupRows, fetchLingkup } = useLingkup()
const { rows: roleRows, fetchRoles } = useRole()

const isRTL = computed(() => locale.value.startsWith('ar'))

const breadcrumbItems = computed(() => [
  {
    label: 'Dasbor',
    to: '/dashboard',
  },
  {
    label: 'Lingkup Evaluasi',
    to: '/dashboard/manajemen-lingkup',
  },
  {
    label: form.name || 'Detail Lingkup',
    to: `/dashboard/manajemen-lingkup/${lingkupId.value}`,
  },
  {
    label: 'Edit Lingkup',
    active: true,
  },
])

const pageLoading = ref(true)
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

const roleOptions = computed(() => roleRows.value)

const nameCount = computed(() => form.name.length)
const descriptionCount = computed(() => form.description.length)

async function loadDetail() {
  if (!lingkupId.value) return
  pageLoading.value = true
  try {
    // Current API returns list, so we fetch and filter for now
    await fetchLingkup()
    const detail = lingkupRows.value.find(r => r.id === lingkupId.value)
    if (detail) {
      form.name = detail.nama
      form.description = detail.deskripsi || ''
      form.rolePenanggungJawab = detail.role_auditee?.id || ''
      form.roleEvaluator = detail.role_evaluator?.id || ''
    }
  } catch(e) {
    console.error(e)
  } finally {
    pageLoading.value = false
  }
}

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
    await saveLingkup({
      nama: form.name,
      deskripsi: form.description,
      role_auditee_id: form.rolePenanggungJawab,
      role_evaluator_id: form.roleEvaluator,
    }, lingkupId.value)
    navigateTo(`/dashboard/manajemen-lingkup/${lingkupId.value}`)
  } catch (error: any) {
    submitError.value = error.message || 'Gagal menyimpan lingkup'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchRoles({ size: 100 })
  loadDetail()
})
</script>

<template>
  <div v-if="pageLoading" class="p-8 text-center text-slate-500">Memuat data lingkup...</div>
  <div v-else>
    <section class="mx-auto w-full max-w-380 px-3 pb-6 pt-4 sm:px-6 lg:px-8">
    <!-- Breadcrumb -->
    <div class="mb-4 flex flex-wrap items-center gap-2">
      <NuxtLink :to="localePath(`/dashboard/manajemen-lingkup/${lingkupId}`)">
        <button
          class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d6dae2] bg-[#efeff1] text-[#596273] shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:bg-white cursor-pointer sm:h-9 sm:w-9">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19 8 12l7-7" />
          </svg>
        </button>
      </NuxtLink>

      <nav class="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
        <template v-for="(item, index) in breadcrumbItems" :key="`${item.label}-${index}`">
          <NuxtLink v-if="item.to" :to="item.to" class="text-[#9aa2b1] transition hover:text-[#6e7788] hover:underline">
            {{ item.label }}
          </NuxtLink>

          <span v-else :class="item.active
            ? 'font-semibold text-[#e30000] underline'
            : 'text-[#9aa2b1]'
            ">
            {{ item.label }}
          </span>

          <span v-if="index !== breadcrumbItems.length - 1" class="px-1 text-[#c5cad4]">
            /
          </span>
        </template>
      </nav>
    </div>

      <section class="mt-4 rounded-xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 shadow-[0_1px_4px_rgba(15,23,42,0.08)] sm:px-5 sm:py-6">
        <h1 class="text-xl font-semibold text-[#11141b] sm:text-2xl lg:text-3xl">
          Edit Lingkup Evaluasi
        </h1>
        <p class="mt-2 text-sm leading-relaxed text-[#556173] sm:text-base">
          Gunakan halaman ini untuk memperbarui informasi lingkup evaluasi seperti nama, deskripsi, dan role penanggung jawab. Perubahan ini akan memengaruhi data lingkup yang digunakan pada proses modul berikutnya.
        </p>
      </section>

      <section class="mt-5 rounded-xl border border-[#dadde3] bg-[#f4f4f5] px-3 py-4 shadow-[0_1px_4px_rgba(15,23,42,0.08)] sm:px-5 sm:py-6">
        <div class="flex justify-center">
          <form
            class="mx-auto w-full max-w-4xl rounded-2xl border border-dashed border-[#d7dbe4] bg-[#f8f8f8] px-4 py-5 sm:px-6 sm:py-7"
            @submit.prevent="handleSubmit"
          >
            <h3 class="text-center text-lg font-semibold text-[#151922] sm:text-xl md:text-2xl">
              Edit Form Lingkup Evaluasi
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
                    <option value="" disabled hidden class="text-gray-500">Pilih</option>
                    <option
                      v-for="role in roleOptions"
                      :key="role.id"
                      :value="role.id"
                      class="text-black bg-white"
                    >
                      {{ role.nama }}
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
                    <option value="" disabled hidden class="text-gray-500">Pilih</option>
                    <option
                      v-for="role in roleOptions"
                      :key="role.id"
                      :value="role.id"
                      class="text-black bg-white"
                    >
                      {{ role.nama }}
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

            <div class="mt-8 flex justify-center gap-3">
              <NuxtLink
                :to="`/dashboard/manajemen-lingkup/${lingkupId}`"
                class="inline-flex h-10 min-w-28 items-center justify-center rounded-[14px] border border-[#d7dbe4] bg-[#f3f4f6] px-5 text-[16px] font-semibold text-[#1f2634] transition hover:bg-[#e0e0e0]"
              >
                Batal
              </NuxtLink>
              <button
                type="submit"
                :disabled="!isFormValid || isSubmitting"
                class="inline-flex h-10 min-w-28 items-center justify-center rounded-[14px] px-5 text-[16px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                :class="isFormValid && !isSubmitting ? 'bg-gradient-to-b from-[#E7000B] to-[#B91C1C] hover:from-[#cc0f17] hover:to-[#a01818] shadow-[0_4px_14px_rgba(227,0,11,0.25)]' : 'bg-gray-400 opacity-50'"
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
