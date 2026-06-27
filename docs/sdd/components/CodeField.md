# SDD — `CodeField`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/CodeField.tsx` · `packages/ui-native/src/components/CodeField.tsx` ·
> web CSS `packages/ui/src/styles/components/codefield.css` (`.lk-codefield*`).
> **Exports:** `CodeField`, type `CodeFieldProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; two platform-shaped behaviors (web Tab-to-indent; `wrap` is a web-only effect).
> **Stories:** `packages/ui/src/stories/CodeField.stories.tsx` · `packages/ui-native/src/stories/CodeField.stories.tsx`.

---

## 1. Overview

An **editable multiline monospace code / embed input** on the same dark inset surface as `CodeBlock`. An
optional `language` chip sits in the header next to the traffic-light dots. There is **no syntax-highlight
engine** — it's deliberately dependency-free; it just gives raw code/embed editing the right typography and
chrome.

Reach for it for embed-snippet fields, raw JSON/config editing, custom-CSS/HTML boxes in admin/CMS. The
read-only twin is `CodeBlock`; the OTP-entry twin is `CodeInput`. On web, pressing **Tab** inserts two
spaces instead of moving focus.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `string` | — (required) | ✓ | ✓ | current code / embed string |
| `onChange` | `(value: string) => void` | — (required) | ✓ | ✓ | next string on every edit (string, not event) |
| `language` | `string` | — | ✓ | ✓ | lowercase chip in the header (`html`, `json`) — also gates header visibility |
| `placeholder` | `string` | — | ✓ | ✓ | shown while empty |
| `rows` | `number` | `8` | ✓ | ✓ | visible rows; native also drives `minHeight = rows*20 + 28` |
| `invalid` | `boolean` | `false` | ✓ | ✓ | red border (+ ring on web) |
| `wrap` | `boolean` | `false` | ✓ | ◑ | web toggles wrap/no-wrap; native always wraps (prop kept for parity, no runtime effect) |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp` | — | — | ✓ | native only |
| _rest_ | `Omit<TextareaHTMLAttributes, 'value'\|'onChange'\|'wrap'>` (web) / `Omit<TextInputProps, 'value'\|'onChange'\|'onChangeText'>` (native) | — | ✓ | ✓ | `onKeyDown`/`onFocus`/`onBlur`, etc. |

- **Web:** `forwardRef<HTMLTextAreaElement>`. Pre-existing `onKeyDown` is honored, then Tab-to-indent runs
  only if the consumer didn't `preventDefault`.
- **Native:** `multiline` `TextInput`, `textAlignVertical="top"`; `value` change reported via
  `onChangeText`. Tracks focus internally for the accent border.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`codefield.css`) | Native (`StyleSheet`) |
| --- | --- | --- |
| Root | `--r-sm`, `1px --border`, `--bg-0`, `overflow:hidden` | `radii.sm`, `1px colors.border`, `colors.bg0` |
| Focus | `:focus-within` → `--accent` border + `0 0 0 3px rgba(124,92,255,.14)` ring | focused → `colors.accent` border (no ring) |
| Invalid | `--zone-low` border; focus ring `rgba(255,77,109,.16)` | `colors.zoneLow` border |
| Header | `--glass`, `1px --border` bottom, pad `8/12`, gap `9` | `colors.glass`, `colors.border` bottom, pad `8/12`, gap `9` |
| Dots | `9px`, gap `5` — `--zone-low` / `--zone-mid` / `--mint` | `9px`, gap `5` — `colors.zoneLow` / `colors.zoneMid` / `colors.mint` |
| Lang chip | `--font-mono` `10.5px`, `letter-spacing .04em`, `lowercase`, `--text-faint` | `fonts.mono` `10.5`, `letterSpacing .4`, `colors.textFaint` |
| Editor | `--font-mono` `11.5px`, `line-height 1.7`, `--text-dim`, `tab-size 2`, pad `14/16`, `resize:vertical` | `fonts.mono` `11.5`, `lineHeight 20`, `colors.textDim`, pad `14/16` |

