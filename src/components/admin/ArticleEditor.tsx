"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import MarkdownField from "./MarkdownField";
import TagInput from "./TagInput";
import PromptGenerator from "./PromptGenerator";
import CoverImageField from "./CoverImageField";
import type { ArticleRow } from "@/lib/articles";
import { useToast } from "./Toast";

type Mode = "create" | "edit";

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  tags: string[];
  meta_title: string;
  meta_description: string;
  status: "draft" | "published";
};

type AutoSaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

const AUTOSAVE_DELAY_MS = 2500;

function emptyState(): FormState {
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    tags: [],
    meta_title: "",
    meta_description: "",
    status: "draft",
  };
}

function fromArticle(a: ArticleRow): FormState {
  return {
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt ?? "",
    content: a.content ?? "",
    cover_image: a.cover_image ?? "",
    tags: a.tags ?? [],
    meta_title: a.meta_title ?? "",
    meta_description: a.meta_description ?? "",
    status: a.status,
  };
}

function autoSlug(s: string): string {
  return slugify(s, { lower: true, strict: true, trim: true, locale: "id" });
}

function snapshot(f: FormState): string {
  return JSON.stringify(f);
}

export default function ArticleEditor({
  mode,
  initial,
}: {
  mode: Mode;
  initial?: ArticleRow;
}) {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState<FormState>(
    initial ? fromArticle(initial) : emptyState()
  );
  const [articleId, setArticleId] = useState<string | undefined>(initial?.id);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [showSeo, setShowSeo] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] =
    useState<AutoSaveStatus>("idle");

  const lastSavedRef = useRef(snapshot(initial ? fromArticle(initial) : emptyState()));
  const manualSavingRef = useRef(false);
  const autoSavingRef = useRef(false);

  useEffect(() => {
    if (slugTouched) return;
    setForm((f) => ({ ...f, slug: autoSlug(f.title) }));
  }, [form.title, slugTouched]);

  const titleChars = form.title.length;
  const excerptChars = form.excerpt.length;
  const wordCount = useMemo(
    () => form.content.trim().split(/\s+/).filter(Boolean).length,
    [form.content]
  );

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const hasUnsavedChanges = snapshot(form) !== lastSavedRef.current;

  const performSave = useCallback(
    async (
      status: "draft" | "published",
      options?: { silent?: boolean; isAutosave?: boolean }
    ): Promise<boolean> => {
      if (!form.title.trim()) {
        if (!options?.silent) {
          toast.push({ type: "error", title: "Judul wajib diisi" });
        }
        return false;
      }

      const payload = {
        ...form,
        status: options?.isAutosave ? form.status : status,
      };

      const isCreate = !articleId;
      const url = isCreate
        ? "/api/admin/articles"
        : `/api/admin/articles/${articleId}`;
      const method = isCreate ? "POST" : "PATCH";

      if (options?.isAutosave) {
        autoSavingRef.current = true;
        setAutoSaveStatus("saving");
      } else {
        manualSavingRef.current = true;
        setSaving(true);
      }

      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          if (options?.isAutosave) {
            setAutoSaveStatus("error");
          } else {
            toast.push({
              type: "error",
              title: "Gagal menyimpan",
              description: data.error || "Coba lagi sebentar ya.",
            });
          }
          return false;
        }

        lastSavedRef.current = snapshot(form);

        if (options?.isAutosave) {
          setAutoSaveStatus("saved");
        } else {
          toast.push({
            type: "success",
            title:
              status === "published" ? "Artikel dipublish!" : "Draft tersimpan.",
          });
        }

        if (isCreate && data.article?.id) {
          setArticleId(data.article.id);
          router.replace(`/admin/articles/${data.article.id}/edit`);
        } else if (!options?.isAutosave) {
          router.refresh();
        }

        return true;
      } catch {
        if (options?.isAutosave) {
          setAutoSaveStatus("error");
        } else {
          toast.push({
            type: "error",
            title: "Tidak bisa menghubungi server",
          });
        }
        return false;
      } finally {
        if (options?.isAutosave) {
          autoSavingRef.current = false;
        } else {
          manualSavingRef.current = false;
          setSaving(false);
        }
      }
    },
    [articleId, form, router, toast]
  );

  useEffect(() => {
    if (!form.title.trim()) {
      setAutoSaveStatus("idle");
      return;
    }
    if (!hasUnsavedChanges) {
      setAutoSaveStatus("idle");
      return;
    }
    if (manualSavingRef.current || autoSavingRef.current) return;

    setAutoSaveStatus("pending");

    const timer = window.setTimeout(() => {
      if (manualSavingRef.current || autoSavingRef.current) return;
      void performSave("draft", { silent: true, isAutosave: true });
    }, AUTOSAVE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [form, hasUnsavedChanges, performSave]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedChanges]);

  const persist = (status: "draft" | "published") => {
    void performSave(status);
  };

  const handleDelete = async () => {
    if (!articleId) return;
    if (!confirm(`Hapus artikel "${form.title}"?`)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/articles/${articleId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.push({ type: "success", title: "Artikel dihapus" });
        router.replace("/admin/articles");
      } else {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        toast.push({
          type: "error",
          title: "Gagal menghapus",
          description: data.error || "Coba lagi sebentar ya.",
        });
        setSaving(false);
      }
    } catch {
      toast.push({ type: "error", title: "Tidak bisa menghapus" });
      setSaving(false);
    }
  };

  const publicUrl = form.slug ? `/artikel/${form.slug}` : "";

  const copyText = async (text: string, label: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.push({ type: "success", title: `${label} tersalin` });
    } catch {
      toast.push({ type: "error", title: `Gagal menyalin ${label}` });
    }
  };

  const autoSaveLabel =
    autoSaveStatus === "idle"
      ? null
      : {
          pending: "Perubahan belum disimpan…",
          saving: "Menyimpan otomatis…",
          saved: "Tersimpan otomatis",
          error: "Autosave gagal — simpan manual ya",
        }[autoSaveStatus];

  return (
    <div className="admin-editor-layout">
      <div className="admin-editor-main">
        <div className="admin-card">
          <div className="admin-autosave-bar">
            <span
              className={`admin-autosave-status admin-autosave-${autoSaveStatus}`}
            >
              {autoSaveLabel}
            </span>
          </div>

          <div className="admin-field">
            <label className="admin-label">
              Judul artikel{" "}
              <span className="admin-muted">({titleChars}/120)</span>
            </label>
            <input
              type="text"
              className="admin-input"
              value={form.title}
              maxLength={120}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Misal: Mengapa Ngaji Kitab Kuning Masih Relevan di Era TikTok"
            />
          </div>

          <div className="admin-field">
            <label className="admin-label">
              Slug URL{" "}
              <span className="admin-muted">(/artikel/{form.slug || "..."})</span>
            </label>
            <input
              type="text"
              className="admin-input"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                update("slug", autoSlug(e.target.value));
              }}
              placeholder="dibuat-otomatis-dari-judul"
            />
            {!slugTouched && form.slug && (
              <p className="admin-help">
                Otomatis dari judul. Klik untuk edit manual.
              </p>
            )}
            {form.slug && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 8,
                }}
              >
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={() => copyText(form.slug, "Slug")}
                  disabled={saving}
                >
                  Copy slug
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={() => copyText(publicUrl, "URL")}
                  disabled={saving}
                >
                  Copy URL
                </button>
                <a
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buka publik ↗
                </a>
              </div>
            )}
          </div>

          <div className="admin-field">
            <label className="admin-label">
              Excerpt / ringkasan kartu{" "}
              <span className="admin-muted">({excerptChars}/240)</span>
            </label>
            <textarea
              className="admin-textarea"
              rows={2}
              maxLength={240}
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              placeholder="1-2 kalimat yang muncul di kartu artikel di halaman /artikel"
            />
          </div>

          <div className="admin-field">
            <label className="admin-label">Cover image</label>
            <CoverImageField
              value={form.cover_image}
              onChange={(v) => update("cover_image", v)}
            />
          </div>

          <div className="admin-field">
            <label className="admin-label">Tags (max 12)</label>
            <TagInput value={form.tags} onChange={(t) => update("tags", t)} />
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Konten Artikel</h3>
            <span className="admin-muted" style={{ fontSize: "0.85rem" }}>
              {wordCount.toLocaleString("id-ID")} kata
            </span>
          </div>
          <MarkdownField
            value={form.content}
            onChange={(v) => update("content", v)}
            height={520}
          />
        </div>

        <div className="admin-card">
          <button
            type="button"
            onClick={() => setShowSeo((s) => !s)}
            className="admin-btn admin-btn-ghost"
            style={{ marginBottom: showSeo ? "1rem" : 0 }}
          >
            {showSeo ? "▾" : "▸"} SEO (opsional)
          </button>
          {showSeo && (
            <div>
              <div className="admin-field">
                <label className="admin-label">Meta title</label>
                <input
                  type="text"
                  className="admin-input"
                  value={form.meta_title}
                  maxLength={70}
                  onChange={(e) => update("meta_title", e.target.value)}
                  placeholder="Default: judul artikel"
                />
                <p className="admin-help">
                  Yang muncul di tab browser & Google. Max 70 karakter.
                </p>
              </div>
              <div className="admin-field">
                <label className="admin-label">Meta description</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  maxLength={160}
                  value={form.meta_description}
                  onChange={(e) => update("meta_description", e.target.value)}
                  placeholder="Default: excerpt artikel"
                />
                <p className="admin-help">
                  Deskripsi di hasil Google. Max 160 karakter.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="admin-card">
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => persist("draft")}
                disabled={saving}
                className="admin-btn admin-btn-ghost"
              >
                {saving ? "Menyimpan..." : "Simpan sebagai Draft"}
              </button>
              <button
                type="button"
                onClick={() => persist("published")}
                disabled={saving}
                className="admin-btn admin-btn-primary"
              >
                {form.status === "published" && articleId
                  ? "Update & Tetap Publish"
                  : "Publish Sekarang"}
              </button>
            </div>
            {articleId && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="admin-btn admin-btn-danger"
              >
                Hapus Artikel
              </button>
            )}
          </div>
        </div>
      </div>

      <aside className="admin-editor-sidebar">
        <PromptGenerator title={form.title} />
      </aside>
    </div>
  );
}
