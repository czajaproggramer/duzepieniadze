import type { BookingDraft, DB } from './types'

const KEY = 'kael-pet-grooming::db'
const DRAFT_KEY = 'kael-pet-grooming::draft'

export const DB_VERSION = 6

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`
}

export function loadDB(): DB | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DB
    // Zmiana struktury danych → czyścimy i siejemy od nowa.
    if (parsed.version !== DB_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export function saveDB(db: DB): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
  } catch (err) {
    console.warn('Nie udało się zapisać danych demo do localStorage', err)
  }
}

export function clearDB(): void {
  localStorage.removeItem(KEY)
}

export function loadDraft(): BookingDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? (JSON.parse(raw) as BookingDraft) : null
  } catch {
    return null
  }
}

export function saveDraft(draft: BookingDraft | null): void {
  try {
    if (draft) localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    else localStorage.removeItem(DRAFT_KEY)
  } catch (err) {
    console.warn('Nie udało się zapisać szkicu rezerwacji', err)
  }
}
