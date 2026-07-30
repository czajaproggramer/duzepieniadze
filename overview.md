# Overview — Salon Demo

Dokument techniczny opisujący, **jak działa aplikacja**. Uzupełnia [README.md](README.md)
(który jest bardziej marketingowo-funkcjonalny). Utrzymuj ten plik na bieżąco — patrz
instrukcja w [CLAUDE.md](CLAUDE.md).

> Ostatnia istotna zmiana: design system → **pudrowy róż** (blush + Manrope;
> tokeny w `styles.css`, ilustracje `DogArt`, favicon).

---

## 1. Czym to jest

Landing page salonu pielęgnacji psów + system rezerwacji z kontami klientów, profilami
pupili, panelem admina i **automatycznymi przypomnieniami o strzyżeniu zależnymi od tempa
wzrostu futra rasy**.

**Stack:** React 18 + TypeScript + Vite + React Router 6. **Brak backendu** — cały stan
żyje w `localStorage` przeglądarki. Brak bibliotek UI/state (własny store na Context),
brak testów, jeden arkusz CSS.

**Uruchomienie:** `npm install && npm run dev` → http://localhost:5173.
**Build:** `npm run build` (`tsc -b && vite build`).

---

## 2. Architektura w skrócie

```
main.tsx → <StoreProvider> → <App/>
                 │              │
                 │              └── <Layout> (DemoBar + Nav + <main> + Footer)
                 │                     └── <Routes> (Home / Booking / Login / Account / Admin)
                 │
                 └── jedno źródło prawdy: obiekt DB w useState, zapisywany do localStorage
```

- **Jeden globalny store** ([src/lib/store.tsx](src/lib/store.tsx)) trzyma cały `DB`
  (użytkownicy, pupile, wizyty, wiadomości, przypomnienia, powiadomienia, ustawienia)
  oraz sesję zalogowanego użytkownika i szkic rezerwacji. Wszystkie mutacje idą przez
  akcje wystawiane w `StoreValue`. Komponenty czytają przez hook `useStore()`.
- **Persystencja** ([src/lib/storage.ts](src/lib/storage.ts)): `DB` serializowany do
  `localStorage` pod kluczem `salon-demo::db`, sesja pod `::session`, szkic
  rezerwacji pod `::draft`. Zapis w `useEffect` przy każdej zmianie stanu.
- **Seed** ([src/lib/seed.ts](src/lib/seed.ts)): dane startowe generowane względem „dziś",
  żeby kalendarz i przypomnienia zawsze wyglądały świeżo. Ustawia `version: DB_VERSION`.

### ⚠️ Wersjonowanie DB (łatwa pułapka)

`loadDB()` porównuje `parsed.version` z `DB_VERSION`. Jeśli się różnią → zwraca `null`
i aplikacja siewa dane od nowa. **Każda zmiana kształtu `DB`/`Settings`/modeli w seedzie
wymaga podbicia `DB_VERSION` w [src/lib/storage.ts](src/lib/storage.ts).** Inaczej stare
dane w `localStorage` nie mają nowego pola, `npm run build` przechodzi (TS nie widzi danych
runtime), a aplikacja wywala się dopiero w przeglądarce. Po takich zmianach weryfikuj
w przeglądarce, nie tylko buildem. (Aktualnie `DB_VERSION = 7`.)

---

## 3. Model danych

Definicje: [src/lib/types.ts](src/lib/types.ts). Kluczowe encje w `DB`:

| Encja | Opis |
| --- | --- |
| `User` | klient lub admin (`role`). Hasło jawnie (demo). |
| `Pet` | pupil: `breedId`, `weightKg`, opcjonalnie `lastGroomingDate` (data sprzed demo). |
| `Appointment` | wizyta: `date` (YYYY-MM-DD), `time` (HH:MM), `durationMin`, `status` (`scheduled`/`completed`/`cancelled`). |
| `Message` | wiadomość z formularza kontaktowego lub panelu klienta → skrzynka admina. |
| `FollowUp` | wygenerowane przypomnienie w kolejce (`pending`/`sent`/`dismissed`). |
| `Notification` | powiadomienie w skrzynce klienta (efekt wysłania follow-upu). |
| `Settings` | `autoSendFollowUps`, `leadDays`, **`reminderTemplate`** (wzorzec wiadomości ze zmiennymi). |
| `followUpLog` | log działań automatu (pokazywany historycznie). |

