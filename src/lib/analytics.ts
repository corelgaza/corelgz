import { createAdminClient } from "@/lib/supabase/admin";

export type PageViewStats = {
  today: number;
  last7Days: number;
  allTime: number;
  topPages: { path: string; views: number }[];
  dailyLast7: { day: string; views: number }[];
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
    supabase.from("page_views").select("path").limit(5000),
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
