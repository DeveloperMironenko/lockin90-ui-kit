# UI Kit — Clean-Slate Rebuild

**2026-06-20.** The kit was stripped to a buildable skeleton ahead of an
**all-new** setup: new design tokens, new component library, and new build
tooling. This file is the map of what was removed, what was kept, and where the
old kit lives.

## The old setup is fully saved

The complete previous kit ("Aurora Flux" — tokens, all components, and every
build config) is preserved verbatim. Nothing is lost:

| Ref | Points at |
| --- | --- |
| branch `archive/ui-kit-aurora-flux` | full kit at commit `5144a99` |
| tag `archive/ui-kit-aurora-flux-2026-06-20` | same snapshot, immutable |

Restore or copy any old component with e.g.
`git checkout archive/ui-kit-aurora-flux -- packages/ui/src/components/EnergyRing`.

> ⚠️ `main` is **untouched** — every consuming app still builds the old kit from
> `ui-kit@main` via its `build-image.yml`. Do **not** merge this rebuild branch
> to `main` until the apps are migrated to the new kit, or every app build breaks.

## What was removed on this branch (`rebuild/clean-slate`)

- `@lockin90/ui` — **83** web components + **13** admin + **11** marketing + tests
- `@lockin90/ui-native` — **33** native components
- `@lockin90/tokens` — old token values (`tokens.ts`) + token test
- the `lk-*` base stylesheet (`packages/ui/src/styles.css`, ~1500 lines)

## What was kept (the skeleton)

The **workspace + per-package shell** is intact so the rebuild has a foundation:

- pnpm workspace (`pnpm-workspace.yaml`, root `package.json`, `tsconfig.base.json`)
- each package's `package.json` (incl. its `exports` map), `tsup.config.ts` /
  builder-bob config, `tsconfig*.json`, vitest config, Storybook config
- the barrel generators (`scripts/gen-index.mjs`) and `scripts/copy-assets.mjs`,
  `scripts/generate-css.mjs`
- `packages/ui/src/cn.ts` (generic classNames util)
- emptied, still-valid entry points: each package's `src/index.ts`,
  `packages/ui/src/{admin,marketing}.ts`, base `styles.css`, placeholder `tokens.ts`

> The kept build tooling (tsup / builder-bob / Storybook) is a **placeholder**.
> The rebuild is "all-new" tooling too — these files stay only so the repo stays
> coherent and are expected to be replaced once the new setup target is chosen.

## Next: the all-new setup (pending input)

Still needed before rebuilding components:

1. **New build tooling target** — bundler / framework (e.g. tsup vs Vite library
   mode vs tsc, Tailwind/shadcn vs CSS-vars, Storybook vs alternative).
2. **New token system** — the values + the CSS-var / TS-export shape.
3. **Package shape** — confirm the 3-package split (tokens / ui / ui-native) stays.

Once those are decided, the rebuild lands here on `rebuild/clean-slate`.
