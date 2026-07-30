---
name: db-version-migration
description: Any change to the seed/DB shape must bump DB_VERSION or old localStorage crashes
metadata:
  type: project
---

The app persists its whole DB to localStorage. `loadDB()` in `src/lib/storage.ts` discards and reseeds only when `parsed.version !== DB_VERSION`. `seedDB()` stamps `version: DB_VERSION`.

**How to apply:** Whenever you add/rename a field on `Settings` or any seeded model, bump `DB_VERSION` in `src/lib/storage.ts`. Otherwise existing sessions keep the old shape, `npm run build` still passes (TS can't see runtime data), and the app crashes at runtime on the missing field. This exact trap hit the `reminderTemplate` addition (was fixed by bumping 5→6). Prefer verifying in the browser after such changes, not just the build.
