# SDD — `PasswordInput`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/PasswordInput.tsx` · `packages/ui-native/src/components/PasswordInput.tsx` ·
> web CSS `packages/ui/src/styles/components/input.css` (`.lk-input*`) + `pwinput.css` (`.lk-input-trail`).
> **Exports:** `PasswordInput`, type `PasswordInputProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; reuses the `Input` shell, web adds a focus glow-ring (native border-only).
> **Stories:** `packages/ui/src/stories/PasswordInput.stories.tsx` · `packages/ui-native/src/stories/PasswordInput.stories.tsx`.

---

## 1. Overview

`PasswordInput` is a **password text field with a built-in show/hide eye toggle**. It reuses the `Input` glass
shell (same `label` / `leading` / `invalid` / `inputSize`) and adds a trailing eye button that flips the field
between masked and revealed. The masking is owned internally (web swaps `type` text↔password; native swaps
`secureTextEntry`) — the consumer never wires the toggle. It is the one sanctioned password field across auth,
reauth, and settings.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `label` | `string` | — | ✓ | ✓ | mono uppercase caption above the field |
| `invalid` | `boolean` | `false` | ✓ | ✓ | red border (web also reddens the focus ring) |
| `inputSize` | `'sm' \| 'md'` | `'md'` | ✓ | ✓ | density; mirrors `Input` |
| `leading` | `ReactNode` | — | ✓ | ✓ | icon/node inside the shell, left of the input |
| `defaultVisible` | `boolean` | `false` | ✓ | ✓ | start revealed |
| `showLabel` | `string` | `'Show password'` | ✓ | ✓ | a11y label of the eye button while masked (pass a localized string) |
| `hideLabel` | `string` | `'Hide password'` | ✓ | ✓ | a11y label of the eye button while revealed (pass a localized string) |
| `className` / `style` | — | — | `className` | `style` | web → `<input>` class · native → `TextInput` style |
| **value/change** | — | — | `value` + `onChange(e)` | `value` + `onChangeText(t)` | **platform-shaped** — DOM event vs string callback |
| _rest_ | `Omit<InputProps,'type'\|'unit'>` (web) / `Omit<TextInputProps,'secureTextEntry'>` (native) | — | ✓ | ✓ | `type`/`secureTextEntry` are owned internally |

- **Web:** `PasswordInputProps extends Omit<InputProps, 'type' | 'unit'>` — `type` is owned (flipped by the
  toggle) and `unit` is dropped (a unit suffix would collide with the eye). State `visible` drives `type` and the
  eye glyph.
- **Native:** declares its own `label`/`invalid`/`inputSize`/`leading` over `Omit<TextInputProps, 'secureTextEntry'>`;
  `secureTextEntry={!visible}` is owned. Focus + `visible` are component state.

## 3. Visual spec (tokens — never hardcode)

Inherits the **`Input` shell** verbatim (see `Input.md` §3): `--glass-2` fill, `1px --border-2`, `--r-sm` radius,
`9px 12px` / `sm 6px 10px` padding, `--font-ui` 14px / `sm 12.5px` text, `--font-mono` 10px label.

| Eye toggle | Web (`.lk-input-trail`) | Native (`styles.trail`) |
| --- | --- | --- |
| Glyph | `Icon name="eye"` / `"eyeOff"`, 18px | same `Icon`, 18px, `color={colors.textFaint}` |
| Color | `--text-faint` → hover `--text-dim` | `colors.textFaint` |
| Focus | `:focus-visible` 2px `--accent` outline, offset 2px | platform Pressable focus |
| Hit | inline-flex button | `Pressable` `hitSlop={8}` |

- **Focus (field):** web `:focus-within` → `--accent` border + `box-shadow 0 0 0 3px rgba(124,92,255,.14)`; native → accent border only.
- **Invalid:** border `--zone-low` / `colors.zoneLow` (web reddens the focus ring to `rgba(255,77,109,.16)`).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Masked (default) | `type="password"`, eye glyph | `secureTextEntry`, eye glyph |
| Revealed | `type="text"`, eyeOff glyph | `secureTextEntry={false}`, eyeOff glyph |
| Focus | `:focus-within` accent border + ring | `focused` state → accent border |
| Invalid | `.lk-input-invalid` red border | `colors.zoneLow` border |
| Toggle focus | `:focus-visible` accent outline | Pressable focus |

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped impl.** Same props, same glass shell, same eye toggle behavior (mask
↔ reveal, `defaultVisible`, `showLabel`/`hideLabel`), same 18px eye/eyeOff glyphs, same invalid treatment. Differences are
substrate-only:

- **Masking mechanism** — web flips the input `type` (`text`/`password`); native flips `secureTextEntry`. Same effect.
- **Focus affordance** — web glow-ring vs native accent border (inherited from `Input`).
- **Toggle press state** — web button `:focus-visible` outline + hover color; native `Pressable` with `hitSlop`.
- **Prop ancestry** — web extends `InputProps` (so `unit` is explicitly omitted); native re-declares the shell
  props over `TextInputProps`. App code still reads 1:1.

No capability gap blocks use.

## 6. Composition & usage

- **Built on:** the `Input` shell (`.lk-input-*` / `styles.field`); **composes** the `Icon` eye/eyeOff glyph.
- **Used by:** auth (sign-in / sign-up), `ReauthDialog` password step-up, change-password in settings.
- Pair with `PasswordStrengthMeter` below the field on sign-up / change-password.
- Wrap in `FormField` for label↔control linkage + error copy.

```tsx
// web
<FormField label="Password" htmlFor="pw" error={pwError}>
  <PasswordInput id="pw" value={pw} onChange={(e) => setPw(e.target.value)} invalid={!!pwError} />
