# Mobile rebuild — required UI-kit primitives (build prompt)

_Generated 2026-06-23 from a section-by-section analysis of all 23 `lockin90-design/mobile/*.html`
mockups against the current `@lockin90/ui-native` + `@lockin90/ui` kit (~90 primitives)._

**Audience:** the UI-kit agent. **Scope:** add the primitives below to **BOTH** packages
(`@lockin90/ui` web + `@lockin90/ui-native` native) with the **same export name, same prop API,
same visuals/tokens** — per the kit's parity rule. Native = StyleSheet + `react-native-svg` +
`expo-linear-gradient` (+ optional-peer pattern in `src/internal/`); web = `lk-*` classes + tsup.
Add a Storybook story for each on both sides; keep `tsc`/build green.

> **Why this doc exists:** the mobile app is rebuilt screen-by-screen using **only kit primitives —
> no app-local/custom primitives**. The mockups are ~92% buildable from the existing kit. The items
> below are the genuine gaps. Everything in §3 is intentionally **NOT** a kit task (app-level
> composition or native-only concern) — do not build those here.

The Aurora Flux design system the mockups use is `lockin90-design/shared/tokens.css` — it already
matches `@lockin90/tokens` (same colors/gradients/radii/fonts). Use existing tokens; hardcode nothing.

---

## 1. MUST-ADD primitives (hard gaps — blocking the mobile rebuild)

### 1.1 — LineChart: confidence **band** + **forecast (dashed)** tail  ·  EXTEND  ·  P0
**The single most-requested gap — appears on 4+ screens.** `LineChart` today has only `area`
(a fill from the line down to the floor). The mockups need an **uncertainty ribbon** between an
upper and lower series, plus a **dashed forecast continuation** of the main line.

**Needed by:**
- `home.calibrating.html` — provisional energy curve with a wide ±band ("~±11 band", "EST").
- `intelligence.html` — **31-day forecast**: solid actual line → dashed forecast line + confidence band + event markers ("Tue Jun 16 dips to 54").
- `health.calibrating.html` / `health.html` — labs trend "optimal band" behind the line.
- `intelligence.html` (sleep) — sleep-debt area is already covered by `area`; the band is the new part.

**Proposed API (extend `LineChartProps`):**
```ts
interface LineChartProps {
  // ...existing (data, axis, color, gradient, area, smooth, height, markers, grid, yAxis, yTicks)...
  /** filled uncertainty ribbon drawn behind the line, on the same y-scale */
  band?: { upper: number[]; lower: number[]; color?: string };
  /** from this data index onward the line renders dashed (forecast continuation) */
  dashedFromIndex?: number;
}
```
**Parity:** web = SVG `<path>` ribbon + `stroke-dasharray` on the tail segment; native = the same via
`react-native-svg` `Path` + `strokeDasharray`. Band fill ≈ line color @ ~12–16% opacity.
**Accept when:** a single `LineChart` renders actual(solid)+forecast(dashed)+band+event markers
identically on web and native, and existing usages (no `band`/`dashedFromIndex`) are unchanged.

> Alternative if you prefer composition over overloading: ship a dedicated **`ForecastChart`**
> wrapping LineChart with `{ actual, forecast, band, events }`. Either is fine — pick one, keep parity.

### 1.2 — MessageBubble  ·  NEW  ·  P0
No chat primitive exists. Needed for **both** chat surfaces.

**Needed by:** `coach-athlete.html` (E2EE coach↔athlete chat), `coach.html` (Aura AI chat).

**Proposed API:**
```ts
interface MessageBubbleProps {
  variant: 'incoming' | 'outgoing';
  children: ReactNode;          // message body (text; allow wrapped nodes)
  meta?: string;               // e.g. "Sofia · 8:02am"
  status?: 'sent' | 'delivered' | 'read';  // outgoing only — small trailing glyph
}
```
**Visuals (from mockup):** incoming = `glass2` + hairline border, left-aligned; outgoing = `accent`
(violet) fill, right-aligned; max-width ~82%; radius `lg` with the tail corner tightened; `meta` is a
small `textDim` line under the bubble. **Parity:** identical alignment/colors web↔native.
**Accept when:** a thread of alternating bubbles + meta + read-status renders identically on both.

---

## 2. RECOMMENDED primitives (composable today, but reused enough to justify — your call)

Each is buildable in-app from existing primitives; promote to the kit only if you want them shared.
If you decline any, say so and the app will compose it locally from the noted primitives.

