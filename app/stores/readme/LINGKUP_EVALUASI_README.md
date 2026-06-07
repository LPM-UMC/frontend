# Dokumentasi API Modul Lingkup Evaluasi (Lingkup Evaluasi API Documentation)

Dokumentasi ini ditujukan untuk **Frontend Developers** dan **AI Agents** untuk memahami bagaimana cara mengkonsumsi API dari modul `lingkup-evaluasi`.

## 🌐 Konfigurasi Global (Global Configuration)

### 1. Headers yang Diperlukan (Required Headers)
Setiap permintaan ke API dalam modul ini **memerlukan** header berikut:

- `Authorization`: Token Bearer yang didapatkan saat login. Contoh: `Bearer <token>`
- `Accept-Language`: Digunakan untuk mendapatkan respons dalam bahasa tertentu (I18n). 
  - Jika tidak dikirimkan, secara default akan menggunakan bahasa Indonesia (`id_ID`).
  - Pilihan bahasa yang didukung:
    - `id_ID` (Bahasa Indonesia)
    - `en_US` (English)
    - `ar_SA` (Arabic)
    - `ja_JP` (Japanese)

### 2. Otorisasi (Authorization)
Hampir semua endpoint pada modul ini membutuhkan role **ADMIN**. Pastikan token pengguna memiliki akses admin. (Pengecualian hanya pada endpoint untuk mendapatkan detail Unit Lingkup yang bisa diakses oleh pengguna terautentikasi tanpa melihat role tertentu).

### 3. Format Paginasi & Pencarian (Pagination & Search Formats)
Endpoint yang mengembalikan daftar/list mendukung parameter query string berikut:
- `page`: (Number) Halaman yang ingin diambil. Default: `1`
- `size`: (Number) Jumlah data per halaman. Default: `10`
- `search`: (String, opsional) Kata kunci untuk mencari data berdasarkan nama atau properti lainnya.
- `order`: (String) Pengurutan data. Pilihan: `asc` atau `desc`. Default: `asc`

---

## 📚 Endpoints `Lingkup` (Scopes)

Entitas ini mengelola Master Data Lingkup Evaluasi beserta *Roles* yang bertugas (Auditee, Evaluator, Reviewer).

### 1. Mendapatkan Daftar Lingkup (Get Lingkup List)
- **Method:** `GET`
- **Path:** `/lingkup`
- **Query Params:** `page`, `size`, `search`, `order`
- **Role Required:** `ADMIN`

### 2. Mendapatkan Detail Lingkup (Get Lingkup Detail)
- **Method:** `GET`
- **Path:** `/lingkup/:lingkupId`
- **Params:** 
  - `lingkupId`: (UUID) ID dari lingkup yang dicari
- **Role Required:** `ADMIN`

### 3. Membuat Lingkup Baru (Create Lingkup)
- **Method:** `POST`
- **Path:** `/lingkup`
- **Role Required:** `ADMIN`
- **Body (JSON):**
  ```json
  {
    "nama": "string (Minimal 1, maksimal 25 karakter)",
    "deskripsi": "string (Minimal 1, maksimal 500 karakter)",
    "role_auditee_id": "string (UUID yang valid)",
    "role_evaluator_id": "string (UUID yang valid)",
    "role_reviewer_id": "string (UUID yang valid, opsional)"
  }
  ```

### 4. Mengubah Lingkup (Update Lingkup)
- **Method:** `PUT`
- **Path:** `/lingkup/:lingkupId`
- **Role Required:** `ADMIN`
- **Catatan:** Untuk entitas `Lingkup`, **hanya `deskripsi` yang dapat diubah**. Nama dan role *tidak bisa* diubah setelah dibuat.
- **Body (JSON):**
  ```json
  {
    "deskripsi": "string (Minimal 1, maksimal 500 karakter)"
  }
  ```

### 5. Menghapus Lingkup (Delete Lingkup)
- **Method:** `DELETE`
- **Path:** `/lingkup/:lingkupId`
- **Role Required:** `ADMIN`

---

## 🏢 Endpoints `Unit Lingkup` (Lingkup Units)

Unit Lingkup adalah turunan (anak) dari Lingkup, di mana di dalamnya kita me-*assign* pengguna (*Users*) spesifik untuk mengisi peran yang telah ditentukan di Lingkup.

### 1. Mendapatkan Daftar Unit dalam sebuah Lingkup (Get Unit List by Lingkup)
- **Method:** `GET`
- **Path:** `/lingkup/:lingkupId/unit`
- **Query Params:** `page`, `size`, `search`, `order`
- **Role Required:** `ADMIN`

