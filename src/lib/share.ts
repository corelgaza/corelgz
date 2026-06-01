import { getSiteUrl } from "@/lib/config";

export const SHARE_PATH = "/share";

export function getShareUrl(utmSource = "share"): string {
  const base = getSiteUrl();
  return `${base}${SHARE_PATH}?utm_source=${utmSource}&utm_medium=social`;
}

/** Link bersih tanpa UTM — untuk caption IG / bio */
export function getCleanShareUrl(): string {
  return `${getSiteUrl()}${SHARE_PATH}`;
}

export function getHomeUrl(): string {
  return getSiteUrl();
}

export function getArtikelUrl(): string {
  return `${getSiteUrl()}/artikel`;
}

/** Link artikel spesifik (untuk share rekomendasi) */
export function getArticleShareUrl(slug: string): string {
  return `${getSiteUrl()}/artikel/${slug}`;
}

export const FEATURED_ARTICLES = [
  {
    slug: "checklist-santri-baru-barang-wajib-mental-yang-harus-siap",
    label: "Checklist Santri Baru",
    cover: "/images/cover-checklist-santri-baru.png",
  },
  {
    slug: "kangen-rumah-pas-baru-mondok-normal-banget-ini-cara-kuat-adaptasi",
    label: "Kangen Rumah? Normal Banget",
    cover: "/images/cover-kangen-rumah-santri-baru.png",
  },
] as const;

/** Artikel untuk showcase di halaman /share */
export const SHOWCASE_ARTICLES = [
  {
    slug: "hidup-di-pesantren-itu-gimana-sih-cerita-singkat-buat-yang-baru-penasaran",
    title: "Hidup di Pesantren Gimana?",
    cover: "/images/cover-hidup-di-pesantren.png",
  },
  {
    slug: "10-tips-biar-betah-mondok-buat-santri-baru-versi-santai-tapi-kepake",
    title: "10 Tips Biar Betah Mondok",
    cover: "/images/cover-tips-betah.png",
  },
  {
    slug: "sehari-di-pesantren-dari-subuh-sampai-tidur-versi-santai-buat-pemula",
    title: "Sehari di Pesantren",
    cover: "/images/cover-rutinitas-harian.png",
  },
  {
    slug: "checklist-santri-baru-barang-wajib-mental-yang-harus-siap",
    title: "Checklist Santri Baru",
    cover: "/images/cover-checklist-santri-baru.png",
  },
  {
    slug: "kangen-rumah-pas-baru-mondok-normal-banget-ini-cara-kuat-adaptasi",
    title: "Kangen Rumah? Normal Banget",
    cover: "/images/cover-kangen-rumah-santri-baru.png",
  },
] as const;

export const GALLERY_PREVIEW = [
  { src: "/images/pondok1.webp", alt: "Ngaji bareng" },
  { src: "/images/pondok2.jpeg", alt: "Asrama pondok" },
  { src: "/images/gedung.jpg", alt: "Halaman asrama" },
] as const;

export const SHARE_MESSAGES = {
  whatsapp: `Halo! 👋

Aku mau share *Santri Journey* — website personal tentang kehidupan santri di Pondok Pesantren Sukahideng.

✨ Isinya sekarang:
• *5 artikel* (tips mondok, checklist santri baru, kangen rumah, dll)
• Galeri foto pondok
• Jadwal sholat & peta lokasi

Yuk kepoin:
${getShareUrl("whatsapp")}`,

  casual: `Bro/Lok, cek website santri journey-ku dong 🕌

Udah ada 5 artikel: tips betah, rutinitas harian, checklist santri baru, kangen rumah — plus galeri & jadwal sholat.

${getShareUrl("chat")}`,

  grupSantri: `Woy santriwati/santri 🔥

Aku bikin website *Santri Journey* — cerita mondok di Sukahideng. Isinya 5 artikel + galeri + jadwal sholat.

Buat yang baru mau mondok atau penasaran kehidupan pondok, cek aja:
${getShareUrl("grup")}`,

  update: `Update! Website *Santri Journey* makin lengkap 🕌✨

Sekarang udah *5 artikel*:
• Hidup di pesantren gimana?
• Tips biar betah mondok
• Rutinitas harian santri
• Checklist santri baru
• Kangen rumah pas baru mondok

Plus galeri, jadwal sholat & peta lokasi pondok.

Langsung buka:
${getShareUrl("update")}`,

  professional: `Halo, perkenalkan Santri Journey — website dokumentasi kehidupan santri di Pondok Pesantren Sukahideng, Tasikmalaya.

Berisi 5 artikel edukatif, galeri, jadwal sholat, dan peta lokasi. Silakan kunjungi:
${getShareUrl("link")}`,

  instagram: `Website Santri Journey-ku udah update! 🌿

5 artikel · galeri pondok · jadwal sholat

👉 Link ada di BIO (tap link di profilku)
Story: pakai sticker link ke ${getCleanShareUrl()}`,

  facebook: `Halo semua! 👋

*Santri Journey* — website personal tentang kehidupan santri di Pondok Pesantren Sukahideng.

✨ Sekarang ada *5 artikel*:
• Tips & cerita mondok buat pemula
• Checklist santri baru
• Cara kuat pas kangen rumah
• Galeri, jadwal sholat & peta lokasi

Yuk kepoin:
${getShareUrl("facebook")}`,

  /** Link saja — untuk caption / bio / story sticker */
  link: getCleanShareUrl(),

  /** Link homepage langsung */
  homeLink: getHomeUrl(),

  /** Link halaman artikel */
  artikelLink: getArtikelUrl(),

  /** Caption lengkap Instagram (post / reel) — arahkan ke bio */
  instagramCaption: `Website Santri Journey-ku udah update! 🕌✨

5 artikel kehidupan santri di Pondok Pesantren Sukahideng:
📖 Tips mondok & rutinitas harian
🎒 Checklist santri baru
💚 Cara kuat pas kangen rumah
📸 Galeri · jadwal sholat · peta lokasi

👉 Link ada di BIO ya (tap link di profilku)

.
.
.
#santri #pesantren #mondok #santrijourney #pondokpesantren #tasikmalaya #sukahideng #kehidupansantri #generasihebat`,

  /** Caption pendek IG / bio link */
  instagramShort: `Santri Journey 🕌 — 5 artikel mondok, galeri & jadwal sholat.

👉 Link ada di BIO`,

  /** Rekomendasi 2 artikel terbaru + link utama */
  rekomendasiArtikel: `Rekomendasi bacaan buat calon santri / santri baru 🕌

1️⃣ Checklist Santri Baru
${getArticleShareUrl(FEATURED_ARTICLES[0].slug)}

2️⃣ Kangen Rumah? Normal Banget
${getArticleShareUrl(FEATURED_ARTICLES[1].slug)}

Semua artikel + info pondok:
${getCleanShareUrl()}`,
} as const;

export type ShareChannel = keyof typeof SHARE_MESSAGES;

export function getShareMessage(channel: ShareChannel = "whatsapp"): string {
  return SHARE_MESSAGES[channel];
}

/** Buka dialog share Facebook (preview gambar dari Open Graph otomatis). */
export function getFacebookShareUrl(pageUrl?: string): string {
  const url = pageUrl ?? getShareUrl("facebook");
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}
