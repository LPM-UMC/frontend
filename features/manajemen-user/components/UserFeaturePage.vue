<template>
  <section class="mx-auto w-full max-w-380 px-4 pb-8 pt-6 sm:px-6 lg:px-8">
    <div class="flex items-center gap-3">
      <button
type="button"
        class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d6dae2] bg-[#efeff1] text-[#596273] shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:bg-white"
        aria-label="Kembali" @click="navigateBack">
        <svg
xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19 8 12l7-7" />
        </svg>
      </button>

      <nav class="flex flex-wrap items-center gap-1">
        <template v-for="(item, index) in breadcrumbItems" :key="`${item.label}-${index}`">
          <NuxtLink
v-if="item.to" :to="item.to"
            class="text-[clamp(0.95rem,1.2vw,1.05rem)] text-[#9aa2b1] hover:text-[#6e7788]">
            {{ item.label }}
          </NuxtLink>
          <span
v-else class="text-[clamp(0.95rem,1.2vw,1.05rem)]"
            :class="item.active ? 'font-semibold text-[#e30000]' : 'text-[#9aa2b1]'">
            {{ item.label }}
          </span>
          <span
v-if="index !== breadcrumbItems.length - 1"
            class="px-1 text-[clamp(0.95rem,1.2vw,1.05rem)] text-[#c5cad4]">/</span>
        </template>
      </nav>
    </div>

    <section
      class="mt-5 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <div class="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 class="text-[clamp(1.55rem,2.1vw,2rem)] font-semibold leading-tight text-[#11141b]">
            {{ pageTitle }}
          </h1>
          <p class="mt-3 max-w-300 text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-[#556173]">
            {{ pageDescription }}
          </p>
        </div>

        <button
v-if="props.mode === 'list'" type="button"
          class="inline-flex h-12 min-w-47.5 items-center justify-center rounded-[16px] bg-[#e30000] px-8 text-[1.3rem] font-semibold text-white shadow-[0_8px_18px_rgba(227,0,0,0.25)] transition hover:bg-[#c70000]"
          @click="goToCreatePage">
          Buat User Baru
        </button>
      </div>
    </section>

    <template v-if="props.mode === 'list'">
      <section
        class="mt-6 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <h2 class="text-[clamp(1.4rem,1.8vw,1.9rem)] font-semibold leading-tight text-[#11141b]">
          Detail User
        </h2>

        <div class="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          <article
v-for="card in infoCards" :key="card.id"
            class="rounded-[16px] border border-[#e4e7ec] bg-[#f8f8f8] px-5 py-5 shadow-[0_8px_16px_rgba(15,23,42,0.1)]">
            <div class="flex items-start justify-between gap-2">
              <p class="text-[clamp(1rem,1.2vw,1.15rem)] font-semibold text-[#44474d]">
                {{ card.title }}
              </p>
              <svg
xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#686b71]" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M9 7h8v8" />
              </svg>
            </div>

            <p
class="mt-3 min-h-13 font-semibold leading-tight text-[#0f1219]" :class="typeof card.value === 'number'
              ? 'text-[clamp(1.5rem,2vw,2rem)]'
              : 'text-[clamp(1.3rem,1.5vw,1.9rem)]'">
              {{ card.value }}
            </p>

            <div class="mt-2 h-3.5 w-40 overflow-hidden rounded-full bg-[#dae0e8]">
              <span class="block h-full rounded-full bg-[#48d27a]" :style="{ width: `${card.progressPercent}%` }" />
            </div>

            <p class="mt-2 text-[clamp(1rem,1.1vw,1.2rem)] text-[#1f76aa]">
              {{ card.subtitle }}
            </p>
          </article>
        </div>
      </section>

      <section
        class="mt-6 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <h2 class="text-[clamp(1.4rem,1.8vw,1.9rem)] font-semibold leading-tight text-[#11141b]">
          Daftar User
        </h2>

        <div class="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_auto_auto]">
          <label class="relative block w-full xl:max-w-107.5">
            <input
v-model="searchQuery" type="search" placeholder="Search"
              class="h-11 w-full rounded-[18px] border border-[#d8dde4] bg-[#f8f8f8] px-5 pr-12 text-[0.95rem] text-[#2d3645] outline-none placeholder:text-[#9099a8]">
            <svg
xmlns="http://www.w3.org/2000/svg"
              class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path
stroke-linecap="round" stroke-linejoin="round"
                d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
            </svg>
          </label>

          <label class="relative block w-full xl:w-42.5">
            <select
v-model="sortOrder"
              class="h-11 w-full appearance-none rounded-[18px] border border-[#d8dde4] bg-[#f8f8f8] px-5 pr-12 text-[0.95rem] text-[#9099a8] outline-none">
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
            <svg
xmlns="http://www.w3.org/2000/svg"
              class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </label>

          <label class="relative block w-full xl:w-42.5">
            <select
v-model="roleFilter"
              class="h-11 w-full appearance-none rounded-[18px] border border-[#d8dde4] bg-[#f8f8f8] px-5 pr-12 text-[0.95rem] text-[#9099a8] outline-none">
              <option v-for="option in roleFilterOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <svg
xmlns="http://www.w3.org/2000/svg"
              class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </label>
        </div>

        <div class="mt-5 overflow-x-auto rounded-[18px] border border-[#dce1e8] bg-white">
          <table class="w-full min-w-245 border-separate border-spacing-0">
            <thead>
              <tr>
                <th
                  class="w-15.5 border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">
                  No</th>
                <th
                  class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">
                  Nama</th>
                <th
                  class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">
                  Email</th>
                <th
                  class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">
                  Role</th>
                <th
                  class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">
                  Status</th>
                <th
                  class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">
                  Bergabung Pada</th>
              </tr>
            </thead>
            <tbody>
              <tr
v-for="(row, index) in paginatedRows" :key="row.id"
                class="cursor-pointer transition hover:bg-[#f7f9fc]" @click="goToEditPage(row.id)">
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[0.95rem] text-[#2f3744]">
                  {{ showingFrom + index }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] font-semibold text-[#3b3f46]">
                  {{ row.name }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                  {{ row.email }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                  {{ row.tableRoleLabel }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4">
                  <span
                    class="inline-flex min-w-24.5 items-center justify-center rounded-[14px] px-4 py-1 text-[1rem] font-semibold"
                    :class="resolveStatusClass(row.status)">
                    {{ row.status }}
                  </span>
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                  {{ row.joinedAt }}
                </td>
              </tr>

              <tr v-if="paginatedRows.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                  Data user tidak ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
          <p class="text-[clamp(1rem,1.1vw,1.2rem)] text-[#5d6778]">
            Menampilkan <strong>{{ showingFrom }}-{{ showingTo }}</strong> dari <strong>{{ filteredRows.length
              }}</strong> data
          </p>

          <div class="flex items-center gap-2">
            <button
type="button"
              class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="currentPage === 1" @click="currentPage = Math.max(1, currentPage - 1)">
              Previous
            </button>

            <button
type="button"
              class="rounded-[14px] bg-[#e30000] px-5 py-2 text-[0.875rem] font-semibold text-white">
              {{ currentPage }}
            </button>

            <button
type="button"
              class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="currentPage === totalPages" @click="currentPage = Math.min(totalPages, currentPage + 1)">
              Next
            </button>
          </div>
        </div>
      </section>
    </template>

    <template v-else>
      <section
        class="mt-6 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <h2 class="text-[clamp(1.4rem,1.8vw,1.9rem)] font-semibold leading-tight text-[#11141b]">
          {{ props.mode === 'create' ? 'Buat User Baru' : 'Edit User' }}
        </h2>

        <form
          class="mx-auto mt-6 w-full max-w-245 rounded-[24px] border-2 border-dashed border-[#d7dbe4] bg-[#f8f8f8] px-5 py-8 shadow-[0_6px_16px_rgba(15,23,42,0.12)] sm:px-8"
          @submit.prevent="handleSubmit">
          <h3 class="text-center text-[clamp(1.6rem,2vw,2.2rem)] font-semibold text-[#151922]">
            {{ formCardTitle }}
          </h3>

          <div class="mt-7 space-y-5">
            <div>
              <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
                Nama<span class="text-[#e30000]">*</span>
              </label>
              <input
v-model="form.name" type="text" :maxlength="nameLimit" placeholder="Masukkan nama di sini"
                class="mt-2 h-14 w-full rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5 text-[1.05rem] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]">
              <p class="mt-2 flex items-center justify-between text-[0.9rem] text-[#98a1b1]">
                <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                <span class="font-semibold">{{ nameCount }}/100</span>
              </p>
              <p v-if="formErrors.name" class="mt-1 text-[0.875rem] text-[#e30000]">
                {{ formErrors.name }}
              </p>
            </div>

            <div>
              <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
                Email<span class="text-[#e30000]">*</span>
              </label>
              <input
v-model="form.email" type="text" :maxlength="emailLimit" placeholder="Masukkan nama di sini"
                class="mt-2 h-14 w-full rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5 text-[1.05rem] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]">
              <p class="mt-2 flex items-center justify-between text-[0.9rem] text-[#98a1b1]">
                <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                <span class="font-semibold">{{ emailCount }}/100</span>
              </p>
              <p v-if="formErrors.email" class="mt-1 text-[0.875rem] text-[#e30000]">
                {{ formErrors.email }}
              </p>
            </div>

            <div>
              <p class="text-[1.9rem] font-semibold text-[#3f4b5f]">
                Pilih Role <span class="text-[#e30000]">*</span>
              </p>
              <p class="mt-1 text-[1rem] text-[#6a7384]">
                User bisa memiliki lebih dari satu role maksimal 2 role
              </p>

              <div class="mt-4 grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
                <label v-for="role in roleOptions" :key="role.value" class="flex cursor-pointer items-start gap-3">
                  <input
type="checkbox" :checked="isRoleSelected(role.value)"
                    class="mt-0.5 h-8 w-8 rounded-[8px] border-[#cfd5de] accent-[#e30000]"
                    @change="toggleRole(role.value)">
                  <span class="text-[1.05rem] font-semibold text-[#1f2634]">
                    {{ role.label }}
                  </span>
                </label>
              </div>

              <p v-if="formErrors.roles" class="mt-3 text-[0.875rem] text-[#e30000]">
                {{ formErrors.roles }}
              </p>
            </div>

            <div class="rounded-[12px] border border-[#f0a3a3] bg-[#fff3f3] px-4 py-3 text-[#c52222]">
              <p class="text-[0.98rem] leading-relaxed">
                <span class="font-semibold">Catatan:</span>
                {{ props.mode === 'create'
                  ? 'Role yang dipilih menentukan hak akses user pada modul dan data. Pastikan role yang dipilih sudah
                sesuai sebelum menekan tombol Buat.'
                : 'Role yang dipilih menentukan hak akses user pada sistem. Pastikan role yang dipilih sudah sesuai
                sebelum menekan tombol Edit.' }}
              </p>
            </div>

            <div v-if="props.mode !== 'create'" class="rounded-[16px] border border-[#dce1e8] bg-[#f7f8fa] p-5">
              <h4 class="text-[2rem] font-semibold text-[#1f2634]">
                Nonaktifkan User
              </h4>
              <p class="mt-2 max-w-155 text-[1.05rem] text-[#5d6778]">
                User yang dinonaktifkan tidak akan bisa mengakses sistem. Yakin ingin menonaktifkan User?
              </p>
              <button
type="button"
                class="mt-4 inline-flex h-12 min-w-55 items-center justify-center rounded-[14px] border border-[#a8b0be] bg-[#e4e8ee] px-6 text-[1.05rem] font-semibold text-[#4b5565] transition hover:bg-[#dce1e8]"
                @click="setUserInactive">
                Nonaktifkan User
              </button>
            </div>

            <p class="inline-flex items-center gap-2 text-[0.95rem] text-[#98a1b1]">
              <svg
xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2" />
              </svg>
              Terakhir disimpan: {{ form.lastSavedAt }}
            </p>
          </div>

          <div class="mt-7 flex justify-center">
            <button
type="submit"
              class="inline-flex h-12 min-w-37.5 items-center justify-center rounded-[18px] bg-[#e30000] px-8 text-[1.25rem] font-semibold text-white shadow-[0_10px_20px_rgba(227,0,0,0.22)] transition hover:bg-[#c90000]">
              {{ props.mode === 'create' ? 'Buat' : 'Edit' }}
            </button>
          </div>
        </form>
      </section>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import {
  getDashboardUserCreateDefaultForm,
  getDashboardUserDummyRows,
  getDashboardUserEditDetail,
  getDashboardUserInfoCards,
  getDashboardUserRoleOptions,
  sortDashboardUserRows,
  type DashboardUserRoleOption,
  type DashboardUserSortOrder,
  type DashboardUserStatus,
} from '../data/dashboardManajemenUserDummy'

type UserPageMode = 'list' | 'create' | 'detail' | 'edit'

interface BreadcrumbItem {
  label: string
  to?: string
  active?: boolean
}

const props = defineProps<{
  mode: UserPageMode
}>()

const route = useRoute()

const pageSize = 5
const nameLimit = 100
const emailLimit = 100
const roleLimit = 2

const rows = ref(getDashboardUserDummyRows())
const roleOptions = ref(getDashboardUserRoleOptions())
const searchQuery = ref('')
const sortOrder = ref<DashboardUserSortOrder>('a-z')
const roleFilter = ref('all')
const currentPage = ref(1)

const form = reactive({
  name: '',
  email: '',
  selectedRoles: [] as string[],
  status: 'Aktif' as DashboardUserStatus,
  lastSavedAt: '15 Feb 2026, 14:30',
})

const formErrors = reactive({
  name: '',
  email: '',
  roles: '',
})

function normalizeRouteParam(value: string | string[] | undefined): string | null {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

const userId = computed(() =>
  normalizeRouteParam(route.params.user_id as string | string[] | undefined)
)

const selectedUser = computed(() => getDashboardUserEditDetail(userId.value))
const infoCards = computed(() => getDashboardUserInfoCards(rows.value))

const roleFilterOptions = computed(() => {
  const options: DashboardUserRoleOption[] = [{ value: 'all', label: 'Role' }]
  roleOptions.value.forEach((option) => {
    options.push({ value: option.value, label: option.label })
  })
  return options
})

const pageTitle = computed(() => {
  if (props.mode === 'list') return 'Manajemen User'
  if (props.mode === 'create') return 'User Baru'
  return 'Edit User'
})

const pageDescription = computed(() => {
  if (props.mode === 'list') {
    return 'Gunakan halaman ini untuk mengelola daftar user, memantau status aktif/nonaktif, serta mengatur role akses sesuai kebutuhan. Gunakan tombol Buat User Baru untuk menambahkan user dan tetapkan role agar hak aksesnya tepat.'
  }

  if (props.mode === 'create') {
    return 'Gunakan halaman ini untuk menambahkan user baru dan menetapkan role akses sesuai kebutuhan. User dapat memiliki lebih dari satu role, sehingga hak akses dapat disesuaikan dengan tugas dan tanggung jawabnya.'
  }

  return 'Gunakan halaman ini untuk memperbarui informasi user, seperti nama, email, dan role akses. Perubahan yang disimpan akan memengaruhi hak akses user pada modul dan data sesuai role yang dipilih.'
})

const formCardTitle = computed(() =>
  props.mode === 'create' ? 'Form Buat User Baru' : 'Form Edit User'
)

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const listItem: BreadcrumbItem = { label: 'Management User', to: '/dashboard/manajemen-user' }

  if (props.mode === 'list') {
    return [
      { label: 'Home', to: '/dashboard' },
      { label: 'Management User', active: true },
    ]
  }

  if (props.mode === 'create') {
    return [
      { label: 'Home', to: '/dashboard' },
      listItem,
      { label: 'Buat', active: true },
    ]
  }

  return [
    { label: 'Home', to: '/dashboard' },
    listItem,
    { label: selectedUser.value.name || 'Nama User' },
    { label: 'Edit', active: true },
  ]
})

const backPath = computed(() => {
  if (props.mode === 'list') return '/dashboard'
  return '/dashboard/manajemen-user'
})

const filteredRows = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const sorted = sortDashboardUserRows(rows.value, sortOrder.value)

  return sorted.filter((row) => {
    const text = `${row.name} ${row.email} ${row.tableRoleLabel} ${row.status}`.toLowerCase()
    const matchesSearch = !query || text.includes(query)
    const matchesRole = roleFilter.value === 'all'
      || row.selectedRoleValues.includes(roleFilter.value)
    return matchesSearch && matchesRole
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredRows.value.length / pageSize))
)

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRows.value.slice(start, start + pageSize)
})

const showingFrom = computed(() => {
  if (!filteredRows.value.length) return 0
  return (currentPage.value - 1) * pageSize + 1
})

const showingTo = computed(() =>
  Math.min(currentPage.value * pageSize, filteredRows.value.length)
)

const nameCount = computed(() => form.name.length)
const emailCount = computed(() => form.email.length)

function setupForm() {
  if (props.mode === 'create') {
    const defaults = getDashboardUserCreateDefaultForm()
    form.name = defaults.name
    form.email = defaults.email
    form.selectedRoles = [...defaults.selectedRoles]
    form.status = 'Aktif'
    form.lastSavedAt = '15 Feb 2026, 14:30'
    resetFormErrors()
    return
  }

  form.name = selectedUser.value.name
  form.email = selectedUser.value.email
  form.selectedRoles = [...selectedUser.value.selectedRoles]
  form.status = selectedUser.value.status
  form.lastSavedAt = selectedUser.value.lastSavedAt
  resetFormErrors()
}

function resetFormErrors() {
  formErrors.name = ''
  formErrors.email = ''
  formErrors.roles = ''
}

function validateForm(): boolean {
  resetFormErrors()
  const trimmedName = form.name.trim()
  const trimmedEmail = form.email.trim()

  if (!trimmedName) {
    formErrors.name = 'Nama user wajib diisi.'
  } else if (trimmedName.length > nameLimit) {
    formErrors.name = 'Nama user maksimal 100 karakter.'
  }

  if (!trimmedEmail) {
    formErrors.email = 'Email user wajib diisi.'
  } else if (trimmedEmail.length > emailLimit) {
    formErrors.email = 'Email user maksimal 100 karakter.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    formErrors.email = 'Format email tidak valid.'
  }

  if (form.selectedRoles.length === 0) {
    formErrors.roles = 'Minimal 1 role wajib dipilih.'
  } else if (form.selectedRoles.length > roleLimit) {
    formErrors.roles = 'Maksimal 2 role yang bisa dipilih.'
  }

  return !formErrors.name && !formErrors.email && !formErrors.roles
}

function toggleRole(roleValue: string) {
  const selected = form.selectedRoles
  const index = selected.indexOf(roleValue)

  if (index >= 0) {
    selected.splice(index, 1)
    return
  }

  if (selected.length >= roleLimit) return
  selected.push(roleValue)
}

function isRoleSelected(roleValue: string): boolean {
  return form.selectedRoles.includes(roleValue)
}

function resolveStatusClass(status: DashboardUserStatus): string {
  if (status === 'Aktif') return 'bg-[#9DE8A1] text-[#128b1f]'
  return 'bg-[#DEE4EC] text-[#495363]'
}

async function navigateBack() {
  await navigateTo(backPath.value)
}

async function goToCreatePage() {
  await navigateTo('/dashboard/manajemen-user/create')
}

async function goToEditPage(id: string) {
  await navigateTo(`/dashboard/manajemen-user/${encodeURIComponent(id)}/edit`)
}

function setUserInactive() {
  form.status = 'Non Aktif'
}

async function handleSubmit() {
  if (!validateForm()) return
  await navigateTo('/dashboard/manajemen-user')
}

watch([searchQuery, sortOrder, roleFilter], () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotalPage) => {
  if (currentPage.value > nextTotalPage) {
    currentPage.value = nextTotalPage
  }
})

watch(
  [() => props.mode, userId],
  () => {
    setupForm()
  },
  { immediate: true }
)
</script>
