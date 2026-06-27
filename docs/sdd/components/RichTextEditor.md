# SDD — `RichTextEditor` (+ `RichTextAction`, `sanitizeRichTextHtml`)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/RichTextEditor.tsx` · `packages/ui-native/src/components/RichTextEditor.tsx` ·
> web CSS `packages/ui/src/styles/components/rte.css` (`.lk-rte*`).
> **Exports:** `RichTextEditor`, type `RichTextAction`, type `RichTextEditorProps`; **web only** `sanitizeRichTextHtml`.
> **Status:** Shipped. **Parity:** 🔵 capability gap — RN has no `contentEditable`; web edits **HTML** (WYSIWYG), native edits **markdown plain text** via the same toolbar.
> **Stories:** `packages/ui/src/stories/RichTextEditor.stories.tsx` · `packages/ui-native/src/stories/RichTextEditor.stories.tsx`.

---

## 1. Overview

A **dependency-free rich-text editor**: the shared `Toolbar` button row over an editing surface.

- **Web** drives a `contentEditable` glass surface through `document.execCommand` (deprecated but the only
  way to do WYSIWYG without a heavy engine — **TipTap/ProseMirror/Slate are explicitly banned here**).
  `value` is an **HTML string**; pasted content is sanitized to a small semantic allowlist.
- **Native** has no `contentEditable`, so it ships the **same toolbar** (same glyphs/order/labels) over a
  multiline `NoteField`, with each button applying **markdown** to the plain-text value. `value` is a
  **markdown plain-text string**.

`RichTextAction` is the formatting-action union (10 actions). `sanitizeRichTextHtml` is the **web-only**
paste sanitizer (not exported from native). Reach for it for CMS post bodies, long-form notes, descriptions.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `string` | — (required) | ✓ | ✓ | **HTML** on web · **markdown plain text** on native |
| `onChange` | `(value: string) => void` | — (required) | ✓ | ✓ | next HTML (web) / markdown (native) on every edit |
| `placeholder` | `string` | `'Write something…'` | ✓ | ✓ | shown while empty |
| `toolbar` | `RichTextAction[]` | `DEFAULT_TOOLBAR` (all 10) | ✓ | ✓ | which actions, in order; `[]` hides the bar |
| `minRows` | `number` | `6` | ✓ | ✓ | min surface height in text rows |
| `invalid` | `boolean` | `false` | ✓ | ✓ | red border (+ focus ring on web) |
| `disabled` | `boolean` | `false` | ✓ | ✓ | read-only surface, toolbar hidden |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| `id` | `string` | — | ✓ | — | web only — surface id (a11y) |
| `aria-label` | `string` | — | ✓ | — | web only — surface label |

- **`RichTextAction`** = `'bold' | 'italic' | 'link' | 'bulletList' | 'orderedList' | 'h2' | 'h3' | 'quote' |
  'code' | 'clear'`. `DEFAULT_TOOLBAR` lists all ten in that order, both platforms.
- **`sanitizeRichTextHtml(html): string`** (web): parses into a detached document and keeps only an allowlist
  (`p br b strong i em u a ul ol li h2 h3 blockquote pre code`); drops `script style iframe object embed svg
  link meta`; strips all attributes except a vetted `href` (`http(s)/mailto/tel` or relative; adds
  `rel="noopener noreferrer" target="_blank"`); unwraps any non-allowlisted tag.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`rte.css`) | Native (`StyleSheet` + `NoteField`) |
| --- | --- | --- |
| Surface | `--r-sm`, `1px --border-2`, `--glass-2`, `--text`, `--font-ui` `14px`, `line 1.6`, pad `12/14` | `NoteField` surface, `radii.sm`; height `minRows*22 + 24` |
| Focus | `:focus` → `--accent` border + `0 0 0 3px rgba(124,92,255,.14)` ring | `NoteField` focus styling |
| Placeholder | `[data-empty]::before` = `attr(data-placeholder)`, `--text-faint` | `NoteField` placeholder |
| Invalid | `--zone-low` border (focus ring `rgba(255,77,109,.16)`) | `colors.zoneLow` border |
| Disabled | `opacity .6`, `cursor:not-allowed` | `opacity 0.6` |
| Toolbar | shared `Toolbar` (`--glass-2` strip, `30px` btns), `align-self:flex-start`, gap `8` above surface | shared `Toolbar`, `marginBottom 10` |
| h2 / h3 | `--font-display`, `1.35em` / `1.12em` | (rendered downstream from markdown) |
| blockquote | `2px --accent` left border, `--text-dim`, italic | — |
| `pre` / `code` | `--bg-0` block, `1px --border`, `--font-mono` `12.5px`; `a` = `--accent-2` underline | — |

