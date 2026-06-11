# LockIn90 UI Kit (`@lockin90/*`)

Cross-platform design system for **LockIn90 / LockIn90**. One source of truth for
tokens and components across the web apps (Next.js) and the mobile app (Expo / React Native).

**Visual language: "Aurora Flux"** — deep-void glassmorphism, a flowing
energy-spectrum gradient (lime → mint → cyan → indigo → violet → magenta), glow +
soft elevation, rounded glass radii, and **Space Grotesk** display type
(Inter for UI, JetBrains Mono for data). This replaced the original red /
Barlow Condensed / flat brand — upgrading an app? See
[`MIGRATION-AURORA.md`](MIGRATION-AURORA.md).

A pnpm workspace with three publishable packages:

| Package | What it is | Build tool |
| --- | --- | --- |
| [`@lockin90/tokens`](packages/tokens) | Design tokens — TS objects, `tokens.css` (`:root` vars), and a Tailwind preset | tsup + generator |
| [`@lockin90/ui`](packages/ui) | Web (React / Next.js) components. Main export + `@lockin90/ui/admin` and `@lockin90/ui/marketing` subpaths + `@lockin90/ui/styles.css`. Storybook included. | tsup (preserves `"use client"`) |
| [`@lockin90/ui-native`](packages/ui-native) | React Native (Expo) components | react-native-builder-bob |

## Develop

```bash
pnpm install
pnpm build            # build all three packages (tokens → ui / ui-native)
pnpm test             # run package tests
pnpm typecheck
pnpm storybook        # @lockin90/ui component explorer at :6006
pnpm build-storybook  # static Storybook build
```

## Consuming in an app

```bash
pnpm add @lockin90/ui @lockin90/tokens   # (or @lockin90/ui-native for React Native)
```

**Web (Next.js + Tailwind):**

```ts
// tailwind.config.ts
import preset from '@lockin90/tokens/tailwind-preset';
export default {
  presets: [preset],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@lockin90/ui/dist/**/*.{js,mjs,cjs}', // so kit classes aren't purged
  ],
};
```

```css
/* globals.css — postcss-import must run before Tailwind */
@import '@lockin90/tokens/tokens.css';
@import '@lockin90/ui/styles.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```tsx
import { Button } from '@lockin90/ui';
import { DataTable } from '@lockin90/ui/admin';
```

**React Native:**

```tsx
import { Button } from '@lockin90/ui-native';
import { colors } from '@lockin90/tokens';
```

## Releasing

Versioned with [changesets](https://github.com/changesets/changesets):

```bash
pnpm changeset            # describe the change
pnpm version-packages     # bump versions + changelogs
pnpm release              # build + publish
```

Packages are published as **restricted** (private scope) by default.
