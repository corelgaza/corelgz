import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH() {
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

  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("is_read", false);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
