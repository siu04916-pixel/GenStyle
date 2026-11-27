# AGENTS.md - Panduan agen AI untuk website GenStyle

Tujuan agen: HANYA mengelola PRODUK (tambah, ubah, hapus). Struktur website TIDAK BOLEH diubah.
Baca seluruh file ini sebelum bekerja. Jika ragu, berhenti dan tanya pemilik.

## 1. Cara deploy (jangan diubah)
- Repositori GitHub: `siu04916-pixel/Genstyle`, cabang `main`.
- Cloudflare Worker `genstyle-7` terhubung ke repositori ini dan membangun ulang situs OTOMATIS (sekitar 1 menit) setiap ada commit ke `main`.
- Jadi: menambah produk = COMMIT KE GITHUB. Tidak ada langkah deploy lain. Jangan men-deploy apa pun ke Cloudflare.

## 2. Yang boleh dan tidak boleh disentuh
BOLEH diubah oleh agen:
- `products.js`, hanya isi array `P` (daftar produk).
- File foto produk di folder `assets/`.

DILARANG diubah, dihapus, dipindah, atau diganti namanya:
- `index.html`, `style.css`, `responsive.css`, `app.js`, `worker.js`, `wrangler.jsonc`, `.assetsignore`, `README.md`, `AGENTS.md`, `robots.txt`
- video hero `908941338_1795681146919699.mp4` dan `hero-poster.jpg`
- array brand `B` di `products.js`
- semua foto produk lama yang masih dipakai

DILARANG di Cloudflare (lewat API, wrangler, atau dashboard):
- mengunggah, mengganti, atau mengedit script Worker `genstyle-7` atau Worker mana pun
- membuat Worker/Pages baru, mengganti nama Worker, mengubah route/domain, build settings, atau bindings
- mengubah atau menghapus database D1 `genstyle-clicks` (berisi data klik; jangan di-reset)
- Cloudflare API hanya boleh dipakai untuk MEMBACA (misalnya melihat `modified_on` Worker untuk memastikan deploy selesai).

DILARANG membuat ulang situs: jangan menulis ulang halaman, jangan menaruh gambar sebagai base64/data URI, jangan memakai tulisan `PLACEHOLDER`, jangan menggabungkan semua file jadi satu Worker, jangan "mengembalikan desain asli dari commit lama".

## 3. Prosedur menambah produk
Data dari pemilik: nama produk, link toko (mis. `https://s.shopee.co.id/...`), foto. Jika ada yang kurang, TANYAKAN. Jangan mengarang link, nama, atau foto.

1. Buat `id`: huruf kecil, angka, tanda minus saja, 1-60 karakter, unik (contoh: `one-set-christmas-2027`). Harus cocok dengan `^[a-z0-9-]{1,60}$`. ID produk lama TIDAK BOLEH diubah (data klik terikat pada id).
2. Siapkan foto: JPG, lebar maksimal 1000 px, usahakan rasio 4:5, ukuran di bawah 150 KB. Kompres dulu jika lebih besar.
3. Unggah foto sebagai FILE BINER ASLI ke `assets/<id>.jpg` lewat GitHub API (konten base64 dikirim ke API sebagai file biner, bukan ditulis ke dalam kode).
4. Ambil `products.js` terbaru beserta `sha`-nya tepat sebelum mengedit. Sisipkan SATU baris objek baru di PALING ATAS array `P`, tepat setelah baris `var P=[`, dengan format persis:

   `{id:"<id>",name:"<Nama Produk>",meta:"",img:"assets/<id>.jpg",url:"<link toko>"},`

   Aturan: setiap objek diakhiri koma (kecuali yang terakhir), tanda kutip ganda, tidak ada baris lain yang berubah. Jika nama memuat tanda kutip ganda, tulis sebagai `\"`. Spasi di nama file foto ditulis `%20` pada `img`.
5. Commit ke `main` dengan pesan `Tambah produk: <Nama Produk>`. Jika `sha` bentrok, baca ulang `products.js` lalu ulangi dari langkah 4.
6. Tunggu 60-90 detik, lalu verifikasi:
   - `modified_on` Worker `genstyle-7` berubah menjadi waktu baru (baca saja).
   - `https://<alamat-live>/products.js` memuat `id` baru.
   - `https://<alamat-live>/assets/<id>.jpg` menjawab 200 dengan tipe `image/jpeg`.
   - `https://<alamat-live>/api/top` menjawab 200 berisi JSON `{"top":[...]}`.
7. Laporkan ke pemilik: produk apa yang ditambah, hasil keempat pemeriksaan, dan jumlah total produk.

Jika pemeriksaan gagal: JANGAN memperbaiki dengan men-deploy ke Cloudflare. Revert commit terakhir lewat GitHub lalu laporkan masalahnya.

## 4. Mengubah atau menghapus produk
- Ubah nama/link/foto: edit hanya objek produk itu di `products.js`. `id` tetap.
- Hapus produk: hapus hanya objek itu dari `P`. Biarkan file fotonya.
- Satu perubahan = satu commit kecil. Jangan merapikan atau memformat ulang bagian lain.

## 5. Ringkasan
Unggah foto ke `assets/` -> tambah satu baris di `products.js` -> commit ke `main` -> Cloudflare deploy otomatis -> verifikasi (baca saja) -> laporkan. Tidak ada langkah lain.
