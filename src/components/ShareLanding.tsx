"use client";

import Link from "next/link";
import { useState } from "react";
import {
  getArtikelUrl,
  getCleanShareUrl,
  getFacebookShareUrl,
  getHomeUrl,
  getShareMessage,
  getShareUrl,
  type ShareChannel,
} from "@/lib/share";
import { getWhatsAppUrl } from "@/lib/config";

const FEATURES = [
  "5 artikel tips & cerita mondok",
  "Checklist santri baru & kangen rumah",
  "Galeri foto pondok",
  "Jadwal sholat & peta lokasi",
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
        <div className="share-badge">🕌 Santri Journey</div>
        <h1 className="share-title">
          Kehidupan Santri di{" "}
          <span>Pondok Pesantren Sukahideng</span>
        </h1>
        <p className="share-lead">
          Website personal yang isinya <strong>5 artikel</strong> mondok, tips
          santri baru, galeri, jadwal sholat, dan peta lokasi pondok — dibangun
          dengan ❤️ oleh Corel.
        </p>

        <ul className="share-features">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>

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
          <span>Gambar Status WhatsApp (9:16)</span>
        </div>

        <div className="share-status-box">
          <p>
            Download gambar vertikal khusus Status WA. Temen bisa{" "}
            <strong>scan QR code</strong> di gambar untuk langsung buka website
            (link di gambar tidak bisa diklik — itu normal di Status WA).
          </p>
          <a
            href="/images/wa-status-v3.jpg"
            download="santri-journey-status-qr.jpg"
            className="share-status-download"
          >
            📥 Download Gambar Status WA (QR)
          </a>
          <p className="share-status-note">
            Kalau masih gambar lama, buka link ini langsung:{" "}
            <a href="/images/wa-status-v3.jpg" target="_blank" rel="noopener noreferrer">
              wa-status-v3.jpg
            </a>
          </p>
        </div>

        <div className="share-divider">
          <span>Link cepat (siap copy)</span>
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
          <p className="share-link-box-label">Link website (tempel di caption / bio IG)</p>
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
  );
}
