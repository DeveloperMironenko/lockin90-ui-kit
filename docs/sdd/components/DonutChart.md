# SDD — `DonutChart` (+ `DonutSegment` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/DonutChart.tsx` · `packages/ui-native/src/components/DonutChart.tsx` ·
> web CSS `packages/ui/src/styles/components/donut.css` (`.lk-donut*`).
> **Exports:** `DonutChart`, type `DonutSegment`, type `DonutChartProps`.
> **Status:** Shipped. **Parity:** ✅ identical API & math — web SVG `<circle>` dashoffset vs native `react-native-svg` `<Circle>` (both rotate −90°); color is `var()` (web) vs hex (native).
> **Stories:** `packages/ui/src/stories/DonutChart.stories.tsx` · `packages/ui-native/src/stories/DonutChart.stories.tsx`.

---

## 1. Overview

A **segmented-donut chart** — an SVG ring split into colored arcs sized by each segment's share of the total, with a small gap between segments, over a faint track ring. The center shows custom `children` or the **summed total**. The macro/breakdown ("Carbs / Protein / Fat") donut is the canonical use.

- Drawn as **stroke-dasharray arcs on a single circle** (radius `r`), rotated −90° so arcs chain clockwise from 12 o'clock.
- `DonutSegment` (an arc descriptor: `value`, `color`, optional `label`) is a secondary export for callers building `segments`.

Distinct from `Ring` (a full-circle single-value 0–100 progress) and `Gauge` (a partial-sweep dial with a scale): `DonutChart` is a **proportional multi-segment** breakdown.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `segments` | `DonutSegment[]` | `DEFAULT_SEGMENTS` (Carbs/Protein/Fat) | ✓ | ✓ | drawn clockwise from 12 o'clock |
| `size` | `number` | `120` | ✓ | ✓ | overall diameter in px |
| `thickness` | `number` | `14` | ✓ | ✓ | ring stroke width in px |
| `gap` | `number` | `2` | ✓ | ✓ | inter-segment gap, in **degrees** (converted to a px arc length) |
| `track` | `string` | `'rgba(255,255,255,0.07)'` | ✓ | ✓ | background ring color |
| `children` | `ReactNode` | — | ✓ | ✓ | center content; omit → summed total is shown |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `CSSProperties` / `StyleProp<ViewStyle>` | — | ✓ | ✓ | wrapper style |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web only |

**`DonutSegment`:** `value: number` (arc ∝ `value / Σvalues`), `color: string` (web `var()`/hex, native hex/rgb), `label?: string` (for a11y / external legends).

- **Geometry (identical both sides):** `c = size/2`, `r = (size−thickness)/2`, `circ = 2πr`. `total = Σmax(0,value) || 1`. `gapPx = (gap/360)·circ`. Each positive segment trims a leading gap (capped at its own length) when there is >1 drawn arc; `strokeDasharray = "len (circ−len)"`, `strokeDashoffset = −(cursor + trim)`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Track ring | `stroke = track` (rgba default) | `stroke = track` |
| Segment arcs | `stroke = segment.color`, `strokeLinecap round` | `stroke = segment.color`, `strokeLinecap round` |
| Rotation | `<g transform="rotate(-90 c c)">` | `<G origin="c,c" rotation={-90}>` |
| SVG depth | `filter: drop-shadow(0 0 6px rgba(0,0,0,.35))` | — (no filter) |
| Center total | `.lk-donut-total` `26px`, `lk-display` (`var(--font-display)`), `ls −.02em`, `var(--text)` | `fonts.display 26px`, lineHeight `26`, `ls −0.5`, `colors.text` |
| Center layout | `.lk-donut-center` absolute inset, col, gap `2px` | absolute fill, col, gap `2`, `pointerEvents="none"` |

