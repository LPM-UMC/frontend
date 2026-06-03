# 🎭 Role Module — API Documentation

Dokumentasi lengkap untuk mengkonsumsi endpoint **Role Management** dari frontend atau AI coding agent.

---

## 📋 Daftar Isi

- [Ringkasan Modul Role](#ringkasan-modul-role)
- [Autentikasi & Otorisasi](#autentikasi--otorisasi)
- [Sistem Role Default](#sistem-role-default)
- [Query Parameter Umum](#query-parameter-umum)
- [Endpoints](#endpoints)
  - [GET /roles](#get-roles)
  - [POST /roles](#post-roles)
  - [PUT /roles/:roleId](#put-rolesroleid)
  - [DELETE /roles/:roleId](#delete-rolesroleid)
  - [GET /roles/export/pdf](#get-rolesexportpdf)
  - [GET /roles/export/csv](#get-rolesexportcsv)
- [Penanganan Error](#penanganan-error)
- [Contoh Implementasi Frontend](#contoh-implementasi-frontend)
- [Tipe Data TypeScript](#tipe-data-typescript)
- [Struktur File Modul](#struktur-file-modul)

---

## Ringkasan Modul Role

Modul ini mengelola **Role (Peran)** pengguna di sistem LPM-SPI UMC. Role digunakan untuk mengontrol akses fitur berdasarkan jabatan/fungsi pengguna.

Fitur utama:

- ✅ CRUD Role (hanya Admin)
- ✅ Daftar role dengan pagination, pencarian, dan pengurutan
- ✅ Export laporan role ke **PDF** dan **CSV**
- ✅ Dukungan **multi-bahasa** (translasi otomatis via AI)
- ✅ **Caching** dengan Redis untuk performa optimal

---

## Autentikasi & Otorisasi

Semua endpoint Role membutuhkan **Access Token** di header:

```
Authorization: Bearer <access_token>
```

> **Cara mendapatkan access token:** Lihat [Auth Module README](../auth/README.md).

### Level Akses Endpoint

| Endpoint                | Login Required | Role Required |
| ----------------------- | -------------- | ------------- |
| `GET /roles`            | ✅ Ya          | Semua role    |
| `POST /roles`           | ✅ Ya          | Admin saja    |
| `PUT /roles/:roleId`    | ✅ Ya          | Admin saja    |
| `DELETE /roles/:roleId` | ✅ Ya          | Admin saja    |
| `GET /roles/export/pdf` | ✅ Ya          | Admin saja    |
| `GET /roles/export/csv` | ✅ Ya          | Admin saja    |

> **Catatan untuk AI Agent:** "Admin" mencakup role berikut: `ketua-lpm`, `ketua-spi`, `admin-lpm`, `admin-spi`. Jika user bukan salah satu dari role tersebut, server akan merespons `403 Forbidden`.

---

## Sistem Role Default

Sistem memiliki role bawaan (seed data) yang sudah terdefinisi:

| Kode Role        | Nama Jabatan   |
| ---------------- | -------------- |
| `ketua-lpm`      | Ketua LPM      |
| `ketua-spi`      | Ketua SPI      |
| `admin-lpm`      | Admin LPM      |
| `admin-spi`      | Admin SPI      |
| `lpm`            | LPM            |
| `spi`            | SPI            |
| `gkmf`           | GKMF           |
| `kaprodi`        | Kaprodi        |
| `dekan`          | Dekan          |
| `wakil-rektor-1` | Wakil Rektor 1 |
| `rektor`         | Rektor         |
| `asisten`        | Asisten        |

> `kode` adalah slug unik yang di-generate otomatis dari `nama` saat role dibuat (misal: nama `"Kepala Unit"` → kode `"kepala-unit"`).

---

## Query Parameter Umum

Endpoint daftar (`GET /roles`) mendukung parameter berikut via URL query string:

| Parameter | Tipe                | Default | Keterangan                                 |
| --------- | ------------------- | ------- | ------------------------------------------ |
| `page`    | `number`            | `1`     | Halaman saat ini                           |
| `size`    | `number`            | `10`    | Jumlah item per halaman                    |
| `search`  | `string`            | -       | Pencarian berdasarkan `nama` role          |
| `order`   | `"asc"` \| `"desc"` | `"asc"` | Urutan data                                |
| `lang`    | `"id"` \| `"en"`    | `"id"`  | Bahasa respons (bisa di header atau query) |

---

## Endpoints

### GET /roles

Mengambil daftar role dengan **pagination**, **pencarian**, dan **pengurutan**.

**URL:** `GET /roles`

**Headers yang diperlukan:**

```
Authorization: Bearer <access_token>
```

**Contoh Request:**

```
GET /roles?page=1&size=10&search=admin&order=asc
```

**Response Sukses `200 OK`:**

```json
{
  "data": [
    {
      "id": "uuid-role-1",
      "kode": "admin-lpm",
      "nama": "Admin LPM",
      "deskripsi": "Administrator Lembaga Penjaminan Mutu",
      "jumlah_user": 3,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-06-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 12,
    "page": 1,
    "size": 10,
    "total_pages": 2
  }
}
```

**Keterangan Field:**

| Field | Keterangan |
|-------|-----------|
| `id` | UUID unik role |
| `kode` | Slug unik role (tidak bisa diubah) |
| `nama` | Nama role (ditranslasikan sesuai `lang`) |
| `deskripsi` | Deskripsi role (ditranslasikan sesuai `lang`) |
| `jumlah_user` | Jumlah user yang memiliki role ini |
| `created_at` | Waktu pembuatan (ISO 8601) |
| `updated_at` | Waktu terakhir diperbarui (ISO 8601) |

**Contoh Fetch:**

```typescript
const response = await fetch("/roles?page=1&size=10", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  credentials: "include",
});

const { data, meta } = await response.json();
// data: RoleResponse[]
// meta: { total, page, size, total_pages }
```

> **Catatan untuk AI Agent:** Respons ini di-cache di Redis. Cache otomatis di-invalidate setiap kali ada operasi create, update, atau delete role.

---

### POST /roles

Membuat **role baru**. Hanya bisa dilakukan oleh **Admin**.

**URL:** `POST /roles`

**Headers yang diperlukan:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "nama": "Kepala Unit",
  "deskripsi": "Bertanggung jawab atas pengelolaan unit kerja"
}
```

**Validasi:**

| Field | Aturan |
|-------|--------|
| `nama` | Wajib, string, min 1, maks **25** karakter |
| `deskripsi` | Wajib, string, min 1, maks **255** karakter |

**Perilaku Sistem:**

- `kode` dibuat otomatis dari `nama` menggunakan `slugify` (misal: `"Kepala Unit"` → `"kepala-unit"`).
- Jika `kode` sudah ada (role dengan nama serupa), server akan mengembalikan `409 Conflict`.
- Translasi `nama` dan `deskripsi` ke bahasa lain dibuat **otomatis** oleh sistem.
- Cache role list dan export akan di-invalidate.

**Response Sukses `201 Created`:**

```json
{
  "data": {
    "id": "uuid-role-baru",
    "kode": "kepala-unit",
    "nama": "Kepala Unit",
    "deskripsi": "Bertanggung jawab atas pengelolaan unit kerja",
    "jumlah_user": 0,
    "created_at": "2024-06-01T00:00:00.000Z",
    "updated_at": "2024-06-01T00:00:00.000Z"
  }
}
```

**Contoh Fetch:**

```typescript
const response = await fetch("/roles", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify({
    nama: "Kepala Unit",
    deskripsi: "Bertanggung jawab atas pengelolaan unit kerja",
  }),
});

if (!response.ok) {
  const error = await response.json();
  throw new Error(error.message);
}

const { data } = await response.json();
```

---

### PUT /roles/:roleId

Memperbarui **deskripsi** role yang sudah ada. Hanya bisa dilakukan oleh **Admin**.

> **Penting:** Hanya `deskripsi` yang bisa diubah. `nama` dan `kode` tidak bisa diubah untuk menjaga integritas data.

**URL:** `PUT /roles/:roleId`

**Path Parameter:**

| Parameter | Tipe | Keterangan |
|-----------|------|-----------|
| `roleId` | `string` (UUID) | ID role yang akan diperbarui |

**Headers yang diperlukan:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "deskripsi": "Deskripsi baru yang telah diperbarui"
}
```

**Validasi:**

| Field | Aturan |
|-------|--------|
| `deskripsi` | Wajib, string, min 1, maks **255** karakter |

**Response Sukses `200 OK`:**

```json
{
  "data": {
    "id": "uuid-role",
    "kode": "admin-lpm",
    "nama": "Admin LPM",
    "deskripsi": "Deskripsi baru yang telah diperbarui",
    "jumlah_user": 3,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-06-15T08:30:00.000Z"
  }
}
```

**Contoh Fetch:**

```typescript
const roleId = "uuid-role-target";

const response = await fetch(`/roles/${roleId}`, {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify({
    deskripsi: "Deskripsi baru yang telah diperbarui",
  }),
});

const { data } = await response.json();
```

---

### DELETE /roles/:roleId

Menghapus role secara **soft delete** (tidak dihapus permanen dari database). Hanya bisa dilakukan oleh **Admin**.

**URL:** `DELETE /roles/:roleId`

**Path Parameter:**

| Parameter | Tipe | Keterangan |
|-----------|------|-----------|
| `roleId` | `string` (UUID) | ID role yang akan dihapus |

**Headers yang diperlukan:**

```
Authorization: Bearer <access_token>
```

**Response Sukses `204 No Content`** — tidak ada response body.

**Contoh Fetch:**

```typescript
const roleId = "uuid-role-target";

const response = await fetch(`/roles/${roleId}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  credentials: "include",
});

if (response.status === 204) {
  console.log("Role berhasil dihapus");
  // Refresh daftar role di UI
}
```

> **Catatan untuk AI Agent:** Delete ini bersifat **soft delete** — field `deleted_at` diisi timestamp. Role yang sudah dihapus tidak muncul di list, tapi datanya masih ada di database.

---

### GET /roles/export/pdf

Mengekspor seluruh data role ke file **PDF**. Hanya bisa dilakukan oleh **Admin**.

**URL:** `GET /roles/export/pdf`

**Headers yang diperlukan:**

```
Authorization: Bearer <access_token>
```

**Response Sukses:**

- Status: `200 OK`
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="laporan-role.pdf"`
- Body: Binary PDF

**Contoh Fetch (download file):**

```typescript
const response = await fetch("/roles/export/pdf", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  credentials: "include",
});

if (response.ok) {
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  // Trigger download di browser
  const link = document.createElement("a");
  link.href = url;
  link.download = "laporan-role.pdf";
  link.click();

  URL.revokeObjectURL(url);
}
```

---

### GET /roles/export/csv

Mengekspor seluruh data role ke file **CSV**. Hanya bisa dilakukan oleh **Admin**.

**URL:** `GET /roles/export/csv`

**Headers yang diperlukan:**

```
Authorization: Bearer <access_token>
```

**Response Sukses:**

- Status: `200 OK`
- Content-Type: `text/csv`
- Content-Disposition: `attachment; filename="laporan-role.csv"`
- Body: Plain text CSV

**Contoh Fetch (download file):**

```typescript
const response = await fetch("/roles/export/csv", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  credentials: "include",
});

if (response.ok) {
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "laporan-role.csv";
  link.click();

  URL.revokeObjectURL(url);
}
```

> **Catatan:** Hasil export **di-cache di Redis**. Cache di-invalidate otomatis setiap kali ada perubahan data role (create, update, delete).

---

## Penanganan Error

| HTTP Status                 | Kondisi                                                      | Solusi Frontend                        |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------- |
| `400 Bad Request`           | Validasi gagal (nama terlalu panjang, deskripsi kosong, dll) | Tampilkan pesan validasi per field     |
| `401 Unauthorized`          | Token tidak valid atau expired                               | Refresh token, lalu retry              |
| `403 Forbidden`             | User tidak memiliki role Admin                               | Tampilkan pesan "Akses ditolak"        |
| `404 Not Found`             | Role dengan ID tersebut tidak ditemukan                      | Tampilkan pesan "Role tidak ditemukan" |
| `409 Conflict`              | Role dengan nama yang sama sudah ada                         | Minta user ganti nama role             |
| `500 Internal Server Error` | Error server                                                 | Tampilkan pesan error umum             |

**Contoh penanganan error validasi `400`:**

Server mengembalikan detail error validasi dari Zod:

```json
{
  "success": false,
  "error": {
    "issues": [
      {
        "code": "too_big",
        "maximum": 25,
        "path": ["nama"],
        "message": "String must contain at most 25 character(s)"
      }
    ]
  }
}
```

```typescript
if (response.status === 400) {
  const err = await response.json();
  // Tampilkan error per field
  err.error?.issues?.forEach((issue: any) => {
    console.error(`Field: ${issue.path.join(".")}, Error: ${issue.message}`);
  });
}
```

---

## Contoh Implementasi Frontend

### Utility: `roleApi.ts`

```typescript
import { authFetch } from "../auth/authClient"; // Lihat auth/README.md

const BASE = "/roles";

// Tipe sesuai backend
export type RoleResponse = {
  id: string;
  kode: string;
  nama: string;
  deskripsi?: string;
  jumlah_user?: number;
  created_at?: string;
  updated_at?: string;
};

export type PagingMeta = {
  total: number;
  page: number;
  size: number;
  total_pages: number;
};

export type GetRolesParams = {
  page?: number;
  size?: number;
  search?: string;
  order?: "asc" | "desc";
};

// GET /roles — daftar semua role (semua user)
export async function getRoles(params: GetRolesParams = {}): Promise<{
  data: RoleResponse[];
  meta: PagingMeta;
}> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    size: String(params.size ?? 10),
    order: params.order ?? "asc",
    ...(params.search ? { search: params.search } : {}),
  });

  const res = await authFetch(`${BASE}?${query}`);
  if (!res.ok) throw new Error("Gagal mengambil data role");
  return res.json();
}

// POST /roles — buat role baru (admin only)
export async function createRole(payload: {
  nama: string;
  deskripsi: string;
}): Promise<{ data: RoleResponse }> {
  const res = await authFetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "Gagal membuat role");
  }
  return res.json();
}

// PUT /roles/:roleId — update deskripsi (admin only)
export async function updateRole(
  roleId: string,
  payload: { deskripsi: string },
): Promise<{ data: RoleResponse }> {
  const res = await authFetch(`${BASE}/${roleId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "Gagal memperbarui role");
  }
  return res.json();
}

// DELETE /roles/:roleId — hapus role (admin only)
export async function deleteRole(roleId: string): Promise<void> {
  const res = await authFetch(`${BASE}/${roleId}`, {
    method: "DELETE",
  });
  if (res.status !== 204) {
    throw new Error("Gagal menghapus role");
  }
}

// Export PDF (admin only)
export async function exportRolesPdf(): Promise<void> {
  const res = await authFetch(`${BASE}/export/pdf`);
  if (!res.ok) throw new Error("Gagal export PDF");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "laporan-role.pdf";
  link.click();
  URL.revokeObjectURL(url);
}

// Export CSV (admin only)
export async function exportRolesCsv(): Promise<void> {
  const res = await authFetch(`${BASE}/export/csv`);
  if (!res.ok) throw new Error("Gagal export CSV");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "laporan-role.csv";
  link.click();
  URL.revokeObjectURL(url);
}
```

---

## Tipe Data TypeScript

Salin tipe-tipe ini ke frontend untuk konsistensi penuh dengan backend:

```typescript
// Response satu role dari server
type RoleResponse = {
  id: string; // UUID
  kode: string; // Slug unik, tidak bisa diubah
  nama: string; // Nama role (ditranslasikan sesuai lang)
  deskripsi?: string; // Deskripsi role (opsional, ditranslasikan)
  jumlah_user?: number; // Jumlah user dengan role ini
  created_at?: string; // ISO 8601
  updated_at?: string; // ISO 8601
};

// Body untuk membuat role baru
type CreateRoleRequest = {
  nama: string; // maks 25 karakter
  deskripsi: string; // maks 255 karakter
};

// Body untuk update role (hanya deskripsi)
type UpdateRoleRequest = {
  deskripsi: string; // maks 255 karakter
};

// Meta pagination dari server
type PagingMeta = {
  total: number; // Total semua data
  page: number; // Halaman saat ini
  size: number; // Ukuran halaman
  total_pages: number; // Total halaman
};

// Kode role default yang ada di sistem
enum DEFAULT_ROLE {
  KETUA_LPM = "ketua-lpm",
  KETUA_SPI = "ketua-spi",
  ADMIN_LPM = "admin-lpm",
  ADMIN_SPI = "admin-spi",
  LPM = "lpm",
  SPI = "spi",
  GKMF = "gkmf",
  KAPRODI = "kaprodi",
  DEKAN = "dekan",
  WAKIL_REKTOR_1 = "wakil-rektor-1",
  REKTOR = "rektor",
  ASISTEN = "asisten",
}

// Role yang termasuk kategori Admin
const ADMIN_ROLE: DEFAULT_ROLE[] = [
  DEFAULT_ROLE.KETUA_LPM,
  DEFAULT_ROLE.KETUA_SPI,
  DEFAULT_ROLE.ADMIN_LPM,
  DEFAULT_ROLE.ADMIN_SPI,
];
```

---

## Struktur File Modul

```
src/modules/role/
├── role.controller.ts        # Definisi HTTP endpoints & routing
├── role.service.ts           # Logika bisnis: CRUD, paging, caching
├── role.model.ts             # Type definitions & enum DEFAULT_ROLE
├── role.validation.ts        # Validasi input dengan Zod
├── role.redis.ts             # Cache key management & invalidasi
├── role.container.ts         # Dependency injection container
├── role.helper.ts            # Helper functions
├── role.seeder.ts            # Seed data role default
├── role.util.ts              # Utility functions
├── exporter/
│   ├── role.export.model.ts  # Tipe data untuk export
│   ├── role.export.service.ts# Orkestrasi export PDF & CSV
│   ├── role.pdf.exporter.ts  # Generator PDF
│   └── role.csv.exporter.ts  # Generator CSV
└── test/                     # Unit tests
```

---

## Alur Data Ringkas

```
Frontend                         Backend
   │                                │
   │── GET /roles ─────────────────►│── Cek Redis cache
   │                                │   ├─ HIT  → return cache
   │                                │   └─ MISS → query DB → simpan cache
   │◄── 200 { data[], meta } ───────│
   │                                │
   │── POST /roles ────────────────►│── Validasi Zod
   │   { nama, deskripsi }          │── Cek duplikasi kode
   │                                │── Buat role + translasi semua bahasa
   │                                │── Invalidate cache
   │◄── 201 { data: RoleResponse } ─│
   │                                │
   │── PUT /roles/:id ─────────────►│── Cek role ada
   │   { deskripsi }                │── Update + translasi semua bahasa
   │                                │── Invalidate cache
   │◄── 200 { data: RoleResponse } ─│
   │                                │
   │── DELETE /roles/:id ───────────►│── Soft delete (set deleted_at)
   │                                │── Invalidate cache
   │◄── 204 No Content ─────────────│
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
