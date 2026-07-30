import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Calendar } from '../components/Calendar'
import { Avatar, Icon, IconChip, type IconName } from '../components/Icon'
import { PetForm } from '../components/PetForm'
import { useToast } from '../components/Toast'
import { breedById } from '../data/breeds'
import { matchesWeight, serviceById, servicesForBreed } from '../data/services'
import { availableSlots, openingLabel } from '../lib/availability'
import { formatDateWithWeekday, formatDuration } from '../lib/date'
import { useStore } from '../lib/store'
import type {
  BookingDraft,
  BookingStage,
  Pet,
  PetFormValues,
  Service,
  User,
} from '../lib/types'

const SERVICE_ICON: Record<Service['category'], IconName> = {
  strzyzenie: 'scissors',
  kapiel: 'droplet',
  dodatki: 'paw',
}

const STAGE_LABEL: Record<Exclude<BookingStage, 'done'>, string> = {
  pet: 'Pupil',
  account: 'Konto',
  service: 'Usługa',
  slot: 'Termin',
  payment: 'Płatność',
}

/** Dokąd trafić po tym, jak profil pupila jest już gotowy (utworzony lub wybrany). */
function nextAfterPet(draft: BookingDraft): BookingStage {
  if (!draft.serviceId) return 'service'
  if (!draft.date || !draft.time) return 'slot'
  return 'payment'
}

