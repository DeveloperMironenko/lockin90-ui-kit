# SDD — `Avatar`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Avatar.tsx` · `packages/ui-native/src/components/Avatar.tsx` ·
> web CSS `packages/ui/src/styles/components/avatar.css` (`.lk-avatar*`).
> **Exports:** `Avatar`, type `AvatarProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; one platform-shaped prop (`gradient`: CSS string ↔ stop array).
> **Stories:** `packages/ui/src/stories/Avatar.stories.tsx` · `packages/ui-native/src/stories/Avatar.stories.tsx`.

---

## 1. Overview

A **standalone identity tile** — renders either an image (`src`) or a monogram (initials painted on the flux gradient). Square by `size`, circular by default or softly rounded via `shape="rounded"`.

The monogram label resolves in order: explicit `initials` → first letters of up to two words of `name` (uppercased) → `'?'`. It mirrors the monogram treatment used across `ProfileHeader`, `Leaderboard`, and is the unit `AvatarStack` composes.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `name` | `string` | — | ✓ | ✓ | derives initials; also web `<img alt>` |
| `initials` | `string` | — | ✓ | ✓ | explicit monogram; overrides `name`-derived |
| `src` | `string` | — | ✓ | ✓ | image URL → renders image instead of monogram |
| `size` | `number` | `44` | ✓ | ✓ | px square; monogram font = `round(size * 0.38)` |
| `shape` | `'circle' \| 'rounded'` | `'circle'` | ✓ | ✓ | circle = 50% radius; rounded = 30% (web) / `size*0.3` (native) |
| **`gradient`** | **`string` (web) / `readonly [string, string, ...]` (native)** | violet→cyan flux | ✓ | ✓ | **platform-shaped** — web a CSS gradient string, native ordered stops |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLSpanElement>` (web) / `ViewProps` (native) | — | ✓ | ✓ | spread onto root |

- **`gradient` default:** web `'linear-gradient(135deg, var(--accent), var(--cyan))'`; native `gradients.cta.stops` = `['#7C5CFF', '#22D3EE']`. These are the **same** colors (`--accent` `#7C5CFF` → `--cyan` `#22D3EE`) — the prop shape differs because RN can't parse CSS gradient strings.
- `initialsFor(name)`: splits on whitespace, takes first char of up to 2 words, uppercases, joins; falls back to `'?'`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`avatar.css`) | Native (`StyleSheet`) |
| --- | --- | --- |
| Tile | `inline-flex`, `flex: none`, `border-radius: 50%`, `overflow: hidden` | `<View>` `overflow: hidden`, `borderRadius` from shape |
| Rounded | `.lk-avatar-rounded` → `border-radius: 30%` | `borderRadius: size * 0.3` |
| Circle | `border-radius: 50%` | `borderRadius: size / 2` |
| Image | `width/height 100%`, `object-fit: cover` | `<Image resizeMode="cover">` `100%/100%` |
| Monogram bg | inline `background: gradient` | `<LinearGradient>` `start {0,0}` → `end {1,1}` |
| Monogram text | `--font-display`, 700, `color: #07080d`, `letter-spacing: -0.02em` | `fonts.display`, `'700'`, `color: #07080d`, `letterSpacing: -0.3` |
| Monogram font size | inline `round(size * 0.38)` | inline `round(size * 0.38)` |

- The dark monogram text `#07080d` is intentional (dark-on-bright gradient) — identical on both platforms.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Image | `<img>` with `src` + `alt={name ?? ''}` | `<Image source={{ uri: src }}>` |
| Monogram | `.lk-avatar-mono` gradient + initials | `<LinearGradient>` + initials `Text` |
| Empty name | initials → `'?'` | initials → `'?'` |
| Rounded | `.lk-avatar-rounded` (30%) | `borderRadius: size*0.3` |

No hover/focus/disabled — it's a passive display tile (wrap in a control if interactive).

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, one platform-shaped prop.** Identical `name`/`initials`/`src`/`size`/`shape` semantics, identical `initialsFor` fallback chain, identical `0.38×` font scale, identical dark `#07080d` monogram text. The only real difference:

- **`gradient` prop shape:** web takes a CSS gradient **string**; native takes an ordered **stop array** (`readonly [string, string, ...]`) for `expo-linear-gradient` (RN can't parse CSS gradient strings). The defaults render the same violet→cyan flux. App code reads 1:1 — just pass the platform-appropriate form.
- **Image element:** web `<img object-fit: cover>` vs native `<Image resizeMode="cover">` — same crop behavior.

No capability gap blocks use.

## 6. Composition & usage

- **Composed by:** `AvatarStack` (overlapping roster) — passes `name`/`initials`/`src`/`gradient` per entry.
- **Used by:** profile headers, leaderboard rows, comment/message authorship, settings.
- **Interactive avatars:** wrap in a `<button>`/`Pressable` — `Avatar` itself is passive.

```tsx
// web
<Avatar name="Ada Lovelace" size={56} />
<Avatar src="/u/ada.jpg" name="Ada Lovelace" shape="rounded" />

// native
<Avatar name="Ada Lovelace" size={56} />
<Avatar src="https://…/ada.jpg" name="Ada Lovelace" shape="rounded" />
```

## 7. Accessibility

- **Web:** image avatars set `alt={name ?? ''}` — pass a `name` for a meaningful alt; monogram avatars are decorative text.
- **Native:** add `accessibilityLabel={name}` via `...rest` when the avatar conveys identity standalone.
- **Contrast:** dark `#07080d` monogram on the bright violet→cyan gradient is chosen for legibility across the ramp.
- **Interactive wrap:** when tappable, the wrapping control carries the role/label, not the Avatar.

## 8. Usage rules — Do / Don't

**Do**
- Pass `name` so initials derive correctly and the web `alt` is meaningful.
- Use `initials` only to override the derived value (e.g. brand/org monograms).
- Use `shape="rounded"` for squircle contexts; default `circle` otherwise.
- Pass the platform-correct `gradient` form (string on web, stops on native).

**Don't**
- ✗ Don't hand-roll an initials-on-gradient tile — use `Avatar`.
- ✗ Don't pass a CSS gradient string on native (or a stop array on web).
- ✗ Don't hardcode the monogram text color or gradient — they trace to tokens (`--accent`/`--cyan` / `gradients.cta`).
- ✗ Don't make the bare `Avatar` clickable — wrap it in a real control.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom circle-with-initials is a parity violation — import `Avatar`.
- **New need → both platforms.** A new shape or a status ring goes on `Avatar` web **and** native (same prop name, same tokens), never a local variant.
- **Tokens only.** The default gradient resolves to `--accent`/`--cyan` (`gradients.cta`); the `#07080d` text and radii are fixed in the component — don't fork them per app.
- **Parity gate.** Before shipping a profile/roster surface, diff web phone-width vs native: same size, shape, monogram/image, and gradient.
