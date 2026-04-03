import { NextResponse } from "next/server";

import { SPA_SESSION_COOKIE } from "@/lib/auth-session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SPA_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
