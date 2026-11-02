---
"@lockin90/ui-native": minor
---

CodeInput, as on web:
- `digitLabel(position, length)` for each box's `accessibilityLabel`. The default changes from `Digit N` to `Digit N of L` (English, for stories: pass a translated one).
- Fixed: clearing a middle box no longer shifts the later digits left; paste / autofill and typing keep digits only (a typed letter disappears); typing into a filled box replaces its digit (`selectTextOnFocus`, and a digit typed beside it); a new `value` from the app (e.g. `''` after a wrong code) replaces what's shown; a changed `length` re-draws the boxes.
