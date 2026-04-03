import { NextResponse } from "next/server";

import {
  SPA_SESSION_COOKIE,
  SPA_SESSION_MAX_AGE_SEC,
} from "@/lib/auth-session";
import { isPanelDbConfigured } from "@/lib/panel-db";
import { verifyPanelUser } from "@/lib/panel-auth-server";

export const runtime = "nodejs";

function sessionCookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SPA_SESSION_MAX_AGE_SEC,
    secure: process.env.NODE_ENV === "production",
  };
}

function jsonWithSession() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SPA_SESSION_COOKIE, "1", sessionCookieOptions());
  return res;
}

export async function POST(request: Request) {
  let body: { login?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe żądanie." }, { status: 400 });
  }

  const login = typeof body.login === "string" ? body.login.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!login || !password) {
    return NextResponse.json(
      { error: "Wpisz login i hasło." },
      { status: 400 }
    );
  }

  const skipDb = process.env.SKIP_PANEL_DB_AUTH === "true";

  if (skipDb) {
    return jsonWithSession();
  }

  if (!isPanelDbConfigured()) {
    return NextResponse.json(
      {
        error:
          "Brak konfiguracji bazy danych. Ustaw MYSQL_HOST, MYSQL_USER, MYSQL_DATABASE w .env (patrz .env.example) albo tymczasowo SKIP_PANEL_DB_AUTH=true.",
      },
      { status: 503 }
    );
  }

  try {
    const user = await verifyPanelUser(login, password);
    if (!user) {
      return NextResponse.json(
        { error: "Nie poprawne dane do logowania." },
        { status: 401 }
      );
    }
    return jsonWithSession();
  } catch (e) {
    console.error("[auth/login]", e);
    const dev =
      process.env.NODE_ENV === "development" && e instanceof Error
        ? e.message
        : undefined;
    return NextResponse.json(
      {
        error: "Błąd serwera podczas logowania.",
        ...(dev && { details: dev }),
      },
      { status: 500 }
    );
  }
}
