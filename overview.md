# Overview — Salon Demo

Dokument techniczny opisujący, **jak działa aplikacja**. Uzupełnia [README.md](README.md)
(który jest bardziej marketingowo-funkcjonalny). Utrzymuj ten plik na bieżąco — patrz
instrukcja w [CLAUDE.md](CLAUDE.md).

> Ostatnia istotna zmiana: **„Stonowany" jest motywem głównym (domyślnym)** i obejmuje
> teraz **całą część kliencką** (landing, logowanie, rezerwacja, panel klienta), nie tylko
> landing. **Panel admina jest w pełni niezależny od motywów** — ma osobną, neutralną
> oprawę użytkową (`.admin-shell`/`.admin-console`, [styles-admin.css](src/styles-admin.css))
> i został przeorganizowany funkcjonalnie: zakładki wiodą kalendarzem i przypomnieniami
> (patrz §4a i §7).

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
w przeglądarce, nie tylko buildem. (Aktualnie `DB_VERSION = 8`.)

---

## 3. Model danych

Definicje: [src/lib/types.ts](src/lib/types.ts). Kluczowe encje w `DB`:

| Encja | Opis |
| --- | --- |
| `User` | klient lub admin (`role`). Hasło jawnie (demo). |
| `Pet` | pupil: `breedId`, `weightKg`, opcjonalnie `lastGroomingDate` (data sprzed demo) i `photoUrl` (zdjęcie pupila w `public/`, pokazywane w awatarze). |
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
| `/` | [Home](src/pages/Home.tsx) — landing (hero, cechy, kalkulator odstępu, cennik, opinie, przed/po, kalendarz dostępności, CTA, kontakt) w jednym z dwóch motywów, patrz §4a | publiczna |
| `/rezerwacja` | [Booking](src/pages/Booking.tsx) — kreator 4-krokowy: pupil → usługa → termin → potwierdzenie | publiczna (wymaga konta do finalizacji) |
| `/logowanie` | [Login](src/pages/Login.tsx) — logowanie/rejestracja, przyciski kont demo | publiczna |
| `/konto` | [Account](src/pages/Account.tsx) — wizyty, profile pupili, skrzynka przypomnień, dane | klient |
| `/admin` | [Admin](src/pages/Admin.tsx) — konsola użytkowa: kalendarz, przypomnienia, wiadomości, wizyty, klienci (patrz §7) | admin |

Brak twardego guardu tras — strony renderują treść zależnie od `user`/`isAdmin` ze store.

---

## 4a. Motywy części klienckiej

Część kliencka serwisu renderuje się w jednej z **dwóch opraw**. Wybór trzyma store
(`theme`, `setTheme`, typ `LandingTheme` w [store.tsx](src/lib/store.tsx)), persystencja pod
`localStorage['salon-demo::motyw']` — **poza `DB`**, więc „Zresetuj dane" jej nie kasuje
i zmiana nie wymaga podbicia `DB_VERSION`. Lista wariantów: `LANDING_THEMES`
(**`stonowany` jest pierwszy = główny/domyślny**).

| Motyw | Plik | Charakterystyka |
| --- | --- | --- |
| `stonowany` (**domyślny**) | [HomeStonowany.tsx](src/pages/HomeStonowany.tsx) | szałwia + kamień, grotesk w nagłówkach (serif italic tylko jako akcent), **fotografie**, ikony pełne (`IconStonowany.tsx`), układ edytorski: hero split, kolumna zdjęcia przy usługach, nachodzący panel „O mnie", ciemna sekcja kalkulatora, cennik jako lista wierszy, pas zdjęć |
| `cukierkowy` | `HomeCukierkowy` w [Home.tsx](src/pages/Home.tsx) | pudrowy róż, serif w nagłówkach, ilustracje SVG (`DogArt`), ikony konturowe (`Icon.tsx`), karty i pigułki |

