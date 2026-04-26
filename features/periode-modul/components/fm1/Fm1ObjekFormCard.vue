<script setup lang="ts">
import { reactive } from 'vue'

interface Fm1ObjekFormValues {
  name: string
  address: string
  personInCharge: string
}

const MAX_LENGTH = 100

const props = withDefaults(
  defineProps<{
    sectionTitle: string
    formTitle: string
    submitLabel: string
    note?: string
    lastSavedAt?: string
    initialValues?: Partial<Fm1ObjekFormValues>
  }>(),
  {
    note: 'Lorem Ipsum',
    lastSavedAt: '15 Feb 2026, 14:30',
    initialValues: () => ({}),
  }
)

const emit = defineEmits<{
  (event: 'submit', payload: Fm1ObjekFormValues): void
}>()

const form = reactive<Fm1ObjekFormValues>({
  name: (props.initialValues.name ?? '').slice(0, MAX_LENGTH),
  address: (props.initialValues.address ?? '').slice(0, MAX_LENGTH),
  personInCharge: (props.initialValues.personInCharge ?? '').slice(0, MAX_LENGTH),
})

function updateField(field: keyof Fm1ObjekFormValues, value: string) {
  form[field] = value.slice(0, MAX_LENGTH)
}

function submitForm() {
  emit('submit', {
    name: form.name.trim(),
    address: form.address.trim(),
    personInCharge: form.personInCharge.trim(),
  })
}
</script>

<template>
  <article class="rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8] p-4 shadow-[0_2px_6px_rgba(15,23,42,0.06)] sm:p-5 lg:p-6">
    <h2 class="text-[26px] font-semibold leading-[1.15] text-[#111827] sm:text-[32px]">
      {{ sectionTitle }}
    </h2>

    <div class="mx-auto mt-4 w-full max-w-[920px] rounded-[22px] border border-dashed border-[#ccd3de] bg-[#f7f8fa] px-4 py-5 sm:px-6 sm:py-6 lg:px-7">
      <h3 class="text-center text-[24px] font-semibold text-[#111827] sm:text-[30px]">
        {{ formTitle }}
      </h3>

      <form class="mt-6 space-y-4" @submit.prevent="submitForm">
        <div class="space-y-2">
          <label class="block text-[18px] font-semibold text-[#334155]">
            Nama<span class="text-[#e60000]">*</span>
          </label>
          <input
            :value="form.name"
            type="text"
            class="h-[56px] w-full rounded-[14px] border border-[#c8cfd9] bg-[#f3f5f7] px-4 text-[16px] text-[#344155] outline-none placeholder:text-[#9aa4b4] sm:text-[18px]"
            placeholder="Masukkan nama di sini"
            @input="updateField('name', ($event.target as HTMLInputElement).value)"
          >
          <div class="flex items-center justify-between text-[14px] text-[#8b96a8]">
            <p>Maks. 100 karakter. Gunakan format konsisten.</p>
            <p class="font-semibold">{{ form.name.length }}/100</p>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-[18px] font-semibold text-[#334155]">
            Alamat<span class="text-[#e60000]">*</span>
          </label>
          <textarea
            :value="form.address"
            rows="4"
            class="w-full rounded-[14px] border border-[#c8cfd9] bg-[#f3f5f7] px-4 py-3 text-[16px] text-[#344155] outline-none placeholder:text-[#9aa4b4] sm:text-[18px]"
            placeholder="Masukkan deskripsi di sini"
            @input="updateField('address', ($event.target as HTMLTextAreaElement).value)"
          />
          <div class="flex items-center justify-between text-[14px] text-[#8b96a8]">
            <p>Maks. 100 karakter. Gunakan format konsisten.</p>
            <p class="font-semibold">{{ form.address.length }}/100</p>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-[18px] font-semibold text-[#334155]">
            Nama Penanggung Jawab<span class="text-[#e60000]">*</span>
          </label>
          <input
            :value="form.personInCharge"
            type="text"
            class="h-[56px] w-full rounded-[14px] border border-[#c8cfd9] bg-[#f3f5f7] px-4 text-[16px] text-[#344155] outline-none placeholder:text-[#9aa4b4] sm:text-[18px]"
            placeholder="Masukkan nama di sini"
            @input="updateField('personInCharge', ($event.target as HTMLInputElement).value)"
          >
          <div class="flex items-center justify-between text-[14px] text-[#8b96a8]">
            <p>Maks. 100 karakter. Gunakan format konsisten.</p>
            <p class="font-semibold">{{ form.personInCharge.length }}/100</p>
          </div>
        </div>

        <div class="rounded-[10px] border border-[#f4bbbb] bg-[#fff1f1] px-4 py-3 text-[14px] text-[#c51616] sm:text-[16px]">
          <p>
            <strong>Catatan :</strong>
            {{ note }}
          </p>
        </div>

        <p class="flex items-center gap-2 text-[14px] text-[#8b96a8] sm:text-[15px]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2m5-2A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" />
          </svg>
          Terakhir disimpan: {{ lastSavedAt }}
        </p>

        <div class="pt-2 text-center">
          <button
            type="submit"
            class="inline-flex h-[56px] min-w-[180px] items-center justify-center rounded-[16px] bg-[#e60000] px-7 text-[18px] font-semibold leading-none text-white transition hover:brightness-95 sm:text-[20px]"
          >
            {{ submitLabel }}
          </button>
        </div>
      </form>
    </div>
  </article>
</template>
