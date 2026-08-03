import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BeforeAfter } from '../components/BeforeAfter'
import { Calendar } from '../components/Calendar'
import { HandNote } from '../components/Decor'
import { HeroArt, PortraitArt } from '../components/DogArt'
import { Avatar, FeatureIcon, Icon, IconChip, Stars } from '../components/Icon'
import { useToast } from '../components/Toast'
import { BREEDS, breedById, growthLabel } from '../data/breeds'
import { CATEGORY_ICON, INCLUDED, WHY } from '../data/landing'
import { REVIEW_STATS, REVIEWS } from '../data/reviews'
import { SITE } from '../data/site'
import { CATEGORY_LABEL, SERVICES } from '../data/services'
import { availableSlots, nextFreeSlots, openingLabel } from '../lib/availability'
import {
  addWeeks,
  daysBetween,
  formatDate,
  formatDateWithWeekday,
  formatDuration,
  todayISO,
} from '../lib/date'
import { useStore } from '../lib/store'
import { HomeStonowany } from './HomeStonowany'

/**
 * Landing w dwóch oprawach. Wybór motywu („Motywy" w nawigacji) trzyma store;
 * treść jest identyczna w obu wariantach — różni się układ, ikony i materiał
 * wizualny. Motyw nie dotyka panelu klienta ani admina.
 */
export function Home() {
  const location = useLocation()
  const { theme } = useStore()

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60)
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.hash, theme])

  return theme === 'stonowany' ? <HomeStonowany /> : <HomeCukierkowy />
}

function HomeCukierkowy() {
  return (
    <>
      <Hero />
      <Included />
      <About />
      <IntervalCalculator />
      <WhyUs />
      <Pricing />
      <Reviews />
      <Effects />
      <Availability />
      <FinalCta />
      <Contact />
    </>
  )
}

/* ─────────────────────────── HERO ─────────────────────────── */

