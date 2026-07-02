<template>
  <header :dir="'ltr'" class="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white">
    <div class="mx-auto flex h-16 w-full max-w-470 items-center justify-between gap-4 px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <!-- Left side: Logo & Nav -->
      <div class="flex items-center gap-8 lg:gap-12">
        <NuxtLink to="/" class="flex min-w-0 items-center gap-3" @click="closeMobileMenu">
          <div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-gray-200">
            <img src="/img/logo-umc.jpg" alt="Logo UMC" class="h-full w-full object-cover">
          </div>

          <div class="min-w-0 leading-tight">
            <span class="block truncate text-[15px] font-bold text-red-700 md:text-xl">
              SI-IMOET
            </span>
            <span class="hidden truncate text-[11px] text-gray-500 sm:block font-bold">
              LPM &amp; SPI UMC
            </span>
          </div>
        </NuxtLink>

        <nav class="hidden md:flex md:items-center md:gap-5">
        <div>
          <NuxtLink to="/" :class="simpleNavClass('/')">
            {{ $t('navigasi.beranda') }}
          </NuxtLink>
        </div>

        <div class="relative">
          <button
type="button" class="cursor-pointer"
            :class="dropdownButtonClass(['/profile', '/struktur-organisasi', '/visi-misi'])"
            @click="toggleMenu('profil')">
            {{ $t('navigasi.profil') }}
            <span
class="ml-2 inline-flex items-center transition-transform duration-200"
              :class="openMenu === 'profil' ? 'rotate-0' : 'rotate-180'" aria-hidden="true">
              <img src="/img/admin/icon/dashboard/dropdown.png" alt="" class="h-3 w-3 object-contain opacity-70">
            </span>
          </button>

          <div
v-if="openMenu === 'profil'"
            class="absolute left-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
            <NuxtLink to="/profile" :class="dropdownItemClass('/profile')" @click="closeMenu">
              LPM
            </NuxtLink>
            <NuxtLink
to="/profile/struktur-organisasi" :class="dropdownItemClass('/profile/struktur-organisasi')"
              @click="closeMenu">
              Struktur Organisasi
            </NuxtLink>
            <NuxtLink to="/profile/visi-misi" :class="dropdownItemClass('/profile/visi-misi')" @click="closeMenu">
              Visi &amp; Misi
            </NuxtLink>
          </div>
        </div>

        <div class="relative">
          <button
type="button" class="cursor-pointer" :class="dropdownButtonClass(['/gambaran-spi', '/dokumen-spi', '/capaian-ami'])"
            @click="toggleMenu('spi')">
            SPI
            <span
class="ml-2 inline-flex items-center transition-transform duration-200"
              :class="openMenu === 'spi' ? 'rotate-0' : 'rotate-180'" aria-hidden="true">
              <img src="/img/admin/icon/dashboard/dropdown.png" alt="" class="h-3 w-3 object-contain opacity-70">
            </span>
          </button>

          <div
v-if="openMenu === 'spi'"
            class="absolute left-0 mt-2 w-60 rounded-xl border border-gray-200 bg-white py-2 shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
            <NuxtLink to="/gambaran-spi" :class="dropdownItemClass('/gambaran-spi')" @click="closeMenu">
              Gambaran SPI
            </NuxtLink>
            <NuxtLink to="/dokumen-spi" :class="dropdownItemClass('/dokumen-spi')" @click="closeMenu">
              Dokumen SPI
            </NuxtLink>
            <NuxtLink
to="/penjaminan-mutu/capaian-ami"
              :class="dropdownItemClass('/penjaminan-mutu/capaian-ami')" @click="closeMenu">
              Capaian AMI
            </NuxtLink>
          </div>
        </div>

        <div class="relative">
          <button
type="button" class="cursor-pointer" :class="dropdownButtonClass([
            '/ami',
            '/monev-pembelajaran',
            '/survei-kepuasan',
            '/rtm',
            '/external-benchmarking',
            '/capaian-monev',
          ])" @click="toggleMenu('penjaminan')">
            LPM
            <span
class="ml-2 inline-flex items-center transition-transform duration-200"
              :class="openMenu === 'penjaminan' ? 'rotate-0' : 'rotate-180'" aria-hidden="true">
              <img src="/img/admin/icon/dashboard/dropdown.png" alt="" class="h-3 w-3 object-contain opacity-70">
            </span>
          </button>

          <div
v-if="openMenu === 'penjaminan'"
            class="absolute left-0 mt-2 w-72 rounded-xl border border-gray-200 bg-white py-2 shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
            <NuxtLink to="/penjaminan-mutu/ami" :class="dropdownItemClass('/penjaminan-mutu/ami')" @click="closeMenu">
              Audit Mutu Internal (AMI)
            </NuxtLink>
            <NuxtLink
