import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Avatar, Icon, IconChip } from '../components/Icon'
import { PetForm } from '../components/PetForm'
import { useToast } from '../components/Toast'
import { breedById, growthLabel } from '../data/breeds'
import { serviceById } from '../data/services'
import {
  formatDate,
  formatDateWithWeekday,
  formatRelative,
  formatStamp,
  todayISO,
} from '../lib/date'
import { petSchedule } from '../lib/followups'
import { plural, useStore } from '../lib/store'
import type { Appointment, Pet } from '../lib/types'

type Tab = 'wizyty' | 'pupile' | 'skrzynka' | 'profil'

export function Account() {
  const {
    db,
    user,
    addPet,
    updatePet,
    removePet,
    cancelAppointment,
    updateProfile,
    markAllNotificationsRead,
    markNotificationRead,
  } = useStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [toast, showToast] = useToast()
  const [tab, setTab] = useState<Tab>(params.get('nowe') ? 'pupile' : 'wizyty')
  const [petFormOpen, setPetFormOpen] = useState(false)
  const [editing, setEditing] = useState<Pet | null>(null)

  useEffect(() => {
    if (!user) navigate('/logowanie?powrot=/konto', { replace: true })
  }, [user, navigate])

  useEffect(() => {
    if (params.get('rezerwacja') === 'ok')
      showToast('Wizyta zarezerwowana. Do zobaczenia w salonie.')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const myPets = useMemo(
    () => (user ? db.pets.filter((p) => p.ownerId === user.id) : []),
    [db.pets, user],
  )
  const myAppointments = useMemo(
    () =>
      user
        ? db.appointments
            .filter((a) => a.clientId === user.id)
            .sort((a, b) => (a.date + a.time > b.date + b.time ? 1 : -1))
        : [],
    [db.appointments, user],
  )
  const myNotifications = useMemo(
    () => (user ? db.notifications.filter((n) => n.clientId === user.id) : []),
    [db.notifications, user],
  )

  if (!user) return null

  const today = todayISO()
  const upcoming = myAppointments.filter((a) => a.status === 'scheduled' && a.date >= today)
  const past = myAppointments
    .filter((a) => a.status !== 'scheduled' || a.date < today)
    .reverse()
  const unread = myNotifications.filter((n) => !n.read).length

  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <div>
            <span className="eyebrow">Panel klienta</span>
            <h1>
              Cześć, <span className="accent">{user.name.split(' ')[0]}</span>
            </h1>
            <p>
              Masz {myPets.length} {plural(myPets.length, 'pupila', 'pupile', 'pupili')} i{' '}
              {upcoming.length}{' '}
              {plural(
                upcoming.length,
                'zaplanowaną wizytę',
                'zaplanowane wizyty',
                'zaplanowanych wizyt',
              )}
              .
            </p>
          </div>
          <Link to="/rezerwacja" className="btn btn-primary">
            Umów wizytę
          </Link>
        </div>

        <div className="tabs">
          <button
            className={`tab ${tab === 'wizyty' ? 'active' : ''}`}
            onClick={() => setTab('wizyty')}
          >
            <Icon name="calendar" size={17} />
            Wizyty <span className="count">{upcoming.length}</span>
          </button>
          <button
            className={`tab ${tab === 'pupile' ? 'active' : ''}`}
            onClick={() => setTab('pupile')}
          >
            <Icon name="dog" size={17} />
            Moje pupile <span className="count">{myPets.length}</span>
          </button>
          <button
            className={`tab ${tab === 'skrzynka' ? 'active' : ''}`}
            onClick={() => setTab('skrzynka')}
          >
            <Icon name="mail" size={17} />
            Skrzynka {unread > 0 && <span className="count">{unread}</span>}
          </button>
          <button
            className={`tab ${tab === 'profil' ? 'active' : ''}`}
            onClick={() => setTab('profil')}
          >
            <Icon name="settings" size={17} />
            Profil
          </button>
        </div>

        {/* WIZYTY */}
        {tab === 'wizyty' && (
          <>
            <h3>Nadchodzące</h3>
            {upcoming.length === 0 ? (
              <div className="empty">
                <IconChip name="calendar" />
                Nie masz zaplanowanych wizyt.
                <div className="mt-2">
                  <Link to="/rezerwacja" className="btn btn-primary">
                    Wybierz termin
                  </Link>
                </div>
              </div>
            ) : (
              <div className="list">
                {upcoming.map((a) => (
                  <AppointmentRow
                    key={a.id}
                    appointment={a}
                    pets={myPets}
                    onCancel={() => {
                      if (confirm('Na pewno odwołać tę wizytę?')) {
                        cancelAppointment(a.id)
                        showToast('Wizyta odwołana.')
                      }
                    }}
                  />
                ))}
              </div>
            )}

            <h3 className="mt-3">Historia</h3>
            {past.length === 0 ? (
              <div className="empty">
                <IconChip name="history" />
                Tu pojawi się historia wizyt.
              </div>
            ) : (
              <div className="list">
                {past.map((a) => (
                  <AppointmentRow key={a.id} appointment={a} pets={myPets} />
                ))}
              </div>
            )}
          </>
        )}

        {/* PUPILE */}
        {tab === 'pupile' && (
          <>
            <div className="flex-between" style={{ marginBottom: 18 }}>
              <h3 className="mb-0">Profile pupili</h3>
              {!petFormOpen && !editing && (
                <button className="btn btn-outline btn-sm" onClick={() => setPetFormOpen(true)}>
                  <Icon name="plus" size={15} />
                  Dodaj pupila
                </button>
              )}
            </div>

            {(petFormOpen || editing) && (
              <div className="card" style={{ marginBottom: 20 }}>
                <h4 className="mt-0">
                  {editing ? `Edytuj profil: ${editing.name}` : 'Nowy pupil'}
                </h4>
                <PetForm
                  initial={editing ?? undefined}
                  submitLabel={editing ? 'Zapisz zmiany' : 'Dodaj pupila'}
                  onCancel={() => {
                    setPetFormOpen(false)
                    setEditing(null)
                  }}
                  onSubmit={(v) => {
                    if (editing) {
                      updatePet(editing.id, v)
                      showToast('Profil zaktualizowany.')
                    } else {
                      addPet(v)
                      showToast(`Profil ${v.name} został dodany.`)
                    }
                    setPetFormOpen(false)
                    setEditing(null)
                  }}
                />
              </div>
            )}

            {myPets.length === 0 && !petFormOpen ? (
              <div className="empty">
                <IconChip name="dog" />
                Nie masz jeszcze profili pupili. Dodaj psa, żeby móc rezerwować wizyty.
              </div>
            ) : (
              <div className="grid grid-2">
                {myPets.map((p) => (
                  <PetCard
                    key={p.id}
                    pet={p}
                    onEdit={() => {
                      setEditing(p)
                      setPetFormOpen(false)
                      window.scrollTo({ top: 200, behavior: 'smooth' })
                    }}
                    onRemove={() => {
                      if (confirm(`Usunąć profil ${p.name}? Zniknie też historia jego wizyt.`)) {
                        removePet(p.id)
                        showToast('Profil usunięty.')
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* SKRZYNKA */}
        {tab === 'skrzynka' && (
          <>
            <div className="flex-between" style={{ marginBottom: 18 }}>
              <div>
                <h3 className="mb-0">Wiadomości od salonu</h3>
                <p className="text-muted small mb-0">
                  Automatyczne przypomnienia o strzyżeniu wyliczane na podstawie rasy.
                </p>
              </div>
              {unread > 0 && (
                <button className="btn btn-ghost btn-sm" onClick={markAllNotificationsRead}>
                  Oznacz wszystkie jako przeczytane
                </button>
              )}
            </div>

            {myNotifications.length === 0 ? (
              <div className="empty">
                <IconChip name="mail" />
                Skrzynka jest pusta. Przypomnienie przyjdzie, gdy zbliży się termin
                kolejnego strzyżenia.
              </div>
            ) : (
              <div className="list">
                {myNotifications.map((n) => (
                  <article key={n.id} className={`row-card ${n.read ? '' : 'unread'}`}>
                    <IconChip name="bell" accent={!n.read} />
                    <div className="grow">
                      <h4>
                        {n.title}
                        {!n.read && <span className="badge badge-accent">nowa</span>}
                      </h4>
                      <p>{n.body}</p>
                      <div className="sub mt-1">{formatStamp(n.createdAt)}</div>
                    </div>
                    <div className="row-actions">
                      <Link to="/rezerwacja" className="btn btn-primary btn-sm">
                        Umów wizytę
                      </Link>
                      {!n.read && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => markNotificationRead(n.id)}
                        >
                          Przeczytane
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {/* PROFIL */}
        {tab === 'profil' && (
          <div className="card" style={{ maxWidth: 500 }}>
            <h3 className="mt-0">Dane kontaktowe</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const fd = new FormData(e.currentTarget)
                updateProfile({
                  name: String(fd.get('name')),
                  phone: String(fd.get('phone')),
                })
                showToast('Dane zapisane.')
              }}
            >
              <div className="field">
                <label htmlFor="a-name">Imię i nazwisko</label>
                <input id="a-name" name="name" defaultValue={user.name} required />
              </div>
              <div className="field">
                <label htmlFor="a-phone">Telefon</label>
                <input id="a-phone" name="phone" defaultValue={user.phone} />
              </div>
              <div className="field">
                <label htmlFor="a-email">E-mail (login)</label>
                <input id="a-email" defaultValue={user.email} disabled />
              </div>
              <button className="btn btn-primary" type="submit">
                Zapisz zmiany
              </button>
            </form>
          </div>
        )}
      </div>
      {toast}
    </div>
  )
}

function AppointmentRow({
  appointment: a,
  pets,
  onCancel,
}: {
  appointment: Appointment
  pets: Pet[]
  onCancel?: () => void
}) {
  const pet = pets.find((p) => p.id === a.petId)
  const service = serviceById(a.serviceId)

  const statusBadge =
    a.status === 'cancelled' ? (
      <span className="badge badge-grey">odwołana</span>
    ) : a.status === 'completed' ? (
      <span className="badge badge-mint">zrealizowana</span>
    ) : (
      <span className="badge badge-accent">zaplanowana</span>
    )

  return (
    <article className="row-card">
      <Avatar label={pet?.name ?? 'P'} />
      <div className="grow">
        <h4>
          {pet?.name ?? 'Pupil'} · {service?.name ?? 'Usługa'}
          {statusBadge}
        </h4>
        <div className="sub">
          {formatDateWithWeekday(a.date)}, godz. {a.time} · {a.price} zł
          {a.paid && ' · opłacona'}
          {a.status === 'scheduled' && ` · ${formatRelative(a.date)}`}
        </div>
        {a.notes && <div className="sub">Uwagi: {a.notes}</div>}
      </div>
      {onCancel && (
        <button className="btn btn-danger btn-sm" onClick={onCancel}>
          Odwołaj
        </button>
      )}
    </article>
  )
}

function PetCard({
  pet,
  onEdit,
  onRemove,
}: {
  pet: Pet
  onEdit: () => void
  onRemove: () => void
}) {
  const { db } = useStore()
  const breed = breedById(pet.breedId)
  const s = petSchedule(db, pet, db.settings.leadDays)

  const badge =
    s.state === 'po-terminie' ? (
      <span className="badge badge-rose">czas na strzyżenie</span>
    ) : s.state === 'zbliza-sie' ? (
      <span className="badge badge-butter">termin się zbliża</span>
    ) : s.state === 'ok' ? (
      <span className="badge badge-mint">futro w formie</span>
    ) : (
      <span className="badge badge-grey">brak historii</span>
    )

  return (
    <article className="card">
      <div className="flex flex-start">
        <Avatar label={pet.name} />
        <div className="grow">
          <h3 style={{ margin: 0 }}>{pet.name}</h3>
          <p className="text-muted small mb-0">
            {breed.name} · {pet.weightKg} kg
            {pet.birthYear ? ` · ur. ${pet.birthYear}` : ''}
          </p>
        </div>
        {badge}
      </div>

      {pet.notes && <p className="text-muted small mt-2">Uwagi: {pet.notes}</p>}

      <div className="info-note mt-2">
        {growthLabel[breed.growthRate]}, wizyta co <strong>{breed.intervalWeeks} tyg.</strong>
        <br />
        Ostatnie strzyżenie:{' '}
        <strong>{s.lastVisit ? formatDate(s.lastVisit) : 'brak w systemie'}</strong>
        {s.dueDate && (
          <>
            <br />
            Kolejne zalecane: <strong>{formatDate(s.dueDate)}</strong>{' '}
            <span className="text-faint">({formatRelative(s.dueDate)})</span>
          </>
        )}
      </div>

      <div className="row-actions">
        <Link to="/rezerwacja" className="btn btn-primary btn-sm">
          Umów wizytę
        </Link>
        <button className="btn btn-outline btn-sm" onClick={onEdit}>
          <Icon name="pencil" size={14} />
          Edytuj
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onRemove}>
          <Icon name="trash" size={14} />
          Usuń
        </button>
      </div>
    </article>
  )
}
