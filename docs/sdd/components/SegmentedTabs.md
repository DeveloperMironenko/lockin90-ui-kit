# SDD — `SegmentedTabs`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/SegmentedTabs.tsx` · `packages/ui-native/src/components/SegmentedTabs.tsx` ·
> web CSS `packages/ui/src/styles/components/seg.css` (`.lk-seg*`).
> **Exports (web):** `SegmentedTabs`, types `SegmentedTabsProps`, `SegmentedTab`, `SegmentedTone`, `SegmentedTabItem`.
> **Exports (native):** `SegmentedTabs`, types `SegmentedTabsProps`, `SegmentedTab`, `SegmentedTone`, `SegmentedTabItem` — identical item types, and the native runtime now **renders** the rich form too (see §2).
> **Status:** Shipped. **Parity:** 🟡 same full API incl. the rich-item form (`count` badge + `tone` dot); mint/tint fills via `expo-linear-gradient`/rgba literals vs CSS, and web-only `className`/rest.
> **Stories:** `packages/ui/src/stories/SegmentedTabs.stories.tsx` · `packages/ui-native/src/stories/SegmentedTabs.stories.tsx`.

---

## 1. Overview

The **iOS-style segmented control** — a glass pill *track* of equal-width segments; the active one is a raised lighter pill (`--glass-2` + soft shadow). The compact "switch between 2–4 sibling views" control (Stats / History / Guide / Ranks). Distinct from the underline `Tabs` (text-on-a-rail) and the bottom `TabBar`.

