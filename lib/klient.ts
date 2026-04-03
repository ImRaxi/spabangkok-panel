export type Klient = {
  id: number;
  imie: string;
  nazwisko: string;
  login: string;
  email: string;
  telefon: string;
  adres: string;
  miasto: string;
  kodPocztowy: string;
  punkty: number;
};

export const INITIAL_KLIENCI: Klient[] = [
  {
    id: 1,
    imie: "Anna",
    nazwisko: "Nowak",
    login: "anna_nowak",
    email: "anna.nowak@email.pl",
    telefon: "+48 601 234 567",
    adres: "",
    miasto: "",
    kodPocztowy: "",
    punkty: 340,
  },
  {
    id: 2,
    imie: "Marek",
    nazwisko: "Kowal",
    login: "marek_k",
    email: "marek.kowal@gmail.com",
    telefon: "+48 512 000 111",
    adres: "",
    miasto: "",
    kodPocztowy: "",
    punkty: 120,
  },
  {
    id: 3,
    imie: "Klient",
    nazwisko: "Demo",
    login: "klient_demo",
    email: "demo@example.com",
    telefon: "+48 790 888 999",
    adres: "",
    miasto: "",
    kodPocztowy: "",
    punkty: 0,
  },
];

export function klientFullName(c: Klient) {
  return `${c.imie} ${c.nazwisko}`.trim();
}

export function klientAdresPlatnosci(c: Klient) {
  const parts = [c.adres, c.miasto, c.kodPocztowy].filter(Boolean);
  return parts.length ? parts.join(", ") : "—";
}
