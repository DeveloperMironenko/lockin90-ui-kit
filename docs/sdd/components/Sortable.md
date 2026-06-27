# SDD — `Sortable` (+ `SortableItem` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Sortable.tsx` · `packages/ui-native/src/components/Sortable.tsx` ·
> web CSS `packages/ui/src/styles/components/sortable.css` (`.lk-sortable*`).
> **Exports:** `Sortable`, type `SortableItem`, type `SortableProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & `onReorder` contract; platform-shaped reorder mechanics (web pointer-drag + keyboard ↑/↓ · native gesture-drag + visible up/down buttons).
> **Stories:** `packages/ui/src/stories/Sortable.stories.tsx` · `packages/ui-native/src/stories/Sortable.stories.tsx`.

---

## 1. Overview

A **drag-to-reorder list**, dependency-free. Each row gets a grip handle; dragging it reorders the list and
commits the new order via `onReorder(nextIds)`. Both platforms also provide a non-drag reorder path for
accessibility: **web** moves a focused handle with **↑/↓**; **native** renders **up/down chevron buttons** on
every row.

`SortableItem` is `{ id: string; node: ReactNode }` — `id` is the React key **and** the value reported back
in `onReorder`; `node` is the row content (the handle/controls are added by `Sortable`). Reach for it for
ordering CMS blocks, nav items, list rows, playlist entries. (A nested `SortableTree` is explicitly deferred —
see the `TODO nested` note in both files.)

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `items` | `SortableItem[]` | — (required) | ✓ | ✓ | ordered rows (`{ id, node }`) |
| `onReorder` | `(nextIds: string[]) => void` | — (required) | ✓ | ✓ | full id list in the **new** order after a move |
| `handle` | `boolean` | `true` | ✓ | ✓ | drag only by the grip; `false` → whole-row drag (web) / long-press anywhere (native) |
| `disabled` | `boolean` | `false` | ✓ | ✓ | rows render but can't be moved |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>` | — | ✓ | — | web only |

- Both share a `move(list, from, to)` helper; `onReorder` always receives the **ids** (not items), in order.
- **Web** keeps live `dragIndex`/`overIndex` refs so window `pointermove`/`pointerup` handlers (added once)
  never go stale. **Native** keeps a `dragIndexRef` + measured `rowHeightRef` for a single stable
  `PanResponder`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`sortable.css`) | Native (`StyleSheet`) |
| --- | --- | --- |
| List | `flex column`, gap `6px`, `--font-ui` | `gap 6`, full width |
| Row | `--r-sm`, `--glass`, `1px --border`, pad `4px`, gap `10px` | `radii.sm`, `colors.glass`, `1px colors.border`, pad `4` (`pr 6`), gap `10` |
| Dragging | `opacity .55`, `--border-2`, `--elev-1` lift | `opacity .85`, `--border-2`, `--glass-2` |
| Handle | `28×28`, `--r-sm`, `--text-faint`; hover `--glass-2`/`--text-dim`; focus ring `color-mix(--accent 50%)` | `28×28`, `Icon name="grip" 18` `--text-faint` |
| Content | `flex:1`, `--text` | `flex:1`, string/number → `--font-ui` `14.5` `--text` |
| Drop indicator | `2px` `--accent` line, `--r-pill`, `--glow-accent` at the target gap | n/a (live neighbor swap instead) |
| Up/down ctrl | n/a (keyboard) | `28×28` `Icon name="chevron"` `--text-dim`, rotated ∓90°; disabled `opacity .35` |
| Disabled | row `opacity .6`, `cursor:not-allowed` | row `opacity .6` |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Idle | `.lk-sortable-row` | `styles.row` |
| Handle hover/focus | `:hover` tint; `:focus-visible` accent ring (keyboard target) | n/a (press) |
| Dragging | `.lk-sortable-dragging` (dim + lift) + drop indicator at `overIndex` | `dragging` (dim) — neighbors swap live as finger crosses half-row |
| Keyboard move | ↑/↓ on focused handle → `commit(i, i∓1)` | n/a |
| Button move | n/a | up/down chevrons → `reorder(i, i∓1)` (bounds-guarded) |
| Whole-row drag | `handle={false}` → `.lk-sortable-row--draggable` (`cursor:grab`) | `handle={false}` → long-press anywhere arms drag |
| Disabled | `.lk-sortable-disabled` | `disabledRow` + disabled controls |

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped reorder.** Identical props, `SortableItem` shape, `move` helper, and
the single `onReorder(nextIds)` contract. The mechanics differ by substrate — both fully reorder:

- **Drag engine:** web Pointer Events (`pointerdown` on handle → window `pointermove`/`up`, geometry via
  `getBoundingClientRect`, a drop indicator marks the gap); native a long-press-armed `PanResponder` that
  swaps neighbors live by `dy / rowHeight`. Web computes the final index once on drop (`rawTo > from ? rawTo-1
  : rawTo`); native swaps incrementally.
- **Accessible/secondary path:** web = **keyboard ↑/↓** on a focused handle (+ a visually-hidden hint
  `Press Arrow Up or Arrow Down to reorder.`); native = **always-present up/down chevron buttons** per row.
  These are the same intent expressed for each platform's input model.
- **`handle={false}`:** web makes the whole row a grab surface; native makes a long-press anywhere arm the
  drag (chevrons unaffected).
- **Web-only:** `className` + rest; **native-only:** the visible reorder buttons + grip `Icon` sizing.

No capability gap that blocks use — both reorder reliably and emit the same `onReorder` payload.

## 6. Composition & usage

- **Composes:** `Icon` (`grip`, and `chevron` on native). Row `node` is consumer-supplied content.
- **Used by:** CMS block ordering, nav/menu ordering, reorderable settings lists, playlist/queue rows.

```tsx
// web
<Sortable items={rows.map((r) => ({ id: r.id, node: <Row data={r} /> }))}
  onReorder={(ids) => persistOrder(ids)} />

// native
<Sortable items={rows.map((r) => ({ id: r.id, node: <Row data={r} /> }))}
  onReorder={(ids) => persistOrder(ids)} />
```

## 7. Accessibility

- **Web:** each handle is a `<button aria-label="Reorder item">` linked to a visually-hidden hint via
  `aria-describedby`; ↑/↓ move the item and `:focus-visible` shows an accent ring. The list is `role="list"`,
  rows `role="listitem"`; indicators/hint are `aria-hidden`/sr-only.
- **Native:** the grip is `accessibilityRole="button"` "Drag to reorder"; the fallback buttons are labelled
  "Move up" / "Move down" with `hitSlop`, and disable at the list ends — the screen-reader-friendly reorder
  path (no gesture required).
- **Hit target:** handles + buttons are 28px with `hitSlop` (native) — touch-adequate.

## 8. Usage rules — Do / Don't

**Do**
- Give every item a **stable `id`**; persist the order from `onReorder(nextIds)`.
- Keep `handle={true}` (default) when rows contain other interactive controls.
- Rely on the keyboard (web) / up-down buttons (native) for accessible reordering.

**Don't**
- ✗ Don't reorder `items` yourself from internal state — drive order from the `onReorder` ids (controlled).
- ✗ Don't build a nested/tree reorder on top — `SortableTree` is deferred; ship flat order.
- ✗ Don't hardcode row/handle/indicator chrome — tokens only.
- ✗ Don't assume a drop-indicator line on native (it swaps live) or chevron buttons on web (it uses keyboard).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled drag list (or pulling in `react-dnd`/`react-sortablejs`) is a parity +
  dependency violation — import `Sortable`.
- **New need → both platforms.** Multi-select drag, drag handles-per-section, or tree nesting must be added
  to `Sortable` on web **and** native with the same `onReorder` contract.
- **Tokens only.** Row `--glass`/`--border`, drag lift `--elev-1`, indicator `--accent` + `--glow-accent`,
  focus ring is an accent `color-mix`.
- **Parity gate.** Confirm web phone-width and native renders match (rows, handle, reorder affordances) and
  that `onReorder` is wired identically before shipping.
