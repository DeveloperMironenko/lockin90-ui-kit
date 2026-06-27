# SDD — `PricingTierCard`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/PricingTierCard.tsx` · `packages/ui-native/src/components/PricingTierCard.tsx` ·
> web CSS `packages/ui/src/styles/components/pricingtier.css` (`.lk-tier*`).
> **Exports:** `PricingTierCard`, type `PricingTierCardProps`.
> **Status:** Shipped. **Parity:** 🟡 same API/structure; web `featured` border is an *animated* cta-gradient (`lk-btn-flow`), native a *static* `LinearGradient` hairline; Card `hover` is web-only.
> **Stories:** `packages/ui/src/stories/PricingTierCard.stories.tsx` · native equivalent.

---

## 1. Overview

A **glass plan card** for pricing tables. Column layout: tier **name** + optional **Badge** (head), a **description**, a big **price** (display font) + **period**, a **feature list** (each row a leading mint check `Icon` + label), and a **CTA slot** pinned to the bottom.

When `featured`, it drops its own border for a **cta-gradient hairline** + accent glow and shows a **ribbon** (`ribbonLabel`, default "Most popular"). When `disabled`, the whole card dims + goes non-interactive (unavailable / current plan / coming soon).

It exists as the one sanctioned plan card — mirroring the `.tier` cards in the billing mockup — so pricing pages look identical web ↔ native. The CTA is a **slot** (`cta`): the consumer passes a `<Button>`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `name` | `string` | — (required) | ✓ | ✓ | tier name (e.g. `'Pro'`) |
| `price` | `string` | — (required) | ✓ | ✓ | preformatted (e.g. `'$9'`, `'Free'`) |
| `period` | `string` | — | ✓ | ✓ | e.g. `'/mo'`; dropped when omitted |
| `description` | `string` | — | ✓ | ✓ | one-liner; reserves `min-height` for row alignment |
| `features` | `string[]` | — (required) | ✓ | ✓ | each → a leading check `Icon` + text |
| `featured` | `boolean` | `false` | ✓ | ✓ | gradient border + glow + ribbon |
| `ribbonLabel` | `string` | `'Most popular'` | ✓ | ✓ | only shown when `featured` |
| `badge` | `string` | — | ✓ | ✓ | small accent `Badge` next to the name |
| `cta` | `ReactNode` | — | ✓ | ✓ | CTA slot at the bottom — pass a `<Button>` |
| `disabled` | `boolean` | `false` | ✓ | ✓ | dim + non-interactive |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |

- **Web:** built on `Card` (`hover={!featured && !disabled}`, `flat={featured}`), sets `aria-disabled` when disabled.
- **Native:** non-featured → a plain `Card`; featured → a `LinearGradient` (1.5px padding hairline) wrapping a `Card flat`. `disabled` applies `{ opacity: 0.5 }` + `pointerEvents="none"`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native | Value |
| --- | --- | --- | --- |
| Featured border | `::before` `--grad-cta`, `1.5px`, `mask` hairline, `lk-btn-flow 6s` | `LinearGradient` `gradients.cta`, `padding:1.5` | violet→cyan 135° |
| Featured glow | `box-shadow 0 0 50px -10px rgba(124,92,255,.45)`, bg `--bg-1` | `nativeShadows.glowAccent`, inner bg `colors.bg1` | accent glow |
| Ribbon | `--font-mono` 9.5px/600, `.12em` uppercase, `#0a0a12` on `--grad-cta`, `--r-pill`, `--glow-accent` | `fonts.mono` 9.5/600, `LinearGradient` cta pill, `nativeShadows.glowAccent` | top:14 right:14 |
| Head gap | `9px` | `9` | name ↔ badge |
| Name | `--font-display` 700, 19px, `--text` | `fonts.display` 700, 19, `colors.text` | — |
| Description | 12.5px, line 1.45, `--text-dim`, `min-height:34px` | 12.5, line 18, `colors.textDim`, `minHeight:34` | — |
| Price amount | `--font-display` 700, 42px, `-.04em`, `--text` | `fonts.display` 700, 42, `-1.7`, `colors.text` | — |
| Price period | `--font-mono` 12.5px, `--text-faint` | `fonts.mono` 12.5, `colors.textFaint` | — |
| Feature list | gap `11px`, `margin:16px 0`, `flex:1` | gap `11`, `marginVertical:16`, `flex:1` | — |
| Feature row | gap `10px`, 13px, line 1.4, `--text` | gap `10`, 13, line 18, `colors.text` | — |
| Check icon | `Icon name="check" size={16}`, `--zone-high` | `Icon name="check" size={16}`, `colors.zoneHigh` | mint `#34F5C5` |
| CTA slot | `margin-top:auto`, `padding-top:4px` | `marginTop:'auto'`, `paddingTop:4` | pinned bottom |

