// ✅ NETLIFY OPTIMIERUNG: Absolute Imports für bessere Build-Stabilität
import type { FormData, Artikel } from "@/types"
import { lieferanten } from "@/data/constants"

export function generateEmailContent(formData: FormData, artikel: Artikel[]) {
  const lieferantData = lieferanten.find((l) => l.name === formData.lieferant)

  if (!lieferantData?.email) {
    throw new Error("Für diesen Lieferanten ist keine E-Mail-Adresse hinterlegt.")
  }

  const betreff = "Wareneingangskontrolle"

  // Create table for defective articles
  let artikelTabelle = "Mangelhafte Artikel:\n\n"
  artikelTabelle += "Artikel\t\tMenge\t\tEinheit\t\tBemerkung\n"
  artikelTabelle += "".padEnd(60, "-") + "\n"

  artikel.forEach((artikel) => {
    artikelTabelle += `${artikel.artikel}\t\t${artikel.menge}\t\t${artikel.einheit}\t\t${artikel.bemerkung || "Keine Angabe"}\n`
  })

  const emailText = `Sehr geehrte Damen und Herren,

hiermit bestätigen wir den Erhalt der folgenden Waren:

Kunde: ${formData.kunde}
Rechnungsadresse: ${formData.rechnungsadresse}
Lieferadresse: ${formData.lieferadresse}
Lieferscheinnummer: ${formData.lieferscheinNr}
Datum: ${formatDate(formData.lieferdatum)}

${artikelTabelle}

Bemerkungen:
Wir haben bei der Wareneingangskontrolle leider ein paar Mängel festgestellt. Wir wären Ihnen dankbar, wenn Sie uns für die betroffenen Artikel eine Gutschrift ausstellen könnten.

Vielen Dank für Ihr Verständnis und Ihre Bemühungen.

Mit freundlichen Grüssen

Yairo vom Team Märitkorb`

  return {
    email: lieferantData.email,
    subject: betreff,
    body: emailText,
  }
}

export function generateCSV(formData: FormData, artikel: Artikel[]) {
  const csvHeader = "Lieferschein_ID;Lieferant;Lieferdatum;Artikelbezeichnung;Menge;Einheit;Bemerkung\n"

  let csvRows = ""
  artikel.forEach((artikel) => {
    csvRows += `${formData.lieferscheinNr};${formData.lieferant};${formData.lieferdatum};${artikel.artikel};${artikel.menge};${artikel.einheit};${artikel.bemerkung}\n`
  })

  return csvHeader + csvRows
}

export function downloadCSV(content: string, filename: string) {
  const BOM = "\uFEFF"
  const blob = new Blob([BOM + content], { type: "text/csv;charset=utf-8;" })

  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("de-DE")
}
