# SDD — `ShareCard`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform composite.
> **Source:** `packages/ui/src/components/ShareCard.tsx` · `packages/ui-native/src/components/ShareCard.tsx` ·
> web CSS `packages/ui/src/styles/components/sharecard.css` (`.lk-sharecard*`).
> **Exports:** `ShareCard`, type `ShareCardProps`, type `ShareCardGradient`, type `ShareCardSize`, type `ShareCardStat`.
> **Status:** Shipped. **Parity:** 🟡 same API & layout; platform-shaped background (web radial CSS mesh vs native `expo-linear-gradient` wash) + one shadow on native.
> **Stories:** `packages/ui/src/stories/ShareCard.stories.tsx`.

---

## 1. Overview

The **branded, shareable progress/score card** — the artifact a user posts to socials. It is a fixed-aspect "share viewport" on the deep-`void` surface with an Aurora-gradient backdrop, carrying:

- a **`BrandMark` lockup** (top) + a `lockin90.com` watermark (foot), both gated by `brand`;
- a **headline `metric`** rendered either as a big **`GradientText`** number *or*, when `ring` is given, as the centered readout of a **`Ring`** (the ring arc carries the gradient, the number stays plain);
- an optional `title` eyebrow and `metricLabel` caption around the metric;
- up to **three supporting `Stat`s** in a centered row.

`gradient` (one token) drives the backdrop mesh + the ring/headline gradient; `size` picks the share aspect (`sm` 1:1 · `md` 4:5 · `lg` 9:16). It mirrors the "share studio" card in `lockin90-design/mobile/social.html` (`.sc`) and `web/share.html`.

It is the **only** sanctioned branded score card — hand-rolling one is a parity/maintenance violation (see §9). The design audit found **3 lookalikes**; those must be replaced by `ShareCard`.

`ShareCardStat` (`{ label, value }`) is the supporting-stat shape, fed straight to the `Stat` primitive.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `title` | `string` | — | ✓ | ✓ | small mono eyebrow above the metric |
| `metric` | `string \| number` | — (required) | ✓ | ✓ | the headline; shown big or inside the `ring` |
| `metricLabel` | `string` | — | ✓ | ✓ | mono caption under the metric |
| `ring` | `{ value: number; max?: number }` | — | ✓ | ✓ | show a `Ring` (value→0–100 vs `max`, default 100) with `metric` centered, instead of a big number |
| `stats` | `ShareCardStat[]` | — | ✓ | ✓ | **sliced to 3**; each rendered with `Stat` |
| `brand` | `boolean` | `true` | ✓ | ✓ | show `BrandMark` lockup + watermark |
| `gradient` | `'flux' \| 'cta' \| 'mint' \| 'violet'` | `'flux'` | ✓ | ✓ | identical union both sides |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | ✓ | ✓ | share aspect + scale |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web) / `ViewProps` (native) | — | ✓ | ✓ | `aria-*` / `accessibilityLabel`, `id`, `data-*`, etc. |

- **Web:** `forwardRef<HTMLDivElement>`; emits `data-gradient` (selects the mesh) + `lk-sharecard-${size}` (selects the aspect).
- **Native:** plain function; `style` merges onto the card `View`.
- **Gradient → headline:** `GradientText` only exposes `flux`/`cta`/`violet`, so a `mint` headline falls back to the `flux` gradient text — the mesh **and** ring still carry the true `mint` tint. (No effect when `ring` is set: the in-ring number is plain `--text`.)

## 3. Visual spec (tokens — never hardcode)

| Aspect | Token |
| --- | --- |
| Surface | `--void` / `colors.void` |
| Border | `1px --border-2` / `colors.border2` |
| Radius | `--r-lg` (22) / `radii.lg` |
| Shadow | web `--elev-2, --glow-accent` · native `nativeShadows.elev2` (single shadow) |
| Mesh/wash | web radial `color-mix(in oklab, var(--accent)/--cyan/--magenta/--mint/--lime/--violet/--indigo …)` · native `expo-linear-gradient` `gradients[gradient].stops` @ `opacity .32` over `--void` |
| Ring arc | `Ring gradient={[stops[0], stops.at(-1)]}` of `gradients[gradient]` |
| Headline | `GradientText` (`flux`/`cta`/`violet`), `--font-display` 700 |
| Eyebrow / label / watermark / stat labels | `--font-mono` / `fonts.mono`, uppercase, `--text-dim` / `--text-faint` |

