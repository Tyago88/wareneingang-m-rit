"use client";

import { Mail, FileText, Plus, Package, ClipboardList } from "lucide-react";
import { useWareneingangForm } from "../hooks/useWareneingangForm";
import { FormField } from "../components/FormField";
import { ArtikelItem } from "../components/ArtikelItem";
import { QuickReasonTags } from "../components/QuickReasonTags";
import { lieferanten, artikel, einheiten } from "../data/constants";
import { generateEmailContent, generateCSV, downloadCSV } from "../utils/export";

export default function Wareneingangskontrolle() {
  const {
    formData,
    setFormData,
    artikelData,
    setArtikelData,
    hinzugefuegteArtikel,
    editingIndex,
    errors,
    successMessage,
    validateField,
    validateBasicForm,
    addArtikel,
    editArtikel,
    deleteArtikel,
  } = useWareneingangForm();

  const handleReklamation = () => {
    if (!validateBasicForm()) {
      alert("Bitte füllen Sie alle Grunddaten aus.");
      return;
    }

    if (hinzugefuegteArtikel.length === 0) {
      alert("Bitte fügen Sie mindestens einen Artikel hinzu.");
      return;
    }

    try {
      const { email, subject, body } = generateEmailContent(formData, hinzugefuegteArtikel);
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
    } catch (error) {
      alert(error instanceof Error ? error.message : "Ein Fehler ist aufgetreten.");
    }
  };

  const handleProtokollSpeichern = () => {
    if (!validateBasicForm()) {
      alert("Bitte füllen Sie alle Grunddaten aus.");
      return;
    }

    if (hinzugefuegteArtikel.length === 0) {
      alert("Bitte fügen Sie mindestens einen Artikel hinzu.");
      return;
    }

    const csvContent = generateCSV(formData, hinzugefuegteArtikel);
    const today = new Date().toISOString().split("T")[0];
    const filename = `Wareneingang_${today}_${formData.lieferscheinNr}.csv`;

    downloadCSV(csvContent, filename);
  };

  const handleReasonSelect = (reason: string) => {
    const currentValue = artikelData.bemerkung.trim();

    if (currentValue === "") {
      setArtikelData((prev) => ({ ...prev, bemerkung: reason }));
    } else {
      if (!currentValue.includes(reason)) {
        setArtikelData((prev) => ({ ...prev, bemerkung: currentValue + "; " + reason }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-6 text-center text-white">
          <h1 className="text-2xl font-semibold mb-2 flex items-center justify-center gap-2">
            <Package size={28} />
            Wareneingangskontrolle
          </h1>
          <p className="text-sm opacity-90">Märitkorb - Mobile Bio-Warenkontrolle</p>
        </div>

        <div className="p-6">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-5 text-sm">
              {successMessage}
            </div>
          )}

          {/* Grunddaten */}
          <FormField label="Lieferant" required error={errors.lieferant}>
            <select
              value={formData.lieferant}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, lieferant: e.target.value }));
                validateField("lieferant", e.target.value);
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:border-indigo-500 focus:outline-none transition-colors"
            >
              <option value="">Bitte wählen...</option>
              {lieferanten.map((lieferant) => (
                <option key={lieferant.name} value={lieferant.name}>
                  {lieferant.name}
                </option>
              ))}
            </select>
          </FormField>

          {formData.lieferant && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm">
              {(() => {
                const selectedLieferant = lieferanten.find((l) => l.name === formData.lieferant);
                if (!selectedLieferant || !selectedLieferant.address) return null;
                return (
                  <div className="space-y-1 text-blue-800">
                    <div>
                      <strong>Adresse:</strong> {selectedLieferant.address}
                    </div>
                    {selectedLieferant.phone && (
                      <div>
                        <strong>Telefon:</strong> {selectedLieferant.phone}
                      </div>
                    )}
                    {selectedLieferant.email && (
                      <div>
                        <strong>E-Mail:</strong> {selectedLieferant.email}
                      </div>
                    )}
                    {selectedLieferant.mwstNr && (
                      <div>
                        <strong>MwSt-Nr:</strong> {selectedLieferant.mwstNr}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          <FormField label="Lieferschein-Nr." required error={errors.lieferscheinNr}>
            <input
              type="text"
              value={formData.lieferscheinNr}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, lieferscheinNr: e.target.value }));
                validateField("lieferscheinNr", e.target.value);
              }}
              placeholder="Geben Sie die Lieferschein-Nummer ein"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </FormField>

          <FormField label="Lieferdatum" error={errors.lieferdatum}>
            <input
              type="date"
              value={formData.lieferdatum}
              onChange={(e) => setFormData((prev) => ({ ...prev, lieferdatum: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </FormField>

          {/* Artikel-Verwaltung */}
          <div className="text-lg font-semibold text-slate-800 mt-6 mb-4 pb-2 border-b-2 border-gray-100 flex items-center gap-2">
            <ClipboardList size={20} />
            Artikel verwalten
          </div>

          {/* Artikel-Liste */}
          {hinzugefuegteArtikel.length > 0 && (
            <div className="mb-5">
              <div className="bg-green-500 text-white px-3 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1 mb-4">
                <Package size={14} />
                {hinzugefuegteArtikel.length} Artikel hinzugefügt
              </div>

              {hinzugefuegteArtikel.map((artikel, index) => (
                <ArtikelItem
                  key={index}
                  artikel={artikel}
                  index={index}
                  onEdit={editArtikel}
                  onDelete={deleteArtikel}
                />
              ))}
            </div>
          )}

          {hinzugefuegteArtikel.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <ClipboardList size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-medium">Noch keine Artikel hinzugefügt</p>
              <p className="text-sm">Fügen Sie unten Artikel zu diesem Lieferschein hinzu.</p>
            </div>
          )}

          {/* Artikel hinzufügen */}
          <div className="bg-gray-50 p-5 rounded-xl border-2 border-dashed border-gray-300 mb-6">
            <div className="text-center mb-4 font-semibold text-slate-700 flex items-center justify-center gap-2">
              <Plus size={18} />
              {editingIndex >= 0 ? "Artikel bearbeiten" : "Neuen Artikel hinzufügen"}
            </div>

            <FormField label="Artikel" required error={errors.artikel}>
              <select
                value={artikelData.artikel}
                onChange={(e) => {
                  setArtikelData((prev) => ({ ...prev, artikel: e.target.value }));
                  validateField("artikel", e.target.value);
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="">Bitte wählen...</option>
                {Object.entries(artikel).map(([kategorie, artikelListe]) => (
                  <optgroup key={kategorie} label={kategorie}>
                    {artikelListe.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </FormField>

            <FormField label="Menge" required error={errors.menge}>
              <input
                type="number"
                value={artikelData.menge}
                onChange={(e) => {
                  setArtikelData((prev) => ({ ...prev, menge: e.target.value }));
                  validateField("menge", e.target.value);
                }}
                min="0"
                step="0.01"
                placeholder="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </FormField>

            <FormField label="Einheit" required error={errors.einheit}>
              <select
                value={artikelData.einheit}
                onChange={(e) => {
                  setArtikelData((prev) => ({ ...prev, einheit: e.target.value }));
                  validateField("einheit", e.target.value);
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="">Bitte wählen...</option>
                {einheiten.map((einheit) => (
                  <option key={einheit} value={einheit}>
                    {einheit}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Beanstandung/Bemerkung">
              <textarea
                value={artikelData.bemerkung}
                onChange={(e) => setArtikelData((prev) => ({ ...prev, bemerkung: e.target.value }))}
                placeholder="Optionale Beanstandung oder Bemerkung eingeben..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:border-indigo-500 focus:outline-none transition-colors resize-none"
              />
              <QuickReasonTags onReasonSelect={handleReasonSelect} />
            </FormField>

            <button
              onClick={addArtikel}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-4 rounded-xl font-semibold text-base hover:from-orange-500 hover:to-orange-600 transition-all transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              {editingIndex >= 0 ? "Artikel aktualisieren" : "Artikel hinzufügen"}
            </button>
          </div>

          {/* Info Box */}
          {hinzugefuegteArtikel.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6 text-sm text-center">
              💡 Fügen Sie mindestens einen Artikel hinzu, um Aktionen auszuführen.
            </div>
          )}

          {/* Aktionen */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleReklamation}
              disabled={hinzugefuegteArtikel.length === 0}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Mail size={18} />
              E-Mail senden
            </button>

            <button
              onClick={handleProtokollSpeichern}
              disabled={hinzugefuegteArtikel.length === 0}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 rounded-xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-500 hover:to-teal-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <FileText size={18} />
              CSV-Protokoll speichern
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center text-xs text-gray-500">
          <p>&copy; 2025 Märitkorb Wareneingangskontrolle • Gehostet auf cyon.ch</p>
        </div>
      </div>
    </div>
  );
}
