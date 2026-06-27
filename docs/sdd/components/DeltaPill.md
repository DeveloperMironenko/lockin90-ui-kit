# SDD — `DeltaPill` (+ `DeltaDirection`, `DeltaTone`, `DeltaSize` types)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/DeltaPill.tsx` · `packages/ui-native/src/components/DeltaPill.tsx` ·
> web CSS `packages/ui/src/styles/components/deltapill.css` (`.lk-deltapill*`).
> **Exports:** `DeltaPill`, type `DeltaDirection`, type `DeltaTone`, type `DeltaSize`, type `DeltaPillProps`.
> **Status:** Shipped. **Parity:** ✅ identical API & visuals — substrate-only differences (web `currentColor` cascade + `forwardRef` ↔ native per-tone resolved colors + `style`).
> **Stories:** `packages/ui/src/stories/DeltaPill.stories.tsx` · `packages/ui-native/src/stories/DeltaPill.stories.tsx`.

---

## 1. Overview

A **compact directional pill**: an up/down/flat arrow glyph + a signed value (`+12%`, `-3`, `12`), tinted by direction (green up, red down, neutral flat). It's the at-a-glance "change vs last period" chip on KPI tiles, leaderboards, and stat rows.

Three secondary type exports: `DeltaDirection` (`'up' | 'down' | 'flat'`), `DeltaTone` (`'auto' | 'up' | 'down' | 'neutral'`), `DeltaSize` (`'sm' | 'md'`). The arrow direction is **inferred from the numeric sign** of `value` when `direction` is omitted, and the tone is **derived from the direction** when `tone='auto'`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `string \| number` | — (required) | ✓ | ✓ | the signed change to display (e.g. `'+12%'`, `-3`, `12`) |
| `direction` | `DeltaDirection` | inferred from `value` sign | ✓ | ✓ | omit → `inferDirection` (NaN/0 → `flat`, >0 → `up`, else `down`) |
| `tone` | `DeltaTone` | `'auto'` | ✓ | ✓ | `'auto'` derives from `direction`; else force up/down/neutral |
| `size` | `DeltaSize` | `'md'` | ✓ | ✓ | `sm` = tighter padding + 10px label/glyph |
| `iconOnly` | `boolean` | `false` | ✓ | ✓ | render only the arrow glyph, no value text |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLSpanElement>` (web, `Omit<…,'children'>`) | — | ✓ | — | web spreads to the `<span>` |

- **Web:** `forwardRef<HTMLSpanElement>`; renders a `<span>`.
- **Native:** plain function component (no ref); renders a `<View>` pill + `<Text>` value.
- **Inference order:** `direction ?? inferDirection(value)`, then `tone === 'auto' ? TONE_FROM_DIR[dir] : tone`.

## 3. Visual spec (tokens — never hardcode)

| Element | Web (`md`) | Native (`md`) |
| --- | --- | --- |
| Pill | `inline-flex`, gap 5px, padding `4px 11px`, `--r-pill`, 1px border, `--font-mono` 13px 600, tnum | `flexDirection:row`, gap 5, padding `4/11`, `radii.pill`, 1px border, `alignSelf:flex-start` |
| Pill (`sm`) | font 10px, gap 4px, padding `3px 8px` | gap 4, padding `3/8`, value 10px |
| Glyph | `svg` 12px (`sm` 10px), `stroke:currentColor`, width 2.4, round caps | `Svg` 12px (`sm` 10px), `stroke=tone color`, width 2.4, round caps |
| Value | `.lk-deltapill-val` line-height 1 | `fonts.mono` 600, 13px (`sm` 10px) |

**Tone → colors (identical both sides):**

| Tone | Text / glyph | Background | Border |
| --- | --- | --- | --- |
| up | `--zone-high` / `colors.zoneHigh` | `rgba(52,245,197,.10)` | `rgba(52,245,197,.32)` |
| down | `--zone-low` / `colors.zoneLow` | `rgba(255,77,109,.10)` | `rgba(255,77,109,.32)` |
| neutral | `--text-dim` / `colors.textDim` | `--glass` / `colors.glass` | `--border` / `colors.border` |

- **Arrow glyph:** shared path `M12 19V5M5 12l7-7 7 7` (up). `down` flips it vertically — web `transform: scaleY(-1)`, native `matrix(1,0,0,-1,0,24)`. `flat` is a dash `M5 12h14` / `<Line 5,12 → 19,12>`.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Up (positive) | green tint + up arrow | same |
| Down (negative) | red tint + flipped arrow | same |
| Flat (0 / NaN / unparseable) | neutral tint + dash | same |
| Forced `tone` | overrides the auto color | same |
| `iconOnly` | arrow only, no value text | same |
| `sm` | tighter pill, 10px glyph/value | same |

Static, read-only — no hover/focus/disabled.

## 5. Web ↔ native parity

**Verdict: ✅ identical.** Same props, same `inferDirection` + `TONE_FROM_DIR` logic, same arrow path, same `md`/`sm` padding/gap/font sizes, and the **same tone colors** (the rgba tints are matched literals on both sides). Differences are pure substrate:

- **Color application:** web relies on `currentColor` (tone class sets `color`, the glyph inherits it); native has no `currentColor`, so it resolves each tone to explicit `{ color, border, bg }` and passes the color into the glyph. Same result.
- **Glyph flip:** `scaleY(-1)` (CSS) vs `matrix(1,0,0,-1,0,24)` (SVG transform) — same vertical flip.
- **forwardRef / HTML attrs ↔ style:** web forwards a ref + spreads `<span>` attrs; native takes `style`. Universal substrate.

No capability gap; the two pills render identically.

## 6. Composition & usage

- **Used in:** `MetricTile` deltas, leaderboard/stat rows, KPI cards — paired with a number to show its change.
- **Composes from:** none (self-contained pill + inline SVG glyph).

```tsx
// web — auto direction + tone from the value
<DeltaPill value="+12%" />
<DeltaPill value={-3} size="sm" />
<DeltaPill value="0" />            {/* flat, neutral */}