to="/penjaminan-mutu/monev-pembelajaran"
              :class="dropdownItemClass('/penjaminan-mutu/monev-pembelajaran')" @click="closeMenu">
              Monev Pembelajaran
            </NuxtLink>
            <NuxtLink
to="/penjaminan-mutu/survei-kepuasan"
              :class="dropdownItemClass('/penjaminan-mutu/survei-kepuasan')" @click="closeMenu">
              Survei Kepuasan
            </NuxtLink>
            <NuxtLink to="/penjaminan-mutu/rtm" :class="dropdownItemClass('/penjaminan-mutu/rtm')" @click="closeMenu">
              Rapat Tinjauan Manajemen (RTM)
            </NuxtLink>
            <NuxtLink
to="/penjaminan-mutu/external-benchmarking"
              :class="dropdownItemClass('/penjaminan-mutu/external-benchmarking')" @click="closeMenu">
              External Benchmarking
            </NuxtLink>
            <NuxtLink
to="/penjaminan-mutu/capaian-monev"
              :class="dropdownItemClass('/penjaminan-mutu/capaian-monev')" @click="closeMenu">
              Capaian Monev
            </NuxtLink>
          </div>
        </div>

        <div class="relative">
          <button
type="button" class="cursor-pointer" :class="dropdownButtonClass(['/gambaran-spmi', '/dokumen-spmi'])"
            @click="toggleMenu('spmi')">
            SPMI
            <span
class="ml-2 inline-flex items-center transition-transform duration-200"
              :class="openMenu === 'spmi' ? 'rotate-0' : 'rotate-180'" aria-hidden="true">
              <img src="/img/admin/icon/dashboard/dropdown.png" alt="" class="h-3 w-3 object-contain opacity-70">
            </span>
          </button>

          <div
v-if="openMenu === 'spmi'"
            class="absolute left-0 mt-2 w-60 rounded-xl border border-gray-200 bg-white py-2 shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
            <NuxtLink to="/gambaran-spmi" :class="dropdownItemClass('/gambaran-spmi')" @click="closeMenu">
              Gambaran SPMI
            </NuxtLink>
            <NuxtLink to="/dokumen-spmi" :class="dropdownItemClass('/dokumen-spmi')" @click="closeMenu">
              Dokumen SPMI
            </NuxtLink>
          </div>
        </div>

        <div class="relative">
          <button
type="button" class="cursor-pointer"
            :class="dropdownButtonClass(['/data-akreditasi', '/dokumen-akreditasi'])" @click="toggleMenu('akreditasi')">
            {{ $t('navigasi.akreditasi') }}
            <span
class="ml-2 inline-flex items-center transition-transform duration-200"
              :class="openMenu === 'akreditasi' ? 'rotate-0' : 'rotate-180'" aria-hidden="true">
              <img src="/img/admin/icon/dashboard/dropdown.png" alt="" class="h-3 w-3 object-contain opacity-70">
            </span>
          </button>

          <div
v-if="openMenu === 'akreditasi'"
            class="cursor-pointer absolute left-0 mt-2 w-60 rounded-xl border border-gray-200 bg-white py-2 shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
            <NuxtLink
to="/akreditasi/data-akreditasi" :class="dropdownItemClass('/akreditasi/data-akreditasi')"
              @click="closeMenu">
              Data Akreditasi
            </NuxtLink>
            <NuxtLink
to="/akreditasi/dokumen-akreditasi" :class="dropdownItemClass('/akreditasi/dokumen-akreditasi')"
              @click="closeMenu">
              Dokumen Akreditasi
            </NuxtLink>
          </div>
        </div>

        <div class="relative">
          <button
type="button" class="cursor-pointer" :class="dropdownButtonClass(['/semua-postingan', '/kategori'])"
            @click="toggleMenu('informasi')">
            {{ $t('navigasi.informasi') }}
            <span
class="ml-2 inline-flex items-center transition-transform duration-200"
              :class="openMenu === 'informasi' ? 'rotate-0' : 'rotate-180'" aria-hidden="true">
              <img src="/img/admin/icon/dashboard/dropdown.png" alt="" class="h-3 w-3 object-contain opacity-70">
            </span>
          </button>

          <div
v-if="openMenu === 'informasi'"
            class="absolute left-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
            <NuxtLink
to="/informasi/semua-postingan" :class="dropdownItemClass('/informasi/semua-postingan')"
              @click="closeMenu">
              Semua Postingan
            </NuxtLink>
            <NuxtLink to="/informasi/kategori" :class="dropdownItemClass('/informasi/kategori')" @click="closeMenu">
              Kategori
            </NuxtLink>
          </div>
        </div>
        </nav>
      </div>

      <div class="flex items-center gap-2 md:gap-3">
        <NuxtLink
