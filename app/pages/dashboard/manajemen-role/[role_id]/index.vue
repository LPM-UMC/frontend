<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showError } from '#app'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useRoleStore } from '#stores/role'
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: "manajemen-user-role",
  requiresAuth: true,
})

// ================= INIT =================
const route = useRoute()
const roleId = route.params.role_id as string

const roleStore = useRoleStore()
const { locale } = useI18n()
const toast = useToast()

// ================= SCHEMA =================
const schema = z.object({
  nama: z.string(),
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

// ================= LOAD DATA =================
onMounted(async () => {
  try {
    await roleStore.fetchRoles(locale.value as any)

    const role = roleStore.roles.find(r => r.id === roleId)

    // kalau tidak ketemu → 404
    if (!role) {
      throw new Error()
    }

    // prefill
    formState.nama = role.nama
    formState.deskripsi = role.deskripsi || ''

  } catch (err) {
    showError({
      statusCode: 404,
      statusMessage: "Role tidak ditemukan",
    })
  }
})

// ================= SUBMIT =================
const onFormSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    await roleStore.updateRole(locale.value as any, roleId, {
      deskripsi: formState.deskripsi,
    })

    toast.add({
      title: "Berhasil",
      description: "Role berhasil diperbarui",
      color: "success",
    })

  } catch (err) {
    toast.add({
      title: "Gagal",
      description: roleStore.error || "Terjadi kesalahan",
      color: "error",
    })
  }
}

// ================= DELETE =================
const handleDeleteRole = async () => {
  if (!confirm("Yakin ingin menghapus role ini?")) return

  try {
    await roleStore.deleteRole(locale.value as any, roleId)

    toast.add({
      title: "Berhasil",
      description: "Role berhasil dihapus",
      color: "success",
    })

    navigateTo('/dashboard/manajemen-role')

  } catch (err) {
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
        <h1 class="text-2xl font-bold text-gray-900">Edit Role</h1>
        <p class="text-sm text-gray-600 leading-relaxed">
          Perbarui deskripsi role untuk menyesuaikan hak akses dalam sistem.
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
        <h2 class="text-lg font-semibold text-gray-800">Update Role</h2>
      </template>

      <UForm ref="formRef" :state="formState" :schema="schema" class="space-y-6" @submit="onFormSubmit">

        <!-- NAMA (READONLY) -->
        <UFormField name="nama" label="Nama Role" class="w-full">
          <UInput v-model="formState.nama" disabled size="lg" class="w-full" />
        </UFormField>

        <!-- DESKRIPSI -->
        <UFormField name="deskripsi" label="Deskripsi" class="w-full">
          <UTextarea v-model="formState.deskripsi" placeholder="Perbarui deskripsi role" size="lg" class="w-full" />
        </UFormField>

        <!-- NOTICE -->
        <div class="flex gap-3 bg-red-50 text-red-700 border border-red-100 rounded-xl p-4 text-xs">
          <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-red-600" />
          <p>
            <span class="font-bold">Catatan:</span> Perubahan deskripsi akan mempengaruhi pemahaman hak akses role.
          </p>
        </div>

        <!-- BUTTON -->
        <div class="flex justify-center pt-4">
          <UButton type="submit" size="lg"
            class="cursor-pointer px-16 rounded-lg bg-[#b91c1c] hover:bg-red-800 text-white font-bold"
            :loading="isLoading">
            Update Role
          </UButton>
        </div>

      </UForm>
    </UCard>

    <!-- DELETE -->
    <UCard :ui="{
      base: 'overflow-hidden rounded-xl border border-red-200 shadow-sm',
      body: { padding: 'p-6 sm:p-8' }
    }">
      <div class="flex flex-col gap-4">

        <div>
          <h2 class="text-lg font-semibold text-red-700">Hapus Role</h2>
          <p class="text-sm text-gray-600 mt-1">
            Role yang dihapus tidak dapat digunakan lagi dalam sistem.
          </p>
        </div>

        <div class="flex justify-end">
          <UButton class="cursor-pointer px-6 rounded-lg bg-[#b91c1c] hover:bg-red-800 text-white font-bold"
            @click="handleDeleteRole">
            Hapus Role
          </UButton>
        </div>

      </div>
    </UCard>

  </div>
</template>
