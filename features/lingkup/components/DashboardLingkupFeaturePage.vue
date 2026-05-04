<script setup lang="ts">
import { onMounted, computed, ref, watch } from "vue"
import { useDasborStore } from "#stores/dashboard"
import { useLingkupStore } from "#stores/lingkup"
import { useI18n } from "vue-i18n"
import { useDebounceFn } from '@vueuse/core'

// ================= INIT =================
const localePath = useLocalePath()
const { locale } = useI18n()

const dasborStore = useDasborStore()
const lingkupStore = useLingkupStore()

// ================= STATE =================
const listSearchQuery = ref("")
const listSortOrder = ref<"asc" | "desc">("asc")
const listCurrentPage = ref(1)
const listPageSize = 10

const breadcrumbItems = computed(() => [
  { label: "Dashboard", to: localePath("/dashboard") },
  { label: "Manajemen Lingkup Evaluasi", active: true },
])

// ================= LANG =================
const currentLang = computed(() => locale.value as any)

// ================= FETCH =================
const fetchData = async () => {
  try {
    await Promise.all([
      dasborStore.fetchLingkupDasbor(currentLang.value),
      lingkupStore.fetchLingkups(currentLang.value, {
        page: listCurrentPage.value,
        size: listPageSize,
        search: listSearchQuery.value,
        order: listSortOrder.value,
      }),
    ])
  } catch (err) {
    console.error(err)
  }
}

// ================= WATCH =================
const debouncedFetch = useDebounceFn(fetchData, 400)

watch([listSearchQuery, listSortOrder], () => {
  listCurrentPage.value = 1
  debouncedFetch()
})

watch(listCurrentPage, fetchData)

// ================= MOUNT =================
onMounted(fetchData)

// ================= COMPUTED (TABLE DATA) =================
const listRows = computed(() =>
  lingkupStore.lingkups.map((l, i) => ({
    id: l.id,
    name: l.nama,
    description: l.deskripsi,
    status: l.is_aktif ? "Aktif" : "Nonaktif",
    createdAt: l.created_at
      ? new Date(l.created_at).toLocaleDateString()
      : "-",
  }))
)

// ================= PAGINATION =================
const listTotal = computed(() => lingkupStore.meta?.total ?? 0)
const listTotalPages = computed(() => lingkupStore.meta?.last_page ?? 1)

const listShowingFrom = computed(() =>
  (listCurrentPage.value - 1) * listPageSize + 1
)

const listShowingTo = computed(() =>
  Math.min(listCurrentPage.value * listPageSize, listTotal.value)
)
</script>

