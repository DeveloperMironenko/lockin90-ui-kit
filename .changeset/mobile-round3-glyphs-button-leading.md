---
"@lockin90/ui": minor
"@lockin90/ui-native": minor
---

**Mobile rebuild round 3 (`MOBILE_KIT_NEEDS_OUTSTANDING.md`): +8 Icon glyphs + `Button` leading slot.**
Both platforms, same API/visuals, Storybook on both.

- **Icon** — 87 → 95 glyphs: `mail`, `caffeine`, `meal`, `mood`, `scale`, `ruler`, `card`,
  `data-source` (exact stroke paths from the mobile mockups). `IconName` identical on web +
  native. (`mail` also covers the frontend auth email-field follow-up.) The doc's `sleep` /
  `heart` already shipped in `0902f57` and are kept as-is.
- **`Button`** — new optional `leading?: ReactNode` slot (icon before the label, auto-spaced
  by the existing `.lk-btn` gap / native row), so SSO brand buttons (`<Button leading={<Icon
  name="google"/>}>`) need no app-level composition. Additive — existing usages unchanged.
