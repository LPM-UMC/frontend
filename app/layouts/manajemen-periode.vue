<template>
  <!-- Paksa seluruh layout dashboard tetap LTR -->
  <div dir="ltr" class="min-h-screen bg-[#e4e4e6] text-slate-900">
    <!-- HEADER -->
    <header dir="ltr" class="fixed inset-x-0 top-0 z-30 border-b border-[#d9d9d9] bg-[#f4f4f4]">
      <div dir="ltr"
        class="mx-auto flex h-16.5 w-full max-w-550 items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6">
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
            <div
              class="grid h-10.5 w-10.5 place-items-center rounded-[12px] border border-[#d8dde4] bg-white shadow-[0_6px_16px_rgba(15,23,42,0.1)]">
              <img src="/img/logo-umc.jpg" alt="Logo UMC" class="h-8 w-8 rounded-full object-cover">
            </div>

            <!-- Text boleh ikut locale -->
            <div class="hidden min-w-0 leading-tight sm:block" :dir="locale === 'ar' ? 'rtl' : 'ltr'" :class="locale === 'ar'
              ? 'text-right'
              : 'text-left'">
              <p class="truncate text-[14px] font-bold text-red-800">
                SI-IMOET
              </p>
            </div>
          </NuxtLink>

          <!-- Collapse button -->
          <button type="button"
            class="hidden h-9 w-9 items-center justify-center rounded-[10px] border border-[#d1d5db] bg-white text-[#394150] shadow-[0_6px_16px_rgba(15,23,42,0.08)] transition hover:bg-[#eef0f2] lg:inline-flex cursor-pointer"
            :aria-label="isSidebarCollapsed
              ? 'Buka sidebar'
              : 'Tutup sidebar'
              " @click="toggleSidebar">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 transition-transform" :class="isSidebarCollapsed
              ? 'rotate-180'
              : ''
              " fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m15 19-7-7 7-7" />
            </svg>
          </button>
        </div>

        <!-- RIGHT -->
        <div dir="ltr" class="hidden items-center gap-3 md:flex">
          <ULocaleSelect :model-value="locale" :locales="locales" class="cursor-pointer" @update:model-value="
            setLocale(
              $event as
              | 'id'
              | 'en'
              | 'ar'
              | 'ja'
            )
            " />
        </div>
      </div>
    </header>

    <!-- SIDEBAR -->
    <ManajemenUserRoleSidebar :menus="modulMenus" :active-menu-id="activeMenuId" :is-collapsed="isSidebarCollapsed"
      :is-mobile-open="isMobileSidebarOpen" :profile="sidebarProfile" @menu-select="handleMenuSelect" @close-mobile="
        isMobileSidebarOpen = false
        " />

    <!-- MAIN -->
    <main dir="ltr" class="flex-1 bg-[#f4f4f4] pb-6 pt-16.5 transition-[padding-left] duration-300" :class="isSidebarCollapsed
      ? 'lg:pl-21'
      : 'lg:pl-72.5'
      ">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  watch,
} from 'vue'
import {
  navigateTo,
  useRoute,
} from '#imports'
import {
  en,
  id,
  ar,
  ja,
} from '@nuxt/ui/locale'
import ManajemenUserRoleSidebar
  from '~/components/layout/ManajemenUserRoleSidebar.vue'

const localePath =
  useLocalePath()

const {
  locale,
  setLocale,
  t,
} = useI18n()

const locales = [
  id,
  en,
  ar,
  ja,
]

type MenuItem = {
  id: string
  label: string
  to?: string
  icon: string
}

const route =
  useRoute()

const isSidebarCollapsed =
  ref(false)

const isMobileSidebarOpen =
  ref(false)

const modulMenus =
  computed<MenuItem[]>(
    () => [
      {
        id: 'home',
        label: t(
          'navigasi.dasbor'
        ),
        to: localePath(
          '/dashboard'
        ),
        icon: 'home',
      },
      {
        id: 'manajemen-periode',
        label: t(
          'manajemenPeriode.judul'
        ),
        to: localePath(
          '/dashboard/manajemen-periode'
        ),
        icon: 'calendar',
      },
    ]
  )

const activeMenuId =
  computed(() => {
    const sortedMenus =
      [
        ...modulMenus.value,
      ].sort(
        (a, b) =>
          (
            b.to?.length ||
            0
          ) -
          (
            a.to?.length ||
            0
          )
      )

    const current =
      sortedMenus.find(
        (menu) => {
          if (!menu.to) {
            return false
          }

          return route.path.startsWith(
            menu.to
          )
        }
      )

    return (
      current?.id ?? ''
    )
  })

async function handleMenuSelect(
  item: MenuItem
) {
  isMobileSidebarOpen.value =
    false

  if (
    !item.to ||
    item.to ===
    route.path
  ) {
    return
  }

  await navigateTo(
    item.to
  )
}

function toggleSidebar() {
  isSidebarCollapsed.value =
    !isSidebarCollapsed.value
}

watch(
  isMobileSidebarOpen,
  (open) => {
    if (
      !import.meta.client
    ) {
      return
    }

    document.body.style.overflow =
      open
        ? 'hidden'
        : ''
  }
)

const sidebarProfile =
  computed(() => {
    return {
      name: 'John Doe',
      role: 'Administrator',
      avatar:
        'https://i.pravatar.cc/150?img=33',
    }
  })
</script>
