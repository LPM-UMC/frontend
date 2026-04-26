<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { navigateTo, useRoute } from '#imports'
import { useModul } from '../composables/useModul'
import { useAspekApi } from '../services/aspek.api'
import { useModulApi } from '../services/modul.api'
import AspekForm from './AspekForm.vue'
import AspekTable from './AspekTable.vue'
import ModulForm from './ModulForm.vue'
import ModulTable from './ModulTable.vue'
import type { AspekFormInput, AspekRecord } from '../types/aspek'
import type { ModulFormInput, ModulRecord } from '../types/modul'

type ModulPageMode =
  | 'list'
  | 'create'
  | 'detail'
  | 'edit'
  | 'aspek-create'
  | 'aspek-detail'
  | 'aspek-edit'

const props = defineProps<{
  mode: ModulPageMode
}>()

const route = useRoute()
const modulApi = useModulApi()
const aspekApi = useAspekApi()
const { rows, loading, fetchModul, saveModul } = useModul()

const modulDetail = ref<ModulRecord | null>(null)
const aspekRows = ref<AspekRecord[]>([])
const aspekDetail = ref<AspekRecord | null>(null)
const modulFormModel = ref<Partial<ModulFormInput>>({})
const aspekFormModel = ref<Partial<Omit<AspekFormInput, 'modulId'>>>({})
const pageError = ref<string | null>(null)
const pageLoading = ref(false)

