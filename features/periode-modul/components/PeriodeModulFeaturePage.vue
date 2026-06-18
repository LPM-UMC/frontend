<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { navigateTo, useRoute } from '#imports'
import { usePeriodeModul } from '../composables/usePeriodeModul'
import { usePeriodeModulApi } from '../services/periode-modul.api'
import PeriodeModulForm from './PeriodeModulForm.vue'
import PeriodeModulTable from './PeriodeModulTable.vue'
import type { PeriodeModulFormInput, PeriodeModulRecord } from '../types/periode-modul'

type PeriodePageMode = 'list' | 'create' | 'detail' | 'edit'

const props = defineProps<{
  mode: PeriodePageMode
}>()

const route = useRoute()
const periodeApi = usePeriodeModulApi()
const { rows, loading, fetchPeriodeModul, savePeriodeModul } = usePeriodeModul()

const detail = ref<PeriodeModulRecord | null>(null)
const formModel = ref<Partial<PeriodeModulFormInput>>({})
const pageError = ref<string | null>(null)
const pageLoading = ref(false)

function normalizeRouteParam(value: string | string[] | undefined): string | null {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

const periodeModulId = computed(() =>
  normalizeRouteParam(route.params.periode_modul_id as string | string[] | undefined)
)

const pageTitle = computed(() => {
  if (props.mode === 'list') return 'Daftar Periode Modul'
  if (props.mode === 'create') return 'Tambah Periode Modul'
  if (props.mode === 'detail') return 'Detail Periode Modul'
  return 'Edit Periode Modul'
})

function toDetailPath(id: string) {
  return `/dashboard/periode-modul/${id}`
}

async function loadDetail() {
  if (!periodeModulId.value) {
    pageError.value = 'ID periode modul tidak ditemukan pada route.'
    return
  }

  pageLoading.value = true
  pageError.value = null
  detail.value = await periodeApi.getPeriodeModul(periodeModulId.value)

  if (!detail.value) {
    pageError.value = 'Data periode modul tidak ditemukan.'
  }

  pageLoading.value = false
}

async function loadEditForm() {
  await loadDetail()

  if (!detail.value) return

  formModel.value = {
    name: detail.value.name,
    year: detail.value.year,
    semester: detail.value.semester,
    status: detail.value.status,
    startDate: detail.value.startDate ?? '',
    endDate: detail.value.endDate ?? '',
  }
}

async function handleSubmit(payload: PeriodeModulFormInput) {
  const result = await savePeriodeModul(
    payload,
    props.mode === 'edit' ? periodeModulId.value ?? undefined : undefined
  )

  if (!result) {
    pageError.value = 'Gagal menyimpan periode modul.'
    return
  }

  if (props.mode === 'create') {
    await navigateTo('/dashboard/periode-modul')
    return
  }

  await navigateTo(toDetailPath(periodeModulId.value ?? result.id))
}

onMounted(async () => {
  if (props.mode === 'list') {
    await fetchPeriodeModul()
    return
  }

  if (props.mode === 'create') return

  if (props.mode === 'detail') {
    await loadDetail()
    return
  }

  await loadEditForm()
})
</script>

<template>
  <section class="mx-auto w-full max-w-5xl space-y-5 px-4 py-5 sm:px-6">
    <header class="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <h1 class="text-xl font-semibold text-slate-800">
        {{ pageTitle }}
      </h1>
      <p class="mt-1 text-sm text-slate-500">
        Pengelolaan periode modul untuk siklus evaluasi dashboard.
      </p>
    </header>

    <p v-if="pageError" class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
      {{ pageError }}
    </p>

    <article
      v-if="props.mode === 'list'"
      class="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div class="flex items-center justify-between gap-3">
        <p class="text-sm text-slate-600">
          Total periode: <strong>{{ rows.length }}</strong>
        </p>
        <button
          type="button"
          class="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white"
          @click="navigateTo('/dashboard/periode-modul/create')"
        >
          Tambah Periode
        </button>
      </div>

      <p v-if="loading" class="text-sm text-slate-500">
        Memuat periode modul...
      </p>

      <PeriodeModulTable v-else :rows="rows" />

      <div class="flex flex-wrap gap-2">
        <button
          v-for="row in rows"
          :key="row.id"
          type="button"
          class="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-600"
          @click="navigateTo(toDetailPath(row.id))"
        >
          Detail {{ row.name }}
        </button>
      </div>
    </article>

    <article
      v-if="props.mode === 'create' || props.mode === 'edit'"
      class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <p v-if="pageLoading" class="mb-3 text-sm text-slate-500">
        Memuat formulir periode modul...
      </p>
      <PeriodeModulForm
        :model-value="formModel"
        @submit="handleSubmit"
      />
    </article>

    <article
      v-if="props.mode === 'detail'"
      class="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <p v-if="pageLoading" class="text-sm text-slate-500">
        Memuat detail periode modul...
      </p>

      <div v-else-if="detail" class="space-y-2 text-sm text-slate-700">
        <p><strong>Nama:</strong> {{ detail.name }}</p>
        <p><strong>Tahun:</strong> {{ detail.year }}</p>
        <p><strong>Semester:</strong> {{ detail.semester }}</p>
        <p><strong>Status:</strong> {{ detail.status }}</p>
        <p><strong>Tanggal Mulai:</strong> {{ detail.startDate || '-' }}</p>
        <p><strong>Tanggal Selesai:</strong> {{ detail.endDate || '-' }}</p>

        <button
          type="button"
          class="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white"
          @click="navigateTo(`/dashboard/periode-modul/${detail.id}/edit`)"
        >
          Edit Periode
        </button>
      </div>
    </article>
  </section>
</template>
