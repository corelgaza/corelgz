import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { listPublishedArticles } from "@/lib/articles";
import { getSiteUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artikel · Santri Journey",
  description:
    "Kumpulan tulisan & cerita seputar kehidupan santri di Pondok Pesantren Sukahideng — pengalaman, tips, dan refleksi.",
  alternates: { canonical: `${getSiteUrl()}/artikel` },
  openGraph: {
    title: "Artikel · Santri Journey",
    description:
      "Kumpulan tulisan & cerita seputar kehidupan santri di Pondok Pesantren Sukahideng.",
    url: `${getSiteUrl()}/artikel`,
    type: "website",
  },
};

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

export default async function ArtikelPage() {
  const articles = await listPublishedArticles();

  return (
    <>
      <Navbar />
      <main>
        <section className="articles-section" id="artikel-list">
          <div className="container" style={{ paddingTop: "5rem" }}>
            <h1 className="section-title reveal active">Artikel</h1>
            <p className="section-subtitle reveal active">
              Cerita, refleksi, dan tips seputar kehidupan santri di Pondok
              Pesantren Sukahideng.
            </p>

            {articles.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem 1rem",
                  color: "var(--clr-text-muted)",
                }}
              >
                <p style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
                  📚
                </p>
                <p>Belum ada artikel yang dipublish. Cek lagi nanti ya!</p>
              </div>
            ) : (
              <div className="articles-grid">
                {articles.map((a) => (
                  <Link
                    key={a.id}
                    href={`/artikel/${a.slug}`}
                    className="article-card"
                  >
                    {a.cover_image ? (
                      <div className="article-card-cover">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={a.cover_image}
                          alt={a.title}
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="article-card-cover empty">📖</div>
                    )}
                    <div className="article-card-body">
                      <span className="article-card-meta">
                        {formatDate(a.published_at)}
                      </span>
                      <h2 className="article-card-title">{a.title}</h2>
                      {a.excerpt && (
                        <p className="article-card-excerpt">{a.excerpt}</p>
                      )}
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
