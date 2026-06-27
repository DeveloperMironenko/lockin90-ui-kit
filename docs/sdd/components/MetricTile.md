# SDD — `MetricTile` (+ `ProgressDots` cross-ref)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/MetricTile.tsx` · `packages/ui-native/src/components/MetricTile.tsx` ·
> web CSS `packages/ui/src/styles/components/metric.css` (`.lk-metric*`, `.lk-dots`/`.lk-pdot`).
> **Exports:** `MetricTile`, `ProgressDots`, type `MetricDeltaTone`, `MetricTileProps`, `ProgressDotsProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; native `MetricTile` has **no `empty`/`hint` mode**, and `ProgressDots` is non-`aria` on native.
> **Stories:** `packages/ui/src/stories/MetricTile.stories.tsx` · native equivalent.

---

## 1. Overview

The kit's **self-contained KPI tile**: a glass card with a mono uppercase `label`, an optional faint top-right
`icon`, a big display `value` + small `unit`, and an optional tone-colored **delta pill**. It's the admin
KPI / vitals stat-cell. Where `Stat` is a bare layout-free block, `MetricTile` brings its own border + padding
+ pill, so it stands alone in a grid.

- **Default** — label · value · unit · delta pill (tone `up`/`down`/`flat`).
- **Empty** (web only) — `empty` swaps the value for an em-dash `—`, drops the unit + pill, shows `hint`.

**`ProgressDots`** (same file, exported alongside) is a flex row of segment dots showing progress — e.g. the
onboarding "calibration" day-dot row: filled dots glow in `color`, the rest stay faint, the current dot is
slightly larger. Documented here because it ships from `MetricTile.tsx`.

## 2. API contract

**`MetricTile`**

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `label` | `string` | `'Followers'` | ✓ | ✓ | mono uppercase caption |
| `value` | `ReactNode` | `'1.2k'` | ✓ | ✓ | big display number |
| `unit` | `string` | — | ✓ | ✓ | small suffix (`'%'`, `'pts'`); renders only when non-null |
| `delta` | `string` | — | ✓ | ✓ | signed change shown as a pill; renders only when non-null |
| `deltaTone` | `MetricDeltaTone` = `'up' \| 'down' \| 'flat'` | `'flat'` | ✓ | ✓ | colors the pill: up=mint, down=rose, flat=faint |
| `icon` | `ReactNode` | — | ✓ | ✓ | faint top-right corner glyph |
| `empty` | `boolean` | — | ✓ | ✗ | **web only** — em-dash placeholder, no unit/pill |
| `hint` | `string` | — | ✓ | ✗ | **web only** — helper line in empty mode |
| `className` | `string` | — | ✓ | — | web only |
| `style` / _rest_ | `HTMLAttributes<HTMLDivElement>` (web) / `ViewProps` (native) | — | ✓ | ✓ | spread onto root |

**`ProgressDots`**

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `total` | `number` | `14` | ✓ | ✓ | number of segment dots (floored, ≥0) |
| `filled` | `number` | `5` | ✓ | ✓ | how many are on (clamped 0…total) |
| `color` | `string` | web `'var(--accent)'` / native `colors.accent` | ✓ | ✓ | filled-dot color + glow |
| `className`/`style`/_rest_ | `HTMLAttributes` (web) / `ViewProps` (native) | — | ✓ | ✓ | web also sets `--lk-dot-color` CSS var from `color` |

## 3. Visual spec (tokens — never hardcode)

**MetricTile** — web `.lk-metric` / native `styles.tile`:

| Aspect | Value (web ↔ native) |
| --- | --- |
| Card | `padding 14px`, `--r-sm`/`radii.sm` (10), `1px --border`/`colors.border`, `--glass`/`colors.glass` bg, `gap 6px` |
| Label | `--font-mono`/`fonts.mono`, 10.5px, 500, uppercase, `.16em`/`1.68` tracking, `--text-faint`/`colors.textFaint` |
| Icon | `--text-faint`, `opacity .8`, top-right (`justify-content: space-between`) |
| Value | `--font-display`/`fonts.display` 700, 24px, `-0.02em`/`-0.48` tracking, `--text`/`colors.text`, baseline-aligned |
| Unit | `--font-ui`/`fonts.ui`, 12px, 500, `--text-dim`/`colors.textDim` |
| Delta pill | `padding 2px 7px`, `--r-sm`, `--font-mono` 11px 500; up `--zone-high` @12% bg, down `--zone-low` @12% bg, flat `--text-faint` on `--glass-2` |

**ProgressDots** — web `.lk-dots`/`.lk-pdot` / native `styles.dots`/`styles.dot`:

| Aspect | Value |
| --- | --- |
| Row | flex, `flex-wrap`, `gap 6px` |
| Dot (off) | 8×8, `border-radius 999`, `--border-2`/`colors.border2` |
| Dot (on) | fill `color` + glow (web `box-shadow 0 0 8px` @55%; native `shadowRadius 6`, `shadowOpacity .8`) |
| Dot (current) | `transform: scale(1.35)` (`.lk-pdot-now` / `dotNow`) |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-metric` | base View |
| Delta up/down/flat | `.lk-metric-delta-{up\|down\|flat}` | `DELTA[tone]` color+bg map |
| Empty | `.lk-metric-empty` → em-dash + `.lk-metric-hint`, no unit/pill | **not supported** |
| Dot filled / current | `.lk-pdot-on` / `.lk-pdot-now` | inline glow / `dotNow` |
| Hover / focus / press | none (presentational) | none |

