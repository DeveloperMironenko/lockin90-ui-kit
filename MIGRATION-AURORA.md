# Migrating to Aurora Flux

The kit's brand was replaced (red `#FF1F1F` / Barlow Condensed / flat → **Aurora
Flux**: deep-void glassmorphism, energy-spectrum gradients, glow, rounded radii,
**Space Grotesk** display type). Most of this lands automatically — apps that
import `@lockin90/ui/styles.css` + `@lockin90/tokens/tokens.css` and use the
Tailwind preset pick up the new palette, radii, glass, and `ea-*` look on the next
build. Two things need a per-app change.

## 1. Web (Next.js) — load Space Grotesk

The display var now resolves `var(--font-space-grotesk)` first, then falls back to
the literal `'Space Grotesk'`, then `system-ui`. Swap your Barlow next/font setup
for Space Grotesk so the variable is defined and self-hosted:

```ts
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';

const display = Space_Grotesk({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-space-grotesk' });
const ui      = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono    = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

// <html className={`${display.variable} ${ui.variable} ${mono.variable}`}>
```

Until you do this, text still renders (it falls back to a system serif/sans), it
just won't be Space Grotesk.

## 2. React Native (Expo) — load the new font families

`fonts.display` etc. now reference `SpaceGrotesk_*`. Space Grotesk has no italic or
black cuts, so the legacy `displayItalic` / `displayBlack` keys map to
`SpaceGrotesk_700Bold` — your existing `fonts.display*` usages keep working once the
families are loaded:

```ts
import { useFonts, SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { JetBrainsMono_400Regular, JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';
```

## What changed under the hood

- **Token VALUES** changed; **token keys and `--css-var` names did not.** `--accent`
  is still `--accent` (now `#7C5CFF`), `bg-surface` is still `bg-surface`, etc. No
  class renames are required.
- **New tokens** you can now use: spectrum colors (`--lime…--magenta`, `text-accent-2`,
  `bg-mint`…), gradients (`--grad-flux/-cta/-mint/-violet/-warm`, `bg-grad-cta`),
  glow/elevation (`--glow-accent`, `shadow-glow-cyan`…), radii (`--r-sm…--r-xl`),
  and the `gradients` / `gradientStops` / `shadows` exports for JS/RN/SVG.
- **`ea-*` classes** were re-themed in place (glass cards, gradient buttons, rounded
  radii, mono eyebrows). Same names — your markup is untouched.
- **EnergyRing** gained optional `gradient` (`flux|cta|mint|violet|warm|zone`),
  `label`, and `showZone` props (all defaulted; existing `<EnergyRing score=… />`
  calls are unaffected). The retired diagonal "slash" motif was removed.
- **16 new components** are exported from `@lockin90/ui` — see the changeset / README.
