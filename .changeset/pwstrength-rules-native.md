---
"@lockin90/ui-native": major
---

PasswordStrengthMeter: `rules` (a checklist under the meter in rows of two: a round tick that fills mint when met, long labels wrap; each rule is one screen-reader stop, its label followed by the required `metLabel` / `unmetLabel` exactly as given, so include the leading punctuation, e.g. ", done"), `accessibleLabel` (a translated name for the meter, default `Password strength: <label>`), `labelPrefix` (faint text before the label, e.g. "Strength:"), and a faint label at score 0. The hint is now the meter's `accessibilityHint`.

Breaking: the progressbar role moved from the root to the segment row (an accessible parent would swallow the label row and the rules). An `accessibility*` prop passed to the component now lands on the plain root container, not on the meter; name the meter with `accessibleLabel`. `accessibilityLabel` / `accessibilityHint` / `accessibilityRole` / `accessibilityValue` are no longer in the props type (TypeScript flags them). The visible label row is hidden from screen readers, since the meter's label and hint already say it. Long label, hint and rule texts wrap.
