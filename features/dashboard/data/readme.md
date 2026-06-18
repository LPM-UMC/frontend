Techstack
Frontend: Nuxt
Backend API: Bun + Hono + Zod
Database & ORM: PostgreSQL + Prisma
Cache & Queue: Redis + BullMQ
Storage: MinIO
Docs & Deployment: Swagger, Docker Compose, Nginx / Cloudflare Tunnels
auth: session + JWT + OAuth (Google)

isi tiap FM
FM.01 FORM MONITORING 
FM.02 HASIL EVALUASI 
FM.03 FORM TEMUAN
FM.04 RTL BERDASARKAN ANALISIS RESIKO (FMEA)
FM.05 BERITA ACARA MONITORING 
FM.06 FORM SURVEY 
FM.07 LAPORAN SURVEY


## Role
### 1) Admin (System Admin)
**Tugas utama:**
- Membuat **session/periode monev**.
- Membuat dan mengelola **modul monev** (mis. Monev Awal Pembelajaran, Akhir Pembelajaran, Visi Misi, dll) di dalam session.
- Mengatur **customisasi website** (template halaman, komponen, pengaturan form/tab FM, hak akses role).
- Mengelola akun dan role user.
- Monitoring aktivitas pengisian & progres (audit log, status, kelengkapan).
**Catatan:** Admin biasanya **tidak ikut mengisi penilaian**, fokus operasional sistem.

### 2) Kaprodi (Ketua Program Studi)
**Tugas utama (pengisi data):**
- Mengisi **FM.01** (data awal/indikator + link dokumen).
- Mengisi/unggah **bukti validasi & tanda tangan** pada **FM.05 (Berita Acara)** sesuai kewenangannya (sebagai pihak yang menandatangani/menyetujui dari sisi prodi).

### 3) GKMF
**Tugas utama (penilai/validator tingkat fakultas/prodi):**
- Melakukan **penilaian terhadap isian Kaprodi** (umumnya pada **FM.03** bila FM.03 diposisikan sebagai evaluasi/penilaian).
- Memberikan catatan/temuan (bisa terkait **FM.02** jika prosesmu menempatkan temuan dari hasil monitoring).
- Ikut tanda tangan/validasi pada **FM.05** bila memang tercantum sebagai pihak yang menandatangani.

### 4) LPM
**Tugas utama (pengawasan & validasi level lembaga):**
- Mengawasi seluruh pelaksanaan monev lintas prodi/fakultas.
- Melakukan **validasi/approval** sesuai alur (mis. verifikasi hasil evaluasi, temuan, RTL, berita acara/laporan) (Yang bisa memvalidasi hanya ketuanya saja).
- Memastikan kepatuhan standar mutu.
- Untuk ketuanya diberi akses admin untuk modul MONEV

### 5) SPI
**Tugas utama (pengawasan & validasi/audit):**
- Mengawasi pelaksanaan dari sisi kepatuhan/audit internal.
- Melakukan **validasi/approval** bila dibutuhkan di alur (tergantung SOP kampus) (Yang bisa memvalidasi hanya ketuanya saja).
- Memberikan catatan rekomendasi bila ada temuan audit.
- Untuk ketuanya diberi akses admin untuk modul AMI

### 6) Dekan
**Tugas utama (pengawasan & persetujuan level fakultas):**
- Mengawasi pelaksanaan monev pada lingkup fakultas.
- Melakukan **validasi/approval** pada tahap yang ditentukan (seringnya pada berita acara/laporan).

### 7) Wakil Rektor
**Tugas utama (pengawasan & persetujuan level universitas):**
- Mengawasi secara umum.
- Melakukan **validasi/approval final** pada tahap tertentu (biasanya dokumen/laporan yang sudah dirangkum).

### 8) Rektor
**Tugas utama (otorisasi tertinggi):**
- Mengawasi keseluruhan.
- Melakukan **validasi/approval** pada tahap akhir bila SOP mensyaratkan (terutama dokumen final).

