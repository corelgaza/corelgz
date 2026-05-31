"use client";

import { useState } from "react";
import { getWhatsAppUrl } from "@/lib/config";
import {
  buildAdminReplyTemplate,
  type ContactMessageRow,
} from "@/lib/messages";
import { useToast } from "./Toast";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function MessagesList({
  initial,
}: {
  initial: ContactMessageRow[];
}) {
  const toast = useToast();
  const [items, setItems] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const unreadCount = items.filter((m) => !m.is_read).length;

  const setRead = async (id: string, is_read: boolean) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        message?: ContactMessageRow;
        error?: string;
      };
      if (!res.ok || !data.message) {
        toast.push({ type: "error", title: "Gagal update status pesan" });
        return;
      }
      setItems((prev) =>
        prev.map((m) => (m.id === id ? data.message! : m))
      );
    } finally {
      setBusyId(null);
    }
  };

  const copyReply = async (message: ContactMessageRow) => {
    const text = buildAdminReplyTemplate(message);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(message.id);
      window.setTimeout(() => setCopiedId(null), 2000);
      if (!message.is_read) await setRead(message.id, true);
    } catch {
      toast.push({ type: "error", title: "Gagal menyalin teks" });
    }
  };

  const markAllRead = async () => {
    const unread = items.filter((m) => !m.is_read);
    for (const m of unread) {
      await setRead(m.id, true);
    }
  };

  return (
    <div>
      <div className="admin-toolbar">
        <p className="admin-muted">
          {items.length} pesan total
          {unreadCount > 0 && (
            <span className="admin-unread-pill">{unreadCount} belum dibaca</span>
          )}
        </p>
        {unreadCount > 0 && (
          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={markAllRead}
          >
            Tandai semua dibaca
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <p style={{ fontSize: "2rem" }}>💬</p>
            <p>Belum ada pesan dari pengunjung.</p>
            <p className="admin-muted">
              Pesan dari form di section #kontak akan muncul di sini.
            </p>
          </div>
        </div>
      ) : (
        <div className="admin-list">
          {items.map((m) => (
            <div
              key={m.id}
              className={`admin-card admin-message-card${
                m.is_read ? "" : " is-unread"
              }`}
            >
              <div className="admin-message-header">
                <div>
                  <strong>{m.name ?? "Pengunjung Anonim"}</strong>
                  {m.visitor_id && (
                    <span className="admin-message-id">{m.visitor_id}</span>
                  )}
                </div>
                <span className="admin-muted" style={{ fontSize: "0.8rem" }}>
                  {formatDate(m.created_at)}
                </span>
              </div>

              <p className="admin-message-body">{m.message}</p>

              <p className="admin-message-hint">
                Pengunjung mengirim lewat form kontak — cek chat WhatsApp kamu
                untuk percakapan aslinya.
              </p>

              <div className="admin-message-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={() => copyReply(m)}
                  disabled={busyId === m.id}
                >
                  {copiedId === m.id ? "✓ Tersalin!" : "Salin template balasan"}
                </button>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  style={{ textDecoration: "none" }}
                >
                  Buka WhatsApp
                </a>
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={() => setRead(m.id, !m.is_read)}
                  disabled={busyId === m.id}
                >
                  {m.is_read ? "Tandai belum dibaca" : "Tandai dibaca"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
