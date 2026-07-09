# SDD — `Statistic` (thin wrapper over root `Stat`)

> **Package:** `@lockin90/ui/admin` — web-only operator-console primitive (admin app is web-only).
> **Import as:** `import { Statistic } from '@lockin90/ui/admin'`.
> **Source:** `packages/ui/src/admin/Statistic.tsx` · composes root `packages/ui/src/components/Stat.tsx` · web CSS: none of its own — all visuals come from root `.lk-stat*` (`packages/ui/src/styles/primitives.css`); `.lk-statistic` is a bare marker class with no rule. NO native counterpart.
> **Exports:** `Statistic`, type `StatisticProps`, type `StatisticSize`, type `StatisticTone`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (admin) — operator console has no native surface.
> **Stories:** `packages/ui/src/stories/Statistic.stories.tsx`.

---

## 1. Overview

A borderless **big-number block for inside a Panel** — a hero metric or a row of supporting stats
(MRR, active users, uptime %) in the admin dashboard. It used to carry its own `.lk-statistic*`
CSS; it is now a **thin wrapper over the root `Stat`** (`@lockin90/ui`): all label/value/tone/size
rendering, gradient recipes, and spacing are the root component's — this layer only remaps its
own `size` union onto `Stat`'s and forwards everything else 1:1.

The remap exists **only** to keep `Statistic`'s own `size` vocabulary (`'md' | 'lg'`) stable for
existing admin call sites while sharing one implementation with root `Stat`:

- `size="md"` (default, supporting stat) → `Stat size="sm"` (20px value).
- `size="lg"` (hero metric) → `Stat size="lg"` (28px value).

This is a **faithful preservation, not a redesign**: `Stat`'s `sm`/`lg` sizes were built to
reproduce the retired `.lk-statistic*` metrics exactly (see `docs/sdd/components/Stat.md` §3), so
every existing `Statistic` call renders pixel-identical to before the consolidation.

## 2. API contract

### `StatisticProps`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | — (required) | uppercase mono label, e.g. `"MRR"` → `Stat label` |
| `value` | `string` | — (required) | pre-formatted value, e.g. `"$48.2k"` or `"94%"` → `Stat value` |
| `size` | `StatisticSize` = `'md' \| 'lg'` | `'md'` | `lg` = hero (28px), `md` = supporting (20px) — remapped, see §1 |
| `tone` | `StatisticTone` = `'default' \| 'gradient' \| 'mint'` | `'default'` | passed straight through to `Stat tone` |
| `valueColor` | `string?` | — | passed straight through to `Stat valueColor` (overrides `tone`) |
| `sub` | `string?` | — | passed straight through to `Stat sub` (optional caption under the value) |
| `className` | `string?` | — | merged onto the wrapped `Stat`'s `className` via `cn('lk-statistic', className)` |

- Plain function component; no `forwardRef`, no `...rest` spread — the prop surface is
  intentionally the small set above, not the full `StatProps`.
- `delta`/`deltaDir`/`empty`/`hint` are **not exposed** — `Statistic` is a plain metric block, not
  the delta/empty-aware dashboard `Stat` usage.

### Relationship to `Stat` props

`Statistic` renders `<Stat className={cn('lk-statistic', className)} label={label} value={value}
size={size === 'lg' ? 'lg' : 'sm'} tone={tone} valueColor={valueColor} sub={sub} />`. Every prop
maps 1:1 except `size`, which is translated through the table in §1. `tone` is cast through
`StatTone` (the two type unions are structurally identical: `'default' | 'gradient' | 'mint'`).

## 3. Visual spec (tokens — never hardcode)

All visuals are the root `Stat` size/tone tables — see `docs/sdd/components/Stat.md` §3 for the
authoritative token values. Summarized for this wrapper's two sizes:

| `size` | Maps to | Value font-size | Label font-size / tracking | Gap |
| --- | --- | --- | --- | --- |
| `md` (default) | `Stat size="sm"` | 20px, `line-height 1.1` | 10px / `.12em` | 3px |
| `lg` | `Stat size="lg"` | 28px, `line-height 1.1` | 10px / `.12em` | 3px |

`tone="gradient"` renders the **static flux** gradient (`linear-gradient(135deg, #7C5CFF,
#22D3EE, #7C5CFF)`, clipped to text) — `Statistic` never reaches `Stat`'s `hero` size, so it never
sees the animated full-spectrum flavor that size unlocks. `tone="mint"` → `color: var(--mint)`.
`sub` renders a trailing `--font-mono` 10.5px `--text-faint` line.

