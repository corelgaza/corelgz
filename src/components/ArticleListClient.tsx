"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ArticleSummary } from "@/lib/articles";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function uniqTags(articles: ArticleSummary[]): string[] {
  const s = new Set<string>();
  for (const a of articles) {
    for (const t of a.tags) s.add(t);
  }
  return Array.from(s).sort((a, b) => a.localeCompare(b));
}

export default function ArticleListClient({
  articles,
}: {
  articles: ArticleSummary[];
}) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string>("all");

  const tags = useMemo(() => uniqTags(articles), [articles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const tagOk = tag === "all" ? true : a.tags.includes(tag);
      if (!tagOk) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        (a.excerpt ?? "").toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [articles, query, tag]);

  return (
    <>
      <div className="article-toolbar">
        <div className="article-search">
          <input
            type="search"
            className="article-search-input"
            placeholder="Cari judul, tag, atau kata kunci..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {tags.length > 0 && (
          <div className="article-tags-filter" role="tablist" aria-label="Filter tag">
            <button
              type="button"
              className={`article-filter-chip${tag === "all" ? " is-active" : ""}`}
              onClick={() => setTag("all")}
            >
              Semua
            </button>
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                className={`article-filter-chip${tag === t ? " is-active" : ""}`}
                onClick={() => setTag(t)}
              >
                #{t}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="articles-empty">
          <p style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🔎</p>
          <p>Artikel tidak ditemukan. Coba kata kunci lain ya.</p>
        </div>
      ) : (
        <div className="articles-grid">
          {filtered.map((a) => (
            <Link key={a.id} href={`/artikel/${a.slug}`} className="article-card">
              {a.cover_image ? (
                <div className="article-card-cover">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.cover_image} alt={a.title} loading="lazy" />
                </div>
              ) : (
                <div className="article-card-cover empty">📖</div>
              )}
              <div className="article-card-body">
                <span className="article-card-meta">{formatDate(a.published_at)}</span>
                <h2 className="article-card-title">{a.title}</h2>
                {a.excerpt && <p className="article-card-excerpt">{a.excerpt}</p>}
                {a.tags.length > 0 && (
                  <div className="article-card-tags">
                    {a.tags.slice(0, 3).map((t) => (
                      <span key={t} className="article-tag">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

