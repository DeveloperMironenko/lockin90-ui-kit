---
"@lockin90/ui": major
---

PasswordStrengthMeter: `rules` (a checklist under the meter: a round tick that fills mint when met, 2 columns, 1 at ≤ 540px, long labels wrap; each rule reads the required `metLabel` / `unmetLabel` exactly as given, so include the leading punctuation, e.g. ", done"), `accessibleLabel` (a translated name for the meter, default `Password strength: <label>`), `labelPrefix` (faint text before the label, e.g. "Strength:"), and a faint label at score 0. The hint now describes the meter (`aria-describedby`).

Breaking: `role="meter"` moved from the root to the segment row (a meter's children are presentational, so the label row and the rules sit beside it). An `aria-*` prop passed to the component now lands on the plain root container, not on the meter; name the meter with `accessibleLabel`. The root also applies `style` now (it was dropped).
