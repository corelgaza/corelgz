import type { Metadata } from "next";
import ShareLanding from "@/components/ShareLanding";
import { getSiteUrl } from "@/lib/config";

const title = "Santri Journey | Kehidupan Santri di Pesantren Sukahideng";
const description =
  "Website personal tentang kehidupan santri: cerita mondok, tips pemula, artikel, galeri, jadwal sholat & lokasi Pondok Pesantren Sukahideng.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${getSiteUrl()}/share` },
  openGraph: {
    title,
    description,
    url: `${getSiteUrl()}/share`,
    type: "website",
    siteName: "Santri Journey",
    locale: "id_ID",
    images: [
      {
        url: "/images/cover-hidup-di-pesantren.png",
        width: 1200,
        height: 630,
        alt: "Santri Journey — Kehidupan di Pesantren Sukahideng",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/cover-hidup-di-pesantren.png"],
  },
};

export default function SharePage() {
  return <ShareLanding />;
}
