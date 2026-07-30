import { breedById } from '../data/breeds'
import { addWeeks, daysBetween, nowStamp, todayISO, weeksBetween } from './date'
import type { DB, FollowUp, Notification, Pet } from './types'
import { uid } from './storage'

/**
 * SILNIK AUTOMATYCZNYCH FOLLOW-UPÓW
 * ---------------------------------
 * Dla każdego psa liczy termin kolejnego strzyżenia na podstawie tempa wzrostu
 * futra jego rasy (`Breed.intervalWeeks`) i daty ostatniej wizyty.
 * Gdy termin wypada w ciągu najbliższych `settings.leadDays` dni (albo już minął),
 * generuje spersonalizowaną wiadomość zależną od rasy.
 *
 * Silnik uruchamia się sam przy starcie aplikacji (patrz `store.tsx`),
 * a panel admina pozwala go dodatkowo wywołać ręcznie i podejrzeć kolejkę.
 */

export interface PetSchedule {
  pet: Pet
  ownerId: string
  ownerName: string
  breedName: string
  intervalWeeks: number
  lastVisit: string | null
  dueDate: string | null
  /** Ujemne = po terminie. */
  daysUntilDue: number | null
  weeksSince: number
  state: 'brak-historii' | 'ok' | 'zbliza-sie' | 'po-terminie'
}

/** Data ostatniej zrealizowanej wizyty psa (lub data sprzed startu demo). */
export function lastVisitDate(db: DB, pet: Pet): string | null {
  const past = db.appointments
    .filter((a) => a.petId === pet.id && a.status === 'completed')
    .map((a) => a.date)
    .sort()
  const last = past.length ? past[past.length - 1] : null
  if (last && pet.lastGroomingDate) return last > pet.lastGroomingDate ? last : pet.lastGroomingDate
  return last ?? pet.lastGroomingDate ?? null
}

/** Czy pies ma już umówioną przyszłą wizytę (wtedy nie przypominamy). */
export function hasUpcomingVisit(db: DB, petId: string): boolean {
  const today = todayISO()
  return db.appointments.some(
    (a) => a.petId === petId && a.status === 'scheduled' && a.date >= today,
  )
}

export function petSchedule(db: DB, pet: Pet, leadDays: number): PetSchedule {
  const breed = breedById(pet.breedId)
  const owner = db.users.find((u) => u.id === pet.ownerId)
  const last = lastVisitDate(db, pet)
  const today = todayISO()

  if (!last) {
    return {
      pet,
      ownerId: pet.ownerId,
      ownerName: owner?.name ?? '—',
      breedName: breed.name,
      intervalWeeks: breed.intervalWeeks,
      lastVisit: null,
      dueDate: null,
      daysUntilDue: null,
      weeksSince: 0,
      state: 'brak-historii',
    }
  }

  const dueDate = addWeeks(last, breed.intervalWeeks)
  const daysUntilDue = daysBetween(today, dueDate)
  const state =
    daysUntilDue < 0 ? 'po-terminie' : daysUntilDue <= leadDays ? 'zbliza-sie' : 'ok'

  return {
    pet,
    ownerId: pet.ownerId,
    ownerName: owner?.name ?? '—',
    breedName: breed.name,
    intervalWeeks: breed.intervalWeeks,
    lastVisit: last,
    dueDate,
    daysUntilDue,
    weeksSince: Math.max(0, weeksBetween(last, today)),
    state,
  }
}

export function allSchedules(db: DB): PetSchedule[] {
  return db.pets
    .map((p) => petSchedule(db, p, db.settings.leadDays))
    .sort((a, b) => (a.daysUntilDue ?? 9999) - (b.daysUntilDue ?? 9999))
}

/**
 * Skanuje wszystkie pupile i tworzy brakujące follow-upy.
 * Zwraca nową listę follow-upów + liczbę nowo utworzonych.
 */
export function scanForFollowUps(db: DB): { followUps: FollowUp[]; created: FollowUp[] } {
  const created: FollowUp[] = []
  const followUps = [...db.followUps]

  for (const pet of db.pets) {
    const s = petSchedule(db, pet, db.settings.leadDays)
    if (s.state !== 'po-terminie' && s.state !== 'zbliza-sie') continue
    if (!s.dueDate) continue
    if (hasUpcomingVisit(db, pet.id)) continue

    // Nie duplikujemy przypomnienia dla tego samego terminu.
    const exists = followUps.some(
      (f) => f.petId === pet.id && f.dueDate === s.dueDate && f.status !== 'dismissed',
    )
    if (exists) continue

    const breed = breedById(pet.breedId)
    const owner = db.users.find((u) => u.id === pet.ownerId)
    const firstName = (owner?.name ?? 'Kliencie').split(' ')[0]

    const fu: FollowUp = {
      id: uid('fu'),
      petId: pet.id,
      clientId: pet.ownerId,
      breedId: pet.breedId,
      dueDate: s.dueDate,
      weeksSince: s.weeksSince,
      text: breed.followUp(pet.name, firstName, s.weeksSince),
      status: 'pending',
      createdAt: nowStamp(),
    }
    followUps.push(fu)
    created.push(fu)
  }

  return { followUps, created }
}

/** Oznacza follow-upy jako wysłane i tworzy powiadomienia w panelach klientów. */
export function sendFollowUps(
  db: DB,
  ids: string[],
  auto: boolean,
): { followUps: FollowUp[]; notifications: Notification[]; sent: number } {
  const stamp = nowStamp()
  const notifications = [...db.notifications]
  let sent = 0

  const followUps = db.followUps.map((f) => {
    if (!ids.includes(f.id) || f.status !== 'pending') return f
    sent++
    const pet = db.pets.find((p) => p.id === f.petId)
    notifications.unshift({
      id: uid('ntf'),
      clientId: f.clientId,
      petId: f.petId,
      title: `Czas na wizytę: ${pet?.name ?? 'Twój pupil'}`,
      body: f.text,
      createdAt: stamp,
      read: false,
      followUpId: f.id,
    })
    return { ...f, status: 'sent' as const, sentAt: stamp, auto }
  })

  return { followUps, notifications, sent }
}
