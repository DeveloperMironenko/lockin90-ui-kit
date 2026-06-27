# SDD — `Eyebrow`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Eyebrow.tsx` · `packages/ui-native/src/components/Eyebrow.tsx` ·
> web CSS `packages/ui/src/styles/components/eyebrow.css` (`.lk-eyebrow`).
> **Exports:** `Eyebrow`, type `EyebrowProps`.
> **Status:** Shipped. **Parity:** 🟡 identical visuals; web adds a polymorphic `as` prop (no native equivalent — native always renders `<Text>`).
> **Stories:** `packages/ui/src/stories/Eyebrow.stories.tsx` · `packages/ui-native/src/stories/Eyebrow.stories.tsx`.

---

## 1. Overview

The **overline label** — a tiny mono, uppercase, letter-spaced caption that sits above section headers, card titles, and KPI groups ("TARGETS", "Generated · 6"). The smallest presentational primitive in the kit; it exists so every overline shares one type treatment instead of each surface hand-styling a `<span>` / `<Text>`.

It is content-only — the consumer supplies the text via `children`. Web can render it as any element (default `<span>`); native always renders a `<Text>`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `as` | `ElementType` | `'span'` | ✓ | — | **web only** — element to render as (e.g. `'h2'` for a real section overline) |
| `children` | `ReactNode` | — | ✓ | ✓ | the overline text |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<TextStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLElement>` (web) / `TextProps` (native) | — | ✓ | ✓ | `id`, `numberOfLines`, etc. |

- **Web:** function component (no ref); spreads `HTMLAttributes` onto the chosen `Tag`. `EyebrowProps` extends `HTMLAttributes<HTMLElement>` + the `as` prop.
- **Native:** function component; `EyebrowProps = TextProps`. Always a `<Text>` — there is no `as` (no polymorphic element in RN).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Display | `inline-block` | `<Text>` (inline) |
| Font family | `--font-mono` | `fonts.mono` |
| Font size | `10px` | `10` |
| Font weight | `500` | `'500'` |
| Transform | `text-transform: uppercase` | `textTransform: 'uppercase'` |
| Letter-spacing | `0.2em` (= 2px @ 10px) | `2` |
| Line height | `1` | (default) |
| Color | `--text-faint` | `colors.textFaint` |

Web `0.2em` and native `2` resolve to the same 2px tracking at the 10px size. No background, border, padding, or motion — it's pure typography.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-eyebrow` mono overline | base `<Text>` overline |
| Hover / pressed / focus | none — presentational | none — presentational |
| Disabled | n/a | n/a |

`Eyebrow` is non-interactive by design; it carries no state.

## 5. Web ↔ native parity

**Verdict: 🟡 identical visuals, one web-only prop.** Same font (`--font-mono` / `fonts.mono`), same 10px / 500 / uppercase / 2px-tracking / `--text-faint` treatment on both platforms. The only difference:

- **`as` (web only):** web is polymorphic (`<Eyebrow as="h2">` renders a real heading element for document semantics); React Native has no element-type concept, so native always renders a `<Text>`. App code reads 1:1 for the common case (`<Eyebrow>TARGETS</Eyebrow>` ↔ `<Eyebrow>TARGETS</Eyebrow>`); only the semantic-element choice is web-specific.

No capability gap blocks use — the overline is visually equivalent on both platforms.

## 6. Composition & usage

- **Composes:** nothing — leaf primitive.
- **Used by:** section headers, card title overlines, KPI-group captions, settings group labels, empty-state kickers — anywhere a small uppercase caption introduces a block. Often paired above a heading or beside a `Chip`.

```tsx
// web
<Eyebrow>Targets</Eyebrow>
<Eyebrow as="h2">This week</Eyebrow>   {/* real heading element */}

// native
<Eyebrow>Targets</Eyebrow>
```

## 7. Accessibility

- **Web:** defaults to a presentational `<span>`. When the overline *is* the section heading, pass `as="h2"`/`"h3"` so it participates in the document outline; otherwise leave it a span so it isn't announced as a heading.
- **Native:** a `<Text>` — read inline by SRs. Pass `accessibilityRole="header"` via rest props if it functions as a section heading.
- **Contrast:** `--text-faint` is intentionally low-emphasis; reserve `Eyebrow` for supporting captions, not primary content that must meet body-text contrast.

## 8. Usage rules — Do / Don't

**Do**
- Use `Eyebrow` for every small uppercase overline/caption above a section or card.
- Use `as="h2"`/`"h3"` (web) when the overline is the real section heading.
- Keep the text short — a kicker/label, not a sentence.

**Don't**
- ✗ Don't hand-roll an overline (`font-family: mono; text-transform: uppercase; letter-spacing`) — import `Eyebrow`.
- ✗ Don't hardcode the 10px size, 2px tracking, or `--text-faint` color — tokens only.
- ✗ Don't use `Eyebrow` for body or primary text — it's a low-emphasis caption.
- ✗ Don't expect `as` on native (web-only); compose a heading separately if needed.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A "custom overline" re-creating the mono/uppercase/tracking treatment is a parity violation — it will drift from the type scale and the Aurora Flux token renames will break it. Import `Eyebrow`.
- **New need → add to BOTH platforms.** A new size or a tinted variant is a prop added on web *and* native (same name, same tokens) — never a one-off styled span/text.
- **Tokens only.** Font, size, weight, and color come from `@lockin90/tokens`; never inline even if it matches today.
- **Parity gate.** Before shipping, confirm the web phone-width and native overline read identically (same size, tracking, color); the only allowed divergence is the web `as` element choice.
