import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { serviceById } from '../data/services'
import { formatDateShort, nowStamp } from './date'
import { scanForFollowUps, sendFollowUps } from './followups'
import { clearDB, loadDB, loadDraft, saveDB, saveDraft, uid } from './storage'
import { seedDB } from './seed'
import type { Appointment, BookingDraft, DB, Message, Pet, User } from './types'

const SESSION_KEY = 'kael-pet-grooming::session'

interface StoreValue {
  db: DB
  user: User | null
  isAdmin: boolean
  // konto
  login: (email: string, password: string) => { ok: boolean; error?: string }
  register: (data: {
    name: string
    email: string
    phone: string
    password: string
  }) => { ok: boolean; error?: string }
  logout: () => void
  updateProfile: (patch: Partial<Pick<User, 'name' | 'phone'>>) => void
  // pupile
  addPet: (data: Omit<Pet, 'id' | 'ownerId'>) => Pet
  updatePet: (id: string, patch: Partial<Pet>) => void
  removePet: (id: string) => void
  // wizyty
  book: (data: {
    petId: string
    serviceId: string
    date: string
    time: string
    notes?: string
    paid?: boolean
    paymentMethod?: string
  }) => { ok: boolean; error?: string; appointment?: Appointment }
  cancelAppointment: (id: string) => void
  completeAppointment: (id: string) => void
  // wiadomości
  sendMessage: (data: Omit<Message, 'id' | 'createdAt' | 'read'>) => void
  setMessageRead: (id: string, read: boolean) => void
  removeMessage: (id: string) => void
  // powiadomienia klienta
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  // follow-upy
  runFollowUpScan: () => { created: number; sent: number }
  sendPendingFollowUps: () => number
  dismissFollowUp: (id: string) => void
  requeueFollowUp: (id: string) => void
  setAutoSend: (value: boolean) => void
  setLeadDays: (days: number) => void
  // szkic rezerwacji / onboarding
  draft: BookingDraft | null
  startDraft: (init: BookingDraft) => void
  patchDraft: (patch: Partial<BookingDraft>) => void
  clearDraft: () => void
  // demo
  resetDemo: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(() => loadDB() ?? seedDB())
  const [userId, setUserId] = useState<string | null>(() =>
    localStorage.getItem(SESSION_KEY),
  )
  const [draft, setDraft] = useState<BookingDraft | null>(() => loadDraft())
  const bootRan = useRef(false)

  useEffect(() => saveDB(db), [db])
  useEffect(() => saveDraft(draft), [draft])

  useEffect(() => {
    if (userId) localStorage.setItem(SESSION_KEY, userId)
    else localStorage.removeItem(SESSION_KEY)
  }, [userId])

  const user = useMemo(
    () => db.users.find((u) => u.id === userId) ?? null,
    [db.users, userId],
  )

  const log = (state: DB, text: string): DB['followUpLog'] => [
    { id: uid('log'), at: nowStamp(), text },
    ...state.followUpLog,
  ].slice(0, 40)

  /** Skan + (opcjonalnie) automatyczna wysyłka. Wspólne dla bootu i przycisku admina. */
  const runEngine = useCallback((auto: boolean) => {
    let result = { created: 0, sent: 0 }
    setDb((prev) => {
      const { followUps, created } = scanForFollowUps(prev)
      let next: DB = { ...prev, followUps }

      if (created.length) {
        next = {
          ...next,
          followUpLog: log(
            next,
            `${auto ? 'Automat' : 'Ręczny skan'}: wykryto ${created.length} ${plural(created.length, 'pupila', 'pupile', 'pupili')} do przypomnienia.`,
          ),
        }
      } else if (!auto) {
        next = { ...next, followUpLog: log(next, 'Ręczny skan: brak nowych follow-upów.') }
      }

      const shouldSend = auto ? next.settings.autoSendFollowUps : false
      let sentCount = 0
      if (shouldSend) {
        const pendingIds = next.followUps.filter((f) => f.status === 'pending').map((f) => f.id)
        if (pendingIds.length) {
          const res = sendFollowUps(next, pendingIds, true)
          sentCount = res.sent
          next = {
            ...next,
            followUps: res.followUps,
            notifications: res.notifications,
            followUpLog: log(next, `Automat wysłał ${res.sent} ${plural(res.sent, 'przypomnienie', 'przypomnienia', 'przypomnień')}.`),
          }
        }
      }

      result = { created: created.length, sent: sentCount }
      return next
    })
    return result
  }, [])

