# SDD — `EffectAttributionLine`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform composite (AI / insights).
> **Source:** `packages/ui/src/components/EffectAttributionLine.tsx` · `packages/ui-native/src/components/EffectAttributionLine.tsx` ·
> web CSS `packages/ui/src/styles/components/effectline.css` (`.lk-effectline*`).
> **Exports:** `EffectAttributionLine`, type `EffectAttributionLineProps`, type `EffectTone`.
> **Status:** Shipped. **Parity:** ✅ identical API & visuals — web tints via `currentColor`/CSS class, native resolves the same token per tone; substrate is the only difference.
> **Stories:** `packages/ui/src/stories/EffectAttributionLine.stories.tsx` · `packages/ui-native/src/stories/EffectAttributionLine.stories.tsx`.

---

## 1. Overview

A single **"why this score" attribution row**: an optional leading icon, a **large signed contribution** (display font, tinted by tone) with an optional unit, and a mono uppercase label naming the driver — e.g. `+12 pts · DEEP SLEEP 1H20M`. Stack several inside an energy-explain list to break a score into its drivers. The sign is rendered explicitly (`+` / `−` / `±` for zero) and the magnitude shown as its absolute value, so the `+`/`−` reads as a deliberate glyph, not a typed string.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `number` | — (required) | ✓ | ✓ | signed contribution; rendered as sign glyph + `Math.abs(value)` |
| `label` | `ReactNode` | — (required) | ✓ | ✓ | the driver, e.g. `'Deep sleep 1h20m'` |
| `unit` | `string` | — | ✓ | ✓ | appended after the magnitude, e.g. `'pts'` (faint, smaller) |
| `tone` | `EffectTone` (`'auto' \| 'positive' \| 'negative' \| 'neutral'`) | `'auto'` | ✓ | ✓ | `auto` derives from the numeric sign |
| `icon` | `IconName` | — | ✓ | ✓ | optional leading glyph (tinted with the value) |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web, minus `children`) | — | ✓ | — | spread to the root `<div>` |

- **`resolveTone(tone, value)`** (identical both sides): if `tone !== 'auto'` use it; else `value > 0 → positive`, `< 0 → negative`, `0 → neutral`.
- **`signFor(value)`**: `> 0 → '+'`, `< 0 → '−'` (unicode minus), `0 → '±'`. Magnitude is `String(Math.abs(value))`.

## 3. Visual spec (tokens — never hardcode)

| Part | Token / value |
| --- | --- |
| Row | flex, `align-items: baseline`, `gap 10px`; icon `align-self: center` |
| Value | web `.lk-display .lk-tnum` (`--font-display`, weight 700, tnum) at `26px`/line-height 1; native `fonts.display`, weight 700, `26px`, letter-spacing `-0.52`, line-height 28 |
| Sign | `margin-right 0.04em` (web); native shares the display font/weight |
| Unit | `13px`, weight 500, `--text-faint` / `colors.textFaint`, `margin-left 2px` (web) |
| Label | `--font-mono` / `fonts.mono`, `10px`, uppercase, letter-spacing `0.12em` (native `1.2`), `--text-dim` / `colors.textDim`, `white-space: nowrap` (web; native `flexShrink` absent — single line) |

- **Tone colors** (value **and** icon; label stays `--text-dim`): `positive` → `--zone-high` / `colors.zoneHigh` (mint), `negative` → `--zone-low` / `colors.zoneLow` (red), `neutral` → `--text-dim` / `colors.textDim`.
- Web colors the value+icon via the `.lk-effectline-pos/neg/neutral` parent class (icon inherits `currentColor`); native resolves the same token and passes `color` to both the value `Text` and the `Icon`.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Positive | `.lk-effectline-pos` → mint value+icon | `color = colors.zoneHigh` |
| Negative | `.lk-effectline-neg` → red value+icon | `color = colors.zoneLow` |
| Neutral / zero | `.lk-effectline-neutral` → dim value+icon, sign `±` | `color = colors.textDim`, `±` |
| No icon | value + label only | value + label only |
| No unit | magnitude only | magnitude only |

Non-interactive — no hover / pressed / focus / disabled.

## 5. Web ↔ native parity

**Verdict: ✅ identical.** Same props, the `resolveTone`/`signFor`/abs-magnitude logic, the baseline row, the display-font value + faint unit + mono label, and the three tone→token mappings. The only difference is substrate-mechanical and invisible:

- **Tinting mechanism:** web sets the tone via a parent class and lets the icon inherit `currentColor`; native has no `currentColor`, so it resolves the tone token once and passes the same `color` to both the value `Text` and the `Icon`. Same resulting color.
- **Tabular numerals:** web uses the shared `.lk-tnum` utility; native's display font carries the equivalent. Same alignment.

No capability gap; the row is byte-for-byte equivalent in meaning and appearance.

## 6. Composition & usage

- **Composes from:** `Icon` (optional leading glyph) + local spans/`Text`. No `Card` — it's a bare row meant to be stacked inside a container (e.g. an energy-explain panel or `Card`).
- **Composed into:** "why this score" / energy-breakdown lists; stack 3–6 rows, one per driver, optionally grouped under a heading.

```tsx
// web
<EffectAttributionLine value={12} unit="pts" icon="moon" label="Deep sleep 1h20m" />
<EffectAttributionLine value={-6} unit="pts" icon="bolt" label="Late caffeine" />
<EffectAttributionLine value={0} unit="pts" label="Hydration neutral" />

// native
<EffectAttributionLine value={12} unit="pts" icon="moon" label="Deep sleep 1h20m" />
<EffectAttributionLine value={-6} unit="pts" icon="bolt" label="Late caffeine" />
<EffectAttributionLine value={0} unit="pts" label="Hydration neutral" />
```

## 7. Accessibility

- **Web:** the sign is rendered as a real glyph inside the value, so the signed magnitude is read as text (e.g. "+12pts"). The icon is decorative (via `Icon`). Plain `<div>` — no role needed.
- **Native:** value/sign/unit/label are `Text`; the signed magnitude reads correctly. Icon is decorative.
- **Color independence:** the explicit `+`/`−`/`±` sign conveys valence without relying on the mint/red color — so positive vs negative is distinguishable color-blind.
- **Single line:** the mono label is `nowrap`; keep labels short so they don't truncate at phone width.

## 8. Usage rules — Do / Don't

**Do**
- Pass the **signed** `value`; let `auto` tone derive mint/red/dim from the sign.
- Use `unit` for the metric (`pts`, `min`) — it auto-renders faint + smaller.
- Stack rows for a full score breakdown; keep `label` terse (it's `10px` mono, nowrap).

**Don't**
- ✗ Don't pre-format the sign into `value` (it's a `number`) — the component renders the sign glyph.
- ✗ Don't override `tone` away from `auto` unless you deliberately want a color that contradicts the sign.
- ✗ Don't hand-roll a signed-driver row with a custom display number + mono label — use `EffectAttributionLine`.
- ✗ Don't hardcode the mint/red/dim tints or the display/mono fonts — they come from `@lockin90/tokens`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A "custom contribution row" re-creating the big signed number + faint unit + mono label is a parity violation — import `EffectAttributionLine`.
- **New need → both platforms.** A new `EffectTone` or a layout change must land on **both** web + native with the same token mapping and the same `resolveTone`/`signFor` logic — never a one-off.
- **Tokens only.** Mint/red/dim tints, display + mono fonts, and the faint unit color all source from tokens.
- **Parity gate.** Before shipping a score-breakdown screen, confirm web phone-width and native render the same sign glyph, magnitude, tint, unit, and label per row.
