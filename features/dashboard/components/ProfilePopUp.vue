<script setup lang="ts">
import { ref } from 'vue'
import type { RoleResponse } from '#types/role'

interface ProfileUser {
  nama: string;
  email: string;
  roles: RoleResponse[] | [];
  avatar: string;
  online?: boolean;
  activeRole: RoleResponse | null;
}

withDefaults(defineProps<{
  open?: boolean
  user: ProfileUser
  roles: RoleResponse[]
}>(), {
  open: false,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'signout'): void
  (e: 'change-role', role: RoleResponse): void
}>()

const isRoleOpen = ref(false)

const selectRole = (role: RoleResponse) => {
  emit('change-role', role)
  isRoleOpen.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="open" class="fixed inset-0 z-100" @click.self="emit('close')">
        <div
          class="absolute right-3 top-13 w-[min(360px,calc(100vw-24px))] rounded-[18px] bg-[#efefef] px-5 pb-5 pt-4 shadow-[0_16px_40px_rgba(0,0,0,0.28)] sm:right-5 sm:top-20 sm:px-6 sm:pb-6 md:right-6">
          <!-- CLOSE -->
          <button type="button" aria-label="Close profile dialog"
            class="cursor-pointer absolute right-4 top-3 text-[#9ca3af] transition hover:text-[#6b7280]"
            @click="emit('close')">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>

          <!-- AVATAR -->
          <div class="mx-auto w-fit">
            <div class="relative h-21 w-21 sm:h-23 sm:w-23">
              <img :src="user.avatar" :alt="user.nama"
                class="h-full w-full rounded-full border-4 border-[#f4bb71] object-cover">
              <span v-if="user.online"
                class="absolute bottom-1 right-0.5 h-4 w-4 rounded-full border-2 border-[#efefef] bg-[#17c450]" />
            </div>
          </div>

          <!-- INFO -->
          <div class="mt-4 text-center">
            <h2 class="text-[20px] font-semibold leading-tight text-[#131827] sm:text-[22px]">
              {{ user.nama }}
            </h2>

            <p class="mt-1.5 wrap-break-word text-[12px] text-[#7b8493] sm:text-[13px]">
              {{ user.email }}
            </p>

            <div class="relative mt-4 inline-block">
              <button type="button"
                class="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#f5dce8] px-3 py-1.5 text-[12px] font-medium text-[#de1874] sm:text-[13px]"
                @click="isRoleOpen = !isRoleOpen">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.12a7.5 7.5 0 0115 0" />
                </svg>

                <span>{{ user.activeRole?.nama || '-' }}</span>

                <!-- arrow -->
                <UIcon name="i-lucide-chevron-down" class="h-3.5 w-3.5 transition-transform"
                  :class="isRoleOpen ? 'rotate-180' : ''" />
              </button>

              <!-- DROPDOWN -->
              <div v-if="isRoleOpen"
                class="absolute left-1/2 z-20 mt-2 w-44 -translate-x-1/2 overflow-y-auto max-h-40 rounded-[10px] border border-gray-200 bg-white shadow-lg">
                <button v-for="role in roles" :key="role.id"
                  class="cursor-pointer block w-full px-3 py-2 text-left text-[13px] text-gray-700 transition hover:bg-gray-100"
                  @click="selectRole(role)">
                  {{ role.nama }}
                </button>
              </div>
            </div>

            <!-- SIGN OUT -->
            <button type="button"
              class="cursor-pointer mt-5 flex w-full items-center justify-center gap-1.5 rounded-[12px] bg-[#f1020a] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:brightness-95 sm:text-[15px]"
              @click="emit('signout')">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
