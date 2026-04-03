"use client";

import { useCallback, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconBell } from "@/components/panel-icons";
import { PanelSidebar } from "@/components/panel-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useClientsLoyalty } from "@/contexts/clients-loyalty-context";
import { klientFullName, type Klient } from "@/lib/klient";
import { LOYALTY_SOURCE_LABEL } from "@/lib/loyalty-types";
import { cn } from "@/lib/utils";

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function findClientByPhone(
  list: Klient[],
  input: string
): Klient | undefined {
  const digits = normalizePhone(input);
  if (digits.length < 9) return undefined;
  return list.find((c) => {
    const cd = normalizePhone(c.telefon);
    return cd === digits || cd.slice(-9) === digits.slice(-9);
  });
}

export default function LoyaltyPoints() {
  const { clients, history, applyLoyaltyChange } = useClientsLoyalty();
  const [tab, setTab] = useState<"operations" | "history">("operations");
  const [phoneInput, setPhoneInput] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [pointsInput, setPointsInput] = useState("");

  const selected =
    selectedId != null
      ? (clients.find((c) => c.id === selectedId) ?? null)
      : null;

  const currentBalance = selected ? selected.punkty : null;

  const handleFind = useCallback(() => {
    setLookupError(null);
    const client = findClientByPhone(clients, phoneInput);
    if (!client) {
      setSelectedId(null);
      setLookupError("Nie znaleziono klienta o podanym numerze telefonu.");
      return;
    }
    setSelectedId(client.id);
  }, [clients, phoneInput]);

  const parseAmount = () => {
    const n = Number.parseInt(pointsInput.replace(/\s/g, ""), 10);
    if (Number.isNaN(n) || n <= 0) return null;
    return n;
  };

  const handleAdd = () => {
    const amount = parseAmount();
    if (amount === null || !selected) return;
    const r = applyLoyaltyChange({
      clientId: selected.id,
      delta: amount,
      source: "reczne",
      note: `Ręczne dodanie (+${amount} pkt)`,
    });
    if (!r.ok) {
      setLookupError(r.error);
      return;
    }
    setLookupError(null);
    setPointsInput("");
  };

  const handleRemove = () => {
    const amount = parseAmount();
    if (amount === null || !selected) return;
    const r = applyLoyaltyChange({
      clientId: selected.id,
      delta: -amount,
      source: "reczne",
      note: `Ręczne odjęcie (-${amount} pkt)`,
    });
    if (!r.ok) {
      setLookupError(r.error);
      return;
    }
    setLookupError(null);
    setPointsInput("");
  };

  const formatWhen = (iso: string) =>
    new Date(iso).toLocaleString("pl-PL", {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <div className="flex h-screen bg-background">
      <PanelSidebar activeHref="/loyalty-points" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Punkty lojalnościowe
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Input placeholder="Szukaj..." className="pl-9" />
            </div>
            <Button variant="outline" size="icon" aria-label="Powiadomienia">
              <IconBell />
            </Button>
            <ThemeToggle />
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://i.pravatar.cc/128" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex gap-1 border-b border-border">
            <button
              type="button"
              onClick={() => setTab("operations")}
              className={cn(
                "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                tab === "operations"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Operacje
            </button>
            <button
              type="button"
              onClick={() => setTab("history")}
              className={cn(
                "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                tab === "history"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Historia
            </button>
          </div>

          {tab === "operations" && (
            <Card className="max-w-xl">
              <CardHeader>
                <CardTitle className="text-lg">Wybór klienta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Numer telefonu</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+48 601 234 567"
                      value={phoneInput}
                      onChange={(e) => {
                        setPhoneInput(e.target.value);
                        setLookupError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleFind();
                      }}
                    />
                    <Button type="button" onClick={handleFind}>
                      Znajdź
                    </Button>
                  </div>
                  {lookupError && !selected && (
                    <p className="text-sm text-destructive">{lookupError}</p>
                  )}
                </div>

                {selected && (
                  <>
                    <div className="rounded-xl border bg-muted/40 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">
                            {klientFullName(selected)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            @{selected.login} · {selected.telefon}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-base tabular-nums">
                          {currentBalance} pkt
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Liczba punktów</Label>
                      <Input
                        id="amount"
                        inputMode="numeric"
                        placeholder="np. 50"
                        value={pointsInput}
                        onChange={(e) => setPointsInput(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        onClick={handleAdd}
                        disabled={!parseAmount()}
                      >
                        Dodaj punkty
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemove}
                        disabled={!parseAmount()}
                      >
                        Odejmij punkty
                      </Button>
                    </div>
                    {lookupError && selected && (
                      <p className="text-sm text-destructive">{lookupError}</p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {tab === "history" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Historia operacji</CardTitle>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Brak zapisanych operacji.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Klient</TableHead>
                        <TableHead>Telefon</TableHead>
                        <TableHead>Źródło</TableHead>
                        <TableHead>Kto</TableHead>
                        <TableHead className="text-right">Zmiana</TableHead>
                        <TableHead className="text-right">Saldo po</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {formatWhen(row.at)}
                          </TableCell>
                          <TableCell>{row.clientName}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {row.phone}
                          </TableCell>
                          <TableCell className="max-w-[12rem] text-sm">
                            {row.note ?? LOYALTY_SOURCE_LABEL[row.source]}
                          </TableCell>
                          <TableCell className="text-sm">
                            {row.addedBy}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "text-right font-medium tabular-nums",
                              row.delta > 0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-destructive"
                            )}
                          >
                            {row.delta > 0 ? "+" : ""}
                            {row.delta}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {row.balanceAfter}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
