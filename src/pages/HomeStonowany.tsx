import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BeforeAfter } from '../components/BeforeAfter'
import { Calendar } from '../components/Calendar'
import { FeatureIconS, IconS, IconSDot, StarsS } from '../components/IconStonowany'
import { Photo } from '../components/Photo'
import { useToast } from '../components/Toast'
import { BREEDS, breedById, growthLabel } from '../data/breeds'
import { CATEGORY_ICON, INCLUDED, WHY } from '../data/landing'
import { PHOTOS } from '../data/photos'
import { REVIEW_STATS, REVIEWS } from '../data/reviews'
import { CATEGORY_LABEL, SERVICES } from '../data/services'
import { SITE } from '../data/site'
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

/**
 * Motyw „Stonowany" — druga oprawa tego samego landingu.
 *
 * Treść jest 1:1 z motywem „Cukierkowy" (`Home.tsx`); różni się wyłącznie
 * układ, typografia, ikony (pełne sylwetki z `IconStonowany`) i materiał
 * wizualny (fotografie z `public/photos/` zamiast ilustracji SVG).
 */
export function HomeStonowany() {
  return (
    <div className="st">
      <Hero />
      <Included />
      <About />
      <IntervalCalculator />
      <WhyUs />
      <Pricing />
      <Reviews />
      <Effects />
      <Gallery />
      <Availability />
      <FinalCta />
      <Contact />
    </div>
  )
}

/* ─────────────────────────── HERO ─────────────────────────── */

function Hero() {
  return (
    <header className="st-hero">
      <div className="container">
        <div className="st-hero-grid">
          <div className="st-hero-copy">
            <span className="st-eyebrow">{SITE.locationEyebrow}</span>
            <h1>
              Salon, z którego Twój pies wychodzi{' '}
              <span className="accent">zadbany i spokojny</span>
            </h1>
            <p className="st-lead">
              Kameralne studio pielęgnacji psów małych i średnich ras. Kąpiel, suszenie,
              strzyżenie, pazurki i uszy w tempie dopasowanym do psa.
            </p>

            <div className="st-hero-cta">
              <Link to="/rezerwacja" className="st-btn st-btn--solid st-btn--lg">
                Umów wizytę
              </Link>
              <span className="st-note">wolne terminy w tym tygodniu</span>
            </div>
          </div>

          <div className="st-hero-media">
            <Photo photo={PHOTOS.hero} fill />
            <div className="st-hero-card st-hero-card--a">
              <b>2,5 h</b>
              <span>spokojnej pielęgnacji</span>
            </div>
            <div className="st-hero-card st-hero-card--b">
              <IconSDot name="bell" tone="sage" />
              <span>przypomnimy o kolejnej wizycie</span>
            </div>
          </div>
        </div>

        <div className="st-hero-strip">
          <span>Strzyżenie nożyczkowe</span>
          <span>Rezerwacja online</span>
          <span>Jeden pies naraz</span>
        </div>
      </div>
    </header>
  )
}

/* ─────────────────────── CO OBEJMUJE WIZYTA ─────────────────────── */

