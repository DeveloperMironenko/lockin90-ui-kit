# SDD — `TabBar` (+ `FAB` cross-ref)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitives.
> **Source:** `packages/ui/src/components/TabBar.tsx` · `packages/ui-native/src/components/TabBar.tsx` ·
> web CSS `packages/ui/src/styles/components/tabbar.css` (`.lk-tabbar*`, `.lk-fab*`).
> **Exports:** `TabBar`, `FAB`, types `TabBarItem`, `TabBarProps`, `FABProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; platform-shaped impl (web `<button>`+CSS hover/blur vs native `Pressable`+`expo-linear-gradient`; the active-tab icon glow is web-only).
> **Stories:** `packages/ui/src/stories/TabBar.stories.tsx` · `packages/ui-native/src/stories/TabBar.stories.tsx`.

---

## 1. Overview

Two **mobile navigation atoms** from one file:

- **`TabBar`** — the bottom navigation bar: a glass row of icon-over-label tab buttons pinned to the bottom of a screen. The active tab glows `--accent`; the rest sit faint. Optional **`fabIndex`** promotes one item to an **elevated center FAB** — a `grad-cta` rounded-square tile that overhangs the bar top.
- **`FAB`** (secondary export) — a standalone floating action button: a circular `grad-cta` button with a strong glow + lift. With a `label` it grows into an **extended pill** FAB. Positioning is the consumer's job.

These are the *only* sanctioned bottom-nav and floating-action primitives. `TabBarItem.icon` accepts either a custom node or an **`IconName` string** — a string resolves against the shared glyph set, auto-tinted to the tab's active/inactive color.

## 2. API contract

### `TabBar`

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `items` | `TabBarItem[]` | 5-tab Home/Log/Coach/Stats/More | ✓ | ✓ | `TabBarItem = { icon: ReactNode \| IconName; label: string }` |
| `active` | `number` | `0` | ✓ | ✓ | index of the active tab |
| `onChange` | `(index: number) => void` | — | ✓ | ✓ | fires with the pressed tab index |
| `fabIndex` | `number` | — | ✓ | ✓ | index rendered as the elevated center FAB tile |
| `onFabPress` | `() => void` | — | ✓ | ✓ | FAB-item handler; falls back to `onChange(fabIndex)` |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLElement>` minus `onChange` (web) | — | ✓ | — | spreads to the `<nav>` |

### `FAB`

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `icon` | `ReactNode` | `Icon name="plus" size={22}` | ✓ | ✓ | center glyph |
| `label` | `string` | — | ✓ | ✓ | present → extended pill FAB; absent → circle |
| `onClick` / `onPress` | handler | — | `onClick` (via `...rest`) | `onPress` | **platform-shaped** handler |
| `disabled` | `boolean` | — | ✓ (rest) | ✓ | dims + blocks press |
| `aria-label` / `accessibilityLabel` | `string` | `'Add'` (or `label`) | `aria-label` | `accessibilityLabel` | platform-shaped a11y label |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `ButtonHTMLAttributes` (web) | — | ✓ | — | spreads to `<button>` |

- **Web:** both render `<button type="button">`; `TabBar` is a `<nav aria-label="Primary">`.
- **Native:** both render `Pressable`; the FAB tile / button bodies are `expo-linear-gradient` `LinearGradient`s.

## 3. Visual spec (tokens — never hardcode)

**TabBar** (`.lk-tabbar` / native `styles.bar`):

| Aspect | Value |
| --- | --- |
| Layout | flex row, `justify space-around`, `padding 8px 6px`, full width |
| Background | `--bg-1` / `colors.bg1`, top border `1px --border` / `colors.border` |
| Blur (web) | `backdrop-filter: blur(20px) saturate(120%)` + top shadow `0 -8px 30px -12px rgba(0,0,0,.6)` |
| Tab icon | `22px`; label `--font-mono` / `fonts.mono`, `10px`, weight `500`, `letter-spacing .06em` |
| Idle tab | `--text-faint` / `colors.textFaint`; hover (web) `--text-dim` |
| Active tab | `--accent` / `colors.accent`; web adds `drop-shadow(0 0 6px accent 55%)` glow on the icon |
| Center-FAB tile | `44×44`, `margin-top -24px` (overhang), `border-radius 15px`, `--grad-cta`, `glow-accent`, `3px --bg-0` border, dark glyph (`#08090F` web / `#08090F` native) |

**FAB** (`.lk-fab` / native `styles.fab`):

| Aspect | Value |
| --- | --- |
| Size | circle `56×56`; extended `height 52`, `padding 0 22 0 18` (native `paddingLeft 18 / paddingRight 22`) |
| Radius | `--r-pill` / `radii.pill` |
| Background | `--grad-cta` / `gradients.cta`, `background-size 160% 160%` (web) |
| Glyph color | `#0A0A12` (dark-on-bright) |
| Shadow | `--glow-accent` + `0 8px 24px -8px rgba(0,0,0,.6)` (native `nativeShadows.glowAccent`) |
| Label | `--font-ui` / `fonts.ui`, `14px`, weight `600` |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Idle tab | `--text-faint` | `colors.textFaint` |
| Tab hover | `--text-dim` | n/a |
| Active tab | `.is-active` `--accent` + icon glow | accent tint (no icon glow — see §5) |
| FAB rest | glow + gradient | glow + gradient |
| FAB hover | `translateY(-2px)` + intensified glow | n/a |
| FAB pressed | `:active` `translateY(0) scale(.96)` | `fabPressed` `scale(.96)` |
| FAB disabled | `:disabled` opacity .5, `cursor not-allowed`, no transform | `fabDisabled` opacity .5 |

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped impl.** Both share the item model (`icon: ReactNode | IconName` + `label`), the 5-tab default set, the accent-active treatment, the `fabIndex` elevated-center tile (44×44, −24 overhang, `grad-cta`, `glow-accent`, 3px `--bg-0` border), and the standalone `FAB` (circle ↔ extended pill, `grad-cta`, dark glyph). By-necessity differences:

- **Handler / a11y prop on `FAB`:** web `onClick`/`aria-label` vs native `onPress`/`accessibilityLabel` — the intentional split. `TabBar` uses the same `onChange`/`onFabPress` on both.
- **Gradient:** web CSS `--grad-cta` (animated `background-size`) vs native `expo-linear-gradient gradients.cta` (`start {0,0}`→`end {1,1}`). No native gradient animation — acceptable.
- **Active-tab icon glow:** web layers an icon-shaped `drop-shadow` glow on the active tab; **native uses the accent tint alone** — a raw RN shadow on the transparent icon wrap renders as a boxy square glow, so it's intentionally dropped (documented in-source). The active tab still reads clearly via color. Minor, non-blocking.
- **Backdrop blur:** the bar's `backdrop-filter` glass blur is web-only (no RN equivalent); native uses the solid `--bg-1` bar.

No capability gap blocks use — both render an equivalent bottom nav + FAB.

## 6. Composition & usage

- **`TabBar`:** pinned bottom nav for the app shell; pass `fabIndex` (typically the center "Log" tab) for the elevated FAB tile.
- **`FAB`:** a standalone floating action; the consumer positions it (e.g. `position: fixed`/absolute, bottom-right).
- **Composes:** `Icon` (string `IconName` glyphs), `expo-linear-gradient` (native gradient bodies).

```tsx
// web
<TabBar
  items={[{ icon: 'star', label: 'Home' }, { icon: 'plus', label: 'Log' }, { icon: 'timer', label: 'Stats' }]}
  active={tab}
  onChange={setTab}
  fabIndex={1}
  onFabPress={openLog}
/>
<FAB icon={<Icon name="plus" size={22} />} onClick={create} aria-label="New entry" />
<FAB label="New" onClick={create} />

// native
<TabBar items={items} active={tab} onChange={setTab} fabIndex={1} onFabPress={openLog} />
<FAB onPress={create} accessibilityLabel="New entry" />
<FAB label="New" onPress={create} />
```

## 7. Accessibility

- **TabBar:** web `<nav aria-label="Primary">`; the active tab carries `aria-current="page"`. Native is `accessibilityRole="tablist"` with each tab `accessibilityRole="tab"` + `accessibilityState={{ selected }}`.
- **FAB:** always has an accessible name — web `aria-label` defaults to `'Add'` (icon-only) or the `label`; native `accessibilityLabel` defaults the same and sets `accessibilityRole="button"`.
- **Hit target:** tabs span equal flex columns with `8px` bar padding; the FAB is ≥52px — both ≥44px touch targets.
- **Contrast:** dark glyph `#0A0A12`/`#08090F` on the bright gradient clears contrast on every stop; idle `--text-faint` labels are decorative-adjacent but paired with glyphs.

## 8. Usage rules — Do / Don't

**Do**
- Use `TabBar` for bottom app navigation; keep it pinned to the bottom.
- Use `fabIndex` for the one elevated center action; wire `onFabPress`.
- Use string `IconName`s in `items` so glyphs auto-tint to active/inactive.
- Use `FAB` (extended for a labelled action) for a single floating action; position it yourself.

**Don't**
- ✗ Don't hand-roll a bottom nav or floating button — use `TabBar`/`FAB`.
- ✗ Don't put more than one center FAB (`fabIndex`) or more than one `FAB` per screen.
- ✗ Don't pass `onClick`/`aria-label` on native `FAB` or `onPress`/`accessibilityLabel` on web (wrong-platform prop).
- ✗ Don't hardcode the gradient, glow, accent, or bar background — they come from `@lockin90/tokens`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom bottom bar or a re-created `grad-cta` circular button (glow + overhang) is a **parity violation** — it diverges web↔native and breaks on token renames; the `primary` gradient + glow is owned by `Button`/`FAB`/`grad-cta`.
- **New need → add to BOTH platforms.** Need a badge count on a tab, a hidden/scroll-aware bar, or a mini FAB? Add it to `TabBar`/`FAB` on web AND native (same prop, same tokens) — never a one-off.
- **Tokens only.** Bar bg `--bg-1`, accent, `--grad-cta`, `--glow-accent`, mono labels — all from tokens; never literals (the dark glyph `#0A0A12`/`#08090F` is the deliberate dark-on-gradient constant, matched on both platforms).
- **Parity gate.** Before shipping the app shell, confirm the web phone-width bottom bar + FAB and the native ones match (same items, same active treatment, same FAB tile).
