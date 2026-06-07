# Objek Evaluasi API Documentation

Dokumen ini menjelaskan cara menggunakan (consume) API untuk modul **Objek Evaluasi** di sisi *frontend* atau oleh *AI coding agents*. Modul ini berfokus pada manajemen data Objek Evaluasi beserta kolom-kolom spesifiknya yang terkait dengan suatu Lingkup Evaluasi.

---

## 1. Persyaratan Global (Headers)

Setiap request ke endpoint Objek Evaluasi wajib menyertakan headers berikut:

### a. Autentikasi & Otorisasi
- **`Authorization`**: `Bearer <token>`
  Token JWT valid wajib dikirimkan. Hampir semua endpoint mutasi (POST, PUT, DELETE) dan get data paginasi memerlukan peran (role) **ADMIN_ROLE**.

### b. Internasionalisasi (i18n)
Modul ini mendukung multi-bahasa. Bahasa diatur melalui header HTTP:
- **`Accept-Language`**: `<kode-bahasa>` (contoh: `id` untuk Bahasa Indonesia, `en` untuk English).
- Jika header ini tidak dikirimkan, API akan secara otomatis (fallback) menggunakan `id` (Bahasa Indonesia / `id_ID`). 
- Pengaturan bahasa ini akan mempengaruhi respons dari API, khususnya teks pada *label*, *nama*, *deskripsi*, dan pesan error/validasi agar sesuai dengan bahasa yang dipilih.

---

## 2. Struktur Data Utama (Models)

### `KolomEvaluasiResponse`
Representasi definisi dinamis kolom dari sebuah Objek Evaluasi.
```typescript
{
  "id": "string",
  "key": "string",
  "label": "string", // Sudah diterjemahkan sesuai bahasa
  "required": true/false,
  "tipe_data": "string", // Enum dari Prisma (misal: "STRING", "NUMBER", dll)
  "min_length": number, // Optional
  "max_length": number  // Optional
}
```

### `ObjekResponse`
Representasi utuh sebuah Objek Evaluasi beserta kolom dan nilainya.
```typescript
{
  "id": "string",
  "kode": "string",
  "nama": "string", // Sudah diterjemahkan
  "deskripsi": "string", // Sudah diterjemahkan
  "is_eksternal": true/false,
  "koloms": [...KolomEvaluasiResponse], // Opsional
  "rows": [...BarisObjekEvaluasiResponse], // Opsional
  "lingkup": { ...LingkupResponse }, // Opsional (Data Relasi Lingkup Evaluasi)
  "created_at": "ISO-8601 DateTime String",
  "updated_at": "ISO-8601 DateTime String"
}
```

---

## 3. Daftar Endpoint API

### A. Mendapatkan Daftar Objek Evaluasi (berdasarkan Lingkup)
Mengambil daftar Objek Evaluasi yang berelasi dengan `lingkupId` tertentu. Mendukung pencarian, pengurutan, dan paginasi.

- **URL**: `/api/lingkup/:lingkupId/objek` *(Note: Prefix `/api` disesuaikan dengan routing utama backend Anda)*
- **Method**: `GET`
- **Role**: `ADMIN_ROLE`
- **Query Parameters**:
  - `page` (number, default: 1) - Halaman data.
  - `size` (number, default: 10) - Jumlah data per halaman.
  - `search` (string, opsional) - Kata kunci untuk mencari objek.
  - `order` (string, opsional, default: "asc") - Urutan data (`asc` atau `desc`).

**Contoh Response Sukses (200 OK):**
```json
{
  "data": [
    { /* ...ObjekResponse... */ },
    { /* ...ObjekResponse... */ }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 5,
    "size": 10
  }
}
```

### B. Mendapatkan Detail Objek Evaluasi Spesifik
Mengambil data tunggal Objek Evaluasi berdasarkan `objekId`.

- **URL**: `/api/objek/:objekId`
- **Method**: `GET`
- **Role**: Authenticated User (Semua user yang login bisa akses)

