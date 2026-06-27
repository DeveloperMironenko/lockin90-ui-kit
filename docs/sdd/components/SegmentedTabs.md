# SDD — `SegmentedTabs`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/SegmentedTabs.tsx` · `packages/ui-native/src/components/SegmentedTabs.tsx` ·
> web CSS `packages/ui/src/styles/components/seg.css` (`.lk-seg*`).
> **Exports (web):** `SegmentedTabs`, types `SegmentedTabsProps`, `SegmentedTab`, `SegmentedTone`, `SegmentedTabItem`.
> **Exports (native):** `SegmentedTabs`, type `SegmentedTabsProps` (the `SegmentedTab`/`SegmentedTone`/`SegmentedTabItem` types are web-only — native takes `string[]`).
> **Status:** Shipped. **Parity:** 🟡 same core API & visuals; `locked` upsell identical, but web adds an optional rich-item form (per-segment `count` badge + `tone`) not present on native.
> **Stories:** `packages/ui/src/stories/SegmentedTabs.stories.tsx` · `packages/ui-native/src/stories/SegmentedTabs.stories.tsx`.

---

## 1. Overview

The **iOS-style segmented control** — a glass pill *track* of equal-width segments; the active one is a raised lighter pill (`--glass-2` + soft shadow). The compact "switch between 2–4 sibling views" control (Stats / History / Guide / Ranks). Distinct from the underline `Tabs` (text-on-a-rail) and the bottom `TabBar`.

- **`locked`** — indices that are dimmed, **non-interactive** (never fire `onChange`), and show a lock glyph — the `1Y🔒 / All🔒` upsell pattern on a time-range control. **Identical on both platforms.**
- **Rich items (web only):** a segment may be a `{ label, count?, tone? }` object instead of a plain string — `count` renders a trailing mono badge; `tone` (`ok` mint / `canary` amber / `danger` red) paints the active label + a leading dot. Used in admin/CMS (catalog type counts, the pipeline Off/Canary/On flag). Native takes plain `string[]` only.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `tabs` | web `SegmentedTabItem[]` · native `string[]` | `['Stats','History','Guide','Ranks']` | ✓ | ✓ | **platform-shaped** — web accepts `string \| { label, count?, tone? }` mixed; native is `string[]` only |
| `active` | `number` | `0` | ✓ | ✓ | index of the active segment |
| `onChange` | `(index: number) => void` | — | ✓ | ✓ | fires with the pressed index; never fires for `locked` |
| `locked` | `number[]` | — | ✓ | ✓ | indices dimmed + non-interactive + lock glyph |
| `className` | `string` | — | ✓ | — | web only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` minus `onChange` (web) | — | ✓ | — | spreads to the track `<div>` |

**Web-only item types:**
- `SegmentedTone = 'ok' | 'canary' | 'danger'`.
- `SegmentedTab = { label: string; count?: number; tone?: SegmentedTone }`.
- `SegmentedTabItem = string | SegmentedTab` (mixed freely; an internal `toTab()` normalizes plain strings).

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
| Active | bg `--glass-2`, text `--text`, `box-shadow 0 1px 2px rgba(0,0,0,.3)` (native mirrors via `shadowOpacity .3`, `elevation 2`) |
| Locked | `opacity 0.5`, non-interactive, `Icon name="lock" size={12}` |

- **Hover (web):** idle segment text brightens to `--text`.
- **Rich form (web only):** count badge `.lk-seg-count` — `--font-mono` `10px`, `--glass-2` pill, tabular-nums; tone dot `.lk-seg-dot` — `6px` round in `--ok`/`--warn`/`--bad`; active toned segments tint label + badge toward the tone (`color-mix(tone 16%)`).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Idle | `.lk-seg-tab` dim | `styles.tab` dim |
| Hover | text → `--text` | n/a |
| Pressed (non-active) | `:active` (browser) | `tabPressed` opacity .7 |
| Active | `.is-active` raised pill; `aria-selected` | `tabActive` raised pill; `accessibilityState.selected` |
| Locked | `.lk-seg-locked` dim + `disabled` + `aria-disabled`; no `onClick` | `tabLocked` dim + `disabled`; no `onPress` |
| Toned active (web) | `.lk-seg-{ok,canary,danger}` tints label/badge | n/a — no tone on native |

## 5. Web ↔ native parity

**Verdict: 🟡 same core API, web-only enrichment.** The default control — track, equal-width segments, raised active pill, sizes, fonts — is identical, and the **`locked` upsell behavior is identical** (opacity `0.5`, non-interactive/`disabled`, `Icon name="lock" size={12}`, never fires the change handler). One real difference:

- **Rich item form (`count` + `tone`):** web `tabs` accepts `{ label, count?, tone? }` objects (count badge + semantic tone dot); native `tabs` is `string[]` only. Passing an object on native would be a type error. This enrichment serves **admin/CMS web surfaces** (catalog counts, the Off/Canary/On flag) that have no phone-width native counterpart — so the gap doesn't break web≡native on any shared screen. Treat it as **web-only**: do not rely on `count`/`tone` for a screen that must render on both.

Other differences are substrate only (CSS vs `StyleSheet`, hover vs press). The base segmented control is fully equivalent on both platforms.

## 6. Composition & usage

- **Used for:** 2–4 sibling views on one surface (profile Stats/History/Guide/Ranks; a time-range control with locked Pro ranges).
- **Composes:** `Icon` (the lock glyph; web tone dots are CSS).
- **vs siblings:** use `SegmentedTabs` for a compact pill switch; `Tabs` for an underline text bar; `TabBar` for bottom app nav.

```tsx
// web — plain + locked upsell + (web-only) toned + count
<SegmentedTabs tabs={['Stats', 'History', 'Guide']} active={tab} onChange={setTab} />
<SegmentedTabs tabs={['7D', '30D', '1Y', 'All']} active={range} onChange={setRange} locked={[2, 3]} />
<SegmentedTabs tabs={[{ label: 'On', tone: 'ok' }, { label: 'Canary', tone: 'canary', count: 3 }, { label: 'Off', tone: 'danger' }]} active={0} />

// native — plain + locked (string[] only)
<SegmentedTabs tabs={['Stats', 'History', 'Guide']} active={tab} onChange={setTab} />
<SegmentedTabs tabs={['7D', '30D', '1Y', 'All']} active={range} onChange={setRange} locked={[2, 3]} />
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
- ✗ Don't rely on `count`/`tone` for a screen that must also render native — they're web-only.
- ✗ Don't put many segments in one track (it overflows); use `Tabs` or a `Select` instead.
- ✗ Don't hardcode the track/active colors, mono badge, or tone colors — they come from tokens.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom "pill toggle group" re-creating the glass track + raised active pill is a **parity violation** — it diverges web↔native and breaks on token renames.
- **New need → add to BOTH platforms.** If native genuinely needs `count`/`tone` (a phone surface adopts the rich form), add the object item type + badge/dot to native `SegmentedTabs` with the same prop shape and tokens — don't fork a local variant.
- **Tokens only.** Track bg `--bg-1`, active `--glass-2`, tone `--ok/--warn/--bad`, mono badge font — all from `@lockin90/tokens`, never literals.
- **Parity gate.** Before shipping a shared screen with a segmented control, confirm the web phone-width and native renders match (same segments, same active pill, same locked treatment) — and that you didn't use a web-only `count`/`tone` on it.
