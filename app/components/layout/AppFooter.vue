<template>
  <UFooter class="border-t border-red-200 bg-linear-to-r from-red-700 via-red-700 to-red-800 text-white">
    <!-- LEFT -->
    <template #left>
      <div class="flex flex-col">
        <p class="text-sm font-medium text-red-50">
          {{ $t('footer.copyright') }}
        </p>
      </div>
    </template>

    <!-- CENTER -->
    <UNavigationMenu
:items="items" variant="link" orientation="vertical" :ui="{
      list: 'flex flex-col gap-2 md:flex-row md:items-center',
      link: 'text-red-50 hover:text-white font-medium transition'
    }" />

    <!-- RIGHT -->
    <template #right>
      <div class="flex items-center gap-1">
        <!-- UMC -->
        <UButton
icon="i-simple-icons-instagram" color="neutral" variant="ghost"
          to="https://instagram.com/official.umcirebon" target="_blank" :aria-label="$t('website.umc')"
          class="text-white hover:bg-red-600" />
        <UButton
icon="i-simple-icons-x" color="neutral" variant="ghost" to="https://x.com/UM_Cirebon" target="_blank"
          :aria-label="$t('website.umc')" class="text-white hover:bg-red-600" />
        <UButton
icon="i-simple-icons-linkedin" color="neutral" variant="ghost"
          to="https://id.linkedin.com/school/universitas-muhammadiyah-cirebon/" target="_blank"
          :aria-label="$t('website.umc')" class="text-white hover:bg-red-600" />
      </div>
    </template>
  </UFooter>
</template>


<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: t('website.umc'),
    to: 'https://umc.ac.id',
    target: '_blank'
  },
  {
    label: t('website.siimoet'),
    to: 'https://si-imoet.umc.ac.id',
    target: '_blank'
  },
  {
    label: t('website.pmb'),
    to: 'https://pmb.umc.ac.id',
    target: '_blank'
  }
])
</script>
