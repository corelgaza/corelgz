import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { listGalleryItemsAdmin } from "@/lib/gallery";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await listGalleryItemsAdmin();
  return NextResponse.json({ items });
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

  const src = typeof body.src === "string" ? body.src.trim() : "";
  if (!src) {
    return NextResponse.json({ error: "URL gambar wajib diisi" }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 500 }
    );
  }

  const { data: maxRow } = await supabase
    .from("gallery_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder =
    typeof body.sort_order === "number"
      ? body.sort_order
      : (maxRow?.sort_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("gallery_items")
    .insert({
      src,
      alt: typeof body.alt === "string" ? body.alt.trim() : "",
      caption: typeof body.caption === "string" ? body.caption.trim() : "",
      sort_order: nextOrder,
      is_published: body.is_published !== false,
    })
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Gagal menambah foto galeri" },
      { status: 500 }
    );
  }

  return NextResponse.json({ item: data }, { status: 201 });
}
