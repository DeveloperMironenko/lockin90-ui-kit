# SDD — `Combobox` (+ `ComboboxOption`)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Combobox.tsx` · `packages/ui-native/src/components/Combobox.tsx` ·
> web CSS `packages/ui/src/styles/components/combobox.css` (`.lk-combobox*`).
> **Exports:** `Combobox`, type `ComboboxProps`, type `ComboboxOption`.
> **Status:** Shipped. **Parity:** 🟡 same API & result list; web floats an absolute dropdown that closes on outside-click/Esc, native renders the panel inline in flow.
> **Stories:** `packages/ui/src/stories/Combobox.stories.tsx` · `packages/ui-native/src/stories/Combobox.stories.tsx`.

---

## 1. Overview

A **search field with a results dropdown** — a `SearchInput` (magnifier + clear) that reveals a list of `ListRow` results as the user types. The consumer fetches/filters and feeds back `options`; choosing a row calls `onSelect` and closes the panel. The kit's pattern for async lookups: user/exercise/place search, "@" mentions, tag pickers backed by a query.

`ComboboxOption` (the secondary type export) is the result shape:
- `value` — stable id passed back to `onSelect`.
- `label` — primary row line.
- `sublabel?` — optional dimmer second line.

It manages its own query + open state but honors a controlled `value` when provided. Three panel modes: **loading** (`DotsLoader`), **empty** (non-empty query, zero options, not loading → `emptyText`), and **results** (`ListRow`s).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `options` | `ComboboxOption[]` | — (required) | ✓ | ✓ | current results (consumer supplies) |
| `onSearch` | `(query: string) => void` | — (required) | ✓ | ✓ | fired as the user types — consumer debounces/fetches |
| `onSelect` | `(option: ComboboxOption) => void` | — (required) | ✓ | ✓ | fired on row choose; panel then closes |
| `placeholder` | `string` | `'Search…'` | ✓ | ✓ | search-field placeholder |
| `loading` | `boolean` | `false` | ✓ | ✓ | show a `DotsLoader` row |
| `emptyText` | `string` | `'No results'` | ✓ | ✓ | shown on non-empty query + zero options + not loading |
| `value` | `string` | — | ✓ | ✓ | optional controlled query text |
| `className` | `string` | — | ✓ | — | web only — root wrapper |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only — root wrapper |

- Both: function component, no ref. `isControlled = value !== undefined`; otherwise an internal `inner` query state. Open state is internal (`open`).
- **Panel-visibility logic (identical both files):** `showEmpty = open && trimmed.length > 0 && !loading && options.length === 0`; `showPanel = open && (loading || options.length > 0 || showEmpty)`.
- `onFocus` opens the panel only when there's already something to show (`loading || options.length > 0`); the `SearchInput`'s clear closes it.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Root | `position: relative`, `min-width: 0` | `minWidth: 0` |
| Field | reuses `SearchInput` (`.lk-search`) | reuses `SearchInput` |
| Panel container | absolute, `top: calc(100% + 6px)`, `z-index: 9999`, `max-height: 280px`, `overflow-y:auto` | inline, `marginTop: 6`, `maxHeight: 280` |
| Panel surface | `--bg-1`, `1px --border-2`, `--r`, `box-shadow 0 16px 44px rgba(0,0,0,.52)`, `backdrop-filter blur(18px) saturate(130%)` | `colors.bg1`, `1 colors.border2`, `radii.md` |
| Panel padding | `6px` | `6` |
| Result row | `ListRow` (`.lk-combobox-row`, `--r-sm`) | `ListRow` (`divider` on rows after the first) |
| Loading row | `.lk-combobox-loading` flex-center, `16px 14px` | `flexDirection:row` center, `16 / 14` |
| Empty row | `--font-ui`, `13px`, `--text-faint`, centered, `16px 14px` | `fonts.ui`, `13`, `colors.textFaint`, centered, `16 / 14` |

