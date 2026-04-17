<!-- components/AppHeader.vue -->
<template>
  <header class="fixed inset-x-0 top-0 z-50 bg-white border-b border-gray-200">
    <div class="max-w-6xl mx-auto flex items-center justify-between h-16 gap-6 px-4 md:px-6">
      <!-- Brand / Logo -->
      <NuxtLink to="/" class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center">
          <!-- pakai path dari /public -->
          <img src="/img/logo-umc.jpg" alt="Logo UMC" class="w-full h-full object-cover">
        </div>
        <div class="flex flex-col leading-tight">
          <span class="text-xl font-sans font-bold">
            SI IMUT
          </span>
          <!--   <span class="text-[0.9rem] text-black font-semibold"> -->
          <!--     Lembaga Penjaminan Mutu -->
          <!--   </span> -->
          <!--   <span class="text-[0.9rem] text-black font-semibold"> -->
          <!--     dan Satuan Pengawas Internal -->
          <!--   </span> -->
          <!--   <span class="text-[0.9rem] text-black font-semibold"> -->
          <!--     Universitas Muhammadiyah Cirebon -->
          <!--   </span> -->
          <!-- </div> -->
        </div>
      </NuxtLink>

      <!-- Nav (desktop) -->
      <nav class="hidden md:flex items-center gap-5">
        <!-- Beranda -->
        <div>
          <NuxtLink to="/" :class="simpleNavClass('/')">
            Beranda
          </NuxtLink>
        </div>

        <!-- PROFIL -->
        <div class="relative">
          <button type="button" :class="dropdownButtonClass(['/profile', '/struktur-organisasi', '/visi-misi'])"
            @click="toggleMenu('profil')">
            <span>Profil</span>

            <!-- icon dropdown + animasi rotate -->
            <span class="ml-2 inline-flex items-center transition-transform duration-200"
              :class="openMenu === 'profil' ? 'rotate-0' : 'rotate-180'" aria-hidden="true">
              <img src="/img/admin/icon/dashboard/dropdown.png" alt="" class="w-3 h-3 object-contain opacity-70">
            </span>
          </button>

          <div v-if="openMenu === 'profil'"
            class="absolute left-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.18)] py-2">
            <NuxtLink to="/profile" :class="dropdownItemClass('/profile')" @click="closeMenu">
              Profil LPM
            </NuxtLink>

            <NuxtLink to="/profile/struktur-organisasi" :class="dropdownItemClass('/profile/struktur-organisasi')"
              @click="closeMenu">
              Struktur Organisasi
            </NuxtLink>

            <NuxtLink to="/profile/visi-misi" :class="dropdownItemClass('/profile/visi-misi')" @click="closeMenu">
              Visi &amp; Misi
            </NuxtLink>
          </div>
        </div>


        <!-- SPI-->
        <div class="relative">
          <button type="button" :class="dropdownButtonClass(['/gambaran-spi', '/dokumen-spi'])"
            @click="toggleMenu('spi')">
            SPI
            <span class="ml-2 inline-flex items-center transition-transform duration-200"
              :class="openMenu === 'spi' ? 'rotate-0' : 'rotate-180'" aria-hidden="true">
              <img src="/img/admin/icon/dashboard/dropdown.png" alt="" class="w-3 h-3 object-contain opacity-70">
            </span>
          </button>

          <div v-if="openMenu === 'spi'"
            class="absolute left-0 mt-2 w-60 rounded-xl border border-gray-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.18)] py-2">
            <NuxtLink to="/gambaran-spi" :class="dropdownItemClass('/gambaran-spi')" @click="closeMenu">
              Gambaran SPI
            </NuxtLink>
            <NuxtLink to="/dokumen-spi" :class="dropdownItemClass('/dokumen-spi')" @click="closeMenu">
              Dokumen SPI
            </NuxtLink>
          </div>
        </div>

        <!-- PENJAMINAN MUTU -->
        <div class="relative">
          <button type="button" :class="dropdownButtonClass([
            '/ami',
            '/monev-pembelajaran',
            '/survei-kepuasan',
            '/rtm',
            '/external-benchmarking',
          ])
            " @click="toggleMenu('penjaminan')">
            LPM
            <span class="ml-2 inline-flex items-center transition-transform duration-200"
              :class="openMenu === 'penjaminan' ? 'rotate-0' : 'rotate-180'" aria-hidden="true">
              <img src="/img/admin/icon/dashboard/dropdown.png" alt="" class="w-3 h-3 object-contain opacity-70">
            </span>
          </button>

          <div v-if="openMenu === 'penjaminan'"
            class="absolute left-0 mt-2 w-72 rounded-xl border border-gray-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.18)] py-2">
            <NuxtLink to="/penjaminan-mutu/ami" :class="dropdownItemClass('/penjaminan-mutu/ami')" @click="closeMenu">
              Audit Mutu Internal (AMI)
            </NuxtLink>
            <NuxtLink to="/penjaminan-mutu/monev-pembelajaran"
              :class="dropdownItemClass('/penjaminan-mutu/monev-pembelajaran')" @click="closeMenu">
              Monev Pembelajaran
            </NuxtLink>
            <NuxtLink to="/penjaminan-mutu/survei-kepuasan"
              :class="dropdownItemClass('/penjaminan-mutu/survei-kepuasan')" @click="closeMenu">
              Survei Kepuasan
            </NuxtLink>
            <NuxtLink to="/penjaminan-mutu/rtm" :class="dropdownItemClass('/penjaminan-mutu/rtm')" @click="closeMenu">
              Rapat Tinjauan Manajemen (RTM)
            </NuxtLink>
            <NuxtLink to="/penjaminan-mutu/external-benchmarking"
              :class="dropdownItemClass('/penjaminan-mutu/external-benchmarking')" @click="closeMenu">
              External Benchmarking
            </NuxtLink>
          </div>
        </div>


        <!-- SPMI-->
        <div class="relative">
          <button type="button" :class="dropdownButtonClass(['/gambaran-spmi', '/dokumen-spmi'])"
            @click="toggleMenu('spmi')">
            SPMI
            <span class="ml-2 inline-flex items-center transition-transform duration-200"
              :class="openMenu === 'spmi' ? 'rotate-0' : 'rotate-180'" aria-hidden="true">
              <img src="/img/admin/icon/dashboard/dropdown.png" alt="" class="w-3 h-3 object-contain opacity-70">
            </span>
          </button>

          <div v-if="openMenu === 'spmi'"
            class="absolute left-0 mt-2 w-60 rounded-xl border border-gray-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.18)] py-2">
            <NuxtLink to="/gambaran-spmi" :class="dropdownItemClass('/gambaran-spmi')" @click="closeMenu">
              Gambaran SPMI
            </NuxtLink>
            <NuxtLink to="/dokumen-spmi" :class="dropdownItemClass('/dokumen-spmi')" @click="closeMenu">
              Dokumen SPMI
            </NuxtLink>
          </div>
        </div>

        <!-- AKREDITASI -->
        <div class="relative">
          <button type="button" :class="dropdownButtonClass(['/data-akreditasi', '/dokumen-akreditasi'])"
            @click="toggleMenu('akreditasi')">
            Akreditasi
            <span class="ml-2 inline-flex items-center transition-transform duration-200"
              :class="openMenu === 'akreditasi' ? 'rotate-0' : 'rotate-180'" aria-hidden="true">
              <img src="/img/admin/icon/dashboard/dropdown.png" alt="" class="w-3 h-3 object-contain opacity-70">
            </span>
          </button>

          <div v-if="openMenu === 'akreditasi'"
            class="absolute left-0 mt-2 w-60 rounded-xl border border-gray-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.18)] py-2">
            <NuxtLink to="/akreditasi/data-akreditasi" :class="dropdownItemClass('/akreditasi/data-akreditasi')"
              @click="closeMenu">
              Data Akreditasi
            </NuxtLink>
            <NuxtLink to="/akreditasi/dokumen-akreditasi" :class="dropdownItemClass('/akreditasi/dokumen-akreditasi')"
              @click="closeMenu">
              Dokumen Akreditasi
            </NuxtLink>
          </div>
        </div>

        <!-- INFORMASI -->
        <div class="relative">
          <button type="button" :class="dropdownButtonClass(['/semua-postingan', '/kategori'])"
            @click="toggleMenu('informasi')">
            Informasi
            <span class="ml-2 inline-flex items-center transition-transform duration-200"
              :class="openMenu === 'informasi' ? 'rotate-0' : 'rotate-180'" aria-hidden="true">
              <img src="/img/admin/icon/dashboard/dropdown.png" alt="" class="w-3 h-3 object-contain opacity-70">
            </span>
          </button>

          <div v-if="openMenu === 'informasi'"
            class="absolute left-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.18)] py-2">
            <NuxtLink to="/informasi/semua-postingan" :class="dropdownItemClass('/informasi/semua-postingan')"
              @click="closeMenu">
              Semua Postingan
            </NuxtLink>
            <NuxtLink to="/informasi/kategori" :class="dropdownItemClass('/informasi/kategori')" @click="closeMenu">
              Kategori
            </NuxtLink>
          </div>
        </div>
      </nav>

      <!-- Actions -->
      <div v-if="!authStore.isLoggedIn" class="flex items-center">
        <NuxtLink to="/login"
          class="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium text-white bg-[#e30613] hover:bg-[#c10510] shadow-sm">
          Log In
        </NuxtLink>
      </div>
      <div v-else class="flex items-center">
        <NuxtLink to="/admin/monev/dashboard-monev"
          class="inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium text-white bg-[#e30613] hover:bg-[#c10510] shadow-sm">
          Admin
        </NuxtLink>
      </div>

      <ULocaleSelect :model-value="locale" :locales="[
        {
          code: 'id', name: 'Bahasa',
          dir: 'ltr',
          messages: undefined
        },
        {
          code: 'en', name: 'English',
          dir: 'ltr',
          messages: undefined
        }
      ]" @update:model-value="setLocale($event as 'id' | 'en')" />

      <UColorModeButton />

    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from '#imports'
