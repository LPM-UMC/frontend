<script setup lang="ts">
import { useAuthStore } from '#stores/auth'
import type { MenuItem } from "../../layouts/manajemen-user-role"

const auth = useAuthStore();
const localePath = useLocalePath()

const iconMap: Record<string, string> = {
  home: 'i-lucide-home',
  user: 'i-lucide-user',
  role: 'i-lucide-shield',
  modul: 'i-lucide-layout-grid',
}

interface SidebarProfile {
  name: string;
  role: string;
  avatar: string;
};

const props = defineProps<{
  menus: MenuItem[];
  activeMenuId: string;
  isCollapsed: boolean;
  isMobileOpen: boolean;
  profile: SidebarProfile;
}>();

const emit = defineEmits<{
  (event: 'menu-select', item: MenuItem): void
  (event: 'close-mobile'): void
  (event: 'logout'): void
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

const handleLogout = async () => {
  await auth.logout()
}
</script>

<template>
  <!-- MOBILE SIDEBAR (Drawer) -->
  <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="isMobileOpen" class="fixed inset-0 z-50 bg-black/40 lg:hidden" @click.self="emit('close-mobile')">
      <!-- Overlay sebaiknya cursor-pointer agar tahu bisa diklik untuk tutup -->
      <aside class="flex h-full w-80 max-w-[85vw] flex-col border-r border-[#d4d4d6] bg-[#ececec]">
        <!-- Header Mobile -->
        <div class="flex h-16 items-center justify-between border-b border-[#d7d7d9] bg-[#f0f1f3] px-4">
          <p class="text-sm font-bold tracking-tight text-[#4f5664]">SI IMUT</p>
          <button
            class="cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-[#d8d8da] text-[#4d5563] transition hover:bg-gray-50"
            @click="emit('close-mobile')">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <!-- Menu Content -->
        <div class="flex-1 overflow-y-auto p-4">
          <p class="mb-4 text-[11px] font-bold uppercase tracking-widest text-[#71767f] select-none">Utama</p>
          <div class="space-y-2">
            <button v-for="item in menus" :key="`mob-${item.id}`"
              class="cursor-pointer flex w-full items-center gap-4 rounded-xl px-4 py-3 text-[15px] font-medium transition-all active:scale-[0.98]"
              :class="getMenuClass(item.id)" @click="handleMenuSelect(item)">
              <UIcon :name="iconMap[item.icon]" class="h-6 w-6" />
              <span>{{ item.label }}</span>
            </button>
          </div>
        </div>

        <!-- Bottom Actions Mobile -->
        <div class="space-y-2 border-t border-[#d7d7d9] p-4">
          <button
            class="cursor-pointer flex w-full items-center gap-4 rounded-[18px] border border-[#d7d7d9] bg-[#f4f4f4] p-2 hover:bg-red-50 transition-colors"
            @click="handleLogout">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/50 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span class="font-semibold text-[#3b3f47]">Keluar Akun</span>
          </button>

          <NuxtLink :to="localePath('/profile')"
            class="cursor-pointer flex w-full items-center gap-4 rounded-[18px] border border-[#d7d7d9] bg-[#f4f4f4] p-2 hover:bg-white transition-all">
            <img :src="profile.avatar" class="h-12 w-12 rounded-xl object-cover">
            <div class="text-left">
              <p class="text-sm font-bold text-[#3b3f47] leading-tight">{{ profile.name }}</p>
              <p class="text-xs text-[#91959d]">{{ profile.role }}</p>
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
        Menu Navigasi
      </p>

      <div class="space-y-1.5">

        <!-- LOOP MENU -->
        <template v-for="item in menus" :key="item.id">

          <!-- SAAT COLLAPSE → PAKAI TOOLTIP -->
          <UTooltip v-if="isCollapsed" :text="item.label" :delay-duration="0"
            :content="{ side: 'right', sideOffset: 8 }">
            <button
              class="cursor-pointer flex items-center transition-all active:scale-95 h-12 w-12 mx-auto justify-center rounded-xl"
              :class="getMenuClass(item.id)" @click="handleMenuSelect(item)">
              <div class="flex h-6 w-6 items-center justify-center">
                <UIcon :name="iconMap[item.icon]" class="h-5 w-5" />
              </div>
            </button>
          </UTooltip>

          <!-- SAAT NORMAL -->
          <button v-else
            class="cursor-pointer group relative flex items-center transition-all active:scale-95 w-full gap-3 px-3 py-3 rounded-xl text-[13.5px] font-semibold"
            :class="getMenuClass(item.id)" @click="handleMenuSelect(item)">
            <span v-if="activeMenuId === item.id" class="absolute -left-4 h-8 w-1.5 rounded-r-full bg-[#e60000]" />

            <div class="flex h-6 w-6 shrink-0 items-center justify-center">
              <UIcon :name="iconMap[item.icon]" class="h-5 w-5" />
            </div>

            <span class="truncate">{{ item.label }}</span>
          </button>

        </template>
      </div>
    </div>

    <!-- Area Profile & Logout (Desktop) -->
    <div class="p-2 space-y-1.5">
      <component :is="isCollapsed ? UTooltip : 'div'" v-bind="isCollapsed
        ? { text: 'Logout', delayDuration: 0, content: { side: 'right', sideOffset: 8 } }
        : {}">
        <button
          class="cursor-pointer group flex w-full items-center rounded-xl transition hover:bg-red-50 active:scale-95"
          :class="isCollapsed ? 'justify-center p-1' : 'gap-2.5 p-1.5'" @click="handleLogout">
          <div
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg group-hover:bg-white text-red-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>

          <div v-if="!isCollapsed" class="text-left overflow-hidden">
            <p class="text-red-500 text-sm font-bold leading-tight">Logout</p>
          </div>
        </button>
      </component>

      <div class="border-t border-[#d7d7d9] pt-1.5">
        <!-- COLLAPSED (pakai tooltip) -->
        <UTooltip v-if="isCollapsed" :text="$t('profil')" :delay-duration="0"
          :content="{ side: 'right', sideOffset: 8 }">
          <NuxtLink :to="localePath('/profile')" class="cursor-pointer block">
            <div
              class="flex items-center justify-center p-1 rounded-xl border border-[#d7d7d9] bg-[#f4f4f4] transition-all hover:bg-white active:scale-95">
              <img :src="profile.avatar" class="h-9 w-9 shrink-0 rounded-lg object-cover border border-black/5">
            </div>
          </NuxtLink>
        </UTooltip>
        <!-- NORMAL -->
        <NuxtLink v-else :to="localePath('/profile')" class="cursor-pointer block">
          <div
            class="flex items-center gap-2.5 p-1.5 rounded-xl border border-[#d7d7d9] bg-[#f4f4f4] transition-all hover:bg-white active:scale-95">
            <img :src="profile.avatar" class="h-9 w-9 shrink-0 rounded-lg object-cover border border-black/5">

            <div class="min-w-0">
              <p class="truncate text-[12px] font-bold text-[#3b3f47] leading-tight">
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
