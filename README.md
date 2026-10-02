# Dokumentasi Laravel Security Monitor (Astro + Starlight)

Situs dokumentasi resmi untuk paket
[`robyajo/laravel-security-monitor`](../README.md), dibangun dengan **Astro** dan
tema **[Starlight](https://starlight.astro.build)**.

> ℹ️ Folder `web/` **tidak disertakan** saat paket dipasang lewat Composer
> (`export-ignore` pada `.gitattributes` + `archive.exclude` pada `composer.json`).
> Ini murni aset pengembangan/situs, bukan bagian dari runtime paket.

---

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:4321
```

## Perintah

| Perintah                     | Fungsi                                               |
| :--------------------------- | :--------------------------------------------------- |
| `npm run dev`                | Server pengembangan (hot reload)                     |
| `npm run build`              | Build statis ke `dist/`                              |
| `npm run preview`            | Pratinjau hasil build secara lokal                   |
| `node scripts/sync-docs.mjs` | Sinkronkan `../documents/*.md` → `src/content/docs/` |

---

## Sumber Konten

Bab Markdown di `../documents/<section>/NN-*.md` adalah **sumber tunggal
(single source of truth)**. Skrip `scripts/sync-docs.mjs` menyalinnya ke
`src/content/docs/` sekaligus:

- membersihkan slug (menghapus awalan nomor, mis. `01-introduction` → `introduction`),
- memindahkan H1 pertama ke frontmatter `title` (agar tidak tampil ganda),
- menambahkan `description` (untuk SEO) dan `sidebar.order`.

Setelah mengubah berkas di `../documents/`, jalankan ulang:

```bash
node scripts/sync-docs.mjs
npm run build
```

> Halaman `src/content/docs/index.mdx` (landing) dan `404.md` ditulis manual dan
> **tidak disentuh** oleh skrip sinkronisasi.

---

## Struktur

```
web/
├── astro.config.mjs            # konfigurasi Starlight (sidebar, locale id, logo, sitemap)
├── nginx.conf                  # contoh konfigurasi deploy ke VPS (akar domain)
├── scripts/
│   └── sync-docs.mjs           # generator konten dari ../documents
├── public/
│   └── favicon.svg
└── src/
    ├── assets/logo.svg
    ├── components/
    │   └── Head.astro          # override <head>: menyuntikkan skrip Mermaid
    ├── scripts/
    │   └── mermaid.ts          # render diagram Mermaid (impor dinamis)
    ├── styles/custom.css       # branding & gaya diagram
    ├── content.config.ts       # koleksi docs + i18n
    ├── content/i18n/id.json    # override string UI Indonesia
    └── content/docs/
        ├── index.mdx           # landing (splash)
        ├── 404.md              # halaman 404 kustom
        ├── getting-started/    # 3 bab
        ├── core-architecture/  # 4 bab
        ├── security-modules/   # 6 bab
        ├── api-reference/      # 4 bab
        ├── cli-automation/     # 2 bab
        ├── webserver-hardening/# 3 bab
        └── integration-guides/ # 3 bab
```

---

## Fitur

- **Pencarian instan** (Pagefind) — indeks dibangun otomatis saat `build`.
- **Diagram Mermaid** dirender otomatis; pustaka `mermaid` diimpor dinamis
  sehingga hanya diunduh pada halaman yang benar-benar memuat diagram.
- **Tema terang/gelap**, daftar isi (ToC), navigasi sebelumnya/berikutnya, dan
  sitemap.
- **UI berbahasa Indonesia** (`defaultLocale: 'id'`).
- **Navigasi cepat** dengan `prefetch`.

---

## Deploy

Hasil `npm run build` adalah situs statis di `dist/`. Proyek ini adalah repo
terpisah dan disajikan di **akar domainnya sendiri** (tanpa `base`), mis.
`https://docs.example.com/`.

Sesuaikan `site` pada `astro.config.mjs` dengan domain Anda (dipakai untuk tag
canonical dan `sitemap-index.xml`), lalu build ulang.

### Ke VPS (Nginx)

Contoh konfigurasi siap pakai ada di [`nginx.conf`](./nginx.conf). Ringkasnya:

```bash
# 1) Lokal
npm ci && npm run build

# 2) Unggah
rsync -a --delete dist/ user@<vps>:/var/www/laravel-security-monitor-docs/

# 3) VPS
sudo cp nginx.conf /etc/nginx/sites-available/laravel-security-monitor-docs
sudo ln -s /etc/nginx/sites-available/laravel-security-monitor-docs /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d docs.example.com   # TLS Let's Encrypt
```

Situs juga bisa diunggah ke GitHub Pages, Netlify, Vercel, atau Cloudflare
Pages. Untuk hosting pada sub-path (mis. `https://example.com/docs/`), set
`base: '/docs'` di `astro.config.mjs` dan sesuaikan `nginx.conf`.
