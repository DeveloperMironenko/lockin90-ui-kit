# SDD — `PulseStrip` (a.k.a. LiveStatBar) (+ `PulseStripItem` type)

> **Package:** `@lockin90/ui/admin` — web-only operator-console primitive (admin app is web-only). **Import as** `import { PulseStrip } from '@lockin90/ui/admin'`.
> **Source:** `packages/ui/src/admin/PulseStrip.tsx` · web CSS `packages/ui/src/styles/components/pulsestrip.css` (`.lk-pstrip*`); `.lk-pulse` from `packages/ui/src/styles/primitives.css`. NO native counterpart.
> **Exports:** `PulseStrip`, type `PulseStripProps`, type `PulseStripItem`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (admin) — no native surface by design.
> **Stories:** `packages/ui/src/stories/PulseStrip.stories.tsx`.

---

## 1. Overview

The horizontal operational **"live ingest" strip**. A glass bar that, when `live`, shows a pinging
LIVE dot + a row of animated equalizer bars, a set of swatch-dotted mono stats, and an optional
right-aligned slot. When `idle`, the equalizer is frozen + dimmed and the dot stops pinging.
Animation is **pure CSS** (no JS, so no `'use client'`). Matches the `.pulse-strip` from
`lockin90-design/admin/wearables.html`.

The secondary export **`PulseStripItem`** is one labelled stat: a colored `swatch` dot + a mono
`label` + an emphasised mono `value`.

## 2. API contract

**`PulseStripProps`**

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `state` | `'live' \| 'idle'` | — (required) | `live` pings the dot + animates the equalizer; `idle` freezes + dims |
| `items` | `PulseStripItem[]` | — (required) | swatch-dotted stats rendered across the strip |
| `equalizer` | `boolean` | `true` when `live`, `false` when `idle` | show the animated bars (`showEq = equalizer ?? isLive`) |
| `right` | `ReactNode` | — | optional right-aligned slot (queue depth / timestamp / action) |
| `className` | `string` | — | extra classes on the strip root |

**`PulseStripItem`**

| Field | Type | Notes |
| --- | --- | --- |
| `swatch` | `string` | dot color — a token var (e.g. `'var(--ok)'`) or hex; applied as inline `background` |
| `label` | `string` | mono label before the value (e.g. `"p95 ingest"`) |
| `value` | `string` | emphasised mono value (e.g. `"214 ms"`), rendered in a `<b class="lk-mono">` |

- `isLive = state === 'live'`; root gets `is-live` / `is-idle` + any `className`; `role="status"`.
- The LIVE/IDLE indicator: `<span class="lk-pstrip__pi"><span class="lk-pulse" /><b>{LIVE|IDLE}</b> ingest</span>`.
- Equalizer (when `showEq`): a fixed **8-bar** array `EQ_BARS` with per-bar inline `height`
  (`30%…65%`) + `animationDelay` (`0s…0.7s`) — mirrors the mockup's staggered inline values.
- The `right` slot only renders when non-null.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Value / token |
| --- | --- |
| Strip | flex `gap: 18px`, `flex-wrap: wrap`, `padding: 11px 16px`, radius `--r` (16) |
| Live surface | `linear-gradient(90deg, color-mix(--accent 8%, transparent), color-mix(--cyan 5%, transparent))`, `border: 1px solid --border` |
| Idle surface | `background: --glass-2`, `border-color: --border-2` |
| Stat (`__pi`) | inline-flex `gap: 8px`, `--font-mono` 11px, `--text-dim`; `<b>` → `--text` / 600 |
| Swatch dot | `8×8`, `border-radius: 50%`, inline `background` from `item.swatch` |
| Equalizer | `height: 18px`, `gap: 2px`, bottom-anchored |
| EQ bar (`i`) | `width: 3px`, radius `2px`, `background: --grad-cta`, `opacity: .7`, `transform-origin: bottom` |
| Right slot | `margin-left: auto`, `--font-mono` 10.5px, `--text-faint` |
| LIVE dot | `.lk-pulse` — 9×9 `--ok` dot with a `::after` ping (`lk-ping` 1.8s `--ease`) |

