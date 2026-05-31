import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/session";
import { listContactMessages } from "@/lib/messages";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await listContactMessages();
  const unreadCount = messages.filter((m) => !m.is_read).length;

  return NextResponse.json({ messages, unreadCount });
}
