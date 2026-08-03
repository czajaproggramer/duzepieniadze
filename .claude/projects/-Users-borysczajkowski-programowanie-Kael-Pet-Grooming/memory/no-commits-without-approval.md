---
name: no-commits-without-approval
description: Nigdy nie commituj ani nie pushuj bez wyraźnej zgody użytkownika
metadata:
  type: feedback
---

Użytkownik wprost poprosił: „Nie rób żadnych commitów bez mojej wiedzy".

**Why:** Chce kontrolować, co i kiedy trafia do historii gita / na zdalny `main`
(z którego buduje Cloudflare).

**How to apply:** Wprowadzaj zmiany w plikach i weryfikuj je, ale **nie uruchamiaj
`git commit` ani `git push`** dopóki użytkownik wyraźnie o to nie poprosi w danej
sytuacji. Wcześniejsza w tej sesji rutyna „zmiana → commit → push" już nie obowiązuje.
Gdy praca jest gotowa, zaproponuj commit i poczekaj na zgodę.