import { useAuthStore } from "#stores/auth";
import { id, en } from '@nuxt/ui/locale';
const { locale, setLocale } = useI18n()

const authStore = useAuthStore();

type MenuKey =
  | 'profil'
  | 'spi'
  | 'spmi'
  | 'penjaminan'
  | 'akreditasi'
  | 'informasi'

const openMenu = ref<MenuKey | null>(null)
const route = useRoute()

const toggleMenu = (name: MenuKey) => {
  openMenu.value = openMenu.value === name ? null : name
}

const closeMenu = () => {
  openMenu.value = null
}

/**
 * Cek apakah route sekarang cocok dengan salah satu path.
 * Untuk prefix: '/ami' akan match '/ami', '/ami/detail', dll.
 */
const isMatch = (paths: string | string[]) => {
  const arr = Array.isArray(paths) ? paths : [paths]

  return arr.some((p) => {
    if (p === '/') return route.path === '/'
    return route.path === p || route.path.startsWith(p + '/')
  })
}

/** Link biasa (Beranda) */
const simpleNavClass = (paths: string | string[]) =>
  isMatch(paths)
    ? 'text-sm font-semibold text-[#e30613]'
    : 'text-sm text-gray-700 hover:text-[#e30613]'

/** Tombol dropdown (Profil, SPMI, dst) */
const dropdownButtonClass = (paths: string | string[]) =>
  isMatch(paths)
    ? 'inline-flex items-center gap-1 text-sm font-semibold text-[#e30613]'
    : 'inline-flex items-center gap-1 text-sm text-gray-700 hover:text-[#e30613]'

/** Item di dalam dropdown */
const dropdownItemClass = (path: string) =>
  isMatch(path)
    ? 'block px-4 py-2 text-sm text-[#e30613] bg-red-50'
    : 'block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100'
</script>
