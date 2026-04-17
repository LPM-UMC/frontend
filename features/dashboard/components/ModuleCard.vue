<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  description: string
  to: string
  ctaLabel?: string
  accentVariant?: 'wave' | 'curve'
  surfaceColor?: string
}>(), {
  ctaLabel: 'Learn more',
  accentVariant: 'wave',
  surfaceColor: '#ffffff',
})
</script>

<template>
  <NuxtLink
    :to="props.to"
    class="group relative block min-h-[256px] overflow-hidden rounded-[12px] border border-[#e2e5eb] px-4 pb-4 pt-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.09)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(15,23,42,0.16)] sm:px-5"
    :style="{ backgroundColor: props.surfaceColor }"
  >
    <div class="relative z-10 pr-[34px]">
      <h3 class="max-w-[250px] text-[20px] font-semibold leading-[1.3] text-[#252525]">
        {{ props.title }}
      </h3>

      <p class="mt-3 max-w-[260px] text-[13px] leading-[1.6] text-[#6c7684]">
        {{ props.description }}
      </p>

      <span class="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#e1121b]">
        {{ props.ctaLabel }}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-[14px] w-[14px] transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      </span>
    </div>

    <div class="pointer-events-none absolute bottom-0 right-0 h-[92px] w-[152px] overflow-hidden">
      <svg
        v-if="props.accentVariant === 'wave'"
        class="h-full w-full"
        viewBox="0 0 160 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path d="M58 96C76 85 88 72 103 64C115 58 126 56 136 56C145 56 153 53 160 47V96H58Z" fill="#ef232a" />
        <path d="M78 96C92 87 103 75 116 69C126 64 136 62 145 62C152 62 157 59 160 56V96H78Z" fill="#c9141d" />
        <path d="M100 96C112 89 121 79 132 74C140 70 148 68 154 69C157 69 159 68 160 66V96H100Z" fill="#f2464c" />
      </svg>
      <svg
        v-else
        class="h-full w-full"
        viewBox="0 0 160 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path d="M72 96C95 90 115 80 128 62C138 48 148 38 160 32V96H72Z" fill="#ef232a" />
        <path d="M90 96C108 90 124 82 135 68C143 58 151 51 160 46V96H90Z" fill="#c9141d" />
        <path d="M114 96C128 90 140 83 148 73C153 67 157 63 160 60V96H114Z" fill="#f2464c" />
      </svg>
    </div>
  </NuxtLink>
</template>
