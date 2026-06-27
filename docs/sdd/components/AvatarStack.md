# SDD — `AvatarStack`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/AvatarStack.tsx` · `packages/ui-native/src/components/AvatarStack.tsx` ·
> web CSS `packages/ui/src/styles/components/avatarstack.css` (`.lk-avstack*`).
> **Exports:** `AvatarStack`, type `AvatarStackItem`, type `AvatarStackProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; separation ring is a `box-shadow` (web) vs a `border` (native).
> **Stories:** `packages/ui/src/stories/AvatarStack.stories.tsx` · `packages/ui-native/src/stories/AvatarStack.stories.tsx`.

---

## 1. Overview

A **row of overlapping circular avatars** with a trailing "+N" overflow chip — social proof / multi-author / roster. Composes `Avatar` for each entry, overlaps them with a negative margin + descending z-index, and draws a ring in the surrounding background color so each tile reads as separate. Anything beyond `max` collapses into a same-size "+N" chip.

It mirrors the marketing `.wl-avatars` and CMS `.authors` treatments. Secondary export `AvatarStackItem` is the per-entry shape forwarded to the composed `Avatar`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `avatars` | `AvatarStackItem[]` | — (required) | ✓ | ✓ | roster; each forwarded to a composed `Avatar` |
| `max` | `number` | `4` | ✓ | ✓ | visible cap; remainder → "+N" chip |
| `size` | `number` | `32` | ✓ | ✓ | px diameter of each avatar |
| `ring` | `string` | `'var(--bg-1)'` (web) / `colors.bg1` (native) | ✓ | ✓ | gap/separation color between overlaps |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `CSSProperties` / `StyleProp<ViewStyle>` | — | ✓ | ✓ | both, platform-typed |
| _rest_ | `HTMLAttributes<HTMLSpanElement>` (web) / `ViewProps` (native) | — | ✓ | ✓ | spread onto root |

- **`AvatarStackItem`** = `Pick<AvatarProps, 'name' | 'initials' | 'src' | 'gradient'>` — exactly the identity props of `Avatar` (so `gradient` is still platform-shaped: CSS string on web, stop array on native).
- **Derived geometry** (identical both sides): `overlap = -round(size * 0.32)`; `ringWidth = max(2, round(size * 0.06))`. First visible avatar has no left margin; the rest use `overlap`. `zIndex` descends so earlier tiles sit on top.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`avatarstack.css`) | Native (`StyleSheet`) |
| --- | --- | --- |
| Row | `.lk-avstack` `inline-flex`, `align-items: center` | `<View>` row, `align-items: center` |
| Item | `.lk-avstack-item` `inline-flex`, `flex: none` | `<View>` with inline `marginLeft`/`zIndex` |
| Separation ring | `.lk-avstack-ringed` `box-shadow: 0 0 0 {ringWidth}px var(--lk-avstack-ring)` | `borderWidth: ringWidth`, `borderColor: ring` on the Avatar (box grows by `ringWidth*2`) |
| "+N" chip | `.lk-avstack-more` `--glass-2` bg, `1px --border-2`, `--text-dim`, `--font-display` 700 | `colors.glass2` bg, `colors.border2`, `colors.textDim`, `fonts.display` 700 |
| "+N" font | inline `round(size * 0.36)` | inline `round(size * 0.36)` |
| Ring var | `--lk-avstack-ring` (set from `ring`) | passed directly as `borderColor` |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | overlapped row, descending z-index | overlapped row, descending z-index |
| Overflow | `avatars.length > max` → "+N" chip (`overflow = length - visible`) | same |
| No overflow | chip omitted when `overflow <= 0` | same |
| Hover | `.lk-avstack-item:hover { z-index: 10 !important }` — lifts hovered tile clear | n/a (no hover) |

No focus/disabled — passive display row (wrap individual avatars in controls if interactive).

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, platform-shaped separation ring.** Identical `avatars`/`max`/`size`/`ring` semantics, identical overlap (`-0.32×`) and ring-width (`max(2, 0.06×)`) math, identical descending z-index, identical "+N" chip styling and `0.36×` font. Real differences are substrate-only:

- **Separation ring mechanism:** web draws it as a `box-shadow` (doesn't change the layout box, so overlap math stays clean); native uses a `borderWidth`/`borderColor` on the Avatar and **grows the box by `ringWidth*2`** to compensate. Same visual gap between tiles.
- **Hover lift:** web raises the hovered tile to `z-index: 10`; native has no hover (static stack).
- **`ring`/`gradient`:** color/stops follow the same platform-shaped pattern as `Avatar`.

No capability gap blocks use.

## 6. Composition & usage

- **Composes:** `Avatar` per entry (forwards `name`/`initials`/`src`/`gradient`).
- **Used by:** marketing waitlist/social-proof rows, multi-author bylines, team rosters, "who's in" groups.
- **Set `ring`** to the actual surrounding surface color (e.g. `var(--bg-2)` on a darker card) so the gaps read correctly.

```tsx
// web
<AvatarStack
  size={36}
  max={3}
  ring="var(--bg-2)"
  avatars={[{ name: 'Ada L.' }, { name: 'Bob K.' }, { name: 'Cy R.' }, { name: 'Dot M.' }]}
/>

// native
<AvatarStack
  size={36}
  max={3}
  avatars={[{ name: 'Ada L.' }, { name: 'Bob K.' }, { name: 'Cy R.' }, { name: 'Dot M.' }]}
/>
```

## 7. Accessibility

- The stack is **decorative grouping** — pass meaningful `name`s so each composed `Avatar` carries identity (web `alt`, native `accessibilityLabel`).
- The "+N" chip is plain text (e.g. "+2"); consider a surrounding label ("12 members") for screen readers when the count matters.
- Hit targets: at small `size` (≤32) the overlapping tiles aren't good touch targets — make the whole row a single control if it's tappable.

## 8. Usage rules — Do / Don't

**Do**
- Set `ring` to the real background color of the surface the stack sits on.
- Tune `max` to the available width; the rest collapse into "+N".
- Keep `size` consistent with neighboring avatars.
- Pass identity-bearing `name`/`initials` per entry.

**Don't**
- ✗ Don't hand-roll overlapping avatars with manual margins — use `AvatarStack`.
- ✗ Don't leave `ring` at the default when the surface isn't `--bg-1` (the gaps will look wrong).
- ✗ Don't make individual overlapping tiles tappable at small sizes — wrap the row.
- ✗ Don't hardcode the overlap/ring math or "+N" chip styling — they're derived + tokenized.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom overlapping-avatars row is a parity violation — import `AvatarStack`.
- **New need → both platforms.** A right-aligned stack or a different overflow style goes on `AvatarStack` web **and** native (same props, same math), never a one-off.
- **Tokens only.** The "+N" chip (`--glass-2`/`--border-2`/`--text-dim`) and default `ring` (`--bg-1`) come from `@lockin90/tokens`.
- **Parity gate.** Before shipping a roster/social-proof surface, diff web phone-width vs native: same count, same `max`/overflow, same ring color and overlap.
