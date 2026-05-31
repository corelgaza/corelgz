import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import PageViewTracker from "@/components/PageViewTracker";
import { getSiteUrl } from "@/lib/config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "600", "800"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Santri Journey: Sukahideng | Kehidupan di Pesantren",
  description:
    "Mengintip kehidupan sehari-hari, jadwal belajar, dan pengalaman unik di pesantren.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Santri Journey | Kehidupan Santri di Pesantren Sukahideng",
    description:
      "Cerita mondok, tips santri baru, artikel, galeri foto, jadwal sholat & peta lokasi — Pondok Pesantren Sukahideng, Tasikmalaya.",
    images: [
      {
        url: "/images/cover-hidup-di-pesantren.png",
        width: 1200,
        height: 630,
        alt: "Santri Journey — Sukahideng",
      },
    ],
    type: "website",
    siteName: "Santri Journey",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Santri Journey | Kehidupan Santri di Pesantren Sukahideng",
    description:
      "Cerita mondok, tips santri baru, artikel, galeri, jadwal sholat & peta lokasi pondok.",
    images: ["/images/cover-hidup-di-pesantren.png"],
  },
  other: {
    "theme-color": "#1B4332",
    "google-site-verification": "R7pGA2TNWEEzFRPxzGpxw--HJGKX_QDtOt-1R8JroTc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/images/hero-bg.jpg" as="image" />
      </head>
      <body className={`${inter.variable} ${lora.variable}`}>
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
}
