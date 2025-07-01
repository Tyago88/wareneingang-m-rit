import type { ReactNode } from "react"

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}

export function FormField({ label, required, error, children }: FormFieldProps) {
  return (
    <div className="mb-5">
      <label className="block mb-2 text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  )
}
