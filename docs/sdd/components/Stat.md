# SDD — `Stat`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Stat.tsx` · `packages/ui-native/src/components/Stat.tsx` ·
> web CSS `packages/ui/src/styles/primitives.css` (`.lk-stat*`, `.lk-delta`) + `base.css` (`.lk-display`, `.lk-tnum`, `lk-flow-text`).
> **Exports:** `Stat`, type `StatProps`, type `StatTone`, type `StatSize` — all re-exported from the package root `index.ts`.
> **Status:** Shipped. **Parity:** 🟡 same full API (`tone`/`valueColor`/`size`/`sub`/`empty`/`hint` on **both**
> platforms); remainder is typing only — web `label`/`value`/`delta` are `ReactNode`, native `string`.
> **Stories:** `packages/ui/src/stories/Stat.stories.tsx` · native equivalent.

---

## 1. Overview

The kit's simplest **KPI block**: a mono uppercase `label`, a big display `value`, and an optional signed
`delta`. It is layout-free (a flex column) — drop it into any grid/card and it reads as a single stat.

- **Default (`size="md"`, unchanged)** — label + 30px display value + optional `delta` (mono, tone-colored by
  `deltaDir`). Nothing about existing call sites changes.
- **Size scale** — `size` scales the whole block: `sm` (20px value, compact panel stat), `lg` (28px,
  hero-in-a-panel), `hero` (huge `clamp(40–60px)` marketing figure with the **label rendered below** the value).
  `sm`/`lg` reproduce the retired admin `Statistic` metrics exactly; `hero` reproduces the retired marketing
  `Stat` figure exactly (see §6).
- **Value tone** — `tone="gradient"` clips the value text to a flux gradient — a **static** flux at
  `sm`/`md`/`lg`, the **animated** full-spectrum sweep at `hero`; `tone="mint"` tints it `--mint`. `valueColor`
  is an explicit color override that wins over `tone`.
- **Sub caption** — `sub` renders an extra faint mono line below the value/delta.
- **Empty** — `empty` swaps the value for an em-dash `—`, suppresses the delta, and shows the
  optional `hint` line (e.g. "No data yet — connect a wearable").

Reach for `Stat` for a bare number in a layout you control; reach for `MetricTile` when you want the
self-contained glass card (border + padding + delta **pill** + corner icon). Root `Stat` is now the single
source of truth that admin `Statistic` and marketing `Stat` wrap (§6) — extend it, not them.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `label` | web `ReactNode` / native `string` | — | ✓ | ✓ | mono uppercase caption |
| `value` | web `ReactNode` / native `string` | — | ✓ | ✓ | big display number |
| `delta` | web `ReactNode` / native `string` | — | ✓ | ✓ | optional signed change; renders only when non-null |
| `deltaDir` | `'up' \| 'down'` | — | ✓ | ✓ | `up`→`--zone-high`/`colors.zoneHigh`, `down`→`--zone-low`/`colors.zoneLow` |
| `tone` | `StatTone` = `'default' \| 'gradient' \| 'mint'` | `'default'` | ✓ | ✓ | `gradient` clips the value to a flux gradient (static flavor on `sm`/`md`/`lg`, animated full-spectrum on `hero`); `mint` → `--mint`/`colors.mint`; ignored when `valueColor` is set |
| `valueColor` | `string` | — | ✓ | ✓ | explicit `color` on the value; overrides `tone` |
| `size` | `StatSize` = `'sm' \| 'md' \| 'lg' \| 'hero'` | `'md'` | ✓ | ✓ | `md` is the unchanged 30px default; see §3 for the full scale |
| `sub` | `ReactNode` | — | ✓ | ✓ | optional mono caption rendered below the value/delta |
| `empty` | `boolean` | — | ✓ | ✓ | em-dash placeholder, suppresses delta |
| `hint` | `string` | — | ✓ | ✓ | helper line shown in empty mode |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web) | — | ✓ | — | spread onto the root `<div>` |

- **Web:** plain function component over `<div className="lk-stat">`; `value`/`label`/`delta` are `ReactNode`.
  `size !== 'md'` adds one class `lk-stat-{sm,lg,hero}`; `md` adds none (base `.lk-stat` metrics apply). `tone`
  adds `lk-stat-v-grad`/`lk-stat-v-mint` to the value span, unless `valueColor` is set (then only inline `color`
  is applied and the tone class is suppressed entirely).
- **Native:** `value`/`label`/`delta` are typed `string` (rendered inside `<Text>`/`GradientText`); the full
  `tone`/`valueColor`/`size`/`sub`/`empty`/`hint` surface ships via a `SIZE` map + the native `GradientText`.

## 3. Visual spec (tokens — never hardcode)

