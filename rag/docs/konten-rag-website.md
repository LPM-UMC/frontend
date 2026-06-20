# Cakupan Isi RAG Website LPM dan SPI

Dokumen ini berisi panduan tentang jenis informasi yang sebaiknya dimasukkan ke knowledge base RAG pada website admin LPM dan SPI. Tujuannya agar AI dapat menjawab pertanyaan pengguna berdasarkan dokumen internal, SOP, istilah, aturan status, dan alur kerja yang relevan dengan sistem.

## Tujuan RAG di Website

RAG digunakan agar AI tidak hanya menjawab secara umum, tetapi mengambil konteks dari dokumen yang sudah disediakan pada folder `rag/docs` dan sumber resmi lain yang di-ingest.

RAG pada website sebaiknya membantu pengguna untuk:

- Menjelaskan fitur dashboard admin.
- Menjawab pertanyaan terkait Form 01 atau monev pembelajaran.
- Menjelaskan status pengisian seperti DRAFT dan SUBMITTED.
- Membantu memahami SOP LPM dan SPI.
- Membantu membuat ringkasan dokumen.
- Membantu membuat draft teks, surat, catatan, atau laporan berbasis konteks.
- Menjawab FAQ yang sering ditanyakan oleh admin, LPM, SPI, kaprodi, atau pihak terkait.
- Memberi arahan penggunaan fitur tanpa mengarang informasi di luar dokumen.

## Prinsip Penulisan Konten RAG

Konten RAG sebaiknya ditulis dengan prinsip berikut:

- Gunakan bahasa yang jelas, singkat, dan konsisten.
- Satu bagian membahas satu topik utama.
- Pakai heading Markdown seperti `#`, `##`, dan `###` agar mudah dipotong menjadi chunk.
- Sertakan sinonim istilah penting, misalnya Form 01, Fm 01, FORM-01, dan Monev 1.
- Tuliskan aturan secara eksplisit, terutama aturan status dan validasi.
- Pisahkan fakta resmi dari contoh penggunaan.
- Hindari informasi yang belum pasti atau hanya asumsi.
- Jika ada perubahan aturan, update dokumen sumbernya.

## Area Konten yang Disarankan

### 1. Profil Sistem

Isi yang disarankan:

- Nama sistem atau website.
- Tujuan utama website.
- Pengguna utama sistem.
- Peran LPM dan SPI di dalam sistem.
- Hubungan dashboard dengan modul monev, modul generator, survey generator, dan kalender generator.

Contoh pertanyaan yang harus dapat dijawab:

- Website ini digunakan untuk apa?
- Siapa pengguna utama dashboard admin?
- Apa perbedaan peran LPM dan SPI?
- Modul apa saja yang tersedia di dashboard?

### 2. Dashboard Admin

Isi yang disarankan:

- Fungsi halaman dashboard.
- Penjelasan setiap menu.
- Alur umum pengguna setelah login.
- Hak akses dasar berdasarkan role.

Menu yang perlu dijelaskan:

- Monev.
- Modul Generator.
- Survey Generator.
- Kalender Generator.
- Chatbot AI Admin.

Contoh pertanyaan yang harus dapat dijawab:

- Apa fungsi menu Monev?
- Untuk apa Modul Generator digunakan?
- Apa fungsi Survey Generator?
- Di mana pengguna dapat bertanya ke AI?

### 3. Monev Pembelajaran atau Form 01

Isi yang disarankan:

- Definisi Form 01.
- Sinonim Form 01, seperti Fm 01, FORM-01, dan Monev 1.
- Tujuan monev pembelajaran.
- Pihak yang mengisi atau memeriksa.
- Periode pengisian.
- Status pengisian.
- Syarat data dianggap selesai.
- Alur dari draft sampai submit.
- Masalah umum yang sering terjadi.

Aturan penting:

- Status SUBMITTED dianggap selesai.
- Status DRAFT belum dianggap selesai.
- Jika tidak ada submission, maka pengguna dianggap belum submit.
- Jika hanya ada DRAFT, maka tetap dianggap belum submit.

Contoh pertanyaan yang harus dapat dijawab:

- Apa itu Form 01?
- Kapan pengisian Form 01 dianggap selesai?
- Apakah DRAFT dihitung sudah submit?
- Apa arti belum submit?
- Siapa yang bertanggung jawab pada monev pembelajaran?

### 4. Status dan Validasi Data

Isi yang disarankan:

- Daftar status yang digunakan sistem.
- Makna setiap status.
- Dampak status terhadap laporan.
- Aturan validasi data.
- Perbedaan data kosong, DRAFT, dan SUBMITTED.

Contoh status:

| Status | Arti | Dihitung selesai |
| --- | --- | --- |
| DRAFT | Data masih disimpan sementara | Tidak |
| SUBMITTED | Data sudah dikirim final | Ya |
| Tidak ada data | Belum pernah mengisi | Tidak |

Contoh pertanyaan yang harus dapat dijawab:

- Apa perbedaan DRAFT dan SUBMITTED?
- Mengapa data DRAFT tidak muncul sebagai selesai?
- Bagaimana sistem menentukan prodi belum submit?

### 5. Role dan Hak Akses

Isi yang disarankan:

- Daftar role dalam sistem.
- Tugas setiap role.
- Batasan akses setiap role.
- Halaman yang dapat diakses oleh setiap role.
- Data yang dapat dilihat dan dikelola setiap role.

Role yang mungkin perlu dijelaskan:

- LPM.
- SPI.
- Admin.
- Kaprodi.
- Dosen.
- Fakultas.
- Program studi.

Contoh pertanyaan yang harus dapat dijawab:

- Apa tugas role LPM?
- Apa tugas role SPI?
- Apa yang dapat dilakukan Kaprodi?
- Siapa yang dapat melihat hasil monev?

### 6. SOP LPM dan SPI

Isi yang disarankan:

- SOP monitoring dan evaluasi.
- SOP audit atau pengawasan internal.
- SOP pengumpulan data.
- SOP validasi data.
- SOP pelaporan.
- SOP tindak lanjut.
- Urutan proses dari awal sampai selesai.
- Dokumen atau form yang digunakan pada tiap proses.

Contoh pertanyaan yang harus dapat dijawab:

- Bagaimana alur monev pembelajaran?
- Apa langkah setelah data monev dikumpulkan?
- Siapa yang memvalidasi laporan?
- Bagaimana tindak lanjut hasil monev?

### 7. Pedoman Skor dan Penilaian

Isi yang disarankan:

- Definisi skor.
- Skala penilaian.
- Kriteria setiap nilai.
- Rumus perhitungan jika ada.
- Interpretasi hasil.
- Contoh kasus penilaian.
- Batas nilai untuk kategori baik, cukup, atau perlu tindak lanjut.

Contoh pertanyaan yang harus dapat dijawab:

- Bagaimana cara membaca skor monev?
- Apa arti skor rendah?
- Kapan hasil monev perlu tindak lanjut?
- Apa kriteria penilaian yang digunakan?

### 8. Modul Generator

Isi yang disarankan:

- Fungsi Modul Generator.
- Jenis dokumen yang dapat dibuat.
- Struktur dokumen yang dihasilkan.
- Input yang diperlukan.
- Aturan penamaan dokumen.
- Batasan penggunaan AI untuk membuat draft.
- Contoh format dokumen.

Contoh dokumen yang dapat dijelaskan:

- Modul pembelajaran.
- Dokumen mutu.
- Draft laporan.
- Ringkasan SOP.
- Catatan rekomendasi.

Contoh pertanyaan yang harus dapat dijawab:

- Apa fungsi Modul Generator?
- Dokumen apa yang bisa dibuat?
- Data apa yang harus disiapkan sebelum membuat modul?
- Apakah AI boleh membuat draft laporan?

### 9. Survey Generator

Isi yang disarankan:

- Fungsi Survey Generator.
- Jenis survey yang dapat dibuat.
- Alur membuat survey.
- Struktur pertanyaan survey.
- Jenis skala jawaban.
- Contoh indikator survey.
- Cara membaca hasil survey.
- Batasan penggunaan data responden.

Contoh pertanyaan yang harus dapat dijawab:

- Untuk apa Survey Generator digunakan?
- Apa saja jenis pertanyaan survey?
- Bagaimana menyusun indikator survey?
- Bagaimana hasil survey digunakan untuk evaluasi mutu?

### 10. Kalender Generator

Isi yang disarankan:

- Fungsi Kalender Generator.
- Jenis agenda yang dapat dibuat.
- Kalender kegiatan mutu.
- Jadwal monev.
- Jadwal audit.
- Jadwal pengumpulan dokumen.
- Pengingat tenggat waktu.
- Relasi agenda dengan role pengguna.

Contoh pertanyaan yang harus dapat dijawab:

- Apa fungsi Kalender Generator?
- Agenda apa saja yang perlu masuk kalender mutu?
- Kapan monev dilakukan?
- Bagaimana mengatur jadwal evaluasi?

### 11. FAQ Pengguna

Isi yang disarankan:

- Pertanyaan yang sering muncul.
- Jawaban singkat dan langsung.
- Kesalahan umum saat menggunakan sistem.
- Solusi sederhana untuk masalah umum.
- Kontak atau pihak yang perlu dihubungi jika masalah tidak selesai.

Contoh pertanyaan:

- Mengapa status masih DRAFT?
- Mengapa data belum muncul di laporan?
- Bagaimana menghapus atau mengubah data?
- Apa yang harus dilakukan jika salah submit?
- Bagaimana cara mengetahui prodi yang belum submit?

### 12. Glosarium Istilah

Isi yang disarankan:

- Istilah singkatan.
- Istilah teknis sistem.
- Istilah akademik.
- Istilah mutu.
- Sinonim yang sering digunakan pengguna.

Contoh istilah:

- Form 01.
- Fm 01.
- Monev.
- Kaprodi.
- Prodi.
- Fakultas.
- Submit.
- Draft.
- Submitted.
- LPM.
- SPI.

### 13. Template Jawaban AI

Isi yang disarankan:

- Gaya jawaban yang diharapkan.
- Format jawaban untuk ringkasan.
- Format jawaban untuk draft.
- Format jawaban untuk instruksi langkah demi langkah.
- Batasan agar AI tidak menjawab di luar sumber.

Contoh aturan:

- Jika sumber tidak tersedia, AI harus mengatakan bahwa informasi belum ada di dokumen RAG.
- Jika pengguna bertanya tentang status, AI harus merujuk aturan DRAFT dan SUBMITTED.
- Jika pengguna meminta draft, AI boleh membuat contoh tetapi harus menyebut bahwa draft perlu dicek ulang.
- Jika pertanyaan terlalu umum, AI dapat meminta konteks tambahan.

### 14. Troubleshooting Sistem

Isi yang disarankan:

- Masalah umum pada pengisian form.
- Masalah status tidak berubah.
- Masalah data tidak muncul.
- Masalah dokumen tidak bisa dibuat.
- Masalah chatbot tidak menjawab.
- Langkah pengecekan sederhana.

Contoh pertanyaan yang harus dapat dijawab:

- Mengapa chatbot tidak merespons?
- Mengapa data saya belum tersimpan?
- Apa yang harus dicek jika laporan kosong?
- Kenapa status belum SUBMITTED?

### 15. Batasan dan Keamanan Informasi

Isi yang disarankan:

- Informasi yang boleh dimasukkan ke RAG.
- Informasi yang tidak boleh dimasukkan ke RAG.
- Batasan privasi data pengguna.
- Batasan penggunaan data mahasiswa, dosen, dan responden survey.
- Aturan tidak memasukkan password, token, API key, atau kredensial.

Informasi yang tidak disarankan masuk RAG:

- Password dan data login.
- API key atau token sistem.
- Data pribadi sensitif tanpa izin.
- Nilai individu mahasiswa jika tidak diperlukan.
- Data responden survey yang bersifat rahasia.
- Informasi internal yang belum final.
- Opini pribadi yang tidak menjadi aturan resmi.

## Prioritas Dokumen untuk Di-ingest

Prioritas tinggi:

- SOP monev pembelajaran.
- Aturan status DRAFT dan SUBMITTED.
- FAQ admin.
- Glosarium istilah.
- Pedoman skor dan penilaian.
- Panduan role dan hak akses.

Prioritas sedang:

- Template laporan.
- Template surat atau catatan rekomendasi.
- Panduan penggunaan dashboard.
- Panduan survey dan kalender.

Prioritas rendah:

- Catatan informal.
- Contoh percakapan.
- Draft dokumen yang belum disetujui.

## Format Dokumen yang Direkomendasikan

Gunakan format Markdown sederhana:

```md
# Judul Dokumen

## Topik Utama

Penjelasan singkat.

## Aturan

- Aturan pertama.
- Aturan kedua.

## Contoh Pertanyaan

- Pertanyaan pengguna.
- Pertanyaan pengguna lainnya.
```

Untuk aturan yang sifatnya keputusan, gunakan format tabel:

```md
| Kondisi | Status | Kesimpulan |
| --- | --- | --- |
| Ada submission final | SUBMITTED | Selesai |
| Hanya tersimpan sementara | DRAFT | Belum selesai |
| Tidak ada data | Tidak ada | Belum submit |
```

## Checklist Isi RAG

Sebelum dokumen dimasukkan ke RAG, pastikan:

- Judul dokumen jelas.
- Setiap istilah penting sudah didefinisikan.
- Aturan status ditulis eksplisit.
- Ada contoh pertanyaan jika memungkinkan.
- Tidak ada data rahasia.
- Tidak ada informasi yang saling bertentangan.
- Dokumen masih relevan dengan sistem.
- Dokumen sudah menggunakan bahasa yang konsisten.

## Contoh Struktur Folder RAG

Struktur yang disarankan:

```txt
rag/docs/
  faq.md
  glossary.md
  sop-monev.md
  rule-status.md
  pedomanskor.md
  panduan-dashboard.md
  panduan-role.md
  panduan-modul-generator.md
  panduan-survey-generator.md
  panduan-kalender-generator.md
  troubleshooting.md
  kebijakan-ai.md
```

## Catatan Pengembangan

Jika sistem bertambah fitur baru, tambahkan dokumen RAG baru sesuai fitur tersebut. Setiap perubahan aturan sistem harus diperbarui di dokumen RAG agar jawaban AI tetap akurat.

AI sebaiknya menjawab berdasarkan dokumen yang tersedia. Jika informasi belum ada di knowledge base, AI sebaiknya menyampaikan bahwa informasi belum ditemukan dan menyarankan pengguna mengecek admin atau dokumen resmi.
