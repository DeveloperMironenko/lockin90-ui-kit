# SDD — `Card` (marketing)

> **Package:** `@lockin90/ui/marketing` — web-only marketing primitive (Aurora marketing site).
> **Import as:** `import { Card } from '@lockin90/ui/marketing'`.
> **Source:** `packages/ui/src/marketing/Card/index.tsx` · CSS `packages/ui/src/marketing/Card/styles.css` (`.lk-mk-card`) layered over the shared base `.lk-card` / `.lk-hover` in `packages/ui/src/styles/primitives.css`.
> **Exports:** `Card`, type `CardProps`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (marketing) — shares the base `.lk-card` surface but is a separate, marketing-tuned wrapper.
> **Stories:** none — rendered live on the marketing site (`lockin90-marketing`).

---

## 1. Overview

The **Aurora glass surface** for the marketing site — the base panel under feature blocks, pricing tiers, testimonials, and stat cards. It deliberately **reuses the kit's base `.lk-card`** (same glass bg, hairline border, radius, blur, elevation) and adds only two marketing-specific affordances:

- a **roomier padding scale** (`24px`, → `28px` ≥640px) vs the base card's `22px`;
- a **polymorphic tag** (`as`) so the card can be a `<div>`, `<article>` (a self-contained feature/testimonial), or `<li>` (an item in a card grid/list).

It exists so marketing panels share one glass treatment with the app kit while carrying the slightly more generous marketing rhythm — without forking the surface visuals.

## 2. API contract

| Prop | Type | Default | Web | Notes |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — (required) | ✓ | card content |
| `hover` | `boolean` | `false` | ✓ | adds `lk-hover` → lift + border brighten on hover |
| `as` | `'div' \| 'article' \| 'li'` | `'div'` | ✓ | polymorphic element; use `article` for standalone blocks, `li` inside a list grid |
| `className` | `string` | — | ✓ | appended via `cn(...)` |

- Plain function component; renders `<Tag className={cn('lk-card', 'lk-mk-card', hover && 'lk-hover', className)}>` where `Tag = as`.
- No `forwardRef`, no `...rest` spread — only the listed props are forwarded (no `onClick`, `id`, etc. — pass them via a wrapper or extend the component if needed; see §9).

## 3. Visual spec (tokens — never hardcode)

Surface comes from the base `.lk-card` (`primitives.css`); only padding is overridden by `.lk-mk-card`.

| Aspect | Token / value | Source |
| --- | --- | --- |
| Background | `--glass` | base `.lk-card` |
| Border | `1px solid --border` | base `.lk-card` |
| Radius | `--r` (16) | base `.lk-card` |
| Blur | `backdrop-filter: blur(16px) saturate(120%)` | base `.lk-card` |
| Shadow | `--elev-1` | base `.lk-card` |
| Transition | `transform/border-color/box-shadow .4s --ease` | base `.lk-card` |
| Padding (base) | `24px` | `.lk-mk-card` override |
| Padding (≥640px) | `28px` | `.lk-mk-card` override |
| Hover (with `hover`) | `translateY(-4px)`, `border-color: --border-2`, `box-shadow: --elev-2` | base `.lk-card.lk-hover:hover` |

`backdrop-filter` blur is what makes the glass read over the void/gradient background.

## 4. States

| State | Web | Cite |
| --- | --- | --- |
| Default | base glass surface | `.lk-card` + `.lk-mk-card` |
| Hover | only when `hover` set: lift `-4px` + brighten border + `--elev-2` | `.lk-card.lk-hover:hover` |
| Focus | none (Card is non-interactive by itself) | — |
| Pressed / disabled / loading | not built-in — Card is a presentational surface; compose interactive children inside | — |

Without `hover`, the card is fully static.

## 5. Platform & relationship to root kit

**🖥️ web-only (marketing).** Marketing is web-only — no native counterpart, no parity obligation.

**Relationship to root `Card` (`@lockin90/ui`, `packages/ui/src/components/Card.tsx`) — SEPARATE component, same base surface.** Do not confuse them:

- **Same** underlying CSS surface — both emit `.lk-card` and the `hover` → `.lk-hover` lift, so they look like one family.
- **Root `Card`** is the richer app primitive: `forwardRef`, spreads full `HTMLAttributes` (`onClick`, `id`, …), and exposes `lit` (gradient hairline), `pad` (`none/sm/md/lg`), `padLg`, `flat`, `tone` (`warn/danger`), `variant` (`ghost/dashed`).
- **Marketing `Card`** is intentionally thinner: no ref/rest-spread, no tone/variant/lit/flat, but adds the `as` polymorphic tag and the roomier `24/28px` marketing padding via `.lk-mk-card`.
- **Rule of thumb:** inside app screens use the root `@lockin90/ui` `Card`; on the marketing site use this one. They are not interchangeable imports.

## 6. Composition & usage

- **Composes from:** the base `.lk-card` surface; holds any marketing content (`Stat`, marketing `Typography`, `Icon`, `IconBadge`, `Pill`, CTAs).
- **Used as:** feature cards, pricing tiers, testimonials, FAQ panels — typically in a CSS grid where each card is `as="li"` (or `article`) inside a `<ul>`.

```tsx
// Feature grid — semantic list of standalone cards with hover lift:
<ul className="feature-grid">
  <Card as="li" hover>
    <IconBadge><Icon name="bolt" /></IconBadge>
    <Heading as="h3" size="card">Instant readiness</Heading>
    <Body>Your daily score the moment you wake.</Body>
  </Card>
</ul>

// Static testimonial block:
<Card as="article">
  <Body size="lg">“LockIn90 changed how I train.”</Body>
</Card>
```

## 7. Accessibility

- Renders a non-interactive surface — choose `as` for the correct semantics: `article` for a self-contained unit, `li` inside a list (wrap in `<ul>`/`<ol>`), `div` otherwise.
- The card itself takes no focus and exposes no role; any clickable affordance must be a real `<button>`/`<a>` **inside** the card (don't make the whole card a click target without a real control — there's no `onClick`/role here by design).
- Glass contrast: content text uses `Typography` tokens chosen to meet contrast over the `--glass` surface on the void background.

## 8. Usage rules — Do / Don't

**Do**
- Use marketing `Card` as the base panel for every marketing block.
- Set `as="li"` inside card grids and `as="article"` for standalone units.
- Add `hover` to cards that link somewhere / invite interaction.
- Put real interactive controls (`<a>`, `Button`) inside the card.

**Don't**
- ✗ Don't hand-roll a glass panel (`background: --glass; border: 1px --border; …`) — import `Card`.
- ✗ Don't use marketing `Card` inside app screens — use the root `@lockin90/ui` `Card` there (and vice-versa).
- ✗ Don't add `hover` to a card that isn't interactive (the lift implies clickability).
- ✗ Don't reach for tone/variant/lit on this card — those live on the root `Card`; if marketing needs one, add it to BOTH deliberately (§9).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke glass `div` re-creating `--glass` + `--border` + `--r` + blur + `--elev-1` is a parity hazard — the surface lives once in `.lk-card`. Import `Card`.
- **Need an interactive card?** This component intentionally omits `onClick`/rest-spread. If marketing needs a clickable card, extend the component (add `as`-aware rest-spread) rather than wrapping it in an `<a>` with a hand-styled lookalike.
- **Need tone/lit/variant on marketing?** Add the prop to the marketing `Card` (mapping to the existing base classes) deliberately — don't fork a new glass style.
- **Tokens only.** Padding here is the one deliberate raw-px override (`24/28`); everything else (color/border/radius/shadow) must stay token-sourced via the base `.lk-card`.