- **Animation:** EQ bars run `@keyframes lk-pstrip-bar` (`scaleY .4 ↔ 1`) over `1.4s --ease-soft`
  infinite; per-bar `animation-delay` staggers them.

## 4. States

| State | Behavior |
| --- | --- |
| `live` | `.is-live` gradient surface; `.lk-pulse` pings (`--ok`); equalizer animates (unless `equalizer={false}`) |
| `idle` | `.is-idle` → `--glass-2` surface + `--border-2`; `.lk-pulse` animation off + `--text-faint`; EQ bars frozen `--text-faint`, `opacity: .35`, `scaleY(.55)` |
| Equalizer override | `equalizer` prop forces bars on/off independent of `state` (e.g. `live` without bars) |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` freezes EQ bars (`animation: none`, `scaleY(.7)`) |

`role="status"` makes it a polite live region; the LIVE/IDLE label is real text.

## 5. Platform & relationship to root kit

**Web-only by design.** The live-ingest strip is an operator-console widget with no native surface —
so there is no `@lockin90/ui-native` counterpart and no parity obligation. It is built on web-only
substrate: CSS keyframe animations (the equalizer + the `lk-pulse` ping), `color-mix()` gradient
surfaces, `flex-wrap`, and `prefers-reduced-motion`. It composes no React primitive but **reuses the
root `.lk-pulse`** dot class (from `primitives.css`) for the pinging LIVE indicator and the root
`.lk-mono` text class for the stat values. It is not a wrapper of any root component.

## 6. Composition & usage

- **Used by:** the wearables / data-ingest operator screen as the live status header.
- **Composes:** the shared `.lk-pulse` dot + `.lk-mono` value text (CSS, not React children).

```tsx
import { PulseStrip, type PulseStripItem } from '@lockin90/ui/admin';

const stats: PulseStripItem[] = [
  { swatch: 'var(--ok)',   label: 'p95 ingest', value: '214 ms' },
  { swatch: 'var(--cyan)', label: 'events/s',   value: '1.2k' },
  { swatch: 'var(--warn)', label: 'retries',    value: '3' },
];

<PulseStrip state="live" items={stats} right={<span>queue · 12</span>} />

// frozen / dimmed when ingest is paused
<PulseStrip state="idle" items={stats} />
```

## 7. Accessibility

- The root is `role="status"` (a polite live region) so updates to the strip are announced.
- The LIVE / IDLE label is real visible text — the operational state is never conveyed by the pulsing
  dot or equalizer alone (the `lk-pulse` dot + `__eq` are `aria-hidden`).
- Stat labels and values are real mono text, read in order.
- **Motion:** honors `prefers-reduced-motion` (equalizer freezes), so vestibular-sensitive users
  aren't subjected to the looping animation.

## 8. Usage rules — Do / Don't

**Do**
- Drive `state` from real liveness (`live` only when ingest is actually flowing).
- Source `item.swatch` from token vars (`var(--ok)`, `var(--cyan)`, …) for swatch dots.
- Use `right` for a single secondary readout (queue depth, timestamp) — keep it terse.
- Let `showEq` default off in `idle`; only override `equalizer` for deliberate cases.

**Don't**
- ✗ Don't hand-roll a live equalizer / pulsing-dot bar — use `PulseStrip`.
- ✗ Don't pass a raw hex when a token var exists for the swatch color.
- ✗ Don't hardcode the gradient surface, `--grad-cta` bars, or `--r` radius — they come from tokens.
- ✗ Don't stuff multiple controls into `right`; it is a single faint slot, not a toolbar.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom "LIVE • equalizer • stats" bar will drift from the kit animation +
  surface and miss the reduced-motion + `role="status"` contract — import `PulseStrip`.
- **New need → extend here.** If you need a new stat shape or indicator state, add it to
  `PulseStripItem` / `PulseStripProps` — never a one-off strip.
- **Tokens only.** Surface gradient (`--accent`/`--cyan` mix), bar `--grad-cta`, idle `--glass-2`, and
  swatch colors are `@lockin90/tokens` vars; hardcoded equivalents are bugs.
- **Web-only.** Admin primitive — no native counterpart, no parity to hold.
