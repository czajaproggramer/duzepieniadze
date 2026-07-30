import type { Service } from '../lib/types'

/**
 * Cennik.
 * Pozycje bez `estimatedPrice` pochodzą z profilu Booksy Kael Pet Grooming.
 * Pozycje z `estimatedPrice: true` to ceny ORIENTACYJNE (demo) — do potwierdzenia
 * przez salon przed publikacją strony.
 */
export const SERVICES: Service[] = [
  // ——— strzyżenie ———
  {
    id: 'shih-tzu-do-5',
    name: 'Shih Tzu do 5 kg',
    description: 'Kąpiel, suszenie, strzyżenie, pazurki, uszy.',
    price: 190,
    durationMin: 150,
    breedIds: ['shih-tzu'],
    category: 'strzyzenie',
    popular: true,
  },
  {
    id: 'shih-tzu-pow-5',
    name: 'Shih Tzu powyżej 5 kg',
    description: 'Pełna pielęgnacja z modelowaniem główki.',
    price: 200,
    durationMin: 150,
    breedIds: ['shih-tzu'],
    category: 'strzyzenie',
    popular: true,
  },
  {
    id: 'maltipoo-do-5',
    name: 'Maltipoo do 5 kg',
    description: 'Rozczesanie, kąpiel, strzyżenie nożyczkowe.',
    price: 190,
    durationMin: 150,
    breedIds: ['maltipoo'],
    category: 'strzyzenie',
    popular: true,
  },
  {
    id: 'maltipoo-pow-5',
    name: 'Maltipoo powyżej 5 kg',
    description: 'Rozczesanie, kąpiel, strzyżenie nożyczkowe.',
    price: 200,
    durationMin: 150,
    breedIds: ['maltipoo'],
    category: 'strzyzenie',
    estimatedPrice: true,
  },
  {
    id: 'cocker-do-7',
    name: 'Cocker Spaniel do 7 kg',
    description: 'Trymowanie, pióra, uszy, kąpiel pielęgnacyjna.',
    price: 200,
    durationMin: 150,
    breedIds: ['cocker'],
    category: 'strzyzenie',
    popular: true,
  },
  {
    id: 'cocker-pow-7',
    name: 'Cocker Spaniel powyżej 7 kg',
    description: 'Trymowanie, pióra, uszy, kąpiel pielęgnacyjna.',
    price: 220,
    durationMin: 150,
    breedIds: ['cocker'],
    category: 'strzyzenie',
    popular: true,
  },
  {
    id: 'yorkshire-do-4',
    name: 'Yorkshire Terrier do 4 kg',
    description: 'Strzyżenie, kokardka lub gumka gratis.',
    price: 160,
    durationMin: 120,
    breedIds: ['yorkshire'],
    category: 'strzyzenie',
    estimatedPrice: true,
  },
  {
    id: 'yorkshire-pow-4',
    name: 'Yorkshire Terrier powyżej 4 kg',
    description: 'Strzyżenie, kokardka lub gumka gratis.',
    price: 170,
    durationMin: 120,
    breedIds: ['yorkshire'],
    category: 'strzyzenie',
    estimatedPrice: true,
  },
  {
    id: 'maltanczyk-do-5',
    name: 'Maltańczyk do 5 kg',
    description: 'Kąpiel rozjaśniająca, strzyżenie, pielęgnacja oczu.',
    price: 170,
    durationMin: 150,
    breedIds: ['maltanczyk'],
    category: 'strzyzenie',
    estimatedPrice: true,
  },
  {
    id: 'maltanczyk-pow-5',
    name: 'Maltańczyk powyżej 5 kg',
    description: 'Kąpiel rozjaśniająca, strzyżenie, pielęgnacja oczu.',
    price: 180,
    durationMin: 150,
    breedIds: ['maltanczyk'],
    category: 'strzyzenie',
    estimatedPrice: true,
  },
  {
    id: 'pudel',
    name: 'Pudel toy / miniaturowy',
    description: 'Strzyżenie wzorcowe lub misiowe, łapki, pyszczek.',
    price: 190,
    durationMin: 150,
    breedIds: ['pudel'],
    category: 'strzyzenie',
    estimatedPrice: true,
  },
  {
    id: 'bichon',
    name: 'Bichon Frise',
    description: 'Strzyżenie nożyczkowe, modelowanie główki.',
    price: 190,
    durationMin: 150,
    breedIds: ['bichon'],
    category: 'strzyzenie',
    estimatedPrice: true,
  },
  {
    id: 'hawanczyk',
    name: 'Hawańczyk',
    description: 'Rozczesanie, kąpiel, strzyżenie.',
    price: 190,
    durationMin: 150,
    breedIds: ['hawanczyk'],
    category: 'strzyzenie',
    estimatedPrice: true,
  },
  {
    id: 'pomeranian',
    name: 'Szpic miniaturowy do 4 kg',
    description: 'Wyczesanie podszerstka, kąpiel, modelowanie łapek.',
    price: 180,
    durationMin: 150,
    breedIds: ['pomeranian'],
    category: 'strzyzenie',
    estimatedPrice: true,
  },
  {
    id: 'pomeranian-pow-4',
    name: 'Szpic miniaturowy powyżej 4 kg',
    description: 'Wyczesanie podszerstka, kąpiel, modelowanie łapek.',
    price: 190,
    durationMin: 150,
    breedIds: ['pomeranian'],
    category: 'strzyzenie',
    estimatedPrice: true,
  },

  // ——— kąpiel ———
  {
    id: 'chihuahua',
    name: 'Chihuahua — pielęgnacja',
    description: 'Kąpiel, suszenie, pazurki, uszy.',
    price: 120,
    durationMin: 60,
    breedIds: ['chihuahua'],
    category: 'kapiel',
    estimatedPrice: true,
  },
  {
    id: 'kapiel-mala',
    name: 'Kąpiel + suszenie (małe rasy)',
    description: 'Bez strzyżenia — odświeżenie między wizytami.',
    price: 100,
    durationMin: 60,
    breedIds: [],
    category: 'kapiel',
    estimatedPrice: true,
  },
  {
    id: 'szczeniak',
    name: 'Pierwsza wizyta szczeniaka',
    description: 'Oswajanie z salonem, delikatna kąpiel, pazurki.',
    price: 120,
    durationMin: 60,
    breedIds: [],
    category: 'kapiel',
    estimatedPrice: true,
  },

  // ——— dodatki ———
  {
    id: 'pazurki-uszy',
    name: 'Pazurki + czyszczenie uszu',
    description: 'Szybka wizyta bez kąpieli.',
    price: 50,
    durationMin: 30,
    breedIds: [],
    category: 'dodatki',
    estimatedPrice: true,
  },
  {
    id: 'rozczesywanie',
    name: 'Rozczesywanie / usuwanie kołtunów',
    description: 'Doliczane do wizyty przy mocno zbitym futrze.',
    price: 40,
    durationMin: 30,
    breedIds: [],
    category: 'dodatki',
    estimatedPrice: true,
  },
]

