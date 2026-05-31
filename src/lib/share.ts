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

export const SHARE_MESSAGES = {
  whatsapp: `Halo! 👋

Aku mau share *Santri Journey* — website personal tentang kehidupan santri di Pondok Pesantren Sukahideng.

✨ Isinya:
• Cerita & tips mondok buat pemula
• Artikel & galeri foto pondok
• Jadwal sholat & peta lokasi

Yuk kepoin:
${getShareUrl("whatsapp")}`,

  casual: `Bro/Lok, cek website santri journey-ku dong 🕌

Cerita mondok, tips betah pesantren, galeri, jadwal sholat — lengkap!

${getShareUrl("chat")}`,

  professional: `Halo, perkenalkan Santri Journey — website dokumentasi kehidupan santri di Pondok Pesantren Sukahideng, Tasikmalaya.

Berisi artikel edukatif, galeri, dan informasi pondok. Silakan kunjungi:
${getShareUrl("link")}`,

  instagram: `Website santri journey-ku sudah live 🌿

Cerita mondok · tips santri baru · artikel · galeri pondok

Link di bio / story 👇
${getShareUrl("instagram")}`,

  facebook: `Halo semua! 👋

Perkenalkan Santri Journey — website personal tentang kehidupan santri di Pondok Pesantren Sukahideng, Tasikmalaya.

✨ Isinya:
• Cerita & tips mondok buat pemula
• Artikel & galeri foto pondok
• Jadwal sholat & peta lokasi

Yuk kepoin:
${getShareUrl("facebook")}`,

  /** Link saja — untuk caption / bio / story sticker */
  link: getCleanShareUrl(),

  /** Caption lengkap Instagram (post / reel) */
  instagramCaption: `Website Santri Journey-ku sudah live! 🕌✨

Isinya cerita kehidupan santri di Pondok Pesantren Sukahideng:
📖 Artikel & tips mondok buat pemula
📸 Galeri foto pondok
🕌 Jadwal sholat & peta lokasi

Yuk kepoin 👇
${getCleanShareUrl()}

.
.
.
#santri #pesantren #mondok #santrijourney #pondokpesantren #tasikmalaya #sukahideng #kehidupansantri #generasihebat`,

  /** Caption pendek IG / bio link */
  instagramShort: `Santri Journey 🕌 — cerita mondok, tips pemula, artikel & galeri pondok.

👇 ${getCleanShareUrl()}`,
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
