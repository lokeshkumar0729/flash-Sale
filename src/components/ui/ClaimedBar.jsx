/** "62% claimed" bar. Turns red when few units are left, because that is the point of a flash sale. */
export default function ClaimedBar({ sold, total, tone = 'light', compact = false }) {
  const percent = total > 0 ? Math.min(100, Math.round((sold / total) * 100)) : 0
  const remaining = Math.max(0, total - sold)
  const low = remaining > 0 && percent >= 75
  const track = tone === 'dark' ? 'bg-white/15' : 'bg-slate-200'
  const text = tone === 'dark' ? 'text-white/80' : 'text-slate-600'

  return (
    <div>
      <div
        role="progressbar"
        aria-label="Share of the flash sale already claimed"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`h-2 overflow-hidden rounded-full ${track}`}
      >
        <div className={`h-full rounded-full transition-all ${low || remaining === 0 ? 'bg-brand' : 'bg-amber-400'}`} style={{ width: `${percent}%` }} />
      </div>
      {!compact && (
        <div className={`mt-1.5 flex justify-between text-xs font-medium ${text}`}>
          <span>{percent}% claimed</span>
          <span className={low ? 'font-bold text-brand' : ''}>
            {remaining === 0 ? 'Sold out' : `Only ${remaining} left`}
          </span>
        </div>
      )}
    </div>
  )
}
