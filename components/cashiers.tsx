"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { IconBell } from "@/components/panel-icons";
import { PanelSidebar } from "@/components/panel-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

type Kasjer = {
  id: number;
  imie: string;
  login: string;
  lokalizacja: string;
};

const INITIAL_KASJERZY: Kasjer[] = [
  {
    id: 26,
    imie: "Paulina Olejnik",
    login: "polejnik",
    lokalizacja: "Bydgoszcz gdańska",
  },
  {
    id: 27,
    imie: "Wiktoria Olechnowicz",
    login: "wolechnowicz",
    lokalizacja: "Bydgoszcz",
  },
  {
    id: 28,
    imie: "Natalia Sienkiewicz",
    login: "nsienkiewicz",
    lokalizacja: "Bydgoszcz",
  },
  {
    id: 29,
    imie: "Agata Deżakowska",
    login: "adezakowska",
    lokalizacja: "Bydgoszcz",
  },
  {
    id: 30,
    imie: "Wiktoria Lis",
    login: "wlis",
    lokalizacja: "Bydgoszcz",
  },
  {
    id: 31,
    imie: "Natalia Zudzin",
    login: "nzudzin",
    lokalizacja: "Bydgoszcz",
  },
  {
    id: 32,
    imie: "Wiktoria Zielińska",
    login: "wzielinska",
    lokalizacja: "Bydgoszcz",
  },
];

const DEFAULT_LOKALIZACJA = "Bydgoszcz gdańska";

export default function Cashiers() {
  const [kasjerzy, setKasjerzy] = useState<Kasjer[]>(INITIAL_KASJERZY);
  const [editing, setEditing] = useState<Kasjer | null>(null);
  const [deleting, setDeleting] = useState<Kasjer | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addLogin, setAddLogin] = useState("");
  const [addImie, setAddImie] = useState("");
  const [addHaslo, setAddHaslo] = useState("");
  const [addLokalizacja, setAddLokalizacja] = useState(DEFAULT_LOKALIZACJA);
  const [addError, setAddError] = useState<string | null>(null);
  const [login, setLogin] = useState("");
  const [imie, setImie] = useState("");
  const [haslo, setHaslo] = useState("");
  const [lokalizacja, setLokalizacja] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredKasjerzy = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return kasjerzy;
    return kasjerzy.filter(
      (k) =>
        k.imie.toLowerCase().includes(q) ||
        k.login.toLowerCase().includes(q)
    );
  }, [kasjerzy, searchQuery]);

  useEffect(() => {
    if (editing) {
      setLogin(editing.login);
      setImie(editing.imie);
      setLokalizacja(editing.lokalizacja);
      setHaslo("");
    }
  }, [editing]);

  function handleSaveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setKasjerzy((rows) =>
      rows.map((r) =>
        r.id === editing.id ? { ...r, login, imie, lokalizacja } : r
      )
    );
    setEditing(null);
  }

  function openAddCashier() {
    setAddLogin("");
    setAddImie("");
    setAddHaslo("");
    setAddLokalizacja(DEFAULT_LOKALIZACJA);
    setAddError(null);
    setAddOpen(true);
  }

  function handleAddCashier(e: FormEvent) {
    e.preventDefault();
    setAddError(null);
    if (!addLogin.trim() || !addImie.trim()) {
      setAddError("Wpisz login oraz imię i nazwisko.");
      return;
    }
    if (!addHaslo.trim()) {
      setAddError("Wpisz hasło.");
      return;
    }
    const nextId =
      kasjerzy.length === 0
        ? 1
        : Math.max(...kasjerzy.map((k) => k.id)) + 1;
    setKasjerzy((rows) => [
      ...rows,
      {
        id: nextId,
        login: addLogin.trim(),
        imie: addImie.trim(),
        lokalizacja: addLokalizacja.trim() || DEFAULT_LOKALIZACJA,
      },
    ]);
    setAddOpen(false);
  }

  return (
    <div className="flex h-screen bg-background">
      <PanelSidebar activeHref="/" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-6">
          <h1 className="text-2xl font-semibold tracking-tight">Kasjerzy</h1>

          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Input
                placeholder="Szukaj kasjera..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Szukaj kasjera po imieniu i nazwisku lub loginie"
              />
            </div>

            <Button variant="outline" size="icon" aria-label="Powiadomienia">
              <IconBell />
            </Button>

            <ThemeToggle />

            <Button type="button" onClick={openAddCashier}>
              Dodaj kasjera
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
              <CardTitle className="text-lg">Lista kasjerów</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Imię i nazwisko</TableHead>
                    <TableHead>Login</TableHead>
                    <TableHead className="w-24 text-center">Edytuj</TableHead>
                    <TableHead className="w-24 text-center">Usuń</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKasjerzy.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        {kasjerzy.length === 0
                          ? "Brak kasjerów na liście."
                          : "Brak wyników dla podanej frazy."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredKasjerzy.map((k) => (
                      <TableRow key={k.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{k.id}</TableCell>
                        <TableCell>{k.imie}</TableCell>
                        <TableCell className="font-mono text-muted-foreground">
                          {k.login}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="default"
                            size="sm"
                            className="w-full"
                            onClick={() => setEditing(k)}
                          >
                            Edytuj
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={() => setDeleting(k)}
                          >
                            Usuń
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
        <DialogContent className="sm:max-w-lg" showCloseButton>
          <form onSubmit={handleAddCashier} className="space-y-4">
            <DialogHeader className="border-b border-border pb-4">
              <DialogTitle className="text-lg">
                Podaj dane nowego kasjera
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-login">Login</Label>
                <Input
                  id="add-login"
                  value={addLogin}
                  onChange={(e) => setAddLogin(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-imie">Imię i nazwisko</Label>
                <Input
                  id="add-imie"
                  value={addImie}
                  onChange={(e) => setAddImie(e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-haslo">Hasło</Label>
                <Input
                  id="add-haslo"
                  type="password"
                  value={addHaslo}
                  onChange={(e) => setAddHaslo(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-lokalizacja">Lokalizacja</Label>
                <Input
                  id="add-lokalizacja"
                  value={addLokalizacja}
                  onChange={(e) => setAddLokalizacja(e.target.value)}
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
              <Button type="submit">Dodaj kasjera</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent className="sm:max-w-lg" showCloseButton>
          {editing && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-lg">
                  Kasjer – {editing.imie}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-login">Login</Label>
                  <Input
                    id="edit-login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    autoComplete="username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-imie">Imię i nazwisko</Label>
                  <Input
                    id="edit-imie"
                    value={imie}
                    onChange={(e) => setImie(e.target.value)}
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-haslo">Hasło</Label>
                  <p className="text-xs text-muted-foreground">
                    Jeśli nie chcesz zmieniać hasło zostaw pole puste.
                  </p>
                  <Input
                    id="edit-haslo"
                    type="password"
                    value={haslo}
                    onChange={(e) => setHaslo(e.target.value)}
                    autoComplete="new-password"
                    placeholder=""
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lokalizacja">Lokalizacja</Label>
                  <Input
                    id="edit-lokalizacja"
                    value={lokalizacja}
                    onChange={(e) => setLokalizacja(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">Zapisz</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Czy na pewno chcesz usunąć ten element?"
        description={
          deleting
            ? `Czy na pewno chcesz usunąć kasjera „${deleting.imie}” (login: ${deleting.login})? Tej operacji nie można cofnąć.`
            : ""
        }
        onConfirm={() => {
          if (deleting) {
            setKasjerzy((rows) => rows.filter((r) => r.id !== deleting.id));
          }
        }}
      />
    </div>
  );
}