- **`locked`** — indices that are dimmed, **non-interactive** (never fire `onChange`), and show a lock glyph — the `1Y🔒 / All🔒` upsell pattern on a time-range control. **Identical on both platforms.**
- **`tone`** (control-level) — color of the **selected** segment. `'accent'` (default) is the standard raised glass pill (unchanged); `'mint'` paints the active segment with the mint gradient + glow + dark-on-bright label — the onboarding Activity-level control (design `.seg.on.mint`). **Identical on both platforms.** Do not confuse with the per-item `SegmentedTab.tone` below (different prop, different scope).
- **Rich items (both platforms):** a segment may be a `{ label, count?, tone? }` object instead of a plain string — `count` renders a trailing mono badge; per-item `tone` (`ok` mint / `canary` amber / `danger` red) paints the active label + a leading dot. Used in admin/CMS (catalog type counts, the pipeline Off/Canary/On flag). Plain strings remain valid (normalized by `toTab()` on both sides).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `tabs` | `SegmentedTabItem[]` | `['Stats','History','Guide','Ranks']` | ✓ | ✓ | `string \| { label, count?, tone?, icon? }` mixed — **both platforms** (strings normalized by `toTab()`); `icon` renders a leading 13px kit `Icon` before the label (changelog service filter) |
| `appearance` | `'raised' \| 'tint'` | `'raised'` | ✓ | ✓ | `'tint'` = the design changelog `.svc-toggle` treatment: glass track, hairline-bordered 11px segments, ACTIVE = accent tint `rgba(124,92,255,.14)` + accent border `.32` (no raised shadow); count badges shrink to mono 8.5 (pad 1×5, `--border` hairline) and tint cyan (`--accent-2` on `rgba(34,211,238,.1)`) when active |
| `fill` | `boolean` | `false` | ✓ | ✓ | equal segments that may shrink; ≤ 540px labels 12.5px, padding `--space-2` `--space-1` (design onboarding `.seg` at phone width), so five choices fit a phone row; a label still wider than its segment (a long word in uk / ru / es) shrinks to fit, never below the default text size or 11px (`fitFloorPercent`: at the default text size it doesn't shrink; an inline `font-size` from one measure, then whole-percent steps; again when the webfonts arrive and when the row's width changes; once only without `ResizeObserver`), else wraps at a space, else the segments go on rows. Labels that fit keep the stylesheet's size for every `size` / `appearance`. Native: `flex: 1` segments, 12.5 labels on one line that shrink to fit at a larger text size (never below the default text size or 11pt, `fitFloor`), else the segments stack; padding 8 / 4 |
| `invalid` | `boolean` | `false` | ✓ | ✓ | the track's line in `--zone-low` + `aria-invalid`, as an invalid `Input` (a required choice not made). Native: `borderColor: colors.zoneLow` |
| `active` | `number` | `0` | ✓ | ✓ | index of the active segment |
| `onChange` | `(index: number) => void` | — | ✓ | ✓ | fires with the pressed index; never fires for `locked` |
| `locked` | `number[]` | — | ✓ | ✓ | indices dimmed + non-interactive + lock glyph |
| `tone` | `'accent' \| 'mint' \| 'gradient'` | `'accent'` | ✓ | ✓ | **control-level** selected-segment color; `'accent'` = current glass pill (unchanged), `'mint'` = mint gradient + glow + dark label, `'gradient'` = CTA gradient (`--grad-cta`) + glow `0 0 16px rgba(124,92,255,.4)` (native 14px, mobile design) + dark ink `#07080D` label — the design settings `.seg` treatment |
| `size` | `'md' \| 'sm'` | `'md'` | ✓ | ✓ | `'md'` = full-width equal segments (unchanged); `'sm'` = the design settings compact `.seg`: content-hugging pill track (padding 3, gap 2, `--border` hairline, `--glass` fill), mono segments (web 12px/500 p6×14 · native 10.5px/500 p5×11) |
| `className` | `string` | — | ✓ | — | web only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` minus `onChange` (web) | — | ✓ | — | spreads to the track `<div>` |

**Item types (exported from BOTH packages — identical definitions):**
- `SegmentedTone = 'ok' | 'canary' | 'danger'` (per-item tone — do **not** confuse with the control-level `tone: 'accent' | 'mint'` prop).
- `SegmentedTab = { label: string; count?: number; tone?: SegmentedTone }`.
- `SegmentedTabItem = string | SegmentedTab`.

**Full runtime parity:** the three type names resolve identically from either package, and the native runtime now **renders** the rich form — a leading 6×6 tone dot (`TONE_COLOR`: ok → `colors.ok`, canary → `colors.warn`, danger → `colors.bad`) and a trailing mono count pill (10px, `radii.pill`, tabular-nums; active+toned → the tone at 16% tint, active untoned → `colors.glass`, idle → `colors.glass2`), mirroring the web `.lk-seg-dot`/`.lk-seg-count` values. Strings and objects mix freely on both platforms via the same `toTab()`.

- **Web:** plain function; track is `role="tablist"`, each segment a `<button role="tab">`.
- **Native:** plain function; track is `accessibilityRole="tablist"`, each segment a `Pressable` with `accessibilityRole="tab"`. No `...rest`/`style`/`ref`.

## 3. Visual spec (tokens — never hardcode)

**Track** (`.lk-seg` / native `styles.track`):

| Aspect | Value |
| --- | --- |
| Layout | flex row, `gap 4px`, `padding 4px` |
| Background | `--bg-1` / `colors.bg1` |
| Border | `1px --border` / `colors.border` |
| Radius | `--r-pill` / `radii.pill` |

**Segment** (`.lk-seg-tab` / native `styles.tab`):

| Aspect | Value |
| --- | --- |
| Font | `--font-ui` / `fonts.ui`, `13.5px`, weight `600`, `letter-spacing -0.005em` |
| Padding | web `7px 16px` · native `7 / 10` |
| Radius | `--r-pill` / `radii.pill` |
| Idle text | `--text-dim` / `colors.textDim` |
| Active (`tone="accent"`, default) | bg `--glass-2`, text `--text`, `box-shadow 0 1px 2px rgba(0,0,0,.3)` (native mirrors via `shadowOpacity .3`, `elevation 2`) |
| Active (`tone="mint"`) | bg `--grad-mint` / `gradients.mint`, glow `--glow-mint` / `nativeShadows.glowMint`, label `#0A0A12` (dark-on-bright, both platforms) |
| Active (`tone="gradient"`) | bg `--grad-cta` / `gradients.cta`, glow `0 0 16px rgba(124,92,255,.4)` (web) / `0 0 14px …` (native, mobile design), label ink `#07080D` — design `.seg button[aria-pressed=true]` |
| `size="sm"` track | padding 3, gap 2, `--border` hairline, `--glass` fill, content-hugging (web `inline-flex`, native `alignSelf:flex-start`) |
| `size="sm"` segment | `--font-mono` 500, hugs label (`flex: 0 0 auto`): web 12px p6×14 (web design `.seg button`) · native 10.5px p5×11 (mobile design `.seg button`) |
| Locked | `opacity 0.5`, non-interactive, `Icon name="lock" size={12}` |

