<script setup lang="ts">
defineProps<{
  title: string
  description: string
  to: string
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="group relative block overflow-hidden rounded-[18px] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(15,23,42,0.14)]"
  >
    <div class="relative z-10 p-6 pb-14">
      <h3 class="max-w-[260px] text-[17px] font-bold leading-7 text-slate-900">
        {{ title }}
      </h3>

      <p class="mt-3 max-w-[270px] text-[13.5px] leading-[1.7] text-slate-500">
        {{ description }}
      </p>

      <span class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition-all duration-200 group-hover:gap-3">
        Learn more
        <svg
          viewBox="0 0 24 24"
          class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
        >
          <path
            d="M5 12h14M12 5l7 7-7 7"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </span>
    </div>

    <!-- Red wave decoration — bottom right -->
    <div class="pointer-events-none absolute -bottom-4 -right-4 h-24 w-32 overflow-hidden">
      <svg viewBox="0 0 120 90" class="h-full w-full" preserveAspectRatio="none">
        <path
          d="M20,90 Q40,50 60,65 T100,40 L120,90 Z"
          fill="#dc2626"
          opacity="0.85"
          class="transition-all duration-500 group-hover:opacity-100"
        />
        <path
          d="M40,90 Q55,60 75,70 T120,55 L120,90 Z"
          fill="#b91c1c"
          opacity="0.7"
          class="transition-all duration-500 group-hover:opacity-90"
        />
        <path
          d="M60,90 Q75,72 90,78 T120,68 L120,90 Z"
          fill="#ef4444"
          opacity="0.5"
          class="transition-all duration-500 group-hover:opacity-70"
        />
      </svg>
    </div>
  </NuxtLink>
</template>