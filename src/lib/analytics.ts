import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export type PageViewStats = {
  today: number;
  last7Days: number;
  allTime: number;
  topPages: { path: string; views: number }[];
  dailyLast7: { day: string; views: number }[];
};

export type ArticleViewStat = {
  slug: string;
  title: string;
  views: number;
  status: string;
};

function startOfTodayJakarta(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "01";
  return `${get("year")}-${get("month")}-${get("day")}T00:00:00+07:00`;
}

export async function recordPageView(
  path: string,
  sessionKey?: string | null
): Promise<void> {
  const supabase = createAdminClient();
  if (!supabase) return;

  await supabase.from("page_views").insert({
    path,
    session_key: sessionKey ?? null,
  });
}

export async function getPageViewStats(): Promise<PageViewStats | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const todayStart = startOfTodayJakarta();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [todayRes, weekRes, allRes, topRes, dailyRes] = await Promise.all([
    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .gte("viewed_at", todayStart),
    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .gte("viewed_at", sevenDaysAgo),
    supabase.from("page_views").select("id", { count: "exact", head: true }),
    supabase
      .from("page_views")
      .select("path")
      .gte("viewed_at", sevenDaysAgo)
      .limit(3000),
    supabase
      .from("page_views")
      .select("viewed_at")
      .gte("viewed_at", sevenDaysAgo)
      .order("viewed_at", { ascending: false })
      .limit(5000),
  ]);

  const topCounts = new Map<string, number>();
  for (const row of topRes.data ?? []) {
    topCounts.set(row.path, (topCounts.get(row.path) ?? 0) + 1);
  }
  const topPages = [...topCounts.entries()]
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  const dailyCounts = new Map<string, number>();
  for (const row of dailyRes.data ?? []) {
    const day = new Date(row.viewed_at).toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "short",
    });
    dailyCounts.set(day, (dailyCounts.get(day) ?? 0) + 1);
  }
  const dailyLast7 = [...dailyCounts.entries()]
    .map(([day, views]) => ({ day, views }))
    .reverse();

  return {
    today: todayRes.count ?? 0,
    last7Days: weekRes.count ?? 0,
    allTime: allRes.count ?? 0,
    topPages,
    dailyLast7,
  };
}

/** Hitung page view per slug artikel (/artikel/[slug]) */
export async function getArticleViewCounts(): Promise<Record<string, number>> {
  const supabase = createAdminClient();
  if (!supabase) return {};

  const { data } = await supabase
    .from("page_views")
    .select("path")
    .like("path", "/artikel/%")
    .limit(10000);

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const slug = row.path.replace(/^\/artikel\//, "").split(/[?#]/)[0];
    if (!slug || slug === "artikel") continue;
    counts[slug] = (counts[slug] ?? 0) + 1;
  }
  return counts;
}

export async function getTopArticleViews(
  articles: { slug: string; title: string; status: string }[],
  limit = 5,
  prefetchedCounts?: Record<string, number>
): Promise<ArticleViewStat[]> {
  const counts = prefetchedCounts ?? (await getArticleViewCounts());
  return mapTopArticleViews(articles, counts, limit);
}

export function mapTopArticleViews(
  articles: { slug: string; title: string; status: string }[],
  counts: Record<string, number>,
  limit = 5
): ArticleViewStat[] {
  return articles
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      status: a.status,
      views: counts[a.slug] ?? 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

const CACHE_TTL_SECONDS = 60;

export const getCachedPageViewStats = unstable_cache(
  async () => getPageViewStats(),
  ["admin-page-view-stats"],
  { revalidate: CACHE_TTL_SECONDS }
);

export const getCachedArticleViewCounts = unstable_cache(
  async () => getArticleViewCounts(),
  ["admin-article-view-counts"],
  { revalidate: CACHE_TTL_SECONDS }
);
