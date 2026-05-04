<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useRoleStore } from '#stores/role'
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: "manajemen-user-role",
  requiresAuth: true,
})

// ================= STORES =================
const roleStore = useRoleStore()
const { locale } = useI18n()
const toast = useToast()

// ================= SCHEMA =================
const schema = z.object({
  nama: z.string().min(3, "Nama role wajib diisi"),
  deskripsi: z.string().min(5, "Deskripsi minimal 5 karakter"),
})

type Schema = z.infer<typeof schema>

// ================= STATE =================
const formState = reactive<Schema>({
  nama: '',
  deskripsi: '',
})

const formRef = ref()

// ================= COMPUTED =================
const isLoading = computed(() => roleStore.isLoading)

// ================= SUBMIT =================
const onFormSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    await roleStore.createRole(locale.value as any, {
      nama: formState.nama,
      deskripsi: formState.deskripsi,
    })

    toast.add({
      title: "Berhasil",
      description: "Role berhasil dibuat",
      color: "success",
    })

    // reset form
    if (formRef.value) {
      formRef.value.clear()
      Object.assign(formState, {
        nama: '',
        deskripsi: '',
      })
    }

  } catch (err: any) {
    toast.add({
      title: "Gagal",
      description: roleStore.error || "Terjadi kesalahan",
      color: "error",
    })
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto py-10 px-4 space-y-6">

    <!-- HEADER -->
    <UCard :ui="{
      base: 'overflow-hidden rounded-xl shadow-sm border border-gray-200',
      body: { padding: 'p-6 sm:p-8' }
    }">
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl font-bold text-gray-900">Role Baru</h1>
        <p class="text-sm text-gray-600 leading-relaxed">
          Tambahkan role baru untuk mengatur hak akses pengguna di dalam sistem.
        </p>
      </div>
    </UCard>

    <!-- FORM -->
    <UCard :ui="{
      base: 'overflow-hidden rounded-xl shadow-lg border border-gray-100',
      header: { padding: 'px-6 py-4 border-b border-gray-100 bg-gray-50/50' },
      body: { padding: 'p-6 sm:p-10' }
    }">
      <template #header>
        <h2 class="text-lg font-semibold text-gray-800">Buat Role Baru</h2>
      </template>

      <UForm ref="formRef" :state="formState" :schema="schema" class="space-y-6" @submit="onFormSubmit">

        <!-- NAMA -->
        <UFormField name="nama" label="Nama Role" class="w-full">
          <UInput v-model="formState.nama" placeholder="Contoh: Admin, Auditor, Reviewer" size="lg" class="w-full" />
        </UFormField>

        <!-- DESKRIPSI -->
        <UFormField name="deskripsi" label="Deskripsi" class="w-full">
          <UTextarea v-model="formState.deskripsi" placeholder="Jelaskan fungsi dan hak akses role ini" size="lg"
            class="w-full" />
        </UFormField>

        <!-- NOTICE -->
        <div class="flex gap-3 bg-red-50 text-red-700 border border-red-100 rounded-xl p-4 text-xs">
          <UIcon name="i-heroicons-information-circle" class="w-5 h-5 flex-shrink-0 text-red-600" />
          <p>
            <span class="font-bold">Catatan:</span> Role akan menentukan hak akses user dalam sistem.
          </p>
        </div>

        <!-- BUTTON -->
        <div class="flex justify-center pt-4">
          <UButton type="submit" size="lg"
            class="cursor-pointer px-16 rounded-lg bg-[#b91c1c] hover:bg-red-800 transition-all shadow-md font-bold text-white border-none"
            :loading="isLoading">
            Buat Role
          </UButton>
        </div>

      </UForm>
    </UCard>

  </div>
</template>
