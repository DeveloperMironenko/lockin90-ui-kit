---
"@lockin90/ui": minor
"@lockin90/ui-native": minor
---

**Web-rebuild punch-list (`KIT_MISSING_COMPONENTS.md`): +13 Icon glyphs + `PasswordInput`.**
Both platforms, same API/visuals, Storybook on both.

- **Icon** — 74 → 87 glyphs: `energy`, `sleep`, `insights`, `billing`, `globe`, `heart`,
  `flame`, `height`, `weight`, `arrow-right`, `shield` (stroke glyphs in the kit style) +
  multicolor **`google`** and fill **`apple`** brand logos (these two render their own
  fills rather than `currentColor`). `IconName` identical on web + native.
- **`PasswordInput`** — a password field with a built-in show/hide eye toggle, mirroring
  `Input` (`label`/`leading`/`invalid`/`inputSize`); owns `type`/`secureTextEntry`
  internally, swapping the existing `eye`/`eyeOff` glyph. Pairs with `PasswordStrengthMeter`.