- Placeholder is `--text-faint` (web `::placeholder`, native `placeholderTextColor={colors.textFaint}`).
- Tab inserts `TAB = '  '` (two spaces) on web — never `\t` — keeping `tab-size:2` consistent.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-codefield` | `View` + `TextInput` |
| Focus | `:focus-within` accent border + ring | `onFocus` → accent border (`useState(focused)`) |
| Invalid | `.lk-codefield-invalid` (focus = red ring) | `invalid` → `colors.zoneLow` border |
| Wrap | `.lk-codefield-wrap` vs `.lk-codefield-nowrap` (`white-space:pre` + `overflow-x:auto`) | always wraps (multiline); `wrap` no-op |
| Tab pressed | inserts 2 spaces, caret restored via `requestAnimationFrame` | n/a — no soft-keyboard Tab |
| Disabled | via rest `disabled` on `<textarea>` | via rest `editable={false}` on `TextInput` |

## 5. Web ↔ native parity

**Verdict: 🟡 same API, two platform-shaped behaviors.** Identical prop surface, tokens, header, dots,
mono scale, and focus/invalid colors. The differences are necessities of the substrate:

- **Tab-to-indent:** web-only. A native soft keyboard has no Tab key, so there's nothing to intercept —
  documented, not a missing feature.
- **`wrap`:** native `multiline` `TextInput` always wraps, so the prop is destructured but **not** forwarded
  (kept purely for prop parity / call-site symmetry). On web it really toggles wrap vs horizontal scroll.
- **Focus ring:** web draws a 3px accent glow ring; native shifts the border to accent (no box-shadow ring
  on `TextInput`).

App code reads 1:1 (`value`/`onChange(string)` both sides) — no capability gap that blocks use.

## 6. Composition & usage

- **Standalone** — no sub-primitives; pairs with a `FieldLabel`/`Field` wrapper and `CharCounter` if a
  length cap is shown.
- **Used by:** embed-code fields, raw-config editors, custom CSS/HTML boxes in admin/CMS surfaces.

```tsx
// web
<CodeField language="html" value={embed} onChange={setEmbed} rows={6} placeholder="<iframe …>" />

// native
<CodeField language="html" value={embed} onChange={setEmbed} rows={6} placeholder="<iframe …>" />
```

## 7. Accessibility

- **Web:** a real `<textarea>` with `aria-invalid` set when `invalid`; `spellCheck/autoComplete/autoCorrect/
  autoCapitalize` are all off (code, not prose). The dot row is `aria-hidden`.
- **Native:** `TextInput` with `autoCapitalize="none"`, `autoCorrect={false}`, `spellCheck={false}`; the dot
  row is hidden from a11y. Pass an external label via a `Field`/`FieldLabel` wrapper.
- **Contrast:** editor text `--text-dim` on `--bg-0`; the accent focus state is a visible non-color cue
  (border weight + ring) as well as a hue change.

## 8. Usage rules — Do / Don't

**Do**
- Use for editable raw code / embeds / config.
- Pass `language` to show the chip and clarify the expected syntax.
- Use `invalid` for validation failures and pair with an external error message.

**Don't**
- ✗ Don't use `CodeField` for prose — use `NoteField`/`Textarea`.
- ✗ Don't use it for OTP entry (`CodeInput`) or read-only display (`CodeBlock`).
- ✗ Don't expect Tab-to-indent or a `wrap` toggle on native — both are web-only.
- ✗ Don't hardcode the surface, dots, mono scale, or focus ring — tokens only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A mono `<textarea>` on a dark card with a language chip is a parity violation — import
  `CodeField`.
- **No highlight engine.** Adding CodeMirror/Monaco/Prism here is out of scope and breaks the
  dependency-free contract; if highlighting is ever needed it must be designed into the kit on both
  platforms, not bolted onto one call site.
- **Tokens only.** Surface `--bg-0`, dots = zone/mint tokens, focus = `--accent`, invalid = `--zone-low`.
- **Parity gate.** Verify web phone-width and native renders match (header, chip, dots, focus/invalid) before
  shipping; remember Tab-indent and `wrap` are intentionally web-only.
