# UI Kit — Full Wipe for 100% Rebuild

**2026-06-20.** Every package was wiped to a **bare empty directory** ahead of a
**100% from-scratch rebuild** — new design tokens, new component library, and new
build tooling. Nothing of the old kit's source or scaffolding remains in-tree.

## The old kit is fully saved

The complete previous kit ("Aurora Flux" — tokens, all components, and every build
config) is preserved verbatim. Nothing is lost:

| Ref | Points at |
| --- | --- |
| branch `archive/ui-kit-aurora-flux` | full kit at commit `5144a99` |
| tag `archive/ui-kit-aurora-flux-2026-06-20` | same snapshot, immutable |

Restore or copy anything with e.g.
`git checkout archive/ui-kit-aurora-flux -- packages/ui/src/components/EnergyRing`.

> ⚠️ `main` (this branch) now has **no buildable packages**. Every consuming app
> builds `@lockin90/ui` from `ui-kit@main` — their builds will fail until the new
> kit is built and the apps are migrated. Don't push to the apps' build pipeline
> expecting green until the rebuild lands.

## What was wiped

All three packages were emptied completely — source **and** build scaffolding
(`package.json`, `tsup`/`builder-bob`/Storybook/vitest configs, `tsconfig*`, the
`gen-index`/`copy-assets`/`generate-css` scripts, `cn.ts`, placeholder tokens):

- `packages/tokens/`  → bare (only `.gitkeep`)
- `packages/ui/`      → bare (only `.gitkeep`)
- `packages/ui-native/` → bare (only `.gitkeep`)

## What remains (workspace shell only)

The monorepo container is intact so the rebuild has somewhere to land:

- `pnpm-workspace.yaml`, root `package.json`, `tsconfig.base.json`
- `.changeset/`, `.gitignore`, `README.md`, `MIGRATION-AURORA.md`, this file

These were **not** part of the "packages" wipe. Replace/rebuild them too if the
new setup calls for it — say the word and I'll wipe the root shell as well.

## Next

Rebuild the three packages 100% with the new tooling + tokens + components.
Confirm whether the `tokens` / `ui` / `ui-native` split stays before scaffolding.
