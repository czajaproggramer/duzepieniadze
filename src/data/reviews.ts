/**
 * Opinie demonstracyjne — fikcyjne cytaty klientów.
 * Przy wdrożeniu podmień na prawdziwe opinie lub widget zewnętrznego portalu.
 */
export interface Review {
  id: string
  author: string
  dog: string
  rating: number
  text: string
  date: string
}

export const REVIEW_STATS = {
  rating: 4.8,
  count: 48,
  fiveStars: 45,
  url: 'https://example.com/opinie',
  platformLabel: 'portalu opinii',
}

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Katarzyna',
    dog: 'Shih Tzu, 6 kg',
    rating: 5,
    text: 'Piękne strzyżenie i bardzo delikatne podejście do psa. Czyste uszy, mnóstwo cierpliwości — polecam z całego serca!',
    date: 'czerwiec 2026',
  },
  {
    id: 'r2',
    author: 'Joanna',
    dog: 'Szpic miniaturowy, 4,5 kg',
    rating: 5,
    text: 'Pierwsze strzyżenie naszego psa i wyszło po prostu perfekcyjnie. Oboje zadowoleni, wracamy!',
    date: 'maj 2026',
  },
  {
    id: 'r3',
    author: 'Agnieszka',
    dog: 'mały pies',
    rating: 5,
    text: 'Miejsce naprawdę przyjazne psom, obsługa na najwyższym poziomie. Polecam!',
    date: 'maj 2026',
  },
  {
    id: 'r4',
    author: 'Beata',
    dog: 'Maltańczyk, 5,4 kg',
    rating: 5,
    text: 'Ogromne dzięki za opiekę nad naszym maltańczykiem. To miejsce polecam każdemu, kto szuka spokojnego groomera.',
    date: 'kwiecień 2026',
  },
  {
    id: 'r5',
    author: 'Karolina',
    dog: 'Maltipoo, 4 kg',
    rating: 5,
    text: 'Pies wychodzi stąd jak z reklamy, a co ważniejsze — wchodzi bez stresu. Rewelacyjny kontakt i punktualność.',
    date: 'kwiecień 2026',
  },
  {
    id: 'r6',
    author: 'Michał',
    dog: 'Cocker Spaniel, 9 kg',
    rating: 5,
    text: 'Uszy i pióra zrobione wzorowo, pies pachnie i nie ma ani jednego kołtuna. Wreszcie salon, do którego chce się wracać.',
    date: 'marzec 2026',
  },
]
