<template>
  <div class="flex flex-col gap-6 px-4 py-6 lg:px-8 xl:px-12"> <!-- Breadcrumb  -->
    <div dir="ltr"
      class="flex flex-wrap items-center gap-2">
      <NuxtLink :to="localePath(`/dashboard/${namaDasbor}`)">
        <button
          class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d6dae2] bg-[#efeff1] text-[#596273] shadow-[0_2px_6px_rgba(15,23,42,0.08)] transition hover:bg-white cursor-pointer sm:h-9 sm:w-9">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19 8 12l7-7" />
          </svg>
        </button>
      </NuxtLink>

      <nav class="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
        <template v-for="(item, index) in breadcrumbItems" :key="`${item.label}-${index}`">
          <NuxtLink v-if="item.to" :to="localePath(item.to)" class="text-[#9aa2b1] transition hover:text-[#6e7788] hover:underline">
            {{ item.label }}
          </NuxtLink>

          <span v-else :class="item.active
            ? 'font-semibold text-[#e30000] underline'
            : 'text-[#9aa2b1]'
            ">
            {{ item.label }}
          </span>

          <span v-if="index !== breadcrumbItems.length - 1" class="px-1 text-[#c5cad4]">
            /
          </span>
        </template>
      </nav>
    </div>

    <FM1Hero />

    <section class="grid grid-cols-1 gap-3.5 lg:grid-cols-[minmax(0,1fr)_286px] xl:grid-cols-[minmax(0,1fr)_314px]">
      <div class="space-y-3.5">
        <FM1ListAspek />
        <FM1DetailAspek />
        <!-- Tampilan untuk selain auditee (misal: Evaluator, SPI) -->
        <template v-if="fm1Store.isAuditee === false">
          <FM1BerkasBukti 
            v-if="buktiAspek && buktiAspek.bukti_instrumen" 
            :bukti="buktiAspek"
          />
          <article v-else class="flex flex-col items-center justify-center rounded-[12px] border border-[#e2e6ec] bg-white p-8 text-center shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="mb-3 h-10 w-10 text-[#a0aec0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <h3 class="text-[15px] font-bold text-[#1a202c]">
              {{ $t('periodeModul.berkasBuktiBelumTersedia.judul') }}
            </h3>
            <p class="mt-1 text-[13px] text-[#718096]">
              {{ $t('periodeModul.berkasBuktiBelumTersedia.deskripsi') }}
            </p>
          </article>
        </template>
        
        <!-- Tampilan khusus untuk auditee -->
        <template v-if="fm1Store.isAuditee === true">
          <FM1BerkasBukti 
            v-if="buktiAspek && buktiAspek.bukti_instrumen" 
            :bukti="buktiAspek"
          />
          <FM1InputBuktiEmpty 
            v-else
            @start-input="handleStartInput"
          />
        </template>
      </div>

      <FM1DetailUnitLingkup />
    </section>

    <FM1ObjekTable />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from '#imports';
import { useFm1Store } from '#stores/fm1';
import { onMounted, watch } from 'vue';
import FM1Hero from '#features/periode-modul/components/fm1/FM1Hero.vue';
import FM1ListAspek from '#features/periode-modul/components/fm1/FM1ListAspek.vue';
import FM1DetailAspek from '#features/periode-modul/components/fm1/FM1DetailAspek.vue';
import FM1DetailUnitLingkup from '#features/periode-modul/components/fm1/FM1DetailUnitLingkup.vue';
import FM1BerkasBukti from '#features/periode-modul/components/fm1/FM1BerkasBukti.vue';
import FM1InputBuktiEmpty from '#features/periode-modul/components/fm1/FM1InputBuktiEmpty.vue';
import FM1ObjekTable from '#features/periode-modul/components/fm1/FM1ObjekTable.vue';
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const namaDasbor = computed(() => {
  const isAmi = fm1Store.informasi?.periode_modul?.modul?.tipe_modul?.kode === 'AMI'
  return isAmi ? t('ami.judul') : t('monev.judul')
})

const breadcrumbItems = computed(() => {
  const isAmi = fm1Store.informasi?.periode_modul?.modul?.tipe_modul?.kode === 'AMI'
  const namaModul = fm1Store.informasi?.periode_modul?.modul?.nama || ''
  
  return [
    {
      label: t('navigasi.dasbor'),
      to: '/dashboard',
    },
    {
      label: isAmi ? t('ami.judul') : t('monev.judul'),
      to: isAmi ? '/dashboard/ami' : '/dashboard/monev',
    },
    {
      label: namaModul,
      active: true,
    },
  ]
})

const route = useRoute()
const fm1Store = useFm1Store()

const pId = route.params.periode_modul_id as string
const uId = route.params.unit_id as string
const aId = route.params.aspek_id as string

onMounted(() => {
  if (pId && uId) {
    fm1Store.fetchInformasi(pId, uId);
    fm1Store.fetchAspeks(pId);
    fm1Store.checkIsAuditee(uId);
    fm1Store.checkIsEvaluator(uId);
    fm1Store.fetchBuktiInstrumenList(uId);
  }
  if (aId && uId) {
    fm1Store.fetchDetailAspek(aId, uId);
  }
});

watch(locale, () => {
  if (pId && uId) {
    fm1Store.fetchInformasi(pId, uId);
    fm1Store.fetchAspeks(pId);
    fm1Store.fetchBuktiInstrumenList(uId);
  }
  const currentAId = route.params.aspek_id as string || aId;
  if (currentAId && uId) {
    fm1Store.fetchDetailAspek(currentAId, uId);
  }
  if (fm1Store.detailAspek?.objek?.id && uId) {
    fm1Store.fetchObjekTable(uId, fm1Store.detailAspek.objek.id, fm1Store.tablePage);
  }
});

watch(() => route.params.aspek_id, (newAId) => {
  if (newAId && uId) {
    fm1Store.fetchDetailAspek(newAId as string, uId);
  }
})

watch(() => fm1Store.detailAspek, (detail) => {
  if (detail?.objek?.id && uId) {
    fm1Store.fetchObjekTable(uId, detail.objek.id, 1);
  }
}, { immediate: true })

const buktiAspek = computed(() => {
  return fm1Store.buktiInstrumenList.find(b => b.aspek.id === route.params.aspek_id) || null;
})

function handleStartInput() {
  navigateTo(`/dashboard/periode-modul/${pId}/unit/${uId}/fm1/bukti`);
}
</script>
