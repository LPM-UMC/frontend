<script setup lang="ts">
import { useI18n } from '#imports'
import { navigateTo } from 'nuxt/app'
import { useAuthStore } from '#stores/auth'
import ProfilePopUp from './ProfilePopUp.vue'
import type { RoleResponse } from '#types/role'
import { getAvatar } from '#utils/util'
import { onMounted, onUnmounted, ref } from 'vue'
import { useLocalePath } from '#imports'
import { en, id, ar, ja } from '@nuxt/ui/locale'

const { locale, setLocale } = useI18n()
const localePath = useLocalePath()
const authStore = useAuthStore()

const locales = [id, en, ar, ja]

async function changeLocale(lang: 'id' | 'en' | 'ar' | 'ja') {
  await setLocale(lang)
  isMobileMenuOpen.value = false
}

// ================= STATE =================
const isProfileOpen = ref(false)
const isMobileMenuOpen = ref(false)
const profileRef = ref<HTMLElement | null>(null)

// ✅ FIX TYPE
const user = ref({
  id: '',
  name: '',
  email: '',
  roles: [] as RoleResponse[],
  avatar: '',
  isOnline: false,
})

// ================= ROLE =================
const handleChangeRole = (role: RoleResponse) => {
  authStore.setActiveRole(role)
}

// ================= PROFILE =================
function toggleProfilePopup() {
  isProfileOpen.value = !isProfileOpen.value
}

function closeProfilePopup() {
  isProfileOpen.value = false
}

async function handleSignOut() {
  isProfileOpen.value = false
  await authStore.logout()
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// ================= OUTSIDE CLICK =================
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node | null
  if (!target) return

  // Removed localeMenuRef outside click check because ULocaleSelect handles its own.
  if (profileRef.value && !profileRef.value.contains(target)) {
    // profile popup has its own close logic or we could add it here
  }
}

// ================= INIT =================
onMounted(async () => {
  document.addEventListener('click', handleClickOutside)

  await authStore.initAuth()

  if (!authStore.user) return

  user.value = {
    id: authStore.user.id,
    name: authStore.user.nama,
    email: authStore.user.email ?? '', // ✅ FIX
    roles: authStore.roles ?? [], // ✅ FIX
    avatar: getAvatar(authStore.user.nama, authStore.user.picture),
    isOnline: true,
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 w-screen" dir="ltr">
    <div class="border-b border-[#ececec] bg-white">
      <div
        class="flex h-14 items-center justify-between border-b border-[#d7d7d9] bg-[#f0f1f3] px-3 sm:h-15 sm:px-4 md:h-16"
      >
        <NuxtLink :to="localePath('/')" class="flex min-w-0 items-center gap-2 sm:gap-3 ml-7">
          <img
            src="/img/logo-umc.jpg"
            alt="Logo UMC"
            class="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10 md:h-11 md:w-11"
          >

          <div
            class="min-w-0 leading-tight"
            :class="locale === 'ar' ? 'text-right' : 'text-left'"
            :dir="locale === 'ar' ? 'rtl' : 'ltr'"
          >
            <span class="block truncate text-[14px] font-bold text-red-700 sm:text-[15px] md:text-[17px]">
              SI-IMOET
            </span>
            <span class="hidden truncate text-[10px] font-semibold text-gray-500 sm:block md:text-[11px]">
              LPM &amp; SPI UMC
            </span>
          </div>
        </NuxtLink>

        <div class="hidden items-center gap-2 md:flex mr-4 md:mr-8 lg:mr-12">
          <ULocaleSelect
            :model-value="locale"
            :locales="locales"
            class="min-w-fit"
            @update:model-value="setLocale($event as 'id' | 'en' | 'ar' | 'ja')"
          />

          <button
            ref="profileRef"
            type="button"
            aria-label="Open profile"
            class="relative h-9 w-9 cursor-pointer rounded-full"
            @click.stop="toggleProfilePopup"
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

        <div class="flex items-center gap-2 md:hidden">
          <button
            type="button"
            class="relative h-8.5 w-8.5 cursor-pointer rounded-full"
            @click="toggleProfilePopup"
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

          <button
            type="button"
            class="grid h-8.5 w-8.5 cursor-pointer place-items-center rounded-md border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-100"
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
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
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
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>

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
      nama: user.name,
      email: user.email,
      roles: user.roles,
      avatar: user.avatar,
      online: user.isOnline,
      activeRole: authStore.activeRole,
    }"
    :roles="authStore.roles"
    @change-role="handleChangeRole"
    @close="closeProfilePopup"
    @signout="handleSignOut"
  />
</template>