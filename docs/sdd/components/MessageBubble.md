# SDD — `MessageBubble`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform composite (messaging).
> **Source:** `packages/ui/src/components/MessageBubble.tsx` · `packages/ui-native/src/components/MessageBubble.tsx` ·
> web CSS `packages/ui/src/styles/components/message.css` (`.lk-msg*`).
> **Exports:** `MessageBubble`, type `MessageBubbleProps`, type `MessageBubbleVariant`, type `MessageBubbleStatus`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; native renders status as a unicode glyph (`✓`/`✓✓`) where web draws an inline SVG check.
> **Stories:** `packages/ui/src/stories/MessageBubble.stories.tsx` · `packages/ui-native/src/stories/MessageBubble.stories.tsx`.

---

## 1. Overview

A single **chat message bubble** for DM / coach threads. Two variants:

- `incoming` — `--glass-2` fill, hairline `--border-2`, **left-aligned**, tail corner tightened bottom-left. The other party.
- `outgoing` — accent-tinted fill (violet `rgba(124,92,255,.16)`), **right-aligned**, tail tightened bottom-right. The current user.

It carries an optional `meta` line (e.g. `"Sofia · 8:02am"`) under the bubble on the bubble's side, and an **outgoing-only** delivery `status` glyph (`sent` single check, `delivered`/`read` double check; `read` tinted cyan). It is the only sanctioned way to render a chat message — pair it with `TypingIndicator` and `MessageComposer` to build a thread.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'incoming' \| 'outgoing'` | — (required) | ✓ | ✓ | identical union; drives alignment + fill + tail corner |
| `children` | `ReactNode` | — (required) | ✓ | ✓ | message body; native auto-wraps a `string`/`number` in styled `Text`, else renders nodes as-is |
| `meta` | `string` | — | ✓ | ✓ | small line under the bubble |
| `status` | `'sent' \| 'delivered' \| 'read'` | — | ✓ | ✓ | **outgoing-only** — ignored on `incoming` (`showStatus = outgoing && status != null`) |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web, minus `children`) | — | ✓ | — | `Omit<…, 'children'>`; web `forwardRef<HTMLDivElement>` |

- **Web:** `forwardRef<HTMLDivElement>`; `...rest` spreads to the root `<div>`.
- **Native:** plain function (no ref); only `variant`/`children`/`meta`/`status`/`style` — no rest spread.

## 3. Visual spec (tokens — never hardcode)

| Aspect | `incoming` | `outgoing` |
| --- | --- | --- |
| Bubble bg | `--glass-2` / `colors.glass2` | `rgba(124,92,255,.16)` (accent-violet tint, literal both sides) |
| Bubble border | `1px --border-2` / `colors.border2` | `1px rgba(124,92,255,.34)` |
| Text | `--text` / `colors.text` | `#ece8ff` (light violet-white, literal both sides) |
| Tail corner | bottom-left `--r-sm` (10) | bottom-right `--r-sm` (10) |
| Align | `flex-start` | `flex-end` |

- **Bubble:** padding `11px / 14px`; radius `--r-lg` / `radii.lg` (22) with one tightened tail corner `--r-sm` / `radii.sm` (10). Font `--font-ui` / `fonts.ui`, `13.5px`, line-height 1.5 (native `20`). `max-width: 82%`; column gap `4px`.
- **Meta line:** `10.5px`, `--text-dim` / `colors.textDim`, gap `5px`.
- **Status glyph (web):** inline SVG check, `12×12`, `stroke-width 2`, `fill:none`, `stroke: currentColor`. `sent` = `--text-faint`, `delivered` = `--text-dim`, `read` = `--accent-2` (cyan). Native: unicode `✓`/`✓✓` `Text`, `10.5px`, weight 700, same three tone colors (`colors.textFaint/textDim/accent2`).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Incoming | `.lk-msg-in` glass, left | `msgIn` / `bubbleIn` |
| Outgoing | `.lk-msg-out` accent, right | `msgOut` / `bubbleOut` |
| With meta | `.lk-msg-meta` row under bubble | `meta` row |
| Sent | `.lk-msg-status-sent` faint single check | `✓` faint |
| Delivered | `.lk-msg-status-delivered` dim double check | `✓✓` dim |
| Read | `.lk-msg-status-read` cyan double check | `✓✓` cyan |

