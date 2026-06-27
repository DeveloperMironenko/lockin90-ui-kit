# SDD — `QRCode`

> **Package:** `@lockin90/ui` (web) — **web-only** root export. No native twin.
> **Source:** `packages/ui/src/components/QRCode.tsx` · web CSS `packages/ui/src/styles/components/qrcode.css` (`.lk-qrcode*`).
> **Exports:** `QRCode`, type `QRCodeProps`. _(The internal QR encoder is not exported.)_
> **Status:** Shipped (web). **Parity:** 🔵 web-only — there is no `@lockin90/ui-native` `QRCode`; native MFA/scan surfaces must source a QR elsewhere (see §5).
> **Stories:** `packages/ui/src/stories/QRCode.stories.tsx`.

---

## 1. Overview

A **real, scannable QR code** rendered as crisp SVG modules — **dependency-free**. The component ships a self-contained QR Model 2 (byte mode) encoder: UTF-8 data encoding, Reed–Solomon error correction, finder/alignment/timing patterns, format + version info, all 8 data masks with penalty-based mask selection, and automatic version sizing (versions 1..10).

It exists for MFA/TOTP enrolment cards ("scan this with your authenticator") and any "scan to open" payload (a URL, an `otpauth://` URI), with **no runtime dependency** — the kit avoids pulling a QR library. Chrome mirrors the admin MFA-enrol `.qr` card: a light quiet-zone surface with a small radius, inset padding, and soft elevation.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `string` | — (required) | ✓ | — | the encoded payload (UTF-8); e.g. an `otpauth://` URI or URL |
| `size` | `number` | `180` | ✓ | — | rendered side length px (QR is square) |
| `className` | `string` | — | ✓ | — | merged onto the wrapper |
| `style` | `CSSProperties` | — | ✓ | — | merged after `width`/`height` |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | spread onto the wrapper `<div>` |

- **Web:** `forwardRef<HTMLDivElement>`. The matrix is computed in `useMemo([value])`, then drawn as one SVG `<path>` of `M{c} {r}h1v1h-1z` rects (one per dark module) inside a 4-module quiet zone; `viewBox` = `n + 8` (module units), `shape-rendering="crispEdges"`.
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

## 4. States

| State | Web |
| --- | --- |
| Default | encoded matrix rendered as SVG modules on the light card |
| New `value` | re-encodes (memo keyed on `value`) and redraws |
| Oversize payload | encoder falls back to `L`/v10 (no throw); very long strings may exceed capacity |
| Hover / focus / disabled | none — static, non-interactive `role="img"` |

There is no interactive/loading/error state — the QR is a static, deterministic image of `value`.

## 5. Web ↔ native parity

**Verdict: 🔵 web-only — genuine capability gap.** There is **no** `QRCode` in `@lockin90/ui-native`: the native components directory has no `QRCode.tsx`, and the native index does not export it. The component is a root export of `@lockin90/ui` only.

What native can't do here / what to do instead:

- The encoder itself is pure TS (no DOM) and *could* be reused, but the kit has not shipped a `react-native-svg` twin. So a native MFA/scan screen must **not** assume a `QRCode` import exists.
- **Native options:** render the QR server-side and display it as an `<Image>`, or add a native twin (a `react-native-svg` `QRCode` reusing the same encoder, same `value`/`size` props) before a native screen needs one.

This is a real gap, not a substrate cosmetic — until a native twin is added, QR display is web-only.

## 6. Composition & usage

- **Composes from:** nothing — fully self-contained (its own GF(256) tables, Reed–Solomon, masking).
- **Used by (web):** admin MFA/TOTP enrolment ("scan with your authenticator"), any "scan to open" affordance.

```tsx
// web — TOTP enrolment
<QRCode value="otpauth://totp/LockIn90:ada@x.com?secret=JBSWY3DPEHPK3PXP&issuer=LockIn90" size={200} />

// web — scan-to-open URL
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
- ✗ Don't import `QRCode` in native code — it doesn't exist there (web-only).
- ✗ Don't recolor the modules/quiet zone — the light/dark literals are a scan-contrast requirement, not theming.
- ✗ Don't add a QR library dependency — the encoder is intentionally self-contained.
- ✗ Don't rely on the QR as the only way to complete a flow (always provide the text fallback).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** Don't drop in a third-party QR widget or a `<canvas>` one-off — use `QRCode`; it's dependency-free and on-brand for the card chrome.
- **Native need → add a real twin.** If a native screen needs a QR, add a `react-native-svg` `QRCode` to `@lockin90/ui-native` that **reuses this encoder** with the same `value`/`size` API — never a divergent native QR.
- **Tokens for chrome, literals for the code.** The card radius/border/shadow are tokens; the `#eef1f8`/`#ffffff`/`#0a0a12` scan colors are deliberate functional literals — leave them.
- **Parity note.** Because this is web-only, any cross-platform "scan to enrol" flow must explicitly account for the missing native twin (server-rendered image or a new native component), not silently assume parity.
