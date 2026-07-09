---
"@lockin90/ui-native": minor
---

**Native parity for the Chip / Stat / MetricTile prop additions.** Mirrors the
optional, additive props that landed on the web twins so the shared primitives
have matching APIs across platforms. All existing native usage is unaffected.

- **`Chip`** — new `size?: 'sm' | 'md'` (default `md`; `ChipSize` exported).
  `sm` is the compact count/status badge (tighter box, 10px tabular mono); on the
  `accent` tone `sm` renders a filled `gradients.cta` background with dark text,
  and `sm` + `dot` collapses to a bare glowing circle. `md` is unchanged.
- **`Stat`** — new `tone?: 'default' | 'gradient' | 'mint'` (`StatTone`),
  `size?: 'sm' | 'md' | 'lg' | 'hero'` (`StatSize`), `valueColor?`, and `sub?`.
  `gradient` renders the value as flux-gradient text (full spectrum on `hero`,
  which also flips the label below the oversized figure). `md`/`default` unchanged.
- **`MetricTile`** — new `spark?: number[]` (single value fills to that fraction;
  a series fills to `last / max`) rendering a bottom spark-fill bar, plus
  `sparkColor?`.
