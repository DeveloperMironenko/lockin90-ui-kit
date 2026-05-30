# @lockin90/tokens

The **single source of truth** for Performance 90 design tokens — colors, type, spacing,
radii, motion, and z-index. Every P90 surface (web `@lockin90/ui`, native `@lockin90/ui-native`, and
the consuming Next.js / Expo apps) derives its look from this one package, so a token change
here propagates everywhere instead of being hand-copied per app.

Private / restricted (`UNLICENSED`, `publishConfig.access: "restricted"`). Versioned via
changesets at the repo root.

## What's in the box

The tokens are authored once in TypeScript (`src/tokens.ts`) and exposed through three
consumption surfaces so each platform can use them idiomatically:

| Surface | Import | Used by |
|---|---|---|
| **TS objects** | `@lockin90/tokens` | React Native `StyleSheet`, any JS/TS that needs raw values |
| **CSS variables** | `@lockin90/tokens/tokens.css` | Web apps — emits the `:root { --accent: … }` custom properties |
| **Tailwind preset** | `@lockin90/tokens/tailwind-preset` | Web Tailwind configs — maps tokens to utility classes |

### 1. TypeScript objects (`@lockin90/tokens`)

Typed, `as const` token objects plus two helpers:

- `colors` — backgrounds, borders, text, accent, status, and energy-zone colors
- `fonts` — React Native font-family names (Barlow Condensed / Inter / JetBrains Mono)
- `fontSizes`, `letterSpacing`, `radius`, `spacing`
- `easing`, `durations` — motion curves and timings
- `zIndex` — layering scale (`base` → `toast`)
- `energyColor(score)` — returns the zone color for a 0–100 energy score
- `energyLabel(score)` — returns `'HIGH' | 'MODERATE' | 'LOW'`
- `cssVars`, `tailwindThemeExtend` — internal bridges used to generate the two surfaces below

```ts
import { colors, spacing, energyColor, energyLabel } from '@lockin90/tokens';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgSurface,
    borderColor: colors.border,
    padding: spacing.lg,
  },
});

const ringColor = energyColor(score); // green / amber / red by zone
const ringLabel = energyLabel(score); // 'HIGH' | 'MODERATE' | 'LOW'
```

### 2. CSS custom properties (`@lockin90/tokens/tokens.css`)

A generated stylesheet emitting the `:root` custom properties (`--accent`, `--bg-surface`,
`--font-display`, `--ease-smooth`, …) that mirror the legacy `:root` block, so existing
`var(--accent)` usage and the `ea-*` component classes keep working unchanged.

```css
/* in your app's globals.css */
@import '@lockin90/tokens/tokens.css';
@import '@lockin90/ui/styles.css'; /* the ea-* component classes, which reference the vars above */
```

### 3. Tailwind preset (`@lockin90/tokens/tailwind-preset`)

A Tailwind preset wiring the tokens into `theme.extend`, so utility classes like
`bg-surface`, `text-accent`, `font-display`, and `font-mono` resolve to the design tokens.

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import preset from '@lockin90/tokens/tailwind-preset';

const config: Config = {
  presets: [preset],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // also scan the compiled @lockin90/ui kit so its utility classes aren't purged
    '../packages/ui/dist/**/*.{js,mjs,cjs}',
  ],
};

export default config;
```

## Build

```bash
pnpm --filter @lockin90/tokens build   # tsup (TS → dist) + generate-css.mjs (tokens.css)
pnpm --filter @lockin90/tokens test    # vitest
```

The build compiles `src/` with tsup, then runs `scripts/generate-css.mjs` to emit
`dist/tokens.css` from the `cssVars` bridge. The Tailwind preset is bundled as
`dist/tailwind-preset.cjs`.

## Editing tokens

Change values in `src/tokens.ts` only — never edit `dist/` or hand-edit a consuming app's
CSS variables. Rebuild, then add a changeset (`@lockin90/tokens`) so downstream `@lockin90/ui` /
`@lockin90/ui-native` get the appropriate `patch` bump via `updateInternalDependencies`.
