# SDD — `Stat`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Stat.tsx` · `packages/ui-native/src/components/Stat.tsx` ·
> web CSS `packages/ui/src/styles/primitives.css` (`.lk-stat*`, `.lk-delta`) + `base.css` (`.lk-display`, `.lk-tnum`).
> **Exports:** `Stat`, type `StatProps`.
> **Status:** Shipped. **Parity:** 🟡 same core API & visuals; native takes `string`s and has **no `empty`/`hint` placeholder mode** (web-only).
> **Stories:** `packages/ui/src/stories/Stat.stories.tsx` · native equivalent.

---

## 1. Overview

The kit's simplest **KPI block**: a mono uppercase `label`, a big display `value`, and an optional signed
`delta`. It is layout-free (a flex column) — drop it into any grid/card and it reads as a single stat.

- **Default** — label + 30px display value + optional `delta` (mono, tone-colored by `deltaDir`).
- **Empty** (web only) — `empty` swaps the value for an em-dash `—`, suppresses the delta, and shows the
  optional `hint` line (e.g. "No data yet — connect a wearable").

Reach for `Stat` for a bare number in a layout you control; reach for `MetricTile` when you want the
self-contained glass card (border + padding + delta **pill** + corner icon).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `label` | web `ReactNode` / native `string` | — | ✓ | ✓ | mono uppercase caption |
| `value` | web `ReactNode` / native `string` | — | ✓ | ✓ | big display number |
| `delta` | web `ReactNode` / native `string` | — | ✓ | ✓ | optional signed change; renders only when non-null |
| `deltaDir` | `'up' \| 'down'` | — | ✓ | ✓ | `up`→`--zone-high`/`colors.zoneHigh`, `down`→`--zone-low`/`colors.zoneLow` |
| `empty` | `boolean` | — | ✓ | ✗ | **web only** — em-dash placeholder, suppresses delta |
| `hint` | `string` | — | ✓ | ✗ | **web only** — helper line shown in empty mode |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web) | — | ✓ | — | spread onto the root `<div>` |

- **Web:** plain function component over `<div className="lk-stat">`; `value`/`label`/`delta` are `ReactNode`.
- **Native:** `value`/`label`/`delta` are typed `string` (rendered inside `<Text>`); no `empty`/`hint`.

## 3. Visual spec (tokens — never hardcode)

| Element | Web (`.lk-stat …`) | Native (`StyleSheet`) |
| --- | --- | --- |
| Container | flex column, `gap: 6px` | `gap: 6` |
| Label | `--font-mono`, 10.5px, uppercase, `letter-spacing .16em`, `--text-faint` | `fonts.mono`, 10.5px, uppercase, `letterSpacing 1.6`, `colors.textFaint` |
| Value | `.lk-display` (`--font-display`, 700) + 30px + `.lk-tnum` (tabular-nums), `--text` | `fonts.display` 700, 30px, `letterSpacing -0.6`, `colors.text` |
| Delta | `.lk-mono`, 12px; up `--zone-high` / down `--zone-low` | `fonts.mono`, 12px; color `colors.zoneHigh`/`colors.zoneLow` |
| Empty value | `.lk-stat-empty-value` → `--text-faint` em-dash | n/a |
| Hint | `--font-mono`, 11px, `--text-faint` | n/a |

Display value letter-spacing matches: web `-0.02em` of 30px ≈ native's `-0.6`.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-stat` | base View |
| With delta | `.lk-delta.lk-up` / `.lk-delta.lk-down` | colored `delta` Text |
| Empty | `.lk-stat-empty` → em-dash value + `.lk-stat-hint` | **not supported** |
| Hover / focus | none (non-interactive) | none |

`Stat` is presentational — no hover, press, focus, disabled, or selected state on either platform.

## 5. Web ↔ native parity

**Verdict: 🟡 same core API, platform-shaped impl + one web-only mode.** Label/value/delta/`deltaDir` and
all visuals (30px display value, mono faint label, tone-colored delta) are identical. Two real differences:

- **`empty`/`hint`:** web renders an em-dash placeholder + hint line; native has neither prop. A native screen
  that needs the zero-data state must branch in app code (or `empty` should be **added to native** for parity).
- **Value typing:** web accepts `ReactNode` (e.g. a `GradientText` value); native is `string`-only because it
  renders straight into `<Text>`. Substrate-driven.

No blocking capability gap for the populated case; the gap is the missing native `empty` mode — flag it before
shipping a native screen that relies on the zero-data placeholder.

## 6. Composition & usage

- **Used in:** dashboard summary rows, account/settings KPI strips, admin overview headers.
- **Composes from:** nothing — it's a leaf primitive. Pair with a `Card`/grid for surfaces.
- For a self-contained card with a delta **pill** and corner icon, use `MetricTile` instead.

```tsx
// web
<Stat label="Avg energy" value="82" delta="+4" deltaDir="up" />
<Stat label="Streak" value="—" empty hint="Log a day to start your streak" />

// native
<Stat label="Avg energy" value="82" delta="+4" deltaDir="up" />
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
- On web, use `empty` + `hint` for the zero-data state rather than rendering `"0"` or blank.

**Don't**
- ✗ Don't hardcode the value font, label spacing, or delta colors — they come from `@lockin90/tokens`.
- ✗ Don't fake the delta tone by passing a colored node; pass `deltaDir`.
- ✗ Don't reach for `Stat` when you need a bordered card — that's `MetricTile`.
- ✗ Don't rely on `empty`/`hint` on native (unsupported) without adding it to the native component first.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled "big number + tiny label" block re-creates `Stat` and will drift from the
  display/mono type scale — import `Stat`.
- **New need → add to BOTH platforms.** If you need `empty`/`hint` on native, **add the prop to the native
  component** (same name, same tokens) — never special-case it in app code as the permanent answer.
- **Tokens only.** The 30px display value, `.16em` label tracking, and zone-high/low delta colors are tokens;
  any hardcoded equivalent is a bug even if it looks identical today.
- **Parity gate.** Before shipping a screen with `Stat`, confirm the web phone-width and native renders match —
  same label casing, same value size, same delta tone.
