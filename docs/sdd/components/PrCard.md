# SDD — `PrCard`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/PrCard.tsx` · `packages/ui-native/src/components/PrCard.tsx` ·
> web CSS `packages/ui/src/styles/components/prcard.css` (`.lk-prcard*`).
> **Exports:** `PrCard`, type `PrCardState`, type `PrCardProps`.
> **Status:** Shipped. **Parity:** ✅ identical API & visuals — substrate-only differences (web `box-shadow` red glow ↔ native legacy `shadow*`; `<button>`/hover ↔ `Pressable`/pressed + haptics).
> **Stories:** `packages/ui/src/stories/PrCard.stories.tsx` · `packages/ui-native/src/stories/PrCard.stories.tsx`.

---

## 1. Overview

The **personal-record card**: lift name + mono record kind (`ESTIMATED 1RM`), the record value big in the display font, and a dim mono detail line. State drives the treatment: **`new` / `atPeak`** get the red-PR look — red-tinted border + soft red glow + a red `PrBadge` tag (`NEW` / `AT PEAK`); **`offPeak`** keeps the plain glass surface with a quiet amber `OFF PEAK` text tag; no `state` → plain card, no tag.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `name` | `string` | — (required) | ✓ | ✓ | lift name, truncates |
| `kind` | `string` | — (required) | ✓ | ✓ | mono overline, uppercased |
| `value` | `string` | — (required) | ✓ | ✓ | pre-formatted (`'130 kg'`) |
| `detail` | `string` | — | ✓ | ✓ | dim mono (`'today · +2kg'`) |
| `state` | `PrCardState` (`'new'·'atPeak'·'offPeak'`) | — | ✓ | ✓ | omit → plain card |
| `onPress` | `() => void` | — | ✓ | ✓ | web `<button>`; native `Pressable` + haptic |
| `className` / _rest_ | — | — | ✓ | — | web |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native |

## 3. Visual spec (tokens — never hardcode, except the canonical PR red)

| Element | Web | Native |
| --- | --- | --- |
| Card | `--glass` / 1px `--border` / `--r` (16) / padding `13px 15px`, column gap 3 | `colors.glass` / `colors.border` / `radii.md` |
| Hot (`new`/`atPeak`) | border `rgba(255,71,87,.38)`, glow `0 0 18px rgba(255,71,87,.16)` | same border literal; `shadowColor PR_RED / opacity .16 / radius 12` |
| Name | `--font-display` 700 14px, ellipsis | `fonts.display` 700 14, `numberOfLines={1}` |
| State tag | `PrBadge size="sm"` (`NEW` / `AT PEAK`) · offPeak: mono 9px 600 `--zone-mid` text | same (`PrBadge` twin / `colors.zoneMid` text) |
| Kind | `--font-mono` 9.5px uppercase `.12em` `--text-faint` | same (pre-uppercased) |
| Value | `--font-display` 700 22px `-.02em` | same |
| Detail | `--font-mono` 10.5px `--text-dim` | same |

The hot treatment uses **PR red `#FF4757`** (see `PrBadge.md`) — the canonical off-spectrum literal, matched on both sides.

## 4. States

| State | Treatment | Tag |
| --- | --- | --- |
| `new` | red border + glow | red `NEW` badge |
| `atPeak` | red border + glow | red `AT PEAK` badge |
| `offPeak` | plain glass | amber `OFF PEAK` **text** (not a badge) |
| _(none)_ | plain glass | no tag |
| Tappable | web hover `--glass-2` (+ stronger red border when hot); native pressed `glass2` | — |

## 5. Web ↔ native parity

**Verdict: ✅ identical.** Same content stack, type scale, state → treatment mapping, and `PrBadge` reuse. Substrate-only: box-shadow ↔ legacy `shadow*` glow (small-glow rule), button/hover ↔ Pressable/pressed + `hapticSelection()`, CSS uppercase ↔ `toUpperCase()`.

## 6. Composition & usage

- **Used in:** the training hub's PR grid (2-up cards), lift detail headers.
- **Composes from:** `PrBadge` (state tag).

```tsx
// web
<PrCard name="Back Squat" kind="Estimated 1RM" value="130 kg" detail="today · +2kg" state="new" onPress={open} />

// native
<PrCard name="Bench Press" kind="Estimated 1RM" value="95 kg" detail="peak 102 kg · 5w ago" state="offPeak" />
```

## 7. Accessibility

- **Web:** tappable card is a `<button>`; the name/kind/value/detail are real text read in order; the state tag is text (`NEW`, `AT PEAK`, `OFF PEAK`).
- **Native:** `accessibilityRole="button"` when pressable.
- State is conveyed by the **tag text**, never color alone.

## 8. Usage rules — Do / Don't

**Do**
- Pre-format `value`/`detail` with units + relative time in the app.
- Use `offPeak` for stale records — it's deliberately quiet next to hot cards.

**Don't**
- ✗ Don't fake the hot treatment with a recolored `Card` — the red border/glow + badge is this primitive's contract.
- ✗ Don't render an amber `PrBadge` for offPeak — offPeak is text-only by design.
- ✗ Don't add new states per call site — extend `PrCardState` on both platforms.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A record card with a red NEW/AT-PEAK treatment IS `PrCard` — import it.
- **New need → both platforms** with the same prop names + the matched PR-red literals.
- **Tokens only** (PR red + its rgba derivatives are the canonical matched exceptions).
- **Parity gate.** Web phone-width grid ≡ native grid (treatment, tags, type scale) before shipping.
