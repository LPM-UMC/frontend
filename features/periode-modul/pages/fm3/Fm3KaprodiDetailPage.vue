<script setup lang="ts">
import { computed, ref } from 'vue'
import { navigateTo, useRoute } from '#imports'
import {
  FM3_ACTIVE_DUMMY_ROLE,
  getFm3KaprodiDetailDummyData,
  type Fm3DummyRole,
} from '#features/periode-modul/data/fm3GkmfDummy'

const route = useRoute()
const activeDummyRole = ref<Fm3DummyRole>(FM3_ACTIVE_DUMMY_ROLE)

function normalizeRouteParam(
  value: string | string[] | undefined,
  fallbackValue: string
): string {
  if (!value) return fallbackValue
  if (Array.isArray(value)) return value[0] ?? fallbackValue
  return value
}

const periodeModulId = computed(() =>
  normalizeRouteParam(
    route.params.periode_modul_id as string | string[] | undefined,
    'pm-2026-genap'
  )
)

const unitId = computed(() =>
  normalizeRouteParam(
    route.params.unit_id as string | string[] | undefined,
    'unit-tif'
  )
)

const temuanId = computed(() =>
  normalizeRouteParam(
    route.params.temuan_id as string | string[] | undefined,
    '86331c8c-2157-49e0-b67b-dcceebcd2b9c'
  )
)

// Kaprodi can view detail; dekan / lpm / wr1 can also view (read-only)
const isViewMode = computed(() =>
  ['kaprodi', 'dekan', 'lpm', 'wr1'].includes(activeDummyRole.value)
)

const detailData = computed(() =>
  getFm3KaprodiDetailDummyData({
    context: {
      periodeModulId: periodeModulId.value,
      unitId: unitId.value,
    },
    temuanId: temuanId.value,
  })
)

const validationStatusBorderColor = computed(() => {
  const s = detailData.value.validationResult.status
  if (s === 'validated') return '#22c55e'
  if (s === 'rejected') return '#e30000'
  return '#f59e0b'
})

function buildDashboardRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm3`
}

function buildEditRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm3/temuan/${encodeURIComponent(temuanId.value)}/edit`
}

async function handleBack() {
  await navigateTo(buildDashboardRoute())
}

async function handleEdit() {
  await navigateTo(buildEditRoute())
}
</script>

