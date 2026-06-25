# Kit updates needed — from the mobile AUTH build

_Filed 2026-06-23 while building the mobile auth screens against the current kit. Apply to **BOTH**
`@lockin90/ui` (web) + `@lockin90/ui-native` (native): same export name / prop API / visuals, Storybook on
both, `tsc`+build green, tokens only. Source of truth: `lockin90-design/mobile/auth-onboarding.html` (01–03)._

> The app already builds auth with interim compositions (so nothing is blocked), but these three updates make
> the auth screens fully kit-native and let me delete the app-side workarounds.

---

## 1. `Input` — add a `trailing` slot  ·  P0
`InputProps` has `leading?: ReactNode` but **no `trailing`**. Every password field in the mockup has a
**show/hide eye toggle** on the right inside the field shell. (The old kit's `PasswordInput` was removed.)
**Add:** `trailing?: ReactNode` (rendered right-aligned inside the field shell, mirrors `leading`).
```ts
interface InputProps extends TextInputProps {
  leading?: ReactNode;
  trailing?: ReactNode;   // NEW — e.g. a password eye toggle / clear button
  // ...existing label/unit/invalid/inputSize...
}
```
**Accept when:** `<Input secureTextEntry leading={<Icon name="lock"/>} trailing={<Pressable…><Icon name="eye"/></Pressable>} />`
renders the toggle inside the field on web + native. (Then the app drops its `PasswordField` overlay.)
*Alternative:* restore a `PasswordInput` primitive (leading lock + built-in eye toggle).

## 2. `Button` — add a `leading` icon slot (+ keep `ghost`)  ·  P1
`ButtonProps` is `{ variant, size, title }` — **no way to render an icon beside the label**. The
**Google / Apple SSO buttons** are a brand logo + label in a bordered (ghost) button, 2-up.
**Add:** `leading?: ReactNode` rendered before `title` (centered together).
```ts
interface ButtonProps {
  // ...existing variant/size/title...
  leading?: ReactNode;   // NEW — icon/logo before the label
}
```
**Accept when:** `<Button variant="ghost" leading={<Icon name="google"/>} title="Google" />` renders
logo+label centered, both platforms. *(Alternative: a dedicated `SSOButton`/`SocialButton` primitive.)*

## 3. `Icon` — add glyphs `google`, `apple`, `mail`, `globe`  ·  P1
- **`google`** (multicolor brand "G") + **`apple`** (monochrome `currentColor`) — for the SSO buttons.
- **`mail`** (envelope) — every email field's leading icon. Exact path: `rect x3 y5 w18 h14 rx2` +
  `m3 7 9 6 9-6` (viewBox `0 0 24 24`, stroke).
- **`globe`** — the language field's leading icon. Exact path: `circle cx12 cy12 r9` +
  `M3 12h18M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18`.
Kit has `apple-health` (heart, ≠ Apple logo), `lock`, `user`, `eye`/`eyeOff` already. Brand SVGs for
google/apple are in `auth-onboarding.html` `.sso` buttons. Interim: app renders mail/globe/google/apple
inline (`components/AuthIcons.tsx` + `SsoButton.tsx`); swap to `<Icon name=…>` when added.

## 4. (minor) `Select` — optional `leading` slot  ·  P2
The language field shows a leading globe inside the field. `SelectProps` has no `leading`. Add
`leading?: ReactNode` (mirrors `Input.leading`) so the globe sits inside the field. Low priority — the app
currently renders `Select` without the inline globe.

---

## Summary
- **P0:** `Input.trailing` slot (password eye toggle) — or restore `PasswordInput`.
- **P1:** `Button.leading` icon slot (SSO buttons) + `Icon` `google`/`apple` brand glyphs.
- Both platforms, parity-locked, Storybook + green build. When done, auth is fully kit-native (app drops
  its `PasswordField` + `SsoButton` interim compositions).
