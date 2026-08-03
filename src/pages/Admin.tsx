import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Icon, IconChip } from '../components/Icon'
import { useToast } from '../components/Toast'
import { breedById } from '../data/breeds'
import { serviceById } from '../data/services'
import {
  WEEKDAYS_LONG,
  addDays,
  formatDate,
  formatDateShort,
  formatRelative,
  formatStamp,
  minutesToTime,
  timeToMinutes,
  todayISO,
  weekdayIndex,
} from '../lib/date'
import { OPENING_HOURS, openingLabel } from '../lib/availability'
import { allSchedules, hasUpcomingVisit, renderReminderTemplate } from '../lib/followups'
import type { PetSchedule } from '../lib/followups'
import { plural, useStore } from '../lib/store'
import type { Message, User } from '../lib/types'

// Kolejność zakładek odwzorowuje priorytety panelu: najpierw kalendarz
// i przypomnienia (funkcje kluczowe), potem reszta obsługi.
type Tab = 'kalendarz' | 'followupy' | 'wiadomosci' | 'wizyty' | 'klienci'

export function Admin() {
  const { db, user, isAdmin } = useStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('kalendarz')

  useEffect(() => {
    if (!user) navigate('/logowanie?powrot=/admin', { replace: true })
    else if (!isAdmin) navigate('/konto', { replace: true })
  }, [user, isAdmin, navigate])

  if (!user || !isAdmin) return null

  const today = todayISO()
  const clients = db.users.filter((u) => u.role === 'client')
  const upcoming = db.appointments.filter((a) => a.status === 'scheduled' && a.date >= today)
  const unreadMessages = db.messages.filter((m) => !m.read).length
  const pendingFollowUps = db.followUps.filter((f) => f.status === 'pending').length

  return (
    <div className="page admin-console">
      <div className="container">
        <div className="page-head">
          <div>
            <span className="eyebrow">Panel administratora</span>
            <h1>
              Salon <span className="accent">od kuchni</span>
            </h1>
            <p>
              Zalogowana: {user.name} · {clients.length}{' '}
              {plural(clients.length, 'klient', 'klienci', 'klientów')} w bazie
            </p>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${tab === 'kalendarz' ? 'active' : ''}`}
            onClick={() => setTab('kalendarz')}
          >
            <Icon name="calendar" size={17} />
            Kalendarz
          </button>
          <button
            className={`tab ${tab === 'followupy' ? 'active' : ''}`}
            onClick={() => setTab('followupy')}
          >
            <Icon name="bell" size={17} />
            Przypomnienia{' '}
            {pendingFollowUps > 0 && <span className="count">{pendingFollowUps}</span>}
          </button>
          <button
            className={`tab ${tab === 'wiadomosci' ? 'active' : ''}`}
            onClick={() => setTab('wiadomosci')}
          >
            <Icon name="mail" size={17} />
            Wiadomości {unreadMessages > 0 && <span className="count">{unreadMessages}</span>}
          </button>
          <button
            className={`tab ${tab === 'wizyty' ? 'active' : ''}`}
            onClick={() => setTab('wizyty')}
          >
            <Icon name="clock" size={17} />
            Wizyty <span className="count">{upcoming.length}</span>
          </button>
          <button
            className={`tab ${tab === 'klienci' ? 'active' : ''}`}
            onClick={() => setTab('klienci')}
          >
            <Icon name="users" size={17} />
            Klienci <span className="count">{clients.length}</span>
          </button>
        </div>

        {tab === 'kalendarz' && <CalendarTab onGo={setTab} />}
        {tab === 'followupy' && <Reminders />}
        {tab === 'wiadomosci' && <Messages />}
        {tab === 'wizyty' && <Visits />}
        {tab === 'klienci' && <Clients />}
      </div>
    </div>
  )
}

/* ─────────────── KALENDARZ (widok wiodący) ─────────────── */

/** Zakładka kalendarza: zwarty pasek liczb + kalendarz dnia z agendą
 *  i szybkimi akcjami. To główny widok pracy salonu. */
function CalendarTab({ onGo }: { onGo: (t: Tab) => void }) {
  const { db } = useStore()
  const today = todayISO()

  const upcoming = db.appointments.filter((a) => a.status === 'scheduled' && a.date >= today)
  const revenue = db.appointments
    .filter((a) => a.status === 'completed')
    .reduce((sum, a) => sum + a.price, 0)
  const pendingFollowUps = db.followUps.filter((f) => f.status === 'pending').length

  return (
    <>
      <div className="stat-row">
        <div className="stat">
          <b>{upcoming.length}</b>
          <span>nadchodzących wizyt</span>
        </div>
        <div className="stat">
          <b>{db.messages.filter((m) => !m.read).length}</b>
          <span>nieprzeczytanych wiadomości</span>
        </div>
        <div className="stat">
          <b>{pendingFollowUps}</b>
          <span>przypomnień w kolejce</span>
        </div>
        <div className="stat">
          <b>{db.users.filter((u) => u.role === 'client').length}</b>
          <span>klientów</span>
        </div>
        <div className="stat">
          <b>{revenue} zł</b>
          <span>z wizyt zrealizowanych</span>
        </div>
      </div>

      <DaySchedule onGo={onGo} />
    </>
  )
}

/* ─────────────── DZIENNY KALENDARZ WIZYT ─────────────── */

/** Ile pikseli przypada na minutę na osi czasu (60 min ≈ 54 px). */
const PX_PER_MIN = 0.9

function DaySchedule({ onGo }: { onGo: (t: Tab) => void }) {
  const { db, completeAppointment, cancelAppointment } = useStore()
  const [toast, showToast] = useToast()
  const today = todayISO()
  const [day, setDay] = useState(today)

  const wd = weekdayIndex(day)
  const hours = OPENING_HOURS[wd]

  const events = db.appointments
    .filter((a) => a.date === day && a.status !== 'cancelled')
    .map((a) => ({
      a,
      start: timeToMinutes(a.time),
      end: timeToMinutes(a.time) + a.durationMin,
    }))
    .sort((x, y) => x.start - y.start)

  // Rozkładamy nakładające się wizyty na kolumny (choć u jednego groomera
  // to rzadkość, siatka i tak sobie z tym poradzi).
  const lanesEnd: number[] = []
  const placed = events.map((e) => {
    let lane = lanesEnd.findIndex((end) => end <= e.start)
    if (lane === -1) {
      lane = lanesEnd.length
      lanesEnd.push(e.end)
    } else {
      lanesEnd[lane] = e.end
    }
    return { ...e, lane }
  })
  const laneCount = Math.max(1, lanesEnd.length)

  const openMin = hours ? timeToMinutes(hours.from) : 0
  const closeMin = hours ? timeToMinutes(hours.to) : 0
  const bodyHeight = (closeMin - openMin) * PX_PER_MIN

  const hourMarks: number[] = []
  for (let m = openMin; m <= closeMin; m += 60) hourMarks.push(m)

  return (
    <div className="card">
      <div className="daycal-head">
        <h3 className="mt-0 mb-0">Kalendarz wizyt</h3>
        <div className="daycal-nav">
          <button
            className="daycal-arrow"
            onClick={() => setDay((d) => addDays(d, -1))}
            aria-label="Poprzedni dzień"
          >
            <Icon name="chevronLeft" size={16} />
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setDay(today)}
            disabled={day === today}
          >
            Dziś
          </button>
          <button
            className="daycal-arrow"
            onClick={() => setDay((d) => addDays(d, 1))}
            aria-label="Następny dzień"
          >
            <Icon name="chevronRight" size={16} />
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => onGo('wizyty')}>
            Lista wizyt
            <Icon name="arrowRight" size={14} />
          </button>
        </div>
      </div>

      <div className="daycal-day">
        <span className="daycal-weekday">{WEEKDAYS_LONG[wd]}</span>
        <span className="text-muted">{formatDate(day)}</span>
        <span className="text-faint small">
          {hours ? `czynne ${openingLabel(day)}` : 'nieczynne'} ·{' '}
          {placed.length} {placed.length === 1 ? 'wizyta' : 'wizyt'}
        </span>
      </div>

      {!hours ? (
        <div className="empty">
          <IconChip name="calendar" />
          Salon jest tego dnia nieczynny.
        </div>
      ) : (
        <div className="daycal-scale" style={{ height: bodyHeight }}>
          {hourMarks.map((m) => (
            <div
              key={m}
              className="daycal-mark"
              style={{ top: (m - openMin) * PX_PER_MIN }}
            >
              <span>{minutesToTime(m)}</span>
            </div>
          ))}

          <div className="daycal-lane">
            {placed.map(({ a, start, end, lane }) => {
              const pet = db.pets.find((p) => p.id === a.petId)
              const client = db.users.find((u) => u.id === a.clientId)
              const top = (start - openMin) * PX_PER_MIN
              const height = Math.max((end - start) * PX_PER_MIN, 38)
              // Krótkie bloki nie mieszczą trzech linijek — skracamy układ,
              // żeby tekst nigdy nie był przycięty (pełne dane zostają w tooltipie).
              const isCompact = height < 52
              const showOwner = height >= 72
              return (
                <div
                  key={a.id}
                  className={`daycal-event ${isCompact ? 'is-compact' : ''} ${a.status === 'completed' ? 'is-done' : ''}`}
                  style={{
                    top,
                    height,
                    left: `${(lane / laneCount) * 100}%`,
                    width: `calc(${100 / laneCount}% - 6px)`,
                  }}
                  title={`${a.time}–${minutesToTime(end)} · ${pet?.name} · ${serviceById(a.serviceId)?.name} · ${client?.name}`}
                >
                  {isCompact ? (
                    <div className="daycal-event-row">
                      <span className="daycal-event-time">{a.time}</span>
                      <span className="daycal-event-title">
                        {pet?.name} · {serviceById(a.serviceId)?.name}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="daycal-event-time">
                        {a.time}–{minutesToTime(end)}
                      </div>
                      <div className="daycal-event-title">
                        {pet?.name} · {serviceById(a.serviceId)?.name}
                      </div>
                      {showOwner && <div className="daycal-event-sub">{client?.name}</div>}
                    </>
                  )}
                </div>
              )
            })}

            {placed.length === 0 && (
              <div className="daycal-empty">Brak wizyt tego dnia.</div>
            )}
          </div>
        </div>
      )}

      {/* Agenda dnia z szybkimi akcjami — obsługa wizyt bez wchodzenia
          w osobną zakładkę. Kalendarz jest tu widokiem operacyjnym. */}
      {hours && placed.length > 0 && (
        <div className="day-agenda">
          <h4>Agenda dnia</h4>
          {placed.map(({ a, end }) => {
            const pet = db.pets.find((p) => p.id === a.petId)
            const client = db.users.find((u) => u.id === a.clientId)
            return (
              <div key={a.id} className="agenda-row">
                <span className="agenda-time">
                  {a.time}–{minutesToTime(end)}
                </span>
                <div className="agenda-main">
                  <div className="agenda-title">
                    {pet?.name ?? 'Pupil'} · {serviceById(a.serviceId)?.name}
                    {a.status === 'completed' && (
                      <span className="badge badge-mint" style={{ marginLeft: 8 }}>
                        zrealizowana
                      </span>
                    )}
                  </div>
                  <div className="agenda-sub">
                    {client?.name}
                    {client?.phone ? ` · ${client.phone}` : ''} · {a.price} zł
                  </div>
                </div>
                {a.status === 'scheduled' && (
                  <div className="row-actions">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        completeAppointment(a.id)
                        showToast('Wizyta oznaczona jako zrealizowana.')
                      }}
                    >
                      <Icon name="check" size={14} />
                      Zrealizowana
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        if (confirm('Odwołać wizytę?')) {
                          cancelAppointment(a.id)
                          showToast('Wizyta odwołana.')
                        }
                      }}
                    >
                      Odwołaj
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      {toast}
    </div>
  )
}

/* ─────────────────────── KLIENCI ─────────────────────── */

function Clients() {
  const { db } = useStore()
  const [open, setOpen] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const clients = db.users
    .filter((u) => u.role === 'client')
    .filter((u) => {
      const q = query.trim().toLowerCase()
      if (!q) return true
      const pets = db.pets.filter((p) => p.ownerId === u.id)
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        pets.some((p) => p.name.toLowerCase().includes(q))
      )
    })

  return (
    <>
      <div className="field" style={{ maxWidth: 360 }}>
        <label htmlFor="q">Szukaj klienta lub psa</label>
        <input
          id="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="np. Kowalski albo Fibi"
        />
      </div>

      <div className="list">
        {clients.map((c) => (
          <ClientCard
            key={c.id}
            client={c}
            expanded={open === c.id}
            onToggle={() => setOpen(open === c.id ? null : c.id)}
          />
        ))}
        {clients.length === 0 && (
          <div className="empty">
            <IconChip name="search" />
            Nic nie znaleziono.
          </div>
        )}
      </div>
    </>
  )
}

function ClientCard({
  client,
  expanded,
  onToggle,
}: {
  client: User
  expanded: boolean
  onToggle: () => void
}) {
  const { db } = useStore()
  const pets = db.pets.filter((p) => p.ownerId === client.id)
  const visits = db.appointments.filter((a) => a.clientId === client.id)
  const done = visits.filter((v) => v.status === 'completed')
  const spent = done.reduce((s, v) => s + v.price, 0)
  const schedules = allSchedules(db).filter((s) => s.ownerId === client.id)

  return (
    <article className="card">
      <div className="flex-between">
        <div className="flex">
          <Avatar label={client.name} />
          <div>
            <h3 style={{ margin: 0 }}>{client.name}</h3>
            <div className="text-faint small">
              {client.email} · {client.phone}
            </div>
          </div>
        </div>
        <div className="flex gap-sm">
          <span className="badge">
            {pets.length} {plural(pets.length, 'pies', 'psy', 'psów')}
          </span>
          <span className="badge badge-accent">
            {done.length} {plural(done.length, 'wizyta', 'wizyty', 'wizyt')} · {spent} zł
          </span>
          <button className="btn btn-outline btn-sm" onClick={onToggle}>
            {expanded ? 'Zwiń' : 'Szczegóły'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3">
          <h4>Pupile</h4>
          <div className="grid grid-2">
            {schedules.map((s) => (
              <div key={s.pet.id} className="row-card">
                <Avatar label={s.pet.name} photoUrl={s.pet.photoUrl} />
                <div className="grow">
                  <h4>
                    {s.pet.name}
                    {s.state === 'po-terminie' && (
                      <span className="badge badge-rose">po terminie</span>
                    )}
                    {s.state === 'zbliza-sie' && (
                      <span className="badge badge-butter">zbliża się</span>
                    )}
                  </h4>
                  <div className="sub">
                    {s.breedName} · {s.pet.weightKg} kg · strzyżenie co {s.intervalWeeks} tyg.
                  </div>
                  <div className="sub">
                    ostatnio: {s.lastVisit ? formatDateShort(s.lastVisit) : '—'} · kolejne:{' '}
                    {s.dueDate ? formatDateShort(s.dueDate) : '—'}
                  </div>
                  {s.pet.notes && <div className="sub">Uwagi: {s.pet.notes}</div>}
                </div>
              </div>
            ))}
            {pets.length === 0 && <p className="text-muted">Brak profili pupili.</p>}
          </div>

          <h4 className="mt-3">Historia wizyt</h4>
          {visits.length === 0 ? (
            <p className="text-muted">Brak wizyt.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Pies</th>
                    <th>Usługa</th>
                    <th>Cena</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...visits]
                    .sort((a, b) => (a.date < b.date ? 1 : -1))
                    .map((v) => (
                      <tr key={v.id}>
                        <td>
                          {formatDateShort(v.date)}, {v.time}
                        </td>
                        <td>{db.pets.find((p) => p.id === v.petId)?.name ?? '—'}</td>
                        <td>{serviceById(v.serviceId)?.name}</td>
                        <td>{v.price} zł</td>
                        <td>
                          {v.status === 'completed'
                            ? 'zrealizowana'
                            : v.status === 'cancelled'
                              ? 'odwołana'
                              : 'zaplanowana'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

/* ─────────────────────── WIZYTY ─────────────────────── */

function Visits() {
  const { db, cancelAppointment, completeAppointment } = useStore()
  const [toast, showToast] = useToast()
  const [filter, setFilter] = useState<'nadchodzace' | 'historia' | 'wszystkie'>('nadchodzace')
  const today = todayISO()

  const rows = useMemo(() => {
    const all = [...db.appointments].sort((a, b) =>
      a.date + a.time > b.date + b.time ? 1 : -1,
    )
    if (filter === 'nadchodzace')
      return all.filter((a) => a.status === 'scheduled' && a.date >= today)
    if (filter === 'historia')
      return all.filter((a) => a.status !== 'scheduled' || a.date < today).reverse()
    return all
  }, [db.appointments, filter, today])

  return (
    <>
      <div className="pill-tabs">
        {(['nadchodzace', 'historia', 'wszystkie'] as const).map((f) => (
          <button
            key={f}
            className={`pill-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'nadchodzace' ? 'Nadchodzące' : f === 'historia' ? 'Historia' : 'Wszystkie'}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="empty">
          <IconChip name="calendar" />
          Brak wizyt w tym widoku.
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Termin</th>
                <th>Klient</th>
                <th>Pies</th>
                <th>Usługa</th>
                <th>Cena</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const pet = db.pets.find((p) => p.id === a.petId)
                const client = db.users.find((u) => u.id === a.clientId)
                return (
                  <tr key={a.id}>
                    <td>
                      <strong>{formatDateShort(a.date)}</strong>
                      <br />
                      <span className="text-faint">{a.time}</span>
                    </td>
                    <td>
                      {client?.name}
                      <br />
                      <span className="text-faint small">{client?.phone}</span>
                    </td>
                    <td>
                      {pet ? `${pet.name}, ${breedById(pet.breedId).name}` : '—'}
                      {pet?.notes && (
                        <>
                          <br />
                          <span className="text-faint small">Uwagi: {pet.notes}</span>
                        </>
                      )}
                    </td>
                    <td>{serviceById(a.serviceId)?.name}</td>
                    <td>
                      {a.price} zł
                      {a.paid && (
                        <>
                          <br />
                          <span className="text-faint small">opłacona · {a.paymentMethod}</span>
                        </>
                      )}
                    </td>
                    <td>
                      {a.status === 'completed' ? (
                        <span className="badge badge-mint">zrealizowana</span>
                      ) : a.status === 'cancelled' ? (
                        <span className="badge badge-grey">odwołana</span>
                      ) : (
                        <span className="badge badge-accent">zaplanowana</span>
                      )}
                    </td>
                    <td>
                      {a.status === 'scheduled' && (
                        <div className="row-actions">
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              completeAppointment(a.id)
                              showToast('Wizyta oznaczona jako zrealizowana.')
                            }}
                          >
                            <Icon name="check" size={14} />
                            Zrealizowana
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              if (confirm('Odwołać wizytę?')) {
                                cancelAppointment(a.id)
                                showToast('Wizyta odwołana.')
                              }
                            }}
                          >
                            Odwołaj
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {toast}
    </>
  )
}

