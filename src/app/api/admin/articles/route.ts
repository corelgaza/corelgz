import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ensureUniqueSlug,
  normalizeTags,
  toSlug,
  type ArticleInsert,
} from "@/lib/articles";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 500 }
    );
  }
  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, slug, title, excerpt, cover_image, tags, status, published_at, updated_at"
    )
    .order("updated_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ articles: data ?? [] });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ error: "Judul wajib diisi" }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 500 }
    );
  }

  const slugInput =
    typeof body.slug === "string" && body.slug.trim() ? body.slug : title;
  const slug = await ensureUniqueSlug(toSlug(slugInput));

  const status = body.status === "published" ? "published" : "draft";

  const payload: ArticleInsert = {
    title,
    slug,
    excerpt:
      typeof body.excerpt === "string" && body.excerpt.trim()
        ? body.excerpt.trim()
        : null,
    content: typeof body.content === "string" ? body.content : "",
    cover_image:
      typeof body.cover_image === "string" && body.cover_image.trim()
        ? body.cover_image.trim()
        : null,
    tags: normalizeTags(body.tags),
    status,
    meta_title:
      typeof body.meta_title === "string" && body.meta_title.trim()
        ? body.meta_title.trim()
        : null,
    meta_description:
      typeof body.meta_description === "string" && body.meta_description.trim()
        ? body.meta_description.trim()
        : null,
    published_at: status === "published" ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase
    .from("articles")
    .insert(payload)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Gagal menyimpan artikel" },
      { status: 500 }
    );
  }

  return NextResponse.json({ article: data }, { status: 201 });
}