export function Booking() {
  const { db, user, draft, startDraft, patchDraft, clearDraft, addPet, book } = useStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [toast, showToast] = useToast()
  const petCreated = useRef(false)

  useEffect(() => window.scrollTo(0, 0), [])

  // Wejście na stronę bez szkicu = start nowej rezerwacji. Parametry z landingu
  // (usługa/data/godzina) trafiają do szkicu, żeby nic nie zginęło.
  useEffect(() => {
    if (!draft) {
      startDraft({
        stage: 'pet',
        serviceId: params.get('usluga') ?? undefined,
        date: params.get('data') ?? undefined,
        time: params.get('godzina') ?? undefined,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Gdy pojawi się zalogowany użytkownik, a mamy dane pupila wpisane jako gość —
  // tworzymy profil pupila i przechodzimy dalej. To ten sam mechanizm, który
  // wznawia rezerwację po zalogowaniu przez OAuth lub istniejące konto.
  useEffect(() => {
    if (!user || !draft) return
    if (draft.pet && !draft.petId) {
      if (petCreated.current) return
      petCreated.current = true
      const pet = addPet(draft.pet)
      patchDraft({ petId: pet.id, pet: undefined, stage: nextAfterPet({ ...draft, petId: pet.id }) })
    } else if (draft.stage === 'account') {
      patchDraft({ stage: nextAfterPet(draft) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, draft])

  const service = draft?.serviceId ? (serviceById(draft.serviceId) ?? null) : null
  const pet = draft?.petId ? (db.pets.find((p) => p.id === draft.petId) ?? null) : null
  const myPets = useMemo(
    () => (user ? db.pets.filter((p) => p.ownerId === user.id) : []),
    [db.pets, user],
  )

  if (!draft) return null

  // Kolejność kroków zależy od tego, czy trzeba założyć konto.
  const flow: Exclude<BookingStage, 'done'>[] = user
    ? ['pet', 'service', 'slot', 'payment']
    : ['pet', 'account', 'service', 'slot', 'payment']
  const activeStage = draft.stage === 'done' ? 'payment' : draft.stage
  const currentIdx = flow.indexOf(activeStage)
  const prevStage = currentIdx > 0 ? flow[currentIdx - 1] : null

  const handlePetSubmit = (values: PetFormValues) => {
    if (user) {
      const created = addPet(values)
      patchDraft({ petId: created.id, stage: nextAfterPet({ ...draft, petId: created.id }) })
      showToast(`Profil ${created.name} zapisany.`)
    } else {
      // Gość: zapamiętujemy dane pupila i przechodzimy do zakładania konta.
      patchDraft({ pet: values, stage: 'account' })
    }
  }

  const handlePay = (method: string) => {
    if (!draft.petId || !draft.serviceId || !draft.date || !draft.time) return
    const res = book({
      petId: draft.petId,
      serviceId: draft.serviceId,
      date: draft.date,
      time: draft.time,
      notes: draft.notes,
      paid: true,
      paymentMethod: method,
    })
    if (!res.ok || !res.appointment) {
      showToast(res.error ?? 'Płatność nie powiodła się.')
      // Termin mógł zostać zajęty — wróć do wyboru godziny.
      patchDraft({ stage: 'slot', time: undefined })
      return
    }
    patchDraft({ stage: 'done', appointmentId: res.appointment.id, paymentMethod: method })
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 880 }}>
        <div className="page-head">
          <div>
            <span className="eyebrow">Rezerwacja online</span>
            <h1>
              Umów <span className="accent">wizytę</span>
            </h1>
            <p>
              {user
                ? 'Wybierz pupila, usługę i termin, a na końcu opłać wizytę.'
                : 'Zacznij od profilu pupila. Konto założysz w kolejnym kroku.'}
            </p>
          </div>
          {draft.stage !== 'done' && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                if (confirm('Zacząć rezerwację od nowa? Wpisane dane zostaną wyczyszczone.')) {
                  petCreated.current = false
                  clearDraft()
                  startDraft({ stage: 'pet' })
                }
              }}
            >
              Zacznij od nowa
            </button>
          )}
        </div>

        {draft.stage !== 'done' && (
          <div className="steps">
            {flow.map((s, i) => (
              <div
                key={s}
                className={`step ${i < currentIdx ? 'done' : ''} ${i === currentIdx ? 'active' : ''}`}
              >
                <i>{i < currentIdx ? <Icon name="check" size={12} strokeWidth={2.2} /> : i + 1}</i>
                {STAGE_LABEL[s]}
              </div>
            ))}
          </div>
        )}

        {draft.stage === 'pet' && (
          <PetStep
            user={user}
            myPets={myPets}
            selectedId={draft.petId}
            onSubmit={handlePetSubmit}
            onPick={(id) => patchDraft({ petId: id, stage: nextAfterPet({ ...draft, petId: id }) })}
          />
        )}

        {draft.stage === 'account' && (
          <AccountStep onBack={prevStage ? () => patchDraft({ stage: prevStage }) : undefined} />
        )}

        {draft.stage === 'service' && pet && (
          <ServiceStep
            pet={pet}
            selectedId={draft.serviceId}
            onPick={(id) =>
              patchDraft({ serviceId: id, stage: draft.date && draft.time ? 'payment' : 'slot' })
            }
            onBack={prevStage ? () => patchDraft({ stage: prevStage }) : undefined}
          />
        )}

        {draft.stage === 'slot' && pet && service && (
          <SlotStep
            service={service}
            date={draft.date ?? null}
            time={draft.time ?? null}
            onPickDate={(d) => patchDraft({ date: d, time: undefined })}
            onPickTime={(t) => patchDraft({ time: t, stage: 'payment' })}
            onBack={() => patchDraft({ stage: 'service' })}
          />
        )}

        {draft.stage === 'payment' && pet && service && draft.date && draft.time && (
          <PaymentStep
            pet={pet}
            service={service}
            date={draft.date}
            time={draft.time}
            notes={draft.notes ?? ''}
            onNotes={(v) => patchDraft({ notes: v })}
            onPay={handlePay}
            onBack={() => patchDraft({ stage: 'slot' })}
          />
        )}

        {draft.stage === 'done' && draft.appointmentId && (
          <DoneStep
            appointmentId={draft.appointmentId}
            onFinish={() => {
              petCreated.current = false
              clearDraft()
              navigate('/konto?rezerwacja=ok')
            }}
          />
        )}
      </div>
      {toast}
    </div>
  )
}

/* ─────────────────────────── KROK: PUPIL ─────────────────────────── */

function PetStep({
  user,
  myPets,
  selectedId,
  onSubmit,
  onPick,
}: {
  user: User | null
  myPets: Pet[]
  selectedId?: string
  onSubmit: (values: PetFormValues) => void
  onPick: (id: string) => void
}) {
  const [adding, setAdding] = useState(false)

  // Gość zawsze zaczyna od utworzenia profilu pupila.
  if (!user) {
    return (
      <section className="card">
        <h3 className="mt-0">Profil Twojego pupila</h3>
        <p className="text-muted small">
          Podaj imię, rasę, wagę i wiek psa. Dzięki temu dobierzemy usługę i policzymy,
          kiedy futro odrośnie. W następnym kroku założysz konto opiekuna.
        </p>
        <PetForm submitLabel="Dalej: konto opiekuna" onSubmit={onSubmit} />
      </section>
    )
  }

  // Zalogowany: wybór spośród swoich pupili albo dodanie nowego.
  return (
    <section className="card">
      <div className="flex-between">
        <h3 className="mt-0 mb-0">Kogo przyprowadzasz?</h3>
        {myPets.length > 0 && !adding && (
          <button className="btn btn-ghost btn-sm" onClick={() => setAdding(true)}>
            <Icon name="plus" size={15} />
            Dodaj kolejnego pupila
          </button>
        )}
      </div>

      {adding || myPets.length === 0 ? (
        <div className="mt-2">
          {myPets.length === 0 && (
            <p className="text-muted small">Dodaj profil pupila, aby przejść dalej.</p>
          )}
          <PetForm
            submitLabel="Dodaj i wybierz"
            onSubmit={onSubmit}
            onCancel={myPets.length > 0 ? () => setAdding(false) : undefined}
          />
        </div>
      ) : (
        <div className="list mt-2">
          {myPets.map((p) => {
            const breed = breedById(p.breedId)
            return (
              <button
                key={p.id}
                className={`choice ${p.id === selectedId ? 'selected' : ''}`}
                onClick={() => onPick(p.id)}
              >
                <Avatar label={p.name} />
                <span className="grow">
                  <b>{p.name}</b>
                  <span className="meta">
                    {breed.name} · {p.weightKg} kg
                    {p.notes ? ` · ${p.notes}` : ''}
                  </span>
                </span>
                <Icon name="arrowRight" size={18} />
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}

/* ─────────────────────────── KROK: KONTO ─────────────────────────── */

function AccountStep({ onBack }: { onBack?: () => void }) {
  const { register, login } = useStore()
  const [mode, setMode] = useState<'new' | 'existing'>('new')
  const [oauth, setOauth] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password2: '',
  })

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }))

  // Makieta OAuth: „połączenie" wypełnia imię i e-mail. Telefonu i tak wymagamy.
  const connectOauth = (provider: string) => {
    setError(null)
    setOauth(provider)
    const handle = provider === 'Google' ? 'google' : 'apple'
    set({
      name: form.name || 'Nowy Opiekun',
      email: form.email || `opiekun.${Math.random().toString(36).slice(2, 7)}@${handle}.example`,
    })
  }

  const submitNew = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.phone.trim()) return setError('Podaj numer telefonu — to pole jest wymagane.')
    if (!oauth) {
      if (form.password.length < 6) return setError('Hasło musi mieć co najmniej 6 znaków.')
      if (form.password !== form.password2) return setError('Hasła nie są takie same.')
    }
    const res = register({
      name: form.name.trim() || 'Opiekun',
      email: form.email.trim(),
      phone: form.phone.trim(),
      // Przy OAuth hasło jest generowane w tle (demo).
      password: oauth ? uidLike() : form.password,
    })
    if (!res.ok) return setError(res.error!)
    // Dalej zajmie się kreator: utworzy profil pupila i przejdzie do usługi.
  }

  const submitExisting = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const res = login(form.email, form.password)
    if (!res.ok) return setError(res.error!)
  }

  return (
    <section className="card">
      <h3 className="mt-0">Załóż konto opiekuna</h3>
      <p className="text-muted small">
        Konto powiąże profil pupila z Tobą i pozwoli zarządzać wizytami. Numer telefonu
        jest wymagany, żebyśmy mogli potwierdzić rezerwację.
      </p>

      <div className="pill-tabs">
        <button
          className={`pill-tab ${mode === 'new' ? 'active' : ''}`}
          onClick={() => {
            setMode('new')
            setError(null)
          }}
        >
          Nowe konto
        </button>
        <button
          className={`pill-tab ${mode === 'existing' ? 'active' : ''}`}
          onClick={() => {
            setMode('existing')
            setError(null)
          }}
        >
          Mam już konto
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      {mode === 'new' ? (
        <form onSubmit={submitNew}>
          <div className="oauth-row">
            <button
              type="button"
              className={`oauth-btn ${oauth === 'Google' ? 'connected' : ''}`}
              onClick={() => connectOauth('Google')}
            >
              <GoogleGlyph />
              {oauth === 'Google' ? 'Połączono z Google' : 'Kontynuuj z Google'}
            </button>
            <button
              type="button"
              className={`oauth-btn ${oauth === 'Apple' ? 'connected' : ''}`}
              onClick={() => connectOauth('Apple')}
            >
              <AppleGlyph />
              {oauth === 'Apple' ? 'Połączono z Apple' : 'Kontynuuj z Apple'}
            </button>
          </div>

          <div className="oauth-divider">
            <span>{oauth ? 'dokończ dane' : 'albo e-mailem'}</span>
          </div>

          <div className="field">
            <label htmlFor="ac-name">Imię i nazwisko</label>
            <input
              id="ac-name"
              required
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="Jan Kowalski"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="ac-email">E-mail</label>
              <input
                id="ac-email"
                type="email"
                required
                autoComplete="username"
                value={form.email}
                onChange={(e) => set({ email: e.target.value })}
                readOnly={!!oauth}
              />
            </div>
            <div className="field">
              <label htmlFor="ac-phone">
                Telefon <span className="req">wymagany</span>
              </label>
              <input
                id="ac-phone"
                required
                inputMode="tel"
                value={form.phone}
                onChange={(e) => set({ phone: e.target.value })}
                placeholder="+48 600 000 000"
              />
            </div>
          </div>

          {!oauth && (
            <div className="field-row">
              <div className="field">
                <label htmlFor="ac-pass">Hasło</label>
                <input
                  id="ac-pass"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => set({ password: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="ac-pass2">Powtórz hasło</label>
                <input
                  id="ac-pass2"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={form.password2}
                  onChange={(e) => set({ password2: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="flex gap-sm">
            <button className="btn btn-primary" type="submit">
              Załóż konto i przejdź dalej
            </button>
            {onBack && (
              <button className="btn btn-ghost" type="button" onClick={onBack}>
                Wstecz
              </button>
            )}
          </div>
        </form>
      ) : (
        <form onSubmit={submitExisting}>
          <div className="field">
            <label htmlFor="ac-lemail">E-mail</label>
            <input
              id="ac-lemail"
              type="email"
              required
              autoComplete="username"
              value={form.email}
              onChange={(e) => set({ email: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="ac-lpass">Hasło</label>
            <input
              id="ac-lpass"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => set({ password: e.target.value })}
            />
          </div>
          <div className="flex gap-sm">
            <button className="btn btn-primary" type="submit">
              Zaloguj się i wróć do rezerwacji
            </button>
            {onBack && (
              <button className="btn btn-ghost" type="button" onClick={onBack}>
                Wstecz
              </button>
            )}
          </div>
          <p className="text-faint small mt-2 mb-0">
            Konto demo: jan@example.com / demo1234
          </p>
        </form>
      )}
    </section>
  )
}

/* ─────────────────────────── KROK: USŁUGA ─────────────────────────── */

function ServiceStep({
  pet,
  selectedId,
  onPick,
  onBack,
}: {
  pet: Pet
  selectedId?: string
  onPick: (id: string) => void
  onBack?: () => void
}) {
  return (
    <section className="card">
      <div className="flex-between">
        <h3 className="mt-0 mb-0">Wybierz usługę</h3>
        {onBack && (
          <button className="btn btn-ghost btn-sm" onClick={onBack}>
            Wstecz
          </button>
        )}
      </div>
      <p className="text-muted small">
        Propozycje dla rasy <strong>{breedById(pet.breedId).name}</strong> ({pet.weightKg} kg).
        Na górze warianty pasujące wagowo.
      </p>
      <div className="list">
        {servicesForBreed(pet.breedId, pet.weightKg).map((s) => {
          const fits = matchesWeight(s, pet.weightKg)
          return (
            <button
              key={s.id}
              className={`choice ${s.id === selectedId ? 'selected' : ''}`}
              onClick={() => onPick(s.id)}
            >
              <IconChip name={SERVICE_ICON[s.category]} />
              <span className="grow">
                <b>
                  {s.name}
                  {fits && s.breedIds.length > 0 && (
                    <span className="badge badge-mint">pasuje wagowo</span>
                  )}
                </b>
                <span className="meta">
                  {s.description} · {formatDuration(s.durationMin)}
                </span>
              </span>
              <span className="price-tag">{s.price} zł</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

/* ─────────────────────────── KROK: TERMIN ─────────────────────────── */

function SlotStep({
  service,
  date,
  time,
  onPickDate,
  onPickTime,
  onBack,
}: {
  service: Service
  date: string | null
  time: string | null
  onPickDate: (d: string) => void
  onPickTime: (t: string) => void
  onBack: () => void
}) {
  const { db } = useStore()
  const slots = useMemo(
    () => (date ? availableSlots(db.appointments, date, service.durationMin) : []),
    [db.appointments, date, service.durationMin],
  )

  return (
    <section className="card">
      <div className="flex-between">
        <h3 className="mt-0 mb-0">Wybierz termin</h3>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          Wstecz
        </button>
      </div>
      <p className="text-muted small">
        Kalendarz pokazuje dni z wolnym oknem na {formatDuration(service.durationMin)}.
      </p>
      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <Calendar
          appointments={db.appointments}
          durationMin={service.durationMin}
          selected={date}
          onSelect={onPickDate}
        />
        <div>
          {date ? (
            <>
              <h4 style={{ marginBottom: 2 }}>{formatDateWithWeekday(date)}</h4>
              <p className="text-muted small">Salon czynny: {openingLabel(date)}</p>
              {slots.length ? (
                <div className="slots">
                  {slots.map((t) => (
                    <button
                      key={t}
                      className={`slot ${t === time ? 'active' : ''}`}
                      onClick={() => onPickTime(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Brak wolnych godzin, wybierz inny dzień.</p>
              )}
            </>
          ) : (
            <div className="empty">
              <IconChip name="calendar" />
              Wybierz dzień z kalendarza, aby zobaczyć wolne godziny.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── KROK: PŁATNOŚĆ ─────────────────────────── */

function PaymentStep({
  pet,
  service,
  date,
  time,
  notes,
  onNotes,
  onPay,
  onBack,
}: {
  pet: Pet
  service: Service
  date: string
  time: string
  notes: string
  onNotes: (v: string) => void
  onPay: (method: string) => void
  onBack: () => void
}) {
  const [method, setMethod] = useState<'Karta' | 'BLIK'>('Karta')
  const [processing, setProcessing] = useState(false)

  const pay = (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    // Makieta bramki płatniczej — krótkie „przetwarzanie", potem potwierdzenie.
    setTimeout(() => onPay(method), 900)
  }

  return (
    <section className="card">
      <div className="flex-between">
        <h3 className="mt-0 mb-0">Płatność</h3>
        {!processing && (
          <button className="btn btn-ghost btn-sm" onClick={onBack}>
            Wstecz
          </button>
        )}
      </div>

      <div className="summary-box">
        <dl>
          <dt>Pupil</dt>
          <dd>
            {pet.name}, {breedById(pet.breedId).name}, {pet.weightKg} kg
          </dd>
          <dt>Usługa</dt>
          <dd>{service.name}</dd>
          <dt>Termin</dt>
          <dd>
            {formatDateWithWeekday(date)}, {time}
          </dd>
          <dt>Czas trwania</dt>
          <dd>{formatDuration(service.durationMin)}</dd>
          <dt>Do zapłaty</dt>
          <dd className="total">{service.price} zł</dd>
        </dl>
      </div>

      <form onSubmit={pay}>
        <div className="field">
          <label htmlFor="pay-notes">Uwagi do wizyty (opcjonalnie)</label>
          <textarea
            id="pay-notes"
            style={{ minHeight: 70 }}
            value={notes}
            onChange={(e) => onNotes(e.target.value)}
            placeholder="np. proszę krócej przy łapkach, pies po chorobie"
          />
        </div>

        <div className="pill-tabs">
          <button
            type="button"
            className={`pill-tab ${method === 'Karta' ? 'active' : ''}`}
            onClick={() => setMethod('Karta')}
          >
            Karta
          </button>
          <button
            type="button"
            className={`pill-tab ${method === 'BLIK' ? 'active' : ''}`}
            onClick={() => setMethod('BLIK')}
          >
            BLIK
          </button>
        </div>

        {method === 'Karta' ? (
          <>
            <div className="field">
              <label htmlFor="pay-card">Numer karty</label>
              <input id="pay-card" inputMode="numeric" placeholder="4242 4242 4242 4242" />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="pay-exp">Ważna do</label>
                <input id="pay-exp" placeholder="12/28" />
              </div>
              <div className="field">
                <label htmlFor="pay-cvc">CVC</label>
                <input id="pay-cvc" inputMode="numeric" placeholder="123" />
              </div>
            </div>
          </>
        ) : (
          <div className="field">
            <label htmlFor="pay-blik">Kod BLIK</label>
            <input id="pay-blik" inputMode="numeric" maxLength={6} placeholder="6 cyfr z aplikacji" />
          </div>
        )}

        <div className="info-note">
          Makieta płatności — nie są pobierane żadne prawdziwe środki. Kliknięcie
          potwierdza rezerwację i przechodzi do potwierdzenia płatności.
        </div>

        <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={processing}>
          {processing ? (
            <>
              <span className="spinner" /> Przetwarzanie płatności…
            </>
          ) : (
            `Zapłać ${service.price} zł`
          )}
        </button>
      </form>
    </section>
  )
}

/* ─────────────────────── KROK: POTWIERDZENIE ─────────────────────── */

function DoneStep({
  appointmentId,
  onFinish,
}: {
  appointmentId: string
  onFinish: () => void
}) {
  const { db } = useStore()
  const a = db.appointments.find((x) => x.id === appointmentId)
  const pet = a ? db.pets.find((p) => p.id === a.petId) : null
  const service = a ? serviceById(a.serviceId) : null

  return (
    <section className="card text-center">
      <span className="success-mark">
        <Icon name="checkCircle" size={34} strokeWidth={1.6} />
      </span>
      <h3 style={{ marginBottom: 6 }}>Płatność potwierdzona</h3>
      <p className="text-muted">
        Dziękujemy! Wizyta jest zarezerwowana i opłacona. Szczegóły znajdziesz też w
        panelu klienta.
      </p>

      {a && (
        <div className="summary-box" style={{ textAlign: 'left' }}>
          <dl>
            <dt>Numer rezerwacji</dt>
            <dd className="mono">{a.id}</dd>
            <dt>Pupil</dt>
            <dd>{pet?.name}</dd>
            <dt>Usługa</dt>
            <dd>{service?.name}</dd>
            <dt>Termin</dt>
            <dd>
              {formatDateWithWeekday(a.date)}, {a.time}
            </dd>
            <dt>Metoda płatności</dt>
            <dd>{a.paymentMethod}</dd>
            <dt>Zapłacono</dt>
            <dd className="total">{a.price} zł</dd>
          </dl>
        </div>
      )}

      <button className="btn btn-primary btn-lg" onClick={onFinish}>
        Przejdź do panelu
      </button>
    </section>
  )
}

/* ─────────────────────────── drobiazgi ─────────────────────────── */

function uidLike(): string {
  return `oauth_${Math.random().toString(36).slice(2, 12)}`
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  )
}

function AppleGlyph() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true" fill="currentColor">
      <path d="M13.05 9.5c-.02-1.86 1.52-2.75 1.59-2.8-.87-1.27-2.22-1.44-2.7-1.46-1.15-.12-2.24.67-2.82.67-.58 0-1.48-.65-2.43-.64-1.25.02-2.4.73-3.05 1.84-1.3 2.26-.33 5.6.93 7.43.62.9 1.35 1.9 2.31 1.86.93-.04 1.28-.6 2.4-.6 1.11 0 1.43.6 2.4.58 1-.02 1.63-.91 2.24-1.81.71-1.04 1-2.05 1.02-2.1-.02-.01-1.95-.75-1.97-2.98Z" />
      <path d="M11.2 3.9c.51-.62.86-1.48.76-2.34-.74.03-1.63.49-2.16 1.11-.47.55-.89 1.43-.78 2.27.82.06 1.67-.42 2.18-1.04Z" />
    </svg>
  )
}
