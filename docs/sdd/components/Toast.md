# SDD — `Toast` (+ `Badge` cross-ref)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Toast.tsx` (web Toast **+ Badge**) · `packages/ui-native/src/components/Toast.tsx` · web CSS `packages/ui/src/styles/components/toast.css` (`.lk-toast*`) + `packages/ui/src/styles/primitives.css` (`.lk-chip*` / `.lk-chip-sm*` — **web Badge's actual markup**, see below).
> **Exports:** `Toast`, `Badge`, type `ToastTone`, type `ToastProps`, type `BadgeTone`, type `BadgeProps`. **Native Badge lives in its own `Badge.tsx`** (separate file + `Badge.stories.tsx`), not in `Toast.tsx`.
> **Status:** Shipped. **Parity:** 🟡 Toast is visually identical; **Badge**'s accent fill is a CSS gradient (web) vs `expo-linear-gradient` (native).
> **Web Badge internals (new):** `Badge` is now a **thin wrapper rendering `<Chip size="sm">`** — see §2/§3. Exports and the `Badge`/`BadgeTone`/`BadgeProps` names are unchanged; only the implementation moved. The old standalone `.lk-badge*` CSS was **deleted** from `toast.css`.
> **Stories:** `packages/ui/src/stories/Toast.stories.tsx` (shows Badge) · `packages/ui-native/src/stories/Toast.stories.tsx` · native `Badge.stories.tsx`.

---

## 1. Overview

Two tiny status primitives sharing one source file (`Toast.tsx`) but, on web, **separate** stylesheets — `Toast` has its own `toast.css`; `Badge` now borrows `Chip`'s `primitives.css` rules instead of shipping its own:

- **`Toast`** — a compact floating notification card: a tone-tinted leading icon, a bold title + optional dimmer message, a subtle tinted **left accent rail**, and an optional `×` dismiss. Four tones: `default`, `success`, `warn`, `danger`.
- **`Badge`** (cross-ref) — a tiny count/status pill, or a bare glowing **dot**. Tones: `accent` (CTA-gradient fill), `high`, `mid`, `low`, `neutral`. **On web, `Badge` is now a thin wrapper rendering `<Chip size="sm">`** — it ships no CSS of its own anymore (see §2/§3); native `Badge` is unaffected, still its own standalone component (see §5).

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
| `filled` | `boolean` | `false` | ✓ | ✓ | the tone's color fills the card (no rail); title, message (75%), icon and `×` in `--bg-0` on it. `default` stays the raised glass |
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

