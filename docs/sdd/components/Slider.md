# SDD — `Slider`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Slider.tsx` · `packages/ui-native/src/components/Slider.tsx` ·
> web CSS `packages/ui/src/styles/components/slider.css` (`.lk-slider*`).
> **Exports:** `Slider`, type `SliderProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; `fill` is platform-shaped (CSS string vs `[from,to]` tuple) and interaction differs (overlaid `<input range>` vs `PanResponder`).
> **Stories:** `packages/ui/src/stories/Slider.stories.tsx` · `packages/ui-native/src/stories/Slider.stories.tsx`.

---

## 1. Overview

`Slider` is the kit's **Aurora-Flux range slider**: a neutral remainder rail, a gradient (or solid) fill up to
the value with a soft glow, and a glowing white thumb ringed in the glow color. An optional row of evenly-spaced
scale labels can render under the rail (e.g. a mood / focus / energy scale). It is the one sanctioned slider for
1-D numeric input. Web overlays a real, accessible `<input type="range">` (visually hidden) so keyboard + drag
work on top of the custom visual; native drives it with a `PanResponder`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `number` | `72` | ✓ | ✓ | current value |
| `min` | `number` | `0` | ✓ | ✓ | scale minimum |
| `max` | `number` | `100` | ✓ | ✓ | scale maximum |
| `onChange` | `(value: number) => void` | — | ✓ | ✓ | **number-shaped** — fires on input/drag |
| `fill` | web `string` · native `string \| [string, string]` | web `'linear-gradient(90deg, var(--accent), var(--cyan))'` · native `[colors.accent, colors.cyan]` | ✓ | ✓ | **platform-shaped** — CSS color/gradient string vs solid color OR `[from,to]` tuple |
| `glow` | `string` | web `'var(--accent)'` · native `colors.accent` | ✓ | ✓ | thumb / fill glow color |
| `trackColor` | `string` | `'rgba(255,255,255,0.10)'` | ✓ | ✓ | unfilled remainder rail color |
| `labels` | `string[]` | — | ✓ | ✓ | evenly-spaced scale labels under the rail |
| `className` / `style` | — | — | `className` + rest | `style` | web → root class/rest · native → `ViewStyle` |
| _rest_ | `Omit<InputHTMLAttributes<HTMLDivElement>,'onChange'\|'defaultValue'>` (web) | — | ✓ | — | spread onto the root `<div>` (web only) |

- **Web:** the visual layers (track/fill/thumb) read per-instance CSS vars `--pct`, `--fill`, `--glow`, `--track`;
  a real `<input type="range" min max value>` is overlaid at `opacity: 0` to provide interaction + a11y.
- **Native:** `SliderProps` is a narrower interface (no DOM rest). `onLayout` measures the rail width; a
  `PanResponder` maps `locationX` → clamped value and emits via `onChange`. `fill` as an array → `expo-linear-gradient`,
  else a solid `View`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`.lk-slider*`) | Native (`styles`) |
| --- | --- | --- |
| Root height | `18px` | `18` |
| Rail (track) | height `10px`, radius `--r-pill`, bg `--track` (default `rgba(255,255,255,.10)`) | height `10`, radius `radii.pill`, bg `trackColor` |
| Fill | height `10px`, width `--pct`, radius `--r-pill`, bg `--fill`, `box-shadow 0 0 14px -2px --glow` | height `10`, width `pct%`, radius `radii.pill`, gradient/solid + `shadow*` (opacity .7, radius 7) |
| Thumb | 18×18, white, `4px` `--glow` ring, double `box-shadow` glow | 18×18, white, `borderWidth 4` `glow`, `shadow*` (opacity .8, radius 6) |
| Default gradient | `--accent` → `--cyan` (`#7C5CFF` → `#22D3EE`) | `[colors.accent, colors.cyan]` |
| Labels | `space-between`, `--font-mono` 8.5px, `--text-faint`, `margin-top 7px` | row `space-between`, `fonts.mono` 8.5px, `colors.textFaint`, `marginTop 7` |

- **`pct`** is computed identically: `clamp(0, ((value - min) / (max - min)) * 100, 100)`.
- **Labels wrapper:** with `labels`, the rail is nested under `.lk-slider-field` (web) / a wrapping `View` (native)
  with the labels row beneath; without `labels`, the rail itself carries `className`/`style`.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | rail + fill + thumb at `--pct` | rail + fill + thumb at `pct%` |
