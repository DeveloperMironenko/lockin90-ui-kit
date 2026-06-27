# SDD — `SecretField`

> **Package:** `@lockin90/ui/admin` — web-only operator-console primitive (admin app is web-only). **Import as** `import { SecretField } from '@lockin90/ui/admin'`.
> **Source:** `packages/ui/src/admin/SecretField.tsx` · web CSS `packages/ui/src/styles/components/secretfield.css` (`.lk-secretfield*`). NO native counterpart.
> **Exports:** `SecretField`, type `SecretFieldProps`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (admin) — no native surface by design.
> **Stories:** `packages/ui/src/stories/SecretField.stories.tsx`.

---

## 1. Overview

A **read-only masked secret display** for the operator console — webhook signing keys, TOTP secrets,
API tokens. A mono inset field showing a non-secret `prefix` + a masked middle (`••••`) + a non-secret
`tail`, with an **eye toggle** that reveals the full secret and an optional **copy** button. Revealing
fires `onReveal` **exactly once** (the audit hook). It is deliberately **read-only** — NOT an editable
input, and distinct from `PasswordInput`. Matches the `.key-mask` field from
`lockin90-design/admin/wearables.html`.

## 2. API contract

**`SecretFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'prefix'>`**

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | — (required) | masked display string (e.g. `'whk_live_••••••••1a2b'`); also the copy/reveal fallback |
| `revealedValue` | `string` | `value` | full secret shown when revealed |
| `prefix` | `string` | — | visible non-secret prefix (e.g. `'whk_live_'`) |
| `tail` | `string` | — | visible non-secret tail (e.g. `'1a2b'`) |
| `masked` | `boolean` | `true` | start masked; `false` starts revealed (and pre-marks "has revealed") |
| `onReveal` | `() => void` | — | fired the **first** time the field is revealed (audit hook) |
| `copyable` | `boolean` | `true` | show the copy-to-clipboard button |
| `className` | `string` | — | merged onto the root `<div>` |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (minus `prefix`) | — | spread onto the root `<div>` |

- `prefix` is `Omit`'d from the DOM attribute set because it is repurposed as a content prop.
- Internal state: `revealed` (init `!masked`) and `hasRevealed` (init `!masked`). `toggle()` flips
  `revealed`; on the **first** true transition it sets `hasRevealed` and calls `onReveal?.()` once.
- `full = revealedValue ?? value` — used for both the revealed text and the copy payload.
- **Render branch:** revealed → single `.lk-secretfield-full`; masked → `prefix` + `DOTS` (16 dots) +
  `tail`; if both `prefix` and `tail` are absent, falls back to `.lk-secretfield-masked` showing `value`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Value / token |
| --- | --- |
| Field | inline-flex `gap: 9px`, `padding: 6px 12px 6px 10px`, `--font-mono` 11.5px, `--text-dim` |
| Surface | `background: --bg-0`, `border: 1px solid --border-2`, radius `--r-sm` |
| Hover | `border-color: --accent` |
| Key glyph | inline custom SVG 13×13, `--text-faint` (`aria-hidden`) |
| Prefix | `--text-dim` |
| Dots | `--text-faint`, `letter-spacing: .05em` |
| Tail | `--accent-2` |
| Masked fallback | `--text-dim` |
| Revealed full | `--text` (ellipsis-truncated) |
| Toggle button | `26×26`, radius `--r-sm`, `--text-faint`; hover `--accent` + `--glass-2`; `aria-pressed=true` → `--accent-2`; focus-visible `2px --accent` outline |
| Copy button | `.lk-secretfield-copy` sized `26×26` (centers the reused `CopyButton` glyph) |

- The value row (`.lk-secretfield-val`) is `white-space: nowrap` + `overflow: hidden` + ellipsis so
  long secrets truncate rather than wrap.
- Eye icon: `Icon name={revealed ? 'eyeOff' : 'eye'} size={15}`.

## 4. States

| State | Behavior |
| --- | --- |
| Masked (default) | prefix + 16 dots + tail (or `value` fallback); eye shows `eye` glyph |
| Revealed | full secret (`--text`); eye shows `eyeOff`; `aria-pressed="true"` → toggle tints `--accent-2` |
| First reveal | `onReveal` fires **once** (guarded by `hasRevealed`); subsequent toggles do not re-fire |
| Hover (field) | border → `--accent` |
| Toggle hover | `--accent` + `--glass-2` fill |
| Toggle focus | `:focus-visible` `2px --accent` outline, `offset 1px` |
| Copy | `CopyButton` copies `full`; its own copied-confirmation state is internal to that primitive |

There is no disabled or error state — the field is a static, read-only display.

## 5. Platform & relationship to root kit

**Web-only by design.** Secret management lives in the operator console, which has no native surface,
so there is no `@lockin90/ui-native` counterpart and no parity obligation. It depends on web substrate:
the clipboard via the reused `CopyButton`, `:focus-visible`, and ellipsis overflow.

It composes two **root** kit primitives: `Icon` (the eye/eyeOff toggle glyph) and `CopyButton`
(re-exported from `packages/ui/src/components/Popover`) for the copy action. It is **not** a wrapper of a
root primitive and is explicitly **distinct from `PasswordInput`** — `SecretField` is read-only display,
`PasswordInput` is an editable form control.

## 6. Composition & usage

- **Used by:** operator screens showing webhook signing keys, TOTP/2FA secrets, API tokens.
- **Composes:** `Icon`, `CopyButton`.

```tsx
import { SecretField } from '@lockin90/ui/admin';

<SecretField
  prefix="whk_live_"
  value="whk_live_••••••••1a2b"
  tail="1a2b"
  revealedValue="whk_live_9f3c7e21aa4b1a2b"
  onReveal={() => audit('webhook_secret.revealed', { keyId })}
/>

// no split prefix/tail — value itself is the masked string
<SecretField value="••••••••••••3f9a" revealedValue={fullToken} copyable />
```

## 7. Accessibility

- The leading key glyph is `aria-hidden` (decorative).
- **Toggle:** real `<button type="button">` with `aria-pressed={revealed}` and an
  `aria-label` that flips between `"Reveal secret"` / `"Hide secret"` (+ matching `title`).
- **Copy:** `CopyButton` carries `aria-label="Copy secret"` + `title="Copy"`.
- The secret text is real, selectable mono text (a `<code>`), so when revealed it is available to
  assistive tech and manual copy.

## 8. Usage rules — Do / Don't

**Do**
- Wire `onReveal` to your audit log — it fires exactly once per mount, on first reveal.
- Provide a `revealedValue` distinct from the masked `value` so the masked form never leaks the secret.
- Use `prefix`/`tail` to show the non-secret envelope (key family, last 4) for recognizability.

**Don't**
- ✗ Don't use `SecretField` as an input — it is read-only; for entry use `PasswordInput`.
- ✗ Don't put the real secret in `value` when you pass `revealedValue` — `value` is the masked display.
- ✗ Don't hardcode the surface/border/tail colors — `--bg-0`, `--border-2`, `--accent-2` come from tokens.
- ✗ Don't rely on `onReveal` re-firing on every toggle — it is intentionally once-only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled "masked key + eye" field will diverge from the audit-hook contract
  and the kit visuals — import `SecretField`.
- **New need → extend here.** If a screen needs a different reveal/copy behavior, add a prop to
  `SecretField` — never a one-off masking widget.
- **Tokens only.** Surface, border, dot/tail/full colors, and the toggle hover/focus tints are
  `@lockin90/tokens` vars; any hardcoded hue is a bug.
- **Web-only.** Admin primitive — no native counterpart, no parity to hold.
