import { getSiteUrl } from "@/lib/config";

export const SHARE_PATH = "/share";

export function getShareUrl(utmSource = "share"): string {
  const base = getSiteUrl();
  return `${base}${SHARE_PATH}?utm_source=${utmSource}&utm_medium=social`;
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
} as const;

export type ShareChannel = keyof typeof SHARE_MESSAGES;

export function getShareMessage(channel: ShareChannel = "whatsapp"): string {
  return SHARE_MESSAGES[channel];
}
