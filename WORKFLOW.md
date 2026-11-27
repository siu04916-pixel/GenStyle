# WORKFLOW.md - Alur kerja agen AI (Hermes) untuk produk GenStyle

Alur ini tunduk pada `AGENTS.md`. Jika ada konflik, `AGENTS.md` yang menang.

## Prinsip
1. Satu tujuan: katalog produk (`products.js` dan foto di `assets/`). Selain itu: berhenti dan tanya pemilik.
2. Hak akses minimum per fase (lihat tabel).
3. Baca dulu, tulis sekali, verifikasi, baru laporkan. Tidak ada menulis tanpa membaca.
4. Gagal = berhenti dan batalkan perubahan sendiri. Tidak ada "perbaikan kreatif", tidak ada deploy ke Cloudflare.
5. Satu penulis pada satu waktu: sebelum menulis, pastikan `main` belum berubah sejak dibaca.

## Hak akses per fase
| Fase | GitHub baca | GitHub tulis | Cloudflare | Web live |
|---|---|---|---|---|
| 0 INTAKE | tidak | tidak | tidak | tidak |
| 1 PREFLIGHT | ya | tidak | BACA saja | GET |
| 2 PREPARE | ya | tidak | tidak | tidak |
| 3 COMMIT | ya | ya (hanya `products.js` dan `assets/<id>.jpg`, cabang `main`, tanpa force) | tidak | tidak |
| 4 VERIFY | ya | tidak | BACA saja | GET |
| 5 ROLLBACK | ya | ya (hanya membatalkan commit sendiri) | tidak | GET |

## Alur
```
INTAKE -> PREFLIGHT -> PREPARE -> COMMIT -> VERIFY -> REPORT
                                              |
                                              +-- gagal --> ROLLBACK -> REPORT (gagal)
Gagal di PREFLIGHT/PREPARE -> REPORT (ditolak + alasan), tanpa menulis apa pun
Kondisi HENTI di fase mana pun -> berhenti, laporkan, tunggu pemilik
```

## Fase 0 - INTAKE
Ubah permintaan pemilik menjadi satu objek:
```
{ "action": "add|edit|remove", "id": "...", "name": "...", "url": "https://...", "image": "<berkas foto>", "meta": "" }
```
Aturan validasi:
- `id`: cocok `^[a-z0-9-]{1,60}$`. Untuk `add`, buat dari nama (huruf kecil, spasi jadi minus).
- `name`: 3-120 karakter, tanpa `<` atau `>`.
- `url`: harus diawali `https://`. Jika bukan domain `shopee.co.id`, tanyakan dulu.
- `add` wajib punya name, url, dan foto. `edit` wajib punya id dan minimal satu kolom yang berubah. `remove` wajib punya id.
- Data kurang = TANYA. Jangan mengarang nama, link, atau foto.
Gerbang G0: semua kolom valid.

## Fase 1 - PREFLIGHT (hanya membaca)
1. Baca SHA kepala `main` -> simpan sebagai H0.
2. Baca `products.js` beserta `sha`-nya. Parse array `P` menjadi daftar id, name, url.
3. `add`: id, url, dan nama belum ada. Jika sudah ada: tanya pemilik, jangan menimpa.
4. Pastikan semua file terlindungi (daftar di `AGENTS.md`) ada di repositori.
5. Cloudflare (BACA saja): catat `modified_on` Worker `genstyle-7` sebagai T0. Pastikan script Worker memuat `SELECT product_id` dan TIDAK memuat `PLACEHOLDER`. Jika tidak: kondisi INSIDEN (lihat bawah), HENTI.
Gerbang G1: tidak ada duplikat, file terlindungi lengkap, Worker milik repositori.

## Fase 2 - PREPARE (lokal, belum menulis)
1. Foto: JPG, lebar maksimal 1000 px, kualitas sekitar 75, di bawah 150 KB, tanpa metadata. Nama `assets/<id>.jpg`.
2. Bentuk baris produk persis:
   `{id:"<id>",name:"<Nama>",meta:"",img:"assets/<id>.jpg",url:"<url>"},`
   `add`: sisipkan di paling atas array, tepat setelah `var P=[`.
3. Hitung perbedaan terhadap `products.js` lama:
   - `add`: tepat +1 baris, 0 baris dihapus.
   - `edit`: hanya baris produk itu yang berubah, `id` tetap.
   - `remove`: tepat -1 baris, foto dibiarkan.
