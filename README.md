# Kael Pet Grooming — landing page + system rezerwacji

Demo salonu pielęgnacji psów: strona sprzedażowa + system rezerwacji z kontami
klientów, profilami pupili, panelem administratora i **automatycznymi follow-upami
zależnymi od tempa wzrostu futra danej rasy**.

React + TypeScript + Vite. **Zero backendu** — dane żyją w `localStorage` przeglądarki.

## Design system

- **Kolory:** terakota `#e5814f` jako tło strony i akcent, krem `#fbede0`, biel kart,
  czerń `#1b1a19` na przyciskach i blokach CTA. Semantyka: mięta, masło, róż.
  Wszystkie tokeny są na górze [`src/styles.css`](src/styles.css).
- **Typografia:** Playfair Display (nagłówki, akcenty kursywą w kolorze terakoty),
  Inter (treść), Caveat (odręczne adnotacje przy CTA).
- **Układ:** cała strona żyje w białej, zaokrąglonej ramce (`.shell`) na pomarańczowym
  tle. Sekcje akcentowe i ciemne to bloki `.block--accent` / `.block--dark`
  z delikatnym wzorem łapek w tle.
- **Ikony:** własny zestaw konturowych SVG w [`src/components/Icon.tsx`](src/components/Icon.tsx).
  W interfejsie **nie ma emoji** — awatary to inicjały, statusy to plakietki tekstowe.

## Uruchomienie

```bash
npm install && npm run dev
```

Aplikacja: http://localhost:5173

## Konta demo

| Rola | Login | Hasło |
| --- | --- | --- |
| Klient (2 psy: Fibi, Bruno) | `jan@example.com` | `demo1234` |
| Administrator salonu | `admin@kaelpetgrooming.pl` | `admin1234` |

Na ekranie logowania są przyciski do logowania jednym kliknięciem.
Pasek u góry strony pozwala zresetować dane demo do stanu początkowego.

> To demo bez serwera — hasła leżą jawnie w `localStorage`. Nie wpisuj prawdziwych danych.

## Co jest w środku

**Landing page** (`/`)
- hero z ilustracją i pływającymi plakietkami,
- „Wszystko w jednej wizycie" — 5 cech usługi,
- „O mnie",
- **kalkulator odstępu między wizytami** (rasa + data ostatniego strzyżenia
  → zalecany termin) w pomarańczowym bloku,
- „Dlaczego Kael" — 4 wyróżniki,
- cennik w 3 kategoriach,
- najlepsze opinie i ocena z Booksy,
- przed i po — przeciągany suwak porównania,
- kalendarz z realną dostępnością,
- ciemny blok CTA,
- formularz kontaktowy (wiadomości lądują w panelu admina).

**Rezerwacja** (`/rezerwacja`) — 4 kroki: pupil → usługa → termin → potwierdzenie.
Usługi są podpowiadane pod rasę i wagę psa, kalendarz pokazuje tylko dni z wolnym
oknem na wybraną usługę, godziny liczone są z grafiku salonu i zajętych wizyt.

**Panel klienta** (`/konto`) — wizyty (nadchodzące + historia), profile pupili
(dodawanie/edycja/usuwanie), skrzynka z przypomnieniami, dane kontaktowe.

**Panel administratora** (`/admin`) — przegląd, klienci z rozwijaną historią i psami,
wizyty (oznacz jako zrealizowaną / odwołaj), skrzynka wiadomości, follow-upy.

## Silnik follow-upów

Serce systemu: [`src/lib/followups.ts`](src/lib/followups.ts) + tabela ras
[`src/data/breeds.ts`](src/data/breeds.ts).

Każda rasa ma `intervalWeeks` — co ile tygodni wymaga wizyty, zależnie od tempa
odrastania okrywy:

| Rasa | Tempo | Interwał |
| --- | --- | --- |
| Maltipoo, Pudel, Bichon | bardzo szybki | 5 tyg. |
| Shih Tzu, Maltańczyk, Yorkshire, Hawańczyk | szybki | 6 tyg. |
| Cocker Spaniel | umiarkowany | 8 tyg. |
| Szpic miniaturowy | wolny | 10 tyg. |
| Chihuahua | wolny | 12 tyg. |

Algorytm:

1. `ostatnia wizyta + intervalWeeks` = termin kolejnego strzyżenia,
2. jeśli termin minął albo wypada w ciągu `settings.leadDays` (domyślnie 7 dni) —
   powstaje follow-up z treścią **napisaną pod konkretną rasę**
   (np. maltipoo dostaje o kołtunach przy uszach, szpic o wyczesaniu podszerstka),
3. pies z już umówioną wizytą jest pomijany, rezerwacja zamyka otwarte przypomnienia,
4. skan startuje **automatycznie przy każdym wejściu do aplikacji** i — gdy
   „Wysyłaj automatycznie" jest włączone — od razu dostarcza wiadomości do skrzynek
   klientów.

W panelu admina, w zakładce **Follow-upy**:
- `Sprawdź follow-upy` — ręczny skan,
- `Wyślij follow-upy` — ręczna wysyłka kolejki,
- przełącznik automatycznej wysyłki i wyprzedzenia,
- harmonogram wszystkich psów, lista wysłanych (z akcją „Ponów") i log automatu.

„Wysyłka" w demo = wiadomość w skrzynce klienta. Podpięcie prawdziwego e-maila/SMS-a
sprowadza się do podmiany `sendFollowUps` w `src/lib/followups.ts`.

## Struktura

```
src/
  data/      breeds.ts (tempo wzrostu futra), services.ts (cennik), reviews.ts
  lib/       types.ts, store.tsx (stan + akcje), storage.ts, seed.ts,
             followups.ts (silnik), availability.ts (grafik), date.ts
  components/ Layout, Calendar, BeforeAfter, DogArt (ilustracje SVG), PetForm, Toast
  pages/     Home, Booking, Account, Admin, Login
  styles.css jeden arkusz — zmienne kolorów na górze
```

## Do podmiany przed publikacją

- **Zdjęcia** — sekcja „przed / po", hero i „O mnie" używają ilustracji SVG jako
  placeholderów (`src/components/DogArt.tsx`).
- **Ceny z gwiazdką** — potwierdzone w Booksy są Shih Tzu, Maltipoo i Cocker Spaniel;
  reszta cennika to wartości orientacyjne (`estimatedPrice: true` w `services.ts`).
- **Opinie** — skrócone parafrazy z Booksy; docelowo pełne cytaty za zgodą autorek
  albo widget Booksy.
- **Tekst „O mnie"**, telefon i e-mail w stopce.
- **Godziny otwarcia** — przyjęto pon–pt 10–20, sob 10–16, niedziela nieczynne
  (`OPENING_HOURS` w `src/lib/availability.ts`).
