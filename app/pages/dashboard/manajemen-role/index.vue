<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoleStore } from '#stores/role'
import { useDasborStore } from '#stores/dashboard'
import RoleTable from '#features/manajemen-user/components/RoleTable.vue'

definePageMeta({
  layout: "manajemen-user-role",
})

const localePath = useLocalePath()
const { locale } = useI18n()

const roleStore = useRoleStore()
const dasborStore = useDasborStore()

const search = ref('')
const order = ref<'asc' | 'desc'>('asc')
const page = ref(1)

const meta = ref<any>(null)

// fetch data
const fetchData = async () => {
  meta.value = await roleStore.fetchRoles(locale.value as any, {
    page: page.value,
    search: search.value,
    order: order.value,
  })
}

// lifecycle
onMounted(async () => {
  await fetchData()
  await dasborStore.fetchRoleDasbor(locale.value as any)
})

// reset page
watch([search], () => {
  page.value = 1
})

// watch
watch([search, order, page, locale], fetchData)
</script>

<template>
  <section class="mx-auto w-full max-w-5xl space-y-5 px-4 py-5">

    <!-- HEADER -->
    <section class="rounded-xl bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-6 xl:flex-row xl:justify-between">
        <div>
          <h1 class="text-2xl font-semibold">Manajemen Role</h1>
          <p class="text-gray-500">Kelola role dan akses sistem</p>
        </div>

        <NuxtLink :to="localePath('/dashboard/manajemen-role/create')"
          class="rounded-xl bg-red-600 px-6 py-2 text-white">
          Tambah Role
        </NuxtLink>
      </div>
    </section>

    <!-- STAT -->
    <section class="rounded-xl bg-white p-6 shadow-sm">
      <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">

        <article class="p-4 bg-gray-50 rounded-xl">
          <p class="text-sm">Total User</p>
          <h3 class="text-xl font-bold">
            {{ dasborStore.roleDasbor?.total_user ?? 0 }}
          </h3>
        </article>

        <article class="p-4 bg-gray-50 rounded-xl">
          <p class="text-sm">User Aktif</p>
          <h3 class="text-xl font-bold">
            {{ dasborStore.roleDasbor?.total_user_aktif ?? 0 }}
          </h3>
        </article>

        <article class="p-4 bg-gray-50 rounded-xl">
          <p class="text-sm">Total Role</p>
          <h3 class="text-xl font-bold">
            {{ dasborStore.roleDasbor?.total_role ?? 0 }}
          </h3>
        </article>

        <article class="p-4 bg-gray-50 rounded-xl">
          <p class="text-sm">Role Terbanyak</p>
          <h3 class="text-sm font-bold truncate">
            {{ dasborStore.roleDasbor?.role_user_terbanyak ?? '-' }}
          </h3>
        </article>

      </div>
    </section>

    <!-- TABLE -->
    <RoleTable :rows="roleStore.roles" :loading="roleStore.isLoading" :meta="meta" @search="search = $event"
      @order="order = $event" @page="page = $event" />

  </section>
</template>