No hover / pressed / focus / disabled states — `MessageBubble` is non-interactive presentation. Wrap it in a `Pressable`/`button` at the app layer if a message needs tap actions.

## 5. Web ↔ native parity

**Verdict: 🟡 same API, one substrate-shaped visual.** Identical variant union, alignment, fills, borders, tail corners, radii, padding, typography, meta line, and the three status tone colors. The only difference is the delivery glyph substrate:

- **Status check:** web draws an inline `<svg>` (`SingleCheck`/`DoubleCheck` paths) sized `12×12`; native renders unicode `✓` / `✓✓` `Text` (`10.5px`). Same single-vs-double semantics, same three tone colors — visually equivalent, no SVG-check primitive needed on native.
- **Children:** web passes `children` straight into `.lk-msg-bubble`; native wraps a bare `string`/`number` in a styled `Text` (RN can't render naked strings), passing through richer nodes untouched. App code reads 1:1.

No capability gap — the bubble is fully usable and visually equivalent on both platforms.

## 6. Composition & usage

- **Composes from:** primitives only — a root flex column, the bubble `<div>`/`<View>`, and (web) two small inline SVG check components. No other kit primitive.
- **Composed into:** a message thread alongside `TypingIndicator` (incoming "is typing" bubble) and `MessageComposer` (the input bar). Used by coach/DM chat screens.
- **Grouping:** render incoming/outgoing in a vertical stack; the bubble self-aligns via `align-self`. Pass `meta` only on the last bubble of a run to avoid repetition.

```tsx
// web
<MessageBubble variant="incoming" meta="Sofia · 8:02am">Hey — how was the session?</MessageBubble>
<MessageBubble variant="outgoing" status="read" meta="8:04am">Felt strong, +8 energy.</MessageBubble>

// native
<MessageBubble variant="incoming" meta="Sofia · 8:02am">Hey — how was the session?</MessageBubble>
<MessageBubble variant="outgoing" status="read" meta="8:04am">Felt strong, +8 energy.</MessageBubble>
```

## 7. Accessibility

- **Web:** plain `<div>` — content is read as text. The status `<span>` carries a visually-hidden `.lk-sr-only` label (`Sent`/`Delivered`/`Read`) so the delivery state is announced; the SVG itself is `aria-hidden`.
- **Native:** the unicode glyph has no screen-reader label — apps that need the delivery state announced should add `accessibilityLabel` via the bubble `style`'d wrapper (gap vs web; flag if announcing status matters).
- **Contrast:** outgoing `#ece8ff` on the violet tint and incoming `--text` on `--glass-2` both meet body-text contrast on the void background.

## 8. Usage rules — Do / Don't

**Do**
- Use `variant="outgoing"` for the current user, `incoming` for everyone else.
- Set `status` only on outgoing bubbles; let it map sent→single, delivered/read→double.
- Use `meta` for sender + timestamp; keep it short (it's `10.5px`).

**Don't**
- ✗ Don't pass `status` on an `incoming` bubble — it's silently dropped.
- ✗ Don't hand-roll a chat bubble with a custom violet tint / tail corner — use this component.
- ✗ Don't hardcode the bubble fill, radius, or status colors — they come from `@lockin90/tokens` (the two violet `rgba()` tints are the one shared literal, kept identical on both platforms).
- ✗ Don't put tap targets inside the bubble expecting kit-level handling — it's presentation-only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A "custom message row" that re-creates the glass/accent fills + tightened tail corner is a parity violation — import `MessageBubble`.
- **New need → both platforms.** A new status (e.g. `failed`) or a third variant must be added to the `MessageBubbleStatus`/`MessageBubbleVariant` unions on **both** web and native with the same tokens — never a one-off.
- **Tokens only.** Bubble fills, borders, radii, and status colors come from tokens; the two violet tint literals (`.16`/`.34`) are intentionally shared and must stay byte-identical across platforms.
- **Parity gate.** Before shipping a thread screen, confirm web phone-width and native render the same variant, meta, and status glyph for the same message.