- Editorial typography (h2/h3/lists/blockquote/pre/a) applies to the semantic tags the **web** surface
  produces; native carries the equivalent **markdown markers** (`## `, `### `, `- `, `> `, `` ` ``, `[](…)`).
- Native glyphs are `react-native-svg` paths stroked `colors.textDim`, mirroring the web inline-SVG set.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Empty | `data-empty` → CSS placeholder | `NoteField` placeholder |
| Focus | accent border + ring | `NoteField` focus |
| Active toggle | `isActive()` via `queryCommandState` → `Toolbar` item `active` tint (bold/italic/lists) | no active tracking (markdown insert is stateless) |
| Editing | `onInput` → emit `innerHTML`; controlled sync without clobbering caret | `onChangeText` → emit markdown |
| Paste | `onPaste` → `sanitizeRichTextHtml` (or escaped plain text) → `insertHTML` | n/a — plain `TextInput` paste |
| Invalid | `.lk-rte-invalid` | `invalid` border |
| Disabled | surface non-editable, toolbar hidden | `editable={false}`, toolbar hidden |
| Link action | `window.prompt('Link URL')` → `safeHref` → `createLink` | inserts `[text](https://)` markdown |

## 5. Web ↔ native parity

**Verdict: 🔵 capability gap on native.** Same export name, same `RichTextAction` union, same props, same
toolbar (glyphs/order/labels), same default action set. But the editing model genuinely differs:

- **No `contentEditable` on RN.** Web is true WYSIWYG (`execCommand` over a contentEditable surface);
  native applies **markdown** to a plain-text field. Therefore **`value` carries different content** —
  **HTML on web, markdown plain text on native** — which is the headline gap a consumer must handle (store/
  render per platform; don't pipe one into the other).
- **No paste sanitization on native.** `sanitizeRichTextHtml` is web-only (it needs `DOMParser`); native has
  no HTML paste to sanitize. The symbol is **not exported** from `@lockin90/ui-native`.
- **No live active-state.** Web reflects `bold/italic/list` toggle state into the toolbar (`queryCommandState`);
  native's markdown insert is stateless, so no `active` tint.
- **Toolbar wiring:** web items use `onClick` + `active`; native items use `onPress` (no active) — the
  underlying `Toolbar` is the same shared primitive.

This blocks "drop-in identical value" use across platforms — design the data layer to accept both.

## 6. Composition & usage

- **Composes:** the shared `Toolbar` (`ToolbarItem[]`) on both platforms; native also composes `NoteField`
  as the editing surface.
- **Used by:** CMS post/page body editors, long-form descriptions, admin note fields.

```tsx
// web — value is HTML
<RichTextEditor value={html} onChange={setHtml} aria-label="Post body"
  toolbar={['bold', 'italic', 'link', 'bulletList', 'h2', 'quote', 'clear']} />

// native — value is markdown plain text
<RichTextEditor value={md} onChange={setMd}
  toolbar={['bold', 'italic', 'link', 'bulletList', 'h2', 'quote', 'clear']} />
```

## 7. Accessibility

- **Web:** the surface is `role="textbox"` `aria-multiline="true"`, labelled by `aria-label`, with
  `aria-invalid` when `invalid`; the toolbar is the shared `role="toolbar"` of icon `<button>`s with
  `aria-pressed` reflecting `active`. Pasted links get `rel="noopener noreferrer"`.
- **Native:** `NoteField` provides the accessible text field; the `Toolbar` buttons carry
  `accessibilityLabel` from each action's label.
- **Contrast:** body `--text` on `--glass-2`; placeholder `--text-faint`; the accent focus ring is a visible
  non-color cue as well as a hue change.

## 8. Usage rules — Do / Don't

**Do**
- Treat `value` per platform: **HTML on web, markdown on native** — persist/render accordingly.
- Always run pasted/imported web HTML through `sanitizeRichTextHtml` before trusting it server-side.
- Trim the `toolbar` array to the actions a surface actually needs.

**Don't**
- ✗ Don't feed web HTML into the native editor (or markdown into the web one) — they're different formats.
- ✗ Don't import a heavy editor engine (TipTap/ProseMirror/Slate) — explicitly banned; extend this primitive.
- ✗ Don't import `sanitizeRichTextHtml` on native — it isn't exported there.
- ✗ Don't hardcode the surface, toolbar, or editorial type — tokens only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled contentEditable + button row, or a third-party WYSIWYG, is a parity +
  maintenance violation — import `RichTextEditor`.
- **New action → both platforms.** A new `RichTextAction` (e.g. underline, table) must add its web
  `execCommand` mapping **and** its native markdown transform, with the same glyph/label — never one side.
- **Tokens only.** Surface `--glass-2`/`--border-2`, focus `--accent`, links `--accent-2`, code `--bg-0`/
  `--font-mono`. The `rgba(124,92,255,…)` ring mirrors the accent at fixed opacity (documented).
- **Parity gate.** Confirm the toolbar set + surface chrome match web↔native, and that the data layer handles
  the HTML-vs-markdown value difference, before shipping.
