import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleContent from "@/components/ArticleContent";
import { getArticleBySlug } from "@/lib/articles";
import { getSiteUrl, getWhatsAppUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return {
      title: "Artikel tidak ditemukan",
      robots: { index: false, follow: false },
    };
  }
  const url = `${getSiteUrl()}/artikel/${article.slug}`;
  const title = article.meta_title || article.title;
  const description =
    article.meta_description ||
    article.excerpt ||
    "Artikel di Santri Journey.";

  return {
    title: `${title} · Santri Journey`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: article.published_at ?? undefined,
      modifiedTime: article.updated_at,
      authors: [article.author_name],
      images: article.cover_image
        ? [article.cover_image]
        : ["/images/pondok1.webp"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.cover_image
        ? [article.cover_image]
        : ["/images/pondok1.webp"],
    },
  };
}

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

export default async function ArtikelDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const url = `${getSiteUrl()}/artikel/${article.slug}`;
  const shareText = `${article.title}\n\n${url}`;
  const waShareUrl = getWhatsAppUrl(shareText);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt ?? "",
    image: article.cover_image
      ? [article.cover_image]
      : [`${getSiteUrl()}/images/pondok1.webp`],
    author: {
      "@type": "Person",
      name: article.author_name,
    },
    publisher: {
      "@type": "Organization",
      name: "Santri Journey",
      logo: {
        "@type": "ImageObject",
        url: `${getSiteUrl()}/images/logo.png`,
      },
    },
    datePublished: article.published_at,
    dateModified: article.updated_at,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <>
      <Navbar />
      <main>
        <article className="article-detail">
          <Link href="/artikel" className="article-back">
            ← Semua artikel
          </Link>
          {article.cover_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.cover_image}
              alt={article.title}
              className="article-detail-cover"
            />
          )}
          <div className="article-detail-meta">
            {formatDate(article.published_at)} · oleh {article.author_name}
          </div>
          <h1>{article.title}</h1>
          {article.excerpt && (
            <p className="article-detail-excerpt">{article.excerpt}</p>
          )}

          <div className="article-share">
            <a
              className="article-share-btn"
              href={waShareUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Share ke WhatsApp
            </a>
          </div>

          <ArticleContent content={article.content} />

          {article.tags.length > 0 && (
            <div
              className="article-card-tags"
              style={{ marginTop: "2.5rem" }}
            >
              {article.tags.map((t) => (
                <span key={t} className="article-tag">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
