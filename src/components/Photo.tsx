import { useState } from 'react'
import type { PhotoSlot } from '../data/photos'

/**
 * Zdjęcie motywu „Stonowany" z bezpiecznym placeholderem.
 * Gdy pliku nie ma w `public/photos/`, zamiast zepsutej ikonki obrazka
 * pokazujemy neutralne, kadrowane tło — układ strony się nie sypie.
 */
export function Photo({
  photo,
  className,
  ratio,
  fill = false,
}: {
  photo: PhotoSlot
  className?: string
  /** np. '4 / 5' — ignorowane przy `fill`. */
  ratio?: string
  /** Wypełnia rodzica (rodzic musi mieć `position: relative`). */
  fill?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const cls = ['st-photo', fill ? 'is-fill' : '', failed ? 'is-empty' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <span
      className={cls}
      style={!fill && ratio ? { aspectRatio: ratio } : undefined}
      role={failed ? 'img' : undefined}
      aria-label={failed ? photo.alt : undefined}
    >
      {!failed && (
        <img src={photo.src} alt={photo.alt} loading="lazy" onError={() => setFailed(true)} />
      )}
    </span>
  )
}