Rasy i usługi to **dane statyczne** (nie w `DB`): [src/data/breeds.ts](src/data/breeds.ts),
[src/data/services.ts](src/data/services.ts), [src/data/reviews.ts](src/data/reviews.ts),
[src/data/site.ts](src/data/site.ts) (nazwa salonu, kontakt, adres).

---

## 4. Routing i strony

Router w [src/App.tsx](src/App.tsx). Wszystko owinięte w `<Layout>`
([src/components/Layout.tsx](src/components/Layout.tsx)): pasek demo (reset danych),
nawigacja (linki do sekcji landingu + panel/konto zależnie od roli), stopka.

| Ścieżka | Strona | Rola |
| --- | --- | --- |
| `/` | [Home](src/pages/Home.tsx) — landing (hero, cechy, kalkulator odstępu, cennik, opinie, przed/po, kalendarz dostępności, CTA, kontakt) | publiczna |
| `/rezerwacja` | [Booking](src/pages/Booking.tsx) — kreator 4-krokowy: pupil → usługa → termin → potwierdzenie | publiczna (wymaga konta do finalizacji) |
| `/logowanie` | [Login](src/pages/Login.tsx) — logowanie/rejestracja, przyciski kont demo | publiczna |
| `/konto` | [Account](src/pages/Account.tsx) — wizyty, profile pupili, skrzynka przypomnień, dane | klient |
| `/admin` | [Admin](src/pages/Admin.tsx) — przegląd, klienci, wizyty, wiadomości, przypomnienia | admin |

Brak twardego guardu tras — strony renderują treść zależnie od `user`/`isAdmin` ze store.

---

## 5. Grafik i dostępność (rezerwacje)

[src/lib/availability.ts](src/lib/availability.ts) — czysta logika, bez stanu:

- `OPENING_HOURS` — godziny wg dnia tygodnia (pon–pt 10–20, sob 10–16, nd nieczynne).
  Indeks 0 = poniedziałek (patrz `weekdayIndex` w [date.ts](src/lib/date.ts)).
- `SLOT_STEP = 30` min, `BOOKING_HORIZON_DAYS = 90`.
- **Jeden stół groomerski** — w danym momencie jedna wizyta; sloty liczone tak, by usługa
  o `durationMin` zmieściła się bez nachodzenia na zajęte wizyty. Dziś dochodzi min. 2 h
  wyprzedzenia.
- `availableSlots`, `hasAvailability`, `nextFreeSlots` — używane w rezerwacji i w sekcji
  „kalendarz" na landingu.

Daty w całym projekcie to **stringi `YYYY-MM-DD`** (bez stref czasowych) — helpery w
[src/lib/date.ts](src/lib/date.ts).

---

## 6. Silnik przypomnień o strzyżeniu

Serce systemu: [src/lib/followups.ts](src/lib/followups.ts) + tabela ras
[src/data/breeds.ts](src/data/breeds.ts) (każda rasa ma `intervalWeeks`).

**Algorytm (`petSchedule` / `scanForFollowUps`):**
1. `lastVisitDate(pet)` = najnowsza zrealizowana wizyta lub `pet.lastGroomingDate`.
2. `dueDate = ostatnia wizyta + intervalWeeks`.
3. Stan psa: `po-terminie` (dueDate minął), `zbliza-sie` (w ciągu `leadDays`), `ok`,
   `brak-historii`.
4. Dla psów po terminie / zbliżających się (bez umówionej przyszłej wizyty) tworzony jest
   `FollowUp`. Rezerwacja psa zamyka jego otwarte przypomnienia (`book()` w store).
5. **Skan startuje automatycznie przy starcie aplikacji** (`runEngine(true)` w
   `StoreProvider`, jednorazowo przez `bootRan` ref). Gdy `autoSendFollowUps` = on —
   od razu wysyła.
6. `sendFollowUps` = tworzy `Notification` w skrzynce klienta. Podpięcie realnego
   e-maila/SMS-a to wymiana tej jednej funkcji.

