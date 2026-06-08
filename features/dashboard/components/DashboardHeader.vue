<script setup lang="ts">
import { useI18n } from '#imports'
import { navigateTo } from 'nuxt/app'
import { useAuthStore } from '#stores/auth'
import ProfilePopUp from './ProfilePopUp.vue'
import type { RoleResponse } from '#types/role'
import { getAvatar } from '#utils/util'
import { onMounted, onUnmounted, ref } from 'vue'
import { useSwitchLocalePath } from '#i18n'

const { locale, locales, setLocale } = useI18n()
const authStore = useAuthStore()

// ================= STATE =================
const openMenu = ref<'lang' | null>(null)
const isProfileOpen = ref(false)

const localeMenuRef = ref<HTMLElement | null>(null)
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

// ================= LOCALE =================
const switchLocalePath = useSwitchLocalePath()

const getLocale = async (code: "id" | "en") => {
  await navigateTo(switchLocalePath(code))
}

const localeItems = [
  { code: 'id', label: 'Indonesia' },
  { code: 'en', label: 'English' },
]

const changeLocale = async (code: string) => {
  closeMenu()
  await getLocale(code === 'en' ? 'en' : 'id')
}

const toggleMenu = (name: 'lang') => {
  openMenu.value = openMenu.value === name ? null : name
}

const closeMenu = () => {
  openMenu.value = null
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

// ================= OUTSIDE CLICK =================
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node | null
  if (!target) return

  if (localeMenuRef.value && !localeMenuRef.value.contains(target)) {
    closeMenu()
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
  <header class="fixed inset-x-0 top-0 z-50">
    <div class="border-b border-[#ececec] bg-white">
      <div class="mx-auto flex h-14.5 w-full max-w-470 items-center justify-between px-3 sm:h-21.5 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12">

        <!-- LOGO -->
        <NuxtLink to="/" class="flex min-w-0 items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-gray-200">
            <img src="/img/logo-umc.jpg" class="h-full w-full object-cover">
          </div>

          <div class="min-w-0 leading-tight">
            <span class="block truncate text-[15px] font-bold md:text-xl">
              SI-IMOET
            </span>
            <span class="hidden truncate text-[11px] text-gray-500 sm:block">
              LPM & SPI UMC
            </span>
          </div>
        </NuxtLink>

        <!-- RIGHT -->
        <div class="flex items-center gap-2">

          <!-- LANGUAGE -->
          <div dir="ltr" class="hidden items-center gap-3 md:flex">
            <ULocaleSelect :model-value="locale" :locales="locales as any" class="cursor-pointer" @update:model-value="
              setLocale(
                $event as
                | 'id'
                | 'en'
                | 'ar'
                | 'ja'
              )
              " />
          </div>

          <!-- PROFILE -->
          <button
            ref="profileRef"
            class="cursor-pointer relative h-8.5 w-8.5"
            @click.stop="toggleProfilePopup"
          >
            <img :src="user.avatar" class="rounded-full object-cover">
          </button>

        </div>
      </div>
    </div>
  </header>

  <!-- POPUP -->
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
