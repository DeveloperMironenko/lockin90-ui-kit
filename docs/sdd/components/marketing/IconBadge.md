# SDD — `IconBadge`

> **Package:** `@lockin90/ui/marketing` — web-only marketing primitive (Aurora marketing site).
> **Import as:** `import { IconBadge } from '@lockin90/ui/marketing'`.
> **Source:** `packages/ui/src/marketing/IconBadge/index.tsx` · CSS `packages/ui/src/marketing/IconBadge/styles.css` (`.lk-icon-badge`, folded into `dist/styles.css` by `tsup.config.ts`).
> **Exports:** `IconBadge`, type `IconBadgeProps`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (marketing) — no native counterpart by design.
> **Stories:** none — rendered live on the marketing site (`lockin90-marketing`).

---

## 1. Overview

A **glass square that frames a single marketing `Icon`** — the small tile that sits beside (or above) a feature/benefit headline on the marketing site. Two treatments:

- **default** — neutral glass: `--glass-2` fill, hairline `--border`, `--text` glyph.
- **accent** (`accent` prop) — the **violet glass** treatment: translucent violet fill + border, `--accent` glyph. Use it to lift the one primary/highlighted feature in a row.

It is a thin presentational wrapper: it renders the marketing `Icon` at a fixed `size={22}` inside a 44×44 frame. There is no interaction, state, or sizing prop — its single job is to give a marketing icon a consistent, on-brand container so feature grids don't hand-roll a dozen different icon chips.

## 2. API contract

| Prop | Type | Default | Web | Notes |
| --- | --- | --- | --- | --- |
| `name` | `IconName` | — (required) | ✓ | the marketing icon to frame; union re-exported from `../Icon` (`arrowRight` `bolt` `moon` `heart` `shield` `brain` … `topic`) |
| `accent` | `boolean` | `false` | ✓ | switch from neutral glass to the violet accent treatment |
| `className` | `string` | — | ✓ | merged after the base classes via `cn(...)` for layout overrides |

- Plain function component (no `forwardRef`, no `...rest` spread) — it accepts **only** the three props above; arbitrary DOM attributes are not forwarded onto the `<span>`.
- The framed glyph size is **fixed at `22`** (passed to `<Icon size={22} />`); there is no `size` prop on `IconBadge`.
- `name` is type-checked against `IconName`, so a typo'd icon name is a compile error.

## 3. Visual spec (tokens — never hardcode)

| Aspect | default | accent (`.lk-accent`) |
| --- | --- | --- |
| Box | `44px × 44px`, `display: inline-flex`, centered | same |
| Radius | `--r-sm` (10) | same |
| Border | `1px --border` | `1px rgba(124,92,255,.4)` (violet at 40%) |
| Background | `--glass-2` | `rgba(124,92,255,.1)` (violet at 10%) |
| Glyph color | `--text` | `--accent` (`#7C5CFF`) |
| Glyph | marketing `Icon` at `size={22}`, 24×24 viewBox, stroked `currentColor` | same |

- The accent fill/border use literal violet rgba (`124,92,255` = `--accent`) rather than a token alias — the only component-specific raw values here; the glyph color itself is the `--accent` token.
- Glyph inherits color from the frame's `color` (stroke is `currentColor` inside `Icon`).

## 4. States

`IconBadge` is **static** — it has no hover, focus, pressed, disabled, or loading state. The only variance is the `accent` boolean swapping the three color tokens (border/background/glyph) in §3. It is not focusable or interactive; if it needs to be a link/button, wrap it in one (see §8).

## 5. Platform & relationship to root kit

**Web-only by design.** The marketing site is web-only (Aurora), so there is no `@lockin90/ui-native` counterpart and none is planned.

- **No root-kit twin.** The root cross-platform kit does **not** export an `IconBadge`; this primitive exists only under `@lockin90/ui/marketing`. It is the marketing-site equivalent of an "icon chip" and intentionally local to that surface.
- **Composes the marketing `Icon`** (same subpath) — not the root icon set. The `IconName` union it accepts is the marketing icon union (`packages/ui/src/marketing/Icon`), which differs from any root-kit icon registry.
- If a cross-platform "icon tile" is ever needed in the product apps, that is a **separate** root primitive to be added on both platforms — do not re-purpose this marketing one.

## 6. Composition & usage

- **Composes from:** the marketing `Icon` (fixed `size={22}`) + `cn`.
- **Used by:** marketing feature/benefit grids, value-prop rows, and FAQ/section intros where a headline is paired with a glyph tile.
- **Pairs with:** `Heading` + `Body` (Typography) to form a feature card; `Card`/`Section` for layout.

```tsx
// neutral tile beside a feature headline
<IconBadge name="bolt" />

// the one highlighted feature → accent treatment
<IconBadge name="brain" accent />

// as a link target — wrap, don't make IconBadge itself interactive
<a href="/science" aria-label="The science">
  <IconBadge name="flask" accent />
</a>
```

## 7. Accessibility

- Renders a **non-interactive `<span>`** containing an inline SVG; the glyph is decorative framing, so the badge carries no role or label by itself.
- **Always supply meaning elsewhere** — the adjacent `Heading`/`Body` text is the accessible content. If the badge is the *only* thing conveying meaning (rare), give the wrapping element an `aria-label`.
- When wrapped in a link/button for interaction, put the focus styling + `aria-label` on **that** wrapper — `IconBadge` provides no focus ring.
- Contrast: accent glyph is `--accent` (`#7C5CFF`) on a 10%-violet glass over the void background — meets contrast for a non-text decorative glyph; do not rely on it to encode text-level information.

## 8. Usage rules — Do / Don't

**Do**
- Use `IconBadge` for every framed marketing icon so the 44×44 / `--r-sm` / glass treatment stays uniform.
- Use `accent` for the **one** highlighted item in a row; leave the rest neutral.
- Wrap it in a real `<a>`/`<button>` when it must be clickable, and label that wrapper.
- Pass only a valid `IconName`; let the type checker catch typos.

**Don't**
- ✗ Don't hand-roll a `<span>` with glass + an icon — use `IconBadge`.
- ✗ Don't hardcode the 44px box, radius, border, or the violet rgba — they come from the kit/tokens.
- ✗ Don't try to resize the glyph via `className` font tricks; the glyph is fixed at `22` (add a `size` prop to the component on the kit if a new size is genuinely needed).
- ✗ Don't make every tile `accent` — accent is for emphasis, not the default.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom glass square wrapping an icon re-creates `IconBadge` and will drift from the 44/`--r-sm`/glass/accent spec — import `IconBadge`.
- **New treatment → add a prop.** If marketing needs a second emphasis style (e.g. a "mint" tile), add a variant/prop to `IconBadge` with tokens — never a one-off chip in app code.
- **Tokens only.** The box size, radius, border, glass, and accent color must come from the kit; a hardcoded `#7C5CFF` or `44px` is a bug even when it looks identical (Aurora token renames will silently break it).
- **Marketing-scoped.** This is a marketing-subpath primitive; don't import it into the product/admin apps to dodge building a real cross-platform tile.
