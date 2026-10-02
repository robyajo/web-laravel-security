// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // === Konfigurasi deploy ===
  // Default ini untuk GitHub Pages *project site*:
  //   https://robyajo.github.io/laravel-security-monitor/
  // Jika target Anda berbeda:
  //   - GitHub Pages: sesuaikan 'base' dengan nama repo Anda.
  //   - Domain sendiri / Netlify / Vercel (root): hapus 'base' dan set 'site'
  //     ke domain Anda, mis. 'https://docs.contoh.com'.
  site: "https://robyajo.github.io",
  base: "/laravel-security-monitor",

  // Muat awal halaman tujuan saat tautan mulai terlihat (navigasi terasa instan).
  prefetch: true,

  // Pustaka mermaid diimpor dinamis (hanya di halaman berdiagram), sehingga
  // chunk-nya wajar besar; naikkan ambang peringatan agar build tetap bersih.
  vite: {
    build: { chunkSizeWarningLimit: 1600 },
  },

  integrations: [
    starlight({
      title: "Laravel Security Monitor",
      defaultLocale: "root",
      locales: {
        root: { label: "Bahasa Indonesia", lang: "id" },
      },
      description:
        "Dokumentasi resmi robyajo/laravel-security-monitor (Bulwark) — WAF mandiri, karantina perangkat, proteksi login bertingkat, CAPTCHA SVG, pemindai webshell, dan REST API headless untuk Laravel 10–13.",
      logo: { src: "./src/assets/logo.svg", alt: "Laravel Security Monitor" },
      favicon: "/favicon.svg",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/robyajo/laravel-security-monitor",
        },
      ],
      lastUpdated: true,
      pagination: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      customCss: ["./src/styles/custom.css"],
      components: {
        // Menyuntikkan skrip render Mermaid ke setiap halaman.
        Head: "./src/components/Head.astro",
      },
      expressiveCode: {
        // Shiki tidak mengenal bahasa "cron"; tampilkan sebagai bash agar tetap rapi.
        shiki: { langAlias: { cron: "bash" } },
      },
      sidebar: [
        {
          label: "Memulai",
          items: [{ autogenerate: { directory: "getting-started" } }],
        },
        {
          label: "Arsitektur Inti",
          items: [{ autogenerate: { directory: "core-architecture" } }],
        },
        {
          label: "Modul Keamanan",
          items: [{ autogenerate: { directory: "security-modules" } }],
        },
        {
          label: "Referensi REST API",
          items: [{ autogenerate: { directory: "api-reference" } }],
        },
        {
          label: "CLI & Otomasi",
          items: [{ autogenerate: { directory: "cli-automation" } }],
        },
        {
          label: "Hardening Web Server",
          items: [{ autogenerate: { directory: "webserver-hardening" } }],
        },
        {
          label: "Panduan Integrasi",
          items: [{ autogenerate: { directory: "integration-guides" } }],
        },
      ],
    }),
    sitemap(),
  ],
});
