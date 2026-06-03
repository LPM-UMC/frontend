<template>
  <section class="mx-auto w-full max-w-380 px-4 pb-8 pt-6 sm:px-6 lg:px-8">
    <!-- Breadcrumb -->
    <div class="flex flex-wrap items-center gap-2">
      <NuxtLink :to="localePath('/dashboard')">
        <button
          class="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[#d6dae2] bg-[#efeff1] text-[#596273] shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:bg-white cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19 8 12l7-7" />
          </svg>
        </button>
      </NuxtLink>

      <nav class="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
        <template v-for="(item, index) in breadcrumbItems" :key="`${item.label}-${index}`">
          <NuxtLink v-if="item.to" :to="item.to" class="text-[#9aa2b1] hover:text-[#6e7788] transition hover:underline">
            {{ item.label }}
          </NuxtLink>

          <span v-else :class="item.active
            ? 'font-semibold text-[#e30000] underline'
            : 'text-[#9aa2b1]'">
            {{ item.label }}
          </span>

          <span v-if="index !== breadcrumbItems.length - 1" class="px-1 text-[#c5cad4]">
            /
          </span>
        </template>
      </nav>
    </div>

    <!-- Hero -->
    <section
      class="mt-5 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]"
    >
      <h1 class="text-[clamp(1.55rem,2.1vw,2rem)] font-semibold text-[#11141b]">
        {{ t('manajemenUser.create') }}
      </h1>

      <p class="mt-3 max-w-300 text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-[#556173]">
        {{ t('manajemenUser.deskripsiCreate') }}
      </p>
    </section>

    <!-- Form -->
    <section class="mt-6 rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] px-5 py-6 shadow-[0_1px_4px_rgba(15,23,42,0.08)]" >
      <form
        class="mx-auto mt-6 w-full max-w-245 rounded-[24px] border-2 border-dashed border-[#d7dbe4] bg-[#f8f8f8] px-5 py-8 sm:px-8"
        @submit.prevent="handleSubmit"
      >
        <h3 class="text-center text-[1.8rem] font-semibold text-[#151922]">
          {{ t('manajemenUser.formCreate') }}
        </h3>

        <div class="mt-7 space-y-5">

          <!-- Nama -->
          <div>
            <label class="font-semibold text-[#3f4b5f]">
              Nama<span class="text-[#e30000]">*</span>
            </label>

            <input
              v-model="form.name"
              type="text"
              maxlength="100"
              placeholder="Masukkan nama di sini"
              class="mt-2 h-14 w-full rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5"
            >

            <p class="mt-2 flex justify-between text-[0.9rem] text-[#98a1b1]">
              <span>Maks. 100 karakter</span>
              <span>{{ form.name.length }}/100</span>
            </p>

            <p
              v-if="formErrors.name"
              class="mt-1 text-sm text-[#e30000]"
            >
              {{ formErrors.name }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label class="font-semibold text-[#3f4b5f]">
              Email<span class="text-[#e30000]">*</span>
            </label>

            <input
              v-model="form.email"
              type="email"
              maxlength="100"
              placeholder="Masukkan email"
              class="mt-2 h-14 w-full rounded-[16px] border border-[#cfd5de] bg-[#f3f4f6] px-5"
            >

            <p class="mt-2 flex justify-between text-[0.9rem] text-[#98a1b1]">
              <span>Maks. 100 karakter</span>
              <span>{{ form.email.length }}/100</span>
            </p>

            <p
              v-if="formErrors.email"
              class="mt-1 text-sm text-[#e30000]"
            >
              {{ formErrors.email }}
            </p>
          </div>

          <!-- Role -->
          <div>
            <p class="font-semibold text-[#3f4b5f]">
              Pilih Role
              <span class="text-[#e30000]">*</span>
            </p>

            <p class="mt-1 text-sm text-[#6a7384]">
              Maksimal 2 role
            </p>

            <div class="mt-4 grid gap-4 md:grid-cols-2">
              <label
                v-for="role in roleOptions"
                :key="role.value"
                class="flex cursor-pointer gap-3"
              >
                <input
                  type="checkbox"
                  :checked="isRoleSelected(role.value)"
                  class="h-5 w-5 accent-[#e30000]"
                  @change="toggleRole(role.value)"
                >

                <span class="font-semibold text-[#1f2634]">
                  {{ role.label }}
                </span>
              </label>
            </div>

            <p
              v-if="formErrors.roles"
              class="mt-2 text-sm text-[#e30000]"
            >
              {{ formErrors.roles }}
            </p>
          </div>

          <!-- Catatan -->
          <div class="rounded-[12px] border border-[#f0a3a3] bg-[#fff3f3] px-4 py-3 text-[#c52222]">
            <p class="text-sm leading-relaxed">
              <span class="font-semibold">Catatan:</span>
              Role menentukan hak akses user pada modul dan data.
            </p>
          </div>

          <!-- Last Saved -->
          <p class="text-sm text-[#98a1b1]">
            Terakhir disimpan:
            {{ form.lastSavedAt }}
          </p>
        </div>

        <!-- Submit -->
        <div class="mt-7 flex justify-center">
          <button
            type="submit"
            class="inline-flex h-12 min-w-37.5 items-center justify-center rounded-[18px] bg-[#e30000] px-8 text-[1rem] font-semibold text-white shadow-[0_10px_20px_rgba(227,0,0,0.22)] transition hover:bg-[#c90000]"
          >
            Buat
          </button>
        </div>
      </form>
    </section>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { navigateTo } from '#imports'
import {
  getDashboardUserCreateDefaultForm,
  getDashboardUserRoleOptions
} from '../data/dashboardManajemenUserDummy'
import { useI18n } from 'vue-i18n'

const localePath = useLocalePath()
const { t } = useI18n()

const roleLimit = 2

const roleOptions = ref(
  getDashboardUserRoleOptions()
)

const form = reactive(
  getDashboardUserCreateDefaultForm()
)

const formErrors = reactive({
  name: '',
  email: '',
  roles: ''
})

function resetErrors() {
  formErrors.name = ''
  formErrors.email = ''
  formErrors.roles = ''
}

function validateForm() {
  resetErrors()

  if (!form.name.trim()) {
    formErrors.name = 'Nama wajib diisi'
  }

  if (!form.email.trim()) {
    formErrors.email = 'Email wajib diisi'
  }

  if (form.selectedRoles.length === 0) {
    formErrors.roles = 'Minimal 1 role'
  }

  if (form.selectedRoles.length > roleLimit) {
    formErrors.roles = 'Maksimal 2 role'
  }

  return !formErrors.name
    && !formErrors.email
    && !formErrors.roles
}

function toggleRole(roleValue: string) {
  const index =
    form.selectedRoles.indexOf(roleValue)

  if (index >= 0) {
    form.selectedRoles.splice(index,1)
    return
  }

  if (
    form.selectedRoles.length >= roleLimit
  ) return

  form.selectedRoles.push(roleValue)
}

function isRoleSelected(roleValue:string) {
  return form.selectedRoles.includes(roleValue)
}

async function navigateBack() {
  await navigateTo('/dashboard/manajemen-user')
}

async function handleSubmit() {
  if (!validateForm()) return

  await navigateTo('/dashboard/manajemen-user')
}

const breadcrumbItems = [
  {
    label: t('navigasi.dasbor'),
    to: '/dashboard',
  },
  {
    label: t('manajemenUser.judul'),
    to: '/dashboard/manajemen-user',
  },
  {
    label: t('manajemenUser.create'),
    active: true,
  },
]
</script>
