<template>
  <div class="rounded-[12px] bg-[#e60000] px-3.5 py-3.5 text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)] sm:px-4 sm:py-4 xl:px-5">
    <div class="flex flex-col gap-3.5 lg:flex-row lg:items-start lg:justify-between">
      <div class="w-full lg:max-w-[74%]">
        <h1 class="text-[18px] font-bold leading-tight sm:text-[22px] xl:text-[26px]">
          {{ fm1Store.informasi?.fm?.fm?.nama || '' }}
        </h1>
        <p class="mt-2 max-w-205 text-[12px] leading-normal text-white/95 sm:text-[13px] xl:text-[14px]">
          {{ fm1Store.informasi?.fm?.fm?.deskripsi || '' }}
        </p>
      </div>
    </div>

    <div class="mt-3.5 grid grid-cols-1 gap-2.5 lg:grid-cols-3">

      <article class="rounded-[12px] bg-linear-to-r from-[#ed1e24] to-[#dd0910] px-3.5 py-3" >
        <p class="text-[11px] text-white/75 sm:text-[12px]">
          {{ $t('periodeModul.waktuDimulai') }}
        </p>
        <p class="mt-1 text-[13px] font-semibold leading-[1.35] sm:text-[14px] md:text-[15px]">
          {{ formatDateTime(fm1Store.informasi?.fm?.tanggal_mulai) }}
        </p>
      </article>

      <article class="rounded-[12px] bg-linear-to-r from-[#ed1e24] to-[#dd0910] px-3.5 py-3" >
        <p class="text-[11px] text-white/75 sm:text-[12px]">
          {{ $t('periodeModul.waktuBerakhir') }}
        </p>
        <p class="mt-1 text-[13px] font-semibold leading-[1.35] sm:text-[14px] md:text-[15px]">
          {{ formatDateTime(fm1Store.informasi?.fm?.tanggal_selesai) }}
        </p>
      </article>

      <article class="rounded-[12px] bg-linear-to-r from-[#ed1e24] to-[#dd0910] px-3.5 py-3" >
        <p class="text-[11px] text-white/75 sm:text-[12px]">
          {{ $t('periodeModul.status') }}
        </p>
        <p class="mt-1 text-[13px] font-semibold leading-[1.35] sm:text-[14px] md:text-[15px]">
          {{ fm1Store.informasi?.fm?.status_pelaksanaan?.kode ? $t(`periodeModul.statusPelaksanaan.${fm1Store.informasi.fm.status_pelaksanaan.kode}`) : $t('periodeModul.statusPelaksanaan.BELUM_DIMULAI') }}
        </p>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFm1Store } from '#stores/fm1';
import { useI18n } from 'vue-i18n';

const fm1Store = useFm1Store();
const { locale } = useI18n();

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const currentLocale = locale.value === 'id' ? 'id-ID' : locale.value === 'en' ? 'en-US' : locale.value === 'ar' ? 'ar-SA' : 'ja-JP';
  
  return d.toLocaleDateString(currentLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};
</script>
