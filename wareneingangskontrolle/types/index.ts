export interface Lieferant {
  name: string
  email: string
  address: string
  phone: string
  mwstNr: string
}

export interface Artikel {
  artikel: string
  menge: string
  einheit: string
  bemerkung: string
}

export interface FormData {
  lieferant: string
  lieferscheinNr: string
  lieferdatum: string
  kunde: string
  rechnungsadresse: string
  lieferadresse: string
}

export interface ValidationErrors {
  [key: string]: string
}
