<script setup lang="ts">import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { RoleResponse } from '#types/role'
import type { PagingRequest } from '#stores/page'

const localePath = useLocalePath()

const props = defineProps<{
  rows: RoleResponse[]
  loading: boolean
  meta: PagingRequest | null
}>()

const emit = defineEmits<{
  search: [string]
  order: ['asc' | 'desc']
  page: [number]
  role: [string | undefined]
}>()

const searchInput = ref('')
const order = ref<'asc' | 'desc'>('asc')

const sanitize = (val: string) =>
  val.replace(/[^\w\s@.-]/gi, '').trim().slice(0, 100)

const emitSearch = useDebounceFn((val: string) => {
  emit('search', sanitize(val))
}, 500)

watch(searchInput, emitSearch)
watch(order, (val) => emit('order', val))

const changePage = (p: number) => emit('page', p)
</script>

<template>
  <article class="rounded-xl bg-white shadow-sm">

    <!-- HEADER -->
    <div class="flex items-center justify-between px-6 py-5">
      <div>
        <h3 class="text-lg font-semibold">Daftar User</h3>
        <p class="text-sm text-gray-500">
          {{ meta?.total || 0 }} user ditemukan
        </p>
      </div>
    </div>

    <div class="px-6 pb-6">

      <!-- FILTER -->
      <div class="flex flex-col gap-4 md:flex-row md:justify-between">

        <!-- SEARCH -->
        <div class="relative w-full md:max-w-95">
          <input v-model="searchInput" type="search" placeholder="Cari nama atau email..."
            class="h-11 w-full rounded-xl bg-gray-100 px-4 pl-10 outline-none focus:ring-2 focus:ring-red-200 ring-1 ring-gray-300 transition">

          <!-- Icon Nuxt ui searc-->
          <div class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor">
              <path stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

        </div>

        <!-- RIGHT FILTER -->
        <div class="flex gap-2">

          <!-- ORDER -->
          <select v-model="order" class="h-11 rounded-xl bg-gray-100 px-4 outline-none">
            <option value="asc">Nama A - Z</option>
            <option value="desc">Nama Z - A</option>
          </select>

        </div>

      </div>

      <!-- TABLE -->
      <div class="mt-4 overflow-x-auto rounded-xl bg-gray-50">
        <table class="w-full min-w-[800px] text-sm">

          <thead class="text-gray-600">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">Nama</th>
              <th class="px-4 py-3 text-left">Deskripsi</th>
              <th class="px-4 py-3 text-left">Jumlah User</th>
              <th class="px-4 py-3 text-left">Tanggal Dibuat</th>
            </tr>
          </thead>

          <!-- GANTI TOTAL ISI TABLE -->
          <tbody>

            <!-- LOADING -->
            <tr v-if="loading">
              <td colspan="5" class="text-center py-6">Loading...</td>
            </tr>

            <!-- DATA -->
            <tr v-for="(role, i) in rows" v-else-if="rows.length" :key="role.id">
              <td class="px-4 py-3">{{ i + 1 }}</td>

              <NuxtLink :to="localePath(`/dashboard/manajemen-role/${role.id}`)" class="text-blue-600 hover:underline">
                {{ role.nama }}
              </NuxtLink>

              <td class="px-4 py-3">
                {{ role.deskripsi || '-' }}
              </td>

              <td class="px-4 py-3">
                {{ role.jumlah_user ?? 0 }}
              </td>

              <td class="px-4 py-3">
                {{ new Date(role.created_at!).toLocaleDateString('id-ID') }}
              </td>
            </tr>

            <!-- EMPTY -->
            <tr v-else>
              <td colspan="5" class="text-center py-6 text-gray-400">
                Tidak ada data
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div class="mt-4 flex justify-between items-center text-sm">
        <p>
          Halaman {{ meta?.page || 1 }} dari {{ meta?.total_pages || 1 }}
        </p>

        <div class="flex gap-2">
          <button :disabled="meta?.page === 1" class="px-4 py-2 rounded bg-gray-100 disabled:opacity-50"
            @click="changePage(meta!.page - 1)">
            Prev
          </button>

          <button class="px-4 py-2 bg-red-600 text-white rounded">
            {{ meta?.page }}
          </button>

          <button :disabled="meta?.page === meta?.total_pages" class="px-4 py-2 rounded bg-gray-100 disabled:opacity-50"
            @click="changePage(meta!.page + 1)">
            Next
          </button>
        </div>
      </div>

    </div>
  </article>
</template>
