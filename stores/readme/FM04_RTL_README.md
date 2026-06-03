# FM04 — RTL & FMEA (Frontend Integration Guide)

Dokumentasi ini ditujukan untuk **AI agent frontend** dan developer, agar bisa mengintegrasikan UI dengan modul **FM04 RTL FMEA** berdasarkan implementasi aktual di backend.

## Gambaran singkat

Modul **FM04 RTL FMEA** menangani alur:

- **Temuan (FM03)** yang sudah **DIVALIDASI** dianalisis menggunakan **FMEA** (menghasilkan `AnalisisFMEA` berisi dampak, penyebab, serta skor `severity`, `occurrence`, `detection`).
- Sistem menghitung **nilai RPN** dan menetapkan **kategori RPN** (`RENDAH | SEDANG | TINGGI`).
- Untuk hasil analisis (khususnya `SEDANG/TINGGI`) yang belum punya tindak lanjut, Auditee membuat **RTL (Rencana Tindak Lanjut)**.
- Auditee mengisi **progres RTL** sampai selesai.

Modul ini juga menyediakan endpoint listing dengan **pagination**, **search**, dan **order** untuk membantu UI menampilkan daftar.

## Base URL & Header penting

- **Base path**: semua endpoint di bawah berada pada prefix `"/api"` (lihat `src/app.ts`).
- **Auth**: semua endpoint FM4 memakai `authMiddleware` → wajib `Authorization: Bearer <token>` (jika tidak, 401).
- **Bahasa / i18n**:
  - Backend membaca header: `Accept-Language`.
  - Nilai yang didukung (enum `kode_bahasa`): `id_ID`, `en_US`, `ar_SA`, `ja_JP`.
  - Jika header tidak valid, backend fallback ke `id_ID` (lihat `src/middleware/lang.middleware.ts`).

## Bentuk response standar

### Success (single object)

```json
{ "data": { /* object */ } }
```

### Success (paging)

```json
{
  "data": [ /* array */ ],
  "meta": { "total": 1, "page": 1, "size": 10, "total_pages": 1 }
}
```

Tipe paging mengikuti `PagingResponse<T>` (`src/utils/model-util.ts`).

### Error (global handler)

Backend mengembalikan:

- `404` not found route:

```json
{ "errors": "Not Found" }
```

- `HTTPException` (mis. 403/404/409): 

```json
{ "errors": "<message>" }
```

- `ZodError` (400 validation):

```json
{ "errors": { "formErrors": [], "fieldErrors": { "field": ["..."] } } }
```

## Daftar endpoint (FM04)

### 1) Get informasi FM04 untuk konteks unit & periode modul

- **Method**: `GET`
- **URL**: `/api/fm4/periode-modul/:periodeModulId/unit-lingkup-periode-modul/:unitLingkupPeriodeModulId/informasi`
- **Fungsi**: Mengambil ringkasan informasi periode modul + unit lingkup + status pelaksanaan FM RTL yang sedang berjalan (untuk header halaman FM04).
- **Path params**:
  - `periodeModulId` (uuid, **required**)
  - `unitLingkupPeriodeModulId` (uuid, **required**)
- **Contoh request**:

```http
GET /api/fm4/periode-modul/3a0b.../unit-lingkup-periode-modul/9c12.../informasi
Authorization: Bearer <token>
Accept-Language: id_ID
```

- **Contoh response (200)** (struktur mengikuti `FMInformationResponse`, lihat modul `periode-modul`):

