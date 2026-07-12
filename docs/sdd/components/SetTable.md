# SDD — `SetTable` (+ `setLabels` helper)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/SetTable.tsx` · `packages/ui-native/src/components/SetTable.tsx` ·
> web CSS `packages/ui/src/styles/components/settable.css` (`.lk-settable*`).
> **Exports:** `SetTable`, `setLabels`, types `SetType`, `SetReferenceTone`, `WorkoutSet`, `SetTableColumn`, `SetTableProps`.
> **Status:** Shipped. **Parity:** 🟡 same API, platform-shaped impl — web is a real `<table>` in a scroll wrap; native is a flex-row grid (no table element in RN); done-check fill is CSS `--grad-mint` ↔ `expo-linear-gradient`.
> **Stories:** `packages/ui/src/stories/SetTable.stories.tsx` · `packages/ui-native/src/stories/SetTable.stories.tsx`.

---

## 1. Overview

The **per-set workout table** — the training design's core primitive. One row per set: a colored SET label, the centered mono `weight×reps` value, a right-aligned mono coach/AI reference, and the done check. Carries the live-session logging screen and the read-only workout detail.

Secondary export `setLabels(sets)` — the pure label derivation (`W` warmup · working sets numbered `1,2,…` · `D` drop · `F` failure; `label` overrides without breaking the numbering). No dashed underlines anywhere, by design.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `sets` | `WorkoutSet[]` | — (required) | ✓ | ✓ | see row shape below |
| `columns` | `SetTableColumn[]` (`'set'·'value'·'reference'·'check'`) | all 4 | ✓ | ✓ | render order = array order |
| `editable` | `boolean` | `false` | ✓ | ✓ | value gets the input-look box |
| `onSetPress` | `(id: string) => void` | — | ✓ | ✓ | whole row is the tap target |
| `onTogglePress` | `(id: string) => void` | — | ✓ | ✓ | the check button |
| `onAddSet` | `() => void` | — | ✓ | ✓ | renders the trailing `+ Add set` row |
| `addLabel` | `string` | `'Add set'` | ✓ | ✓ | uppercased in render |
| `referenceHeader` | `string` | `'Coach rec'` | ✓ | ✓ | reference column header |
| `className` / _rest_ | — | — | ✓ | — | wrap div |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | container |

`WorkoutSet`: `{ id, setType: 'warmup'|'working'|'drop'|'failure', label?, weight?, reps?, unit?: 'kg'|'lb', reference?, referenceTone?: 'coach'|'ai'|'none', done?, isPr?, isCurrent? }`.

- Value renders `weight×reps` with `—` for a missing half; value header derives from the first set with a `unit` (`KG × REPS` / `LB × REPS`, fallback `WEIGHT × REPS`).
- The check button stops row-press propagation (web `stopPropagation`; native nested `Pressable`).

## 3. Visual spec (tokens — never hardcode)

| Element | Web | Native |
| --- | --- | --- |
| Header | `--font-mono` 9.5px uppercase `.12em` `--text-faint`, hairline `--border` below | `fonts.mono` 9.5, ls 1.1, `colors.textFaint` |
| SET label | `--font-display` 700 14px, 44px col, centered | `fonts.display` 700 14, width 44 |
| Value | `--font-mono` 13.5px 600 tnum centered; done → `--text-dim` | same via `fontVariant: ['tabular-nums']` |
| Reference | `--font-mono` 11px right-aligned nowrap | same, `numberOfLines={1}` |
| Check | 32×32 r10 `--glass`/`--border`; done → `--grad-mint` fill, `#07080D` glyph, `--glow-mint`, scale 1.04 | same geometry; done → `expo-linear-gradient` `gradients.mint`, legacy mint `shadow*` glow |
| Add row | `--accent-2` mono 10.5px 600 uppercase `.12em`, hover cyan 6% tint | `colors.accent2`, pressed cyan 6% tint |

