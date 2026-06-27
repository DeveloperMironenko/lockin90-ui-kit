# SDD — `KeyValue` (+ `StatusDot` cross-ref)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/KeyValue.tsx` (web `KeyValue` **and** `StatusDot`) ·
> `packages/ui-native/src/components/KeyValue.tsx` (native `KeyValue`) · native `StatusDot` lives in its
> **own file** `packages/ui-native/src/components/StatusDot.tsx` · web CSS `packages/ui/src/styles/components/keyvalue.css`.
> **Exports:** web — `KeyValue`, `StatusDot`, types `KeyValueRow`, `KeyValueProps`, `StatusDotTone`, `StatusDotProps`. Native — `KeyValue`, `KeyValueRow`, `KeyValueProps` (from KeyValue.tsx); `StatusDot`, `StatusDotTone`, `StatusDotProps` (from StatusDot.tsx).
> **Status:** Shipped. **Parity:** 🟡 `KeyValue` ≈ ✅ (DOM `<dl>` vs `View`); `StatusDot` pulse is **CSS-animated on web, static glow on native**.
> **Stories:** `packages/ui/src/stories/KeyValue.stories.tsx` · native equivalent.

---

## 1. Overview

**`KeyValue`** is a **definition list** of label↔value rows — the workhorse of admin detail panels and settings
screens. Two `align` modes:

- `spread` (default) — key left (mono faint), value right, hairline border between rows.
- `inline` — key then value side by side with a small gap.

**`StatusDot`** (secondary export) is a tiny colored status indicator dot with an optional `label` and a `pulse`
glow — used inline in rows/headers to show liveness/health (e.g. "Active", "Degraded"). On web it lives in
`KeyValue.tsx`; on native it is its **own** `StatusDot.tsx` (note: same prop API, separate module).

## 2. API contract

**`KeyValue`**

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `rows` | `KeyValueRow[]` = `{ key: string; value: ReactNode }[]` | sample 3 rows | ✓ | ✓ | the rows to render |
| `align` | `'spread' \| 'inline'` | `'spread'` | ✓ | ✓ | spread = left/right + hairlines; inline = gapped pair |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDListElement>` (web) / `ViewProps` (native) | — | ✓ | ✓ | spread onto root |

- **Web:** `forwardRef<HTMLDListElement>` → renders `<dl>` / `<div className="lk-kv-row"><dt><dd>`.
- **Native:** function over `<View>`; per row it renders `value` in a `<Text>` when it's a `string`/`number`,
  else wraps it in a `<View>` (so a `ReactNode` value like a `StatusDot` lays out correctly).

**`StatusDot`**

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `tone` | `StatusDotTone` = `'high' \| 'mid' \| 'low' \| 'accent' \| 'neutral'` | `'high'` | ✓ | ✓ | dot color (high=mint) |
| `label` | `string` | — | ✓ | ✓ | optional text after the dot |
| `pulse` | `boolean` | — | ✓ | ✓ | web: animated glow; native: stronger static glow |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLSpanElement>` (web) / `ViewProps` (native) | — | ✓ | ✓ | spread onto root |

- **Web:** `forwardRef<HTMLSpanElement>` → `<span class="lk-statusdot …">`; dot is an `aria-hidden` inner span.

## 3. Visual spec (tokens — never hardcode)

**KeyValue** — web `.lk-kv*` / native `StyleSheet`:

| Aspect | Value (web ↔ native) |
| --- | --- |
| List | flex column, `--font-ui`/`fonts.ui` |
| Key | `--font-mono`/`fonts.mono`, 11.5px, 500, `.04em`/`0.46` tracking, `--text-faint`/`colors.textFaint` |
| Value | 13px, `--text`/`colors.text` |
| Spread row | `space-between`, `gap 16px`, `padding 9px 0`, `1px --border`/`colors.border` divider; first row `padding-top:0`, last row no border |
| Spread value | right-aligned (`text-align: right` / `valSpread` `flexShrink:1 textAlign:right`) |
| Inline row | `gap 8px`, `padding 3px 0` |

**StatusDot** — web `.lk-statusdot*` / native `StatusDot.tsx`:

