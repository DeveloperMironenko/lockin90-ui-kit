# SDD — `DayTimelineBlocks` (+ `DayBlock`)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/DayTimelineBlocks.tsx` · `packages/ui-native/src/components/DayTimelineBlocks.tsx` ·
> web CSS `packages/ui/src/styles/components/daytimeline.css` (`.lk-daytl*`).
> **Exports:** `DayTimelineBlocks`, type `DayTimelineBlocksProps`, type `DayBlock`.
> **Status:** Shipped. **Parity:** 🟡 same API/layout (pure % positioning matches 1:1); web adds a block hover + a white now-pin center that native omits.
> **Stories:** `packages/ui/src/stories/DayTimelineBlocks.stories.tsx` · native equivalent.

---

## 1. Overview

A horizontal **24-hour activity rail**. A glass track spans `startHour..endHour` and carries absolutely-positioned rounded **color blocks** (each placed by its start/end hour as `left%` + `width%` of the span). It optionally shows faint **hour gridlines** with mono clock labels (every 6h, edges included) and a bright **"now" marker** (a vertical line + glowing dot at the current hour).

It exists to render a day's events/segments as one compact strip — the design's `.tl-track / .tl-block / .tl-now / .tl-axis` visual — with **no client JS** for layout (positions are pure inline percentages). Reach for it on dashboards/day views to show "what happened across the day" identically on web and native.

Secondary export: `DayBlock` (`{ start, end, label?, color? }`).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `blocks` | `DayBlock[]` | sample work-day (5 blocks) | ✓ | ✓ | each placed by `start`/`end` hour; zero/negative-width blocks skipped |
| `now` | `number` | — | ✓ | ✓ | current hour → vertical "now" marker; omit to hide |
| `startHour` | `number` | `0` | ✓ | ✓ | rail start |
| `endHour` | `number` | `24` | ✓ | ✓ | rail end; `span = endHour − startHour` (min 1) |
| `height` | `number` | `44` | ✓ | ✓ | rail height px (web → `--tl-h`) |
| `hourTicks` | `boolean` | `true` | ✓ | ✓ | gridlines + mono axis labels every 6h |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` (native) / `CSSProperties` (web) | — | ✓ | ✓ | merged after the per-instance `--tl-h` var on web |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>, 'children'>` | — | ✓ | — | web spreads onto the wrapper |

- `DayBlock.color` accepts any CSS color / token var (web) or color string (native); defaults to `--accent` / `colors.accent`.
- Web extends `Omit<…, 'children'>` (it has no children slot); native is `style`-only.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native | Value |
| --- | --- | --- | --- |
| Track radius | `--r-sm` | `radii.sm` | `10` |
| Track fill | `--glass` | `colors.glass` | `rgba(255,255,255,.045)` |
| Track border | `--border`, 1px | `colors.border`, 1px | `rgba(255,255,255,.09)` |
| Track height | `--tl-h` (default `44px`) | `height` prop | clips blocks (`overflow:hidden`) |
| Gridline | 1px `--border` | 1px `colors.border` | faint vertical |
| Block inset | `top/bottom: 4px` | `top/bottom: 4` | — |
| Block radius | `6px` | `6` | — |
| Block padding | `0 7px` | `paddingHorizontal: 7` | — |
| Block default fill | `--accent` | `colors.accent` | `#7C5CFF` |
| Block label | `11px`, weight 600, `rgba(8,10,18,.92)` | same | dark-on-color, truncates |
| Now line | `2px`, `--accent`, `box-shadow 0 0 8px rgba(124,92,255,.8)` | `2`, `colors.accent`, `shadowRadius 4` | `top:-6px → bottom:0` |
| Now dot | `::before` 10px circle + glow; `::after` 4px **white** pin | `nowDot` 10px circle + glow (no white pin) | accent glow |
| Axis tick | `9.5px`, `--text-faint`, centered (edges clamped) | `9.5px` `fonts.mono`, `colors.textFaint` | mono clock label |
| Root gap | `8px` | `8` | column (rail over axis) |