| Element | Web (`.lk-stat …`) | Native (`StyleSheet`) |
| --- | --- | --- |
| Container | flex column, `gap: 6px` | `gap: 6` |
| Label | `--font-mono`, 10.5px, uppercase, `letter-spacing .16em`, `--text-faint` | `fonts.mono`, 10.5px, uppercase, `letterSpacing 1.6`, `colors.textFaint` |
| Value | `.lk-display` (`--font-display`, 700) + 30px + `.lk-tnum` (tabular-nums), `--text` | `fonts.display` 700, 30px, `letterSpacing -0.6`, `colors.text` |
| Delta | `.lk-mono`, 12px; up `--zone-high` / down `--zone-low` | `fonts.mono`, 12px; color `colors.zoneHigh`/`colors.zoneLow` |
| Sub caption | `.lk-stat-sub` — `--font-mono`, 10.5px, `--text-faint` | `fonts.mono`, faint caption below value/delta |
| Empty value | `.lk-stat-empty-value` → `--text-faint` em-dash | `colors.textFaint` em-dash at the size's value style |
| Hint | `--font-mono`, 11px, `--text-faint` | `fonts.mono`, 11px, `letterSpacing 0.22`, `colors.textFaint` |

Display value letter-spacing matches: web `-0.02em` of 30px ≈ native's `-0.6`.