- **Hover (web):** idle segment text brightens to `--text`.
- **Mint tone (web):** `.lk-seg[data-tone='mint'] .lk-seg-tab.is-active` swaps the active pill to `var(--grad-mint)` + `var(--glow-mint)` + dark label; idle segments unchanged. **Native:** a `gradients.mint` `LinearGradient` fills the active segment behind the label (an absolute fill, `radii.pill`, `nativeShadows.glowMint`). The dark-on-bright `#0A0A12` label matches `Button` `primary`.
- **Rich form (both platforms):** count badge `.lk-seg-count` / native count pill — `--font-mono`/`fonts.mono` `10px` (native `lineHeight 12`), `--glass-2`/`colors.glass2` pill, tabular-nums; per-item tone dot `.lk-seg-dot` / native 6×6 `View` — in `--ok`/`--warn`/`--bad` (`colors.ok/warn/bad`); active toned segments tint label + badge toward the tone (web `color-mix(tone 16%)`, native the flattened `rgba(…,0.16)` literals). Native labels additionally guard overflow with `numberOfLines={2}` + `adjustsFontSizeToFit` (min scale 0.8).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Idle | `.lk-seg-tab` dim | `styles.tab` dim |
| Hover | text → `--text` | n/a |
| Pressed (non-active) | `:active` (browser) | `tabPressed` opacity .7 |
| Active | `.is-active` raised pill; `aria-selected` | `tabActive` raised pill; `accessibilityState.selected` |
| Active + `tone="mint"` | `[data-tone='mint'] .is-active` mint-gradient pill + glow + dark label | mint-gradient `LinearGradient` fill + `nativeShadows.glowMint` + dark label |
| Locked | `.lk-seg-locked` dim + `disabled` + `aria-disabled`; no `onClick` | `tabLocked` dim + `disabled`; no `onPress` |
| Per-item toned active | `.lk-seg-{ok,canary,danger}` tints label/badge | tone dot + `TONE_TINT` count bg + toned label |

## 5. Web ↔ native parity

**Verdict: 🟡 same full API, platform-shaped fills.** The whole contract is now identical on both platforms: track, equal-width segments, raised active pill, sizes, fonts, the **`locked` upsell** (opacity `0.5`, non-interactive/`disabled`, `Icon name="lock" size={12}`, never fires the change handler), the **control-level `tone`** (`accent`/`mint` — same union, same default, same mint gradient + glow + dark `#0A0A12` label), **and the rich item form** — native renders the same count pill + tone dot with matching values (web `color-mix(tone 16%)` ↔ native `rgba(…,0.16)` literals). Remaining differences are substrate only:

- CSS `[data-tone='mint']` gradient vs `expo-linear-gradient` `gradients.mint` fill; hover vs press feedback.
- Web-only `className` + `...rest`; native labels add `numberOfLines={2}` + `adjustsFontSizeToFit` (device overflow guard).

No capability gap blocks use.

## 6. Composition & usage

- **Used for:** 2–4 sibling views on one surface (profile Stats/History/Guide/Ranks; a time-range control with locked Pro ranges).
- **Composes:** `Icon` (the lock glyph; web tone dots are CSS).
- **vs siblings:** use `SegmentedTabs` for a compact pill switch; `Tabs` for an underline text bar; `TabBar` for bottom app nav.

```tsx
// web + native — plain, locked upsell, rich toned + count items (identical props)
<SegmentedTabs tabs={['Stats', 'History', 'Guide']} active={tab} onChange={setTab} />
<SegmentedTabs tabs={['7D', '30D', '1Y', 'All']} active={range} onChange={setRange} locked={[2, 3]} />
<SegmentedTabs tabs={[{ label: 'On', tone: 'ok' }, { label: 'Canary', tone: 'canary', count: 3 }, { label: 'Off', tone: 'danger' }]} active={0} />

// web + native — control-level mint tone (onboarding Activity-level control)
<SegmentedTabs tabs={['Sedentary', 'Light', 'Active', 'Athlete']} active={level} onChange={setLevel} tone="mint" />
```

## 7. Accessibility

