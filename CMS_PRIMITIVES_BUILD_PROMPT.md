# Build prompt — CMS primitives for `@lockin90/ui` + `@lockin90/ui-native`

**For:** the UI-kit build agent working inside `/Users/miron/app/lockin90-ui-kit`.
**Why:** the LockIn90 CMS admin (a section of `lockin90-admin`) will be built on this kit. A component-level
audit of the CMS mockups (`lockin90-design/cms/*.html`) against the current kit (66 web primitives on `main`)
found a small set of **missing primitives**. Build them, to the kit's existing conventions, on **both platforms**.

> Companion: `lockin90-public-api/docs/CMS_IMPLEMENTATION_PLAN.md` §18 (the gap analysis this list comes from).

---

## 0. Hard rules (mirror existing code — do not invent new patterns)

**Web (`packages/ui`)**
- One file per component: `packages/ui/src/components/<Name>.tsx`. React function/`forwardRef` component.
- `import { cn } from '../cn';` — emit **`lk-*` classes ONLY**. No Tailwind, no inline styles except genuinely
  dynamic values (sizes, transforms, positions).
- Styling: add `packages/ui/src/styles/components/<name>.css` and **register it** in
  `packages/ui/src/styles/index.css` (follow how the existing `components/*.css` are imported).
- **Tokens only** — colors/spacing/radii/gradients/shadows come from `@lockin90/tokens` (see `tokens.css` vars +
  existing components). No hardcoded hex/px-palette values.
- Export the component **and its types** from `packages/ui/src/index.ts` (keep the alphabetical block tidy).
- Add a Storybook story `packages/ui/src/stories/<Name>.stories.tsx` (Storybook v9 / `@storybook/react-vite` —
  mirror `Card.stories.tsx`, `Gauge.stories.tsx`, `DateField.stories.tsx`).
- Mirror these exemplars for structure: `TagInput.tsx`, `ListRow.tsx`, `Table.tsx`, `Popover.tsx`, `Select.tsx`.

**Native (`packages/ui-native`)**
- `packages/ui-native/src/components/<Name>.tsx` — StyleSheet + `theme.ts`, `react-native-svg` /
  `expo-linear-gradient` where needed. Optional expo peers must be **guarded** (see how existing native comps treat
  optional peers + provide a graceful fallback). Export from `packages/ui-native/src/index.ts`.
