"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  GALLERY_PREVIEW,
  SHOWCASE_ARTICLES,
  getArtikelUrl,
  getCleanShareUrl,
  getFacebookShareUrl,
  getHomeUrl,
  getShareMessage,
  getShareUrl,
  type ShareChannel,
} from "@/lib/share";
import { getWhatsAppUrl } from "@/lib/config";

const STATS = [
  { icon: "📖", value: "5", label: "Artikel" },
  { icon: "📸", value: "Galeri", label: "Foto pondok" },
  { icon: "🕌", value: "Live", label: "Jadwal sholat" },
] as const;

const QUICK_LINKS = [
  { id: "share", label: "Halaman share", getUrl: getCleanShareUrl },
  { id: "home", label: "Homepage", getUrl: getHomeUrl },
  { id: "artikel", label: "Semua artikel", getUrl: getArtikelUrl },
] as const;

const CHANNELS: { id: ShareChannel; label: string; icon: string }[] = [
  { id: "link", label: "Link saja", icon: "🔗" },
  { id: "update", label: "Update 5 artikel", icon: "🆕" },
  { id: "grupSantri", label: "Grup santri", icon: "👥" },
  { id: "rekomendasiArtikel", label: "Rekomendasi baca", icon: "📚" },
  { id: "instagramCaption", label: "Caption IG", icon: "📸" },
  { id: "instagramShort", label: "IG pendek", icon: "✨" },
  { id: "whatsapp", label: "WhatsApp", icon: "💬" },
  { id: "facebook", label: "Facebook", icon: "📘" },
  { id: "casual", label: "Chat santai", icon: "✌️" },
];

export default function ShareLanding() {
  const [copied, setCopied] = useState<
    "link" | ShareChannel | "share" | "home" | "artikel" | null
  >(null);
  const shareUrl = getCleanShareUrl();

  const copyText = async (
    text: string,
    key: "link" | ShareChannel | "share" | "home" | "artikel"
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="share-page">
      <div className="share-page-bg" aria-hidden="true" />
      <div className="share-card">
        <div className="share-hero">
          <Image
            src="/images/og-share.jpg"
            alt="Ilustrasi Pesantren Sukahideng"
            fill
            priority
            sizes="(max-width: 720px) 100vw, 680px"
            className="share-hero-img"
          />
          <div className="share-hero-overlay" />
          <div className="share-hero-content">
            <span className="share-badge">🕌 Santri Journey</span>
            <h1 className="share-hero-title">
              Kehidupan Santri di{" "}
              <span>Pondok Pesantren Sukahideng</span>
            </h1>
          </div>
        </div>

        <div className="share-card-body">
          <p className="share-lead">
            Website personal tentang mondok — <strong>5 artikel</strong>, galeri
            foto, jadwal sholat & peta lokasi. Dibangun dengan ❤️ oleh Corel.
          </p>

          <div className="share-stats">
            {STATS.map((s) => (
              <div key={s.label} className="share-stat">
                <span className="share-stat-icon">{s.icon}</span>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <div className="share-section-head">
            <h2>Artikel Terbaru</h2>
            <Link href="/artikel" className="share-section-link">
              Lihat semua →
            </Link>
          </div>

          <div className="share-artikel-scroll">
            {SHOWCASE_ARTICLES.map((a) => (
              <Link
                key={a.slug}
                href={`/artikel/${a.slug}`}
                className="share-artikel-card"
              >
                <div className="share-artikel-thumb">
                  <Image
                    src={a.cover}
                    alt={a.title}
                    fill
                    sizes="140px"
                    className="share-artikel-img"
                  />
                </div>
                <span className="share-artikel-title">{a.title}</span>
              </Link>
            ))}
          </div>

          <div className="share-gallery-row">
            {GALLERY_PREVIEW.map((g) => (
              <div key={g.src} className="share-gallery-thumb">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="120px"
                  className="share-gallery-img"
                />
              </div>
            ))}
          </div>

          <div className="share-actions">
            <Link href="/" className="btn-primary share-btn-main">
              Masuk ke Website →
            </Link>
            <button
              type="button"
              className="share-btn-copy"
              onClick={() => copyText(shareUrl, "link")}
            >
              {copied === "link" ? "✓ Link tersalin!" : "📋 Salin Link"}
            </button>
          </div>

          <div className="share-divider">
            <span>Gambar Status WhatsApp</span>
          </div>

          <div className="share-wa-preview">
            <a
              href="/images/wa-status-v3.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="share-wa-preview-img-wrap"
            >
              <Image
                src="/images/wa-status-v3.jpg"
                alt="Preview gambar status WhatsApp Santri Journey"
                width={180}
                height={320}
                className="share-wa-preview-img"
              />
            </a>
            <div className="share-wa-preview-text">
              <p>
                Download gambar vertikal buat Status WA. Temen bisa{" "}
                <strong>scan QR code</strong> untuk buka website.
              </p>
              <a
                href="/images/wa-status-v3.jpg"
                download="santri-journey-status-qr.jpg"
                className="share-status-download"
              >
                📥 Download Status WA
              </a>
            </div>
          </div>

          <div className="share-divider">
            <span>Link cepat</span>
          </div>

          <div className="share-quick-links">
            {QUICK_LINKS.map((item) => (
              <div key={item.id} className="share-quick-link-item">
                <span className="share-quick-link-label">{item.label}</span>
                <code className="share-quick-link-url">{item.getUrl()}</code>
                <button
                  type="button"
                  className="share-btn-copy share-quick-link-btn"
                  onClick={() => copyText(item.getUrl(), item.id)}
                >
                  {copied === item.id ? "✓ Tersalin!" : "Salin"}
                </button>
              </div>
            ))}
          </div>

          <div className="share-divider">
            <span>Caption & pesan siap copy</span>
          </div>

          <div className="share-link-box">
            <p className="share-link-box-label">
              Link website (bio IG / story sticker)
            </p>
            <code className="share-link-box-url">{shareUrl}</code>
            <button
              type="button"
              className="share-btn-copy share-link-box-btn"
              onClick={() => copyText(shareUrl, "link")}
            >
              {copied === "link" ? "✓ Link tersalin!" : "📋 Salin link"}
            </button>
          </div>

          <div className="share-channel-grid">
            {CHANNELS.map((ch) => (
              <button
                key={ch.id}
                type="button"
                className="share-channel-btn"
                onClick={() => copyText(getShareMessage(ch.id), ch.id)}
              >
                <span className="share-channel-icon">{ch.icon}</span>
                <span className="share-channel-label">
                  {copied === ch.id ? "Tersalin!" : ch.label}
                </span>
              </button>
            ))}
          </div>

          <div className="share-social-row">
            <a
              href={getWhatsAppUrl(getShareMessage("whatsapp"))}
              target="_blank"
              rel="noopener noreferrer"
              className="share-wa-btn"
            >
              Share ke WhatsApp 🚀
            </a>
            <a
              href={getFacebookShareUrl(getShareUrl("facebook"))}
              target="_blank"
              rel="noopener noreferrer"
              className="share-fb-btn"
            >
              Share ke Facebook 📘
            </a>
          </div>

          <p className="share-url-display">{shareUrl}</p>
          <p className="share-footer-note">
            Pondok Pesantren Sukahideng · Tasikmalaya
          </p>
        </div>
      </div>
    </div>
  );
}