## 4. States

| State | Behavior |
| --- | --- |
| Default (`tone="default"`) | plain `--text` value, no gradient/tint |
| `tone="gradient"` | value clipped to the static flux gradient (see §3) |
| `tone="mint"` | value tinted `--mint` |
| `valueColor` set | inline value color; suppresses `tone` entirely (root `Stat` behavior) |
| `sub` present | trailing faint caption line under the value |

No hover / focus / pressed / disabled / loading / empty / error / selected — `Statistic` is
non-interactive and does not expose `Stat`'s `empty`/`hint` mode.

## 5. Platform & relationship to root kit

**Web-only by design** (admin console is web-only) — no native counterpart, no parity obligation.

This is one of the kit's explicit **wrapper-over-a-root-primitive** components in `/admin`: the
load-bearing rendering — label, value, size scale, tone gradients, sub caption — is entirely
root `Stat`'s (`@lockin90/ui`), reused **verbatim** rather than re-implemented. `Statistic`
contributes only the narrower `size` vocabulary + the `lk-statistic` marker class. This is the
same pattern as `ReferenceRangeBar` wrapping root `RangeBar` (see
`docs/sdd/components/admin/ReferenceRangeBar.md`): the admin layer stays thin, and any future fix
or visual change to `Stat` (e.g. a new tone) propagates here for free. The wrapper's own CSS file
(`.lk-statistic*`) was **deleted** in the consolidation — `.lk-statistic` today is a bare
identification hook with no styling attached to it.

## 6. Composition & usage

- **Composes:** root `Stat` (`@lockin90/ui`) for all rendering.
- **Used by:** admin dashboard Panels — a hero metric (`size="lg"`) plus a row of supporting
  stats (`size="md"`, default).

```tsx
import { Statistic } from '@lockin90/ui/admin';

<Statistic label="MRR" value="$48.2k" sub="last 30 days" />

// hero metric + supporting row
<div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
  <Statistic label="MRR" value="$48.2k" size="lg" tone="gradient" />
  <Statistic label="Active" value="1,204" sub="7d" />
  <Statistic label="Uptime" value="99.9%" tone="mint" />
</div>
```

## 7. Accessibility

- Inherits root `Stat`'s accessibility: a semantic `<div>` with `label` then `value` (then `sub`)
  as ordinary text children, read in source order by screen readers.
- `value` should already be a human-readable pre-formatted string (`"$48.2k"`, `"94%"`) — no
  `aria` is added automatically.
- **Contrast:** the faint label and `sub` caption are a deliberate de-emphasis; keep the value as
  the high-contrast focal element regardless of `tone`.

## 8. Usage rules — Do / Don't

**Do**
- Use `Statistic` for admin-dashboard metric blocks inside a `Panel` — it is the panel-scale
  sibling of the dashboard `Stat`.
- Use `size="lg"` for the one hero metric in a panel, `size="md"` (default) for supporting stats.
- Use `sub` for a short context caption (period, unit) instead of appending it to `value`.

**Don't**
- ✗ Don't reach for `Statistic` outside `/admin` — app screens should use root `Stat` directly
  (`Statistic` exists only to keep admin's narrower `size` names stable).
- ✗ Don't pass `delta`/`empty`/`hint` — they don't exist on `StatisticProps`; drop to root `Stat`
  directly if a panel metric needs a delta or an empty state.
- ✗ Don't hardcode the 20/28px value sizes or gradient — they come from the root `Stat` size/tone
  tables via this wrapper.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled big-number-in-a-panel block duplicates both this wrapper and
  root `Stat` — import `Statistic`.
- **Extend the root, not a fork.** A new size or tone belongs on root `Stat`'s `StatSize`/`StatTone`
  (so every consumer benefits), with this wrapper's own `size` map updated only if the new size
  needs an admin-facing name — never a one-off CSS block here.
- **Tokens only.** Value/label font sizes, tracking, and gradient stops are `@lockin90/tokens`-
  sourced via root `Stat`; no hardcoded equivalents.
- **Reuse is the rule.** The whole point of the consolidation was one stat recipe for dashboard,
  admin, and marketing — don't reintroduce `.lk-statistic*` CSS to special-case admin.