export const serviceById = (id: string): Service | undefined =>
  SERVICES.find((s) => s.id === id)

/** Usługi sugerowane dla danej rasy + wszystkie uniwersalne. */
export function servicesForBreed(breedId: string, weightKg?: number): Service[] {
  const dedicated = SERVICES.filter((s) => s.breedIds.includes(breedId))
  const universal = SERVICES.filter((s) => s.breedIds.length === 0)
  const sorted = dedicated.sort((a, b) => {
    if (weightKg === undefined) return 0
    return matchesWeight(b, weightKg) === matchesWeight(a, weightKg)
      ? 0
      : matchesWeight(b, weightKg)
        ? 1
        : -1
  })
  return [...sorted, ...universal]
}

/** Heurystyka: czy wariant wagowy usługi pasuje do psa. */
export function matchesWeight(service: Service, weightKg: number): boolean {
  const m = service.name.match(/(do|powyżej)\s+(\d+(?:[.,]\d+)?)\s*kg/i)
  if (!m) return true
  const limit = parseFloat(m[2].replace(',', '.'))
  return m[1].toLowerCase() === 'do' ? weightKg <= limit : weightKg > limit
}

export const CATEGORY_LABEL: Record<Service['category'], string> = {
  strzyzenie: 'Strzyżenie i pełna pielęgnacja',
  kapiel: 'Kąpiele i wizyty odświeżające',
  dodatki: 'Dodatki',
}