**Zasady:**
- **Treść jest 1:1 w obu motywach.** Motyw zmienia wyłącznie układ, typografię, ikony
  i materiał wizualny — nigdy copy. Teksty powtarzalne (lista „co obejmuje wizyta",
  „dlaczego my", ikony kategorii cennika) siedzą w [src/data/landing.ts](src/data/landing.ts),
  żeby warianty nie mogły się rozjechać. Resztę trzymaj zgodną ręcznie.
- **Domyślny motyw = `stonowany`.** Store startuje na `stonowany`, a `cukierkowy`
  włącza się dopiero po jawnym wyborze (`localStorage['…::motyw'] === 'cukierkowy'`).
- **Motyw obejmuje całą część kliencką, nie tylko landing.** [Layout](src/components/Layout.tsx)
  nakłada klasy `theme-stonowany` (na `.shell`) i `motyw-stonowany` (na `body`) na
  **każdej ścieżce poza `/admin`** (stała `UNTHEMED_PATHS`) — landing, logowanie,
  rezerwacja i **panel klienta** podążają za wyborem. **Panel admina jest wyjątkiem:**
  ma własną, neutralną oprawę niezależną od motywu (patrz §7).
- **Reskin panelu klienta bez przepisywania komponentów:** motyw `stonowany`
  **przemapowuje tokeny bazowe** (`--surface`, `--terracotta`, `--ink`, `--line`,
  status…) na paletę szałwii u góry [styles-stonowany.css](src/styles-stonowany.css),
  więc współdzielone `.card`/`.badge`/`.tab`/`.field` przejmują kolory automatycznie.
  Reguły specyficzne dla panelu scope'owane są pod `.theme-stonowany .page`
  (trafia tylko w `/konto`/`/rezerwacja`/`/logowanie` — landing używa klas `.st`,
  admin nie ma klasy `theme-stonowany`).
- **Przełącznik:** komponent `ThemeMenu` w `Layout.tsx` — rozwijane menu „Motywy"
  w nawigacji, widoczne tylko na landingu (`/`). Wybór persystuje i obowiązuje we
  wszystkich widokach klienckich.
- **Style:** osobny arkusz [src/styles-stonowany.css](src/styles-stonowany.css),
  wszystko pod `.theme-stonowany` / `.st`. Klasy landingu mają prefiks `st-`.

### Zdjęcia motywu „Stonowany"

Sloty zdjęć: [src/data/photos.ts](src/data/photos.ts); pliki wrzuca się do
**`public/photos/`** (nie do `dist/` — to katalog builda, kasowany przy `npm run build`).
Komponent [Photo.tsx](src/components/Photo.tsx) przy braku pliku (`onError`) pokazuje
neutralny kadr-placeholder, więc układ nie sypie się bez zdjęć. Oryginały z generatora
(~2 MB/szt.) leżą poza repo w `zdjecia-zrodlowe/` (w `.gitignore`); do `public/photos/`
trafiają wersje skompresowane (`sips -s formatOptions 78`, ~250 kB/szt.).
Prompty do wygenerowania każdego ujęcia (Nano Banana) leżą w
[public/photos/PROMPTY.md](public/photos/PROMPTY.md) — nazwy plików muszą się zgadzać
z `photos.ts`. `BeforeAfter` przyjmuje `media="zdjecie"` i wtedy zamiast `DogArt`
renderuje pary zdjęć z `BEFORE_AFTER_PHOTOS`.

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

## 7. Panel admina — konsola użytkowa (niezależna od motywu)

[src/pages/Admin.tsx](src/pages/Admin.tsx). Panel jest **świadomie oderwany od motywów**
części klienckiej i przeorganizowany **pod funkcję, nie estetykę**. Priorytet: **kalendarz
i przypomnienia** — stoją jako pierwsze zakładki.

**Oprawa (theme-independent).** [Layout](src/components/Layout.tsx) na `/admin` **nie**
nakłada `theme-stonowany`, za to dodaje klasę `admin-shell` (na `.shell`) oraz `admin-mode`
(na `body`). Arkusz [src/styles-admin.css](src/styles-admin.css) przemapowuje pod
`.admin-shell` tokeny bazowe na **neutralną paletę narzędziową** (chłodna szarość + funkcjonalny
błękit, `--serif → --sans`), więc chrome (pasek demo, nawigacja, stopka) i treść panelu tracą
róż/szałwię niezależnie od wyboru klienta. Sam `.page` panelu ma dodatkowo klasę
`admin-console` — trzyma reguły gęstości i układ specyficzny dla konsoli. **Nie zależy od
`DB_VERSION`.**

**Zakładki** (`Tab`, kolejność = priorytet): `kalendarz` → `followupy` → `wiadomosci` →
`wizyty` → `klienci`. Domyślna: `kalendarz`.

**Zakładka „Kalendarz"** (`CalendarTab` + `DaySchedule`): zwarty pasek liczb (nadchodzące
wizyty, nieprzeczytane wiadomości, przypomnienia w kolejce, klienci, przychód) + **kalendarz
dnia jako widok wiodący**. `DaySchedule` to oś godzinowa z blokami wizyt (`PX_PER_MIN = 0.9`)
oraz — pod osią — **agenda dnia z szybkimi akcjami** (`.day-agenda`/`.agenda-row`): dla wizyt
`scheduled` przyciski „Zrealizowana" (`completeAppointment`) i „Odwołaj" (`cancelAppointment`),
bez wchodzenia w osobną zakładkę. Bloki osi mają skrócony układ, gdy są niskie:
- `height < 52 px` → `is-compact`: godzina + pies·usługa w **jednej linii** (`.daycal-event-row`);
- `52–72 px` → dwie linie (zakres godzin + tytuł), **właściciel schodzi do tooltipa**;
- `≥ 72 px` → pełny układ trzech linii. CSS: reguły `.daycal-*` w [styles.css](src/styles.css).

