# SDD — `FitText`

> **Package:** `@lockin90/ui-native` (native) — native-only text primitive; the web twin is the `useWordFit` hook in `@lockin90/ui` (internal), used by MetricTile and ListRow.
> **Source:** `packages/ui-native/src/components/FitText.tsx` · shared measurer `packages/ui-native/src/internal/wordFit.tsx` · web `packages/ui/src/hooks/useWordFit.ts`.
> **Exports:** `FitText`, type `FitTextProps`, `useWordFit` (the hook, for a title laid out as a row of pieces), `breakableAddress`.
> **Status:** Shipped (1.35). **Parity:** 🟡 same rule, platform-shaped: native measures words with a hidden measurer; web shrinks an element whose word overflows (`scrollWidth > clientWidth`). Web has no exported component because a web element carries its own `className`; the hook is applied inside the web primitives.
> **Stories:** none (a `Text` that looks like the `Text` it replaces).

---

## 1. Overview

A React Native `Text` whose words never break in the middle (CONVENTIONS "Accessibility": nothing cut off
or broken mid-word at any text size). Lines still wrap between words; when the text's widest word is wider
than the width it is laid out in (a long word at an accessibility text size: "Налаштування") the whole text
shrinks until that word fits — **never below the default text size or 11pt** (`fitFloor`: only the OS's
enlargement is taken back, so at the default text size nothing shrinks). A word still too wide at that
floor ("ФИЗИОЛОГИЧЕСКИЙ" in a third of a phone's width) is the layout's to fix — `onMinWidth` says how wide
the text must be, so a grid can choose a column fewer — and breaks only as the last resort. Text that fits
is drawn exactly as a plain `Text`. Text scaling is never turned off.

The kit uses it for MetricTile (label, value), ListRow (a wrapping title / subtitle), Alert (title, text
body), FormField (label), Eyebrow, PasswordStrengthMeter (rules, hint) and Button (its label; the button
is named by `accessibilityLabel`, so the measurer never joins its name). Apps use it for their own titles (a screen's or step's header).

## 2. API contract

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `onMinWidth` | `(width: number) => void` | — | called with the narrowest width (pt) in which every word fits whole at the floor (its widest word × `fitFloor` + 1), whenever it is known or changes (MetricTile sums it into the tile's) |
| `measureText` | `string` | — | rich children's text (an i18n `Trans`'s translation as it is: its tagged parts are measured at bold; the parts inherit the scaled size) |
| `children` | `ReactNode` | — | strings and numbers are measured, nested ones too (a styled `Text`, a link) |
| `style` | `StyleProp<TextStyle>` | — | `fontSize`, `lineHeight` and `letterSpacing` are scaled together |
| `onLayout` | `TextProps['onLayout']` | — | still called |
| _rest_ | `TextProps` | — | spread onto the `Text` |

## 3. How it measures (`internal/wordFit.tsx`)

- `breakableWords(text)`: the pieces a line can't split, where iOS (CoreFoundation's line breaker,
  checked 2026-11-11) and Android (ICU) break — at spaces (never beside a word joiner or a no-break space,
  which keep their words together), after a hyphen or an en dash unless a digit follows ("GMT-3" whole),
  after a slash unless it sits between digits ("Europe/" "Kyiv", "12/31" whole), around an em dash and
  every CJK character (Han, kana, Hangul and full-width forms; closing punctuation "。、」" stays with the
  character before it, opening "「（" with the one after), at a zero-width space, and in an email or web
  address also after "@" and ".".
- `taggedWords(text)`: the tags are taken out first, so a piece running across one with no space
  ("<email>a@b.c</email>." or "<b>Re-authentication</b>,") is one piece; a piece with a styled letter (`<tag>…</tag>`: an i18n `Trans`
  translation's tags, or a nested element in the children, which `textOf` tags `<n>…</n>`; a bare
  unstyled `Text` wrapping a sentence is transparent) is measured at bold (700), the widest weight it may
  have (AlertStrong is 600: "Re-authentication" measured regular split by one letter at AX3).
- **Addresses:** the pieces of an email or web address are left out of the measure: an address never
  shrinks the sentence around it (Verify's subtitle was drawn at 46 % of the user's size at AX5). iOS and
  Android never break an address by themselves, so one wider than its line breaks at any letter; the app
  passes it through `breakableAddress` (a zero-width space after each "@", "." and "/") so it breaks there.
