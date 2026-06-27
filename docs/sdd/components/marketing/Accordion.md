# SDD — `Accordion` (marketing FAQ) (+ `AccordionItem` data type)

> **Package:** `@lockin90/ui/marketing` — web-only marketing primitive (Aurora marketing site).
> **Import as:** `import { Accordion, type AccordionItem } from '@lockin90/ui/marketing'`.
> **Source:** `packages/ui/src/marketing/Accordion/index.tsx` (`'use client'`) · CSS `packages/ui/src/marketing/Accordion/styles.css` (`.lk-accordion*`, folded into `dist/styles.css` by `tsup.config.ts`).
> **Exports:** `Accordion`, type `AccordionItem`, type `AccordionProps`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (marketing) — no native counterpart by design.
> **Stories:** none — rendered live on the marketing site (`lockin90-marketing`).

---

## 1. Overview

The **single-open FAQ accordion** for the marketing site. It renders a vertical list of question/answer rows separated by Aurora glass hairlines; clicking a row toggles it open and **closes any other** (single-open), and the **first row is open by default**. Each open row rotates an accent `+` into an `×` and grows its answer panel via a CSS grid-rows height animation.

Two exported symbols, of different kinds:

- **`Accordion`** — the rendered component. Stateful (`'use client'`, local `useState`), takes `items` and renders the whole list.
- **`AccordionItem`** — a **plain data interface** (`{ question: string; answer: string }`), *not* a row component. It describes one entry in the `items` array.

It exists so marketing FAQ sections don't each re-implement open/close state, divider rules, and the `+`/`×` indicator.

## 2. API contract

**`Accordion`**

| Prop | Type | Default | Web | Notes |
| --- | --- | --- | --- | --- |
| `items` | `AccordionItem[]` | — (required) | ✓ | the full list of Q/A rows, in order |

**`AccordionItem`** (data type, not a component)

| Field | Type | Notes |
| --- | --- | --- |
| `question` | `string` | row trigger text (the visible question) |
| `answer` | `string` | row panel text (plain string — no rich nodes) |

- `Accordion` is a plain function component — **no `forwardRef`, no `...rest`**, no `className`. Its open-state is **fully internal** (`useState<number | null>(0)`); there is no controlled `value`/`onChange` prop and no way to set which row starts open (always index 0) or to allow multiple-open.
- `answer` is a **`string`**, so it's rendered as plain text inside a `<p>` — no JSX/markdown/links can be passed through this contract.

## 3. Visual spec (tokens — never hardcode)

| Element | Spec |
| --- | --- |
| List (`.lk-accordion`) | top + bottom `1px --border` hairline |
| Row divider | `.lk-accordion-item + .lk-accordion-item` → `1px --border` top border (between rows) |
| Trigger (`.lk-accordion-trigger`) | `flex`, `space-between`, `gap 24px`, `padding 20px 0`, full-width, transparent, `cursor: pointer`, color `--text-dim` → `--text` on hover/open, `transition color 0.25s --ease` |
| Question (`.lk-accordion-q`) | `--font-display`, weight 600, `clamp(17px, 2.2vw, 20px)`, `letter-spacing -0.01em`, line-height 1.25 |
| Indicator (`.lk-accordion-sign`) | `+` glyph, 24px, color `--accent`, `transition transform 0.3s --ease`; `.lk-open` → `rotate(45deg)` (renders as `×`) |
| Panel (`.lk-accordion-panel`) | `display: grid`, `grid-template-rows: 0fr` + `opacity 0`; transitions `grid-template-rows` + `opacity` `0.3s --ease` |
| Panel open (`.lk-open`) | `grid-template-rows: 1fr`, `opacity 1`, `padding-bottom 22px` |
| Panel inner | `.lk-accordion-panel-inner` → `overflow: hidden` (clips during the rows animation) |
| Answer (`.lk-accordion-a`) | `margin 0`, `max-width 62ch`, 15px, line-height 1.65, color `--text-dim` |

- The open/close height uses the **`grid-template-rows: 0fr → 1fr`** technique (no fixed/measured height), so any answer length animates smoothly.

## 4. States

