---
"@lockin90/ui": minor
"@lockin90/ui-native": minor
---

Add the 6 training primitives (web + native, identical prop APIs): `SetTable` — the per-set workout table (colored W/1/2/D/F set labels, centered mono weight×reps, coach/AI reference column, mint done-check, cyan current-row tint, red PR badge, + Add set row; helper `setLabels`); `PrBadge` — the solid red personal-record flag (#FF4757, 4px radius, red glow); `RestTimer` — the between-sets countdown ring (mint arc on faint track, mono time, Skip transport, trailing HR slot; helpers `formatRestTime`/`restFraction`); `TemplateCard` — workout-template row card (source pill mint Coach / violet AI, tint edge bar); `PrCard` — personal-record card (red border/glow + PrBadge tag for new/atPeak, amber text for offPeak); `SessionBanner` — active-session live banner (one-line header, pulsing magenta live dot, ≤3 mono stats, kit-Button actions). All tokens-driven, with SDDs, Storybook stories, and render tests on both platforms.
