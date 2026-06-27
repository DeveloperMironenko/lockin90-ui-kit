# SDD — `Typography` (`Heading` · `Body` · `Lead` · `Eyebrow` · `Mono`)

> **Package:** `@lockin90/ui/marketing` — web-only marketing primitive (Aurora marketing site).
> **Import as:** `import { Heading, Body, Lead, Eyebrow, Mono } from '@lockin90/ui/marketing'`.
> **Source:** `packages/ui/src/marketing/Typography/index.tsx` · CSS `packages/ui/src/marketing/Typography/styles.css` (`.lk-mk-h-*` `.lk-mk-body*` `.lk-mk-lead` `.lk-mk-c-*`) on top of base `.lk-display` / `.lk-mono` / `.lk-eyebrow` / `.lk-gradient-text` (`styles/base.css`), folded into `dist/styles.css` by `tsup.config.ts`.
> **Exports:** `Heading`, `Body`, `Lead`, `Eyebrow`, `Mono`, type `TypographyColor`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (marketing) — no native counterpart by design.
> **Stories:** none — rendered live on the marketing site (`lockin90-marketing`).

---

## 1. Overview

The **marketing type scale** — five text primitives that every marketing surface composes from, so headings, body copy, and overlines stay on one consistent ramp. The folder exports five components plus the shared `TypographyColor` union:

- **`Heading`** — display headline in the gradient display type (`.lk-display .lk-gradient-text`). Three scale presets (`display` / `title` / `sub`) and a chooseable tag (`h1`/`h2`/`h3`). The animated spectrum gradient is clipped to the glyphs.
- **`Lead`** — the oversized intro paragraph that follows a hero headline. One fixed style; no variants.
- **`Body`** — standard paragraph in the UI font, three sizes (`sm`/`base`/`lg`) and the shared color set.
- **`Eyebrow`** — mono, uppercase, letter-tracked overline that sits **above** a heading. Three colors.
- **`Mono`** — inline tabular-mono run for stats, units, code-ish values. Full color set.

A shared `COLOR` map turns the `color` prop into a `.lk-mk-c-*` helper class (primary/white → `--text`, secondary → `--text-dim`, muted → `--text-faint`, accent → `--accent`). `Heading` ignores color (its gradient clip forces `transparent`).

## 2. API contract

**`Heading`**

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | the headline text |
| `as` | `'h1' \| 'h2' \| 'h3'` | `'h2'` | semantic tag rendered |
| `size` | `'display' \| 'title' \| 'sub'` | `'title'` | scale preset (independent of `as`) |
| `className` | `string` | — | merged after base classes |

**`Body`**

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | paragraph content (renders `<p>`) |
| `size` | `'sm' \| 'base' \| 'lg'` | `'base'` | 14 / 16 / 18px |
| `color` | `TypographyColor` | `'secondary'` | full color union |
| `className` | `string` | — | — |

**`Lead`** — `children: ReactNode`, `className?: string`. No size/color props (fixed style).

**`Eyebrow`** — `children: ReactNode`, `color?: 'secondary' | 'accent' | 'muted'` (default `'secondary'`), `className?`. Renders `<div>`.

**`Mono`** — `children: ReactNode`, `color?: TypographyColor` (default `'muted'`), `className?`. Renders inline `<span>`.

- `TypographyColor = 'primary' | 'secondary' | 'muted' | 'accent' | 'white'` (exported). `Eyebrow` accepts only a **subset** (`secondary`/`accent`/`muted`).
- All are plain function components — **no `forwardRef`, no `...rest`** spread; only the listed props apply (`className` is the sole escape hatch).

## 3. Visual spec (tokens — never hardcode)

**Heading** — `.lk-display` (`--font-display`, weight 700, `letter-spacing -0.02em`) + `.lk-gradient-text` (animated mirrored spectrum, `background-clip: text`, `color: transparent`, `lk-flow-text` 9s linear loop) + size:

| `size` | mobile | ≥640px | ≥1024px | line-height |
| --- | --- | --- | --- | --- |
| `display` | 44px | 60px | 72px | 0.95 |
| `title` | 34px | 48px | — | 0.98 |
| `sub` | 24px | 30px | — | 1.1 |

**Body** — `.lk-mk-body`: `--font-ui`, `margin: 0`, `line-height: 1.6`. Sizes: `sm` 14px · `base` 16px · `lg` 18px.

**Lead** — `.lk-mk-lead`: `--font-ui`, `margin: 0`, `color: --text-dim`, `line-height: 1.6`, `max-width: 65ch`; `18px` → `20px` at ≥640px.

**Eyebrow** — base `.lk-eyebrow`: `--font-mono`, 11px, weight 500, uppercase, `letter-spacing 0.22em`, `--text-dim` (overridden by the color helper).

**Mono** — base `.lk-mono`: `--font-mono`, `font-feature-settings: "tnum" 1` (tabular numerals).

**Color helpers** (`.lk-mk-c-*`): primary/white → `--text` (`#EEF1F8`) · secondary → `--text-dim` (`#AAB2C6`) · muted → `--text-faint` (`#828B9F`) · accent → `--accent` (`#7C5CFF`). On `Heading` all helpers resolve to `color: transparent` (see §4).

## 4. States

