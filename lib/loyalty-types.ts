export type LoyaltySource = "zakup" | "voucher" | "reczne" | "odbior";

export type LoyaltyHistoryEntry = {
  id: string;
  at: string;
  clientId: number;
  clientName: string;
  phone: string;
  delta: number;
  balanceAfter: number;
  addedBy: string;
  source: LoyaltySource;
  note?: string;
};

export const LOYALTY_SOURCE_LABEL: Record<LoyaltySource, string> = {
  zakup: "Zakup (PLN → pkt)",
  voucher: "Bon",
  reczne: "Ręcznie",
  odbior: "Odebranie",
};
