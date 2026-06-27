# SDD — `Table`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Table.tsx` · `packages/ui-native/src/components/Table.tsx` ·
> web CSS `packages/ui/src/styles/components/table.css` (`.lk-table*`).
> **Exports:** `Table`, types `TableColumn`, `TableProps`.
> **Status:** Shipped. **Parity:** 🟡 same core API (columns/rows/sort/select) over different substrates (web `<table>` sticky header vs native flex `View`s in a horizontal `ScrollView`); **row tone + expandable detail rows are web-only**.
> **Stories:** `packages/ui/src/stories/Table.stories.tsx` · native equivalent.

---

## 1. Overview

The **glass data table** — the base atom for admin + CMS lists. Columns are defined declaratively; each row is a
`Record<string, ReactNode>` read by `col.key`. Core capabilities (both platforms): mono-uppercase header,
hairline-separated rows that light up on interaction, per-column alignment, opt-in `mono`/tabular-numeric
columns, a `dense` mode, click-to-activate rows, **sortable** headers, and **selectable** rows (leading
checkbox + select-all). Web adds two enhancements not yet on native: **per-row status tint** (`rowTone`) and
**expandable detail rows** (`expandable`/`renderDetail`).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `columns` | `TableColumn[]` | billing sample | ✓ | ✓ | see `TableColumn` below |
| `rows` | `Record<string, ReactNode>[]` | sample 4 | ✓ | ✓ | cell value = `row[col.key]` |
| `onRowClick` | `(row, index) => void` | — | ✓ | ✓ | makes rows clickable (web also keyboard-activatable) |
| `dense` | `boolean` | — | ✓ | ✓ | tighter vertical padding |
| `sortKey` | `string` | — | ✓ | ✓ | key of the active sorted column (brightens) |
| `sortDir` | `'asc' \| 'desc'` | `'asc'` | ✓ | ✓ | direction of the active column |
| `onSort` | `(key) => void` | — | ✓ | ✓ | fired by a sortable header click/press |
| `selectable` | `boolean` | `false` | ✓ | ✓ | leading checkbox column + select-all header |
| `rowKey` | `(row, index) => string` | `(_, i) => String(i)` | ✓ | ✓ | stable selection/expansion key |
| `selectedKeys` | `string[]` | — | ✓ | ✓ | controlled selection set |
| `onSelectionChange` | `(keys: string[]) => void` | — | ✓ | ✓ | next selection set |
| `rowTone` | `(row, index) => 'ok' \| 'warn' \| 'danger' \| undefined` | — | ✓ | ✗ | **web only** — per-row status tint; falls back to `row._tone` |
| `expandable` | `boolean` | `false` | ✓ | ✗ | **web only** — adds a leading chevron column |
| `renderDetail` | `(row, index) => ReactNode` | — | ✓ | ✗ | **web only** — full-width detail panel under an expanded row |
| `expandedKeys` | `(string \| number)[]` | — | ✓ | ✗ | **web only** — controlled expansion set |
| `onExpandedChange` | `(keys) => void` | — | ✓ | ✗ | **web only** — next expansion set |
| `className` / _rest_ | `TableHTMLAttributes<HTMLTableElement>` | — | ✓ | — | web only (spread onto `<table>`) |

**`TableColumn`:** `key: string`, `header: string`, `align?: 'left' \| 'right' \| 'center'`,
`width?` (web `string` e.g. `'120px'`/`'20%'` · native `number` px), `mono?: boolean`, `sortable?: boolean`.

- **Web:** real `<table>`/`<thead>/<tbody>`; sortable header = an inner `<button>`; expand toggles
  `stopPropagation` so they never fire `onRowClick`. Selection is controlled-only (`selectedKeys`); expansion is
  controlled (`expandedKeys`) **or** falls back to internal `useState`.
- **Native:** no `<table>` — `ScrollView horizontal` → `View` table → header `View` + a `Pressable`/`View` per
  row; cells flex by column (`flex:1` or fixed `width`); checkbox column is its own `Pressable` so it captures
  the touch.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`.lk-table*`) | Native (`StyleSheet`) |
| --- | --- | --- |
| Table type | `--font-ui`, 13px, `--text` | `fonts.ui` |
| Header | `position: sticky; top:0`, `--font-mono` 10px 500 uppercase `.12em`, `--text-faint`, `1px --border` bottom, `--glass-2` bg + `backdrop-filter: blur(8px)` | `fonts.mono` 10px 500 `letterSpacing 1.2` `colors.textFaint`, `colors.glass2` bg, `1px colors.border` bottom (no blur) |
| Active header | `.lk-table-th-active` → `--text` | `thActive` → `colors.text` |
| Cell padding | th `9px 12px`, td `10px 12px`; dense `6px 10px` | cell `10/12`, dense `8/10` |
| Row divider | `1px --border` bottom; last row none | `1px colors.border`; `rowLast` none |
| Hover (web) | `.lk-table-row:hover` → `--glass` | n/a — `pressed` → `colors.glass` |
| Selected row | `.lk-table-row-selected` → `--glass` | `rowSelected` → `colors.glass` |
| Mono column | `--font-mono`, `tabular-nums`, `--text` | `fonts.mono`, `fontVariant:['tabular-nums']`, `colors.text` |
| Sort icon | inline SVG chevron pair; active → `--accent` | `react-native-svg` same paths; stroke `colors.accent`/`colors.textFaint` |
| Row tone (web) | `.lk-table-row-{ok\|warn\|danger}` → 90° fade `--ok`/`--warn`/`--bad` @6% + `inset 3px 0` accent bar | — |
| Expanded (web) | `.lk-table-row-expanded` `rgba(124,92,255,.05)`; detail `.lk-table-detail-inner` 16px pad, accent-tinted band | — |

