# SDD — `ChoiceChip` (+ `ChoiceChipSize`)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/ChoiceChip.tsx` · `packages/ui-native/src/components/ChoiceChip.tsx` ·
> web CSS `packages/ui/src/styles/components/choicechip.css` (`.lk-choicechip*`).
> **Exports:** `ChoiceChip`, type `ChoiceChipSize`, type `ChoiceChipProps`.
> **Status:** Shipped. **Parity:** 🟡 same API, sizes & visuals; web is a `<button aria-pressed>` (hover + full button attrs), native is a `Pressable` (`onPress`).
> **Stories:** `packages/ui/src/stories/ChoiceChip.stories.tsx` · `packages/ui-native/src/stories/ChoiceChip.stories.tsx`.

---

## 1. Overview

A **pressable, selectable filter pill** (multi-select). The interactive sibling of the display-only `Chip`: a real toggle whose `selected` state tints to the `--accent` token. Use it for filter bars, tag pickers, multi-select choice lists — any "tap to toggle on/off" pill. Mirrors the studio's `.pill` / `.pill.on` pattern.

Distinct from its neighbors:
- **`Chip`** — display-only status badge (a `<span>`), not pressable.
- **`SegmentedTabs`** — single-select segmented control (one active at a time).
- **`ChoiceChip`** — a real toggle button; multiple can be `selected` independently.

`ChoiceChipSize` (`'sm' | 'md'`) is the secondary type export, selecting pill density.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `selected` | `boolean` | `false` | ✓ | ✓ | the `.on` state — accent border + tint + brighter text |
| `size` | `'sm' \| 'md'` | `'md'` | ✓ | ✓ | pill density |
| `leadingDot` | `boolean` | `false` | ✓ | ✓ | leading glow dot (ignored when `icon` is set) |
| `icon` | `ReactNode` | — | ✓ | ✓ | leading glyph (overrides `leadingDot`) |
| `children` | `ReactNode` | — | ✓ | ✓ | the label (both platforms) |
| `disabled` | `boolean` | `false` | ✓ | ✓ | dims + blocks press |
| `onPress` | `() => void` | — | — | ✓ | **native** press handler |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | ✓ | — | **web** — defaults to `'button'` (no accidental submit) |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| `className` | `string` | — | ✓ | — | web only |
| _rest_ | `ButtonHTMLAttributes` (web) | — | ✓ | — | **web only** — `onClick`, `id`, `aria-*`, etc. |

- **Web:** `forwardRef<HTMLButtonElement>`; a real `<button>` with `aria-pressed={selected}`; click handled via the spread `onClick`. `type` defaults to `'button'`.
- **Native:** a `Pressable` with `accessibilityRole="button"` + `accessibilityState={{ selected, disabled }}`; press via the explicit `onPress` (no rest spread).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Layout | `inline-flex`, `gap: 7px` | `flexDirection:row`, `gap: 7`, `alignSelf:flex-start` |
| Padding (`md`) | `7px 13px` | `7 / 13` |
| Padding (`sm`) | `5px 10px` | `5 / 10` |
| Radius | `--r-pill` (999) | `radii.pill` (999) |
| Border (idle) | `1px --border` | `1 colors.border` |
| Background (idle) | `--glass` | `colors.glass` |
| Text (idle) | `--text-dim`, `--font-ui`, `13px` (`sm` 12) | `colors.textDim`, `fonts.ui`, `13` (`sm` 12) |
| Border (`on`) | `rgba(124,92,255,.5)` | `rgba(124,92,255,0.5)` |
| Background (`on`) | `rgba(124,92,255,.12)` | `rgba(124,92,255,0.12)` |
| Text (`on`) | `--text` | `colors.text` |
| Dot | `6×6px`, `currentColor`, `box-shadow 0 0 8px` → `--accent` when on | `6×6`, `textDim`→`accent`, glow shadow |

