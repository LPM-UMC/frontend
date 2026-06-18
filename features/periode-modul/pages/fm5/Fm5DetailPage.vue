<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from '#imports'
import { useFm5GkmfRepository } from '../../composables/useFm5GkmfRepository'
import {
  FM5_ACTIVE_DUMMY_ROLE,
  isFm5ReviewRole,
  type Fm5DashboardContext,
  type Fm5DetailDummyData,
  type Fm5DummyRole,
  type Fm5SignatureStepStatus,
} from '../../data/fm5GkmfDummy'

const route = useRoute()
const repository = useFm5GkmfRepository('auto')

const activeDummyRole = ref<Fm5DummyRole>(FM5_ACTIVE_DUMMY_ROLE)
const detailData = ref<Fm5DetailDummyData | null>(null)
const loading = ref(true)
const isSanggahModalOpen = ref(false)
const sanggahMessage = ref('')

function normalizeRouteParam(value: string | string[] | undefined, fallbackValue: string): string {
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

const beritaAcaraId = computed(() =>
  normalizeRouteParam(
    route.params.berita_acara_id as string | string[] | undefined,
    'ba-fm5-001'
  )
)

const context = computed<Fm5DashboardContext>(() => ({
  periodeModulId: periodeModulId.value,
  unitId: unitId.value,
}))

const isReviewRole = computed(() => isFm5ReviewRole(activeDummyRole.value))
const shouldShowDocument = computed(() => detailData.value?.showDocument ?? false)

function resolveFlowIconClass(status: Fm5SignatureStepStatus): string {
  if (status === 'done') return 'border-[#19b45a] text-[#19b45a]'
  if (status === 'active') return 'border-[#e30000] text-[#e30000]'
  return 'border-[#a5afbd] text-[#a5afbd]'
}

async function handleSign() {
  await repository.signBeritaAcara(context.value, beritaAcaraId.value)
}

function openSanggahModal() {
  if (!detailData.value) return
  sanggahMessage.value = detailData.value.sanggahanForm.defaultMessage
  isSanggahModalOpen.value = true
}

function closeSanggahModal() {
  isSanggahModalOpen.value = false
}

async function submitSanggahan() {
  await repository.submitSanggahan(context.value, beritaAcaraId.value, {
    message: sanggahMessage.value.trim(),
  })
  closeSanggahModal()
}

watch(
  [context, beritaAcaraId, activeDummyRole],
  async ([nextContext, nextId, nextRole]) => {
    loading.value = true
    detailData.value = await repository.getDetailData(nextContext, nextId, nextRole)
    loading.value = false
  },
  { immediate: true }
)
</script>

<template>
  <section class="fm5-page mx-auto w-full max-w-[1600px] space-y-4 px-4 pb-7 pt-4 md:space-y-5 md:px-5 2xl:max-w-[1720px] xl:px-6">
    <section
      v-if="detailData"
      class="rounded-[16px] border border-[#d8dce2] bg-[#efefef] px-5 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-6 md:py-6"
    >
      <h1 class="text-[clamp(1.55rem,2.05vw,2.45rem)] font-semibold leading-tight text-[#10131b]">
        {{ detailData.headerTitle }}
      </h1>
      <p class="mt-3 max-w-[1400px] text-[clamp(0.95rem,1.02vw,1.25rem)] leading-relaxed text-[#5b6679]">
        {{ detailData.headerDescription }}
      </p>
    </section>

    <section
      v-if="detailData && shouldShowDocument"
      class="space-y-4"
    >
      <article
        class="px-4 py-7 sm:px-5 md:px-7 md:py-8"
        :class="isReviewRole
          ? 'rounded-[24px] border-[3px] border-[#11141b] bg-white'
          : 'rounded-[16px] border border-[#d8dce2] bg-[#efefef] shadow-[0_2px_6px_rgba(15,23,42,0.1)]'"
      >
        <header class="text-center text-[#2c3748]">
          <h2 class="text-[clamp(1.5rem,1.9vw,2.2rem)] font-semibold">
            {{ detailData.document.heading }}
          </h2>
          <div class="mx-auto mt-2 h-[4px] w-[112px] rounded-full bg-[#2f394a]" />
          <p
            v-for="line in detailData.document.subHeadingLines"
            :key="line"
            class="mx-auto mt-2 max-w-[980px] text-[clamp(1rem,1.08vw,1.3rem)] leading-relaxed"
            :class="line === detailData.document.subHeadingLines[0] ? 'font-semibold' : ''"
          >
            {{ line }}
          </p>
        </header>

        <div class="mt-7 space-y-4 text-[clamp(0.95rem,1vw,1.15rem)] leading-relaxed text-[#3c4759]">
          <p
            v-for="(line, index) in detailData.document.bodyLines"
            :key="`${index}-${line}`"
          >
            {{ line }}
          </p>
        </div>

        <div class="mt-7 grid gap-5 md:grid-cols-2 md:gap-8">
          <div class="space-y-3 text-center text-[#3e4a5f]">
            <p class="text-[clamp(0.95rem,1vw,1.1rem)]">{{ detailData.topLeftSignature.heading }}</p>
            <p class="text-[clamp(0.95rem,1vw,1.1rem)]">{{ detailData.topLeftSignature.roleLine }}</p>
            <p
              v-if="detailData.topLeftSignature.signatureText"
              class="mt-2 text-[clamp(1.75rem,2.2vw,2.45rem)] italic leading-none text-[#0f172a]"
              style="font-family: cursive;"
            >
              {{ detailData.topLeftSignature.signatureText }}
            </p>
          </div>

          <div class="space-y-3 text-center text-[#3e4a5f]">
            <p class="text-[clamp(0.95rem,1vw,1.1rem)]">{{ detailData.topRightSignature.heading }}</p>
            <p class="text-[clamp(0.95rem,1vw,1.1rem)]">{{ detailData.topRightSignature.roleLine }}</p>
          </div>
        </div>

        <div class="mt-6 border-t border-[#d8dde6] pt-6">
          <div class="grid gap-6 md:grid-cols-2 md:gap-10">
            <p class="text-center text-[clamp(0.95rem,1vw,1.1rem)] text-[#3e4a5f]">
              {{ detailData.topLeftSignature.nameLine }}
            </p>
            <p class="text-center text-[clamp(0.95rem,1vw,1.1rem)] text-[#3e4a5f]">
              {{ detailData.topRightSignature.nameLine }}
            </p>
          </div>
        </div>

        <div class="mt-8 grid gap-6 md:grid-cols-2 md:gap-8">
          <div class="space-y-3 text-center text-[#3e4a5f]">
            <p class="whitespace-pre-line text-[clamp(0.95rem,1vw,1.1rem)]">{{ detailData.bottomLeftSignature.heading }}</p>
            <p class="text-[clamp(0.95rem,1vw,1.1rem)]">{{ detailData.bottomLeftSignature.roleLine }}</p>
          </div>
          <div class="space-y-3 text-center text-[#3e4a5f]">
            <p class="whitespace-pre-line text-[clamp(0.95rem,1vw,1.1rem)]">{{ detailData.bottomRightSignature.heading }}</p>
            <p class="text-[clamp(0.95rem,1vw,1.1rem)]">{{ detailData.bottomRightSignature.roleLine }}</p>
          </div>
        </div>

        <div class="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
          <p class="text-center text-[clamp(0.95rem,1vw,1.1rem)] text-[#3e4a5f]">{{ detailData.bottomLeftSignature.nameLine }}</p>
          <p class="text-center text-[clamp(0.95rem,1vw,1.1rem)] text-[#3e4a5f]">{{ detailData.bottomRightSignature.nameLine }}</p>
        </div>
      </article>

      <template v-if="isReviewRole">
        <article class="rounded-[20px] border border-[#d8dce2] bg-[#efefef] px-5 py-5 shadow-[0_2px_6px_rgba(15,23,42,0.1)] md:px-7 md:py-6">
          <h3 class="text-[clamp(1.3rem,1.55vw,1.8rem)] font-semibold text-[#1a2233]">
            {{ detailData.signFlowTitle }}
          </h3>

          <div class="mt-5 space-y-4">
            <article
              v-for="item in detailData.signatureFlow"
              :key="item.id"
              class="flex items-start gap-3"
            >
              <span
                class="inline-flex h-8 w-8 items-center justify-center rounded-full border-2"
                :class="resolveFlowIconClass(item.status)"
              >
                <svg
                  v-if="item.status === 'done'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.4"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m5 13 4 4L19 7" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.2"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2" />
                </svg>
              </span>

              <div>
                <p class="text-[clamp(0.98rem,1.05vw,1.12rem)] text-[#1f2937]">
                  {{ item.roleName }}
                </p>
                <p class="text-[clamp(0.86rem,0.95vw,0.98rem)] text-[#6b7280]">
                  {{ item.description }}
                </p>
              </div>
            </article>
          </div>

          <div class="mt-7 border-t border-[#dfe3eb] pt-5">
            <p class="text-[clamp(1.08rem,1.18vw,1.3rem)] font-semibold text-[#1f2b3d]">
              {{ detailData.attachmentsTitle }}
            </p>
            <div class="mt-4 flex flex-wrap gap-3">
              <button
                v-for="attachment in detailData.attachments"
                :key="attachment.id"
                type="button"
                class="inline-flex h-[44px] min-w-[200px] items-center justify-center rounded-[14px] bg-[#e30000] px-5 text-[clamp(0.95rem,1vw,1.08rem)] font-semibold text-white transition hover:bg-[#ca0000] md:h-[48px] md:min-w-[230px] md:rounded-[16px] md:px-6"
              >
                {{ attachment.label }}
              </button>
            </div>
          </div>
        </article>

        <div class="border-t border-[#d8dde6] pt-6">
          <div class="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              class="inline-flex h-[48px] min-w-[176px] items-center justify-center rounded-[14px] bg-[#e30000] px-6 text-[clamp(0.95rem,1vw,1.12rem)] font-semibold text-white transition hover:bg-[#ca0000] md:h-[52px] md:min-w-[210px] md:rounded-[18px] md:px-8"
              @click="handleSign"
            >
              {{ detailData.actions.primary }}
            </button>
            <button
              type="button"
              class="inline-flex h-[48px] min-w-[150px] items-center justify-center rounded-[14px] border border-[#c7ced9] bg-white px-6 text-[clamp(0.95rem,1vw,1.12rem)] font-semibold text-[#3e4a5e] transition hover:bg-[#f6f8fb] md:h-[52px] md:min-w-[170px] md:rounded-[18px] md:px-8"
              @click="openSanggahModal"
            >
              {{ detailData.actions.secondary }}
            </button>
          </div>
        </div>
      </template>
    </section>

    <section
      v-if="detailData && !shouldShowDocument"
      class="min-h-[64vh] rounded-[16px] border border-[#d8dce2] bg-[#efefef]"
    />

    <section v-if="loading" class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]">
      Memuat detail FM5...
    </section>

    <div
      v-if="detailData && isReviewRole && isSanggahModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4"
    >
      <article class="w-full max-w-[1280px] rounded-[18px] border border-[#d0d6de] bg-[#f0f0f0] p-5 shadow-[0_16px_34px_rgba(15,23,42,0.28)] md:rounded-[20px] md:p-7">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-[clamp(1.2rem,1.5vw,1.75rem)] font-semibold text-[#354257]">
            {{ detailData.sanggahanForm.title }}
          </h3>
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#566175] transition hover:bg-white/70"
            @click="closeSanggahModal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <textarea
          v-model="sanggahMessage"
          rows="5"
          class="mt-5 w-full rounded-[14px] border border-[#c7ced8] bg-[#f7f7f8] px-4 py-4 text-[clamp(0.95rem,1.02vw,1.15rem)] leading-relaxed text-[#151b27] outline-none md:rounded-[16px] md:px-5 md:py-5"
        />

        <button
          type="button"
          class="mt-5 inline-flex h-[48px] w-full items-center justify-center rounded-[14px] bg-[#e30000] px-6 text-[clamp(1rem,1.15vw,1.3rem)] font-semibold text-white transition hover:bg-[#ca0000] md:h-[52px] md:rounded-[16px] md:px-8"
          @click="submitSanggahan"
        >
          {{ detailData.sanggahanForm.submitLabel }}
        </button>
      </article>
    </div>
  </section>
</template>
