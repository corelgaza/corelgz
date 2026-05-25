import { NextResponse } from "next/server";
import { getAdminSession, verifyAdminPassword } from "@/lib/admin/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password =
      typeof body?.password === "string" ? body.password : "";

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: "Password salah" },
        { status: 401 }
      );
    }

    const session = await getAdminSession();
    session.isAdmin = true;
    session.ts = Date.now();
    await session.save();

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Permintaan tidak valid" },
      { status: 400 }
    );
  }
}
