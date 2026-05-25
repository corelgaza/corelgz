import { cookies } from "next/headers";
import {
  getIronSession,
  type IronSession,
  type SessionOptions,
} from "iron-session";

export type AdminSessionData = {
  isAdmin?: boolean;
  ts?: number;
};

export type AdminSession = IronSession<AdminSessionData>;

const COOKIE_NAME = "santri_admin_session";

function getSessionOptions(): SessionOptions {
  const password = process.env.ADMIN_SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET harus diset (minimal 32 karakter) di .env.local"
    );
  }
  return {
    cookieName: COOKIE_NAME,
    password,
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  };
}

export async function getAdminSession(): Promise<AdminSession> {
  const cookieStore = await cookies();
  return getIronSession<AdminSessionData>(cookieStore, getSessionOptions());
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return Boolean(session.isAdmin);
}

export function verifyAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (typeof input !== "string" || input.length === 0) return false;
  if (input.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < input.length; i++) {
    diff |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
