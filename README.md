# P90 UI Kit (`@p90/*`)

Cross-platform design system for **Performance 90 / EnergyApp**. One source of truth for
tokens and components across the web apps (Next.js) and the mobile app (Expo / React Native).

A pnpm workspace with three publishable packages:

| Package | What it is | Build tool |
| --- | --- | --- |
| [`@p90/tokens`](packages/tokens) | Design tokens — TS objects, `tokens.css` (`:root` vars), and a Tailwind preset | tsup + generator |
| [`@p90/ui`](packages/ui) | Web (React / Next.js) components. Main export + `@p90/ui/admin` and `@p90/ui/marketing` subpaths + `@p90/ui/styles.css`. Storybook included. | tsup (preserves `"use client"`) |
| [`@p90/ui-native`](packages/ui-native) | React Native (Expo) components | react-native-builder-bob |

## Develop

```bash
pnpm install
pnpm build            # build all three packages (tokens → ui / ui-native)
pnpm test             # run package tests
pnpm typecheck
pnpm storybook        # @p90/ui component explorer at :6006
pnpm build-storybook  # static Storybook build
```

## Consuming in an app

```bash
pnpm add @p90/ui @p90/tokens   # (or @p90/ui-native for React Native)
```

**Web (Next.js + Tailwind):**

```ts
// tailwind.config.ts
import preset from '@p90/tokens/tailwind-preset';
export default {
  presets: [preset],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@p90/ui/dist/**/*.{js,mjs,cjs}', // so kit classes aren't purged
  ],
};
```

```css
/* globals.css — postcss-import must run before Tailwind */
@import '@p90/tokens/tokens.css';
@import '@p90/ui/styles.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```tsx
import { Button } from '@p90/ui';
import { DataTable } from '@p90/ui/admin';
```

**React Native:**

```tsx
import { Button } from '@p90/ui-native';
import { colors } from '@p90/tokens';
```

## Releasing

Versioned with [changesets](https://github.com/changesets/changesets):

```bash
pnpm changeset            # describe the change
pnpm version-packages     # bump versions + changelogs
pnpm release              # build + publish
```

Packages are published as **restricted** (private scope) by default.