`.lk-pdot` transitions background/box-shadow/transform over `0.18s ease` on web; native is static.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, two platform gaps.** Card chrome, type scale, delta-pill tones, and the dot
row are identical token-for-token. Differences:

- **`empty`/`hint` (MetricTile):** web-only zero-data mode; native has neither prop. A native screen needing
  the placeholder must branch in app code, or `empty` should be **added to the native tile** for parity.
- **`ProgressDots` semantics:** web sets `role="progressbar"` + `aria-valuemin/max/now`; native has no
  accessibility role. Visually identical; the gap is SR semantics only.
- Delta-pill backgrounds: web `color-mix(in srgb, … 12%, transparent)`; native uses literal
  `rgba(52,245,197,0.12)`/`rgba(255,77,109,0.12)` — same rendered tint, different substrate.

No blocking gap for the populated tile; flag the missing native `empty` mode + dots `aria` before shipping a
native screen that depends on them.

## 6. Composition & usage

- **Used in:** admin/dashboard KPI grids, vitals stat cells, onboarding calibration progress (`ProgressDots`).
- **Composes from:** `Icon` (passed into `icon`); otherwise a leaf primitive.
- For a bare number without the card chrome, use `Stat`.

```tsx
// web
<MetricTile label="MRR" value="2.4k" unit="$" delta="+8%" deltaTone="up" icon={<Icon name="billing" />} />
<MetricTile label="Sessions" value="—" empty hint="No sessions logged yet" />
<ProgressDots total={14} filled={5} color="var(--accent)" />

// native
<MetricTile label="MRR" value="2.4k" unit="$" delta="+8%" deltaTone="up" icon={<Icon name="billing" />} />
<ProgressDots total={14} filled={5} />
```

## 7. Accessibility

- **MetricTile web/native:** presentational text; the mono label provides context for the value. No interactive
  role — don't wrap it in a button unless the whole tile is a real action (then add `accessibilityRole`).
- **ProgressDots web:** exposes `progressbar` with `aria-valuemin=0`, `aria-valuemax=total`, `aria-valuenow=filled`
  — a screen reader announces "5 of 14". **Native lacks this** — add `accessibilityRole="progressbar"` +
  `accessibilityValue` if the dots convey required state.
- **Contrast:** faint label is intentional de-emphasis; keep `value` the high-contrast focal element.

## 8. Usage rules — Do / Don't

**Do**
- Use `MetricTile` as the single self-contained KPI atom in admin/dashboard grids.
- Drive the delta color with `deltaTone`, not a pre-colored string.
- Use `ProgressDots` for discrete step/day progress (calibration); use a `ProgressBar`/`Ring` for continuous %.
- On web, use `empty`+`hint` for the zero-data tile.

**Don't**
- ✗ Don't hardcode the card padding/radius, label tracking, value font, or pill tints — all are tokens.
- ✗ Don't pass `filled > total` expecting overflow — it's clamped.
- ✗ Don't rely on native `empty`/`hint` or native `ProgressDots` `aria` (both unbuilt) without adding them first.
- ✗ Don't hand-roll a delta pill — use `delta`/`deltaTone`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom glass-card-with-a-number-and-a-pill re-creates `MetricTile` and will drift from the
  token tints/type scale — import it.
- **New need → add to BOTH platforms.** Want `empty` or a new `deltaTone` on native? Add the prop/tone to the
  native component (same name, same tokens) — never a one-off.
- **Tokens only.** The 12% delta tints, `--r-sm` radius, and display/mono type are tokens; hardcoded equivalents
  are bugs even when visually identical.
- **Parity gate.** Before shipping, diff the web phone-width tile vs native — same label, value, unit, pill tone,
  and (for dots) same filled count + glow.