**Zakładka „Przypomnienia"** (`Reminders`): na górze **pasek silnika** (`.engine-bar`) —
przełącznik **automatycznej wysyłki** (`setAutoSend`), status automatu, licznik „w kolejce",
przyciski **„Skanuj teraz"** (`runFollowUpScan`) i **„Wyślij oczekujące"** (`sendPendingFollowUps`,
wyłączony przy zerowej kolejce). Niżej bez zmian: okienko wzorca (`<textarea>` +
`REMINDER_VARIABLES`, select `leadDays` 0/3/7/14, podgląd na żywo), **tabela „Psy po terminie"**
(stan `po-terminie` bez umówionej wizyty) i **lista „Ostatnio wysłane"** (`status === 'sent'`,
malejąco po `sentAt`, **paginacja `SENT_PER_PAGE = 5`**, pager `.reminder-pager`). Wzorzec
zapisuje `setReminderTemplate` (na blur i przyciskiem); `template` ma fallback `?? ''`,
`renderReminderTemplate` zabezpiecza `undefined`.

Pozostałe zakładki (`Messages`, `Visits`, `Clients`) bez zmian funkcjonalnych.

---

## 8. Komponenty i styl

- [src/components/Icon.tsx](src/components/Icon.tsx) — własny zestaw konturowych SVG.
  **W UI nie ma emoji** (poza treścią wzorca wiadomości); statusy = plakietki. Awatar
  (`Avatar`) domyślnie pokazuje inicjał imienia, a gdy pupil ma `photoUrl` — jego
  **zdjęcie** (`.avatar-photo`, `object-fit: cover`), z powrotem do inicjału przy błędzie
  ładowania. Zdjęcia pupili leżą w `public/photos/` (np. `pies-1.jpg`), tak jak fotografie
  motywu „Stonowany".
- [src/components/IconStonowany.tsx](src/components/IconStonowany.tsx) — drugi zestaw ikon
  (pełne sylwetki, wycięcia przez `fill-rule: evenodd`) dla motywu „Stonowany". Te same
  klucze `IconName`; brakujące nazwy spadają na wersję konturową.
- [src/components/Photo.tsx](src/components/Photo.tsx) — zdjęcie z placeholderem (motyw
  „Stonowany", patrz §4a).
- [src/components/Calendar.tsx](src/components/Calendar.tsx) — miesięczny picker w rezerwacji
  (nie mylić z `DaySchedule` w Admin, to osobny widok osi dnia).
- [src/components/BeforeAfter.tsx](src/components/BeforeAfter.tsx) — suwak przed/po.
- [src/components/DogArt.tsx](src/components/DogArt.tsx) — ilustracje SVG (placeholdery zdjęć).
- [src/components/PetForm.tsx](src/components/PetForm.tsx) — formularz pupila.
- [src/components/Toast.tsx](src/components/Toast.tsx) — hook `useToast()` + komponent.
- **Style:** [src/styles.css](src/styles.css) — baza, tokeny kolorów/typografii na górze.
  Pudrowy róż `#d98996` (akcent + rama `#e8b8be`), kremowo-różowa biel, soft charcoal CTA.
  Playfair Display / Manrope / Caveat. Drugi arkusz,
  [src/styles-stonowany.css](src/styles-stonowany.css), dokłada motyw „Stonowany"
  (szałwia `#7d9068`, kamień, ciemne pasy) — pod `.theme-stonowany` / `.st`; na górze
  **przemapowuje tokeny bazowe**, dzięki czemu reskinuje też panel klienta (§4a). Trzeci
  arkusz, [src/styles-admin.css](src/styles-admin.css), daje panelowi admina neutralną
  oprawę użytkową (błękit `#2f6fb0` + chłodna szarość) pod `.admin-shell` / `.admin-console`
  — niezależną od motywów (§7).

---

## 9. Konwencje i uwagi dla rozwoju

- **Język:** cały UI, komentarze i identyfikatory domenowe po polsku. Trzymaj się tego.
- **Daty** zawsze jako `YYYY-MM-DD` (string), godziny `HH:MM`; używaj helperów z `date.ts`.
- **Mutacje stanu** tylko przez akcje w `store.tsx` (immutably, przez `setDb`).
- **Zmiana kształtu danych** → podbij `DB_VERSION` (patrz §2) i zweryfikuj w przeglądarce.
- **Brak testów** — weryfikacja przez `npm run build` **oraz** ręcznie/preview w przeglądarce.
- Konta demo i reset danych: pasek `DemoBar` u góry; loginy w [README.md](README.md).
