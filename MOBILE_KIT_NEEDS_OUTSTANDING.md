# Mobile kit needs — OUTSTANDING (round 3)

_Updated 2026-06-23 after the kit shipped home/activity/google/apple/globe glyphs, PasswordInput, and
TabBar fabIndex + full-IconName resolver. These are the items the mobile rebuild still needs. Both platforms
(web + native), parity-locked, tokens only, Storybook + green build._

> ✅ **LANDED 2026-06-23 (ui-kit, both packages, `tsc` + build green; re-verify after a kit rebuild / `pnpm install`):**
> **§1** — added glyphs `mail`, `caffeine`, `meal`, `mood`, `scale`, `ruler`, `card`, `data-source`
> (canonical names shipped: **`data-source`** and **`card`** — `plug`/`plans` not aliased). `sleep`
> + `heart` already existed from the prior round and were **kept** (the alt wave/HR paths above were
> not applied — use the existing crescent `sleep` / heart). Icon set now 95 glyphs.
> **§2** — `Button` gained a `leading?: ReactNode` slot on both platforms, so the Google/Apple SSO
> buttons (`<Button leading={<Icon name="google"/>}>`) need no app composition.

## 1. `Icon` glyphs still missing  ·  P1
Add to the `IconName` union + glyph map (exact stroke paths from `lockin90-design/mobile/*.html`):
- **`mail`** (envelope) — email fields. `rect x3 y5 w18 h14 rx2` + `m3 7 9 6 9-6`.
- **`caffeine`** — `M18 8h1a3 3 0 0 1 0 6h-1M4 8h14v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8ZM7 2v2M11 2v2M15 2v2`
- **`meal`** — `M4 3v7a3 3 0 0 0 6 0V3M7 3v18M17 3c-1.5 1-2 3-2 6s.5 4 2 4v8`
- **`sleep`** — `M3 12h3l2-3 3 6 2-4 2 2h6`
- **`mood`** — `circle cx12 cy12 r9` + `M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01` (or reuse the existing `mood-*` faces)
- **`scale`** (weight) — `M6 9h12l1.5 11H4.5zM9 9a3 3 0 0 1 6 0`
- **`ruler`** (height) — `M12 3v18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M5 12h14`
- **`heart`** (max HR) — `M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z`
- **`card`/`plans`** — `rect x2 y5 w20 h14 rx3` + `M2 10h20`
- **`data-source`/`plug`** — `rect x2 y4 w20 h14 rx2` + `M2 9h20M7 18v2M17 18v2`

Once these land, the app drops its interim inline-SVG glyph helpers (`components/AuthIcons`,
`components/dashboard/glyphs`, the onboarding/account inline SVGs).

## 2. `Button` `leading` icon slot (or an `SSOButton`)  ·  P1
`ButtonProps` still can't render an icon beside the label, so the **Google/Apple SSO buttons**
(brand logo + label, ghost, 2-up) are an app composition (`components/SsoButton.tsx`). Add
`leading?: ReactNode` to `Button` (icon before `title`), OR ship a dedicated `SSOButton`. Then the app
drops `SsoButton`. (Glyphs `google`/`apple` already exist ✅.)

## RESOLVED by recent kit work (no action — app will migrate to these)
- `PasswordInput` ✅ → replaces `components/PasswordField` (Input + eye overlay). `Input.trailing` no longer needed.
- `Icon` `home`/`activity` ✅ + `TabBar` `fabIndex` + full-IconName resolver ✅ → replaces the inline SVG + FAB
  overlay in `components/AppTabBar`.
- `Icon` `google`/`apple`/`globe` ✅ → app will swap the inline brand/globe SVGs.

## Note (not a kit gap)
`ReauthDialog` exists in the kit ✅; the APP still needs to re-add a small reauth-host wired to the reauth
bridge so step-up flows (account delete) complete — app-side follow-up.
