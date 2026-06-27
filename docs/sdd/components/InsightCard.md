# SDD — `InsightCard`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform composite (AI / insights).
> **Source:** `packages/ui/src/components/InsightCard.tsx` · `packages/ui-native/src/components/InsightCard.tsx` ·
> web CSS `packages/ui/src/styles/components/insightcard.css` (`.lk-insight*`).
> **Exports:** `InsightCard`, type `InsightCardProps`, type `InsightTone`.
> **Status:** Shipped. **Parity:** 🟡 same API & composition; web wraps in `Card hover` + uses a CSS grid that stacks at ≤560px, native `Card` (no hover) with a fixed flex row.
> **Stories:** `packages/ui/src/stories/InsightCard.stories.tsx` · `packages/ui-native/src/stories/InsightCard.stories.tsx`.

---

## 1. Overview

A **glass panel surfacing a detected pattern / insight**: a leading tone-tinted icon + optional title row, the insight prose, an optional row of small stat `Chip`s (p-value / n / confidence), and an optional tone-tinted `Sparkline` on the right. `tone` drives the icon **and** sparkline accent color. Composed from `Card` + `Icon` + `Sparkline` + `Chip`. It's the read-only "here's what we found" surface; for an actionable detected-but-unconfirmed pattern use `PendingPatternCard`, and for a single score driver use `EffectAttributionLine`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `title` | `string` | — | ✓ | ✓ | optional heading (display font) |
| `body` | `ReactNode` | — (required) | ✓ | ✓ | the insight prose; native auto-wraps a `string` in styled `Text`, else renders the node |
| `data` | `number[]` | — | ✓ | ✓ | optional `Sparkline` series, oldest → newest |
| `stats` | `{ label: string; value: string }[]` | — | ✓ | ✓ | rendered as `Chip`s (`label = value` / web `label = value`) |
| `tone` | `InsightTone` (`'default' \| 'positive' \| 'negative' \| 'accent'`) | `'default'` | ✓ | ✓ | drives icon + sparkline color |
| `icon` | `IconName` | `'sparkle'` | ✓ | ✓ | leading glyph |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |

- No ref / rest passthrough on either side — props are fixed.
- `TONE_COLOR` maps tone → token: `default`→`--text-dim`/`textDim`, `positive`→`--ok`/`ok`, `negative`→`--bad`/`bad`, `accent`→`--accent`/`accent`. The same color feeds both the `Icon` and the `Sparkline`.

## 3. Visual spec (tokens — never hardcode)

| Part | Token / value |
| --- | --- |
| Shell | `Card` (glass surface) — web `Card hover`, native plain `Card` |
| Layout (web) | `grid-template-columns: 1fr 150px`, `gap 18px`, `align-items: center`; stacks to `1fr` at `max-width: 560px` |
| Layout (native) | flex `row`, `gap 18`, `align-items: center`; `main` `flex:1`, `right` `align-items: flex-end` |
| Head | icon + title row, `gap 10px`, `margin-bottom 7px` |
| Title | `--font-display` / `fonts.display`, `17px`, weight 700, letter-spacing `-0.01em` (native `-0.2`), `--text` / `colors.text` |
| Body | `13.5px`, line-height 1.55 (native `21`), `--text-dim` / `colors.textDim`; web `<b>` → `--text` |
| Stats row | `.lk-insight-meta` flex-wrap, `gap 8px`, `margin-top 12px`, `Chip`s |
| Sparkline | `tone` color; web `width 150 height 64`, native `width 120 height 56`, `fill` |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `Card` glass, 2-col grid | `Card`, flex row |
| Hover | `Card hover` → lift + glow | n/a (native `Card` has no `hover` prop) |
| No `data` | right column omitted | right view omitted |
| No `stats` | meta row omitted | meta row omitted |
| No `title` | head shows icon only | head shows icon only |
| Narrow (≤560px) | grid collapses to one column, sparkline full-width below prose | fixed row (no responsive collapse) |

