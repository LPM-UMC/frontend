<template>
  <div role="button" tabindex="0"
    class="group relative block min-h-[200px] cursor-pointer overflow-hidden rounded-[12px] border border-[#e2e5eb] bg-white px-4 pb-4 pt-3 shadow-[0_2px_10px_rgba(15,23,42,0.09)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(15,23,42,0.15)] sm:min-h-[220px]"
    :style="{ backgroundColor: props.surfaceColor }" @click="handleClick" @keydown.enter="handleClick">
    <div class="relative z-10 flex h-full flex-col pr-6">
      <!-- Title -->
      <h3 class="max-w-[78%] text-[16px] font-semibold leading-[1.3] text-[#252525] sm:text-[17px] xl:text-[18px]">
        {{ props.title }}
      </h3>

      <!-- Description -->
      <p class="mt-2 flex-1 max-w-[80%] overflow-hidden text-[12px] leading-[1.55] text-[#6c7684] line-clamp-4">
        {{ props.description }}
      </p>

      <!-- CTA -->
      <span dir="ltr" class="mt-auto inline-flex items-center gap-1 pt-3 text-[12px] font-semibold text-[#e1121b]">
        {{ $t('monev.lihatEvaluasiTerbaru') }}

        <svg xmlns="http://www.w3.org/2000/svg"
          class="h-[13px] w-[13px] transition-transform duration-200 group-hover:translate-x-0.5" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      </span>
    </div>

    <!-- Accent -->
    <div
      class="pointer-events-none absolute bottom-0 right-0 h-[56px] w-[96px] overflow-hidden sm:h-[68px] sm:w-[116px]">
      <svg v-if="props.accentVariant === 'wave'" class="h-full w-full" viewBox="0 0 120 80" fill="none"
        xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M30 80C48 74 58 63 69 55C78 49 88 46 98 46C107 46 114 43 120 38V80H30Z" fill="#ef232a" />
        <path d="M50 80C63 73 73 64 83 58C91 53 100 50 108 50C114 50 118 48 120 46V80H50Z" fill="#c9141d" />
      </svg>

      <svg v-else class="h-full w-full" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none">
        <path d="M60 80C74 74 88 66 98 54C106 44 113 35 120 30V80H60Z" fill="#ef232a" />
        <path d="M80 80C91 75 101 68 108 58C113 50 117 45 120 42V80H80Z" fill="#c9141d" />
        <path d="M100 80C107 76 113 71 117 65C119 62 120 60 120 58V80H100Z" fill="#f2464c" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const localePath = useLocalePath()

const props = withDefaults(
  defineProps<{
    title: string
    description: string
    periodeModulId?: string | number | null
    unitLingkupPeriodeModulId?: string | number | null
    aspekPeriodeModulId?: string | number | null
    accentVariant?: 'wave' | 'curve' | 'corner'
    surfaceColor?: string
  }>(),
  {
    accentVariant: 'wave',
    surfaceColor: '#ffffff',
  },
)

const toast = useToast()
const router = useRouter()

function handleClick() {
  if (!props.periodeModulId || !props.unitLingkupPeriodeModulId) {
    toast.add({
      title: t('periodeModul.belumAdaRiwayatPelaksanaan.judul'),
      description: t('periodeModul.belumAdaRiwayatPelaksanaan.deskripsi'),
      color: 'error',
    })

    return
  }

  if (!props.aspekPeriodeModulId) {
    toast.add({
      title: t('periodeModul.belumAdaAspek.judul'),
      description: t('periodeModul.belumAdaAspek.deskripsi'),
      color: 'error',
    })

    return
  }

  router.push(localePath(`/dashboard/periode-modul/${props.periodeModulId}/unit/${props.unitLingkupPeriodeModulId}/fm1/aspek/${props.aspekPeriodeModulId}`))
}
</script>
