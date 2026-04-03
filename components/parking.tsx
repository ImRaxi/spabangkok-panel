"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconClock } from "@/components/panel-icons";
import { PanelSidebar } from "@/components/panel-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const DURATIONS = ["30MIN", "45MIN", "1H", "1.5H", "2H"] as const;

export type ParkingCardProps = {
  spotNumber: number;
  defaultPlate: string;
  /** When true, shows FREE with a green badge. */
  isFree?: boolean;
};

export function ParkingCard({
  spotNumber,
  defaultPlate,
  isFree = true,
}: ParkingCardProps) {
  const [duration, setDuration] = useState<(typeof DURATIONS)[number]>("1.5H");

  return (
    <div className="flex min-h-[22rem] min-w-0 flex-col gap-5 rounded-2xl bg-card p-6 text-card-foreground shadow-sm ring-1 ring-border">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
          Parking {spotNumber}
        </h2>
        <Badge
          variant="secondary"
          className={cn(
            "shrink-0 border-transparent text-[10px] font-semibold uppercase tracking-wide",
            isFree
              ? "bg-emerald-600 text-white hover:bg-emerald-600/90"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isFree ? "WOLNE" : "ZAJĘTE"}
        </Badge>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Numer rejestracyjny
        </Label>
        <Input
          defaultValue={defaultPlate}
          className="text-center font-mono text-sm"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {DURATIONS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDuration(d)}
            className={cn(
              "rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-tight transition-colors",
              duration === d
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-4 pt-1">
        <Button type="button" className="w-full font-bold uppercase tracking-wide">
          Zajmij miejsce
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-sm font-medium tabular-nums text-muted-foreground">
          <IconClock />
          <span>00:00:00</span>
        </div>
      </div>
    </div>
  );
}

const PARKING_SPOTS: { spotNumber: number; defaultPlate: string }[] = [
  { spotNumber: 1, defaultPlate: "CIN8530A" },
  { spotNumber: 2, defaultPlate: "WA12345" },
  { spotNumber: 3, defaultPlate: "KR999XX" },
  { spotNumber: 4, defaultPlate: "GD512AB" },
  { spotNumber: 5, defaultPlate: "PO777CC" },
];

export default function Parking() {
  return (
    <div className="flex h-screen bg-background">
      <PanelSidebar activeHref="/parking" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-6">
          <h1 className="text-2xl font-semibold tracking-tight">Rejestracja parkingu</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://i.pravatar.cc/128" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-muted/30 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PARKING_SPOTS.map((s) => (
              <ParkingCard
                key={s.spotNumber}
                spotNumber={s.spotNumber}
                defaultPlate={s.defaultPlate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
