import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { SITE } from '../data/site'
import { useStore } from '../lib/store'

export function Login() {
  const { login, register, user, draft } = useStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('powrot') ?? '/konto'

  // Jeśli trwa rezerwacja rozpoczęta przez gościa, po zalogowaniu wracamy do niej —
  // dokładnie do tej wizyty, którą użytkownik zaczął umawiać.
  const afterAuth = draft ? '/rezerwacja' : redirect

  const [mode, setMode] = useState<'login' | 'register'>(
    params.get('tryb') === 'rejestracja' ? 'register' : 'login',
  )
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password2: '',
  })

  // Zalogowanego użytkownika od razu odsyłamy dalej (do panelu lub do rezerwacji).
  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin' : afterAuth, { replace: true })
  }, [user, navigate, afterAuth])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (mode === 'login') {
      const res = login(form.email, form.password)
      if (!res.ok) return setError(res.error!)
      navigate(afterAuth)
      return
    }

    if (form.password.length < 6) return setError('Hasło musi mieć co najmniej 6 znaków.')
    if (form.password !== form.password2) return setError('Hasła nie są takie same.')
    const res = register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    })
    if (!res.ok) return setError(res.error!)
    navigate(draft ? '/rezerwacja' : '/konto?nowe=1')
  }

  const quickLogin = (email: string, password: string) => {
    setError(null)
    const res = login(email, password)
    if (res.ok) navigate(email.includes('admin') ? '/admin' : afterAuth)
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="text-center" style={{ marginBottom: 26 }}>
          <span className="eyebrow">Twoje konto</span>
          <h1 style={{ margin: '0 0 10px', fontSize: 'clamp(1.9rem, 3.4vw, 2.4rem)' }}>
            {mode === 'login' ? (
              <>
                Zaloguj <span className="accent">się</span>
              </>
            ) : (
              <>
                Załóż <span className="accent">konto</span>
              </>
            )}
          </h1>
          <p className="text-muted">
            {mode === 'login'
              ? 'Wejdź do panelu, żeby umówić wizytę i zobaczyć przypomnienia.'
              : 'Konto pozwala dodać profile pupili i rezerwować wizyty w kilka kliknięć.'}
          </p>
        </div>

        <div className="card">
          <div className="pill-tabs" style={{ width: '100%', justifyContent: 'center' }}>
            <button
              className={`pill-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => setMode('login')}
            >
              Logowanie
            </button>
            <button
              className={`pill-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => setMode('register')}
            >
              Rejestracja
            </button>
          </div>

          <form onSubmit={submit}>
            {error && <div className="form-error">{error}</div>}

            {mode === 'register' && (
              <>
                <div className="field">
                  <label htmlFor="l-name">Imię i nazwisko</label>
                  <input
                    id="l-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jan Kowalski"
                  />
                </div>
                <div className="field">
                  <label htmlFor="l-phone">Telefon</label>
                  <input
                    id="l-phone"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+48 600 000 000"
                  />
                </div>
              </>
            )}

            <div className="field">
              <label htmlFor="l-email">E-mail</label>
              <input
                id="l-email"
                type="email"
                required
                autoComplete="username"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="field">
              <label htmlFor="l-pass">Hasło</label>
              <input
                id="l-pass"
                type="password"
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {mode === 'register' && (
              <div className="field">
                <label htmlFor="l-pass2">Powtórz hasło</label>
                <input
                  id="l-pass2"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={form.password2}
                  onChange={(e) => setForm({ ...form, password2: e.target.value })}
                />
              </div>
            )}

            <button className="btn btn-primary btn-block" type="submit">
              {mode === 'login' ? 'Zaloguj się' : 'Załóż konto'}
            </button>
          </form>
        </div>

        <div className="card card-soft mt-2">
          <h4 style={{ marginTop: 0 }}>Konta demonstracyjne</h4>
          <p className="text-muted small">Kliknij, aby zalogować się jednym przyciskiem.</p>
          <div className="flex gap-sm">
            <button
              className="btn btn-light btn-sm"
              onClick={() => quickLogin('jan@example.com', 'demo1234')}
            >
              Klient: Jan Kowalski (2 psy)
            </button>
            <button
              className="btn btn-light btn-sm"
              onClick={() => quickLogin(SITE.adminEmail, 'admin1234')}
            >
              Administrator salonu
            </button>
          </div>
          <p className="text-muted mono mt-2">
            jan@example.com / demo1234 · {SITE.adminEmail} / admin1234
          </p>
          <p className="text-faint small mb-0">
            To demo bez serwera, hasła są trzymane jawnie w localStorage przeglądarki.
            Nie używaj prawdziwych danych.
          </p>
        </div>

        <p className="text-center mt-2">
          <Link
            to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.88rem' }}
          >
            <Icon name="arrowLeft" size={15} />
            Wróć na stronę główną
          </Link>
        </p>
      </div>
    </div>
  )
}
