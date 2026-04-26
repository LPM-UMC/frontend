<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { navigateTo, useRoute } from '#imports'
import { useUser } from '../composables/useUser'
import { useUserApi } from '../services/user.api'
import UserForm from './UserForm.vue'
import UserTable from './UserTable.vue'
import type { UserFormInput, UserRecord } from '../types/user'

type UserPageMode = 'list' | 'create' | 'detail' | 'edit'

const props = defineProps<{
  mode: UserPageMode
}>()

const route = useRoute()
const userApi = useUserApi()
const {
  rows,
  loading,
  error,
  fetchUsers,
  saveUser,
  deleteUser,
} = useUser()

const detailUser = ref<UserRecord | null>(null)
const detailLoading = ref(false)
const formModel = ref<Partial<UserFormInput>>({})
const submitError = ref<string | null>(null)

function normalizeRouteParam(value: string | string[] | undefined): string | null {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

const userId = computed(() =>
  normalizeRouteParam(route.params.user_id as string | string[] | undefined)
)

const pageTitle = computed(() => {
  if (props.mode === 'list') return 'Manajemen User'
  if (props.mode === 'create') return 'Tambah User'
  if (props.mode === 'detail') return 'Detail User'
  return 'Edit User'
})

async function loadDetail() {
  if (!userId.value) return

  detailLoading.value = true
  submitError.value = null

  const result = await userApi.getUser(userId.value)
  detailUser.value = result

  if (!result) {
    submitError.value = 'Data user tidak ditemukan.'
  }

  detailLoading.value = false
}

async function loadEditForm() {
  await loadDetail()
  if (!detailUser.value) return

  formModel.value = {
    name: detailUser.value.name,
    email: detailUser.value.email,
    role: detailUser.value.role,
    status: detailUser.value.status,
    password: '',
  }
}

async function handleSubmit(payload: UserFormInput) {
  submitError.value = null

  const result = await saveUser(payload, props.mode === 'edit' ? userId.value ?? undefined : undefined)

  if (!result) {
    submitError.value = 'Gagal menyimpan data user.'
    return
  }

  if (props.mode === 'create') {
    await navigateTo('/dashboard/manajemen-user')
    return
  }

  await navigateTo(`/dashboard/manajemen-user/${userId.value}`)
}

async function handleRemove(id: string) {
  if (import.meta.client) {
    const confirmed = window.confirm('Hapus user ini?')
    if (!confirmed) return
  }

  await deleteUser(id)
  await fetchUsers()
}

function openCreatePage() {
  navigateTo('/dashboard/manajemen-user/create')
}

function openDetailPage(id: string) {
  navigateTo(`/dashboard/manajemen-user/${id}`)
}

function openEditPage(id: string) {
  navigateTo(`/dashboard/manajemen-user/${id}/edit`)
}

onMounted(async () => {
  if (props.mode === 'list') {
    await fetchUsers()
    return
  }

  if (props.mode === 'detail') {
    await loadDetail()
    return
  }

  if (props.mode === 'edit') {
    await loadEditForm()
  }
})
</script>

<template>
  <section class="mx-auto w-full max-w-5xl space-y-5 px-4 py-5 sm:px-6">
    <header class="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <h1 class="text-xl font-semibold text-slate-800">
        {{ pageTitle }}
      </h1>
      <p class="mt-1 text-sm text-slate-500">
        Kelola data user dashboard sesuai kebutuhan operasional.
      </p>
    </header>

    <article
      v-if="props.mode === 'list'"
      class="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div class="flex items-center justify-between gap-3">
        <p class="text-sm text-slate-600">
          Total data: <strong>{{ rows.length }}</strong>
        </p>
        <button
          type="button"
          class="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white"
          @click="openCreatePage"
        >
          Tambah User
        </button>
      </div>

      <p v-if="error" class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
        {{ error }}
      </p>

      <p v-if="loading" class="text-sm text-slate-500">
        Memuat data user...
      </p>

      <UserTable
        v-else
        :rows="rows"
        @detail="openDetailPage"
        @edit="openEditPage"
        @remove="handleRemove"
      />
    </article>

    <article
      v-if="props.mode === 'create' || props.mode === 'edit'"
      class="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <p v-if="submitError" class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
        {{ submitError }}
      </p>

      <UserForm
        :model-value="formModel"
        @submit="handleSubmit"
      />
    </article>

    <article
      v-if="props.mode === 'detail'"
      class="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <p v-if="detailLoading" class="text-sm text-slate-500">
        Memuat detail user...
      </p>

      <p v-else-if="submitError" class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
        {{ submitError }}
      </p>

      <div v-else-if="detailUser" class="space-y-2 text-sm text-slate-700">
        <p><strong>Nama:</strong> {{ detailUser.name }}</p>
        <p><strong>Email:</strong> {{ detailUser.email }}</p>
        <p><strong>Role:</strong> {{ detailUser.role }}</p>
        <p><strong>Status:</strong> {{ detailUser.status }}</p>

        <div class="pt-2">
          <button
            type="button"
            class="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white"
            @click="openEditPage(detailUser.id)"
          >
            Edit User
          </button>
        </div>
      </div>
    </article>
  </section>
</template>
