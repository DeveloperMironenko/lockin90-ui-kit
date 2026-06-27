# SDD — `CreditCardVisual` (+ `CardGradient`)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/CreditCardVisual.tsx` · `packages/ui-native/src/components/CreditCardVisual.tsx` ·
> web CSS `packages/ui/src/styles/components/creditcard.css` (`.lk-cc*`).
> **Exports:** `CreditCardVisual`, type `CreditCardVisualProps`, type `CardGradient`.
> **Status:** Shipped. **Parity:** 🟡 same API/visuals; web uses a CSS gradient + blurred radial sheen + metallic-gradient chip, native an `expo-linear-gradient` + solid sheen + flat chip.
> **Stories:** `packages/ui/src/stories/CreditCardVisual.stories.tsx` · native equivalent.

---

## 1. Overview

A **credit-card-aspect (≈1.586:1) gradient panel** — the saved-payment-method "card art" in the billing UI. It renders, over a chosen gradient: a metallic **chip** glyph + a plain-text **brand** label (top row), the **masked number** row (`•••• •••• •••• {last4}`, mono + letter-spaced), and a bottom row with the **cardholder** (mono, uppercased) + **expiry**. A subtle sheen sits over the gradient.

It is **display-only** (no inputs, not a real card form) — mirroring the `.creditcard` art in the billing mockup. Reach for it to visualize a card on file in account/billing screens. The `gradient` prop picks one of five spectrum card-arts.

