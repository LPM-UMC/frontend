<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import FmSidebar from '~/components/layout/FmSidebar.vue'
import { getDashboardDummyUser } from '#features/dashboard/data/dashboardDummy'
import { useDashboardRepository } from '#features/dashboard/composables/useDashboardRepository'
import type { DashboardLocale, DashboardUser } from '#features/dashboard/types/dashboard'

interface FmMenuItem {
  id: string
  label: string
  to?: string
}

const route = useRoute()
const { locale, setLocale } = useI18n()
const repository = useDashboardRepository('auto')

const user = ref<DashboardUser>(getDashboardDummyUser())
const isLocaleMenuOpen = ref(false)
const isSidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)
const localeMenuRef = ref<HTMLElement | null>(null)

const localeOptions: Array<{ code: DashboardLocale; label: string }> = [
  { code: 'en', label: 'ENG' },
  { code: 'id', label: 'ID' },
]

const activeLocaleLabel = computed(() =>
  locale.value === 'en' ? 'ENG' : 'ID'
)

const routePeriodeModulId = computed(() => {
  const param = route.params.periode_modul_id
  if (!param) return null
  if (Array.isArray(param)) return param[0] ?? null
  return param
})

const routeUnitId = computed(() => {
  const param = route.params.unit_id
  if (!param) return null
  if (Array.isArray(param)) return param[0] ?? null
  return param
})

const activeMenuId = computed(() => {
  const fmMatch = route.path.match(/\/(fm[1-7])(?:\/|$)/i)
  if (fmMatch?.[1]) return fmMatch[1].toLowerCase()
  return 'dashboard-utama'
})

const fmMenus = computed<FmMenuItem[]>(() => {
  const periodeId = routePeriodeModulId.value
  const unitId = routeUnitId.value

  const fallbackPath = '/dashboard/monev'
  const buildFmPath = (fmCode: string) => {
    if (!periodeId || !unitId) return fallbackPath
    return `/dashboard/periode-modul/${encodeURIComponent(periodeId)}/unit/${encodeURIComponent(unitId)}/${fmCode}`
  }

  return [
    {
      id: 'dashboard-utama',
      label: 'Dashboard Utama',
      to: '/dashboard',
    },
    {
      id: 'fm1',
      label: 'FM01. Lingkup Evaluasi',
      to: buildFmPath('fm1'),
    },
    {
      id: 'fm2',
      label: 'FM02. Monitoring',
      to: buildFmPath('fm2'),
    },
    {
      id: 'fm3',
      label: 'FM03. Monitoring',
      to: buildFmPath('fm3'),
    },
    {
      id: 'fm4',
      label: 'FM04. Monitoring',
      to: buildFmPath('fm4'),
    },
    {
      id: 'fm5',
      label: 'FM05. Monitoring',
      to: buildFmPath('fm5'),
    },
    {
      id: 'fm6',
      label: 'FM06. Monitoring',
      to: buildFmPath('fm6'),
    },
    {
      id: 'fm7',
      label: 'FM07. Monitoring',
      to: buildFmPath('fm7'),
    },
  ]
})

const sidebarProfile = computed(() => ({
  name: user.value.name,
  role: user.value.role,
  avatar: user.value.avatar,
}))

function toggleLocaleMenu() {
  isLocaleMenuOpen.value = !isLocaleMenuOpen.value
}

function changeLocale(nextLocale: DashboardLocale) {
  setLocale(nextLocale)
  isLocaleMenuOpen.value = false
}

function closeLocaleMenuOnOutsideClick(event: MouseEvent) {
  const target = event.target as Node | null
  if (!target) return

  if (localeMenuRef.value && !localeMenuRef.value.contains(target)) {
    isLocaleMenuOpen.value = false
  }
}

async function handleMenuSelect(item: FmMenuItem) {
  isMobileSidebarOpen.value = false

  if (!item.to || item.to === route.path) {
    return
  }

  await navigateTo(item.to)
}

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

watch(
  () => route.fullPath,
  () => {
    isMobileSidebarOpen.value = false
  }
)

