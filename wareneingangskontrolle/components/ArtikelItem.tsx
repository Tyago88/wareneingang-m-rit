"use client"

import type { Artikel } from "../types"
import { Edit, Trash2 } from "lucide-react"

interface ArtikelItemProps {
  artikel: Artikel
  index: number
  onEdit: (index: number) => void
  onDelete: (index: number) => void
}

export function ArtikelItem({ artikel, index, onEdit, onDelete }: ArtikelItemProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="font-semibold text-slate-800 text-base">{artikel.artikel}</div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(index)}
            className="px-3 py-1.5 bg-amber-400 text-slate-800 rounded-md text-xs font-medium hover:bg-amber-500 transition-colors flex items-center gap-1"
          >
            <Edit size={12} />
            Bearbeiten
          </button>
          <button
            onClick={() => onDelete(index)}
            className="px-3 py-1.5 bg-red-500 text-white rounded-md text-xs font-medium hover:bg-red-600 transition-colors flex items-center gap-1"
          >
            <Trash2 size={12} />
            Löschen
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-600 leading-relaxed">
        <div>
          <strong>Menge:</strong> {artikel.menge} {artikel.einheit}
        </div>
        {artikel.bemerkung ? (
          <div>
            <strong>Bemerkung:</strong> {artikel.bemerkung}
          </div>
        ) : (
          <div className="italic">Keine Bemerkung</div>
        )}
      </div>
    </div>
  )
}