- Featured uses the **same** `lk-btn-flow` gradient-drift keyframes as the primary `Button` (6s, `--ease-soft`); honored by `prefers-reduced-motion` (animation off).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `Card hover` enabled (lift) | plain `Card` (no hover) |
| Featured | `.lk-tier-featured` animated gradient border + glow + ribbon | `LinearGradient` static hairline + glow + ribbon |
| Disabled | `.lk-tier--disabled` opacity .5, `saturate(.6)`, `pointer-events:none`, `cursor:not-allowed` | `opacity:.5`, `pointerEvents:none` |
| Hover | `Card` hover (non-featured, non-disabled only) | n/a |
| Reduced motion | featured gradient stops animating | n/a (already static) |

## 5. Web ↔ native parity

**Verdict: 🟡 same API + structure, two substrate-shaped differences.** Identical props, section order (head → desc → price → features → CTA), type scale, spacing, the mint check icon, the ribbon, and the disabled dim. Both compose `Card` + `Icon` + `Badge`.

Real differences (neither blocks use):

- **Featured border:** web draws it as a masked `::before` gradient that **animates** (`lk-btn-flow 6s`); native wraps the card in a **static** `LinearGradient` 1.5px hairline (no animation — no perf-cheap RN equivalent, same as `Button`). The hairline geometry and glow match.
- **Hover lift:** the web non-featured card lifts on hover (via `Card hover`); native has no hover (press feedback lives on the CTA `Button`, not the card).
- **Disabled detail:** web also desaturates (`saturate(.6)`); native dims opacity only.

No capability gap — the card is fully usable and visually equivalent on both platforms.

## 6. Composition & usage

- **Composes from:** `Card` (surface), `Icon` (`check`), `Badge` (tier tag); native featured also uses `expo-linear-gradient`.
- **CTA slot:** pass a `<Button>` (typically `variant="primary"` on the featured tier, `default` elsewhere).
- **Used by:** pricing pages, upgrade/plan-picker screens, billing.

```tsx
// web
<PricingTierCard
  name="Pro" price="$9" period="/mo" featured badge="Best value"
  description="Everything to actually get fit."
  features={['Unlimited workouts', 'AI coach', 'Priority support']}
  cta={<Button variant="primary" onClick={upgrade}>Upgrade</Button>}
/>

// native
<PricingTierCard
  name="Pro" price="$9" period="/mo" featured badge="Best value"
  description="Everything to actually get fit."
  features={['Unlimited workouts', 'AI coach', 'Priority support']}
  cta={<Button variant="primary" title="Upgrade" onPress={upgrade} />}
/>
```

## 7. Accessibility

- **Web:** sets `aria-disabled` when `disabled`; the card is a region of text + an interactive CTA (the `Button` carries its own button semantics). The ribbon is decorative text.
- **Native:** `disabled` sets `pointerEvents="none"` so the inner CTA can't be pressed; the CTA `Button` provides the `accessibilityRole`.
- **Hit target / contrast:** the CTA is the touch target — keep it a real `Button` (≥44px `md`). The ribbon uses `#0a0a12` on the bright gradient for contrast; check icon uses `--zone-high` (mint) which also reads as "included".
- **Don't** convey "included" by the check color alone — each feature row also has its text label.

## 8. Usage rules — Do / Don't

**Do**
- Pass a real `<Button>` into `cta` (correct `variant`/`onClick`/`onPress` per platform).
- Mark exactly **one** tier `featured` per pricing group.
- Preformat `price` (`'$9'`, `'Free'`) — the card doesn't do currency/number formatting.
- Use `disabled` for the current plan / unavailable / coming-soon tier.

**Don't**
- ✗ Don't hand-roll a plan card or a gradient border — use `PricingTierCard` + `featured`.
- ✗ Don't mark multiple tiers `featured` (defeats the "highlight one" affordance).
- ✗ Don't hardcode the gradient, glow, radius, or check color — they're tokens.
- ✗ Don't put a non-`Button` CTA when you need press/hover semantics + parity.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom "popular plan" card with its own gradient border is a parity violation — it will drift from `lk-tier-featured`/the native hairline. Import the primitive.
- **New tier treatment → both platforms.** A new variant (e.g. a third emphasis level) is added with the same prop + tokens on web **and** native; never a one-off.
- **Tokens only.** Gradient, glow, radius, check color, type scale all come from `@lockin90/tokens`. The `#0a0a12` ribbon text + `lk-btn-flow` keyframe are the sanctioned shared literals (paired across twins).
- **Parity gate.** Before shipping a pricing screen, diff the web phone-width tiers vs native: same order, same featured tier, same ribbon, same CTA.
