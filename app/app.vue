<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
// import { useAuthStore } from "#stores/authStore";
//
// const authStore = useAuthStore();
//
// await callOnce(async () => {
//   await authStore.initialize();
// });
//
const { locale } = useI18n()

const isRTL = computed(() => locale.value === 'ar')

const appClass = computed(() =>
  locale.value === 'ar'
    ? 'font-ar'
    : ''
)
</script>

<template>
  <UApp>
    <div :dir="isRTL ? 'rtl' : 'ltr'" :class="appClass" class="min-h-screen">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>
