<template>
  <!-- MOBILE SIDEBAR (Drawer) -->
  <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="isMobileOpen" class="fixed inset-0 z-50 bg-black/40 lg:hidden" @click.self="emit('close-mobile')">
      <aside class="flex h-full w-72 max-w-[82vw] flex-col border-r border-[#d4d4d6] bg-[#ececec]">
        <!-- Header Mobile -->
        <div class="flex h-14 items-center justify-between border-b border-[#d7d7d9] bg-[#f0f1f3] px-3">
          <p class="text-[12px] font-bold tracking-tight text-red-800">
            SI-IMOET
          </p>

          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d8d8da] bg-white text-[#4d5563] transition hover:bg-gray-50"
            @click="emit('close-mobile')">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <!-- Menu Content -->
        <div class="flex-1 overflow-y-auto p-3">
          <p class="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#71767f] select-none">
            {{ $t('util.menu') }}
          </p>

          <div class="space-y-1.5">
            <button v-for="item in menus" :key="`mob-${item.id}`"
              class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all active:scale-[0.98] cursor-pointer"
              :class="getMenuClass(item.id)" @click="handleMenuSelect(item)">
              <UIcon :name="iconMap[item.icon]" class="h-5 w-5 shrink-0" />

              <span class="truncate cursor-pointer">
                {{ item.label }}
              </span>
            </button>
          </div>
        </div>

        <!-- Bottom Actions Mobile -->
        <div class="space-y-2 border-t border-[#d7d7d9] p-3">

          <ULocaleSelect :model-value="locale" :locales="locales" class="cursor-pointer"
            @update:model-value="setLocale($event as 'id' | 'en' | 'ar' | 'ja')" />
          <!-- Logout -->
          <button
            class="flex w-full items-center gap-3 rounded-2xl border border-[#d7d7d9] bg-[#f4f4f4] p-1.5 transition-colors hover:bg-red-50"
            @click="handleLogout">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>

            <span class="text-[13px] font-semibold text-[#3b3f47]">
              {{ $t('navigasi.keluar') }}
            </span>
          </button>

          <!-- Profile -->
          <NuxtLink :to="localePath('/profile')"
            class="flex w-full items-center gap-3 rounded-2xl border border-[#d7d7d9] bg-[#f4f4f4] p-1.5 transition-all hover:bg-white">
            <img :src="profile.avatar" class="h-10 w-10 rounded-xl object-cover">

            <div class="min-w-0 text-left">
              <p class="truncate text-[12px] font-bold leading-tight text-[#3b3f47]">
                {{ profile.name }}
              </p>

              <p class="truncate text-[10px] text-[#91959d]">
                {{ profile.role }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </aside>
    </div>
  </Transition>

  <!-- DESKTOP SIDEBAR -->
  <aside
    class="fixed inset-y-0 left-0 top-16.5 z-20 hidden h-[calc(100vh-66px)] flex-col border-r border-[#d6d6d8] bg-[#ececec] transition-all duration-300 lg:flex"
    :class="isCollapsed ? 'w-20' : 'w-72'">
    <div class="flex-1 overflow-y-auto py-6" :class="isCollapsed ? 'px-2' : 'px-4'">
      <p v-if="!isCollapsed"
        class="mb-4 px-2 text-[11px] font-bold uppercase tracking-widest text-[#71767f] select-none">
        {{ $t('util.menu') }}
      </p>

      <div class="space-y-1.5">
        <template v-for="item in menus" :key="item.id">
          <!-- Collapsed -->
          <UTooltip v-if="isCollapsed" :text="item.label" :delay-duration="0"
            :content="{ side: 'right', sideOffset: 8 }">
            <button class="flex h-12 w-12 items-center justify-center rounded-xl transition-all active:scale-95 mx-auto"
              :class="getMenuClass(item.id)" @click="handleMenuSelect(item)">
              <UIcon :name="iconMap[item.icon]" class="h-5 w-5" />
            </button>
          </UTooltip>

          <!-- Normal -->
          <button v-else
            class="group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13.5px] font-semibold transition-all active:scale-95 cursor-pointer"
            :class="getMenuClass(item.id)" @click="handleMenuSelect(item)">
            <span v-if="activeMenuId === item.id" class="absolute -left-4 h-8 w-1.5 rounded-r-full bg-[#e60000]" />

            <UIcon :name="iconMap[item.icon]" class="h-5 w-5 shrink-0" />

            <span class="truncate">
              {{ item.label }}
            </span>
          </button>
        </template>
      </div>
    </div>

    <!-- Desktop Bottom -->
    <div class="space-y-1.5 p-2">
      <!-- Logout -->
      <button class="group flex w-full items-center gap-2.5 rounded-xl p-1.5 transition hover:bg-red-50 active:scale-95 cursor-pointer"
        @click="handleLogout">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition-colors group-hover:bg-white">
          <UIcon name="i-lucide-log-out" class="h-5 w-5" />
        </div>

        <div v-if="!isCollapsed" class="overflow-hidden text-left">
          <p class="text-sm font-bold leading-tight text-red-500">
            {{ $t('navigasi.keluar') }}
          </p>
        </div>
      </button>

      <!-- Profile -->
      <div class="border-t border-[#d7d7d9] pt-1.5">
        <NuxtLink :to="localePath('/profile')" class="block">
          <div
            class="flex items-center gap-2.5 rounded-xl border border-[#d7d7d9] bg-[#f4f4f4] p-1.5 transition-all hover:bg-white active:scale-95">
            <img :src="profile.avatar" class="h-9 w-9 rounded-lg object-cover border border-black/5">

            <div v-if="!isCollapsed" class="min-w-0">
              <p class="truncate text-[12px] font-bold text-[#3b3f47]">
                {{ profile.name }}
              </p>
              <p class="truncate text-[10px] text-[#91959d]">
                {{ profile.role }}
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { MenuItem } from '../../layouts/manajemen-user-role'
import { en, id, ar, ja } from '@nuxt/ui/locale'
const { locale, setLocale } = useI18n()

const locales = [
  id,
  en,
  ar,
  ja,
]

const localePath = useLocalePath()

const iconMap: Record<string, string> = {
  home: 'i-lucide-home',
  user: 'i-lucide-user',
  role: 'i-lucide-shield',
  modul: 'i-lucide-layout-grid'
}

interface SidebarProfile {
  name: string
  role: string
  avatar: string
}

const props = defineProps<{
  menus: MenuItem[]
  activeMenuId: string
  isCollapsed: boolean
  isMobileOpen: boolean
  profile: SidebarProfile
}>()

const emit = defineEmits<{
  (event: 'menu-select', item: MenuItem): void
  (event: 'close-mobile' | 'logout'): void
}>()

function getMenuClass(itemId: string) {
  if (props.activeMenuId === itemId) {
    return 'bg-[#e60000] text-white shadow-[0_8px_20px_rgba(230,0,0,0.22)]'
  }
  return 'text-[#4d5563] hover:bg-white'
}

function handleMenuSelect(item: MenuItem) {
  emit('menu-select', item)
}

function handleLogout() {
  emit('logout')
}
</script>
