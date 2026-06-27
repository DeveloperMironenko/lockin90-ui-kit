# SDD — `EngagementBar`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/EngagementBar.tsx` · `packages/ui-native/src/components/EngagementBar.tsx` ·
> web CSS `packages/ui/src/styles/components/engagement.css` (`.lk-engagement`, `.lk-react*`).
> **Exports:** `EngagementBar`, type `EngagementBarProps`.
> **Status:** Shipped. **Parity:** ✅ identical API + layout; native colors each glyph explicitly (no `currentColor`).
> **Stories:** `packages/ui/src/stories/EngagementBar.stories.tsx` · `packages/ui-native/src/stories/EngagementBar.stories.tsx`.

---

## 1. Overview

The **post / feed footer row** — a thin horizontal strip of icon+count "react" actions (like · comment · share · save) that sits above a card edge. Each action is a pressable icon-button with a `tabular-nums` count beside it; **only the actions whose prop object is provided are rendered** (pass `like` but not `share` and only Like shows).

Active states colorize the glyph: a liked heart fills `bad` (rose) and tints its count; a saved bookmark fills `accent` (violet). The internal `ReactAction` sub-component is private (not exported) — consumers compose the bar purely through the four optional prop objects. Mirrors `.post-foot` / `.react` from the social feed design (`feed.html` / `social.html`).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `like` | `{ count?: number; active?: boolean; onToggle?: () => void }` | — | ✓ | ✓ | renders the heart action when present; `active` fills it `bad` |
| `comment` | `{ count?: number; onPress?: () => void }` | — | ✓ | ✓ | renders the quote/comment action |
| `share` | `{ onPress?: () => void }` | — | ✓ | ✓ | renders the share action (no count) |
| `save` | `{ active?: boolean; onToggle?: () => void }` | — | ✓ | ✓ | bookmark; `margin-left:auto` pushes it to the far right; `active` fills `accent` |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web) | — | ✓ | — | web spreads onto the row `div` (`forwardRef<HTMLDivElement>`) |

- **Web:** `forwardRef<HTMLDivElement>`; the row is a `<div>`, each action a real `<button type="button">` with `aria-pressed`.
- **Native:** plain function component (no ref); each action is a `Pressable`. No `...rest` passthrough beyond `style`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Token | Value |
| --- | --- | --- |
| Row gap | `6px` | between actions |
| Action padding | `7px / 12px` | both platforms |
| Action radius | `--r-pill` / `radii.pill` | 999 |
| Icon size | `16px` | via `<Icon size={16}>` |
| Icon↔count gap | `7px` | both platforms |
| Count font | `--font-mono` / `fonts.mono`, 12px | `tabular-nums` (web), `fonts.mono` (native) |
| Idle glyph/text | `--text-dim` / `colors.textDim` | neutral |
| Like active | `--bad` / `colors.bad` | `#FF4D6D`; web also `transform: scale(1.12)` on the svg |
| Save active | `--accent` / `colors.accent` | `#7C5CFF` |
| Share hover | `--accent-2` (web only) | cyan tint on hover |

- **Web hover:** `.lk-react:hover` → text `--text` + `background: --glass`; share hovers to `--accent-2`.
- **Native press:** `reactPressed` → `backgroundColor: colors.glass`. Save uses `marginLeft: 'auto'` (mirrors `.lk-react-save`).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Idle | `.lk-react` (transparent, dim glyph) | base `Pressable` (transparent) |
| Hover | `.lk-react:hover` → `--text` + `--glass` bg; share → `--accent-2` | n/a (no hover) |
| Pressed | `:active` (browser default) | `reactPressed` → `--glass` bg |
| Like active | `.lk-react-on` → glyph `--bad`, svg fill+stroke `--bad`, scale 1.12 | glyph color `colors.bad`, count tinted `bad` |
| Save active | `.lk-react-on` → glyph `--accent`, svg fill+stroke `--accent` | glyph color `colors.accent` |

## 5. Web ↔ native parity

**Verdict: ✅ identical API + layout.** Same four optional prop objects, same render-only-if-provided rule, same icons (`apple-health` for like, `quote` for comment, `share`, `save`), same 16px glyph / 7px gap / pill padding, same active tints (`bad` for like, `accent` for save), same right-pinned save.

The only difference is substrate-shaped: web styles the glyph via `currentColor` (CSS `fill`/`stroke` cascade on `.lk-react-on svg`), while **native has no `currentColor`** so each `Icon` receives an explicit `color` prop (`like.active ? colors.bad : colors.textDim`, etc.). Web adds a hover state (pointer-only); native uses press feedback instead. Web's like-active glyph scales `1.12`; native does not animate the scale. None of these block use — the bar is visually equivalent at rest and in the active states.

## 6. Composition & usage

- **Composes:** `Icon` (the four glyphs). No other kit primitive.
- **Used by:** social feed `PostCard` footers, journal entry cards, any shareable surface.
- **Counts are display-only** — the component does not own state; the parent flips `like.active` / `save.active` and supplies fresh counts.

```tsx
// web
<EngagementBar
  like={{ count: 128, active: liked, onToggle: () => setLiked(v => !v) }}
  comment={{ count: 12, onPress: openThread }}
  share={{ onPress: share }}
  save={{ active: saved, onToggle: () => setSaved(v => !v) }}
/>

// native — identical props
<EngagementBar
  like={{ count: 128, active: liked, onToggle: () => setLiked(v => !v) }}
  comment={{ count: 12, onPress: openThread }}
  save={{ active: saved, onToggle: () => setSaved(v => !v) }}
/>
```

## 7. Accessibility

- **Web:** each action is a real `<button type="button">` with `aria-label` (`'Unlike'`/`'Like'`, `'Comments'`, `'Share'`, `'Saved'`/`'Save'`) and `aria-pressed={active}` on the toggleable like/save — focusable, Enter/Space activate.
- **Native:** each `Pressable` has `accessibilityRole="button"`, `accessibilityLabel` (same strings), and `accessibilityState={{ selected: active }}`.
- **Label changes with state** so screen readers announce the next action ("Unlike" when liked).
- **Hit target:** `7px/12px` padding + 16px glyph; prefer placing the bar where touch targets don't crowd.

## 8. Usage rules — Do / Don't

**Do**
- Provide only the action objects a surface actually needs — omitting one hides it.
- Keep `like`/`save` controlled: flip `active` and supply the updated `count` from the parent.
- Use the `onToggle` (like/save) vs `onPress` (comment/share) prop per action's contract.

**Don't**
- ✗ Don't hand-roll a like/comment/share row — use `EngagementBar`.
- ✗ Don't add a fifth action by hardcoding an extra button beside it — extend the component on BOTH platforms (new optional prop object) instead.
- ✗ Don't hardcode the active colors — they come from `colors.bad` / `colors.accent`.
- ✗ Don't repurpose the bar for non-react actions (use `Button`/`Chip` for those).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom feed footer that re-creates the icon+count react row is a parity violation — import `EngagementBar`.
- **New react type?** Add a new optional prop object (e.g. `repost?`) to `EngagementBarProps` on **both** platforms with the same icon + active tint — never a one-off local button.
- **Tokens only.** The `bad`/`accent` active tints, the pill radius, and the mono count font come from `@lockin90/tokens`; a hardcoded rose/violet is a bug even if it matches today.
- **Parity gate.** Before shipping a feed surface, confirm the web phone-width and native renders show the same actions, in the same order, with the same active tints.
