# @lockin90/ui

LockIn90 web components — the **"Aurora Flux"** design system. Deep-void
glassmorphism, a flowing energy-spectrum gradient (lime → mint → cyan → indigo →
violet → magenta), glow + soft elevation, Space Grotesk display type, and motion
everywhere. Rebuilt from the canonical design source `mockups/design/1`.

Pairs with [`@lockin90/tokens`](../tokens) — the single source of truth for
colors, type, spacing, gradients and glow (CSS variables + an optional Tailwind
preset).

## Install

```jsonc
{
  "dependencies": {
    "@lockin90/ui": "workspace:*",
    "@lockin90/tokens": "workspace:*"
  }
}
```

`react` and `react-dom` (>=18) are the only peer deps. **No Tailwind, no Next.js
required** — components emit plain `lk-*` classes and inline style. (Buttons
render a `<button>`, or an `<a>` when given `href` — bring your own router.)

## Usage

### 1. Import the two stylesheets once (e.g. in your root layout)

```ts
import '@lockin90/tokens/tokens.css'; // the :root CSS variables
import '@lockin90/ui/styles.css'; // the lk-* component layer (+ Space Grotesk/Inter/JetBrains Mono)
```

That's it — no Tailwind/PostCSS wiring needed. (If your app already uses
Tailwind, you can additionally layer the `@lockin90/tokens/tailwind-preset` for
utility classes like `text-accent-2` / `bg-grad-flux`, but the components don't
depend on it.)

### 2. Use components

```tsx
import { AuroraBackground, Card, EnergyRing, EnergyCurve, Chip, Button } from '@lockin90/ui';

export default function Today() {
  return (
    <>
      <AuroraBackground />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Card lit tilt>
          <EnergyRing score={78} size={240} sub="ENERGY · TODAY" />
          <EnergyCurve data={[60, 72, 85, 70, 58, 66, 78]} nowIndex={4} labels={['6a', '12p', '6p']} />
          <Chip tone="high" dot>recovered</Chip>
          <Button variant="primary" magnetic>Log event</Button>
        </Card>
      </main>
    </>
  );
}
```

## What's in the box (~40 components)

- **Foundation** — `AuroraBackground`, `GradientText`, `Eyebrow`, `Card`,
  `Button`, `Chip`, `Badge`, `StatusBadge`, `Pulse`, `Divider`, `SectionLabel`,
  `Skeleton`, `Avatar`, `Marquee`.
- **Motion** — `Reveal`, `CountUp`, and hooks (`useInView`, `useCountUp`,
  `useTilt`, `useMagnetic`, `useReducedMotion`). All honor
  `prefers-reduced-motion` (and a `?still=1` URL flag).
- **Form** — `Input`, `Textarea`, `Select`, `Checkbox`, `Toggle`, `FormRow`,
  `Stepper`, `SearchField`.
- **Data / viz** — `Stat`, `KpiCard`, `BarFill`, `ProgressBar`, `MixBar`,
  `SparkLine`, `EnergyRing`, `EnergyCurve`, `Table` (+ `Th`).
- **Navigation** — `NavItem`, `Tabs`, `TabBar`, `PageHeader`.
- **Feedback / overlay** — `Modal` (+ `ConfirmModal`), `Toast`
  (`ToastProvider` + `useToast`), `Banner`, `EmptyState`.
- **Patterns** — `InsightCard`, `PlanItem`, `EventRow`, `ContributionRow`,
  `CalendarStrip`, `FeatureCard`, `StepCard`, `PricingCard`, `Accordion`,
  `PhoneFrame`, `WearableCard`.

Everything renders dark-only on the deep-void background. SVG icons only.

## Styling model

Components emit semantic `lk-*` classes defined in
[`styles.css`](./src/styles.css) — a faithful port of `design/1`'s component
layer — plus inline `style` for dynamic values (ring size, bar fill `--v`,
gradient choice). All colors/radii/gradients resolve from
`@lockin90/tokens` CSS variables, so the kit is themeable from one place and
needs no build-time CSS pipeline in the consumer.

## Building the kit

Built with [tsup](./tsup.config.ts) (`bundle: false`, preserves per-file
`"use client"` directives so RSC consumers can tree-shake at the component
level):

```bash
pnpm --filter @lockin90/ui build   # -> dist/ (per-module .mjs/.cjs + .d.ts + styles.css)
```

The barrel (`src/index.ts`) is generated from `src/components/*` —
`pnpm --filter @lockin90/ui exec node scripts/gen-index.mjs` after adding a
component.

## Storybook & preview

```bash
pnpm --filter @lockin90/ui storybook        # dev server on :6006
pnpm --filter @lockin90/ui build-storybook  # static build -> storybook-static/
```

Storybook loads the tokens + `styles.css` directly (no Tailwind/PostCSS needed).
A static visual showcase of the whole system lives in
[`preview/showcase.html`](./preview/showcase.html) (rendered against the built
`dist/styles.css`); see [`preview/showcase.png`](./preview/showcase.png).
