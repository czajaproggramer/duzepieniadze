import type { ReactNode } from 'react'

/**
 * Zestaw ikon liniowych. Jeden styl dla całego serwisu: kontur 1.5,
 * zaokrąglone końce, bez wypełnień. Zastępuje emoji w interfejsie.
 */

export type IconName =
  | 'paw'
  | 'dog'
  | 'scissors'
  | 'droplet'
  | 'brush'
  | 'clippers'
  | 'calendar'
  | 'clock'
  | 'bell'
  | 'mail'
  | 'mailOpen'
  | 'user'
  | 'users'
  | 'chart'
  | 'search'
  | 'check'
  | 'checkCircle'
  | 'plus'
  | 'pencil'
  | 'trash'
  | 'note'
  | 'phone'
  | 'pin'
  | 'star'
  | 'arrowRight'
  | 'arrowLeft'
  | 'chevronLeft'
  | 'chevronRight'
  | 'menu'
  | 'close'
  | 'settings'
  | 'shield'
  | 'sparkleFree'
  | 'history'
  | 'external'
  | 'send'
  | 'slider'

const PATHS: Record<IconName, ReactNode> = {
  paw: (
    <>
      <ellipse cx="7.2" cy="9" rx="2.1" ry="2.7" />
      <ellipse cx="12" cy="7.2" rx="2.1" ry="2.8" />
      <ellipse cx="16.8" cy="9" rx="2.1" ry="2.7" />
      <path d="M12 12.4c3 0 5.4 2.4 5.4 4.7 0 1.9-1.7 3-3.4 2.4L12 18.8l-2 .7c-1.7.6-3.4-.5-3.4-2.4 0-2.3 2.4-4.7 5.4-4.7Z" />
    </>
  ),
  dog: (
    <>
      <path d="M5.5 8.5 4 4.8l3.4 1.6" />
      <path d="M18.5 8.5 20 4.8l-3.4 1.6" />
      <path d="M5.5 8.5c0-1 1-1.7 2-1.7h9c1 0 2 .7 2 1.7v4.2a6.5 6.5 0 0 1-13 0Z" />
      <path d="M10 11.2h.01M14 11.2h.01" />
      <path d="M12 14.4v1.2M12 15.6c-.7 1-2 1-2.6.2M12 15.6c.7 1 2 1 2.6.2" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="6.5" r="2.5" />
      <circle cx="6" cy="17.5" r="2.5" />
      <path d="M8 8 20 19M8 16 20 5" />
    </>
  ),
  droplet: (
    <>
      <path d="M12 3.5c3.2 3.4 5.5 6.1 5.5 8.9a5.5 5.5 0 0 1-11 0c0-2.8 2.3-5.5 5.5-8.9Z" />
      <path d="M9.4 13.6a2.6 2.6 0 0 0 2.6 2.6" />
    </>
  ),
  brush: (
    <>
      <rect x="4" y="4" width="16" height="6" rx="2.4" />
      <path d="M7.5 10v4.5M12 10v6M16.5 10v4.5" />
      <path d="M6 19.5h12" />
    </>
  ),
  clippers: (
    <>
      <rect x="7" y="3.5" width="10" height="6" rx="1.6" />
      <path d="M9 9.5v3.2a3 3 0 0 0 3 3 3 3 0 0 1 3 3v1.8" />
      <path d="M9 3.5v-.6M12 3.5v-.6M15 3.5v-.6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8.5 3v4M15.5 3v4" />
      <path d="M8 13.5h2M14 13.5h2M8 17h2M14 17h2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.2V12l3.2 2" />
    </>
  ),
  bell: (
    <>
      <path d="M18 9.5a6 6 0 1 0-12 0c0 4.4-1.6 5.7-1.6 5.7h15.2S18 13.9 18 9.5Z" />
      <path d="M13.8 18.7a2 2 0 0 1-3.6 0" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.4" />
      <path d="m3.8 7 7.1 5.2c.7.5 1.6.5 2.2 0L20.2 7" />
    </>
  ),
  mailOpen: (
    <>
      <path d="M3 10.5 12 4l9 6.5v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <path d="m3 10.5 8.1 5.2c.6.4 1.4.4 2 0L21 10.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4.8 20c.6-3.6 3.6-5.6 7.2-5.6s6.6 2 7.2 5.6" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8.2" r="3.4" />
      <path d="M3.4 19.5c.6-3.2 3.2-5 6.1-5s5.5 1.8 6.1 5" />
      <path d="M16.2 5.2a3.4 3.4 0 0 1 0 6.4M17.5 14.9c2 .6 3.4 2.2 3.8 4.6" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4M4 20h16" />
      <rect x="7.5" y="12" width="3" height="5" rx="1" />
      <rect x="13" y="8.5" width="3" height="8.5" rx="1" />
      <rect x="18" y="14.5" width="2.5" height="2.5" rx="1" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m15.5 15.5 4.2 4.2" />
    </>
  ),
  check: <path d="m4.8 12.6 4.6 4.6L19.2 7.4" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.2 12.3 2.6 2.6 5-5.2" />
    </>
  ),
  plus: <path d="M12 5.5v13M5.5 12h13" />,
  pencil: (
    <>
      <path d="M16.5 4.6a2.1 2.1 0 0 1 3 3L9.2 17.9l-4 1 1-4Z" />
      <path d="m14.8 6.4 2.8 2.8" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 6.8h15M9.5 6.8V4.6h5v2.2" />
      <path d="M6.4 6.8 7.3 19a1.6 1.6 0 0 0 1.6 1.5h6.2a1.6 1.6 0 0 0 1.6-1.5l.9-12.2" />
      <path d="M10.4 10.5v6M13.6 10.5v6" />
    </>
  ),
  note: (
    <>
      <path d="M6 3.5h8.5L19 8v12a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20V5a1.5 1.5 0 0 1 1-1.5Z" />
      <path d="M14 3.6V8h4.6M8.5 12.5h7M8.5 16h4.5" />
    </>
  ),
  phone: (
    <path d="M6.4 3.8h2.4l1.4 3.6-1.9 1.4a11 11 0 0 0 5.1 5.1l1.4-1.9 3.6 1.4v2.4a2 2 0 0 1-2.2 2A15.6 15.6 0 0 1 4.4 6a2 2 0 0 1 2-2.2Z" />
  ),
  pin: (
    <>
      <path d="M12 21s6.5-6.1 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="10.3" r="2.4" />
    </>
  ),
  star: (
    <path
      d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  arrowRight: <path d="M4.5 12h15M13.5 6l6 6-6 6" />,
  arrowLeft: <path d="M19.5 12h-15M10.5 6l-6 6 6 6" />,
  chevronLeft: <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />,
  chevronRight: <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 14.2a1.5 1.5 0 0 0 .3 1.7l.1.1a1.9 1.9 0 1 1-2.6 2.6l-.1-.1a1.5 1.5 0 0 0-2.6 1v.2a1.9 1.9 0 0 1-3.8 0v-.1a1.5 1.5 0 0 0-2.6-1l-.1.1a1.9 1.9 0 1 1-2.6-2.6l.1-.1a1.5 1.5 0 0 0-1-2.6H4.4a1.9 1.9 0 0 1 0-3.8h.1a1.5 1.5 0 0 0 1-2.6l-.1-.1a1.9 1.9 0 1 1 2.6-2.6l.1.1a1.5 1.5 0 0 0 2.6-1V4.4a1.9 1.9 0 0 1 3.8 0v.1a1.5 1.5 0 0 0 2.6 1l.1-.1a1.9 1.9 0 1 1 2.6 2.6l-.1.1a1.5 1.5 0 0 0 1 2.6h.2a1.9 1.9 0 0 1 0 3.8h-.1a1.5 1.5 0 0 0-1.4 1Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.2 5 6v6c0 4.3 3 7.4 7 8.8 4-1.4 7-4.5 7-8.8V6Z" />
      <path d="m9.2 12.2 2 2 3.6-3.8" />
    </>
  ),
  sparkleFree: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.6v8.8M9.4 10.2h5.2M9.4 13.8h5.2" />
    </>
  ),
  history: (
    <>
      <path d="M3.8 12a8.2 8.2 0 1 0 2.5-5.9L3.8 8.4" />
      <path d="M3.8 4.5v4h4" />
      <path d="M12 8v4.3l2.8 1.7" />
    </>
  ),
  external: (
    <>
      <path d="M13.5 4.5H19.5V10.5" />
      <path d="m19.5 4.5-8 8" />
      <path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </>
  ),
  send: (
    <>
      <path d="M20.5 3.5 10.8 13.2" />
      <path d="M20.5 3.5 14.3 20.5l-3.5-7.3-7.3-3.5Z" />
    </>
  ),
  slider: (
    <>
      <path d="M4 7.5h16M4 16.5h16" />
      <circle cx="9.5" cy="7.5" r="2.4" />
      <circle cx="15" cy="16.5" r="2.4" />
    </>
  ),
}

interface IconProps {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
}

export function Icon({ name, size = 20, className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}

/** Ikona w kwadraciku — używana w listach i pustych stanach. */
export function IconChip({
  name,
  accent = false,
  size = 18,
}: {
  name: IconName
  accent?: boolean
  size?: number
}) {
  return (
    <span className={`icon-chip ${accent ? 'icon-chip-accent' : ''}`}>
      <Icon name={name} size={size} />
    </span>
  )
}

/** Duża ikona sekcji cech z pomarańczową kropką. */
export function FeatureIcon({ name }: { name: IconName }) {
  return (
    <span className="feature-icon">
      <Icon name={name} size={26} />
    </span>
  )
}

/** Inicjał pupila lub klienta zamiast obrazka awatara. */
export function Avatar({ label }: { label: string }) {
  return <span className="avatar">{label.trim().charAt(0).toUpperCase()}</span>
}

export function Stars({ count = 5, size = 14 }: { count?: number; size?: number }) {
  return (
    <span className="stars" aria-label={`Ocena ${count} na 5`}>
      {Array.from({ length: count }, (_, i) => (
        <Icon key={i} name="star" size={size} />
      ))}
    </span>
  )
}