- `fitFloor(fontSize, fontScale)`: `min(1, max(1 / max(1, fontScale), 11 / (fontSize × fontScale)))`,
  rounded up to 2 decimals — the default text size, and never under 11pt.
- `WordMeasurer`: one unconstrained line per word in the text's own style, absolutely placed, 0 tall,
  transparent, hidden from accessibility (also used by SegmentedTabs and Select).
- `useWordFit(text, style)`: once measured the probes unmount (nothing extra stays in the tree a screen
  reader walks; a new text, text size or room brings them back); the words are measured at the unscaled
  style. Scale = `wordFitScale(widest, room, fitFloor(…))` (shared with SegmentedTabs' `stackedScales`)
  when the widest word is more than 1pt wider than the room, else 1. Decided again for a new text or
  text size.
- **The room** is the text's own `onLayout` width read while it is drawn at full size (a text as wide as
  its content, shrunk, is narrower than its room: reading that would shrink it again on every pass).
  Shrunk, it is still followed: a width narrower than the shrunk widest word means the text was squeezed
  (that width is the new room), and a 0-tall probe spanning the box the text sits in (`lk-fit-box`,
  hidden, it stays mounted) growing means the room may have grown — the text is drawn at full size once
  more and re-read. Refs (text, box, probes) are also measured in a layout effect (iOS Fabric gives no
  `onLayout` to a tree mounted hidden).
- **It needs a box that can shrink:** in a row (an icon beside it, a button's label), give the text
  `flexShrink: 1, minWidth: 0` — a text that can't shrink is as wide as its content and overflows, so
  there is no room to fit to. The kit does this for MetricTile's label and value and Button's label.

**`useWordFit(text, style)`** (exported) gives `{ scale, scaled, textRef, onRoom, measurer, minWidth }` for a
text the app lays out itself (a row of words with a gradient part): pass the text as the row lays it out
(each unit one piece: Create account's title joins "90" and "-дневный" with a non-breaking hyphen), put
`measurer` and `textRef` in the box whose width is the room, call `onRoom` from its `onLayout`, and add
`scaled` to every piece's style.

## 4. States

Fits → as `Text`. A word too wide at a larger text size → the whole text smaller (2-decimal scale), down to
the default text size / 11pt. Still too wide (or at the default text size) → at that size and the word
breaks, the last resort (never cut); `onMinWidth` lets the layout prevent it.

## 5. Web ↔ native parity

Web `useWordFit(text)` returns a ref for a block or flex-item element (one that can shrink: `min-width: 0`):
with `overflow-wrap: normal` a too-wide word overflows, so the element steps its `font-size` down (one
measured jump, then 2 % steps) to `fitFloorPercent` — never below the default text size (an enlarged root
font size, the browser's text size setting, is taken back: `16 / root`; at the default 16px nothing
shrinks) or 11px; past that the stylesheet's `overflow-wrap: anywhere` is the last resort. The kit's
sizes are px, which don't grow with the root: at an enlarged root this takes back an enlargement the text
didn't get, still never under 11px (moving the kit's text to rem is its own change). Re-runs on text
change, webfonts and width changes (ResizeObserver).

## 6. Composition & usage

```tsx
<FitText accessibilityRole="header" style={styles.title}>{t('onboarding.profile.title')}</FitText>
```

Alert passes its own `measureText` prop through for a rich body.

## 7. Accessibility

- **Kit rule:** CONVENTIONS "Accessibility" (2026-11-10) applies: contrast 4.5:1 text / 3:1 UI, 44pt native / 24px web targets, names from props, errors and changes announced, reduced motion, text scaling never disabled.
- The measurer is `accessibilityElementsHidden` / `no-hide-descendants`: screen readers read the text once.
- Text scales with the OS setting (no `allowFontScaling={false}`, no `maxFontSizeMultiplier`); only a word
  that would split shrinks, only as far as it must, and never below the default text size or 11pt.

## 8. Usage rules — Do / Don't

- **Do** use it for a title or label that can hold a long word (any translated text in a narrow box).
- **Do** lay the box out first (one column, the header above its icon at large text) — FitText is for the
  word that still doesn't fit.
- **Don't** use `numberOfLines` + `adjustsFontSizeToFit` for multi-word text: it shrinks the whole line, not
  the word.

## 9. Anti-patterns & lookalike ban

No app-side measurer or `adjustsFontSizeToFit` lookalike for wrapping text; a primitive that splits words
uses FitText (or the measurer) inside the kit.
