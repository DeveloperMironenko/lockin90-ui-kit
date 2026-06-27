# SDD — `VersionBadge` (+ `VersionEnv` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/VersionBadge.tsx` · `packages/ui-native/src/components/VersionBadge.tsx` ·
> web CSS `packages/ui/src/styles/components/versionbadge.css` (`.lk-verbadge*`).
> **Exports:** `VersionBadge`, type `VersionEnv` (`'prod' | 'staging' | 'dev'`), type `VersionBadgeProps`.
> **Status:** Shipped. **Parity:** ✅ identical API + visuals; native computes the env tint/alpha in JS (web uses per-env CSS classes).
> **Stories:** `packages/ui/src/stories/VersionBadge.stories.tsx` · `packages/ui-native/src/stories/VersionBadge.stories.tsx`.

---

## 1. Overview

A **compact monospace build/version chip** shown in app headers — `version · build · date · env`, with a leading env-colored status dot. The `env` (`prod` / `staging` / `dev`) tints the dot and the env label so you can tell at a glance which build is running:

- **prod** — mint / ok (`--mint` / `colors.mint`)
- **staging** — warn / amber (`--warn` / `colors.warn`), and the whole chip border warms
- **dev** — accent / violet (`--accent` / `colors.accent`), border tints accent

Segments are pill-joined by hairline dividers and only render when their prop is set (`build`/`date` are optional). The exported `VersionEnv` type is the env union.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `version` | `string` | _required_ | ✓ | ✓ | e.g. `'v1.6.0'`; shown after the dot |
| `build` | `string` | — | ✓ | ✓ | short build hash; renders a `build <hash>` segment when set |
| `env` | `VersionEnv` | `'prod'` | ✓ | ✓ | tints the dot + env label (+ border on staging/dev) |
| `date` | `string` | — | ✓ | ✓ | optional build/release date segment |
| `dot` | `boolean` | `true` | ✓ | ✓ | show the leading env-colored status dot |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLSpanElement>` (web) / `ViewProps` (native) | — | ✓ | ✓ | container attrs |

- **Web:** `forwardRef<HTMLSpanElement>`; renders an inline `<span>` with per-env class (`.lk-verbadge-prod` / `-staging` / `-dev`).
- **Native:** plain function component; renders a `View`. The env tint is computed in JS (`ENV_COLOR`) and the staging/dev border alpha via a local `hexAlpha()` helper (RN has no `color-mix`).
- **Segment order:** `version` (with dot) → `build` (if set) → `date` (if set) → `env` label (always last).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Token | Value |
| --- | --- | --- |
| Font | `--font-mono` / `fonts.mono`, 10.5px | mono everywhere |
| Radius | `--r-pill` / `radii.pill` | 999 |
| Background | `--glass-2` / `colors.glass2` | `rgba(255,255,255,.075)` |
| Border (default) | `1px --border` / `colors.border` | `rgba(255,255,255,.09)` |
| Segment padding | `4px / 10px` | per segment |
| Segment divider | `1px` left border `--border` | between segments |
| Version text | `--text-dim` / `colors.textDim` | `#AAB2C6` |
| build/date text | `--text-faint` / `colors.textFaint` | `#828B9F` |
| Env label | 600 weight, `0.06em` letter-spacing | tinted per env |
| Status dot | `6px`, glow `0 0 7px <tint>` | tinted per env |

| `env` | Dot / label tint | Border override |
| --- | --- | --- |
| `prod` | `--mint` / `colors.mint` (`#34F5C5`) | default `--border` |
| `staging` | `--warn` / `colors.warn` (`#FFB020`) | `rgba(255,176,32,.4)` / `hexAlpha(warn,.4)` |
| `dev` | `--accent` / `colors.accent` (`#7C5CFF`) | `rgba(124,92,255,.4)` / `hexAlpha(accent,.4)` |