```json
{
  "data": {
    "periode_modul": {
      "id": "3a0b...",
      "status_pelaksanaan": { "kode": "SEDANG_BERLANGSUNG", "label": "Sedang berlangsung" },
      "unit_lingkup_periode_moduls": [
        {
          "id": "9c12...",
          "unit_lingkup": { "id": "....", "nama": "....", "deskripsi": "...." },
          "created_at": "2026-06-02T00:00:00.000Z",
          "updated_at": "2026-06-02T00:00:00.000Z"
        }
      ],
      "created_at": "2026-06-02T00:00:00.000Z",
      "updated_at": "2026-06-02T00:00:00.000Z"
    },
    "unit_lingkup": {
      "id": "...",
      "nama": "...",
      "deskripsi": "...",
      "auditee": { "nama": "...", "email": "..." },
      "evaluator": { "nama": "...", "email": "..." },
      "reviewer": { "nama": "...", "email": "..." },
      "lingkup": { "kode": "...", "nama": "..." }
    },
    "fm": {
      "id": "...",
      "status_pelaksanaan": { "kode": "SEDANG_BERLANGSUNG", "label": "Sedang berlangsung" },
      "tanggal_mulai": "2026-06-02T00:00:00.000Z",
      "tanggal_selesai": "2026-06-10T00:00:00.000Z",
      "fm": { "nama": "RTL", "urutan": 4, "deskripsi": "..." },
      "created_at": "2026-06-02T00:00:00.000Z",
      "updated_at": "2026-06-02T00:00:00.000Z"
    }
  }
}
```

- **Kemungkinan error**:
  - `400` invalid uuid (`validateId`)
  - `401` unauthorized
  - `404` periode modul tidak ditemukan

### 2) List analisis FMEA (per unit lingkup periode modul)

- **Method**: `GET`
- **URL**: `/api/fm4/unit-lingkup-periode-modul/:unitLingkupPeriodeModulId/analisis-fmea`
- **Fungsi**: Menampilkan daftar `AnalisisFMEA` untuk semua temuan pada unit tersebut.
- **Path params**:
  - `unitLingkupPeriodeModulId` (uuid, **required**)
- **Query params (paging & filter)**:
  - `page` (number, default `1`)
  - `size` (number, default `10`)
  - `search` (string, optional) → mencari `temuan.judul` (juga translation judul)
  - `order` (`asc` | `desc`, default `asc`) → order by `temuan.judul`
  - `kategoriRpn` (`RENDAH` | `SEDANG` | `TINGGI`, optional)
    - Jika value tidak termasuk enum, backend **mengabaikan** filter (di-set `undefined`).
- **Contoh request**:

```http
GET /api/fm4/unit-lingkup-periode-modul/9c12.../analisis-fmea?page=1&size=10&order=asc&search=lab&kategoriRpn=TINGGI
Authorization: Bearer <token>
Accept-Language: id_ID
```

- **Contoh response (200)**:

```json
{
  "data": [
    {
      "id": "a1b2...",
      "dampak": "Dampak temuan ...",
      "penyebab": "Penyebab temuan ...",
      "severity": 10,
      "occurrence": 10,
      "detection": 10,
      "nilai_rpn": 1000,
      "kategori_rpn": { "kode": "TINGGI", "label": "Tinggi" },
      "temuan": {
        "id": "t1...",
        "judul": "Judul temuan ...",
        "aspek": { "id": "asp...", "nama": "Nama aspek ..." }
      },
      "user": { "id": "u...", "nama": "...", "email": "..." },
      "created_at": "2026-06-02T00:00:00.000Z",
      "updated_at": "2026-06-02T00:00:00.000Z"
    }
  ],
  "meta": { "total": 1, "page": 1, "size": 10, "total_pages": 1 }
}
```

- **Kemungkinan error**:
  - `400` invalid uuid
  - `401` unauthorized

### 3) List temuan yang belum dianalisis FMEA

- **Method**: `GET`
- **URL**: `/api/fm4/unit-lingkup-periode-modul/:unitLingkupPeriodeModulId/temuan-belum-dianalisis`
- **Fungsi**: Menampilkan daftar `Temuan` yang:
  - status = `DIVALIDASI`
  - belum punya `AnalisisFMEA` (`analisis_fmea = null`)
- **Path params**:
  - `unitLingkupPeriodeModulId` (uuid, **required**)
- **Query params**:
  - `page` (default `1`), `size` (default `10`), `search` (judul), `order` (`asc|desc`)
- **Contoh response (200)**:

```json
{
  "data": [
    {
      "id": "t1...",
      "judul": "Judul temuan ...",
      "temuan": "Deskripsi temuan ...",
      "link": "https://...",
      "status": { "kode": "DIVALIDASI", "label": "Divalidasi" },
      "aspek": { "id": "asp...", "nama": "Nama aspek ..." },
      "created_at": "2026-06-02T00:00:00.000Z",
      "updated_at": "2026-06-02T00:00:00.000Z"
    }
  ],
  "meta": { "total": 1, "page": 1, "size": 10, "total_pages": 1 }
}
```