| # | Primitive | Priority | Needed by | Compose-from alternative | Proposed API (sketch) |
|---|---|---|---|---|---|
| 2.1 | **ChatComposer** | P1 | coach chat, Aura chat | `Input` + icon `Button` (+ lock `Icon`) | `{ onSend(text), placeholder?, e2ee?, disabled? }` |
| 2.2 | **VideoPlayer** | P1 | `training.html` exercise demo (scrubbable playback; `VideoThumbnail` is poster-only) | app-level `expo-video` wrapper | `{ src, poster?, onProgress? }` — wrap `expo-video` via the **optional-peer** idiom (like `expo-blur`) |
| 2.3 | **PasswordStrengthMeter** | P2 | `auth-onboarding.html` register | 4× `BarFill` + label, OR `Meter` w/ segments | `{ score: 0..4, label?, hint? }` |
| 2.4 | **Combobox / Autocomplete** | P2 | `logging.html` food/product search | `SearchInput` + results `ListRow` list in a `Sheet` | `{ value, onSearch, options, onSelect, loading? }` |
| 2.5 | **Slider labeled scale** | P2 | `logging.html` (mood/focus/energy/stress sliders) | label row under `Slider` | EXTEND `Slider` with `labels?: string[]` (rendered under the rail) |

---

## 3. Do **NOT** build in the kit (covered, app-level, or asset-only)

**Already in the kit — reuse as-is (mockups flagged these but they exist):**
- `Hypnogram` (sleep-stage timeline) · `RangeBar` (lab reference ranges) · `PhaseWheel` (cycle wheel) ·
  `Ring`/`Gauge` (energy + macro + recovery rings) · `DonutChart` · `Heatmap` (30-day compliance/journal strips) ·
  `SegmentedTabs` · `CodeInput` (OTP, with paste) · `Stepper`/`ProgressDots` (onboarding + calibration) ·
  `Timeline` (changelog/journal/goals) · `VersionBadge` · `Table` · `Sparkline` · `DeltaPill`.
- **`ProGate` already covers the calibrating "soft-lock" overlay** (`title`/`subtitle` + dimmed `children`).
  Reuse it for "unlocks at day 14" previews on home/health/training/intelligence/social. _If_ you want a
  non-"Pro" alias, add a thin `SoftLock` re-export of ProGate — but no new logic is needed.

**App-level compositions (build in the mobile app from existing primitives — NOT kit primitives):**
- Feed post card, attached progress card (`Card`+`Avatar`+`Ring`/`Icon`+`Stat`).
- Share-card preview/canvas + aspect toggle (`Card`+`Ring`+`SegmentedTabs`+`Toggle`+`ColorPicker`).
- Set/rep logger row (`Input`+`NumberStepper`+`Checkbox`), notification matrix (`Table`+`Toggle`),
  calibration progress block (`Stepper`+`ProgressBar`+`Stat`), quick-log grid, get-started checklist.

**Native-only (app-level, NOT kit):**
- Camera / barcode **viewfinder** for vision scan + nutrition barcode (`expo-camera`); the HUD chrome
  (mode pills, shutter, flip) is `SegmentedTabs`/`Button`/`Icon`.

**Assets, not primitives (track separately):**
- **Icon glyphs to add to the `Icon` set:** 5 mood faces (rough→great), plus any missing stroke glyphs
  the screens use. (These extend `Icon`, they aren't new components.)
- **Provider/brand logos** (Oura, WHOOP, Garmin, Polar, Apple Health, Dexcom, Strava) for data-source
  rows + share-card "data from" badge — supply as `Icon` glyphs or brand assets.

---

---

## ROUND 2 — follow-ups found during the shell+nav build (2026-06-23)

- **`Icon` glyphs: add `home` + `activity` (bar-chart).** The mobile bottom **TabBar** is
  `Today · Calendar · ⊕Log · Coach · Insights`. `calendar`/`plus`/`user` exist, but **Today needs a
  `home` glyph and Insights needs a bar-chart (`activity`)** glyph — both MISSING. Exact mockup paths
  (viewBox `0 0 24 24`, stroke): `home` = `M3 10.5 12 3l9 7.5M5 9v11h5v-6h4v6h5V9`;
  `activity` = `M4 19V11M9 19V5M14 19v-6M19 19V9`. The app renders these via the `ReactNode` icon slot
  meanwhile; move them into the `Icon` set for kit-faithfulness.
- **`TabBar` icon resolver covers only 11 legacy names.** `renderIcon`'s `ICON_NAMES` set is the old
  11 (`back…star`), so passing modern `IconName`s (`calendar`,`user`,…) as **strings** renders them as
  raw text. Either expand `ICON_NAMES` to the full `IconName` union, or document that consumers must pass
  `<Icon>` nodes. (App currently passes nodes — works, but the string API is misleading.)
- **(Optional) `TabBar` elevated center-FAB variant.** The mockup's center "Log" is an elevated gradient
  FAB overhanging the bar. The app composes this from `TabBar` (center spacer) + an overlaid `FAB`
  (works, kit-only). A built-in `centerFab` variant would remove the per-app overlay boilerplate — nice
  to have, not required.

## Summary for the kit agent
- **Build now (P0):** `LineChart` band + dashed-forecast (§1.1), `MessageBubble` (§1.2).
- **Decide (P1–P2):** the 5 in §2 — build in kit or let the app compose them.
- **Add glyphs/assets:** mood faces + provider logos to `Icon`.
- **Don't build:** everything in §3.
- Both platforms, parity-locked, Storybook + green `tsc`/build. When done, the mobile app rebuild
  proceeds with kit-only components.
