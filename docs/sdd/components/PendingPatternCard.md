# SDD — `PendingPatternCard`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform composite (AI / insights).
> **Source:** `packages/ui/src/components/PendingPatternCard.tsx` · `packages/ui-native/src/components/PendingPatternCard.tsx` ·
> web CSS `packages/ui/src/styles/components/pendingpattern.css` (`.lk-pcard*`).
> **Exports:** `PendingPatternCard`, type `PendingPatternCardProps`, type `PendingPatternConfidence`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; web wraps in `Card hover lit`, native `Card lit` (no `hover` prop). Effect-string parsing is identical.
> **Stories:** `packages/ui/src/stories/PendingPatternCard.stories.tsx` · `packages/ui-native/src/stories/PendingPatternCard.stories.tsx`.

---

## 1. Overview

A **detected-but-unconfirmed pattern surfaced for review** — the engine's "I think I found this; confirm?" card. A glass `Card` (`lit`) with: a "Pending pattern" mono eyebrow + boxed sparkle icon header, the interpretation prose, an **emphasized effect line** (the signed magnitude split out and tone-tinted mint/red, in a boxed sub-panel), optional confidence `Chip`s, and an **Accept / Dismiss** action footer. Where `InsightCard` is read-only, `PendingPatternCard` is the actionable review surface; the secondary export `PendingPatternConfidence` is the `{ label, value }` shape for the confidence chips.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `interpretation` | `ReactNode` | — (required) | ✓ | ✓ | the detected-pattern prose; native auto-wraps a `string` in `Text`, else a `View` |
| `effect` | `string` | — | ✓ | ✓ | e.g. `'+8 energy when sleep > 7h'`; the **leading signed token** is split out + tinted |
| `confidence` | `PendingPatternConfidence[]` (`{ label, value }`) | — | ✓ | ✓ | supporting chips, e.g. `[{ label: 'n', value: '22 events' }]`; `tone="neutral"` |
| `onAccept` | `() => void` | — | ✓ | ✓ | shows the **Accept** primary button when present |
| `onDismiss` | `() => void` | — | ✓ | ✓ | shows the **Dismiss** ghost button when present |
| `acceptLabel` | `string` | `'Accept'` | ✓ | ✓ | accept button text |
| `dismissLabel` | `string` | `'Dismiss'` | ✓ | ✓ | dismiss button text |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web, minus `children`) | — | ✓ | — | spread to the `Card` |

- The action footer renders only if `onAccept != null || onDismiss != null`; each button renders only if its handler is set.
- **`splitEffect(effect)`** (identical both platforms) regex-parses the string into `{ sign: 'pos'|'neg'|'none', value, rest }` via `/^\s*([+\-−]\s*[\d.,]+\s*[^\s]*)(.*)$/` — the leading signed token (e.g. `+8`, `−18m`) becomes the emphasized value, the remainder the dim label. Sign is `neg` if it starts with `-` or `−` (unicode minus), else `pos`.

## 3. Visual spec (tokens — never hardcode)

| Part | Token / value |
| --- | --- |
| Shell | `Card lit` (web also `hover`), padding `20px`, flex column |
| Icon box | `32×32`, radius `--r-sm` / `radii.sm` (10), `--glass` / `colors.glass` bg, `1px --border` / `colors.border`, `--accent` / `colors.accent` `sparkle` (18) |
| Eyebrow | `--font-mono` / `fonts.mono`, `10px`, weight 500, uppercase, letter-spacing `0.16em` (native `1.6`), `--text-faint` / `colors.textFaint`; head `gap 10px` |
| Prose | `13.5px`, line-height 1.55 (native `21`), `--text-dim` / `colors.textDim`, `margin-top 14px`; web `<b>` → `--text` |
| Effect panel | `margin-top 14px`, padding `11px/14px`, radius `--r-sm`, `1px --border`, `--bg-1` / `colors.bg1` bg, baseline row `gap 10px` |
| Effect value | `--font-display` / `fonts.display`, `22px`, weight 700, letter-spacing `-0.02em` (native `-0.4`), tnum; `pos`→`--zone-high` / `colors.zoneHigh` (mint), `neg`→`--zone-low` / `colors.zoneLow` (red), else `--text` |
| Effect label | `--font-mono`, `10px`, uppercase, letter-spacing `0.12em` (native `1.2`), `--text-faint` |
| Confidence chips | `.lk-pcard-meta` flex-wrap `gap 8px` `margin-top 14px`, `Chip tone="neutral"` |
| Action footer | `margin-top 16px`, `padding-top 16px`, `border-top 1px --border`, `gap 10px`; buttons `flex:1` (`Button` primary + ghost) |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `Card hover lit` glass + inner glow | `Card lit` glass + inner glow |
| Hover | `Card hover` lift + glow | n/a (native `Card` has no `hover`) |
| Positive effect | `.lk-pos` → `--zone-high` value | `effColor = colors.zoneHigh` |
| Negative effect | `.lk-neg` → `--zone-low` value | `effColor = colors.zoneLow` |
| No-sign effect | value plain `--text` | `colors.text` |
| No effect | effect panel omitted | effect panel omitted |
| No actions | footer omitted | footer omitted |
| Accept only / Dismiss only | single button (still `flex:1`) | single button (`flex:1`) |

