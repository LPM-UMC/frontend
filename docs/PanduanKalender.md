# Panduan Integrasi Backend - Kalender Generator

## Tujuan
Dokumen ini menjelaskan cara menyambungkan fitur **Kalender Generator** di frontend ke backend API.

Fitur yang dicakup:
- Melihat daftar kalender (`GET`)
- Membuat kalender baru + upload file PDF (`POST multipart/form-data`)

---

## Arsitektur Saat Ini (Frontend)

Layer yang sudah dipisah:
- Kontrak type API/UI: `features/dashboard/types/calendarGenerator.ts`
- Repository (API + fallback dummy): `features/dashboard/composables/useCalendarGeneratorRepository.ts`
- Dummy storage seed: `features/dashboard/data/calendarGeneratorDummy.ts`
- UI page: `features/dashboard/pages/DashboardCalendarGeneratorPages.vue`

Jadi nanti saat backend siap, fokus perubahan cukup di repository/endpoint dan env.

---

## Endpoint Backend Yang Diharapkan

Base URL diambil dari:
- `runtimeConfig.public.apiBase` (Nuxt)
- Env: `API_BASE`

Default saat ini:
- `http://localhost:3001`

Endpoint:
1. `GET /api/v1/dashboard/calendar-generator`
2. `POST /api/v1/dashboard/calendar-generator`

---

## Kontrak Data

### Item Kalender (format backend)
```json
{
  "id": "cal-2024-2025-ganjil",
  "period": "2024/2025",
  "semester": "Ganjil",
  "start_date": "2024-09-23",
  "end_date": "2025-01-15",
  "file_name": "Kalender Akademik 2024-2025 Ganjil.pdf",
  "file_size_kb": 820,
  "file_url": "https://example.com/kalender/2024-2025-ganjil.pdf",
  "created_at": "2024-09-23T08:00:00.000Z"
}
```

### Field POST (`multipart/form-data`)
- `period` (string)
- `semester` (`Ganjil` | `Genap`)
- `start_date` (YYYY-MM-DD)
- `end_date` (YYYY-MM-DD)
- `file` (PDF)

---

## Format Response Yang Didukung Frontend

Frontend mendukung 2 pola response:

1) **Plain payload**
- GET: array item atau object `{ items: [...] }`
- POST: object item kalender

2) **Envelope**
```json
{
  "success": true,
  "message": "ok",
  "data": { "...": "..." }
}
```

Contoh GET dengan envelope:
```json
{
  "success": true,
  "message": "ok",
  "data": {
    "items": [
      {
        "id": "cal-1",
        "period": "2024/2025",
        "semester": "Ganjil",
        "start_date": "2024-09-23",
        "end_date": "2025-01-15",
        "file_name": "Kalender Akademik.pdf",
        "file_size_kb": 820,
        "file_url": "https://cdn.example.com/kalender-akademik.pdf",
        "created_at": "2024-09-23T08:00:00.000Z"
      }
    ]
  }
}
```

Contoh POST sukses dengan envelope:
```json
{
  "success": true,
  "message": "created",
  "data": {
    "id": "cal-99",
    "period": "2025/2026",
    "semester": "Ganjil",
    "start_date": "2025-09-22",
    "end_date": "2026-01-14",
    "file_name": "Kalender-2025-2026.pdf",
    "file_size_kb": 910,
    "file_url": "https://cdn.example.com/kalender-2025-2026.pdf",
    "created_at": "2026-04-19T10:00:00.000Z"
  }
}
```

---

## Konfigurasi Environment

Buat/ubah `.env`:
```env
API_BASE=http://localhost:3001
```

Jika backend beda domain, pastikan backend mengizinkan CORS origin frontend.

Catatan: frontend memakai `credentials: 'include'`, jadi jika auth pakai cookie:
- backend harus mengaktifkan `Access-Control-Allow-Credentials: true`
- origin tidak boleh wildcard `*`

---

## Mode Data Source

Repository saat ini:
```ts
useCalendarGeneratorRepository('auto')
```

Perilaku:
- `auto` / `api`: coba API dulu, jika gagal fallback ke dummy localStorage
- `dummy`: pakai localStorage saja

Ini memudahkan development bertahap tanpa memblokir UI.

---

## Checklist Backend

1. Implement `GET /api/v1/dashboard/calendar-generator`.
2. Implement `POST /api/v1/dashboard/calendar-generator` dengan `multipart/form-data`.
3. Validasi file:
- hanya PDF
- batas maksimal 5 MB (disarankan sama dengan frontend)
4. Simpan metadata dan kembalikan field sesuai kontrak (snake_case).
5. Kembalikan `created_at` dalam format ISO timestamp.
6. Aktifkan CORS + credentials jika pakai cookie session.

---

## Uji Cepat Endpoint

### GET
```bash
curl -X GET "http://localhost:3001/api/v1/dashboard/calendar-generator"
```

### POST
```bash
curl -X POST "http://localhost:3001/api/v1/dashboard/calendar-generator" \
  -F "period=2025/2026" \
  -F "semester=Ganjil" \
  -F "start_date=2025-09-22" \
  -F "end_date=2026-01-14" \
  -F "file=@./Kalender-2025-2026.pdf"
```

---

## Mapping Backend -> UI

Mapping terjadi di `mapApiItemToEntry()` dalam repository:
- `start_date` -> `startDate`
- `end_date` -> `endDate`
- `file_name` -> `fileName`
- `file_size_kb` -> `fileSizeKb`
- `file_url` -> `fileUrl`
- `created_at` -> `createdAt`

Selama kontrak backend konsisten, komponen UI tidak perlu diubah.
