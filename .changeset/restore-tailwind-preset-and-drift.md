---
"@lockin90/tokens": minor
"@lockin90/ui": minor
---

Restore two things the clean-slate rebuild dropped that `lockin90-marketing` depends
on:

- **`@lockin90/tokens/tailwind-preset`** — the opt-in, token-driven Tailwind preset
  (colors / fonts / radii / gradients / shadows), rebuilt from the current tokens and
  re-wired as a second tsup entry + `./tailwind-preset` package export.
- **Main-kit props the app still uses** (additive, backward-compatible, web + native):
  `GradientText` gains an `as` prop; `Card` gains `pad` (`'none' | 'sm' | 'md' | 'lg'`);
  `Chip`/`ChipTone` gains a `'neutral'` tone.

Together with the `@lockin90/ui/marketing` subpath restore, `lockin90-marketing` now
typechecks with zero errors.
