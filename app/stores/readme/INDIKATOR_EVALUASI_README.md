# Indikator Evaluasi API Documentation

Dokumen ini menjelaskan panduan penggunaan (consume) API untuk modul **Indikator Evaluasi** di sisi *frontend* atau oleh *AI coding agents*. Modul ini berfokus pada manajemen indikator evaluasi yang berelasi langsung dengan sebuah Objek Evaluasi, termasuk komponen penilaian (skala penilaian atau checklist penilaian).

---

## 1. Persyaratan Global (Headers)

Setiap *request* ke endpoint Indikator Evaluasi wajib menyertakan *headers* berikut:

### a. Autentikasi & Otorisasi
- **`Authorization`**: `Bearer <token>`
  Sistem mengharuskan token JWT yang valid. Endpoint untuk mutasi data (POST, PUT, DELETE) dan melihat daftar indikator (GET dengan paginasi) memerlukan peran (role) **ADMIN_ROLE**.

### b. Internasionalisasi (i18n)
Modul ini mendukung multi-bahasa. Bahasa diatur melalui *header* HTTP:
- **`Accept-Language`**: `<kode-bahasa>` (contoh: `id` untuk Bahasa Indonesia, `en` untuk English).
- Apabila *header* ini tidak disertakan, sistem secara default (fallback) akan menggunakan `id` (Bahasa Indonesia / `id_ID`). 
- Pengaturan bahasa ini akan mempengaruhi respons dari API, khususnya teks pada *nama*, *deskripsi*, *pertanyaan*, dan deskripsi komponen penilaian, agar sesuai dengan bahasa yang dipilih.

---

## 2. Struktur Data Utama (Models)

### `SkalaPenilaianResponse`
Representasi dari kriteria tipe penilaian skala.
```typescript
{
  "id": "string",
  "nilai": number,
  "deskripsi": "string", // Sudah diterjemahkan sesuai bahasa
  "created_at": "ISO-8601 DateTime String",
  "updated_at": "ISO-8601 DateTime String"
}
```

### `ChecklistPenilaianResponse`
Representasi dari kriteria tipe penilaian checklist.
```typescript
{
  "id": "string",
  "nama": "string", // Sudah diterjemahkan sesuai bahasa
  "deskripsi": "string", // Sudah diterjemahkan sesuai bahasa
  "created_at": "ISO-8601 DateTime String",
  "updated_at": "ISO-8601 DateTime String"
}
```

### `IndikatorResponse`
Representasi utuh sebuah Indikator Evaluasi beserta metode penilaiannya.
```typescript
{
  "id": "string",
  "nama": "string", // Sudah diterjemahkan
  "deskripsi": "string", // Sudah diterjemahkan
  "pertanyaan": "string", // Sudah diterjemahkan
  "tipe_evaluasi": { // Enum tipe_evaluasi dari Prisma
    "kode": "string", // Contoh: "SKALA", "CHECKLIST", dll
    "label": "string" // Contoh: "Skala Penilaian" (sudah diterjemahkan)
  },
  "is_eksternal": true/false,
  "skala_penilaian": [...SkalaPenilaianResponse], // Opsional, ada jika tipe_evaluasi = SKALA
  "checklist_penilaian": [...ChecklistPenilaianResponse], // Opsional, ada jika tipe_evaluasi = CHECKLIST
  "objek": { ...ObjekResponse }, // Opsional (Data Relasi Objek Evaluasi)
  "created_at": "ISO-8601 DateTime String",
  "updated_at": "ISO-8601 DateTime String"
}
```

---

## 3. Daftar Endpoint API

### A. Mendapatkan Daftar Indikator Evaluasi (berdasarkan Objek)
Mengambil daftar Indikator Evaluasi yang berelasi dengan `objekId` tertentu. Mendukung pencarian, pengurutan, dan paginasi.

- **URL**: `/api/objek/:objekId/indikator` *(Note: Prefix `/api` disesuaikan dengan routing utama backend Anda)*
- **Method**: `GET`
- **Role**: `ADMIN_ROLE`
- **Query Parameters**:
  - `page` (number, default: 1) - Halaman data.
  - `size` (number, default: 10) - Jumlah data per halaman.
  - `search` (string, opsional) - Kata kunci untuk mencari indikator.
  - `order` (string, opsional, default: "asc") - Urutan data (`asc` atau `desc`).

**Contoh Response Sukses (200 OK):**
```json
{
  "data": [
    { /* ...IndikatorResponse... */ },
    { /* ...IndikatorResponse... */ }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 5,
    "size": 10
  }
}
```

### B. Mendapatkan Detail Indikator Evaluasi Spesifik
Mengambil data tunggal Indikator Evaluasi berdasarkan `indikatorId`.

- **URL**: `/api/indikator/:indikatorId`
- **Method**: `GET`
- **Role**: Authenticated User (Semua user yang login bisa mengakses)

