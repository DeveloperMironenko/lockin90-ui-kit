# SDD — `CharCounter` (+ `CharCounterStatus`)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/CharCounter.tsx` · `packages/ui-native/src/components/CharCounter.tsx` ·
> web CSS `packages/ui/src/styles/components/charcounter.css` (`.lk-charcount*`).
> **Exports:** `CharCounter`, type `CharCounterStatus`, type `CharCounterProps`.
> **Status:** Shipped. **Parity:** ✅ identical API, tokens, and status thresholds — substrate-only difference.
> **Stories:** `packages/ui/src/stories/CharCounter.stories.tsx` · `packages/ui-native/src/stories/CharCounter.stories.tsx`.

---

## 1. Overview

An **input-aware character-count feedback row**: a thin fill bar (fraction = `value / max`) plus a `"value / max"` mono readout that colors through three states as the input fills. The form-field adornment for any length-limited text — SEO meta fields, post titles, bio fields. Mirrors the `.charbar` from the CMS page/post editors.

`CharCounterStatus` (`'ok' | 'warn' | 'over'`) is the secondary export — the resolved length status that drives the fill + count color:

- `ok` — under the warn threshold; mint fill, faint count.
- `warn` — at/above `warnAt * max` (default 85%); amber fill + count.
- `over` — exceeds `max`; red fill (pinned full) + red count.

Distinct from `Meter` (generic value-in-range) and `BarFill` (raw fraction): this is specifically the count/limit form adornment with an over-limit state and an `"x / max"` readout.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `number` | — (required) | ✓ | ✓ | current input length |
| `max` | `number` | — (required) | ✓ | ✓ | the length limit (0 is guarded → treated as 1) |
| `warnAt` | `number` | `0.85` | ✓ | ✓ | fraction of `max` at which to flip to `warn` |
| `showBar` | `boolean` | `true` | ✓ | ✓ | render the thin fill bar |
| `showCount` | `boolean` | `true` | ✓ | ✓ | render the `"value / max"` mono readout |
| `format` | `(value, max) => string` | `` `${value} / ${max}` `` | ✓ | ✓ | override the readout text |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `CSSProperties` / `StyleProp<ViewStyle>` | — | ✓ | ✓ | merged after base |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (sans `children`) / `ViewProps` | — | ✓ | ✓ | spreads to the root |

- **Web:** function component (no ref); `Omit<HTMLAttributes, 'children'>` — it owns its own children. Sets a per-instance CSS var `--v` = clamped `value/max` fraction; the fill width is `calc(var(--v) * 100%)`.
- **Native:** function component; `ViewProps`. Computes the fill width inline as a `%` `DimensionValue`.
- **Shared logic** (duplicated 1:1 both files): `clamp(value/safeMax, 0, 1)` and `statusOf(value, max, warnAt)` — `over` if `value > max`, else `warn` if `value >= warnAt*max`, else `ok`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Row | `display:flex`, `gap: 9px`, `margin-top: 6px` | `flexDirection:row`, `gap: 9`, `marginTop: 6` |
| Track | `height: 4px`, `--r-pill`, `rgba(255,255,255,.07)` | `height: 4`, `radius 999`, `rgba(255,255,255,0.07)` |
| Fill (`ok`) | `--mint` | `colors.mint` |
| Fill (`warn`) | `--zone-mid` | `colors.zoneMid` |
| Fill (`over`) | `--bad` | `colors.bad` |
| Count font | `--font-mono`, `9.5px` | `fonts.mono`, `9.5` |
| Count (`ok`) | `--text-faint` | `colors.textFaint` |
| Count (`warn`) | `--warn` | `colors.warn` |
| Count (`over`) | `--bad` | `colors.bad` |

- **Track fill width:** web `calc(var(--v,0) * 100%)`; native `${frac*100}%`. Both clamp the fraction to `[0,1]`, so an over-limit bar pins to 100% (and recolors to `--bad`).
- **Transitions (web only):** fill `width .4s --ease, background .3s --ease`; count `color .3s --ease`. Native is static (no animated width).
- The mono count never wraps — web `flex:none`; native `flexShrink:0` + `numberOfLines={1}`.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| `ok` | `.lk-charcount` (default) — mint fill, faint count | base — mint fill, faint count |
| `warn` | `.lk-charcount-warn` — amber fill + count | `zoneMid` fill, `warn` count |
| `over` | `.lk-charcount-over` — red fill (pinned full) + red count | `bad` fill (pinned full) + `bad` count |
| bar hidden | `showBar={false}` → no track/fill | same |
| count hidden | `showCount={false}` → no readout | same |

No hover/pressed/focus — it's a passive readout driven entirely by `value`/`max`.

## 5. Web ↔ native parity

**Verdict: ✅ identical.** Same props, same defaults, same `warnAt` 0.85 threshold, same three-state status machine, and the same token mapping for fill and count colors. The only differences are substrate and don't change behavior:

- **Fill width mechanism:** web uses a CSS var (`--v`) + `calc()` so the bar can animate `width`; native sets a literal `%` width (no animation). Identical resolved width.
- **A11y wrapper:** web sets `role="status" aria-live="polite"` on the root so screen readers announce count changes (see §7); native relies on the associated input's own a11y. No visual or contract impact.

There is no capability gap — the component is fully equivalent on both platforms.

## 6. Composition & usage

- **Composes:** nothing — leaf primitive (a track + fill `<i>`/`<View>` and a mono `<span>`/`<Text>`).
- **Used by:** length-limited inputs — CMS SEO meta/title/excerpt fields, profile bio, post composer. Pair it directly under a `TextField`/`Textarea`, feeding the input's current length.

```tsx
// web
<Textarea value={bio} onChange={setBio} />
<CharCounter value={bio.length} max={160} />

// native
<TextField value={title} onChangeText={setTitle} />
<CharCounter value={title.length} max={60} warnAt={0.9} />
```

## 7. Accessibility

- **Web:** the root carries `role="status"` + `aria-live="polite"` so the readout is announced as it changes; the bar is `aria-hidden`. Keep it adjacent to its input so the relationship is clear.
- **Native:** no live region by default; the meaningful signal is the count text (already a `<Text>`). For SR users relying on the input, surface the limit in the field's `accessibilityHint`.
- **Color is not the only signal** — the numeric `"value / max"` readout conveys the same state as the fill color (don't disable both `showBar` and `showCount`).

## 8. Usage rules — Do / Don't

**Do**
- Feed `value` from the live input length and a real `max`.
- Keep both `showBar` and `showCount` on unless space is truly constrained.
- Use `warnAt` to tune the amber threshold per field (e.g. 0.9 for hard SEO caps).
- Use `format` for localized or unit-suffixed readouts.

**Don't**
- ✗ Don't hardcode mint/amber/red — they come from `--mint`/`--zone-mid`/`--bad` (and `--warn` for the count).
- ✗ Don't reimplement the over-limit bar with a second `Meter`/`BarFill` — `CharCounter` already handles it.
- ✗ Don't pass a `max` of 0 expecting a divide error — it's guarded to 1, but pass a real limit.
- ✗ Don't hide both the bar and the count (removes all feedback).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled "x/max" counter with its own thresholds will drift from the kit's 85%/over logic and token colors — import `CharCounter`.
- **New need → add to BOTH platforms.** A new status tier or a different threshold model must land on web *and* native with the same prop, same tokens — never a one-off.
- **Tokens only.** The fill/count colors are `@lockin90/tokens` values; never inline hex even if it matches today.
- **Parity gate.** Confirm the web phone-width and native counters show the same color at the same `value`/`max` before shipping a length-limited field.
