# SDD — `BrandMark`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/BrandMark.tsx` · `packages/ui-native/src/components/BrandMark.tsx` ·
> web: no dedicated CSS class — `lockup` reuses `.lk-display` + `.lk-gradient-text` from `packages/ui/src/styles/base.css`.
> **Exports:** `BrandMark`, type `BrandMarkVariant`, type `BrandMarkProps`.
> **Status:** Shipped. **Parity:** 🟡 same variants & glyph; wordmark "90" gradient via CSS clip (web) vs SVG `<TSpan>` fill (native).
> **Stories:** web: none · native `packages/ui-native/src/stories/BrandMark.stories.tsx`.

---

## 1. Overview

The **LockIn90 brand mark** — a sky-cyan energy line climbing to a glowing lime peak dot, drawn in a 343×302 space. Four variants:

- `mark` — the bare line + glowing dot, transparent, cropped to the glyph.
- `lockup` — `mark` + the "LockIn**90**" wordmark (the "90" carries the energy-spectrum gradient).
- `icon` — the dark app-store tile (violet radial glow) with the centered glyph.
- `mono` — single-color glyph (`--text` / `colors.text`), no halo rings — for one-color contexts.

It's the only sanctioned way to render the logo. Line color `#78CEDF`, dot color `#C6F84E` are brand constants (not tokens) shared verbatim by both platforms.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'mark' \| 'lockup' \| 'icon' \| 'mono'` | `'mark'` | ✓ | ✓ | identical union both sides |
| `size` | `number` | `28` | ✓ | ✓ | px height of the mark; lockup wordmark scales with it |
| `title` | `string` | `'LockIn90'` | ✓ | — | **web only** — svg `aria-label` / accessible name |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `Omit<SVGProps<SVGSVGElement>, 'height' \| 'width'>` (web) | — | ✓ | — | spread onto the `<svg>` (web); native props are explicit |

