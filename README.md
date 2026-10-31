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
| [`@lockin90/ui`](packages/ui) | Web (React) components — ~98 cross-platform primitives (109 exports) emitting `lk-*` classes, **no Tailwind / Next required**, plus web-only `/admin` & `/marketing` subpath sets (11 each). Exports: `.` + `@lockin90/ui/styles.css` + `@lockin90/ui/marketing` + `@lockin90/ui/admin`. Storybook included. | tsup (preserves `"use client"`) |
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

## Component specs (SDDs)

Every primitive has a per-component spec under
[`docs/sdd/components/`](docs/sdd/components/README.md) — the contract (props/tokens/states), the
web↔native parity verdict, and the Do/Don't + lookalike-ban that keep apps from hand-rolling or
diverging. See [`Button.md`](docs/sdd/components/Button.md) (gold standard),
[`TEMPLATE.md`](docs/sdd/components/TEMPLATE.md), and [`CONVENTIONS.md`](docs/sdd/components/CONVENTIONS.md).

> **Rule:** when you add or change a component, write/update its SDD in the **same unit of work** —
> code-grounded against the real web + native source. A component without a current SDD is treated
> like one without a test: **not done.**

## Consuming in an app

The packages are published publicly on [npm](https://www.npmjs.com/org/lockin90) by the release
workflow (changesets: merging the "Version packages" PR publishes). No registry token is needed to
install them. `UNLICENSED`: public to download, all rights reserved.

```bash
pnpm add @lockin90/ui @lockin90/tokens   # (or @lockin90/ui-native for React Native)
```

**Web (React / Next.js):** import the two stylesheets once — no Tailwind or
PostCSS wiring required (components emit `lk-*` classes).

```ts
// root layout / global setup
import '@lockin90/tokens/tokens.css';
import '@lockin90/ui/styles.css';
```

```tsx
import { AuroraBackground, Card, EnergyRing, Button } from '@lockin90/ui';
```

> Apps that already use Tailwind can additionally layer
> `@lockin90/tokens/tailwind-preset` for utility classes (`text-accent-2`,
> `bg-grad-flux`, …), but the components don't depend on it.

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
