# SDD — `EmptyState`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/EmptyState.tsx` · `packages/ui-native/src/components/EmptyState.tsx` ·
> web CSS `packages/ui/src/styles/components/empty.css` (`.lk-empty*`).
> **Exports:** `EmptyState`, type `EmptyStateProps`.
> **Status:** Shipped. **Parity:** ✅ identical API & visuals; the default star glyph is a kit `Icon` (web) vs an inline SVG (native) — same outline.
> **Stories:** `packages/ui/src/stories/EmptyState.stories.tsx` · `packages/ui-native/src/stories/EmptyState.stories.tsx`.

---

## 1. Overview

The kit's **centered zero-state**: a circular glass icon tile, a headline, a supporting sentence, and an optional call-to-action. The single sanctioned "nothing here yet" placeholder — used on empty lists, fresh accounts, and unconfigured surfaces so every empty screen reads the same. A `compact` variant tightens it for in-card placeholders.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `icon` | `ReactNode` | faint star (size 30) | ✓ | ✓ | illustration in the glass tile; web default `<Icon name="star" size={30} />`, native default inline `StarIcon` (24 when `compact`) |
| `title` | `string` | `'Nothing here yet'` | ✓ | ✓ | headline (`font-display`); omitted when `null` |
| `description` | `ReactNode` | `'Once you start logging, this is where it shows up.'` | ✓ | ✓ | supporting sentence; native styles a bare `string` as `Text` |
| `action` | `ReactNode` | — | ✓ | ✓ | CTA, typically a `<Button>`; omitted when absent |
| `compact` | `boolean` | — | ✓ | ✓ | smaller, tighter variant |
| `className` | `string` | — | ✓ | — | web only (merged onto `.lk-empty`) |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | web `HTMLAttributes<HTMLDivElement>` / native `Omit<ViewProps,'children'>` | — | ✓ | ✓ | spread onto the root |

- **Web:** plain function; `<div class="lk-empty">` with tile / title / desc / action children rendered conditionally.
- **Native:** plain function; the default star is the local `StarIcon` (RN-svg) sized by `compact`; `description` accepts a node or a styled `Text`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Layout | `flex column`, centered, `gap 12`, `padding 40px 24px` | `column`, centered, `gap 12`, `40 / 24` |
| Tile | 64×64, radius `20px`, `--glass-2`, `1px --border-2`, `--accent` glyph | 64×64, radius `20`, `colors.glass2`, `1px colors.border2` |
| Title | `--font-display` 700, 17px, `-0.01em`, `--text` | `fonts.display` 700, 17px, `-0.17` ls, `colors.text`, centered |
| Description | `--font-ui` 13.5px / 1.55, `--text-dim`, `max-w 340` | `fonts.ui` 13.5px / 21, `colors.textDim`, `maxWidth 340`, centered |
| Action | `flex-wrap`, centered, `gap 10`, `margin-top 4` | `row`/`wrap`, centered, `gap 10`, `marginTop 4` |
| Default glyph | `Icon name="star"` size 30, `--accent` (stroke currentColor) | `StarIcon` stroke `colors.accent`, sw 1.6 |

- **Compact:** tile → 48×48 radius `15` (both); title → 15px; description → 12.5px; outer `gap 9`, `padding 24px 18px` (native mirrors).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-empty` (tile + title + desc) | base `View` |
| With action | `.lk-empty-action` block rendered | action `View` rendered |
| Compact | `.lk-empty-compact` (smaller tile/type, tighter pad) | `emptyCompact` styles |
| No title / desc | section omitted when prop is `null` | section omitted when `null` |

EmptyState is presentational — no hover/press/focus/loading of its own (its `action` `Button` carries those).

## 5. Web ↔ native parity

**Verdict: ✅ identical API & visuals.** Same prop names/defaults, same five elements (tile → title → description → action), same `compact` deltas, same tokens (glass-2 tile + border-2, accent glyph, display title, dim 13.5px description, 340px desc cap), same 64→48 / 20→15 tile sizing. The only substrate differences:

- **Default star glyph:** web pulls `Icon name="star"`; native draws an inline `StarIcon` SVG. Both are a faint `--accent` star outline — visually equivalent. (Pass your own `icon` to override either.)
- **DOM vs View:** web `<div>` + CSS class; native `View` + `StyleSheet`. No behavioral difference.

No capability gap — EmptyState renders identically on both platforms.

## 6. Composition & usage

- **Composes from:** `Icon` (web default star); the `action` slot typically holds a `Button` (`primary` CTA).
- **Used by:** empty lists/tables (`Table` empty body), zero-data dashboards, fresh-account screens, in-card placeholders (`compact`).

```tsx
// web
<EmptyState
  icon={<Icon name="calendar" size={30} />}
  title="No workouts yet"
  description="Log your first session to start tracking."
  action={<Button variant="primary" onClick={start}>Log a workout</Button>}
/>

// native — compact in-card
<EmptyState compact title="No notes" description="Add one to remember the session." />
```

## 7. Accessibility

- **Web:** semantic text (`div`/`p`); the decorative tile is `aria-hidden`. The `action` `Button` carries its own focus/label. No live-region needed (static placeholder).
- **Native:** the tile glyph is decorative (no `accessibilityLabel`); title/description are plain `Text` read in order; the `action` `Button` is the focusable target.
- **Contrast:** title is full `--text`; description `--text-dim` at 13.5px stays legible. The glyph is decorative, so its faint `--accent` is fine.

## 8. Usage rules — Do / Don't

**Do**
- Use `EmptyState` for every "nothing here" surface so they read consistently.
- Give a concrete, encouraging `description` and a single `action` to break the empty state.
- Use `compact` inside cards/tiles; full size for full-page empties.
- Override `icon` to match the surface (calendar, chart, etc.).

**Don't**
- ✗ Don't hand-roll a centered "no data" block — use `EmptyState`.
- ✗ Don't hardcode the tile size/radius, glass, accent glyph, or type — tokens.
- ✗ Don't stuff multiple CTAs — keep one primary `action`.
- ✗ Don't pass `className` on native or `style` on web (wrong-platform prop).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke "empty" layout will drift from the tile/type scale and break the web≡native read. Import `EmptyState`.
- **New need → both platforms.** A new layout (e.g. an inline/left-aligned variant) or a secondary action must be added to `EmptyStateProps` on web **and** native with the same names/tokens.
- **Tokens only.** Tile glass/border, accent glyph, display title, and dim description all come from `@lockin90/tokens`.
- **Parity gate.** Before shipping, confirm the web phone-width empty state and native match (same icon, title, description, action, compact-ness).
