<template>
  <section class="mx-auto w-full max-w-380 px-3 pb-6 pt-4 sm:px-6 lg:px-8">
    <!-- Breadcrumb -->
    <div class="flex flex-wrap items-center gap-2">
      <NuxtLink :to="localePath('/dashboard/manajemen-user')">
        <button
          class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d6dae2] bg-[#efeff1] text-[#596273] shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:bg-white cursor-pointer sm:h-9 sm:w-9">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19 8 12l7-7" />
          </svg>
        </button>
      </NuxtLink>

      <nav class="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
        <template v-for="(item, index) in breadcrumbItems" :key="`${item.label}-${index}`">
          <NuxtLink v-if="item.to" :to="item.to" class="text-[#9aa2b1] transition hover:text-[#6e7788] hover:underline">
            {{ item.label }}
          </NuxtLink>

          <span v-else :class="item.active
            ? 'font-semibold text-[#e30000] underline'
            : 'text-[#9aa2b1]'
            ">
            {{ item.label }}
          </span>

          <span v-if="index !== breadcrumbItems.length - 1" class="px-1 text-[#c5cad4]">
            /
          </span>
        </template>
      </nav>
    </div>

    <!-- Hero -->
    <section :dir="isRTL ? 'rtl' : 'ltr'"
      class="mt-4 rounded-xl border border-[#dadde3] bg-[#f4f4f5] px-4 py-4 shadow-[0_1px_4px_rgba(15,23,42,0.08)] sm:px-5 sm:py-6">
      <h1 class="text-xl font-semibold text-[#11141b] sm:text-2xl lg:text-3xl">
        {{ t('manajemenUser.update.judul') }}
      </h1>

      <p class="mt-2 text-sm leading-relaxed text-[#556173] sm:text-base">
        {{ t('manajemenUser.update.deskripsi') }}
      </p>
    </section>

    <!-- Form -->
    <section
      class="mt-5 rounded-xl border border-[#dadde3] bg-[#f4f4f5] px-3 py-4 shadow-[0_1px_4px_rgba(15,23,42,0.08)] sm:px-5 sm:py-6"
      :dir="isRTL ? 'rtl' : 'ltr'">
      <form
        class="mx-auto mt-4 w-full max-w-4xl rounded-2xl border border-dashed border-[#d7dbe4] bg-[#f8f8f8] px-4 py-5 sm:px-6 sm:py-7"
        @submit.prevent="handleSubmit">
        <h3 class="text-center text-lg font-semibold text-[#151922] sm:text-xl md:text-2xl">
          {{ t('manajemenUser.update.judulForm') }}
        </h3>

        <div class="mt-5 space-y-4">

          <!-- Nama -->
          <div>
            <label class="text-sm font-semibold text-[#3f4b5f] sm:text-base">
              {{ t('manajemenUser.model.nama') }}
            </label>

            <input v-model="form.nama" disabled type="text" maxlength="30"
              class="mt-1.5 h-11 w-full cursor-not-allowed rounded-xl border border-[#d7dbe4] bg-[#eceff3] px-3 text-sm text-[#6b7280] outline-none sm:h-12 sm:px-4 sm:text-base">
          </div>

          <!-- Email -->
          <div>
            <label class="text-sm font-semibold text-[#3f4b5f] sm:text-base">
              Email
              <span class="text-[#e30000]">*</span>
            </label>

            <input v-model="form.email" type="email" maxlength="255" :placeholder="t(
              'manajemenUser.placeholder.email'
            )
              "
              class="mt-1.5 h-11 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3 text-sm sm:h-12 sm:px-4 sm:text-base">

            <p class="mt-1 flex justify-between text-xs text-[#98a1b1]">
              <span>
                {{
                  $t(
                    'manajemenUser.update.validasi.email.max'
                  )
                }}
              </span>

              <span>
                {{ form.email.length }}/255
              </span>
            </p>

            <p v-if="formErrors.email" class="mt-1 text-xs text-[#e30000] sm:text-sm">
              {{ formErrors.email }}
            </p>
          </div>

          <!-- Role -->
          <div>
            <p class="text-sm font-semibold text-[#3f4b5f] sm:text-base">
              {{
                t(
                  'manajemenUser.model.role'
                )
              }}

              <span class="text-[#e30000]">
                *
              </span>
            </p>

            <p class="mt-1 text-xs text-[#6a7384] sm:text-sm">
              {{
                $t(
                  'manajemenUser.update.validasi.roleIds.max'
                )
              }}
            </p>

            <div class="mt-3 grid gap-2 sm:gap-3 md:grid-cols-2">
              <label v-for="role in roleOptions" :key="role.value"
                class="flex cursor-pointer items-start gap-2 rounded-lg p-2 hover:bg-[#f3f4f6]">
                <input type="checkbox" :checked="isRoleSelected(
                  role.value
                )
                  " class="mt-0.5 h-4 w-4 accent-[#e30000] sm:h-5 sm:w-5" @change="
                    toggleRole(
                      role.value
                    )
                    ">

                <span class="text-sm font-medium text-[#1f2634] sm:text-base">
                  {{ role.label }}
                </span>
              </label>
            </div>

            <p class="mt-2 text-xs text-[#98a1b1] sm:text-sm">
              {{ form.role_ids.length }}/10
            </p>

            <p v-if="formErrors.role_ids" class="mt-1 text-xs text-[#e30000] sm:text-sm">
              {{ formErrors.role_ids }}
            </p>
          </div>

        </div>

        <div class="mt-6 flex justify-center gap-3">
          <NuxtLink :to="localePath('/dashboard/manajemen-user')"
            class="inline-flex h-10 min-w-28 items-center justify-center rounded-xl border border-[#d7dbe4] bg-[#f3f4f6] px-5 text-sm font-semibold text-[#1f2634] transition sm:h-11 sm:min-w-32 sm:px-6 sm:text-base hover:bg-[#e0e0e0] cursor-pointer">
            {{ t('util.batal') }}
          </NuxtLink>
          <button type="submit" :disabled="!isFormValid" :class="[
            'inline-flex h-10 min-w-28 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition sm:h-11 sm:min-w-32 sm:px-6 sm:text-base',
            isFormValid
              ? 'bg-[#e30000] hover:bg-[#c90000] cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed opacity-60'
          ]">
            {{ t('util.edit') }}
          </button>
        </div>

      </form>


      <!-- Nonaktifkan -->
      <div
        class="mx-auto mt-4 w-full max-w-4xl rounded-2xl border border-dashed border-[#d7dbe4] bg-[#f8f8f8] px-4 py-5 sm:px-6 sm:py-7">
        <h4 class="text-lg font-semibold text-[#1f2634] sm:text-xl">
          {{ t('manajemenUser.nonaktif.judul') }}
        </h4>

        <p class="mt-2 text-sm text-[#5d6778] sm:text-base">
          {{ t('manajemenUser.nonaktif.deskripsi') }}
        </p>

        <button
          class="mt-4 inline-flex h-11 items-center justify-center rounded-[14px] px-5 text-sm font-semibold cursor-pointer transition sm:h-12 sm:px-6 sm:text-base text-white bg-[#e30000] hover:bg-[#c90000]">
          {{ t('manajemenUser.nonaktif.tombol') }}
        </button>
      </div>

    </section>
  </section>
