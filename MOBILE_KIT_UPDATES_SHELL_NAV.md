# Kit updates needed — from the mobile shell+nav build (round 2)

_Filed 2026-06-23 while building the mobile app shell + bottom navigation against the current kit.
Audience: the UI-kit agent. Apply to **BOTH** `@lockin90/ui` (web) + `@lockin90/ui-native` (native),
same export name / prop API / visuals, Storybook on both, `tsc`+build green. Tokens only — no hardcoded values._

> Context: the mobile bottom nav must be **100% identical** to `lockin90-design/mobile/home.html` `.tabbar`
> (`Today · Calendar · ⊕Log · Coach · Insights`) and is built **kit-only** (`TabBar` + `FAB` + `Icon`).
> The app already composes the elevated FAB and renders the two missing glyphs via the `ReactNode` icon slot,
> so it works today — these updates make the nav fully kit-native and remove app-side workarounds.

---

## 1. `Icon` — add 2 glyphs  ·  P0  ·  (the only blocker for kit-faithful nav)
Add to the `IconName` union + the `Icon` glyph map, on web and native, matching the existing
stroke style (viewBox `0 0 24 24`, ~2px stroke, `round` caps/joins, `currentColor`/`color` prop):

| name | purpose | exact path `d` (from the mockup) |
|---|---|---|
| `home` | bottom-nav **Today** tab | `M3 10.5 12 3l9 7.5M5 9v11h5v-6h4v6h5V9` |
| `activity` | bottom-nav **Insights** tab (bar-chart) | `M4 19V11M9 19V5M14 19v-6M19 19V9` |

**Accept when:** `<Icon name="home" />` and `<Icon name="activity" />` render on web + native, tinting via the
existing `color` prop. (After this lands, the app drops its inline-SVG fallback in `components/AppTabBar.tsx`.)

## 2. `TabBar` — icon resolver covers the full `IconName` set  ·  P1
`renderIcon` in `TabBar` (native `packages/ui-native/src/components/TabBar.tsx`, mirror on web) gates
string→`<Icon>` resolution on a hardcoded **11-name** `ICON_NAMES` set (`back…star`). So passing a modern
`IconName` like `'calendar'`/`'user'`/`'home'`/`'activity'` as a **string** falls through and renders as raw
text. Fix: resolve against the **full `IconName` union** (e.g. reuse the icon map's keys) instead of the
hardcoded 11. Keep the `ReactNode` slot working for custom nodes.

**Accept when:** `items={[{icon:'home',label:'Today'}, {icon:'calendar',label:'Calendar'}, …]}` renders the
shared icons tinted to active/inactive automatically — no need to pass `<Icon>` nodes.

## 3. `TabBar` — optional elevated center-FAB variant  ·  P2 (nice-to-have)
The mockup's center "Log" is an **elevated energy-gradient FAB** overhanging the bar top (`margin-top:-24`),
with the label below it. The app composes this from `TabBar` (center slot = spacer) + an overlaid `FAB`
(works, kit-only). A built-in variant would remove that per-app boilerplate, e.g.:
```ts
interface TabBarProps {
  // ...existing...
  /** index of the item rendered as an elevated center FAB (gradient, overhangs the bar top) */
  fabIndex?: number;
  /** press handler for the FAB item (falls back to onChange(fabIndex)) */
  onFabPress?: () => void;
}
```
**Accept when:** `<TabBar items={5} fabIndex={2} … />` renders the elevated gradient FAB at slot 2 overhanging
the bar, label beneath, matching `home.html .tabbar .tab.fab`. (If declined, the app keeps composing it — say so.)

---

## Summary
- **P0:** add `Icon` glyphs `home` + `activity` (exact paths above) — both platforms.
- **P1:** make `TabBar` resolve the full `IconName` set (not just 11 legacy names).
- **P2 (optional):** `TabBar` elevated center-FAB variant.
- Parity-locked, Storybook + green `tsc`/build. When done, the mobile nav is fully kit-native (no app-side
  inline-SVG / FAB-overlay workarounds).
