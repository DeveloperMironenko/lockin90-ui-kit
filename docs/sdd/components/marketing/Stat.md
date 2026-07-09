# SDD — `Stat` (marketing) (thin wrapper over root `Stat`)

> **Package:** `@lockin90/ui/marketing` — web-only marketing primitive (Aurora marketing site).
> **Import as:** `import { Stat } from '@lockin90/ui/marketing'`.
> **Source:** `packages/ui/src/marketing/Stat/index.tsx` · composes root `packages/ui/src/components/Stat.tsx` at `size="hero" tone="gradient"` · web CSS: none of its own — all visuals come from root `.lk-stat-hero`/`.lk-stat-v-grad` (`packages/ui/src/styles/primitives.css`); the old `.lk-mkt-stat*` file was deleted.
> **Exports:** `Stat`, type `StatProps`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (marketing) — shares a name with the root `Stat` and is now literally built from it (see §5), fixed to one size/tone combination.
> **Stories:** none — rendered live on the marketing site (`lockin90-marketing`).

---

## 1. Overview

A **marketing figure block** — one big **flux-gradient display number** over a mono uppercase eyebrow label. The "90", "2.4×", "12k" hero/section figures that anchor a metrics band ("90-day program", "2.4× faster recovery"). It is intentionally **oversized and decorative** — distinct from the compact dashboard usage of the root `Stat` (see §5).

It used to be a standalone implementation with its own `.lk-mkt-stat*` CSS. It is now a **thin wrapper over the root `Stat`**, rendered fixed at `size="hero" tone="gradient"` — every visual (the `clamp(40–60px)` value, the label positioned *below* it, the animated full-spectrum gradient fill) is the root component's `hero` size, not a separate recipe. This is a **faithful preservation, not a redesign**: `Stat`'s `hero` size was built to reproduce the retired `.lk-mkt-stat*` metrics exactly (see `docs/sdd/components/Stat.md` §3), so every existing marketing `Stat` call renders pixel-identical to before the consolidation.

Single fixed shape: a value string + a label string, stacked. No variants, no delta, no empty state — marketing figures are authored copy, not live data.

## 2. API contract

| Prop | Type | Default | Web | Notes |
| --- | --- | --- | --- | --- |
| `value` | `string` | — (required) | ✓ | the headline figure, e.g. `"90"`, `"2.4×"`, `"12k"` — a **string** (pre-formatted) → root `Stat value` |
| `label` | `string` | — (required) | ✓ | the mono caption beneath it → root `Stat label` |
| `className` | `string` | — | ✓ | forwarded to root `Stat className` (no `cn()` merge — this wrapper adds no class of its own) |

- Plain function component; renders `<RootStat className={className} value={value} label={label} size="hero" tone="gradient" />`. `size`/`tone` are hardcoded — not exposed as props.
- No `forwardRef`, no `...rest` spread. `value`/`label` are plain strings (not `ReactNode`) — figures are static copy.
- `delta`/`deltaDir`/`valueColor`/`sub`/`empty`/`hint` — everything else on `StatProps` — is **not exposed**; a marketing figure is exactly one shape.

## 3. Visual spec (tokens — never hardcode)

All visuals are the root `Stat` `hero` size + `gradient` tone — see `docs/sdd/components/Stat.md` §3 for the authoritative token table. Summarized:

| Aspect | Token / value |
| --- | --- |
| Container | `.lk-stat-hero` — `flex`, `flex-direction: column-reverse` (label renders below the value), `gap: 8px` |
| Value font | `.lk-stat .lk-value` + `.lk-stat-hero .lk-value` — `--font-display`, weight `700`, `font-size: clamp(40px, 6vw, 60px)`, `letter-spacing: -0.03em`, `line-height: 1` |
| Value fill | `.lk-stat-v-grad` at `hero` — the animated **mirrored energy spectrum** (`linear-gradient(100deg, #A8FF35, #34F5C5, #22D3EE, #7C5CFF, #FF3D81, #7C5CFF, #22D3EE, #34F5C5, #A8FF35)`), `background-size: 200% 100%`, clipped to text, `animation: lk-flow-text 9s linear infinite` — the same recipe as the shared `.lk-gradient-text` utility |
| Label font | `.lk-stat-hero .lk-label` — `--font-mono`, `11px`, weight `500`, `text-transform: uppercase`, `letter-spacing: 0.18em` |
| Label color | `--text-dim` |

The value is the only gradient-animated text on the figure; the `clamp()` makes it fluidly responsive from 40px (mobile) to 60px (desktop). These are exactly `Stat`'s `hero` tokens — this wrapper defines none of its own.

## 4. States

Stat is **static** — no hover / focus / pressed / disabled / loading / empty / error states. The value's gradient continuously animates (`lk-flow-text`, 9s loop, inherited from root `Stat`'s `hero`+`gradient` combination). It is non-interactive and never receives focus. There is **no `empty` placeholder mode** exposed here even though the root `Stat` it wraps has one — see §5.

