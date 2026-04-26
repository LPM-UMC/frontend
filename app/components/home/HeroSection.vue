  <!-- components/home/HeroSection.vue -->
  <template>
    <section class="overflow-x-hidden bg-[#f9fafb] py-8 sm:py-10 md:py-14">
      <div class="mx-auto flex w-full max-w-[1880px] flex-col items-center justify-between gap-7 px-4 sm:px-5 md:gap-9 md:px-6 lg:flex-row lg:gap-12 lg:px-8 xl:px-10 2xl:px-12">
        <!-- Text kiri -->
        <div class="w-full max-w-[720px] space-y-3.5 bg-[#f9fafb] lg:max-w-[54%]">
          <h1 class="text-[1.55rem] font-bold leading-tight sm:text-[1.8rem] md:text-[2.1rem] xl:text-[2.4rem]">
            <span class="block text-[#000000]">{{ $t('welcome') }}</span>
          </h1>

          <h1 class="text-[1.55rem] font-bold leading-tight sm:text-[1.8rem] md:text-[2.1rem] xl:text-[2.4rem]">
            <span class="block text-[#e30613]">LEMBAGA PENJAMINAN MUTU</span>
            <span class="block text-[#e30613]">DAN SATUAN PENGAWAS INTERNAL</span>
          </h1>

          <p class="text-[1rem] font-semibold text-gray-900 sm:text-[1.15rem] md:text-[1.35rem] xl:text-[1.55rem]">
            Universitas Muhammadiyah Cirebon
          </p>

          <p class="max-w-[680px] text-[13px] text-gray-600 sm:text-sm md:text-[0.95rem]">
            Penjaminan mutu dan pengawasan internal merupakan pilar
            penting dalam menjalankan visi misi universitas menuju
            institusi pendidikan tinggi yang bermartabat dan berkualitas unggul.
          </p>

          <div class="flex flex-col items-stretch gap-2.5 pt-1.5 sm:flex-row sm:items-center sm:gap-3 sm:pt-2">
            <NuxtLink to="/monevs" class="inline-flex min-h-[42px] w-full items-center justify-center rounded-full bg-[#e30613] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c10510] sm:w-auto sm:px-6">
              Info Monev
            </NuxtLink>
            <NuxtLink to="/tentang-kami" class="inline-flex min-h-[42px] w-full items-center justify-center rounded-full bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-300 sm:w-auto sm:px-6">
              Tentang Kami
            </NuxtLink>
          </div>
        </div>

        <!-- Gambar kanan -->
        <div class="flex w-full justify-center lg:max-w-[44%]">
          <img src="/img/gedung-umc.jpg" alt="Gedung Universitas Muhammadiyah Cirebon"
            class="h-[200px] w-full max-w-[620px] rounded-[18px] object-cover shadow-[0_20px_40px_rgba(15,23,42,0.18)] sm:h-[250px] sm:rounded-[20px] md:h-[320px] lg:h-[360px] xl:h-[420px]">
        </div>
      </div>
    </section>
  </template>

<script setup lang="ts">
// tampilan statis
</script>