**Contoh Response Sukses (200 OK):**
```json
{
  "data": { /* ...ObjekResponse... */ }
}
```

### C. Membuat Objek Evaluasi Baru
Membuat objek evaluasi baru yang terkait dengan `lingkupId` tertentu. Di sini, Anda juga dapat mendefinisikan kolom-kolom spesifik untuk objek tersebut.

- **URL**: `/api/lingkup/:lingkupId/objek`
- **Method**: `POST`
- **Role**: `ADMIN_ROLE`

**Request Body (JSON):**
Sesuai dengan `CreateObjekRequest` Zod Schema.
```json
{
  "nama": "Fasilitas Belajar", // Wajib. Panjang: 3 - 25 karakter.
  "deskripsi": "Objek evaluasi fasilitas ruang kelas.", // Wajib. Panjang: 10 - 255 karakter.
  "koloms": [ // Opsional. Daftar kolom/field khusus objek ini.
    {
      "label": "Jumlah Kursi", // Wajib. Panjang: 3 - 25 karakter.
      "tipe_data": "NUMBER", // Wajib. Enum tipe_data prisma.
      "min_length": 1, // Opsional. Min 1, Max 255.
      "max_length": 50, // Opsional. Min 1, Max 255.
      "required": true // Wajib.
    }
  ]
}
```

**Contoh Response Sukses (201 Created):**
```json
{
  "data": { /* ...ObjekResponse... */ }
}
```

### D. Mengubah Data Objek Evaluasi
Memperbarui informasi pada objek evaluasi yang ada. **Catatan:** Sesuai validasi saat ini, API ini hanya mengizinkan update field `deskripsi`.

- **URL**: `/api/objek/:objekId`
- **Method**: `PUT`
- **Role**: `ADMIN_ROLE`

**Request Body (JSON):**
Sesuai dengan `UpdateObjekRequest` Zod Schema.
```json
{
  "deskripsi": "Deskripsi baru yang telah diupdate." // Wajib. Minimal 1 karakter.
}
```

**Contoh Response Sukses (200 OK):**
```json
{
  "data": { /* ...ObjekResponse... */ }
}
```

### E. Menghapus Objek Evaluasi
Menghapus objek evaluasi berdasarkan `objekId`.

- **URL**: `/api/objek/:objekId`
- **Method**: `DELETE`
- **Role**: `ADMIN_ROLE`

**Contoh Response Sukses (204 No Content):**
*(Tidak ada body pada response, hanya status code 204).*

---

## 4. Panduan untuk AI Coding Agents

1. **Safety & Typing:**
   Gunakan TypeScript interface di sisi Frontend yang selaras dengan `ObjekResponse`, `CreateObjekRequest`, dan `UpdateObjekRequest` untuk menghindari *type errors* saat mapping response dari backend.
2. **Dynamic Fields (Kolom):**
   Saat membuat objek evaluasi (`POST`), perhatikan nested array `koloms`. Properti `tipe_data` harus berupa string yang cocok dengan enum Prisma di backend (biasanya UPPERCASE, seperti `STRING`, `NUMBER`, `BOOLEAN`, dll).
3. **i18n Interceptor:**
   Sangat direkomendasikan untuk men-setup Axios Interceptor atau fetch wrapper di frontend yang secara otomatis menyisipkan header `Accept-Language` pada setiap request API ini. Ini memastikan translasi dari backend (`objek.nama`, `kolom.label`, pesan error validasi) akan turun sesuai bahasa yang sedang aktif di UI pengguna.
4. **Validasi (Zod):**
   Buat form validation di frontend yang mencerminkan *rules* yang ada di Zod schema backend (contoh: batasan min/max length karakter). Ini akan memberikan *feedback* lebih cepat ke pengguna (UX lebih baik) sebelum request dikirim ke server (menghindari HTTP 400 Bad Request).