function Hero() {
  return (
    <header className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">{SITE.locationEyebrow}</span>
          <h1>
            Salon, z którego Twój pies wychodzi{' '}
            <span className="accent">zadbany i spokojny</span>
          </h1>
          <p className="hero-lead">
            Kameralne studio pielęgnacji psów małych i średnich ras. Kąpiel, suszenie,
            strzyżenie, pazurki i uszy w tempie dopasowanym do psa.
          </p>

          <div className="hero-chips">
            <span className="chip">Strzyżenie nożyczkowe</span>
            <span className="chip">Rezerwacja online</span>
            <span className="chip">Jeden pies naraz</span>
          </div>

          <div className="hero-cta">
            <Link to="/rezerwacja" className="btn btn-primary btn-lg">
              Umów wizytę
            </Link>
            <HandNote>wolne terminy w tym tygodniu</HandNote>
          </div>
        </div>

        <div className="hero-visual">
          <HeroArt />
          <div className="hero-float f1">
            <div>
              <b>2,5 h</b>
              spokojnej pielęgnacji
            </div>
          </div>
          <div className="hero-float f2">
            <IconChip name="bell" accent />
            <div>przypomnimy o kolejnej wizycie</div>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ─────────────────────── CO OBEJMUJE WIZYTA ─────────────────────── */

function Included() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>
            Wszystko, czego potrzebuje
            <br />
            Twój pies <span className="accent">w jednej wizycie</span>
          </h2>
          <p>Bez dopłat za rzeczy, które i tak powinny być standardem.</p>
        </div>

        <div className="grid grid-3">
          {INCLUDED.map((f) => (
            <article className="feature" key={f.title}>
              <FeatureIcon name={f.icon} />
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── O MNIE ─────────────────────────── */

function About() {
  return (
    <section className="section section--tint" id="o-mnie">
      <div className="container about-grid">
        <div className="about-photo">
          <PortraitArt />
        </div>

        <div>
          <span className="eyebrow">O mnie</span>
          <h2>
            {SITE.groomerFirstName}, groomerka{' '}
            <span className="accent">{SITE.aboutLocation}</span>
          </h2>
          <p className="text-muted">
            Od kilku lat zajmuję się pielęgnacją psów małych i średnich ras. Prowadzę
            salon sama, więc w danym momencie zajmuję się tylko jednym psem. Bez
            szczekania w tle, bez czekania w klatce, bez pośpiechu. Dla wielu zwierzaków
            to różnica między wizytą do przetrwania a spokojnym rytuałem.
          </p>
          <p className="text-muted">
            Najczęściej goszczę shih tzu, maltipoo, maltańczyki, yorki, bichony i cocker
            spaniele. Strzygę nożyczkami, dobieram fryzurę do typu okrywy i trybu życia
            psa, a przy wyjściu zawsze mówię, kiedy warto wrócić. Każda rasa odrasta w
            swoim tempie.
          </p>

          <div className="fact-row">
            <div className="fact">
              <b>{REVIEW_STATS.rating}/5</b>
              <span>średnia z {REVIEW_STATS.count} opinii</span>
            </div>
            <div className="fact">
              <b>1:1</b>
              <span>jeden pies w salonie naraz</span>
            </div>
            <div className="fact">
              <b>2,5 h</b>
              <span>tyle trwa pełna pielęgnacja</span>
            </div>
          </div>

          <p className="text-faint small mt-2">
            Sekcja do uzupełnienia własnym tekstem i zdjęciem. Struktura i style są gotowe.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────── KALKULATOR ODSTĘPU MIĘDZY WIZYTAMI ─────────────────── */

function IntervalCalculator() {
  const today = todayISO()
  const [breedId, setBreedId] = useState('shih-tzu')
  const [last, setLast] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 40)
    return d.toISOString().slice(0, 10)
  })

  const breed = breedById(breedId)
  const due = addWeeks(last, breed.intervalWeeks)
  const diff = daysBetween(today, due)
  const late = diff < 0

  return (
    <section className="section" id="kalkulator">
      <div className="container">
        <div className="block block--accent paws">
          <div className="calc-grid">
            <div>
              <h2>
                Kiedy kolejna
                <br />
                <span className="accent">wizyta?</span>
              </h2>
              <p style={{ opacity: 0.85, maxWidth: '38ch' }}>
                Odstęp między strzyżeniami zależy od tego, jak szybko odrasta okrywa
                danej rasy. Sprawdź swój termin.
              </p>

              <div className="step-list">
                <div className="step-item">
                  <IconChip name="dog" />
                  <div>
                    <small>krok 01</small>
                    <span>Wybierz rasę swojego psa</span>
                  </div>
                </div>
                <div className="step-item">
                  <IconChip name="calendar" />
                  <div>
                    <small>krok 02</small>
                    <span>Podaj datę ostatniego strzyżenia</span>
                  </div>
                </div>
                <div className="step-item">
                  <IconChip name="bell" />
                  <div>
                    <small>krok 03</small>
                    <span>Poznaj zalecany termin kolejnej wizyty</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="calc-card">
              <div className="field">
                <label htmlFor="calc-breed">Rasa</label>
                <select
                  id="calc-breed"
                  value={breedId}
                  onChange={(e) => setBreedId(e.target.value)}
                >
                  {BREEDS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="calc-date">Ostatnie strzyżenie</label>
                <input
                  id="calc-date"
                  type="date"
                  max={today}
                  value={last}
                  onChange={(e) => setLast(e.target.value)}
                />
              </div>

              <div className="calc-split">
                <div className="calc-mini">
                  <small>Tempo wzrostu</small>
                  <b style={{ fontSize: '1rem' }}>{breed.growthRate}</b>
                </div>
                <span className="calc-vs">więc</span>
                <div className="calc-mini">
                  <small>Zalecany odstęp</small>
                  <b>co {breed.intervalWeeks} tyg.</b>
                </div>
              </div>

              <div className={`calc-result ${late ? 'is-late' : ''}`}>
                <span className="small">
                  {late ? 'Termin minął' : 'Kolejna wizyta zalecana'}
                </span>
                <b>{formatDate(due)}</b>
                <span className="small">
                  {late
                    ? `${Math.abs(diff)} dni temu`
                    : diff === 0
                      ? 'to dziś'
                      : `za ${diff} dni`}
                </span>
              </div>

              <Link to="/rezerwacja" className="btn btn-primary btn-block mt-2">
                Sprawdź wolne terminy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── DLACZEGO ─────────────────────────── */

function WhyUs() {
  return (
    <section className="section section--cream paws paws--ink">
      <div className="container">
        <div className="section-head">
          <h2>
            Dlaczego <span className="accent">{SITE.brandLine2}</span>
          </h2>
          <p>Cztery rzeczy, które robimy inaczej niż duże salony.</p>
        </div>

        <div className="grid grid-4">
          {WHY.map((w) => (
            <article className="feature" key={w.title}>
              <FeatureIcon name={w.icon} />
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── CENNIK ─────────────────────────── */

function Pricing() {
  const categories = ['strzyzenie', 'kapiel', 'dodatki'] as const

  return (
    <section className="section" id="cennik">
      <div className="container">
        <div className="section-head">
          <h2>
            Cennik dopasowany
            <br />
            <span className="accent">do rasy</span>
          </h2>
          <p>
            Cena zależy od rasy i wagi psa, bo tyle właśnie zajmuje rozczesanie, kąpiel
            i strzyżenie. Każda usługa strzyżeniowa zawiera komplet: kąpiel, suszenie,
            pazurki i uszy.
          </p>
        </div>

        {categories.map((cat) => (
          <div className="price-group" key={cat}>
            <div className="price-group-head">
              <IconChip name={CATEGORY_ICON[cat]} />
              <h3>{CATEGORY_LABEL[cat]}</h3>
            </div>
            <div className="grid grid-3">
              {SERVICES.filter((s) => s.category === cat).map((s) => (
                <article className="service-card" key={s.id}>
                  {s.popular && (
                    <span className="badge badge-butter flag">Najczęściej wybierane</span>
                  )}
                  <h4 style={{ maxWidth: s.popular ? '60%' : undefined }}>{s.name}</h4>
                  <div className="price">
                    {s.price} zł{s.estimatedPrice && <sup>*</sup>}
                  </div>
                  <p className="desc">{s.description}</p>
                  <div className="meta">
                    <Icon name="clock" size={14} />
                    {formatDuration(s.durationMin)}
                  </div>
                  <Link
                    to={`/rezerwacja?usluga=${s.id}`}
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: 4, alignSelf: 'flex-start' }}
                  >
                    Umów tę usługę
                  </Link>
                </article>
              ))}
            </div>
          </div>
        ))}

        <p className="footnote">
          * Ceny oznaczone gwiazdką są orientacyjne (dane demonstracyjne). Pozostałe
          pozycje to przykładowy cennik salonu.
        </p>
      </div>
    </section>
  )
}

/* ─────────────────────────── OPINIE ─────────────────────────── */

function Reviews() {
  const best = REVIEWS.filter((r) => r.rating === 5).slice(0, 6)

  return (
    <section className="section section--tint" id="opinie">
      <div className="container">
        <div className="section-head">
          <h2>
            Co mówią <span className="accent">właściciele</span>
          </h2>
        </div>

        <div className="rating-summary">
          <div className="score">{REVIEW_STATS.rating}</div>
          <div>
            <Stars />
            <div className="text-muted small">
              {REVIEW_STATS.count} opinii, w tym {REVIEW_STATS.fiveStars} na pięć gwiazdek
            </div>
          </div>
          <a
            href={REVIEW_STATS.url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-sm"
          >
            Zobacz więcej opinii
            <Icon name="external" size={14} />
          </a>
        </div>

        <div className="grid grid-3">
          {best.map((r) => (
            <article className="review-card" key={r.id}>
              <Stars count={r.rating} />
              <p>{r.text}</p>
              <div className="review-author">
                <Avatar label={r.author} />
                <div>
                  <b>{r.author}</b>
                  <span>
                    {r.dog} · {r.date}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="footnote mt-3">
          Opinie demonstracyjne — fikcyjne cytaty klientów. Przy wdrożeniu podmień je na
          prawdziwe opinie lub osadź widget zewnętrznego portalu.
        </p>
      </div>
    </section>
  )
}

/* ─────────────────────────── PRZED / PO ─────────────────────────── */

function Effects() {
  return (
    <section className="section" id="efekty">
      <div className="container">
        <div className="section-head">
          <h2>
            Metamorfozy <span className="accent">z mojego stołu</span>
          </h2>
          <p>Przeciągnij suwak, żeby zobaczyć różnicę. Wybierz psa poniżej.</p>
        </div>
        <BeforeAfter />
      </div>
    </section>
  )
}

/* ─────────────────────────── KALENDARZ ─────────────────────────── */

function Availability() {
  const { db, user } = useStore()
  const [date, setDate] = useState<string | null>(null)
  const duration = 150

  const slots = useMemo(
    () => (date ? availableSlots(db.appointments, date, duration) : []),
    [db.appointments, date],
  )
  const soonest = useMemo(
    () => nextFreeSlots(db.appointments, duration, 3),
    [db.appointments],
  )

  return (
    <section className="section section--cream" id="kalendarz">
      <div className="container">
        <div className="section-head">
          <h2>
            Sprawdź <span className="accent">wolne terminy</span>
          </h2>
          <p>
            Kalendarz pokazuje realną dostępność dla pełnej pielęgnacji (
            {formatDuration(duration)}). Rezerwacja zajmuje minutę.
          </p>
        </div>

        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          <Calendar
            appointments={db.appointments}
            durationMin={duration}
            selected={date}
            onSelect={setDate}
          />

          <div className="card">
            {date ? (
              <>
                <h3 style={{ marginBottom: 4 }}>{formatDateWithWeekday(date)}</h3>
                <p className="text-muted small">Salon czynny: {openingLabel(date)}</p>
                {slots.length ? (
                  <>
                    <div className="slots mt-2">
                      {slots.slice(0, 12).map((t) => (
                        <Link
                          key={t}
                          className="slot"
                          to={`/rezerwacja?data=${date}&godzina=${t}`}
                        >
                          {t}
                        </Link>
                      ))}
                    </div>
                    <p className="text-faint small mt-2">
                      Kliknij godzinę, aby przejść do rezerwacji.
                    </p>
                  </>
                ) : (
                  <p className="text-muted">Brak wolnych godzin tego dnia.</p>
                )}
              </>
            ) : (
              <>
                <h3>Najbliższe wolne terminy</h3>
                <div className="list mt-2">
                  {soonest.map((s) => (
                    <Link
                      key={s.date + s.time}
                      to={`/rezerwacja?data=${s.date}&godzina=${s.time}`}
                      className="choice"
                    >
                      <IconChip name="calendar" />
                      <span className="grow">
                        <b>{formatDate(s.date)}</b>
                        <span className="meta">
                          godz. {s.time}
                          {s.date === todayISO() ? ', dziś' : ''}
                        </span>
                      </span>
                      <Icon name="arrowRight" size={18} />
                    </Link>
                  ))}
                </div>
              </>
            )}

            <div className="info-note mt-2">
              {user ? (
                <>
                  Jesteś zalogowany jako <strong>{user.name}</strong>. Możesz od razu
                  wybrać pupila i zarezerwować termin.
                </>
              ) : (
                <>
                  Rezerwacja wymaga konta. Dzięki temu pamiętamy rasę i wagę Twojego psa
                  oraz przypominamy o kolejnym strzyżeniu.
                </>
              )}
            </div>

            <Link to="/rezerwacja" className="btn btn-primary btn-block">
              Przejdź do rezerwacji
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── CTA ─────────────────────────── */

function FinalCta() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="block block--dark paws text-center">
          <h2 style={{ maxWidth: '18ch', margin: '0 auto 16px' }}>
            Zarezerwuj wizytę dla swojego psa <span className="accent">już dziś</span>
          </h2>
          <p style={{ opacity: 0.75, maxWidth: '48ch', margin: '0 auto 28px' }}>
            Załóż konto, dodaj profil pupila i wybierz termin. Resztę, łącznie z
            przypomnieniem o kolejnym strzyżeniu, weźmiemy na siebie.
          </p>
          <div className="flex" style={{ justifyContent: 'center' }}>
            <Link to="/rezerwacja" className="btn btn-accent btn-lg">
              Umów wizytę
            </Link>
          </div>
          <div className="mt-2">
            <HandNote flip>rezerwacja online, całą dobę</HandNote>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── KONTAKT ─────────────────────────── */

function Contact() {
  const { sendMessage, user } = useStore()
  const [toast, showToast] = useToast()
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    topic: 'Pytanie o termin',
    body: '',
  })
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage({
      fromName: form.name,
      fromEmail: form.email,
      phone: form.phone,
      topic: form.topic,
      body: form.body,
      source: user ? 'panel klienta' : 'formularz',
    })
    setSent(true)
    showToast('Wiadomość trafiła do skrzynki salonu.')
    setForm((f) => ({ ...f, body: '' }))
  }

  return (
    <section className="section section--tint" id="kontakt">
      <div className="container">
        <div className="section-head">
          <h2>
            Napisz <span className="accent">do mnie</span>
          </h2>
          <p>
            Masz pytanie o fryzurę, kołtuny albo pierwszą wizytę szczeniaka? Odpowiadam
            zwykle tego samego dnia.
          </p>
        </div>

        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          <div className="card">
            <form onSubmit={submit}>
              {sent && <div className="form-ok">Dziękuję, wiadomość została wysłana.</div>}
              <div className="field-row">
                <div className="field">
                  <label htmlFor="c-name">Imię i nazwisko</label>
                  <input
                    id="c-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="c-phone">Telefon</label>
                  <input
                    id="c-phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+48 ..."
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="c-email">E-mail</label>
                <input
                  id="c-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="c-topic">Temat</label>
                <select
                  id="c-topic"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                >
                  <option>Pytanie o termin</option>
                  <option>Pierwsza wizyta szczeniaka</option>
                  <option>Wycena, rasa spoza cennika</option>
                  <option>Zmiana lub odwołanie wizyty</option>
                  <option>Inne</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="c-body">Wiadomość</label>
                <textarea
                  id="c-body"
                  required
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Napisz, jaką masz rasę, ile waży pies i czego potrzebujecie."
                />
              </div>
              <button className="btn btn-primary btn-block" type="submit">
                Wyślij wiadomość
              </button>
              <p className="text-faint small mt-2 mb-0">
                W demo wiadomość trafia do panelu administratora, bez wysyłki e-mail.
              </p>
            </form>
          </div>

          <div className="card">
            <h3>Salon</h3>
            <div className="flex flex-start" style={{ marginBottom: 18 }}>
              <IconChip name="pin" />
              <div>
                <div>{SITE.addressLine1}</div>
                <div className="text-muted small">{SITE.addressLine2}</div>
              </div>
            </div>
            <div className="flex flex-start" style={{ marginBottom: 24 }}>
              <IconChip name="phone" />
              <div>
                <a href={`tel:${SITE.phoneTel}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {SITE.phone}
                </a>
                <div className="text-muted small">{SITE.email}</div>
              </div>
            </div>

            <h4>Godziny otwarcia</h4>
            <table className="table-plain">
              <tbody>
                <tr>
                  <td>poniedziałek do piątku</td>
                  <td style={{ textAlign: 'right', fontWeight: 500 }}>10:00 – 20:00</td>
                </tr>
                <tr>
                  <td>sobota</td>
                  <td style={{ textAlign: 'right', fontWeight: 500 }}>10:00 – 16:00</td>
                </tr>
                <tr>
                  <td>niedziela</td>
                  <td style={{ textAlign: 'right', fontWeight: 500 }}>nieczynne</td>
                </tr>
              </tbody>
            </table>

            <div className="info-note mt-2">
              <strong>Automatyczne przypomnienia.</strong> Po wizycie system policzy,
              kiedy futro Twojego psa odrośnie, i wyśle przypomnienie o kolejnym
              strzyżeniu. Tempo liczone jest osobno dla każdej rasy, od{' '}
              {Math.min(...BREEDS.map((b) => b.intervalWeeks))} do{' '}
              {Math.max(...BREEDS.map((b) => b.intervalWeeks))} tygodni.
              <div className="text-faint small mt-1">
                {growthLabel['bardzo szybki']} oznacza wizytę co 5 tygodni.
              </div>
            </div>

            <a
              href={REVIEW_STATS.url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-block"
            >
              Więcej opinii online
              <Icon name="external" size={14} />
            </a>
          </div>
        </div>
      </div>
      {toast}
    </section>
  )
}
