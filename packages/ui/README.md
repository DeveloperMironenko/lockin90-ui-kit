# @lockin90/ui

Performance 90 design-system components for the web (Next.js / React). Dark,
black/red, Barlow-Condensed visual language shared by the consumer dashboard
(`p90-frontend`), the operator portal (`p90-admin`), and the marketing site
(`p90-marketing`).

Pairs with [`@lockin90/tokens`](../tokens) — the single source of truth for colors,
type, and spacing (CSS variables + a Tailwind preset).

## Install

Both packages are workspace deps; in a consuming app's `package.json`:

```jsonc
{
  "dependencies": {
    "@lockin90/ui": "workspace:*",
    "@lockin90/tokens": "workspace:*"
  }
}
```

`react`, `react-dom`, `next`, and (optionally) `next-intl` are peer deps —
supplied by the host app.

## Usage

### 1. Import the styles (once, in your global stylesheet)

The tokens provide the `:root` CSS variables; the kit provides the shared
`ea-*` component classes. Import the tokens **before** the `@tailwind`
directives so PostCSS can inline them first:

```css
/* app/globals.css */
@import '@lockin90/tokens/dist/tokens.css';
@import '@lockin90/ui/dist/styles.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

Your `postcss.config` MUST run `postcss-import` **before** `tailwindcss`,
otherwise Tailwind errors on the `@layer components` blocks:

```js
// postcss.config.mjs
const config = {
  plugins: { 'postcss-import': {}, tailwindcss: {}, autoprefixer: {} },
};
export default config;
```

### 2. Wire up the Tailwind preset + content glob

Use the shared preset for colors/fonts, and **add the compiled kit to your
`content` globs** — otherwise Tailwind purges the utility classes the kit's
components rely on:

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import preset from '@lockin90/tokens/tailwind-preset';

const config: Config = {
  presets: [preset],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../packages/ui/dist/**/*.{js,mjs,cjs}', // <-- required
  ],
};
export default config;
```

### 3. Import components

```tsx
import { Button, Badge, Alert, EnergyRing, SectionCard } from '@lockin90/ui';
```

## Subpath exports

| Import path             | Contents                                                       |
| ----------------------- | -------------------------------------------------------------- |
| `@lockin90/ui`               | Shared web primitives (Button, Badge, Alert, Input, Tabs, …).  |
| `@lockin90/ui/admin`         | Operator-surface primitives (DataTable, AuditEntry, EnvIndicator, …). |
| `@lockin90/ui/marketing`     | Presentational marketing primitives (Container, Section, Card, Pill, Stat, Icon, IconBadge, Typography, Accordion, Field, Reveal). |
| `@lockin90/ui/styles.css`    | The shared `ea-*` component stylesheet.                         |
| `@lockin90/ui/components/*`  | Per-component deep imports (tree-shakeable).                    |

> The `admin` theme adds `green-zone`, `amber-zone`, and `border-subtle`
> colors on top of the preset (`theme.extend.colors`) — see
> `p90-admin/tailwind.config.ts`.

## Building the kit

Built with [tsup](./tsup.config.ts) (`bundle: false`, preserves per-file
`"use client"` directives). It needs a larger heap or it OOMs:

```bash
NODE_OPTIONS=--max-old-space-size=4096 pnpm --filter @lockin90/ui build
```

Output lands in `dist/` (one file per source module + `.d.ts` + `styles.css`).

## Storybook

A dark-themed Storybook (`@storybook/react-vite`) documents the primitives.
The kit must be built first (preview imports `@lockin90/ui/styles.css` +
`@lockin90/tokens/tokens.css`); a Storybook-local PostCSS + Tailwind config
(`postcss.config.cjs`, `tailwind.config.cjs`) generates the utility classes so
components render fully styled.

```bash
pnpm --filter @lockin90/ui storybook        # dev server on :6006
pnpm --filter @lockin90/ui build-storybook  # static build -> storybook-static/
```

Stories are colocated next to components as `*.stories.tsx` (excluded from the
tsup build) under `src/components/<Name>/` and `src/admin/<Name>/`.
