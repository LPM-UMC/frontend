<script setup lang="ts">
import DashboardHeader from '#features/dashboard/components/DashboardHeader.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[#e4e4e6] text-slate-900">
    <DashboardHeader />

    <main class="flex-1 pt-[140px] sm:pt-[88px] bg-[#f4f4f4]">
      <slot />
    </main>

    <footer class="border-t border-[#5f0709] bg-[#981114] px-4 py-3 text-center text-[11px] text-white sm:text-xs md:text-[12px]">
      Copyright All Right Reserved 2025, Lembaga Penjaminan Mutu &amp;
      Satuan Penjaminan Mutu Universitas Muhammadiyah Cirebon
    </footer>
  </div>
</template>