- **Native dot glow:** `shadowColor: tint, shadowOpacity: 1, shadowRadius: 4` (the RN equivalent of web's `box-shadow: 0 0 7px`).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| prod | `.lk-verbadge-prod` → env label `--mint`, dot mint | `ENV_COLOR.prod` mint; default border |
| staging | `.lk-verbadge-staging` → border `rgba(255,176,32,.4)`, label+dot `--warn` | border `hexAlpha(warn,.4)`; tint warn |
| dev | `.lk-verbadge-dev` → border `rgba(124,92,255,.4)`, label+dot `--accent` | border `hexAlpha(accent,.4)`; tint accent |
| no dot | `dot={false}` omits the leading dot | same |
| no build/date | segment omitted when prop unset | same |

Display-only — no hover / pressed / disabled states (it's a status chip, not a control).

## 5. Web ↔ native parity

**Verdict: ✅ identical API + visuals.** Same props, same default `env='prod'`, same `dot` default, same segment order (`version · build · date · env`), same conditional rendering, same mono 10.5px type, same pill radius + glass-2 fill, same per-env tints (mint / warn / accent) on the dot and env label, and the same staging/dev border warming.

The only difference is implementation substrate: web selects a per-env CSS class (`.lk-verbadge-prod/-staging/-dev`) so the tints live in the stylesheet; native has no `color-mix`/CSS classes so it computes the tint from `ENV_COLOR` and derives the `.4`-alpha border via a local `hexAlpha()` helper. Same resulting colors. The status dot's glow is `box-shadow` on web and `shadow*` on native. No capability gap — the chip is pixel-equivalent.

## 6. Composition & usage

- **Composes from:** raw text segments + a dot (no other kit primitive).
- **Used by:** app **header / topbar** of each consumer app (frontend, admin, marketing, studio) to surface the running build; typically fed from `package.json` version + build env.
- **Env source:** drive `env` from the deploy environment, `version` from `package.json`, `build` from the short git SHA.

```tsx
// web — header chip
<VersionBadge version="v1.6.0" build="a1b2c3d" env="prod" />

// staging with date, dot hidden
<VersionBadge version="v1.7.0-rc1" env="staging" date="2026-06-26" dot={false} />

// native — identical
<VersionBadge version="v1.6.0" build="a1b2c3d" env="dev" />
```

## 7. Accessibility

- **Web:** an inline `<span>`; the dot is `aria-hidden="true"` (decorative) and the version/build/date/env are real text read in order.
- **Native:** a `View` of `Text` nodes; the dot is a plain `View` (no label) and the segments are read in order.
- **Color is not the only signal** — the env label text (`PROD` / `STAGING` / `DEV`) always renders, so the environment is conveyed without relying on the tint alone.
- **Static:** no focus/keyboard concerns; it's not interactive.

## 8. Usage rules — Do / Don't

**Do**
- Drive `env` from the real deploy environment so the tint is truthful.
- Pass `version` already prefixed (`v1.6.0`) — the component doesn't add `v`.
- Use `build` for the short git SHA and `date` for the release date when useful.

**Don't**
- ✗ Don't hand-roll a version chip — use `VersionBadge`.
- ✗ Don't hardcode the env tints — they come from `mint` / `warn` / `accent`.
- ✗ Don't fake `env="prod"` on a staging build (the badge exists to tell them apart).
- ✗ Don't put interactive controls inside it — it's a status chip.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom header "vX.Y.Z" pill duplicating the env dot/label is a parity violation — import `VersionBadge`.
- **New env?** If a fourth environment is needed (e.g. `preview`), add it to the `VersionEnv` union + `ENV_COLOR`/CSS on **both** platforms (same token) — never a one-off chip.
- **Tokens only.** The mint/warn/accent tints, glass-2 fill, pill radius, and mono font come from `@lockin90/tokens`; a hardcoded color is a bug even if it matches today.
- **Parity gate.** Before shipping a header, confirm web phone-width and native render the same segments, order, and env tint.