Non-interactive content (the `Card hover` is purely a web affordance).

## 5. Web ↔ native parity

**Verdict: 🟡 same API & composition, two substrate deltas.** Identical props, tone→color mapping, head/body/stats structure, and `Card`+`Icon`+`Sparkline`+`Chip` composition. Differences:

- **Hover:** web uses `Card hover` (lift + glow on pointer); the native `Card` has no `hover` prop, so native is static. Web-only affordance, not a content difference.
- **Responsive:** web's CSS grid collapses to a single column at `≤560px` (sparkline drops below the prose, full width); native keeps a fixed flex row. On a phone-width web render the layout effectively matches native's row only above 560px — below it web stacks. Acceptable, but note it when diffing phone-width web ↔ native.
- **Sparkline size:** web `150×64`, native `120×56` — a small platform tuning of the same fill sparkline.

No capability gap blocks use; both render the same insight.

## 6. Composition & usage

- **Composes from:** `Card` (shell), `Icon` (leading glyph, tone color), `Sparkline` (tone-tinted, `fill`), `Chip` (stats). The wrapper CSS only handles layout + typography — the children carry their own styles.
- **Composed into:** insight / intelligence feeds, the dashboard "what we found" section. Stack several in a column.

```tsx
// web
<InsightCard
  tone="positive"
  icon="trend-up"
  title="Sleep drives your mornings"
  body={<>Energy runs <b>+8</b> on days after 7h+ sleep.</>}
  data={[40, 44, 48, 60, 72]}
  stats={[{ label: 'p', value: '0.02' }, { label: 'n', value: '34' }]}
/>

// native
<InsightCard
  tone="positive"
  icon="trend-up"
  title="Sleep drives your mornings"
  body="Energy runs +8 on days after 7h+ sleep."
  data={[40, 44, 48, 60, 72]}
  stats={[{ label: 'p', value: '0.02' }, { label: 'n', value: '34' }]}
/>
```

## 7. Accessibility

- **Web:** title renders as `<h4>` — ensure the surrounding heading order is sensible. Body is a `<p>`. The icon is decorative (set via `Icon`); the insight meaning lives in the title/body text.
- **Native:** title/body are `Text`; stats are `Chip`s. No interactive role (it's presentation).
- **Color independence:** tone is reinforced by the icon choice + prose, not color alone — `positive` (`--ok`) vs `negative` (`--bad`) shouldn't be the only signal; choose an `icon` that matches.
- **Sparkline:** decorative trend; the numeric story is in `stats`/`body`, so it needs no separate label.

## 8. Usage rules — Do / Don't

**Do**
- Set `tone` to match the insight's valence and pick a matching `icon`.
- Use `stats` for p-value / n / confidence as `{ label, value }` pairs.
- Pass an oldest→newest `data` series for the trend sparkline.

**Don't**
- ✗ Don't hand-roll an insight panel with a custom sparkline + chip row — use `InsightCard`.
- ✗ Don't put actions (Accept/Dismiss) on it — that's `PendingPatternCard`'s job.
- ✗ Don't hardcode the tone colors or sparkline sizes — they come from `@lockin90/tokens` / the component.
- ✗ Don't rely on `tone` color alone to convey valence (a11y).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A "custom insight card" re-creating the icon+title+sparkline+chips layout is a parity violation — import `InsightCard`.
- **New need → both platforms.** A new `InsightTone` or a new slot (e.g. a CTA) must be added to **both** web + native with the same token mapping — never a one-off.
- **Tokens only.** Tone colors (`--ok`/`--bad`/`--accent`/`--text-dim`), fonts, and the glass shell all source from tokens.
- **Parity gate.** Before shipping an insights screen, confirm web phone-width and native render the same icon/title/body/stats/sparkline — and remember web stacks the sparkline below 560px while native keeps the row.
