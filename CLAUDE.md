# 🏛️ Kota Kediri — Web Parallax Project

## Identitas Project
- **Nama Project**: Website Wisata & Budaya Kota Kediri
- **Tujuan**: Menampilkan keindahan, sejarah, dan kehangatan Kota Kediri lewat pengalaman web immersive
- **Stack Utama**: Next.js (App Router) + Three.js
- **Target Device**: Desktop-first, dengan fallback graceful di mobile

---

## Tech Stack & Versi

- **Framework**: Next.js (App Router) — gunakan `app/` directory, bukan `pages/`
- **3D / Parallax Engine**: Three.js — untuk efek depth, partikel, dan layer parallax
- **Styling**: Tailwind CSS + CSS Modules untuk komponen spesifik
- **Animasi**: GSAP (ScrollTrigger) untuk orchestrasi scroll-based animation
- **Font**: Google Fonts atau Fontsource — hindari Inter/Roboto/Arial
- **Package Manager**: pnpm (BUKAN npm atau yarn)
- **Node**: >= 18.x

---

## Arsitektur Folder

```
/app
  /page.tsx              ← Entry point utama
  /layout.tsx            ← Root layout (font, metadata)
  /sections/             ← Tiap section parallax dipisah
    HeroSection.tsx
    GapuraSection.tsx
    SejarahSection.tsx
    ...
/components
  /parallax/             ← Komponen parallax reusable
  /ui/                   ← Tombol, card, typography
  /three/                ← Semua Three.js scene & mesh
/hooks
  useScrollProgress.ts   ← Custom hook progress scroll
  useParallax.ts         ← Hook parallax universal
  useThreeScene.ts       ← Hook setup Three.js
/public
  /assets
    /images/
      gapura-kiri.png    ← Gapura sisi kiri (foreground layer)
      gapura-kanan.png   ← Gapura sisi kanan (foreground layer)
      awan-putih.png     ← Awan dekat, solid, layer tengah
      mega.png           ← Awan jauh / mega langit, transparan, layer belakang
    /textures/           ← Texture Three.js
    /fonts/
  /frames/
    ezgif-frame-001.jpg  ← Frame pertama loading sequence
    ...
    ezgif-frame-240.jpg  ← Frame terakhir loading sequence
/styles
  globals.css
  variables.css          ← CSS custom properties (warna, spacing)
```

---

## Asset Manifest

### Daftar Aset Resmi
Semua nama file aset sudah ditetapkan — **JANGAN** rename atau buat nama alternatif.

| File | Lokasi | Digunakan untuk |
|------|--------|-----------------|
| `gapura-kiri.png` | `/public/assets/images/` | Layer gapura sisi kiri |
| `gapura-kanan.png` | `/public/assets/images/` | Layer gapura sisi kanan |
| `awan-putih.png` | `/public/assets/images/` | Layer awan dekat (solid, besar) |
| `mega.png` | `/public/assets/images/` | Layer awan jauh (transparan, kecil) |
| `ezgif-frame-[001-240].jpg` | `/public/frames/` | Loading screen image sequence |

### Aturan Penggunaan Aset
- Selalu import aset gambar via path string `/assets/images/nama-file.png` (bukan relative import)
- Untuk `next/image`: gunakan `src="/assets/images/gapura-kiri.png"`
- Untuk Three.js `TextureLoader`: gunakan path yang sama
- `gapura-kiri.png` harus di-render **sedikit lebih besar** dari `gapura-kanan.png` (scale ~1.05–1.1x) untuk efek perspektif
- `mega.png` gunakan `opacity: 0.6–0.8` — jangan solid penuh
- `awan-putih.png` gunakan `opacity: 0.9–1.0` — ini layer depan

---

## Aturan Parallax & Animasi

### Layer System
Setiap section parallax harus punya layer dengan speed factor berikut:

| Layer | Elemen | Asset | Speed Factor |
|-------|--------|-------|-------------|
| 0 | Background langit (gradient) | CSS gradient | `0` — diam total |
| 1 | Awan jauh / mega | `mega.png` | `0.2` |
| 2 | Awan dekat | `awan-putih.png` | `0.4` |
| 3 | Gapura kiri | `gapura-kiri.png` | `0.7` |
| 3 | Gapura kanan | `gapura-kanan.png` | `0.7` |
| 4 | Ornamen ground / foreground | SVG ornamen | `0.9` |
| 5 | Teks konten | — | `1` — normal scroll |

### Aturan Wajib Animasi
- **SELALU** gunakan `transform: translateY()` atau `transform3d()` — JANGAN gunakan `top`, `left`, `margin` untuk animasi
- **SELALU** tambahkan `will-change: transform` pada elemen yang dianimasi
- Gunakan `requestAnimationFrame` atau `ScrollTrigger` dari GSAP — jangan `scroll` event listener langsung
- Semua animasi masuk/keluar section harus ada `ease` — jangan linear
- Teks harus **fade-in dari bawah** (`translateY(30px) → 0` + `opacity: 0 → 1`) saat section pertama kali muncul