function Included() {
  const [lead, ...rest] = INCLUDED

  return (
    <section className="st-section">
      <div className="container">
        <div className="st-head">
          <h2>
            Wszystko, czego potrzebuje
            <br />
            Twój pies <span className="accent">w jednej wizycie</span>
          </h2>
          <p>Bez dopłat za rzeczy, które i tak powinny być standardem.</p>
        </div>

        <div className="st-services">
          <div className="st-services-photo">
            <Photo photo={PHOTOS.uslugi} fill />
          </div>

          <div className="st-services-list">
            <article className="st-card st-card--filled">
              <FeatureIconS name={lead.icon} />
              <h3>{lead.title}</h3>
              <p>{lead.text}</p>
            </article>

            {rest.map((f) => (
              <article className="st-card" key={f.title}>
                <FeatureIconS name={f.icon} />
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── O MNIE ─────────────────────────── */

function About() {
  return (
    <section className="st-section st-section--tint" id="o-mnie">
      <div className="container">
        <div className="st-about">
          <div className="st-about-photo">
            <Photo photo={PHOTOS.oMnie} ratio="3 / 4" />
          </div>

          <div className="st-about-panel">
            <span className="st-eyebrow">O mnie</span>
            <h2>
              {SITE.groomerFirstName}, groomerka{' '}
              <span className="accent">{SITE.aboutLocation}</span>
            </h2>
            <p className="st-body">
              Od kilku lat zajmuję się pielęgnacją psów małych i średnich ras. Prowadzę
              salon sama, więc w danym momencie zajmuję się tylko jednym psem. Bez
              szczekania w tle, bez czekania w klatce, bez pośpiechu. Dla wielu zwierzaków
              to różnica między wizytą do przetrwania a spokojnym rytuałem.
            </p>
            <p className="st-body">
              Najczęściej goszczę shih tzu, maltipoo, maltańczyki, yorki, bichony i cocker
              spaniele. Strzygę nożyczkami, dobieram fryzurę do typu okrywy i trybu życia
              psa, a przy wyjściu zawsze mówię, kiedy warto wrócić. Każda rasa odrasta w
              swoim tempie.
            </p>

            <div className="st-facts">
              <div>
                <b>
                  {REVIEW_STATS.rating}/5
                </b>
                <span>średnia z {REVIEW_STATS.count} opinii</span>
              </div>
              <div>
                <b>1:1</b>
                <span>jeden pies w salonie naraz</span>
              </div>
              <div>
                <b>2,5 h</b>
                <span>tyle trwa pełna pielęgnacja</span>
              </div>
            </div>

            <p className="st-fine">
              Sekcja do uzupełnienia własnym tekstem i zdjęciem. Struktura i style są gotowe.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────── KALKULATOR ODSTĘPU MIĘDZY WIZYTAMI ─────────────────── */

const CALC_STEPS = [
  { no: 'krok 01', text: 'Wybierz rasę swojego psa' },
  { no: 'krok 02', text: 'Podaj datę ostatniego strzyżenia' },
  { no: 'krok 03', text: 'Poznaj zalecany termin kolejnej wizyty' },
]

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
    <section className="st-calc" id="kalkulator">
      <div className="st-calc-bg">
        <Photo photo={PHOTOS.kalkulator} fill />
      </div>
      <div className="container st-calc-grid">
        <div className="st-calc-copy">
          <h2>
            Kiedy kolejna
            <br />
            <span className="accent">wizyta?</span>
          </h2>
          <p>
            Odstęp między strzyżeniami zależy od tego, jak szybko odrasta okrywa danej
            rasy. Sprawdź swój termin.
          </p>

          <ol className="st-steps">
            {CALC_STEPS.map((s) => (
              <li key={s.no}>
                <small>{s.no}</small>
                <span>{s.text}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="st-calc-card">
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

          <div className="st-calc-split">
            <div>
              <small>Tempo wzrostu</small>
              <b>{breed.growthRate}</b>
            </div>
            <span className="st-calc-vs">więc</span>
            <div>
              <small>Zalecany odstęp</small>
              <b>co {breed.intervalWeeks} tyg.</b>
            </div>
          </div>

          <div className={`st-calc-result ${late ? 'is-late' : ''}`}>
            <span>{late ? 'Termin minął' : 'Kolejna wizyta zalecana'}</span>
            <b>{formatDate(due)}</b>
            <span>
              {late
                ? `${Math.abs(diff)} dni temu`
                : diff === 0
                  ? 'to dziś'
                  : `za ${diff} dni`}
            </span>
          </div>

          <Link to="/rezerwacja" className="st-btn st-btn--solid st-btn--block">
            Sprawdź wolne terminy
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────── DLACZEGO ─────────────────────────── */

const WHY_PHOTOS = [PHOTOS.why1, PHOTOS.why2, PHOTOS.why3, PHOTOS.why4]

function WhyUs() {
  return (
    <section className="st-section st-section--tint">
      <div className="container">
        <div className="st-head">
          <h2>
            Dlaczego <span className="accent">{SITE.brandLine2}</span>
          </h2>
          <p>Cztery rzeczy, które robimy inaczej niż duże salony.</p>
        </div>

        <div className="st-why">
          {WHY.map((w, i) => (
            <article className="st-why-card" key={w.title}>
              <div className="st-why-photo">
                <Photo photo={WHY_PHOTOS[i]} fill />
                <span className="st-why-icon">
                  <IconS name={w.icon} size={16} />
                </span>
              </div>
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
    <section className="st-section" id="cennik">
      <div className="container">
        <div className="st-head">
          <h2>
            Cennik dopasowany
            <br />
            <span className="accent">do rasy</span>
          </h2>
          <p>
            Cena zależy od rasy i wagi psa, bo tyle właśnie zajmuje rozczesanie, kąpiel i
            strzyżenie. Każda usługa strzyżeniowa zawiera komplet: kąpiel, suszenie,
            pazurki i uszy.
          </p>
        </div>

        {categories.map((cat) => (
          <div className="st-price-group" key={cat}>
            <div className="st-price-head">
              <IconSDot name={CATEGORY_ICON[cat]} tone="dark" />
              <h3>{CATEGORY_LABEL[cat]}</h3>
            </div>

            <ul className="st-price-list">
              {SERVICES.filter((s) => s.category === cat).map((s) => (
                <li className="st-price-row" key={s.id}>
                  <div className="st-price-main">
                    <h4>
                      {s.name}
                      {s.popular && <em className="st-flag">Najczęściej wybierane</em>}
                    </h4>
                    <p>{s.description}</p>
                    <span className="st-price-meta">
                      <IconS name="clock" size={13} />
                      {formatDuration(s.durationMin)}
                    </span>
                  </div>

                  <div className="st-price-side">
                    <div className="st-price-value">
                      {s.price} zł{s.estimatedPrice && <sup>*</sup>}
                    </div>
                    <Link to={`/rezerwacja?usluga=${s.id}`} className="st-btn st-btn--line">
                      Umów tę usługę
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <p className="st-fine st-fine--center">
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
    <section className="st-section st-section--tint" id="opinie">
      <div className="container">
        <div className="st-head">
          <h2>
            Co mówią <span className="accent">właściciele</span>
          </h2>
        </div>

        <div className="st-rating">
          <div className="st-rating-score">{REVIEW_STATS.rating}</div>
          <div className="st-rating-mid">
            <StarsS />
            <span>
              {REVIEW_STATS.count} opinii, w tym {REVIEW_STATS.fiveStars} na pięć gwiazdek
            </span>
          </div>
          <a
            href={REVIEW_STATS.url}
            target="_blank"
            rel="noreferrer"
            className="st-btn st-btn--line"
          >
            Zobacz więcej opinii
            <IconS name="external" size={13} />
          </a>
        </div>

        <div className="st-reviews">
          {best.map((r) => (
            <article className="st-review" key={r.id}>
              <StarsS count={r.rating} />
              <p>{r.text}</p>
              <footer>
                <span className="st-initial" aria-hidden="true">
                  {r.author.trim().charAt(0).toUpperCase()}
                </span>
                <span>
                  <b>{r.author}</b>
                  <small>
                    {r.dog} · {r.date}
                  </small>
                </span>
              </footer>
            </article>
          ))}
        </div>

        <p className="st-fine st-fine--center">
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
    <section className="st-section" id="efekty">
      <div className="container">
        <div className="st-head">
          <h2>
            Metamorfozy <span className="accent">z mojego stołu</span>
          </h2>
          <p>Przeciągnij suwak, żeby zobaczyć różnicę. Wybierz psa poniżej.</p>
        </div>
        <BeforeAfter media="zdjecie" />
      </div>
    </section>
  )
}

/* ───────────────── PAS ZDJĘĆ (bez treści, sam materiał) ───────────────── */

function Gallery() {
  return (
    <div className="st-gallery" aria-hidden="true">
      <Photo photo={PHOTOS.galeria1} ratio="1 / 1" />
      <Photo photo={PHOTOS.galeria2} ratio="1 / 1" />
      <Photo photo={PHOTOS.galeria3} ratio="1 / 1" />
      <Photo photo={PHOTOS.galeria4} ratio="1 / 1" />
    </div>
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
    <section className="st-section st-section--tint" id="kalendarz">
      <div className="container">
        <div className="st-head">
          <h2>
            Sprawdź <span className="accent">wolne terminy</span>
          </h2>
          <p>
            Kalendarz pokazuje realną dostępność dla pełnej pielęgnacji (
            {formatDuration(duration)}). Rezerwacja zajmuje minutę.
          </p>
        </div>

        <div className="st-availability">
          <Calendar
            appointments={db.appointments}
            durationMin={duration}
            selected={date}
            onSelect={setDate}
          />

          <div className="st-panel">
            {date ? (
              <>
                <h3 className="is-date">{formatDateWithWeekday(date)}</h3>
                <p className="st-panel-sub">Salon czynny: {openingLabel(date)}</p>
                {slots.length ? (
                  <>
                    <div className="st-slots">
                      {slots.slice(0, 12).map((t) => (
                        <Link
                          key={t}
                          className="st-slot"
                          to={`/rezerwacja?data=${date}&godzina=${t}`}
                        >
                          {t}
                        </Link>
                      ))}
                    </div>
                    <p className="st-fine">Kliknij godzinę, aby przejść do rezerwacji.</p>
                  </>
                ) : (
                  <p className="st-panel-sub">Brak wolnych godzin tego dnia.</p>
                )}
              </>
            ) : (
              <>
                <h3>Najbliższe wolne terminy</h3>
                <div className="st-soonest">
                  {soonest.map((s) => (
                    <Link
                      key={s.date + s.time}
                      to={`/rezerwacja?data=${s.date}&godzina=${s.time}`}
                      className="st-soonest-row"
                    >
                      <IconSDot name="calendar" tone="light" />
                      <span className="st-soonest-text">
                        <b>{formatDate(s.date)}</b>
                        <small>
                          godz. {s.time}
                          {s.date === todayISO() ? ', dziś' : ''}
                        </small>
                      </span>
                      <IconS name="arrowRight" size={17} />
                    </Link>
                  ))}
                </div>
              </>
            )}

            <div className="st-note-box">
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

            <Link to="/rezerwacja" className="st-btn st-btn--solid st-btn--block">
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
    <section className="st-cta">
      <div className="container">
        <h2>
          Zarezerwuj wizytę dla swojego psa <span className="accent">już dziś</span>
        </h2>
        <p>
          Załóż konto, dodaj profil pupila i wybierz termin. Resztę, łącznie z
          przypomnieniem o kolejnym strzyżeniu, weźmiemy na siebie.
        </p>
        <Link to="/rezerwacja" className="st-btn st-btn--light st-btn--lg">
          Umów wizytę
        </Link>
        <span className="st-note st-note--invert">rezerwacja online, całą dobę</span>
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
    <section className="st-section" id="kontakt">
      <div className="container">
        <div className="st-head">
          <h2>
            Napisz <span className="accent">do mnie</span>
          </h2>
          <p>
            Masz pytanie o fryzurę, kołtuny albo pierwszą wizytę szczeniaka? Odpowiadam
            zwykle tego samego dnia.
          </p>
        </div>

        <div className="st-contact">
          <form className="st-form" onSubmit={submit}>
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
            <button className="st-btn st-btn--solid st-btn--block" type="submit">
              Wyślij wiadomość
            </button>
            <p className="st-fine">
              W demo wiadomość trafia do panelu administratora, bez wysyłki e-mail.
            </p>
          </form>

          <aside className="st-salon">
            <div className="st-salon-photo">
              <Photo photo={PHOTOS.kontakt} ratio="16 / 9" />
            </div>

            <h3>Salon</h3>

            <div className="st-salon-row">
              <IconSDot name="pin" tone="light" />
              <div>
                <div>{SITE.addressLine1}</div>
                <small>{SITE.addressLine2}</small>
              </div>
            </div>
            <div className="st-salon-row">
              <IconSDot name="phone" tone="light" />
              <div>
                <a href={`tel:${SITE.phoneTel}`}>{SITE.phone}</a>
                <small>{SITE.email}</small>
              </div>
            </div>

            <h4>Godziny otwarcia</h4>
            <table className="st-hours">
              <tbody>
                <tr>
                  <td>poniedziałek do piątku</td>
                  <td>10:00 – 20:00</td>
                </tr>
                <tr>
                  <td>sobota</td>
                  <td>10:00 – 16:00</td>
                </tr>
                <tr>
                  <td>niedziela</td>
                  <td>nieczynne</td>
                </tr>
              </tbody>
            </table>

            <div className="st-note-box">
              <strong>Automatyczne przypomnienia.</strong> Po wizycie system policzy, kiedy
              futro Twojego psa odrośnie, i wyśle przypomnienie o kolejnym strzyżeniu.
              Tempo liczone jest osobno dla każdej rasy, od{' '}
              {Math.min(...BREEDS.map((b) => b.intervalWeeks))} do{' '}
              {Math.max(...BREEDS.map((b) => b.intervalWeeks))} tygodni.
              <span className="st-fine">
                {growthLabel['bardzo szybki']} oznacza wizytę co 5 tygodni.
              </span>
            </div>

            <a
              href={REVIEW_STATS.url}
              target="_blank"
              rel="noreferrer"
              className="st-btn st-btn--line st-btn--block"
            >
              Więcej opinii online
              <IconS name="external" size={13} />
            </a>
          </aside>
        </div>
      </div>
      {toast}
    </section>
  )
}
