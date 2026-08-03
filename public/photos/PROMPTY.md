# Zdjęcia motywu „Stonowany" — prompty do Nano Banana

Motyw `Stonowany` używa fotografii zamiast ilustracji SVG. Nie wygenerowałem ich
w repo (brak generatora obrazów w tym środowisku), więc poniżej są gotowe prompty.

**Jak użyć:** wygeneruj obraz, zapisz pod dokładnie taką nazwą pliku w tym katalogu
(`public/photos/`). Dopóki pliku nie ma, komponent `<Photo>` pokazuje neutralny
kadr-placeholder i układ strony pozostaje poprawny — nic się nie sypie.

Mapowanie nazw plików na miejsca w kodzie: [src/data/photos.ts](../../src/data/photos.ts).

## Stan (uzupełniaj przy dodawaniu zdjęć)

Gotowe: `hero`, `uslugi`, `o-mnie`, `kalkulator`, `dlaczego-1..4`, `galeria-1..4`,
`kontakt`, `przed-fibi` + `po-fibi`.

Brakuje (na razie placeholdery): metamorfozy dla pozostałych psów — `przed-luna`/`po-luna`,
`przed-kiki`/`po-kiki`, `przed-bruno`/`po-bruno`.

> Uwaga do „Dlaczego": karta 3 „Rezerwacja online" używa `dlaczego-3.jpg` = kadr z
> kalendarzem/telefonem, a karta 4 „Przypomnienia" `dlaczego-4.jpg` = wystrzyżony pies na
> wprost (to samo ujęcie co `galeria-4.jpg`). Podmieniając te pliki, trzymaj się tej treści,
> żeby zdjęcie pasowało do podpisu.

**Przed wrzuceniem skompresuj** — pliki prosto z generatora ważą ~2 MB, na landing to
za dużo. Oryginały trzymamy poza repo w `zdjecia-zrodlowe/` (w `.gitignore`), a do
`public/photos/` trafia wersja zoptymalizowana:

```bash
sips -s format jpeg -s formatOptions 78 zdjecia-zrodlowe/NAZWA.jpg --out public/photos/NAZWA.jpg
```

## Wspólny styl (dopisz do każdego promptu)

> Photographic style: natural documentary photography, soft diffused daylight from a
> large window, muted sage-green and warm stone color palette, low saturation, gentle
> film grain, shallow depth of field (35mm, f/2.0), calm and unposed, no text, no logos,
> no watermark, no visible brand names, realistic skin and fur texture.

Format: **JPEG**, długość dłuższego boku ok. 1600 px, jakość ~80.

---

## Kadry

### `hero.jpg` — 4:3 poziom (główne zdjęcie hero)

> A calm, quiet dog grooming studio. A groomer in a linen apron gently combs a small
> white shih tzu standing on a wooden grooming table. Large window on the left, soft
> daylight, sage-green wall, a few wooden shelves with neatly arranged tools out of
> focus in the background. The dog looks relaxed, not stressed. Warm, minimal, calm.

### `uslugi.jpg` — 3:4 pion (kolumna „co obejmuje wizyta")

> Close-up of a small dog being bathed in a stainless-steel grooming tub, gentle hands
> in the foam, water droplets, soft light from a side window, tiled wall in muted
> stone color. Intimate and careful, no splashing or chaos.

### `o-mnie.jpg` — 4:5 pion (portret groomerki)

> Environmental portrait of a woman in her thirties, a professional dog groomer,
> holding a small fluffy dog in her arms, standing in her studio. Linen apron, hair
> tied back, warm natural smile, looking at the camera. Sage and cream interior behind
> her, soft window light from the side.

### `kalkulator.jpg` — 16:9 poziom (tło ciemnej sekcji, użyte przy ok. 16% krycia)

> Extreme close-up of a dog's coat, soft wavy white-cream fur filling the whole frame,
> a fine-toothed metal comb resting in it. Very shallow depth of field, texture study,
> quiet and abstract.

