<!-- pages/index.vue -->
<template>
  <div>
    <!-- Section 1: Hero -->
    <HeroSection />
    <!-- Section 2: Kalender Akademik (scroll ke bawah) -->
    <AcademicCalendarSection />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '~/components/home/HeroSection.vue'
import AcademicCalendarSection from '~/components/home/KalenderAkademik.vue'
</script>
