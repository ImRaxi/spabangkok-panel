"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { ClientsLoyaltyProvider } from "@/contexts/clients-loyalty-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ClientsLoyaltyProvider>{children}</ClientsLoyaltyProvider>
    </ThemeProvider>
  );
}
