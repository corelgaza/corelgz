import { GALLERY_FALLBACK } from "@/data/site";
import { createServerClient } from "@/lib/supabase/server";

export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
};

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
