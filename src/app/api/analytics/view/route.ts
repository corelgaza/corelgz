import { NextResponse } from "next/server";
import { recordPageView } from "@/lib/analytics";

const ALLOWED_PREFIXES = ["/", "/artikel", "/share"];

function isTrackablePath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  if (path.startsWith("/admin") || path.startsWith("/api")) return false;
  return ALLOWED_PREFIXES.some(
    (p) => path === p || (p !== "/" && path.startsWith(p))
  );
}

export async function POST(request: Request) {
  let body: { path?: string; sessionKey?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.trim() : "";
  if (!path || !isTrackablePath(path)) {
    return NextResponse.json({ error: "Path tidak valid" }, { status: 400 });
  }

  const sessionKey =
    typeof body.sessionKey === "string" ? body.sessionKey.slice(0, 64) : null;

  try {
    await recordPageView(path, sessionKey);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Gagal mencatat" }, { status: 500 });
  }
}
