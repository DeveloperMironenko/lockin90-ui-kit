---
"@lockin90/ui": minor
"@lockin90/ui-native": minor
---

Close four parity gaps surfaced by the mobile auth/onboarding rebuild (all additive, back-compat, both platforms):
- `Button` gains a `trailing` slot (symmetric with `leading`) — trailing-arrow CTAs.
- `SegmentedTabs` gains a control-level `tone` ('accent' | 'mint') colouring the selected segment.
- `Ring` `gradient` now accepts an N-stop `string[]` (full flux spectrum), not just a 2-stop `[from,to]`.
- `Stepper` gains `complete` — renders the current/final node as done (the onboarding "calibrated" state).
