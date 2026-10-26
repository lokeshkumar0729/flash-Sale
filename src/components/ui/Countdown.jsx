import { useEffect, useRef } from 'react'
import { useNow } from '../../hooks/useNow'
import { splitDuration } from '../../lib/format'

const pad = (n) => String(n).padStart(2, '0')

/**
 * Counts down to `to` (an ISO instant from the server). `onElapsed` fires once when it reaches zero, so the page
 * can refetch and show the sale as ended instead of leaving a stale timer on screen.
 */
export default function Countdown({ to, onElapsed, tone = 'light' }) {
  const now = useNow()
  const { days, hours, minutes, seconds, done } = splitDuration(new Date(to).getTime() - now)
  const fired = useRef(false)

  useEffect(() => {
    if (!done) {
      fired.current = false
    } else if (!fired.current) {
      fired.current = true
      onElapsed?.()
    }
  }, [done, onElapsed])

  const parts = [
    ...(days > 0 ? [[days, 'd']] : []),
    [pad(hours), 'h'],
    [pad(minutes), 'm'],
    [pad(seconds), 's'],
  ]
  const box = tone === 'dark' ? 'bg-white/10 text-white' : 'bg-navy text-white'

  return (
    <div role="timer" aria-label="Time remaining" className="flex items-center gap-1.5">
      {parts.map(([value, unit]) => (
        <span key={unit} className={`flex min-w-11 items-baseline justify-center gap-0.5 rounded-lg px-2 py-1.5 font-display text-lg font-bold tabular-nums ${box}`}>
          {value}
          <span className="text-[11px] font-semibold opacity-60">{unit}</span>
        </span>
      ))}
    </div>
  )
}
