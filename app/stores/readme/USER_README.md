# User Module API Documentation

Manajemen pengguna, profil, role, assistant, dan export data user.

---

# Base Endpoint

```txt
/api/users
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
Accept-Language: id
```

atau

```http
Accept-Language: en
```

---

# User Model

## UserResponse

Representasi data user yang dikembalikan API.

```ts
type UserResponse = {
  id: string;
  nim?: string;
  nidn?: string;
  nama: string;
  email?: string;
  roles?: RoleResponse[];
  picture?: string | null;
  instagram?: string | null;
  linkedin?: string | null;

  assistants?: UserSummaryResponse[];
  assistant_of?: UserSummaryResponse;

  created_at?: string;
  updated_at?: string;
};
```

---

## UserSummaryResponse

Digunakan untuk relasi assistant.

```ts
type UserSummaryResponse = {
  id: string;
  nim?: string;
  nidn?: string;
  nama: string;
  email?: string;
  picture?: string | null;
};
```

---

# Validation Rules

Validasi request menggunakan `zod`.

---

## Create User Validation

```ts
{
  nidn?: string (1-20)
  nim?: string (1-20)
  nama: string (1-30)
  email: valid email (1-255)
  role_ids: string[] (1-10 item)
}
```

Rules:

- `nama` wajib
- `email` wajib dan format email valid
- minimal 1 role
- maksimal 10 role
- `nidn` dan `nim` optional

---

## Update User Validation

```ts
{
  email: valid email
  role_ids: string[]
}
```

Rules:

- email wajib
- email valid
- minimal 1 role
- maksimal 10 role

---

## Update Profile Validation

```ts
{
  nama: string;
  email: string;
  instagram: string;
  linkedin: string;
}
```

Rules:

- semua field wajib
- email harus valid

---

## Update Profile Picture Validation

```ts
{
  picture: File;
}
```

Rules:

- wajib file image
- ukuran maksimal 5 MB

Accepted:

```txt
image/*
```

Validation error:

```txt
Image must be less than 5mb
File must be an image
```

---

## Update Password Validation

```ts
{
  password: string;
}
```

Rules:

- password wajib
- maksimal 128 karakter

---

## Assign Assistant Validation

```ts
{
  user_ids: UUID[]
}
```

Rules:

- UUID valid
- minimal 1 assistant
- maksimal 10 assistant

---

# User Relationship

User memiliki relasi assistant.

---

## User Memiliki Assistant

Field:

```ts
assistants;
```

Contoh:

```json
{
  "id": "owner-id",
  "nama": "Ketua LPM",
  "assistants": [
    {
      "id": "assistant-id",
      "nama": "Asisten 1"
    }
  ]
}
```

---

## User Menjadi Assistant

Field:

```ts
assistant_of;
```

Contoh:

```json
{
  "id": "assistant-id",
  "nama": "Asisten 1",
  "assistant_of": {
    "id": "owner-id",
    "nama": "Ketua LPM"
  }
}
```

---

# Access Control

| Endpoint                   | Auth | Admin |
| -------------------------- | ---- | ----: |
| GET /users                 | ✅   |    ✅ |
| POST /users                | ✅   |    ✅ |
| GET /users/:id             | ✅   |    ❌ |
| PUT /users/:id             | ✅   |    ✅ |
| DELETE /users/:id          | ✅   |    ✅ |
| PUT /users/profile         | ✅   |    ❌ |
| PUT /users/profile/picture | ✅   |    ❌ |
| PUT /users/password        | ✅   |    ❌ |
| POST /users/:id/asisten    | ✅   |    ✅ |
| GET /users/export/pdf      | ✅   |    ✅ |
| GET /users/export/csv      | ✅   |    ✅ |

Admin endpoint menggunakan:

```ts
roleMiddleware(ADMIN_ROLE);
```

---

# Endpoints

---

# 1. Get Users

Mengambil daftar user dengan pagination, search, dan filter role.

## Endpoint

```http
GET /users
```

Admin only.

## Query Parameters

| Parameter | Type        | Default | Description          |
| --------- | ----------- | ------: | -------------------- |
| page      | number      |       1 | halaman              |
| size      | number      |      10 | jumlah data          |
| search    | string      |       - | pencarian nama/email |
| order     | asc \| desc |     asc | urutan nama          |
| roleId    | string      |       - | filter role          |

## Example

```http
GET /users?page=1&size=10&search=rifqi&order=asc
```

## Response

```json
{
  "data": [
    {
      "id": "user-id",
      "nama": "Rifqi",
      "email": "rifqi@mail.com",
      "roles": [
        {
          "id": "role-id",
          "kode": "ADMIN",
          "nama": "Administrator"
        }
      ]
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "size": 10,
    "total_pages": 10
  }
}
```

Notes:

- menggunakan Redis cache
- search pada `nama` dan `email`

---

# 2. Create User

Membuat user baru.

## Endpoint

```http
POST /users
```

Admin only.

## Request Body

```ts
type CreateUserRequest = {
  nim?: string;
  nidn?: string;
  nama: string;
  email: string;
  role_ids: string[];
};
```