  // AUTOMAT: silnik follow-upów startuje razem z aplikacją.
  useEffect(() => {
    if (bootRan.current) return
    bootRan.current = true
    runEngine(true)
  }, [runEngine])

  const value: StoreValue = {
    db,
    user,
    isAdmin: user?.role === 'admin',

    login(email, password) {
      const found = db.users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
      )
      if (!found) return { ok: false, error: 'Nie znaleziono konta z tym adresem e-mail.' }
      if (found.password !== password) return { ok: false, error: 'Nieprawidłowe hasło.' }
      setUserId(found.id)
      return { ok: true }
    },

    register({ name, email, phone, password }) {
      const exists = db.users.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
      )
      if (exists) return { ok: false, error: 'Konto z tym e-mailem już istnieje.' }
      const newUser: User = {
        id: uid('u'),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role: 'client',
        createdAt: nowStamp(),
      }
      setDb((p) => ({ ...p, users: [...p.users, newUser] }))
      setUserId(newUser.id)
      return { ok: true }
    },

    logout() {
      setUserId(null)
    },

    updateProfile(patch) {
      if (!user) return
      setDb((p) => ({
        ...p,
        users: p.users.map((u) => (u.id === user.id ? { ...u, ...patch } : u)),
      }))
    },

    addPet(data) {
      const pet: Pet = { ...data, id: uid('p'), ownerId: user!.id }
      setDb((p) => ({ ...p, pets: [...p.pets, pet] }))
      return pet
    },

    updatePet(id, patch) {
      setDb((p) => ({
        ...p,
        pets: p.pets.map((pet) => (pet.id === id ? { ...pet, ...patch } : pet)),
      }))
    },

    removePet(id) {
      setDb((p) => ({
        ...p,
        pets: p.pets.filter((pet) => pet.id !== id),
        appointments: p.appointments.filter((a) => a.petId !== id),
        followUps: p.followUps.filter((f) => f.petId !== id),
        notifications: p.notifications.filter((n) => n.petId !== id),
      }))
    },

    book({ petId, serviceId, date, time, notes, paid, paymentMethod }) {
      const service = serviceById(serviceId)
      if (!service) return { ok: false, error: 'Nieznana usługa.' }
      if (!user) return { ok: false, error: 'Zaloguj się, aby zarezerwować wizytę.' }

      const start = toMin(time)
      const end = start + service.durationMin
      const conflict = db.appointments.some((a) => {
        if (a.date !== date || a.status === 'cancelled') return false
        const s = toMin(a.time)
        return start < s + a.durationMin && s < end
      })
      if (conflict) return { ok: false, error: 'Ten termin właśnie został zajęty. Wybierz inną godzinę.' }

      const appointment: Appointment = {
        id: uid('a'),
        clientId: user.id,
        petId,
        serviceId,
        date,
        time,
        durationMin: service.durationMin,
        price: service.price,
        status: 'scheduled',
        notes,
        createdAt: nowStamp(),
        paid,
        paymentMethod,
      }

      setDb((p) => ({
        ...p,
        appointments: [...p.appointments, appointment],
        // Rezerwacja zamyka otwarte przypomnienia dla tego psa.
        followUps: p.followUps.map((f) =>
          f.petId === petId && f.status !== 'dismissed' ? { ...f, status: 'dismissed' as const } : f,
        ),
      }))
      return { ok: true, appointment }
    },

    cancelAppointment(id) {
      setDb((p) => ({
        ...p,
        appointments: p.appointments.map((a) =>
          a.id === id ? { ...a, status: 'cancelled' as const } : a,
        ),
      }))
    },

    completeAppointment(id) {
      setDb((p) => ({
        ...p,
        appointments: p.appointments.map((a) =>
          a.id === id ? { ...a, status: 'completed' as const } : a,
        ),
      }))
    },

    sendMessage(data) {
      const msg: Message = { ...data, id: uid('msg'), createdAt: nowStamp(), read: false }
      setDb((p) => ({ ...p, messages: [msg, ...p.messages] }))
    },

    setMessageRead(id, read) {
      setDb((p) => ({
        ...p,
        messages: p.messages.map((m) => (m.id === id ? { ...m, read } : m)),
      }))
    },

    removeMessage(id) {
      setDb((p) => ({ ...p, messages: p.messages.filter((m) => m.id !== id) }))
    },

    markNotificationRead(id) {
      setDb((p) => ({
        ...p,
        notifications: p.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      }))
    },

    markAllNotificationsRead() {
      if (!user) return
      setDb((p) => ({
        ...p,
        notifications: p.notifications.map((n) =>
          n.clientId === user.id ? { ...n, read: true } : n,
        ),
      }))
    },

    runFollowUpScan() {
      return runEngine(false)
    },

    sendPendingFollowUps() {
      let sent = 0
      setDb((prev) => {
        const ids = prev.followUps.filter((f) => f.status === 'pending').map((f) => f.id)
        if (!ids.length) {
          return { ...prev, followUpLog: log(prev, 'Wysyłka ręczna: brak oczekujących follow-upów.') }
        }
        const res = sendFollowUps(prev, ids, false)
        sent = res.sent
        return {
          ...prev,
          followUps: res.followUps,
          notifications: res.notifications,
          followUpLog: log(
            prev,
            `Wysyłka ręczna z panelu: ${res.sent} ${plural(res.sent, 'wiadomość', 'wiadomości', 'wiadomości')}.`,
          ),
        }
      })
      return sent
    },

    dismissFollowUp(id) {
      setDb((p) => ({
        ...p,
        followUps: p.followUps.map((f) =>
          f.id === id ? { ...f, status: 'dismissed' as const } : f,
        ),
      }))
    },

    requeueFollowUp(id) {
      setDb((p) => ({
        ...p,
        followUps: p.followUps.map((f) =>
          f.id === id ? { ...f, status: 'pending' as const, sentAt: undefined } : f,
        ),
        followUpLog: log(p, 'Przypomnienie wróciło do kolejki (ponowna wysyłka).'),
      }))
    },

    setAutoSend(value) {
      setDb((p) => ({
        ...p,
        settings: { ...p.settings, autoSendFollowUps: value },
        followUpLog: log(p, `Automatyczna wysyłka ${value ? 'włączona' : 'wyłączona'}.`),
      }))
    },

    setLeadDays(days) {
      setDb((p) => ({ ...p, settings: { ...p.settings, leadDays: days } }))
    },

    draft,

    startDraft(init) {
      setDraft(init)
    },

    patchDraft(patch) {
      setDraft((prev) => ({ ...(prev ?? { stage: 'pet' }), ...patch }))
    },

    clearDraft() {
      setDraft(null)
    },

    resetDemo() {
      clearDB()
      saveDraft(null)
      setDraft(null)
      setUserId(null)
      bootRan.current = false
      setDb(seedDB())
    },
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore musi być użyty wewnątrz <StoreProvider>')
  return ctx
}

// ——— drobne pomocniki ———

function toMin(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/** Polska odmiana liczebników: 1 / 2-4 / 5+ */
export function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return few
  return many
}

export const displayDate = formatDateShort
