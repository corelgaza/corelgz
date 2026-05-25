"use client";

import { useState } from "react";
import { getWhatsAppUrl } from "@/lib/config";
import {
  formatContactForWhatsApp,
  getVisitorId,
} from "@/lib/visitor";
import Reveal from "./Reveal";

export default function Contact() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;

    const visitorId = getVisitorId();
    const waText = formatContactForWhatsApp(visitorId, text);

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          message: text,
        }),
      });
      const data = (await res.json()) as { waUrl?: string; ok?: boolean };
      const waUrl = data.waUrl ?? getWhatsAppUrl(waText);
      window.open(waUrl, "_blank", "noopener,noreferrer");
      setMessage("");
    } catch {
      window.open(getWhatsAppUrl(waText), "_blank", "noopener,noreferrer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="kontak" className="contact bg-light">
      <div className="container">
        <h2 className="section-title reveal">Kirim Pesan</h2>
        <p className="section-subtitle reveal">
          Ada pertanyaan atau sekadar mau say hi? Tulis pesanmu di sini!
        </p>
        <Reveal>
          <form id="contact-form" className="reveal" onSubmit={handleSubmit}>
            <div className="form-group">
              <textarea
                id="message"
                rows={5}
                placeholder="Tulis pesanmu langsung di sini..."
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Membuka WhatsApp... ⏳" : "Kirim ke WhatsApp 🚀"}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
