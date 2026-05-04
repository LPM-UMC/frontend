<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useLingkupStore } from "#stores/lingkup"
import { useRoleStore } from "#stores/role"
import { useI18n } from "vue-i18n"

// ================= INIT =================
const { locale } = useI18n()
const lingkupStore = useLingkupStore()
const roleStore = useRoleStore()
const currentLang = computed(() => locale.value as any)
const router = useRouter()

// ================= FORM =================
const form = ref({
  name: "",
  description: "",
  rolePenanggungJawab: "",
  roleEvaluator: "",
})

// ================= ERROR =================
const formErrors = ref<any>({})

// ================= COUNT =================
const nameCount = computed(() => form.value.name.length)
const descriptionCount = computed(() => form.value.description.length)

// ================= ROLE OPTIONS =================
// ================= ROLE OPTIONS =================
const roleOptions = computed(() =>
  roleStore.roles.map((r) => ({
    label: r.nama,
    value: r.id,
  }))
)

const rolePenanggungJawabOptions = roleOptions
const roleEvaluatorOptions = roleOptions

// ================= FETCH ROLE =================
onMounted(async () => {
  await roleStore.fetchRoles(currentLang.value, { size: 100 })
})

// ================= VALIDATION =================
const validateForm = () => {
  const errors: any = {}

  if (!form.value.name) errors.name = "Nama wajib diisi"
  if (!form.value.description) errors.description = "Deskripsi wajib diisi"
  if (!form.value.rolePenanggungJawab) errors.rolePenanggungJawab = "Wajib pilih role"
  if (!form.value.roleEvaluator) errors.roleEvaluator = "Wajib pilih role"

  formErrors.value = errors

  return Object.keys(errors).length === 0
}

// ================= SUBMIT =================
const submitForm = async () => {
  if (!validateForm()) return

  try {
    await lingkupStore.createLingkup(currentLang.value, {
      nama: form.value.name,
      deskripsi: form.value.description,
      role_auditee_id: form.value.rolePenanggungJawab,
      role_evaluator_id: form.value.roleEvaluator,
    })

    // reset form
    form.value = {
      name: "",
      description: "",
      rolePenanggungJawab: "",
      roleEvaluator: "",
    }

    alert("Berhasil membuat lingkup")

  } catch (err: any) {
    console.error(err)

    // handle backend validation
    if (err?.data?.errors) {
      formErrors.value = err.data.errors
    }
  }
}
</script>

<template>
  <section
    class="mt-6 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
    <h2 class="text-[clamp(1.45rem,1.9vw,1.9rem)] font-semibold leading-tight text-[#11141b]">
      Buat Lingkup Evaluasi Baru
    </h2>

    <div class="mt-6 flex justify-center">
      <form
        class="w-full max-w-235 rounded-[16px] border-2 border-dashed border-[#d3d8e1] bg-[#f8f8f8] px-5 py-6 shadow-[0_4px_12px_rgba(15,23,42,0.12)]"
        @submit.prevent="submitForm">
        <h3 class="text-center text-[clamp(1.25rem,1.6vw,1.6rem)] font-semibold text-[#161a22]">
          Form Lingkup Evaluasi
        </h3>

        <div class="mt-7 space-y-4">
          <div>
            <div class="flex items-center justify-between">
              <label class="text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-[#3d485d]">
                Nama<span class="text-[#e70000]">*</span>
              </label>
              <span class="text-[0.875rem] text-[#95a0b1]">{{ nameCount }}/100</span>
            </div>
            <input v-model="form.name" maxlength="100" type="text" placeholder="Masukkan nama di sini"
              class="mt-2 h-12 w-full rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 text-[1rem] text-[#2b3340] outline-none placeholder:text-[#a0a8b6]">
            <div class="mt-1.5 flex items-center justify-between text-[0.95rem] text-[#95a0b1]">
              <span>Maks. 100 karakter. Gunakan format konsisten.</span>
              <span v-if="formErrors.name" class="text-[#d70000]">{{ formErrors.name }}</span>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label class="text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-[#3d485d]">
                Deskripsi<span class="text-[#e70000]">*</span>
              </label>
              <span class="text-[0.875rem] text-[#95a0b1]">{{ descriptionCount }}/100</span>
            </div>
            <textarea v-model="form.description" maxlength="100" rows="4" placeholder="Masukkan deskripsi di sini"
              class="mt-2 w-full rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 py-3 text-[1rem] text-[#2b3340] outline-none placeholder:text-[#a0a8b6]" />
            <div class="mt-1.5 flex items-center justify-between text-[0.95rem] text-[#95a0b1]">
              <span>Maks. 100 karakter. Gunakan format konsisten.</span>
              <span v-if="formErrors.description" class="text-[#d70000]">{{ formErrors.description }}</span>
            </div>
          </div>

          <div>
            <label class="text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-[#3d485d]">
              Pilih Role Penanggung Jawab<span class="text-[#e70000]">*</span>
            </label>
            <label class="relative mt-2 block">
              <select v-model="form.rolePenanggungJawab"
                class="h-12 w-full appearance-none rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 pr-12 text-[1rem] text-[#2b3340] outline-none">
                <option value="">Pilih</option>
                <option v-for="option in rolePenanggungJawabOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg"
                class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </label>
            <p v-if="formErrors.rolePenanggungJawab" class="mt-1 text-[0.95rem] text-[#d70000]">
              {{ formErrors.rolePenanggungJawab }}
            </p>
          </div>

          <div>
            <label class="text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-[#3d485d]">
              Pilih Role Evaluator<span class="text-[#e70000]">*</span>
            </label>
            <label class="relative mt-2 block">
              <select v-model="form.roleEvaluator"
                class="h-12 w-full appearance-none rounded-[16px] border border-[#ccd3de] bg-[#f4f4f4] px-5 pr-12 text-[1rem] text-[#2b3340] outline-none">
                <option value="">Pilih</option>
                <option v-for="option in roleEvaluatorOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg"
                class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
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

        <div class="mt-7 flex justify-center">
          <button
            class="inline-flex h-12 min-w-[160px] items-center justify-center rounded-[20px] bg-[#e30000] px-8 text-[1.25rem] font-semibold text-white shadow-[0_10px_20px_rgba(227,0,0,0.22)] transition hover:bg-[#c90000]"
            :disabled="lingkupStore.isLoading">
            {{ lingkupStore.isLoading ? 'Menyimpan...' : 'Buat' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
