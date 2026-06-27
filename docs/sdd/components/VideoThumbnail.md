# SDD — `VideoThumbnail`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/VideoThumbnail.tsx` · `packages/ui-native/src/components/VideoThumbnail.tsx` ·
> web CSS `packages/ui/src/styles/components/videothumb.css` (`.lk-vthumb*`).
> **Exports:** `VideoThumbnail`, type `VideoThumbnailProps`.
> **Status:** Shipped. **Parity:** 🟡 same API (web `onClick` ↔ native `onPress`) + visuals; web play disc uses `backdrop-filter` blur (RN can't) and adds a hover lift; native dims on press.
> **Stories:** `packages/ui/src/stories/VideoThumbnail.stories.tsx` · native equivalent.

---

## 1. Overview

A **media tile** with a centered glass **play disc** and an optional **duration** badge — the Guide "Videos" strip. It's sized by `width` + the `aspect` ratio (`height = round(width / aspect)`), renders the poster image (object-fit cover) when `src` is given, else a subtle **violet flux-gradient placeholder**.

When an `onClick` (web) / `onPress` (native) handler is set, the tile becomes **interactive** (a `<button>` with hover lift + brighter overlay on web; a `Pressable` that dims on native); otherwise it's a static container. It exists as the one sanctioned video-poster tile so media strips look identical web ↔ native.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `src` | `string` | — | ✓ | ✓ | poster URL; absent → gradient placeholder |
| `alt` | `string` | `''` (web) | ✓ | ✓ | web `<img alt>`; native `Image`/`Pressable` `accessibilityLabel` |
| `duration` | `string` (e.g. `'0:45'`) | — | ✓ | ✓ | mono pill, bottom-right |
| `width` | `number` | `150` | ✓ | ✓ | pixel width |
| `aspect` | `number` | `1.4` | ✓ | ✓ | width / height |
| **handler** | — | — | `onClick: () => void` | `onPress: () => void` | **platform-shaped** — presence makes the tile interactive |
| `className` | `string` | — | ✓ | — | web only |
| _rest_ | `Omit<HTMLAttributes<HTMLElement>, 'onClick'>` (web) / `Omit<ViewProps, 'style'>` (native) | — | ✓ | ✓ | spread onto the button/div (web) or Pressable/View (native) |

- **Web:** when `onClick` is a function it renders a `<button type="button">` (`.lk-vthumb-btn`), else a `<div>`; both get inline `{ width, height }`.
- **Native:** when `onPress` is set it renders a `Pressable` (dims while pressed), else a `View`; both get `{ width, height }`. Native has no `style` prop in `...rest` (it's `Omit<ViewProps,'style'>`); the box size is applied internally.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native | Value |
| --- | --- | --- | --- |
| Tile radius | `--r-sm` | `radii.sm` | `10` |
| Tile bg | `--bg-1` | `colors.bg1` | `#080A12` |
| Tile border | `--border`, 1px | `colors.border`, 1px | `rgba(255,255,255,.09)` |
| Poster | `<img>` `object-fit:cover` | `Image` `resizeMode="cover"` | fills box |
| Placeholder | `--grad-violet` @ opacity .45 + `--glass-2` overlay (`::after`) | `LinearGradient` `gradients.violet` @ opacity .45 | violet flux wash |
| Play disc | 40×40, `--r-pill`, `rgba(12,15,26,.42)`, `--border-2`, **`backdrop-filter: blur(10px)`** | 40×40, radius 20, `rgba(12,15,26,.42)`, `colors.border2` (no blur) | centered glass |
| Play glyph | inline `<svg>` 16×16, `currentColor` (`--text`), nudged `margin-left:2px` | `Svg` 16×16, `colors.text`, `marginLeft:2` | triangle |
| Duration pill | `1px 6px`, `--r-sm`, `--font-mono` 10px, `--text`, bg `rgba(5,6,11,.72)`, `--border` | pad `6/1`, `radii.sm`, `fonts.mono` 10, `colors.text`, bg `rgba(5,6,11,.72)`, `colors.border` | bottom-right |

- The placeholder is a violet flux wash over glass; the duration pill is a near-opaque dark mono chip in the bottom-right corner.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default (no `src`) | gradient placeholder + play disc | gradient placeholder + play disc |
| With poster | `<img>` cover + play disc | `Image` cover + play disc |
| Static (no handler) | `<div>` — non-interactive | `View` — non-interactive |
| Interactive | `<button>` — pointer cursor | `Pressable` |
| Hover (web) | `scale(1.02)` + `--elev-1` shadow; play disc → `rgba(124,92,255,.55)` + `scale(1.06)` | n/a |
| Pressed (native) | `:active` (button) | opacity `.85` |
| Focus | `:focus-visible` → 2px `--accent` outline, `offset:2px` | platform focus (Pressable) |
| Reduced motion | hover/disc transitions dropped | n/a |

## 5. Web ↔ native parity

**Verdict: 🟡 same API + visuals, substrate-shaped interactivity + the glass disc.** Identical tile sizing (`width`/`aspect`), radius/border/bg tokens, violet placeholder, centered play disc geometry, glyph, and duration pill. The handler is the one intentional platform-shaped prop (`onClick` ↔ `onPress`), and its presence flips the element to interactive on both.

Real differences (none block use):

- **Play-disc blur:** web's disc uses `backdrop-filter: blur(10px)` for a true frosted-glass look over the poster; React Native can't `backdrop-filter`, so native uses the same translucent `rgba(12,15,26,.42)` disc **without** the blur. Same color/size/border — slightly less "frost".
- **Interaction feedback:** web has a hover lift (`scale 1.02` + elevation, brighter disc) + a `:focus-visible` ring; native has no hover and instead dims to opacity `.85` on press.
- **Placeholder overlay:** web layers a `--glass-2` `::after` over the violet gradient; native applies opacity `.45` to the gradient alone (same muted result).

No capability gap blocks the tile — it's fully usable and visually equivalent (minus the frosted blur) on both platforms.

## 6. Composition & usage

- **Composes from:** nothing (primitive); native uses `expo-linear-gradient` (placeholder) + `react-native-svg` (glyph) + `@lockin90/tokens`.
- **Used by:** the Guide "Videos" strip and any media gallery/poster grid; pair with a player modal opened by the handler.

```tsx
// web
<VideoThumbnail src={poster} alt="Squat form" duration="0:45" onClick={() => openPlayer(id)} />
<VideoThumbnail duration="1:20" /> {/* static placeholder tile */}

// native
<VideoThumbnail src={poster} alt="Squat form" duration="0:45" onPress={() => openPlayer(id)} />
<VideoThumbnail duration="1:20" />
```

## 7. Accessibility

- **Web:** interactive tiles are real `<button type="button">` (focusable, Enter/Space activate) with a `:focus-visible` accent ring; pass a meaningful `alt` (it's the poster's alt text — for an icon-only tile add an `aria-label` via `...rest`). The play disc + duration are `aria-hidden` decoration.
- **Native:** interactive tiles are `Pressable` with `accessibilityRole="button"` and `accessibilityLabel={alt}`; the play disc + duration are `pointerEvents="none"` decoration.
- **Hit target:** the entire tile is the target — at the default `150×107` it comfortably exceeds 44px. Keep the handler on the whole tile (don't shrink the target to just the play disc).

## 8. Usage rules — Do / Don't

**Do**
- Pass a handler (`onClick`/`onPress`) to make the tile a real button — opening a player or detail.
- Provide `alt` describing the video (it's the accessible name on both platforms).
- Use `duration` for runtime; format it yourself (`'0:45'`) — the tile just renders the string.
- Rely on the placeholder when a poster is still loading or unavailable.

**Don't**
- ✗ Don't pass `onClick` on native or `onPress` on web (wrong-platform handler).
- ✗ Don't wrap a static tile in your own `<button>`/`Pressable` — pass the handler so the tile renders the correct interactive element.
- ✗ Don't hardcode the radius, border, placeholder gradient, or pill colors — they're tokens.
- ✗ Don't hand-roll a poster tile with a play badge — import `VideoThumbnail`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom video poster + play-badge tile will drift from this one (disc size, placeholder, duration pill) and break web ≡ native. Import `VideoThumbnail`.
- **New need → both platforms.** A new feature (e.g. a "watched" overlay, a progress ring) is added with the same prop name + tokens on web **and** native; never a one-off.
- **Tokens only.** Radius/border/bg/placeholder gradient/pill come from `@lockin90/tokens`; the disc/pill `rgba()` overlays are the only sanctioned literals (paired identically across the twins).
- **Parity gate.** Before shipping a media strip, diff the web phone-width tiles vs native: same size, same placeholder, same play disc, same duration pill (accepting the web-only frosted blur).
