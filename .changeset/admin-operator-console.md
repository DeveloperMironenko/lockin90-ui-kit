---
"@lockin90/ui": minor
"@lockin90/ui-native": patch
---

**Admin operator-console kit gate (`lockin90-admin/docs/rebuild/UI_KIT_REQUIREMENTS.md`).**
New **`@lockin90/ui/admin`** subpath (web-only operator primitives) + 3 root utilities + 6
enhancements. Tokens-driven, Storybook on each.

New `@lockin90/ui/admin` subpath (restored: barrel + tsup entry + `./admin` export):
- **App shell:** `SideNav` (+ `NavItem`/`NavGroup` — sticky rail, gradient active-indicator,
  count badges, mobile drawer + scrim).
- **Data/display:** `MethodChip` (per-method color map), `SecretField` (masked reveal + copy),
  `RedactedField` (E2EE "unreadable" hatch), `InlineEdit` (click-to-edit cell), `PulseStrip`
  (live-ingest equalizer + idle).
- **Charts/widgets:** `FunnelChart` (+`FunnelStep`), `ReferenceRangeBar` (thin `RangeBar`
  wrapper), `PushPreview` (push/in-app/email notification card).
- **Settings/security:** `PermissionMatrix` (+`MatrixToggle` — role×capability grid),
  `RecoveryCodeGrid`.

Root (`@lockin90/ui`): `ScrollProgress`, `AuroraBackground` (web twin), `QRCode`
(dependency-free QR encoder — real scannable otpauth QR).

Enhancements (additive, backward-compatible): `Table` per-row `rowTone` + expandable detail
rows (`expandable`/`renderDetail`/`expandedKeys`) + sort indicator · `Card` `tone` +
`variant: 'ghost'|'dashed'` · `Stat`/`MetricTile` `empty`+`hint` placeholder · `SegmentedTabs`
per-item `count`+`tone` · `SearchInput` `kbdHint` · `Icon` `stripe` glyph (web + native).
