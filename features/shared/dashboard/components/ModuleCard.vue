<script setup lang="ts">
import type { DashboardModule } from '../types/dashboard'

interface Props {
  module: DashboardModule
}

const props = defineProps<Props>()

const imageUrl = computed(() => props.module.image || '/img/content/gedung-umc.jpg')
</script>

<template>
  <article
    class="group overflow-hidden rounded-[18px] border border-[#e0e0e0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(15,23,42,0.12)]"
  >
    <div class="overflow-hidden bg-gradient-to-b from-blue-100 to-slate-50" style="height: 190px;">
      <img
        :src="imageUrl"
        :alt="module.title"
        class="transition-transform duration-500 group-hover:scale-105"
        style="width: 100%; height: 190px; object-fit: cover; display: block;"
      />
    </div>

    <div class="p-5">
      <h2 class="mb-3.5 text-[18px] font-bold text-slate-900">
        {{ module.title }}
      </h2>

      <p class="mb-5 min-h-[56px] text-[15px] leading-6 text-slate-500">
        {{ module.description }}
      </p>

      <NuxtLink
        :to="module.to"
        class="inline-flex min-w-[90px] items-center justify-center rounded-lg bg-[#e10600] px-4 py-2.5 text-sm font-bold text-white shadow-[0_2px_8px_rgba(225,6,0,0.2)] transition-all duration-200 hover:bg-[#c10510] hover:shadow-[0_4px_12px_rgba(225,6,0,0.35)] active:scale-[0.97]"
      >
        Masuk
      </NuxtLink>
    </div>
  </article>
</template>