- Default segments: web `var(--cyan)/var(--lime)/var(--accent)`, native `colors.cyan/lime/accent` (50/30/20).
- **Web-only motion:** `.lk-donut-seg` animates `stroke-dasharray`/`stroke-dashoffset` `0.7s var(--ease)`. Native has no arc transition.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | track + arcs + center total | same |
| Custom center | `children` replaces total | same |
| Zero/negative segment | filtered from draw (`len ≤ 0` → `null`) | same |
| Single segment | no gap trimmed (`drawn ≤ 1`) | same |
| All zero | `total` floors to `1`; center shows `1` | same |

No hover/focus/disabled — presentational.

## 5. Web ↔ native parity

**Verdict: ✅ identical.** The arc math is byte-for-byte the same (same `c/r/circ/total/gapPx/trim/offset` computation), the same defaults (`size 120`, `thickness 14`, `gap 2`, track rgba), the same clockwise-from-12 layout, and the same round-cap arcs. Substrate-only differences:

- **SVG library:** web `<svg>`/`<circle>` with a `rotate(-90 c c)` group transform + string `strokeDasharray`; native `react-native-svg` `<Circle>` with `<G origin rotation={-90}>` + array `strokeDasharray={[len, circ−len]}`. Same visual.
- **Color literal:** web segment/`track` colors may be CSS `var()`; native needs a resolved hex/rgb (no `var()` in RN SVG). App code reads 1:1.
- **Polish:** web adds a soft `drop-shadow` on the SVG + an arc dasharray transition; native omits both (no cheap RN equivalent) — acceptable, documented.

No capability gap.

## 6. Composition & usage

- **Used for:** macro/nutrient breakdowns, category splits, any small proportional ring with a center total/figure.
- **Composes from:** nothing — leaf primitive. Pass a `GradientText` or `Stat` as `children` for a styled center; build a legend from `KeyValue`/`Chip` using each segment's `label` + `color`.

```tsx
// web
<DonutChart
  segments={[
    { value: 50, color: 'var(--cyan)', label: 'Carbs' },
    { value: 30, color: 'var(--lime)', label: 'Protein' },
    { value: 20, color: 'var(--accent)', label: 'Fat' },
  ]}
  size={120}
/>

// native
<DonutChart
  segments={[
    { value: 50, color: colors.cyan, label: 'Carbs' },
    { value: 30, color: colors.lime, label: 'Protein' },
    { value: 20, color: colors.accent, label: 'Fat' },
  ]}
  size={120}
>
  <Text>1850</Text>
</DonutChart>
```

## 7. Accessibility

- **Web:** the `<svg>` has `role="img"` + an auto-built `aria-label` listing each segment's `label` and rounded percentage (e.g. "Donut chart: Carbs 50%, Protein 30%, Fat 20%."). Always supply `label` on segments so this reads.
- **Native:** no built-in accessibility label — provide an external legend or an `accessibilityLabel` on a wrapping `View`.
- Center total uses `var(--text)`/`colors.text` for contrast; keep custom `children` legible against the surface.

## 8. Usage rules — Do / Don't

**Do**
- Provide `label` on every segment (drives the web a11y label + any legend).
- Keep `gap` small (default `2°`); large gaps eat short segments (trim caps at the segment length).
- Use token colors (`var(--cyan)` / `colors.cyan`) for segments.
- Pass `children` for a custom center figure; omit it to show the summed total.

**Don't**
- ✗ Don't hand-roll a multi-arc SVG ring — use `DonutChart`.
- ✗ Don't pass a CSS `var()` color on native (RN SVG can't resolve it) — pass the hex.
- ✗ Don't use `DonutChart` for a single 0–100 progress — use `Ring`; for a min/max dial use `Gauge`.
- ✗ Don't hardcode the track/segment colors — source them from tokens.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom dasharray ring re-implements this primitive and will drift — import `DonutChart`.
- **New need → add to BOTH platforms.** Need a legend slot, hover tooltip, or animation parity? Add it to web and native with the same prop name + tokens — never a one-off.
- **Tokens only.** Segment/track/center colors must come from `@lockin90/tokens`; hardcoded hexes break on Aurora Flux renames.
- **Parity gate.** Before shipping, confirm the web phone-width and native donuts show the same arcs, gaps, and center — only the color-literal form (`var()` vs hex) may differ.
