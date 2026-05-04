<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { navigateTo, useRoute } from '#imports'
import ManajemenUserRoleSidebar from '~/components/layout/ManajemenUserRoleSidebar.vue'
import { useAuthStore } from '#stores/auth'
import { getAvatar } from '#utils/util'

const auth = useAuthStore();
const { locale } = useI18n();
const localePath = useLocalePath();

type MenuKey = 'lang';

const switchLocalePath = useSwitchLocalePath()
const getLocale = async (code: "id" | "en") => {
  await navigateTo(switchLocalePath(code))
}

const localeItems = [
  { code: 'id', label: 'Indonesia' },
  { code: 'en', label: 'English' },
];

const changeLocale = async (code: string) => {
  closeMenu()
  await getLocale(code === 'en' ? 'en' : 'id')
}

const closeMenu = () => {
  openMenu.value = null
}

const openMenu = ref<MenuKey | null>(null)
const toggleMenu = (name: MenuKey) => {
  openMenu.value = openMenu.value === name ? null : name
}

export type MenuItem = {
  id: string
  label: string
  to?: string
  icon: string
}

const route = useRoute();
const isSidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)

const modulMenus = computed<MenuItem[]>(() => [
  {
    id: 'home',
    label: $t('dasbor_utama'),
    to: localePath('/dashboard'),
    icon: 'home',
  },
  {
    id: 'modul',
    label: $t('manajemen_modul.nama'),
    to: localePath('/dashboard/manajemen-modul'),
    icon: 'modul',
  },
  {
    id: 'lingkup',
    label: $t('manajemen_lingkup_evaluasi.nama'),
    to: localePath('/dashboard/manajemen-lingkup'),
    icon: 'lingkup',
  },
])

const activeMenuId = computed(() => {
  const sortedMenus = [...modulMenus.value].sort((a, b) => {
    return (b.to?.length || 0) - (a.to?.length || 0)
  })

  const current = sortedMenus.find(menu => {
    if (!menu.to) return false
    return route.path.startsWith(menu.to)
  })

  return current?.id ?? ''
})

async function handleMenuSelect(item: MenuItem) {
  isMobileSidebarOpen.value = false
  if (!item.to || item.to === route.path) return
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

const sidebarProfile = computed(() => {
  const user = auth.user
  const role = auth.activeRole

  return {
    name: user?.nama || "-",
    role: role?.nama || "-",
    avatar: user?.picture || getAvatar(user?.nama || user?.picture),
  }
})

</script>

<template>
  <div class="min-h-screen bg-[#e4e4e6] text-slate-900">
    <header class="fixed inset-x-0 top-0 z-30 border-b border-[#d9d9d9] bg-[#f4f4f4]">

      <div class="mx-auto flex h-16.5 w-full max-w-550 items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6">
        <div class="flex min-w-0 items-center gap-2.5">
          <button type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#d1d5db] bg-white text-[#394150] shadow-[0_6px_16px_rgba(15,23,42,0.08)] lg:hidden"
            aria-label="Buka menu modul" @click="isMobileSidebarOpen = true">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <NuxtLink class="flex gap-2 items-center" :to="localePath('/')">
            <div
              class="cursor-pointer grid h-10.5 w-10.5 place-items-center rounded-[12px] border border-[#d8dde4] bg-white shadow-[0_6px_16px_rgba(15,23,42,0.1)]">
              <img src="/img/logo-umc.jpg" alt="Logo UMC" class="h-8 w-8 rounded-full object-cover">
            </div>

            <div class="hidden min-w-0 leading-tight sm:block">
              <p class="truncate text-[14px] font-bold text-[#1f2937]">SI IMUT</p>
            </div>
          </NuxtLink>

          <button type="button"
            class="cursor-pointer hidden h-9 w-9 items-center justify-center rounded-[10px] border border-[#d1d5db] bg-white text-[#394150] shadow-[0_6px_16px_rgba(15,23,42,0.08)] transition hover:bg-[#eef0f2] lg:inline-flex"
            :aria-label="isSidebarCollapsed ? 'Buka sidebar' : 'Tutup sidebar'" @click="toggleSidebar">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 transition-transform"
              :class="isSidebarCollapsed ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m15 19-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div class="flex items-center gap-3">
          <!-- LANGUAGE -->
          <div class="relative hidden md:block">
            <button
              class="cursor-pointer transition flex items-center gap-1 rounded-md px-2 py-1 text-sm text-[#2f3744] hover:bg-gray-100"
              @click="toggleMenu('lang')">
              {{ locale.toUpperCase() }}

              <UIcon name="i-lucide-chevron-down" class="h-4 w-4 transition-transform duration-200"
                :class="openMenu === 'lang' ? 'rotate-180' : ''" />
            </button>

            <div v-if="openMenu === 'lang'"
              class="absolute right-0 top-[calc(100%+7px)] z-20 w-23.5 overflow-hidden rounded-[8px] border border-[#e4e6ea] bg-[#f4f5f7] shadow-[0_8px_24px_rgba(15,23,42,0.15)]">
              <button v-for="item in localeItems" :key="item.code"
                class="cursor-pointer block w-full px-3 py-2 text-left text-[13px] text-[#2f3744] transition hover:bg-gray-100"
                @click="changeLocale(item.code)">
                {{ item.label }}
              </button>
            </div>
          </div>

          <!-- DARK MODE -->
          <UColorModeButton class="hidden md:inline-flex" />

        </div>
      </div>

    </header>

    <ManajemenUserRoleSidebar :menus="modulMenus" :active-menu-id="activeMenuId" :is-collapsed="isSidebarCollapsed"
      :is-mobile-open="isMobileSidebarOpen" :profile="sidebarProfile" @menu-select="handleMenuSelect"
      @close-mobile="isMobileSidebarOpen = false" />

    <main class="flex-1 bg-[#f4f4f4] pb-6 pt-16.5 transition-[padding-left] duration-300"
      :class="isSidebarCollapsed ? 'lg:pl-21' : 'lg:pl-72.5'">
      <slot />
    </main>

    <footer
      class="border-t border-[#5f0709] bg-[#981114] px-4 py-3 text-center text-[11px] leading-relaxed text-white transition-[padding-left] duration-300 sm:text-xs md:text-[12px]"
      :class="isSidebarCollapsed ? 'lg:pl-21' : 'lg:pl-72.5'">
      {{ $t('footer') }}
    </footer>
  </div>
</template>
