# Santri Journey — Next.js + Supabase

Website profil kehidupan santri di Pondok Pesantren Sukahideng, dibangun dengan **Next.js 15**, siap deploy ke **Vercel**, database **Supabase**.

## Struktur proyek

```
src/
  app/          # Halaman & API routes
  components/   # UI React
  data/         # Konten statis
  lib/          # Config, Supabase, galeri
public/
  images/       # Foto & hero
supabase/
  schema.sql    # Tabel database
legacy/         # Versi HTML lama (arsip)
```

## Mulai development

1. Install [Node.js LTS](https://nodejs.org/) (versi 20 atau 22). Centang **"Add to PATH"** saat instalasi.
2. **Tutup semua terminal di Cursor**, lalu buka terminal baru (atau restart Cursor).

### Cara termudah (Windows)

Di folder proyek, jalankan di PowerShell:

```powershell
cd c:\Users\USER\corelgz
.\install.ps1
.\dev.ps1
```

### Cara manual

```powershell
cd c:\Users\USER\corelgz
node -v
npm -v
npm install
npm run dev
```

### `npm` diblokir PowerShell (Execution Policy)?

Error: *running scripts is disabled on this system* → `npm.ps1` tidak bisa jalan.

**Solusi A (disarankan, sekali saja):**

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Atau jalankan: `powershell -ExecutionPolicy Bypass -File fix-npm.ps1`

**Solusi B (tanpa ubah policy):** pakai `npm.cmd` atau file `.bat`:

```powershell
npm.cmd -v
npm.cmd install
npm.cmd run dev
```

Atau double-click **`install.bat`** lalu **`dev.bat`**.

### `node` / `npm` tidak dikenali?

Node sudah terpasang tapi terminal lama belum dapat PATH. Pilih salah satu:

1. **Restart Cursor** (disarankan), atau
2. Jalankan dulu di terminal yang sama:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
node -v
```

3. Atau pakai skrip `.\install.ps1` / `.\dev.ps1` (otomatis refresh PATH).

### Error `npm install`?

| Pesan error | Solusi |
|-------------|--------|
| `'npm' is not recognized` | Install Node.js LTS, restart terminal/PC |
| `ERESOLVE` / peer dependency | Sudah ada `.npmrc` dengan `legacy-peer-deps=true` — jalankan `npm install` lagi |
| `EACCES` / permission | Jangan jalankan sebagai Administrator; hapus folder `node_modules` lalu `npm install` |
| Masih gagal | Hapus `node_modules` dan `package-lock.json`, lalu `npm install` |

Buka [http://localhost:3000](http://localhost:3000)

## Setup Supabase

1. Buat project di [supabase.com](https://supabase.com)
2. **SQL Editor** → jalankan isi `supabase/schema.sql`
3. Salin `.env.local.example` → `.env.local` dan isi URL + anon key
4. Restart `npm run dev`

Tanpa Supabase, situs tetap jalan (galeri pakai data fallback, form hanya buka WhatsApp).

## Deploy ke Vercel

### Opsi A — CLI (tanpa GitHub)

1. Login Vercel (sekali):

```powershell
cd c:\Users\USER\corelgz
npx vercel login
```

2. Deploy production:

```powershell
.\deploy-vercel.ps1
```

atau:

```powershell
npx vercel --prod
```

3. **Wajib:** di [Vercel Dashboard](https://vercel.com) → project → **Settings → Environment Variables**, tambahkan:

| Variable | Nilai |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | dari Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | key **anon public** |
| `SUPABASE_SERVICE_ROLE_KEY` | key **service_role** (secret) |
| `NEXT_PUBLIC_SITE_URL` | URL production, mis. `https://nama-project.vercel.app` |

4. **Redeploy** setelah env di-set: Deployments → ⋯ → Redeploy

### Opsi B — GitHub + Vercel (disarankan jangka panjang)

1. Push repo ke GitHub
2. [vercel.com/new](https://vercel.com/new) → Import repository
3. Tambahkan environment variables (tabel di atas)
4. Deploy otomatis setiap push

**Jangan** commit `.env.local` ke GitHub.

## Konfigurasi

| File | Fungsi |
|------|--------|
| `src/lib/config.ts` | Nama situs, nomor WhatsApp, Instagram |
| `src/data/site.ts` | Timeline, FAQ, testimoni, dll. |
| `public/images/` | Aset gambar |

## Scripts

- `npm run dev` — development
- `npm run build` — production build
- `npm run start` — jalankan build lokal
