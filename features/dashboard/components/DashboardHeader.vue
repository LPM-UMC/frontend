<script setup lang="ts">
import ProfilePopUp from './ProfilePopUp.vue'
import { getDashboardDummyUser } from '../data/dashboardDummy'
import { useDashboardRepository } from '../composables/useDashboardRepository'
import type { DashboardLocale, DashboardUser } from '../types/dashboard'

const { locale, setLocale } = useI18n()
const repository = useDashboardRepository('auto')

const user = ref<DashboardUser>(getDashboardDummyUser())
const isLocaleMenuOpen = ref(false)
const isProfileOpen = ref(false)
const localeMenuRef = ref<HTMLElement | null>(null)

const localeOptions: Array<{ code: DashboardLocale; label: string }> = [
  { code: 'en', label: 'ENG' },
  { code: 'id', label: 'ID' },
]

const activeLocaleLabel = computed(() =>
  locale.value === 'en' ? 'ENG' : 'ID'
)

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

function openProfilePopup() {
  isProfileOpen.value = true
}

function closeProfilePopup() {
  isProfileOpen.value = false
}

async function handleSignOut() {
  isProfileOpen.value = false
  await navigateTo('/login')
}

onMounted(async () => {
  document.addEventListener('click', closeLocaleMenuOnOutsideClick)
  user.value = await repository.getCurrentUser()
})

onUnmounted(() => {
  document.removeEventListener('click', closeLocaleMenuOnOutsideClick)
})
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50">
    <div class="border-b border-[#ececec] bg-white">
      <div class="mx-auto flex h-[58px] w-full max-w-[1520px] items-center justify-between px-3 sm:h-[86px] sm:px-5 md:px-6">
        <NuxtLink to="/dashboard" class="flex min-w-0 items-center gap-2 sm:gap-3">
          <img
            src="/img/logo-umc.jpg"
            alt="Logo UMC"
            class="h-[44px] w-[44px] rounded-full object-cover sm:h-[50px] sm:w-[50px]"
          >

          <div class="min-w-0 text-[#171717]">
            <p class="truncate text-[12px] font-bold leading-[1.2] sm:text-[14px]">Lembaga Penjaminan Mutu</p>
            <p class="truncate text-[12px] font-bold leading-[1.2] sm:text-[14px]">dan Satuan Pengawas Internal</p>
            <p class="truncate text-[12px] font-bold leading-[1.2] sm:text-[14px]">Universitas Muhammadiyah Cirebon</p>
          </div>
        </NuxtLink>

        <div class="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          <button
            type="button"
            aria-label="Toggle theme"
            class="grid h-8 w-8 place-items-center rounded-full text-[#6b7280] transition hover:bg-[#f1f3f5] hover:text-[#374151]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-[17px] w-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 0111.21 3a7 7 0 109.79 9.79z" />
            </svg>
          </button>

          <div ref="localeMenuRef" class="relative">
            <button
              type="button"
              class="inline-flex h-8 items-center gap-1 rounded-[8px] px-2 text-[13px] font-medium text-[#505967] transition hover:bg-[#f1f3f5]"
              @click.stop="toggleLocaleMenu"
            >
              <span>{{ activeLocaleLabel }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-[14px] w-[14px] text-[#7b8492] transition-transform" :class="isLocaleMenuOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </button>

            <div
              v-if="isLocaleMenuOpen"
              class="absolute right-0 top-[calc(100%+7px)] z-20 w-[94px] overflow-hidden rounded-[8px] border border-[#e4e6ea] bg-[#f4f5f7] shadow-[0_8px_24px_rgba(15,23,42,0.15)]"
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
            aria-label="Open profile"
            class="relative h-[34px] w-[34px] rounded-full"
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
      </div>
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
