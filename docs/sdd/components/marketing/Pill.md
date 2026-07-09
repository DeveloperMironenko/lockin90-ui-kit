# SDD — `Pill` (marketing)

> **Package:** `@lockin90/ui/marketing` — web-only marketing primitive (Aurora marketing site).
> **Import as:** `import { Pill } from '@lockin90/ui/marketing'`.
> **Source:** `packages/ui/src/marketing/Pill/index.tsx`. **No own CSS anymore** — `Pill/styles.css` was
> **deleted**; `Pill` is now a thin wrapper over the root-kit `packages/ui/src/components/Chip.tsx`
> (web CSS `packages/ui/src/styles/primitives.css`, `.lk-chip*`).
> **Exports:** `Pill`, type `PillProps` (unchanged).
> **Status:** Shipped. **Parity:** 🖥️ web-only (marketing) — no native counterpart by design.
> **Stories:** none — rendered live on the marketing site (`lockin90-marketing`).

---

## 1. Overview

A **small Aurora label pill** for eyebrow-style tags on the marketing surface — "New", "Beta", a category tag, a "Live" status chip. Mono uppercase-ish micro-label inside a fully-rounded glass capsule. Two tones + an optional glow dot:

- `default` — neutral glass capsule, dimmed text. The everyday tag.
- `accent` — violet-tinted (text `#cbbcff`, violet border + fill). For "new / featured / highlighted" tags.
- `dot` (boolean) — prepends a 6px glowing dot in the **current text color**, for a "live / status" feel.

It exists so marketing eyebrows/tags don't get hand-rolled per page — one mono-pill recipe, two tones.

**Now a thin wrapper, not its own component.** `Pill`'s markup + CSS (`.lk-pill`, `.lk-accent`,
`.lk-dot`) were **byte-identical** to the root kit's `.lk-chip` — the marketing team had, in effect,
forked `Chip` under a different class name with the same values. Since there was never an actual
visual difference to preserve, `Pill` now renders `<Chip>` directly and `Pill/styles.css` was deleted
outright. This is an **equivalent shim**: every existing `<Pill>` call site on the marketing site
renders pixel-for-pixel the same as before.

## 2. API contract

| Prop | Type | Default | Web | Notes |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — (required) | ✓ | passed straight through as `Chip`'s label |
| `variant` | `'default' \| 'accent'` | `'default'` | ✓ | mapped to `Chip`'s `tone` — see below |
| `dot` | `boolean` | `false` | ✓ | passed straight through to `Chip`'s leading glow dot |
| `className` | `string` | — | ✓ | passed straight through to `Chip` |

**`variant` → `ChipTone` mapping** (same-name, trivial — unlike `StatusChip`'s remap, both `Pill`
tones happen to share a name with a `ChipTone`):

| `variant` | → `Chip` `tone` |
| --- | --- |
| `'default'` | `'default'` |
| `'accent'` | `'accent'` |

```tsx
export function Pill({ children, variant = 'default', dot = false, className }: PillProps) {
  return (
    <Chip tone={variant === 'accent' ? 'accent' : 'default'} dot={dot} className={className}>
      {children}
    </Chip>
  );
}
```

- Plain function component (no `forwardRef`); delegates entirely to `Chip` at its default `size="md"`.
- No `...rest` spread — `PillProps` is intentionally closed to `children`/`variant`/`dot`/`className`
  (unchanged from before the refactor).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Token / value |
| --- | --- |
| Layout | `inline-flex`, `align-items: center`, `gap: 7px`, `white-space: nowrap` |
| Font | `--font-mono`, `11px`, weight `500`, `letter-spacing: 0.04em` |
| Padding | `5px 11px` |
| Radius | `--r-pill` (999) |
| Border (`default`) | `1px solid --border` |
| Background (`default`) | `--glass` |
| Text (`default`) | `--text-dim` |

**`accent`** overrides to: text `#cbbcff` (a light-violet, raw hex), `border-color: rgba(124,92,255,.4)`, `background: rgba(124,92,255,.1)` (the `--accent` violet `#7C5CFF` at low alpha).

**`dot`**: a `6px` circle, `background: currentColor`, `box-shadow: 0 0 8px currentColor` — so it inherits the pill's text color (dim grey on `default`, violet on `accent`) and glows.

Every value above is **`Chip`'s** — rendered via the `.lk-chip` / `.lk-chip.lk-accent` / `.lk-chip.lk-dot::before` rules in `packages/ui/src/styles/primitives.css` (see `Chip.md` §3). `.lk-pill`/`.lk-accent`/`.lk-dot` no longer exist as selectors; `Pill/styles.css` was deleted in full, not just trimmed. The "marketing-specific tint" framing from before this refactor no longer applies — `#cbbcff` is simply `Chip`'s shared `accent` tone color, not a Pill-local hex.