- **Hover (web):** idle → border `--border-2` + text `--text`; on → border `rgba(124,92,255,.6)`.
- **Focus (web):** `:focus-visible` → border `--accent` + `box-shadow 0 0 0 3px rgba(124,92,255,.14)`.
- **Transitions (web):** border/background/color 0.18s `--ease`. Native uses press opacity instead.
- **Icon slot:** web `.lk-choicechip-icon` (`inline-flex`, `line-height:0`); native `styles.icon` centered `<View>`. `icon` overrides `leadingDot`.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Idle | `.lk-choicechip` glass + `--text-dim` | `chipOff` glass + `textDim` |
| Selected | `.lk-choicechip-on` violet tint + `--text` | `chipOn` violet tint + `text` |
| Hover | border `--border-2`, text `--text` (on → brighter violet border) | n/a (no hover) |
| Pressed | `:active` (no dedicated rule) | `pressed && !disabled` → opacity .85 |
| Focus | `:focus-visible` accent border + 3px ring | platform focus (Pressable) |
| Disabled | `:disabled` opacity .5, `cursor:not-allowed` | `disabled` → opacity .5, press blocked |

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, platform-shaped event/handler.** Identical `selected`/`size`/`leadingDot`/`icon`/`children`/`disabled` contract, identical padding (7/13 · 5/10), pill radius, the idle glass + `--text-dim` look, and the violet `rgba(124,92,255,…)` selected tint. Differences are the standard pressable substrate:

- **Event:** web spreads `ButtonHTMLAttributes` (`onClick`, `type`, `aria-*`, `id`, …) onto a real `<button>`; native exposes only the explicit `onPress` (+ `disabled`/`style`, no rest). Wire `onClick` on web, `onPress` on native.
- **Selection a11y:** web uses `aria-pressed={selected}`; native uses `accessibilityState={{ selected }}` — equivalent toggle semantics.
- **Hover/focus-ring:** web-only pointer/keyboard affordances; native uses press opacity. No behavior change.

Both render the same pill with the same selected look — no capability gap.

## 6. Composition & usage

- **Composes:** nothing — leaf primitive (optional `icon` node + label).
- **Used by:** filter bars, tag/interest pickers, multi-select choice steps in onboarding, table/list filter rows. The consumer owns the `selected[]` set and toggles on press.

```tsx
// web — multi-select filter row
{tags.map((t) => (
  <ChoiceChip key={t} selected={picked.has(t)} leadingDot onClick={() => toggle(t)}>
    {t}
  </ChoiceChip>
))}

// native
{tags.map((t) => (
  <ChoiceChip key={t} selected={picked.has(t)} size="sm" onPress={() => toggle(t)}>
    {t}
  </ChoiceChip>
))}
```

## 7. Accessibility

- **Web:** a real `<button aria-pressed>` — focusable, Enter/Space toggle, `type="button"` by default (won't submit a form). Pass `aria-label` when the chip is icon-only.
- **Native:** `Pressable` with `accessibilityRole="button"` + `accessibilityState={{ selected, disabled }}`; the label `<Text>` is read.
- **Hit target:** `md` padding (7/13) yields a comfortable touch target; prefer `md` on touch surfaces, `sm` for dense desktop/admin filter bars.
- **Contrast:** the violet selected tint + `--text` label meets contrast on the void; the idle `--text-dim` is legible — don't dim further.

## 8. Usage rules — Do / Don't

**Do**
- Use `ChoiceChip` for multi-select / toggle filters; let multiple be `selected`.
- Use `leadingDot` or `icon` to signal category/brand; `icon` wins if both set.
- Use `size="sm"` for dense filter bars.
- Wire `onClick` (web) / `onPress` (native).

**Don't**
- ✗ Don't use `ChoiceChip` for single-select — use `SegmentedTabs`.
- ✗ Don't use it as a display-only badge — use `Chip`.
- ✗ Don't hand-roll a toggle pill (styled button + accent tint) — import `ChoiceChip`.
- ✗ Don't hardcode the violet selected tint, padding, or radius — tokens (and the shared `rgba(124,92,255,…)`) only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A "custom filter pill" re-creating the glass idle + violet selected state is a parity violation — import `ChoiceChip`.
- **New need → add to BOTH platforms.** A new size or a trailing-remove `×` is a prop added on web *and* native (same name, same tokens) — never a one-off.
- **Tokens only.** The selected tint, border, and focus ring come from `@lockin90/tokens` / the shared rgba constants; keep web CSS and native styles in sync.
- **Parity gate.** Before shipping a filter bar, confirm the web phone-width and native chips look and toggle identically (idle vs selected, size, dot/icon).
