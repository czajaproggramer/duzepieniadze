import type { IconName } from '../components/Icon'

/**
 * Copy landingu współdzielone przez oba motywy („Cukierkowy" i „Stonowany").
 * Jedno źródło prawdy dla tekstów — motywy zmieniają układ i oprawę, nigdy treść.
 */

export interface LandingItem {
  icon: IconName
  title: string
  text: string
}

/** Sekcja „co obejmuje wizyta". */
export const INCLUDED: LandingItem[] = [
  {
    icon: 'droplet',
    title: 'Kąpiel i suszenie',
    text: 'Kosmetyki dobrane do typu okrywy i skóry. Suszenie ręczne, bez klatki i bez pośpiechu.',
  },
  {
    icon: 'scissors',
    title: 'Strzyżenie nożyczkowe',
    text: 'Fryzura dobrana do rasy, typu włosa i trybu życia psa. Wzorcowa albo praktyczna, krótsza.',
  },
  {
    icon: 'paw',
    title: 'Pazurki i uszy',
    text: 'Skracanie pazurów, czyszczenie kanałów usznych i okolic oczu. W cenie każdej wizyty.',
  },
  {
    icon: 'brush',
    title: 'Rozczesywanie',
    text: 'Cierpliwe rozczesywanie kołtunów tam, gdzie da się je uratować bez krzywdzenia psa.',
  },
  {
    icon: 'note',
    title: 'Karta pupila',
    text: 'Rasa, waga, uwagi i historia wizyt zapisane w koncie. Nie musisz powtarzać ich za każdym razem.',
  },
]

/** Sekcja „dlaczego my". */
export const WHY: LandingItem[] = [
  {
    icon: 'clock',
    title: 'Bez pośpiechu',
    text: 'Jeden pies w salonie naraz i realny czas na przerwy.',
  },
  {
    icon: 'scissors',
    title: 'Fryzura pod okrywę',
    text: 'Dobrana do typu włosa, a nie do szablonu z internetu.',
  },
  {
    icon: 'calendar',
    title: 'Rezerwacja online',
    text: 'Wolne godziny widoczne od razu, bez telefonów i czekania.',
  },
  {
    icon: 'bell',
    title: 'Przypomnienia',
    text: 'System sam policzy, kiedy futro odrośnie, i da znać.',
  },
]

/** Ikona nagłówka grupy w cenniku. */
export const CATEGORY_ICON: Record<string, IconName> = {
  strzyzenie: 'scissors',
  kapiel: 'droplet',
  dodatki: 'paw',
}
