import { NextResponse } from "next/server";
import { getWhatsAppUrl } from "@/lib/config";
import { formatContactForWhatsApp, getVisitorLabel } from "@/lib/visitor";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return request.headers.get("x-real-ip");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message =
      typeof body.message === "string" ? body.message.trim() : "";
    const visitorId =
      typeof body.visitorId === "string" && body.visitorId.trim()
        ? body.visitorId.trim()
        : `v-${Date.now().toString(36)}`;

    if (!message) {
      return NextResponse.json(
        { error: "Pesan wajib diisi" },
        { status: 400 }
      );
    }

    const displayName = getVisitorLabel(visitorId);
    const waText = formatContactForWhatsApp(visitorId, message);
    const ip = getClientIp(request);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && key) {
      const supabase = createClient<Database>(url, key);
      const storedMessage = ip
        ? `${message}\n\n[ID: ${visitorId} | IP: ${ip}]`
        : `${message}\n\n[ID: ${visitorId}]`;

      await supabase.from("contact_messages").insert({
        name: displayName,
        message: storedMessage,
      });
    }

    return NextResponse.json({
      ok: true,
      waUrl: getWhatsAppUrl(waText),
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses pesan" },
      { status: 500 }
    );
  }
}
