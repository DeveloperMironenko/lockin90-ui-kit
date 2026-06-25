# Build prompt — restore the `@lockin90/ui/marketing` subpath + primitives

**For:** an agent working in `lockin90-ui-kit`.
**Why:** the clean-slate kit rebuild flattened `@lockin90/ui` and **dropped the `marketing` subpath**
and its primitives. The marketing site (`lockin90-marketing`) imports `@lockin90/ui/marketing` on
**every page** (existing + newly ported), so it currently fails with
`Cannot find module '@lockin90/ui/marketing'` and cannot build. Restoring the subpath unblocks it.

> Do **not** invent new designs — these primitives already exist in the archived kit. Port them and
> re-wire the subpath. Keep prop APIs identical so the consuming apps need no changes.

## Source of truth
Branch **`archive/ui-kit-aurora-flux`**, under `packages/ui/src/marketing/`:
```
packages/ui/src/marketing/Container/{index.tsx,styles.css}
packages/ui/src/marketing/Section/{index.tsx,styles.css}
packages/ui/src/marketing/Typography/{index.tsx,styles.css}   # Heading, Body, Eyebrow, Mono, SectionHeader
packages/ui/src/marketing/Pill/{index.tsx,styles.css}
packages/ui/src/marketing/Reveal/{index.tsx,styles.css}
packages/ui/src/marketing/IconBadge/{index.tsx,styles.css}
packages/ui/src/marketing/Field/{index.tsx,styles.css}
packages/ui/src/marketing/index.ts                            # the barrel
```
Inspect them with e.g. `git show archive/ui-kit-aurora-flux:packages/ui/src/marketing/Container/index.tsx`.

## What `@lockin90/ui/marketing` MUST export (the full set the apps import)
The marketing app imports this exact set — the subpath barrel must expose all of them:
```ts
import {
  Container, Section, SectionHeader, Heading, Body, Eyebrow, Mono,
  Pill, Stat, Reveal, Icon, IconBadge, Accordion, Card, Field, type IconName,
} from '@lockin90/ui/marketing';
```
- **Port from the archive** (currently missing): `Container, Section, SectionHeader, Heading, Body, Mono, Pill, Reveal, IconBadge, Field`.
- **Re-export from the current flat kit** (already present in `@lockin90/ui`): `Eyebrow, Stat, Icon` (+ `IconName`), `Accordion, Card`.
  So the marketing barrel = ported components + re-exports of the base ones, giving a single
  `@lockin90/ui/marketing` entry that resolves every import above.

## Tasks
1. **Port the components** from `archive/ui-kit-aurora-flux` into `packages/ui/src/marketing/*`.
   - Keep the prop APIs identical (so the apps don't change). Note current usage in
     `lockin90-marketing/src/app/[locale]/*/page.tsx`: e.g. `Heading as="h1" size="display"`,
     `Body size="lg"`, `Eyebrow color="accent"`, `Pill variant="accent" dot`, `Section`, `Container`,
     `SectionHeader`, `Reveal` (scroll-reveal, reduced-motion safe), `IconBadge`, `Field`.
2. **Align tokens/classes to the CURRENT kit.** The archive used the old token vars/`ea-*`/`lk-*`
   class names; map them to the rebuilt kit's tokens + class convention (whatever the current
   `src/components/*` emit). Emit the kit's class style — do not introduce Tailwind. Fold the
   marketing `styles.css` into the kit's CSS output (see step 4).
3. **Barrel:** create `packages/ui/src/marketing/index.ts` exporting the ported components +
   re-exporting `Eyebrow, Stat, Icon, type IconName, Accordion, Card` from the base (`../index` or the
   component sources).
4. **Build wiring (tsup + exports):**
   - Add `src/marketing/index.ts` as a SECOND tsup entry so it builds to `dist/marketing/index.{mjs,cjs,d.ts}`.
   - Ensure the marketing components' CSS ships — either append to the existing `dist/styles.css`
     (single global stylesheet the apps already import) or emit `dist/marketing/styles.css` and have
     the apps import it (prefer folding into the existing `styles.css` so no app CSS-import change).
   - Add to `packages/ui/package.json` `exports`:
     ```json
     "./marketing": { "types": "./dist/marketing/index.d.ts", "import": "./dist/marketing/index.mjs", "require": "./dist/marketing/index.cjs" }
     ```
5. **Build + verify:**
   - `pnpm --filter @lockin90/ui build` is green.
   - `node -e "console.log(Object.keys(require('./packages/ui/dist/marketing/index.cjs')).sort().join(' '))"`
     lists **all 15** names above.
   - In `lockin90-marketing`: `pnpm typecheck` (or `next build`) resolves `@lockin90/ui/marketing` on
     every page (no `Cannot find module`).

## Notes
- A Changeset for `@lockin90/ui` (minor) is appropriate.
- **Related (separate, lower priority):** the `@lockin90/ui/admin` subpath was likely dropped the same
  way — the operator app `lockin90-admin` imports `@lockin90/ui/admin`. Same restore pattern from the
  archive if/when that app is rebuilt. Not needed for the marketing work.
- After this lands + the kit is pushed to `main`, the marketing app's CI (which rebuilds the kit from
  `lockin90-ui-kit@main`) will resolve the subpath and build.
