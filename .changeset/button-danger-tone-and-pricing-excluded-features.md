---
"@lockin90/ui": minor
"@lockin90/ui-native": minor
---

Two cross-platform additions (web + native, identical prop APIs, tokens-only):

- **`Button` gains `tone="danger"`** — a destructive tone that composes with `variant`. On the `default` variant it paints a solid `--bad` fill (the primary destructive action); on `ghost` it becomes a red-tinted transparent button (the account "danger zone" delete). Web emits `.lk-btn--tone-danger`; native mirrors with `colors.bad` + the paired `rgba(255,77,109,…)` tint. Existing variants are unchanged.
- **`PricingTierCard` supports per-feature included/excluded** — `features` now accepts `Array<string | { label; included? }>` (new exported `PricingFeature` type). A plain string or `included !== false` renders the mint check ✓; `included: false` renders a muted cross ✗ (`close` glyph in `--text-faint`, label in `--text-dim`). Fully back-compatible with the existing `string[]` API.

Both ship with updated SDDs (`Button.md`, `PricingTierCard.md`) and Storybook stories (danger Button example, excluded-feature PricingTierCard example).
