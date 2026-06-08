<script setup lang="ts">
import { useRoute, useRuntimeConfig, useNuxtApp, createError, useAsyncData } from '#imports'
import Fm3CreateFindingPage from '#features/periode-modul/pages/fm3/Fm3CreateFindingPage.vue'

definePageMeta({
  layout: 'periode-modul',
})

const route = useRoute()
const unitId = route.params.unit_id as string

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl || config.public.apiBaseUrl || 'http://localhost:3001'
const lang = (useNuxtApp().$i18n as any)?.locale?.value || 'id'

const { data, error } = await useAsyncData(`check-auditee-fm3-create-${unitId}`, async () => {
  return await $fetch<{ data: { is_auditee: boolean } }>(`/api/periode-modul/unit-lingkup/${unitId}/is-auditee`, {
    baseURL,
    credentials: 'include',
    headers: { 'Accept-Language': lang, "Authorization": `Bearer ${useNuxtApp().$pinia.state.value.auth?.accessToken || ""}` },
  })
})

if (error.value || !data.value?.data.is_auditee) {
  throw createError({ statusCode: 403, statusMessage: 'Forbidden', fatal: true })
}
</script>

<template>
  <Fm3CreateFindingPage />
</template>
