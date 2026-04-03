"use client";

import { FormEvent, useMemo, useState } from "react";

import { ClientDetailDialog } from "@/components/client-detail-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export default function Clients() {
  const { clients: klienci, addClient } = useClientsLoyalty();
  const [addOpen, setAddOpen] = useState(false);
  const [detailClientId, setDetailClientId] = useState<number | null>(null);
  const [imie, setImie] = useState("");
  const [nazwisko, setNazwisko] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [adres, setAdres] = useState("");
  const [miasto, setMiasto] = useState("");
  const [kodPocztowy, setKodPocztowy] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredKlienci = useMemo(() => {
    const raw = searchQuery.trim();
    if (!raw) return klienci;
    const q = raw.toLowerCase();
    const qDigits = raw.replace(/\D/g, "");
    return klienci.filter((k) => {
      if (String(k.id).includes(raw)) return true;
      if (k.login.toLowerCase().includes(q)) return true;
      if (k.email.toLowerCase().includes(q)) return true;
      if (k.telefon.toLowerCase().includes(q)) return true;
      if (qDigits.length > 0) {
        const phoneDigits = k.telefon.replace(/\D/g, "");
        if (phoneDigits.includes(qDigits)) return true;
      }
      return false;
    });
  }, [klienci, searchQuery]);

  function openAddClient() {
    setImie("");
    setNazwisko("");
    setLogin("");
    setEmail("");
    setTelefon("");
    setAdres("");
    setMiasto("");
    setKodPocztowy("");
    setAddError(null);
    setAddOpen(true);
  }

  function handleAddClient(e: FormEvent) {
    e.preventDefault();
    setAddError(null);
    if (
      !imie.trim() ||
      !nazwisko.trim() ||
      !login.trim() ||
      !email.trim() ||
      !telefon.trim()
    ) {
      setAddError("Wypełnij wymagane pola: imię, nazwisko, login, e-mail i telefon.");
      return;
    }
    addClient({
      imie: imie.trim(),
      nazwisko: nazwisko.trim(),
      login: login.trim(),
      email: email.trim(),
      telefon: telefon.trim(),
      adres: adres.trim(),
      miasto: miasto.trim(),
      kodPocztowy: kodPocztowy.trim(),
      punkty: 0,
    });
    setAddOpen(false);
  }

  return (
    <div className="flex h-screen bg-background">
      <PanelSidebar activeHref="/clients" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-6">
          <h1 className="text-2xl font-semibold tracking-tight">Klienci</h1>

          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Input
                placeholder="Szukaj klienta..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Szukaj po ID, loginie, e-mailu lub numerze telefonu"
              />
            </div>

            <Button variant="outline" size="icon" aria-label="Powiadomienia">
              <IconBell />
            </Button>

            <ThemeToggle />

            <Button type="button" onClick={openAddClient}>
              Dodaj klienta
            </Button>

            <Avatar className="cursor-pointer">
              <AvatarImage src="https://i.pravatar.cc/128" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lista klientów</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Login</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Numer telefonu</TableHead>
                    <TableHead>Punkty</TableHead>
                    <TableHead className="w-28 text-center">Szczegóły</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKlienci.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center text-muted-foreground"
                      >
                        {klienci.length === 0
                          ? "Brak klientów na liście."
                          : "Brak wyników dla podanej frazy."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredKlienci.map((k) => (
                      <TableRow key={k.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{k.id}</TableCell>
                        <TableCell className="font-mono text-muted-foreground">
                          {k.login}
                        </TableCell>
                        <TableCell>{k.email}</TableCell>
                        <TableCell>{k.telefon}</TableCell>
                        <TableCell>{k.punkty}</TableCell>

                        <TableCell>
                          <Button
                            type="button"
                            variant="default"
                            size="sm"
                            className="w-full"
                            onClick={() => setDetailClientId(k.id)}
                          >
                            Szczegóły
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent
          className="max-h-[min(90vh,850px)] overflow-y-auto sm:max-w-lg"
          showCloseButton
        >
          <form onSubmit={handleAddClient} className="space-y-4">
            <DialogHeader className="border-b border-border pb-4">
              <DialogTitle className="text-lg">
                Dodawanie nowego klienta
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-imie">Imię</Label>
                <Input
                  id="client-imie"
                  value={imie}
                  onChange={(e) => setImie(e.target.value)}
                  autoComplete="given-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-nazwisko">Nazwisko</Label>
                <Input
                  id="client-nazwisko"
                  value={nazwisko}
                  onChange={(e) => setNazwisko(e.target.value)}
                  autoComplete="family-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-login">Login</Label>
                <Input
                  id="client-login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-email">Email</Label>
                <Input
                  id="client-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-telefon">Numer telefonu</Label>
                <Input
                  id="client-telefon"
                  type="tel"
                  value={telefon}
                  onChange={(e) => setTelefon(e.target.value)}
                  autoComplete="tel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-adres">Adres</Label>
                <Input
                  id="client-adres"
                  value={adres}
                  onChange={(e) => setAdres(e.target.value)}
                  autoComplete="street-address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-miasto">Miasto</Label>
                <Input
                  id="client-miasto"
                  value={miasto}
                  onChange={(e) => setMiasto(e.target.value)}
                  autoComplete="address-level2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-kod">Kod pocztowy</Label>
                <Input
                  id="client-kod"
                  value={kodPocztowy}
                  onChange={(e) => setKodPocztowy(e.target.value)}
                  autoComplete="postal-code"
                />
              </div>
              {addError && (
                <p className="text-sm text-destructive" role="alert">
                  {addError}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2 border-t border-border pt-4 sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setAddOpen(false)}
              >
                Zamknij
              </Button>
              <Button type="submit">Dodaj klienta</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ClientDetailDialog
        clientId={detailClientId}
        open={detailClientId !== null}
        onOpenChange={(o) => {
          if (!o) setDetailClientId(null);
        }}
      />
    </div>
  );
}
