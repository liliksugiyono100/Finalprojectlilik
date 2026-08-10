# Defect & Outstanding Works Tracker

Aplikasi Next.js untuk tracking 91 item defect/outstanding works. Data
disimpan di Vercel Blob Storage (bukan localStorage) sehingga update dari
satu device sinkron ke device lain.

## Fitur

1. Halaman list semua item, bisa difilter per PIC.
2. Klik item untuk membuka form edit semua field.
3. Setiap disimpan, `last_updated_at` otomatis terisi timestamp dan tampil
   di list & halaman edit.
4. Data disimpan di Vercel Blob Storage lewat API route (`/api/items`),
   dengan seed awal dari `data/seed-data.json`.

## Menjalankan secara lokal

1. Buat Blob store di project Vercel (Storage → Blob) lalu jalankan
   `vercel env pull .env.local` agar variabel `BLOB_READ_WRITE_TOKEN`
   tersedia secara lokal. Tanpa token ini, baca/tulis ke Blob Storage akan
   gagal.
2. Install dependency dan jalankan dev server:

   ```bash
   npm install
   npm run dev
   ```

3. Buka [http://localhost:3000](http://localhost:3000). Saat pertama kali
   diakses, data akan otomatis di-seed dari `data/seed-data.json` ke Blob
   Storage.

## Deploy ke Vercel

1. Hubungkan repo ke project Vercel.
2. Tambahkan Blob store (Storage → Blob) ke project agar
   `BLOB_READ_WRITE_TOKEN` otomatis tersedia di environment.
3. Deploy seperti biasa.
