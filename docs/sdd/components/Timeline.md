# SDD — `Timeline`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Timeline.tsx` · `packages/ui-native/src/components/Timeline.tsx` ·
> web CSS `packages/ui/src/styles/components/timeline.css` (`.lk-timeline`, `.lk-tl-*`).
> **Exports:** `Timeline`, types `TimelineStatus`, `TimelineItem`, `TimelineProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; platform-shaped impl (web connecting line is a CSS `::before` pseudo vs native an absolutely-positioned `View`; web `<ol>` semantics vs native `View`).
> **Stories:** `packages/ui/src/stories/Timeline.stories.tsx` · `packages/ui-native/src/stories/Timeline.stories.tsx`.

---

## 1. Overview

The **vertical milestone timeline** — the "coming soon" / roadmap component. A column of milestones connected by a vertical line, each with a status dot, a heading, an optional time/date label, a status `Chip`, and optional supporting copy. Three states drive the styling:

- **`done`** — mint-filled dot with a check; the connecting line above fades from mint; chip tone `high`.
- **`now`** — accent-tinted dot containing a `Pulse`; chip tone `accent` ("In progress").
- **`next`** — amber-tinted dot; the body is dimmed (`opacity .82`); chip tone `mid` ("Next").

It is the *only* sanctioned roadmap/milestone primitive — hand-rolling a dotted-line timeline is a parity violation (§9). It composes `Chip` (status pill) and `Pulse` (the live "now" dot).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `items` | `TimelineItem[]` | a 4-milestone roadmap sample | ✓ | ✓ | done → done → now → next |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLOListElement>` (web) · `ViewProps` (native) | — | ✓ | ✓ | spreads to the list root |

**`TimelineItem`:**

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `string` | milestone heading (required) |
| `date` | `string` | optional time/date label, e.g. "Today", "Q3 2026" |
| `description` | `ReactNode` | optional supporting copy |
| `status` | `TimelineStatus` (`'done' \| 'now' \| 'next'`) | defaults to `'next'`; drives dot + chip |
| `statusLabel` | `string` | overrides the chip text (defaults Done / In progress / Next) |

- **Web:** renders an `<ol className="lk-timeline">` of `<li>`; the connecting line is a CSS `::before`.
- **Native:** renders a `View`; the connecting line is an absolutely-positioned `View` in each item's gutter (RN has no pseudo-elements). The status dot is a local `Dot` component.

## 3. Visual spec (tokens — never hardcode)

**Dot** (`.lk-tl-dot` / native `styles.dot`, `28×28`, radius 14):

| Status | Background | Border | Glow |
| --- | --- | --- | --- |
| `done` | `--grad-mint` / `gradients.mint` | transparent | `--glow-mint` / `nativeShadows.glowMint` |
| `now` | `rgba(124,92,255,.14)` | `rgba(124,92,255,.5)` | none (holds a `Pulse`) |
| `next` | `rgba(255,176,32,.12)` | `rgba(255,176,32,.4)` | none |
| default | `--glass-2` / `colors.glass2` | `1px --border-2` / `colors.border2` | none |

- `done` dot holds a `13×13` check `<svg>`/`<Svg>` stroked `#0A0A12`.

**Connecting line:** `2px` wide; default `--border-2` / `colors.border2`; `done` runs `linear-gradient(--mint, --border-2)` (web) / solid `colors.mint` (native). Web `::before` runs `left 13px`, `top 28px → bottom -2px`; native `View` runs `top: DOT_SIZE(28)`, `bottom: -GAP(-22)`, `left 13`. Hidden on the last item.

**Body:**

| Part | Token / value |
| --- | --- |
| Title | `--font-display` / `fonts.display`, `16px`, weight `600` |
| Date | `--font-mono` / `fonts.mono`, `11px`, uppercase, `--text-faint` |
| Description | `13.5px`, `line-height 1.55`, `--text-dim`, `max-width 52ch` (web) |
| Top row | flex, `gap 10px`, `flex-wrap`, `margin-bottom 5px` |
| `next` body | `opacity 0.82` |
| Item spacing | `padding-bottom 22px` (web `0 0 22px 44px`; native `paddingBottom GAP(22)`), last `0` |

