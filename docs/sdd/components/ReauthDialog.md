# SDD — `ReauthDialog`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/ReauthDialog.tsx` · `packages/ui-native/src/components/ReauthDialog.tsx` ·
> web CSS `packages/ui/src/styles/components/reauth.css` (`.lk-reauth*`).
> **Exports:** `ReauthDialog`, type `ReauthDialogProps`.
> **Status:** Shipped. **Parity:** 🟡 same API/flow; web Google path is a `Button` (default + leading glyph), native a hand-rolled `Pressable` styled to match the default Button chrome.
> **Stories:** `packages/ui/src/stories/ReauthDialog.stories.tsx` · native equivalent.

---

## 1. Overview

A **step-up re-authentication dialog** — "confirm it's you" before a sensitive action (delete account, change email, reveal a secret). A centered `Modal` (`size="sm"`) hosting up to two re-auth paths:

- **Password path** (`hasPassword`, default on): a reassurance line, an optional danger `Alert`, a `Password` `Input`, and a **full-width primary Confirm** button.
- **Google path** (`hasGoogle`, default off): a "Continue with Google" button with the multicolor Google "G".

When both paths show, an **"or" hairline divider** separates them. A ghost **Cancel** button always closes. Local password state is kept internal and **cleared on close** (and whenever `open` flips false) so it never leaks across opens.

It's the one sanctioned re-auth surface — built on `Modal` + `Input` + `Button` + `Alert`; only the layout lives in this component.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `open` | `boolean` | — (required) | ✓ | ✓ | when false nothing renders |
| `onClose` | `() => void` | — (required) | ✓ | ✓ | scrim/ESC(web)·back(native)/close-button/Cancel |
| `onSubmitPassword` | `(password: string) => void` | — | ✓ | ✓ | called with the field value on Confirm |
| `onGoogle` | `() => void` | — | ✓ | ✓ | invoked by the Google button |
| `title` | `string` | `"Confirm it's you"` | ✓ | ✓ | Modal header |
| `description` | `string` | `'For your security, re-enter your password to continue.'` | ✓ | ✓ | reassurance line; hidden if empty |
| `hasPassword` | `boolean` | `true` | ✓ | ✓ | show password field + Confirm |
| `hasGoogle` | `boolean` | `false` | ✓ | ✓ | show "Continue with Google" |
| `loading` | `boolean` | `false` | ✓ | ✓ | disables inputs; Confirm → "Confirming…" |
| `error` | `string` | — | ✓ | ✓ | danger `Alert` above the fields; marks Input `invalid` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only (on the body `View`) |

- **Web:** `'use client'`; password `Input` is `type="password"`, `autoComplete="current-password"`; the form's `onSubmit` calls `submit()`.
- **Native:** password `Input` is `secureTextEntry` + `textContentType="password"`; `onSubmitEditing` → `submit()`. No `className` (web extends nothing extra; native takes `style`).
- **Submit guard:** `submit()` no-ops while `loading` or when the password is empty; Confirm is `disabled={loading || !password}` on both.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native | Value |
| --- | --- | --- | --- |
| Shell | `Modal` `size="sm"` | `Modal` `size="sm"` | shared overlay primitive |
| Body gap | `16px` column | `16` column | `.lk-reauth` / `body` |
| Description | `--font-ui` 14px, line 1.55, `--text-dim` | `fonts.ui` 14, line 22, `colors.textDim` | — |
| Password form gap | `16px` (so input→Confirm == Confirm→Cancel) | `16` | `.lk-reauth-pw` / `pw` |
| Confirm | full-width `Button variant="primary"` | full-width `Button variant="primary"` | `justify-content:center` |
| "or" divider | `--font-mono` 11px, `.08em` uppercase, `--text-faint`; `1px --border` rules | `fonts.mono` 11, `.9` ls uppercase, `colors.textFaint`; `1px colors.border` rules | gap `12px` |
| Google button | `Button variant="default"`, full-width, centered glyph | `Pressable` → glass2 + border2 **pill**, `gap:9`, pad `12/20` | mirrors default Button chrome |
| Google glyph | inline `<svg>` 18×18 (4-color "G") | `Svg` 18×18 (same paths) | `#4285F4/#34A853/#FBBC05/#EA4335` |
| Cancel | full-width `Button variant="ghost"` | full-width `Button variant="ghost"` | — |