// native — forced neutral tone, icon only
<DeltaPill value="+5" tone="neutral" iconOnly />
```

## 7. Accessibility

- **Web:** renders a `<span>` (not focusable). The arrow `svg` is `aria-hidden`; the **value text carries the meaning**. For `iconOnly`, supply an `aria-label` via `...rest` (e.g. `aria-label="up 12 percent"`) since there's no visible text.
- **Native:** the pill is a non-interactive `View`/`Text`; for `iconOnly`, add an `accessibilityLabel` on a wrapping element (no rest-spread for a11y on the pill itself).
- **Color independence:** direction is conveyed by the **arrow shape** as well as the tint — not color-only (except `iconOnly`, where the label must say it).

## 8. Usage rules — Do / Don't

**Do**
- Let `direction`/`tone` infer from `value` for the common case.
- Use `sm` in dense rows; `md` on cards.
- Pre-format `value` with its sign/unit (`'+12%'`) — `DeltaPill` doesn't format numbers.

**Don't**
- ✗ Don't pass an unsigned magnitude expecting a color — the sign drives inference (a bare `12` infers `up`).
- ✗ Don't use `iconOnly` without an a11y label — the change becomes invisible to AT.
- ✗ Don't hardcode the tint colors — they come from zone/status tokens.
- ✗ Don't hand-roll a change chip — extend `DeltaPill` on both platforms.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom arrow+value chip re-doing the sign inference + tints is a parity violation — import `DeltaPill`.
- **New need → both platforms.** A new tone, size, or glyph ships to web **and** native with the same prop name + tokens (keep the rgba tints matched).
- **Tokens only.** Text/border colors come from `--zone-*` / `--text-dim` / `--border`; the rgba background tints are the canonical matched values — don't invent new ones per call site.
- **Parity gate.** Before shipping, confirm the web phone-width pill ≡ native pill (same value, direction, tone, size) — the visuals are identical, so any mismatch is a real bug.