## 5. Platform & relationship to root kit

**🖥️ web-only (marketing).** Marketing is web-only — no native counterpart, no parity obligation.

**Relationship to root `Stat` (`@lockin90/ui`, `packages/ui/src/components/Stat.tsx`) — a thin, fixed-configuration wrapper, not a separate implementation.** This is one of the kit's explicit **wrapper-over-a-root-primitive** components, the marketing sibling of admin's `Statistic` (`docs/sdd/components/admin/Statistic.md`), which wraps the same root `Stat` at its `sm`/`lg` sizes:

- **Root `Stat`** (`@lockin90/ui`) is the general-purpose primitive: `label` + `value` + optional signed `delta`/`deltaDir`, `tone`/`valueColor`/`size`/`sub`, and an `empty`+`hint` placeholder mode. Its `size="hero" tone="gradient"` combination **is** this figure's exact visual.
- **Marketing `Stat`** (`@lockin90/ui/marketing`) exposes only `value`/`label`/`className`, hardcoding `size="hero" tone="gradient"` underneath. It is not a separate class recipe — the `.lk-mkt-stat*` CSS file was **deleted**; every rule that used to live there now lives in `.lk-stat-hero`/`.lk-stat-v-grad` in `primitives.css`.
- They still deserve separate imports (**not interchangeable** call sites) — use the root `Stat` directly for a dashboard tile with a delta or empty state; use this marketing `Stat` for a fixed hero/section figure — but the underlying render is now the same component, sized differently.

## 6. Composition & usage

- **Composes:** root `Stat` (`@lockin90/ui`) at `size="hero" tone="gradient"` — see §5. No component-level composition beyond that.
- **Used as:** a metrics/proof band — several `Stat`s in a row/grid (often inside `Card`s or a `Section`).

```tsx
// A proof band of figures:
<div className="stat-row">
  <Stat value="90" label="Day program" />
  <Stat value="2.4×" label="Faster recovery" />
  <Stat value="12k" label="Athletes" />
</div>
```

## 7. Accessibility

- Inherits root `Stat`'s markup: plain `<div>`s with no role. The DOM/reading order is still `label` then `value` (root `Stat` renders the label span first) — `.lk-stat-hero`'s `flex-direction: column-reverse` only flips the *visual* stacking so the value sits on top with the label below it; screen-reader order is unaffected and stays label-then-value.
- `value` should be a human-readable string already (e.g. `"2.4×"`, `"12k"`) so screen readers announce the same thing a sighted user sees — don't rely on the gradient to convey meaning.
- The continuous gradient animation is on a text fill (not motion/transform); it is low-distraction. If a global reduced-motion treatment is desired, handle it at the `.lk-flow-text` keyframe level (shared by root `Stat`'s `hero`+`gradient` combo and `.lk-gradient-text`), not per-instance.

## 8. Usage rules — Do / Don't

**Do**
- Use marketing `Stat` for big hero/section proof figures.
- Pre-format the `value` string (`"2.4×"`, `"12k"`, `"90"`) so it reads correctly to everyone.
- Keep `label` short and mono-friendly (it's uppercased + wide-tracked).

**Don't**
- ✗ Don't use marketing `Stat` for live dashboard metrics — use the root `@lockin90/ui` `Stat` directly (it has `delta`, `empty`/`hint`, and the `sm`/`md`/`lg` sizes this wrapper doesn't expose).
- ✗ Don't hand-roll a giant gradient number — import `Stat` (and the underlying `.lk-stat-hero`/`.lk-stat-v-grad` recipe is shared with root `Stat`, don't reinvent it).
- ✗ Don't pass a `delta`/`empty`/`hint`/`sub`/`size`/`tone` here — this wrapper hardcodes `size="hero" tone="gradient"` and exposes only `value`/`label`/`className`.
- ✗ Don't hardcode the display font size / gradient — they come from root `Stat`'s `hero` tokens (§3).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke big number with a hand-built gradient + mono caption is a parity hazard — the figure recipe lives once in root `Stat`'s `hero` size, reused here. Import `Stat`.
- **Don't confuse the two `Stat`s.** Reaching for the wrong one (marketing figure in a dashboard, or a `sm`/`lg` tile in a hero band) is the #1 risk of the shared name — pick by package + role (§5). They are, underneath, the same component at different configurations, but the exported APIs are intentionally different sizes of the same idea.
- **Extend the root, not a fork.** If marketing needs a sub-caption or a unit suffix slot, add it to root `Stat` (it already has `sub` — check there first) and surface it through this wrapper — never a one-off styled block or a revived `.lk-mkt-stat*` file.
- **Tokens only.** Display font, mono label, gradient, and spacing all come from root `Stat`'s `hero` tokens / shared classes — no raw font sizes or colors at the call site (the responsive `clamp()` is encoded once, in `primitives.css`, not per-instance).
