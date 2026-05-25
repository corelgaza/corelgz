import { NextRequest, NextResponse } from "next/server";
import { unsealData } from "iron-session";

type AdminSession = {
  isAdmin?: boolean;
};

const COOKIE_NAME = "santri_admin_session";

export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const password = process.env.ADMIN_SESSION_SECRET;
  if (!password || password.length < 32) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "missing-config");
    return NextResponse.redirect(loginUrl);
  }

  const sealed = request.cookies.get(COOKIE_NAME)?.value;
  let isAdmin = false;

  if (sealed) {
    try {
      const session = await unsealData<AdminSession>(sealed, { password });
      isAdmin = Boolean(session.isAdmin);
    } catch {
      isAdmin = false;
    }
  }

  if (!isAdmin) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set(
      "redirect",
      request.nextUrl.pathname + request.nextUrl.search
    );
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
