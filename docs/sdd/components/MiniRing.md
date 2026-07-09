# SDD — `MiniRing`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/MiniRing.tsx` · `packages/ui-native/src/components/MiniRing.tsx` ·
> no own CSS — renders `Ring`'s `.lk-ring*` (`packages/ui/src/styles/components/ring.css`).
> **Exports:** `MiniRing`, type `MiniRingProps` (= `RingProps`).
> **Status:** Shipped. **Parity:** 🟡 inherited from `Ring` — the wrapper is line-for-line identical on both
> platforms; web tweens the arc sweep, native renders final state (glow substrate differences are moot: glow
> defaults **off** here).
> **Stories:** none dedicated on either platform — the preset is `Ring` at small defaults; see `Ring` stories.

---

## 1. Overview

A **compact `Ring` preset for dense grids** — e.g. the calendar month grid of daily energy rings, streak
strips, any surface that shows many rings at once. Same prop API as `Ring` (the type *is* `RingProps`);
only three defaults change, and the big default center number is suppressed:

| Delta vs `Ring` | `Ring` default | `MiniRing` default | Why |
| --- | --- | --- | --- |
| `size` | `108` | **`34`** | dense-grid cell size |
| `thickness` | `7` | **`4`** | proportional stroke at 34px |
| `glow` | `true` | **`false`** | glow reads as noise at this size |
| `children` fallback | `Math.round(value)` big number | **suppressed** (`children ?? <Fragment />`) | the arc + zone color carry the value; 32px display type can't fit in 34px |

Pass `children` explicitly (e.g. a small day number) when the cell needs a center readout. For a single
featured ring, use `Ring` directly.

## 2. API contract

`MiniRingProps = RingProps` — **every `Ring` prop passes through unchanged** (`value`/`value2`/`value3`,
`color*`, `trackColor`, `gradient`, `zone`, `variant`, `delta`/`deltaColor`, web `className`/rest, native
`style`). See `Ring.md` §2 for the full table; only the re-defaulted rows differ:

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `size` | `number` | `34` | ✓ | ✓ | outer diameter |
| `thickness` | `number` | `4` | ✓ | ✓ | stroke width |
| `glow` | `boolean` | `false` | ✓ | ✓ | off — pass `glow` explicitly to re-enable |
| `children` | `ReactNode` | `<Fragment />` | ✓ | ✓ | empty fragment blocks `Ring`'s default center number; pass real content to override |

- Both implementations are the **same 7-line wrapper**: `<Ring size thickness glow {...rest}>{children ?? <Fragment />}</Ring>`.
- Web `forwardRef`/rest semantics and native `style` come straight from `Ring`.

## 3. Visual spec (tokens — never hardcode)

Everything is `Ring`'s spec (`Ring.md` §3) at the small defaults:

- **Geometry:** `r = (size − thickness)/2 = 15` on **both** platforms — with `glow=false` the native
  `glowPad` is `0`, so web and native radii match exactly (no glow-padding drift at this size).
- **Colors:** arc `color` (default mint) / `gradient` array / `zone` verdict; track `--border` /
  `colors.border` — all `Ring` tokens.
- **Zone thresholds:** `≥62 high · ≥38 mid · low` — unchanged; at 34px the zone color **is** the readout.
- Re-enabling `glow` restores `Ring`'s substrate pair (web `drop-shadow` / native Gaussian-blurred
  duplicate arc + `glowPad` radius inset) — usually wrong at this size.

## 4. States

As `Ring` §4 (progress / clamp / zone / dual–triple / delta), minus the default center number. Static,
read-only — no hover/focus/disabled. Web still tweens the arc sweep (1.1s dashoffset); native renders the
final state.

## 5. Web ↔ native parity

**Verdict: 🟡 — inherited from `Ring`; the preset itself is exact.** The two wrapper files are identical
source; both delegate to their platform's `Ring`. With the `glow=false` default, the two documented `Ring`
glow differences (substrate + native `glowPad` radius inset) don't apply, so default `MiniRing` geometry is
pixel-identical cross-platform. Remaining difference: web animates the arc sweep, native doesn't (`Ring`'s
documented substrate gap). No capability gap blocks use.

## 6. Composition & usage

- **Used by:** calendar month grids (one ring per day), dense streak/history strips.
- **Composes:** `Ring` (everything); optional small `children` readout.

```tsx
// web — calendar day cell: zone-colored ring around the day number
<MiniRing value={day.energy} zone>
  <span style={{ font: '600 10px var(--font-mono)', color: 'var(--text-dim)' }}>{day.date}</span>
</MiniRing>

// native — identical props
<MiniRing value={day.energy} zone>
  <Text style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textDim }}>{String(day.date)}</Text>
</MiniRing>

// bare arc — no center content at all (default)
<MiniRing value={72} />
```

## 7. Accessibility

- With the center number suppressed, a bare `MiniRing` is **purely decorative** — the SVG is `aria-hidden`
  (web) / decorative (native) and nothing announces the value. In a grid, put the value in the cell's
  accessible name: web `aria-label` via rest (`<MiniRing value={72} aria-label="Jun 14 — energy 72" />`),
  native `accessibilityLabel` on the wrapping cell.
- If `children` carries a day number, remember it announces the **date**, not the score — label the score too.
- Zone color alone is not accessible signal — never rely on the arc hue as the only readout for AT users.

## 8. Usage rules — Do / Don't

**Do**
- Use `MiniRing` for grids/strips of many rings; `Ring` for a single featured ring.
- Use `zone` so the arc color carries the verdict at a glance.
- Keep explicit `children` tiny (≤10px mono) — 34px leaves ~22px of center.

**Don't**
- ✗ Don't re-enable `glow` in a dense grid — the halos smear together (the preset exists to prevent this).
- ✗ Don't pass big `size` values to `MiniRing` — that's just `Ring`; use it directly.
- ✗ Don't hand-roll a small SVG arc for calendar cells — this preset is the sanctioned small ring.
- ✗ Don't rely on arc color alone for meaning — label the value for AT (§7).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A local `<Ring size={34} …>` wrapper (or bespoke small arc) duplicates this preset —
  import `MiniRing` so grids stay consistent when the preset's defaults evolve.
- **New need → both platforms.** A new small-ring default (e.g. a built-in day-number slot) ships to web
  **and** native `MiniRing` with the same prop — never a screen-local fork.
- **Tokens only.** Any `color`/`trackColor`/`gradient` you pass must be token values, exactly as `Ring`.
- **Parity gate.** Before shipping a ring grid, confirm web phone-width ≡ native — same values, same zone
  colors, same center content per cell.
