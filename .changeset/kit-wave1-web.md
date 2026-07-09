---
"@lockin90/ui": minor
---

**Web kit wave 1 (`@lockin90/ui`).** New primitives + a Divider variant + two CSS-class collision fixes + two admin renames (back-compat aliased), all tokens-driven (`lk-*` classes + `@lockin90/tokens`), no new dependencies.

- **`ProGate` (new, web)** — premium-lock overlay: gated `children` blurred (`filter: blur(6px)`) + dimmed (`opacity 0.35`) behind a centered glass lock card (padlock + `title` + `subtitle`). Web twin of the native `ProGate`, same `ProGateProps`; closes the prior web coverage gap. `.lk-pro*` CSS.
- **`SsoButton` (new, web)** — brand-icon SSO sign-in button (`provider: 'google' | 'apple'`): full-color Google "G" / monochrome Apple mark + label, glass pill, `disabled` state, renders a real `<button>`. Web twin of the native `SsoButton`. `.lk-sso*` CSS.
- **`NotificationRow` (new)** — a notification list item: optional unread accent dot + optional typed leading `Icon` + `title` + right-aligned relative `time` + optional `body`; `onClick` makes it a `<button>`. Shared cross-platform contract with the native `NotificationRow` (`onClick` ↔ `onPress`).
- **`Divider` `label` variant** — optional `label?: string` renders `hairline · centered label · hairline` (the "or continue with" pattern). Existing `gradient` / default behavior unchanged. `.lk-hr-labeled`/`.lk-hr-line`/`.lk-hr-label` CSS.
- **CSS collision fix — `lk-dots`:** `ProgressDots` (in `MetricTile.tsx`) no longer emits `.lk-dots` (which collided with `DotsLoader`); its container is now `.lk-pdots` (dots stay `.lk-pdot*`). `DotsLoader` keeps the canonical `.lk-dots`.
- **CSS collision fix — `lk-metric`:** admin `MetricRow` no longer emits `.lk-metric*` (which collided with the root `MetricTile`); it now emits `.lk-mrow*`. `MetricTile` keeps `.lk-metric*`.
- **Admin rename — `FunnelChart` → `OperatorFunnel`:** the admin operator funnel (`@lockin90/ui/admin`) is renamed to avoid clashing with the root chart `FunnelChart`. Deprecated `FunnelChart` / `FunnelChartProps` aliases kept for back-compat.
- **Admin rename — `Sparkline` → `TrendCard`:** the admin titled stat+area-chart card (`@lockin90/ui/admin`) is renamed (it's a card, not a bare sparkline) to avoid clashing with the root cross-platform `Sparkline`. Deprecated `Sparkline` / `SparklineProps` aliases kept for back-compat.
