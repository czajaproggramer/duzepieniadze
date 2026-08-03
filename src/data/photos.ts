/**
 * Zdjęcia motywu „Stonowany".
 *
 * Motyw celowo używa fotografii zamiast ilustracji SVG. Pliki wrzuca się do
 * `public/photos/` — dopóki ich nie ma, komponent `<Photo>` pokazuje neutralny
 * placeholder, a strona wygląda poprawnie. Prompty do wygenerowania każdego
 * ujęcia (Nano Banana) leżą w `public/photos/PROMPTY.md` — nazwy plików
 * poniżej i w promptach muszą się zgadzać.
 */

export interface PhotoSlot {
  src: string
  alt: string
}

export const PHOTOS = {
  hero: {
    src: '/photos/hero.jpg',
    alt: 'Groomerka czesząca małego psa na stole groomerskim przy oknie',
  },
  uslugi: {
    src: '/photos/uslugi.jpg',
    alt: 'Kąpiel małego psa w wannie groomerskiej',
  },
  oMnie: {
    src: '/photos/o-mnie.jpg',
    alt: 'Portret groomerki trzymającej psa na rękach',
  },
  kalkulator: {
    src: '/photos/kalkulator.jpg',
    alt: 'Zbliżenie na odrastającą okrywę psa',
  },
  why1: { src: '/photos/dlaczego-1.jpg', alt: 'Pies odpoczywający na stole podczas przerwy' },
  why2: { src: '/photos/dlaczego-2.jpg', alt: 'Strzyżenie nożyczkami sierści wokół pyszczka' },
  why3: { src: '/photos/dlaczego-3.jpg', alt: 'Kalendarz i telefon na blacie w salonie' },
  why4: { src: '/photos/dlaczego-4.jpg', alt: 'Pies patrzący w obiektyw po strzyżeniu' },
  kontakt: {
    src: '/photos/kontakt.jpg',
    alt: 'Wnętrze kameralnego salonu pielęgnacji psów',
  },
  galeria1: { src: '/photos/galeria-1.jpg', alt: 'Shih tzu po strzyżeniu' },
  galeria2: { src: '/photos/galeria-2.jpg', alt: 'Maltipoo w trakcie suszenia' },
  galeria3: { src: '/photos/galeria-3.jpg', alt: 'Narzędzia groomerskie na blacie' },
  galeria4: { src: '/photos/galeria-4.jpg', alt: 'Cocker spaniel z wyczesanymi piórami' },
} satisfies Record<string, PhotoSlot>

/** Pary „przed / po" dla suwaka metamorfoz — klucze zgodne z `CASES` w BeforeAfter. */
export const BEFORE_AFTER_PHOTOS: Record<string, { before: PhotoSlot; after: PhotoSlot }> = {
  fibi: {
    before: { src: '/photos/przed-fibi.jpg', alt: 'Fibi przed strzyżeniem' },
    after: { src: '/photos/po-fibi.jpg', alt: 'Fibi po strzyżeniu' },
  },
  luna: {
    before: { src: '/photos/przed-luna.jpg', alt: 'Luna przed strzyżeniem' },
    after: { src: '/photos/po-luna.jpg', alt: 'Luna po strzyżeniu' },
  },
  kiki: {
    before: { src: '/photos/przed-kiki.jpg', alt: 'Kiki przed strzyżeniem' },
    after: { src: '/photos/po-kiki.jpg', alt: 'Kiki po strzyżeniu' },
  },
  bruno: {
    before: { src: '/photos/przed-bruno.jpg', alt: 'Bruno przed strzyżeniem' },
    after: { src: '/photos/po-bruno.jpg', alt: 'Bruno po strzyżeniu' },
  },
}
