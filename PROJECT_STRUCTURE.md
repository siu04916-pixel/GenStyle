# Proyek Genstyle-7 - Struktur dan Alur Kerja

**Nama proyek:** Genstyle-7
**Repositori:** `GenStyle` (GitHub)
**Pete:** 1 produk / 1 foto / 1 commit (tidak ada tambahan)

---

## 1. Struktur Proyek

```
GenStyle/
├── AGENTS.md           # Aturan global (agak mencakup WORKFLOW.md)
├── WORKFLOW.md         # Alur kerja terperinci (INTAKE → PREFLIGHT → PREPARE → COMMIT → VERIFY → REPORT)
├── README.md           # Aturan pengelolaan (baca sebelum ubah apa pun)
├── products.js         # Katalog produk (satu objek per produk, id unik)
├── worker.js           # API klik /api/top, /api/click (Cloudflare Worker, ESM)
├── wrangler.jsonc      # Konfigurasi Cloudflare (name: genstyle-7, assets, D1)
├── index.html          # Halaman utama (menggabungkan style.css, products.js, app.js)
├── style.css           # Design (dark theme #07090f, gold #c6ff3d)
├── app.js              # Logika frontend (render kartu, handling klik)
├── assets/             # Foto produk (assets/<id>.jpg)
│   └── atan.jpg        # Hanya 1 file (ATASAN ZELENA)
├── .assetsignore       # File yang tidak di-deploy (worker.js, wrangler.jsonc, dst.)
└── restore_9fdc2a0/    # Backup asli commit 9fdc2a0 (jika diperlukan)
```

> **Catatan:** Foto hero video (`908941338_1795681146919699.mp4`) dan `file_0000000046e0821199c7b422dab3eb0f.png` (brand icon) ada di root repo sebagai sisa dari commit lama — **tidak dipakai** oleh alur baru. Situs hanyalah HTML/CSS/JS + foto produk di `assets/`.

---

## 2. Nama File dan Isi

### `products.js`
- Array `P` berisi objek produk.
- Format tiap objek: `{id:"<id>",name:"<Nama>",meta:"",img:"assets/<id>.jpg",url:"<url>"},`
- Contoh:
  ```js
  var P=[
    {id:"one-set-christmas-2027",name:"One Set Christmas 2027",meta:"",img:"assets/one-set-christmas-2027.jpg",url:"https://s.shopee.co.id/2VtboPBPGB"},
    {id:"atasan-crop-top",name:"Atasan Crop Top Wanita Dewasa",meta:"",img:"Atasan%20Crop%20Top%20Wanita%20Dewasa.jpg",url:"https://s.shopee.co.id/8VAnWbEPAN"},
    {id:"dress-biru-ruffle",name:"Dress Biru Ruffle Layer Soft Girl Long Dress",meta:"",img:"Dress%20Biru%20Ruffle%20Layer%20Soft%20Girl%20Long%20Dress.jpg",url:"https://s.shopee.co.id/AUvrsYQEBD"},
    {id:"payung-romansa",name:"Payung Romansa",meta:"",img:"Payung%20Romansa.jpg",url:"https://s.shopee.co.id/1W138AAmFo"},
    {id:"atasan-zelena",name:"ATASAN ZELENA",meta:"",img:"assets/atan.jpg",url:"https://s.shopee.co.id/BVgJT3QU7"}
  ];
  var B=[
    ["Arc Studio","Brand contoh bergaya utilitarian modern. Ganti teks ini dengan deskripsi, asal negara, dan sumber resmi brand."],
    ["Kuro Wear","Brand contoh bernuansa monokrom dan minimalis. Isi dengan keterangan brand yang sudah diverifikasi."],
    ["Nimbus","Brand contoh untuk sneakers dan aksesori harian. Isi dengan deskripsi dan tautan situs resmi."]
  ];
  ```
- ID produk: huruf kecil, angka, tanda minus saja (`^[a-z0-9-]{1,60}$`).
- Foto harus di `assets/<id>.jpg` (JPG, ≤1000px, ≤150KB, tanpa metadata).

### `worker.js`
- **Hanya** menangani `/api/top` dan `/api/click`.
- Memakai Cloudflare D1 (`genstyle-clicks`) untuk menghitung klik.
- Tidak boleh diubah desain, tidak boleh di-deploy manual, tidak boleh ada embedded data.
- Harus `SELECT product_id` (tidak `PLACEHOLDER`).

### `wrangler.jsonc`
- Nama Worker: `genstyle-7` (tidak boleh diubah).
- `assets.directory: "./"` — situs di-host dari GitHub.
- `d1_databases.binding: "DB"` — database untuk klik.
- Tidak mengubah build command, deploy command, atau bindings.

---

## 3. Alur Kerja (INTAKE → PREFLIGHT → PREPARE → COMMIT → VERIFY → REPORT)

```
INTAKE → PREFLIGHT → PREPARE → COMMIT → VERIFY → REPORT
                                     ↓
                               (gagal) → ROLLBACK → REPORT (gagal)
```

### Fase 0 — INTAKE
- Ubah permintaan menjadi objek: `{action, id, name, url, image, meta}`.
- Validasi:
  - `id`: `^[a-z0-9-]{1,60}$` (untuk `add`, generate dari nama: huruf kecil, spasi → dash).
  - `name`: 3-120 karakter, tanpa `<` atau `>`.
  - `url`: harus `https://`. Jika bukan `shopee.co.id`, tanya pemilik.
  - `add` wajib: name, url, foto. `edit` wajib: id + minimal 1 kolom berubah. `remove` wajib: id.
  - Data kurang = **TANYA**. Jangan mengarang.

