<template>
  <main class="bg-white">
    <!-- ================= HERO ================= -->
  <section class="relative bg-black">
    <div class="w-full">
      <div
        class="relative w-full h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px] overflow-hidden"
      >
        <!-- FOTO HERO -->
        <img
          src="/img/struktur-organisasi/struktur-hero.png"
          alt="Tim LPM & SPI Universitas Muhammadiyah Cirebon"
          class="absolute inset-0 w-full h-full object-cover object-[50%_70%]"
        />

        <!-- OVERLAY MERAH -->
        <div class="absolute inset-0 bg-[#e30613]/45"></div>

        <!-- TEKS HERO -->
        <div class="absolute inset-0 flex items-center">
          <div class="w-full max-w-6xl px-4 sm:px-6 lg:px-8 lg:pl-55">
            <!-- Judul (tetap sempit) -->
            <div class="max-w-xl">
              <p
                class="text-xs md:text-sm font-semibold text-white/80 uppercase tracking-[0.25em] mb-3"
              >
                Struktur Organisasi
              </p>

              <h1
                class="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-black leading-tight text-white mb-3"
              >
                STRUKTUR ORGANISASI
                <span class="block">LPM &amp; SPI Universitas</span>
                <span class="block">Muhammadiyah Cirebon</span>
              </h1>
            </div>

            <!-- Paragraf (LEBIH PANJANG) -->
            <p
              class="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed
                    max-w-3xl lg:max-w-4xl"
            >
              Struktur organisasi kami terdiri atas Kepala Lembaga,
              Sekretariat, Bidang Penjaminan Mutu, Bidang Audit Internal,
              dan Tim Ahli yang bekerja secara sinergis untuk mendukung
              pencapaian visi dan standar mutu universitas.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>


    <!-- ================= STATISTIK SINGKAT ================= -->
  <section class="bg-white pt-6 pb-8 md:pt-8 md:pb-10">
    <div class="max-w-6xl mx-auto px-4 md:px-6">
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8"
      >
        <div
          v-for="item in stats"
          :key="item.label"
          class="flex flex-col items-center text-center"
        >
          <!-- lingkaran peach + icon dari kamu -->
          <div
            class="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full bg-[#ffe5dd]
                  flex items-center justify-center mb-3"
          >
            <img
              :src="item.icon"
              :alt="item.label"
              class="w-7 h-7 md:w-8 md:h-8 object-contain"
            />
          </div>

          <p class="text-xl md:text-2xl font-extrabold text-gray-900">
            {{ item.value }}
          </p>
          <p
            class="mt-1 text-[11px] md:text-xs text-gray-500 leading-snug max-w-[130px]"
          >
            {{ item.label }}
          </p>
        </div>
      </div>
    </div>
  </section>


    <!-- ================= NILAI-NILAI KAMI ================= -->
    <section class="pb-12 md:pb-16">
      <div class="max-w-6xl mx-auto px-4 md:px-6">
        <div class="text-center mb-8 md:mb-10">
          <h2 class="text-base md:text-lg font-bold text-[#e30613]">
            Nilai - Nilai Kami
          </h2>
          <p
            class="mt-2 text-sm md:text-base text-gray-600 max-w-3xl mx-auto"
          >
            Fondasi yang membentuk budaya penjaminan mutu dan pengawasan
            internal di Universitas Muhammadiyah Cirebon.
          </p>
        </div>

        <div class="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="value in values"
            :key="value.title"
            class="bg-white rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.12)] border border-gray-100 px-4 py-4 md:px-5 md:py-5 flex flex-col h-full"
          >
            <div
              class="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-[#e30613]
                     flex items-center justify-center mb-3"
            >
              <img
                :src="value.icon"
                :alt="value.title"
                class="w-5 h-5 md:w-6 md:h-6 object-contain"
              />
            </div>
            <h3
              class="text-sm md:text-base font-semibold text-gray-900 mb-1.5"
            >
              {{ value.title }}
            </h3>
            <p class="text-xs md:text-sm text-gray-500 leading-relaxed">
              {{ value.description }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- ================= PIMPINAN LPM & SPI ================= -->
    <section class="pb-12 md:pb-16">
      <div class="max-w-6xl mx-auto px-4 md:px-6 text-center">
        <h2 class="text-base md:text-lg font-bold text-[#e30613] mb-1">
          Pimpinan LPM dan SPI
        </h2>
        <p
          class="text-sm md:text-base text-gray-600 max-w-2xl mx-auto mb-8"
        >
          Figur kunci yang memastikan sistem penjaminan mutu dan audit internal
          berjalan terarah, independen, dan berkelanjutan.
        </p>

        <!-- 2 kartu pimpinan -->
        <div class="mt-2 grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
          <div
            v-for="leader in leaders"
            :key="leader.name"
            class="w-full rounded-[32px] shadow-[0_28px_60px_rgba(15,23,42,0.18)]
                  overflow-hidden border border-gray-100 bg-white"
          >
            <!-- CARD DENGAN GRADIENT BAWAH -->
            <div class="relative aspect-[3/4]">
              <img
                :src="leader.photo"
                :alt="leader.name"
                class="w-full h-full object-cover"
              />

              <!-- gradient putih dari bawah ke atas -->
              <div
                class="pointer-events-none absolute inset-x-0 bottom-0 h-1/2
                      bg-gradient-to-t from-white via-white/80 to-transparent"
              ></div>

              <!-- konten nama + jabatan + icon -->
              <div
                class="absolute inset-x-0 bottom-0 px-5 pb-4 pt-10
                      flex flex-col gap-1 text-left"
              >
                <p
                  class="text-sm md:text-base font-semibold text-gray-900"
                >
                  {{ leader.name }}
                </p>
                <p class="text-xs text-gray-600">
                  ({{ leader.title }})
                </p>

                <div class="mt-2 flex items-center gap-2 text-gray-500">
                  <!-- email -->
                  <a
                    v-if="leader.email"
                    :href="`mailto:${leader.email}`"
                    class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/70 hover:bg-white"
                  >
                    <img
                      src="/img/struktur-organisasi/icon/email.png"
                      alt="Email"
                      class="w-3.5 h-3.5 object-contain"
                    />
                  </a>

                  <!-- instagram -->
                  <a
                    v-if="leader.instagram"
                    :href="leader.instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/70 hover:bg-white"
                  >
                    <img
                      src="/img/struktur-organisasi/icon/instagram.png"
                      alt="Instagram"
                      class="w-3.5 h-3.5 object-contain"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- ================= STRUKTUR ORGANISASI (BAGAN) ================= -->
    <section class="pb-12 md:pb-16">
      <div class="max-w-6xl mx-auto px-4 md:px-6 text-center">
        <h2 class="text-base md:text-lg font-bold text-[#e30613] mb-1">
          Struktur Organisasi LPM &amp; SPI
        </h2>
        <p
          class="text-sm md:text-base text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8"
        >
          Susunan unit dan garis koordinasi yang memastikan setiap unsur
          memiliki peran jelas dalam menjamin mutu dan melakukan pengawasan
          internal.
        </p>

        <div
          class="bg-white rounded-3xl shadow-[0_22px_50px_rgba(15,23,42,0.16)] border border-gray-100 overflow-hidden"
        >
          <div class="bg-gray-50 border-b border-gray-100 py-2 px-4">
            <p class="text-xs md:text-sm text-gray-500">
              Bagan Struktur Organisasi LPM &amp; SPI UMC
            </p>
          </div>

          <div class="p-3 md:p-6">
            <div
              class="bg-gray-100 rounded-2xl overflow-auto max-h-[480px] md:max-h-[560px]"
            >
              <img
                src="/img/struktur-organisasi/bagan-struktur-lpm-spi.png"
                alt="Bagan Struktur Organisasi LPM & SPI UMC"
                class="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= TIM PENJAMINAN MUTU & AUDIT INTERNAL ================= -->
    <section class="pb-16 md:pb-20">
      <div class="max-w-6xl mx-auto px-4 md:px-6">
        <div class="text-center mb-8 md:mb-10">
          <h2 class="text-base md:text-lg font-bold text-[#e30613] mb-1">
            Tim Penjaminan Mutu &amp; Audit Internal
          </h2>
          <p
            class="text-sm md:text-base text-gray-600 max-w-3xl mx-auto"
          >
            Kolaborasi staf LPM dan SPI yang menjalankan monitoring, evaluasi,
            dan audit untuk menjaga mutu dan tata kelola universitas.
          </p>
        </div>

        <!-- GRID TIM -->
        <div
          class="grid gap-4 md:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          <article
            v-for="member in team"
            :key="member.name + member.role"
            class="bg-white rounded-[32px] shadow-[0_22px_50px_rgba(15,23,42,0.16)]
                  border border-gray-100 overflow-hidden flex flex-col"
          >
            <div class="p-4 md:p-5 flex-1 flex flex-col">
              <!-- FOTO -->
              <div
                class="rounded-3xl overflow-hidden bg-gray-100 aspect-[3/4] mb-4"
              >
                <img
                  :src="member.photo"
                  :alt="member.name"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- NAMA + ROLE -->
              <p
                class="text-sm md:text-base font-semibold text-gray-900 leading-tight"
              >
                {{ member.name }}
              </p>
              <p class="mt-1 text-xs text-gray-500 leading-snug">
                {{ member.role }}
              </p>

              <!-- ICON SOSMED -->
              <div class="mt-3 flex items-center gap-2 text-gray-500">
                <!-- email -->
                <a
                  v-if="member.email"
                  :href="`mailto:${member.email}`"
                  class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-50 hover:bg-gray-100"
                >
                  <img
                    src="/img/struktur-organisasi/icon/email.png"
                    alt="Email"
                    class="w-3.5 h-3.5 object-contain"
                  />
                </a>

                <!-- instagram -->
                <a
                  v-if="member.instagram"
                  :href="member.instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-50 hover:bg-gray-100"
                >
                  <img
                    src="/img/struktur-organisasi/icon/instagram.png"
                    alt="Instagram"
                    class="w-3.5 h-3.5 object-contain"
                  />
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
/**
 * Semua icon di bawah ini pakai gambar kamu sendiri.
 * Taruh file-nya di /public/img/icon/ lalu sesuaikan path-nya.
 */
const stats = [
  {
    icon: '/img/struktur-organisasi/icon/tim.png',
    value: '12',
    label: 'Anggota Team',
  },
  {
    icon: '/img/struktur-organisasi/icon/fakultas.png',
    value: '7',
    label: 'Fakultas Binaan',
  },
  {
    icon: '/img/struktur-organisasi/icon/prodi.png',
    value: '23',
    label: 'Prodi Monev',
  },
  {
    icon: '/img/struktur-organisasi/icon/instrumen.png',
    value: '5',
    label: 'Instrumen Monev',
  },
  {
    icon: '/img/struktur-organisasi/icon/unsur.png',
    value: '6',
    label: 'Unsur Pelaksanaan Monev',
  },
]

const values = [
  {
    icon: '/img/struktur-organisasi/icon/integritas.png',
    title: 'Integritas dan Kepatuhan',
    description:
      'Menjaga kejujuran, objektivitas, dan kepatuhan terhadap standar mutu serta regulasi universitas.',
  },
  {
    icon: '/img/struktur-organisasi/icon/akuntabilitas.png',
    title: 'Akuntabilitas',
    description:
      'Setiap proses penjaminan mutu dan audit dapat dipertanggungjawabkan secara transparan kepada sivitas akademika.',
  },
  {
    icon: '/img/struktur-organisasi/icon/transparansi.png',
    title: 'Transparansi & Kolaborasi',
    description:
      'Membangun komunikasi terbuka dan sinergi dengan unit kerja untuk menguatkan budaya mutu.',
  },
  {
    icon: '/img/struktur-organisasi/icon/perbaikan.png',
    title: 'Perbaikan Berkelanjutan',
    description:
      'Mendorong evaluasi berkelanjutan agar mutu pendidikan dan tata kelola universitas terus meningkat.',
  },
]

// 2 pimpinan LPM
const leaders = [
  {
    name: 'Arie S Utami, M.T',
    title: 'Kepala LPM ',
    photo: '/img/struktur-organisasi/Bu Ari.jpeg',
    email: 'arie.utami@umc.ac.id',                     //belum ada
    instagram: 'https://instagram.com/ariesutami', 
  },
  {
    name: 'Dr. Fitri Dian Perwitasari, M.Si.',
    title: 'Ketua SPI UMC',
    photo: '/img/struktur-organisasi/Bu Fitri.jpg',
    email: 'fitri.dian@umc.ac.id',                     //belum ada
    instagram: 'https://instagram.com/username_lpm', 
  },
]

// contoh data tim – silakan ganti dengan nama & foto asli
const team = [
  {
    name: 'Ns. Agil Putra Tri Kartika, S.Kep., M.Kep ',
    role: 'Divisi Pengendalian Dokumen',
    photo: '/img/struktur-organisasi/Pak Agil, M.Kes.jpg',
    email: 'agil@umc.ac.id',
    instagram: 'https://instagram.com/agilputra',
  },
  {
    name: 'Hanikah, M.Pd',
    role: 'Divisi SPMI dan AMI',
    photo: '/img/struktur-organisasi/Bu Hanikah.jpeg',
    email: 'hanikah@umc.ac.id',
    instagram: 'https://instagram.com/anggota2',
  },
  {
    name: 'Dewi Yulianawati, M.Pd',
    role: 'Divisi Pengelolaan Data dan Sistem Informasi',
    photo: '/img/struktur-organisasi/Bu Dewi.jpeg',
    email: 'dewi.yulianawati@umc.ac.id',
    instagram: 'https://instagram.com/anggota3',
  },
  {
    name: 'Fitri Aprianti, M.Pd',
    role: 'Divisi SPME',
    photo: '/img/struktur-organisasi/Bu Fitri A.jpeg',
    email: 'fitri.aprianti@umc.ac.id',
    instagram: 'https://instagram.com/anggota4',
  },
  {
    name: 'Nama Anggota 5',
    role: 'GKMF(Gugus Kendali Mutu Fakultas)',
    photo: 'https://placehold.net/400x400.png',
    email: 'anggota5@umc.ac.id',
    instagram: 'https://instagram.com/anggota5',
  },
  {
    name: 'Nama Anggota 6',
    role: 'GKMF(Gugus Kendali Mutu Fakultas)',
    photo: 'https://placehold.net/400x400.png',
    email: 'anggota6@umc.ac.id',
    instagram: 'https://instagram.com/anggota6',
  },
  {
    name: 'Nama Anggota 7',
    role: 'GKMF(Gugus Kendali Mutu Fakultas)',
    photo: 'https://placehold.net/400x400.png',
    email: 'anggota7@umc.ac.id',
    instagram: 'https://instagram.com/anggota7',
  },
  {
    name: 'Nama Anggota 8',
    role: 'GKMF(Gugus Kendali Mutu Fakultas)',
    photo: 'https://placehold.net/400x400.png',
    email: 'anggota8@umc.ac.id',
    instagram: 'https://instagram.com/anggota8',
  },
]

useHead({
  title: 'Struktur Organisasi LPM & SPI - UMC',
})
</script>