- **Web Badge (thin wrapper):** `forwardRef<HTMLSpanElement>` that renders `<Chip ref={ref} size="sm" tone={tone} dot={dot} className={className} {...rest}>{dot ? undefined : children}</Chip>` — `children` is force-cleared to `undefined` whenever `dot` is set (mirrors `Chip`'s own dot-collapse). Accent fill is `Chip`'s `.lk-chip-sm.lk-accent` filled `--grad-cta` gradient rule; dot glow is `.lk-chip-sm.lk-dot`'s `box-shadow: 0 0 8px currentColor`. No Badge-specific CSS remains — see `Chip.md` §3 (`size="sm"`) for the full tone/dot spec.
- **Native Badge (unaffected):** its own standalone component (`Badge.tsx`), not touched by the web refactor; accent fill is an `expo-linear-gradient` (`gradients.cta`, `{0,0}→{1,1}`) behind the label; dot glow via `shadowColor`/`shadowRadius`.

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

These web values are literally `Chip.tsx`'s `.lk-chip.lk-chip-sm*` rules in `primitives.css` — not a
`.lk-badge*` selector (that class was removed). Every number above is byte-identical to what the
retired standalone `Badge` rendered; this was a real visual delta between `md` and the old badge
(filled accent, bare dot, tighter box) that got preserved by scoping it to `Chip`'s `size="sm"`.


### `filled` (both platforms)

| Part | Spec |
| --- | --- |
| Card | the tone's colour: `success` `--zone-high`, `warn` `--zone-mid`, `danger` `--zone-low`; `default` the opaque `--bg-2`. Border transparent |
| Left rail | none |
| Icon, title, `×` | `--bg-0` (on `default`: unchanged) |
| Message | `--bg-0` at 75 % (on `default`: unchanged) |

Web colours the icon and message wrappers, so a custom `icon` or a node `message` inherits the ink.
**Native** has no colour inheritance outside `Text`: the default glyph and a string `message` get the
ink, a custom `icon` or a node `message` carries the colour the app gives it (pass `colors.bg0` on a
filled toast).

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

- **Badge location:** web `Badge` lives in `Toast.tsx` (still its own module, no longer a shared stylesheet — it now renders `Chip` and ships zero CSS of its own, see §2); native `Badge` is its **own** `Badge.tsx` with its own story. Same prop API either way, and the web implementation swap is invisible to callers — renders identically to the pre-refactor `.lk-badge*` output.
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

- **Kit rule:** CONVENTIONS "Accessibility" (2026-11-10) applies: contrast 4.5:1 text / 3:1 UI, 44pt native / 24px web targets, names from props, errors and changes announced, reduced motion, text scaling never disabled.
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
- **New need → both platforms.** A new tone or an action slot must be added to `ToastProps`/`BadgeProps` on web **and** native (keeping native Badge in `Badge.tsx`) with the same names/tokens. On web, a new `BadgeTone` first needs the matching tone on `Chip` (`ChipTone` + the `.lk-chip-sm` treatment in `Chip.md` §3) — `Badge` itself has no tone CSS to edit anymore, since it's a thin wrapper.
- **Tokens only.** Rail, tones, the accent gradient, and the dot glow all come from `@lockin90/tokens`.
- **Parity gate.** Before shipping, confirm the web phone-width toast/badge and native match (same tone, title/message, dismiss, count) — accepting only the gradient-substrate difference.

## Update — 2026-11-10 (accessibility, 1.35)

- **`dismissLabel`** (web + native) names the × (default `'Dismiss'`, an English fallback; apps pass it).
- **Roles:** web `role="alert"` for `danger`, `status` otherwise. Native stays `accessibilityRole="alert"`; its
  live region is `assertive` for `danger`, `polite` otherwise.
- **Close target:** native `hitSlop` 12 (20 + 24 = 44pt); web an invisible `::before` 24px (44 at phone width).

## Update — 2026-11-11 (above an open Sheet / Modal)

- **Native:** an app's toast goes in a **`TopLayer`** (see `TopLayer.md`): drawn inside the top-most open kit
  `Sheet` / `Modal` (native windows the page can't draw over), in place when none is open. Placement, timing
  and announcing stay the app's.

## Update — 2026-11-11 (owner: the new look, Undo with a countdown; web + native)

Supersedes the `filled` look and §3's rail: the owner said the solid green "ruins the style".

- **Look (both):** the dark glass card, as other cards: `--card` / `colors.card` with the card blur (web
  `backdrop-filter: blur(16px) saturate(120%)`; native `expo-blur` intensity 24 where installed), solid
  `--bg-1` / `colors.bg1` under Reduce Transparency (`prefers-reduced-transparency` / iOS setting, new internal
  `useReduceTransparency`). Radius `--r` / `radii.md` (16), padding 9 / 12 / 9 / 10, min height 48, soft shadow
  `--elev-2` / `nativeShadows.elev2`. **Edge** 1px in the tone at an alpha that keeps it 3:1 on the card and on
  the solid fill (it marks the state): success `rgba(52,245,197,.45)` (3.5:1), warn `rgba(255,176,32,.5)`
  (3.3:1), danger `rgba(255,77,109,.7)` (3.3:1); default `--border-2`. **Icon** 16 in a 28 circle of the tone at
  16 %, the glyph in the tone (8.9:1 success). **Title** 14 / 600 `--text` (16:1). No rail.
- **Enter:** a fade and an 8px slide down over 200ms; a fade only under reduced motion.
- **`filled`:** deprecated, ignored (every toast is the glass card); removed in the next major. Nothing uses it.
- **Action (both):** `actionLabel` + `onAction`: a text button in `--accent-2` (10:1), 14 / 600, named by its
  label; web 28px tall with a 44px hit area at phone width, `pointer-events: auto` inside a click-through layer;
  native 28pt with `hitSlop` to 44pt. A toast with an action takes the pointer (web `.lk-toast-has-action`).
- **Countdown (only with an action):** `duration` (ms) + `onTimeout`. A 2px (2pt) line along the bottom edge,
  inside the rounded corners (the card clips it), in the edge's colour (3:1), shrinking from full to nothing
  toward the start; `onTimeout` fires only when it runs out. It **holds** while the toast is hovered, pressed or
  has focus (web: CSS `animation-play-state: paused` on `:hover`, `:focus-within`, `.is-held` from
  pointerdown; native: touch start / end on the card, focus on the action), WCAG 2.2.1. Under reduced motion it
  steps down once a second (web `steps(n)` with its real duration, exempt from the global animation freeze;
  native one `setValue` a second). The line is hidden from screen readers (no per-second announcement).
  **Native screen readers:** VoiceOver's focus can't be seen from JS, so while a screen reader is on the
  countdown holds and a × (`dismissLabel`) ends it at once (`onTimeout`).
- **Apps:** a confirmation for about 4 s; a toast with Undo about 6 s (its `duration`). The app announces it
  (the title and that it can be undone), never the countdown.

## Update — 2026-11-11 (owner's pick: variant C — slim, filled Undo with a seconds ring)

Supersedes the sizes, the action and the countdown line of the update above.

- **Tones:** `success` (a save, a completed change, "Photo removed"), `danger` (a failure), `warn`, new
  **`info`**; each sets the edge and the icon: ok `#34F5C5` edge .45 (3.5:1), bad `#FF4D6D` edge .7 (3.3:1),
  warn `#FFB020` edge .5 (3.3:1), info `#6E7BFF` (`--info` / `colors.info`) edge .7 (3.2:1); the icon's circle
  is the tone at .14. Text white; the glass surface as above.
- **Slim:** padding 6 / 6 / 6 / 10, gap 10, icon circle 22 (glyph 13), message 13.5 / 600, radius 16
  (`--r` / `radii.md`). No min height.
- **Action** (`actionLabel` + `onAction`): **filled** with the CTA gradient, label `#080A12` 12.5 / 600
  (4.5:1 at every point of the gradient), 26 tall with a 44px / 44pt hit area (web `::before`, native
  `hitSlop` 9 / 4), corners 10 (`--r-sm` / `radii.sm`: the toast's 16 less its 6 padding), padding 0 10 0 5,
  gap 5 (padding 0 10 without the ring); pressed scales to .98, web focus the `--accent-2` ring. Without `duration` (a "Try again") it has no
  ring.
- **Seconds ring** (with `duration`): inside the action, left; 16, stroke 1.8 in the label's colour over a
  .22 track, the whole seconds left in the middle (8.5 / 700, tabular, rounded up: 6, 5… 1); the arc drains
  as time passes (the preview's geometry: `stroke-dashoffset = C × (1 − left)`, rotated −90°). Redrawn each
  frame; under reduced motion it steps (whole seconds). It holds while the toast is hovered (web), pressed /
  touched, or the action focused, and (native) while a screen reader is on, whose × ends it. Hidden from
  screen readers: they hear the app's announcement and an action named by its label only. `onTimeout` only
  at 0. **No bottom line.**

## Update — 2026-11-11 (owner: the toast's surface is a card's)

- **Surface (both):** the card's colour on `--bg-0`, opaque: `--card-solid` / `colors.cardSolid` (`#13151D`,
  new token). A toast floats over photos and fields, where the translucent `--card` left `--text-dim` at 4.3:1
  over white; opaque it reads as a card on the page and keeps the title 16:1, the message 8.6:1. No blur
  (nothing shows through), and no Reduce Transparency variant (native `useReduceTransparency` is gone, it had
  no other user). Edge and icon still follow the tone. Radius 16 (container), the action 10 (control), as
  before.

- **Final (owner, same day): every corner 10.** Read every 16 / 22 above as 10 (`radii.md` / `radii.lg` and `--r` / `--r-lg` are 10).

## Update — 2026-11-11 (owner: the audit batch, U9 / U10 / U20)

- **Announced (web, U10):** the toast's region (`role="status"`, `alert` for danger) renders at once with its
  text hidden (`visibility: hidden`) and shows it `LIVE_REVEAL_MS` (100 ms) later, so a screen reader reads
  it (a region that mounts with its text is often silent). An app that remounts the toast per event (keyed)
  gets each one announced.
- **The countdown holds while focus is anywhere in the toast (web, U9):** the action, ×, a link in the
  message; moving between them keeps the hold (`relatedTarget` inside the toast).
- **New `paused` (web + native):** holds the countdown from outside, for the app's own way to the same action
  (an "Undo" beside the photo) while that has focus.
- **New `actionKeys` (web):** a shortcut for the action in `aria-keyshortcuts` form ("Control+Z Meta+Z"); while
  the toast shows, pressing it (outside a text field) calls `onAction`, and the action carries
  `aria-keyshortcuts`. The app says the shortcut in its words (in `message` or the action's name) so it is
  heard with the announcement. Native keeps holding the countdown while a screen reader is on.
- **Native ring number (U20):** no `allowFontScaling={false}` (CONVENTIONS: text scaling is never disabled);
  the ring (16pt) and the action (min 26) grow with the text size (up to 2×), so the number fits.
