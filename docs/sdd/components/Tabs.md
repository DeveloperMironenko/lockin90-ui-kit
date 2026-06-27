# SDD — `Tabs`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Tabs.tsx` · `packages/ui-native/src/components/Tabs.tsx` ·
> web CSS `packages/ui/src/styles/components/tabs.css` (`.lk-tabs*`).
> **Exports:** `Tabs`, type `TabsProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; platform-shaped impl (web CSS `::after` underline with a scale-in animation vs native `expo-linear-gradient` underline, no animation; web-only hover).
> **Stories:** `packages/ui/src/stories/Tabs.stories.tsx` · `packages/ui-native/src/stories/Tabs.stories.tsx`.

---

## 1. Overview

The **underline tab bar** — a horizontal row of text tabs along a 1px bottom rail; the active tab is brighter and carries a **2px accent-gradient underline** sitting on the rail. The "section switcher within a page" control (Overview / Activity / Settings).

It is distinct from its two siblings: `SegmentedTabs` is a pill *track* (compact iOS control), `TabBar` is the bottom app-nav bar. Reach for `Tabs` when you want a lightweight, text-first, in-page section switch on a wide-ish surface. It is the *only* sanctioned underline-tab primitive (§9).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `tabs` | `string[]` | `['Overview','Activity','Settings']` | ✓ | ✓ | one button per label |
| `active` | `number` | `0` | ✓ | ✓ | index of the active tab |
| `onChange` | `(index: number) => void` | — | ✓ | ✓ | fires with the pressed tab index |
| `className` | `string` | — | ✓ | — | web only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` minus `onChange` (web) | — | ✓ | — | spreads to the rail `<div>` |

- **Web:** plain function; rail is a `<div role="tablist">`, each tab a `<button role="tab">` with `aria-selected`.
- **Native:** plain function; rail is a `View accessibilityRole="tablist"`, each tab a `Pressable` (`accessibilityRole="tab"`). No `...rest`/`style`/`ref`.

## 3. Visual spec (tokens — never hardcode)

**Rail** (`.lk-tabs` / native `styles.rail`):

| Aspect | Value |
| --- | --- |
| Layout | flex row, `align-items: flex-end` |
| Rail line | `border-bottom 1px --border` / `borderBottomColor colors.border` |

**Tab** (`.lk-tabs-tab` / native `styles.tab`):

| Aspect | Value |
| --- | --- |
| Font | `--font-ui` / `fonts.ui`, `14px`, weight `600`, `letter-spacing -0.005em` (native `-0.07`) |
| Padding | `10px 4px` (native `paddingVertical 10 / paddingHorizontal 4`) |
| Spacing | `margin-right 22px` (last `0`) |
| Idle text | `--text-dim` / `colors.textDim` |
| Active text | `--text` / `colors.text` |
| Underline | `2px`, `border-radius 2px`, `--grad-cta` / native `gradients.cta`; sits at `bottom: -1px` (on the rail) |

- **Web underline:** a `::after` pseudo-element filled `--grad-cta`, `transform: scaleX(0)` by default, **scales in from center** (`scaleX(1)`) when `.is-active` (`transition .25s var(--ease)`).
- **Native underline:** an absolutely-positioned `LinearGradient` (`gradients.cta`, `start {0,0}`→`end {1,0}`) rendered only when active, `bottom: -1`, `left/right: 0`, `height 2`. No scale-in animation.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Idle | `.lk-tabs-tab` `--text-dim`, underline `scaleX(0)` | dim, no underline |
| Hover | text → `--text` | n/a |
| Pressed | `:active` (browser) | `tabPressed` opacity .7 |
| Active | `.is-active` `--text` + underline `scaleX(1)`; `aria-selected` | `--text` + gradient underline; `accessibilityState.selected` |

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped impl.** Identical tab model (`string[]` + `active` + `onChange`), 14px/600 type, `22px` inter-tab spacing, 1px rail, brighter active text, and the 2px `--grad-cta` underline on the rail. Differences are substrate only:

- **Underline mechanism:** web is a CSS `::after` pseudo that **animates** (`scaleX(0)→1` from center); native is a conditionally-rendered `LinearGradient` with **no animation** (no perf-cheap equivalent — consistent with the kit's other CSS-only motion). The static result is identical.
- **Hover:** web idle tabs brighten on hover; native has no hover (press feedback instead).
- **Substrate:** `<button>`+CSS vs `Pressable`+`expo-linear-gradient`.

No capability gap blocks use — both render the same underline tab bar.

## 6. Composition & usage

- **Used for:** in-page section switching on a card/detail surface (Overview/Activity/Settings).
- **vs siblings:** `SegmentedTabs` (compact pill switch), `TabBar` (bottom app nav).
- Controlled — the owner holds `active` and renders the matching panel below.

```tsx
// web
<Tabs tabs={['Overview', 'Activity', 'Settings']} active={tab} onChange={setTab} />
{tab === 0 ? <Overview /> : tab === 1 ? <Activity /> : <Settings />}

// native
<Tabs tabs={['Overview', 'Activity', 'Settings']} active={tab} onChange={setTab} />
{tab === 0 ? <Overview /> : tab === 1 ? <Activity /> : <Settings />}
```

## 7. Accessibility

- **Web:** rail `role="tablist"`; each tab `role="tab"` with `aria-selected={i === active}`. (Panels should carry `role="tabpanel"` + an `aria-labelledby` link in the consumer.)
- **Native:** rail `accessibilityRole="tablist"`; tabs `accessibilityRole="tab"` + `accessibilityState={{ selected }}`.
- **Hit target:** `10px` vertical padding + label; for touch-dense native use, ensure adequate spacing (the default `22px` gap helps).
- **Contrast:** active `--text` and idle `--text-dim` both clear text-contrast minimums.

## 8. Usage rules — Do / Don't

**Do**
- Use `Tabs` for text-first in-page section switching.
- Keep `active` controlled and render the matching panel below.
- Use short, single-word labels so the row fits without wrapping.

**Don't**
- ✗ Don't hand-roll an underline tab row — use `Tabs`.
- ✗ Don't use `Tabs` for bottom app nav (`TabBar`) or a compact 2–4 pill switch (`SegmentedTabs`).
- ✗ Don't hardcode the `--grad-cta` underline, rail color, or type — they come from `@lockin90/tokens`.
- ✗ Don't overflow the rail with many long labels (no built-in scroll); use a `Select` instead.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom underline tab bar re-creating the gradient underline + active brightening is a **parity violation** — it diverges web↔native and breaks on token renames.
- **New need → add to BOTH platforms.** Need badges on tabs, scrollable overflow, or icon+label tabs? Add it to `Tabs` on web AND native (same prop, same tokens) — never a one-off.
- **Tokens only.** Underline `--grad-cta`, rail `--border`, `--text`/`--text-dim`, `--font-ui` — all from tokens; never literals.
- **Parity gate.** Before shipping a screen with section tabs, confirm the web phone-width and native renders match (same labels, same active text + underline).
