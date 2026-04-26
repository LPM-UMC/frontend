<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DashboardMenuCard from '../components/DashboardMenuCard.vue'
import { useDashboardRepository } from '../composables/useDashboardRepository'
import { getDashboardDummyHomeData } from '../data/dashboardDummy'
import type { DashboardHomeData } from '../types/dashboard'

const repository = useDashboardRepository('dummy')

const homeData = ref<DashboardHomeData>(getDashboardDummyHomeData())

onMounted(async () => {
  homeData.value = await repository.getHomeData()
})

const menus = computed(() => homeData.value.menus)
const userName = computed(() => homeData.value.user.name)
const roleName = computed(() => homeData.value.user.role)
const welcomeTitle = computed(() => homeData.value.welcome.title)
</script>


<template>
  <div class="h-[56px] w-full sm:h-[64px] md:h-[70px]">
      <div
        class="h-full w-full bg-repeat-x bg-top"
        style="background-image: url('/img/batik.png'); background-size: auto clamp(72px, 8vw, 90px);"
      />
  </div>

  <section class="mx-auto w-full max-w-[1880px] px-3 pb-8 pt-5 sm:px-5 sm:pt-7 md:px-6 md:pt-8 lg:px-8 xl:px-10 2xl:px-12">
    <div class="mb-5 rounded-[12px] border border-[#dddddd] bg-[#ececec] px-4 py-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] sm:mb-6 sm:px-6 sm:py-5 md:mb-7 md:px-7">
      <h1 class="text-[24px] font-semibold leading-tight text-[#2a2a2a] sm:text-[29px] md:text-[33px]">
        {{ welcomeTitle }}
      </h1>

      <p class="mt-2 max-w-[1100px] text-[13px] leading-[1.55] text-[#525b68] sm:text-[14px] md:text-[15px]">
        Selamat datang
        <strong>{{ userName }}</strong>, anda masuk sebagai
        <strong>{{ roleName }}</strong>
        di sistem Lembaga Penjaminan Mutu dan Satuan Pengawas Internal Universitas
        Muhammadiyah Cirebon
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3 min-[1800px]:grid-cols-4">
      <DashboardMenuCard
        v-for="menu in menus"
        :key="menu.id"
        :title="menu.title"
        :description="menu.description"
        :image="menu.image"
        :to="menu.to"
        :cta-label="menu.ctaLabel"
      />
    </div>
  </section>
</template>
