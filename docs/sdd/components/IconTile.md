# SDD — `IconTile`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/IconTile.tsx` · web CSS `packages/ui/src/styles/components/icontile.css` (`.lk-icontile`) · native `packages/ui-native/src/components/IconTile.tsx`.
> **Exports:** `IconTile`, type `IconTileProps`.
> **Status:** Shipped. **Parity:** ✅ identical API.
> **Stories:** `packages/ui/src/stories/IconTile.stories.tsx` · `packages/ui-native/src/stories/IconTile.stories.tsx`.

---

## 1. Overview

A kit `Icon` on a small bordered tile: the leading mark of a summary row (design `web/onboarding.html` `.recap .rico`, the Finish recap). Pairs with `ListRow`'s `leading` slot and `boxed` rows.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `icon` | `IconName` | — | ✓ | ✓ | the kit icon |
| `color` | `string` | text colour | ✓ | ✓ | the glyph's colour, a token (`var(--accent)` / `colors.accent`) |
| _rest_ | `HTMLAttributes<HTMLSpanElement>` (no `children`) | — | ✓ | — | |

## 3. Visual spec

38×38, radius `--r-sm` and the `--border-2` line (a control-sized tile: CONVENTIONS, One shape, one line), bg `--bg-1`; the icon 18px, stroke 1.7.

## 4. States

None (not interactive).

## 5. Web ↔ native parity

Native: the same 38 tile, `radii.sm`, `colors.border2`, `colors.bg1`; the icon 18 in `color` (default `colors.text`). Hidden from screen readers.

## 6. Composition & usage

```tsx
<ListRow boxed leading={<IconTile icon="user" color="var(--accent)" />} title="Profile" subtitle="32 yrs · male" />
```

## 7. Accessibility

- **Kit rule:** CONVENTIONS "Accessibility" (2026-11-10) applies: contrast 4.5:1 text / 3:1 UI, 44pt native / 24px web targets, names from props, errors and changes announced, reduced motion, text scaling never disabled.

`aria-hidden`: the row's title names it.

## 8. Do / Don't

- **Do** use it for a row's leading icon on a tile. **Don't** draw a bordered square around an `Icon` in an app.
