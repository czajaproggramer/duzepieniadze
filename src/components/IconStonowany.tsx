import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

/**
 * Drugi zestaw ikon — dla motywu „Stonowany".
 *
 * Świadomie inny język graficzny niż `Icon.tsx`: tam kontur 1.5 bez wypełnień,
 * tutaj **pełne sylwetki** z wycięciami (`fill-rule: evenodd`). Klucze są te same
 * (`IconName`), więc sekcje landingu podmieniają tylko komponent. Czego nie ma
 * w tym zestawie, spada z powrotem na wersję konturową.
 */

const SOLID: Partial<Record<IconName, ReactNode>> = {
  paw: (
    <>
      <ellipse cx="6.9" cy="9.3" rx="2.3" ry="3" />
      <ellipse cx="12" cy="7.3" rx="2.3" ry="3.1" />
      <ellipse cx="17.1" cy="9.3" rx="2.3" ry="3" />
      <path d="M12 12.1c3.3 0 5.9 2.7 5.9 5.1 0 2.1-1.9 3.3-3.8 2.7L12 19.2l-2.1.7c-1.9.6-3.8-.6-3.8-2.7 0-2.4 2.6-5.1 5.9-5.1Z" />
    </>
  ),
  dog: (
    <path
      fillRule="evenodd"
      d="M4.3 4.1 8.2 6.4h7.6l3.9-2.3a.7.7 0 0 1 1 .8l-1.1 4.6v2.4a7.6 7.6 0 0 1-15.2 0V9.5L3.3 4.9a.7.7 0 0 1 1-.8Zm5.3 6.9a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1Zm4.8 0a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1Zm-2.4 3.6A1.5 1.5 0 0 0 10.5 16h3a1.5 1.5 0 0 0-1.5-1.4Z"
      clipRule="evenodd"
    />
  ),
  scissors: (
    <>
      <circle cx="6" cy="6.4" r="2.7" />
      <circle cx="6" cy="17.6" r="2.7" />
      <path
        d="M8.4 8.1 20 19M8.4 15.9 20 5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
  droplet: (
    <path d="M12 2.6c3.7 3.9 6.1 6.9 6.1 9.8a6.1 6.1 0 1 1-12.2 0c0-2.9 2.4-5.9 6.1-9.8Z" />
  ),
  brush: (
    <>
      <rect x="3.4" y="3.6" width="17.2" height="6.6" rx="2.8" />
      <rect x="6.5" y="11" width="2" height="5.6" rx="1" />
      <rect x="11" y="11" width="2" height="7.4" rx="1" />
      <rect x="15.5" y="11" width="2" height="5.6" rx="1" />
    </>
  ),
  clippers: (
    <>
      <rect x="6.6" y="3.2" width="10.8" height="6.4" rx="1.8" />
      <path
        d="M9 9.8v2.9a3.2 3.2 0 0 0 3.2 3.2 3.2 3.2 0 0 1 3.2 3.2v1.7"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
  note: (
    <path
      fillRule="evenodd"
      d="M6.6 2.4h7.1l5.8 5.9V20a1.7 1.7 0 0 1-1.7 1.7H6.6A1.7 1.7 0 0 1 4.9 20V4.1a1.7 1.7 0 0 1 1.7-1.7Zm1.9 10.5a.85.85 0 0 0 0 1.7h7a.85.85 0 0 0 0-1.7h-7Zm0 3.6a.85.85 0 0 0 0 1.7h4.4a.85.85 0 0 0 0-1.7H8.5Z"
      clipRule="evenodd"
    />
  ),
  clock: (
    <path
      fillRule="evenodd"
      d="M12 2.9a9.1 9.1 0 1 0 0 18.2 9.1 9.1 0 0 0 0-18.2Zm.95 4a.95.95 0 0 0-1.9 0v5.4c0 .33.17.63.45.8l3.2 1.95a.95.95 0 1 0 .99-1.62l-2.74-1.67V6.9Z"
      clipRule="evenodd"
    />
  ),
  calendar: (
    <>
      <path
        fillRule="evenodd"
        d="M8 2a.95.95 0 0 1 .95.95V4h6.1V2.95a.95.95 0 0 1 1.9 0V4h1.25A2.8 2.8 0 0 1 21 6.8V19a2.8 2.8 0 0 1-2.8 2.8H5.8A2.8 2.8 0 0 1 3 19V6.8A2.8 2.8 0 0 1 5.8 4h1.25V2.95A.95.95 0 0 1 8 2ZM4.9 9.7V19c0 .5.4.9.9.9h12.4c.5 0 .9-.4.9-.9V9.7H4.9Z"
        clipRule="evenodd"
      />
      <rect x="6.9" y="12" width="3.1" height="2.4" rx="1.1" />
      <rect x="14" y="12" width="3.1" height="2.4" rx="1.1" />
      <rect x="6.9" y="15.9" width="3.1" height="2.4" rx="1.1" />
    </>
  ),
  bell: (
    <>
      <path d="M12 2.3a1 1 0 0 1 1 1v.8a6.1 6.1 0 0 1 5 6c0 2.1.4 3.4.8 4.2.4.8.7 1 .7 1a.9.9 0 0 1-.6 1.6H5.1a.9.9 0 0 1-.6-1.6s.3-.2.7-1c.4-.8.8-2.1.8-4.2a6.1 6.1 0 0 1 5-6v-.8a1 1 0 0 1 1-1Z" />
      <path d="M9.7 18.5h4.6a2.3 2.3 0 0 1-4.6 0Z" />
    </>
  ),
  star: <path d="m12 3.3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.8-5.4 2.8 1-6-4.4-4.3 6.1-.9Z" />,
  arrowRight: (
    <path d="M13.3 4.6a1 1 0 0 0-1.4 1.4l4.4 4.4H4.6a1 1 0 0 0 0 2h11.7l-4.4 4.4a1 1 0 0 0 1.4 1.4l6.1-6.1a1 1 0 0 0 0-1.4l-6.1-6.1Z" />
  ),
  arrowLeft: (
    <path d="M10.7 4.6a1 1 0 0 1 1.4 1.4L7.7 10.4h11.7a1 1 0 0 1 0 2H7.7l4.4 4.4a1 1 0 0 1-1.4 1.4l-6.1-6.1a1 1 0 0 1 0-1.4l6.1-6.1Z" />
  ),
  pin: (
    <path
      fillRule="evenodd"
      d="M12 2.2a7.4 7.4 0 0 0-7.4 7.4c0 5.3 6.5 11.7 6.8 12a.9.9 0 0 0 1.2 0c.3-.3 6.8-6.7 6.8-12A7.4 7.4 0 0 0 12 2.2Zm0 5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
      clipRule="evenodd"
    />
  ),
  phone: (
    <path d="M6.2 3.2h2.6c.4 0 .8.3.9.7l1.4 3.5c.2.4 0 .9-.3 1.2L9.2 9.7a11.2 11.2 0 0 0 5.1 5.1l1.1-1.6c.3-.3.8-.5 1.2-.3l3.5 1.4c.4.1.7.5.7.9v2.6a2.3 2.3 0 0 1-2.5 2.3A16.5 16.5 0 0 1 3.9 5.7a2.3 2.3 0 0 1 2.3-2.5Z" />
  ),
  mail: (
    <path
      fillRule="evenodd"
      d="M3 7.4a2.5 2.5 0 0 1 2.5-2.5h13A2.5 2.5 0 0 1 21 7.4v9.2a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.6V7.4Zm2.6-.6 6.4 4.7 6.4-4.7H5.6Z"
      clipRule="evenodd"
    />
  ),
  check: (
    <path d="M20.1 6.1a1.1 1.1 0 0 0-1.6-1.5l-9 9.2-3.8-3.8a1.1 1.1 0 0 0-1.6 1.5l4.6 4.6c.4.4 1.1.4 1.5 0L20.1 6.1Z" />
  ),
  external: (
    <>
      <path d="M13.6 3.6a1 1 0 0 0 0 2h3.3l-6.2 6.2a1 1 0 1 0 1.4 1.4l6.2-6.2v3.3a1 1 0 0 0 2 0V4.6a1 1 0 0 0-1-1h-5.7Z" />
      <path d="M5.4 5.6h4.2a1 1 0 0 1 0 2H5.6a.5.5 0 0 0-.5.5v10.4c0 .3.2.5.5.5h10.4c.3 0 .5-.2.5-.5v-4a1 1 0 0 1 2 0v4.2a2.3 2.3 0 0 1-2.3 2.3H5.4a2.3 2.3 0 0 1-2.3-2.3V7.9a2.3 2.3 0 0 1 2.3-2.3Z" />
    </>
  ),
}

/** Ikona motywu „Stonowany". Nieznane nazwy renderuje zestaw konturowy. */
export function IconS({
  name,
  size = 20,
  className,
}: {
  name: IconName
  size?: number
  className?: string
}) {
  const glyph = SOLID[name]
  if (!glyph) return <Icon name={name} size={size} className={className} />

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  )
}

/** Ikona w okrągłym kółku — odpowiednik `IconChip` w motywie stonowanym. */
export function IconSDot({
  name,
  size = 16,
  tone = 'sage',
}: {
  name: IconName
  size?: number
  tone?: 'sage' | 'light' | 'dark'
}) {
  return (
    <span className={`st-dot st-dot--${tone}`}>
      <IconS name={name} size={size} />
    </span>
  )
}

/** Duża ikona cechy: pełna sylwetka w kółku z cienką obwódką. */
export function FeatureIconS({ name }: { name: IconName }) {
  return (
    <span className="st-feature-icon">
      <IconS name={name} size={22} />
    </span>
  )
}

/** Ocena gwiazdkami w wersji stonowanej. */
export function StarsS({ count = 5, size = 13 }: { count?: number; size?: number }) {
  return (
    <span className="st-stars" aria-label={`Ocena ${count} na 5`}>
      {Array.from({ length: count }, (_, i) => (
        <IconS key={i} name="star" size={size} />
      ))}
    </span>
  )
}
