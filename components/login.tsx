"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PanelBrand } from "@/components/panel-brand";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Login() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setErrorDetails(null);
    if (!login.trim() || !password.trim()) {
      setError("Wpisz login i hasło.");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          login: login.trim(),
          password,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        details?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Nie udało się zalogować.");
        setErrorDetails(data.details ?? null);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Brak połączenia z serwerem.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center justify-end border-b bg-card px-6">
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
        <PanelBrand variant="login" />

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-lg">Zaloguj się do panelu</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login">Login</Label>
                <Input
                  id="login"
                  type="text"
                  autoComplete="username"
                  placeholder="login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Hasło</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <div className="space-y-1" role="alert">
                  <p className="text-sm text-destructive">{error}</p>
                  {errorDetails && (
                    <p className="rounded-md bg-muted px-2 py-1.5 font-mono text-xs text-muted-foreground break-all">
                      {errorDetails}
                    </p>
                  )}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Logowanie…" : "Zaloguj się"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