Button interaction (hover/press/disabled) comes from the underlying `Button` primitive (see `Button.md`).

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, one substrate delta.** Identical props, the `splitEffect` parser, eyebrow/icon header, effect-panel sub-box, tone-tinting (mint/red), confidence chips, and the Accept-primary / Dismiss-ghost footer with `flex:1` buttons. The only real difference:

- **Hover:** web `Card hover lit` adds pointer lift + glow; native `Card lit` keeps the inner-glow only (no `hover` prop). Web-only affordance — same resting visual.
- **Interpretation rendering:** web drops `interpretation` straight into `<p>`; native wraps a `string` in styled `Text` and a non-string node in a `View` (RN string constraint). App code reads 1:1.

No capability gap — both render the same reviewable pattern card with working Accept/Dismiss.

## 6. Composition & usage

- **Composes from:** `Card` (`lit` shell), `Icon` (`sparkle`), `Chip` (`tone="neutral"` confidence), `Button` (`primary` Accept + `ghost` Dismiss). The effect line is local markup tinted by `splitEffect`.
- **Composed into:** the insights / review feed where pending patterns await user confirmation (the engine's `pendingPatterns`). Accept/Dismiss typically call the `/feedback/patterns/:id/{accept,dismiss}` endpoints.

```tsx
// web
<PendingPatternCard
  interpretation={<>Your energy is <b>higher</b> on days you train before noon.</>}
  effect="+8 energy when trained AM"
  confidence={[{ label: 'n', value: '22 events' }, { label: 'p', value: '0.03' }]}
  onAccept={() => accept(id)}
  onDismiss={() => dismiss(id)}
/>

// native
<PendingPatternCard
  interpretation="Your energy is higher on days you train before noon."
  effect="+8 energy when trained AM"
  confidence={[{ label: 'n', value: '22 events' }, { label: 'p', value: '0.03' }]}
  onAccept={() => accept(id)}
  onDismiss={() => dismiss(id)}
/>
```

## 7. Accessibility

- **Web:** the eyebrow + prose convey the pattern; Accept/Dismiss are real `Button`s (focusable, Enter/Space). The icon is `aria-hidden`. Ensure `acceptLabel`/`dismissLabel` are descriptive if the default verbs are ambiguous in context.
- **Native:** Accept/Dismiss are `Button`s (`Pressable` with `accessibilityRole="button"`); prose is `Text`.
- **Effect tone:** the sign (`+`/`−`) is rendered as text, so the valence isn't color-only — screen readers get the signed magnitude.
- **Hit target:** footer buttons are `Button` `primary`/`ghost` at default `md` size (≥44px height), `flex:1` so they're wide tap targets.

## 8. Usage rules — Do / Don't

**Do**
- Pass `effect` as a string starting with the signed magnitude so `splitEffect` can emphasize + tint it.
- Provide both `onAccept` and `onDismiss` for a real review action (omit one only intentionally).
- Use `confidence` chips for n / p / supporting stats as `{ label, value }`.

**Don't**
- ✗ Don't hand-roll the eyebrow + effect-box + Accept/Dismiss layout — use `PendingPatternCard`.
- ✗ Don't put a non-signed effect string and expect tinting — only a leading `+`/`−`/`−` token is parsed.
- ✗ Don't swap the button variants (Accept must stay `primary`, Dismiss `ghost`) — it's the sanctioned hierarchy.
- ✗ Don't hardcode the tint colors, eyebrow mono, or effect-box surface — they come from `@lockin90/tokens`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A "custom pattern review card" re-creating the eyebrow + boxed effect + Accept/Dismiss is a parity violation — import `PendingPatternCard`.
- **New need → both platforms.** A new action (e.g. "Snooze") or a third button must land on **both** web + native with the same `Button` variant + tokens — never a one-off.
- **Tokens only.** Mint/red tint (`--zone-high`/`--zone-low`), `--accent` icon, `--bg-1` effect box, mono eyebrow — all from tokens.
- **Parity gate.** Before shipping a review screen, confirm web phone-width and native render the same eyebrow, effect tint, confidence chips, and Accept/Dismiss buttons.