Secondary export: `CardGradient` (`'cta' | 'flux' | 'violet' | 'mint' | 'warm'`), mirroring the `@lockin90/tokens` gradient tokens.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `last4` | `string` | — (required) | ✓ | ✓ | rendered as `•••• •••• •••• {last4}` |
| `holder` | `string` | — | ✓ | ✓ | uppercased for display; empty string when omitted |
| `expiry` | `string` (`'MM/YY'`) | — | ✓ | ✓ | when omitted the Expires field is dropped |
| `brand` | `string` (e.g. `'VISA'`) | — | ✓ | ✓ | **plain text**, not a logo; top-right |
| `gradient` | `CardGradient` | `'cta'` | ✓ | ✓ | card-art fill |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>, 'children'>` | — | ✓ | — | web spreads onto the panel |

- **Web:** `forwardRef<HTMLDivElement>`; renders an `aria-label` of the card identity.
- **Native:** root is a `LinearGradient`; `angleToPoints(g.angle)` converts the token gradient's CSS angle into expo start/end unit points so the fill direction matches web.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native | Value |
| --- | --- | --- | --- |
| Aspect ratio | `aspect-ratio: 1.586 / 1` | `aspectRatio: 1.586` | card-shaped |
| Max width | `360px` | `maxWidth: 360` | full-width up to cap |
| Padding | `22px` | `22` | — |
| Radius | `--r-lg` | `radii.lg` | `22` |
| Border | `--border-2`, 1px | `colors.border2`, 1px | `rgba(255,255,255,.16)` |
| Shadow | `--elev-2` | `nativeShadows.elev2` | card elevation |
| Card-art fill | `--grad-{cta,flux,violet,mint,warm}` | `gradients[gradient]` via `LinearGradient` | spectrum gradients |
| Sheen | radial `rgba(255,255,255,.28)`→transparent, `blur(8px)`, 240×240 @ right −40/top −60 | solid `rgba(255,255,255,.16)` circle 240 @ right −40/top −60 | glossy highlight |
| Chip | 38×28, radius 6, `linear-gradient(135deg,#d8c47a,#a4863b)` + inset hairline | 38×28, radius 6, flat `#c4a85e` + border | metallic |
| Brand | `--font-display`, italic 700, 22px, `letter-spacing:-.02em`, `--text` | `fonts.display`, italic 700, 22, `letterSpacing:-.4`, `colors.text` | — |
| Number | `--font-mono`, 19px, `letter-spacing:.12em`, `--text` | `fonts.mono`, 19, `letterSpacing:2.3`, `colors.text` | masked |
| Label | `--font-mono`, 8.5px, `.1em` uppercase, `--text-faint` | `fonts.mono`, 8.5, `letterSpacing:.85`, `colors.textFaint` | "Card holder" / "Expires" |
| Value | `--font-mono`, 13px, `--text`, `margin-top:2px` | `fonts.mono`, 13, `colors.text`, `marginTop:2` | — |

- Layout is a `space-between` column: top row → number → bottom row. The Expires field aligns right (`.lk-cc-field-end` / `fieldEnd`).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-cc` + `.lk-cc-{gradient}` | `LinearGradient` card |
| No `expiry` | Expires field omitted | omitted |
| No `holder` | renders empty value | renders empty value |
| Hover / pressed / focus | none (static art) | none |

`CreditCardVisual` is non-interactive — no hover/press/disabled/loading. Wrap it in a `Button`/`Pressable` if a card needs to be selectable.

## 5. Web ↔ native parity

**Verdict: 🟡 same API + visual design, substrate-shaped fill/sheen/chip.** Identical props, aspect, padding, radius, border, shadow tokens, typography sizes, and masked-number/label/value layout. The gradient direction is matched deliberately (`angleToPoints` maps the token CSS angle to expo start/end).

Real differences (cosmetic, none block use):

- **Gradient engine:** web `background: var(--grad-*)` (CSS); native `expo-linear-gradient` with the token `stops` + computed start/end.
- **Sheen:** web is a *blurred radial* highlight (`radial-gradient` + `blur(8px)`, alpha .28); native is a *solid* translucent circle (alpha .16) — RN has no cheap radial-blur, so it approximates the same top-right gloss.
- **Chip:** web uses a metallic `linear-gradient(135deg,#d8c47a,#a4863b)`; native uses a flat `#c4a85e`. Same size/placement.

No capability gap blocks use — the card reads identically at a glance on both platforms.

## 6. Composition & usage

- **Composes from:** nothing (primitive); native reads `colors`/`radii`/`fonts`/`gradients`/`nativeShadows` from `@lockin90/tokens`.
- **Used by:** account → billing / payment-method screens (card on file), checkout summaries.

```tsx
// web
<CreditCardVisual last4="4242" brand="VISA" holder="Ada Lovelace" expiry="08/27" gradient="cta" />

// native
<CreditCardVisual last4="4242" brand="VISA" holder="Ada Lovelace" expiry="08/27" gradient="violet" />
```

## 7. Accessibility

- **Web:** the panel carries `aria-label` = *"Card ending {last4}"* (+ *", expires {expiry}"* when present), so screen readers announce the card without reading the masking dots. The sheen + chip are `aria-hidden`.
- **Native:** no explicit `accessibilityLabel` on the gradient root — the visible mono `Text` rows are the readable content; add a label if the card needs a single spoken summary like web.
- **Contrast:** masked number/brand use `--text` over bright gradient art; labels use the fainter `--text-faint`. This is decorative card-art, not a data table — keep critical info (e.g. "default card") in adjacent real text.

## 8. Usage rules — Do / Don't

**Do**
- Pass only the **last 4** digits — the component masks the rest; never feed a full PAN.
- Use `brand` as a short text label (`VISA`, `MASTERCARD`); it is not a logo slot.
- Pick `gradient` to differentiate cards or match a brand accent.
- Wrap in an interactive ancestor if the card must be selectable/removable.

**Don't**
- ✗ Don't render real/full card numbers, CVV, or PII beyond last-4 + masked expiry.
- ✗ Don't hardcode the aspect, radius, border, shadow, or gradient — they're tokens.
- ✗ Don't hand-roll card art — import `CreditCardVisual` so web ≡ native holds.
- ✗ Don't treat it as a form — it has no inputs.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke gradient card panel will drift from this one (sheen, chip, type scale) and break parity. There is one sanctioned card visual.
- **New card-art → add a `CardGradient`.** A new fill is added as a gradient token + a `lk-cc-{name}` class on web and the `gradients` map on native — same name both sides; never a one-off background.
- **Tokens only.** Aspect/radius/border/shadow/gradient come from `@lockin90/tokens`. The metallic chip + sheen literals are the only sanctioned hardcodes and are kept visually paired across the twins.
- **Parity gate.** Before shipping a billing screen, confirm the web phone-width card and the native card match (same gradient, masked number, fields).
