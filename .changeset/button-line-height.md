---
'@lockin90/ui': patch
---

Button and SegmentedTabs keep their own line height (normal), as the design's `.btn`: under an app's CSS reset (Tailwind's preflight) they inherited the page's and drew about 4px taller (`sm` 38 instead of 34).
