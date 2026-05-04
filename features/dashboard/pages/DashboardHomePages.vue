<script setup lang="ts">
import { computed, onMounted } from 'vue'
import DashboardMenuCard from '../components/DashboardMenuCard.vue'
import { useAuthStore } from '#stores/auth'
import { useI18n } from '#imports'

const { t } = useI18n()
const auth = useAuthStore()
const localePath = useLocalePath()

// ================= INIT =================
onMounted(async () => {
  if (!auth.isInitialized) {
    await auth.initAuth()
  }
})

// ================= USER =================
const userName = computed(() => auth.user?.nama ?? '-')
const roleName = computed(() => auth.activeRole?.nama ?? '-')

// ================= ALL MENUS =================
const allMenus = computed(() => [
  {
    id: 'monev',
    key: 'monev',
    title: t('modul.monev.nama'),
    description: t('modul.monev.deskripsi'),
    image: '/img/gedung-umc.jpg',
    to: localePath('/dashboard/monev'),
  },
  {
    id: 'audit',
    key: 'audit',
    title: t('modul.audit.nama'),
    description: t('modul.audit.deskripsi'),
    image: '/img/gedung-umc.jpg',
    to: localePath('/dashboard/audit'),
  },
  {
    id: 'modul',
    key: 'modul',
    title: t('modul.modul.nama'),
    description: t('modul.modul.deskripsi'),
    image: '/img/gedung-umc.jpg',
    to: localePath('/dashboard/manajemen-modul'),
  },
  {
    id: 'periode',
    key: 'periode',
    title: t('modul.periode.nama'),
    description: t('modul.periode.deskripsi'),
    image: '/img/gedung-umc.jpg',
    to: localePath('/dashboard/manajemen-periode'),
  },
  {
    id: 'user',
    key: 'user',
    title: t('modul.user.nama'),
    description: t('modul.user.deskripsi'),
    image: '/img/gedung-umc.jpg',
    to: localePath('/dashboard/manajemen-user'),
  },
])

// ================= RULES =================
const monevBlacklist = ['ketua-spi', 'admin-spi', 'spi']
const auditBlacklist = ['ketua-lpm', 'admin-lpm', 'lpm']

const modulWhitelist = [
  'ketua-lpm',
  'admin-lpm',
  'ketua-spi',
  'admin-spi',
]

// ================= FILTER =================
const menus = computed(() => {
  const roleCode = auth.activeRole?.kode

  if (!roleCode) return []

  return allMenus.value
    .filter(menu => {
      switch (menu.key) {
        case 'monev':
          return !monevBlacklist.includes(roleCode)

        case 'audit':
          return !auditBlacklist.includes(roleCode)

        case 'modul':
          return modulWhitelist.includes(roleCode)

        case 'periode':
          return modulWhitelist.includes(roleCode)

        case 'user':
          return modulWhitelist.includes(roleCode)

        default:
          return false
      }
    })
    .map(menu => ({
      ...menu,
      ctaLabel: 'Masuk',
    }))
})
</script>

<template>
  <div class="h-14 w-full sm:h-16 md:h-17.5">
    <div class="h-full w-full bg-repeat-x bg-top"
      style="background-image: url('/img/batik.png'); background-size: auto clamp(72px, 8vw, 90px);" />
  </div>

  <section class="mx-auto w-full max-w-470 px-3 pb-8 pt-5 sm:px-5 sm:pt-7 md:px-6 md:pt-8 lg:px-8 xl:px-10 2xl:px-12">
    <div
      class="mb-5 rounded-[12px] border border-[#dddddd] bg-[#ececec] px-4 py-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] sm:mb-6 sm:px-6 sm:py-5 md:mb-7 md:px-7">
      <h1 class="text-[24px] font-semibold leading-tight text-[#2a2a2a] sm:text-[29px] md:text-[33px]">
        {{ $t('dasbor') }}
      </h1>

      <p class="mt-2 max-w-275 text-[13px] leading-[1.55] text-[#525b68] sm:text-[14px] md:text-[15px]">
        {{ $t('selamat_datang') }}
        <strong>{{ userName }}</strong>, {{ $t('anda_masuk_sebagai') }}
        <strong>{{ roleName }}</strong>
        {{ $t('di') }}
        {{ $t('nama_app') }}
        {{ $t('univ') }}
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3 min-[1800px]:grid-cols-4">
      <DashboardMenuCard v-for="menu in menus" :key="menu.id" :title="menu.title" :description="menu.description"
        :image="menu.image" :to="menu.to" :cta-label="menu.ctaLabel" />
    </div>
  </section>
</template>
