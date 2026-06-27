# SDD — `Section` (+ `SectionHeader`)

> **Package:** `@lockin90/ui/marketing` — web-only marketing primitive (Aurora marketing site).
> **Import as:** `import { Section, SectionHeader } from '@lockin90/ui/marketing'`.
> **Source:** `packages/ui/src/marketing/Section/index.tsx` · CSS `packages/ui/src/marketing/Section/styles.css` (`.lk-mk-section*`, folded into `dist/styles.css` by `tsup.config.ts`).
> **Exports:** `Section`, type `SectionProps`, `SectionHeader`, type `SectionHeaderProps`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (marketing) — no native counterpart by design.
> **Stories:** none — rendered live on the marketing site (`lockin90-marketing`).

---

## 1. Overview

The two page-composition primitives for the marketing surface:

- **`Section`** — a `<section>` that owns **vertical rhythm** (top/bottom padding) + an **anchor-aware scroll offset**, wrapping a `Container` so its children are automatically centered + guttered. It is the unit every marketing page is built from (stack of `Section`s).
- **`SectionHeader`** — the standard **eyebrow + gradient title + subtitle** block that opens a section. Composed from marketing `Typography` (`Eyebrow`, `Heading`, `Body`) so the type scale is consistent across every page.

They exist so pages never hand-tune `padding-block` per section or re-assemble the eyebrow/title/subtitle stack — both are encoded here once.

## 2. API contract

### `Section`

| Prop | Type | Default | Web | Notes |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — (required) | ✓ | section content (placed inside the inner `Container`) |
| `id` | `string` | — | ✓ | anchor id; pairs with the `scroll-margin-top` offset |
| `spacing` | `'default' \| 'tight' \| 'loose'` | `'default'` | ✓ | vertical padding scale (§3) |
| `containerSize` | `'default' \| 'prose' \| 'wide'` | `'default'` | ✓ | forwarded to the inner `Container size` |
| `className` | `string` | — | ✓ | appended via `cn(...)` |

- Renders `<section id={id} class="lk-mk-section …"><Container size={containerSize}>{children}</Container></section>`.
- No `forwardRef`, no `...rest` spread — only the listed props are forwarded.

### `SectionHeader`

| Prop | Type | Default | Web | Notes |
| --- | --- | --- | --- | --- |
| `title` | `ReactNode` | — (required) | ✓ | rendered via `<Heading as="h2" size="title">` (gradient text) |
| `eyebrow` | `string` | — | ✓ | optional — rendered via `<Eyebrow color="accent">` |
| `subtitle` | `ReactNode` | — | ✓ | optional — rendered via `<Body size="lg" color="secondary">` |
| `align` | `'center' \| 'left'` | `'center'` | ✓ | center clamps to `max-width: 42rem` + centers; left is start-aligned |
| `className` | `string` | — | ✓ | appended via `cn(...)` |

## 3. Visual spec (tokens — never hardcode)

**`Section`** — layout-only; **raw px** vertical rhythm (no spacing token), with a responsive step at ≥640px:

| `spacing` | Class | Base `padding-block` | ≥640px |
| --- | --- | --- | --- |
| `default` | `.lk-mk-section-default` | `80px` | `112px` |
| `tight` | `.lk-mk-section-tight` | `56px` | `80px` |
| `loose` | `.lk-mk-section-loose` | `96px` | `144px` |

- `.lk-mk-section` sets `scroll-margin-top: 96px` so an anchored section clears a sticky header when scrolled to via its `id`.

**`SectionHeader`** — flex column, `gap: 16px`:

| Aspect | Value |
| --- | --- |
| `center` | `align-items: center`, `text-align: center`, `margin-inline: auto`, `max-width: 42rem` |
| `left` | `align-items: flex-start`, `text-align: left` |

Colors/typography are inherited from the composed `Typography` parts — `Eyebrow` (`--font-mono`, `--text-dim`, accent tint), `Heading` (`--font-display` + `.lk-gradient-text` animated spectrum), `Body` (`--text-dim`). This file emits **no** color/type itself.

