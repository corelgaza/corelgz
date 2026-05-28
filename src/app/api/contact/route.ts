import { NextResponse } from "next/server";
import { getWhatsAppUrl } from "@/lib/config";
import { formatContactForWhatsApp, getVisitorLabel } from "@/lib/visitor";
import { createAdminClient } from "@/lib/supabase/admin";

function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return request.headers.get("x-real-ip");
}

const MIN_MESSAGE_CHARS = 5;
const MAX_MESSAGE_CHARS = 1200;
const RATE_LIMIT_WINDOW_SECONDS = 45;
const RATE_LIMIT_MAX_IN_WINDOW = 1;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message =
      typeof body.message === "string" ? body.message.trim() : "";
    const visitorId =
      typeof body.visitorId === "string" && body.visitorId.trim()
        ? body.visitorId.trim()
        : `v-${Date.now().toString(36)}`;

    // Honeypot: bot biasanya ngisi field tersembunyi
    const hp =
      typeof body.hp === "string" ? body.hp.trim() : "";
    if (hp) {
      return NextResponse.json({ ok: true });
    }

    if (!message) {
      return NextResponse.json(
        { error: "Pesan wajib diisi" },
        { status: 400 }
      );
    }

    if (message.length < MIN_MESSAGE_CHARS) {
      return NextResponse.json(
        { error: `Pesan minimal ${MIN_MESSAGE_CHARS} karakter` },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_CHARS) {
      return NextResponse.json(
        { error: `Pesan maksimal ${MAX_MESSAGE_CHARS} karakter` },
        { status: 400 }
      );
    }

    const displayName = getVisitorLabel(visitorId);
    const waText = formatContactForWhatsApp(visitorId, message);
    const ip = getClientIp(request);

    const supabase = createAdminClient();
    if (supabase) {
      // Rate limit berbasis DB (aman untuk serverless)
      const sinceIso = new Date(
        Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000
      ).toISOString();

      // Supabase count query
      let q = supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .gte("created_at", sinceIso);

      if (visitorId && ip) {
        q = q.or(`visitor_id.eq.${visitorId},ip_address.eq.${ip}`);
      } else if (visitorId) {
        q = q.eq("visitor_id", visitorId);
      } else if (ip) {
        q = q.eq("ip_address", ip);
      }

      const { count, error: countError } = await q;

      if (!countError && typeof count === "number") {
        if (count >= RATE_LIMIT_MAX_IN_WINDOW) {
          return NextResponse.json(
            {
              error:
                "Terlalu cepat. Tunggu sebentar lalu kirim lagi ya.",
            },
            { status: 429 }
          );
        }
      }

      await supabase.from("contact_messages").insert({
        name: displayName,
        message,
        visitor_id: visitorId,
        ip_address: ip,
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
