"use client";

import type { ComponentProps, ReactNode } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { clearSessionCookie } from "@/lib/auth-session";

async function logoutRequest() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch {
    /* HttpOnly — spróbuj wyczyścić ewentualne stare ciasteczko po stronie klienta */
  }
  clearSessionCookie();
}

type LogoutButtonProps = {
  variant?: ComponentProps<typeof Button>["variant"];
  className?: string;
  children?: ReactNode;
};

export function LogoutButton({
  variant = "destructive",
  className,
  children = "Wyloguj się",
}: LogoutButtonProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={async () => {
        await logoutRequest();
        router.push("/login");
        router.refresh();
      }}
    >
      {children}
    </Button>
  );
}