- **Kit rule:** CONVENTIONS "Accessibility" (2026-11-10) applies: contrast 4.5:1 text / 3:1 UI, 44pt native / 24px web targets, names from props, errors and changes announced, reduced motion, text scaling never disabled.
- **Web:** track `role="tablist"`; segments `role="tab"` with `aria-selected={i === active}`; locked segments are `disabled` + `aria-disabled`. The lock and tone dot are `aria-hidden`.
- **Native:** track `accessibilityRole="tablist"`; segments `accessibilityRole="tab"` with `accessibilityState={{ selected, disabled }}`.
- **Hit target:** `7px` vertical padding + label; for dense controls on touch ensure the track has enough height — prefer fewer, wider segments on phone.
- **Contrast:** active `--text` on `--glass-2` and idle `--text-dim` both clear minimums.

## 8. Usage rules — Do / Don't

**Do**
- Use `SegmentedTabs` for a small set (2–4) of mutually-exclusive sibling views.
- Use `locked` for the upsell pattern (gated ranges/views) — it's the sanctioned gated-segment look on both platforms.
- Keep `active` controlled by the owner.

**Don't**
- ✗ Don't hand-roll a pill switch — use `SegmentedTabs`.
- ✗ Don't put many segments in one track (it overflows); use `Tabs` or a `Select` instead.
- ✗ Don't hardcode the track/active colors, mono badge, or tone colors — they come from tokens.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom "pill toggle group" re-creating the glass track + raised active pill is a **parity violation** — it diverges web↔native and breaks on token renames.
- **New need → add to BOTH platforms.** A new item field or tone ships to web **and** native `SegmentedTabs` with the same prop shape and tokens — don't fork a local variant.
- **Tokens only.** Track bg `--bg-1`, active `--glass-2`, tone `--ok/--warn/--bad`, mono badge font — all from `@lockin90/tokens`, never literals.
- **Parity gate.** Before shipping a shared screen with a segmented control, confirm the web phone-width and native renders match (same segments, same active pill, same locked treatment, same count/tone rendering).

## Update — 2026-07-10
- **Haptics:** the primary interaction (segment change / row press / panel open) fires `hapticSelection()` (native `optionalHaptics`; no-op without expo-haptics).

## Update — 2026-11-10 (accessibility, 1.35)

- **`kind`** (web + native, `'tabs' | 'choice'`, default `'tabs'`): `'choice'` for a form value. Web: the track is
  a `radiogroup`, each segment a `radio` with `aria-checked` (no `aria-selected`), one Tab stop (the chosen
  segment, else the first unlocked), and ArrowRight / ArrowDown, ArrowLeft / ArrowUp (wrapping), Home and End
  move focus and choose (`onChange`), skipping locked segments. Name it with `aria-label` /
  `aria-labelledby`. Native: `accessibilityRole="radiogroup"`, segments `radio` with `accessibilityState.checked`.
- **Native `accessibilityLabel` / `accessibilityHint`** on the group (a `FormField` passes its label and error).
- **Native targets, same look:** each segment `hitSlop` 7 above / below (`md`, 30 tall) or 11 (`sm`, 23): 44pt.

## Update — 2026-11-10 (running-app audit, 1.35)

- **44 tall** segments at phone width (web) and on native (`minHeight`; the hitSlop is gone). **`fill` labels never leave their segment:** web shrinks to 80% then wraps (`.lk-seg-wrap`), native shrinks then wraps to two lines (`numberOfLines={2}`). Counts are 11px.

## Update — 2026-11-10 (simulator check, 1.35)

- **Never broken inside a word.** Web `fill`: shrinks (the floor is in the 2026-11-11 word-fit update), then wraps only at a space (`word-break: keep-all`, no `overflow-wrap: anywhere`); a single word that still doesn't fit puts the segments on more than one row (`.lk-seg--rows`, each segment its content's width). Native: the measured fit below.

## Update — 2026-11-11 (review fixes, 1.35)

- **Web fit:** when one word needs the segments on rows, every tab is fitted again in the rows layout, so none stays shrunk for the one-row widths.
- **Native count text** line height 13 (was 12) for the 11 font.
- **No ellipsis at all (native):** labels render without `numberOfLines`; large text (`fontScale` > 1.35, as
  ListRow) always stacks the segments. (A rule that read each label's `onTextLayout` missed iOS breaks at the
  default size — "Sedentar/y", "Друго/й", "Нейтральны/й" — and was replaced the same day by the measured fit.)

