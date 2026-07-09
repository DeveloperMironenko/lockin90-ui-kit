# SDD — `SectionDivider`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/SectionDivider.tsx` · `packages/ui-native/src/components/SectionDivider.tsx` ·
> web CSS `packages/ui/src/styles/components/sectiondivider.css` (`.lk-section-divider*`).
> **Exports:** `SectionDivider`, type `SectionDividerProps`.
> **Status:** Shipped. **Parity:** ✅ identical — same API & visuals; the eyebrow label + right-fading rule is implemented on BOTH platforms.
> **Stories:** `packages/ui/src/stories/SectionDivider.stories.tsx` · `packages/ui-native/src/stories/SectionDivider.stories.tsx`.

---

## 1. Overview

**SectionDivider** — an **eyebrow label followed by a hairline that fades to the right**, for separating page sections (e.g. `EXPLAINABILITY ————————`). Mirrors the design's `.section-label` (an `Eyebrow` + a fading `.ln`). It composes `Eyebrow` for the label and draws the rule as a horizontal gradient from `--border-2` → transparent.

Distinct from `Divider` (a plain hairline with no label) — use `SectionDivider` when a section needs a titled break, `Divider` for a bare separator.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `label` | `ReactNode` | — (required) | ✓ | ✓ | the section label; rendered inside `Eyebrow` (mono, uppercase, letter-spaced) |
| `className` | `string` | — | ✓ | — | web only — merged onto the wrapper |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only — margins/spacing (consumer owns spacing) |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web) | — | ✓ | — | spreads to the wrapper `<div>` |

- **Web:** a `<div className="lk-section-divider">` containing `<Eyebrow className="lk-section-divider-label">{label}</Eyebrow>` + a `<span className="lk-section-divider-line" aria-hidden>`.
- **Native:** a `<View>` (flex row, `alignItems: center`, `gap 12`) containing `<Eyebrow>{label}</Eyebrow>` + an `expo-linear-gradient` `LinearGradient` rule (`colors.border2 → transparent`, `start {0,0}` → `end {1,0}`). No `...rest`/`className`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Layout | `display:flex; align-items:center; gap:12px` | `flexDirection:row; alignItems:center; gap:12` |
| Label | `Eyebrow` (`--font-mono`, uppercase, `letter-spacing`), `white-space:nowrap` | `Eyebrow` (`fonts.mono`, uppercase), `flexShrink:0` |
| Rule | `.lk-section-divider-line` — `flex:1; height:1px; min-width:24px; background: linear-gradient(90deg, var(--border-2), transparent)` | `LinearGradient` `[colors.border2, 'transparent']` — `flex:1; height:1; minWidth:24`; `start {0,0}`→`end {1,0}` |

- The rule fades **left→right**: solid `--border-2` where it meets the label, fading to transparent at the far edge — matching the web `linear-gradient(90deg, var(--border-2), transparent)`.
- Spacing (margins between sections) is the consumer's job on both platforms.

## 4. States

`SectionDivider` is **static** — no interactive states (no hover, press, focus, disabled, loading). Only the `label` content varies.

| State | Web | Native |
| --- | --- | --- |
| Default | eyebrow + right-fading rule | eyebrow + right-fading `LinearGradient` rule |

## 5. Web ↔ native parity

**Verdict: ✅ identical.** Same composition (`Eyebrow` + a `flex:1` fading rule), same `gap 12`, same `min-width 24` on the rule, same `--border-2 → transparent` left→right fade. Differences are substrate only:

- **Substrate:** web `<div>` + CSS `linear-gradient` background vs native `View` + `expo-linear-gradient`. No visual difference.
- **Spread:** web takes `...rest`/`className`; native takes `style` for spacing. Both leave section margins to the consumer.

There is **no capability gap**.

## 6. Composition & usage

- **Composes:** `Eyebrow` (the label) + (web) a CSS-gradient `<span>` / (native) `LinearGradient`.
- **Used for:** titled section breaks on a page/screen (e.g. `TODAY`, `THIS WEEK`, `EXPLAINABILITY`).
- **vs siblings:** `Divider` for a bare hairline (no label); `SectionDivider` when the break needs a heading.

```tsx
// web
<SectionDivider label="Explainability" />

// native
<SectionDivider label="Today" />
<SectionDivider label="This week" style={{ marginTop: 8 }} />
```

## 7. Accessibility

- **Web:** the rule `<span>` is `aria-hidden` (decorative); the label is read as normal text.
- **Native:** the `LinearGradient` rule carries no accessibility role (decorative); the `Eyebrow` label reads as text.
- **Contrast:** the label uses `Eyebrow`'s `--text-faint`; the fading rule is decoration (exempt from text-contrast minimums).

## 8. Usage rules — Do / Don't

**Do**
- Use `SectionDivider` for a titled section break; pass a short label.
- Add spacing via the consumer's layout (`margin` / `style`).

**Don't**
- ✗ Don't hand-roll an eyebrow + hairline — use `SectionDivider`.
- ✗ Don't hardcode `--border-2` / `rgba(...)` — the fade comes from `@lockin90/tokens`.
- ✗ Don't use `SectionDivider` where a bare rule is wanted — use `Divider`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A local `Eyebrow` + 1px `View`/`<span>` with a literal color is a **tokens + parity violation** — it drifts on the next token rename.
- **New need → add to BOTH platforms.** If a variant is needed (e.g. a left/center label or a two-sided fade), add a prop to `SectionDivider` on web AND native with the same name + tokens — never a one-off.
- **Tokens only.** Label via `Eyebrow`, rule via `--border-2` / `colors.border2`; never a literal.
- **Parity gate.** The eyebrow + right-fading rule render identically at phone width and on native — confirm before shipping a shared screen.
