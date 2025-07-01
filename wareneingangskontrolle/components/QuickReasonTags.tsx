"use client"

import { quickReasons } from "../data/constants"

interface QuickReasonTagsProps {
  onReasonSelect: (reason: string) => void
}

export function QuickReasonTags({ onReasonSelect }: QuickReasonTagsProps) {
  return (
    <div className="mt-3">
      <div className="text-xs text-gray-500 mb-2">Häufige Beanstandungen (zum Auswählen):</div>
      <div className="flex flex-wrap gap-2">
        {quickReasons.map((reason) => (
          <button
            key={reason}
            type="button"
            onClick={() => onReasonSelect(reason)}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-red-500 hover:text-white transition-all duration-200 transform hover:-translate-y-0.5"
          >
            {reason}
          </button>
        ))}
      </div>
    </div>
  )
}
