<template>
  <main class="page-content bg-white">
    <section class="py-10 md:py-14">
      <div class="max-w-6xl mx-auto px-4 md:px-6 min-h-[60vh] flex flex-col items-center justify-center space-y-8 text-center">
        
        <div class="space-y-4 animate-fade-in-up">
          <p class="text-sm font-bold text-[#e30613] uppercase tracking-[0.3em]">
            Halaman Sedang Disiapkan
          </p>
          
          <h1 class="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 tracking-tighter uppercase">
            Coming
            <span class="block md:inline text-transparent bg-clip-text bg-gradient-to-r from-[#e30613] to-red-600">
              Soon
            </span>
          </h1>
        </div>

        <p class="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
          Kami sedang menyusun konten terbaik untuk halaman ini. 
          Silakan cek kembali secara berkala untuk pembaruan terbaru dari LPM UMC.
        </p>

        <div class="w-full max-w-[200px] h-1.5 bg-gray-100 rounded-full overflow-hidden mt-6">
          <div class="h-full w-1/2 bg-[#e30613] rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>

      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Mengatur judul tab browser
useHead({
  title: 'Coming Soon - LPM UMC',
})

// Catatan: Saya TIDAK menggunakan 'definePageMeta({ layout: false })' 
// agar Header dan Footer bawaan aplikasi Anda tetap tampil.
</script>

<style scoped>
/* Animasi sederhana untuk garis loading */
@keyframes loading {
  0% { transform: translateX(-150%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(150%); }
}

/* Animasi muncul perlahan */
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>