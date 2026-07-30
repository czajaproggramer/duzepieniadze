import { useState } from 'react'
import {
  MONTHS,
  WEEKDAYS_SHORT,
  addDays,
  monthGrid,
  todayISO,
  fromISO,
} from '../lib/date'
import { BOOKING_HORIZON_DAYS, hasAvailability, isOpen } from '../lib/availability'
import type { Appointment } from '../lib/types'
import { Icon } from './Icon'

interface CalendarProps {
  appointments: Appointment[]
  durationMin: number
  selected: string | null
  onSelect: (dateIso: string) => void
}

export function Calendar({ appointments, durationMin, selected, onSelect }: CalendarProps) {
  const today = todayISO()
  const maxDate = addDays(today, BOOKING_HORIZON_DAYS)
  const start = fromISO(selected ?? today)
  const [view, setView] = useState({ year: start.getFullYear(), month: start.getMonth() })

  const cells = monthGrid(view.year, view.month)
  const firstOfView = `${view.year}-${String(view.month + 1).padStart(2, '0')}-01`
  const canGoBack = firstOfView > today
  const canGoForward = firstOfView < maxDate.slice(0, 8) + '01'

  const shift = (delta: number) => {
    const d = new Date(view.year, view.month + delta, 1)
    setView({ year: d.getFullYear(), month: d.getMonth() })
  }

  return (
    <div className="calendar">
      <div className="cal-head">
        <h4>
          {MONTHS[view.month]} {view.year}
        </h4>
        <div className="cal-nav">
          <button onClick={() => shift(-1)} disabled={!canGoBack} aria-label="Poprzedni miesiąc">
            <Icon name="chevronLeft" size={16} />
          </button>
          <button onClick={() => shift(1)} disabled={!canGoForward} aria-label="Następny miesiąc">
            <Icon name="chevronRight" size={16} />
          </button>
        </div>
      </div>

      <div className="cal-grid">
        {WEEKDAYS_SHORT.map((w) => (
          <div className="cal-wd" key={w}>
            {w}
          </div>
        ))}

        {cells.map(({ iso, inMonth }) => {
          const past = iso < today
          const tooFar = iso > maxDate
          const closed = !isOpen(iso)
          const free = !past && !tooFar && !closed && hasAvailability(appointments, iso, durationMin)
          const disabled = past || tooFar || closed || !free

          const cls = [
            'cal-day',
            inMonth ? '' : 'out',
            iso === today ? 'today' : '',
            iso === selected ? 'selected' : '',
            free ? 'free' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <button
              key={iso}
              className={cls}
              disabled={disabled}
              onClick={() => onSelect(iso)}
              title={
                closed
                  ? 'Nieczynne'
                  : past
                    ? 'Termin minął'
                    : free
                      ? 'Są wolne godziny'
                      : 'Brak wolnych godzin'
              }
            >
              {fromISO(iso).getDate()}
            </button>
          )
        })}
      </div>

      <div className="cal-legend">
        <span>
          <i style={{ background: 'var(--cream)' }} />
          wolne terminy
        </span>
        <span>
          <i style={{ background: '#fff', border: '1px solid var(--line)' }} />
          brak miejsc lub nieczynne
        </span>
        <span>
          <i style={{ background: 'var(--ink)' }} />
          wybrany dzień
        </span>
      </div>
    </div>
  )
}
