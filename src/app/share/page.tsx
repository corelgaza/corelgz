import type { Metadata } from "next";
import ShareLanding from "@/components/ShareLanding";
import { getSiteUrl } from "@/lib/config";
import { ogImageMetadata } from "@/lib/og";

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
    images: ogImageMetadata(),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og-share.jpg"],
  },
};

export default function SharePage() {
  return <ShareLanding />;
}
