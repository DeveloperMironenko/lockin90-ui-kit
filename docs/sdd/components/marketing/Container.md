# SDD — `Container`

> **Package:** `@lockin90/ui/marketing` — web-only marketing primitive (Aurora marketing site).
> **Import as:** `import { Container } from '@lockin90/ui/marketing'`.
> **Source:** `packages/ui/src/marketing/Container/index.tsx` · CSS `packages/ui/src/marketing/Container/styles.css` (`.lk-mk-container*`, folded into `dist/styles.css` by `tsup.config.ts`).
> **Exports:** `Container`, type `ContainerProps`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (marketing) — no native counterpart by design.
> **Stories:** none — rendered live on the marketing site (`lockin90-marketing`).

---

## 1. Overview

The **centered, gutter-padded max-width wrapper** that every marketing section's content sits inside. It owns exactly two responsibilities: cap the content width and apply the responsive side gutters. Three width presets:

- `default` — `max-width: 1200px`. The standard column for hero, feature grids, pricing.
- `prose` — `max-width: 760px`. Narrow measure for long-form reading (legal, blog article, FAQ copy).
- `wide` — `max-width: 1320px`. The roomiest band, for full-bleed-ish galleries / wide grids.

It exists so marketing pages never hardcode a `max-width` + `padding-inline` per section; `Section` wraps a `Container` internally (see §6), so most callers get it for free and reach for `Container` directly only when composing a custom block outside a `Section`.

## 2. API contract

| Prop | Type | Default | Web | Notes |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — (required) | ✓ | the content to constrain + center |
| `size` | `'default' \| 'prose' \| 'wide'` | `'default'` | ✓ | selects the `max-width` preset |
| `className` | `string` | — | ✓ | appended via `cn(...)` after the kit classes |

- Plain function component (no `forwardRef`, no `...rest` spread) — it renders a single `<div>` and forwards nothing but `children`/`className`.
- Class composition: `cn('lk-mk-container', SIZE[size], className)` where `SIZE` maps `default→lk-mk-container-default`, `prose→lk-mk-container-prose`, `wide→lk-mk-container-wide`.

## 3. Visual spec (tokens — never hardcode)

This primitive is **layout-only** — it emits no color/typography and uses **raw px gutters/widths**, not token vars (there is no spacing token for page gutters in the kit). Values come from `styles.css`:

| Aspect | Value |
| --- | --- |
| Alignment | `margin-inline: auto`, `width: 100%` |
| Gutter (base) | `padding-left/right: 20px` |
| Gutter (≥640px) | `24px` |
| Gutter (≥1024px) | `32px` |
| `max-width` `default` | `1200px` |
| `max-width` `prose` | `760px` |
| `max-width` `wide` | `1320px` |

No background, border, radius, or shadow — it is a transparent measure/gutter box.

## 4. States

Container is **static** — no hover / focus / pressed / disabled / loading / error states. Its only "variation" is the three `size` presets (§3) and the two gutter breakpoints. It is non-interactive and never receives focus.

## 5. Platform & relationship to root kit

**🖥️ web-only (marketing).** The marketing site is web-only (Aurora), so there is **no native counterpart** and no parity obligation. There is also **no root-kit `Container`** — this name is unique to the marketing subpath, so there is nothing to confuse it with. App layouts in `@lockin90/ui` use other shells (cards, grids); the responsive page gutter + max-width band is a marketing-only concern handled here.

## 6. Composition & usage

- **Wrapped by `Section`:** `Section` renders `<Container size={containerSize}>` internally, so a `Section` already centers + gutters its children. Reach for a bare `Container` only for content placed **outside** a `Section` (e.g. a custom hero band, a sticky sub-nav).
- **Composes from:** nothing — it is a leaf wrapper around a `<div>`.
- **Pairs with:** `Section` (rhythm), `SectionHeader`, `Card`, `Stat`, marketing `Typography`.

```tsx
// Outside a Section — a custom full-bleed band that still aligns to the grid:
<div className="hero-band">
  <Container size="wide">
    <Heading as="h1" size="hero">Recover smarter</Heading>
  </Container>
</div>

// Long-form legal copy at a comfortable reading measure:
<Container size="prose">
  <Body>By using LockIn90 you agree to…</Body>
</Container>
```

## 7. Accessibility

- Renders a plain non-semantic `<div>` — it carries no role and is invisible to assistive tech (correct: it is pure layout).
- Adds no focusable elements and no `aria-*`.
- Width capping aids readability (`prose` keeps line length in the comfortable ~60–75ch band) but imposes no a11y requirement of its own.

## 8. Usage rules — Do / Don't

**Do**
- Use `prose` for any long-form text block to keep line length readable.
- Let `Section` provide the `Container` for normal page sections; only add a bare `Container` for off-`Section` content.
- Pass `className` for one-off layout tweaks (e.g. extra top margin), not for re-styling the gutters.

**Don't**
- ✗ Don't hardcode `max-width: 1200px` + `padding: 0 20px` on a marketing block — use `Container`.
- ✗ Don't nest a `Container` inside another `Container` (double gutters + double cap).
- ✗ Don't override `max-width`/gutters via `className` to invent a fourth width — add a `size` preset instead (§9).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled `div` that re-creates the centered max-width + responsive gutters is a maintenance hazard — the gutter breakpoints (`20/24/32`) and width bands live here once. Import `Container`.
- **New width need → add a `size` preset.** If a layout needs a width that isn't `default/prose/wide`, add a named preset to the `SIZE` map + `styles.css` — never a magic `className` max-width override at the call site.
- **Layout-only.** Container must stay color/type-free; anything visual belongs on the child (`Card`, `Section`, `Typography`), not the measure box.
- **One per band.** Exactly one `Container` per horizontal band; if a `Section` already wraps one, don't add a second.
