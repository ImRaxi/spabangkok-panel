"use client";

import Link from "next/link";

import { LogoutButton } from "@/components/logout-button";
import {
  IconKasjerzy,
  IconKlienci,
  IconKupony,
  IconLogout,
  IconLojalnosc,
  IconParkingNav,
  IconUstawienia,
} from "@/components/panel-icons";
import { PanelBrand } from "@/components/panel-brand";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type PanelActiveHref =
  | "/"
  | "/clients"
  | "/coupons"
  | "/parking"
  | "/loyalty-points";

const NAV_ITEMS: {
  href: PanelActiveHref;
  label: string;
  Icon: typeof IconKasjerzy;
}[] = [
  { href: "/", label: "Kasjerzy", Icon: IconKasjerzy },
  { href: "/clients", label: "Klienci", Icon: IconKlienci },
  { href: "/coupons", label: "Kupony", Icon: IconKupony },
  { href: "/parking", label: "Rejestracja parkingu", Icon: IconParkingNav },
  {
    href: "/loyalty-points",
    label: "Punkty lojalnościowe",
    Icon: IconLojalnosc,
  },
];

export function PanelSidebar({ activeHref }: { activeHref: PanelActiveHref }) {
  return (
    <div className="flex w-72 shrink-0 flex-col border-r bg-card">
      <div className="border-b p-6">
        <PanelBrand />
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = activeHref === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
        <Separator className="my-4" />
      </nav>

      <div className="space-y-3 border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/128" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Jan Kowalski</p>
            <p className="text-xs text-muted-foreground">Właściciel</p>
          </div>
        </div>
        <LogoutButton
          variant="outline"
          className="w-full justify-start gap-2 font-normal"
        >
          <IconLogout />
          Wyloguj się
        </LogoutButton>
      </div>
    </div>
  );
}
