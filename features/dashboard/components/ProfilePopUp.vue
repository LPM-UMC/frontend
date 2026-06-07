<script setup lang="ts">
import { ref } from 'vue'
import type { RoleResponse } from '#types/role'

interface ProfileUser {
  name: string
  email: string
  role: string
  avatar: string
  online?: boolean
}

withDefaults(defineProps<{
  open: boolean
  user: ProfileUser
  roles?: RoleResponse[]
  activeRole?: RoleResponse | null
}>(), {
  open: false,
  roles: () => [],
  activeRole: null,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'signout'): void
  (e: 'changeRole', role: RoleResponse): void
}>()

const isDropdownOpen = ref(false)

function selectRole(role: RoleResponse) {
  emit('changeRole', role)
  isDropdownOpen.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[100]"
        @click.self="emit('close')"
      >
        <div
          class="absolute right-3 top-[52px] w-[min(360px,calc(100vw-24px))] rounded-[18px] bg-[#efefef] px-5 pb-5 pt-4 shadow-[0_16px_40px_rgba(0,0,0,0.28)] sm:right-5 sm:top-[80px] sm:px-6 sm:pb-6 md:right-6"
        >
          <button
            type="button"
            aria-label="Close profile dialog"
            class="absolute cursor-pointer right-4 top-3 text-[#9ca3af] transition hover:text-[#6b7280]"
            @click="emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>

          <div class="mx-auto w-fit">
            <div class="relative h-[84px] w-[84px] sm:h-[92px] sm:w-[92px]">
              <img
                :src="user.avatar"
                :alt="user.name"
                class="h-full w-full rounded-full border-[4px] border-[#f4bb71] object-cover"
              />
              <span
                v-if="user.online"
                class="absolute bottom-1 right-0.5 h-4 w-4 rounded-full border-2 border-[#efefef] bg-[#17c450]"
              />
            </div>
          </div>

          <div class="mt-4 text-center">
            <h2 class="text-[20px] font-semibold leading-tight text-[#131827] sm:text-[22px]">
              {{ user.name }}
            </h2>

            <p class="mt-1.5 break-words text-[12px] text-[#7b8493] sm:text-[13px]">
              {{ user.email }}
            </p>

            <div v-if="roles && roles.length > 1" class="relative mt-4 inline-block text-left w-full max-w-[240px] mx-auto">
              <div>
                <button
                  type="button"
                  class="inline-flex w-full cursor-pointer justify-between items-center gap-x-1.5 rounded-2xl bg-white cursor-pointer px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                  @click="isDropdownOpen = !isDropdownOpen"
                >
                  <span class="flex cursor-pointer items-center gap-1.5 text-[#de1874]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.12a7.5 7.5 0 0115 0" />
                    </svg>
                    {{ activeRole?.nama || user.role }}
                  </span>
                  <svg class="-mr-1 h-5 w-5 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': isDropdownOpen }" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="isDropdownOpen"
                  class="absolute right-0 left-0 z-50 mt-1 max-h-40 overflow-y-auto origin-top rounded-xl bg-white scrollbar-thin"
                >
                  <div class="py-1">
                    <button
                      v-for="role in roles"
                      :key="role.id"
                      type="button"
                      class="flex w-full cursor-pointer items-center px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-red- transition-colors cursor-pointer"
                      :class="{ 'bg-slate-50 text-[#de1874]': role.id === activeRole?.id }"
                      @click="selectRole(role)"
                    >
                      <span class="flex-1">{{ role.nama }}</span>
                      <svg v-if="role.id === activeRole?.id" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#de1874]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </transition>
            </div>

            <div v-else class="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#f5dce8] px-3 py-1.5 text-[12px] font-medium text-[#de1874] sm:text-[13px]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.12a7.5 7.5 0 0115 0" />
              </svg>
              <span>{{ activeRole?.nama || user.role }}</span>
            </div>

            <button
              type="button"
              class="mt-5 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[12px] bg-[#f1020a] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:brightness-95 sm:text-[15px] cursor-pointer"
              @click="emit('signout')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
