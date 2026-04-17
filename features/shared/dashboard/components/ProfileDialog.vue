<script setup lang="ts">
import type { DashboardUser } from '../types/dashboard'

interface Props {
  isOpen: boolean
  user: DashboardUser
  roleLabel: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'sign-out'): void
}>()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        id="profile-dialog-overlay"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-5"
        style="background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(2px);"
        @click.self="emit('close')"
      >
        <div
          id="profile-dialog-card"
          class="relative w-full max-w-[420px] max-h-[85vh] overflow-y-auto rounded-[28px] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.24)]"
          @click.stop
        >
          <!-- Close button -->
          <button
            id="btn-close-profile"
            type="button"
            aria-label="Close dialog"
            class="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-400 transition-colors duration-150 hover:bg-white hover:text-slate-600"
            @click="emit('close')"
          >
            <svg viewBox="0 0 24 24" class="h-5 w-5">
              <path
                d="M18 6L6 18M6 6l12 12"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>

          <div class="flex flex-col items-center px-8 pb-10 pt-12 text-center">
            <!-- Avatar with golden ring -->
            <div class="relative mb-6 shrink-0" style="width: 140px; height: 140px;">
              <div
                class="overflow-hidden rounded-full border-[6px] border-[#f4b86e] shadow-[0_8px_24px_rgba(244,184,110,0.35)]"
                style="width: 140px; height: 140px;"
              >
                <img
                  :src="user.avatar"
                  :alt="user.name"
                  style="width: 128px; height: 128px; object-fit: cover; display: block;"
                />
              </div>
              <span
                v-if="user.isOnline"
                class="absolute rounded-full border-[4px] border-white bg-[#18c14a]"
                style="bottom: 12px; right: 12px; width: 20px; height: 20px;"
              />
            </div>

            <!-- Name -->
            <h2
              id="profile-dialog-name"
              class="mb-1.5 text-2xl font-bold text-slate-900"
            >
              {{ user.name }}
            </h2>

            <!-- Email -->
            <p class="mb-5 text-sm text-slate-500">
              {{ user.email }}
            </p>

            <!-- Role badge -->
            <div class="mb-8 inline-flex items-center gap-2 rounded-full bg-[#fce8f3] px-5 py-2.5 text-sm font-semibold text-[#e4117d]">
              <svg viewBox="0 0 24 24" class="h-4 w-4">
                <path
                  d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                />
              </svg>
              <span>{{ roleLabel }}</span>
            </div>

            <!-- Sign out button -->
            <button
              id="btn-sign-out"
              type="button"
              class="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#e10600] px-6 py-4 text-base font-bold text-white shadow-[0_4px_16px_rgba(225,6,0,0.3)] transition-all duration-200 hover:bg-[#c10510] hover:shadow-[0_6px_20px_rgba(225,6,0,0.4)] active:scale-[0.98]"
              @click="emit('sign-out')"
            >
              <svg viewBox="0 0 24 24" class="h-5 w-5">
                <path
                  d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>