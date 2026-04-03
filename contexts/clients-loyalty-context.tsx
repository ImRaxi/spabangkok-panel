"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { INITIAL_KLIENCI, klientFullName, type Klient } from "@/lib/klient";
import type { LoyaltyHistoryEntry, LoyaltySource } from "@/lib/loyalty-types";

/** Zastąp sesją / API, gdy będzie prawdziwe logowanie */
export const CURRENT_LOYALTY_OPERATOR = "Jan Kowalski";

type ApplyParams = {
  clientId: number;
  delta: number;
  source: LoyaltySource;
  note?: string;
};

type ApplyResult = { ok: true } | { ok: false; error: string };

type ClientsLoyaltyContextValue = {
  clients: Klient[];
  setClients: React.Dispatch<React.SetStateAction<Klient[]>>;
  history: LoyaltyHistoryEntry[];
  applyLoyaltyChange: (p: ApplyParams) => ApplyResult;
  addClient: (k: Omit<Klient, "id">) => void;
};

const ClientsLoyaltyContext = createContext<ClientsLoyaltyContextValue | null>(
  null
);

export function ClientsLoyaltyProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Klient[]>(INITIAL_KLIENCI);
  const [history, setHistory] = useState<LoyaltyHistoryEntry[]>([]);
  const clientsRef = useRef(clients);
  clientsRef.current = clients;

  const applyLoyaltyChange = useCallback((p: ApplyParams): ApplyResult => {
    const cs = clientsRef.current;
    const client = cs.find((c) => c.id === p.clientId);
    if (!client) {
      return { ok: false, error: "Nie znaleziono klienta." };
    }
    const prev = client.punkty;
    const next = prev + p.delta;
    if (next < 0) {
      return {
        ok: false,
        error: "Brak wystarczającej liczby punktów na koncie.",
      };
    }
    const entry: LoyaltyHistoryEntry = {
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      clientId: client.id,
      clientName: klientFullName(client),
      phone: client.telefon,
      delta: p.delta,
      balanceAfter: next,
      addedBy: CURRENT_LOYALTY_OPERATOR,
      source: p.source,
      note: p.note,
    };
    setClients((prevClients) =>
      prevClients.map((c) =>
        c.id === p.clientId ? { ...c, punkty: next } : c
      )
    );
    setHistory((h) => [entry, ...h]);
    return { ok: true };
  }, []);

  const addClient = useCallback((k: Omit<Klient, "id">) => {
    setClients((cs) => {
      const nextId = cs.length ? Math.max(...cs.map((c) => c.id)) + 1 : 1;
      return [...cs, { ...k, id: nextId }];
    });
  }, []);

  const value = useMemo(
    () => ({
      clients,
      setClients,
      history,
      applyLoyaltyChange,
      addClient,
    }),
    [clients, history, applyLoyaltyChange, addClient]
  );

  return (
    <ClientsLoyaltyContext.Provider value={value}>
      {children}
    </ClientsLoyaltyContext.Provider>
  );
}

export function useClientsLoyalty() {
  const ctx = useContext(ClientsLoyaltyContext);
  if (!ctx) {
    throw new Error(
      "useClientsLoyalty must be used within ClientsLoyaltyProvider"
    );
  }
  return ctx;
}