/* ─────────────────────── WIADOMOŚCI ─────────────────────── */

function Messages() {
  const { db, setMessageRead, removeMessage } = useStore()
  const [toast, showToast] = useToast()
  const [openMsg, setOpenMsg] = useState<Message | null>(null)
  const [onlyUnread, setOnlyUnread] = useState(false)

  const rows = db.messages.filter((m) => (onlyUnread ? !m.read : true))

  return (
    <>
      <div className="flex-between" style={{ marginBottom: 18 }}>
        <h3 className="mb-0">Skrzynka salonu</h3>
        <label className="switch">
          <input
            type="checkbox"
            checked={onlyUnread}
            onChange={(e) => setOnlyUnread(e.target.checked)}
          />
          <span className="track" />
          Tylko nieprzeczytane
        </label>
      </div>

      {rows.length === 0 ? (
        <div className="empty">
          <IconChip name="mail" />
          Brak wiadomości.
        </div>
      ) : (
        <div className="list">
          {rows.map((m) => (
            <article key={m.id} className={`row-card ${m.read ? '' : 'unread'}`}>
              <IconChip name={m.read ? 'mailOpen' : 'mail'} accent={!m.read} />
              <div className="grow">
                <h4>
                  {m.topic}
                  {!m.read && <span className="badge badge-accent">nowa</span>}
                  <span className="badge badge-grey">{m.source}</span>
                </h4>
                <div className="sub">
                  {m.fromName} · {m.fromEmail}
                  {m.phone ? ` · ${m.phone}` : ''} · {formatStamp(m.createdAt)}
                </div>
                <p>{m.body.length > 130 ? m.body.slice(0, 130) + '…' : m.body}</p>
              </div>
              <div className="row-actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setOpenMsg(m)
                    if (!m.read) setMessageRead(m.id, true)
                  }}
                >
                  Otwórz
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setMessageRead(m.id, !m.read)}
                >
                  {m.read ? 'Oznacz jako nową' : 'Przeczytana'}
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    if (confirm('Usunąć wiadomość?')) {
                      removeMessage(m.id)
                      showToast('Wiadomość usunięta.')
                    }
                  }}
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {openMsg && (
        <div className="dialog-backdrop" onClick={() => setOpenMsg(null)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>{openMsg.topic}</h3>
            <p className="text-muted small">
              Od: <strong>{openMsg.fromName}</strong> · {openMsg.fromEmail}
              {openMsg.phone ? ` · ${openMsg.phone}` : ''}
              <br />
              {formatStamp(openMsg.createdAt)}
            </p>
            <div className="quote-box">{openMsg.body}</div>

            <div className="field mt-2">
              <label htmlFor="reply">Odpowiedź (makieta, bez wysyłki)</label>
              <textarea id="reply" placeholder="Dzień dobry, dziękuję za wiadomość." />
            </div>

            <div className="dialog-actions">
              <button className="btn btn-ghost" onClick={() => setOpenMsg(null)}>
                Zamknij
              </button>
              <a className="btn btn-outline" href={`mailto:${openMsg.fromEmail}`}>
                Odpisz e-mailem
              </a>
              <button
                className="btn btn-primary"
                onClick={() => {
                  showToast('Makieta: w wersji z backendem tutaj poszedłby e-mail.')
                  setOpenMsg(null)
                }}
              >
                <Icon name="send" size={15} />
                Wyślij odpowiedź
              </button>
            </div>
          </div>
        </div>
      )}
      {toast}
    </>
  )
}

/* ─────────────────────── PRZYPOMNIENIA ─────────────────────── */

const REMINDER_VARIABLES: { token: string; label: string }[] = [
  { token: '{imie_psa}', label: 'imię psa' },
  { token: '{imie_wlasciciela}', label: 'imię właściciela' },
  { token: '{rasa}', label: 'rasa' },
  { token: '{tygodnie}', label: 'ile tygodni' },
  { token: '{data}', label: 'data wizyty' },
]

/** Przykładowe dane do podglądu wzorca, gdy w bazie nie ma jeszcze żadnego pupila. */
const SAMPLE_SCHEDULE: PetSchedule = {
  pet: { id: '', ownerId: '', name: 'Reksio', breedId: '', weightKg: 0 },
  ownerId: '',
  ownerName: 'Anna Kowalska',
  breedName: 'Owczarek',
  intervalWeeks: 6,
  lastVisit: null,
  dueDate: todayISO(),
  daysUntilDue: 0,
  weeksSince: 6,
  state: 'po-terminie',
}

const SENT_PER_PAGE = 5

function Reminders() {
  const {
    db,
    setLeadDays,
    setReminderTemplate,
    setAutoSend,
    runFollowUpScan,
    sendPendingFollowUps,
  } = useStore()
  const [toast, showToast] = useToast()
  const [template, setTemplate] = useState(db.settings.reminderTemplate ?? '')
  const [sentPage, setSentPage] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const pending = db.followUps.filter((f) => f.status === 'pending').length
  const autoSend = db.settings.autoSendFollowUps

  useEffect(() => {
    setTemplate(db.settings.reminderTemplate ?? '')
  }, [db.settings.reminderTemplate])

  const schedules = allSchedules(db)
  const overdue = schedules.filter(
    (s) => s.state === 'po-terminie' && !hasUpcomingVisit(db, s.pet.id),
  )

  const sample = overdue[0] ?? schedules[0]

  const petName = (id: string) => db.pets.find((p) => p.id === id)?.name ?? '—'
  const petPhoto = (id: string) => db.pets.find((p) => p.id === id)?.photoUrl
  const ownerName = (id: string) => db.users.find((u) => u.id === id)?.name ?? '—'

  // Ostatnio wysłane przypomnienia — najnowsze na górze.
  const sent = useMemo(
    () =>
      db.followUps
        .filter((f) => f.status === 'sent')
        .sort((a, b) => (b.sentAt ?? '').localeCompare(a.sentAt ?? '')),
    [db.followUps],
  )
  const sentPages = Math.max(1, Math.ceil(sent.length / SENT_PER_PAGE))
  const currentSentPage = Math.min(sentPage, sentPages - 1)
  const sentSlice = sent.slice(
    currentSentPage * SENT_PER_PAGE,
    currentSentPage * SENT_PER_PAGE + SENT_PER_PAGE,
  )

  const insertVariable = (token: string) => {
    const el = textareaRef.current
    let next = template
    if (el) {
      const start = el.selectionStart ?? template.length
      const end = el.selectionEnd ?? template.length
      next = template.slice(0, start) + token + template.slice(end)
    } else {
      next = template + token
    }
    setTemplate(next)
  }

  const commitTemplate = () => {
    if (template !== db.settings.reminderTemplate) setReminderTemplate(template)
  }

  return (
    <>
      {/* Sterowanie silnikiem przypomnień — priorytetowa funkcja panelu.
          Wszystkie akcje już istnieją w store; tu dostają widoczny interfejs. */}
      <div className="engine-bar">
        <label className="switch">
          <input
            type="checkbox"
            checked={autoSend}
            onChange={(e) => setAutoSend(e.target.checked)}
          />
          <span className="track" />
          Automatyczna wysyłka
        </label>
        <span className="engine-status">
          <span className={`engine-dot ${autoSend ? 'is-on' : ''}`} />
          {autoSend ? 'automat aktywny' : 'automat wyłączony'}
        </span>
        <span className="engine-status">
          <span className="engine-pending">{pending}</span> w kolejce
        </span>
        <div className="engine-actions">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              const r = runFollowUpScan()
              showToast(
                r.created > 0
                  ? `Skan: dodano ${r.created} ${plural(r.created, 'przypomnienie', 'przypomnienia', 'przypomnień')} do kolejki.`
                  : 'Skan zakończony — brak nowych przypomnień.',
              )
            }}
          >
            <Icon name="search" size={14} />
            Skanuj teraz
          </button>
          <button
            className="btn btn-primary btn-sm"
            disabled={pending === 0}
            onClick={() => {
              const sentNow = sendPendingFollowUps()
              showToast(
                sentNow > 0
                  ? `Wysłano ${sentNow} ${plural(sentNow, 'przypomnienie', 'przypomnienia', 'przypomnień')}.`
                  : 'Brak przypomnień do wysłania.',
              )
            }}
          >
            <Icon name="send" size={14} />
            Wyślij oczekujące
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 className="mt-0 mb-0">Wzorzec przypomnienia</h3>
        <p className="text-muted small" style={{ maxWidth: '64ch' }}>
          Treść, którą klient zobaczy jako przypomnienie o kolejnym strzyżeniu. Użyj
          zmiennych w klamrach — zostaną podmienione na dane konkretnego psa.
        </p>

        <textarea
          ref={textareaRef}
          className="reminder-template-input"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          onBlur={commitTemplate}
          rows={3}
          placeholder="np. {imie_psa} oczekuje na wizytę"
        />

        <div className="reminder-var-picker">
          {REMINDER_VARIABLES.map((v) => (
            <button
              key={v.token}
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => insertVariable(v.token)}
            >
              {v.token}
              <span className="text-faint"> · {v.label}</span>
            </button>
          ))}
        </div>

        <div className="flex mt-2" style={{ gap: 16, alignItems: 'center' }}>
          <label className="switch">
            Wyprzedzenie:
            <select
              value={db.settings.leadDays}
              onChange={(e) => setLeadDays(Number(e.target.value))}
              style={{
                padding: '7px 14px',
                borderRadius: 999,
                border: '1px solid var(--line)',
                background: '#fff',
              }}
            >
              {[0, 3, 7, 14].map((d) => (
                <option key={d} value={d}>
                  {d === 0 ? 'w dniu terminu' : `${d} dni wcześniej`}
                </option>
              ))}
            </select>
          </label>
          <button className="btn btn-primary btn-sm" onClick={commitTemplate}>
            Zapisz wzorzec
          </button>
        </div>

        <div className="mt-2">
          <span className="text-faint small">Podgląd:</span>
          <div className="quote-box mt-1">
            {renderReminderTemplate(template, sample ?? SAMPLE_SCHEDULE)}
          </div>
        </div>
      </div>

      <h3>Psy po terminie ({overdue.length})</h3>
      {overdue.length === 0 ? (
        <div className="empty">
          <IconChip name="checkCircle" />
          Żaden pies nie czeka na przypomnienie — wszystko na bieżąco.
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pies</th>
                <th>Rasa</th>
                <th>Właściciel</th>
                <th>Ostatnia wizyta</th>
                <th>Termin minął</th>
                <th>Treść przypomnienia</th>
              </tr>
            </thead>
            <tbody>
              {overdue.map((s) => (
                <tr key={s.pet.id}>
                  <td>
                    <strong>{s.pet.name}</strong>
                  </td>
                  <td>{s.breedName}</td>
                  <td>{s.ownerName}</td>
                  <td>{s.lastVisit ? formatDateShort(s.lastVisit) : '—'}</td>
                  <td>
                    {s.dueDate ? (
                      <>
                        {formatDateShort(s.dueDate)}
                        <br />
                        <span className="text-faint small">{formatRelative(s.dueDate)}</span>
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="small">{renderReminderTemplate(template, s)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3 className="mt-3">Ostatnio wysłane przypomnienia ({sent.length})</h3>
      {sent.length === 0 ? (
        <div className="empty">
          <IconChip name="send" />
          Nie wysłano jeszcze żadnego przypomnienia.
        </div>
      ) : (
        <>
          <div className="list">
            {sentSlice.map((f) => (
              <article key={f.id} className="row-card">
                <Avatar label={petName(f.petId)} photoUrl={petPhoto(f.petId)} />
                <div className="grow">
                  <h4>{petName(f.petId)}</h4>
                  <div className="sub">
                    {ownerName(f.clientId)} · {f.sentAt ? formatStamp(f.sentAt) : '—'} ·{' '}
                    {f.auto ? 'automat' : 'ręcznie'}
                  </div>
                  <div className="quote-box mt-1">{f.text}</div>
                </div>
                <span className="badge badge-mint">dostarczone</span>
              </article>
            ))}
          </div>

          {sentPages > 1 && (
            <div className="reminder-pager">
              <button
                className="btn btn-outline btn-sm"
                disabled={currentSentPage === 0}
                onClick={() => setSentPage(currentSentPage - 1)}
              >
                <Icon name="chevronLeft" size={14} />
                Poprzednia
              </button>
              <span className="text-muted small">
                Strona {currentSentPage + 1} z {sentPages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={currentSentPage >= sentPages - 1}
                onClick={() => setSentPage(currentSentPage + 1)}
              >
                Następna
                <Icon name="chevronRight" size={14} />
              </button>
            </div>
          )}
        </>
      )}
      {toast}
    </>
  )
}
