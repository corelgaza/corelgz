"use client";

import { useMemo, useState } from "react";
import CoverImageField from "./CoverImageField";
import { useToast } from "./Toast";
import type { GalleryItemRow } from "@/lib/gallery";

type FormState = {
  src: string;
  alt: string;
  caption: string;
  is_published: boolean;
};

function emptyForm(): FormState {
  return { src: "", alt: "", caption: "", is_published: true };
}

export default function GalleryManager({
  initial,
}: {
  initial: GalleryItemRow[];
}) {
  const toast = useToast();
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm());
  const [busyId, setBusyId] = useState<string | null>(null);

  const sorted = useMemo(
    () =>
      [...items].sort(
        (a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at)
      ),
    [items]
  );

  const handleAdd = async () => {
    if (!form.src.trim()) {
      toast.push({ type: "error", title: "URL gambar wajib diisi" });
      return;
    }
    setBusyId("add");
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        item?: GalleryItemRow;
      };
      if (!res.ok || !data.item) {
        toast.push({
          type: "error",
          title: "Gagal menambah foto",
          description: data.error,
        });
        return;
      }
      setItems((prev) => [...prev, data.item!]);
      setForm(emptyForm());
      setShowAdd(false);
      toast.push({ type: "success", title: "Foto galeri ditambah" });
    } finally {
      setBusyId(null);
    }
  };

  const startEdit = (item: GalleryItemRow) => {
    setEditingId(item.id);
    setEditForm({
      src: item.src,
      alt: item.alt,
      caption: item.caption,
      is_published: item.is_published,
    });
  };

  const saveEdit = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        item?: GalleryItemRow;
      };
      if (!res.ok || !data.item) {
        toast.push({
          type: "error",
          title: "Gagal menyimpan",
          description: data.error,
        });
        return;
      }
      setItems((prev) => prev.map((i) => (i.id === id ? data.item! : i)));
      setEditingId(null);
      toast.push({ type: "success", title: "Foto diperbarui" });
    } finally {
      setBusyId(null);
    }
  };

  const moveItem = async (id: string, direction: "up" | "down") => {
    const idx = sorted.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const current = sorted[idx];
    const neighbor = sorted[swapIdx];
    setBusyId(id);

    try {
      const [resA, resB] = await Promise.all([
        fetch(`/api/admin/gallery/${current.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: neighbor.sort_order }),
        }),
        fetch(`/api/admin/gallery/${neighbor.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: current.sort_order }),
        }),
      ]);
      if (!resA.ok || !resB.ok) {
        toast.push({ type: "error", title: "Gagal mengubah urutan" });
        return;
      }
      setItems((prev) =>
        prev.map((i) => {
          if (i.id === current.id)
            return { ...i, sort_order: neighbor.sort_order };
          if (i.id === neighbor.id)
            return { ...i, sort_order: current.sort_order };
          return i;
        })
      );
    } finally {
      setBusyId(null);
    }
  };

  const togglePublish = async (item: GalleryItemRow) => {
    setBusyId(item.id);
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !item.is_published }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        item?: GalleryItemRow;
        error?: string;
      };
      if (!res.ok || !data.item) {
        toast.push({ type: "error", title: "Gagal update status" });
        return;
      }
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? data.item! : i))
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.push({ type: "error", title: "Gagal menghapus foto" });
        return;
      }
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.push({ type: "success", title: "Foto dihapus" });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="admin-toolbar">
        <p className="admin-muted">
          {items.length} foto · {items.filter((i) => i.is_published).length}{" "}
          tampil di website
        </p>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => setShowAdd((v) => !v)}
        >
          {showAdd ? "Batal" : "+ Tambah Foto"}
        </button>
      </div>

      {showAdd && (
        <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
          <h3 className="admin-card-title" style={{ marginBottom: "1rem" }}>
            Foto Baru
          </h3>
          <div className="admin-form-grid">
            <div className="admin-form-field admin-form-field-full">
              <label className="admin-label">Gambar</label>
              <CoverImageField
                value={form.src}
                onChange={(src) => setForm((f) => ({ ...f, src }))}
                uploadFolder="gallery"
              />
            </div>
            <div className="admin-form-field">
              <label className="admin-label">Alt text</label>
              <input
                className="admin-input"
                value={form.alt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, alt: e.target.value }))
                }
                placeholder="Deskripsi singkat gambar"
              />
            </div>
            <div className="admin-form-field">
              <label className="admin-label">Caption</label>
              <input
                className="admin-input"
                value={form.caption}
                onChange={(e) =>
                  setForm((f) => ({ ...f, caption: e.target.value }))
                }
                placeholder="Teks di bawah foto di galeri"
              />
            </div>
          </div>
          <div style={{ marginTop: "1rem", display: "flex", gap: 8 }}>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleAdd}
              disabled={busyId === "add"}
            >
              {busyId === "add" ? "Menyimpan..." : "Simpan Foto"}
            </button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <p style={{ fontSize: "2rem" }}>🖼️</p>
            <p>Belum ada foto galeri.</p>
            <p className="admin-muted">
              Tambah foto pondok — langsung muncul di homepage.
            </p>
          </div>
        </div>
      ) : (
        <div className="admin-gallery-grid">
          {sorted.map((item, idx) => (
            <div
              key={item.id}
              className={`admin-gallery-card${
                !item.is_published ? " is-hidden" : ""
              }`}
            >
              <div className="admin-gallery-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.alt || "Galeri"} />
                {!item.is_published && (
                  <span className="admin-gallery-hidden-badge">Draft</span>
                )}
              </div>

              {editingId === item.id ? (
                <div className="admin-gallery-edit">
                  <CoverImageField
                    value={editForm.src}
                    onChange={(src) =>
                      setEditForm((f) => ({ ...f, src }))
                    }
                    uploadFolder="gallery"
                  />
                  <input
                    className="admin-input"
                    value={editForm.alt}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, alt: e.target.value }))
                    }
                    placeholder="Alt text"
                  />
                  <input
                    className="admin-input"
                    value={editForm.caption}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, caption: e.target.value }))
                    }
                    placeholder="Caption"
                  />
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn-primary admin-btn-sm"
                      onClick={() => saveEdit(item.id)}
                      disabled={busyId === item.id}
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={() => setEditingId(null)}
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="admin-gallery-caption">
                    {item.caption || item.alt || "—"}
                  </p>
                  <div className="admin-gallery-actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={() => moveItem(item.id, "up")}
                      disabled={busyId === item.id || idx === 0}
                      title="Naikkan"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={() => moveItem(item.id, "down")}
                      disabled={
                        busyId === item.id || idx === sorted.length - 1
                      }
                      title="Turunkan"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={() => startEdit(item)}
                      disabled={busyId === item.id}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={() => togglePublish(item)}
                      disabled={busyId === item.id}
                    >
                      {item.is_published ? "Sembunyikan" : "Tampilkan"}
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={busyId === item.id}
                    >
                      Hapus
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
