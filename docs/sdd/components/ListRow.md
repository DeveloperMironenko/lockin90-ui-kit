# SDD — `ListRow`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/ListRow.tsx` · `packages/ui-native/src/components/ListRow.tsx` ·
> web CSS `packages/ui/src/styles/components/listrow.css` (`.lk-listrow*`).
> **Exports:** `ListRow`, type `ListRowProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; two platform-shaped props (web `onClick` ↔ native `onPress`; native-only `divider` opt-out for the inter-row hairline).
> **Stories:** `packages/ui/src/stories/ListRow.stories.tsx` · `packages/ui-native/src/stories/ListRow.stories.tsx`.

---

## 1. Overview

The kit's **generic tappable list item** — `leading` slot + `title`/`subtitle` stack + `trailing` slot. The building block of pickers, similar-exercise rows, and settings lists. Adjacent rows draw a hairline between them automatically.

- **static** — no handler → renders a plain `<div>` (web) / `View` (native); a read-only row.
- **tappable** — with `onClick`/`onPress` → renders a `<button>` / `Pressable` with a glass hover/press highlight.
- **`active`** — accent-tinted selected state, for the chosen item in a picker.
- **`danger`** — tints the title `--zone-low` (destructive rows, e.g. "Delete account").

It is the *only* sanctioned list-row primitive; hand-rolling a flex row with the same leading/title/trailing layout is a parity violation (§9).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `leading` | `ReactNode` | — | ✓ | ✓ | icon/avatar/badge/letter chip — `flex-shrink: 0` |
| `title` | `ReactNode` | — (required) | ✓ | ✓ | primary line; native renders strings as a 1-line `<Text>` |
| `subtitle` | `ReactNode` | — | ✓ | ✓ | dimmer second line under the title |
| `trailing` | `ReactNode` | — | ✓ | ✓ | chevron/value/icon — pinned right (`margin-left: auto`) |
| **handler** | `() => void` | — | `onClick` | `onPress` | **platform-shaped** — presence makes the row interactive |
| `active` | `boolean` | `false` | ✓ | ✓ | accent-tinted selected state |
| `danger` | `boolean` | `false` | ✓ | ✓ | tints title (and web trailing) `--zone-low` |
| `divider` | `boolean` | `true` | — | ✓ | **native only** — opt-out the top hairline on the FIRST row of a stack |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` minus `title`/`onClick` (web) · `ViewProps` (native) | — | ✓ | ✓ | spreads to the row element |

- **Web:** `forwardRef<HTMLDivElement>`; `Omit<HTMLAttributes, 'title' | 'onClick'>` so `title`/`onClick` are the typed props above. When `onClick` is set it renders a `<button type="button">` with `aria-pressed={active}`.
- **Native:** with `onPress` it renders a `Pressable`; the inter-row hairline is per-row (`divider`, default on) because RN has no sibling (`+`) selectors.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`.lk-listrow`) | Native (`styles.row`) |
| --- | --- | --- |
| Layout | flex row, `gap: 12px`, `padding: 14px`, full width | flex row, `gap: 12`, `paddingVertical/Horizontal: 14`, `borderRadius: radii.sm` |
| Font | `--font-ui` | `fonts.ui` |
| Title | `14.5px`, `line-height 1.25`, `--text` | `14.5`, `lineHeight 18`, `colors.text` |
| Subtitle | `12.5px`, `line-height 1.3`, `--text-dim`, `margin-top 1px` | `12.5`, `lineHeight 16`, `colors.textDim`, `marginTop 1` |
| Trailing | `--text-faint`, `margin-left: auto` | `colors.text*` node, `marginLeft: auto` |
| Inter-row hairline | `1px --border` via `.lk-listrow + .lk-listrow` | `1px colors.border` top border via `divider` (default on) |
| Tappable radius | `--r-sm` | `radii.sm` |
| Hover/press fill | `--glass` (`:hover`/`:focus-visible`) | `colors.glass` (`pressed`) |
| Active fill | `color-mix(--accent 12%, transparent)` | `rgba(124,92,255,0.14)` (RN has no `color-mix`) |
| Danger title | `--zone-low` | `colors.zoneLow` |

