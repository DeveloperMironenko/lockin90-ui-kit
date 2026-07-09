# SDD — `SsoButton`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — cross-platform SSO sign-in button.
> **Source:** `packages/ui/src/components/SsoButton.tsx` · `packages/ui-native/src/components/SsoButton.tsx` · web CSS `packages/ui/src/styles/components/sso.css` (`.lk-sso*`).
> **Exports:** `SsoButton`, type `SsoButtonProps`, type `SsoProvider` (web) / `SsoProvider` (native).
> **Status:** Shipped (web + native). **Parity:** 🟢 same API, same brand glyphs, same label, same layout; substrate-only differences (web `<button>` + `disabled`/`onClick` ↔ native `Pressable` + `onPress`).
> **Stories:** `packages/ui/src/stories/SsoButton.stories.tsx` · native `SsoButton` story.

---

## 1. Overview

The kit's **social sign-in button**: a brand glyph (full-color Google "G" or monochrome Apple mark) + a `"Google"` / `"Apple"` label, in a glass pill that stretches to fill its grid cell. Auth screens lay two side by side ("Continue with …"). It is the single sanctioned SSO button — never hand-roll a provider button (the brand glyphs + the exact chrome live here).

Distinct from `Button variant='sso'` (a generic neutral button style): `SsoButton` carries the actual **brand icon** and provider label driven by a single `provider` prop.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `provider` | `SsoProvider` = `'google' \| 'apple'` | — (required) | ✓ | ✓ | picks the brand glyph + label |
| `disabled` | `boolean` | `false` | ✓ | ✓ | web: native `<button disabled>` (opacity 0.5, not-allowed); native: `disabled` on `Pressable` (opacity 0.5) |
| `onClick` | `(e) => void` | — | ✓ | — | web click handler (via `...rest`) |
| `onPress` | `() => void` | — | — | ✓ | native press handler (via `...rest`) |
| `className` | `string` | — | ✓ | — | web only — merged onto `.lk-sso` via `cn` |
| _rest_ | web `Omit<ButtonHTMLAttributes<HTMLButtonElement>,'children'>` · native `Omit<PressableProps,'children'\|'style'>` | — | ✓ | ✓ | spread onto the root button/pressable |

- **Web:** renders a real `<button type="button">` so it accepts `onClick`, `disabled`, `form`, etc. Label + `aria-label="Continue with {Google|Apple}"`.
- **Native:** renders a `Pressable` with `accessibilityRole="button"` + `accessibilityLabel="Continue with {label}"`, pressed + disabled visual states.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`.lk-sso`) | Native |
| --- | --- | --- |
| Layout | `flex:1`, inline-flex row, center, `gap 8px`, full width | `flex:1`, row, center, `gap 8` |
| Padding | `10px 12px` | `10 / 12` |
| Radius | `--r-sm` (10) | `radii.sm` |
| Background | `--glass` | `rgba(255,255,255,0.04)` |
| Border | `1px --border` | `1px rgba(255,255,255,0.10)` |
| Hover / pressed | `--glass-2` bg + `--border-2` border | `rgba(255,255,255,0.06)` bg + `.16` border |
| Disabled | `opacity 0.5`, `cursor: not-allowed` | `opacity 0.5` |
| Icon slot | `16×16`, centered | `16×16`, centered |
| Google glyph | 4-color brand "G" (fixed brand hex) | same 4-color brand "G" |
| Apple glyph | monochrome, `currentColor` (= `--text`) | monochrome, `colors.text` |
| Label | `--font-ui`, 12.5px, 600, `.1px` ls, `--text` | `fonts.ui`, 12.5px, 600, `colors.text` |

> The **brand glyphs** use fixed brand colors by design — they are trademarks, not themeable surfaces. Every themeable surface (bg, border, label, radius, hover) is token-driven. On web the glass/border tokens (`--glass` ≈ `rgba(255,255,255,.045)`) are the token equivalents of the native literals.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | glass pill + brand glyph + label | same |
| Hover / focus | `--glass-2` bg, `--border-2` border, `outline:none` on focus-visible | n/a (no hover on touch) |
| Pressed | (browser active) | `pressed` → `.06` bg, `.16` border |
| Disabled | `opacity 0.5`, `cursor: not-allowed`, button inert | `opacity 0.5`, press inert |

## 5. Web ↔ native parity

**Verdict: 🟢 parity.** Same `provider` API, same two brand glyphs (identical SVG paths), same `"Google"`/`"Apple"` label, same `"Continue with …"` accessible name, same `flex:1` cell-filling layout, same 10/12 padding + `radii.sm`, same 16px icon slot, same 12.5px/600 label. Differences are substrate only:

- **Handler + element:** web `<button onClick disabled>` ↔ native `Pressable onPress disabled` — universal substrate, callers read 1:1.
- **Hover vs pressed:** web adds hover/focus-visible states (no touch equivalent); native adds a pressed state. Same tone tokens on both.
- **Surface literals:** native hardcodes `rgba(255,255,255,.04/.10)`; web uses the equivalent `--glass`/`--border` tokens. Same rendered chrome.

No capability gap.

## 6. Composition & usage

- **Used in:** auth screens (sign-in / sign-up), typically a two-up row under the email/password form, above or below a labeled `Divider` ("or continue with").
- **Composes:** inline brand-glyph SVGs (self-contained).

```tsx
// web — two providers side by side
<div style={{ display: 'flex', gap: 10 }}>
  <SsoButton provider="google" onClick={signInWithGoogle} />
  <SsoButton provider="apple" onClick={signInWithApple} />
</div>

// native — same API
<SsoButton provider="google" onPress={signInWithGoogle} />
```

## 7. Accessibility

- **Web:** a real `<button>` (keyboard-focusable, Enter/Space activate); `aria-label="Continue with Google/Apple"` names it beyond the visible short label; the icon is `aria-hidden`. `:focus-visible` shows the glass focus state.
- **Native:** `accessibilityRole="button"` + `accessibilityLabel="Continue with {label}"`.
- **Contrast:** label is full `--text` on the glass surface; the brand glyphs are decorative (the label carries the name).
- **Disabled:** the `disabled` state is conveyed by the inert button + reduced opacity; pair with host logic that prevents submit.

## 8. Usage rules — Do / Don't

**Do**
- Use `SsoButton` for every Google/Apple sign-in affordance; drive it with `provider`.
- Lay providers in a flex row so each `flex:1` button fills its half.
- Pass the sign-in handler via `onClick` (web) / `onPress` (native).

**Don't**
- ✗ Don't hand-roll a provider button with a hardcoded brand SVG + chrome — import `SsoButton`.
- ✗ Don't recolor the brand glyphs — they are fixed trademarks.
- ✗ Don't hardcode the glass/border/label tokens or the radius — they come from `@lockin90/tokens`.
- ✗ Don't use `Button variant='sso'` when you need the actual brand icon + provider label — that's the neutral style only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A per-screen "brand icon + label" button drifts from the exact glyphs/chrome and the accessible name — use `SsoButton`.
- **New provider → add to BOTH platforms.** A third provider (e.g. GitHub) is a new `SsoProvider` value + glyph added to web AND native with the same prop API + tokens — never a one-off.
- **Tokens only.** Every themeable surface is token-sourced; the only literals are the deliberate brand-glyph colors documented in §3.
- **Parity gate.** Confirm the web phone-width button ≡ native button (same glyph, label, chrome) before shipping an auth screen.
