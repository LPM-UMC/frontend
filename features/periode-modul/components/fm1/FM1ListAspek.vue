<template>
  <article class="rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8] p-3 sm:p-3.5">
    <p class="text-[12px] font-semibold tracking-wide text-[#96a0b1] sm:text-[13px]">
      {{ $t('periodeModul.pilihAspek') }}
    </p>

    <div v-if="fm1Store.isLoadingAspeks" class="mt-3.5 space-y-2.5">
      <div v-for="i in 4" :key="i" class="h-9 w-full animate-pulse rounded-[12px] bg-[#e2e6ec]" />
    </div>

    <div v-else-if="fm1Store.error" class="mt-3.5 text-[12px] text-red-500">
      Gagal memuat aspek. {{ fm1Store.error?.message || '' }}
    </div>

    <div v-else-if="aspects.length === 0" class="mt-3.5 text-[12px] text-gray-500">
      Tidak ada aspek untuk periode modul ini.
    </div>

    <div v-else class="mt-3.5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
      <button
        v-for="aspect in aspects"
        :key="aspect.id"
        type="button"
        class="cursor-pointer rounded-[12px] border px-3 py-2 text-left text-[12px] font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 sm:text-[13px]"
        :class="
          aspect.id === activeAspectId
            ? 'border-[#e60000] bg-[#e60000] text-white shadow-sm'
            : 'border-[#c7ced9] bg-transparent text-[#445064] hover:border-[#e60000] hover:bg-white hover:text-[#e60000]'
        "
        @click="setActiveAspect(aspect.id)"
      >
        {{ aspect.label || 'Aspek Tanpa Nama' }}
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from '#imports'
import { useFm1Store } from '#stores/fm1'

const route = useRoute()
const router = useRouter()
const fm1Store = useFm1Store()

const activeAspectId = computed(() => route.params.aspek_id as string)

const aspects = computed(() => fm1Store.aspeks.map((a: any) => ({
  id: a.id,
  label: a.aspek?.nama || ''
})))

const setActiveAspect = (aspectId: string) => {
  router.replace(`/dashboard/periode-modul/${route.params.periode_modul_id}/unit/${route.params.unit_id}/fm1/aspek/${aspectId}`)
}
</script>
