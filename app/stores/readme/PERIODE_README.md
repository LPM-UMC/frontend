# 📅 Periode Module — API Documentation

Dokumentasi lengkap untuk mengkonsumsi endpoint **Periode Akademik** dari frontend atau AI coding agent.

---

## 📋 Daftar Isi

- [Ringkasan Modul](#ringkasan-modul)
- [Autentikasi & Otorisasi](#autentikasi--otorisasi)
- [Endpoints](#endpoints)
  - [POST /periode](#post-periode)
  - [GET /periode](#get-periode)
  - [GET /periode/aktif](#get-periodeaktif)
  - [GET /periode/:periodeId](#get-periodeperiodeid)
  - [PATCH /periode/:periodeId](#patch-periodeperiodeid)
  - [PUT /periode/:periodeId/nonaktifkan](#put-periodeperiodeidnonaktifkan)
- [Penanganan Error](#penanganan-error)
- [Contoh Implementasi Frontend](#contoh-implementasi-frontend)
- [Tipe Data TypeScript](#tipe-data-typescript)

---

## Ringkasan Modul

Modul ini mengelola **Periode Akademik** (tahun ajaran + semester) yang menjadi acuan seluruh sistem LPM-SPI UMC. Setiap periode memiliki **kalender akademik** berupa file PDF.

Aturan bisnis penting:

- Hanya boleh ada **satu periode aktif** di satu waktu.
- Periode **tidak bisa dihapus permanen** — hanya bisa di-nonaktifkan.
- Update periode hanya bisa dilakukan pada **periode yang sedang aktif**.
- Saat periode dinonaktifkan, sistem otomatis mengirim **email notifikasi** ke semua Admin.
- Request menggunakan **`multipart/form-data`** (bukan JSON) karena ada upload file PDF.

---

## Autentikasi & Otorisasi

Semua endpoint membutuhkan **Access Token** di header:

```
Authorization: Bearer <access_token>
```

### Level Akses Endpoint

| Endpoint                              | Login Required | Role Required |
| ------------------------------------- | -------------- | ------------- |
| `POST /periode`                       | ✅ Ya          | Admin saja    |
| `GET /periode`                        | ✅ Ya          | Admin saja    |
| `GET /periode/aktif`                  | ❌ Tidak       | Publik        |
| `GET /periode/:periodeId`             | ✅ Ya          | Admin saja    |
| `PATCH /periode/:periodeId`           | ✅ Ya          | Admin saja    |
| `PUT /periode/:periodeId/nonaktifkan` | ✅ Ya          | Admin saja    |

> **Admin** = role `ketua-lpm`, `ketua-spi`, `admin-lpm`, `admin-spi`.

---

## Endpoints

### POST /periode

Membuat **periode akademik baru**. Request menggunakan `multipart/form-data` karena ada upload file kalender PDF.

**URL:** `POST /periode`

**Aturan bisnis:**

- Tidak boleh ada periode aktif lain saat membuat periode baru (`409 Conflict`).
- Tidak boleh ada periode dengan `tahun_ajaran` + `semester` yang sama (`409 Conflict`).
- Periode baru otomatis berstatus **aktif** (`is_aktif: true`).

**Form Data Fields:**

| Field             | Tipe                    | Wajib | Aturan                      |
| ----------------- | ----------------------- | ----- | --------------------------- |
| `tahun_ajaran`    | `string`                | ✅    | Contoh: `"2024/2025"`       |
| `semester`        | `"GANJIL"` \| `"GENAP"` | ✅    | Enum, case-sensitive        |
| `tanggal_mulai`   | `string` (date)         | ✅    | Format ISO/parseable Date   |
| `tanggal_selesai` | `string` (date)         | ✅    | Format ISO/parseable Date   |
| `file_kalender`   | `File` (PDF)            | ✅    | Maks **5 MB**, harus `.pdf` |

**Response Sukses `201 Created`:**

```json
{
  "data": {
    "id": "uuid-periode",
    "tahun_ajaran": "2024/2025",
    "semester": "Ganjil",
    "tanggal_mulai": "2024-08-01T00:00:00.000Z",
    "tanggal_selesai": "2025-01-31T00:00:00.000Z",
    "tanggal_diselesaikan": null,
    "is_aktif": true,
    "kalender": {
      "id": "uuid-kalender",
      "nama": "kalender-akademik-tahun-ajaran-2024-2025-semester-ganjil-uuid.pdf",
      "size": 204800,
      "tipe": "application/pdf"
    },
    "created_at": "2024-08-01T00:00:00.000Z",
    "updated_at": "2024-08-01T00:00:00.000Z"
  }
}
```

> **Penting:** Field `semester` di response sudah ditranslasikan sesuai `lang` (`GANJIL` → `"Ganjil"` untuk `id_ID`, atau `"Odd"` untuk `en_US`).

**Contoh Fetch:**

```typescript
const formData = new FormData();
formData.append("tahun_ajaran", "2024/2025");
formData.append("semester", "GANJIL");
formData.append("tanggal_mulai", "2024-08-01");
formData.append("tanggal_selesai", "2025-01-31");
formData.append("file_kalender", pdfFile); // File object dari <input type="file">

const response = await fetch("/periode", {
  method: "POST",
  headers: { Authorization: `Bearer ${accessToken}` },
  credentials: "include",
  body: formData,
  // ⚠️ JANGAN set Content-Type manual — biarkan browser yang mengatur boundary multipart
});

const { data } = await response.json();
```

---

### GET /periode

Mengambil daftar periode dengan **pagination** dan **pencarian**. Hanya Admin.

**URL:** `GET /periode`

**Query Parameters:**

| Parameter | Tipe                | Default | Keterangan                           |
| --------- | ------------------- | ------- | ------------------------------------ |
| `page`    | `number`            | `1`     | Halaman saat ini                     |
| `size`    | `number`            | `10`    | Jumlah item per halaman              |
| `search`  | `string`            | -       | Pencarian berdasarkan `tahun_ajaran` |
| `order`   | `"asc"` \| `"desc"` | `"asc"` | Urutan berdasarkan `tahun_ajaran`    |

**Response Sukses `200 OK`:**

```json
{
  "data": [
    {
      "id": "uuid-periode",
      "tahun_ajaran": "2024/2025",
      "semester": "Ganjil",
      "tanggal_mulai": "2024-08-01T00:00:00.000Z",
      "tanggal_selesai": "2025-01-31T00:00:00.000Z",
      "tanggal_diselesaikan": null,
      "is_aktif": true,
      "kalender": {
        "id": "uuid",
        "nama": "kalender.pdf",
        "size": 204800,
        "tipe": "application/pdf"
      },
      "created_at": "2024-08-01T00:00:00.000Z",
      "updated_at": "2024-08-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "size": 10,
    "total_pages": 1
  }
}
```

**Contoh Fetch:**

```typescript
const params = new URLSearchParams({ page: "1", size: "10" });
const res = await fetch(`/periode?${params}`, {
  headers: { Authorization: `Bearer ${accessToken}` },
  credentials: "include",
});
const { data, meta } = await res.json();
```

---

### GET /periode/aktif

Mengambil **periode yang sedang aktif**. Endpoint ini **publik** — tidak memerlukan login.

**URL:** `GET /periode/aktif`

**Response Sukses `200 OK`:**

```json
{
  "data": {
    "id": "uuid-periode",
    "tahun_ajaran": "2024/2025",
    "semester": "Ganjil",
    "tanggal_mulai": "2024-08-01T00:00:00.000Z",
    "tanggal_selesai": "2025-01-31T00:00:00.000Z",
    "tanggal_diselesaikan": null,
    "is_aktif": true,
    "kalender": {
      "id": "uuid",
      "nama": "kalender.pdf",
      "size": 204800,
      "tipe": "application/pdf"
    }
  }
}
```

**Error jika tidak ada periode aktif:** `404 Not Found`

**Contoh Fetch:**

```typescript
const res = await fetch("/periode/aktif");
if (res.status === 404) {
  console.log("Tidak ada periode aktif saat ini");
  return;
}
const { data } = await res.json();
```

> **Catatan untuk AI Agent:** Endpoint ini sering digunakan sebagai **pengecekan awal** sebelum user mengakses fitur yang memerlukan periode aktif.

---

### GET /periode/:periodeId

Mengambil detail **satu periode** berdasarkan ID. Hanya Admin.

**URL:** `GET /periode/:periodeId`

**Path Parameter:** `periodeId` — UUID periode.

**Response Sukses `200 OK`:** Sama dengan struktur `PeriodeResponse` di atas.

**Contoh Fetch:**

```typescript
const res = await fetch(`/periode/${periodeId}`, {
  headers: { Authorization: `Bearer ${accessToken}` },
  credentials: "include",
});
const { data } = await res.json();
```

---

### PATCH /periode/:periodeId

Memperbarui **tanggal** dan/atau **file kalender** periode. Hanya Admin.

> **Batasan:** Hanya periode yang **sedang aktif** yang bisa diupdate. Periode non-aktif akan mengembalikan `400 Bad Request`.

**URL:** `PATCH /periode/:periodeId`

**Request:** `multipart/form-data`

| Field             | Tipe            | Wajib | Aturan                         |
| ----------------- | --------------- | ----- | ------------------------------ |
| `tanggal_mulai`   | `string` (date) | ✅    | Format parseable Date          |
| `tanggal_selesai` | `string` (date) | ✅    | Format parseable Date          |
| `file_kalender`   | `File` (PDF)    | ❌    | Opsional. Maks 5 MB, harus PDF |

**Response Sukses `200 OK`:** Struktur `PeriodeResponse` yang sudah diperbarui.

**Contoh Fetch:**

```typescript
const formData = new FormData();
formData.append("tanggal_mulai", "2024-09-01");
formData.append("tanggal_selesai", "2025-02-28");
// file_kalender opsional — lewati jika tidak ingin ganti file
if (newPdfFile) {
  formData.append("file_kalender", newPdfFile);
}

const res = await fetch(`/periode/${periodeId}`, {
  method: "PATCH",
  headers: { Authorization: `Bearer ${accessToken}` },
  credentials: "include",
  body: formData,
});
const { data } = await res.json();
```

---

### PUT /periode/:periodeId/nonaktifkan

**Menonaktifkan** periode yang sedang aktif. Hanya Admin.

> ⚠️ **Perhatian:** Setelah dinonaktifkan, periode **tidak bisa diaktifkan kembali**. Sistem akan otomatis mengirim email notifikasi ke semua Admin.

**URL:** `PUT /periode/:periodeId/nonaktifkan`

**Request Body:** Tidak ada.

**Apa yang terjadi di server:**

1. Periode di-set `is_aktif: false` dan `tanggal_diselesaikan` diisi dengan waktu sekarang.
2. Email notifikasi dikirim ke semua user dengan role Admin (ketua-lpm, ketua-spi, admin-lpm, admin-spi).
3. Cache Redis di-invalidate.

**Response Sukses `200 OK`:** Struktur `PeriodeResponse` dengan `is_aktif: false`.

**Contoh Fetch:**

```typescript
const res = await fetch(`/periode/${periodeId}/nonaktifkan`, {
  method: "PUT",
  headers: { Authorization: `Bearer ${accessToken}` },
  credentials: "include",
});
const { data } = await res.json();
// data.is_aktif === false
// data.tanggal_diselesaikan === "<timestamp sekarang>"
```

---

## Penanganan Error

| HTTP Status        | Kondisi                                                                    | Solusi Frontend                     |
| ------------------ | -------------------------------------------------------------------------- | ----------------------------------- |
| `400 Bad Request`  | File bukan PDF, file > 5MB, format tanggal salah, atau periode tidak aktif | Tampilkan pesan error yang spesifik |
| `401 Unauthorized` | Token tidak valid/expired                                                  | Refresh token, lalu retry           |
| `403 Forbidden`    | User bukan Admin                                                           | Tampilkan pesan "Akses ditolak"     |
| `404 Not Found`    | Periode tidak ditemukan / tidak ada periode aktif                          | Tampilkan pesan sesuai konteks      |
| `409 Conflict`     | Sudah ada periode aktif / periode dengan tahun+semester sama sudah ada     | Minta user cek data yang sudah ada  |

---

## Contoh Implementasi Frontend

### Utility: `periodeApi.ts`

```typescript
import { authFetch } from "../auth/authClient";

const BASE = "/periode";

export type KalenderResponse = {
  id: string;
  nama: string;
  size?: number;
  tipe?: string;
};

export type PeriodeResponse = {
  id: string;
  tahun_ajaran: string;
  semester: string; // Sudah ditranslasikan: "Ganjil"/"Genap" atau "Odd"/"Even"
  tanggal_mulai?: string; // ISO 8601
  tanggal_selesai?: string; // ISO 8601
  tanggal_diselesaikan?: string | null;
  is_aktif?: boolean;
  kalender?: KalenderResponse;
  created_at?: string;
  updated_at?: string;
};

// GET /periode/aktif — publik, tidak perlu token
export async function getPeriodeAktif(): Promise<PeriodeResponse | null> {
  const res = await fetch(`${BASE}/aktif`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Gagal mengambil periode aktif");
  const { data } = await res.json();
  return data;
}

// GET /periode — daftar semua periode (admin)
export async function getPeriodeList(
  params: {
    page?: number;
    size?: number;
    search?: string;
    order?: "asc" | "desc";
  } = {},
) {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    size: String(params.size ?? 10),
    order: params.order ?? "asc",
    ...(params.search ? { search: params.search } : {}),
  });
  const res = await authFetch(`${BASE}?${query}`);
  if (!res.ok) throw new Error("Gagal mengambil daftar periode");
  return res.json();
}

// GET /periode/:id — detail satu periode (admin)
export async function getPeriodeById(
  periodeId: string,
): Promise<PeriodeResponse> {
  const res = await authFetch(`${BASE}/${periodeId}`);
  if (!res.ok) throw new Error("Periode tidak ditemukan");
  const { data } = await res.json();
  return data;
}

// POST /periode — buat periode baru (admin)
export async function createPeriode(payload: {
  tahun_ajaran: string;
  semester: "GANJIL" | "GENAP";
  tanggal_mulai: string;
  tanggal_selesai: string;
  file_kalender: File;
}): Promise<PeriodeResponse> {
  const formData = new FormData();
  formData.append("tahun_ajaran", payload.tahun_ajaran);
  formData.append("semester", payload.semester);
  formData.append("tanggal_mulai", payload.tanggal_mulai);
  formData.append("tanggal_selesai", payload.tanggal_selesai);
  formData.append("file_kalender", payload.file_kalender);

  const res = await authFetch(BASE, { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "Gagal membuat periode");
  }
  const { data } = await res.json();
  return data;
}

// PATCH /periode/:id — update tanggal/file (admin, hanya periode aktif)
export async function updatePeriode(
  periodeId: string,
  payload: {
    tanggal_mulai: string;
    tanggal_selesai: string;
    file_kalender?: File;
  },
): Promise<PeriodeResponse> {
  const formData = new FormData();
  formData.append("tanggal_mulai", payload.tanggal_mulai);
  formData.append("tanggal_selesai", payload.tanggal_selesai);
  if (payload.file_kalender)
    formData.append("file_kalender", payload.file_kalender);

  const res = await authFetch(`${BASE}/${periodeId}`, {
    method: "PATCH",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "Gagal memperbarui periode");
  }
  const { data } = await res.json();
  return data;
}

// PUT /periode/:id/nonaktifkan — nonaktifkan periode (admin)
export async function nonaktifkanPeriode(
  periodeId: string,
): Promise<PeriodeResponse> {
  const res = await authFetch(`${BASE}/${periodeId}/nonaktifkan`, {
    method: "PUT",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "Gagal menonaktifkan periode");
  }
  const { data } = await res.json();
  return data;
}
```

---

## Tipe Data TypeScript

```typescript
// Enum semester — nilai yang dikirim ke server (BUKAN yang ditampilkan)
type SemesterEnum = "GANJIL" | "GENAP";

// Nilai semester yang ditampilkan di UI (setelah ditranslasikan server)
// id_ID: 'Ganjil' | 'Genap'
// en_US: 'Odd'   | 'Even'

type KalenderResponse = {
  id: string;
  nama: string; // Nama file di server (UUID-based)
  size?: number; // Ukuran file dalam bytes
  tipe?: string; // MIME type, selalu "application/pdf"
};

type PeriodeResponse = {
  id: string;
  tahun_ajaran: string; // Contoh: "2024/2025"
  semester: string; // Sudah ditranslasikan sesuai lang
  tanggal_mulai?: string; // ISO 8601
  tanggal_selesai?: string; // ISO 8601
  tanggal_diselesaikan?: string | null; // Diisi saat nonaktifkan, null jika masih aktif
  is_aktif?: boolean;
  kalender?: KalenderResponse;
  created_at?: string;
  updated_at?: string;
};

type CreatePeriodeRequest = {
  tahun_ajaran: string;
  semester: SemesterEnum;
  tanggal_mulai: string;
  tanggal_selesai: string;
  file_kalender: File; // PDF, maks 5 MB
};

type UpdatePeriodeRequest = {
  tanggal_mulai: string;
  tanggal_selesai: string;
  file_kalender?: File; // Opsional, PDF, maks 5 MB
};
```

---

## Catatan Penting

| Hal                                   | Penjelasan                                                                |
| ------------------------------------- | ------------------------------------------------------------------------- |
| **`multipart/form-data`**             | Semua request CREATE & UPDATE wajib pakai FormData, bukan JSON            |
| **Jangan set `Content-Type` manual**  | Biarkan browser yang set agar `boundary` multipart otomatis terisi        |
| **Semester di request vs response**   | Kirim `"GANJIL"`/`"GENAP"` (enum), terima `"Ganjil"`/`"Odd"` (terjemahan) |
| **Hanya satu periode aktif**          | Cek dulu via `GET /periode/aktif` sebelum buat periode baru               |
| **Update hanya periode aktif**        | `PATCH` akan `400` jika periode sudah non-aktif                           |
| **Nonaktifkan tidak bisa dibatalkan** | Konfirmasi ke user sebelum memanggil endpoint ini                         |

---

## Struktur File Modul

```
src/modules/periode/
├── periode.controller.ts   # Routing & parsing request (form-data + query)
├── periode.service.ts      # Logika bisnis: CRUD, file, email notifikasi
├── periode.model.ts        # Type definitions & mapper toPeriodeResponse
├── periode.validation.ts   # Validasi Zod: file PDF, ukuran, enum semester
├── periode.util.ts         # Helper: saveKalender, deleteKalender, translateSemester
├── periode.redis.ts        # Cache key management & invalidasi
├── periode.container.ts    # Dependency injection container
└── test/                   # Unit tests
```

# Language Support

API mendukung multi-language menggunakan header:

```http
Accept-Language
```

Language diproses melalui `langMiddleware`.

Jika language tidak valid atau tidak tersedia, API otomatis menggunakan default:

```txt
id_ID
```

---

## Supported Languages

| Language         | Header Value |
| ---------------- | ------------ |
| Bahasa Indonesia | `id_ID`      |
| English          | `en_US`      |
| Arabic           | `ar_SA`      |
| Japanese         | `ja_JP`      |

---

## Example Request

Bahasa Indonesia:

```http
Accept-Language: id_ID
```

English:

```http
Accept-Language: en_US
```

Arabic:

```http
Accept-Language: ar_SA
```

Japanese:

```http
Accept-Language: ja_JP
```

---

## Language Fallback

Middleware menggunakan mekanisme fallback.

Contoh:

Request:

```http
Accept-Language: fr_FR
```

Karena tidak tersedia, API menggunakan:

```txt
id_ID
```

Implementasi:

```ts
const langHeader = c.req.header("Accept-Language") || "id";

const lang = langHeader as Lang;

const selectedLang: Lang = messages[lang] ? lang : "id_ID";
```

---

## Response Translation

Semua message API menggunakan language terpilih, termasuk:

- validation error
- unauthorized
- forbidden
- not found
- conflict
- deleted/gone message
- business logic message

Contoh:

Request:

```http
Accept-Language: en_US
```

Response:

```json
{
  "message": "User not found"
}
```

Request:

```http
Accept-Language: id_ID
```

Response:

```json
{
  "message": "Pengguna tidak ditemukan"
}
```

---

# Authentication

Semua endpoint menggunakan authentication middleware.

Header:

```http
Authorization: Bearer <token>
```

Localization:

```http
Accept-Language: id_ID
```
