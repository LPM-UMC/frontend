<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { navigateTo, useRoute } from '#imports'
import LingkupForm from './LingkupForm.vue'
import LingkupTable from './LingkupTable.vue'
import ObjekForm from './ObjekForm.vue'
import ObjekTable from './ObjekTable.vue'
import UnitForm from './UnitForm.vue'
import UnitTable from './UnitTable.vue'
import { useLingkup } from '../composables/useLingkup'
import { useLingkupApi } from '../services/lingkup.api'
import { useObjekApi } from '../services/objek.api'
import { useUnitApi } from '../services/unit.api'
import type { LingkupFormInput, LingkupRecord } from '../types/lingkup'
import type { ObjekFormInput, ObjekRecord } from '../types/objek'
import type { UnitFormInput, UnitRecord } from '../types/unit'

type LingkupPageMode =
  | 'list'
  | 'create'
  | 'detail'
  | 'edit'
  | 'unit-create'
  | 'unit-detail'
  | 'unit-edit'
  | 'objek-create'
  | 'objek-detail'
  | 'objek-edit'
  | 'unit-objek-create'
  | 'unit-objek-detail'
  | 'unit-objek-edit'

const props = defineProps<{
  mode: LingkupPageMode
}>()

const route = useRoute()
const lingkupApi = useLingkupApi()
const unitApi = useUnitApi()
const objekApi = useObjekApi()
const { rows, loading, fetchLingkup, saveLingkup } = useLingkup()

const pageError = ref<string | null>(null)
const pageLoading = ref(false)

const lingkupDetail = ref<LingkupRecord | null>(null)
const unitDetail = ref<UnitRecord | null>(null)
const objekDetail = ref<ObjekRecord | null>(null)

const lingkupFormModel = ref<Partial<LingkupFormInput>>({})
const unitFormModel = ref<Partial<Omit<UnitFormInput, 'lingkupId'>>>({})
const objekFormModel = ref<Partial<Omit<ObjekFormInput, 'lingkupId' | 'unitId'>>>({})

