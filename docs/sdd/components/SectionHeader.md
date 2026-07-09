# SDD — `SectionHeader`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/SectionHeader.tsx` · `packages/ui-native/src/components/SectionHeader.tsx` ·
> web CSS `packages/ui/src/styles/components/sectionheader.css` (`.lk-section-header`, `.lk-section-title`).
> **Exports:** `SectionHeader`, type `SectionHeaderProps`.
> **Status:** Shipped. **Parity:** 🟡 same API + look; native adds a `titleSize` prop (web title is a fixed
> 26px CSS class, overridable via `className`), web renders a semantic `<h2>`.
> **Stories:** none dedicated on either platform (the `Eyebrow` stories' hand-composed "SectionHeader" story
> predates this primitive).

---

## 1. Overview

The mockups' **`.section-head`**: a mono `Eyebrow` overline above a display **title**, gradient-filled by
default (`GradientText`) — the standard header for every screen section ("TODAY · THU JUN 11" over
"Energy"). It exists so screens compose **one primitive** instead of hand-stacking `Eyebrow` +
`GradientText` per section (the pre-primitive pattern, now banned). Pass `gradient={false}` for screens
whose title reads as solid `--text` (`.disp` in the mockups).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `eyebrow` | `string` | — | ✓ | ✓ | mono uppercase overline; omit for a bare title |
| `title` | `string` | _required_ | ✓ | ✓ | the display title |
| `gradient` | `'flux' \| 'cta' \| 'violet' \| false` | `'flux'` | ✓ | ✓ | gradient-fill the title via `GradientText`; `false` → plain solid title |
| `titleSize` | `number` | `26` | — | ✓ | **native only** — title font size (web is fixed 26px in CSS; override with `className`) |
| `className` | `string` | — | ✓ | — | web only, merged onto the root `<div>` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, merged onto the root `View` |
| _rest_ | `HTMLAttributes<HTMLElement>` (web) / `ViewProps` (native) | — | ✓ | ✓ | container attrs |

- **Web:** root `<div class="lk-section-header">`; title renders as
  `<GradientText as="h2" className="lk-section-title">` when `gradient` is truthy, else a plain
  `<h2 class="lk-section-title">`. Plain function component (no `forwardRef`).
- **Native:** root `View`; title is `GradientText` (gradient) or `Text` (plain), both with
  `fonts.display 700` at `titleSize`.

## 3. Visual spec (tokens — never hardcode)

| Element | Web (`.lk-section-*`) | Native (`StyleSheet`) |
| --- | --- | --- |
| Stack | column, `gap: 3px` | `gap: 3` |
| Eyebrow | kit `Eyebrow` (mono 10px 500 uppercase, `--text-faint`) | kit `Eyebrow` (same tokens) |
| Title font | `--font-display` 700 **26px** | `fonts.display` `'700'` at `titleSize` (default 26) |
| Title tracking | `letter-spacing: -0.02em` (= −0.52px @26px) | `letterSpacing: -0.5` |
| Title line | `line-height: 1.1`, `margin: 0` | RN default line height |
| Title color (plain) | `--text` | `colors.text` |
| Title fill (gradient) | `GradientText` `--grad-flux/cta/violet` clip | `GradientText` `gradients.flux/cta/violet` |

The two trackings are the same value at the 26px default (−0.02em ≡ −0.52px); native's is fixed −0.5px, so
it drifts slightly if you change `titleSize`.

## 4. States

Static, presentational — no hover/focus/disabled.

| Variant | Render |
| --- | --- |
| Default | Eyebrow + flux-gradient title |
| `gradient="cta"` / `"violet"` | alternate spectrum fills |
| `gradient={false}` | solid `--text` / `colors.text` title |
| `eyebrow` omitted | bare title, no overline |

## 5. Web ↔ native parity

**Verdict: 🟡 — same API + composition, two platform-shaped deltas.** Both compose the same kit
`Eyebrow` + `GradientText`, same 3px stack gap, same display-700-26 title, same `gradient` union +
default. Differences:

- **`titleSize` is native-only.** Web's title size lives in `.lk-section-title` (26px); resize via
  `className` override. Same visual capability, different mechanism.
- **Semantics:** web emits a real `<h2>` (both gradient and plain paths); native is a styled `Text` with no
  heading role (see §7).
- **Tracking unit:** `-0.02em` (web, scales) vs `-0.5px` (native, fixed) — identical at the default size.

Gradient-title motion (web CSS flow vs native SVG animation, `still`) is `GradientText`'s contract — see
`GradientText.md`. No capability gap blocks use.

## 6. Composition & usage

- **Composes from:** `Eyebrow`, `GradientText` — nothing else.
- **Used by:** the top of every screen section (dashboard "Energy", journal, settings groups, auth panels).

```tsx
// web — the standard section head
<SectionHeader eyebrow="Today · Thu Jun 11" title="Energy" />

// web — solid title, no overline
<SectionHeader title="Account" gradient={false} />

// native — identical, plus the native-only size knob
<SectionHeader eyebrow="This week" title="Trends" gradient="cta" titleSize={22} />
```

## 7. Accessibility

- **Web:** the title is a real `<h2>` — it lands in the document outline and heading navigation. Keep one
  `SectionHeader` per section and don't skip heading levels around it. The eyebrow is a plain `<span>`
  (announced as text before the heading).
- **Native:** the title is `Text`/`GradientText` with **no `accessibilityRole="header"` set by the
  component** — pass `accessibilityRole="header"` via rest on the container (or wrap) when screen-reader
  section navigation matters.
- **Contrast:** solid title is `--text` on void (passes); gradient fills are the same spectrum ramps used by
  `GradientText` — keep gradient titles ≥20px so the lighter stops stay readable.

## 8. Usage rules — Do / Don't

**Do**
- Use it for every section head — eyebrow text in the "CONTEXT · DETAIL" mono style the mockups use.
- Use `gradient={false}` where the design shows a solid `.disp` title; pick `cta`/`violet` only where the
  mockup does.
- Resize natively with `titleSize`, on web with a `className` font-size override — same rendered size on both.

**Don't**
- ✗ Don't hand-stack `Eyebrow` + `GradientText`/`Text` for a section head — that's this primitive.
- ✗ Don't pass rich nodes — `eyebrow`/`title` are `string`s by contract on both platforms.
- ✗ Don't hardcode the title font/size/tracking or eyebrow style — they're the component's tokens.
- ✗ Don't use it for page-level hero headlines — that's `GradientText as="h1"` territory.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A screen-local `<div><Eyebrow/><GradientText/></div>` (or `View` equivalent) is exactly
  the duplication this primitive retired — import `SectionHeader`.
- **New need → both platforms.** A new slot (trailing action, subtitle) ships to web **and** native with the
  same prop name — never a one-off fork; if web needs a size prop, add `titleSize` there rather than
  diverging further.
- **Tokens only.** Title/eyebrow type and gradient fills come from `@lockin90/tokens` via the composed kit
  primitives.
- **Parity gate.** Before shipping, confirm web phone-width ≡ native — same eyebrow text, same title, same
  gradient choice, same rendered size.
