<template>
  <section class="mx-auto w-full max-w-380 px-3 pb-6 pt-4 sm:px-6 lg:px-8">
    <!-- Breadcrumb -->
    <div class="flex flex-wrap items-center gap-2">
      <NuxtLink :to="localePath('/dashboard/manajemen-role')">
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
        {{ t('manajemenRole.create.judul') }}
      </h1>

      <p class="mt-2 text-sm leading-relaxed text-[#556173] sm:text-base">
        {{ t('manajemenRole.create.deskripsi') }}
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
          {{ t('manajemenRole.create.judulForm') }}
        </h3>

        <div class="mt-5 space-y-4">

          <!-- Nama -->
          <div>
            <label class="text-sm font-semibold text-[#3f4b5f] sm:text-base">
              {{ t('manajemenRole.model.nama') }}
              <span class="text-[#e30000]">*</span>
            </label>

            <input v-model="form.nama" type="text" maxlength="25" :placeholder="t('manajemenRole.placeholder.nama')"
              class="mt-1.5 h-11 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3 text-sm sm:h-12 sm:px-4 sm:text-base">

            <p class="mt-1 flex justify-between text-xs text-[#98a1b1]">
              <span>
                {{ $t('manajemenRole.create.validasi.nama.max') }}
              </span>

              <span>
                {{ formatNumber(form.nama.length) }}/{{ formatNumber(25) }}
              </span>
            </p>

            <p v-if="formErrors.nama" class="mt-1 text-xs text-[#e30000] sm:text-sm">
              {{ formErrors.nama }}
            </p>
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="text-sm font-semibold text-[#3f4b5f] sm:text-base">
              {{ t('manajemenRole.model.deskripsi') }}
              <span class="text-[#e30000]">*</span>
            </label>

            <textarea v-model="form.deskripsi" rows="5" maxlength="255"
              :placeholder="t('manajemenRole.placeholder.deskripsi')"
              class="mt-1.5 w-full rounded-xl border border-[#cfd5de] bg-[#f3f4f6] px-3 py-3 text-sm resize-none sm:px-4 sm:text-base" />

            <p class="mt-1 flex justify-between text-xs text-[#98a1b1]">
              <span>
                {{ $t('manajemenRole.create.validasi.deskripsi.max') }}
              </span>

              <span>
                {{ formatNumber(form.deskripsi.length) }}/{{ formatNumber(255) }}
              </span>
            </p>

            <p v-if="formErrors.deskripsi" class="mt-1 text-xs text-[#e30000] sm:text-sm">
              {{ formErrors.deskripsi }}
            </p>
          </div>

        </div>

        <div class="mt-6 flex justify-center gap-3">
          <NuxtLink :to="localePath('/dashboard/manajemen-role')"
            class="inline-flex h-10 min-w-28 items-center justify-center rounded-xl border border-[#d7dbe4] bg-[#f3f4f6] px-5 text-sm font-semibold text-[#1f2634] transition hover:bg-[#e0e0e0] cursor-pointer sm:h-11 sm:min-w-32 sm:px-6 sm:text-base">
            {{ t('util.batal') }}
          </NuxtLink>

          <button type="submit" :disabled="!isFormValid" :class="[
            'inline-flex h-10 min-w-28 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition sm:h-11 sm:min-w-32 sm:px-6 sm:text-base',
            isFormValid
              ? 'bg-[#e30000] hover:bg-[#c90000] cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed opacity-60'
          ]">
            {{ t('manajemenRole.create.tombol') }}
          </button>
        </div>

      </form>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, reactive, watch, } from 'vue'
import { navigateTo, useLocalePath, useToast, } from '#imports'
import { createRoleValidation } from '#validations/role-validation'

const localePath = useLocalePath()

const toast = useToast()

const {
  locale,
  t,
} = useI18n()

const isRTL = computed(() =>
  locale.value.startsWith('ar'),
)

function formatNumber(
  value: number,
) {
  return new Intl.NumberFormat(
    locale.value.startsWith('ar')
      ? 'ar-SA'
      : locale.value.startsWith('ja')
        ? 'ja-JP'
        : locale.value.startsWith('en')
          ? 'en-US'
          : 'id-ID',
  ).format(value)
}

/* =========================
 * FORM
 * ========================= */

const form = reactive({
  nama: '',
  deskripsi: '',
})

const formErrors = reactive({
  nama: '',
  deskripsi: '',
})

/* =========================
 * BREADCRUMB
 * ========================= */

const breadcrumbItems =
  computed(() => [
    {
      label: t(
        'navigasi.dasbor',
      ),
      to: '/dashboard',
    },
    {
      label: t(
        'manajemenRole.judul',
      ),
      to: '/dashboard/manajemen-role',
    },
    {
      label: t(
        'manajemenRole.create.judul',
      ),
      active: true,
    },
  ])

/* =========================
 * VALIDATION
 * ========================= */

function resetFieldError(
  field: keyof typeof formErrors,
) {
  formErrors[field] = ''
}

function validateField(
  field: keyof typeof formErrors,
) {
  resetFieldError(field)

  const result =
    createRoleValidation(
      t,
    ).safeParse(form)

  if (
    result.success
  ) {
    return
  }

  const issue =
    result.error.issues.find(
      (issue) =>
        issue.path[0] ===
        field,
    )

  if (
    issue
  ) {
    formErrors[
      field
    ] =
      issue.message
  }
}

function validateForm() {
  Object.keys(
    formErrors,
  ).forEach((key) => {
    formErrors[
      key as keyof typeof formErrors
    ] = ''
  })

  const result =
    createRoleValidation(
      t,
    ).safeParse(form)

  if (
    result.success
  ) {
    return true
  }

  result.error.issues.forEach(
    (issue) => {
      const field =
        issue.path[0]

      if (
        field &&
        field in
        formErrors
      ) {
        formErrors[
          field as keyof typeof formErrors
        ] =
          issue.message
      }
    },
  )

  return false
}

/* =========================
 * REALTIME VALIDATION
 * ========================= */

watch(
  () => form.nama,
  () =>
    validateField(
      'nama',
    ),
)

watch(
  () => form.deskripsi,
  () =>
    validateField(
      'deskripsi',
    ),
)

/* =========================
 * FORM VALID
 * ========================= */

const isFormValid =
  computed(() =>
    createRoleValidation(
      t,
    ).safeParse(form)
      .success,
  )

/* =========================
 * SUBMIT
 * ========================= */

async function handleSubmit() {
  const isValid = validateForm()

  if (!isValid) {
    toast.add({
      title: t('util.gagal'),
      description: t('util.periksaKembaliForm'),
      color: 'error',
    })

    return
  }

  toast.add({
    title:
      t('util.berhasil'),
    description:
      t('manajemenRole.create.validasi.berhasil'),
    color: 'success',
  })

  setTimeout(
    async () => {
      await navigateTo(
        '/dashboard/manajemen-role',
      )
    },
    1000,
  )
}
</script>
