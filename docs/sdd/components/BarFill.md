# SDD — `BarFill`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/BarFill.tsx` · `packages/ui-native/src/components/BarFill.tsx` ·
> web CSS `packages/ui/src/styles/primitives.css` (`.lk-barfill`).
> **Exports:** `BarFill`, type `BarFillProps`.
> **Status:** Shipped. **Parity:** 🟡 same role/visual (thin `--grad-cta` track), platform-shaped props — web has `visible` (reveal animation), native has `height`.
> **Stories:** `packages/ui/src/stories/BarFill.stories.tsx` · `packages/ui-native/src/stories/BarFill.stories.tsx`.

---

## 1. Overview

A **thin horizontal gradient progress bar** — a faint pill track with a `--grad-cta` (violet→cyan) fill that runs to a `0..1` `value` fraction. The lightest-weight "fraction of a goal" indicator in the kit; used inline in list rows, mini-stats, and compact cards where a full `ProgressBar` (which carries tone/label/size) is heavier than needed.

`BarFill` is intentionally minimal — value-only, no label, no tone. For a labeled/tone-able bar use `ProgressBar`; for a vertical categorical chart use `BarChart`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `number` | — (required) | ✓ | ✓ | fill fraction, clamped to `[0,1]` |
| **`visible`** | `boolean` | `true` | ✓ | — | **web only** — when `false` the fill is collapsed to width 0 (animate in on reveal) |
| **`height`** | `number` | `8` | — | ✓ | **native only** — track height in px; also sets the pill radius |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `CSSProperties` / `StyleProp<ViewStyle>` | — | ✓ | ✓ | merged onto the track |
| _rest_ | web `HTMLAttributes<HTMLDivElement>` · native `ViewProps` | — | ✓ | ✓ | spread to the track element |

- **Web:** `value` is exposed as the CSS var `--v`; `is-visible` toggles the fill width to `calc(--v * 100%)`. Track height is a fixed `8px` in CSS (not a prop).
- **Native:** `value` becomes a `${v*100}%` width on the gradient; `height` is a prop (default `8`) and equals the pill radius. No reveal flag — the bar is always filled.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Track height | `8px` (fixed in CSS) | `height` prop, default `8` |
| Track radius | `999px` | `borderRadius: height` |
| Track bg | `rgba(255,255,255,.06)` | `rgba(255,255,255,0.06)` |
| Fill | `var(--grad-cta)` | `gradients.cta.stops` (start `{0,0}`→end `{1,0}`) |
| Fill radius | `999px` | `borderRadius: height` |
| Overflow | `hidden` | `hidden` |

- **Web-only motion:** the inner `<i>` animates `width 1.1s var(--ease)`; with `visible=false` it sits at `width:0` and fills to `calc(--v*100%)` when `is-visible` is applied — the reveal-in pattern. Native has no width animation.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Filled | `.lk-barfill.is-visible > i` → `width calc(--v*100%)` | gradient `width: ${v*100}%` |
| Collapsed (pre-reveal) | `visible=false` → `width:0` | n/a (no `visible`) |
| Zero | `value=0` → empty track | empty track |
| Full | `value≥1` → full track | full track |

No hover/focus/disabled — presentational.

## 5. Web ↔ native parity

**Verdict: 🟡 same role + visual, platform-shaped props.** Both render the identical thing — a `~8px` faint pill track with a `--grad-cta` fill to `value` — using the same track background and the same CTA gradient tokens. The prop sets differ by intent:

- **`visible` (web only):** drives the CSS reveal/fill animation. There is no native equivalent because RN has no cheap CSS-keyframe analogue here and the bar is drawn at its final width.
- **`height` (native only):** web fixes the track at `8px` in CSS; native exposes it as a prop (which also sets the radius). To match web, pass `height={8}` (the default).
- **Substrate:** web = `<div>` + inner `<i>` + CSS var `--v`; native = `View` track + `LinearGradient`.

No capability gap — both are fully usable; only the animate-in affordance is web-only.

## 6. Composition & usage

- **Used in:** `ListRow` trailing meters, mini KPI tiles, compact stat cards, anywhere a one-line "x% of goal" is needed.
- **Reveal pattern (web):** start `visible={false}`, flip to `true` when the row enters the viewport (e.g. via `useReveal`) for the fill-in animation.

```tsx
// web — animate the fill in on reveal
const visible = useReveal();
<BarFill value={0.72} visible={visible} />

// native — fixed-height fill
<BarFill value={0.72} height={8} />
```

## 7. Accessibility

- Presentational by default (no ARIA role). When the bar conveys standalone meaning, add `role="progressbar"` + `aria-valuenow/min/max` via `...rest` on web, or pair it with a visible text value.
- Keep the fill on the dark track for contrast; the CTA gradient is bright enough to read at `8px`.
- Hit target: not interactive — no minimum size requirement.

## 8. Usage rules — Do / Don't

**Do**
- Pass `value` in `[0,1]` (it is clamped, but feed a real fraction).
- Use the default `height={8}` on native to match web's fixed track.
- Use `visible` + a reveal hook on web for the fill-in animation.

**Don't**
- ✗ Don't hand-roll a thin gradient bar — use `BarFill`.
- ✗ Don't pass `visible` on native or `height` on web (wrong-platform prop).
- ✗ Don't hardcode the CTA gradient/track color — they come from tokens.
- ✗ Don't use `BarFill` when you need a label, tone, or size — reach for `ProgressBar`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom `<div>`-with-inner-bar progress strip duplicates this primitive — import `BarFill`.
- **New need → add to BOTH platforms.** If a screen needs a tone color or animation parity, add the prop with the same name + tokens on web and native — never a one-off bar.
- **Tokens only.** The `--grad-cta`/`gradients.cta` fill and the track rgba are the contract; don't substitute hardcoded colors.
- **Parity gate.** Before shipping, confirm the web (with `height` implicitly `8`) and native (`height={8}`) bars read identically at phone width.