### Three.js Rules
- Semua Three.js scene dibuat di dalam `useEffect` dengan cleanup `renderer.dispose()`
- Gunakan `ResizeObserver` untuk handle resize canvas
- Partikel debu/cahaya boleh pakai `Points` dengan `BufferGeometry`
- Jangan pakai `OrbitControls` di production scene — hanya untuk dev/debug

---

## Desain & UI

### Palet Warna (CSS Variables)
```css
--color-langit-siang: #4A90D9;
--color-langit-senja: #C4813A;
--color-langit-malam: #1A1A2E;
--color-emas: #D4A017;
--color-emas-muda: #F0C040;
--color-teks-utama: #FFFFFF;
--color-teks-bayangan: rgba(0,0,0,0.6);
--color-gapura-gelap: #8B4513;
--color-ornamen: #C8860A;
```

### Typography
- **Judul Utama** (`Kota Kediri`): Font display, berkarakter Jawa/klasik — contoh: `Cinzel`, `Playfair Display`, atau `Noto Serif`
- **Subtitle kecil** (`✦ Selamat Datang di ✦`): Font serif tipis, spasi lebar (letter-spacing: 0.3em)
- **Body / deskripsi**: Font sans-serif clean, ukuran kecil, weight ringan
- **DILARANG**: Inter, Roboto, Arial, system-ui sebagai font display

### Aturan Visual
- Selalu tambahkan `text-shadow` pada teks di atas background terang
- Gapura kiri sedikit lebih besar dari kanan untuk menciptakan kesan perspektif
- Awan minimal 2 layer (jauh & dekat) dengan opacity berbeda
- Gunakan `mix-blend-mode: multiply` atau `overlay` untuk overlay warna langit
- Border/ornamen bawah section boleh pakai motif ukiran Jawa (SVG)

---

## Konvensi Kode

### Naming
- **Komponen**: PascalCase (`HeroSection.tsx`, `GapuraLayer.tsx`)
- **Hook**: camelCase dengan prefix `use` (`useScrollProgress.ts`)
- **CSS Modules**: camelCase (`styles.heroWrapper`)
- **Konstanta**: UPPER_SNAKE_CASE (`PARALLAX_SPEED_FACTOR`)
- **Fungsi utility**: camelCase (`calculateParallaxOffset`)

### TypeScript
- **SELALU** gunakan TypeScript — tidak boleh ada `any` kecuali dengan komentar alasan
- Props wajib punya interface/type yang eksplisit
- Gunakan `const` assertion untuk data statis parallax layer

### Komponen
- Tiap section parallax adalah komponen tersendiri
- Pisahkan logic (hooks) dari presentasi (JSX)
- Jangan taruh Three.js scene langsung di dalam JSX — encapsulate di custom hook

---

## Performance Rules

- Gunakan `next/image` untuk SEMUA gambar — wajib set `priority` pada hero image
- Lazy load section yang belum terlihat dengan `IntersectionObserver`
- Three.js renderer harus di-dispose saat komponen unmount
- **Mobile**: Disable Three.js parallax, gunakan `background-attachment: scroll` sebagai fallback
- Cek `window.matchMedia('(prefers-reduced-motion: reduce)')` — kalau true, skip semua animasi scroll
- Target Lighthouse score: Performance > 85, LCP < 2.5s

---

## SEO & Metadata

```tsx
// app/layout.tsx — wajib ada ini
export const metadata = {
  title: 'Kota Kediri — Temukan Keindahan & Sejarahnya',
  description: 'Temukan keindahan, sejarah, dan kehangatan Kota Kediri — kota yang selalu punya cerita untukmu.',
  openGraph: {
    title: 'Kota Kediri',
    description: '...',
    images: ['/og-image.jpg'],
  }
}
```

---

## Hal yang DILARANG (Never Do)

- ❌ Jangan gunakan `jquery` atau library animasi lawas
- ❌ Jangan animasi pakai `top`, `left`, `width`, `height` — selalu pakai `transform`
- ❌ Jangan buat Three.js scene tanpa cleanup `dispose()`
- ❌ Jangan hardcode warna langsung di komponen — pakai CSS variables
- ❌ Jangan pakai `pages/` directory — ini Next.js App Router
- ❌ Jangan import Three.js di Server Component — wajib `'use client'`
- ❌ Jangan pakai font Inter/Roboto/Arial sebagai display font
- ❌ Jangan skip `alt` attribute pada gambar

---

## Referensi Desain

- **Tema visual**: Gapura/candi khas Kediri, langit gradien senja-biru, awan dramatis
- **Mood**: Megah, hangat, bersejarah tapi modern
- **Inspirasi**: Loading scene → langit kosong → gapura naik perlahan → teks fade in → scroll ke section berikutnya
- **Ornamen**: Motif ukiran Jawa Timur, warna emas, border geometris tradisional

---

## Commands Penting

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm lint         # ESLint check
pnpm type-check   # TypeScript check tanpa build
```