## 4. States

Both are **static** — no hover / focus / pressed / disabled / loading states. `Section`'s only variation is the three `spacing` presets + the ≥640px breakpoint; `SectionHeader`'s is the `center`/`left` alignment and the presence/absence of `eyebrow`/`subtitle`. The only dynamic behavior is the `scroll-margin-top` offset when the browser scrolls to `#id`.

## 5. Platform & relationship to root kit

**🖥️ web-only (marketing).** Marketing is web-only (Aurora) — **no native counterpart**, no parity obligation. Neither `Section` nor `SectionHeader` shares a name with a root `@lockin90/ui` primitive, so there's nothing to confuse them with. App shells in the root kit handle their own spacing/layout; page-level vertical rhythm + the eyebrow/title/subtitle header block are marketing-only concerns owned here.

## 6. Composition & usage

- **`Section` composes:** `Container` (its inner wrapper).
- **`SectionHeader` composes:** marketing `Typography` — `Eyebrow`, `Heading`, `Body`.
- **Typical page:** a stack of `Section`s, each opening with a `SectionHeader`, then a grid of `Card`/`Stat`/feature blocks.
- **Anchored nav:** give a `Section` an `id` and link `#id` from the nav; `scroll-margin-top` keeps it clear of the sticky header.

```tsx
<Section id="features" spacing="loose" containerSize="wide">
  <SectionHeader
    eyebrow="Why LockIn90"
    title="Recovery, quantified"
    subtitle="Every signal your body sends, turned into one daily readiness score."
  />
  <div className="feature-grid">
    <Card hover>…</Card>
    <Card hover>…</Card>
  </div>
</Section>
```

## 7. Accessibility

- `Section` renders a real `<section>` landmark; pass a descriptive heading inside (the `SectionHeader`'s `<h2>`) so the landmark is named for screen readers.
- `SectionHeader`'s `title` always renders an `<h2>` (`Heading as="h2"`) — keep the document outline sane (one `<h1>` per page in the hero, `<h2>` per section). Override `as` on the underlying `Heading` only if you compose it directly.
- `scroll-margin-top` ensures keyboard/anchor navigation lands the section below the sticky header, not hidden under it.
- Both are non-interactive — no roles/aria of their own.

## 8. Usage rules — Do / Don't

**Do**
- Build every marketing page as a stack of `Section`s; open each with a `SectionHeader`.
- Use `spacing="tight"` for dense back-to-back sections, `loose` for hero-adjacent breathing room.
- Give navigable sections an `id` so the `scroll-margin-top` offset applies.
- Use `containerSize="prose"` on long-form text sections, `wide` on full-width grids.

**Don't**
- ✗ Don't hardcode `padding: 112px 0` on a `<section>` — use `Section spacing`.
- ✗ Don't nest a `Container` inside a `Section` (it already wraps one) — double gutters.
- ✗ Don't hand-build the eyebrow/title/subtitle stack from raw `<p>`/`<h2>` — use `SectionHeader`.
- ✗ Don't put multiple `<h1>`s by overriding header `as` — `SectionHeader` is `<h2>` for a reason.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke `<section>` re-creating the rhythm + inner `Container` (or a hand-assembled header stack) drifts from the page system — the `80/112`, `56/80`, `96/144` rhythm and the `42rem` header clamp live here once. Import `Section`/`SectionHeader`.
- **New rhythm need → add a `spacing` preset.** If a section needs padding outside `default/tight/loose`, add a named preset to the `SPACING` map + `styles.css` — never a magic `className` override at the call site.
- **Layout/composition-only.** `Section` stays color/type-free; visual content belongs on its children. `SectionHeader` must keep delegating type to `Typography` — don't inline a different font/size.
- **Header = Typography.** The eyebrow/title/subtitle must come from the marketing `Typography` parts so the type scale stays consistent — don't swap in raw text nodes with ad-hoc styles.