- **Open animation (web only):** `@keyframes lk-combobox-in` (0.16s — fade + `translateY(-4px)→0`), disabled under `prefers-reduced-motion`. Native panel appears without animation.
- `DotsLoader size={6}` in the loading row (both platforms).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Closed | only the `SearchInput`; no panel | only the `SearchInput`; no panel |
| Loading | `.lk-combobox-panel` → `DotsLoader` row | inline panel → `DotsLoader` row |
| Results | panel → list of `ListRow`s | inline panel → list of `ListRow`s |
| Empty | panel → `emptyText` row | inline panel → `emptyText` row |
| Dismiss | outside-click **or** Escape (document listeners) | tapping the field's clear; **no** outside-click/Esc |

## 5. Web ↔ native parity

**Verdict: 🟡 same API & result list, platform-shaped overlay.** Both expose the same props, the same `ComboboxOption` shape, the same three panel modes, and the same `ListRow`/`DotsLoader`/`SearchInput` composition with identical visibility math. The differences are how the panel is positioned and dismissed:

- **Overlay vs inline:** web renders an **absolutely-positioned dropdown** (`z-index: 9999`, anchored `calc(100% + 6px)` below, floating over content with a drop shadow + backdrop blur); native renders the panel **inline in flow** (`marginTop: 6`), pushing content below it. Both are scrollable (`max-height: 280`). This is the standard web-overlay vs native-inline substrate split.
- **Dismissal:** web attaches `mousedown`/`keydown` document listeners to close on **outside-click or Escape**; native has **no document-level listeners** (no DOM document) — it closes when a row is chosen or the field is cleared. Not a blocker, but a real behavioral difference to design around (native consumers shouldn't rely on outside-tap-to-dismiss).
- **Open animation:** web fades/slides in (reduced-motion aware); native is instant.

None of these block use — the search-and-pick flow is equivalent; the panel just floats vs stacks.

## 6. Composition & usage

- **Composes:** `SearchInput` (from `FormField`), `ListRow`, `DotsLoader`.
- **Used by:** async entity lookups — user/coach search, exercise/food pickers, place search, "assign to" selectors. The consumer owns fetching: debounce `onSearch`, set `loading`, feed `options`.

```tsx
// web
<Combobox
  options={results}
  loading={isFetching}
  placeholder="Search exercises…"
  onSearch={(q) => debouncedFetch(q)}
  onSelect={(o) => addExercise(o.value)}
/>

// native — same props, inline panel
<Combobox
  options={results}
  loading={isFetching}
  onSearch={debouncedFetch}
  onSelect={(o) => addExercise(o.value)}
/>
```

## 7. Accessibility

- **Web:** the `SearchInput` carries `role="combobox"`, `aria-haspopup="listbox"`, and `aria-expanded={showPanel}`; the panel is `role="listbox"` and each result `role="option"`. Escape closes; outside-click closes. (Active-descendant keyboard navigation through rows is not yet wired — see §9.)
- **Native:** `SearchInput` + `ListRow`s; selection is via tapping a row (each `ListRow` is pressable). Provide a clear `placeholder` so the field's purpose is announced.
- **Hit target:** `ListRow` provides a full-width tap target; the loading/empty rows are non-interactive.

## 8. Usage rules — Do / Don't

**Do**
- Debounce `onSearch` in the consumer; this component does not debounce.
- Drive `loading` while a fetch is in flight so the `DotsLoader` row shows.
- Provide a descriptive `placeholder` and a meaningful `emptyText`.
- Use `value` to make the query controlled when the parent owns it.

**Don't**
- ✗ Don't expect outside-click/Esc dismissal on native — it's web-only.
- ✗ Don't fetch inside `onSelect` synchronously and block — it closes the panel immediately.
- ✗ Don't hand-roll a search-dropdown (`SearchInput` + absolute panel) — import `Combobox`.
- ✗ Don't hardcode the panel surface/shadow/blur or `z-index` — tokens + the kit class only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom "search + results dropdown" re-creating the panel surface and the three modes is a parity violation — import `Combobox`.
- **New need → add to BOTH platforms.** Keyboard arrow-navigation through options, multi-select, or a "create new" row must land on web *and* native with the same prop/behavior — never a one-off.
- **Tokens only.** Panel bg (`--bg-1`), border, shadow, and the row typography come from `@lockin90/tokens` / the kit classes; never inline.
- **Parity gate.** Before shipping a lookup, confirm the web phone-width and native combobox show the same loading/empty/results states for the same query; account for the overlay-vs-inline panel and the native lack of outside-click dismissal in the screen layout.