### 4) Analisis FMEA untuk 1 temuan

- **Method**: `POST`
- **URL**: `/api/fm4/temuan/:temuanId/analisis`
- **Fungsi**: Membuat `AnalisisFMEA` untuk sebuah `Temuan`.
- **Path params**:
  - `temuanId` (uuid, **required**)
- **Body** (`CreateAnalisisTemuanRequest`, schema `FM4Validation.CREATE_ANALISIS` — lihat [Validasi Zod](#validasi-zod-fm4validationts)):

| Field | Tipe | Wajib | Validasi Zod |
|-------|------|-------|--------------|
| `dampak` | string | ya | min 20, max 2000 |
| `penyebab` | string | ya | min 20, max 2000 |
| `severity` | integer | ya | 1–10 |
| `occurrence` | integer | ya | 1–10 |
| `detection` | integer | ya | 1–10 |
- **Business rules penting** (berdasarkan service):
  - Temuan harus ada dan `deleted_at = null`.
  - Status temuan harus `DIVALIDASI` → jika tidak, `409`.
  - Hanya user dengan role lingkup **EVALUATOR** pada `unit_lingkup_periode_modul` temuan yang boleh (`403` jika tidak).
  - FM RTL pada periode modul harus `SEDANG_BERLANGSUNG` (`409` jika tidak).
  - Nilai RPN dihitung: `severity * occurrence * detection`.
  - Kategori RPN:
    - `TINGGI` jika `severity >= 7` **atau** `nilai_rpn > 200`
    - `SEDANG` jika `nilai_rpn >= 100`
    - `RENDAH` selain itu
- **Contoh request**:

```json
{
  "dampak": "Dampak temuan minimal 20 karakter",
  "penyebab": "Penyebab temuan minimal 20 karakter",
  "severity": 10,
  "occurrence": 10,
  "detection": 10
}
```

- **Contoh response (201)**:

```json
{
  "data": {
    "id": "a1b2...",
    "dampak": "Dampak temuan minimal 20 karakter",
    "penyebab": "Penyebab temuan minimal 20 karakter",
    "severity": 10,
    "occurrence": 10,
    "detection": 10,
    "nilai_rpn": 1000,
    "kategori_rpn": { "kode": "TINGGI", "label": "Tinggi" },
    "temuan": { "id": "t1...", "judul": "..." },
    "user": { "id": "u...", "nama": "...", "email": "..." },
    "created_at": "2026-06-02T00:00:00.000Z",
    "updated_at": "2026-06-02T00:00:00.000Z"
  }
}
```

- **Kemungkinan error**:
  - `400` validation (Zod)
  - `401` unauthorized
  - `403` bukan evaluator untuk unit tersebut
  - `404` temuan tidak ditemukan
  - `409` status temuan bukan `DIVALIDASI` atau FM RTL tidak sedang berlangsung

### 5) List hasil analisis (kategori SEDANG/TINGGI) yang belum memiliki RTL

- **Method**: `GET`
- **URL**: `/api/fm4/unit-lingkup-periode-modul/:unitLingkupPeriodeModulId/get-hasil-analisis-belum-memiliki-rtl`
- **Fungsi**: Menampilkan `AnalisisFMEA` yang:
  - `rtl = null`
  - `kategori_rpn in [SEDANG, TINGGI]`
- **Query params**: sama seperti listing (page/size/search/order).
- **Catatan frontend**: endpoint ini cocok untuk halaman “buat RTL” (menampilkan kandidat analisis yang harus ditindaklanjuti).

### 6) List RTL yang belum terlaksana sepenuhnya (belum selesai & tidak dibatalkan)

- **Method**: `GET`
- **URL**: `/api/fm4/unit-lingkup-periode-modul/:unitLingkupPeriodeModulId/rtl-belum-terlaksana`
- **Fungsi**: Menampilkan `RTL` yang statusnya **bukan** `DIBATALKAN` dan **bukan** `SELESAI`, dan masih terkait unit lingkup periode modul tertentu.
- **Query params**: `page`, `size`, `search` (judul temuan), `order`.

### 7) Buat RTL dari sebuah Analisis FMEA

- **Method**: `POST`
- **URL**: `/api/fm4/analisis-fmea/:analisisFmeaId/rtl`
- **Fungsi**: Membuat `RTL` untuk sebuah `AnalisisFMEA` (hanya boleh jika belum ada RTL).
- **Body** (`CreateRtlRequest`, schema `FM4Validation.CREATE_RTL`):

| Field | Tipe | Wajib | Validasi Zod |
|-------|------|-------|--------------|
| `rencana` | string | ya | min 20, max 2000 |
| `nama_pic` | string | ya | min 1, max 255 |
| `email_pic` | string | ya | email, min 1, max 255 |
| `target_date` | date | ya | `z.coerce.date()` — kirim ISO string |
- **Business rules penting**:
  - Analisis harus ada (`404` jika tidak).
  - Jika `analisisFMEA.rtl` sudah ada → `409` (`rtl.alreadyExists`).
  - Hanya user dengan role lingkup **AUDITEE** pada unit terkait yang boleh (`403` jika tidak).
  - FM RTL pada periode modul harus `SEDANG_BERLANGSUNG` (`409` jika tidak).
- **Contoh request**:

```json
{
  "rencana": "Rencana RTL Minimal 20 karakter",
  "nama_pic": "Nama PIC",
  "email_pic": "pic@umc.ac.id",
  "target_date": "2026-06-09T00:00:00.000Z"
}
```

- **Contoh response (201)**:

```json
{
  "data": {
    "id": "rtl1...",
    "rencana": "Rencana RTL Minimal 20 karakter",
    "nama_pic": "Nama PIC",
    "email_pic": "pic@umc.ac.id",
    "target_date": "2026-06-09T00:00:00.000Z",
    "is_tepat_waktu": false,
    "status_pelaksanaan": { "kode": "BELUM_DIMULAI", "label": "Belum dimulai" },
    "analisis_temuan": {
      "id": "a1b2...",
      "nilai_rpn": 200,
      "kategori_rpn": { "kode": "SEDANG", "label": "Sedang" }
    },
    "progres": [],
    "user": { "id": "u...", "nama": "...", "email": "..." },
    "created_at": "2026-06-02T00:00:00.000Z",
    "updated_at": "2026-06-02T00:00:00.000Z"
  }
}
```

### 8) Tambah progres RTL

- **Method**: `POST`
- **URL**: `/api/fm4/rtl/:rtlId/progres`
- **Fungsi**: Menambahkan record `ProgresRTL` pada sebuah `RTL`, lalu mengembalikan detail RTL terbaru.
- **Body** (`CreateProgresRtlRequest`, schema `FM4Validation.CREATE_PROGRES_RTL`):

| Field | Tipe | Wajib | Validasi Zod |
|-------|------|-------|--------------|
| `tanggal_realisasi` | date | ya | `z.coerce.date()` |
| `presentase_realisasi` | number | ya | min 1, max 100 |
| `hasil` | string | ya | min 20, max 2000 |
| `link` | string (URL) | ya | `url()`, min 1, max 255 |
| `catatan` | string | tidak | jika ada: min 20, max 2000 |
- **Business rules penting**:
  - RTL harus ada (`404` jika tidak).
  - Jika RTL status sudah `SELESAI` → `409` (`rtl.alreadyCompleted`).
  - Hanya user role lingkup **AUDITEE** boleh (`403` jika tidak).
  - FM RTL pada periode modul harus `SEDANG_BERLANGSUNG` (`409` jika tidak).
  - Backend menentukan `status_pelaksanaan` progres:
    - jika `presentase_realisasi === 100` → `SELESAI`
    - else → `SEDANG_BERLANGSUNG`
- **Contoh request**:

```json
{
  "tanggal_realisasi": "2026-06-02T00:00:00.000Z",
  "presentase_realisasi": 50,
  "hasil": "Hasil progres RTL Minimal 20 karakter",
  "link": "https://contoh-link.com/progres-rtl",
  "catatan": "Catatan progres RTL Minimal 20 karakter"
}
```

- **Contoh response (201)**: backend mengembalikan `{ data: RtlResponse }` (RTL detail terbaru + list progres).

### 9) Detail RTL by id

- **Method**: `GET`
- **URL**: `/api/fm4/rtl/:rtlId`
- **Fungsi**: Mengambil detail `RTL` termasuk:
  - analisis FMEA terkait (dengan temuan & user)
  - daftar progres (dengan user)
- **Contoh response (200)**: `{ data: RtlResponse }`

## Struktur model / data (untuk frontend)

Bagian ini merangkum struktur yang *relevan untuk integrasi UI* berdasarkan `fm4.model.ts` serta relasi pada `schema.prisma`.

### Entity: `Temuan` (referensi dari FM03)

- **Tabel**: `temuans`
- **Relasi penting**:
  - `Temuan (1) -> (0..1) AnalisisFMEA` via `Temuan.analisis_fmea`
- **Field kunci yang muncul di response** (lihat response mapping di `fm03-temuan`):
  - `id: string`
  - `judul: string`
  - `temuan: string`
  - `link: string`
  - `status: { kode: "DRAFT"|"DIVALIDASI"|"DITOLAK", label: string }`
  - `aspek?: { id: string, nama: string }`
  - `created_at, updated_at: ISO string`

### Entity: `AnalisisFMEA`

- **Tabel**: `analisis_fmeas`
- **Relasi**:
  - `AnalisisFMEA.temuan_id` (unique) → `Temuan`
  - `AnalisisFMEA.user_id` → `User` (pembuat analisis)
  - `AnalisisFMEA (0..1) -> RTL` via `AnalisisFMEA.rtl`
- **Field** (db):
  - `id: uuid`
  - `temuan_id: uuid` (**required**, unique)
  - `user_id: uuid` (**required**)
  - `dampak: text` (**required**)
  - `penyebab: text` (**required**)
  - `severity: int` (**required**, 1..10)
  - `occurrence: int` (**required**, 1..10)
  - `detection: int` (**required**, 1..10)
  - `nilai_rpn: int` (**required**, auto dari backend)
  - `kategori_rpn: enum` (**required**, auto dari backend)
  - `created_at, updated_at, deleted_at`
- **Response shape** (`AnalisisFmeaResponse`):
  - `kategori_rpn: { kode: string, label: string }`
  - `temuan?: TemuanResponse` (umumnya ada pada listing/detail)
  - `rtl?: RtlResponse` (**catatan**: mapping saat ini tidak mengisi `rtl` pada `toAnalisisFmeaResponse`, jadi jangan mengandalkan field ini di frontend)
  - `user?: UserResponse`

### Entity: `RTL` (Rencana Tindak Lanjut)

- **Tabel**: `rencana_tindak_lanjuts`
- **Relasi**:
  - `RTL.analisis_fmea_id` (unique) → `AnalisisFMEA`
  - `RTL.user_id` → `User` (pembuat RTL / auditee)
  - `RTL (1) -> (0..n) ProgresRTL`
- **Field** (db):
  - `id: uuid`
  - `analisis_fmea_id: uuid` (**required**, unique)
  - `user_id: uuid` (**required**)
  - `rencana: text` (**required**)
  - `nama_pic: varchar(255)` (**required**)
  - `email_pic: varchar(255)` (**required**)
  - `target_date: datetime` (**required**)
  - `is_tepat_waktu: boolean?` (nullable; pada response ditampilkan sebagai boolean)
  - `status_pelaksanaan: enum status_pelaksanaan` (default `BELUM_DIMULAI`)
- **Response shape** (`RtlResponse`):
  - `status_pelaksanaan: { kode: status_pelaksanaan, label: string }`
  - `analisis_temuan?: AnalisisFmeaResponse`
  - `progres?: ProgresRtlResponse[]`
  - `created_at, updated_at: ISO string`

### Entity: `ProgresRTL`

- **Tabel**: `progres_rtls`
- **Relasi**:
  - `ProgresRTL.rtl_id` → `RTL`
  - `ProgresRTL.user_id` → `User` (pengisi progres)
- **Field** (db):
  - `id: uuid`
  - `rtl_id: uuid` (**required**)
  - `user_id: uuid` (**required**)
  - `status_pelaksanaan: enum status_pelaksanaan` (**required**, ditentukan dari presentase saat create)
  - `tanggal_realisasi: datetime` (**required**)
  - `presentase_realisasi: int` (**required**, 1..100)
  - `hasil: text` (**required**)
  - `link: text` (**required**, valid URL di validation)
  - `catatan: text?` (optional)
- **Response shape** (`ProgresRtlResponse`):
  - `catatan?: string`
  - `rtl?: RtlResponse`
  - `user?: UserResponse`

## Flow CRUD / Business flow (untuk UI)

### Flow A — Evaluator: Analisis temuan (FMEA)

- Ambil daftar temuan yang siap dianalisis:
  - `GET /fm4/unit-lingkup-periode-modul/:id/temuan-belum-dianalisis`
- Untuk tiap temuan, buka form analisis:
  - input: `dampak`, `penyebab`, `severity`, `occurrence`, `detection`
  - submit:
    - `POST /fm4/temuan/:temuanId/analisis`
- Setelah sukses, UI bisa refresh:
  - `GET /fm4/unit-lingkup-periode-modul/:id/analisis-fmea`

### Flow B — Auditee: Buat RTL dari analisis (prioritas SEDANG/TINGGI)

- Ambil kandidat analisis yang butuh RTL:
  - `GET /fm4/unit-lingkup-periode-modul/:id/get-hasil-analisis-belum-memiliki-rtl`
- Buat RTL:
  - form input: `rencana`, `nama_pic`, `email_pic`, `target_date`
  - submit: `POST /fm4/analisis-fmea/:analisisFmeaId/rtl`

### Flow C — Auditee: Update progres RTL sampai selesai

- Ambil RTL yang belum selesai:
  - `GET /fm4/unit-lingkup-periode-modul/:id/rtl-belum-terlaksana`
- Detail RTL & histori progres:
  - `GET /fm4/rtl/:rtlId`
- Tambah progres:
  - `POST /fm4/rtl/:rtlId/progres`
  - jika `presentase_realisasi` = 100, progres berstatus `SELESAI` (dan RTL bisa dianggap selesai oleh backend)

## Validasi Zod (`fm4.validation.ts`)

Class `FM4Validation` mendefinisikan tiga schema untuk body POST. Path `:temuanId`, `:analisisFmeaId`, `:rtlId`, `:unitLingkupPeriodeModulId` divalidasi dengan **`validateId`** (UUID) di controller.

### Pemetaan schema → endpoint

| Konstanta | HTTP | URL | Request type |
|-----------|------|-----|----------------|
| `CREATE_ANALISIS` | `POST` | `/fm4/temuan/:temuanId/analisis` | `CreateAnalisisTemuanRequest` |
| `CREATE_RTL` | `POST` | `/fm4/analisis-fmea/:analisisFmeaId/rtl` | `CreateRtlRequest` |
| `CREATE_PROGRES_RTL` | `POST` | `/fm4/rtl/:rtlId/progres` | `CreateProgresRtlRequest` |

Endpoint GET tidak memiliki schema di file ini.

### `CREATE_ANALISIS`

| Field | Tipe Zod | Aturan |
|-------|----------|--------|
| `dampak` | `z.string()` | min **20**, max **2000** |
| `penyebab` | `z.string()` | min **20**, max **2000** |
| `severity` | `z.number().int()` | min **1**, max **10** |
| `occurrence` | `z.number().int()` | min **1**, max **10** |
| `detection` | `z.number().int()` | min **1**, max **10** |

- Nilai skor harus **bilangan bulat** (bukan desimal).
- `nilai_rpn` dan `kategori_rpn` **tidak** dikirim dari client — dihitung di service setelah lolos Zod.

### `CREATE_RTL`

| Field | Tipe Zod | Aturan |
|-------|----------|--------|
| `rencana` | `z.string()` | min **20**, max **2000** |
| `nama_pic` | `z.string()` | min **1**, max **255** |
| `email_pic` | `z.string().email()` | min **1**, max **255** — format email RFC Zod |
| `target_date` | `z.coerce.date()` | Kirim ISO string/timestamp; dikonversi ke `Date` |

Zod **tidak** memvalidasi `target_date` di masa depan; hanya tipe tanggal.

### `CREATE_PROGRES_RTL`

| Field | Tipe Zod | Aturan |
|-------|----------|--------|
| `tanggal_realisasi` | `z.coerce.date()` | wajib |
| `presentase_realisasi` | `z.number()` | min **1**, max **100** (boleh desimal di Zod, UI biasanya integer) |
| `hasil` | `z.string()` | min **20**, max **2000** |
| `link` | `z.string().url()` | min **1**, max **255** |
| `catatan` | `z.string()` | **opsional**; jika dikirim: min **20**, max **2000** |

Jika `catatan` di-omit dari JSON, valid. Jika dikirim `""` atau string pendek, gagal min 20.

### Contoh response error 400 (Zod)

```json
{
  "errors": {
    "formErrors": [],
    "fieldErrors": {
      "severity": ["Number must be greater than or equal to 1"],
      "email_pic": ["Invalid email"],
      "rencana": ["String must contain at least 20 character(s)"]
    }
  }
}
```

### Validasi di luar Zod (service, setelah body lolos)

| Aksi | Aturan bisnis | Code |
|------|---------------|------|
| Analisis FMEA | `temuan.status === DIVALIDASI` | 409 |
| Analisis FMEA | Role **EVALUATOR** pada unit | 403 |
| Analisis FMEA | FM RTL `SEDANG_BERLANGSUNG` | 409 |
| Buat RTL | Belum ada RTL untuk analisis | 409 |
| Buat RTL / progres | Role **AUDITEE** | 403 |
| Progres RTL | RTL belum `SELESAI` | 409 jika sudah selesai |
| Progres | `presentase_realisasi === 100` → status progres `SELESAI` | (logic service, bukan Zod) |

---

## Validasi & status code

| Code | Penyebab |
|------|----------|
| **400** | UUID path invalid (`validateId`); body gagal Zod (`fm4.validation.ts`) |
| **401** | Tidak ada / invalid `Authorization` |
| **403** | Role salah: analisis → **EVALUATOR**; RTL & progres → **AUDITEE** |
| **404** | Temuan / analisis / RTL / periode modul tidak ditemukan |
| **409** | Temuan bukan `DIVALIDASI`; FM RTL bukan `SEDANG_BERLANGSUNG`; RTL sudah ada; RTL sudah `SELESAI` saat tambah progres |

## Catatan implementasi frontend

- **Pagination**:
  - Semua listing memakai `page` & `size`, dan response `meta.total_pages`.
  - UI sebaiknya menyediakan kontrol paging dan ukuran halaman.
- **Search**:
  - Listing analisis & temuan menggunakan `search` yang memfilter judul (termasuk translations).
- **Sorting**:
  - Param `order` hanya `asc|desc` dan sorting dilakukan by judul (temuan).
- **Filter kategori RPN (listing analisis)**:
  - gunakan `kategoriRpn=RENDAH|SEDANG|TINGGI`.
- **Field readonly / auto-generated**:
  - `AnalisisFMEA.nilai_rpn` dan `kategori_rpn` dihitung backend (jangan kirim dari UI).
  - `created_at`, `updated_at`, `id` dihasilkan backend.
  - Pada create progres, `status_pelaksanaan` progres ditentukan backend dari `presentase_realisasi`.
- **Form fields yang perlu ditampilkan**:
  - **Analisis FMEA**: `dampak`, `penyebab`, `severity(1..10)`, `occurrence(1..10)`, `detection(1..10)`; tampilkan hasil `nilai_rpn` & label kategori setelah submit.
  - **RTL**: `rencana`, `nama_pic`, `email_pic`, `target_date`.
  - **Progres RTL**: `tanggal_realisasi`, `presentase_realisasi(1..100)`, `hasil`, `link`, `catatan (opsional)`.
- **Tanggal**:
  - Backend memakai `z.coerce.date()` pada `target_date` & `tanggal_realisasi`, jadi kirim **ISO string** aman untuk frontend.