watch(isMobileSidebarOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(async () => {
  document.addEventListener('click', closeLocaleMenuOnOutsideClick)
  user.value = await repository.getCurrentUser()
})

onUnmounted(() => {
  document.removeEventListener('click', closeLocaleMenuOnOutsideClick)

  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#e4e4e6] text-slate-900">
    <header class="fixed inset-x-0 top-0 z-30 border-b border-[#d9d9d9] bg-[#f4f4f4]">
      <div class="mx-auto flex h-[66px] w-full max-w-[2200px] items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6">
        <div class="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#d1d5db] bg-white text-[#394150] shadow-[0_6px_16px_rgba(15,23,42,0.08)] lg:hidden"
            aria-label="Buka menu FM"
            @click="isMobileSidebarOpen = true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div class="grid h-[42px] w-[42px] place-items-center rounded-[12px] border border-[#d8dde4] bg-white shadow-[0_6px_16px_rgba(15,23,42,0.1)]">
            <img src="/img/logo-umc.jpg" alt="Logo UMC" class="h-8 w-8 rounded-full object-cover">
          </div>

          <div class="hidden min-w-0 leading-tight sm:block">
            <p class="truncate text-[14px] font-bold text-[#1f2937]">SI IMUT</p>
          </div>

          <button
            type="button"
            class="hidden h-9 w-9 items-center justify-center rounded-[10px] border border-[#d1d5db] bg-white text-[#394150] shadow-[0_6px_16px_rgba(15,23,42,0.08)] transition hover:bg-[#eef0f2] lg:inline-flex"
            :aria-label="isSidebarCollapsed ? 'Buka sidebar' : 'Tutup sidebar'"
            @click="toggleSidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-[18px] w-[18px] transition-transform" :class="isSidebarCollapsed ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m15 19-7-7 7-7" />
            </svg>
          </button>

        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle theme"
            class="grid h-8 w-8 place-items-center rounded-full text-[#4f5b70] transition hover:bg-[#e8e8e8] hover:text-[#374151]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-[17px] w-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 0111.21 3a7 7 0 109.79 9.79z" />
            </svg>
          </button>

          <div ref="localeMenuRef" class="relative">
            <button
              type="button"
              class="inline-flex h-8 items-center gap-1 rounded-[8px] px-2 text-[13px] font-medium text-[#505967] transition hover:bg-[#e8e8e8]"
              @click.stop="toggleLocaleMenu"
            >
              <span>{{ activeLocaleLabel }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-[14px] w-[14px] text-[#7b8492] transition-transform" :class="isLocaleMenuOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </button>

            <div
              v-if="isLocaleMenuOpen"
              class="absolute right-0 top-[calc(100%+7px)] z-20 w-[94px] overflow-hidden rounded-[8px] border border-[#d8dbe1] bg-[#f4f5f7] shadow-[0_8px_24px_rgba(15,23,42,0.15)]"
            >
              <button
                v-for="item in localeOptions"
                :key="item.code"
                type="button"
                class="block w-full px-3 py-2 text-left text-[13px] text-[#2f3744] transition hover:bg-white"
                @click="changeLocale(item.code)"
              >
                {{ item.label }}
              </button>
            </div>
          </div>

          <button
            type="button"
            aria-label="User profile"
            class="relative h-[38px] w-[38px] rounded-full sm:h-[52px] sm:w-[52px]"
          >
            <img
              :src="user.avatar"
              :alt="user.name"
              class="h-full w-full rounded-full object-cover"
            >
            <span
              v-if="user.isOnline"
              class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#12bf4c] sm:h-4 sm:w-4"
            />
          </button>
        </div>
      </div>
    </header>

    <FmSidebar
      :menus="fmMenus"
      :active-menu-id="activeMenuId"
      :is-collapsed="isSidebarCollapsed"
      :is-mobile-open="isMobileSidebarOpen"
      :profile="sidebarProfile"
      @menu-select="handleMenuSelect"
      @close-mobile="isMobileSidebarOpen = false"
    />

    <main
      class="flex-1 bg-[#f4f4f4] pb-6 pt-[66px] transition-[padding-left] duration-300"
      :class="isSidebarCollapsed ? 'lg:pl-[84px]' : 'lg:pl-[290px]'"
    >
      <slot />
    </main>

    <footer
      class="border-t border-[#5f0709] bg-[#981114] px-4 py-3 text-center text-[11px] leading-relaxed text-white transition-[padding-left] duration-300 sm:text-xs md:text-[12px]"
      :class="isSidebarCollapsed ? 'lg:pl-[84px]' : 'lg:pl-[290px]'"
    >
      Copyright All Right Reserved 2025, Lembaga Penjaminan Mutu &amp;
      Satuan Penjaminan Mutu Universitas Muhammadiyah Cirebon
    </footer>
  </div>
</template>
