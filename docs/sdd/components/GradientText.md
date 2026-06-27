# SDD — `GradientText`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/GradientText.tsx` · `packages/ui-native/src/components/GradientText.tsx` ·
> web CSS `packages/ui/src/styles/base.css` (`.lk-gradient-text`, `.lk-cta`, `.lk-violet`, `@keyframes lk-flow-text`).
> **Exports:** `GradientText`, type `GradientTextProps`.
> **Status:** Shipped. **Parity:** 🟡 same `gradient` API & look; **web** clips a CSS gradient to live text (`background-clip` + 9s flow animation), **native** does a 2-pass SVG measure-then-fill (static).
> **Stories:** `packages/ui/src/stories/GradientText.stories.tsx` · native equivalent.

---

## 1. Overview

**Energy-spectrum gradient text** — the Aurora Flux headline/accent treatment. It renders its text with a
flowing spectrum gradient instead of a flat color. Three gradients via the `gradient` prop:

- `flux` (default) — full mirrored spectrum (lime→mint→cyan→violet→magenta and back), the brand "energy" text.
- `cta` — violet→cyan→violet (matches the primary CTA gradient).
- `violet` — purple→indigo→purple, a calmer accent.

On **web** it's a polymorphic element (`as`, default `<span>`) whose CSS gradient is clipped to the glyphs and
slowly drifts. On **native** there is no `background-clip`, so it measures the laid-out text and paints the same
gradient into a `react-native-svg` `<Text>` of exactly that size.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `gradient` | `'flux' \| 'cta' \| 'violet'` | `'flux'` | ✓ | ✓ | identical union both sides |
| `as` | `ElementType` | `'span'` | ✓ | ✗ | **web only** — render as `'h1'`, `'p'`, etc. |
| `children` | text | — | ✓ | ✓ | web: any node (CSS clips text); native: **must be `string`/`number`** to measure |
| `style` | `StyleProp<TextStyle>` | — | — | ✓ | native reads `fontSize`/`fontWeight`/`fontFamily`/`letterSpacing` from it |
| `className` | `string` | — | ✓ | — | web only |
| _rest_ | `HTMLAttributes<HTMLElement>` (web) / `TextProps` (native) | — | ✓ | ✓ | spread onto root |

- **Web:** `<Tag className="lk-gradient-text [lk-cta|lk-violet]">{children}</Tag>` — gradient + animation are all CSS.
- **Native:** reads typography off the flattened `style` (defaults: 28px, weight `700`, `fonts.display`); a
  non-string child renders as transparent text (no SVG). See §5.

## 3. Visual spec (tokens — never hardcode)

**Web** (`base.css`):

| Variant | Gradient | Motion |
| --- | --- | --- |
| `flux` | 100° 9-stop **mirrored** spectrum `#A8FF35 → #34F5C5 → #22D3EE → #7C5CFF → #FF3D81 →` (back through the same hues), `background-size: 200% 100%`, `background-clip: text; color: transparent` | `@keyframes lk-flow-text` — `background-position` 0→200% over **9s linear infinite** |
| `cta` | `linear-gradient(135deg, #7C5CFF, #22D3EE, #7C5CFF)` | inherits the flow animation |
| `violet` | `linear-gradient(135deg, #A855F7, #6E7BFF, #A855F7)` | inherits the flow animation |

> Note: the web CSS currently inlines the spectrum hex (matching the spectrum tokens `--lime/--mint/--cyan/--accent/--magenta`); native sources the same stops from `gradients.flux/cta/violet` in `@lockin90/tokens`.

**Native** (`react-native-svg`):

- Builds a `<LinearGradient>` (`x1=0,y1=0 → x2=1,y2=0`, horizontal) from `gradients[gradient].stops` (falls back
  to `gradients.flux`), with evenly-spaced offsets `i/(stops.length-1)`.