<template>
  <section class="mx-auto w-full max-w-380 px-4 pb-8 pt-6 sm:px-6 lg:px-8">
    <div class="flex items-center gap-3">
      <NuxtLink :to="localePath(`/dashboard`)">
        <button
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d6dae2] bg-[#efeff1] text-[#596273] shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:bg-white"
          aria-label="Kembali"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19 8 12l7-7" />
          </svg>
        </button>
      </NuxtLink>

      <nav class="flex flex-wrap items-center gap-1">
        <template v-for="(item, index) in breadcrumbItems" :key="`${item.label}-${index}`">
          <NuxtLink
            v-if="item.to"
            :to="item.to"
            class="text-[clamp(0.95rem,1.2vw,1.05rem)] text-[#9aa2b1] hover:text-[#6e7788]"
          >
            {{ item.label }}
          </NuxtLink>
          <span
            v-else
            class="text-[clamp(0.95rem,1.2vw,1.05rem)]"
            :class="item.active ? 'font-semibold text-[#e30000]' : 'text-[#9aa2b1]'"
          >
            {{ item.label }}
          </span>
          <span
            v-if="index !== breadcrumbItems.length - 1"
            class="px-1 text-[clamp(0.95rem,1.2vw,1.05rem)] text-[#c5cad4]"
          >/</span>
        </template>
      </nav>

    </div>

    <!-- HEADER -->
    <section class="rounded-xl bg-white p-5 shadow-sm my-6">
      <div class="flex flex-col gap-6 xl:flex-row xl:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-[#11141b]">
            {{ $t('manajemen_lingkup_evaluasi.nama') }}
          </h1>
          <p class="mt-2 text-[#556173]">
            {{ $t('manajemen_lingkup_evaluasi.deskripsi') }}
          </p>
        </div>

        <NuxtLink :to="localePath('/dashboard/manajemen-lingkup/create')"
          class="rounded-xl bg-[#e30000] px-6 py-2 text-white font-semibold hover:bg-[#c70000] h-full w-max flex items-center justify-center transition-colors">
          {{ $t('manajemen_lingkup_evaluasi.buat') }}
        </NuxtLink>
      </div>
    </section>

    <!-- STAT -->
    <section class="rounded-xl bg-white p-6 shadow-sm">
      <h2 class="font-semibold text-gray-700">Detail</h2>

      <div class="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">

        <!-- TOTAL USER -->
        <article class="shadow p-4 rounded-xl bg-gray-50">
          <p class="text-sm text-gray-500">Total Lingkup</p>
          <h3 class="text-2xl font-bold text-right">
            {{ dasborStore.isLoading ? '...' : dasborStore.lingkupDasbor?.total_lingkup ?? 0 }}
          </h3>
        </article>

        <!-- USER AKTIF -->
        <article class="shadow p-4 rounded-xl bg-gray-50">
          <p class="text-sm text-gray-500">Total Lingkup Aktif</p>
          <h3 class="text-2xl font-bold text-right">
            {{ dasborStore.isLoading ? '...' : dasborStore.lingkupDasbor?.total_lingkup_aktif ?? 0 }}
          </h3>
        </article>

        <!-- TOTAL ROLE -->
        <article class="shadow p-4 rounded-xl bg-gray-50">
          <p class="text-sm text-gray-500">Total Lingkup Terhapus</p>
          <h3 class="text-2xl font-bold text-right">
            {{ dasborStore.isLoading ? '...' : dasborStore.lingkupDasbor?.total_lingkup_terhapus ?? 0 }}
          </h3>
        </article>

        <!-- ROLE TERBANYAK -->
        <article class="shadow p-4 rounded-xl bg-gray-50">
          <p class="text-sm text-gray-500">Lingkup Periode Terbanyak</p>
          <h3 class="text-lg font-bold text-right truncate">
            {{ dasborStore.isLoading ? '...' : dasborStore.lingkupDasbor?.lingkup_periode_terbanyak ?? '-' }}
          </h3>
        </article>

      </div>
    </section>

      <section class="mt-6 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
        <h2 class="text-[clamp(1.4rem,1.8vw,1.9rem)] font-semibold leading-tight text-[#11141b]">
          Daftar Lingkup Evaluasi
        </h2>

        <div class="mt-5 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_auto_auto]">
          <label class="relative block w-full xl:max-w-107.5">
            <input
              v-model="listSearchQuery"
              type="search"
              placeholder="Search"
              class="h-11 w-full rounded-[18px] border border-[#d8dde4] bg-[#f8f8f8] px-5 pr-12 text-[0.95rem] text-[#2d3645] outline-none placeholder:text-[#9099a8]"
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
            </svg>
          </label>


          <label class="relative block w-full xl:w-42.5">
            <select v-model="listSortOrder" class="h-11 rounded-xl bg-gray-100 px-4 outline-none">
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </label>

        </div>

        <div class="mt-5 overflow-x-auto rounded-[18px] border border-[#dce1e8] bg-white">
          <table class="w-full min-w-255 border-separate border-spacing-0">
            <thead>
              <tr>
                <th class="w-15.5 border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">No</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Nama</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Deskripsi</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Status</th>
                <th class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">Dibuat Pada</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in listRows"
                :key="row.id"
                class="border-t border-[#e8edf3]"
              >
                <td class="px-4 py-4">
                  {{ listShowingFrom + index }}
                </td>

                <td class="px-4 py-4">
                    <NuxtLink
                      :to="localePath(`/dashboard/manajemen-lingkup/${row.id}`)"
                      class="text-[#1e88e5] hover:underline"
                    >
                    {{ row.name }}
                  </NuxtLink>
                </td>

                <td class="px-4 py-4">
                  {{ row.description }}
                </td>

                <td class="px-4 py-4">
                  {{ row.status }}
                </td>

                <td class="px-4 py-4">
                  {{ row.createdAt }}
                </td>
              </tr>

              <tr v-if="listRows.length === 0">
                <td colspan="5" class="text-center py-6">
                  Data lingkup tidak ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
          <p class="text-[clamp(1rem,1.1vw,1.2rem)] text-[#5d6778]">
            Menampilkan <strong>{{ listShowingFrom }}-{{ listShowingTo }}</strong> dari <strong>{{ listTotal.length }}</strong> data
          </p>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="listCurrentPage === 1"
              @click="listCurrentPage = Math.max(1, listCurrentPage - 1)"
            >
              Previous
            </button>

            <button
              type="button"
              class="rounded-[14px] bg-[#e30000] px-5 py-2 text-[0.875rem] font-semibold text-white"
            >
              {{ listCurrentPage }}
            </button>

            <button
              type="button"
              class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="listCurrentPage === listTotalPages"
              @click="listCurrentPage = Math.min(listTotalPages, listCurrentPage + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </section>

  </section>
</template>