**Set-type colors** (SET column): warmup `--zone-mid` amber · working `--accent-2` cyan · drop `--violet` · failure `--magenta`.
**Reference tones:** coach `--mint` · ai `--accent` · none `--text-faint`.
**Row tints (matched literals both sides):** current `rgba(34,211,238,.07)` (accent-2 @ 7%) · done `rgba(52,245,197,.05)`.
**PR badge:** `isPr && done` → `PrBadge size="sm"` absolutely positioned right of the value (web `right:8px` in the relative cell; native `position:'absolute', right:8`) so the centered number never shifts.
**Editable box:** `--r-sm` border `--border` on `rgba(255,255,255,.03)`; current → cyan 35% border; done → mint 18% border on mint 4% fill.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Current set | cyan row tint; wins over hover | cyan row tint |
| Done set | mint row tint, dim value, filled mint check (`aria-pressed="true"`) | same (`accessibilityState.selected`) |
| PR + done | red `PrBadge` floated right of value | same |
| Tappable row (`onSetPress`) | `cursor:pointer`, `--glass` hover | `Pressable` + `hapticSelection()` |
| Editable | input-look value box | same |
| Check hover | text/border brighten (web only — no hover on native) | pressed feedback via `Pressable` |

Check transitions honor `prefers-reduced-motion` (transition removed).

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped impl.** App code reads 1:1; differences are substrate:
- **Table substrate:** web = semantic `<table>` inside an `overflow-x:auto` wrap; native = flex rows (RN has no table) with fixed 44px set/check columns and flexed value/reference.
- **Done-check fill:** CSS `--grad-mint` ↔ `expo-linear-gradient` with `gradients.mint` (the Button-primary precedent).
- **Press:** web row `onClick` + check `stopPropagation` ↔ native nested `Pressable`s + optional haptics.
- Same labels, colors, tints, PR-badge float, add-row treatment. No capability gap.

## 6. Composition & usage

- **Used in:** live session logging (editable + onTogglePress), workout detail (read-only), template preview (`columns={['set','value']}`).
- **Composes from:** `PrBadge`; native check uses `expo-linear-gradient`; check glyph is the design's `M20 6 9 17l-5-5` path.

```tsx
// web — live session
<SetTable sets={sets} editable onSetPress={openEditor} onTogglePress={toggle} onAddSet={add} />

// native — read-only history, no reference column
<SetTable sets={sets} columns={['set', 'value', 'check']} />
```

## 7. Accessibility

- **Web:** real `<table>` semantics; check is a `<button aria-pressed>` with `aria-label="Set {label} done"`; row click targets are supplemented by the always-focusable check button.
- **Native:** rows and checks are `accessibilityRole="button"`; check carries `accessibilityState={{ selected }}` + the same label; `hitSlop={6}` pads the 32px check to ≥44px effective target.
- Set types are distinguished by **letter + color**, not color alone.

## 8. Usage rules — Do / Don't

**Do**
- Feed pre-formatted `reference` strings (`'80×5'`) — the component doesn't compute recommendations.
- Use `columns` to drop the reference column on narrow layouts instead of hiding it with CSS.
- Keep `id`s stable — they key rows and drive the callbacks.

**Don't**
- ✗ Don't hand-roll a set list out of `ListRow`s — this is the canonical set primitive.
- ✗ Don't put the PR badge in flow next to the value (it must never shift the centered number).
- ✗ Don't add dashed underlines or new set-type colors per call site — extend `SetType` on both platforms.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** Any per-set grid (weight×reps + check) IS this component — import it, don't rebuild it.
- **New need → both platforms.** A new column, set type, or tone ships to web **and** native with the same prop names + tokens (keep the tint literals matched).
- **Tokens only** (the two row-tint rgba literals + PR red are the canonical matched exceptions).
- **Parity gate.** Diff web phone-width vs native row-for-row (labels, colors, tints, badge, check states) before shipping.
