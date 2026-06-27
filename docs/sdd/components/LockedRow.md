# SDD — `LockedRow`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/LockedRow.tsx` (web) · `packages/ui-native/src/components/ProGate.tsx` (native — exports both `LockedRow` and `ProGate`) ·
> web CSS `packages/ui/src/styles/components/pro.css` (`.lk-lockrow*`).
> **Exports:** `LockedRow`, type `LockedRowProps`. (Native re-exports `LockedRow` from `ProGate.tsx`; web from `LockedRow.tsx`.)
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; the tap handler is web `onClick` ↔ native `onPress`.
> **Stories:** web — shown in `Primitives.stories.tsx`/`ListRow.stories.tsx` (no dedicated story) · native — `ProGate.stories.tsx`.

---

## 1. Overview

A **tappable gated list row** — the "X more, unlock with PRO" affordance at the end of a truncated list. A red padlock badge (glowing), a label, a trailing chevron, a red-tinted border, and a thin red left accent bar signal that tapping leads to an upgrade/paywall. It's the row-level sibling of the panel-level `ProGate` (native; see `ProGate.md`).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `label` | `string` | `'19 more similar exercises'` | ✓ | ✓ | row text |
| `onClick` / `onPress` | `() => void` | — | `onClick` | `onPress` | **platform-shaped** tap handler |
| `className` | `string` | — | ✓ | — | web only (merged onto `.lk-lockrow`) |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | web `ButtonHTMLAttributes<HTMLButtonElement>` / native `Omit<ViewProps,'children'>` | — | ✓ | ✓ | spread onto the row |

- **Web:** a real `<button type="button" class="lk-lockrow">` — the padlock is an inline `LockIcon` SVG, the chevron an inline SVG.
- **Native:** a `Pressable` with `accessibilityRole="button"` + `accessibilityLabel={label}`; the padlock + chevron are RN-svg (native has no `currentColor`, so stroke colors are explicit).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Row | `flex`, `gap 12`, `100%`, `padding 12px 14px`, `--glass`, `1px rgba(255,77,109,.28)`, `--r-sm` | `row`, `gap 12`, `100%`, `12/14`, `colors.glass`, `1px rgba(255,77,109,.28)`, `radii.sm` |
| Left accent | `::before` 3px, `top/bottom 4`, `999px`, `--zone-low` | `View` 3px, `top/bottom 4`, `999`, `colors.zoneLow` |
| Lock badge | 30×30 circle, `--zone-low`, `box-shadow 0 0 14px -2px --zone-low` | 30×30 circle, `colors.zoneLow`, `shadowRadius 8` glow, elevation 6 |
| Lock glyph | 14×14, stroke `#fff`, sw 2 | 14, stroke `#fff`, sw 2 |
| Label | 14px, `--text`, `--font-ui` | `fonts.ui` 14px, `colors.text`, `flex 1` |
| Chevron | 18×18, `margin-left auto`, stroke `--text-faint`, sw 2 | 18, `marginLeft auto`, stroke `colors.textFaint`, sw 2 |

- **Red signalling:** the border `rgba(255,77,109,.28)` and badge/accent `--zone-low` (`#FF4D6D`) are the kit's "locked/paywall" tint — distinct from a normal `ListRow`.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-lockrow` (glass + red border + glowing badge) | base `Pressable` |
| Hover (web) | `:hover` → `--glass-2` bg + border `rgba(255,77,109,.45)` | n/a |
| Pressed | (no `:active` rule) | `rowPressed` → `colors.glass2` + border `rgba(255,77,109,.45)` |
| Focus | native `<button>` focus ring | platform focus ring |

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, one platform-shaped prop.** Identical structure (left accent → glowing lock badge → label → chevron), identical tokens (glass row, `rgba(255,77,109,.28)` border, `--zone-low` badge/accent, faint chevron), identical 30px badge with red glow and 14px white lock. Differences are substrate-only:

- **Tap handler:** web `onClick` ↔ native `onPress` — the one intentional API difference.
- **Hover vs press:** web lifts on `:hover` to `glass-2` + brighter red border; native applies the same change on `pressed`. Same visual delta, different trigger.
- **Element:** web `<button>`; native `Pressable`. Native sets `accessibilityLabel` from `label` automatically.

No capability gap — the row is fully usable and visually equivalent on both platforms.

## 6. Composition & usage

- **Composes from:** nothing else (self-contained badge + label + chevron).
- **Used by:** the tail of a truncated gated list (e.g. "19 more similar exercises") that routes to upgrade. Pair with `ProGate` (panel-level) for fuller locked surfaces.

```tsx
// web
<LockedRow label="19 more similar exercises" onClick={openPaywall} />

// native
<LockedRow label="19 more similar exercises" onPress={openPaywall} />
```

## 7. Accessibility

- **Web:** real `<button>` (focusable, Enter/Space activate). The padlock + chevron SVGs are `aria-hidden`; the visible `label` names the control. Pass `aria-label` only if the label is non-descriptive.
- **Native:** `Pressable` with `accessibilityRole="button"` and `accessibilityLabel={label}` (the label is announced). Decorative SVGs carry no a11y text.
- **Hit target:** row padding `12px 14px` yields a comfortable full-width touch target.

## 8. Usage rules — Do / Don't

**Do**
- Use `LockedRow` at the end of a list that's been truncated behind PRO.
- Write a concrete `label` that says what's locked ("19 more …").
- Wire `onClick`/`onPress` to the upgrade/paywall flow.

**Don't**
- ✗ Don't hand-roll a "locked" row with a custom lock badge — use `LockedRow`.
- ✗ Don't hardcode the red border/badge/accent — they're `--zone-low` + the paywall tint tokens.
- ✗ Don't use it for non-gated rows — it carries paywall semantics. Use `ListRow` for normal rows.
- ✗ Don't pass `onClick` to native or `style` to web (wrong-platform prop).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom red "unlock" row drifts from the badge glow + tint. Import `LockedRow`.
- **New need → both platforms.** A count prop or a CTA-icon variant must be added to `LockedRowProps` on web **and** native (native lives in `ProGate.tsx`) with the same names/tokens.
- **Tokens only.** Row glass, red border, `--zone-low` badge/accent, and faint chevron all come from `@lockin90/tokens` (the `rgba(255,77,109,*)` paywall tints derive from `--zone-low`).
- **Parity gate.** Before shipping, confirm the web phone-width locked row and native row match (same badge, label, chevron, red signalling).
