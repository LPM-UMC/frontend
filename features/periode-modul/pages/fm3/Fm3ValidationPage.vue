<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import {
  FM3_ACTIVE_DUMMY_ROLE,
  getFm3GkmfValidationDetailDummyData,
  type Fm3DummyRole,
  type Fm3ValidationDecisionOption,
} from '#features/periode-modul/data/fm3GkmfDummy'

const route = useRoute()
const activeDummyRole = ref<Fm3DummyRole>(FM3_ACTIVE_DUMMY_ROLE)

const selectedDecision = ref<'approve' | 'reject' | null>(null)
const evaluatorNote = ref('')

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

const isGkmfMode = computed(() => activeDummyRole.value === 'gkmf')

const validationData = computed(() =>
  getFm3GkmfValidationDetailDummyData({
    context: {
      periodeModulId: periodeModulId.value,
      unitId: unitId.value,
    },
    temuanId: temuanId.value,
  })
)

const canSubmitValidation = computed(() => selectedDecision.value !== null)

function buildPendingRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm3/temuan/belum-divalidasi`
}

watch(
  validationData,
  (nextData) => {
    selectedDecision.value = nextData.defaultDecision
    evaluatorNote.value = nextData.defaultEvaluatorNote
  },
  { immediate: true }
)

function isDecisionSelected(option: Fm3ValidationDecisionOption): boolean {
  return selectedDecision.value === option.id
}

async function handleBack() {
  await navigateTo(buildPendingRoute())
}

async function handleSaveValidation() {
  if (!selectedDecision.value) return

  const payload = {
    temuanId: validationData.value.id,
    decision: selectedDecision.value,
    evaluatorNote: evaluatorNote.value.trim(),
    submittedAt: new Date().toISOString(),
    role: activeDummyRole.value,
  }

  // Placeholder integrasi backend.
  console.info('[fm3] submit validation payload', payload)
  await navigateTo(buildPendingRoute())
}
</script>

<template>
  <section class="mx-auto w-full max-w-[1720px] space-y-5 px-4 pb-8 pt-4 md:space-y-6 md:px-5 xl:px-6">
    <template v-if="isGkmfMode">
      <section class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] px-5 py-6 md:px-6 md:py-7">
        <h1 class="text-[clamp(2rem,3vw,2.75rem)] font-semibold leading-tight text-[#11141b]">
          {{ validationData.headerTitle }}
        </h1>
        <p class="mt-3 max-w-[1320px] text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-[#5b6679]">
          {{ validationData.headerDescription }}
        </p>
      </section>

      <section class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] px-5 py-6 md:px-6 md:py-7">
        <article class="rounded-[18px] border border-[#d7dce4] bg-[#f8f8f8] p-5 md:p-6">
          <h2 class="text-[clamp(2rem,2.7vw,2.65rem)] font-semibold text-[#11141b]">Detail Temuan</h2>

          <div class="mt-5 grid gap-4 md:grid-cols-[minmax(210px,0.8fr)_minmax(0,2fr)] md:gap-x-8">
            <p class="text-[1.05rem] font-semibold text-[#6a7384]">ID Temuan</p>
            <p class="text-[1.15rem] text-[#283143]">{{ validationData.id }}</p>

            <p class="text-[1.05rem] font-semibold text-[#6a7384]">Penanggung Jawab</p>
            <p class="text-[1.15rem] text-[#283143]">{{ validationData.responsiblePerson }}</p>

            <p class="text-[1.05rem] font-semibold text-[#6a7384]">Judul Temuan</p>
            <p class="text-[1.15rem] text-[#283143]">{{ validationData.title }}</p>

            <p class="text-[1.05rem] font-semibold text-[#6a7384]">Tanggal Dibuat</p>
            <p class="text-[1.15rem] text-[#283143]">{{ validationData.createdAt }}</p>

            <p class="text-[1.05rem] font-semibold text-[#6a7384]">Evaluator</p>
            <p class="text-[1.15rem] text-[#283143]">{{ validationData.evaluator }}</p>

            <p class="text-[1.05rem] font-semibold text-[#6a7384]">Nama Aspek</p>
            <p class="text-[1.15rem] text-[#283143]">{{ validationData.aspectName }}</p>
          </div>

          <div class="mt-6">
            <p class="inline-flex items-center gap-2 text-[1.05rem] font-semibold uppercase tracking-[0.02em] text-[#95a0b2]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#95a0b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h8M8 14h5m-7 6 3.6-3.6a2 2 0 0 1 1.4-.6H18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h0Z" />
              </svg>
              {{ validationData.noteLabel }}
            </p>

            <div class="mt-2 rounded-[14px] border border-[#efc24d] bg-[#fffbe9] px-4 py-4 text-[1.1rem] italic leading-relaxed text-[#475265]">
              {{ validationData.noteText }}
            </div>
          </div>
        </article>

        <article class="mt-5 rounded-[18px] border border-[#d7dce4] bg-[#f8f8f8] p-5 md:p-6">
          <h3 class="text-[clamp(2rem,2.7vw,2.65rem)] font-semibold text-[#11141b]">Keputusan Validasi</h3>

          <div class="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            <button
              v-for="option in validationData.decisionOptions"
              :key="option.id"
              type="button"
              class="flex items-center justify-between rounded-[14px] border px-4 py-3 text-left transition"
              :class="isDecisionSelected(option) ? 'border-[#e30000] bg-[#fff4f4]' : 'border-[#d8dde4] bg-white hover:bg-[#fafbfc]'"
              @click="selectedDecision = option.id"
            >
              <span>
                <span class="block text-[1.2rem] font-semibold text-[#172033]">{{ option.label }}</span>
                <span class="mt-0.5 block text-[1rem] text-[#647083]">{{ option.description }}</span>
              </span>

              <span
                class="inline-flex h-8 w-8 items-center justify-center rounded-full border"
                :class="isDecisionSelected(option) ? 'border-[#e30000] bg-[#e30000] text-white' : 'border-[#9ea8b8] text-transparent'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 5 5L20 7" />
                </svg>
              </span>
            </button>
          </div>

          <div class="mt-6">
            <h4 class="text-[clamp(1.6rem,2vw,2rem)] font-semibold text-[#11141b]">Catatan Evaluator</h4>

            <label class="mt-3 block rounded-[14px] border border-[#d3d9e2] bg-white p-4">
              <div class="flex items-start gap-3">
                <span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8edf4] text-[#7d8798]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.971 2.972L7.5 19.792 3 21l1.209-4.5 12.653-12.013Z" />
                  </svg>
                </span>

                <div class="min-w-0 flex-1">
                  <p class="text-[1.25rem] font-semibold text-[#1a2234]">Tinggalkan Catatan</p>
                  <textarea
                    v-model="evaluatorNote"
                    rows="5"
                    placeholder="Berikan alasan atau catatan ..."
                    class="mt-2 w-full resize-y rounded-[12px] border border-[#d2d8e2] bg-[#f9f9fa] px-4 py-3 text-[1rem] text-[#2f3949] outline-none placeholder:text-[#97a0af]"
                  />
                </div>
              </div>
            </label>
          </div>
        </article>

        <div class="mt-5 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            class="rounded-[16px] border border-[#d0d6df] bg-[#f6f6f7] px-8 py-2.5 text-[1rem] font-medium text-[#626d80] transition hover:bg-[#eceef2]"
            @click="handleBack"
          >
            Kembali
          </button>
          <button
            type="button"
            class="rounded-[16px] bg-[#e30000] px-8 py-2.5 text-[1rem] font-semibold text-white transition hover:bg-[#ca0000] disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!canSubmitValidation"
            @click="handleSaveValidation"
          >
            Simpan Hasil Validasi
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
        Tampilan saat ini disiapkan untuk role <strong>gkmf</strong>. Untuk simulasi role lain, ubah nilai
        <code class="rounded bg-white px-1.5 py-0.5 text-[0.9rem]">activeDummyRole</code>
        pada file ini secara manual.
      </p>
    </section>
  </section>
</template>
