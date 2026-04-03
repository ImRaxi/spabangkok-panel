"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientsLoyalty } from "@/contexts/clients-loyalty-context";
import { klientAdresPlatnosci, klientFullName } from "@/lib/klient";
import { LOYALTY_VOUCHERS } from "@/lib/loyalty-vouchers";
import { cn } from "@/lib/utils";

type DetailTab = "info" | "add" | "redeem" | "subtract";

export function ClientDetailDialog({
  clientId,
  open,
  onOpenChange,
}: {
  clientId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { clients, applyLoyaltyChange } = useClientsLoyalty();
  const client =
    clientId != null ? clients.find((c) => c.id === clientId) : undefined;

  const [tab, setTab] = useState<DetailTab>("info");
  const [spendPln, setSpendPln] = useState("");
  const [voucherId, setVoucherId] = useState("");
  const [subtractPts, setSubtractPts] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setTab("info");
      setSpendPln("");
      setVoucherId("");
      setSubtractPts("");
      setFormError(null);
    }
  }, [open]);

  useEffect(() => {
    setSpendPln("");
    setVoucherId("");
    setSubtractPts("");
    setFormError(null);
  }, [clientId]);

  const name = client ? klientFullName(client) : "";
  const points = client?.punkty ?? 0;

  function handleAddFromPurchase(e: React.FormEvent) {
    e.preventDefault();
    if (!client) return;
    setFormError(null);
    const pln = Number.parseFloat(spendPln.replace(",", ".").trim());
    if (Number.isNaN(pln) || pln <= 0) {
      setFormError("Podaj prawidłową kwotę w PLN.");
      return;
    }
    const pts = Math.floor(pln / 10);
    if (pts <= 0) {
      setFormError("Kwota jest za mała — minimum 10 PLN daje 1 punkt.");
      return;
    }
    const r = applyLoyaltyChange({
      clientId: client.id,
      delta: pts,
      source: "zakup",
      note: `Zakup za ${pln} PLN (+${pts} pkt)`,
    });
    if (!r.ok) {
      setFormError(r.error);
      return;
    }
    setSpendPln("");
  }

  function handleRedeemVoucher(e: React.FormEvent) {
    e.preventDefault();
    if (!client) return;
    setFormError(null);
    const v = LOYALTY_VOUCHERS.find((x) => x.id === voucherId);
    if (!v) {
      setFormError("Wybierz bon.");
      return;
    }
    const r = applyLoyaltyChange({
      clientId: client.id,
      delta: -v.pointsCost,
      source: "voucher",
      note: v.label,
    });
    if (!r.ok) {
      setFormError(r.error);
      return;
    }
    setVoucherId("");
  }

  function handleSubtractPoints(e: React.FormEvent) {
    e.preventDefault();
    if (!client) return;
    setFormError(null);
    const n = Number.parseInt(subtractPts.replace(/\s/g, ""), 10);
    if (Number.isNaN(n) || n <= 0) {
      setFormError("Podaj dodatnią liczbę punktów do pobrania.");
      return;
    }
    const r = applyLoyaltyChange({
      clientId: client.id,
      delta: -n,
      source: "odbior",
      note: `Odebrano ${n} pkt`,
    });
    if (!r.ok) {
      setFormError(r.error);
      return;
    }
    setSubtractPts("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(90vh,850px)] overflow-y-auto sm:max-w-lg"
        showCloseButton
      >
        {!client ? (
          <>
            <DialogHeader>
              <DialogTitle>Klient</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Nie znaleziono klienta.
            </p>
          </>
        ) : (
          <>
        <div className="flex flex-wrap gap-1 border-b border-border pb-3">
          {(
            [
              ["info", "Informacje ogólne"],
              ["add", "Dodaj punkty"],
              ["redeem", "Wykorzystaj punkty"],
              ["subtract", "Odejmij punkty"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                setFormError(null);
              }}
              className={cn(
                "-mb-px rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                tab === id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "info" && (
          <>
            <DialogHeader className="border-b border-border pb-4 text-left">
              <DialogTitle className="text-base font-semibold leading-snug sm:text-lg">
                Klient {name} ma {points} punktów.
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <p className="font-medium text-foreground">Informacje ogólne</p>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                <li>
                  Imię i nazwisko —{" "}
                  <span className="font-semibold text-foreground">{name}</span>
                </li>
                <li>
                  Login —{" "}
                  <span className="font-semibold text-foreground">
                    {client.login}
                  </span>
                </li>
                <li>
                  Adres email —{" "}
                  <span className="font-semibold text-foreground">
                    {client.email}
                  </span>
                </li>
                <li>
                  Numer telefonu —{" "}
                  <span className="font-semibold text-foreground">
                    {client.telefon}
                  </span>
                </li>
                <li>
                  Adres płatności klienta —{" "}
                  <span className="font-semibold text-foreground">
                    {klientAdresPlatnosci(client)}
                  </span>
                </li>
              </ul>
            </div>
          </>
        )}

        {tab === "add" && (
          <form onSubmit={handleAddFromPurchase} className="space-y-4">
            <DialogHeader className="text-left">
              <DialogTitle className="text-base">
                Klient {name} — dodawanie punktów za zakup
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="spend-pln">Ile zapłacił klient? (PLN)</Label>
              <Input
                id="spend-pln"
                inputMode="decimal"
                placeholder="np. 100"
                value={spendPln}
                onChange={(e) => setSpendPln(e.target.value)}
              />
            </div>
            {formError && (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            )}
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white">
              Zatwierdź
            </Button>
          </form>
        )}

        {tab === "redeem" && (
          <form onSubmit={handleRedeemVoucher} className="space-y-4">
            <DialogHeader className="text-left">
              <DialogTitle className="text-base">
                Klient {name} — wykorzystanie bonu ({points} pkt)
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2 rounded-xl border border-border p-3">
              <Label htmlFor="voucher-select">Wybierz bon</Label>
              <Select
                value={voucherId === "" ? undefined : voucherId}
                onValueChange={(id) => setVoucherId(id)}
              >
                <SelectTrigger
                  id="voucher-select"
                  className="w-full min-w-0"
                  aria-label="Wybierz bon"
                >
                  <SelectValue placeholder="— wybierz —" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[100]">
                  {LOYALTY_VOUCHERS.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formError && (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            )}
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white">
              Zatwierdź
            </Button>
          </form>
        )}

        {tab === "subtract" && (
          <form onSubmit={handleSubtractPoints} className="space-y-4">
            <DialogHeader className="text-left">
              <DialogTitle className="text-base">
                Klient {name} — odbieranie punktów
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Aktualny stan:{" "}
              <span className="font-semibold tabular-nums text-foreground">
                {points} pkt
              </span>
            </p>
            <div className="space-y-2">
              <Label htmlFor="subtract-pts">Liczba punktów do pobrania</Label>
              <Input
                id="subtract-pts"
                inputMode="numeric"
                placeholder="np. 50"
                value={subtractPts}
                onChange={(e) => setSubtractPts(e.target.value)}
              />
            </div>
            {formError && (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            )}
            <Button type="submit" variant="destructive">
              Zatwierdź
            </Button>
          </form>
        )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
