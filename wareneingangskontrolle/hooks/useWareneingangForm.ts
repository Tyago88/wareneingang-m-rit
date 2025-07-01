"use client"

import { useState, useCallback } from "react"
import type { FormData, Artikel, ValidationErrors } from "../types"
import { FIXED_ADDRESSES } from "../data/constants"

export function useWareneingangForm() {
  const [formData, setFormData] = useState<FormData>({
    lieferant: "",
    lieferscheinNr: "",
    lieferdatum: new Date().toISOString().split("T")[0],
    kunde: FIXED_ADDRESSES.kunde,
    rechnungsadresse: FIXED_ADDRESSES.rechnungsadresse,
    lieferadresse: FIXED_ADDRESSES.lieferadresse,
  })

  const [artikelData, setArtikelData] = useState({
    artikel: "",
    menge: "",
    einheit: "",
    bemerkung: "",
  })

  const [hinzugefuegteArtikel, setHinzugefuegteArtikel] = useState<Artikel[]>([])
  const [editingIndex, setEditingIndex] = useState(-1)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [successMessage, setSuccessMessage] = useState("")

  const validateField = useCallback((fieldName: string, value: string) => {
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, [fieldName]: "Dieses Feld ist erforderlich." }))
      return false
    }

    if (fieldName === "menge" && (isNaN(Number(value)) || Number(value) <= 0)) {
      setErrors((prev) => ({ ...prev, [fieldName]: "Bitte geben Sie eine gültige Menge ein." }))
      return false
    }

    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
    return true
  }, [])

  const validateBasicForm = useCallback(() => {
    const requiredFields = ["lieferant", "lieferscheinNr"]
    let isValid = true

    requiredFields.forEach((field) => {
      if (!validateField(field, formData[field as keyof FormData])) {
        isValid = false
      }
    })

    return isValid
  }, [formData, validateField])

  const validateArtikelForm = useCallback(() => {
    const requiredFields = ["artikel", "menge", "einheit"]
    let isValid = true

    requiredFields.forEach((field) => {
      if (!validateField(field, artikelData[field as keyof typeof artikelData])) {
        isValid = false
      }
    })

    return isValid
  }, [artikelData, validateField])

  const addArtikel = useCallback(() => {
    if (!validateArtikelForm()) return

    const newArtikel: Artikel = {
      artikel: artikelData.artikel,
      menge: artikelData.menge,
      einheit: artikelData.einheit,
      bemerkung: artikelData.bemerkung,
    }

    if (editingIndex >= 0) {
      setHinzugefuegteArtikel((prev) => {
        const updated = [...prev]
        updated[editingIndex] = newArtikel
        return updated
      })
      setSuccessMessage("Artikel wurde aktualisiert!")
      setEditingIndex(-1)
    } else {
      setHinzugefuegteArtikel((prev) => [...prev, newArtikel])
      setSuccessMessage("Artikel wurde hinzugefügt!")
    }

    setArtikelData({ artikel: "", menge: "", einheit: "", bemerkung: "" })
    setTimeout(() => setSuccessMessage(""), 3000)
  }, [artikelData, editingIndex, validateArtikelForm])

  const editArtikel = useCallback(
    (index: number) => {
      const artikel = hinzugefuegteArtikel[index]
      setArtikelData(artikel)
      setEditingIndex(index)
    },
    [hinzugefuegteArtikel],
  )

  const deleteArtikel = useCallback(
    (index: number) => {
      if (window.confirm("Möchten Sie diesen Artikel wirklich löschen?")) {
        setHinzugefuegteArtikel((prev) => prev.filter((_, i) => i !== index))
        setSuccessMessage("Artikel wurde gelöscht!")

        if (editingIndex === index) {
          setArtikelData({ artikel: "", menge: "", einheit: "", bemerkung: "" })
          setEditingIndex(-1)
        }

        setTimeout(() => setSuccessMessage(""), 3000)
      }
    },
    [editingIndex],
  )

  return {
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
  }
}
