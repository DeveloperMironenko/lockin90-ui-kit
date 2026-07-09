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
| `tabs` | `SegmentedTabItem[]` | `['Stats','History','Guide','Ranks']` | ✓ | ✓ | `string \| { label, count?, tone? }` mixed — **both platforms** (strings normalized by `toTab()`) |
| `active` | `number` | `0` | ✓ | ✓ | index of the active segment |
| `onChange` | `(index: number) => void` | — | ✓ | ✓ | fires with the pressed index; never fires for `locked` |
| `locked` | `number[]` | — | ✓ | ✓ | indices dimmed + non-interactive + lock glyph |
| `tone` | `'accent' \| 'mint'` | `'accent'` | ✓ | ✓ | **control-level** selected-segment color; `'accent'` = current glass pill (unchanged), `'mint'` = mint gradient + glow + dark label |
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
| Locked | `opacity 0.5`, non-interactive, `Icon name="lock" size={12}` |

- **Hover (web):** idle segment text brightens to `--text`.
- **Mint tone (web):** `.lk-seg[data-tone='mint'] .lk-seg-tab.is-active` swaps the active pill to `var(--grad-mint)` + `var(--glow-mint)` + dark label; idle segments unchanged. **Native:** a `gradients.mint` `LinearGradient` fills the active segment behind the label (`StyleSheet.absoluteFillObject`, `radii.pill`, `nativeShadows.glowMint`). The dark-on-bright `#0A0A12` label matches `Button` `primary`.
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
