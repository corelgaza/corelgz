import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ensureUniqueSlug,
  normalizeTags,
  toSlug,
  type ArticleUpdate,
} from "@/lib/articles";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function requireAuth() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(_req: Request, ctx: RouteContext) {
  const guard = await requireAuth();
  if (guard) return guard;

  const { id } = await ctx.params;
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 500 }
    );
  }
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }
  return NextResponse.json({ article: data });
}

export async function PATCH(request: Request, ctx: RouteContext) {
  const guard = await requireAuth();
  if (guard) return guard;

  const { id } = await ctx.params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 500 }
    );
  }

  const existing = await supabase
    .from("articles")
    .select("id, slug, status, published_at")
    .eq("id", id)
    .maybeSingle();
  if (!existing.data) {
    return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  }

  const update: ArticleUpdate = {};

  if (typeof body.title === "string") {
    const t = body.title.trim();
    if (!t) {
      return NextResponse.json(
        { error: "Judul tidak boleh kosong" },
        { status: 400 }
      );
    }
    update.title = t;
  }

  if (typeof body.slug === "string" && body.slug.trim()) {
    const newSlug = toSlug(body.slug);
    if (newSlug !== existing.data.slug) {
      update.slug = await ensureUniqueSlug(newSlug, id);
    }
  }

  if ("excerpt" in body) {
    update.excerpt =
      typeof body.excerpt === "string" && body.excerpt.trim()
        ? body.excerpt.trim()
        : null;
  }
  if ("content" in body) {
    update.content = typeof body.content === "string" ? body.content : "";
  }
  if ("cover_image" in body) {
    update.cover_image =
      typeof body.cover_image === "string" && body.cover_image.trim()
        ? body.cover_image.trim()
        : null;
  }
  if ("tags" in body) {
    update.tags = normalizeTags(body.tags);
  }
  if ("meta_title" in body) {
    update.meta_title =
      typeof body.meta_title === "string" && body.meta_title.trim()
        ? body.meta_title.trim()
        : null;
  }
  if ("meta_description" in body) {
    update.meta_description =
      typeof body.meta_description === "string" &&
      body.meta_description.trim()
        ? body.meta_description.trim()
        : null;
  }

  if (typeof body.status === "string") {
    const nextStatus =
      body.status === "published" ? "published" : "draft";
    update.status = nextStatus;
    if (nextStatus === "published" && !existing.data.published_at) {
      update.published_at = new Date().toISOString();
    }
    if (nextStatus === "draft") {
      update.published_at = null;
    }
  }

  const { data, error } = await supabase
    .from("articles")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Gagal mengupdate" },
      { status: 500 }
    );
  }

  return NextResponse.json({ article: data });
}

export async function DELETE(_req: Request, ctx: RouteContext) {
  const guard = await requireAuth();
  if (guard) return guard;

  const { id } = await ctx.params;
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 500 }
    );
  }
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