4. Pastikan `products.js` baru tetap JS valid: tiap objek punya id, name, img, url; semua id unik; bagian `var B=[...]` tidak berubah.
Gerbang G2: perubahan hanya menyentuh `products.js` dan `assets/<id>.jpg`.

## Fase 3 - COMMIT (satu commit atomik)
1. Pastikan kepala `main` masih H0. Jika berubah, kembali ke Fase 1 (maksimal 3 kali, lalu HENTI dan laporkan).
2. Lewat Git Data API: buat blob foto (biner asli) -> pohon baru berisi `assets/<id>.jpg` dan `products.js` -> commit dengan induk H0 -> perbarui `heads/main` TANPA force.
3. Pesan commit baku:
```
Hermes: add product <Nama> (<id>)

Action: add
Product-ID: <id>
Image: assets/<id>.jpg
URL: <url>
```
Setelah commit, TIDAK ADA langkah deploy. Cloudflare membangun otomatis.

## Fase 4 - VERIFY
Poll tiap 15 detik, maksimal 5 menit. Semua harus lulus:
- V1: `modified_on` Worker `genstyle-7` lebih baru dari waktu commit (baca saja).
- V2: `GET /products.js` di situs live memuat id baru (`add`), tidak memuatnya (`remove`), atau memuat nilai baru (`edit`).
- V3: `GET /assets/<id>.jpg` -> 200, tipe `image/jpeg`, minimal 1 KB (`add` dan `edit` foto).
- V4: `GET /api/top` -> 200 dan JSON berbentuk `{"top":[...]}`.
- V5: `GET /` -> 200 dan memuat `style.css`, `products.js`, `app.js`.
- V6: script Worker (baca saja) masih memuat `SELECT product_id` dan tidak memuat `PLACEHOLDER`.
- V7: `GET /908941338_1795681146919699.mp4` -> 200 (video hero masih ada).
Gerbang G5: V1-V7 lulus. Jika waktu habis atau ada yang gagal -> Fase 5.

## Fase 5 - ROLLBACK (hanya jika VERIFY gagal)
Buat commit BARU yang memulihkan `products.js` ke isi di H0 dan menghapus foto yang baru ditambahkan. Dilarang force-push, reset, atau menyentuh Cloudflare. Setelah itu ulangi V1-V5, lalu laporkan sebagai GAGAL.

## Fase 6 - REPORT (selalu)
Laporan ke pemilik, dalam bahasa Indonesia:
```
Status: BERHASIL | GAGAL | DITOLAK | BERHENTI
Tindakan: tambah | ubah | hapus produk <Nama> (<id>)
Commit: <sha pendek> (atau "tidak ada")
Pemeriksaan: V1 ok/gagal, V2 ..., V7 ...
Total produk sekarang: <angka>
Catatan/langkah pemilik: <jika ada, mis. foto belum diunggah>
```

## Kondisi HENTI (jangan menulis, laporkan, tunggu pemilik)
- Permintaan menyentuh file terlindungi, tampilan, fitur, atau struktur website.
- Perlu menulis ke Cloudflare (script Worker, bindings, domain, build, database).
- id atau url duplikat; foto tidak ada atau bukan gambar valid.
- Lebih dari 5 produk dalam satu permintaan (pecah per 5 atau tanyakan).
- `main` terus berubah (3 kali gagal di Fase 3).
- INSIDEN: Worker `genstyle-7` terdeteksi bukan milik repositori (memuat `PLACEHOLDER`, tidak memuat `SELECT product_id`, atau `modified_on` berubah tanpa commit). Ciri: situs menampilkan gambar rusak, `/api/top` selalu kosong. Agen TIDAK boleh memperbaiki sendiri. Laporkan: "Worker ditimpa, perlu deploy ulang dari GitHub oleh pemilik".

## Penyimpanan hak akses (pengaman sebenarnya)
Aturan teks hanya menasihati; pengaman yang memaksa ada di token:
- Token Cloudflare untuk agen: hanya BACA (Workers Scripts: Read). Tanpa hak Edit.
- Token GitHub untuk agen: hanya repositori `Genstyle`, izin Contents: Read and write.

## Definisi selesai
Produk tampil di situs live, fotonya terbuka, `/api/top` normal, tidak ada file terlindungi yang berubah, Worker masih milik repositori, dan laporan sudah dikirim.