- Draws `<SvgText fill="url(#lk-gt-…)">` at `x=0, y=size.h*0.78` using the resolved font; **no animation**.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | clipped CSS gradient, flowing | static SVG gradient fill |
| Measuring (pass 1) | n/a | hidden `<Text opacity:0>` with `onLayout` to capture width/height |
| Drawn (pass 2) | n/a | `<Svg>` of the measured size with the gradient `<SvgText>` |
| Non-string child | renders normally (CSS clips any node) | renders transparent (no SVG path) — avoid |
| Reduced motion | animation continues (CSS, no media guard here) | static (no motion) |

## 5. Web ↔ native parity

**Verdict: 🟡 — same `gradient` API & visual result, fundamentally different rendering.** Both expose the same
`'flux' \| 'cta' \| 'violet'` union and produce spectrum-filled text. The implementations diverge by necessity:

- **Clip vs measure:** web uses `-webkit-background-clip: text` to paint a CSS gradient onto live, selectable,
  reflowing text; RN has no equivalent, so native does a **2-pass measure** (lay out hidden text → read its size
  → draw a same-size SVG `<Text>` with a real `<LinearGradient>` fill).
- **Animation:** web's gradient **flows** (`lk-flow-text`, 9s); native is **static** (no cheap per-frame
  gradient drift). Acceptable, documented.
- **`children` must be a string on native:** the SVG path can only render measured string/number content — a
  `ReactNode` child renders transparent. Web clips any node. **Pass plain text to `GradientText` for parity.**
- **`as` is web-only:** native is always an SVG `<Text>`; control native type via `style` (`fontSize`, weight,
  family, `letterSpacing`), web via `as` + CSS.

No blocking gap — the gradient look matches; only the flow animation is web-only and native requires string text.

## 6. Composition & usage

- **Used in:** marketing/dashboard headlines, the brand wordmark accent, big hero numbers, section eyebrows that
  need the energy treatment.
- **Composes from:** nothing — a leaf. On web set the size via `as` + your heading CSS; on native via `style`.

```tsx
// web
<GradientText as="h1" className="hero-title">LockIn90</GradientText>
<GradientText gradient="cta">Upgrade to Pro</GradientText>

// native
<GradientText gradient="flux" style={{ fontSize: 34, fontWeight: '700' }}>LockIn90</GradientText>
```

## 7. Accessibility

- **Web:** real text — selectable, copyable, and read verbatim by screen readers; honors the chosen `as`
  heading level for document outline. Contrast: the spectrum is bright on the void background; keep it for
  display/accent text, not body copy.
- **Native:** the SVG sets `accessibilityLabel={text}` so the string is announced even though it's drawn as a
  graphic. Still prefer it for short headline/accent strings, not long passages.
- **Motion:** the web flow animation is decorative; if a reduced-motion guard is required, gate it at the app
  level (the component's keyframe has no `prefers-reduced-motion` rule of its own).

## 8. Usage rules — Do / Don't

**Do**
- Use `GradientText` for short display/accent strings (headlines, wordmark, hero numbers).
- Pick `gradient` to match context: `flux` for brand energy, `cta` to echo the primary button, `violet` for calm.
- On web pick the right `as` for semantics; on native set typography via `style`.
- Pass **plain string text** so it renders identically on both platforms.

**Don't**
- ✗ Don't pass non-string children on native — they render transparent.
- ✗ Don't use it for body/long text (perf on native: every string re-measures; legibility suffers).
- ✗ Don't hardcode the spectrum hex in app code — use `gradient` (the stops live in tokens/CSS).
- ✗ Don't rely on the flow animation being present on native (it's static).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled `background-clip` span or a one-off SVG gradient text re-creates this and will
  drift from the canonical spectrum stops — import `GradientText`.
- **New need → add to BOTH platforms.** A new `gradient` value must be added to the union + the CSS classes +
  the native `gradients` token map (same name) — never a local variant.
- **Tokens only.** The spectrum stops are the `--lime/--mint/--cyan/--accent/--magenta` tokens (web CSS) and
  `gradients.*` (native); don't introduce off-palette hex.
- **Parity gate.** Before shipping, compare the web phone-width and native renders — same stops, same direction,
  same text — and accept that the animated flow is web-only.
