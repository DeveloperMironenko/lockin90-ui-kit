---
"@lockin90/ui": patch
---

CodeInput: each box's digit stays selected (on focus, on click, after writing), so typing always replaces it, the last box too; a changed `length` re-draws the boxes with each digit in its place (a `value` changed with it wins), as native.
