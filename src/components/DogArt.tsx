/**
 * Ilustracje-placeholdery zamiast zdjęć.
 * Ten sam pies rysowany jest dwa razy: `groomed={false}` (przed, futro
 * rozczochrane) i `groomed` (po, gładkie kształty i kokardka).
 * Docelowo w tych miejscach wstawiamy prawdziwe zdjęcia z salonu.
 */

interface Palette {
  bg: string
  fur: string
  furShade: string
  accent: string
}

export const PALETTES: Record<string, Palette> = {
  cream: { bg: '#f8e6e9', fur: '#f0dac2', furShade: '#dcc0a2', accent: '#d98996' },
  apricot: { bg: '#f5dce0', fur: '#e8b489', furShade: '#d2946a', accent: '#c46d7a' },
  snow: { bg: '#fdf4f6', fur: '#fbf7f2', furShade: '#e4dace', accent: '#d98996' },
  chocolate: { bg: '#f8e6e9', fur: '#b98462', furShade: '#96654a', accent: '#c46d7a' },
}

/** Zamknięta „puchata" ścieżka. Im większe `amp`, tym bardziej rozczochrane futro. */
function fluffyPath(cx: number, cy: number, rx: number, ry: number, spikes: number, amp: number) {
  const pts: [number, number][] = []
  const total = spikes * 2
  for (let i = 0; i < total; i++) {
    const a = (i / total) * Math.PI * 2 - Math.PI / 2
    const k = i % 2 === 0 ? 1 + amp : 1 - amp * 0.35
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k])
  }
  let d = ''
  for (let i = 0; i < pts.length; i++) {
    const cur = pts[i]
    const next = pts[(i + 1) % pts.length]
    const mid: [number, number] = [(cur[0] + next[0]) / 2, (cur[1] + next[1]) / 2]
    if (i === 0) {
      const prev = pts[pts.length - 1]
      d += `M ${(prev[0] + cur[0]) / 2} ${(prev[1] + cur[1]) / 2} `
    }
    d += `Q ${cur[0]} ${cur[1]} ${mid[0]} ${mid[1]} `
  }
  return d + 'Z'
}

/** Mała łapka jako element dekoracyjny sceny. */
function PawMark({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <ellipse cx="-7" cy="-4" rx="3" ry="4" />
      <ellipse cx="0" cy="-7" rx="3" ry="4.2" />
      <ellipse cx="7" cy="-4" rx="3" ry="4" />
      <path d="M0 1c4.5 0 8 3.4 8 6.7 0 2.8-2.4 4.2-4.9 3.3L0 10l-3.1 1c-2.5.9-4.9-.5-4.9-3.3C-8 4.4-4.5 1 0 1Z" />
    </g>
  )
}

interface DogArtProps {
  groomed: boolean
  palette?: keyof typeof PALETTES
  /** Wpływa na kształt uszu i grzywki. */
  style?: 'shihtzu' | 'poodle' | 'cocker'
  className?: string
}