- **Aspect + scale (size):** `sm` 1:1 / pad 18 / metric 44 / score 34 / ring 96·th8 / brand 18; `md` 4:5 / pad 22 / metric 56 / score 42 / ring 120·th9 / brand 20; `lg` 9:16 / pad 26 / metric 64 / score 48 / ring 140·th10 / brand 22. Web max-width sm 320 / md 360 / lg 340; native `width:100%` + `aspectRatio`.
- **Layout:** flex column, `space-between` → `top` (brand) / `body` (flex:1, centered: eyebrow → metric/ring → label → stats) / `foot` (watermark). Mesh/wash is an absolute layer behind a `z-index:1` / paint-order-above content.
- **Stats:** centered, wrapping row, `gap:16`; each is the kit `Stat` at its native size (label `--font-mono` 10.5px + value `--font-display` 30px) — centered via layout only, **not** restyled.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-sharecard` + size + `data-gradient` | card `View` + `LinearGradient` wash |
| Ring vs number | `ring` → `Ring` w/ centered `.lk-sharecard-score`; else `.lk-sharecard-metric` `GradientText` | same branch |
| Unbranded | `brand={false}` → no `BrandMark`, no watermark | same |
| Stats capped | `stats.slice(0,3)` | `stats.slice(0,3)` |
| No stats / no title / no label | sections omitted; body stays centered | same |

ShareCard is **static/presentational** — no hover, focus, pressed, disabled, or loading states. It is meant to be rendered (and snapshotted/exported) as an image, not interacted with.

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped backdrop.** Identical prop union, defaults, composition (BrandMark + GradientText/Ring + Stat), aspect/scale numbers, and typography tokens. Differences are substrate-only:

- **Backdrop:** web paints a 3–4 stop **radial mesh** via CSS `color-mix` on the spectrum tokens; native paints a **linear** `expo-linear-gradient` wash (`gradients[gradient].stops`, diagonal, `opacity .32`) over `--void` — RN has no radial-gradient/`color-mix`. Visually equivalent aurora tint; documented, not blocking.
- **Shadow:** web stacks `--elev-2` **+** `--glow-accent`; native applies a single `nativeShadows.elev2` (RN supports one shadow per view). The branded glow is implied by the wash on native.
- **Headline render:** web `GradientText` clips a DOM span; native `GradientText` measures then draws `react-native-svg` text — same gradient result, same `flux`/`cta`/`violet` set (and same `mint`→`flux` fallback).

No capability gap blocks use; both render the same information design at the same aspect.

## 6. Composition & usage

- **Composes:** `BrandMark` (lockup) · `GradientText` (headline number) · `Ring` (score readout) · `Stat` (supporting metrics). It re-creates none of them.
- **Used by:** the Social / share-studio surfaces (web `share.html`, mobile `social.html`) — the live share-card preview and any attached/branded progress card.

```tsx
// web — energy score with a ring + 3 stats
<ShareCard
  title="Last 7 days"
  metric={76}
  metricLabel="High zone"
  ring={{ value: 76 }}
  gradient="flux"
  stats={[{ label: 'Best', value: '88' }, { label: 'Sleep', value: '7h18' }, { label: 'Streak', value: '23d' }]}
/>

// native — a streak headline (no ring), story aspect
<ShareCard title="Current streak" metric="23" metricLabel="days locked in" gradient="cta" size="lg" />
```

## 7. Accessibility

- **Web:** a presentational `<div>`. Pass a single descriptive `aria-label` (e.g. "Shareable energy card: 7-day average 76/100, High zone, best 88, streak 23 days") and consider `role="img"` — the inner mesh/brand/ring are `aria-hidden`/decorative, and the scattered numbers don't read as a sentence. The card is non-interactive (no focus/keyboard).
- **Native:** pass `accessibilityRole="image"` + `accessibilityLabel` (same summary) via rest props; children are decorative.
- **Contrast:** text is `--text`/`--text-dim`/`--text-faint` on the dim `--void`+wash — keep the wash subtle (the `.32` opacity / `color-mix` percentages are tuned for legibility); don't raise it.

## 8. Usage rules — Do / Don't

**Do**
- Use `ShareCard` for **every** branded, shareable score/progress card.
- Use `ring` for a 0–100 score readout; use the big-number headline for streaks/PRs/counts.
- Keep `stats` to **≤3** (extra are dropped) — they're supporting context, not the headline.
- Choose `size` by destination: `sm` 1:1 (post), `md` 4:5 (feed), `lg` 9:16 (story).
- Give it an `aria-label`/`accessibilityLabel` summarizing the card.

**Don't**
- ✗ Don't hand-roll a branded score card / re-create the mesh, ring, or brand lockup — use `ShareCard`.
- ✗ Don't hardcode the gradient, void surface, radius, or shadow — they come from `@lockin90/tokens`.
- ✗ Don't pass more than 3 `stats` expecting them all to show.
- ✗ Don't pass `className` on native or `style` on web (wrong-platform prop).
- ✗ Don't restyle the composed `Stat`/`Ring`/`BrandMark` internals from a screen — change the primitive (both platforms) if a new look is needed.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A "custom share image" that re-creates the brand lockup + aurora mesh + ring/score is a **parity violation** — it drifts from the kit and breaks web≡native. The design audit found **3 such lookalikes**; replace them with `ShareCard`. If you need a share card, import `ShareCard`.
- **New need → add a prop on BOTH platforms.** A missing gradient, aspect, or layout slot is a `gradient`/`size`/prop addition to `ShareCard` (same name, same tokens) on web **and** native — never a one-off local card. (If a `mint` *headline* gradient is required, add `mint` to `GradientText` on both platforms first, then drop the fallback here.)
- **Tokens only.** Any color/space/radius/shadow not sourced from `@lockin90/tokens` is a bug, even if it "looks the same" today.
- **Parity gate.** Before shipping a screen with `ShareCard`, confirm the web phone-width render and the native render match (same gradient, size, ring vs number, stats, brand).
