# SDD — `MessageComposer`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform composite (messaging).
> **Source:** `packages/ui/src/components/MessageComposer.tsx` (`'use client'`) · `packages/ui-native/src/components/MessageComposer.tsx` ·
> web CSS `packages/ui/src/styles/components/composer.css` (`.lk-composer*`).
> **Exports:** `MessageComposer`, type `MessageComposerProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; web auto-grows the field via `scrollHeight` + sends on `Enter`, native uses RN `multiline` and sends only via the button.
> **Stories:** `packages/ui/src/stories/MessageComposer.stories.tsx` · `packages/ui-native/src/stories/MessageComposer.stories.tsx`.

---

## 1. Overview

The **DM / chat input bar**: a glassy pill row holding (left→right) an optional E2EE lock glyph, a round **attach** button, a growing multiline text field, a round **emoji** button, and an accent-filled **send** circle. It owns its own draft text state, trims + clears on send, and only enables send when the trimmed value is non-empty and the bar isn't disabled. It is the single sanctioned chat input — pair it with `MessageBubble` + `TypingIndicator` to build a thread.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `onSend` | `(text: string) => void` | — (required) | ✓ | ✓ | fired with the **trimmed, non-empty** text; the field clears afterwards |
| `placeholder` | `string` | `'Message…'` | ✓ | ✓ | empty-field placeholder (`--text-faint` / `colors.textFaint`) |
| `e2ee` | `boolean` | `false` | ✓ | ✓ | shows the leading lock glyph marking the thread end-to-end encrypted |
| `disabled` | `boolean` | `false` | ✓ | ✓ | disables input + all buttons; dims the bar |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |

- **State:** both own a `value` string via `useState`; `canSend = !disabled && value.trim().length > 0`.
- **Web only:** internal `taRef` (textarea) drives `autoGrow()` — sets height to `min(scrollHeight, 120)`; resets to `auto` after send via `requestAnimationFrame`. No `className`/rest passthrough.
- **Native only:** no auto-grow logic — relies on RN `<TextInput multiline>` with `minHeight: 42`, `maxHeight: 120`.
  The resting **placeholder is a single-line truncating overlay** — the `TextInput` gets no `placeholder` prop;
  while `value` is empty an absolute `pointerEvents="none"` `<Text numberOfLines={1}>` (`colors.textFaint`) sits
  over the field instead. RN's own multiline placeholder would wrap a long string (e.g. "Encrypted message…")
  onto 2 lines and make the resting pill taller than the 42px buttons; the overlay keeps it exactly one line.

## 3. Visual spec (tokens — never hardcode)

| Part | Token / value |
| --- | --- |
| Bar | `--glass-2` / `colors.glass2` bg, `1px --border-2` / `colors.border2`, radius `--r-lg` / `radii.lg` (22), padding `9px / 12px`, `gap 10px`, align `flex-end` |
| Lock glyph | `16×16`, `--zone-high` / `colors.zoneHigh` (mint), `Icon name="lock" size={16}` |
| Attach / emoji btn | `38×38` circle, `--glass` / `colors.glass` bg, `1px --border` / `colors.border`, `--text-dim` icon; `plus` (18) / `sparkle` (18) |
| Field | `flex:1`, `--glass` bg, `1px --border`, radius `--r-pill` / `radii.pill` (999), padding `10px/16px` (native `8px/16px`), `--font-ui`, `13.5px`, line-height 20 (native 18), `--text` color |
| Send circle | `42×42`, `--grad-cta` / `gradients.cta` (violet→cyan), `--glow-accent` / `nativeShadows.glowAccent` shadow, icon `#0a0a12` dark-on-bright, `share` (18) |