</FormField>

// native
<FormField label="Password" error={pwError}>
  <PasswordInput value={pw} onChangeText={setPw} invalid={!!pwError} />
</FormField>
```

## 7. Accessibility

- **Kit rule:** CONVENTIONS "Accessibility" (2026-11-10) applies: contrast 4.5:1 text / 3:1 UI, 44pt native / 24px web targets, names from props, errors and changes announced, reduced motion, text scaling never disabled.
- **Web:** real `<input type="password">`. The eye is a `<button type="button">` with `aria-label`
  (`showLabel` while masked, `hideLabel` while revealed) and `aria-pressed={visible}` so AT announces
  masked/revealed state. Provide a field label via `FormField`/`aria-label`.
- **Native:** the eye is a `Pressable` with `accessibilityRole="button"` + `accessibilityLabel` (`showLabel` /
  `hideLabel` by state) and `hitSlop={8}` for an easy touch target.
- **Toggle label:** always names the action the press does now (show while masked, hide while revealed). Apps
  pass both strings translated; the English defaults are for stories only.

## 8. Usage rules — Do / Don't

**Do**
- Use `PasswordInput` for every password field — never a plain `Input type="password"` without the toggle.
- Let the component own masking; don't manage `type`/`secureTextEntry` yourself.
- Wrap in `FormField` for the label + error; add `PasswordStrengthMeter` on creation flows.
- Pass both `showLabel` and `hideLabel`, translated.

**Don't**
- ✗ Don't pass `type` (web) or `secureTextEntry` (native) — they're owned internally.
- ✗ Don't pass `unit` on web (it's omitted — the eye occupies the trailing slot).
- ✗ Don't hand-roll a password field with a custom eye — import `PasswordInput`.
- ✗ Don't hardcode the shell/glyph colors — they're tokens.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** An `Input` plus a hand-rolled eye button is a parity violation — it drifts from the masked/
  revealed semantics and the focus styling. Import `PasswordInput`.
- **New need → both platforms.** A new affordance (e.g. caps-lock hint) gets added to `PasswordInput` on web
  **and** native with the same prop name and tokens — never a one-off.
- **Tokens only.** Shell + eye glyph colors come from `@lockin90/tokens`; hardcoded values are bugs.
- **Parity gate.** Confirm the web phone-width password field and the native one match (same shell, eye glyph, toggle behavior, invalid state) before shipping.

## Update — 2026-11-02 (breaking: major)
- **`toggleLabel` → `showLabel` + `hideLabel`.** One string couldn't name both states: an app passing a
  translated "Show password" left the revealed state announced as "Show password" too (web Log in, mobile Log in).
  Two labels, chosen by state, on web and native. `toggleLabel` is removed, so `@lockin90/ui` and
  `@lockin90/ui-native` go to the next major; the one caller (`frontend` LoginForm) switches in its bump PR.

## Update — 2026-11-02 (native sizes match web)
- **Native height = web height:** `minHeight` 39.6 (sm 31.5) like `Input`; the input's explicit `lineHeight: 20` is gone (it made this field 3pt taller than `Input`). The `label` caption matches FormField's.

## Update — 2026-11-10 (accessibility, 1.35)

- **Edge and text:** as `Input` (`--border-control`, 16px / 16pt, box height kept; native tap on the padding
  focuses the field).
- **Eye toggle target:** native `hitSlop` 13 (18 + 26 = 44pt); web an invisible centred `::before`, 24px (44 at
  phone width). Its focus ring is the kit's shared one (`2px --accent-2`).
- **`ref`** (web + native): forwarded to the field itself (web `<input>`, native `TextInput`), as `Input`, for focusing the next field on Return.
- **Native ref type:** `TextInputRef` (`ComponentRef<typeof TextInput>`), as `Input`, so `ref.current.focus()` types on RN 0.81 and 0.88.

## Update — 2026-11-10 (running-app audit, 1.35)

- As `Input`: `--field` fill, the focus ring, 44 at phone width / native.

## Update — 2026-11-10 (simulator check, 1.35)

- **Increase Contrast** (native `useContrastColors`; web `prefers-contrast: more`): faint / dim text and the edge step up.
