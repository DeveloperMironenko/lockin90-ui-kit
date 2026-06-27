# SDD — `Icon` (marketing) (+ `IconName` type)

> **Package:** `@lockin90/ui/marketing` — web-only marketing primitive (Aurora marketing site).
> **Import as:** `import { Icon, type IconName } from '@lockin90/ui/marketing'`.
> **Source:** `packages/ui/src/marketing/Icon/index.tsx` · CSS `packages/ui/src/marketing/Icon/styles.css` (`.lk-icon`).
> **Exports:** `Icon`, type `IconName`, type `IconProps`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (marketing) — shares a name with the root `Icon` but is a SEPARATE icon set (different glyphs + API).
> **Stories:** none — rendered live on the marketing site (`lockin90-marketing`).

---

## 1. Overview

The **inline stroked-SVG icon set for the Aurora marketing surface**. A single `Icon` component renders one of a fixed name union as a `currentColor`-stroked 24×24 glyph, so callers tint it by setting text color on a parent. The bundled set is **marketing-flavored** — product/benefit glyphs (`bolt`, `moon`, `heart`, `activity`, `brain`, `dna`, `flask`, `shield`, `target`), nav/arrows (`arrowRight`, `arrowUpRight`, `check`, `sparkle`), and the **social/contact** glyphs the footer needs (`instagram`, `x`, `youtube`, `linkedin`, `mail`, `phone`, `mapPin`).

The **`IconName`** union is exported because the marketing app references specific names by string literal — it must stay stable (the source comment flags it as a preserved contract).

## 2. API contract

| Prop | Type | Default | Web | Notes |
| --- | --- | --- | --- | --- |
| `name` | `IconName` | — (required) | ✓ | which glyph to render (union below) |
| `size` | `number` | `20` | ✓ | px, sets both `width` + `height` (viewBox stays `0 0 24 24`) |
| `strokeWidth` | `number` | `1.6` | ✓ | SVG stroke width |
| `className` | `string` | — | ✓ | appended via `cn('lk-icon', className)` |

- Plain function component; renders a single `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">` with the path(s) for `name`.
- No `forwardRef`, **no `...rest` spread** — only the four props above are honored (no `onClick`, `style`, `aria-label` passthrough; tint/handlers go on a parent).

**`IconName` union (27 names):** `arrowRight`, `arrowUpRight`, `check`, `bolt`, `moon`, `heart`, `activity`, `watch`, `shield`, `brain`, `chart`, `dna`, `flask`, `target`, `refresh`, `users`, `sparkle`, `lock`, `mail`, `phone`, `mapPin`, `instagram`, `x`, `youtube`, `linkedin`, `star`, `topic`.

## 3. Visual spec (tokens — never hardcode)

This is a **color-inheriting glyph** — it emits no token of its own; it takes its color from the surrounding text color so callers tint via tokens on a parent (`color: var(--accent)`, `var(--text-dim)`, etc.).

| Aspect | Value |
| --- | --- |
| Geometry | `viewBox="0 0 24 24"`, rendered at `size`×`size` (default `20`) |
| Stroke | `stroke="currentColor"`, `stroke-width` = `strokeWidth` (default `1.6`), `fill="none"` |
| Caps/joins | `stroke-linecap: round`, `stroke-linejoin: round` |
| `.lk-icon` CSS | `display: inline-block`, `flex: 0 0 auto`, `color: inherit`, `vertical-align: middle` |

`flex: 0 0 auto` keeps the glyph from shrinking inside flex rows (e.g. next to a label); `color: inherit` is what makes `currentColor` resolve to the caller's text color.

## 4. States

Icon is **static** — no hover / focus / pressed / disabled / loading states of its own. It is decorative (`aria-hidden`) and never receives focus. Any state (e.g. color change on hover) is driven by the **parent** changing its text color; the glyph just inherits it.

## 5. Platform & relationship to root kit

**🖥️ web-only (marketing).** Marketing is web-only — no native counterpart, no parity obligation.

**Relationship to root `Icon` (`@lockin90/ui`, `packages/ui/src/components/Icon.tsx`) — SEPARATE icon set, same component name.** Do not confuse them:

- **Different glyph sets / `IconName` unions.** The marketing set (27 names) is product/benefit + social/contact glyphs. The root `Icon` set is the much larger **app/editor** set (`back`, `chevron`, `share`, `more`, `play`, `info`, `timer`, block-type/formatting/file glyphs, …). The two `IconName` types **overlap only on a few common names** (`check`, `lock`, `star`) and are otherwise disjoint — they are **not** the same union, so a name valid in one may be invalid in the other.
- **Different defaults/API.** Marketing `Icon`: `size` default **20**, exposes `strokeWidth`, **no `...rest` spread**. Root `Icon`: `size` default **18**, spreads `HTMLAttributes` (`onClick`, `aria-label`, …).
- **Same CSS class** (`.lk-icon`) and the same `currentColor`-stroke approach, which is why they look like one family — but they are **not interchangeable imports**. Use the root `Icon` in app screens, this one on the marketing site.

## 6. Composition & usage

- **Composes from:** nothing — a leaf `<svg>`.
- **Composed into:** `IconBadge` (marketing) wraps an `Icon` in a tinted glass square; feature `Card`s, list bullets, footer social links, inline-with-`Button` leading nodes.

```tsx
// Tint via a parent text color (token-driven):
<span style={{ color: 'var(--accent)' }}>
  <Icon name="bolt" size={24} />
</span>

// In a feature card badge:
<IconBadge><Icon name="moon" /></IconBadge>

// Footer social row:
<a href="…" aria-label="Instagram"><Icon name="instagram" /></a>
```

## 7. Accessibility

- Always renders `aria-hidden="true"` — the glyph is **decorative** and hidden from assistive tech by design.
- Because it can't take an `aria-label` (no rest-spread), an icon that conveys meaning on its own (e.g. a bare social link) must get its accessible name from the **wrapping** element — put `aria-label` on the `<a>`/`<button>` (as in the footer example above), or pair the icon with visible text.
- Never use a marketing `Icon` as the sole content of an interactive control without an accessible name on the parent.

## 8. Usage rules — Do / Don't

**Do**
- Tint icons by setting a token text `color` on a parent (`var(--accent)`, `var(--text-dim)`) — `currentColor` does the rest.
- Give icon-only links/buttons an `aria-label` on the wrapping control.
- Use the marketing set for the marketing site; reference names from the exported `IconName` union for type-safety.

**Don't**
- ✗ Don't paste raw inline `<svg>` paths on the marketing site — add a glyph to this set instead (§9).
- ✗ Don't use a marketing `Icon` in app screens (or a root `Icon` name here) — the unions differ; use the matching package.
- ✗ Don't hardcode a `stroke`/`fill` color on the icon — tint via parent text color (tokens).
- ✗ Don't rely on `Icon` alone to label an interactive control — it's `aria-hidden`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-pasted inline SVG on a marketing page bypasses the set's consistent stroke/size/cap contract and drifts. If a glyph is missing, **add it to `PATHS` + the `IconName` union** (24×24, stroked, `currentColor`) — never a one-off svg.
- **Preserve the union.** `IconName` is a referenced contract (the app imports names by literal) — **add** names; renaming/removing one is a breaking change.
- **Don't merge the two icon sets.** The marketing and root `Icon`s are deliberately separate (different audiences/glyphs); keep them apart — adding an app/editor glyph to the marketing set (or vice-versa) blurs the boundary.
- **Tokens for tint.** Color must come from a token on a parent; an icon with a baked-in hex stroke is a bug even if it matches today.
