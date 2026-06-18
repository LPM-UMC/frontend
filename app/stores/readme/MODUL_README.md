# Modul API Documentation

Dokumen ini menjelaskan panduan penggunaan (consume) API untuk manajemen **Modul Evaluasi** di sisi *frontend* atau oleh *AI coding agents*. Modul Evaluasi dibagi menjadi dua tipe utama berdasarkan peruntukannya: **MONEV** (Monitoring dan Evaluasi) untuk LPM dan **AMI** (Audit Mutu Internal) untuk SPI.

---

## 1. Persyaratan Global (Headers)

Setiap *request* ke endpoint Modul wajib menyertakan *headers* berikut:

### a. Autentikasi & Otorisasi
- **`Authorization`**: `Bearer <token>`
  Seluruh endpoint di bawah ini mewajibkan pengguna dalam keadaan login (Authenticated).
  - Mutasi khusus `MONEV` (POST) memerlukan peran: `ketua-lpm` atau `admin-lpm`.
  - Mutasi khusus `AMI` (POST) memerlukan peran: `ketua-spi` atau `admin-spi`.
  - Update dan Delete memerlukan otorisasi admin global (ADMIN_ROLE).

### b. Internasionalisasi (i18n)
Modul ini mendukung multi-bahasa. Bahasa diatur melalui *header* HTTP:
- **`Accept-Language`**: `<kode-bahasa>` (contoh: `id` untuk Bahasa Indonesia, `en` untuk English).
- Apabila *header* ini tidak dikirimkan, API akan menggunakan default `id` (Bahasa Indonesia).
- Penerjemahan akan diterapkan pada field data seperti `nama`, `deskripsi`, serta label `tipe_modul`.

---

## 2. Struktur Data Utama (Models)

### `ModulResponse`
Representasi dari entitas Modul Evaluasi.
```typescript
{
  "id": "string",
  "nama": "string", // Teks terjemahan
  "deskripsi": "string", // Teks terjemahan
  "tipe_modul": { // Enum: "MONEV" atau "AMI"
    "kode": "string",
    "label": "string" // Teks terjemahan (contoh: "Monitoring dan Evaluasi")
  },
  "is_aktif": true/false, // Status keaktifan modul
  "total_aspek": number, // Jumlah Aspek evaluasi yang berelasi dengan modul ini
  "lingkup": { ...LingkupResponse }, // Object detail Lingkup Evaluasi
  "created_at": "ISO-8601 DateTime String",
  "updated_at": "ISO-8601 DateTime String"
}
```

---

## 3. Daftar Endpoint API

### A. Mendapatkan Daftar Modul
Mengambil daftar modul, dipisah berdasarkan tipenya (MONEV / AMI). Mendukung pencarian, pengurutan, dan paginasi.

- **URL (MONEV)**: `/api/modul/monev`
- **URL (AMI)**: `/api/modul/ami`
- **Method**: `GET`
- **Role**: Semua User Terautentikasi
- **Query Parameters**:
  - `page` (number, default: 1)
  - `size` (number, default: 10)
  - `search` (string, opsional)
  - `order` (string, opsional, default: "asc")

**Contoh Response Sukses (200 OK):**
```json
{
  "data": [
    { /* ...ModulResponse... */ }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 5,
    "size": 10
  }
}
```

### B. Mendapatkan Detail Modul Spesifik
Mengambil data tunggal Modul Evaluasi berdasarkan `modulId`.

- **URL**: `/api/modul/:modulId`
- **Method**: `GET`
- **Role**: Semua User Terautentikasi

**Contoh Response Sukses (200 OK):**
```json
{
  "data": { /* ...ModulResponse... */ }
}
```

### C. Membuat Modul Baru
Membuat Modul baru dan dikaitkan pada Lingkup Evaluasi. Endpoint dibedakan sesuai ranah/tipe modul.

- **URL (MONEV)**: `/api/modul/monev`
  - **Role**: `ketua-lpm`, `admin-lpm`
