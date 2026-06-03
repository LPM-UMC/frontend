<template>
  <!-- Paksa header tetap LTR -->
  <header
    class="fixed inset-x-0 top-0 z-50 w-screen"
    dir="ltr"
  >
    <div class="border-b border-[#ececec] bg-white">
      <div
        class="flex h-14 items-center justify-between border-b border-[#d7d7d9] bg-[#f0f1f3] px-3 sm:h-15 sm:px-4 md:h-16"
      >
        <!-- Logo -->
        <NuxtLink
          :to="localePath('/')"
          class="flex min-w-0 items-center gap-2 sm:gap-3"
        >
          <img
            src="/img/logo-umc.jpg"
            alt="Logo UMC"
            class="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10 md:h-11 md:w-11"
          >

          <!-- hanya text yang mengikuti bahasa -->
          <div
            class="min-w-0 leading-tight"
            :class="locale === 'ar' ? 'text-right' : 'text-left'"
            :dir="locale === 'ar' ? 'rtl' : 'ltr'"
          >
            <span
              class="block truncate text-[14px] font-bold text-red-700 sm:text-[15px] md:text-[17px]"
            >
              SI-IMOET
            </span>

            <span
              class="hidden truncate text-[10px] font-semibold text-gray-500 sm:block md:text-[11px]"
            >
              LPM &amp; SPI UMC
            </span>
          </div>
        </NuxtLink>

        <!-- Desktop -->
        <div class="hidden items-center gap-2 md:flex">
          <ULocaleSelect
            :model-value="locale"
            :locales="locales"
            class="min-w-fit"
            @update:model-value="setLocale($event as 'id' | 'en' | 'ar' | 'ja')"
          />

          <button
            type="button"
            aria-label="Open profile"
            class="relative h-9 w-9 rounded-full"
            @click="openProfilePopup"
          >
            <img
              :src="user.avatar"
              :alt="user.name"
              class="h-full w-full rounded-full object-cover"
            >

            <span
              v-if="user.isOnline"
              class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#12bf4c]"
            />
          </button>
        </div>

        <!-- Mobile -->
        <div class="flex items-center gap-2 md:hidden">
          <!-- Avatar -->
          <button
            type="button"
            class="relative h-8.5 w-8.5 rounded-full"
            @click="openProfilePopup"
          >
            <img
              :src="user.avatar"
              :alt="user.name"
              class="h-full w-full rounded-full object-cover"
            >

            <span
              v-if="user.isOnline"
              class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#12bf4c]"
            />
          </button>

          <!-- Hamburger -->
          <button
            type="button"
            class="grid h-8.5 w-8.5 place-items-center rounded-md border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-100"
            :aria-expanded="isMobileMenuOpen"
            @click="toggleMobileMenu"
          >
            <svg
              v-if="!isMobileMenuOpen"
              xmlns="http://www.w3.org/2000/svg"
              class="h-4.5 w-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>

            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-4.5 w-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 6l12 12M18 6 6 18"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-if="isMobileMenuOpen"
          class="border-t border-gray-200 bg-white px-3 py-3 md:hidden"
        >
          <!-- tetap kanan tanpa ikut rtl -->
          <div class="flex justify-end" dir="ltr">
            <ULocaleSelect
              :model-value="locale"
              :locales="locales"
              @update:model-value="changeLocale($event as 'id' | 'en' | 'ar' | 'ja')"
            />
          </div>
        </div>
      </Transition>
    </div>
  </header>

  <ProfilePopUp
    :open="isProfileOpen"
    :user="{
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      online: user.isOnline,
    }"
    @close="closeProfilePopup"
    @signout="handleSignOut"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { en, id, ar, ja } from '@nuxt/ui/locale'
import { useI18n } from 'vue-i18n'
import { navigateTo } from 'nuxt/app'
import ProfilePopUp from './ProfilePopUp.vue'
import { getDashboardDummyUser } from '../data/dashboardDummy'
import { useDashboardRepository } from '../composables/useDashboardRepository'
import type { DashboardUser } from '../types/dashboard'

const { locale, setLocale } = useI18n()
const localePath = useLocalePath()
const locales = [id, en, ar, ja]
async function changeLocale(lang: 'id' | 'en' | 'ar' | 'ja') {
  await setLocale(lang)
  isMobileMenuOpen.value = false
}

const repository = useDashboardRepository('auto')

const user = ref<DashboardUser>(getDashboardDummyUser())
const isProfileOpen = ref(false)
const isMobileMenuOpen = ref(false)

function openProfilePopup() {
  isProfileOpen.value = true
}

function closeProfilePopup() {
  isProfileOpen.value = false
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

async function handleSignOut() {
  isProfileOpen.value = false
  await navigateTo(localePath('/login'))
}

onMounted(async () => {
  user.value = await repository.getCurrentUser()
})
</script>