## 4. States

Pill is **static** — no hover / focus / pressed / disabled / loading states. Its only variation is `variant` (`default`/`accent`) × `dot` (on/off). It is non-interactive and never receives focus.

## 5. Platform & relationship to root kit

**🖥️ web-only (marketing).** Marketing is web-only — no native counterpart, no parity obligation.

There is **no root-kit primitive named `Pill`** — but as of this refactor, `Pill` **is visually `Chip`**
under a marketing-scoped prop surface, not a separate design. (Before, `.lk-pill` had drifted into
existence as a byte-identical hand-copy of `.lk-chip`; this consolidation deleted the duplicate CSS and
made the relationship explicit in code, same as admin's `StatusChip` §5 in its own SDD.) What's
genuinely still separate: the **prop API** — `PillProps` (`variant: 'default' | 'accent'`, required
`children`, no `...rest`) is narrower and differently-named than `ChipProps` (`tone`, optional
`children`, `size`, full HTML attrs spread) — and the **package boundary** — `Pill` ships from
`@lockin90/ui/marketing`, `Chip` from the root `@lockin90/ui`, kept apart so the marketing bundle
doesn't need to import the whole app-kit index. Import `Pill` on the marketing site and `Chip`
(`ChoiceChip`/`DeltaPill`/`Eyebrow` for other shapes) in app screens — not because they look different
anymore, but to keep each surface importing from its own package boundary and prop contract.

## 6. Composition & usage

- **Composes from:** nothing — a leaf `<span>`.
- **Used as:** eyebrow tags above a `SectionHeader`, status chips ("Live", "Beta"), category tags on cards, hero badges.
- **Pairs with:** `Section`/`SectionHeader`, `Card`, marketing `Typography`.

```tsx
// Neutral tag:
<Pill>Changelog</Pill>

// Violet "new" tag with a glowing dot:
<Pill variant="accent" dot>New in 1.4</Pill>

// Status chip in a card header:
<Pill dot>Live</Pill>
```

## 7. Accessibility

- Renders a non-interactive `<span>` — no role, no focus. The dot is a CSS `::before` (decorative), invisible to assistive tech, which is correct.
- Pill text is read inline as normal content; if a pill conveys status that isn't obvious from its text (e.g. a color-only meaning), convey that meaning in the `children` text, not the tone alone.
- Contrast: `default` uses `--text-dim` on `--glass`; `accent` uses `#cbbcff` (`Chip`'s shared accent tone) on the low-alpha violet fill — both chosen to read on the void/gradient background.

## 8. Usage rules — Do / Don't

**Do**
- Use `Pill` for eyebrow tags / status chips on the marketing site.
- Use `accent` for "new / featured" emphasis; reserve it so it stays meaningful.
- Use `dot` for live/status semantics, and put the meaning in the label text too.

**Don't**
- ✗ Don't hand-roll a mono capsule (`border-radius: 999px; font: mono; …`) — import `Pill`.
- ✗ Don't use a marketing `Pill` inside app screens — use the app kit's `Chip`/`Eyebrow` there (§5: same visual now, but a different prop contract and package boundary).
- ✗ Don't make a `Pill` interactive (it's a `<span>` with no role/focus); use a `Button`/`<a>` if it must click.
- ✗ Don't hardcode the violet (`#cbbcff` / `rgba(124,92,255,…)`) at the call site — get it via `variant="accent"`.
- ✗ Don't add CSS under `.lk-pill`/`.lk-accent`/`.lk-dot` — that stylesheet is gone; any new visual belongs on `Chip`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke rounded mono tag re-creating the glass capsule + violet tint + glow dot is a parity hazard — the recipe now lives once, in `Chip` (`Pill` is a thin wrapper, not its own copy). Import `Pill` on marketing surfaces.
- **New tone need → add it to `Chip` first, then `Pill`.** If marketing needs a third tone (e.g. a status green/amber), add the tone to root `Chip`'s `ChipTone` (both platforms, per `Chip.md` §9) **first**, then extend `Pill`'s `variant` union + its inline tone-map to expose it — never a one-off inline-styled span, and never a tone that exists only in `Pill` with no `Chip` counterpart (that would recreate the pre-refactor duplication this consolidation just removed).
- **Tokens only.** The `accent` tone's `#cbbcff` is `Chip`'s shared accent token, not a marketing-local exception anymore — don't sprinkle new raw hexes at call sites; any new color goes on `Chip`.
- **Decorative dot stays decorative.** Don't rely on the dot's color alone to carry meaning — pair it with text.
