# CLAUDE.md

Wskazówki dla Claude Code przy pracy w tym repo.

## Utrzymuj overview.md na bieżąco

[overview.md](overview.md) to techniczny opis działania aplikacji (architektura, model
danych, silnik przypomnień, grafik, panel admina, konwencje).

**Przy każdej istotnej zmianie zaktualizuj `overview.md` w ramach tej samej pracy** —
zanim uznasz zadanie za skończone. „Istotna zmiana" to m.in.:
- nowa/usunięta strona, trasa lub zakładka,
- zmiana modelu danych (`types.ts`, `Settings`, kształt `DB`, seed),
- zmiana logiki store'a (nowe akcje, przepływ stanu),
- zmiana silnika przypomnień, dostępności/grafiku lub kroków rezerwacji,
- nowa konwencja, zależność lub krok buildu.

Aktualizuj konkretną sekcję, której dotyczy zmiana (oraz notkę „Ostatnia istotna zmiana"
na górze pliku). Drobne poprawki (literówki, kosmetyka CSS, refaktor bez zmiany zachowania)
nie wymagają wpisu.

## Zasady projektu

- **Bez backendu** — cały stan w `localStorage`; mutacje tylko przez akcje w
  `src/lib/store.tsx`.
- **Podbijaj `DB_VERSION`** w `src/lib/storage.ts` przy każdej zmianie kształtu `DB`/seeda,
  inaczej aplikacja wywali się w runtime na starych danych (build tego nie wykryje).
- **Weryfikuj w przeglądarce**, nie tylko `npm run build` — TS nie widzi danych runtime
  z `localStorage`.
- **Po polsku** — UI, komentarze i nazwy domenowe. Bez emoji w interfejsie.
- **Daty** jako stringi `YYYY-MM-DD`; używaj helperów z `src/lib/date.ts`.
