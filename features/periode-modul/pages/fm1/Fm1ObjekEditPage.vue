<script setup lang="ts">
import { computed } from 'vue'
import { navigateTo, useRoute } from '#imports'
import Fm1ObjekFormCard from '#features/periode-modul/components/fm1/Fm1ObjekFormCard.vue'

interface Fm1ObjekFormValues {
  name: string
  address: string
  personInCharge: string
}

const route = useRoute()

const defaultFormValues: Fm1ObjekFormValues = {
  name: 'Nama Mitra Lorem Ipsum',
  address: 'Jl Lorem Ipsum',
  personInCharge: 'Nama Penanggung Jawab',
}

const formPresetByObjekId: Record<string, Fm1ObjekFormValues> = {
  mitra: {
    name: 'Nama Mitra Lorem Ipsum',
    address: 'Jl Lorem Ipsum',
    personInCharge: 'Nama Penanggung Jawab Mitra',
  },
  'mata-kuliah': {
    name: 'Nama Mata Kuliah',
    address: 'Gedung Fakultas, Lantai 2',
    personInCharge: 'Koordinator Mata Kuliah',
  },
}

function normalizeRouteParam(value: string | string[] | undefined): string | null {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

const routePeriodeModulId = computed(() =>
  normalizeRouteParam(route.params.periode_modul_id as string | string[] | undefined)
)

const routeUnitId = computed(() =>
  normalizeRouteParam(route.params.unit_id as string | string[] | undefined)
)

const routeObjekId = computed(() =>
  normalizeRouteParam(route.params.objek_id as string | string[] | undefined) ?? 'mitra'
)

const initialValues = computed(() => {
  return formPresetByObjekId[routeObjekId.value] ?? defaultFormValues
})

function buildObjekDetailPath(objekId: string): string | null {
  if (!routePeriodeModulId.value || !routeUnitId.value) return null

  return `/dashboard/periode-modul/${encodeURIComponent(routePeriodeModulId.value)}/unit/${encodeURIComponent(routeUnitId.value)}/fm1/objek/${encodeURIComponent(objekId)}`
}

async function handleEdit() {
  const targetPath = buildObjekDetailPath(routeObjekId.value)
  if (!targetPath) return

  await navigateTo(targetPath)
}
</script>

<template>
  <section class="mx-auto w-full max-w-[1120px] px-2.5 pb-4 pt-3.5 sm:px-3.5 sm:pb-5 md:px-4.5 lg:px-5">
    <article class="rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8] px-4 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.06)] sm:px-6 sm:py-7 lg:px-7 lg:py-8">
      <h1 class="text-[26px] font-semibold leading-[1.12] text-[#111827] sm:text-[32px]">
        Edit Objek Evaluasi
      </h1>
      <p class="mt-3 text-[16px] text-[#556175] sm:text-[20px]">
        Loremipsun
      </p>
    </article>

    <div class="mt-3.5">
      <Fm1ObjekFormCard
        section-title="Edit Objek Evaluasi"
        form-title="Form Edit Objek Evaluasi"
        submit-label="Edit"
        :initial-values="initialValues"
        @submit="handleEdit"
      />
    </div>
  </section>
</template>
