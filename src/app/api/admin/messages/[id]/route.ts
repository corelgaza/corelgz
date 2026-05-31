import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";

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

  if (typeof body.is_read !== "boolean") {
    return NextResponse.json(
      { error: "Field is_read wajib boolean" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .update({ is_read: body.is_read })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Gagal update pesan" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: data });
}