### Fase 1 — PREFLIGHT (hanya BACA)
- Baca SHA `main` → simpan sebagai **H0**.
- Baca `products.js` + sha → parse array `P` → cek id terbaru.
- `add`: cek duplikat (id, url). Jika sudah ada → tanya, jangan menimpa.
- Cek file terlindungi (daftar di `AGENTS.md`) ada di repo.
- Cloudflare (baca saja): catat `modified_on` Worker `genstyle-7` sebagai **T0**.
  - Pastikan worker memuat `SELECT product_id` dan **bukan** `PLACEHOLDER`.
  - Jika tidak: **INSIDEN** → HENTI, laporan, tunggu pemilik.

### Fase 2 — PREPARE (lokal, belum menulis)
- Foto: `assets/<id>.jpg`, JPG, ≤1000px, ~75 quality, <150KB, tanpa metadata.
- Format baris produk: `{id:"<id>",name:"<Nama>",meta:"",img:"assets/<id>.jpg",url:"<url>"},`
- `add`: sisipkan di paling atas array, tepat setelah `var P=[`.
- Hitung perbedaan: `add` → +1 baris; `edit` → baris berubah, id tetap; `remove` → -1 baris.
- Validasi `products.js` baru: JS valid, tiap objek punya id/name/img/url, id unik, `var B=[...]` tidak berubah.

### Fase 3 — COMMIT (SATU COMMIT ATOMIK)
- Pastikan `main` masih H0. Jika berubah, ulang PREFLIGHT maks. 3×, lalu HENTI.
- Commit atomik via Git Data API:
  1. Buat blob foto (`assets/<id>.jpg`, biner asli).
  2. Buat tree baru dengan `assets/<id>.jpg` + `products.js`.
  3. Commit dengan induk H0.
- Pesan commit baku:
  ```
  Hermes: add product <Nama> (<id>)

  Action: add
  Product-ID: <id>
  Image: assets/<id>.jpg
  URL: <url>
  ```
- **Tidak ada langkah deploy**. Cloudflare membangun otomatis.

### Fase 4 — VERIFY (poll setiap 15 detik, maks. 5 menit)
Laporan V1-V7:
- **V1:** `modified_on` Worker `genstyle-7` > waktu commit.
- **V2:** `GET /products.js` di situs live memuat id/foto/url baru.
- **V3:** `GET /assets/<id>.jpg` → 200, `image/jpeg`, ≥1KB.
- **V4:** `GET /api/top` → 200, JSON `{"top":[...]}`.
- **V5:** `GET /` → 200, memuat `style.css`, `products.js`, `app.js`.
- **V6:** script Worker masih `SELECT product_id`, bukan `PLACEHOLDER`.
- **V7:** `GET /908941338_1795681146919699.mp4` → 200 (video hero masih ada).
- **Gerbang G5:** V1-V7 lulus.

### Fase 5 — ROLLBACK (hanya jika VERIFY gagal)
- Buat commit baru yang memulihkan `products.js` ke isi H0.
- Hapus foto yang baru ditambahkan.
- **Dilarang:** force-push, reset, atau mengubah Cloudflare.
- Ulangi V1-V5, lalu laporkan sebagai **GAGAL**.

### Fase 6 — REPORT (selalu)
Laporan ke pemilik, bahasa Indonesia:
```
Status: BERHASIL | GAGAL | DITOLAK | BERHENTI
Tindakan: tambah | ubah | hapus produk <Nama> (<id>)
Commit: <sha pendek> (atau "tidak ada")
Pemeriksaan: V1 ok/gagal, V2 ..., V7 ...
Total produk sekarang: <angka>
Catatan/langkah pemilik: <jika ada, mis. foto belum diunggah>
```

---

## 4. Kondisi HENTI (jangan menulis, laporkan, tunggu pemilik)
- Permintaan menyentuh file terlindungi, tampilan, fitur, atau struktur website.
- Perlu menulis ke Cloudflare (script Worker, bindings, domain, build, database).
- `id` atau `url` duplikat; foto tidak ada atau bukan gambar valid.
- >5 produk dalam 1 permintaan (pecah per 5 atau tanya).
- `main` terus berubah (3× gagal di Fase 3).
- **INSIDEN:** Worker `genstyle-7` bukan milik repositori (memuat `PLACEHOLDER`, tidak memuat `SELECT product_id`, atau `modified_on` berubah tanpa commit). Laporkan: *"Worker ditimpa, perlu deploy ulang dari GitHub oleh pemilik"*.

---

## 5. Hak Akses Token (Pengaman Nyata)
| Agen | GitHub | Cloudflare |
|------|--------|------------|
| Genstyle-7 | Repositori `GenStyle`, Contents: Read + Write | **BACA saja** (Workers Scripts: Read), **TIDAK EDIT** |

> Token Cloudflare: **READ ONLY**. Tidak boleh deploy manual. Saat ini auth di `gh CLI` (akun `siu04916-pixel`) untuk operasi read. Deploy hanya lewat commit ke `main`.

---

## 6. Definisi Selesai
- Produk tampil di situs live.
- Fotonya terbuka (200, image/jpeg).
- `/api/top` normal (`{"top":[...]}`).
- Tidak ada file terlindungi berubah.
- Worker masih milik repositori (`SELECT product_id`, tidak `PLACEHOLDER`).
- Laporan sudah dikirim.

---
**Sumber:** `AGENTS.md` (aturan dasar), `WORKFLOW.md` (alur terperinci)
