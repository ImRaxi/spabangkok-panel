export type LoyaltyVoucher = {
  id: string;
  label: string;
  pointsCost: number;
  valuePln: number;
};

export const LOYALTY_VOUCHERS: LoyaltyVoucher[] = [
  {
    id: "v1",
    label: "Bon o wartości 29 PLN - 600 pkt.",
    pointsCost: 600,
    valuePln: 29,
  },
  {
    id: "v2",
    label: "Bon o wartości 50 PLN - 1000 pkt.",
    pointsCost: 1000,
    valuePln: 50,
  },
  {
    id: "v3",
    label: "Bon o wartości 100 PLN - 1800 pkt.",
    pointsCost: 1800,
    valuePln: 100,
  },
];
