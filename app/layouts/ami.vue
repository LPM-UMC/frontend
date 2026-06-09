<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { navigateTo, useRoute, useLocalePath } from '#imports'
import { en, id, ar, ja } from '@nuxt/ui/locale'
import DashboardSidebar from '~/components/layout/DashboardSidebar.vue'
import { getDashboardDummyUser } from '#features/dashboard/data/dashboardDummy'
import { useDashboardRepository } from '#features/dashboard/composables/useDashboardRepository'
import type { DashboardLocale, DashboardUser } from '#features/dashboard/types/dashboard'
import { useI18n } from 'vue-i18n'

interface FmMenuItem {
  id: string
  label: string
  to?: string
  icon: string
}

const route = useRoute()
const localePath = useLocalePath()
const { locale, setLocale, t } = useI18n()
const repository = useDashboardRepository('auto')

const user = ref<DashboardUser>(getDashboardDummyUser())
const locales = [en, id, ar, ja]
const isSidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)

const activeMenuId = computed(() => {
  const path = route.path
  if (path.includes('/dashboard/ami/sop')) return 'ami-sop'
  if (path.includes('/dashboard/ami/monev')) return 'ami-monev'
  if (path.includes('/dashboard/ami/tindak-lanjut')) return 'ami-tindak-lanjut'
  return 'dashboard-utama'
})

const amiMenus = computed<FmMenuItem[]>(() => {
  const menus: FmMenuItem[] = [
    {
      id: 'dashboard-utama',
      label: t('navigasi.dasbor'),
      to: '/dashboard',
      icon: 'i-lucide-home'
    },
    {
      id: 'modul-ami',
      label: 'Modul AMI',
      to: '/dashboard/ami',
      icon: 'i-lucide-layout-grid'
    }
  ]

  const path = route.path
  if (path.includes('/dashboard/ami/sop')) {
    menus.push({
      id: 'ami-sop',
      label: t('amiMenus.sop'),
      to: '/dashboard/ami/sop',
      icon: 'i-lucide-file-text'
    })
  } else if (path.includes('/dashboard/ami/monev')) {
    menus.push({
      id: 'ami-monev',
      label: t('amiMenus.monev'),
      to: '/dashboard/ami/monev',
      icon: 'i-lucide-monitor'
    })
  } else if (path.includes('/dashboard/ami/tindak-lanjut')) {
    menus.push({
      id: 'ami-tindak-lanjut',
      label: t('amiMenus.tindakLanjut'),
      to: '/dashboard/ami/tindak-lanjut',
      icon: 'i-lucide-clipboard-check'
    })
  }
  
  return menus
})

const sidebarProfile = computed(() => ({
  name: user.value.name,
  role: user.value.role,
  avatar: user.value.avatar,
}))



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
  user.value = await repository.getCurrentUser()
})

onUnmounted(() => {

  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <!-- Paksa seluruh layout dashboard tetap LTR -->
  <div dir="ltr" class="min-h-screen bg-[#e4e4e6] text-slate-900 flex flex-col">
    <!-- HEADER -->
    <header dir="ltr" class="fixed inset-x-0 top-0 z-30 border-b border-[#d9d9d9] bg-[#f4f4f4]">
      <div dir="ltr" class="mx-auto flex h-16.5 w-full max-w-550 items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6">
        <!-- LEFT -->
        <div dir="ltr" class="flex min-w-0 items-center gap-2.5">
          <!-- Mobile menu -->
          <button type="button" aria-label="Buka menu modul"
            class="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#d1d5db] bg-white text-[#394150] shadow-[0_6px_16px_rgba(15,23,42,0.08)] lg:hidden"
            @click="isMobileSidebarOpen = true">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- Logo -->
          <NuxtLink dir="ltr" :to="localePath('/')" class="flex items-center gap-2">
            <div class="grid h-10.5 w-10.5 place-items-center rounded-[12px] border border-[#d8dde4] bg-white shadow-[0_6px_16px_rgba(15,23,42,0.1)]">
              <img src="/img/logo-umc.jpg" alt="Logo UMC" class="h-8 w-8 rounded-full object-cover">
            </div>

            <!-- Text boleh ikut locale -->
            <div class="hidden min-w-0 leading-tight sm:block" :dir="locale === 'ar' ? 'rtl' : 'ltr'" :class="locale === 'ar' ? 'text-right' : 'text-left'">
              <p class="truncate text-[14px] font-bold text-red-800">
                SI-IMOET
              </p>
            </div>
          </NuxtLink>

          <!-- Collapse button -->
          <button type="button"
            class="hidden h-9 w-9 items-center justify-center rounded-[10px] border border-[#d1d5db] bg-white text-[#394150] shadow-[0_6px_16px_rgba(15,23,42,0.08)] transition hover:bg-[#eef0f2] lg:inline-flex cursor-pointer"
            :aria-label="isSidebarCollapsed ? 'Buka sidebar' : 'Tutup sidebar'" @click="toggleSidebar">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 transition-transform" :class="isSidebarCollapsed ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m15 19-7-7 7-7" />
            </svg>
          </button>
        </div>

        <!-- RIGHT -->
        <div dir="ltr" class="hidden items-center gap-3 md:flex">
          <ULocaleSelect :model-value="locale" :locales="locales" class="cursor-pointer" @update:model-value="setLocale($event as 'id' | 'en' | 'ar' | 'ja')" />
        </div>
      </div>
    </header>

    <!-- SIDEBAR -->
    <DashboardSidebar :menus="amiMenus" :active-menu-id="activeMenuId" :is-collapsed="isSidebarCollapsed"
      :is-mobile-open="isMobileSidebarOpen" :profile="sidebarProfile" @menu-select="handleMenuSelect" @close-mobile="isMobileSidebarOpen = false" />

    <!-- MAIN -->
    <main dir="ltr" class="flex-1 bg-[#f4f4f4] pb-6 pt-16.5 transition-[padding-left] duration-300" :class="isSidebarCollapsed ? 'lg:pl-21' : 'lg:pl-72.5'">
      <slot />
    </main>

    <!-- FOOTER -->
    <!-- <footer
      class="border-t border-[#5f0709] bg-[#981114] px-4 py-3 text-center text-[11px] leading-relaxed text-white transition-[padding-left] duration-300 sm:text-xs md:text-[12px]"
      :class="isSidebarCollapsed ? 'lg:pl-21' : 'lg:pl-72.5'"
    >
      Copyright All Right Reserved 2026, Lembaga Penjaminan Mutu &amp;
      Satuan Penjaminan Mutu Universitas Muhammadiyah Cirebon
    </footer> -->
  </div>
</template>
