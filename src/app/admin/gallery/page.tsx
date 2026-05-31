import GalleryManager from "@/components/admin/GalleryManager";
import { listGalleryItemsAdmin } from "@/lib/gallery";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const items = await listGalleryItemsAdmin();

  return <GalleryManager initial={items} />;
}