- Google button label/colors are **identical** (same four brand fills); the difference is the host element (Button vs Pressable) — see §5.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Closed (`open=false`) | renders nothing; password cleared via `useEffect` | same |
| Default | description + (password form / Google / Cancel) | same |
| Error | danger `Alert` above fields; Input `invalid` | same |
| Loading | Input + buttons disabled; Confirm → "Confirming…" | same; Google `Pressable` dims |
| Pressed | Button press feedback | Confirm/Cancel via `Button`; Google `Pressable` → opacity .85 + `scale .98` |
| Empty password | Confirm disabled; `submit()` no-ops | same |

## 5. Web ↔ native parity

**Verdict: 🟡 same API + flow, one structural difference in the Google path.** Identical props, defaults, password-state lifecycle (cleared on close / `open` false), submit guard, error/loading handling, the "or" divider, and the ghost Cancel. Both wrap the shared `Modal` (`sm`) and reuse `Input` + `Button` + `Alert`.

The one real difference (does not block use):

- **Google button host:** web renders it as a real `Button variant="default"` with the Google glyph + label as children. Native renders a **hand-rolled `Pressable`** styled to match the default Button chrome (`glass2` bg + `border2` pill, `gap:9`, pad `12/20`) — the comment notes this mirrors Button's default variant. Visually equivalent; it's a local lookalike rather than the `Button` primitive. *Flagged:* native could instead use `Button variant="default" leading={<GoogleMark/>} title="Continue with Google"` for strict primitive parity — worth aligning.
- **Substrate:** web Input is `type="password"`/`onSubmit`; native is `secureTextEntry`/`onSubmitEditing`. Same behavior.

No capability gap — the dialog is fully usable and visually equivalent on both platforms.

## 6. Composition & usage

- **Composes from:** `Modal` (shell), `Input` (password), `Button` (Confirm/Cancel — and the web Google button), `Alert` (error). Native Google path uses a `Pressable` + `react-native-svg`.
- **Used by:** account/security flows requiring step-up — delete account, change email/password, reveal recovery codes, admin write-mode confirmations.

```tsx
// web
<ReauthDialog
  open={open}
  onClose={() => setOpen(false)}
  onSubmitPassword={(pw) => confirm(pw)}
  hasGoogle onGoogle={ssoReauth}
  loading={pending}
  error={err}
/>

// native
<ReauthDialog
  open={open}
  onClose={() => setOpen(false)}
  onSubmitPassword={(pw) => confirm(pw)}
  hasGoogle onGoogle={ssoReauth}
  loading={pending}
  error={err}
/>
```

## 7. Accessibility

- **Web:** inherits the `Modal` focus trap + ESC + scrim-close; the password field is a labeled `Input` with `autoComplete="current-password"`; Confirm is a real `<button type="submit">` inside a `<form>` (Enter submits). The error renders in a danger `Alert` (announced).
- **Native:** `Modal` handles Android back + scrim tap; password is `secureTextEntry` + `textContentType="password"` (OS autofill); the Google `Pressable` has `accessibilityRole="button"` + `accessibilityLabel="Continue with Google"`; `onSubmitEditing` submits from the keyboard.
- **Hit target:** all actions are full-width `Button`s/`Pressable` (≥44px `md`). Confirm stays disabled until a password is entered, signaling required input.

## 8. Usage rules — Do / Don't

**Do**
- Use it as the single step-up gate before any sensitive/destructive action.
- Show `error` from the server on a failed re-auth (it both alerts and marks the Input invalid).
- Set `loading` during the async confirm so the dialog can't be double-submitted.
- Enable `hasGoogle` only for accounts that actually authenticate via Google.

**Don't**
- ✗ Don't build a custom "enter your password to continue" modal — use `ReauthDialog`.
- ✗ Don't persist the password — the component intentionally clears it on close; don't lift it into long-lived state.
- ✗ Don't show both paths when only one applies (toggle `hasPassword`/`hasGoogle`).
- ✗ Don't hardcode the divider/Google chrome colors — they're tokens (and the Google brand fills are the only sanctioned literals).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke re-auth modal will drift from this layout + the password-clear lifecycle (a security detail). Import `ReauthDialog`.
- **Align the Google host.** The native Google `Pressable`-lookalike should track the default `Button` chrome exactly; if Button changes, update it (or migrate to `Button` + `leading`) — don't let it diverge.
- **New re-auth path → both platforms.** A new method (passkey, TOTP) is added as a prop + tokens on web **and** native, never a one-off.
- **Tokens only.** Modal, divider, and button chrome come from `@lockin90/tokens`; only the four Google brand colors are hardcoded (identical in both twins).
