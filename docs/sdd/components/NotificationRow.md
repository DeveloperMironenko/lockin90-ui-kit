# SDD — `NotificationRow`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — cross-platform primitive.
> **Source:** `packages/ui/src/components/NotificationRow.tsx` · `packages/ui-native/src/components/NotificationRow.tsx` · web CSS `packages/ui/src/styles/components/notification.css` (`.lk-notif*`).
> **Exports:** `NotificationRow`, type `NotificationRowProps`.
> **Status:** Shipped (web). Native twin implemented to this same contract (`onPress` in place of `onClick`).
> **Parity:** 🟢 same API, structure & visuals — the only difference is the handler name (web `onClick` ↔ native `onPress`) and the substrate (`<button>`/`<div>` ↔ `Pressable`/`View`).
> **Stories:** `packages/ui/src/stories/NotificationRow.stories.tsx` · native `NotificationRow` story.

---

## 1. Overview

A single **notification list item** for the notifications feed: an unread accent **dot**, an optional typed **leading icon**, a **title** with a **right-aligned relative time**, and an optional **body** snippet beneath. Stacked rows draw a hairline between them.

It's the sanctioned notification row — never hand-roll a dot + title + time layout. It is the notification-specific sibling of `ListRow` (generic leading/title/subtitle/trailing): `NotificationRow` bakes in the unread dot + right-aligned relative time + read/unread tint that a notifications feed needs.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `title` | `string` | — (required) | ✓ | ✓ | primary headline line |
| `time` | `string` | — (required) | ✓ | ✓ | right-aligned relative timestamp (e.g. `"2h"`, `"Yesterday"`) — **pre-formatted by the caller** |
| `body` | `string` | — | ✓ | ✓ | optional dimmer snippet under the title |
| `unread` | `boolean` | `false` | ✓ | ✓ | shows the accent dot + faint accent tint + bolder title |
| `icon` | `IconName` | — | ✓ | ✓ | optional typed leading glyph from the shared `Icon` set |
| `onClick` | `() => void` | — | ✓ | — | **web** tap handler — renders the row as a `<button>` when set |
| `onPress` | `() => void` | — | — | ✓ | **native** tap handler — renders a `Pressable` when set |
| `className` | `string` | — | ✓ | — | web only — merged onto `.lk-notif` via `cn` |
| _rest_ | web `Omit<HTMLAttributes<HTMLDivElement>,'title'\|'onClick'>` · native `ViewProps` | — | ✓ | ✓ | spread onto the root |

- **Web:** with `onClick` it renders an interactive `<button type="button">` (hover/focus bg); without it, a static `<div>`. `title` is omitted from the spread `...rest` (it's a first-class prop, not the DOM `title` attribute).
- **Native:** with `onPress` it renders a `Pressable`; without it, a `View`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`.lk-notif*`) | Native |
| --- | --- | --- |
| Row | flex row, `align-items: flex-start`, `gap 12px`, `padding 14px`, full width | row, top-aligned, `gap 12`, `padding 14` |
| Row hairline | `.lk-notif + .lk-notif { border-top: 1px --border }` | 1px `colors.border` between rows |
| Unread dot | `8×8`, `--r-pill`, `--accent` + `0 0 8px` accent glow, `margin-top 5px`; read → `visibility: hidden` (slot kept) | `8×8` accent dot + glow; read → hidden slot |
| Leading icon | `16px`, `--text-faint`, `margin-top 1px` | `16` `colors.textFaint` |
| Title | `--font-ui`, 14px, `1.3` lh, `--text`; unread → 600 | `fonts.ui` 14, `colors.text`; unread → 600 |
| Time | `--font-mono`, 11px, `--text-faint`, `nowrap`, pinned right (`margin-left: auto`) | `fonts.mono` 11, `colors.textFaint`, right |
| Body | 12.5px, `1.35` lh, `--text-dim`, `margin-top 2px` | 12.5, `colors.textDim` |
| Unread tint | `color-mix(--accent 6%, transparent)` bg | equivalent `rgba` accent tint |
| Tappable hover/focus | `--glass` bg (unread: `--accent 10%`), `--r-sm`, `outline:none` | `Pressable` pressed bg |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Read | no dot (hidden slot), plain title, no tint | same |
| Unread | accent dot + glow, bolder title, faint accent tint | same |
| With icon | leading glyph shown before the title column | same |
| No body | single title line + time | same |
| Tappable | `<button>` — hover/focus bg | `Pressable` — pressed bg |
| Static | `<div>` — no interaction | `View` |

