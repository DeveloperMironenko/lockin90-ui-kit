---
'@lockin90/ui': patch
---

Avatar: a caller's `style` is merged with the size instead of replacing it, so `style={undefined}` no longer collapses the avatar to zero width.
