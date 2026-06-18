<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from '#imports'
import { useBuktiApi } from '../services/bukti.api'
import { useFormSubmission } from '../composables/useFormSubmission'
import type { Fm01PageData, Fm01RouteContext } from '../types/form'
import Fm1AspekTable from './fm1/Fm1AspekTable.vue'
import Fm1BuktiList from './fm1/Fm1BuktiList.vue'
import Fm2AspekTable from './fm2/Fm2AspekTable.vue'
import Fm2BuktiList from './fm2/Fm2BuktiList.vue'
import Fm3AspekTable from './fm3/Fm3AspekTable.vue'
import Fm3BuktiList from './fm3/Fm3BuktiList.vue'
import Fm4AspekTable from './fm4/Fm4AspekTable.vue'
import Fm4BuktiList from './fm4/Fm4BuktiList.vue'
import Fm5AspekTable from './fm5/Fm5AspekTable.vue'
import Fm5BuktiList from './fm5/Fm5BuktiList.vue'
import Fm6AspekTable from './fm6/Fm6AspekTable.vue'
import Fm6BuktiList from './fm6/Fm6BuktiList.vue'
import Fm7AspekTable from './fm7/Fm7AspekTable.vue'
import Fm7BuktiList from './fm7/Fm7BuktiList.vue'

type FmCode = 'fm1' | 'fm2' | 'fm3' | 'fm4' | 'fm5' | 'fm6' | 'fm7'
type FmPageMode = 'dashboard' | 'aspek' | 'bukti' | 'objek'

const props = defineProps<{
  fmCode: FmCode
  mode: FmPageMode
}>()

const route = useRoute()
const submission = useFormSubmission('auto')
const buktiApi = useBuktiApi()

const pageData = ref<Fm01PageData | null>(null)
const buktiItems = ref<Array<{ id: string; label: string; href?: string }>>([])
const loading = ref(false)
const error = ref<string | null>(null)

const aspekTableMap = {
  fm1: Fm1AspekTable,
  fm2: Fm2AspekTable,
  fm3: Fm3AspekTable,
  fm4: Fm4AspekTable,
  fm5: Fm5AspekTable,
  fm6: Fm6AspekTable,
  fm7: Fm7AspekTable,
} as const

const buktiListMap = {
  fm1: Fm1BuktiList,
  fm2: Fm2BuktiList,
  fm3: Fm3BuktiList,
  fm4: Fm4BuktiList,
  fm5: Fm5BuktiList,
  fm6: Fm6BuktiList,
  fm7: Fm7BuktiList,
} as const

function normalizeRouteParam(value: string | string[] | undefined): string | null {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

const periodeModulId = computed(() =>
  normalizeRouteParam(route.params.periode_modul_id as string | string[] | undefined)
)

const unitId = computed(() =>
  normalizeRouteParam(route.params.unit_id as string | string[] | undefined)
)

const aspekId = computed(() =>
  normalizeRouteParam(route.params.aspek_id as string | string[] | undefined)
)

const objekId = computed(() =>
  normalizeRouteParam(route.params.objek_id as string | string[] | undefined)
)

const fmLabel = computed(() => props.fmCode.toUpperCase())

const title = computed(() => {
  if (props.mode === 'dashboard') return `Dashboard ${fmLabel.value}`
  if (props.mode === 'aspek') return `Detail Aspek ${fmLabel.value}`
  if (props.mode === 'objek') return `Detail Objek ${fmLabel.value}`
  return `Daftar Bukti ${fmLabel.value}`
})

const AspekTableComponent = computed(() => aspekTableMap[props.fmCode])
const BuktiListComponent = computed(() => buktiListMap[props.fmCode])

const selectedAspekId = computed(() => {
  if (aspekId.value) return aspekId.value
  return pageData.value?.activeAspectId ?? 'aspek-kesiapan-rps'
})

const selectedAspect = computed(() => {
  if (!pageData.value) return null
  return pageData.value.aspectDetails[selectedAspekId.value]
    ?? pageData.value.aspectDetails[pageData.value.activeAspectId]
    ?? null
})

const aspectRows = computed(() => {
  if (!pageData.value) return []

  return pageData.value.aspectOptions.map((item) => ({
    id: item.id,
    title: item.label,
    status: item.id === selectedAspekId.value ? 'aktif' : 'tersedia',
  }))
})

const resolvedBuktiItems = computed(() => {
  if (buktiItems.value.length > 0) return buktiItems.value

  const detail = selectedAspect.value
  if (!detail) return []

  return [
    {
      id: 'fallback-bukti-1',
      label: detail.document.title,
      href: detail.document.link,
    },
  ]
})

async function loadSubmissionData() {
  if (!periodeModulId.value || !unitId.value) {
    error.value = 'Parameter periode/unit tidak ditemukan pada route.'
    return
  }

  const context: Fm01RouteContext = {
    periodeModulId: periodeModulId.value,
    unitId: unitId.value,
    aspekId: selectedAspekId.value,
  }

  const data = await submission.getPageData(context)
  pageData.value = data
}

async function loadBuktiData() {
  if (!periodeModulId.value || !unitId.value) {
    error.value = 'Parameter periode/unit tidak ditemukan pada route.'
    return
  }

  const data = await buktiApi.listBukti(
    periodeModulId.value,
    unitId.value,
    props.fmCode
  )

  buktiItems.value = (data ?? []).map((item) => ({
    id: item.id,
    label: item.name,
    href: item.fileUrl,
  }))
}

onMounted(async () => {
  loading.value = true
  error.value = null

  await loadSubmissionData()

  if (props.mode === 'bukti') {
    await loadBuktiData()
  }

  loading.value = false
})
</script>

<template>
  <section class="mx-auto w-full max-w-5xl space-y-5 px-4 py-5 sm:px-6">
    <header class="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <h1 class="text-xl font-semibold text-slate-800">
        {{ title }}
      </h1>
      <p class="mt-1 text-sm text-slate-500">
        Periode: <strong>{{ periodeModulId || '-' }}</strong>,
        Unit: <strong>{{ unitId || '-' }}</strong>,
        Form: <strong>{{ fmLabel }}</strong>
      </p>
    </header>

    <p v-if="error" class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
      {{ error }}
    </p>

    <article class="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p v-if="loading" class="text-sm text-slate-500">
        Memuat data {{ fmLabel }}...
      </p>

      <template v-else>
        <div v-if="pageData" class="space-y-2 text-sm text-slate-700">
          <p><strong>Judul:</strong> {{ pageData.summary.title }}</p>
          <p><strong>Status:</strong> {{ pageData.summary.statusValue }}</p>
          <p><strong>Aspek Aktif:</strong> {{ selectedAspekId }}</p>
          <p v-if="props.mode === 'objek'"><strong>Objek ID:</strong> {{ objekId || '-' }}</p>
        </div>

        <component
          v-if="props.mode === 'dashboard' || props.mode === 'aspek' || props.mode === 'objek'"
          :is="AspekTableComponent"
          :rows="aspectRows"
        />

        <component
          v-if="props.mode === 'bukti'"
          :is="BuktiListComponent"
          :items="resolvedBuktiItems"
        />

        <div
          v-if="(props.mode === 'aspek' || props.mode === 'objek') && selectedAspect"
          class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
        >
          <p><strong>{{ selectedAspect.title }}</strong></p>
          <p class="mt-1">{{ selectedAspect.description }}</p>
        </div>
      </template>
    </article>
  </section>
</template>
