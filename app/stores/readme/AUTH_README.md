# 🔐 Auth Module — API Documentation

Dokumentasi lengkap untuk mengkonsumsi endpoint **Authentication** dari frontend atau AI coding agent.

---

## 📋 Daftar Isi

- [Ringkasan Sistem Auth](#ringkasan-sistem-auth)
- [Mekanisme Token](#mekanisme-token)
- [Endpoints](#endpoints)
  - [POST /auth/login](#post-authlogin)
  - [GET /auth/google](#get-authgoogle)
  - [GET /auth/google/callback](#get-authgooglecallback)
  - [GET /auth/refresh](#get-authrefresh)
  - [GET /auth/me](#get-authme)
  - [POST /auth/logout](#post-authlogout)
- [Alur Autentikasi](#alur-autentikasi)
- [Penanganan Error](#penanganan-error)
- [Contoh Implementasi Frontend](#contoh-implementasi-frontend)
- [Tipe Data TypeScript](#tipe-data-typescript)

---

## Ringkasan Sistem Auth

Sistem autentikasi menggunakan **dual-token strategy**:

| Token                  | Lokasi                 | Sifat               | Tujuan                         |
| ---------------------- | ---------------------- | ------------------- | ------------------------------ |
| **Access Token** (JWT) | Response body / Memory | Short-lived (menit) | Autentikasi setiap request API |
| **Refresh Token**      | HTTP-only Cookie       | Long-lived (hari)   | Memperbarui access token       |

> **Catatan untuk AI Agent:** Selalu simpan `access_token` di **memori/state aplikasi** (jangan di `localStorage`). `refresh_token` dikelola otomatis oleh browser melalui HTTP-only cookie — tidak perlu dimanipulasi secara manual.

---

## Mekanisme Token

```
┌─────────────────────────────────────────────────────────────┐
│                     ALUR TOKEN AUTH                          │
│                                                             │
│  Login/Google ──► Access Token (body) + Refresh Token (cookie)│
│                                                             │
│  Setiap Request ──► Header: Authorization: Bearer <access>  │
│                                                             │
│  Access Token Expired? ──► GET /auth/refresh                │
│      ├─ Kirim refresh token (otomatis via cookie)           │
│      └─ Terima access token baru + refresh token baru       │
│                                                             │
│  Logout ──► Blacklist access token + Revoke refresh token   │
└─────────────────────────────────────────────────────────────┘
```

---

## Endpoints

### POST /auth/login

Login menggunakan **email dan password**.

**URL:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validasi:**

- `email`: wajib, format email valid, maksimal 255 karakter
- `password`: wajib, minimal 1 karakter, maksimal 128 karakter

**Response Sukses `200 OK`:**

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "expires_in": 900
  }
}
```

> `expires_in` dalam satuan **detik** (misal: `900` = 15 menit).

**Side Effect:**

- Server menyetel HTTP-only cookie `refresh_token` secara otomatis.

**Contoh Fetch:**

```typescript
const response = await fetch("/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // ⚠️ WAJIB agar cookie refresh_token tersimpan
  body: JSON.stringify({ email, password }),
});

const { data } = await response.json();
// Simpan data.token di state/memory
const accessToken = data.token;
```

---

### GET /auth/google

Redirect pengguna ke halaman login Google OAuth.

**URL:** `GET /auth/google`

**Cara Pakai:**

```typescript
// Arahkan langsung browser ke URL ini
window.location.href = "/auth/google";
```

**Flow:**

1. Browser diarahkan ke halaman consent Google.
2. Setelah user menyetujui, Google redirect ke `/auth/google/callback`.

---

### GET /auth/google/callback

Endpoint ini **dipanggil otomatis oleh Google** setelah user menyetujui OAuth. **Tidak perlu dipanggil manual oleh frontend.**

**URL:** `GET /auth/google/callback?code=<authorization_code>`

**Flow Internal:**

1. Server memverifikasi `code` dari Google.
2. Mendapatkan email user dari Google token.
3. Jika user **ditemukan** di database → buat refresh token → redirect ke `{CLIENT_URL}/auth/google-callback` dengan cookie `refresh_token` disetel.
4. Jika user **tidak ditemukan** → redirect ke `{CLIENT_URL}/login?error=user-not-found`.

**Yang perlu dilakukan frontend:**

Buat halaman `/auth/google-callback` yang memanggil `GET /auth/refresh` untuk mendapatkan access token:

```typescript
// Halaman: /auth/google-callback
// Saat halaman ini dimuat, panggil refresh untuk mendapatkan access token
useEffect(() => {
  const fetchAccessToken = async () => {
    const response = await fetch("/auth/refresh", {
      credentials: "include", // ⚠️ WAJIB
    });
    const { data } = await response.json();
    // Simpan access token
    setAccessToken(data.token);
    // Redirect ke dashboard
    router.push("/dashboard");
  };
  fetchAccessToken();
}, []);
```

> **Catatan untuk AI Agent:** Jika ada query param `?error=user-not-found` saat redirect ke `/login`, tampilkan pesan error bahwa akun Google tidak terdaftar.

---

### GET /auth/refresh

Memperbarui **access token** menggunakan refresh token yang tersimpan di cookie.

**URL:** `GET /auth/refresh`

**Headers yang diperlukan:** Tidak ada (refresh token dibaca otomatis dari cookie).

**Request:** Tidak ada body. Refresh token dikirim otomatis via cookie.

**Response Sukses `200 OK`:**

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "expires_in": 900
  }
}
```

**Side Effect:**

- Refresh token lama **di-revoke** (token rotation).
- Refresh token baru disetel ke cookie secara otomatis.

**Contoh Fetch:**

```typescript
const response = await fetch("/auth/refresh", {
  method: "GET",
  credentials: "include", // ⚠️ WAJIB
});

const { data } = await response.json();
const newAccessToken = data.token;
```

> **Penting (Token Rotation):** Setiap kali `/auth/refresh` dipanggil, refresh token lama dihapus dan diganti dengan yang baru. Ini adalah fitur keamanan — jangan panggil endpoint ini secara paralel/bersamaan.

---

### GET /auth/me

Mendapatkan data profil **user yang sedang login**.

**URL:** `GET /auth/me`

**Headers yang diperlukan:**

```
Authorization: Bearer <access_token>
```

**Response Sukses `200 OK`:**

```json
{
  "data": {
    "id": "uuid-user",
    "name": "Nama User",
    "email": "user@example.com",
    "roles": [
      {
        "id": "uuid-role",
        "name": "Admin"
      }
    ],
    "asisten_dimiliki": [...],
    "sebagai_asisten": [...]
  }
}
```

**Contoh Fetch:**

```typescript
const response = await fetch("/auth/me", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  credentials: "include",
});

const { data } = await response.json();
```

**Middleware yang aktif:**

- `langMiddleware` — membaca bahasa dari header/query `lang` (default: `id`)
- `authMiddleware` — memvalidasi JWT dan mengekstrak `userId` dari payload

> **Catatan untuk AI Agent:** Endpoint ini menggunakan `authMiddleware`. Pastikan access token valid dan belum expired. Jika response `401`, panggil `/auth/refresh` lalu retry.

---

### POST /auth/logout

Logout user — mencabut semua token dan menghapus cookie.

**URL:** `POST /auth/logout`

**Headers yang diperlukan:**

```
Authorization: Bearer <access_token>
```

**Response Sukses `204 No Content`** — tidak ada response body.

**Yang terjadi di server:**

1. Access token di-**blacklist** di Redis (hingga waktu ekspirasi aslinya).
2. Refresh token di-**revoke** di database.
3. Cookie `refresh_token` **dihapus**.

**Contoh Fetch:**

```typescript
const response = await fetch("/auth/logout", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  credentials: "include", // ⚠️ WAJIB agar cookie dihapus
});

if (response.status === 204) {
  // Hapus access token dari state
  setAccessToken(null);
  router.push("/login");
}
```

---

## Alur Autentikasi

### Alur Login Biasa (Email & Password)

```
Frontend                          Backend
   │                                 │
   │── POST /auth/login ────────────►│
   │   { email, password }           │── Validasi kredensial
   │                                 │── Buat refresh token (DB)
   │◄── 200 OK ─────────────────────│── Buat JWT access token
   │   { data: { token, ... } }      │── Set cookie: refresh_token
   │   Set-Cookie: refresh_token     │
   │                                 │
   │ [Simpan access token di memory] │
   │                                 │
   │── GET /auth/me ────────────────►│
   │   Authorization: Bearer <jwt>   │── Validasi JWT
   │◄── 200 OK ─────────────────────│── Return user data
```

### Alur Login Google OAuth

```
Frontend                          Backend                    Google
   │                                 │                          │
   │── window.location = /auth/google►│                         │
   │                                 │── Redirect ke Google ───►│
   │                                 │                          │
   │◄── Redirect ke Google ─────────────────────────────────────│
   │     (Consent screen)            │                          │
   │── Approve ─────────────────────────────────────────────────►│
   │                                 │◄── callback?code=xxx ───│
   │                                 │── Verifikasi kode        │
   │                                 │── Cari user by email     │
   │◄── Redirect ke /auth/google-callback (cookie disetel) ─────│
   │                                 │
   │── GET /auth/refresh ───────────►│
   │◄── { data: { token, ... } } ───│
```

### Alur Refresh Token (Auto-Refresh)

```
Frontend
   │
   │── Request API dengan access token ──► 401 Unauthorized
   │
   │── GET /auth/refresh (cookie dikirim otomatis)
   │◄── 200 OK: access token baru
   │
   │── Retry request API dengan token baru
   │◄── 200 OK: response sukses
```

---

## Penanganan Error

| HTTP Status                 | Kondisi                                        | Solusi Frontend                                   |
| --------------------------- | ---------------------------------------------- | ------------------------------------------------- |
| `400 Bad Request`           | Validasi input gagal (format email salah, dll) | Tampilkan pesan validasi ke user                  |
| `401 Unauthorized`          | Token invalid/expired, kredensial salah        | Coba refresh token; jika gagal, redirect ke login |
| `404 Not Found`             | User tidak ditemukan                           | Tampilkan pesan user tidak terdaftar              |
| `500 Internal Server Error` | Error server                                   | Tampilkan pesan error umum                        |

**Contoh interceptor axios untuk auto-refresh:**

```typescript
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // Coba refresh token
        const { data } = await axios.get("/auth/refresh", {
          withCredentials: true,
        });
        const newToken = data.data.token;

        // Simpan token baru
        setAccessToken(newToken);

        // Ulangi request asli dengan token baru
        error.config.headers["Authorization"] = `Bearer ${newToken}`;
        return axios(error.config);
      } catch {
        // Refresh gagal → paksa logout
        redirectToLogin();
      }
    }
    return Promise.reject(error);
  },
);
```

---

## Contoh Implementasi Frontend

### Utility: `authClient.ts`

```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Request dengan auto-refresh
export async function authFetch(url: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    // Coba refresh
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      credentials: "include",
    });

    if (!refreshRes.ok) {
      // Redirect ke login
      window.location.href = "/login";
      throw new Error("Session expired");
    }

    const { data } = await refreshRes.json();
    setAccessToken(data.token);

    // Ulangi request
    return fetch(`${BASE_URL}${url}`, {
      ...options,
      credentials: "include",
      headers: {
        ...options.headers,
        Authorization: `Bearer ${data.token}`,
        "Content-Type": "application/json",
      },
    });
  }

  return response;
}

// Login
export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login gagal");

  const { data } = await res.json();
  setAccessToken(data.token);
  return data;
}

// Logout
export async function logout() {
  await authFetch("/auth/logout", { method: "POST" });
  setAccessToken(null);
}

// Get current user
export async function getCurrentUser() {
  const res = await authFetch("/auth/me");
  const { data } = await res.json();
  return data;
}

// Init saat app load (cek apakah ada sesi aktif)
export async function initAuth() {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      credentials: "include",
    });
    if (res.ok) {
      const { data } = await res.json();
      setAccessToken(data.token);
      return data.token;
    }
  } catch {
    // Tidak ada sesi aktif
  }
  return null;
}
```

---

## Tipe Data TypeScript

Tipe-tipe berikut cocok dipakai di frontend untuk konsistensi dengan backend:

```typescript
// Response access token dari server
type AccessTokenResponse = {
  token: string; // JWT string
  type: string; // Selalu "Bearer"
  expires_in: number; // Detik hingga token expired
};

// Request body untuk login
type LoginRequest = {
  email: string;
  password: string;
};

// Payload yang terdekode dari JWT
type JWTPayload = {
  sub: string; // User ID (UUID)
  exp: number; // Unix timestamp expiry
};

// Response dari /auth/me (sesuaikan dengan UserResponse dari backend)
type UserResponse = {
  id: string;
  name: string;
  email: string;
  roles: Array<{
    id: string;
    name: string;
  }>;
};
```

---

## Catatan Keamanan

| Hal                                              | Penjelasan                                                                              |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| **Jangan simpan access token di `localStorage`** | Rentan terhadap XSS. Gunakan state React/Vue/Angular, atau variabel modul.              |
| **`credentials: 'include'` wajib**               | Tanpa ini, browser tidak mengirim/menerima cookie HTTP-only.                            |
| **Cookie `refresh_token` bersifat `httpOnly`**   | Frontend tidak bisa membaca cookie ini secara langsung — itu sudah benar dan by design. |
| **Token Rotation**                               | Setiap refresh menghasilkan refresh token baru. Token lama langsung tidak valid.        |
| **Blacklist via Redis**                          | Saat logout, access token lama tetap tidak bisa digunakan meskipun belum expired.       |

---

## Struktur File Modul

```
src/modules/auth/
├── auth.controller.ts   # Definisi HTTP endpoints & routing
├── auth.service.ts      # Logika bisnis: login, refresh, OAuth, logout
├── auth.model.ts        # Type definitions: LoginRequest, AccessTokenResponse, JWTPayload
├── auth.validation.ts   # Validasi input dengan Zod
├── auth.redis.ts        # Operasi Redis: blacklist token
├── auth.container.ts    # Dependency injection container
└── test/                # Unit tests
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
