import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/config";
import { listPublishedArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

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
      url: `${base}/artikel`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const articles = await listPublishedArticles();
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