v-if="authStore.initialized && !authStore.isAuthenticated" :to="localePath('/login')"
          class="h-9 items-center justify-center rounded-full bg-[#e30613] px-3 text-xs font-medium text-white shadow-sm transition hover:bg-[#c10510] md:h-auto md:px-5 md:py-2 md:text-sm hidden md:inline-flex">
          {{ $t('navigasi.masuk') }}
        </NuxtLink>
        <NuxtLink
v-if="authStore.initialized && authStore.isAuthenticated" :to="localePath('/dashboard')"
          class="h-9 items-center justify-center rounded-full bg-[#e30613] px-3 text-xs font-medium text-white shadow-sm transition hover:bg-[#c10510] md:h-auto md:px-5 md:py-2 md:text-sm hidden md:inline-flex">
          {{ $t('navigasi.dasbor') }}
        </NuxtLink>

        <ULocaleSelect
class="hidden md:block" :model-value="locale" :locales="locales"
          @update:model-value="setLocale($event as 'id' | 'en' | 'ar' | 'ja')" />

        <button
type="button"
          class="grid h-9 w-9 place-items-center rounded-md border border-gray-200 text-gray-700 transition hover:bg-gray-100 md:hidden cursor-pointer"
          :aria-expanded="isMobileMenuOpen" aria-label="Toggle menu" @click="toggleMobileMenu">
          <svg
v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </div>

    <Transition
enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
      <div v-if="isMobileMenuOpen" class="border-t border-gray-200 bg-white/95 backdrop-blur md:hidden">
        <div class="mx-auto max-h-[calc(100vh-64px)] w-full max-w-6xl overflow-y-auto px-4 py-4">
          <NuxtLink to="/" :class="mobilePrimaryLinkClass('/')" @click="closeMobileMenu">
            {{ $t('navigasi.beranda') }}
          </NuxtLink>

          <details
v-for="group in mobileMenuGroups" :key="group.title"
            class="mt-2 rounded-lg border border-gray-200 bg-white">
            <summary :class="mobileSummaryClass(group.paths)">
              <span>{{ group.title }}</span>
              <span class="text-xs text-gray-400"> {{ $t('navigasi.pilih') }} </span>
            </summary>

            <div class="space-y-1 px-2 pb-2">
              <NuxtLink
v-for="link in group.links" :key="link.to" :to="link.to" :class="mobileLinkClass(link.to)"
                @click="closeMobileMenu">
                {{ link.label }}
              </NuxtLink>
            </div>
          </details>

          <div class="flex gap-4 px-2 pt-4 mt-2 border-t border-gray-200 justify-end">
            <ULocaleSelect
:model-value="locale" :locales="locales" class="cursor-pointer"
              @update:model-value="setLocale($event as 'id' | 'en' | 'ar' | 'ja')" />

            <NuxtLink
v-if="authStore.initialized && !authStore.isAuthenticated" :to="localePath('/login')"
              class="inline-flex h-9 items-center justify-center rounded-md bg-[#e30613] px-3 text-xs font-medium text-white shadow-sm transition hover:bg-[#c10510] md:h-auto md:px-5 md:py-2 md:text-sm">
              {{ $t('navigasi.masuk') }}
            </NuxtLink>
            <NuxtLink
v-if="authStore.initialized && authStore.isAuthenticated" :to="localePath('/dashboard')"
              class="inline-flex h-9 items-center justify-center rounded-md bg-[#e30613] px-3 text-xs font-medium text-white shadow-sm transition hover:bg-[#c10510] md:h-auto md:px-5 md:py-2 md:text-sm">
              {{ $t('navigasi.dasbor') }}
            </NuxtLink>
          </div>

        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute, useLocalePath } from '#imports'
import { ref, watch, computed, onMounted } from 'vue'
import { en, id, ar, ja } from '@nuxt/ui/locale'
import { useAuthStore } from '#stores/auth'

const { locale, setLocale, t } = useI18n()
const localePath = useLocalePath()

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initAuth()
})

type MenuKey =
  | 'profil'
  | 'spi'
  | 'spmi'
  | 'penjaminan'
  | 'akreditasi'
  | 'informasi'

interface MobileGroupLink {
  to: string
  label: string
}

interface MobileMenuGroup {
  title: string
  paths: string[]
  links: MobileGroupLink[]
}

const locales = [
  id,
  en,
  ar,
  ja,
]

