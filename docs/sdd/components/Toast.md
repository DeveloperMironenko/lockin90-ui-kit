# SDD — `Toast` (+ `Badge` cross-ref)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Toast.tsx` (web Toast **+ Badge**) · `packages/ui-native/src/components/Toast.tsx` · web CSS `packages/ui/src/styles/components/toast.css` (`.lk-toast*`, `.lk-badge*`).
> **Exports:** `Toast`, `Badge`, type `ToastTone`, type `ToastProps`, type `BadgeTone`, type `BadgeProps`. **Native Badge lives in its own `Badge.tsx`** (separate file + `Badge.stories.tsx`), not in `Toast.tsx`.
> **Status:** Shipped. **Parity:** 🟡 Toast is visually identical; **Badge**'s accent fill is a CSS gradient (web) vs `expo-linear-gradient` (native).
> **Stories:** `packages/ui/src/stories/Toast.stories.tsx` (shows Badge) · `packages/ui-native/src/stories/Toast.stories.tsx` · native `Badge.stories.tsx`.

---

## 1. Overview

Two tiny status primitives sharing one web stylesheet:

- **`Toast`** — a compact floating notification card: a tone-tinted leading icon, a bold title + optional dimmer message, a subtle tinted **left accent rail**, and an optional `×` dismiss. Four tones: `default`, `success`, `warn`, `danger`.
- **`Badge`** (cross-ref) — a tiny count/status pill (smaller + simpler than `Chip`), or a bare glowing **dot**. Tones: `accent` (CTA-gradient fill), `high`, `mid`, `low`, `neutral`.

The kit provides only the toast **card** — queueing/positioning/auto-dismiss is the consuming app's concern (Toast renders the visual; the app stacks/times them).

## 2. API contract

### `Toast`

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `tone` | `'default' \| 'success' \| 'warn' \| 'danger'` | `'default'` | ✓ | ✓ | tints the icon + left rail |
| `title` | `string` | `'Saved'` | ✓ | ✓ | bold first line |
| `message` | `ReactNode` | — | ✓ | ✓ | dimmer second line; native styles a bare `string` as `Text` |
| `icon` | `ReactNode` | per-tone glyph | ✓ | ✓ | overrides the default tone icon |
| `onDismiss` | `() => void` | — | ✓ | ✓ | shows a `×`; fired on click/press |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | web `Omit<HTMLAttributes,'title'>` / native `Omit<ViewProps,'children'>` | — | ✓ | ✓ | spread onto the card |

- **Web:** `forwardRef<HTMLDivElement>`; the card is `role="status"`. Default tone glyph is `info` (`success` → `check`) at size 17.
- **Native:** plain function (no ref); the card is `accessibilityRole="alert"` + `accessibilityLiveRegion="polite"`. The left rail is a real absolutely-positioned `View` (web uses a `::before` pseudo).

### `Badge` (cross-ref)

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `children` | web `ReactNode` / native `string \| number` | `'3'` | ✓ | ✓ | count/short text (ignored when `dot`) |
| `tone` | `'accent' \| 'high' \| 'mid' \| 'low' \| 'neutral'` | `'accent'` | ✓ | ✓ | fill/tint |
| `dot` | `boolean` | — | ✓ | ✓ | render a bare glowing dot, no text |
| `className`/`style` | — | — | web `className` / native `style` | platform-shaped | |
| _rest_ | web `HTMLAttributes<HTMLSpanElement>` / native `ViewProps` | — | ✓ | ✓ | spread onto the pill/dot |

- **Web Badge:** `forwardRef<HTMLSpanElement>`; accent fill is the `--grad-cta` CSS gradient; dot glow via `box-shadow: 0 0 8px currentColor`.
- **Native Badge:** accent fill is an `expo-linear-gradient` (`gradients.cta`, `{0,0}→{1,1}`) behind the label; dot glow via `shadowColor`/`shadowRadius`.

## 3. Visual spec (tokens — never hardcode)

### Toast

| Aspect | Web | Native |
| --- | --- | --- |
| Card | `width min(360px,92vw)`, `11px 13px`, `--r-sm`, `1px --border-2`, `--bg-1` + `--glass-2` overlay, `--elev-2` | `maxWidth 360`, `11/13`, `radii.sm`, `1px colors.border2`, `colors.bg1`, `nativeShadows.elev2` |
| Left rail | `::before` 3px, `--border-2` → tone | 3px `View`, `colors.border2` → tone |
| Icon | 17px, `--text-dim` → tone color | 17px, `colors.textDim` → tone color |
| Title | `--font-ui` 13.5px 600 / 1.35, `--text` | `fonts.ui` 13.5px 600 / 18, `colors.text` |
| Message | `--font-ui` 12.5px / 1.4, `--text-dim` | `fonts.ui` 12.5px / 17.5, `colors.textDim` |
| `×` | 20×20, `--text-faint`; hover `--text` + `--glass-2` | 20×20, stroke `colors.textFaint`, `hitSlop 6` |

