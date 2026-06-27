# SDD — `PasswordStrengthMeter` (+ `PasswordStrengthScore` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/PasswordStrengthMeter.tsx` · `packages/ui-native/src/components/PasswordStrengthMeter.tsx` ·
> web CSS `packages/ui/src/styles/components/pwstrength.css` (`.lk-pwstrength*`).
> **Exports:** `PasswordStrengthMeter`, type `PasswordStrengthMeterProps`, type `PasswordStrengthScore`.
> **Status:** Shipped. **Parity:** ✅ identical API, 4-segment model, colors & labels; substrate-only (CSS `color-mix` glow vs RN shadow, `role=meter` vs `progressbar`).
> **Stories:** `packages/ui/src/stories/PasswordStrengthMeter.stories.tsx` · `packages/ui-native/src/stories/PasswordStrengthMeter.stories.tsx`.

---

## 1. Overview

`PasswordStrengthMeter` is a **4-segment strength bar** that fills left→right up to `score`, colored by strength
(red → amber → cyan → mint), with a small score-colored label and an optional hint line. It is the canonical
strength indicator under `PasswordInput` on sign-up / change-password flows. The score is computed by the
consumer (e.g. zxcvbn) and passed in as a `0–4` value — the component is purely presentational.

`PasswordStrengthScore` is the exported `0 | 1 | 2 | 3 | 4` union used for the `score` prop.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `score` | `PasswordStrengthScore` (`0\|1\|2\|3\|4`) | — (required) | ✓ | ✓ | `0` = empty/weakest … `4` = strongest |
| `label` | `string` | derived (`LABELS[score]`) | ✓ | ✓ | override the derived label |
| `hint` | `string` | — | ✓ | ✓ | optional helper line under the meter |
| `className` / `style` | — | — | `className` + `style` | `style` | web class + style · native `ViewStyle` |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>,'children'>` (web) / `Omit<ViewProps,'children'\|'style'>` (native) | — | ✓ | ✓ | spread onto the root |

- **Shared model:** `SEGMENTS = 4`. `LABELS = ['Weak','Weak','Fair','Good','Strong']` (score 0 and 1 both read
  `'Weak'`). `score` is clamped: `s = max(0, min(4, score))`.
- **Web:** sets a per-instance `--pw-color` CSS variable from the score, then drives segments + label color off it.
- **Native:** computes the same color in JS and applies it inline to filled segments (with a shadow) and the label.

## 3. Visual spec (tokens — never hardcode)

| Score | Color token | Value |
| --- | --- | --- |
| 0 | `--bad` / `colors.bad` | `#FF4D6D` (falls back to red) |
| 1 | `--bad` / `colors.bad` | `#FF4D6D` |
| 2 | `--warn` / `colors.warn` | `#FFB020` |
| 3 | `--cyan` / `colors.cyan` | `#22D3EE` |
| 4 | `--ok` / `colors.ok` | `#34F5C5` |

| Aspect | Web (`.lk-pwstrength*`) | Native (`styles`) |
| --- | --- | --- |
| Layout | column, `gap: 8px`, `width: 100%` | `gap: 8`, `width: '100%'` |
| Segments | grid `repeat(4, 1fr)`, `gap: 6px`, height `5px`, radius `--r-pill` | row, `gap: 6`, `flex: 1`, height `5`, radius `radii.pill` |
| Empty segment | `background: --border` | `backgroundColor: colors.border` |
| Filled segment | `background: --pw-color` + `box-shadow 0 0 8px color-mix(... 55%)` | `backgroundColor: color` + `shadowColor`, `shadowOpacity 0.55`, `shadowRadius 5` |
| Label | `--font-mono`, weight 600, color `--pw-color`, 11px | `fonts.mono`, weight 600, `color`, 11px |
| Hint | `--font-mono`, color `--text-faint`, 11px | `fonts.mono`, `colors.textFaint`, 11px |
| Meta row | flex, `space-between`, baseline, `gap 12px` | row, `space-between`, baseline, `gap 12` |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Score 0–4 | first `score` segments get `.is-on`; rest `--border` | first `score` segments filled; rest `colors.border` |
| Filled glow | `box-shadow` `color-mix` 55% | `shadow*` at opacity 0.55, radius 5 |
| Label | tinted `--pw-color` | tinted score `color` |
| Hint | shown when `hint != null` | shown when `hint != null` |