### `dlaczego-1.jpg` — 4:3 poziom („Bez pośpiechu")

> A small dog lying calmly on a grooming table during a break, head resting on its
> paws, eyes half closed. Empty, quiet studio around it, soft daylight, nobody else in
> frame.

### `dlaczego-2.jpg` — 4:3 poziom („Fryzura pod okrywę")

> Close-up of a groomer's hands using straight grooming scissors to shape the fur
> around a small dog's muzzle. Focus on the scissors and fur, the dog's eye softly out
> of focus. Precise and gentle.

### `dlaczego-3.jpg` — 4:3 poziom („Rezerwacja online")

> A tidy wooden reception counter in a grooming studio: a paper wall calendar, a
> smartphone lying face up with a neutral blank screen, a small potted plant, a ceramic
> mug. Overhead soft daylight. No readable text on any surface.

### `dlaczego-4.jpg` — 4:3 poziom („Przypomnienia")

> A freshly groomed small dog sitting on a grooming table looking straight into the
> camera, fluffy round head, clean and trimmed. Plain sage-green wall behind, soft
> even light.

### `kontakt.jpg` — 16:9 poziom (nagłówek karty „Salon")

> Wide interior shot of a small, calm one-person dog grooming studio: grooming table in
> the centre, a bathing tub on the right, wooden shelves with folded towels, a plant by
> the window. Nobody in frame, warm daylight, minimal and uncluttered.

### `galeria-1.jpg` … `galeria-4.jpg` — 1:1 kwadrat (pas zdjęć)

1. `galeria-1.jpg` — > Square crop: a freshly groomed shih tzu with a rounded head trim,
   sitting on a wooden table, plain sage background.
2. `galeria-2.jpg` — > Square crop: a maltipoo mid-blow-dry, fur lifted by the air, a
   groomer's hand holding the dryer, soft motion in the fur.
3. `galeria-3.jpg` — > Square crop: grooming tools laid out on a stone-coloured counter —
   scissors, a metal comb, a slicker brush, a folded towel. Top-down flat lay.
4. `galeria-4.jpg` — > Square crop: a cocker spaniel in profile with long, freshly combed
   ear feathering, warm side light.

### Metamorfozy „przed / po" — 16:9 poziom, pary

Ważne: **oba kadry w parze muszą mieć identyczne ujęcie** (ten sam kąt, ta sama
odległość, to samo tło i światło) — inaczej suwak porównania nie zadziała wizualnie.
Wygeneruj wersję „po", a potem wariant „przed" tego samego kadru.

| Plik | Prompt |
| --- | --- |
| `przed-fibi.jpg` | > A shih tzu standing on a grooming table, coat overgrown and slightly matted, long fringe covering the eyes. Plain sage-green background, centred, soft even light. |
| `po-fibi.jpg` | > The same shih tzu, same pose, same table, same sage-green background and light — now freshly groomed: shortened fringe, brushed-out coat, neatly shaped round head. |
| `przed-luna.jpg` | > An apricot maltipoo standing on a grooming table, curly coat overgrown and uneven, fur covering the paws. Plain sage-green background, centred, soft even light. |
| `po-luna.jpg` | > The same apricot maltipoo, same pose and background — freshly scissor-cut into a rounded teddy-bear trim, even paws and muzzle. |
| `przed-kiki.jpg` | > A white maltese standing on a grooming table, coat dull and slightly stained around the eyes, hair falling over the face. Plain sage-green background, centred. |
| `po-kiki.jpg` | > The same maltese, same pose and background — coat brilliantly clean and silky, eye area clear and tidy. |
| `przed-bruno.jpg` | > A chocolate cocker spaniel standing in profile on a grooming table, ear feathering long, heavy and tangled. Plain sage-green background. |
| `po-bruno.jpg` | > The same cocker spaniel, same profile pose and background — feathering trimmed and combed, ears light and clean. |
