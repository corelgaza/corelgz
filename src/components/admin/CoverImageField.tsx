"use client";

import { useRef, useState } from "react";

export default function CoverImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const raw = await res.text();
      let data: { error?: string; url?: string } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        setError(
          res.ok
            ? "Respons server tidak valid"
            : `Upload gagal (${res.status}). Coba pakai path /images/... atau URL gambar.`
        );
        return;
      }
      if (!res.ok) {
        setError(data.error || "Upload gagal");
        return;
      }
      if (!data.url) {
        setError("Upload gagal: URL gambar tidak diterima");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Tidak bisa upload. Coba pakai path /images/... atau URL gambar.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="url"
        className="admin-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://... atau upload di bawah"
      />
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginTop: 8,
          flexWrap: "wrap",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          className="admin-btn admin-btn-ghost admin-btn-sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Mengupload..." : "📤 Upload gambar"}
        </button>
        {value && (
          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={() => onChange("")}
            disabled={uploading}
          >
            Hapus
          </button>
        )}
        <span className="admin-muted" style={{ fontSize: "0.78rem" }}>
          Max 5 MB · jpg/png/webp
        </span>
      </div>
      {error && (
        <div
          className="admin-alert admin-alert-error"
          style={{ marginTop: 8, fontSize: "0.85rem" }}
        >
          {error}
        </div>
      )}
      {value && (
        <div
          style={{
            marginTop: 12,
            border: "1px solid var(--admin-border)",
            borderRadius: 8,
            overflow: "hidden",
            background: "#fafafa",
            aspectRatio: "16 / 9",
            position: "relative",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onError={() => setError("Gambar tidak bisa dimuat dari URL itu")}
          />
        </div>
      )}
    </div>
  );
}