## 5. Web ↔ native parity

**Verdict: 🟢 parity.** Same props (`title`/`time`/`body`/`unread`/`icon`), same layout (dot · icon · title+time head · body), same unread treatment (dot + glow + tint + bolder title), same right-aligned mono time, same typed `Icon`. Substrate-only differences:

- **Handler name:** web `onClick` ↔ native `onPress` — the documented, kit-wide convention (see `ListRow`, `LockedRow`); callers read 1:1.
- **Element:** web `<button>`/`<div>` ↔ native `Pressable`/`View`.
- **Tint literals:** web uses `color-mix(--accent …)`; native uses the equivalent `rgba` accent tint — same rendered color.

No capability gap.

## 6. Composition & usage

- **Used in:** the notifications feed / inbox screen (web + native); stacked in a scroll list.
- **Composes:** `Icon` (typed leading glyph); otherwise a leaf primitive.
- **Caller formats `time`** — pass a display string (`"2h"`, `"Yesterday"`, `"Mar 3"`); the row does not format timestamps.

```tsx
// web
<NotificationRow
  title="New PR on Bench Press"
  time="2h"
  body="You hit 102 kg — a new personal record."
  unread
  icon="star"
  onClick={openNotification}
/>

// native — same API, onPress
<NotificationRow title="New PR on Bench Press" time="2h" unread icon="star" onPress={openNotification} />
```

## 7. Accessibility

- **Web:** a tappable row is a real `<button>` (keyboard-focusable, Enter/Space activate) with a `:focus-visible` bg; a static row is a plain `<div>`. The unread dot is `aria-hidden` (decorative) — encode "unread" in the accessible name upstream if it must be announced.
- **Native:** a tappable row is a `Pressable` with `accessibilityRole="button"`; pass an `accessibilityLabel` combining title + time when needed.
- **Color:** unread is signalled by the dot **and** the bolder title + tint — not color alone.
- **Contrast:** title is full `--text`; the faint `time` and dimmer `body` are intentional de-emphasis (supplementary, not the sole content).

## 8. Usage rules — Do / Don't

**Do**
- Use `NotificationRow` for every notifications-feed item; stack them for the auto hairline.
- Pre-format `time` to a short relative string.
- Use `unread` to drive the dot + tint + bolder title together (one flag).
- Provide `onClick`/`onPress` only when the row navigates/acts.

**Don't**
- ✗ Don't hand-roll a dot + title + right-time row — import `NotificationRow`.
- ✗ Don't pass a `Date` to `time` — format it upstream.
- ✗ Don't hardcode the accent dot/tint, fonts, radius, or hairline — they come from `@lockin90/tokens`.
- ✗ Don't use `ListRow` for notifications when you need the unread dot + relative time — that's this primitive.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A per-screen notification row re-does the dot/tint/time layout and will drift — use `NotificationRow`.
- **New need → add to BOTH platforms.** A new field (e.g. an avatar leading slot, a swipe action, a grouped header) is a prop added to web AND native with the same name + tokens — never a one-off.
- **Tokens only.** The accent dot/glow/tint, mono time, radius, and hairline are all tokens — no literals.
- **Parity gate.** Confirm the web phone-width row ≡ native row (same dot, icon, title, time, body, tint) before shipping the notifications feed.
