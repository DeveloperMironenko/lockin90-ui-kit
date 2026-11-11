# SDD — `FitText`

> **Package:** `@lockin90/ui-native` (native) — native-only text primitive; the web twin is the `useWordFit` hook in `@lockin90/ui` (internal), used by MetricTile and ListRow.
> **Source:** `packages/ui-native/src/components/FitText.tsx` · shared measurer `packages/ui-native/src/internal/wordFit.tsx` · web `packages/ui/src/hooks/useWordFit.ts`.
> **Exports:** `FitText`, type `FitTextProps`, `useWordFit` (the hook, for a title laid out as a row of pieces).
> **Status:** Shipped (1.35). **Parity:** 🟡 same rule, platform-shaped: native measures words with a hidden measurer; web shrinks an element whose word overflows (`scrollWidth > clientWidth`). Web has no exported component because a web element carries its own `className`; the hook is applied inside the web primitives.
> **Stories:** none (a `Text` that looks like the `Text` it replaces).

---

## 1. Overview

A React Native `Text` whose words never break in the middle (CONVENTIONS "Accessibility": nothing cut off
or broken mid-word at any text size). Lines still wrap between words; when the text's widest word is wider
than the width it is laid out in (a long word at an accessibility text size, a word in a third of a phone's
width: "Нейтральный", "физиологический", "Налаштування") the whole text shrinks until that word fits, down
to `minScale`. Text that fits is drawn exactly as a plain `Text`. Text scaling is never turned off.

The kit uses it for MetricTile (label, value), ListRow (a wrapping title / subtitle), Alert (title, text
body), FormField (label), Eyebrow, PasswordStrengthMeter (rules, hint) and Button (its label; the button
is named by `accessibilityLabel`, so the measurer never joins its name). Apps use it for their own titles (a screen's or step's header).

## 2. API contract

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `minScale` | `number` | `0.5` | the smallest scale a word shrinks to; at a large text size it may go to the default text size (`1 / fontScale`, AX3 ≈ 0.28) when that is smaller; below that the word breaks (last resort) |
| `measureText` | `string` | — | rich children's text (an i18n `Trans`'s translation as it is: its tagged parts are measured at bold; the parts inherit the scaled size) |
| `children` | `ReactNode` | — | strings and numbers are measured, nested ones too (a styled `Text`, a link) |
| `style` | `StyleProp<TextStyle>` | — | `fontSize`, `lineHeight` and `letterSpacing` are scaled together |
| `onLayout` | `TextProps['onLayout']` | — | still called |
| _rest_ | `TextProps` | — | spread onto the `Text` |

## 3. How it measures (`internal/wordFit.tsx`)

- `breakableWords(text)`: the pieces a line can't split — cut at spaces (a no-break space or a word joiner
  keeps words together), after a hyphen or dash (not a slash: "Europe/Kyiv" stays one), and around every CJK
  character (Han, kana, Hangul and full-width forms wrap anywhere).
- `taggedWords(text)`: a styled part (`<tag>…</tag>`: an i18n `Trans` translation's tags, or a nested
  element in the children, which `textOf` tags `<n>…</n>`; a bare unstyled `Text` wrapping a sentence is
  transparent) is measured at bold (700), the widest weight it may have (AlertStrong is 600: "Re-authentication"
  measured regular split by one letter at AX3).
- `WordMeasurer`: one unconstrained line per word in the text's own style, absolutely placed, 0 tall,
  transparent, hidden from accessibility (also used by SegmentedTabs and Select).
- `useWordFit(text, style, minScale)`: once measured the probes unmount (nothing extra stays in the tree a
  screen reader walks; a new text, text size or width brings them back). The room is the text's own `onLayout` width, read while it is drawn
  at full size (a text as wide as its content would otherwise shrink itself again on every pass; shrunk,
  only a wider room is taken); the words are measured at the unscaled style. Scale =
  `wordFitScale(widest, room, minScale)` (shared with SegmentedTabs' `stackedScales`) when the widest word is
  more than 1pt wider than the room, else 1. Decided again for a new text, text size or window width. Refs
  are also measured in a layout effect (iOS Fabric gives no `onLayout` to a tree mounted hidden).

**`useWordFit(text, style, minScale)`** (exported) gives `{ scale, scaled, textRef, onRoom, measurer }` for a
text the app lays out itself (a row of words with a gradient part): put `measurer` and `textRef` in the box
whose width is the room, call `onRoom` from its `onLayout`, and add `scaled` to every piece's style.

## 4. States

Fits → as `Text`. A word too wide → the whole text smaller (2-decimal scale). Narrower than `minScale` → at
`minScale` and the word breaks (never cut).

## 5. Web ↔ native parity

Web `useWordFit(text)` returns a ref for a block or flex-item element: with `overflow-wrap: normal` a too-wide
word overflows, so the element steps its `font-size` down (one measured jump, then 2 % steps) to 50 %; past
that the stylesheet's `overflow-wrap: anywhere` is the last resort. Re-runs on text change, webfonts and
width changes (ResizeObserver).

## 6. Composition & usage

```tsx
<FitText accessibilityRole="header" style={styles.title}>{t('onboarding.profile.title')}</FitText>
```

Alert passes its own `measureText` prop through for a rich body.

## 7. Accessibility

- **Kit rule:** CONVENTIONS "Accessibility" (2026-11-10) applies: contrast 4.5:1 text / 3:1 UI, 44pt native / 24px web targets, names from props, errors and changes announced, reduced motion, text scaling never disabled.
- The measurer is `accessibilityElementsHidden` / `no-hide-descendants`: screen readers read the text once.
- Text scales with the OS setting (no `allowFontScaling={false}`, no `maxFontSizeMultiplier`); only a word
  that would split shrinks, and only as far as it must.

## 8. Usage rules — Do / Don't

- **Do** use it for a title or label that can hold a long word (any translated text in a narrow box).
- **Do** lay the box out first (one column, the header above its icon at large text) — FitText is for the
  word that still doesn't fit.
- **Don't** use `numberOfLines` + `adjustsFontSizeToFit` for multi-word text: it shrinks the whole line, not
  the word.

## 9. Anti-patterns & lookalike ban

No app-side measurer or `adjustsFontSizeToFit` lookalike for wrapping text; a primitive that splits words
uses FitText (or the measurer) inside the kit.
