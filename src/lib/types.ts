/** Modele danych całego demo. Wszystko ląduje w localStorage (brak backendu). */

export type Role = 'client' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  /** Demo: hasło trzymane jawnie w localStorage. W produkcji — backend + hash. */
  password: string
  role: Role
  createdAt: string
}

/** Tempo odrastania futra — sterownik automatycznych follow-upów. */
export type GrowthRate = 'bardzo szybki' | 'szybki' | 'umiarkowany' | 'wolny'

export interface Breed {
  id: string
  name: string
  coat: string
  growthRate: GrowthRate
  /** Co ile tygodni rasa wymaga wizyty w salonie. */
  intervalWeeks: number
  /** Treść automatycznego follow-upu (zależna od rasy). */
  followUp: (petName: string, ownerFirstName: string, weeks: number) => string
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  durationMin: number
  /** Rasy, dla których usługa jest sugerowana; pusta lista = dla wszystkich. */
  breedIds: string[]
  category: 'strzyzenie' | 'kapiel' | 'dodatki'
  popular?: boolean
  /** true = cena orientacyjna (nie potwierdzona w cenniku Booksy). */
  estimatedPrice?: boolean
}

export interface Pet {
  id: string
  ownerId: string
  name: string
  breedId: string
  weightKg: number
  birthYear?: number
  notes?: string
  /** Data ostatniego strzyżenia sprzed startu demo (gdy brak wizyty w systemie). */
  lastGroomingDate?: string
}

/** Dane wpisywane w formularzu profilu pupila. */
export interface PetFormValues {
  name: string
  breedId: string
  weightKg: number
  birthYear?: number
  notes?: string
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled'

export interface Appointment {
  id: string
  clientId: string
  petId: string
  serviceId: string
  /** YYYY-MM-DD */
  date: string
  /** HH:MM */
  time: string
  durationMin: number
  price: number
  status: AppointmentStatus
  notes?: string
  createdAt: string
  /** Czy wizyta została opłacona online przy rezerwacji. */
  paid?: boolean
  /** Metoda płatności użyta w kroku płatności (demo). */
  paymentMethod?: string
}

/** Etap kreatora rezerwacji/onboardingu. */
export type BookingStage = 'pet' | 'account' | 'service' | 'slot' | 'payment' | 'done'

/**
 * Szkic rezerwacji zapamiętywany między krokami onboardingu.
 * Trzymany osobno w localStorage, żeby przetrwał założenie konta i logowanie —
 * dzięki temu po zalogowaniu użytkownik wraca dokładnie do wizyty, którą zaczął.
 */
export interface BookingDraft {
  stage: BookingStage
  /** Dane pupila wpisane, zanim powstało konto (gość). */
  pet?: PetFormValues
  /** Id pupila po jego utworzeniu lub wyborze. */
  petId?: string
  serviceId?: string
  date?: string
  time?: string
  notes?: string
  paymentMethod?: string
  /** Id utworzonej wizyty (na ekranie potwierdzenia). */
  appointmentId?: string
}

export interface Message {
  id: string
  fromName: string
  fromEmail: string
  phone?: string
  topic: string
  body: string
  createdAt: string
  read: boolean
  /** Skąd przyszła wiadomość: formularz kontaktowy czy panel klienta. */
  source: 'formularz' | 'panel klienta'
}

export type FollowUpStatus = 'pending' | 'sent' | 'dismissed'

export interface FollowUp {
  id: string
  petId: string
  clientId: string
  breedId: string
  /** Data, na którą wypada kolejne strzyżenie. */
  dueDate: string
  /** Ile tygodni minęło od ostatniej wizyty w momencie wygenerowania. */
  weeksSince: number
  text: string
  status: FollowUpStatus
  createdAt: string
  sentAt?: string
  /** true = wysłany przez automat, false = ręcznie z panelu admina. */
  auto?: boolean
}

export interface Notification {
  id: string
  clientId: string
  petId?: string
  title: string
  body: string
  createdAt: string
  read: boolean
  followUpId?: string
}

export interface Settings {
  /** Automat wysyła follow-upy sam, bez klikania w panelu. */
  autoSendFollowUps: boolean
  /** Ile dni przed terminem wysyłać przypomnienie. */
  leadDays: number
}

export interface DB {
  version: number
  users: User[]
  pets: Pet[]
  appointments: Appointment[]
  messages: Message[]
  followUps: FollowUp[]
  notifications: Notification[]
  settings: Settings
  /** Log działania automatu — pokazywany w panelu admina. */
  followUpLog: { id: string; at: string; text: string }[]
}