function normalizeRouteParam(value: string | string[] | undefined): string | null {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

const lingkupId = computed(() =>
  normalizeRouteParam(route.params.lingkup_id as string | string[] | undefined)
)

const unitId = computed(() =>
  normalizeRouteParam(route.params.unit_id as string | string[] | undefined)
)

const objekId = computed(() =>
  normalizeRouteParam(route.params.objek_id as string | string[] | undefined)
)

const pageTitle = computed(() => {
  if (props.mode === 'list') return 'Daftar Lingkup'
  if (props.mode === 'create') return 'Tambah Lingkup'
  if (props.mode === 'detail') return 'Detail Lingkup'
  if (props.mode === 'edit') return 'Edit Lingkup'
  if (props.mode === 'unit-create') return 'Tambah Unit'
  if (props.mode === 'unit-detail') return 'Detail Unit'
  if (props.mode === 'unit-edit') return 'Edit Unit'
  if (props.mode === 'objek-create') return 'Tambah Objek'
  if (props.mode === 'objek-detail') return 'Detail Objek'
  if (props.mode === 'objek-edit') return 'Edit Objek'
  if (props.mode === 'unit-objek-create') return 'Tambah Objek Unit'
  if (props.mode === 'unit-objek-detail') return 'Detail Objek Unit'
  return 'Edit Objek Unit'
})

const isUnitScope = computed(() =>
  props.mode === 'unit-objek-create'
  || props.mode === 'unit-objek-detail'
  || props.mode === 'unit-objek-edit'
)

function toLingkupDetailPath(id: string) {
  return `/dashboard/lingkup/${id}`
}

function toUnitDetailPath(lId: string, uId: string) {
  return `/dashboard/lingkup/${lId}/unit/${uId}`
}

function toObjekDetailPath(lId: string, oId: string, uId?: string | null) {
  if (uId) {
    return `/dashboard/lingkup/${lId}/unit/${uId}/objek/${oId}`
  }
  return `/dashboard/lingkup/${lId}/objek/${oId}`
}

async function loadLingkupDetail() {
  if (!lingkupId.value) {
    pageError.value = 'ID lingkup tidak ditemukan pada route.'
    return
  }

  pageLoading.value = true
  pageError.value = null
  lingkupDetail.value = await lingkupApi.getLingkup(lingkupId.value)

  if (!lingkupDetail.value) {
    pageError.value = 'Data lingkup tidak ditemukan.'
  }

  pageLoading.value = false
}

async function loadLingkupEditForm() {
  await loadLingkupDetail()
  if (!lingkupDetail.value) return

  lingkupFormModel.value = {
    name: lingkupDetail.value.name,
    description: lingkupDetail.value.description ?? '',
  }
}

async function loadUnitDetail() {
  if (!lingkupId.value || !unitId.value) {
    pageError.value = 'ID lingkup/unit tidak ditemukan pada route.'
    return
  }

  pageLoading.value = true
  pageError.value = null
  unitDetail.value = await unitApi.getUnit(lingkupId.value, unitId.value)

  if (!unitDetail.value) {
    pageError.value = 'Data unit tidak ditemukan.'
  }

  if (props.mode === 'unit-edit' && unitDetail.value) {
    unitFormModel.value = {
      name: unitDetail.value.name,
      description: unitDetail.value.description ?? '',
    }
  }

  pageLoading.value = false
}

async function loadObjekDetail() {
  if (!lingkupId.value || !objekId.value) {
    pageError.value = 'ID lingkup/objek tidak ditemukan pada route.'
    return
  }

  pageLoading.value = true
  pageError.value = null
  objekDetail.value = await objekApi.getObjek(
    lingkupId.value,
    objekId.value,
    isUnitScope.value ? unitId.value ?? undefined : undefined
  )

  if (!objekDetail.value) {
    pageError.value = 'Data objek tidak ditemukan.'
  }

  if ((props.mode === 'objek-edit' || props.mode === 'unit-objek-edit') && objekDetail.value) {
    objekFormModel.value = {
      name: objekDetail.value.name,
      description: objekDetail.value.description ?? '',
    }
  }

  pageLoading.value = false
}

async function handleSubmitLingkup(payload: LingkupFormInput) {
  const result = await saveLingkup(payload, props.mode === 'edit' ? lingkupId.value ?? undefined : undefined)

  if (!result) {
    pageError.value = 'Gagal menyimpan lingkup.'
    return
  }

  await navigateTo(props.mode === 'create' ? '/dashboard/lingkup' : toLingkupDetailPath(lingkupId.value ?? result.id))
}

async function handleSubmitUnit(payload: Omit<UnitFormInput, 'lingkupId'>) {
  if (!lingkupId.value) {
    pageError.value = 'ID lingkup tidak ditemukan pada route.'
    return
  }

  const result = props.mode === 'unit-edit' && unitId.value
    ? await unitApi.updateUnit(lingkupId.value, unitId.value, payload)
    : await unitApi.createUnit({
      lingkupId: lingkupId.value,
      ...payload,
    })

  if (!result) {
    pageError.value = 'Gagal menyimpan unit.'
    return
  }

  await navigateTo(toUnitDetailPath(lingkupId.value, result.id ?? unitId.value ?? ''))
}

async function handleSubmitObjek(payload: Omit<ObjekFormInput, 'lingkupId' | 'unitId'>) {
  if (!lingkupId.value) {
    pageError.value = 'ID lingkup tidak ditemukan pada route.'
    return
  }

  const currentUnitId = isUnitScope.value ? unitId.value ?? undefined : undefined

  const result = (props.mode === 'objek-edit' || props.mode === 'unit-objek-edit') && objekId.value
    ? await objekApi.updateObjek(lingkupId.value, objekId.value, payload, currentUnitId)
    : await objekApi.createObjek({
      lingkupId: lingkupId.value,
      unitId: currentUnitId,
      ...payload,
    })

  if (!result) {
    pageError.value = 'Gagal menyimpan objek.'
    return
  }

  await navigateTo(toObjekDetailPath(lingkupId.value, result.id ?? objekId.value ?? '', currentUnitId))
}

onMounted(async () => {
  if (props.mode === 'list') {
    await fetchLingkup()
    return
  }

  if (props.mode === 'create') return

  if (props.mode === 'detail') {
    await loadLingkupDetail()
    return
  }

  if (props.mode === 'edit') {
    await loadLingkupEditForm()
    return
  }

  if (
    props.mode === 'unit-detail'
    || props.mode === 'unit-edit'
  ) {
    await loadUnitDetail()
    return
  }

  if (
    props.mode === 'objek-detail'
    || props.mode === 'objek-edit'
    || props.mode === 'unit-objek-detail'
    || props.mode === 'unit-objek-edit'
  ) {
    await loadObjekDetail()
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
        Pengelolaan lingkup, unit, dan objek evaluasi dashboard.
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
        <p class="text-sm text-slate-600">Total lingkup: <strong>{{ rows.length }}</strong></p>
        <button
          type="button"
          class="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white"
          @click="navigateTo('/dashboard/lingkup/create')"
        >
          Tambah Lingkup
        </button>
      </div>

      <p v-if="loading" class="text-sm text-slate-500">Memuat data lingkup...</p>
      <LingkupTable v-else :rows="rows" />

      <div class="flex flex-wrap gap-2">
        <button
          v-for="row in rows"
          :key="row.id"
          type="button"
          class="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-600"
          @click="navigateTo(toLingkupDetailPath(row.id))"
        >
          Detail {{ row.name }}
        </button>
      </div>
    </article>

    <article
      v-if="props.mode === 'create' || props.mode === 'edit'"
      class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <p v-if="pageLoading" class="mb-3 text-sm text-slate-500">Memuat formulir...</p>
      <LingkupForm :model-value="lingkupFormModel" @submit="handleSubmitLingkup" />
    </article>

    <article
      v-if="props.mode === 'detail'"
      class="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <p v-if="pageLoading" class="text-sm text-slate-500">Memuat detail lingkup...</p>
      <div v-else-if="lingkupDetail" class="space-y-3 text-sm text-slate-700">
        <p><strong>Nama:</strong> {{ lingkupDetail.name }}</p>
        <p><strong>Deskripsi:</strong> {{ lingkupDetail.description || '-' }}</p>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white"
            @click="navigateTo(`/dashboard/lingkup/${lingkupDetail.id}/edit`)"
          >
            Edit Lingkup
          </button>
          <button
            type="button"
            class="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white"
            @click="navigateTo(`/dashboard/lingkup/${lingkupDetail.id}/unit/create`)"
          >
            Tambah Unit
          </button>
          <button
            type="button"
            class="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white"
            @click="navigateTo(`/dashboard/lingkup/${lingkupDetail.id}/objek/create`)"
          >
            Tambah Objek
          </button>
        </div>
      </div>
    </article>

    <article
      v-if="props.mode === 'unit-create' || props.mode === 'unit-edit'"
      class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <p v-if="pageLoading" class="mb-3 text-sm text-slate-500">Memuat formulir unit...</p>
      <UnitForm :model-value="unitFormModel" @submit="handleSubmitUnit" />
    </article>

    <article
      v-if="props.mode === 'unit-detail'"
      class="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <p v-if="pageLoading" class="text-sm text-slate-500">Memuat detail unit...</p>
      <UnitTable v-else :rows="unitDetail ? [unitDetail] : []" />
      <div v-if="unitDetail" class="flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white"
          @click="navigateTo(`/dashboard/lingkup/${lingkupId}/unit/${unitDetail.id}/edit`)"
        >
          Edit Unit
        </button>
        <button
          type="button"
          class="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white"
          @click="navigateTo(`/dashboard/lingkup/${lingkupId}/unit/${unitDetail.id}/objek/create`)"
        >
          Tambah Objek Unit
        </button>
      </div>
    </article>

    <article
      v-if="props.mode === 'objek-create' || props.mode === 'objek-edit' || props.mode === 'unit-objek-create' || props.mode === 'unit-objek-edit'"
      class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <p v-if="pageLoading" class="mb-3 text-sm text-slate-500">Memuat formulir objek...</p>
      <ObjekForm :model-value="objekFormModel" @submit="handleSubmitObjek" />
    </article>

    <article
      v-if="props.mode === 'objek-detail' || props.mode === 'unit-objek-detail'"
      class="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <p v-if="pageLoading" class="text-sm text-slate-500">Memuat detail objek...</p>
      <ObjekTable v-else :rows="objekDetail ? [objekDetail] : []" />
      <div v-if="objekDetail" class="flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white"
          @click="navigateTo(toObjekDetailPath(lingkupId || '', objekDetail.id, isUnitScope ? unitId : null) + '/edit')"
        >
          Edit Objek
        </button>
      </div>
    </article>
  </section>
</template>