function normalizeRouteParam(value: string | string[] | undefined): string | null {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

const modulId = computed(() =>
  normalizeRouteParam(route.params.modul_id as string | string[] | undefined)
)

const aspekId = computed(() =>
  normalizeRouteParam(route.params.aspek_id as string | string[] | undefined)
)

const pageTitle = computed(() => {
  if (props.mode === 'list') return 'Daftar Modul'
  if (props.mode === 'create') return 'Tambah Modul'
  if (props.mode === 'detail') return 'Detail Modul'
  if (props.mode === 'edit') return 'Edit Modul'
  if (props.mode === 'aspek-create') return 'Tambah Aspek'
  if (props.mode === 'aspek-detail') return 'Detail Aspek'
  return 'Edit Aspek'
})

async function loadModulDetail() {
  if (!modulId.value) {
    pageError.value = 'ID modul tidak ditemukan pada route.'
    return
  }

  pageLoading.value = true
  pageError.value = null

  const [modul, aspekList] = await Promise.all([
    modulApi.getModul(modulId.value),
    aspekApi.listAspek(modulId.value),
  ])

  modulDetail.value = modul
  aspekRows.value = aspekList.items

  if (!modul) {
    pageError.value = 'Data modul tidak ditemukan.'
  }

  pageLoading.value = false
}

async function loadEditModulForm() {
  await loadModulDetail()

  if (!modulDetail.value) return

  modulFormModel.value = {
    name: modulDetail.value.name,
    description: modulDetail.value.description ?? '',
  }
}

async function loadAspekDetail() {
  if (!modulId.value || !aspekId.value) {
    pageError.value = 'ID modul/aspek tidak ditemukan pada route.'
    return
  }

  pageLoading.value = true
  pageError.value = null

  const result = await aspekApi.getAspek(modulId.value, aspekId.value)
  aspekDetail.value = result

  if (!result) {
    pageError.value = 'Data aspek tidak ditemukan.'
  }

  if (props.mode === 'aspek-edit' && result) {
    aspekFormModel.value = {
      name: result.name,
      description: result.description ?? '',
    }
  }

  pageLoading.value = false
}

async function handleSubmitModul(payload: ModulFormInput) {
  const result = await saveModul(payload, props.mode === 'edit' ? modulId.value ?? undefined : undefined)

  if (!result) {
    pageError.value = 'Gagal menyimpan modul.'
    return
  }

  await navigateTo('/dashboard/modul')
}

async function handleSubmitAspek(payload: Omit<AspekFormInput, 'modulId'>) {
  if (!modulId.value) {
    pageError.value = 'ID modul tidak ditemukan pada route.'
    return
  }

  pageError.value = null

  const result = props.mode === 'aspek-edit' && aspekId.value
    ? await aspekApi.updateAspek(modulId.value, aspekId.value, payload)
    : await aspekApi.createAspek({
      modulId: modulId.value,
      ...payload,
    })

  if (!result) {
    pageError.value = 'Gagal menyimpan aspek.'
    return
  }

  await navigateTo(
    `/dashboard/modul/${modulId.value}/aspek/${result.id ?? aspekId.value ?? ''}`
  )
}

function openCreatePage() {
  navigateTo('/dashboard/modul/create')
}

function openDetailPage(id: string) {
  navigateTo(`/dashboard/modul/${id}`)
}

function openAspekCreatePage() {
  if (!modulId.value) return
  navigateTo(`/dashboard/modul/${modulId.value}/aspek/create`)
}

function openAspekDetailPage(id: string) {
  if (!modulId.value) return
  navigateTo(`/dashboard/modul/${modulId.value}/aspek/${id}`)
}

onMounted(async () => {
  if (props.mode === 'list') {
    await fetchModul()
    return
  }

  if (props.mode === 'create') return

  if (props.mode === 'detail') {
    await loadModulDetail()
    return
  }

  if (props.mode === 'edit') {
    await loadEditModulForm()
    return
  }

  await loadAspekDetail()
})
</script>

<template>
  <section class="mx-auto w-full max-w-5xl space-y-5 px-4 py-5 sm:px-6">
    <header class="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <h1 class="text-xl font-semibold text-slate-800">
        {{ pageTitle }}
      </h1>
      <p class="mt-1 text-sm text-slate-500">
        Kelola data modul dan aspek evaluasi sesuai struktur dashboard.
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
          Total modul: <strong>{{ rows.length }}</strong>
        </p>
        <button
          type="button"
          class="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white"
          @click="openCreatePage"
        >
          Tambah Modul
        </button>
      </div>

      <p v-if="loading" class="text-sm text-slate-500">
        Memuat modul...
      </p>

      <ModulTable v-else :rows="rows" />

      <div v-if="!loading" class="flex flex-wrap gap-2">
        <button
          v-for="row in rows"
          :key="row.id"
          type="button"
          class="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-600"
          @click="openDetailPage(row.id)"
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
        Memuat data formulir...
      </p>
      <ModulForm
        :model-value="modulFormModel"
        @submit="handleSubmitModul"
      />
    </article>

    <article
      v-if="props.mode === 'detail'"
      class="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <p v-if="pageLoading" class="text-sm text-slate-500">
        Memuat detail modul...
      </p>

      <div v-else-if="modulDetail" class="space-y-3">
        <div class="text-sm text-slate-700">
          <p><strong>Nama:</strong> {{ modulDetail.name }}</p>
          <p><strong>Deskripsi:</strong> {{ modulDetail.description || '-' }}</p>
        </div>

        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white"
            @click="navigateTo(`/dashboard/modul/${modulDetail.id}/edit`)"
          >
            Edit Modul
          </button>
          <button
            type="button"
            class="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white"
            @click="openAspekCreatePage"
          >
            Tambah Aspek
          </button>
        </div>

        <AspekTable :rows="aspekRows" />

        <div class="flex flex-wrap gap-2">
          <button
            v-for="row in aspekRows"
            :key="row.id"
            type="button"
            class="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-600"
            @click="openAspekDetailPage(row.id)"
          >
            Detail {{ row.name }}
          </button>
        </div>
      </div>
    </article>

    <article
      v-if="props.mode === 'aspek-create' || props.mode === 'aspek-edit'"
      class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <p v-if="pageLoading" class="mb-3 text-sm text-slate-500">
        Memuat data aspek...
      </p>
      <AspekForm
        :model-value="aspekFormModel"
        @submit="handleSubmitAspek"
      />
    </article>

    <article
      v-if="props.mode === 'aspek-detail'"
      class="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <p v-if="pageLoading" class="text-sm text-slate-500">
        Memuat detail aspek...
      </p>

      <div v-else-if="aspekDetail" class="space-y-2 text-sm text-slate-700">
        <p><strong>Nama Aspek:</strong> {{ aspekDetail.name }}</p>
        <p><strong>Deskripsi:</strong> {{ aspekDetail.description || '-' }}</p>
        <button
          type="button"
          class="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white"
          @click="navigateTo(`/dashboard/modul/${modulId}/aspek/${aspekDetail.id}/edit`)"
        >
          Edit Aspek
        </button>
      </div>
    </article>
  </section>
</template>
