---
"@lockin90/ui": minor
---

Restore the `@lockin90/ui/marketing` subpath. Ports the marketing presentational
primitives — Container, Section/SectionHeader, Typography (Heading/Body/Lead/Eyebrow/
Mono), Pill, Reveal, IconBadge, Field (Input/Textarea), Icon (+IconName, with `star`/
`topic` added), Stat, Accordion, Card — from the archived kit onto the rebuilt Aurora
tokens/classes, and re-wires the subpath: a second tsup entry (`src/marketing/index.ts`
→ `dist/marketing/index.{mjs,cjs,d.ts}`), the `./marketing` package export, and the
marketing CSS folded into the single `dist/styles.css` (no extra app CSS import).
Unblocks `lockin90-marketing`, which imports `@lockin90/ui/marketing` on every page.