- **Sample default blocks:** Commute (`--indigo`), Deep work (`--mint`), Meetings (`--violet`), Break (`--warn`), Deep work (`--mint`) — so the component renders something standalone. Native uses the same colors from `@lockin90/tokens`.
- `hourLabel` formats `0→12am`, `12→12pm`, `13→1pm`; `tickHours` steps every 6h and always includes both edges.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-daytl` rail + blocks | `View` rail + blocks |
| Block hover | `:hover` → `filter: brightness(1.2)` + raise (`z-index:5`) | n/a (no hover) |
| `now` set | vertical line + glowing dot + white center pin | line + glowing dot (no pin) |
| `now` unset | marker hidden | hidden |
| `hourTicks={false}` | no gridlines/labels | no gridlines/labels |
| Empty (`blocks=[]`) | bare rail (+ ticks) | bare rail (+ ticks) |
| Reduced motion | block hover transition is decorative only | n/a |

## 5. Web ↔ native parity

**Verdict: 🟡 same API, same layout math, two web-only decorations.** Both place blocks/gridlines/now-marker with **identical percentage math** (`pct(h) = (clamp(h)−startHour)/span`), so the strip lays out 1:1. Same `DayBlock` shape, same defaults, same `hourLabel`/`tickHours` logic (duplicated verbatim).

Real differences (neither blocks use):

- **Block hover:** web has `:hover { filter: brightness(1.2) }` + raise; native has no hover (pointerless). No press feedback either — blocks are non-interactive.
- **Now-marker pin:** the web now-dot has a 4px **white** center pin (`::after`); native's `nowDot` is the accent circle + glow only.
- **Axis edge handling:** web centers ticks with `translateX(-50%)` and clamps the first/last; native flushes the first label left / last right and centers the middle ones with a fixed 40px box. Same rendered positions.

No genuine capability gap — the rail is fully equivalent on both platforms.

## 6. Composition & usage

- **Composes from:** nothing (primitive); native reads `colors`/`fonts`/`radii` from `@lockin90/tokens`.
- **Used by:** day-view / dashboard surfaces showing a day's segmented activity (work blocks, sleep/wake, logged sessions).

```tsx
// web
<DayTimelineBlocks
  startHour={6}
  endHour={22}
  now={14.25}
  blocks={[
    { start: 9, end: 10.5, label: 'Deep work', color: 'var(--mint)' },
    { start: 12, end: 12.75, label: 'Break', color: 'var(--warn)' },
  ]}
/>

// native
<DayTimelineBlocks
  startHour={6}
  endHour={22}
  now={14.25}
  blocks={[
    { start: 9, end: 10.5, label: 'Deep work', color: colors.mint },
    { start: 12, end: 12.75, label: 'Break', color: colors.warn },
  ]}
/>
```

## 7. Accessibility

- **Web:** the wrapper is `role="img"` with an `aria-label` summarizing the span + block count (e.g. *"Activity timeline from 6am to 10pm, 2 blocks"*). Gridlines, now-marker and per-block `title` are decorative; blocks expose their label via `title` tooltip.
- **Native:** the rail is a decorative `View`; block `Text` labels are the readable content. (No `accessibilityLabel` on the root — consider mirroring the web summary.)
- **Contrast:** in-block labels use a near-black `rgba(8,10,18,.92)` against bright block colors for legibility on the spectrum palette.

## 8. Usage rules — Do / Don't

**Do**
- Express block times in **hours** on the same `[startHour, endHour]` rail (e.g. `9`, `12.5`).
- Color blocks from spectrum/zone tokens to stay on-palette.
- Pass `now` only when "current time" is meaningful (today's view) — omit it for historical days.
- Use `hourTicks` to give the rail an axis; turn it off only in very tight layouts.

**Don't**
- ✗ Don't pass blocks outside `[startHour, endHour]` expecting overflow — they're clamped to the rail.
- ✗ Don't hardcode the track glass/border, now-marker color, or label color — they're tokens.
- ✗ Don't rebuild a day rail with absolute divs — import `DayTimelineBlocks`.
- ✗ Don't rely on hover (web-only) to reveal a label — keep labels in-block or in a sibling list.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-positioned day strip will drift from the shared percentage math and break web ≡ native. Import the primitive.
- **Layout math stays shared.** `pct`, `tickHours`, `hourLabel` must remain identical across the twins — that's what guarantees identical placement. Change both in one unit of work.
- **New need → both platforms.** A new feature (e.g. block click-through, stacked lanes) is added with the same prop name + tokens on web **and** native, never one-off.
- **Tokens only.** Track surface, border, accent now-marker, and label color come from `@lockin90/tokens`; the dark-on-color label `rgba(8,10,18,.92)` is the single sanctioned literal (present identically in both twins).
