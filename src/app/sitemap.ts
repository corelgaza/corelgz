import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/config";
import { listPublishedArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms)
    ),
  ]);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/share`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/artikel`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    // Google kadang fetch sitemap dari lokasi berbeda; kalau DB lambat/timeout,
    // kita fallback ke staticPages biar tetap 200 OK.
    const articles = await withTimeout(listPublishedArticles(), 2000);
    const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
      url: `${base}/artikel/${a.slug}`,
      lastModified: a.updated_at ? new Date(a.updated_at) : now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
    return [...staticPages, ...articlePages];
  } catch {
    return staticPages;
  }
}