These are static text primitives — no hover/focus/pressed/disabled. The only variance is **size** and **color**:

| Concern | Behavior |
| --- | --- |
| Heading color | **No-op by design.** The gradient is clipped to the glyphs; a stacked `.lk-mk-c-*` on `.lk-display.lk-gradient-text` is explicitly reset to `color: transparent`. Color props apply only to Body/Lead/Eyebrow/Mono. |
| Heading motion | Web-only `lk-flow-text` 9s gradient drift across the glyphs (from `.lk-gradient-text`). |
| Reduced motion | The gradient animation honors the global reduced-motion handling in the kit styles. |
| Responsive | Heading + Lead step up at `min-width: 640px` (and Heading `display` again at `1024px`) via media queries — no JS. |

## 5. Platform & relationship to root kit

**Web-only by design** — no `@lockin90/ui-native` counterpart for the marketing scale.

- **`Eyebrow` vs root `Eyebrow`:** the root kit exports its **own** cross-platform `Eyebrow` (`packages/ui/src/components/Eyebrow.tsx`) that renders a chooseable `as` tag, spreads `...rest`, and has **no `color` prop**. The marketing `Eyebrow` is a *different* component (same base `.lk-eyebrow` class) with a fixed `<div>` and a 3-value `color` prop. Importing from `@lockin90/ui/marketing` vs `@lockin90/ui` gets you different APIs — keep them straight.
- **`Heading` vs root `GradientText`:** the root kit ships `GradientText` for clipped-gradient text; marketing `Heading` rolls its own via `.lk-display .lk-gradient-text` + the marketing size scale and a semantic `as` tag. They share the same base gradient class but are not the same component.
- **`Mono` / `Body` / `Lead`** have **no** root export (`Mono`/`Body`/`Lead` were removed from the root kit) — they exist only here, scoped to marketing.
- All five build on the **shared base classes** (`.lk-display`, `.lk-mono`, `.lk-eyebrow`, `.lk-gradient-text`) in `styles/base.css`, so the marketing scale stays visually consistent with the root kit's typographic primitives.

## 6. Composition & usage

- **Composes from:** base typographic classes + `cn`. No other primitives.
- **Composes into:** `Section`/`SectionHeader`, feature cards (with `IconBadge`), hero blocks, FAQ — virtually every marketing surface.
- **Canonical hero stack:** `Eyebrow` → `Heading size="display"` → `Lead`.

```tsx
// hero header
<Eyebrow color="accent">The science</Eyebrow>
<Heading as="h1" size="display">Recover smarter, every day</Heading>
<Lead>Your readiness, modeled from sleep, strain, and recovery — in one number.</Lead>

// feature copy + inline stat
<Heading as="h3" size="sub">Built on evidence</Heading>
<Body size="lg">Every score is traceable to the inputs behind it.</Body>
<p><Mono color="accent">+12%</Mono> <Body size="sm">vs. last week</Body></p>
```

## 7. Accessibility

- **`Heading` renders a real `h1`/`h2`/`h3`** — pick `as` for the **document outline**, `size` purely for visual scale; never skip heading levels to get a size. The gradient text remains selectable, real text (clip, not an image), so it stays screen-reader and zoom friendly.
- `Body`/`Lead` render `<p>`; `Mono` renders inline `<span>`; `Eyebrow` renders `<div>` (decorative overline — keep it adjacent to the heading it labels, not as a substitute for the heading).
- Color tokens are designed for contrast on the void background; `muted` (`--text-faint`) is for de-emphasized supporting text — don't use it for primary body copy.
- The 9s heading gradient animation is purely cosmetic and respects reduced-motion.

## 8. Usage rules — Do / Don't

**Do**
- Use `Heading` for **all** marketing headlines; choose `as` for semantics and `size` for scale separately.
- Use `Lead` for the single intro paragraph under a hero headline.
- Use `Body` for paragraphs (pick `size`), `Eyebrow` for overlines, `Mono` for stats/units.
- Set `color` on `Body`/`Mono`/`Eyebrow` via the prop, not via `className` color overrides.

**Don't**
- ✗ Don't pass `color` to `Heading` expecting a solid color — it's a no-op (gradient is clipped). Use `Body`/`Lead` if you need flat-colored text.
- ✗ Don't hardcode font sizes, families, or text colors — they come from the marketing scale + tokens.
- ✗ Don't choose `as` just to get a font size (breaks heading order); use `size`.
- ✗ Don't import the **root** `Eyebrow` when you want the marketing one (different API) — match the subpath.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A raw `<h2 className="...">` with a hand-built gradient, or a `<p>` with bespoke font sizes, re-creates this scale and will drift — import the primitive.
- **New size/color → extend the scale.** If marketing needs a fourth heading size or a new text color, add it to the `HEADING_SIZE`/`COLOR` maps + `.lk-mk-*` CSS with tokens — never a one-off inline style.
- **Tokens only.** Families (`--font-display/ui/mono`), the spectrum gradient, and the `--text*`/`--accent` colors must come from the kit; hardcoded hexes/px are bugs even when they match today.
- **Heading semantics gate.** Before shipping, confirm the heading **level order** (`as`) is correct independent of visual `size` — a screen with `h1→h3→h2` is a bug regardless of how it looks.
