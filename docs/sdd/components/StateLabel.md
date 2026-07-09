# SDD — `StateLabel`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/StateLabel.tsx` · `packages/ui-native/src/components/StateLabel.tsx` ·
> web CSS `packages/ui/src/styles/components/statelabel.css` (`.lk-statelabel*`).
> **Exports:** `StateLabel`, type `StateLabelProps`.
> **Status:** Shipped. **Parity:** 🟡 same API + geometry; the hairline rule is a gradient fade
> (`--border-2` → transparent) on web vs flat `colors.border2` at 60% opacity on native.
> **Stories:** `packages/ui/src/stories/StateLabel.stories.tsx` · `packages/ui-native/src/stories/StateLabel.stories.tsx`.

---

## 1. Overview

A **numbered section header**: a mono numeral chip + an uppercase mono label + a hairline rule filling the
remaining width — `01 ─ SIGN IN ──────`. Used to caption the auth screens' sections (sign in, create
account, verify email) with the design's "numbered steps" voice. Pure presentational atom — no state, no
interaction. Distinct from `SectionHeader` (eyebrow + display title) and `Stepper` (an interactive
multi-step progress rail).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `num` | `string` | _required_ | ✓ | ✓ | numeric/short alphanumeric badge, e.g. `"01"` — mono, accent-2 chip |
| `label` | `string` | _required_ | ✓ | ✓ | section name, e.g. `"Sign in"` — rendered mono uppercase, faint |
| `className` | `string` | — | ✓ | — | web only, merged onto the root `<div>` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, merged onto the root row `View` |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web) / `ViewProps` (native) | — | ✓ | ✓ | container attrs |

- **Web:** `forwardRef<HTMLDivElement>`; root `<div class="lk-statelabel">` containing three spans —
  `.lk-statelabel-num`, `.lk-statelabel-lbl`, and the decorative `.lk-statelabel-ln` rule (`aria-hidden`).
- **Native:** plain function component; row `View` → chip `View`+`Text`, label `Text`, rule `View`.
- Uppercasing is a **style** (`text-transform` / `textTransform: 'uppercase'`) — pass `label` in natural case.

## 3. Visual spec (tokens — never hardcode)

| Element | Web (`.lk-statelabel*`) | Native (`StyleSheet`) |
| --- | --- | --- |
| Row | flex, `align-items: center`, `gap: 12px`, `margin: 0 2px 14px` | row, `gap: 12`, `marginHorizontal: 2`, `marginBottom: 14` |
| Num chip type | `--font-mono` 11px, `line-height: 1`, `--accent-2` | `fonts.mono` 11/13, `colors.accent2` |
| Num chip box | `1px rgba(34,211,238,.3)` border, `rgba(34,211,238,.08)` bg, `--r-pill`, pad `2px 9px` | same rgba border/bg, `radii.pill`, pad `2/9` |
| Label | `--font-mono` 11px, `letter-spacing: .2em`, uppercase, `--text-faint` | `fonts.mono` 11/13, `letterSpacing: 2.2`, uppercase, `colors.textFaint` |
| Rule | `flex: 1`, 1px, `linear-gradient(90deg, var(--border-2), transparent)` | `flex: 1`, height 1, `colors.border2` at `opacity: 0.6` |

- The chip's border/bg are 30%/8% alpha ramps of **`--accent-2` cyan** (`34,211,238`) — literal rgba in both
  sources, identical values.
- The two label trackings are the same value at 11px (`.2em` ≡ `2.2px`).

## 4. States

Static, presentational only — no hover/focus/pressed/disabled. The single visual "state" is layout: the
rule flexes to fill whatever width remains after the chip + label.

## 5. Web ↔ native parity

**Verdict: 🟡 — same API, same geometry and type, one substrate delta on the rule.** Both platforms share
the 12px gap / `0 2px 14px` outer spacing, the identical cyan chip (border, bg, pill radius, 2/9 padding,
11px mono accent-2 numeral), and the identical faint uppercase label. Differences:

- **Rule:** web is a 90° gradient that fades `--border-2` → transparent across the width; native is a flat
  `colors.border2` line at 60% opacity (an `expo-linear-gradient` wasn't spent on a 1px hairline). Reads
  near-identically on device; documented drift, not a blocker.
- **Ref/rest:** web `forwardRef` + HTML attrs; native `ViewProps`. Substrate only.

## 6. Composition & usage

- **Composes from:** nothing (raw text + views).
- **Used by:** auth screen sections (`01 Sign in`, `02 Create account`, `03 Verify email`) per
  `AUTH_PARITY_SPEC.md`; any numbered form-section caption.

```tsx
// web — auth section captions
<StateLabel num="01" label="Sign in" />
<StateLabel num="02" label="Create account" />

// native — identical props
<StateLabel num="01" label="Sign in" />
```

## 7. Accessibility

- **Web:** the rule is `aria-hidden` (decorative); the chip + label are real text, announced together as
  "01 Sign in". No role is set — add `role="heading"`/`aria-level` via rest if the section structure should
  appear in heading navigation.
- **Native:** chip + label are `Text` (read in order); the rule `View` is empty and silent. The component
  sets no `accessibilityRole` — pass `accessibilityRole="header"` via rest when it captions a real section.
- **Contrast:** the label is `--text-faint` at 11px — it's a caption, not body copy; don't put essential
  standalone information only here. The accent-2 numeral on its 8% tint passes on the void surface.

## 8. Usage rules — Do / Don't

**Do**
- Zero-pad the numerals (`"01"`, `"02"`) — the design's two-digit mono voice.
- Keep `label` short (1–3 words); it's uppercase mono at `.2em` tracking and eats width fast.
- Give the row real width (it's `flex`) so the hairline has room to draw.

**Don't**
- ✗ Don't pass pre-uppercased or styled strings — uppercase is applied by the component.
- ✗ Don't use it as an interactive step indicator — that's `Stepper`; this never conveys progress state.
- ✗ Don't recolor the chip per-section — the cyan accent-2 ramp is the single sanctioned tint.
- ✗ Don't hardcode the chip rgba/tracking in app code to imitate it elsewhere — import the component.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-built `span + span + hr` (or `Text + View`) numbered caption re-derives this
  atom and will drift from the chip ramp and tracking — import `StateLabel`.
- **New need → both platforms.** A tone variant or trailing slot ships to web **and** native with the same
  prop name + tokens; if the native rule should gain the web's gradient fade, fix it in the kit, not per screen.
- **Tokens only.** Mono font, accent-2 numeral, `--text-faint` label, `--border-2` rule, pill radius — all
  tokens; the cyan rgba ramps are the component's own constants, not values to copy around.
- **Parity gate.** Before shipping an auth (or numbered-section) screen, confirm web phone-width ≡ native —
  same numerals, same labels, same chip/label/rule rendering.
