# Cara Push Proyek ke GitHub

Panduan singkat ini menjelaskan langkah umum untuk upload project lokal ke repository GitHub.

## 1. Masuk ke folder project
```bash
cd path/ke/project
```
Fungsi: berpindah ke direktori project yang ingin dipush.

## 2. Inisialisasi Git (jika belum ada repository Git)
```bash
git init
```
Fungsi: membuat repository Git lokal di folder project.

## 3. Cek perubahan file
```bash
git status
```
Fungsi: melihat file yang berubah, file baru, dan status staging.

## 4. Tambahkan file ke staging area
```bash
git add .
```
Fungsi: menyiapkan semua perubahan agar bisa disimpan dalam commit.

## 5. Simpan perubahan ke commit
```bash
git commit -m "pesan commit"
```
Fungsi: menyimpan snapshot perubahan dengan pesan yang menjelaskan isi perubahan.

## 6. Hubungkan ke repository GitHub (sekali saja)
```bash
git remote add origin https://github.com/username/nama-repo.git
```
Fungsi: menambahkan alamat repository GitHub sebagai remote bernama `origin`.

Opsional cek remote:
```bash
git remote -v
```
Fungsi: memastikan URL remote sudah benar.

## 7. Samakan nama branch utama (opsional, biasanya `main`)
```bash
git branch -M main
```
Fungsi: mengganti nama branch aktif menjadi `main`.

## 8. Push pertama ke GitHub
```bash
git push -u origin main
```
Fungsi: mengirim commit lokal ke GitHub dan menghubungkan branch lokal ke branch remote.

## 9. Push berikutnya
```bash
git push
```
Fungsi: mengirim commit terbaru ke branch remote yang sudah terhubung.

## Alur cepat saat ada file yang diubah/dibuat
```bash
git status
```
Fungsi: mengecek daftar file yang berubah dan file baru.

```bash
git add .
```
Fungsi: menambahkan semua file yang diubah/dibuat ke staging area.

```bash
git commit -m "update fitur/perbaikan"
```
Fungsi: menyimpan perubahan ke riwayat commit lokal.

```bash
git push
```
Fungsi: mengirim commit terbaru (termasuk file yang baru dibuat dan diubah) ke GitHub.

---

Tips:
- Gunakan pesan commit yang jelas, misalnya `git commit -m "tambah halaman login"`.
- Lakukan `git status` sebelum `git add` dan sebelum `git push` untuk menghindari file yang tidak sengaja ikut terkirim.