export function DogArt({ groomed, palette = 'cream', style = 'shihtzu', className }: DogArtProps) {
  const p = PALETTES[palette]
  const amp = groomed ? 0.035 : 0.16
  const spikes = groomed ? 26 : 15

  const earLength = style === 'cocker' ? (groomed ? 74 : 92) : groomed ? 46 : 62
  const earWidth = style === 'cocker' ? 34 : 30

  return (
    <svg viewBox="0 0 400 250" className={className} role="img" aria-hidden="true">
      <rect width="400" height="250" fill={p.bg} />

      <circle cx="52" cy="46" r="26" fill={p.accent} opacity="0.1" />
      <circle cx="352" cy="60" r="38" fill={p.accent} opacity="0.08" />
      <circle cx="330" cy="196" r="18" fill={p.accent} opacity="0.12" />

      <ellipse cx="200" cy="232" rx="86" ry="10" fill={p.furShade} opacity="0.3" />

      <path
        d={groomed ? 'M 272 190 q 42 -12 34 -50' : 'M 272 190 q 46 -6 30 -54'}
        stroke={p.fur}
        strokeWidth={groomed ? 20 : 28}
        strokeLinecap="round"
        fill="none"
      />

      <rect x="152" y="196" width="26" height="34" rx="13" fill={p.furShade} />
      <rect x="222" y="196" width="26" height="34" rx="13" fill={p.furShade} />

      <path d={fluffyPath(200, 178, 76, 54, spikes, amp)} fill={p.fur} />
      <path d={fluffyPath(200, 186, 50, 34, spikes, amp * 0.8)} fill="#fff" opacity="0.3" />

      <ellipse
        cx={148}
        cy={104 + earLength / 2 - 20}
        rx={earWidth}
        ry={earLength / 2}
        fill={p.furShade}
        transform="rotate(-12 148 110)"
      />
      <ellipse
        cx={252}
        cy={104 + earLength / 2 - 20}
        rx={earWidth}
        ry={earLength / 2}
        fill={p.furShade}
        transform="rotate(12 252 110)"
      />

      <path d={fluffyPath(200, 106, 58, 54, spikes, amp)} fill={p.fur} />

      {!groomed && (
        <path d={fluffyPath(200, 76, 54, 30, 11, 0.22)} fill={p.furShade} opacity="0.95" />
      )}

      <ellipse cx="180" cy={groomed ? 100 : 104} rx="7" ry={groomed ? 8 : 5} fill="#332b26" />
      <ellipse cx="220" cy={groomed ? 100 : 104} rx="7" ry={groomed ? 8 : 5} fill="#332b26" />
      {groomed && (
        <>
          <circle cx="182.5" cy="97" r="2.4" fill="#fff" />
          <circle cx="222.5" cy="97" r="2.4" fill="#fff" />
        </>
      )}

      <ellipse cx="200" cy="128" rx="26" ry="19" fill="#fffdfb" opacity={groomed ? 0.95 : 0.6} />
      <path d="M 193 122 h 14 l -7 8 z" fill="#332b26" />
      <path
        d="M 200 130 v 5 M 200 135 q -7 6 -13 0 M 200 135 q 7 6 13 0"
        stroke="#332b26"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />

      {groomed && (
        <>
          <g transform="translate(238 62)">
            <path d="M 0 0 q -16 -12 -16 4 q 0 16 16 4 z" fill={p.accent} />
            <path d="M 0 0 q 16 -12 16 4 q 0 16 -16 4 z" fill={p.accent} />
            <circle cx="0" cy="4" r="5" fill="#fff" opacity="0.85" />
          </g>
          <g opacity="0.35">
            <PawMark x={98} y={84} s={0.6} fill={p.accent} />
            <PawMark x={318} y={132} s={0.45} fill={p.accent} />
          </g>
        </>
      )}

      {!groomed && (
        <g opacity="0.5">
          <path d="M 132 168 q -14 6 -6 18 q 10 8 16 -4" fill={p.furShade} />
          <path d="M 268 168 q 14 6 6 18 q -10 8 -16 -4" fill={p.furShade} />
          <path d="M 158 74 q -10 -14 4 -18 q 10 -2 8 12" fill="#8fa870" opacity="0.9" />
        </g>
      )}
    </svg>
  )
}

/** Duża ilustracja do sekcji hero: pies na stole groomerskim. */
export function HeroArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 460 360"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Ilustracja psa po strzyżeniu w salonie"
    >
      <rect x="-200" y="-200" width="860" height="760" fill="#f0d6da" />

      <circle cx="72" cy="62" r="36" fill="#d98996" opacity="0.16" />
      <circle cx="398" cy="92" r="22" fill="#ffffff" opacity="0.5" />
      <circle cx="410" cy="240" r="14" fill="#d98996" opacity="0.2" />
      <path
        d="M 40 300 q 20 -26 40 0"
        stroke="#d98996"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        opacity="0.45"
      />

      <g fill="#fff" opacity="0.6">
        <circle cx="112" cy="120" r="12" />
        <circle cx="140" cy="94" r="7" />
        <circle cx="352" cy="150" r="9" />
        <circle cx="374" cy="130" r="5" />
      </g>

      <g opacity="0.2">
        <PawMark x={66} y={318} s={0.8} fill="#c46d7a" />
        <PawMark x={402} y={318} s={0.65} fill="#c46d7a" />
      </g>

      <rect x="70" y="268" width="320" height="16" rx="8" fill="#d98996" />
      <rect x="150" y="284" width="14" height="52" rx="7" fill="#c46d7a" />
      <rect x="296" y="284" width="14" height="52" rx="7" fill="#c46d7a" />

      <g transform="translate(30 20)">
        <HeroDog />
      </g>

      <g
        transform="translate(348 192) rotate(-18)"
        stroke="#a65a66"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      >
        <path d="M 0 0 L 30 30" />
        <path d="M 30 0 L 0 30" />
        <circle cx="-5" cy="-5" r="6.5" fill="#f0d6da" />
        <circle cx="35" cy="-5" r="6.5" fill="#f0d6da" />
      </g>
    </svg>
  )
}