| Dragging | overlaid `<input range>` thumb drag | `PanResponder` grant/move → `emitAtX` |
| Keyboard | `<input range>` arrows (native browser behavior) | n/a (no hardware keyboard) |
| Focus | `:focus-visible` → thumb gains `box-shadow 0 0 0 3px --border-2` ring | n/a |
| Reduced motion | static layers (no transition needed) | static |

No disabled/invalid state — `Slider` is a plain value control; gate it at the container level if needed.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, platform-shaped interaction + `fill`.** The rail/fill/thumb visual, the
`value/min/max/onChange`, `glow`, `trackColor`, and `labels` are identical; `pct` math is shared. Differences:

- **`fill` shape** — web takes a CSS **string** (color or full `linear-gradient(...)`); native takes a solid
  **string OR a `[from, to]` tuple** (rendered via `expo-linear-gradient`). App code passes the platform-native form.
- **Interaction** — web overlays a real `<input type="range">` (drag **+** keyboard **+** built-in a11y); native
  uses a `PanResponder` (**drag only** — mobile has no slider keyboard). On touch this is the expected convention.
- **Focus ring** — web-only (`:focus-visible` thumb ring); native has no focus concept here.
- **Rest props** — web spreads DOM attrs onto the root; native only takes `style`.

Not a blocking capability gap — both let the user set a value by dragging the thumb; the `fill` shape is the one API seam.

## 6. Composition & usage

- **Composes:** (native) `expo-linear-gradient` for a tuple fill; otherwise self-contained.
- Use `labels` for a labeled scale (mood / focus / energy). Drive `fill`/`glow` from the metric's zone color to
  tie the slider to its meaning (use tokens — `var(--zone-*)` / `colors.zone*`).
- Keep it controlled: store `value`, update in `onChange`.

```tsx
// web
<Slider value={energy} min={0} max={100} onChange={setEnergy}
        fill="linear-gradient(90deg, var(--accent), var(--cyan))" glow="var(--accent)" />
<Slider value={mood} labels={['Low', 'Mid', 'High']} onChange={setMood} />

// native
<Slider value={energy} min={0} max={100} onChange={setEnergy}
        fill={[colors.accent, colors.cyan]} glow={colors.accent} />
<Slider value={mood} labels={['Low', 'Mid', 'High']} onChange={setMood} />
```

## 7. Accessibility

- **Web:** the overlaid `<input type="range">` is a real, focusable slider — arrow keys adjust, screen readers
  announce min/max/value. Pass `aria-label` via rest when there's no visible label. The thumb shows a focus ring.
- **Native:** the rail is a custom `View` with no `accessibilityRole="adjustable"` wired — for an AT-critical
  numeric input on native, surround it with a labeled control or add `accessibilityValue` at the call site.
- **Hit target:** the full rail height (18px) is draggable on web (native thumb sized to cover the track); on
  native the `PanResponder` accepts a press anywhere along the rail.

## 8. Usage rules — Do / Don't

**Do**
- Use `Slider` for any single continuous value; keep it controlled.
- Pass `fill`/`glow` from the metric's zone token so the color carries meaning.
- Use `labels` to anchor a qualitative scale.
- Pass `fill` in the platform-correct shape (CSS string web · solid or `[from,to]` native).

**Don't**
- ✗ Don't hand-roll a range input + custom track — import `Slider`.
- ✗ Don't pass a `[from,to]` tuple on web or a CSS `linear-gradient(...)` string as a tuple on native.
- ✗ Don't hardcode the gradient/glow hexes — use `--accent`/`--cyan`/`--zone-*` (`colors.*`).
- ✗ Don't rely on native keyboard adjustment — it's drag-only there.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom slider re-creating the rail + glow + thumb is a parity violation — import `Slider`
  so web (overlaid range input) and native (PanResponder) stay in sync.
- **New need → both platforms.** Stepped/ticked/two-thumb variants must be added to `Slider` on web **and**
  native with the same prop names and tokens — never a one-off.
- **Tokens only.** Default fill/glow/track come from tokens; pass token-derived colors, not raw hexes.
- **Parity gate.** Confirm the web phone-width slider and the native slider show the same rail, fill color, thumb,
  and (if used) label row for the same value before shipping.