- **Web:** extends `Omit<SVGProps<SVGSVGElement>, 'height' | 'width'>` (size controls dimensions); `title` becomes the svg `aria-label`. Uses `useId()` (de-colon'd) to namespace the `icon` gradient `id`s.
- **Native:** explicit `{ variant, size, style }` — no SVGProps spread, no `title` prop. `icon`/`lockup` gradient ids are fixed string literals (`lkNbg`/`lkNgl`/`lkWm90`).
- **Geometry:** `mark`/`mono` viewBox `"30 28 320 248"`, height `round(size*248/320)`; `icon` viewBox `"0 0 343 302"`, height `round(size*302/343)`, corner radius `round(size*0.22)`; `lockup` gap `round(size*0.42)`, wordmark font `round(size*1.05)`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Value (both platforms unless noted) |
| --- | --- |
| Line | `#78CEDF`, `stroke-width 30`, round caps/joins, path `M48 256 L128 120 L184 204 L262 116` |
| Peak dot | `#C6F84E`, `r 30` at `(288, 90)` |
| Dot halo (non-mono) | two rings at `(288,90)` r42 (`opacity .28`) + r58 (`opacity .13`), `#C6F84E` |
| Mono | line + dot both `--text` / `colors.text`; halo rings omitted |
| `icon` tile bg | linear `#1b2438` → `#0b0f18` + radial violet glow `#5d40ad` (`.6`→`0`) |
| `icon` corner | `round(size*0.22)` radius |
| Wordmark text | `--font-display` / `fonts.display`, 700, "LockIn" in `--text`/`colors.text` |
| Wordmark "90" | web `.lk-gradient-text` (animated clip); native SVG gradient `#A8FF35 → #22D3EE → #7C5CFF` |

- **Web `lockup`** is an `inline-flex` `<span>`: `<BrandMark variant="mark">` + a `.lk-display` span where "90" wears `.lk-gradient-text` (the animated energy-spectrum clip from `base.css`).
- **Native `lockup`** renders the wordmark **in SVG** (`<SvgText>` + `<TSpan>`) so the "90" can carry a 3-stop `LinearGradient` fill (`lkWm90`) — RN can't `background-clip: text` on HTML.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| `mark` / `mono` | transparent svg, glyph only | same |
| `icon` | dark tile + radial glow + centered glyph | same (clipped `<View>` + `<Svg>`) |
| `lockup` | mark + HTML wordmark (animated "90") | mark + SVG wordmark (static gradient "90") |
| Reduced motion | `.lk-gradient-text` flow follows the global text-flow keyframe | native "90" is a static gradient |

No hover/focus/disabled — it's a passive brand glyph (wrap in a link/Pressable if it navigates home).

## 5. Web ↔ native parity

**Verdict: 🟡 same variants & glyph, platform-shaped wordmark.** Identical variant union, identical glyph geometry (same path, dot, halo radii, brand colors `#78CEDF`/`#C6F84E`), identical `icon` tile gradients + `0.22×` corner, identical size-ratio math. Real differences are substrate-only:

- **Wordmark "90" gradient:** web uses the `.lk-gradient-text` CSS `background-clip: text` (animated, mirrored spectrum from `base.css`); native renders the wordmark as SVG `<Text>`/`<TSpan>` with a static 3-stop `LinearGradient` (`#A8FF35 → #22D3EE → #7C5CFF`) because RN has no text background-clip. Visually equivalent at rest; only web animates the fill.
- **`icon` gradient ids:** web namespaces them per instance via `useId()`; native uses fixed literals — same rendered tile.
- **Prop surface:** web accepts `SVGProps` + `title` (accessible name); native accepts only `style`. App code passes `variant`/`size` identically.

No capability gap blocks use.

## 6. Composition & usage

- **`lockup`** self-composes `<BrandMark variant="mark">` + the wordmark.
- **Used by:** app headers / nav, auth screens, marketing, the app-store `icon` tile asset, mono contexts (print, single-color UI).
- **Reuses:** web `base.css` utilities `.lk-display` + `.lk-gradient-text`.

```tsx
// web
<BrandMark variant="lockup" size={32} />
<BrandMark variant="mono" size={20} aria-hidden />

// native
<BrandMark variant="lockup" size={32} />
<BrandMark variant="mono" size={20} />
```

## 7. Accessibility

- **Web:** `mark`/`icon`/`mono` svgs set `role="img"` + `aria-label={title}` (default `'LockIn90'`); pass `aria-hidden` when the logo is decorative beside visible text. The `lockup` wraps a real text span ("LockIn90") that reads naturally.
- **Native:** no `title` prop — add `accessibilityLabel="LockIn90"` on the wrapping element when the mark conveys the app name standalone; the `lockup` wordmark is real SVG text.
- **Contrast:** `mono` uses `--text`/`colors.text` for single-color contexts; the `icon` tile keeps the bright glyph on a dark violet-glow base.

## 8. Usage rules — Do / Don't

**Do**
- Use `lockup` where the brand name should read; `mark` where space is tight; `icon` for the app-tile asset; `mono` for one-color contexts.
- Size via `size` only — every other dimension derives from it.
- Add `aria-hidden` (web) when the mark sits beside visible "LockIn90" text.
- Keep the brand colors as the component ships them.

**Don't**
- ✗ Don't recolor the line/dot or the wordmark gradient — they're brand constants.
- ✗ Don't re-create the energy-line glyph by hand — use `BrandMark`.
- ✗ Don't stretch the svg by setting width/height directly (web omits those from props) — use `size`.
- ✗ Don't pass `title`/`SVGProps` on native (explicit prop surface) — use `style`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-drawn "energy line + dot" logo is a brand/parity violation — import `BrandMark`.
- **New variant → both platforms.** A new lockup orientation goes on `BrandMark` web **and** native (same variant name, same glyph), never a one-off SVG.
- **Brand constants + tokens.** Line `#78CEDF` / dot `#C6F84E` are fixed brand values; `mono` and the wordmark base text use `--text`/`colors.text`. Don't fork either per app.
- **Parity gate.** Before shipping a header/auth/marketing surface, diff web phone-width vs native: same variant, same size, same wordmark treatment.
