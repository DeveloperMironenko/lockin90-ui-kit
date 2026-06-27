# SDD — `Pill` (marketing)

> **Package:** `@lockin90/ui/marketing` — web-only marketing primitive (Aurora marketing site).
> **Import as:** `import { Pill } from '@lockin90/ui/marketing'`.
> **Source:** `packages/ui/src/marketing/Pill/index.tsx` · CSS `packages/ui/src/marketing/Pill/styles.css` (`.lk-pill`, `.lk-accent`, `.lk-dot`).
> **Exports:** `Pill`, type `PillProps`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (marketing) — no native counterpart by design.
> **Stories:** none — rendered live on the marketing site (`lockin90-marketing`).

---

## 1. Overview

A **small Aurora label pill** for eyebrow-style tags on the marketing surface — "New", "Beta", a category tag, a "Live" status chip. Mono uppercase-ish micro-label inside a fully-rounded glass capsule. Two tones + an optional glow dot:

- `default` — neutral glass capsule, dimmed text. The everyday tag.
- `accent` — violet-tinted (text `#cbbcff`, violet border + fill). For "new / featured / highlighted" tags.
- `dot` (boolean) — prepends a 6px glowing dot in the **current text color**, for a "live / status" feel.

It exists so marketing eyebrows/tags don't get hand-rolled per page — one mono-pill recipe, two tones.

## 2. API contract

| Prop | Type | Default | Web | Notes |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — (required) | ✓ | the label content |
| `variant` | `'default' \| 'accent'` | `'default'` | ✓ | `accent` → violet tone (`.lk-accent`) |
| `dot` | `boolean` | `false` | ✓ | leading glow dot in the current color (`.lk-dot`) |
| `className` | `string` | — | ✓ | appended via `cn(...)` |

- Plain function component; renders `<span className={cn('lk-pill', variant === 'accent' && 'lk-accent', dot && 'lk-dot', className)}>`.
- No `forwardRef`, no `...rest` spread.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Token / value |
| --- | --- |
| Layout | `inline-flex`, `align-items: center`, `gap: 7px`, `white-space: nowrap` |
| Font | `--font-mono`, `11px`, weight `500`, `letter-spacing: 0.04em` |
| Padding | `5px 11px` |
| Radius | `--r-pill` (999) |
| Border (`default`) | `1px solid --border` |
| Background (`default`) | `--glass` |
| Text (`default`) | `--text-dim` |

**`accent`** (`.lk-pill.lk-accent`) overrides to: text `#cbbcff` (a light-violet, raw hex — a marketing-specific tint), `border-color: rgba(124,92,255,.4)`, `background: rgba(124,92,255,.1)` (the `--accent` violet `#7C5CFF` at low alpha).

**`dot`** (`.lk-pill.lk-dot::before`): a `6px` circle, `background: currentColor`, `box-shadow: 0 0 8px currentColor` — so it inherits the pill's text color (dim grey on `default`, violet on `accent`) and glows.

## 4. States

Pill is **static** — no hover / focus / pressed / disabled / loading states. Its only variation is `variant` (`default`/`accent`) × `dot` (on/off). It is non-interactive and never receives focus.

## 5. Platform & relationship to root kit

**🖥️ web-only (marketing).** Marketing is web-only — no native counterpart, no parity obligation.

There is **no root-kit primitive named `Pill`** — the app kit's equivalent small labels are `Chip`/`ChoiceChip`/`DeltaPill`/`Eyebrow`, which are different components with different APIs and visuals. This marketing `Pill` is its own mono-glass capsule and is not interchangeable with any of them; don't substitute a `Chip` on the marketing surface or a `Pill` in an app screen.

## 6. Composition & usage

- **Composes from:** nothing — a leaf `<span>`.
- **Used as:** eyebrow tags above a `SectionHeader`, status chips ("Live", "Beta"), category tags on cards, hero badges.
- **Pairs with:** `Section`/`SectionHeader`, `Card`, marketing `Typography`.

```tsx
// Neutral tag:
<Pill>Changelog</Pill>

// Violet "new" tag with a glowing dot:
<Pill variant="accent" dot>New in 1.4</Pill>

// Status chip in a card header:
<Pill dot>Live</Pill>
```

## 7. Accessibility

- Renders a non-interactive `<span>` — no role, no focus. The dot is a CSS `::before` (decorative), invisible to assistive tech, which is correct.
- Pill text is read inline as normal content; if a pill conveys status that isn't obvious from its text (e.g. a color-only meaning), convey that meaning in the `children` text, not the tone alone.
- Contrast: `default` uses `--text-dim` on `--glass`; `accent` uses `#cbbcff` on the low-alpha violet fill — both chosen to read on the void/gradient background.

## 8. Usage rules — Do / Don't

**Do**
- Use `Pill` for eyebrow tags / status chips on the marketing site.
- Use `accent` for "new / featured" emphasis; reserve it so it stays meaningful.
- Use `dot` for live/status semantics, and put the meaning in the label text too.

**Don't**
- ✗ Don't hand-roll a mono capsule (`border-radius: 999px; font: mono; …`) — import `Pill`.
- ✗ Don't use a marketing `Pill` inside app screens — use the app kit's `Chip`/`Eyebrow` there.
- ✗ Don't make a `Pill` interactive (it's a `<span>` with no role/focus); use a `Button`/`<a>` if it must click.
- ✗ Don't hardcode the violet (`#cbbcff` / `rgba(124,92,255,…)`) at the call site — get it via `variant="accent"`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke rounded mono tag re-creating the glass capsule + violet tint + glow dot is a parity hazard — the recipe lives once in `Pill`. Import it.
- **New tone need → add a `variant`.** If marketing needs a third tone (e.g. a status green/amber), add a `variant` to `Pill` + `styles.css` mapping to status tokens (`--ok`/`--warn`) — never a one-off inline-styled span.
- **Tokens (mostly) only.** The `accent` tone deliberately uses a marketing-specific light-violet hex `#cbbcff`; treat that as the single sanctioned exception encoded here — don't sprinkle new raw hexes at call sites.
- **Decorative dot stays decorative.** Don't rely on the dot's color alone to carry meaning — pair it with text.