### 9) Mahasiswa
**Tugas utama (responden):**
- Mengisi **FM.06 (Survey Kesiapan Pembelajaran)** pada halaman survey yang disediakan.

disini kita akan menggunakan database dari luar (greatsys yaitu website kampus) untuk mengambil data yang sudah tersedia disana misalanya, fakultas, program studi, mahasiswa, dll

dan untuk database dari backend mungkin yang baru terbayang untuk admin dan ketua dari LPM dan SPI

fm 01
RPS ambil dari greatsys
asesmen rubrik, dari greatsys (sementara dari bagian dokumen uas dan uts (minta dibuat))
aspek media dan sumber belajar, dari greatsys dan daftar pustaka
jadwal dan kehadiran, dari greatsys pertemuan pertamanya saja
sosialisasi, buktinya dari Ringkasan: 1. Pendahuluan 2. pengenalan kurikulum OBE 3. kontrak kuliah dari greatsys
aik, dari sikap di RPS dari greatsys
perwalian dan pembelajaran, dari greatsys
sarana dan prasarana kaprodi yang upload jadwal perkuliahan ngambil dari TU (bentuknya pdf)
Praktikum (manual dari kaprodi bentuknya link gd)

macam macam modul
Monev
1.Monev Visi Misi
2.Monev Kerjasama
3.Monev Tata Pamong dan Tata Kelola
4.Monev Layanan Manajemen
5.Monev Kepuasan Layanan Mahasiswa
6.Monev Layanan Administrasi Akademik
7.Monev Pengelolaan SDM
8.Monev Keuangan dan SAPRAS
9.Monev Penyelenggaraan Pendidikan
10.Monev Awal Pembelajaran
11.Monev Akhir Pembelajaran
12.Monev Penelitian
13.Monev PkM
14.Monev AIK
15.Monev Evaluasi Capaian Kinerja
16.Monev Tindak Lanjut AMI

AMI
1.Audit Kepatuhan
2.Audit Kinerja
3.Manajemen risiko
4.Monev Fakultas
5.Monev Lembaga
6.Pengawasan Pelaksanaan Internal
7.Pelaporan dan Pelaksanaan Tindak Lanjut
8.Pemantauan Tindak Lanjut Hasil Pengawasan
9.Penanganan Pengaduan
10.Pendukung dan Etika
11.Pengelolaan Dikumen
12.Penyusunan Laporan Hasil Pengawasan
13.Rencana Pengawasan Tahunan
14.Reviu
15.Tata Kelola
16.Tindak Lanjut Lembaha Univ

Fakultas
o Fakultas Keguruan dan Ilmu Pendidikan
o Fakultas Ilmu Kesehatan
o Fakultas Ilmu Sosial dan Ilmu Politik
o Fakultas Fakultas Teknik
o Fakultas Hukum
o Fakultas Ekonomi dan Bisnis
o Fakultas Agama Islam

Program Studi
o PGPAUD
o PGSD
o Pendidikan IPA
o Pendidikan Matematika
o Pendidikan Bahasa Inggris
o Pendidikan Kimia
o PPG
o Ilmu Keperawatan
o Ilmu Keolahragaan
o Gizi
o Profesi Ners
o Peternakan
o D3 Teknik Informatika
o S1 Teknik Informatika
o Teknik Industri
o Ilmu Hukum
o Akuntansi
o Manajemen
o Ilmu Pemerintahan
o Ilmu Komunikasi
o Hubungan Masyarakat
o Ilmu Tasawuf dan Psikoterapi
o Ilmu Alquran dan Tafsir

contoh strukturnya
-modul A
--modul A.1
---periode 2025/2026
----FM.01 FORM MONITORING 
----FM.02 HASIL EVALUASI 
----FM.03 FORM TEMUAN
----FM.04 RTL BERDASARKAN ANALISIS RESIKO (FMEA)
----FM.05 BERITA ACARA MONITORING 
----FM.06 FORM SURVEY 
----FM.07 LAPORAN SURVEY
---periode 2026/2027
--modul A.2
--modul A.3
--...
-modul B
--modul B.1
--modul B.2
--modul B.3
--...