<template>
  <section class="mx-auto w-full max-w-[1720px] space-y-5 px-4 pb-8 pt-4 md:space-y-6 md:px-5 xl:px-6">
    <template v-if="isViewMode">
      <!-- Header -->
      <section class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] px-5 py-6 md:px-6 md:py-7">
        <h1 class="text-[clamp(1.75rem,2.8vw,2.75rem)] font-semibold leading-tight text-[#11141b]">
          {{ detailData.headerTitle }}
        </h1>
        <p class="mt-3 max-w-[1320px] text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-[#5b6679]">
          {{ detailData.headerDescription }}
        </p>
      </section>

      <!-- Detail Temuan Card -->
      <section class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] px-5 py-6 md:px-6 md:py-7">
        <article class="rounded-[18px] border border-[#d7dce4] bg-[#f8f8f8] p-5 md:p-6">
          <h2 class="text-[clamp(1.6rem,2.4vw,2.4rem)] font-semibold text-[#11141b]">
            Detail Temuan
          </h2>

          <!-- Info grid -->
          <div class="mt-5 grid gap-y-4 md:grid-cols-[minmax(210px,0.8fr)_minmax(0,2fr)] md:gap-x-8">
            <p class="text-[1.05rem] font-semibold text-[#6a7384]">ID Temuan</p>
            <p class="break-all text-[1.05rem] text-[#283143]">{{ detailData.id }}</p>

            <p class="text-[1.05rem] font-semibold text-[#6a7384]">Penangguang Jawab</p>
            <p class="text-[1.05rem] text-[#283143]">{{ detailData.responsiblePerson }}</p>

            <p class="text-[1.05rem] font-semibold text-[#6a7384]">Judul Temuan</p>
            <p class="text-[1.05rem] text-[#283143]">{{ detailData.title }}</p>

            <p class="text-[1.05rem] font-semibold text-[#6a7384]">Tanggal Dibuat</p>
            <p class="text-[1.05rem] text-[#283143]">{{ detailData.createdAt }}</p>

            <p class="text-[1.05rem] font-semibold text-[#6a7384]">Evaluator</p>
            <p class="text-[1.05rem] text-[#283143]">{{ detailData.evaluator }}</p>

            <p class="text-[1.05rem] font-semibold text-[#6a7384]">Nama Aspek</p>
            <p class="text-[1.05rem] text-[#283143]">{{ detailData.aspectName }}</p>
          </div>

          <!-- Catatan Temuan -->
          <div class="mt-6">
            <p class="inline-flex items-center gap-2 text-[0.95rem] font-semibold uppercase tracking-[0.06em] text-[#95a0b2]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h8M8 14h5m-7 6 3.6-3.6a2 2 0 0 1 1.4-.6H18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h0Z" />
              </svg>
              {{ detailData.noteLabel }}
            </p>

            <div class="mt-2 rounded-[14px] border border-[#efc24d] bg-[#fffbe9] px-4 py-4 text-[1rem] italic leading-relaxed text-[#475265]">
              {{ detailData.noteText }}
            </div>
          </div>
        </article>

        <!-- Hasil Validasi Card -->
        <article class="mt-5 rounded-[18px] border border-[#d7dce4] bg-[#f8f8f8] p-5 md:p-6">
          <h2 class="text-[clamp(1.6rem,2.4vw,2.4rem)] font-semibold text-[#11141b]">
            {{ detailData.validationResultLabel }}
          </h2>

          <!-- Validation result block -->
          <div
            class="mt-5 rounded-[14px] border-l-4 bg-[#f4fef7] px-4 py-4"
            :style="{ borderColor: validationStatusBorderColor }"
          >
            <div class="flex items-center gap-3">
              <!-- Status icon circle -->
              <span
                class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                :style="{ backgroundColor: validationStatusBorderColor }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 5 5L20 7" />
                </svg>
              </span>

              <div class="flex flex-wrap items-center gap-2">
                <p class="text-[1.05rem] font-semibold text-[#1a2234]">Status Hasil Validasi</p>
                <span
                  class="inline-flex items-center rounded-full px-3 py-0.5 text-[0.88rem] font-semibold"
                  :class="detailData.validationResult.statusBadgeClass"
                >
                  {{ detailData.validationResult.statusLabel }}
                </span>
              </div>
            </div>

            <div class="mt-3 space-y-0.5 pl-12 text-[1rem] text-[#3d4a5c]">
              <p><span class="font-semibold">Oleh</span>&nbsp;&nbsp;&nbsp;: {{ detailData.validationResult.validatedBy }}</p>
              <p><span class="font-semibold">Waktu</span>&nbsp;: {{ detailData.validationResult.validatedDate }}</p>
              <p><span class="font-semibold">Pukul</span>&nbsp;&nbsp;: {{ detailData.validationResult.validatedTime }}</p>
            </div>

            <p class="mt-4 pl-12 text-[1rem] leading-relaxed text-[#4a5568]">
              {{ detailData.validationResult.validatorNote }}
            </p>
          </div>
        </article>

        <!-- Action buttons -->
        <div class="mt-5 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            class="rounded-[16px] border border-[#d0d6df] bg-[#f6f6f7] px-8 py-2.5 text-[1rem] font-medium text-[#626d80] transition hover:bg-[#eceef2]"
            @click="handleBack"
          >
            Kembali
          </button>
          <button
            v-if="activeDummyRole === 'kaprodi'"
            type="button"
            class="rounded-[16px] bg-[#e30000] px-8 py-2.5 text-[1rem] font-semibold text-white transition hover:bg-[#ca0000]"
            @click="handleEdit"
          >
            Edit Temuan
          </button>
        </div>
      </section>
    </template>

    <section
      v-else
      class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]"
    >
      <h2 class="text-[1.35rem] font-semibold text-[#121826]">Mode Role Belum Aktif</h2>
      <p class="mt-2 text-[1rem] leading-relaxed">
        Tampilan ini tersedia untuk role <strong>kaprodi</strong>, <strong>dekan</strong>, <strong>lpm</strong>, dan <strong>wr1</strong>. Untuk simulasi role lain, ubah nilai
        <code class="rounded bg-white px-1.5 py-0.5 text-[0.9rem]">activeDummyRole</code>
        pada file ini secara manual.
      </p>
    </section>
  </section>
</template>
