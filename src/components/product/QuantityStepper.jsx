import { Minus, Plus } from 'lucide-react'

export default function QuantityStepper({ value, onChange, max = 10, label = 'Quantity' }) {
  const button =
    'flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40'
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-xl border border-line bg-white p-0.5">
      <button className={button} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-9 text-center text-sm font-bold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button className={button} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
