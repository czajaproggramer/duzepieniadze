/**
 * Opinie — skrócone, sparafrazowane wypowiedzi klientek z profilu Booksy
 * (profil: 4.8/5 z 61 opinii). Przed publikacją warto podmienić na dokładne
 * cytaty za zgodą autorek lub podpiąć widget Booksy.
 */
export interface Review {
  id: string
  author: string
  dog: string
  rating: number
  text: string
  date: string
}

export const BOOKSY_STATS = {
  rating: 4.8,
  count: 61,
  fiveStars: 57,
  url: 'https://booksy.com/pl-pl/343389_kael-pet-grooming_zwierzaki_3_warszawa',
}

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Angelina',
    dog: 'Shih Tzu, 6 kg',
    rating: 5,
    text: 'Piękne strzyżenie i bardzo delikatne podejście do psa. Czyste uszy, mnóstwo cierpliwości — polecam z całego serca!',
    date: 'czerwiec 2026',
  },
  {
    id: 'r2',
    author: 'Elizaveta',
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
    text: 'Ogromne dzięki za opiekę nad Kiki. To miejsce polecam każdemu, kto szuka spokojnego groomera.',
    date: 'kwiecień 2026',
  },
  {
    id: 'r5',
    author: 'Karolina',
    dog: 'Maltipoo, 4 kg',
    rating: 5,
    text: 'Luna wychodzi stąd jak z reklamy, a co ważniejsze — wchodzi bez stresu. Rewelacyjny kontakt i punktualność.',
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