**Contoh Response Sukses (200 OK):**
```json
{
  "data": { /* ...IndikatorResponse... */ }
}
```

### C. Membuat Indikator Evaluasi Baru
Membuat indikator evaluasi baru yang terikat pada `objekId` tertentu. Di endpoint ini juga dikirimkan pengaturan komponen penilaian (skala atau checklist).

- **URL**: `/api/objek/:objekId/indikator`
- **Method**: `POST`
- **Role**: `ADMIN_ROLE`

**Request Body (JSON):**
Sesuai dengan `CreateIndikatorRequest` Zod Schema. Perhatikan bahwa input `skala_penilaian` dan `checklist_penilaian` disesuaikan dengan nilai dari `tipe_evaluasi`.
```json
{
  "nama": "Kerapian Kelas", // Wajib. Panjang: 1 - 25 karakter.
  "deskripsi": "Indikator tingkat kerapian ruang kelas", // Wajib. Panjang: 1 - 255 karakter.
  "pertanyaan": "Seberapa rapi ruang kelas ini?", // Wajib. Panjang: 1 - 255 karakter.
  "tipe_evaluasi": "SKALA", // Wajib. Berasal dari enum tipe_evaluasi.
  "skala_penilaian": [ // Opsional (kirim jika tipe_evaluasi = SKALA)
    {
      "nilai": 1, // Min: 1, Max: 100
      "deskripsi": "Sangat Tidak Rapi" // Min: 1, Max: 255 karakter
    },
    {
      "nilai": 2,
      "deskripsi": "Rapi"
    }
  ],
  "checklist_penilaian": [] // Opsional (kirim jika tipe_evaluasi = CHECKLIST)
}
```

**Contoh Response Sukses (201 Created):**
```json
{
  "data": { /* ...IndikatorResponse... */ }
}
```

### D. Mengubah Data Indikator Evaluasi
Memperbarui informasi *basic* pada indikator evaluasi yang ada. **Catatan:** Sesuai validasi saat ini, API ini hanya mengizinkan update field dasar (`nama`, `deskripsi`, `pertanyaan`), tidak meng-update metode penilaian di dalam body ini.

- **URL**: `/api/indikator/:indikatorId`
- **Method**: `PUT`
- **Role**: `ADMIN_ROLE`

**Request Body (JSON):**
Sesuai dengan `UpdateIndikatorRequest` Zod Schema.
```json
{
  "nama": "Kerapian Kelas (Update)", // Wajib. Panjang: 1 - 50 karakter.
  "deskripsi": "Deskripsi baru yang telah diupdate.", // Wajib. Panjang: 1 - 255 karakter.
  "pertanyaan": "Apakah kelas ini sudah diupdate?" // Wajib. Panjang: 1 - 255 karakter.
}
```

**Contoh Response Sukses (200 OK):**
```json
{
  "data": { /* ...IndikatorResponse... */ }
}
```

### E. Menghapus Indikator Evaluasi
Menghapus indikator evaluasi berdasarkan `indikatorId`.

- **URL**: `/api/indikator/:indikatorId`
- **Method**: `DELETE`
- **Role**: `ADMIN_ROLE`

**Contoh Response Sukses (204 No Content):**
*(Tidak ada body pada response, hanya status code 204).*

---

## 4. Panduan untuk AI Coding Agents

1. **Safety & Typing:**
   Gunakan antarmuka (*interface*) TypeScript di sisi *Frontend* yang sesuai dengan `IndikatorResponse`, `CreateIndikatorRequest`, dan `UpdateIndikatorRequest`. Hal ini berguna untuk menghindari *type errors* serta memudahkan *autocomplete* kode.
2. **Dynamic Request Payload (Tipe Evaluasi):**
   Saat melakukan POST data (`CreateIndikatorRequest`), *logic* di frontend sebaiknya menyesuaikan pengiriman *array* `skala_penilaian` atau `checklist_penilaian` berdasarkan input `tipe_evaluasi` yang dipilih pengguna. Jika memilih `SKALA`, hanya pastikan input *array* skala penilaian yang terisi (checklist bisa dikosongkan/undefined), dan begitu sebaliknya.
3. **i18n Interceptor:**
   Direkomendasikan memasang *Axios Interceptor* atau *fetch wrapper* di Frontend yang secara konstan menginjeksikan header `Accept-Language` di seluruh panggilan API modul ini. Ini memastikan semua teks yang dihasilkan backend (`indikator.nama`, `indikator.pertanyaan`, dll) tersaji dengan terjemahan bahasa yang sesuai dengan preferensi UI pengguna.
4. **Validasi Klien (Zod):**
   Sebaiknya pasang validasi *form* di sisi klien (contohnya menggunakan Zod atau Yup di React/Vue) dengan parameter yang sama percis dengan *rules* validasi di Zod schema backend (contohnya *maxLength* 25 karakter untuk nama). Validasi ini mencegah permintaan jaringan ke *server* jika *form* masih *invalid* (menghindari HTTP 400 Bad Request).
