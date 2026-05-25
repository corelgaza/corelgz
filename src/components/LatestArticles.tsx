import Link from "next/link";
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

export default function LatestArticles({
  articles,
}: {
  articles: ArticleSummary[];
}) {
  if (articles.length === 0) return null;

  return (
    <section className="articles-section bg-light" id="artikel">
      <div className="container">
        <h2 className="section-title reveal">Artikel Terbaru</h2>
        <p className="section-subtitle reveal">
          Cerita & refleksi seputar kehidupan santri. Update tiap ada hal seru!
        </p>
        <div className="articles-grid">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/artikel/${a.slug}`}
              className="article-card reveal"
            >
              {a.cover_image ? (
                <div className="article-card-cover">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.cover_image} alt={a.title} loading="lazy" />
                </div>
              ) : (
                <div className="article-card-cover empty">📖</div>
              )}
              <div className="article-card-body">
                <span className="article-card-meta">
                  {formatDate(a.published_at)}
                </span>
                <h3 className="article-card-title">{a.title}</h3>
                {a.excerpt && (
                  <p className="article-card-excerpt">{a.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/artikel" className="btn-primary">
            Lihat Semua Artikel →
          </Link>
        </div>
      </div>
    </section>
  );
}
