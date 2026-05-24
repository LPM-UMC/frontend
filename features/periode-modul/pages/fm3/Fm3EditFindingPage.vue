<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import {
  FM3_ACTIVE_DUMMY_ROLE,
  getFm3KaprodiEditFindingDummyData,
  type Fm3DummyRole,
} from '#features/periode-modul/data/fm3GkmfDummy'

const route = useRoute()
const activeDummyRole = ref<Fm3DummyRole>(FM3_ACTIVE_DUMMY_ROLE)
const inputLimit = 100

const form = reactive({
  title: '',
  aspectId: '',
  description: '',
  driveLink: '',
})

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

const isKaprodiMode = computed(() => activeDummyRole.value === 'kaprodi')

const editFindingData = computed(() =>
  getFm3KaprodiEditFindingDummyData({
    context: {
      periodeModulId: periodeModulId.value,
      unitId: unitId.value,
    },
    temuanId: temuanId.value,
  })
)

const titleCount = computed(() => form.title.length)
const aspectCount = computed(() => {
  const aspect = editFindingData.value.aspectOptions.find((option) => option.id === form.aspectId)
  return aspect?.label.length ?? 0
})
const descriptionCount = computed(() => form.description.length)

function buildDashboardRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm3`
}

function buildDetailRoute(): string {
  return `/dashboard/periode-modul/${encodeURIComponent(periodeModulId.value)}/unit/${encodeURIComponent(unitId.value)}/fm3/temuan/${encodeURIComponent(temuanId.value)}`
}

watch(
  editFindingData,
  (nextData) => {
    form.title = nextData.defaultValues.title
    form.aspectId = nextData.defaultValues.aspectId
    form.description = nextData.defaultValues.description
    form.driveLink = nextData.defaultValues.driveLink
  },
  { immediate: true }
)

async function handleCancel() {
  await navigateTo(buildDetailRoute())
}

async function handleSubmit() {
  const payload = {
    // TODO: replace with real API call
    // PATCH /api/periode-modul/{periodeModulId}/unit/{unitId}/fm3/temuan/{temuanId}
    context: editFindingData.value.context,
    temuanId: temuanId.value,
    role: activeDummyRole.value,
    title: form.title.trim(),
    aspectId: form.aspectId,
    description: form.description.trim(),
    driveLink: form.driveLink.trim(),
    submittedAt: new Date().toISOString(),
  }

  // Placeholder untuk integrasi backend pembaruan temuan.
  console.info('[fm3] edit finding payload', payload)
  await navigateTo(buildDashboardRoute())
}
</script>

<template>
  <section class="mx-auto w-full max-w-[1720px] space-y-5 px-4 pb-8 pt-4 md:space-y-6 md:px-5 xl:px-6">
    <template v-if="isKaprodiMode">
      <section class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] px-5 py-6 md:px-6 md:py-7">
        <h1 class="text-[clamp(1.75rem,2.8vw,2.75rem)] font-semibold leading-tight text-[#11141b]">
          {{ editFindingData.headerTitle }}
        </h1>
        <p class="mt-3 max-w-[1320px] text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-[#5b6679]">
          {{ editFindingData.headerDescription }}
        </p>
      </section>

      <section class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] px-5 py-6 md:px-6 md:py-7">
        <form
          class="mx-auto w-full max-w-[1050px] rounded-[24px] border-2 border-dashed border-[#d7dbe4] bg-[#f8f8f8] px-5 py-7 shadow-[0_6px_16px_rgba(15,23,42,0.12)] sm:px-8 md:px-10"
          @submit.prevent="handleSubmit"
        >
          <h2 class="text-center text-[clamp(1.5rem,2.2vw,2.1rem)] font-semibold text-[#151922]">
            {{ editFindingData.formTitle }}
          </h2>

          <div class="mt-7 space-y-5">
            <!-- Judul Temuan -->
            <div>
              <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
                {{ editFindingData.titleLabel }} <span class="text-[#e30000]">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                :maxlength="inputLimit"
                :placeholder="editFindingData.titlePlaceholder"
                class="mt-2 h-14 w-full rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5 text-[1.05rem] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
              >
              <p class="mt-2 flex items-center justify-between text-[0.95rem] text-[#98a1b1]">
                <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                <span class="font-semibold">{{ titleCount }}/100</span>
              </p>
            </div>

            <!-- Aspek Temuan -->
            <div>
              <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
                {{ editFindingData.aspectLabel }}
              </label>
              <label class="relative mt-2 block">
                <select
                  v-model="form.aspectId"
                  class="h-14 w-full appearance-none rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5 pr-11 text-[1.05rem] text-[#2e3846] outline-none"
                >
                  <option
                    v-for="option in editFindingData.aspectOptions"
                    :key="option.id"
                    :value="option.id"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#4b5565]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </label>
              <p class="mt-2 flex items-center justify-between text-[0.95rem] text-[#98a1b1]">
                <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                <span class="font-semibold">{{ aspectCount }}/100</span>
              </p>
            </div>

            <!-- Deskripsi Temuan -->
            <div>
              <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
                {{ editFindingData.descriptionLabel }}<span class="text-[#e30000]">*</span>
              </label>
              <textarea
                v-model="form.description"
                rows="5"
                :maxlength="inputLimit"
                :placeholder="editFindingData.descriptionPlaceholder"
                class="mt-2 w-full resize-y rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5 py-4 text-[1.05rem] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
              />
              <p class="mt-2 flex items-center justify-between text-[0.95rem] text-[#98a1b1]">
                <span>Maks. 100 karakter. Gunakan format konsisten.</span>
                <span class="font-semibold">{{ descriptionCount }}/100</span>
              </p>
            </div>

            <!-- Link Google Drive -->
            <div>
              <label class="block text-[1.05rem] font-semibold text-[#3f4b5f]">
                {{ editFindingData.driveLinkLabel }} <span class="text-[#e30000]">*</span>
              </label>
              <div class="relative mt-2">
                <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa3b3]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 0 0 0 5.656l.344.344a4 4 0 0 0 5.656-5.656l-1.5-1.5a4 4 0 0 0-5.656 0m-2.344 5.656a4 4 0 0 0 0-5.656l-.344-.344a4 4 0 0 0-5.656 5.656l1.5 1.5a4 4 0 0 0 5.656 0" />
                  </svg>
                </span>
                <input
                  v-model="form.driveLink"
                  type="url"
                  :placeholder="editFindingData.driveLinkPlaceholder"
                  class="h-14 w-full rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-12 text-[1.02rem] text-[#2e3846] outline-none placeholder:text-[#9aa3b3]"
                >
              </div>
              <p class="mt-3 inline-flex items-center gap-1.5 text-[0.95rem] text-[#6d7788]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#7f8a9c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="9" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0-9h.01" />
                </svg>
                <span>{{ editFindingData.driveLinkHelpLabel }}</span>
                <button type="button" class="font-semibold text-[#2a66de] underline-offset-2 hover:underline">
                  {{ editFindingData.driveLinkHelpLinkText }}
                </button>
              </p>
            </div>

            <!-- Catatan -->
            <div class="flex items-start gap-2.5 rounded-[14px] border border-[#f0a3a3] bg-[#fff3f3] px-4 py-3.5 text-[1rem] leading-relaxed text-[#c52222]">
              <svg xmlns="http://www.w3.org/2000/svg" class="mt-0.5 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01" />
              </svg>
              <p>
                <span class="font-semibold">Catatan:</span>
                {{ editFindingData.noteText }}
              </p>
            </div>

            <!-- Last saved -->
            <p class="inline-flex items-center gap-2 text-[0.95rem] text-[#98a1b1]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2" />
              </svg>
              Terakhir disimpan: {{ editFindingData.lastSavedAt }}
            </p>
          </div>

          <!-- Actions -->
          <div class="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              class="inline-flex h-12 min-w-[130px] items-center justify-center rounded-[16px] border border-[#d0d6df] bg-[#f6f6f7] px-6 text-[1rem] font-medium text-[#626d80] transition hover:bg-[#eceef2]"
              @click="handleCancel"
            >
              {{ editFindingData.cancelLabel }}
            </button>
            <button
              type="submit"
              class="inline-flex h-12 min-w-[150px] items-center justify-center rounded-[16px] bg-[#e30000] px-8 text-[1.05rem] font-semibold text-white shadow-[0_10px_20px_rgba(227,0,0,0.2)] transition hover:bg-[#ca0000]"
            >
              {{ editFindingData.submitLabel }}
            </button>
          </div>
        </form>
      </section>
    </template>

    <section
      v-else
      class="rounded-2xl border border-[#d5d8dd] bg-[#efefef] p-5 text-[#3e4a5e]"
    >
      <h2 class="text-[1.35rem] font-semibold text-[#121826]">Mode Role Belum Aktif</h2>
      <p class="mt-2 text-[1rem] leading-relaxed">
        Tampilan saat ini disiapkan untuk role <strong>kaprodi</strong>. Untuk simulasi role lain, ubah nilai
        <code class="rounded bg-white px-1.5 py-0.5 text-[0.9rem]">activeDummyRole</code>
        pada file ini secara manual.
      </p>
    </section>
  </section>
</template>
