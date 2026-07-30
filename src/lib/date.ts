/** Pomocniki dat — wszystko na stringach YYYY-MM-DD, bez stref czasowych. */

export const MONTHS = [
  'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
  'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień',
]

export const MONTHS_GEN = [
  'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
]

/** Poniedziałek = 0 (kalendarz w PL zaczyna tydzień od poniedziałku). */
export const WEEKDAYS_SHORT = ['pon', 'wt', 'śr', 'czw', 'pt', 'sob', 'nd']
export const WEEKDAYS_LONG = [
  'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela',
]

export function toISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayISO(): string {
  return toISO(new Date())
}

export function addDays(iso: string, days: number): string {
  const d = fromISO(iso)
  d.setDate(d.getDate() + days)
  return toISO(d)
}

export function addWeeks(iso: string, weeks: number): string {
  return addDays(iso, weeks * 7)
}

export function daysBetween(fromIso: string, toIso: string): number {
  const ms = fromISO(toIso).getTime() - fromISO(fromIso).getTime()
  return Math.round(ms / 86_400_000)
}

export function weeksBetween(fromIso: string, toIso: string): number {
  return Math.floor(daysBetween(fromIso, toIso) / 7)
}

/** 0 = poniedziałek … 6 = niedziela */
export function weekdayIndex(iso: string): number {
  return (fromISO(iso).getDay() + 6) % 7
}

export function formatDate(iso: string): string {
  const d = fromISO(iso)
  return `${d.getDate()} ${MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`
}

export function formatDateShort(iso: string): string {
  const d = fromISO(iso)
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}

export function formatDateWithWeekday(iso: string): string {
  return `${WEEKDAYS_LONG[weekdayIndex(iso)]}, ${formatDate(iso)}`
}

export function formatRelative(iso: string): string {
  const diff = daysBetween(todayISO(), iso)
  if (diff === 0) return 'dziś'
  if (diff === 1) return 'jutro'
  if (diff === -1) return 'wczoraj'
  if (diff > 1) return `za ${diff} dni`
  return `${Math.abs(diff)} dni temu`
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function minutesToTime(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatDuration(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} godz.`
  return `${h} godz. ${m} min`
}

export function nowStamp(): string {
  return new Date().toISOString()
}

export function formatStamp(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** Siatka miesiąca 6×7 z dopełnieniem z sąsiednich miesięcy. */
export function monthGrid(year: number, month: number): { iso: string; inMonth: boolean }[] {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7
  const start = new Date(year, month, 1 - offset)
  const cells: { iso: string; inMonth: boolean }[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    cells.push({ iso: toISO(d), inMonth: d.getMonth() === month })
  }
  return cells
}