No focus/hover/disabled — the meter is non-interactive (presentational only).

## 5. Web ↔ native parity

**Verdict: ✅ identical.** Same prop API, the same `SEGMENTS = 4` model, the same `LABELS` table, the same
`score → color` mapping, the same 5px pill segments, the same score-tinted label, and the same optional hint.
Substrate-only differences, none affecting the contract or the look:

- **Glow** — web uses `box-shadow` with `color-mix(in srgb, var(--pw-color) 55%, transparent)`; native uses
  `shadowColor`/`shadowOpacity 0.55`/`shadowRadius 5`. Same intent.
- **Color delivery** — web threads `--pw-color` as a CSS var; native computes the color in JS. Same value.
- **A11y role** — web is `role="meter"` (HTML has it); native uses `accessibilityRole="progressbar"` (RN has no
  `meter` role) with `accessibilityValue`. Semantically equivalent.

There is no capability gap — fully equivalent on both platforms.

## 6. Composition & usage

- **Pairs with `PasswordInput`** directly below the field on sign-up / change-password.
- Consumer computes `score` (e.g. zxcvbn `0–4`) and passes it in; the meter renders, nothing more.
- Use `hint` for a short requirement reminder (e.g. `"Use 12+ chars"`); override `label` only for localized copy.

```tsx
// web
<PasswordInput value={pw} onChange={(e) => setPw(e.target.value)} />
<PasswordStrengthMeter score={zxcvbn(pw).score as PasswordStrengthScore} hint="Use 12+ characters" />

// native
<PasswordInput value={pw} onChangeText={setPw} />
<PasswordStrengthMeter score={score} hint="Use 12+ characters" />
```

## 7. Accessibility

- **Web:** `role="meter"` with `aria-valuemin=0`, `aria-valuemax=4`, `aria-valuenow={score}`, and an
  `aria-label` of `Password strength: <label>` — AT reads both the value and the human label.
- **Native:** `accessibilityRole="progressbar"`, `accessibilityValue={{ min: 0, max: 4, now: score }}`, and
  `accessibilityLabel` of `Password strength: <label>`.
- **Not color-only:** the strength is conveyed by the **label text** (Weak/Fair/Good/Strong) as well as color —
  don't remove the label, or strength becomes color-only (fails for color-blind users).

## 8. Usage rules — Do / Don't

**Do**
- Compute `score` once (zxcvbn or your estimator) and pass the `0–4` value.
- Keep it directly under the password field it describes.
- Keep the text label visible (color alone isn't accessible).
- Override `label` only for i18n; keep semantics (weak→strong) intact.

**Don't**
- ✗ Don't pass a score outside `0–4` — it's clamped, but feed the typed union.
- ✗ Don't re-map the colors — the red→amber→cyan→mint ramp is the kit's strength scale.
- ✗ Don't hardcode the segment/label colors — they're `--bad/--warn/--cyan/--ok` tokens.
- ✗ Don't hand-roll a strength bar — import `PasswordStrengthMeter`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom segmented strength bar re-creating the 4-segment ramp + glow is a parity violation
  — import `PasswordStrengthMeter` so web and native share one model.
- **New need → both platforms.** A different segment count or color scale must change `SEGMENTS`/`SCORE_COLOR` on
  web **and** native together — never a one-off divergence.
- **Tokens only.** The score colors are `--bad/--warn/--cyan/--ok` (`colors.bad/warn/cyan/ok`); hardcoding the
  hexes will drift on the next Aurora-Flux rename.
- **Parity gate.** Confirm the web phone-width meter and the native meter show the same fill, color, and label for the same score before shipping.