| Aspect | Value (web ↔ native) |
| --- | --- |
| Wrap | inline-flex / row, `gap 7px`, vertically centered |
| Dot | 8×8 circle, `box-shadow 0 0 7px currentColor` (web) / `shadowRadius 7`, `shadowOpacity .9` (native) |
| Label | 12px, `--text-dim`/`colors.textDim` |
| Tones | high=`--mint`/`colors.mint`, mid=`--zone-mid`/`colors.zoneMid`, low=`--zone-low`/`colors.zoneLow`, accent=`--accent`/`colors.accent`, neutral=`--text-faint`/`colors.textFaint` |
| Pulse | web `@keyframes lk-statusdot-pulse` (1.6s opacity/scale/glow, honors `prefers-reduced-motion`) / native `shadowRadius` bumped 7→12 (static) |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| KeyValue default | `.lk-kv-spread` / `.lk-kv-inline` | `rowSpread`/`rowInline` |
| StatusDot tone | `.lk-statusdot-{tone}` → dot bg + currentColor glow | `TONE[tone]` color |
| StatusDot pulse | `.lk-statusdot-pulse` animation (1.6s) | `pulse` → bigger static `shadowRadius` |
| Hover / focus / press | none (presentational) | none |

Both components are presentational — no interactive states.

## 5. Web ↔ native parity

**Verdict: 🟡.** `KeyValue` itself is effectively ✅ — identical `rows`/`align` API and identical visuals (mono
faint key, right-aligned value, hairline dividers); the only difference is substrate (`<dl>/<dt>/<dd>` vs
`View`/`Text`) and native's `string`-vs-node branch for the value cell. `StatusDot` is the platform-shaped part:

- **Pulse:** web runs a CSS keyframe animation (opacity/scale/glow, reduced-motion aware); native can't cheaply
  loop a glow, so `pulse` just renders a **stronger static glow** (`shadowRadius 12` vs `7`). Documented gap, not
  blocking — the dot still reads as "emphasized".
- **Module location:** web `StatusDot` is co-located in `KeyValue.tsx`; native is its own `StatusDot.tsx`. No API
  impact — same props, same import name.

No capability gap blocks use; only the animated pulse degrades to a static glow on native.

## 6. Composition & usage

- **`KeyValue` used in:** admin detail panels, settings/account summaries, billing/plan facts.
- **`StatusDot` used in:** list rows, table cells (as a `ReactNode` `value` in a `KeyValue` row), section headers,
  health/connection badges. Composes cleanly as a `KeyValue` value.

```tsx
// web
<KeyValue rows={[
  { key: 'Plan', value: 'Pro' },
  { key: 'Status', value: <StatusDot tone="high" label="Active" pulse /> },
]} />

// native
<KeyValue rows={[
  { key: 'Plan', value: 'Pro' },
  { key: 'Status', value: <StatusDot tone="high" label="Active" pulse /> },
]} />
```

## 7. Accessibility

- **KeyValue web:** real `<dl>`/`<dt>`/`<dd>` — assistive tech reads each key as the term and value as its
  definition. Keep `key` human-readable.
- **KeyValue native:** `<Text>` pairs read in order; no list semantics — add `accessibilityRole` only if needed.
- **StatusDot web:** the dot span is `aria-hidden`; the `label` text carries the meaning. **Always pass `label`
  (or an `aria-label` on the wrapper) when the dot is the only status cue** — color alone is not accessible.
- **StatusDot native:** likewise pass `label`; color-only status fails contrast/colorblind users.

## 8. Usage rules — Do / Don't

**Do**
- Use `KeyValue` for any key↔value fact list; pick `spread` for panels, `inline` for compact inline pairs.
- Put a `StatusDot` in a row's `value` to show liveness alongside a fact.
- Always give a `StatusDot` a `label` (or accessible name) when it conveys required status.

**Don't**
- ✗ Don't hardcode the key mono font, hairline color, or dot tones — they're tokens.
- ✗ Don't convey status by dot **color alone** — pair it with `label`.
- ✗ Don't rely on the native pulse being animated (it's a static glow) for a "live" cue that must visibly move.
- ✗ Don't hand-roll a `<dl>` lookalike or a colored status circle — import `KeyValue` / `StatusDot`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom two-column fact list or a bespoke colored status dot re-creates these primitives
  and will drift from the token tones/dividers — import them.
- **New need → add to BOTH platforms.** A new `StatusDotTone` or a `KeyValue` `align` variant must be added on
  web **and** native (same name, same tokens). Keep native `StatusDot` in its own file but API-identical.
- **Tokens only.** Mint/zone tones, the `7px` glow, the hairline `--border`, and the mono key type are tokens —
  hardcoded equivalents are bugs.
- **Parity gate.** Before shipping, diff the web phone-width and native renders — same row layout, same dot tone
  + label, and accept that the pulse animation is web-only.