## Example

```json
{
  "nama": "Rifqi",
  "email": "rifqi@mail.com",
  "role_ids": ["role-id"]
}
```

## Response

201 Created

```json
{
  "data": {
    "id": "user-id",
    "nama": "Rifqi",
    "email": "rifqi@mail.com"
  }
}
```

Validation:

- email valid
- role valid
- email unik
- NIM unik
- NIDN unik
- role unik tertentu

Role berikut hanya boleh satu:

```txt
KETUA_LPM
KETUA_SPI
```

Side effects:

- welcome email dikirim
- cache list dihapus
- cache export dihapus

---

# 3. Get User Detail

Mengambil detail user.

## Endpoint

```http
GET /users/:userId
```

Authenticated.

## Response

```json
{
  "data": {
    "id": "123",
    "nama": "Rifqi",
    "email": "rifqi@mail.com",
    "roles": [],
    "assistants": [],
    "assistant_of": null
  }
}
```

Notes:

- Redis cache
- TTL 300 detik

---

# 4. Update User

Update email dan role user.

## Endpoint

```http
PUT /users/:userId
```

Admin only.

## Request

```ts
type UpdateUserRequest = {
  email: string;
  role_ids: string[];
};
```

## Example

```json
{
  "email": "new@mail.com",
  "role_ids": ["role-id"]
}
```

Validation:

- email valid
- email unik
- role valid
- role unik KETUA_LPM/KETUA_SPI

---

# 5. Update Profile

User mengubah profil sendiri.

## Endpoint

```http
PUT /users/profile
```

Authenticated.

## Request

```ts
type UpdateProfileRequest = {
  nama: string;
  email: string;
  instagram: string;
  linkedin: string;
};
```

## Example

```json
{
  "nama": "Rifqi",
  "email": "rifqi@mail.com",
  "instagram": "@rifqi",
  "linkedin": "rifqi-linkedin"
}
```

---

# 6. Update Profile Picture

Upload foto profil.

## Endpoint

```http
PUT /users/profile/picture
```

Authenticated.

Content-Type:

```http
multipart/form-data
```

Form Data:

| Field   | Type | Required |
| ------- | ---- | -------: |
| picture | File |       ✅ |

Rules:

- image only
- max 5 MB

Flow:

1. upload image
2. update database
3. hapus gambar lama
4. rollback jika gagal

---

# 7. Update Password

Mengubah password user login.

## Endpoint

```http
PUT /users/password
```

Authenticated.

## Request

```ts
type UpdatePasswordRequest = {
  password: string;
};
```

## Example

```json
{
  "password": "new-password"
}
```

Response:

```http
204 No Content
```

Password menggunakan:

```txt
Bun.password.hash()
```

---

# 8. Assign Assistant

Menetapkan assistant ke user.

## Endpoint

```http
POST /users/:userId/asisten
```

Admin only.

## Request

```ts
type AssignAssistantRequest = {
  user_ids: string[];
};
```

## Example

```json
{
  "user_ids": ["assistant-1", "assistant-2"]
}
```

Rules:

- tidak boleh assign diri sendiri
- semua user harus valid
- assistant hanya boleh dimiliki satu owner
- duplicate otomatis dihapus

Service menggunakan:

```ts
new Set(user_ids);
```

---

# 9. Delete User

Soft delete user.

## Endpoint

```http
DELETE /users/:userId
```

Admin only.

Response:

```http
204 No Content
```

Behavior:

- soft delete menggunakan `deleted_at`
- relasi role ikut dihapus

---

# 10. Export PDF

Export laporan user PDF.

## Endpoint

```http
GET /users/export/pdf
```

Admin only.

Response:

```http
Content-Type: application/pdf
```

Filename:

```txt
laporan-user.pdf
```

---

# 11. Export CSV

Export laporan user CSV.

## Endpoint

```http
GET /users/export/csv
```

Admin only.

Response:

```http
Content-Type: text/csv
```

Filename:

```txt
laporan-user.csv
```

---

# Error Responses

## 400 Bad Request

Validation gagal.

```json
{
  "message": "Invalid email"
}
```

---

## 401 Unauthorized

Token tidak valid.

---

## 403 Forbidden

Role tidak memiliki akses.

---

## 404 Not Found

```json
{
  "message": "User not found"
}
```

---

## 409 Conflict

```json
{
  "message": "Email already exists"
}
```

---

## 410 Gone

```json
{
  "message": "User deleted"
}
```

---

# Frontend Integration Notes

## List Page

Gunakan:

```http
GET /users
```

dengan:

- pagination
- search
- role filter

---

## Profile Page

Gunakan:

```http
GET /users/:id
PUT /users/profile
PUT /users/profile/picture
PUT /users/password
```

---

## Admin Management

Gunakan:

```http
POST /users
PUT /users/:id
DELETE /users/:id
POST /users/:id/asisten
```

---

## Export Feature

Gunakan:

```http
GET /users/export/pdf
GET /users/export/csv
```

Response berupa file download.

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