**Size scale (web `.lk-stat-{sm,lg,hero}` / native `SIZE` map — same values; native `hero` is a fixed 44px vs web's `clamp`):**

| Size | Value | Label | Gap | Notes |
| --- | --- | --- | --- | --- |
| `md` (default) | 30px | 10.5px / `.16em` tracking | 6px | base `.lk-stat` — unchanged |
| `sm` | 20px, `line-height 1.1` | 10px / `.12em` | 3px | reproduces retired admin `Statistic` `size="md"` |
| `lg` | 28px, `line-height 1.1` | 10px / `.12em` | 3px | reproduces retired admin `Statistic` `size="lg"` |
| `hero` | `clamp(40px, 6vw, 60px)`, `letter-spacing -.03em`, `line-height 1` | 11px / `.18em`, weight 500, `--text-dim` | 8px | reproduces retired marketing `Stat`; `flex-direction: column-reverse` puts the **label below the value** |

**Value tone (web `.lk-stat-v-{grad,mint}` / native `GradientText`·`colors.mint`):**

| Tone | `sm` / `md` / `lg` | `hero` |
| --- | --- | --- |
| `gradient` | static flux: `linear-gradient(135deg, #7C5CFF, #22D3EE, #7C5CFF)`, clipped to text | animated full-spectrum: `linear-gradient(100deg, #A8FF35, #34F5C5, #22D3EE, #7C5CFF, #FF3D81, #7C5CFF, #22D3EE, #34F5C5, #A8FF35)`, `background-size 200% 100%`, `animation: lk-flow-text 9s linear infinite` — same recipe as `.lk-gradient-text` |
| `mint` | `color: var(--mint)` | same |
| `valueColor` set | inline `style.color`; suppresses the tone class | same |

The size-dependent gradient flavor is intentional, not an inconsistency: `sm`/`md`/`lg` match what admin
`Statistic` always rendered (static flux), `hero` matches what marketing `Stat` always rendered (animated
spectrum) — the consolidation had to reproduce both, not average them.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-stat` | base View |
| With delta | `.lk-delta.lk-up` / `.lk-delta.lk-down` | colored `delta` Text |
| With tone | `.lk-stat-v-grad` / `.lk-stat-v-mint` on the value span (suppressed if `valueColor` set) | `GradientText` value / `colors.mint` (same suppression) |
| With sub | trailing `.lk-stat-sub` line | trailing mono faint `Text` |
| Empty | `.lk-stat-empty` → em-dash value + `.lk-stat-hint` | `colors.textFaint` em-dash + hint `Text`, delta suppressed |
| Hover / focus | none (non-interactive) | none |

`Stat` is presentational — no hover, press, focus, disabled, or selected state on either platform.

## 5. Web ↔ native parity

**Verdict: 🟡 same core API + the new tone/size surface, one web-only remainder.** Label/value/delta/`deltaDir`
and the default 30px visuals (mono faint label, tone-colored delta) are identical and untouched. Differences:

- **`tone` / `valueColor` / `size` / `sub` — now on both platforms.** `packages/ui-native/src/components/Stat.tsx`
  carries the same four props (same names, same tokens). `tone="gradient"` renders the value via the native
  `GradientText` primitive (`gradients.cta` on `sm/md/lg`, `gradients.flux` on `hero` — note native `GradientText`
  now **flows** by default, so native gradient values animate at every size while web's `sm/md/lg` flux is static CSS);
  `mint`/`valueColor` set the `<Text>` colour; `size` scales the figure (`sm` 20 · `md` 30 · `lg` 28 · `hero` ~44
  with the label flipped **below** via `flexDirection: column-reverse`); `sub` is a mono faint caption. `md`/`default`
  is byte-for-byte the previous native render.
- **`empty`/`hint` — now on both platforms.** Native renders the same em-dash placeholder (value style at the
  size's metrics, `colors.textFaint`), suppresses the delta, and shows the mono `hint` line — matching web's
  `.lk-stat-empty-value`/`.lk-stat-hint`.
- **Value typing:** web accepts `ReactNode` (e.g. a `GradientText` value); native is `string`-only because it
  renders straight into `<Text>` / `GradientText`. Substrate-driven.
- **`hero` size:** web `clamp(40px, 6vw, 60px)` (viewport-responsive); native a fixed 44px.

No blocking gap remains.

## 6. Composition & usage

- **Used in:** dashboard summary rows, account/settings KPI strips, admin overview headers.
- **Composes from:** nothing — it's a leaf primitive. Pair with a `Card`/grid for surfaces.
- **Wrapped by (web):** admin `Statistic` (`@lockin90/ui/admin`) and marketing `Stat` (`@lockin90/ui/marketing`)
  are now **thin wrappers of this component**, not separate implementations:
  - `Statistic` maps its `size="md"→Stat size="sm"` (20px) and `size="lg"→Stat size="lg"` (28px); `tone`,
    `valueColor`, `sub` pass straight through. Faithful — `sm`/`lg` reproduce the retired `.lk-statistic*` CSS
    exactly. See `docs/sdd/components/admin/Statistic.md`.
  - marketing `Stat` is fixed at `size="hero" tone="gradient"`. Faithful — `hero` reproduces the retired
    `.lk-mkt-stat*` CSS exactly. See `docs/sdd/components/marketing/Stat.md`.
  - Both retired their own CSS files in favor of the shared `.lk-stat-{sm,lg,hero}` + `.lk-stat-v-grad` classes
    documented in §3 — there is now exactly one stat recipe in the kit.
- For a self-contained card with a delta **pill** and corner icon, use `MetricTile` instead.

```tsx
// web
<Stat label="Avg energy" value="82" delta="+4" deltaDir="up" />
<Stat label="Streak" value="—" empty hint="Log a day to start your streak" />
<Stat label="MRR" value="$48.2k" size="lg" tone="gradient" sub="last 30 days" />

// native — identical surface (string values)
<Stat label="Avg energy" value="82" delta="+4" deltaDir="up" />
<Stat label="Streak" value="—" empty hint="Log a day to start your streak" />
```

## 7. Accessibility

- **Web:** semantic `<div>` with text children — the label + value read in order to a screen reader. If the
  number needs a unit/context for SR users, include it in `label` or `value` text (no `aria` is auto-added).
- **Native:** `<Text>` nodes are read in order. Pass `accessibilityLabel` via `style`-adjacent props only if you
  compose a wrapper; `Stat` itself adds none.
- **Contrast:** faint label (`--text-faint` `#828B9F`) is a deliberate de-emphasis — keep the **value** as the
  high-contrast focal element; don't down-tone it.

## 8. Usage rules — Do / Don't

**Do**
- Use `Stat` for a single labeled number inside a layout you already own.
- Use `deltaDir` so the delta is tone-colored (up = mint, down = rose) — don't pre-color the string.
- Use `size`/`tone` for a compact (`sm`), panel-hero (`lg`), or marketing-hero (`hero`) stat instead of
  wrapping `Stat` in custom font-size/gradient styling — both platforms.
- Reach for `valueColor` only for a computed/graded color (e.g. a score-based hue) — use `tone` for the two
  fixed treatments (`gradient`/`mint`).
- Use `empty` + `hint` for the zero-data state rather than rendering `"0"` or blank — both platforms.

**Don't**
- ✗ Don't hardcode the value font, label spacing, or delta colors — they come from `@lockin90/tokens`.
- ✗ Don't fake the delta tone by passing a colored node; pass `deltaDir`.
- ✗ Don't reach for `Stat` when you need a bordered card — that's `MetricTile`.
- ✗ Don't pass rich nodes to native `value`/`label`/`delta` — they're `string`s there (web takes `ReactNode`).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled "big number + tiny label" block re-creates `Stat` and will drift from the
  display/mono type scale — import `Stat`.
- **New need → add to BOTH platforms.** A new tone, size, or mode ships to web **and** native `Stat` (same
  prop name, same tokens) — never special-case it in app code as the permanent answer.
- **Reuse the size/tone scale, don't reinvent it.** `sm`/`lg`/`hero` + `gradient`/`mint` already cover the
  compact-panel-stat and marketing-hero-figure cases (that's the whole point of the consolidation in §6) — don't
  hand-roll a new size or a new gradient recipe when one of these fits; extend `StatSize`/`StatTone` instead.
- **Tokens only.** The 30px display value, `.16em` label tracking, and zone-high/low delta colors are tokens;
  any hardcoded equivalent is a bug even if it looks identical today.
- **Parity gate.** Before shipping a screen with `Stat`, confirm the web phone-width and native renders match —
  same label casing, same value size, same delta tone.
