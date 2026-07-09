# SDD — `SankeyChart`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/SankeyChart.tsx` · `packages/ui-native/src/components/SankeyChart.tsx` ·
> no web CSS partner — every visual is an inline SVG attribute/style (`styles/` is frozen; the root class `lk-sankey` is a hook only).
> **Exports:** `SankeyChart`, types `SankeyChartProps`, `SankeyVariant`, `SankeyRibbonStyle`, `SankeyNode`, `SankeyLink`, `SankeyFactor`, `SankeyChord`.
> **Status:** Built — not yet re-exported from `src/index.ts` (index wiring lands with the charts-program batch). **Parity:** 🟡 same API & geometry; `shine`/glow is CSS `blur`/`drop-shadow` on web vs Gaussian-blurred duplicate shapes on native (`FeGaussianBlur`, real RN-SVG Fabric filters).
> **Stories:** `packages/ui/src/stories/SankeyChart.stories.tsx` (`Charts/SankeyChart`) · `packages/ui-native/src/stories/SankeyChart.stories.tsx` (`Native/SankeyChart`).

---

## 1. Overview

The **catalog sankey/flow family** (`lockin90-design/charts/sankey-charts.html`, SK-01…SK-13) — "where the energy goes" for product surfaces. Two forms in one component: **flow variants** draw 2 (or 3, with `stages`) node columns in the fixed **320×150 viewBox**, joined by cubic-bezier ribbons whose end heights are fractions of the node faces (the catalog's `usedIn`/`usedOut` slot bookkeeping keeps parallel ribbons stacked cleanly); **`chord-factors`** (SK-13) puts factor nodes on a circle with strength-weighted chords through the center, glow dots and chip labels. Every variant ships its catalog card as default data, so a bare `<SankeyChart variant="…"/>` reproduces the design page.

Catalog-ID mapping:

| Catalog ID | `variant` | Card props (see stories) |
| --- | --- | --- |
| SK-01 duo-flow | `'duo-flow'` (default) | 2×2 trio-colored flow · `ribbonStyle` SELECT `solid/spectrum/glass/gradient` |
| SK-02 source-split | `'source-split'` | one `--accent` source → 3 targets |
| SK-03 merge-flow | `'merge-flow'` | 3 inputs → one `--mint` outcome |
| SK-05 zone-outcomes | `'zone-outcomes'` | HABITS/SLEEP → GOOD/OK/ROUGH (`--zone-*` targets) |
| SK-06 three-stage | `'three-stage'` | `stages` + `preLinks` — sources → stages → outcomes |
| SK-09 highlight-path | `'highlight-path'` | `highlight` defaults to `1` — one ribbon 85%, rest 14% |
| SK-10 labeled-nodes | `'labeled-nodes'` | per-node `label` chips on both columns |
| SK-11 thin-streams | `'thin-streams'` | 4 hued sources → ENERGY/LOST (LOST = `--text` @ 25%) |
| SK-13 chord-factors | `'chord-factors'` | `factors` + `chords` · title `'FACTOR LINKS · 30D'` |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `SankeyVariant` (9 catalog names) | `'duo-flow'` | ✓ | ✓ | SK-01 … SK-13 |
| `sources` | `SankeyNode[]` | variant's catalog card | ✓ | ✓ | left column (flow variants) |
| `targets` | `SankeyNode[]` | variant's catalog card | ✓ | ✓ | right column |
| `stages` | `SankeyNode[]` | `three-stage` card only | ✓ | ✓ | middle column — SK-06 |
| `links` | `SankeyLink[]` | variant's catalog card | ✓ | ✓ | sources→targets, or stages→targets when `stages` set |
| `preLinks` | `SankeyLink[]` | `three-stage` card | ✓ | ✓ | sources→stages, drawn first so mid offsets line up |
| `factors` | `SankeyFactor[]` | SK-13 card (5 factors) | ✓ | ✓ | `chord-factors` circle nodes |
| `chords` | `SankeyChord[]` | SK-13 card (7 links) | ✓ | ✓ | `chord-factors` center links |
| `ribbonStyle` | `'solid' \| 'spectrum' \| 'glass' \| 'gradient'` | `'solid'` | ✓ | ✓ | the SK-01 SELECT (see §3) |
| `highlight` | `number \| null` | `1` for `highlight-path`, else off | ✓ | ✓ | link index at 85%, rest 14%; `null` disables |
| `ribbonOpacity` | `number` | `0.4` links / `0.35` preLinks | ✓ | ✓ | overridden by `highlight`/`glass`/`gradient` paint |
| `title` | `string` | `'ENERGY FLOW · TODAY'` (chord: `'FACTOR LINKS · 30D'`) | ✓ | ✓ | faint mono caption, top-left |
| `showLabels` | `boolean` | `true` | ✓ | ✓ | chip-pill node labels (left/right columns; factor chips) |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow underlay behind ribbons/chords (catalog blur modifier) |
| `width` / `height` | `number` | `320` / `150` | ✓ | ✓ | rendered px — the viewBox scales to fit (not fluid) |
| `ariaLabel` | `string` | generated from variant + node labels | ✓ | ✓ | web `aria-label` / native `accessibilityLabel` |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-sankey` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, wrapper `View` style |
| _rest_ | `Omit<SVGProps<SVGSVGElement>, 'width' \| 'height' \| 'children' \| 'color' \| 'opacity'>` | — | ✓ | — | spreads to the root `<svg>` |

**`SankeyNode`** — `{ value: number; color?: string; label?: string }`: `value` is the node's relative share of its column (heights normalized against the column sum); `color` defaults down the mint/cyan/violet TRIO by index; omitted `label`s fall back to the catalog defaults (`SLEEP/TRAINING/NUTRITION/LIGHT` left, `ENERGY/STRAIN/FOCUS` right; single-node columns read `TODAY`/`ENERGY`).
**`SankeyLink`** — `{ from, to, fromSize, toSize, color? }`: `fromSize`/`toSize` are **fractions (0–1) of the node heights**; ribbons consume face slots in array order. `color` defaults to the source node color.
**`SankeyFactor`** — `{ label: string; color?: string }` (SPECTRUM fallback). **`SankeyChord`** — `{ from, to, strength }`; `strength` × 0.9 = stroke width.

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14`. Node stacks run `TOP 20 → BOT 132` (`SPAN 112`) with **8px gaps**, heights ∝ `value/Σ`; nodes are **8×h rects, rx 3** at x **12** (left), **156** (mid), **298** (right). Ribbons leave the source's right face (`x + 8`) and land on the target's left face as closed cubic beziers with both control points at the mid-x.

| Element | Spec (both platforms) |
| --- | --- |
| Title | `--font-mono` / `fonts.mono`, 8.5px, tracking `.06em` (native `0.5`), `--text-faint`, start-anchored at (12, 11) |
| Node colors | `color` else TRIO `--mint/--cyan/--violet` by index (SPECTRUM for factors) — tokens only |
| Ribbons | fill = link `color` else source node color; opacity **0.4** (preLinks **0.35**, both via `ribbonOpacity`) |
| `ribbonStyle` (SK-01 SELECT) | `solid` src-colored 40% · `spectrum` `--lime→--magenta` by link index · `glass` `--text` @ **0.14** · `gradient` per-link `linearGradient` src→dst, stops @ **0.55**, path opacity 1 (gradient paint wins over the highlight dim, per the catalog renderer) |
| Highlight (SK-09) | `highlight` link at **0.85**, all others **0.14** |
| Chips (catalog `tag()`) | rect w `len·5.35+12`, h 13, rx 6.5, fill `--bg-0` @ 78% (web `color-mix`, native `${colors.bg0}C7`), stroke = chip color @ 0.35, width 0.8; centered **8px** mono text (tracking `.05em` / native `0.4`); x clamps into the padded box. Left chips start-anchored at node x+14, right chips end-anchored at node x−6, y = node center |
| Chord (SK-13) | circle at (160, 83) r 46, stroke `--text` @ 7% (the catalog's white-7%), width 1; factors every `360/n`° from 12 o'clock; chords `M p1 Q center p2`, stroke = **source** factor color, width `strength × 0.9`, round caps, opacity **0.3**; dots r 5 + glow; chips at r 59, middle-anchored |
| Shine | web: blurred clone under each ribbon (`blur(6px)` @ 0.35; chords `blur(5px)`, width +4, @ 0.3; factor dots `drop-shadow(0 0 4px color)` always); native: **Gaussian-blurred duplicates** (`FeGaussianBlur`) — ribbon fill re-drawn @ 0.35 (`stdDeviation 3`), chords width +4 @ 0.3 (`stdDeviation 2.5`), factor dots r 5 @ 0.55 (`stdDeviation 2`) under the r 5 dot |
| White-alpha mapping | catalog `rgba(8,10,18,…)` → `--bg-0`/`colors.bg0` alphas; `rgba(255,255,255,…)` → `--text`/`colors.text` alphas (chord ring 7%, SK-11 LOST 25%, glass 14%) |
| Sizing | fixed `width`/`height` px on the `<svg>`/`Svg` (default 320×150); native wraps in a `View` of the same size |

Highlighted-dim ribbons are excluded from the shine underlay on both platforms (`shine && !dimmed` — the catalog's `highlight == null || fi === highlight` gate).

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks (`useId` only, for gradient ids).

| State | Behavior |
| --- | --- |
| Default | variant's catalog card renders with no data props |
| Empty (`links: []`) | nodes + labels only — no ribbons, no crash |
| Zero column sum | guarded (`sum \|\| 1`) — nodes collapse to 0 height, no NaN |
| `highlight: null` | disables the `highlight-path` default dim — all ribbons at base opacity |
| `showLabels: false` | node/factor chips removed; title stays |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical types, catalog demo data, geometry (`stack`/`ribbonPath`/`polar` are line-for-line the same math), colors, chip math, draw order and label fallbacks. The real differences:

- **Shine/glow substrate** — web blurs a duplicate path (`filter: blur(6px)`, chords `blur(5px)`, dot `drop-shadow`); native blurs **duplicate shapes** with real `FeGaussianBlur` filters (ribbon fill dup `stdDeviation 3`, chord +4 `stdDeviation 2.5`, dot `stdDeviation 2`; see CONVENTIONS.md). Slightly softer edges on web; does not block use.
- **Label styling channel** — web sets `fontFamily`/`letterSpacing` via inline `style` on `<text>` (`.06em`/`.05em`); native passes `letterSpacing` props on `Svg.Text` (`0.5`/`0.4`).
- **Alpha tokens** — web `color-mix(in srgb, var(--x) N%, transparent)`; native 8-digit hex (`${colors.bg0}C7`, `${colors.text}12/40`). Same resolved colors.
- **Container** — web bare `svg[role=img]` + `className`/rest; native `View accessibilityRole="image"` wrapping the `Svg`.

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically placed inside a `Card`/`MetricTile` body. Flow surfaces: inputs→outcomes attribution ("where the day's energy went"), habit→outcome quality, pipeline views (events → effects → score), factor-correlation systems view (SK-13).

```tsx
// web — SK-05: real day data into zone outcomes
<SankeyChart variant="zone-outcomes" title="HABITS → OUTCOMES · 30D"
  sources={[{ value: habitShare, color: 'var(--cyan)', label: 'HABITS' },
            { value: sleepShare, color: 'var(--violet)', label: 'SLEEP' }]}
  targets={zoneTargets} links={zoneLinks} />
```

```tsx
// native — SK-13: identical props
<SankeyChart variant="chord-factors" title="FACTOR LINKS · 30D"
  factors={factors} chords={correlations.map((c) => ({ from: c.a, to: c.b, strength: c.r * 10 }))} />
```

## 7. Accessibility

- **Web:** root `<svg role="img" aria-label={ariaLabel}>`; the default label is generated from the variant + resolved node labels (e.g. `"zone-outcomes flow: HABITS, SLEEP to GOOD, OK, ROUGH"`); pass a data-bearing `ariaLabel` when the numbers matter.
- **Native:** wrapper `View` with `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}` (same generated default).
- Non-interactive — no focus/keyboard surface. In-chart text is 8/8.5 viewBox px; at the default 320px render that's actual size — keep the chart ≥ ~300px wide or carry the conclusion in surrounding real text.
- Color is a primary channel (`zone-outcomes` verdicts, source hues) — the chip labels are the text backup; don't disable `showLabels` when the mapping is load-bearing.

## 8. Usage rules — Do / Don't

**Do**
- Express flows as **fractions of node faces** (`fromSize`/`toSize` 0–1) — the component never rescales raw units; normalize first.
- Keep link order meaningful: ribbons consume each node face top-down in array order.
- Use `stages` + `preLinks` together for 3-column pipelines (SK-06); `links` then read stages→targets.
- Override colors with **tokens only** (`var(--cyan)` / `colors.cyan`).
- Reproduce catalog cards from the story files when checking parity.

**Don't**
- Don't pass raw magnitudes as `fromSize`/`toSize` — they are fractions, not values.
- Don't fake the SK-09 emphasis with per-link opacity hacks — that's `highlight`.
- Don't hand-position labels — per-node `label` + `showLabels` is the only labeling channel (chip math is the catalog's).
- Don't mix `ribbonStyle` overrides with semantic variants (zones, thin-streams) — the SELECT belongs to SK-01's neutral duo-flow.
- Don't hardcode the white alphas — LOST/chord-ring/glass are `--text` @ 25/7/14% inside the component.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled sankeys.** Any node-column flow or factor-chord diagram on a product surface is this component — never a local SVG lookalike.
- **New variant → both platforms.** A new flow form (e.g. vertical sankey) is added here, web + native in the same unit of work, with the same prop name — never a one-off in an app.
- **Tokens only** — TRIO/SPECTRUM/zone/text/border tokens throughout; the catalog's chip/ring/sink alphas are expressed **through** tokens (`--bg-0` @ 78%, `--text` @ 7/14/25%) inside the component, never in app code.
- **Don't re-derive the geometry** (stack gaps, face-slot bookkeeping, bezier control points, chord polar math) in app code — the component is the single source of the catalog spec.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `sankey-charts.html`.