### 2. Mendapatkan Detail Unit Lingkup (Get Unit Detail)
- **Method:** `GET`
- **Path:** `/unit-lingkup/:unitLingkupId`
- **Params:** 
  - `unitLingkupId`: (UUID) ID dari unit lingkup yang dicari
- **Role Required:** `Authenticated User` (Semua role bisa mengakses, tidak hanya admin)

### 3. Membuat Unit Lingkup Baru (Create Lingkup Unit)
- **Method:** `POST`
- **Path:** `/lingkup/:lingkupId/unit`
- **Role Required:** `ADMIN`
- **Catatan:** ID yang dikirimkan di sini adalah ID *User* (pengguna), bukan ID *Role*.
- **Body (JSON):**
  ```json
  {
    "nama": "string (Minimal 1, maksimal 25 karakter)",
    "deskripsi": "string (Minimal 1, maksimal 500 karakter)",
    "auditee_id": "string (UUID User yang valid)",
    "evaluator_id": "string (UUID User yang valid)",
    "reviewer_id": "string (UUID User yang valid, opsional)"
  }
  ```

### 4. Mengubah Unit Lingkup (Update Lingkup Unit)
- **Method:** `PUT`
- **Path:** `/unit-lingkup/:unitLingkupId`
- **Role Required:** `ADMIN`
- **Catatan:** Berbeda dengan Lingkup Master, pada Unit Lingkup, user yang di-*assign* bisa diubah. Namun *nama* tetap tidak bisa diubah.
- **Body (JSON):**
  ```json
  {
    "deskripsi": "string (Minimal 1, maksimal 500 karakter)",
    "auditee_id": "string (UUID User yang valid)",
    "evaluator_id": "string (UUID User yang valid)",
    "reviewer_id": "string (UUID User yang valid, opsional)"
  }
  ```

### 5. Menghapus Unit Lingkup (Delete Lingkup Unit)
- **Method:** `DELETE`
- **Path:** `/unit-lingkup/:unitLingkupId`
- **Role Required:** `ADMIN`

---

## 📦 Struktur Respons Data (Data Response Structure)

### 1. Struktur `Lingkup`
Data yang dikembalikan akan memiliki format berikut:
```json
{
  "id": "uuid",
  "kode": "string",
  "nama": "string (Diterjemahkan berdasarkan header Accept-Language jika tersedia)",
  "deskripsi": "string (Diterjemahkan berdasarkan header Accept-Language jika tersedia)",
  "role_auditee": { "id": "uuid", "kode": "string", "nama": "string", "deskripsi": "string" },
  "role_evaluator": { "id": "uuid", "kode": "string", "nama": "string", "deskripsi": "string" },
  "role_reviewer": { "id": "uuid", "kode": "string", "nama": "string", "deskripsi": "string" },
  "is_aktif": true,
  "created_at": "date",
  "updated_at": "date"
}
```

### 2. Struktur `Unit Lingkup`
Data yang dikembalikan akan memiliki format berikut:
```json
{
  "id": "uuid",
  "nama": "string (Diterjemahkan berdasarkan header Accept-Language jika tersedia)",
  "deskripsi": "string (Diterjemahkan berdasarkan header Accept-Language jika tersedia)",
  "auditee": { "id": "uuid", "username": "string", ... }, // Detail User
  "evaluator": { "id": "uuid", "username": "string", ... }, // Detail User
  "reviewer": { "id": "uuid", "username": "string", ... }, // Detail User
  "lingkup": { /* Detail Lingkup Induk seperti struktur di atas */ },
  "created_at": "date",
  "updated_at": "date"
}
```

**Tips untuk Frontend Developer & AI Agent:**
- Selalu tangkap respons error dari backend (seperti `400 Bad Request` dari validasi Zod jika field tidak sesuai, misal karakter terlalu pendek/panjang atau UUID tidak valid).
- Pastikan menyertakan header `Accept-Language` jika aplikasi Anda memiliki fitur multi-bahasa, API otomatis akan menerjemahkan kolom `nama` dan `deskripsi` jika terjemahannya ada di database (seperti yang ditangani oleh properti `.translations?.[0]` di model).
- Untuk tabel data di frontend, pasing params `page`, `size`, `search`, dan `order` agar paginasi dan pencarian berjalan dengan optimal (Server-Side Pagination).
