<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import UserTable from './UserTable.vue'
import { useUserStore } from '#stores/user'
import { useI18n } from 'vue-i18n'
import { useRoleStore } from '#stores/role'
import { useDasborStore } from '#stores/dashboard'

const localePath = useLocalePath()
const { locale } = useI18n()
const roleStore = useRoleStore()
const userStore = useUserStore()
const dasborStore = useDasborStore()

const search = ref('')
const order = ref<'asc' | 'desc'>('asc')
const page = ref(1)

let lastRequestId = 0

const roleId = ref<string | undefined>(undefined)

// fetch role + user
onMounted(async () => {
  await roleStore.fetchRoles(locale.value as lang)
  await fetchData()
  await dasborStore.fetchUserDasbor(locale.value as lang)
})

// update fetch
const fetchData = async () => {
  const requestId = ++lastRequestId

  await userStore.fetchUsers(locale.value as any, {
    page: page.value,
    search: search.value,
    order: order.value,
    roleId: roleId.value,
  })

  if (requestId !== lastRequestId) return
}

// reset page kalau filter berubah
watch([search, roleId], () => {
  page.value = 1
})

// watch semua
watch([search, order, page, locale, roleId], fetchData)
</script>

<template>
  <section class="mx-auto w-full max-w-5xl space-y-5 px-4 py-5">

    <!-- HEADER -->
    <section class="rounded-xl bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-6 xl:flex-row xl:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-[#11141b]">
            {{ $t('manajemen_user.nama') }}
          </h1>
          <p class="mt-2 text-[#556173]">
            {{ $t('manajemen_user.deskripsi') }}
          </p>
        </div>

        <NuxtLink :to="localePath('/dashboard/manajemen-user/create')"
          class="rounded-xl bg-[#e30000] px-6 py-2 text-white font-semibold hover:bg-[#c70000] h-full w-max flex items-center justify-center transition-colors">
          {{ $t('manajemen_user.buat') }}
        </NuxtLink>
      </div>
    </section>

    <!-- STAT -->
    <section class="rounded-xl bg-white p-6 shadow-sm">
      <h2 class="font-semibold text-gray-700">Detail</h2>

      <div class="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">

        <!-- TOTAL USER -->
        <article class="shadow p-4 rounded-xl bg-gray-50">
          <p class="text-sm text-gray-500">Total User</p>
          <h3 class="text-2xl font-bold text-right">
            {{ dasborStore.isLoading ? '...' : dasborStore.userDasbor?.total_user ?? 0 }}
          </h3>
        </article>

        <!-- USER AKTIF -->
        <article class="shadow p-4 rounded-xl bg-gray-50">
          <p class="text-sm text-gray-500">User Aktif</p>
          <h3 class="text-2xl font-bold text-right">
            {{ dasborStore.isLoading ? '...' : dasborStore.userDasbor?.total_user_aktif ?? 0 }}
          </h3>
        </article>

        <!-- TOTAL ROLE -->
        <article class="shadow p-4 rounded-xl bg-gray-50">
          <p class="text-sm text-gray-500">Total Role</p>
          <h3 class="text-2xl font-bold text-right">
            {{ dasborStore.isLoading ? '...' : dasborStore.userDasbor?.total_role ?? 0 }}
          </h3>
        </article>

        <!-- ROLE TERBANYAK -->
        <article class="shadow p-4 rounded-xl bg-gray-50">
          <p class="text-sm text-gray-500">Role Terbanyak</p>
          <h3 class="text-lg font-bold text-right truncate">
            {{ dasborStore.isLoading ? '...' : dasborStore.userDasbor?.role_user_terbanyak ?? '-' }}
          </h3>
        </article>

      </div>
    </section>

    <!-- TABLE -->
    <UserTable :rows="userStore.users" :loading="userStore.isLoading" :meta="userStore.meta" :roles="roleStore.roles"
      @search="search = $event" @order="order = $event" @page="page = $event" @role="roleId = $event" />

  </section>
</template>