- **Web hover (non-disabled):** attach/emoji → `--text` color + `--border-2`; send → `translateY(-2px)`.
- **Native press (non-disabled):** attach/emoji → `opacity .7` + `--border-2`; send → `translateY(-2px)`.
- The dark-on-gradient send icon `#0A0A12` matches the `Button` `primary` contrast choice.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Empty | send disabled (`!canSend`) → `:disabled` opacity .4, no shadow | `sendDisabled` opacity .4 |
| Has text | send enabled, gradient + glow | gradient + glow |
| Hover (send) | `:hover:not(:disabled)` `translateY(-2px)` | n/a |
| Pressed (send) | n/a | `sendPressed` `translateY(-2px)` |
| Hover (attach/emoji) | `:hover:not(:disabled)` lighten | n/a |
| Pressed (attach/emoji) | n/a | `btnPressed` opacity .7 |
| Disabled (bar) | `.lk-composer-disabled` opacity .8; buttons `:disabled` opacity .45–.55 | `barDisabled` opacity .8 |
| Focus (field) | `:focus-visible` → `outline:none`, border `--border-2` | platform caret |

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, platform-shaped input mechanics.** Identical layout, tokens, button set, send gradient + glow, and the trim-and-clear send contract. Differences are substrate-only:

- **Auto-grow:** web measures `scrollHeight` and sets `height = min(scrollHeight, 120)` for a 1→~5-line grow, then resets after send; native leans on RN `<TextInput multiline>` with `minHeight 42` / `maxHeight 120`. Same visible 42px-at-rest / 120px-cap behavior, different mechanism.
- **Send-on-Enter:** web sends on `Enter` (no Shift = newline) via `onKeyDown`; native has no hardware-Enter convention, so send is button-only. App code calls `onSend` the same way.
- **Send button:** web `--grad-cta` CSS gradient; native `expo-linear-gradient` `gradients.cta.stops` start `{0,0}`→end `{1,1}`. No gradient animation either side.
- **Placeholder:** web uses the textarea's native placeholder; native overlays a truncating one-line `Text` (§2) — same look at rest, long placeholders ellipsize on native instead of wrapping.

No capability gap — the composer is fully usable on both; the Enter-to-send is a web affordance only.

## 6. Composition & usage

- **Composes from:** `Icon` (`lock`, `plus`, `sparkle`, `share`) + native `expo-linear-gradient` for the send circle. The buttons are local `<button>`/`Pressable` (not the kit `Button`) because they're round icon-only controls.
- **Composed into:** the chat thread footer, beneath the scrolling `MessageBubble` list. Set `e2ee` on encrypted coach DMs.
- **Owns its draft:** the parent passes only `onSend`; the field state is internal and clears on send.

```tsx
// web
<MessageComposer e2ee onSend={(text) => sendMessage(text)} />

// native
<MessageComposer e2ee onSend={(text) => sendMessage(text)} />
```

## 7. Accessibility

- **Web:** real `<textarea>` with `aria-label="Message text"`; buttons are `<button type="button">` with `aria-label`/`title` (`Attach`, `Emoji`, `Send message`); the lock has `aria-label`/`title="End-to-end encrypted"`. `Enter` sends, `Shift+Enter` inserts a newline.
- **Native:** `<TextInput accessibilityLabel="Message text">`; buttons are `Pressable` with `accessibilityRole="button"` + `accessibilityLabel`; lock `View` has `accessibilityLabel="End-to-end encrypted"`.
- **Hit target:** attach/emoji are `38×38`, send `42×42` — all ≥ the comfortable touch minimum.
- **Disabled:** when `disabled`, every control receives the native disabled/`editable={false}` state, not just visual dimming.

## 8. Usage rules — Do / Don't

**Do**
- Pass only `onSend`; let the composer own + clear its draft.
- Set `e2ee` when the thread is end-to-end encrypted (it's a security signal, not decoration).
- Use `disabled` while the thread is read-only / sending.

**Don't**
- ✗ Don't externally control the text value — there's no `value` prop; the draft is internal by design.
- ✗ Don't hand-roll a chat input bar with a custom gradient send circle — use `MessageComposer`.
- ✗ Don't hardcode the send gradient, glow, pill radius, or button sizes — they come from `@lockin90/tokens`.
- ✗ Don't rely on Enter-to-send on native — it's a web-only affordance; the button always works.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A "custom chat input" re-creating the glass pill + accent send is a parity violation — import `MessageComposer`.
- **New need → both platforms.** A new control (e.g. a voice button) must be added to **both** web + native with the same icon + tokens, same prop, never a one-off.
- **Tokens only.** Bar/field/button surfaces, the send gradient + glow, and the dark `#0A0A12` icon all source from tokens (the icon literal is the shared dark-on-bright contrast value, matching `Button`).
- **Parity gate.** Before shipping the chat screen, confirm web phone-width and native render the same bar layout, lock state, and send affordance.
