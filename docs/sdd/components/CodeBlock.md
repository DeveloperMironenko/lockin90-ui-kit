# SDD — `CodeBlock`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/CodeBlock.tsx` · `packages/ui-native/src/components/CodeBlock.tsx` ·
> web CSS `packages/ui/src/styles/components/codeblock.css` (`.lk-codeblock*`).
> **Exports:** `CodeBlock`, type `CodeBlockProps`.
> **Status:** Shipped. **Parity:** ✅ identical API & visuals — substrate is the only difference (`<pre><code>` ↔ `ScrollView`/`Text`).
> **Stories:** `packages/ui/src/stories/CodeBlock.stories.tsx` · `packages/ui-native/src/stories/CodeBlock.stories.tsx`.

---

## 1. Overview

A **read-only monospace code / JSON block** on a dark inset surface. An optional header carries a
traffic-light dot triplet, a mono `label`, and a `CopyButton`; the body is a scrolling mono region.

Reach for it to display raw records / JSON, incident IDs, OTP/keys, API responses — anything copyable
and fixed-width. It is **display-only**; the editable twin is `CodeField`, and the OTP-entry twin is
`CodeInput`. The copy affordance reuses the shared `CopyButton` (from `Popover`) on both platforms.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `code` | `string` | — (required) | ✓ | ✓ | the raw text shown in the body + fed to `CopyButton` |
| `label` | `string` | — | ✓ | ✓ | header title (filename / `Response` / `Incident ID`) |
| `copyable` | `boolean` | `true` | ✓ | ✓ | render a `CopyButton(value=code)` in the header |
| `wrap` | `boolean` | `false` | ✓ | ✓ | wrap long lines instead of horizontal scroll |
| `maxHeight` | `number` | — | ✓ | ✓ | cap scroll-area height (px); content scrolls vertically past it |
| `className` | `string` | — | ✓ | — | web only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web only — `forwardRef<HTMLDivElement>` |

- **Header visibility:** rendered when `label != null || copyable` (i.e. only fully suppressed by
  `copyable={false}` with no `label`).
- **Web:** `forwardRef<HTMLDivElement>`, spreads `...rest` onto the root. **Native:** plain function — no
  ref, no rest spread, no `className` (the documented substrate gap).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`codeblock.css`) | Native (`StyleSheet`) |
| --- | --- | --- |
| Root | `--r-sm` radius, `1px --border`, `--bg-0` bg, `overflow:hidden` | `radii.sm`, `1px colors.border`, `colors.bg0`, `overflow:hidden` |
| Header | `--glass` bg, `1px --border` bottom, pad `8/12`, gap `9` | `colors.glass`, `colors.border` bottom, pad `8/12`, gap `9` |
| Dots | `9px` circles, gap `5` — `--zone-low` / `--zone-mid` / `--mint` | `9px` circles, gap `5` — `colors.zoneLow` / `colors.zoneMid` / `colors.mint` |
| Label | `--font-mono` `10.5px`, `letter-spacing .04em`, `--text-faint`, ellipsis | `fonts.mono` `10.5`, `letterSpacing .4`, `colors.textFaint`, `numberOfLines={1}` |
| Body | `--font-mono` `11.5px`, `line-height 1.7`, `--text-dim`, `tab-size 2`, pad `14/16` | `fonts.mono` `11.5`, `lineHeight 20`, `colors.textDim`, pad `14/16` |

- **Dots** are the macOS traffic-light motif (low/mid/mint = red/amber/green from the zone tokens) — data
  decoration, not interactive.
- The block surface deliberately matches `CodeField`'s inset (`--bg-0`) so display and editable code read
  as one family.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-codeblock` + scrolling `.lk-codeblock-pre` | `View` + horizontal `ScrollView` |
| No-wrap (default) | `.lk-codeblock-pre` `overflow-x:auto` | horizontal `ScrollView` (no indicator) |
| Wrap | `.lk-codeblock-wrap` → `white-space:pre-wrap`, `overflow-x:hidden` | non-scrolling `View`, `Text` wraps |
| Height-capped | inline `style={{ maxHeight, overflowY:'auto' }}` on `<pre>` | body nested in vertical `ScrollView style={{ maxHeight }}` |
| Copy | header `CopyButton` (idle → copied tick) | header `CopyButton` |

No hover / focus / disabled / error states — it is non-interactive apart from `CopyButton` and scroll.

## 5. Web ↔ native parity

**Verdict: ✅ identical.** Same prop names, defaults, tokens, dot colors, padding, type scale, and header
rules. The two differences are pure substrate and don't affect app code:

- **Body element:** web `<pre><code tabIndex={0}>` (focusable for keyboard scroll); native an
  `Text` inside a horizontal `ScrollView` (or a plain `View` when `wrap`).
- **Web extras:** `forwardRef` + `...rest` + `className`. Native omits them (no DOM to forward to) — a
  substrate gap, not a capability gap.

No capability gap: the block is fully usable and visually equivalent on both platforms.

## 6. Composition & usage

- **Composes:** `CopyButton` (re-exported from `Popover`) — the only sub-primitive.
- **Used by:** admin raw-record / JSON viewers, debug tooling, incident-ID and key/OTP display surfaces.
- **Siblings:** `CodeField` (editable), `CodeInput` (OTP entry) — don't confuse the three.

```tsx
// web
<CodeBlock label="Response" code={JSON.stringify(body, null, 2)} maxHeight={320} />
<CodeBlock code={incidentId} copyable wrap />

// native
<CodeBlock label="Response" code={JSON.stringify(body, null, 2)} maxHeight={320} />
<CodeBlock code={incidentId} copyable wrap />
```

## 7. Accessibility

- **Web:** the `<pre>` is `tabIndex={0}` so keyboard users can scroll long bodies; the dot row is
  `aria-hidden`. `CopyButton` carries its own `aria-label="Copy code"`.
- **Native:** the dot row is hidden from a11y (`accessibilityElementsHidden` /
  `importantForAccessibility="no-hide-descendants"`); `label` is a real `Text`.
- **Contrast:** body text is `--text-dim` on `--bg-0` — meets contrast for mono code; the label is the
  quieter `--text-faint` (metadata, not the payload).

## 8. Usage rules — Do / Don't

**Do**
- Use for **read-only** code / JSON / IDs / keys.
- Pass `label` for a filename or record name; leave `copyable` on so users can grab the value.
- Set `maxHeight` for long payloads so the block doesn't dominate the page.

**Don't**
- ✗ Don't use `CodeBlock` for editable code — that's `CodeField`.
- ✗ Don't use it for OTP / verification entry — that's `CodeInput`.
- ✗ Don't hardcode the inset surface, dot colors, or mono scale — they come from `@lockin90/tokens`.
- ✗ Don't rely on `className` / ref on native — they don't exist there.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled `<pre>` on a dark card with three colored dots is a parity violation —
  import `CodeBlock`.
- **Tokens only.** Dot colors are the zone/mint tokens; surface is `--bg-0`; type is `--font-mono`. Any
  hardcoded hex or px is a bug even if it matches today (Aurora token renames will break it).
- **New need → both platforms.** Line numbers, syntax highlight, or a filename tab must be added to
  `CodeBlock` on web **and** native with the same prop — never a one-off local viewer.
- **Parity gate.** Confirm the web phone-width and native renders match (same header, dots, wrap, height
  cap) before shipping a screen that uses it.