const mobileMenuGroups = computed<MobileMenuGroup[]>(() => [
  {
    title: t('navigasi.profil'),
    paths: ['/profile', '/struktur-organisasi', '/visi-misi'],
    links: [
      { to: '/profile/profile-siimut', label: 'Profil LPM' },
      { to: '/profile/struktur-organisasi', label: 'Struktur Organisasi' },
      { to: '/profile/visi-misi', label: 'Visi & Misi' },
    ],
  },
  {
    title: 'SPI',
    paths: ['/gambaran-spi', '/dokumen-spi', '/penjaminan-mutu/capaian-ami', '/capaian-ami'],
    links: [
      { to: '/gambaran-spi', label: 'Gambaran SPI' },
      { to: '/dokumen-spi', label: 'Dokumen SPI' },
      { to: '/penjaminan-mutu/capaian-ami', label: 'Capaian AMI' },
    ],
  },
  {
    title: 'LPM',
    paths: [
      '/ami',
      '/monev-pembelajaran',
      '/survei-kepuasan',
      '/rtm',
      '/external-benchmarking',
      '/penjaminan-mutu/ami',
      '/penjaminan-mutu/monev-pembelajaran',
      '/penjaminan-mutu/survei-kepuasan',
      '/penjaminan-mutu/rtm',
      '/penjaminan-mutu/external-benchmarking',
      '/penjaminan-mutu/capaian-monev',
      '/capaian-monev',
    ],
    links: [
      { to: '/penjaminan-mutu/ami', label: 'Audit Mutu Internal (AMI)' },
      { to: '/penjaminan-mutu/monev-pembelajaran', label: 'Monev Pembelajaran' },
      { to: '/penjaminan-mutu/survei-kepuasan', label: 'Survei Kepuasan' },
      { to: '/penjaminan-mutu/rtm', label: 'Rapat Tinjauan Manajemen (RTM)' },
      { to: '/penjaminan-mutu/external-benchmarking', label: 'External Benchmarking' },
      { to: '/penjaminan-mutu/capaian-monev', label: 'Capaian Monev' },
    ],
  },
  {
    title: 'SPMI',
    paths: ['/gambaran-spmi', '/dokumen-spmi'],
    links: [
      { to: '/gambaran-spmi', label: 'Gambaran SPMI' },
      { to: '/dokumen-spmi', label: 'Dokumen SPMI' },
    ],
  },
  {
    title: t('navigasi.akreditasi'),
    paths: ['/data-akreditasi', '/dokumen-akreditasi', '/akreditasi/data-akreditasi', '/akreditasi/dokumen-akreditasi'],
    links: [
      { to: '/akreditasi/data-akreditasi', label: 'Data Akreditasi' },
      { to: '/akreditasi/dokumen-akreditasi', label: 'Dokumen Akreditasi' },
    ],
  },
  {
    title: t('navigasi.informasi'),
    paths: ['/semua-postingan', '/kategori', '/informasi/semua-postingan', '/informasi/kategori'],
    links: [
      { to: '/informasi/semua-postingan', label: 'Semua Postingan' },
      { to: '/informasi/kategori', label: 'Kategori' },
    ],
  },
]);

const openMenu = ref<MenuKey | null>(null)
const isMobileMenuOpen = ref(false)
const route = useRoute()

const toggleMenu = (name: MenuKey) => {
  openMenu.value = openMenu.value === name ? null : name
}

const closeMenu = () => {
  openMenu.value = null
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

watch(
  () => route.path,
  () => {
    closeMenu()
    closeMobileMenu()
  }
)

const normalizedPath = computed(() => {
  return route.path.replace(/^\/(id|en|ar|ja)(?=\/|$)/, '') || '/'
})

const isMatch = (paths: string | string[]) => {
  const arr = Array.isArray(paths) ? paths : [paths]
  const currentPath = normalizedPath.value

  return arr.some((p) => {
    if (p === '/') return currentPath === '/'
    return currentPath === p || currentPath.startsWith(p + '/')
  })
}

const simpleNavClass = (paths: string | string[]) =>
  isMatch(paths)
    ? 'text-sm font-semibold text-[#e30613]'
    : 'text-sm text-gray-700 transition hover:text-[#e30613]'

const dropdownButtonClass = (paths: string | string[]) =>
  isMatch(paths)
    ? 'inline-flex items-center gap-1 text-sm font-semibold text-[#e30613]'
    : 'inline-flex items-center gap-1 text-sm text-gray-700 transition hover:text-[#e30613]'

const dropdownItemClass = (path: string) =>
  isMatch(path)
    ? 'block bg-red-50 px-4 py-2 text-sm text-[#e30613]'
    : 'block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100'

const mobilePrimaryLinkClass = (path: string) =>
  isMatch(path)
    ? 'block rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-[#e30613]'
    : 'block rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-800'

const mobileSummaryClass = (paths: string[]) =>
  isMatch(paths)
    ? 'flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm font-semibold text-[#e30613]'
    : 'flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-800'

const mobileLinkClass = (path: string) =>
  isMatch(path)
    ? 'block rounded-md bg-red-50 px-2 py-2 text-sm text-[#e30613]'
    : 'block rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-50'
</script>