- **Parity invariant (the kit's core rule):** identical **export name, prop names, and variant unions** on both
  platforms, so app code reads the same. Where a web capability has no native equivalent (drag-drop, `contentEditable`),
  ship a **documented graceful fallback** — but the export and props must still exist.

**General**
- **No new runtime dependencies.** In particular RichTextEditor is **dependency-free** (`contentEditable` +
  the existing `Toolbar`) — do **not** add TipTap/ProseMirror/Slate.
- Don't modify unrelated components. This kit is consumed by every app from `main`; keep `main` buildable.

---

## 1. Components to build

### G1 — `Sortable` (NEW) — drag-to-reorder list
- **Web API:** `Sortable` with `items: { id: string; node: ReactNode }[]`, `onReorder(nextIds: string[]) => void`,
  `handle?: boolean` (drag only by a handle; default true), `disabled?: boolean`. Pointer-based reorder (Pointer
  Events, **no external dep**). Render a drag handle using the new `grip` Icon glyph (G3). Keyboard a11y: when a
  handle is focused, ↑/↓ move the item and call `onReorder`. Emit `lk-sortable*` classes; show a drop indicator.
- **Native:** same API; long-press + `PanResponder` drag reorder, **or** graceful fallback = up/down chevron
  buttons per row calling `onReorder`. Document whichever you ship.
- **Serves:** page/post block list, nav tree (nested — see below), pricing plan cards, feature-matrix rows.
- **Nesting:** provide flat reorder at minimum. If feasible, also export `SortableTree` (parent/child indent +
  reparent). If not feasible cleanly, ship flat `Sortable` and leave a `// TODO nested` note — don't over-engineer.

### G2 — `RichTextEditor` (NEW, dependency-free)
- **Web API:** `RichTextEditor` with `value: string` (HTML), `onChange(html: string) => void`, `placeholder?`,
  `toolbar?: RichTextAction[]` (default `['bold','italic','link','bulletList','orderedList','h2','h3','quote','code','clear']`),
  `minRows?`, `invalid?`. Implement with a `contentEditable` surface + the existing **`Toolbar`** for the button row.
  **Sanitize on paste** (strip inline styles/scripts, keep semantic tags). Emit `lk-rte*` classes.
- **Native:** graceful fallback — a multiline `NoteField`-based plain-text/markdown editor; **same export + props**
  (`value`/`onChange` carry plain text). Document that rich formatting is web-only.
- **Serves:** `richText` block, post body, FAQ answer, author bio.

### G3 — Icon glyph expansion (ENHANCE existing `Icon`, do NOT create a new component)
- Extend the `IconName` union **and** the `GLYPHS` record in `packages/ui/src/components/Icon.tsx` **and** the native
  `Icon` twin — keep the two glyph sets **identical**. Match the existing draw style (24×24 viewBox, `currentColor`
  stroke, `strokeWidth ~1.9`, round caps/joins).
- **Add these glyphs** (skip any that already exist — current set: back, chevron, share, more, lock, play, info,
  timer, plus, check, star): `image, text, heading, quote, embed, code, grid, table, columns, list, listOrdered,
  bold, italic, link, unlink, externalLink, file, fileText, video, folder, folderOpen, grip, eye, eyeOff, copy,
  duplicate, trash, edit, save, translate, settings, search, close, calendar, filter, sort, upload, download,
  sparkle, warning, checkCircle, xCircle, refresh, chevronDown, chevronUp, bell, user, palette, crop`.
- ~40–45 new glyphs. Keep it a clean, consistent set; dedupe with the 11 existing.

### G4 — `FocalPointPicker` (NEW)
- **Web API:** `FocalPointPicker` with `src: string`, `value: { x: number; y: number }` (each 0..1),
  `onChange(p) => void`, `aspect?: number`, `showGrid?: boolean` (default true). Click/drag on the image to set the
  focal marker; render a rule-of-thirds overlay; output normalized 0..1 coords. Emit `lk-focal*` classes.
- **Native:** same API; tap-to-set on an `Image` with a marker (no drag required); rule-of-thirds overlay via Views.
- **Serves:** media detail drawer, post cover image.

### G5 — `CodeField` (NEW — editable code/embed input)
- Distinct from `CodeBlock` (display-only `<pre>`) and `CodeInput` (OTP). **Web API:** `CodeField` with `value`,
  `onChange(value)`, `language?`, `placeholder?`, `rows?`, `invalid?`, `wrap?`. A monospace `<textarea>` on the dark
  inset surface (visually consistent with `CodeBlock`); Tab inserts spaces; optional `language` label chip. **No
  syntax-highlight engine** (keep dep-free).
- **Native:** multiline monospace `TextInput`; same props.
- **Serves:** `embed` + `code` blocks in the editors.

### G6 — `ColorPicker` (NEW)
- **Web API:** `ColorPicker` with `value: string` (hex), `onChange(hex) => void`, `swatches?: string[]`,
  `allowAlpha?: boolean` (default false). A swatch trigger + **`Popover`** containing: a native `<input type="color">`,
  a hex `Input`, and preset swatches (default to Aurora token swatches). Reuse existing `Popover` + `Input`.
- **Native:** swatch grid + hex `TextInput` inside a `Modal`/`Sheet` (no OS color wheel); same props.
- **Serves:** category color, pricing-plan accent, settings/branding.

### G8 — Table row-selection (ENHANCE existing `Table`, do NOT fork)
- Add to `TableProps` (`packages/ui/src/components/Table.tsx`): `selectable?: boolean`,
  `rowKey?: (row, i) => string` (default = index), `selectedKeys?: string[]`,
  `onSelectionChange?(keys: string[]) => void`. When `selectable`, render a leading checkbox column using the existing
  **`Checkbox`**, with a header **select-all** (indeterminate when partial). **Preserve all current behavior**
  (sortable headers, `dense`, `onRowClick`) — and ensure clicking a checkbox does **not** fire `onRowClick`.
- Apply the same enhancement to the **native** `Table` twin (leading checkbox cell).
- **Serves:** pages/posts list bulk actions.

> Note: `AvatarStack`, `CharCounter`, `SplitButton`, `VersionBadge`, `CodeBlock`, custom `Select` already exist —
> **do not rebuild them.** App-level composites (block-editor canvas, add-block palette, bulk-action bar, SERP
> preview, media picker, link picker, AI-assist popover) are built in `lockin90-admin`, **not** in this kit.

---

## 2. Acceptance criteria (all must pass)

- `pnpm -C packages/ui typecheck` **and** `pnpm -C packages/ui-native typecheck` green.
- `pnpm -C packages/ui build` (tsup) **and** `pnpm -C packages/ui-native build` (bob) green.
- Every new/changed component exported (component **+ types**) from both `index.ts` files.
- Every new web component has a Storybook story; `pnpm -C packages/ui build-storybook` green.
- New web CSS registered in `styles/index.css`; tokens-only; `lk-*` classes.
- Parity: identical export names/props/variant unions on both platforms (graceful fallbacks where noted, documented).
- `COMPONENT-INVENTORY.md` updated with the new primitives + the new Icon glyph count.
- **No new runtime deps.**
- Commit in the repo's conventional style, e.g.:
  `feat(ui,ui-native): CMS primitives — Sortable, RichTextEditor, FocalPointPicker, CodeField, ColorPicker + Icon glyphs + Table selection`

---

## 3. Summary checklist

- [ ] G1 `Sortable` (+ optional `SortableTree`) — web (pointer DnD) + native (drag or up/down fallback)
- [ ] G2 `RichTextEditor` — web (contentEditable + Toolbar, sanitized paste) + native (NoteField fallback)
- [ ] G3 Icon glyphs — ~40+ added to `Icon` on **both** platforms, sets identical
- [ ] G4 `FocalPointPicker` — web (click/drag) + native (tap)
- [ ] G5 `CodeField` — web (mono textarea) + native (mono TextInput)
- [ ] G6 `ColorPicker` — web (Popover + input[type=color] + swatches) + native (swatch grid + hex)
- [ ] G8 `Table` selection — checkbox column + select-all, both platforms, existing behavior intact
- [ ] exports + CSS + stories + inventory updated; typecheck/build/storybook green on both packages
