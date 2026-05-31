import { GALLERY_FALLBACK } from "@/data/site";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type GalleryItemRow = Database["public"]["Tables"]["gallery_items"]["Row"];

export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
};

export async function listGalleryItemsAdmin(): Promise<GalleryItemRow[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const supabase = createServerClient();

    if (!supabase) {
      return [...GALLERY_FALLBACK];
    }

    const { data, error } = await supabase
      .from("gallery_items")
      .select("src, alt, caption, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) {
      return [...GALLERY_FALLBACK];
    }

    return data.map((row) => ({
      src: row.src,
      alt: row.alt,
      caption: row.caption,
    }));
  } catch {
    return [...GALLERY_FALLBACK];
  }
}
