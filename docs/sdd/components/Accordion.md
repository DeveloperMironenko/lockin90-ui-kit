# SDD — `Accordion`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Accordion.tsx` · `packages/ui-native/src/components/Accordion.tsx` ·
> web CSS `packages/ui/src/styles/components/accordion.css` (`.lk-acc*`).
> **Exports:** `Accordion`, type `AccordionItemData`, type `AccordionProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; reveal mechanic differs (CSS max-height transition vs conditional mount).
> **Stories:** `packages/ui/src/stories/Accordion.stories.tsx` · `packages/ui-native/src/stories/Accordion.stories.tsx`.

---

## 1. Overview

A **collapsible disclosure list** — a stack of header rows, each with a chevron that rotates 180° open while the body reveals. Used for FAQ blocks and grouped settings sections. Items are separated by a 1px hairline (`--border`).

Behavior is **single-open by default** (opening a row closes the others); set `multiple` to allow several rows open at once. The open set is internal component state seeded from `defaultOpen` — the component is **uncontrolled** (no `open`/`onChange` props).

Secondary export `AccordionItemData` is the row shape: `{ title: string; content: ReactNode }`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `items` | `AccordionItemData[]` | `DEFAULT_ITEMS` (3-row FAQ sample) | ✓ | ✓ | each `{ title, content }`; identical sample both sides |
| `multiple` | `boolean` | `false` | ✓ | ✓ | `false` = single-open accordion; `true` = independent toggles |
| `defaultOpen` | `number` | `0` | ✓ | ✓ | index open on mount; out-of-range → nothing open |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web) / `ViewProps` (native) | — | ✓ | ✓ | spread onto the root `<div>` / `<View>` |

- `AccordionItemData`: `title: string`, `content: ReactNode`. On native, a **string** `content` is wrapped in a styled `Text`; a non-string node renders as-is.
- Open state: `useState<Set<number>>` seeded from `defaultOpen` (both platforms, identical `toggle` logic).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`accordion.css`) | Native (`StyleSheet`) |
| --- | --- | --- |
| Row divider | `border-bottom: 1px solid var(--border)`; first row also `border-top` | `borderBottomWidth: 1` `colors.border`; first row `borderTopWidth: 1` |
| Header layout | flex row, `space-between`, `gap: 16px`, `padding: 16px 4px` | row, `space-between`, `gap: 16`, `paddingVertical: 16`, `paddingHorizontal: 4` |
| Header text | `--font-ui`, `14.5px`, 600, `letter-spacing: -0.005em`, `--text` | `fonts.ui`, `14.5`, `'600'`, `letterSpacing: -0.07`, `colors.text` |
| Chevron | 18×18 svg `M6 9l6 6 6-6`, `--text-faint`; open → `--accent` | 18×18 `Svg`, `colors.textFaint` → `colors.accent` when open |
| Body content | `--font-ui`, `13.5px`, `line-height: 1.5`, `--text-dim` | `fonts.ui`, `13.5`, `lineHeight: 20`, `colors.textDim` |
| Body padding (open) | `0 4px 18px` | `paddingHorizontal: 4`, `paddingBottom: 18` |

- **Reveal:** web animates `max-height` `0 → 480px` + `opacity` + `padding` over `.4s var(--ease)`; native conditionally renders the body `<View>` (no height transition).
- **Chevron rotation:** both rotate `180deg` open — web `transform: rotate(180deg)` over `.35s`, native `transform: [{ rotate: '180deg' }]` (instant).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Collapsed | base `.lk-acc-item` | body not rendered |
| Open | `.lk-acc-item.is-open` → body `max-height: 480px`, chevron rotated + `--accent` | body `<View>` mounted, chevron rotated + `colors.accent` |
| Hover | `.lk-acc-head:hover .lk-acc-chev` → `--accent` | n/a (no hover) |
| Focus | native `<button>` focus ring | platform focus (Pressable) |
| Reduced motion | CSS transitions degrade gracefully; no JS animation | native already has no transition |

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped reveal.** Identical props, identical `DEFAULT_ITEMS`, identical single-vs-multiple `toggle` logic, identical hairline/typography/chevron tokens. Differences are substrate-only:

- **Reveal animation:** web expands via a CSS `max-height`/`opacity`/`padding` transition (a `480px` cap on body height); native simply mounts/unmounts the body `View` (no expand animation — RN has no cheap auto-height transition). Both reach the same open/closed visual; the web one slides.
- **Hover:** web brightens the chevron on header hover; native has no hover (press only).
- **Body height cap:** web bodies taller than `480px` clip; native is uncapped. Keep `content` short (it's a disclosure row, not a scroll region).

No capability gap blocks use — both are fully usable, visually equivalent at rest.

## 6. Composition & usage

- **Used for:** marketing/pricing FAQ, settings sections, any "tap to reveal" group.
- **Composes from:** nothing (inline chevron svg both sides) — self-contained.
- **Content nodes:** pass rich `content` (a `<p>`, a list) on web; on native pass a string (auto-wrapped) or your own `Text`/`View` tree.

```tsx
// web
<Accordion
  items={[
    { title: 'How accurate are the estimates?', content: 'They improve as you log more sessions.' },
    { title: 'Can I cancel anytime?', content: <p>Yes — active until the period ends.</p> },
  ]}
/>

// native
<Accordion
  multiple
  defaultOpen={-1}
  items={[{ title: 'Do you support wearables?', content: 'WHOOP, Oura, Apple Health and more.' }]}
/>
```

## 7. Accessibility

- **Web:** header is a real `<button type="button">` with `aria-expanded={isOpen}`; body is a `<div role="region">`. Keyboard: Tab to header, Enter/Space toggles.
- **Native:** header `Pressable` with `accessibilityRole="button"` + `accessibilityState={{ expanded: isOpen }}`.
- **Hit target:** `16px` vertical padding + 18px chevron yields a comfortable touch row.
- **Title truncation:** native `numberOfLines={2}` on the title; web wraps.

## 8. Usage rules — Do / Don't

**Do**
- Pass your own `items` — the default sample is a placeholder for stories/empty states.
- Use `multiple` only when rows are genuinely independent; default single-open for FAQ.
- Keep `content` concise (web caps body at `480px`).
- Set `defaultOpen={-1}` to start fully collapsed.

**Don't**
- ✗ Don't hand-roll a chevron disclosure row — use `Accordion`.
- ✗ Don't hardcode the hairline color, chevron, or typography — they come from tokens.
- ✗ Don't rely on a controlled `open` prop — there isn't one; it's uncontrolled.
- ✗ Don't put scrollable/very-tall content inside (web clips at `480px`).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A "custom FAQ toggle" that re-creates the rotating chevron + hairline rows is a parity violation — import `Accordion`.
- **New need → both platforms.** If you need controlled open state or a different reveal, add the prop to `Accordion` on **both** web and native (same name, same tokens) — never a one-off.
- **Tokens only.** The divider (`--border`), chevron colors (`--text-faint`/`--accent`), and typography (`--font-ui`) must come from `@lockin90/tokens`.
- **Parity gate.** Before shipping a screen with an Accordion, confirm the web phone-width render and native render show the same rows, order, and open state.