## Update — 2026-11-11 (measured fit, 1.35)

Native decides from widths it measures, so it can't miss:

- **Measurer (`md`):** an invisible, unreadable absolute `View` (`testID="lk-seg-measure"`, 10000 wide, 0 tall)
  lays out on one line each label, each of its words, `"a a"` / `"aa"` (a space) and each count, in the label's
  own font and the OS text size. Its widths, with the track's width (1 border + 4 padding, 4 gaps, equal
  segments less their padding, dot, icon, count and lock), go to `segmentFit` (exported, pure):
  - a label that fits keeps its size; a `fill` label a little too wide gets a smaller `fontSize` (whole
    percent, down to `fitFloor`: never below the default text size or 11pt, so not at all at the default
    size) and stays on one line;
  - otherwise it wraps between words at that floor; a word still wider than its room, or more than 2 lines,
    stacks the segments. 1pt is kept beside every measured width so rounding never wraps the last letter.
- **No flicker:** until every width and the track's width are in, the track is laid out at `opacity: 0`; the
  first frame shown is the final layout (the track's opacity is always set, 0 or 1: iOS Fabric kept a dropped
  `opacity: 0`). Late fonts or a new width decide again (the measurer stays mounted).
- **Measured twice over:** besides `onLayout`, a layout effect measures the track and every probe from their
  refs (`measure`). A tree mounted while hidden (the app's onboarding while its language loads) gets no
  `onLayout` at all on iOS Fabric, which had left the row invisible; React runs layout effects again when a
  hidden tree is shown.
- **Large text** (`fontScale` > 1.35) always stacks; it is measured too, and a stacked label whose widest word
  is wider than the segment (a half-width form column at AX sizes: "Друго/й") shrinks to fit (`stackedScales`,
  exported; down to `fitFloor`, the default text size). **`sm`** hugs its labels (they never wrap), isn't measured, and stacks only at a
  large text size.
- **Stacked shape:** a stacked track is a tall box, so it takes a container's corners (`radii.md`) and its
  segments (and the gradient fill) a control's (`radii.sm`), never the pill that drew a stadium at AX sizes.
  Web: `.lk-seg--rows` likewise takes `--r`, its segments `--r-sm`.

## Update — 2026-11-11 (inline with a field, shared measurer, 1.35)

- **The same height as a field (owner, 2026-11-11: "the select of gender have to have the same height like
  input, they have to be inline"):** an `md` track is 44 tall with its edge, as Input (it was 54: 4 padding
  around 44 segments). Its segments sit edge to edge (track padding 0 × 2) and take the track's whole height
  (42, plus a 1pt `hitSlop` above and below: the 44pt target is kept); the pill (active fill, tint, tone
  border, gradient and glow) is a separate view drawn inset — 4 from the top and bottom, 2 from each side
  (so 4 at the ends and between pills). Stacked: track padding 2, segments 44, pills inset 2. `sm` is
  unchanged (pill = segment). Label padding inside the pill is kept (segment padding 8, `fill` 6).
- **Web at phone width** (`fill`, not rows, not `tint`): the track is `min-height: 44px` with `padding: 0 2px`,
  segments 42 tall with a transparent `4px 2px` border and `background-clip: padding-box`, so the pill is
  drawn inset as on native.
- The measurer is the shared `WordMeasurer`, and `stackedScales` uses the shared `wordFitScale`
  (`internal/wordFit.tsx`, as FitText).

## Update — 2026-11-11 (word-fit review fixes, 1.35)

- **Floor:** a label never shrinks below the default text size or 11pt (`fitFloor` / web `fitFloorPercent`;
  was 80 % for `fill`, 50 % stacked, web 60 %). At the default text size a `fill` label too wide stacks the
  segments (native) or goes to rows (web) instead of shrinking.
- **Words:** `wordsOf` is the shared `breakableWords`, so a zh / ja label wraps between its characters (it
  was one word, and stacked the segments).
- **Room:** a tint or color-tone segment's hairline is on its absolute pill, so it no longer takes 2pt from
  the label's room.
- **Stacked track:** `alignSelf: 'stretch'` (a parent that doesn't stretch it left it as wide as its labels),
  and while a stacked label is shrunk a narrower track width is not taken (as wide as its content, it would
  shrink the labels again and again); the measure key includes the window width, so a rotation decides
  afresh.
- **Web, a field's height:** a one-line `fill` segment (not rows, not wrapped, not `tint`) has a fixed
  15.6px line, so the track is the Input's 39.6 at desktop width in every script (a CJK fallback font's
  `normal` line made it 43 in zh, 45 in ja).
- **Web, fit kept:** the fit runs again when `invalid`, `className` or `active` change: React rewrites the
  whole class on those renders and dropped the fit's `lk-seg--rows` / `lk-seg-wrap`.

## Update — 2026-11-11 (choice rows: shrink, then balanced rows; owner decision)

Supersedes the stacking and the floor in the updates above. **Web and native follow the same rules**, from
widths measured on one unconstrained line (native: the hidden `WordMeasurer`; web: a hidden probe segment,
`.lk-seg-probe`, in the stylesheet's label font) and the track's width, decided by the pure
`segmentRows` (exported from ui-native `SegmentedTabs`; web `components/segRows.ts`, the same function):

1. **One row** when every label fits it on one line. A `fill` label too wide first **shrinks**, never below
   **11pt / 11px drawn** at the default text size — the only shrink below the design size, and only for
   `fill` (`fitFloor(size, fontScale, true)` / `fitFloorPercent(base, root, true)`); at a larger text size
   the rule stays "never below the default text size": floor = `max(1 / fontScale, 11 / (size × fontScale))`.
   A non-`fill` `md` label never shrinks at the default text size.
2. Else **as few rows of pills as fit**, balanced and in order — 5 → 3 + 2, 4 → 2 + 2, then 2 + 2 + 1… —
   at **every** text size (large text included: no forced list). Above text size 1.35 (native `fontScale`,
   web a root over 1.35 × 16) the labels don't shrink first: they wrap onto rows at their size, and only a
   label alone on its row that is still too wide shrinks, to the floor (`segmentRows`' `aloneScale`) — one
   row of labels each shrunk to a different size read badly at AX sizes. A label alone in a row shorter
   than the fullest first takes the row's whole width; it shrinks only at that width. A row's segments are as wide as the
   fullest row's and a shorter row is centred; a row whose label needs more gets the row's width shared by
   fewer, so **only a label that needs the full width gets a row of its own**. On rows a label may wrap
   between words (2 lines first, then more); on the one row it never wraps (the track stays a field's 44).
   Score: fewer rows, then balanced, then fewer labels wrapped, then the fuller rows first.
3. **Never a column list as a layout mode** (owner, 2026-11-11: "i dont like the list in the column"); one
   label per row happens only when each needs the full width. Last resort: a word wider than the full width
   at the floor breaks (each label its own row, shrunk to the floor).

- **Rows look:** the track is a tall box — a container's corners (native `radii.md`, web `--r`), padding 2,
  the segments edge to edge, each 44 tall (a 44pt / 44px target), the pill (glass, tint, the `gradient` /
  `mint` fill and glow) drawn 2 in all round with a control's corners (`radii.sm` / `--r-sm`), so the
  selected pill is right on either row. Native renders one `View` row per row (`justifyContent: center`,
  each segment its measured width); web keeps one flex track with `flex-wrap`, an inline width per segment
  and a `.lk-seg-break` (flex-basis 100%) after each row. Web rows keep the one row's side padding and gap,
  so the measure holds in both.
- **CJK labels are one word:** `wordsOf` keeps a CJK run whole (a zh / ja option shrinks / wraps / goes on
  rows like any other language, never "アスリー / ト"); native draws it with a word joiner between its
  characters (`glueCJK`), web with `word-break: keep-all` on `fill` segments. Running text elsewhere still
  breaks between CJK characters (`breakableWords`).
- **`sm`** still hugs its labels; above text size 1.35 its pills wrap onto more rows (native
  `flexWrap: 'wrap'`), never a column.
- Native (module exports, not the package index) `segmentFit` / `stackedScales` are replaced by `segmentRows` (`SegmentLayout`: rows, widths,
  scales, wraps); web `segFitPercent` is gone. The web fit no longer rewrites classes: the rows and sizes
  are React state, so a re-render (invalid, a choice made) keeps them.

