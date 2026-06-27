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
| `toggleLabel` | `string` | `'Show password'` / `'Hide password'` | ✓ | ✓ | a11y label for the eye button |
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
↔ reveal, `defaultVisible`, `toggleLabel`), same 18px eye/eyeOff glyphs, same invalid treatment. Differences are
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

- **Web:** real `<input type="password">`. The eye is a `<button type="button">` with `aria-label`
  (`toggleLabel`) and `aria-pressed={visible}` so AT announces masked/revealed state. Provide a field label via
  `FormField`/`aria-label`.
- **Native:** the eye is a `Pressable` with `accessibilityRole="button"` + `accessibilityLabel` (`toggleLabel`)
  and `hitSlop={8}` for an easy touch target.
- **Toggle label:** defaults flip between `"Show password"` and `"Hide password"` to match current state — keep that semantic if you override `toggleLabel`.

## 8. Usage rules — Do / Don't

**Do**
- Use `PasswordInput` for every password field — never a plain `Input type="password"` without the toggle.
- Let the component own masking; don't manage `type`/`secureTextEntry` yourself.
- Wrap in `FormField` for the label + error; add `PasswordStrengthMeter` on creation flows.
- Keep `toggleLabel` state-aware if customized (show vs hide).

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