**Tone map (icon + rail):** `success` → `--zone-high`/`zoneHigh`, `warn` → `--zone-mid`/`zoneMid`, `danger` → `--zone-low`/`zoneLow`, `default` → `--border-2`/`border2` rail + `--text-dim` icon.

### Badge

| Tone | Web | Native |
| --- | --- | --- |
| `accent` | `#0A0A12` text on `--grad-cta` | `#0A0A12` text on `gradients.cta` |
| `high`/`mid`/`low` | tone color text on `rgba(zone,.10)` + `rgba(zone,.35)` border | same `rgba` tints |
| `neutral` | `--text-dim` on `--glass-2`, `--border` | `colors.textDim` on `colors.glass2`, `colors.border` |
| pill | `min-w 16` ×16, `2px 6px`, `--r-pill`, `--font-mono` 10px 600, tabular-nums | `min-w 16` ×16, `radii.pill`, `fonts.mono` 10px 600 |
| `dot` | 8×8 circle, `box-shadow 0 0 8px currentColor` (none for neutral) | 8×8 circle, `shadowRadius 4` (none for neutral) |

## 4. States

| State | Web Toast | Native Toast |
| --- | --- | --- |
| Default | `.lk-toast` (neutral rail) | base `View` |
| Tone | `.lk-toast-<tone>` icon + rail tint | `TONE[tone]` icon + rail |
| Dismissable | `.lk-toast-x` shown when `onDismiss` | `×` `Pressable` shown when `onDismiss` |
| `×` hover | `:hover` → `--text` + `--glass-2` | n/a (press only) |

`Badge`: `dot` collapses to an 8px glowing circle; `accent` fills with the CTA gradient; other tones are tinted pills.

## 5. Web ↔ native parity

**Verdict: 🟡 Toast identical, Badge platform-shaped.** `Toast` is visually equivalent on both sides — same card tokens, tone map, left rail, icon/title/message type, and `×`. The only platform-shaped piece is the **Badge accent gradient** (web CSS `--grad-cta` vs native `expo-linear-gradient`), the canonical 🟡 difference. Other notes:

- **Badge location:** web `Badge` lives in `Toast.tsx` (shared stylesheet); native `Badge` is its **own** `Badge.tsx` with its own story. Same prop API either way.
- **Rail/glow substrate:** web rail/dot-glow use `::before` + `box-shadow`; native use a `View` + native shadow. Same visual.
- **A11y role:** web Toast `role="status"`; native `accessibilityRole="alert"` + `liveRegion="polite"` (announces on appear).
- **No positioning/queue:** neither platform ships toast stacking/auto-dismiss — the app owns it.

No capability gap blocks use.

## 6. Composition & usage

- **Composes from:** `Icon` (default tone glyph). Badge composes nothing.
- **Used by:** Toast — transient save/sync/error notices the app stacks. Badge — counts on `TabBar`/avatars, status pills on rows/cards.

```tsx
// web
<Toast tone="success" title="Saved" message="Your workout was logged." onDismiss={dismiss} />
<Badge tone="accent">3</Badge>
<Badge tone="high" dot />

// native — Badge from its own module
<Toast tone="danger" title="Sync failed" message="Tap to retry." onDismiss={dismiss} />
<Badge tone="accent">3</Badge>
```

## 7. Accessibility

- **Web:** Toast `role="status"` (polite live region by default in AT). `×` has `aria-label="Dismiss"`. Badge is decorative text — pair counts with a visible/`aria-label` context on the host control.
- **Native:** Toast `accessibilityRole="alert"` + `accessibilityLiveRegion="polite"` so it's announced; `×` is `accessibilityRole="button"` + `accessibilityLabel="Dismiss"` with `hitSlop`.
- **Contrast:** Toast title is full `--text`; accent Badge uses dark `#0A0A12` text on the bright gradient (legible on every stop).

## 8. Usage rules — Do / Don't

**Do**
- Pick the `tone` that matches the message (`success`/`warn`/`danger`).
- Pass `onDismiss` for anything the user should be able to close.
- Use `Badge dot` for presence/unread indicators; numbered `Badge` for counts.
- Let the app own stacking/positioning/auto-dismiss around the Toast card.

**Don't**
- ✗ Don't hand-roll a notification card or a count pill — use `Toast`/`Badge`.
- ✗ Don't hardcode the rail, tone colors, gradient, or dot glow — tokens.
- ✗ Don't put long content in a Toast (it's a brief notice).
- ✗ Don't reach for the web `Badge` import on native — use the native `Badge` module.
- ✗ Don't pass `className` on native or `style` on web (wrong-platform prop).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom "snackbar" or a re-rolled count chip drifts from the tone map + CTA gradient. Import `Toast`/`Badge`.
- **New need → both platforms.** A new tone or an action slot must be added to `ToastProps`/`BadgeProps` on web **and** native (keeping native Badge in `Badge.tsx`) with the same names/tokens.
- **Tokens only.** Rail, tones, the accent gradient, and the dot glow all come from `@lockin90/tokens`.
- **Parity gate.** Before shipping, confirm the web phone-width toast/badge and native match (same tone, title/message, dismiss, count) — accepting only the gradient-substrate difference.
