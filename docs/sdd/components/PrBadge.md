# SDD — `PrBadge`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/PrBadge.tsx` · `packages/ui-native/src/components/PrBadge.tsx` ·
> web CSS `packages/ui/src/styles/components/prbadge.css` (`.lk-prbadge*`).
> **Exports:** `PrBadge`, type `PrBadgeSize`, type `PrBadgeProps`. Native additionally exports the `PR_RED` constant from the file (not the barrel) for sibling training components.
> **Status:** Shipped. **Parity:** ✅ identical API & visuals — substrate-only differences (web CSS `text-transform: uppercase` + `box-shadow` glow ↔ native `toUpperCase()` + legacy `shadow*` dot-glow).
> **Stories:** `packages/ui/src/stories/PrBadge.stories.tsx` · `packages/ui-native/src/stories/PrBadge.stories.tsx`.

---

## 1. Overview

The **solid RED personal-record flag** — a tight 4px-radius tab with white bold mono uppercase text and a soft red glow. It is the one deliberately **off-spectrum** signal in the training design: PR red `#FF4757` is not an Aurora spectrum/zone token because a PR must scream against everything else on screen.

Used by `SetTable` (stamped on a PR'd done set) and `PrCard` (the `NEW` / `AT PEAK` state tag), and exported as its own atom for training screens.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `label` | `string` | `'PR'` | ✓ | ✓ | badge text — also `'NEW'`, `'AT PEAK'`, … |
| `size` | `PrBadgeSize` (`'sm' \| 'md'`) | `'md'` | ✓ | ✓ | `sm` for dense set rows |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLSpanElement>` | — | ✓ | — | web spreads to the `<span>` |

- **Web:** `forwardRef<HTMLSpanElement>`; renders a `<span>`.
- **Native:** plain function component; renders `<View>` + `<Text>`; label is `toUpperCase()`d (web uppercases via CSS).

## 3. Visual spec (tokens — never hardcode, except the canonical PR red)

| Element | Web (`md`) | Native (`md`) |
| --- | --- | --- |
| Tab | `background:#ff4757`, `border-radius:4px`, padding `3px 7px`, `box-shadow: 0 0 10px rgba(255,71,87,.5)` | `PR_RED` fill, radius 4, padding `3/7`, `shadowColor PR_RED / opacity .5 / radius 5` |
| Text | `#fff`, `--font-mono` 700 10px, `letter-spacing .08em`, uppercase, `line-height 1` | `#FFFFFF`, `fonts.mono` 700 10, `letterSpacing 0.8`, uppercased string |
| `sm` | font 8.5px, padding `2px 5px`, glow `0 0 8px rgba(255,71,87,.45)` | font 8.5, padding `2/5` |

**PR red `#FF4757` is a matched literal on both sides** (like DeltaPill's rgba tints) — it is intentionally NOT `--bad`/`--zone-low` (`#FF4D6D`) or `--magenta` (`#FF3D81`). Don't "fix" it to a token.

## 4. States

Static, read-only — no hover/focus/disabled. The only variation is `label` × `size`.

## 5. Web ↔ native parity

**Verdict: ✅ identical.** Same props, same 4px tab, same PR red + white mono text. Substrate-only:
- **Uppercase:** CSS `text-transform` ↔ `String.toUpperCase()`.
- **Glow:** CSS `box-shadow` ↔ legacy `shadow*` props (the small-dot-glow rule from CONVENTIONS).
- **forwardRef / rest ↔ style:** universal substrate.

## 6. Composition & usage

- **Used in:** `SetTable` (`isPr && done` → `sm` badge right of the value), `PrCard` (`new`/`atPeak` tag), PR callouts on training screens.
- **Composes from:** nothing — a leaf atom.

```tsx
// web
<PrBadge />                     // 'PR'
<PrBadge label="AT PEAK" />

// native
<PrBadge size="sm" />
```

## 7. Accessibility

- The label text carries the meaning on both platforms (real text, not an icon).
- Contrast: white on `#FF4757` ≈ 4:1 at bold 10px mono — acceptable for a decorative-plus-text flag; don't shrink below `sm`.
- Non-interactive; never give it a press handler — wrap the parent card/row instead.

## 8. Usage rules — Do / Don't

**Do**
- Use `sm` inside `SetTable` rows; `md` on cards and callouts.
- Keep labels to 1–2 short words (`PR`, `NEW`, `AT PEAK`).

**Don't**
- ✗ Don't re-tint it — the red IS the semantics. An amber "off peak" tag is plain text (see `PrCard`), not a recolored `PrBadge`.
- ✗ Don't use it for generic emphasis — it means "personal record", nothing else.
- ✗ Don't swap the literal for `--bad`/`--magenta`; the PR red is canonical.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled red chip for PRs is a parity violation — import `PrBadge`.
- **New need → both platforms.** A new size or tone ships to web **and** native with the same prop name.
- **Parity gate.** Web phone-width badge ≡ native badge (same label, size, red, radius) before shipping.
