import { useCallback, useRef, useState } from 'react'
import { DogArt, PALETTES } from './DogArt'
import { Icon } from './Icon'

interface Case {
  id: string
  label: string
  dog: string
  palette: keyof typeof PALETTES
  style: 'shihtzu' | 'poodle' | 'cocker'
  note: string
}

const CASES: Case[] = [
  {
    id: 'fibi',
    label: 'Fibi · Shih Tzu',
    dog: 'Fibi',
    palette: 'cream',
    style: 'shihtzu',
    note: 'Skrócona grzywka, wyczesane kołtuny za uszami, wymodelowana główka.',
  },
  {
    id: 'luna',
    label: 'Luna · Maltipoo',
    dog: 'Luna',
    palette: 'apricot',
    style: 'poodle',
    note: 'Strzyżenie misiowe nożyczkowe, wyrównane łapki i pyszczek.',
  },
  {
    id: 'kiki',
    label: 'Kiki · Maltańczyk',
    dog: 'Kiki',
    palette: 'snow',
    style: 'shihtzu',
    note: 'Kąpiel rozjaśniająca, pielęgnacja okolic oczu, jedwabista okrywa.',
  },
  {
    id: 'bruno',
    label: 'Bruno · Cocker Spaniel',
    dog: 'Bruno',
    palette: 'chocolate',
    style: 'cocker',
    note: 'Trymowanie piór, odciążone uszy, dokładne osuszenie kanałów usznych.',
  },
]

export function BeforeAfter() {
  const [active, setActive] = useState(0)
  const [split, setSplit] = useState(50)
  const frameRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const move = useCallback((clientX: number) => {
    const el = frameRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setSplit(Math.min(97, Math.max(3, pct)))
  }, [])

  const current = CASES[active]

  return (
    <div className="ba-wrap">
      <div
        className="ba-frame"
        ref={frameRef}
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          move(e.clientX)
        }}
        onPointerMove={(e) => dragging.current && move(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        style={{ ['--split' as string]: `${split}%` }}
      >
        <div className="ba-layer">
          <DogArt groomed={false} palette={current.palette} style={current.style} />
        </div>
        <div className="ba-layer ba-after">
          <DogArt groomed palette={current.palette} style={current.style} />
        </div>
        <span className="ba-tag left">przed</span>
        <span className="ba-tag right">po</span>
        <div
          className="ba-handle"
          role="slider"
          tabIndex={0}
          aria-label="Suwak porównania przed i po"
          aria-valuenow={Math.round(split)}
          aria-valuemin={0}
          aria-valuemax={100}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setSplit((s) => Math.max(3, s - 4))
            if (e.key === 'ArrowRight') setSplit((s) => Math.min(97, s + 4))
          }}
        >
          <Icon name="slider" size={18} />
        </div>
      </div>

      <div className="ba-tabs">
        {CASES.map((c, i) => (
          <button
            key={c.id}
            className={`ba-tab ${i === active ? 'active' : ''}`}
            onClick={() => {
              setActive(i)
              setSplit(50)
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="text-center text-muted mt-2 small">
        <strong>{current.dog}:</strong> {current.note}
      </p>
      <p className="footnote">
        Ilustracje poglądowe. Miejsce na prawdziwe zdjęcia „przed i po" z salonu.
      </p>
    </div>
  )
}
