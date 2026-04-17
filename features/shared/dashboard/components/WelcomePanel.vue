<script setup lang="ts">
interface Props {
  heading: string
  userName: string
  roleLabel: string
}

defineProps<Props>()
</script>

<template>
  <section class="rounded-2xl border border-[#d8d8d8] bg-[#f7f7f7] p-7">
    <h1 class="mb-2.5 text-[22px] font-bold text-slate-900">
      {{ heading }}
    </h1>

    <p class="text-[15px] leading-7 text-slate-600">
      Selamat datang <strong class="text-slate-700">{{ userName }}</strong
      >, anda masuk sebagai <strong class="text-slate-700">{{ roleLabel }}</strong> di sistem
      Lembaga Penjaminan Mutu dan Satuan Pengawas Internal Universitas Muhammadiyah Cirebon
    </p>
  </section>
</template>