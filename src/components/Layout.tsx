import { useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { BOOKSY_STATS } from '../data/reviews'
import { useStore } from '../lib/store'
import { Icon } from './Icon'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <DemoBar />
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

function DemoBar() {
  const { resetDemo } = useStore()
  return (
    <div className="demo-bar">
      Wersja demonstracyjna. Dane zapisują się tylko w tej przeglądarce.
      <button
        onClick={() => {
          if (confirm('Przywrócić dane demo do stanu początkowego? Twoje zmiany zostaną usunięte.')) {
            resetDemo()
          }
        }}
      >
        Zresetuj dane
      </button>
    </div>
  )
}

function Nav() {
  const { user, isAdmin, logout, db } = useStore()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const unread = user
    ? db.notifications.filter((n) => n.clientId === user.id && !n.read).length
    : 0
  const adminUnread = db.messages.filter((m) => !m.read).length

  const close = () => setOpen(false)

  const goSection = (hash: string) => {
    close()
    if (location.pathname !== '/') navigate('/' + hash)
    else document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="nav">
      <div className={`container nav-inner ${open ? 'nav-menu-open' : ''}`}>
        <Link to="/" className="logo" onClick={close}>
          <span className="logo-mark">
            <Icon name="paw" size={30} strokeWidth={1.3} />
          </span>
          <span className="logo-word">
            <span>Kael</span>
            <span>Pet Grooming</span>
          </span>
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>

        {/* Kotwice sekcji mają sens tylko na stronie głównej. W panelach
            zwalniają miejsce na akcje konta. */}
        {location.pathname === '/' && (
          <div className="nav-links">
            <button className="linklike" onClick={() => goSection('#o-mnie')}>
              O mnie
            </button>
            <button className="linklike" onClick={() => goSection('#kalkulator')}>
              Kalkulator
            </button>
            <button className="linklike" onClick={() => goSection('#cennik')}>
              Cennik
            </button>
            <button className="linklike" onClick={() => goSection('#opinie')}>
              Opinie
            </button>
            <button className="linklike" onClick={() => goSection('#efekty')}>
              Efekty
            </button>
          </div>
        )}

        <div className={`nav-actions ${location.pathname === '/' ? '' : 'nav-actions--end'}`}>
          {user ? (
            <>
              <NavLink to="/konto" onClick={close} className="btn btn-ghost btn-sm">
                Moje konto
                {unread > 0 && <span className="nav-count">{unread}</span>}
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" onClick={close} className="btn btn-ghost btn-sm">
                  Panel
                  {adminUnread > 0 && <span className="nav-count">{adminUnread}</span>}
                </NavLink>
              )}
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  logout()
                  close()
                  navigate('/')
                }}
              >
                Wyloguj
              </button>
            </>
          ) : (
            <NavLink to="/logowanie" onClick={close} className="btn btn-ghost btn-sm">
              Zaloguj się
            </NavLink>
          )}

          <Link to="/rezerwacja" className="btn btn-primary btn-sm" onClick={close}>
            Umów wizytę
          </Link>
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="logo" style={{ marginBottom: 16 }}>
              <span className="logo-mark">
                <Icon name="paw" size={30} strokeWidth={1.3} />
              </span>
              <span className="logo-word">
                <span>Kael</span>
                <span>Pet Grooming</span>
              </span>
            </Link>
            <p className="text-muted small" style={{ maxWidth: '38ch' }}>
              Kameralny salon pielęgnacji psów małych i średnich ras. Bez pośpiechu,
              bez stresu, z dbałością o każdy detal.
            </p>
            <a
              href={BOOKSY_STATS.url}
              target="_blank"
              rel="noreferrer"
              className="small"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              {BOOKSY_STATS.rating}/5 na Booksy ({BOOKSY_STATS.count} opinii)
              <Icon name="external" size={14} />
            </a>
          </div>

          <div>
            <h4>Kontakt</h4>
            <ul>
              <li>ul. Siodlarska 12, lokal 2</li>
              <li>01-461 Warszawa, Bemowo</li>
              <li>
                <a href="tel:+48500100200">+48 500 100 200</a>
              </li>
              <li>
                <a href="mailto:kontakt@kaelpetgrooming.pl">kontakt@kaelpetgrooming.pl</a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Godziny otwarcia</h4>
            <ul>
              <li>poniedziałek do piątku: 10:00 – 20:00</li>
              <li>sobota: 10:00 – 16:00</li>
              <li>niedziela: nieczynne</li>
              <li style={{ marginTop: 8 }}>
                <Link to="/rezerwacja">Sprawdź wolne terminy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Kael Pet Grooming, Oksana Kalinchuk</span>
          <span>Projekt demonstracyjny. Dane kontaktowe do uzupełnienia.</span>
        </div>
      </div>
    </footer>
  )
}
