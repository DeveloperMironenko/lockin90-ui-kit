---
"@lockin90/ui": minor
---

CodeInput, ready for its first real screens:
- `digitLabel(position, length)` for each box's label. The default changes from `Digit N` to `Digit N of L` (English, for stories: pass a translated one).
- The row is a `role="group"`, named by the `aria-label` / `aria-labelledby` you pass; `aria-invalid` moves from the row onto every box.
- Fixed: clearing a middle box no longer shifts the later digits left; box 0 takes a whole autofilled code (`one-time-code`) and spreads it; paste and typing keep digits only; typing into a filled box replaces its digit; a new `value` from the app (e.g. `''` after a wrong code) replaces what's shown.
