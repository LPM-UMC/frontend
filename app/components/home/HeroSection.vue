  <!-- components/home/HeroSection.vue -->
  <template>
    <section class="bg-[#f9fafb] py-16 md:py-19">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 px-4 md:px-6">
        <!-- Text kiri -->
        <div class="bg-[#f9fafb] max-w-md space-y-4">
          <h1 class="text-[2.2rem] md:text-[2.5rem] font-bold leading-tight space-y-0.5">
            <span class="block text-[#000000]">{{ $t('welcome') }}</span>
          </h1>

          <h1 class="text-[2.2rem] md:text-[2.5rem] font-bold leading-tight space-y-0.5">
            <span class="block text-[#e30613]">LEMBAGA PENJAMINAN MUTU</span>
            <span class="block text-[#e30613]">DAN SATUAN PENGAWAS INTERNAL</span>
          </h1>

          <p class="text-[1.4rem] md:text-[1.7rem] font-semibold text-gray-900">
            Universitas Muhammadiyah Cirebon
          </p>

          <p class="text-sm md:text-[0.95rem] text-gray-600 max-w-md">
            Penjaminan mutu dan pengawasan internal merupakan pilar
            penting dalam menjalankan visi misi universitas menuju
            institusi pendidikan tinggi yang bermartabat dan berkualitas unggul.
          </p>

          <div class="flex items-center gap-3 pt-2">
            <NuxtLink to="/monevs" class="inline-flex items-center justify-center px-6 py-2.5 rounded-full 
              text-sm font-semibold text-white bg-[#e30613] hover:bg-[#c10510] shadow-sm">
              Info Monev
            </NuxtLink>
            <NuxtLink to="/tentang-kami" class="inline-flex items-center justify-center px-6 py-2.5 rounded-full 
              text-sm font-semibold text-gray-800 bg-gray-200 hover:bg-gray-300">
              Tentang Kami
            </NuxtLink>
          </div>
        </div>

        <!-- Gambar kanan -->
        <div class="flex-1 flex justify-center">
          <img src="/img/gedung-umc.jpg" alt="Gedung Universitas Muhammadiyah Cirebon"
            class="w-full max-w-[480px] rounded-[24px] shadow-[0_20px_40px_rgba(15,23,42,0.18)] object-cover">
        </div>
      </div>
    </section>
  </template>

<script setup lang="ts">
// tampilan statis
</script>
