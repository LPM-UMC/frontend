<script setup lang="ts">
interface ModulSidebarMenuItem {
  id: string
  label: string
  to?: string
  icon: 'home' | 'modul' | 'lingkup'
}

interface ModulSidebarProfile {
  name: string
  role: string
  avatar: string
}

const props = defineProps<{
  menus: ModulSidebarMenuItem[]
  activeMenuId: string
  isCollapsed: boolean
  isMobileOpen: boolean
  profile: ModulSidebarProfile
}>()

const emit = defineEmits<{
  (event: 'menu-select', item: ModulSidebarMenuItem): void
  (event: 'close-mobile'): void
}>()

function getMenuClass(itemId: string) {
  if (props.activeMenuId === itemId) {
    return 'bg-[#e60000] text-white shadow-[0_8px_20px_rgba(230,0,0,0.22)]'
  }
  return 'text-[#4d5563] hover:bg-white'
}

function iconStrokeClass(itemId: string): string {
  return props.activeMenuId === itemId ? 'text-white' : 'text-[#3b4452]'
}

function handleMenuSelect(item: ModulSidebarMenuItem) {
  emit('menu-select', item)
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isMobileOpen"
      class="fixed inset-0 z-40 bg-black/40 lg:hidden"
      @click.self="emit('close-mobile')"
    >
      <aside class="h-full w-[330px] max-w-[90vw] border-r border-[#d4d4d6] bg-[#ececec]">
        <div class="flex h-[66px] items-center justify-between border-b border-[#d7d7d9] bg-[#f0f1f3] px-4">
          <p class="text-[13px] font-semibold tracking-wide text-[#4f5664]">
            MENU MODUL
          </p>
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#d8d8da] bg-white text-[#4d5563] shadow-[0_8px_20px_rgba(15,23,42,0.12)] transition hover:bg-[#f6f7f8]"
            aria-label="Tutup menu"
            @click="emit('close-mobile')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div class="h-[calc(100vh-66px)] overflow-y-auto px-3 py-4">
          <p class="mb-5 text-[14px] font-semibold tracking-wide text-[#71767f]">
            GENERAL
          </p>

          <div class="space-y-3">
            <button
              v-for="item in menus"
              :key="`mobile-${item.id}`"
              type="button"
              class="relative flex w-full items-center gap-3 rounded-[14px] px-4 py-3.5 text-left text-[15px] font-medium transition"
              :class="getMenuClass(item.id)"
              @click="handleMenuSelect(item)"
            >
              <span
                v-if="activeMenuId === item.id"
                class="absolute -left-4 top-1/2 h-11 w-[5px] -translate-y-1/2 rounded-r-[8px] bg-[#e60000]"
              />

              <span class="inline-flex h-9 w-9 items-center justify-center" :class="iconStrokeClass(item.id)">
                <svg
                  v-if="item.icon === 'home'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.7"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1v-10.5z" />
                </svg>

                <svg
                  v-else-if="item.icon === 'modul'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.7"
                >
                  <rect x="5" y="3" width="14" height="18" rx="2" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6M9 11h6M9 15h6" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8h2M3 12h2M3 16h2" />
                </svg>

                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.7"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 12A4.5 4.5 0 1 1 12 16.5M7.5 12a4.5 4.5 0 0 0 7.517 3.287M7.5 12H4.75M15.017 15.287l2.233 2.233M3.5 20.5l4.096-4.096" />
                </svg>
              </span>

              <span>{{ item.label }}</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  </Transition>

  <aside
    class="fixed inset-y-0 left-0 top-[66px] z-20 hidden h-[calc(100vh-66px)] border-r border-[#d6d6d8] bg-[#ececec] transition-[width] duration-300 lg:flex lg:flex-col"
    :class="isCollapsed ? 'w-[84px]' : 'w-[290px]'"
  >
    <div class="flex-1 overflow-y-auto py-7" :class="isCollapsed ? 'px-3' : 'px-5'">
      <p
        v-if="!isCollapsed"
        class="mb-5 text-[12px] font-semibold tracking-wide text-[#71767f]"
      >
        GENERAL
      </p>

      <div class="space-y-1">
        <button
          v-for="item in menus"
          :key="item.id"
          type="button"
          class="relative flex items-center rounded-[14px] text-left transition"
          :class="[
            getMenuClass(item.id),
            isCollapsed
              ? 'mx-auto h-12 w-12 justify-center rounded-[12px] px-0 py-0'
              : 'w-full gap-2 px-3 py-3 text-[12px] font-medium',
          ]"
          @click="handleMenuSelect(item)"
        >
          <span
            v-if="activeMenuId === item.id && !isCollapsed"
            class="absolute -left-5 top-1/2 h-11 w-[5px] -translate-y-1/2 rounded-r-[8px] bg-[#e60000]"
          />

          <span class="inline-flex h-9 w-9 items-center justify-center" :class="iconStrokeClass(item.id)">
            <svg
              v-if="item.icon === 'home'"
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.7"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1v-10.5z" />
            </svg>

            <svg
              v-else-if="item.icon === 'modul'"
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.7"
            >
              <rect x="5" y="3" width="14" height="18" rx="2" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6M9 11h6M9 15h6" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8h2M3 12h2M3 16h2" />
            </svg>

            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.7"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 12A4.5 4.5 0 1 1 12 16.5M7.5 12a4.5 4.5 0 0 0 7.517 3.287M7.5 12H4.75M15.017 15.287l2.233 2.233M3.5 20.5l4.096-4.096" />
            </svg>
          </span>

          <span v-if="!isCollapsed">{{ item.label }}</span>
        </button>
      </div>
    </div>

    <div class="border-t border-[#d7d7d9]" :class="isCollapsed ? 'px-2 py-3' : 'p-3'">
      <div class="flex items-center rounded-[18px] border border-[#d7d7d9] bg-[#f4f4f4]" :class="isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-2'">
        <img
          :src="profile.avatar"
          :alt="profile.name"
          class="h-12 w-12 rounded-[12px] object-cover"
        >
        <div v-if="!isCollapsed" class="min-w-0">
          <p class="truncate text-[14px] font-semibold leading-[1.1] text-[#3b3f47]">
            {{ profile.name }}
          </p>
          <p class="text-[13px] text-[#91959d]">
            {{ profile.role }}
          </p>
        </div>
      </div>
    </div>
  </aside>
</template>
