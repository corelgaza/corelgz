import slugify from "slugify";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];
export type ArticleInsert = Database["public"]["Tables"]["articles"]["Insert"];
export type ArticleUpdate = Database["public"]["Tables"]["articles"]["Update"];

export function toSlug(input: string): string {
  return (
    slugify(input || "", {
      lower: true,
      strict: true,
      trim: true,
      locale: "id",
    }) || `artikel-${Date.now().toString(36)}`
  );
}

export function normalizeTags(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  for (const raw of input) {
    if (typeof raw !== "string") continue;
    const clean = raw.trim().toLowerCase();
    if (clean) seen.add(clean);
  }
  return Array.from(seen).slice(0, 12);
}

export type ArticleSummary = Pick<
  ArticleRow,
  | "id"
  | "slug"
  | "title"
  | "excerpt"
  | "cover_image"
  | "tags"
  | "status"
  | "published_at"
  | "updated_at"
>;

/** List artikel (admin: all status, public: published only) */
export async function listArticlesAdmin(): Promise<ArticleSummary[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, slug, title, excerpt, cover_image, tags, status, published_at, updated_at"
    )
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return data;
}

export async function listPublishedArticles(): Promise<ArticleSummary[]> {
  const supabase = createServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, slug, title, excerpt, cover_image, tags, status, published_at, updated_at"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return data;
}

export async function getArticleBySlug(
  slug: string
): Promise<ArticleRow | null> {
  const supabase = createServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function getArticleByIdAdmin(
  id: string
): Promise<ArticleRow | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return null;
  return data;
}

/** Coba bikin slug unik dengan suffix -2, -3, dst jika sudah ada */
export async function ensureUniqueSlug(
  base: string,
  excludeId?: string
): Promise<string> {
  const supabase = createAdminClient();
  if (!supabase) return base;
  let candidate = base;
  let i = 2;
  while (i < 50) {
    let query = supabase
      .from("articles")
      .select("id")
      .eq("slug", candidate)
      .limit(1);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query;
    if (!data || data.length === 0) return candidate;
    candidate = `${base}-${i++}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}
