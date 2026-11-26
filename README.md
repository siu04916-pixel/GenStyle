# GenStyle - aturan pengelolaan

Baca ini sebelum mengubah apa pun (manusia maupun agen otomatis).

- Situs di-deploy OTOMATIS oleh Cloudflare setiap ada commit ke cabang `main` (Worker `genstyle-7`, konfigurasi di `wrangler.jsonc`).
- JANGAN men-deploy atau mengunggah script Worker `genstyle-7` secara langsung lewat API, wrangler, atau editor dashboard. Itu menimpa situs yang benar dengan versi rusak (gambar placeholder, video placeholder, tanpa database, halaman error).
- `worker.js` hanya berisi API klik (`/api/top`, `/api/click`) yang memakai database D1 `genstyle-clicks`. Jangan diganti dengan Worker yang menyajikan HTML.
- File situs: `index.html`, `style.css`, `responsive.css`, `app.js`, `products.js`. Semuanya disajikan langsung oleh Cloudflare Assets.
- Menambah produk: cukup edit `products.js` (id huruf kecil/angka/tanda minus, name, img, url). Taruh fotonya di repositori ini (misalnya folder `assets/`), jangan memakai data placeholder.
- Jangan ubah pengaturan Build, Deploy command, atau Bindings di dashboard Cloudflare.