- **URL (AMI)**: `/api/modul/ami`
  - **Role**: `ketua-spi`, `admin-spi`
- **Method**: `POST`

**Request Body (JSON):**
Sesuai dengan `CreateModulRequest` Zod Schema.
```json
{
  "lingkup_id": "uuid-lingkup-evaluasi-terkait", // Wajib. Max: 255 karakter.
  "nama": "Modul Audit Keuangan", // Wajib. Panjang: 1 - 50 karakter.
  "deskripsi": "Modul untuk mengevaluasi manajemen keuangan program studi." // Wajib. Panjang: 1 - 500 karakter.
}
```

**Contoh Response Sukses (201 Created):**
```json
{
  "data": { /* ...ModulResponse... */ }
}
```

### D. Mengubah Data Modul
Memperbarui informasi pada modul yang ada. Berdasarkan validasi schema saat ini, endpoint PUT hanya bisa digunakan untuk memperbarui `deskripsi`.

- **URL**: `/api/modul/:modulId`
- **Method**: `PUT`
- **Role**: `ADMIN_ROLE`

**Request Body (JSON):**
Sesuai dengan `UpdateModulRequest` Zod Schema.
```json
{
  "deskripsi": "Deskripsi baru yang telah disesuaikan." // Wajib. Panjang: 1 - 500 karakter.
}
```

**Contoh Response Sukses (200 OK):**
```json
{
  "data": { /* ...ModulResponse... */ }
}
```

### E. Menghapus Modul
Menghapus modul berdasarkan `modulId`.

- **URL**: `/api/modul/:modulId`
- **Method**: `DELETE`
- **Role**: `ADMIN_ROLE`

**Contoh Response Sukses (204 No Content):**
*(Tidak ada body pada response, hanya status code 204).*

### F. Export Detail Modul ke PDF
Mengunduh dokumen PDF detail modul lengkap beserta Aspek, Panduan Bukti, dan Indikator Evaluasi di dalamnya.

- **URL**: `/api/modul/:modulId/export/pdf`
- **Method**: `GET`
- **Role**: Semua User Terautentikasi

**Headers:**
- `Authorization`: `Bearer <token>`
- `Accept-Language`: `<kode-bahasa>` (contoh: `id` untuk Bahasa Indonesia, `en` untuk English)

**Contoh Response Sukses (200 OK):**
- **Content-Type**: `application/pdf`
- **Content-Disposition**: `attachment; filename="laporan-modul.pdf"`
- **Response Body**: Binary PDF stream.

---

## 4. Panduan untuk AI Coding Agents & Frontend Devs

1. **Pemisahan Entitas:**
   Harap perhatikan bahwa *Fetching* (GET) dan *Creating* (POST) modul dipisah path-nya menjadi `/modul/monev` dan `/modul/ami`. Pastikan integrasi di *dashboard* Frontend diarahkan ke path yang tepat bergantung pada fitur atau user yang sedang login (LPM vs SPI).
2. **Type Safety & Mapping:**
   Buatlah *interface* TypeScript yang mendeskripsikan secara presisi struktur `ModulResponse`. Tangkap properti `total_aspek` dan `lingkup` jika Anda perlu menampilkan statistik *summary* di UI *Card/Table* modul.
3. **i18n Interceptor:**
   Sangat direkomendasikan untuk memasang konfigurasi otomatis (misal pada Axios Interceptors) yang menyertakan header `Accept-Language`. Hal ini menjamin bahwa seluruh data seperti `modul.nama`, `modul.deskripsi`, dan `modul.tipe_modul.label` akan secara dinamis ditranslasikan sesuai pilihan bahasa yang berlaku di Frontend.
4. **Validasi Klien:**
   Aplikasikan Zod / Yup / validator bawaan UI yang cocok dengan aturan validasi *backend* (Contoh: pembatasan deskripsi di maksimal 500 karakter). Dengan begitu, Frontend bisa menangkal request gagal (400 Bad Request) sebelum data dikirim ke server.
