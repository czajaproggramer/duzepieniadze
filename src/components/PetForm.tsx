import { useState } from 'react'
import { BREEDS, breedById } from '../data/breeds'
import type { Pet, PetFormValues } from '../lib/types'

export type { PetFormValues }

interface Props {
  initial?: Pet
  onSubmit: (values: PetFormValues) => void
  onCancel?: () => void
  submitLabel?: string
}

export function PetForm({ initial, onSubmit, onCancel, submitLabel = 'Zapisz pupila' }: Props) {
  const [values, setValues] = useState<PetFormValues>({
    name: initial?.name ?? '',
    breedId: initial?.breedId ?? 'shih-tzu',
    weightKg: initial?.weightKg ?? 5,
    birthYear: initial?.birthYear,
    notes: initial?.notes ?? '',
  })

  const breed = breedById(values.breedId)
  const thisYear = new Date().getFullYear()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ ...values, name: values.name.trim() })
      }}
    >
      <div className="field-row">
        <div className="field">
          <label htmlFor="p-name">Imię pupila</label>
          <input
            id="p-name"
            required
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            placeholder="np. Fibi"
          />
        </div>
        <div className="field">
          <label htmlFor="p-breed">Rasa</label>
          <select
            id="p-breed"
            value={values.breedId}
            onChange={(e) => setValues({ ...values, breedId: e.target.value })}
          >
            {BREEDS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="p-weight">Waga (kg)</label>
          <input
            id="p-weight"
            type="number"
            min={0.5}
            max={60}
            step={0.1}
            required
            value={values.weightKg}
            onChange={(e) => setValues({ ...values, weightKg: Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label htmlFor="p-year">Rok urodzenia (opcjonalnie)</label>
          <input
            id="p-year"
            type="number"
            min={1995}
            max={thisYear}
            value={values.birthYear ?? ''}
            onChange={(e) =>
              setValues({
                ...values,
                birthYear: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder={String(thisYear - 3)}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="p-notes">Uwagi dla groomera (opcjonalnie)</label>
        <textarea
          id="p-notes"
          style={{ minHeight: 80 }}
          value={values.notes}
          onChange={(e) => setValues({ ...values, notes: e.target.value })}
          placeholder="np. boi się suszarki przy uszach, wrażliwa skóra, lubi przerwy…"
        />
      </div>

      <div className="info-note">
        <strong>{breed.name}</strong>, okrywa: {breed.coat}. Tempo wzrostu futra:{' '}
        <strong>{breed.growthRate}</strong>, zalecana wizyta co{' '}
        <strong>{breed.intervalWeeks} tygodni</strong>. Na tej podstawie system sam
        przypomni o kolejnym strzyżeniu.
      </div>

      <div className="flex gap-sm">
        <button className="btn btn-primary" type="submit">
          {submitLabel}
        </button>
        {onCancel && (
          <button className="btn btn-ghost" type="button" onClick={onCancel}>
            Anuluj
          </button>
        )}
      </div>
    </form>
  )
}