**Renderowanie wzorca:** `renderReminderTemplate(template, schedule)` podmienia tokeny
`{imie_psa}`, `{imie_wlasciciela}`, `{rasa}`, `{tygodnie}`, `{data}` na dane psa.
Wzorzec trzymany jest w `settings.reminderTemplate` (edytowalny w panelu admina).

**Akcje store powiązane:** `runFollowUpScan`, `sendPendingFollowUps`, `dismissFollowUp`,
`requeueFollowUp`, `setAutoSend`, `setLeadDays`, `setReminderTemplate`.

---

## 7. Panel admina — zakładka „Przypomnienia"

Komponent `Reminders` w [src/pages/Admin.tsx](src/pages/Admin.tsx). Zawiera:
- **Okienko ustawień** (na górze): `<textarea>` z wzorcem wiadomości + pasek przycisków
  wstawiających zmienne (`REMINDER_VARIABLES`), select **wyprzedzenia** (`leadDays`:
  0/3/7/14 dni), przycisk „Zapisz wzorzec" i **podgląd na żywo** na przykładowym psie.
- **Tabela „Psy po terminie"** — tylko psy w stanie `po-terminie` bez umówionej wizyty,
  z wyrenderowaną treścią przypomnienia dla każdego.

Wzorzec zapisuje się przez `setReminderTemplate` (na blur i przyciskiem). Lokalny stan
`template` ma fallback `?? ''`, a `renderReminderTemplate` zabezpiecza `undefined`.

**Kalendarz dnia** (`DaySchedule` w tym samym pliku): oś godzinowa z blokami wizyt
pozycjonowanymi wg `PX_PER_MIN = 0.9`. Krótkie wizyty mają skrócony układ, żeby tekst
się nie przycinał:
- `height < 52 px` → `is-compact`: godzina + pies·usługa w **jednej linii** (`.daycal-event-row`);
- `52–72 px` → dwie linie (zakres godzin + tytuł), **właściciel schodzi do tooltipa**;
- `≥ 72 px` → pełny układ trzech linii (godziny, tytuł, właściciel).

CSS bloków: reguły `.daycal-*` w [src/styles.css](src/styles.css).

---

## 8. Komponenty i styl

- [src/components/Icon.tsx](src/components/Icon.tsx) — własny zestaw konturowych SVG.
  **W UI nie ma emoji** (poza treścią wzorca wiadomości); awatary = inicjały, statusy = plakietki.
- [src/components/Calendar.tsx](src/components/Calendar.tsx) — miesięczny picker w rezerwacji
  (nie mylić z `DaySchedule` w Admin, to osobny widok osi dnia).
- [src/components/BeforeAfter.tsx](src/components/BeforeAfter.tsx) — suwak przed/po.
- [src/components/DogArt.tsx](src/components/DogArt.tsx) — ilustracje SVG (placeholdery zdjęć).
- [src/components/PetForm.tsx](src/components/PetForm.tsx) — formularz pupila.
- [src/components/Toast.tsx](src/components/Toast.tsx) — hook `useToast()` + komponent.
- **Style:** jeden plik [src/styles.css](src/styles.css), tokeny kolorów/typografii na górze.
  Pudrowy róż `#d98996` (akcent + rama `#e8b8be`), kremowo-różowa biel, soft charcoal CTA.
  Playfair Display / Manrope / Caveat.

---

## 9. Konwencje i uwagi dla rozwoju

- **Język:** cały UI, komentarze i identyfikatory domenowe po polsku. Trzymaj się tego.
- **Daty** zawsze jako `YYYY-MM-DD` (string), godziny `HH:MM`; używaj helperów z `date.ts`.
- **Mutacje stanu** tylko przez akcje w `store.tsx` (immutably, przez `setDb`).
- **Zmiana kształtu danych** → podbij `DB_VERSION` (patrz §2) i zweryfikuj w przeglądarce.
- **Brak testów** — weryfikacja przez `npm run build` **oraz** ręcznie/preview w przeglądarce.
- Konta demo i reset danych: pasek `DemoBar` u góry; loginy w [README.md](README.md).
