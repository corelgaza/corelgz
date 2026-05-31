/** Gambar Open Graph khusus share (1200×630 — format Facebook & WhatsApp). */
export const OG_SHARE_IMAGE = {
  url: "/images/og-share.jpg",
  width: 1200,
  height: 630,
  alt: "Santri Journey — Kehidupan di Pesantren Sukahideng",
  type: "image/jpeg",
} as const;

export function ogImageMetadata() {
  return [
    {
      url: OG_SHARE_IMAGE.url,
      width: OG_SHARE_IMAGE.width,
      height: OG_SHARE_IMAGE.height,
      alt: OG_SHARE_IMAGE.alt,
      type: OG_SHARE_IMAGE.type,
    },
  ];
}