- **Date casing:** web uppercases via CSS `text-transform: uppercase`; native uppercases in JS (`date.toUpperCase()`). Same result.

## 4. States

`Timeline` is **non-interactive** (no hover/press/focus/disabled). Its only state axis is each item's `status` (`done`/`now`/`next`, §3), which drives the dot fill, the line fill above, the chip tone, and (for `next`) the dimmed body. The `now` dot animates via the composed `Pulse`.

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped impl.** Identical item model, three-status styling, 28px dots, mint/accent/amber tints, the same `Chip` tones (`high`/`accent`/`mid`) and default labels, the same check glyph, and the same `Pulse` in the `now` dot. By-necessity differences:

- **Connecting line:** web is a CSS `::before` pseudo on each `<li>`; native has no pseudo-elements, so it's an absolutely-positioned `View` in the item gutter (`DOT_SIZE`/`GAP` constants reproduce the same span). Visually identical.
- **Root semantics:** web `<ol>`/`<li>` (ordered-list semantics) vs native `View`s. Substrate only.
- **Description max-width:** web caps at `52ch`; native has no `ch` unit (width is the layout's). Minor, content-shaped.
- **Date casing:** CSS uppercase (web) vs JS `.toUpperCase()` (native) — same output.

No capability gap blocks use.

## 6. Composition & usage

- **Used for:** the marketing/"coming soon" roadmap, onboarding progress narratives, changelog-style milestone lists.
- **Composes:** `Chip` (status pill, `dot`), `Pulse` (the live `now` dot), and an inline check `svg`.
- Pass your own `items`; the default 4-milestone set is a sample.

```tsx
// web
<Timeline
  items={[
    { status: 'done', title: 'Model calibrated', date: 'Shipped', description: 'Trained on real wearable data.' },
    { status: 'now', title: 'Closed beta', date: 'Today', description: 'Polishing with founding athletes.' },
    { status: 'next', title: 'Public launch', date: 'In 2 months', statusLabel: 'Soon' },
  ]}
/>

// native — identical item shape
<Timeline items={roadmap} />
```

## 7. Accessibility

- **Web:** an `<ol>`/`<li>` conveys ordered milestone semantics; dots are `aria-hidden` (decorative); the status is carried in the visible `Chip` text. Headings are `<h3>` — ensure they fit the page's heading hierarchy.
- **Native:** plain `View`s with `Text`; no interactive roles needed (static content). The status reads via the `Chip` label.
- **Contrast:** title `--text`, description `--text-dim`, date `--text-faint`; the dim `next` body (`opacity .82`) stays above text-contrast minimums on the dark surface.
- **Motion:** the `now` dot's `Pulse` is a subtle ambient animation (see `Pulse`'s reduced-motion behavior).

## 8. Usage rules — Do / Don't

**Do**
- Use `Timeline` for any vertical milestone/roadmap list.
- Set `status` per item (`done`/`now`/`next`); use `statusLabel` to relabel the chip.
- Keep one `now` item (the live milestone) for a clear "you are here".

**Don't**
- ✗ Don't hand-roll a dotted-line milestone list — use `Timeline`.
- ✗ Don't re-create the status chip — it's the composed `Chip` with the mapped tone.
- ✗ Don't hardcode the dot tints, mint gradient, or glow — they come from `@lockin90/tokens` (the `rgba(124,92,255,…)`/`rgba(255,176,32,…)` tints exist only because RN/CSS need a literal for the translucent accent/amber and track `--accent`/`--warn`).
- ✗ Don't use `Timeline` for an interactive stepper (`Stepper`) or a per-day schedule (`DayTimelineBlocks`).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom roadmap with a re-created dotted line + status dots is a **parity violation** — it diverges web↔native and breaks on token renames.
- **New need → add to BOTH platforms.** Need a fourth status, a clickable milestone, or a horizontal variant? Add it to `Timeline` on web AND native (same prop, same tokens) — never a one-off.
- **Tokens only.** Dot fills, `--grad-mint`, `--glow-mint`, type, and chip tones come from tokens; never literals.
- **Parity gate.** Before shipping a roadmap screen, confirm the web phone-width and native renders match (same statuses, same dots, same line fills, same chips).
