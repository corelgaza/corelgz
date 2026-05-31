"use client";

import Link from "next/link";
import { useState } from "react";
import {
  getFacebookShareUrl,
  getShareMessage,
  getShareUrl,
  type ShareChannel,
} from "@/lib/share";
import { getWhatsAppUrl } from "@/lib/config";

const FEATURES = [
  "Cerita kehidupan santri",
  "Artikel & tips mondok",
  "Galeri foto pondok",
  "Jadwal sholat & lokasi",
] as const;

const CHANNELS: { id: ShareChannel; label: string; icon: string }[] = [
  { id: "whatsapp", label: "WhatsApp", icon: "💬" },
  { id: "facebook", label: "Facebook", icon: "📘" },
  { id: "casual", label: "Chat santai", icon: "✌️" },
  { id: "professional", label: "Formal", icon: "📋" },
  { id: "instagram", label: "Instagram", icon: "📸" },
];

export default function ShareLanding() {
  const [copied, setCopied] = useState<"link" | ShareChannel | null>(null);
  const shareUrl = getShareUrl("landing");

  const copyText = async (text: string, key: "link" | ShareChannel) => {
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
          Website personal yang isinya cerita mondok, tips untuk santri baru,
          artikel, galeri, jadwal sholat, dan peta lokasi pondok — dibangun
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
          <span>Pesan siap share ke temen</span>
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
