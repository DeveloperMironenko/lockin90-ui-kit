# SDD — `QRCode`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/QRCode.tsx` · `packages/ui-native/src/components/QRCode.tsx` · web CSS `packages/ui/src/styles/components/qrcode.css` (`.lk-qrcode*`).
> **Exports:** `QRCode`, type `QRCodeProps`. _(The internal QR encoder is not exported.)_
> **Status:** Shipped (web + native). **Parity:** ✅ identical — the native twin reuses the **same pure-TS encoder**, rendered with `react-native-svg` instead of a DOM SVG (see §5).
> **Stories:** `packages/ui/src/stories/QRCode.stories.tsx` · `packages/ui-native/src/stories/QRCode.stories.tsx`.

---

## 1. Overview

A **real, scannable QR code** rendered as crisp SVG modules — **dependency-free**. The component ships a self-contained QR Model 2 (byte mode) encoder: UTF-8 data encoding, Reed–Solomon error correction, finder/alignment/timing patterns, format + version info, all 8 data masks with penalty-based mask selection, and automatic version sizing (versions 1..10).

It exists for MFA/TOTP enrolment cards ("scan this with your authenticator") and any "scan to open" payload (a URL, an `otpauth://` URI), with **no runtime dependency** — the kit avoids pulling a QR library. Chrome mirrors the admin MFA-enrol `.qr` card: a light quiet-zone surface with a small radius, inset padding, and soft elevation.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `string` | — (required) | ✓ | ✓ | the encoded payload (UTF-8); e.g. an `otpauth://` URI or URL |
| `size` | `number` | `180` | ✓ | ✓ | rendered side length px (QR is square) |
| `className` | `string` | — | ✓ | — | web only — merged onto the wrapper |
| `style` | web `CSSProperties` · native `StyleProp<ViewStyle>` | — | ✓ | ✓ | web: merged after `width`/`height`; native: margins/spacing on the card |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web only — spread onto the wrapper `<div>` |

- **Web:** `forwardRef<HTMLDivElement>`. The matrix is computed in `useMemo([value])`, then drawn as one SVG `<path>` of `M{c} {r}h1v1h-1z` rects (one per dark module) inside a 4-module quiet zone; `viewBox` = `n + 8` (module units), `shape-rendering="crispEdges"`.
- **Native:** a plain function (no `ref`). The matrix is computed in the **same** `useMemo([value])`, then drawn with `react-native-svg` — one `<Path>` (`M{c} {r}h1v1h-1z` per dark module) over a white `<Rect>` quiet zone, inside a `<Svg viewBox="0 0 {n+8} {n+8}">`. The `Svg` sits on a light `View` card sized to `size` with an `11px` inset gutter. No `className`/`...rest`.
- **Encoding policy:** prefers EC level **M**, then falls back through L→M→Q→H to fit; if a payload exceeds version-10 byte capacity it falls back to the largest supported config (`L`, v10) rather than throwing.
- **Capacity:** version sizing uses byte-mode char-count bits (8 for v1..9, 16 for v10) against each version's data-codeword capacity (`EC_TABLE`); matrix side `n = version*4 + 17` (21..57). Mask is chosen by the ISO-18004 penalty score across all 8 masks (lowest wins), and format/version info is written per spec — i.e. this is a faithful encoder, not an approximation.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Value |
| --- | --- | --- |
| Container | `display:grid; place-items:center`, `flex:none`, `box-sizing:border-box` | sized via inline `width`/`height` = `size` |
| Padding | `11px` | inset quiet-zone gutter |
| Radius | `--r-sm` | `10` |
| Surface | `#eef1f8` | light surface so dark modules read crisply |
| Border | `--border-2`, 1px | `rgba(255,255,255,.16)` |
| Shadow | `--elev-1` (fallback `0 4px 14px rgba(0,0,0,.25)`) | soft elevation |
| Quiet zone (svg bg) | `#ffffff` (`.lk-qrcode-bg` rect) | 4-module margin |
| Dark modules | `#0a0a12` (`.lk-qrcode-fg` path) | near-black for max scan contrast |
| Module rendering | `shape-rendering: crispEdges` | no anti-alias blur |

- The QR intentionally uses **fixed light/dark literals** (`#eef1f8` surface, `#ffffff` quiet zone, `#0a0a12` modules) rather than spectrum tokens — scan contrast (light background, near-black modules) is a functional requirement, not a theming choice. The card *chrome* (radius, border, shadow) uses tokens.
- **Native mapping (same values):** the card `View` is `width/height = size`, `padding 11`, `borderRadius radii.sm`, `backgroundColor #eef1f8`, `borderWidth 1` `borderColor colors.border2`, `...nativeShadows.elev1`; the inner `Svg` (side `= size − 22`) draws a `#ffffff` `<Rect>` quiet zone + a `#0a0a12` `<Path>` of modules. Same functional literals for the code, same tokens for the chrome as web.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | encoded matrix rendered as SVG modules on the light card | same — `react-native-svg` modules on the light `View` card |
| New `value` | re-encodes (memo keyed on `value`) and redraws | same — `useMemo([value])` re-encodes and redraws |
| Oversize payload | encoder falls back to `L`/v10 (no throw); very long strings may exceed capacity | identical encoder → identical fallback |
| Hover / focus / disabled | none — static, non-interactive `role="img"` | none — static `accessibilityRole="image"` |

