<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showError } from '#app'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { useUserStore } from '#stores/user'
import { useRoleStore } from '#stores/role'
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: "manajemen-user-role",
  requiresAuth: true,
})

// ================= INIT =================
const route = useRoute()
const userId = route.params.user_id as string

const userStore = useUserStore()
const roleStore = useRoleStore()
const { locale } = useI18n()
const toast = useToast()

// ================= SCHEMA =================
const schema = z.object({
  nama: z.string().min(3, "Nama lengkap wajib diisi"),
  nidn: z.string().min(5, "NIDN wajib diisi"),
  email: z
    .string()
    .email("Format email tidak valid")
    .refine(
      (val) => val.endsWith("@gmail.com") || val.endsWith("@umc.ac.id"),
      "Email harus menggunakan @gmail.com atau @umc.ac.id"
    ),
  role_ids: z.array(z.string()).min(1, "Harap pilih minimal satu role"),
})

type Schema = z.infer<typeof schema>

// ================= STATE =================
const formState = reactive<Schema>({
  nama: '',
  nidn: '',
  email: '',
  role_ids: [],
})

const formRef = ref()

// ================= COMPUTED =================
const roles = computed(() => roleStore.roles)
const isLoading = computed(() => userStore.isLoading)

// ================= LOAD DATA =================
onMounted(async () => {
  try {
    await Promise.all([
      roleStore.fetchRoles(locale.value as any),
      userStore.fetchUserById(locale.value as any, userId),
    ])

    const user = userStore.user

    // kalau user null → 404
    if (!user) {
      throw createError({ statusCode: 404, statusMessage: "User tidak ditemukan" })
    }

    // prefill form
    formState.nama = user.nama
    formState.nidn = user.nidn
    formState.email = user.email
    formState.role_ids = user.roles?.map((r: any) => r.id) || []

  } catch (err: any) {
    // kalau 404 / unauthorized → halaman not found
    showError({
      statusCode: 404,
      statusMessage: "User tidak ditemukan",
    })
  }
})

// ================= SUBMIT UPDATE =================
const onFormSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    await userStore.updateUser(locale.value as any, userId, {
      email: formState.email,
      role_ids: formState.role_ids,
    })

    toast.add({
      title: "Berhasil",
      description: "User berhasil diperbarui",
      color: "success",
    })

  } catch (err: any) {
    toast.add({
      title: "Gagal",
      description: userStore.error || "Terjadi kesalahan",
      color: "error",
    })
  }
}

const handleDisableUser = async () => {
  if (!confirm("Yakin ingin menonaktifkan user ini?")) return

  try {
    await userStore.deleteUser(locale.value as any, userId)

    toast.add({
      title: "Berhasil",
      description: "User berhasil dinonaktifkan",
      color: "success",
    })

  } catch (err) {
    toast.add({
      title: "Gagal",
      description: userStore.error || "Terjadi kesalahan",
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
        <h1 class="text-2xl font-bold text-gray-900">Edit User</h1>
        <p class="text-sm text-gray-600 leading-relaxed">
          Perbarui data user dan sesuaikan role akses sesuai kebutuhan.
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
        <h2 class="text-lg font-semibold text-gray-800">Update User</h2>
      </template>

      <UForm ref="formRef" :state="formState" :schema="schema" class="space-y-6" @submit="onFormSubmit">

        <!-- NAMA (DISABLED) -->
        <UFormField name="nama" label="Nama Lengkap" class="w-full">
          <UInput v-model="formState.nama" disabled size="lg" class="w-full" />
        </UFormField>

        <!-- NIDN (DISABLED) -->
        <UFormField name="nidn" label="NIDN" class="w-full">
          <UInput v-model="formState.nidn" disabled size="lg" class="w-full" />
        </UFormField>

        <!-- EMAIL -->
        <UFormField name="email" label="Email" class="w-full">
          <UInput v-model="formState.email" type="email" placeholder="contoh@gmail.com / @umc.ac.id" size="lg"
            class="w-full" />
        </UFormField>

        <!-- ROLE -->
        <UFormField name="role_ids" label="Role Akses" class="w-full">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label v-for="role in roles" :key="role.id"
              class="relative flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition">
              <input v-model="formState.role_ids" type="checkbox" :value="role.id" class="w-4 h-4">

              <UTooltip :text="role.deskripsi || 'Tidak ada deskripsi'" :popper="{ placement: 'top' }">
                <span class="text-sm text-gray-700 decoration-dotted">
                  {{ role.nama }}
                </span>
              </UTooltip>

            </label>
          </div>
        </UFormField>

        <!-- NOTICE -->
        <div class="flex gap-3 bg-red-50 text-red-700 border border-red-100 rounded-xl p-4 text-xs">
          <UIcon name="i-heroicons-information-circle" class="w-5 h-5 flex-shrink-0 text-red-600" />
          <p>
            <span class="font-bold">Catatan:</span> Perubahan role akan mempengaruhi hak akses user di dalam sistem.
          </p>
        </div>

        <!-- BUTTON -->
        <div class="flex justify-center pt-4">
          <UButton type="submit" size="lg"
            class="cursor-pointer px-16 rounded-lg bg-[#b91c1c] hover:bg-red-800 text-white font-bold"
            :loading="isLoading">
            Update User
          </UButton>
        </div>

      </UForm>
    </UCard>

    <UCard :ui="{
      base: 'overflow-hidden rounded-xl border border-red-200 shadow-sm',
      body: { padding: 'p-6 sm:p-8' }
    }">
      <div class="flex flex-col gap-4">

        <!-- TITLE -->
        <div>
          <h2 class="text-lg font-semibold text-red-700">Nonaktifkan User</h2>
          <p class="text-sm text-gray-600 mt-1">
            User yang dinonaktifkan tidak dapat mengakses sistem. Tindakan ini dapat dikembalikan oleh admin.
          </p>
        </div>

        <!-- BUTTON -->
        <div class="flex justify-end">
          <UButton class="cursor-pointer px-6 rounded-lg bg-[#b91c1c] hover:bg-red-800 text-white font-bold"
            @click="handleDisableUser">
            Nonaktifkan User
          </UButton>
        </div>

      </div>
    </UCard>

  </div>
</template>
