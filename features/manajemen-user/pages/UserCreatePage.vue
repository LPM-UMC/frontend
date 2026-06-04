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
        {{ t('manajemenUser.create.judul') }}
      </h1>

      <p class="mt-2 text-sm leading-relaxed text-[#556173] sm:text-base">
        {{ t('manajemenUser.create.deskripsi') }}
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
          {{ t('manajemenUser.create.judulForm') }}
        </h3>

        <div class="mt-5 space-y-4">

          <!-- NIDN -->
          <div>
            <label class="text-sm font-semibold text-[#3f4b5f] sm:text-base">
              NIDN
            </label>

            <input v-model="form.nidn" type="text" maxlength="20" :placeholder="t('manajemenUser.placeholder.nidn')"
              class="mt-1.5 h-11 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3 text-sm sm:h-12 sm:px-4 sm:text-base">

            <p class="mt-1 flex justify-between text-xs text-[#98a1b1]">
              <span>{{ $t('manajemenUser.create.validasi.nidn.max') }}</span>
              <span>{{ form.nidn.length }}/20</span>
            </p>

            <p v-if="formErrors.nidn" class="mt-1 text-xs text-[#e30000] sm:text-sm">
              {{ formErrors.nidn }}
            </p>
          </div>

          <!-- NIM -->
          <div>
            <label class="text-sm font-semibold text-[#3f4b5f] sm:text-base">
              NIM
            </label>

            <input v-model="form.nim" type="text" maxlength="20" :placeholder="t('manajemenUser.placeholder.nim')"
              class="mt-1.5 h-11 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3 text-sm sm:h-12 sm:px-4 sm:text-base">

            <p class="mt-1 flex justify-between text-xs text-[#98a1b1]">
              <span>{{ $t('manajemenUser.validations.create.nim.max') }}</span>
              <span>{{ form.nim.length }}/20</span>
            </p>

            <p v-if="formErrors.nim" class="mt-1 text-xs text-[#e30000] sm:text-sm">
              {{ formErrors.nim }}
            </p>
          </div>

          <!-- Nama -->
          <div>
            <label class="text-sm font-semibold text-[#3f4b5f] sm:text-base">
              {{ t('manajemenUser.model.nama') }}
              <span class="text-[#e30000]">*</span>
            </label>

            <input v-model="form.nama" type="text" maxlength="30" :placeholder="t('manajemenUser.placeholder.nama')"
              class="mt-1.5 h-11 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3 text-sm sm:h-12 sm:px-4 sm:text-base">

            <p class="mt-1 flex justify-between text-xs text-[#98a1b1]">
              <span>{{ $t('manajemenUser.create.validasi.nama.max') }}</span>
              <span>{{ form.nama.length }}/30</span>
            </p>

            <p v-if="formErrors.nama" class="mt-1 text-xs text-[#e30000] sm:text-sm">
              {{ formErrors.nama }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label class="text-sm font-semibold text-[#3f4b5f] sm:text-base">
              Email
              <span class="text-[#e30000]">*</span>
            </label>

            <input v-model="form.email" type="email" maxlength="255" :placeholder="t('manajemenUser.placeholder.email')"
              class="mt-1.5 h-11 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3 text-sm sm:h-12 sm:px-4 sm:text-base">

            <p class="mt-1 flex justify-between text-xs text-[#98a1b1]">
              <span>{{ $t('manajemenUser.create.validasi.email.max') }}</span>
              <span>{{ form.email.length }}/255</span>
            </p>

            <p v-if="formErrors.email" class="mt-1 text-xs text-[#e30000] sm:text-sm">
              {{ formErrors.email }}
            </p>
          </div>

          <!-- Role -->
          <div>
            <p class="text-sm font-semibold text-[#3f4b5f] sm:text-base">
              {{ t('manajemenUser.model.role') }}
              <span class="text-[#e30000]">*</span>
            </p>

            <p class="mt-1 text-xs text-[#6a7384] sm:text-sm">
              {{ $t('manajemenUser.create.validasi.roleIds.max') }}
            </p>

            <div class="mt-3 grid gap-2 sm:gap-3 md:grid-cols-2">
              <label v-for="role in roleOptions" :key="role.value"
                class="flex cursor-pointer items-start gap-2 rounded-lg p-2 hover:bg-[#f3f4f6]">
                <input type="checkbox" :checked="isRoleSelected(role.value)"
                  class="mt-0.5 h-4 w-4 accent-[#e30000] sm:h-5 sm:w-5" @change="toggleRole(role.value)">

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
            {{ t('util.buat') }}
          </button>
        </div>

      </form>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { navigateTo, useLocalePath, useToast } from '#imports'
import { useI18n } from 'vue-i18n'
import { createUserValidation } from '#validations/user-validation'
import { getDashboardUserRoleOptions } from '../data/dashboardManajemenUserDummy'

const localePath = useLocalePath()
const toast = useToast()

const { locale, t } = useI18n()

const isRTL = computed(() =>
  locale.value.startsWith('ar'),
)

const roleOptions = ref(
  getDashboardUserRoleOptions(),
)

const form = reactive({
  nidn: '',
  nim: '',
  nama: '',
  email: '',
  role_ids: [] as string[],
})

const formErrors = reactive({
  nidn: '',
  nim: '',
  nama: '',
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
    label: t('manajemenUser.create.judul'),
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

  const schema = createUserValidation(t)

  const result = schema.safeParse(form)

  if (result.success) {
    return
  }

  const issue = result.error.issues.find(
    issue => issue.path[0] === field,
  )

  if (issue) {
    formErrors[field] = issue.message
  }
}

function validateForm() {
  Object.keys(formErrors).forEach((key) => {
    formErrors[key as keyof typeof formErrors] = ''
  })

  const schema = createUserValidation(t)

  const result = schema.safeParse(form)

  if (result.success) {
    return true
  }

  result.error.issues.forEach((issue) => {
    const field = issue.path[0]

    if (
      field &&
      field in formErrors
    ) {
      formErrors[
        field as keyof typeof formErrors
      ] = issue.message
    }
  })

  return false
}

watch(
  () => form.nidn,
  () => validateField('nidn'),
)

watch(
  () => form.nim,
  () => validateField('nim'),
)

watch(
  () => form.nama,
  () => validateField('nama'),
)

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
  return form.role_ids.includes(roleId)
}

function toggleRole(
  roleId: string,
) {
  const index =
    form.role_ids.indexOf(roleId)

  if (index >= 0) {
    form.role_ids.splice(index, 1)
  } else {
    form.role_ids.push(roleId)
  }

  validateField('role_ids')
}

const isFormValid = computed(() => {
  const schema = createUserValidation(t)

  return schema.safeParse(form).success
})

async function handleSubmit() {
  const isValid =
    validateForm()

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

  toast.add({
    title: t('util.berhasil'),
    description: t(
      'manajemenUser.validations.create.berhasil',
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