function HeroDog() {
  const fur = '#f0dac2'
  const shade = '#dcc0a2'
  return (
    <g>
      <ellipse cx="200" cy="250" rx="80" ry="9" fill={shade} opacity="0.4" />
      <path d="M 272 200 q 40 -14 32 -52" stroke={fur} strokeWidth="20" strokeLinecap="round" fill="none" />
      <rect x="154" y="208" width="26" height="40" rx="13" fill={shade} />
      <rect x="222" y="208" width="26" height="40" rx="13" fill={shade} />
      <path d={fluffyPath(200, 186, 74, 54, 26, 0.04)} fill={fur} />
      <ellipse cx="150" cy="112" rx="28" ry="26" fill={shade} transform="rotate(-14 150 112)" />
      <ellipse cx="250" cy="112" rx="28" ry="26" fill={shade} transform="rotate(14 250 112)" />
      <path d={fluffyPath(200, 108, 58, 55, 26, 0.04)} fill={fur} />
      <ellipse cx="180" cy="102" rx="7.5" ry="8.5" fill="#332b26" />
      <ellipse cx="220" cy="102" rx="7.5" ry="8.5" fill="#332b26" />
      <circle cx="182.5" cy="99" r="2.5" fill="#fff" />
      <circle cx="222.5" cy="99" r="2.5" fill="#fff" />
      <ellipse cx="200" cy="130" rx="26" ry="19" fill="#fffdfb" />
      <path d="M 193 124 h 14 l -7 8 z" fill="#332b26" />
      <path
        d="M 200 132 v 5 M 200 137 q -7 6 -13 0 M 200 137 q 7 6 13 0"
        stroke="#332b26"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      <g transform="translate(240 62)">
        <path d="M 0 0 q -17 -13 -17 4 q 0 17 17 4 z" fill="#d98996" />
        <path d="M 0 0 q 17 -13 17 4 q 0 17 -17 4 z" fill="#d98996" />
        <circle cx="0" cy="4" r="5.5" fill="#fff" opacity="0.9" />
      </g>
    </g>
  )
}

/** Portret groomerki do sekcji „O mnie". */
export function PortraitArt() {
  return (
    <svg viewBox="0 0 400 460" role="img" aria-label="Portret groomerki z psem">
      <rect width="400" height="460" fill="#f8e6e9" />
      <circle cx="200" cy="150" r="94" fill="#f0d6da" />
      <circle cx="200" cy="146" r="66" fill="#e8c8ce" />
      <path
        d="M 134 140 q 4 -78 66 -78 q 62 0 66 78 q -18 -34 -66 -34 q -48 0 -66 34 z"
        fill="#4a3a30"
      />
      <circle cx="178" cy="146" r="6" fill="#332b26" />
      <circle cx="222" cy="146" r="6" fill="#332b26" />
      <path
        d="M 188 172 q 12 12 24 0"
        stroke="#332b26"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M 90 460 q 0 -140 110 -140 q 110 0 110 140 z" fill="#d98996" />
      <path d="M 200 320 q -28 44 0 76 q 28 -32 0 -76" fill="#fff" opacity="0.25" />
      <g transform="translate(258 330)">
        <ellipse cx="0" cy="30" rx="52" ry="44" fill="#f0dac2" />
        <circle cx="0" cy="-8" r="38" fill="#f0dac2" />
        <ellipse cx="-32" cy="-6" rx="14" ry="20" fill="#dcc0a2" transform="rotate(-16 -32 -6)" />
        <ellipse cx="32" cy="-6" rx="14" ry="20" fill="#dcc0a2" transform="rotate(16 32 -6)" />
        <circle cx="-12" cy="-12" r="4.5" fill="#332b26" />
        <circle cx="12" cy="-12" r="4.5" fill="#332b26" />
        <ellipse cx="0" cy="6" rx="15" ry="11" fill="#fffdfb" />
        <path d="M -4 2 h 8 l -4 5 z" fill="#332b26" />
      </g>
      <g opacity="0.18">
        <PawMark x={62} y={80} s={1.1} fill="#c46d7a" />
        <PawMark x={338} y={128} s={0.8} fill="#c46d7a" />
      </g>
    </svg>
  )
}
