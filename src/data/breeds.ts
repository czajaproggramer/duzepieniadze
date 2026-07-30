import type { Breed } from '../lib/types'

/**
 * Baza ras i tempo odrastania futra.
 * `intervalWeeks` to serce automatycznych follow-upów: im szybciej rośnie
 * okrywa włosowa, tym częściej system przypomina o wizycie.
 */
export const BREEDS: Breed[] = [
  {
    id: 'maltipoo',
    name: 'Maltipoo',
    coat: 'kręcona, gęsta, bez podszerstka',
    growthRate: 'bardzo szybki',
    intervalWeeks: 5,
    followUp: (pet, owner, weeks) =>
      `Cześć ${owner}, kręcone futro ${pet} rośnie naprawdę szybko. Od ostatniej wizyty minęło ${weeks} tyg., a u maltipoo najlepiej sprawdza się strzyżenie co 5 tygodni, zanim zrobią się kołtuny przy uszach i pod pachami. Umawiamy termin?`,
  },
  {
    id: 'pudel',
    name: 'Pudel (toy / miniaturowy)',
    coat: 'kręcona wełna, nie linieje',
    growthRate: 'bardzo szybki',
    intervalWeeks: 5,
    followUp: (pet, owner, weeks) =>
      `Cześć ${owner}, ${pet} nosi już ${weeks}-tygodniową wełnę. Pudle odrastają najszybciej ze wszystkich naszych gości, więc to dobry moment na strzyżenie, zanim włos zacznie się filcować.`,
  },
  {
    id: 'bichon',
    name: 'Bichon Frise',
    coat: 'puszysta, sprężysta, biała',
    growthRate: 'bardzo szybki',
    intervalWeeks: 5,
    followUp: (pet, owner, weeks) =>
      `Cześć ${owner}, po ${weeks} tygodniach sylwetka ${pet} traci swój okrągły kształt. Bichony wyglądają najlepiej strzyżone co 5 tygodni, więc zapraszamy po świeże wykończenie.`,
  },
  {
    id: 'shih-tzu',
    name: 'Shih Tzu',
    coat: 'długa, prosta, stale rosnąca',
    growthRate: 'szybki',
    intervalWeeks: 6,
    followUp: (pet, owner, weeks) =>
      `Cześć ${owner}, futro ${pet} rośnie bez przerwy i minęło już ${weeks} tyg. od ostatniego strzyżenia. U Shih Tzu w tym momencie włos zaczyna wchodzić w oczy i plątać się za uszami. Znajdziemy termin?`,
  },
  {
    id: 'maltanczyk',
    name: 'Maltańczyk',
    coat: 'jedwabista, długa, bez podszerstka',
    growthRate: 'szybki',
    intervalWeeks: 6,
    followUp: (pet, owner, weeks) =>
      `Cześć ${owner}, jedwabiste włosy ${pet} po ${weeks} tygodniach lubią się plątać przy szelkach i pyszczku. Zapraszamy na strzyżenie i kąpiel rozjaśniającą.`,
  },
  {
    id: 'yorkshire',
    name: 'Yorkshire Terrier',
    coat: 'włos typu ludzkiego, rośnie stale',
    growthRate: 'szybki',
    intervalWeeks: 6,
    followUp: (pet, owner, weeks) =>
      `Cześć ${owner}, ${pet} ma już ${weeks} tyg. odrostu. U yorków włos rośnie jak ludzki i sam się nie zatrzyma, więc czas go skrócić i porządnie wyczesać.`,
  },
  {
    id: 'hawanczyk',
    name: 'Hawańczyk',
    coat: 'falista, długa, miękka',
    growthRate: 'szybki',
    intervalWeeks: 6,
    followUp: (pet, owner, weeks) =>
      `Cześć ${owner}, falowane futro ${pet} po ${weeks} tygodniach zaczyna się zbijać przy łapkach. Hawańczyki najlepiej czują się z wizytą co 6 tygodni, czekamy na Was.`,
  },
  {
    id: 'cocker',
    name: 'Cocker Spaniel',
    coat: 'gęsta z piórami, wymaga trymowania',
    growthRate: 'umiarkowany',
    intervalWeeks: 8,
    followUp: (pet, owner, weeks) =>
      `Cześć ${owner}, pióra i uszy ${pet} po ${weeks} tygodniach robią się ciężkie, a u cockerów to najczęstsze miejsce kołtunów. Zapraszamy na trymowanie i czyszczenie uszu.`,
  },
  {
    id: 'pomeranian',
    name: 'Szpic miniaturowy (Pomeranian)',
    coat: 'podwójna, gruby podszerstek',
    growthRate: 'wolny',
    intervalWeeks: 10,
    followUp: (pet, owner, weeks) =>
      `Cześć ${owner}, szpiców nie strzyżemy krótko, ale po ${weeks} tygodniach podszerstek ${pet} prosi się o porządne wyczesanie, kąpiel i wymodelowanie łapek.`,
  },
  {
    id: 'chihuahua',
    name: 'Chihuahua',
    coat: 'krótka lub półdługa',
    growthRate: 'wolny',
    intervalWeeks: 12,
    followUp: (pet, owner, weeks) =>
      `Cześć ${owner}, ${pet} nie potrzebuje strzyżenia, ale od ${weeks} tygodni czeka na kąpiel, pazurki i uszy. Odświeżymy?`,
  },
  {
    id: 'inna',
    name: 'Inna rasa lub mieszaniec',
    coat: 'zależnie od psa',
    growthRate: 'umiarkowany',
    intervalWeeks: 8,
    followUp: (pet, owner, weeks) =>
      `Cześć ${owner}, minęło ${weeks} tyg. od wizyty ${pet}. To dobry moment na kąpiel i wyrównanie futra, zapraszamy.`,
  },
]

export const breedById = (id: string): Breed =>
  BREEDS.find((b) => b.id === id) ?? BREEDS[BREEDS.length - 1]

export const growthLabel: Record<Breed['growthRate'], string> = {
  'bardzo szybki': 'bardzo szybko rosnące futro',
  szybki: 'szybko rosnące futro',
  umiarkowany: 'umiarkowane tempo wzrostu',
  wolny: 'wolno rosnące futro',
}
