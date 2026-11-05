# SDD — `PasswordStrengthMeter` (+ `PasswordStrengthScore` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/PasswordStrengthMeter.tsx` · `packages/ui-native/src/components/PasswordStrengthMeter.tsx` ·
> web CSS `packages/ui/src/styles/components/pwstrength.css` (`.lk-pwstrength*`).
> **Exports:** `PasswordStrengthMeter`, type `PasswordStrengthMeterProps`, type `PasswordStrengthScore`, type `PasswordRule`.
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
| `labelPrefix` | `string` | — | ✓ | ✓ | faint text before the label ("Strength:"), as the sign-in designs draw it |
| `accessibleLabel` | `string` | `` `Password strength: ${label}` `` | ✓ | ✓ | the meter's screen-reader name (web `aria-label`, native `accessibilityLabel`); pass a translated one |
| `rules` | `PasswordRule[]` | — | ✓ | ✓ | the checklist under the meter (below); omit for a bare meter |
| `metLabel` / `unmetLabel` | `string` | — (required with `rules`) | ✓ | ✓ | read right after each rule's label, as given: the app includes its own leading punctuation and space (`", done"`, `"，已满足"`); web visually hidden, native in the rule's `accessibilityLabel` |
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

## Update — 2026-11-02 (minor): rules, translatable labels, an empty state

The sign-in designs (`web/auth.html` states 02 and 05, `mobile/auth-onboarding.html`) draw a rule checklist
under the meter, and the mobile design's kit map asks for it here: "`.pw-meter + .pw-rules →
PasswordStrengthMeter` (kit renders bars, label & rule checklist in one)". One component, so screens don't line
up two by hand.

- **`rules`** (`PasswordRule = { id: string; label: string; met: boolean }`): a list under the meta row; each
  rule a round tick that fills mint when `met`, with the label beside it. Presentational: the app decides the
  rules and whether each is met (they advise; the backend decides what it accepts).
  - **Web** (`.lk-pwstrength-rules`): a `<ul>` (not rendered when `rules` is empty), grid
    `repeat(2, minmax(0, 1fr))`, `gap: 6px 16px`, `margin-top: 12px`; 2 columns at every width (see the
    2026-11-05 update). Rule: flex, `align-items: flex-start` (the tick on the first line), `gap: 8px`, 12px,
    line height 1.55, `--text-faint`; met `--text`;
    the label a `.lk-pwstrength-rule-label` span (`min-width: 0`, `overflow-wrap: break-word`), so a long
    translated label wraps at spaces instead of widening the card.
    Tick: 16px circle, `flex: 0 0 16px` (never squashed by a long label), `1.5px solid --border-2`; met: fill and
    border `--zone-high`. Check glyph 10px, stroke `--bg-0`, width 3, always rendered, `opacity` 0 → 1 when met.
    Motion: colour, background and border-colour `.25s var(--ease)`, glyph opacity `.2s var(--ease)`.
  - **Native** (the same as web, to match the web app at 402): rows of two, each rule `flex: 1`, `gap 16`
    between the columns, `rowGap 6`, `marginTop 4` (12 under the meta row with the root's 8); an odd last
    rule beside an empty `flex: 1` cell keeps its column's width. Rule: `alignItems: 'flex-start'`, `gap 8`;
    label 12 on a 12 × 1.55 line, `colors.textFaint`, met `colors.text`, `flexShrink 1` so it wraps. Tick:
    16, `borderWidth 1.5`, `colors.border2`, met `colors.zoneHigh`, `marginTop` `(12 × 1.55 × fontScale −
    16) / 2` (on the first line at any system text size). Glyph 10, `react-native-svg`. No animation.
  - **A11y:** web: each `<li>` reads its label, then the visually hidden `metLabel` / `unmetLabel` as given (no
    separator added: the app's string carries its own, e.g. `", done"`); the tick is
    `aria-hidden`; not `aria-live` (every keystroke would be announced; the meter's label is the summary).
    Native: each rule is one `accessible` element, `accessibilityLabel={`${label}${met ? metLabel :
    unmetLabel}`}` (no checkbox role: it isn't a control). The two labels are required whenever `rules` is
    passed (the type says so), so no screen reader ever hears a kit default.
- **`accessibleLabel`**: the meter's own name was the built-in English `Password strength: <label>`; an app
  passes a translated one. The default stays, for stories.
- **`labelPrefix`**: the designs show "Strength: —" with only the level tinted; the prefix is `--text-faint` /
  `colors.textFaint`, the level keeps the score colour.
- **Empty state:** at `score` 0 the label is `--text-faint` / `colors.textFaint` (not red): nothing typed yet is
  not "weak". Apps pass `label="—"` for it, as the designs draw, and then an `accessibleLabel` too (the default
  would read "Password strength: —").
- **Where the role sits:** the root is a plain container (it takes `className`, `style` and the rest
  props); the `meter` (web) / `progressbar` (native) role and its value props move to the segment row, with
  the label row and the rules beside it, not inside: a meter's children are presentational under ARIA, and an
  accessible native parent would swallow them. The hint describes the meter (web `aria-describedby`, native
  `accessibilityHint`). So an `aria-*` / `accessibility*` prop passed as a rest prop lands on the
  container; the meter's name is `accessibleLabel`. The web root also applies `style` now (it was dropped).
- **Parity:** ✅ still identical; every new prop on both platforms, sizes per each platform's design. Native: in its own PR.


## Update — 2026-11-02 (native parity with the web's rules)
- Native takes the same new props as web (#45): `rules` (one column, as the web at phone width then; 2 columns
  since the 2026-11-05 update) with the
  required `metLabel` / `unmetLabel` (each rule is one accessible element named `<label><met|unmet>`),
  `labelPrefix`, `accessibleLabel`, and the faint label at score 0. `PasswordRule` is exported. The mobile
  Set a new password and Create account screens use it (lockin90-v2 1.19a).
- Rest props now go on the root (the container), as on web; the meter is the inner segment row. Name the
  meter with `accessibleLabel`, not `accessibilityLabel` through rest.

## Update — 2026-11-05 (2 columns at every width)
- **Web:** the rules stay in 2 columns at phone width too (the `≤ 540px` one-column rule is gone). A label too
  long for its half wraps onto a second line inside its column, at spaces (`.lk-pwstrength-rule-label`,
  `overflow-wrap: break-word`: inside a word only when one word alone is too wide); the tick stays on the first
  line (`align-items: flex-start`, `margin-top: (1.55em − 16px) / 2`); a row is as tall as its taller rule. Owner (lockin90-v2, 2026-11-05): "the criteria
  has to be in 2 columns", wrapping allowed.
- **Native:** the same: two equal columns (rows of two, `gap 16`; `rowGap 6`, as web's `gap: 6px 16px`; an odd
  last rule beside an empty cell keeps its column's width), the tick on the first line (`alignItems:
  'flex-start'`, `marginTop: (12 × 1.55 − 16) / 2`), each label wrapping in its column. Apps bump both kits
  together, so web and mobile never differ.
