import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
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
    title: "Santri Journey | Kehidupan Seru di Pesantren",
    description:
      "Kuy kepoin cerita seru, jadwal padat, dan galeri estetik gue selama mondok bareng temen-temen!",
    images: ["/images/pondok1.webp"],
    type: "website",
  },
  other: {
    "theme-color": "#1B4332",
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
        {children}
      </body>
    </html>
  );
}
