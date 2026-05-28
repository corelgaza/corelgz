import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleListClient from "@/components/ArticleListClient";
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
              <div className="articles-empty">
                <p style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📚</p>
                <p>Belum ada artikel yang dipublish. Cek lagi nanti ya!</p>
              </div>
            ) : (
              <ArticleListClient articles={articles} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
