import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

type GalleryUpdate = Database["public"]["Tables"]["gallery_items"]["Update"];

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
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

  const patch: GalleryUpdate = {};
  if (typeof body.src === "string" && body.src.trim()) {
    patch.src = body.src.trim();
  }
  if (typeof body.alt === "string") patch.alt = body.alt.trim();
  if (typeof body.caption === "string") patch.caption = body.caption.trim();
  if (typeof body.sort_order === "number") patch.sort_order = body.sort_order;
  if (typeof body.is_published === "boolean") {
    patch.is_published = body.is_published;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Tidak ada field untuk diupdate" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("gallery_items")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Gagal update foto galeri" },
      { status: 500 }
    );
  }

  return NextResponse.json({ item: data });
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 500 }
    );
  }

  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
