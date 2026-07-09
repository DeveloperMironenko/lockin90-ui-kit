---
"@lockin90/ui-native": minor
---

**Native parity wave 1 (`@lockin90/ui-native`).** New primitives + a Divider variant + a type-surface reconcile, all tokens-driven (StyleSheet + `@lockin90/tokens`), no new dependencies.

- **`SectionDivider` (new)** — eyebrow label + a hairline that fades to the right (`colors.border2 → transparent` via `expo-linear-gradient`). Native twin of the web `SectionDivider`; composes `Eyebrow`. Props: `{ label: ReactNode; style? }`.
- **`QRCode` (new)** — a real, scannable QR rendered with `react-native-svg` (already a peer dep). **Reuses the identical pure-TS encoder** ported verbatim from the web `QRCode` (GF(256)/Reed–Solomon/mask selection/version 1..10) — same `value`/`size` API, same module matrix. Props: `{ value: string; size?: number; style? }`.
- **`NotificationRow` (new)** — a notification list item: optional unread accent dot + optional typed leading `Icon` + `title` + right-aligned relative `time` + optional `body`; `onPress` makes it a `Pressable`. Shared cross-platform contract with the web `NotificationRow`.
- **`Divider` `label` variant** — optional `label?: string` renders `hairline · centered label · hairline` (the "or continue with" pattern). Existing `gradient` / default behavior unchanged.
- **`SegmentedTabs` type-surface parity** — native now also exports `SegmentedTone`, `SegmentedTab`, `SegmentedTabItem` (identical definitions to web) so cross-platform code can share the tab-item types. **Runtime unchanged:** the native `tabs` prop is still `string[]`; the rich `count`/`tone` render remains web-only.