</template>

<script setup lang="ts">
import {
  computed,
  reactive,
  ref,
  watch,
} from 'vue'

import {
  navigateTo,
  useLocalePath,
  useToast,
} from '#imports'

import { useI18n } from 'vue-i18n'

import { updateUserValidation }
  from '#validations/user-validation'

import { getDashboardUserRoleOptions }
  from '../data/dashboardManajemenUserDummy'

const localePath = useLocalePath()
const toast = useToast()

const { locale, t } = useI18n()

const isRTL = computed(() =>
  locale.value.startsWith('ar'),
)

const roleOptions = ref(
  getDashboardUserRoleOptions(),
)

/**
 * Dummy Data User
 * TODO:
 * ganti dengan API
 */
const form = reactive({
  nama: 'Ahmad Fauzan',
  email: 'ahmad@example.com',
  role_ids: [
    '550e8400-e29b-41d4-a716-446655440000',
  ] as string[],
})

const formErrors = reactive({
  email: '',
  role_ids: '',
})

const breadcrumbItems = computed(() => [
  {
    label: t('navigasi.dasbor'),
    to: '/dashboard',
  },
  {
    label: t('manajemenUser.judul'),
    to: '/dashboard/manajemen-user',
  },
  {
    label: t(
      'manajemenUser.update.judul',
    ),
    active: true,
  },
])

function resetFieldError(
  field: keyof typeof formErrors,
) {
  formErrors[field] = ''
}

function validateField(
  field: keyof typeof formErrors,
) {
  resetFieldError(field)

  const schema = updateUserValidation(t)

  const result = schema.safeParse({
    email: form.email,
    role_ids: form.role_ids,
  })

  if (result.success) {
    return
  }

  const issue =
    result.error.issues.find(issue => issue.path[0] === field)

  if (issue) {
    formErrors[field] = issue.message
  }
}

function validateForm() {
  Object.keys(formErrors).forEach(
    (key) => {
      formErrors[
        key as keyof typeof formErrors
      ] = ''
    },
  )

  const schema =
    updateUserValidation(t)

  const result =
    schema.safeParse({
      email: form.email,
      role_ids: form.role_ids,
    })

  if (result.success) {
    return true
  }

  result.error.issues.forEach(
    (issue) => {
      const field =
        issue.path[0]

      if (
        field &&
        field in formErrors
      ) {
        formErrors[
          field as keyof typeof formErrors
        ] = issue.message
      }
    },
  )

  return false
}

watch(
  () => form.email,
  () => validateField('email'),
)

watch(
  () => form.role_ids,
  () => validateField('role_ids'),
  {
    deep: true,
  },
)

function isRoleSelected(
  roleId: string,
) {
  return form.role_ids.includes(
    roleId,
  )
}

function toggleRole(
  roleId: string,
) {
  const index = form.role_ids.indexOf(roleId)

  if (index >= 0) {
    form.role_ids.splice(index, 1)
  } else {
    form.role_ids.push(roleId)
  }

  validateField('role_ids')
}

const isFormValid = computed(() => {
  const schema =
    updateUserValidation(t)

  return schema.safeParse({
    email: form.email,
    role_ids: form.role_ids,
  }).success
})

async function handleSubmit() {
  const isValid = validateForm()

  if (!isValid) {
    toast.add({
      title: t('util.gagal'),
      description: t(
        'util.periksaKembaliForm',
      ),
      color: 'error',
    })

    return
  }

  /**
   * TODO
   * Integrasi API Update User
   */
  console.log(
    'Update User:',
    JSON.parse(
      JSON.stringify({
        email: form.email,
        role_ids: form.role_ids,
      }),
    ),
  )

  toast.add({
    title: t('util.berhasil'),
    description: t(
      'manajemenUser.update.berhasil',
    ),
    color: 'success',
  })

  setTimeout(async () => {
    await navigateTo(
      '/dashboard/manajemen-user',
    )
  }, 1000)
}
</script>