- **Active hover (web only):** deepens to `color-mix(--accent 18%, transparent)`.
- **Native active note:** the `rgba(124,92,255,0.14)` is the hardcoded translucent-accent equivalent of web's `color-mix(--accent 12%)` — documented in-source because RN can't `color-mix`.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default (static) | `<div>` / base | `View` / base |
| Tappable rest | `<button>` `.lk-listrow-tappable` | `Pressable` |
| Hover | `:hover`/`:focus-visible` → `--glass`; suppresses the next row's hairline (`+ .lk-listrow` border → transparent) | n/a (no hover) |
| Pressed | `:active` (browser default) | `pressed` → `colors.glass` |
| Focus | `:focus-visible` glass + `outline: none` | platform focus (Pressable) |
| Active (selected) | `.lk-listrow-active` accent tint; `aria-pressed` | `styles.active` accent tint |
| Danger | `.lk-listrow-danger` title + trailing `--zone-low` | title `colors.zoneLow` |

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped impl.** Identical slots, padding, gap, type sizes, active/danger tints. Two by-necessity differences:

- **Handler prop:** web `onClick` vs native `onPress` — the one intentional API split (`onClick` is `Omit`-ed and re-typed on web; native uses RN's `onPress`). App code reads 1:1.
- **Inter-row hairline:** web draws it between siblings with `.lk-listrow + .lk-listrow` (CSS sibling selector); RN has **no sibling selectors**, so native exposes a per-row `divider` boolean (default `true`) — set `divider={false}` on the first row of a stack. This is a substrate-driven API addition, not a visual gap.
- **Hover affordance:** web-only (pointer); native uses press feedback. No blocking gap.

There is **no capability gap** — both render the same row.

## 6. Composition & usage

- **Used in:** pickers (exercise/food search results), settings lists, similar-item rows.
- **Composes:** `leading` typically holds an `Avatar`/`Icon`/`Chip`/letter chip; `trailing` an `Icon name="chevron"` or a value.
- **Stacking:** put rows in a `Card` or plain container — they self-separate. On native, set `divider={false}` on the first row.

```tsx
// web
<ListRow
  leading={<Avatar name="Mia R." size="sm" />}
  title="Mia Rodriguez"
  subtitle="Coach · last active 2h ago"
  trailing={<Icon name="chevron" size={16} />}
  onClick={() => open(user.id)}
/>
<ListRow title="Delete account" danger onClick={confirmDelete} />

// native — first row opts out of the top hairline
<ListRow title="Notifications" subtitle="Push, email" divider={false} onPress={openNotif} active />
<ListRow title="Privacy" onPress={openPrivacy} />
```

## 7. Accessibility

- **Web:** tappable rows are real `<button type="button">` — focusable, Enter/Space activate; `aria-pressed={active}` exposes selection in pickers. Static rows are `<div>` (non-interactive, correct). Provide a meaningful `title`; if `trailing` is the only label, add `aria-label` via rest.
- **Native:** the `Pressable` should carry `accessibilityRole="button"` and an `accessibilityLabel` via rest props; `active` selection should be mirrored with `accessibilityState={{ selected }}` by the consumer.
- **Hit target:** `14px` vertical padding + content yields a ≥44px touch target — safe for mobile.
- **Contrast:** title `--text` and subtitle `--text-dim` both clear text-contrast minimums on the dark surface.

## 8. Usage rules — Do / Don't

**Do**
- Use `ListRow` for every leading + title/subtitle + trailing list item.
- Use `onClick`/`onPress` to make a row tappable; `active` for the selected pick.
- Use `danger` for destructive rows; let it tint the title.
- On native, set `divider={false}` on the first row of a contiguous stack.

**Don't**
- ✗ Don't hand-roll a flex row with the same leading/title/trailing layout — use `ListRow`.
- ✗ Don't pass `onClick` on native or `onPress` on web (wrong-platform prop).
- ✗ Don't stack `Divider`s between rows — rows self-separate.
- ✗ Don't hardcode the active tint, hairline color, or `--zone-low` — they come from tokens.
- ✗ Don't nest a second interactive control inside a tappable (`<button>`) row.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A "settings row" or "picker item" that re-creates the same flex layout + hover tint + hairline is a **parity violation** — it will diverge web↔native and drift on token renames.
- **New need → add to BOTH platforms.** Need a switch-trailing variant, a two-line trailing, or a multi-select check? Add it to `ListRow` on web AND native (same prop, same tokens) — never a one-off.
- **Tokens only.** Padding, gap, type sizes, the accent active tint, and the hairline come from `@lockin90/tokens` — never literals (the native `rgba(124,92,255,0.14)` exists only because RN lacks `color-mix`, and tracks `--accent`).
- **Parity gate.** Before shipping a list screen, confirm the web phone-width rows and the native rows match — same slots, same active/danger tint, same separators.
