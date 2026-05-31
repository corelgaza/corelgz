"use client";

import Link from "next/link";
import { useAdminInbox } from "./AdminInboxProvider";

function formatDateShort(iso: string): string {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function DashboardRecentMessages() {
  const { messages, unreadCount, loading } = useAdminInbox();
  const recent = messages.slice(0, 5);

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3 className="admin-card-title">Pesan Terbaru</h3>
        <Link href="/admin/messages" className="admin-link">
          Lihat semua
          {unreadCount > 0 && (
            <span className="admin-unread-pill" style={{ marginLeft: 8 }}>
              {unreadCount} baru
            </span>
          )}
        </Link>
      </div>
      {loading && recent.length === 0 ? (
        <div className="admin-empty">
          <p className="admin-muted">Memuat pesan…</p>
        </div>
      ) : recent.length === 0 ? (
        <div className="admin-empty">
          <p>Belum ada pesan masuk dari pengunjung.</p>
        </div>
      ) : (
        <div className="admin-list">
          {recent.map((m) => (
            <div
              key={m.id}
              className={`admin-list-item${m.is_read ? "" : " is-unread-item"}`}
            >
              <div className="admin-list-item-time">
                {formatDateShort(m.created_at)} ·{" "}
                <strong>{m.name ?? "Anon"}</strong>
                {!m.is_read && (
                  <span className="admin-unread-dot" aria-label="Belum dibaca" />
                )}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.message.length > 180
                  ? `${m.message.slice(0, 180)}…`
                  : m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
