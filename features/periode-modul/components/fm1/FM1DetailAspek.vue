<template>
  <div>
    <!-- Skeleton Loading -->
    <article v-if="fm1Store.isLoadingDetailAspek" class="animate-pulse rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8] p-3 sm:p-3.5 space-y-4">
      <div class="h-4 w-24 rounded bg-[#e2e6ec]"></div>
      <div class="h-6 w-3/4 rounded bg-[#e2e6ec]"></div>
      <div class="h-4 w-full rounded bg-[#e2e6ec]"></div>
      
      <div class="mt-4 h-4 w-32 rounded bg-[#e2e6ec]"></div>
      <div class="mt-2 h-24 w-full rounded-[12px] bg-white border border-[#d9dde4]"></div>
      
      <div class="mt-4 h-4 w-32 rounded bg-[#e2e6ec]"></div>
      <div class="mt-2 space-y-2">
        <div class="h-16 w-full rounded bg-[#f2f3f4] border-l-[6px] border-[#e60000]"></div>
        <div class="h-16 w-full rounded bg-[#f2f3f4] border-l-[6px] border-[#e60000]"></div>
      </div>
    </article>

    <!-- Content -->
    <article v-else-if="detail" class="rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8] p-3 sm:p-3.5 transition-opacity duration-300">
      <p class="text-[12px] font-semibold tracking-wide text-[#96a0b1] sm:text-[13px]">
        {{ $t('periodeModul.detailAspek') }}
      </p>
      <h3 class="mt-1 text-[16px] font-bold text-[#121b2f] sm:text-[18px]">
          {{ detail.aspek?.nama || '' }}
      </h3>
      <p class="mt-2 text-[12px] leading-normal text-[#576276] sm:text-[13px]">
        {{ detail.aspek?.deskripsi || '' }}
      </p>

      <p class="mt-4 text-[12px] font-semibold tracking-wide text-[#727f93] sm:text-[13px]">
        {{ $t('periodeModul.objekEvaluasi') }}
      </p>

      <div class="mt-2 rounded-[12px] border border-[#d9dde4] bg-white px-3 py-3">
        <div class="border-l-[5px] border-[#e60000] pl-3.5">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#99a3b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-8.25a2.25 2.25 0 0 0-2.25-2.25h-8.25m8.25 15h-10.5a2.25 2.25 0 0 1-2.25-2.25v-10.5a2.25 2.25 0 0 1 2.25-2.25h7.5l5.25 5.25v7.5a2.25 2.25 0 0 1-2.25 2.25Z" />
              </svg>
              <h4 class="text-[15px] font-semibold text-[#131d31] sm:text-[16px]">
                  {{ detail.objek?.nama || '' }}
              </h4>
            </div>
          </div>

          <p class="mt-2 text-[12px] leading-normal text-[#727d8e] sm:text-[13px]">
              {{ detail.objek?.deskripsi || '' }}
          </p>

          <NuxtLink v-if="fm1Store.isAuditee === true" :to="localePath(`/dashboard/periode-modul/${route.params.periode_modul_id}/unit/${route.params.unit_id}/fm1/objek`)" class="block">
            <button
              type="button"
              class="mt-3 flex w-full items-center gap-2.5 rounded-[12px] bg-[#e60000] px-3 py-2 text-left text-white transition hover:brightness-95 cursor-pointer"
            >
              <span class="grid h-8.5 w-8.5 place-items-center rounded-full bg-white/20 text-[18px] sm:h-10 sm:w-10 sm:text-[20px]">
                +
              </span>

              <span>
                <span class="block text-[13px] font-semibold leading-tight sm:text-[14px]">
                  {{ $t('periodeModul.unitObjekEvaluasi.tambah') }}
                </span>
                <span class="block text-[11px] tracking-wide text-white/95 sm:text-[12px]">
                  {{ $t('periodeModul.unitObjekEvaluasi.deskripsi') }}
                </span>
              </span>
            </button>
          </NuxtLink>

        </div>
      </div>

      <p class="mt-4 text-[12px] font-semibold tracking-wide text-[#727f93] sm:text-[13px]">
        {{ $t('periodeModul.indikatoEvaluasi') }}
      </p>

      <div class="mt-2 space-y-1.5">
        <article
          v-for="ind in indicators"
          :key="ind.id"
          class="border-l-[6px] border-[#e60000] bg-[#f2f3f4] px-3 py-3"
        >
          <div class="flex items-center gap-3">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h5 class="text-[13px] font-semibold text-[#121b2f] sm:text-[14px]">
                  {{ ind.indikator?.nama }}
                </h5>
              </div>
              <p class="mt-1 text-[11px] leading-normal text-[#5f6a7c] sm:text-[12px]">
                {{ ind.indikator?.deskripsi }}
              </p>
            </div>
          </div>
        </article>
      </div>

    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
import { useFm1Store } from '#stores/fm1'

const localePath = useLocalePath()
const route = useRoute()
const fm1Store = useFm1Store()

const detail = computed(() => fm1Store.detailAspek)
const indicators = computed(() => fm1Store.detailAspek?.indikator_periode_modul || [])

</script>
