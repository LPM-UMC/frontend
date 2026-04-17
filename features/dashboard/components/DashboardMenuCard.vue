<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  description: string
  image: string
  to: string
  ctaLabel?: string
}>(), {
  ctaLabel: 'Masuk',
})

const imageSrc = computed(() => {
  if (!props.image) return '/img/gedung-umc.jpg'
  return props.image.startsWith('/') ? props.image : `/img/${props.image}`
})
</script>

<template>
  <NuxtLink
    :to="props.to"
    class="group flex h-full w-full flex-col overflow-hidden rounded-[16px] border border-[#d6d9df] bg-[#efefef] p-[8px] shadow-[0_3px_10px_rgba(15,23,42,0.12)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(15,23,42,0.16)]"
  >
    <img
      :src="imageSrc"
      :alt="props.title"
      class="h-[172px] w-full rounded-[12px] object-cover"
    />

    <div class="flex flex-1 flex-col px-3 pb-3 pt-3.5 sm:px-3.5 sm:pt-4">
      <h3 class="text-[20px] font-semibold leading-tight text-[#232a35]">
        {{ props.title }}
      </h3>

      <p class="mt-2.5 flex-1 text-[14px] leading-[1.55] text-[#667487]">
        {{ props.description }}
      </p>

      <div class="mt-4">
        <span
          class="inline-flex min-h-[30px] min-w-[58px] items-center justify-center rounded-[6px] bg-[#e10600] px-3 text-[12px] font-semibold text-white"
        >
          {{ props.ctaLabel }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
