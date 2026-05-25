export const SITE_CONFIG = {
  name: "Santri Journey",
  subtitle: "Sukahideng",
  whatsapp: "6281388539152",
  instagram: "https://www.instagram.com/corellllpuln/",
  description:
    "Mengintip kehidupan sehari-hari, jadwal belajar, dan pengalaman unik di pesantren.",
  heroTypewriter:
    "Cerita seru, petualangan, dan secuil kisah gue selama mondok bareng temen-temen.",
} as const;

export function getWhatsAppUrl(text = ""): string {
  const base = `https://wa.me/${SITE_CONFIG.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** URL aman untuk metadata & OG — toleran format env di Vercel */
export function getSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    "http://localhost:3000",
  ];

  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    try {
      const withProtocol = /^https?:\/\//i.test(value)
        ? value
        : `https://${value}`;
      return new URL(withProtocol).origin;
    } catch {
      continue;
    }
  }

  return "http://localhost:3000";
}
