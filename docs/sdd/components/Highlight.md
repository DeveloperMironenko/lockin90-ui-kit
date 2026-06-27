# SDD — `Highlight` (+ `HighlightTone` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Highlight.tsx` · `packages/ui-native/src/components/Highlight.tsx` ·
> web CSS `packages/ui/src/styles/components/highlight.css` (`.lk-hl*`).
> **Exports:** `Highlight`, type `HighlightTone`, type `HighlightProps`.
> **Status:** Shipped. **Parity:** ✅ identical visuals — native was recently fixed to add the violet pill background (`paddingHorizontal: 5`, `borderRadius: 5`) so it now matches web's `.lk-hl` exactly; only the substrate (`<span>` ↔ `<Text>`) differs.
> **Stories:** `packages/ui/src/stories/Highlight.stories.tsx` · `packages/ui-native/src/stories/Highlight.stories.tsx`.

---

## 1. Overview

**Inline tone-colored text emphasis** for AI-summary / insight prose: a bold, signal-colored keyword on a faint tinted background, flowing inside a paragraph. It's how the kit calls out the load-bearing word in a sentence ("your **recovery** is trending up") without breaking the line.

`HighlightTone` (`'accent' | 'mint' | 'warm' | 'low'`) is the only secondary export — the signal color of the emphasized keyword. `accent` (softened violet) is the default; `mint`/`warm`/`low` map to the green/amber/red zone tones.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `tone` | `HighlightTone` | `'accent'` | ✓ | ✓ | signal color: `accent` (violet), `mint`, `warm`, `low` |
| `children` | `ReactNode` (web) / text content (native) | — | ✓ | ✓ | the emphasized keyword(s) |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<TextStyle>` | — | — | ✓ | native only (merged after the tone base) |
| _rest_ | `HTMLAttributes<HTMLSpanElement>` (web) / `TextProps` (native) | — | ✓ | ✓ | spreads to the element |

- **Web:** `forwardRef<HTMLSpanElement>`; renders a `<span class="lk-hl …">`.
- **Native:** plain function component (no ref); renders a bare `<Text>` so it flows inline when nested inside a parent `<Text>`. The tone `base` style is applied first, then `style` (so callers can override).

## 3. Visual spec (tokens — never hardcode)

| Element | Web (`.lk-hl`) | Native (base `TextStyle`) |
| --- | --- | --- |
| Weight | `font-weight: 600` | `fontWeight: '600'` |
| Padding | `padding: 0 5px` | `paddingHorizontal: 5` |
| Radius | `border-radius: 5px` | `borderRadius: 5` |

**Tone → color / background (identical literals both sides):**

| Tone | Text | Background |
| --- | --- | --- |
| `accent` | `#cbbcff` (softened violet — a literal, **not** a raw token, for legibility on dark) | `rgba(124,92,255,.10)` |
| `mint` | `--zone-high` / `colors.zoneHigh` | `rgba(52,245,197,.10)` |
| `warm` | `--zone-mid` / `colors.zoneMid` | `rgba(255,176,32,.10)` |
| `low` | `--zone-low` / `colors.zoneLow` | `rgba(255,77,109,.10)` |

- The `accent` text color is the deliberately softened violet `#cbbcff` on **both** platforms (not `--accent`/`colors.accent`) so web and native render the identical color. The other three tones use the zone tokens.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Accent (default) | violet text on faint violet tint | same |
| Mint / Warm / Low | zone-toned text on matching faint tint | same |
| Inline flow | `<span>` flows in the `<p>` | bare `<Text>` flows inside a parent `<Text>` |

Static, read-only — no hover/focus/disabled/interactive states.

## 5. Web ↔ native parity

**Verdict: ✅ identical.** Same tones, same color/background literals (incl. the matched `#cbbcff` accent), same `600` weight, and — after the recent native fix — the **same `5px` horizontal padding + `5px` radius** so the tinted pill reads identically. Differences are pure substrate:

- **Element:** web is a `<span>` (CSS class `.lk-hl`); native is a bare `<Text>` so it flows when nested in a parent `<Text>`. The pill padding/radius applies when the `<Text>` is **not** nested in another `<Text>` (RN inline text can't always render the box) — a documented platform nuance, not a visual divergence in the common case.
- **forwardRef / HTML attrs ↔ style:** web forwards a ref + spreads `<span>` attrs; native takes `style` and merges it after the tone base. Universal substrate.

No capability gap; the emphasis renders the same color + tinted background on both.

## 6. Composition & usage

- **Used in:** AI summaries, insight cards, forecast callouts — wherever prose needs a colored keyword.
- **Composes into:** a parent `<p>` (web) / `<Text>` (native) sentence; it does not compose other kit primitives.

```tsx
// web — keyword emphasis in a summary sentence
<p>Your <Highlight tone="mint">recovery</Highlight> is up, but <Highlight tone="low">sleep debt</Highlight> rose.</p>

// native — nest inside a parent <Text> so it flows inline
<Text>Your <Highlight tone="mint">recovery</Highlight> is up.</Text>
```

## 7. Accessibility

- **Web:** a `<span>` — semantically inline text; the **color is decorative emphasis**, not the only signal (the word itself carries the meaning). Add `aria-*` via `...rest` only if the emphasis needs an explicit role.
- **Native:** a `<Text>` node read inline by the screen reader as part of the sentence.
- **Contrast:** the softened `#cbbcff` accent and the zone tones are chosen for legibility on the dark surface; don't darken them — keep the tone literals.

## 8. Usage rules — Do / Don't

**Do**
- Use `Highlight` for one or two load-bearing keywords per sentence.
- Match `tone` to the sentiment (`mint` good, `low` bad, `warm` caution, `accent` neutral emphasis).
- Nest native `Highlight` inside a parent `<Text>` so it flows inline.

**Don't**
- ✗ Don't highlight whole sentences — it's keyword emphasis, not a block callout (use `InsightCard`/`Alert`).
- ✗ Don't hardcode the tone colors — they come from the canonical literals + zone tokens.
- ✗ Don't change the `accent` color to a raw token — `#cbbcff` is matched across platforms on purpose.
- ✗ Don't hand-roll a colored `<span>`/`<Text>` — extend `Highlight` on both platforms.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke colored keyword span re-doing the tone tints is a parity violation — import `Highlight`.
- **New need → both platforms.** A new tone ships to web **and** native with the same name + matched literals/tokens (and the same `#cbbcff`-style softened color if it needs legibility tuning).
- **Tokens only (with the matched-literal exception).** Mint/warm/low come from `--zone-*` / `colors.zone*`; the `accent` text and all background tints are the canonical matched literals — don't invent per-call-site values.
- **Parity gate.** Before shipping, confirm the web phone-width emphasis ≡ native emphasis (same tone color, same tinted pill) — the recent native padding/radius fix means any mismatch is now a real bug.