| State | Behavior (web) |
| --- | --- |
| Default | first row (`index 0`) open; all others collapsed |
| Closed row | trigger `--text-dim`; panel `0fr` / `opacity 0`; sign `+` un-rotated |
| Open row | trigger `--text`; panel `1fr` / `opacity 1` / `padding-bottom 22px`; sign rotated `45deg` (×) |
| Hover (trigger) | trigger text → `--text` (same as open), `0.25s --ease` |
| Toggle | click an open row → closes it (`null`); click a closed row → opens it and closes the previously open one (single-open) |
| Focus | the trigger is a real `<button>` — native focus ring + Enter/Space activation |
| Reduced motion | the grid-rows + transform transitions collapse to instant open/close via the kit's global reduced-motion handling |

## 5. Platform & relationship to root kit

**Web-only by design** — no `@lockin90/ui-native` counterpart for the marketing FAQ.

- **Distinct from the root `Accordion`.** The root cross-platform kit exports its own `Accordion` (`packages/ui/src/components/Accordion.tsx`) with item type **`AccordionItemData`**, an optional `items`, a **`multiple`** prop (single-open *or* multi-open), built-in default items, and `...HTMLAttributes` spread. The marketing `Accordion`'s item type is **`AccordionItem`** (different name), `items` is **required**, there is **no `multiple`** (always single-open) and **no `className`/rest**. Same role, different — simpler, marketing-tuned — contract. Import from the right subpath.
- **`AccordionItem` is a data interface here**, whereas in some kits "AccordionItem" names a row *component*; this one is purely `{ question, answer }`. Don't expect to render `<AccordionItem>`.
- The visual language (glass dividers, accent `+`, gradient void) is marketing-Aurora and is not mirrored on native.

## 6. Composition & usage

- **Composes from:** nothing but native DOM + `cn` — it is self-contained (its own state, button, panel).
- **Composes into:** an FAQ `Section` on the marketing site, typically under an `Eyebrow` + `Heading`.
- **Data-driven:** feed it an array; row contents are plain strings.

```tsx
const faqs: AccordionItem[] = [
  { question: 'How is my readiness score calculated?', answer: 'From sleep, strain, and recovery signals, modeled daily.' },
  { question: 'Do I need a wearable?', answer: 'No — manual logging works; a wearable just adds precision.' },
];

<Section>
  <Eyebrow>FAQ</Eyebrow>
  <Heading as="h2" size="title">Questions, answered</Heading>
  <Accordion items={faqs} />
</Section>
```

## 7. Accessibility

- Each trigger is a real **`<button type="button">`** carrying **`aria-expanded={isOpen}`**, so screen readers announce expanded/collapsed; Enter/Space toggle natively and the button is keyboard-focusable in order.
- The `+`/`×` indicator span is **`aria-hidden`** — it's decorative; the expanded state is conveyed by `aria-expanded`, not the glyph.
- The answer panel is always in the DOM (height-animated, not unmounted) and is hidden only via `0fr`/`opacity` — content remains reachable; ensure answers are concise plain strings as the contract enforces.
- Hit target: `padding 20px 0` + full-row width gives a comfortably large click/tap target across the whole row.

## 8. Usage rules — Do / Don't

**Do**
- Use `Accordion` for marketing FAQ lists; pass an ordered `AccordionItem[]`.
- Keep `question` short and `answer` a single concise paragraph (it's a plain string, capped at `62ch`).
- Order items by importance — the **first is open by default**, so lead with the most-asked.

**Don't**
- ✗ Don't try to pass JSX/links in `answer` — the contract is `string` (rendered as text). If rich answers are needed, extend the kit, don't bypass it.
- ✗ Don't expect a controlled/multi-open mode here — it's single-open with index-0 default by design (use the **root** `Accordion` with `multiple` for product UIs).
- ✗ Don't hardcode the dividers, accent `+`, padding, or animation — they come from the kit/tokens.
- ✗ Don't render `<AccordionItem>` as a component — it's a data type.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled `<details>`/custom toggle list with glass dividers and a rotating `+` re-creates this component and will drift from the spec — import `Accordion`.
- **New capability → extend the primitive.** Need multi-open, a different default row, or rich answers on the marketing site? Add the prop to **this** component (or reach for the root `Accordion`) — never fork a local copy.
- **Tokens only.** Dividers (`--border`), accent (`--accent`), fonts (`--font-display`), timings (`--ease`), and text colors must come from the kit; hardcoded values are bugs even when they look identical.
- **Right primitive for the surface.** Marketing FAQ → marketing `Accordion`; product/admin accordion → root `Accordion`. Don't import the marketing one into the apps to avoid the cross-platform contract.