Glyphs share geometry: sort up `M7 10l5-5 5 5` / down `M7 14l5 5 5-5`; web expand chevron `M6 9l6 6 6-6`
rotates 180° when open.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Row hover | `:hover` → `--glass` | n/a (no hover) |
| Row clickable | `.lk-table-clickable` cursor + `tabIndex=0` + Enter/Space → `onRowClick` | `Pressable` `pressed` glass; no keyboard |
| Row selected | `.lk-table-row-selected` + `aria-selected` | `rowSelected` tint |
| Header sorted | `.lk-table-th-active` + `aria-sort` + accent chevron | `thActive` + accent chevron |
| Row tone | `ok`/`warn`/`danger` wash + left bar | **not supported** |
| Row expanded | chevron flips, accent tint, detail row | **not supported** |
| Sort focus (web) | `.lk-table-sort:focus-visible` underline | n/a |

## 5. Web ↔ native parity

**Verdict: 🟡 — same core contract, different substrate, plus web-only enhancements.** Columns, rows, alignment,
`mono` columns, `dense`, `onRowClick`, sorting (`sortKey`/`sortDir`/`onSort`), and selection
(`selectable`/`selectedKeys`/`onSelectionChange` + select-all) all exist on both, with identical sort glyphs and
checkbox column. Differences:

- **Substrate:** web is a semantic `<table>` with a `position:sticky` blurred header; native has no `<table>`, so
  it's flex `View`s wrapped in a **horizontal `ScrollView`** for overflow, with no sticky header and no
  `backdrop-filter` blur. Cells `numberOfLines={1}` (truncate) on native vs `white-space: nowrap` on web.
- **Web-only features:** `rowTone` status tints and the whole `expandable`/`renderDetail`/`expandedKeys`/
  `onExpandedChange` detail-row system are **not implemented on native** — a real feature gap. A native list that
  needs row tinting or expandable detail must compose it manually, **or these should be ported to native** to
  restore parity (recommended before any screen depends on them cross-platform).
- **Keyboard:** web rows are Enter/Space-activatable; native has press only.

Use is not blocked for the shared feature set; flag the missing native row-tone/expandable before relying on them.

## 6. Composition & usage

- **Used in:** admin user/billing lists, CMS content tables, any data-dense list surface.
- **Composes from:** `Checkbox` (selection column), inline SVG sort/expand glyphs. Cell values can be any
  `ReactNode` — drop a `StatusDot`, `Badge`, or `Button` into a cell via `row[col.key]`.

```tsx
// web — sortable + selectable + expandable
<Table
  columns={[{ key: 'name', header: 'User', sortable: true }, { key: 'mrr', header: 'MRR', align: 'right', mono: true }]}
  rows={rows}
  sortKey={sortKey} sortDir={sortDir} onSort={setSort}
  selectable selectedKeys={sel} onSelectionChange={setSel}
  rowTone={(r) => (r.churned ? 'danger' : undefined)}
  expandable renderDetail={(r) => <InvoiceDetail row={r} />}
/>

// native — shared feature set only
<Table columns={cols} rows={rows} sortKey={sortKey} sortDir={sortDir} onSort={setSort}
  selectable selectedKeys={sel} onSelectionChange={setSel} onRowClick={open} />
```

## 7. Accessibility

- **Web:** semantic `<table>`/`<th scope="col">`/`<td>`. Sortable headers expose `aria-sort`
  (`ascending`/`descending`/`none`); the header is a focusable `<button>`. Clickable rows get `tabIndex=0` +
  Enter/Space; selected rows set `aria-selected`; expanded rows set `aria-expanded`; the expand button is
  labeled "Expand/Collapse row"; select-all + per-row checkboxes carry `aria-label`s.
- **Native:** sortable headers + clickable rows are `Pressable` with `accessibilityRole="button"`. There is **no
  table semantics, no `aria-sort`/`aria-selected` equivalent** — add `accessibilityState`/`accessibilityLabel`
  where row state must be announced.
- **Touch target:** prefer non-`dense` on native for ≥44px row height.

## 8. Usage rules — Do / Don't

**Do**
- Define columns declaratively; mark numeric columns `mono` + `align:'right'` for aligned digits.
- Drive sorting from `sortKey`/`sortDir`/`onSort` and selection from `selectedKeys`/`onSelectionChange`
  (selection is controlled — own the state).
- Use a stable `rowKey` whenever you use `selectable` or `expandable`.

**Don't**
- ✗ Don't hardcode header/cell padding, the hairline color, sticky-header glass, or tone tints — all are tokens.
- ✗ Don't rely on `rowTone`/`expandable` on native (unimplemented) without porting them first.
- ✗ Don't nest a second interactive control that overlaps row-click without `stopPropagation` (the kit already
  guards the checkbox/expand cells).
- ✗ Don't build a parallel "admin table" component — extend `Table` on both platforms.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled `<table>` or flex-grid list re-creates `Table` and will drift from the
  sticky-header glass, sort glyphs, and selection model — import `Table`.
- **New need → add to BOTH platforms.** New column behavior, a tone, or the missing native row-tone/expandable
  must be added on web **and** native (same prop names, same tokens) — never a one-off list.
- **Tokens only.** Header glass + blur, `--border` hairlines, accent sort/expand tints, and zone tone washes are
  tokens; hardcoded equivalents are bugs.
- **Parity gate.** Before shipping, diff the web phone-width table vs native — same columns/order/alignment,
  same sort + selection behavior; do **not** assume row-tone/expandable exist on native.
