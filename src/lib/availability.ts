import type { Appointment } from './types'
import { addDays, minutesToTime, timeToMinutes, todayISO, weekdayIndex } from './date'

/**
 * Grafik salonu. Jeden stół groomerski = jedna wizyta w danym momencie.
 * Indeks 0 = poniedziałek … 6 = niedziela.
 */
export const OPENING_HOURS: ({ from: string; to: string } | null)[] = [
  { from: '10:00', to: '20:00' }, // pon
  { from: '10:00', to: '20:00' }, // wt
  { from: '10:00', to: '20:00' }, // śr
  { from: '10:00', to: '20:00' }, // czw
  { from: '10:00', to: '20:00' }, // pt
  { from: '10:00', to: '16:00' }, // sob
  null, // niedziela — nieczynne
]

/** Co ile minut zaczyna się kolejny możliwy slot. */
export const SLOT_STEP = 30

/** Ile dni do przodu można rezerwować. */
export const BOOKING_HORIZON_DAYS = 90

export function isOpen(dateIso: string): boolean {
  return OPENING_HOURS[weekdayIndex(dateIso)] !== null
}

export function openingLabel(dateIso: string): string {
  const h = OPENING_HOURS[weekdayIndex(dateIso)]
  return h ? `${h.from} – ${h.to}` : 'nieczynne'
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd
}

/** Wizyty blokujące grafik danego dnia. */
export function busySlots(appointments: Appointment[], dateIso: string) {
  return appointments
    .filter((a) => a.date === dateIso && a.status !== 'cancelled')
    .map((a) => ({
      start: timeToMinutes(a.time),
      end: timeToMinutes(a.time) + a.durationMin,
    }))
}

/**
 * Wolne godziny startu dla usługi o zadanym czasie trwania.
 * @param ignoreAppointmentId - pomija konkretną wizytę (przydatne przy zmianie terminu)
 */
export function availableSlots(
  appointments: Appointment[],
  dateIso: string,
  durationMin: number,
  ignoreAppointmentId?: string,
): string[] {
  const hours = OPENING_HOURS[weekdayIndex(dateIso)]
  if (!hours) return []

  const open = timeToMinutes(hours.from)
  const close = timeToMinutes(hours.to)
  const busy = busySlots(
    appointments.filter((a) => a.id !== ignoreAppointmentId),
    dateIso,
  )

  const today = todayISO()
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  const slots: string[] = []
  for (let start = open; start + durationMin <= close; start += SLOT_STEP) {
    if (dateIso < today) continue
    // Dziś: minimum 2 godziny wyprzedzenia.
    if (dateIso === today && start < nowMinutes + 120) continue
    if (busy.some((b) => overlaps(start, start + durationMin, b.start, b.end))) continue
    slots.push(minutesToTime(start))
  }
  return slots
}

export function hasAvailability(
  appointments: Appointment[],
  dateIso: string,
  durationMin: number,
): boolean {
  return availableSlots(appointments, dateIso, durationMin).length > 0
}

/** Najbliższe wolne terminy — używane w sekcji „kalendarz" na landingu. */
export function nextFreeSlots(
  appointments: Appointment[],
  durationMin: number,
  limit = 3,
): { date: string; time: string }[] {
  const out: { date: string; time: string }[] = []
  let cursor = todayISO()
  for (let i = 0; i < 45 && out.length < limit; i++) {
    const slots = availableSlots(appointments, cursor, durationMin)
    for (const time of slots) {
      out.push({ date: cursor, time })
      if (out.length >= limit) break
    }
    cursor = addDays(cursor, 1)
  }
  return out
}