There is no interactive/loading/error state — the QR is a static, deterministic image of `value`, identical on both platforms.

## 5. Web ↔ native parity

**Verdict: ✅ identical — the gap is closed.** `@lockin90/ui-native` now ships a `QRCode` (`packages/ui-native/src/components/QRCode.tsx`, exported from the native index) that **reuses the identical pure-TS encoder** — the same GF(256) tables, Reed–Solomon, finder/alignment/timing/format/version placement, 8-mask penalty selection, and version-1..10 sizing — ported verbatim from the web component. Given the same `value`, both platforms produce the **same module matrix** and the same `M{c} {r}h1v1h-1z` path.

Differences are substrate only:

- **Render substrate:** web draws the matrix as a DOM `<svg><path>`; native draws it with `react-native-svg` (`<Svg><Rect/><Path/></Svg>`). Same viewBox (`n + 8` module units, 4-module quiet zone), same path data.
- **Card chrome:** web uses `.lk-qrcode` CSS (grid center, `11px` pad, `--r-sm`, `--border-2`, `--elev-1`, `#eef1f8` surface); native mirrors it with a `View` (`padding 11`, `radii.sm`, `colors.border2`, `nativeShadows.elev1`, `#eef1f8`). Same functional `#eef1f8`/`#ffffff`/`#0a0a12` scan literals.
- **Props:** web adds `className` + `...rest` + `ref`; native adds a `style` (`ViewStyle`) for margins. The shared `value`/`size` API is identical.

There is **no capability gap** — a cross-platform "scan to enrol" flow can use `QRCode` on both web and native with the same props.

## 6. Composition & usage

- **Composes from:** nothing — fully self-contained (its own GF(256) tables, Reed–Solomon, masking). The native twin ports the identical encoder.
- **Used by:** MFA/TOTP enrolment ("scan with your authenticator") + any "scan to open" affordance — on web (admin) and native (mobile MFA/scan screens).

```tsx
// web + native — TOTP enrolment (same props)
<QRCode value="otpauth://totp/LockIn90:ada@x.com?secret=JBSWY3DPEHPK3PXP&issuer=LockIn90" size={200} />

// web + native — scan-to-open URL
<QRCode value="https://lockin90.com/r/abc123" />
```

## 7. Accessibility

- **Web:** the wrapper is `role="img"` with `aria-label="QR code"`. The payload itself is **not** read aloud (a screen-reader user can't scan a screen anyway) — always pair the QR with the **plaintext fallback** (e.g. the TOTP secret as copyable text, or the URL as a link) so non-scanning users can complete the flow.
- **Contrast:** functional black-on-white module contrast is fixed and not theme-dependent — do not restyle the module colors.

## 8. Usage rules — Do / Don't

**Do**
- Pass the exact payload string (`otpauth://…`, URL) as `value` — the component encodes UTF-8 faithfully.
- Always show a **manual fallback** beside the QR (copyable secret / link) for accessibility + non-camera users.
- Keep payloads reasonably short (it sizes versions 1..10); long URLs may exceed capacity.
- Use `size` to fit the card; the QR stays square + crisp.

**Don't**
- ✗ Don't recolor the modules/quiet zone — the light/dark literals are a scan-contrast requirement, not theming (both platforms).
- ✗ Don't add a QR library dependency — the encoder is intentionally self-contained.
- ✗ Don't rely on the QR as the only way to complete a flow (always provide the text fallback).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** Don't drop in a third-party QR widget or a `<canvas>`/native one-off — use `QRCode`; it's dependency-free (native reuses `react-native-svg`, already a peer dep) and on-brand for the card chrome.
- **One encoder, two renderers.** The native twin **reuses the ported pure-TS encoder** with the same `value`/`size` API. If the encoder ever changes (new version range, EC policy), update BOTH copies in lockstep — never let web and native QR matrices diverge.
- **Tokens for chrome, literals for the code.** The card radius/border/shadow are tokens (`radii.sm`/`colors.border2`/`nativeShadows.elev1`); the `#eef1f8`/`#ffffff`/`#0a0a12` scan colors are deliberate functional literals — leave them.
- **Parity note.** A cross-platform "scan to enrol" flow renders identically on web + native (same encoder, same props); still pair the QR with a copyable text fallback for accessibility on both.
