"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ArticleSummary } from "@/lib/articles";
import { useToast } from "@/components/admin/Toast";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function ArticlesTable({
  initial,
  viewCounts = {},
}: {
  initial: ArticleSummary[];
  viewCounts?: Record<string, number>;
}) {
  const router = useRouter();
  const toast = useToast();
  const [items, setItems] = useState(initial);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [items, query]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}"? Aksi ini tidak bisa dibatalkan.`))
      return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        toast.push({
          type: "error",
          title: "Gagal menghapus",
          description: data.error || "Coba lagi sebentar ya.",
        });
        return;
      }
      setItems((prev) => prev.filter((a) => a.id !== id));
      toast.push({ type: "success", title: "Artikel dihapus" });
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleStatus = async (id: string, current: string) => {
    const next = current === "published" ? "draft" : "published";
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        toast.push({
          type: "error",
          title: "Gagal update status",
          description: data.error || "Coba lagi sebentar ya.",
        });
        return;
      }
      router.refresh();
      setItems((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: next,
                published_at:
                  next === "published"
                    ? a.published_at ?? new Date().toISOString()
                    : null,
              }
            : a
        )
      );
      toast.push({
        type: "success",
        title: next === "published" ? "Artikel dipublish" : "Jadi draft",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <div className="admin-toolbar">
        <div className="admin-search">
          <input
            type="search"
            className="admin-input"
            placeholder="Cari judul, slug, atau tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-wrapper">
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <p style={{ fontSize: "2rem" }}>📝</p>
            <p>Belum ada artikel.</p>
            <p>
              <Link href="/admin/articles/new" className="admin-link">
                Buat artikel pertama
              </Link>
            </p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Status</th>
                <th>Views</th>
                <th>Tags</th>
                <th>Diperbarui</th>
                <th style={{ width: 1 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="admin-link"
                    >
                      {a.title}
                    </Link>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      /{a.slug}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`admin-badge ${
                        a.status === "published"
                          ? "admin-badge-published"
                          : "admin-badge-draft"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-published">
                      {(viewCounts[a.slug] ?? 0).toLocaleString("id-ID")}
                    </span>
                  </td>
                  <td>
                    {a.tags.length > 0 ? (
                      <span style={{ fontSize: "0.85rem" }}>
                        {a.tags.slice(0, 3).join(", ")}
                        {a.tags.length > 3 ? ` +${a.tags.length - 3}` : ""}
                      </span>
                    ) : (
                      <span className="admin-muted">—</span>
                    )}
                  </td>
                  <td
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    {formatDate(a.updated_at)}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(a.id, a.status)}
                        disabled={busyId === a.id}
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        title={
                          a.status === "published"
                            ? "Jadikan draft"
                            : "Publish"
                        }
                      >
                        {a.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(a.id, a.title)}
                        disabled={busyId === a.id}
                        className="admin-btn admin-btn-danger admin-btn-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
