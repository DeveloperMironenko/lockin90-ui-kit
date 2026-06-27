# SDD — `Avatar`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Avatar.tsx` · `packages/ui-native/src/components/Avatar.tsx` ·
> web CSS `packages/ui/src/styles/components/avatar.css` (`.lk-avatar*`).
> **Exports:** `Avatar`, type `AvatarProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; one platform-shaped prop (`gradient`: CSS string ↔ stop array) and the `aura` orb's flow (CSS `background-position` ↔ native rotated gradient layer).
> **Stories:** `packages/ui/src/stories/Avatar.stories.tsx` · `packages/ui-native/src/stories/Avatar.stories.tsx`.

---

## 1. Overview

A **standalone identity tile** — renders either an image (`src`) or a monogram (initials painted on the flux gradient). Square by `size`, circular by default or softly rounded via `shape="rounded"`.

The monogram label resolves in order: explicit `initials` → first letters of up to two words of `name` (uppercased) → `'?'`. It mirrors the monogram treatment used across `ProfileHeader`, `Leaderboard`, and is the unit `AvatarStack` composes.

`variant="aura"` swaps the identity tile for an **animated energy-spectrum flux orb** — the avatar of the AI coach, **Aura**. It drops the image/monogram entirely and renders the full `--grad-flux` / `gradients.flux` spectrum (lime→mint→cyan→indigo→violet→magenta) under a soft `--glow-accent` / `nativeShadows.glowAccent`, slowly flowing. Use it **only** for Aura — never for a human user.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `name` | `string` | — | ✓ | ✓ | derives initials; also web `<img alt>` |
| `initials` | `string` | — | ✓ | ✓ | explicit monogram; overrides `name`-derived |
| `src` | `string` | — | ✓ | ✓ | image URL → renders image instead of monogram |
| `size` | `number` | `44` | ✓ | ✓ | px square; monogram font = `round(size * 0.38)` |
| `shape` | `'circle' \| 'rounded'` | `'circle'` | ✓ | ✓ | circle = 50% radius; rounded = 30% (web) / `size*0.3` (native) |
| **`variant`** | **`'default' \| 'aura'`** | `'default'` | ✓ | ✓ | `'aura'` = the AI-coach flux orb; ignores `src`/`initials`/`name`/`gradient` |
| **`gradient`** | **`string` (web) / `readonly [string, string, ...]` (native)** | violet→cyan flux | ✓ | ✓ | **platform-shaped** — web a CSS gradient string, native ordered stops. Ignored when `variant="aura"` |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLSpanElement>` (web) / `ViewProps` (native) | — | ✓ | ✓ | spread onto root |

- **`gradient` default:** web `'linear-gradient(135deg, var(--accent), var(--cyan))'`; native `gradients.cta.stops` = `['#7C5CFF', '#22D3EE']`. These are the **same** colors (`--accent` `#7C5CFF` → `--cyan` `#22D3EE`) — the prop shape differs because RN can't parse CSS gradient strings.
- **`variant="aura"`:** ignores `src`/`initials`/`name`/`gradient` and renders the full flux spectrum (`--grad-flux` / `gradients.flux`) under `--glow-accent` / `nativeShadows.glowAccent`. `size` + `shape` still apply (so an aura orb can be a rounded squircle, though circle is the norm). `name` becomes the web `aria-label` / native `accessibilityLabel`, defaulting to `'Aura'`.
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
| Aura orb | `.lk-avatar--aura` → `background: var(--grad-flux)`, `background-size: 200% 200%`, `box-shadow: var(--glow-accent)` | `<LinearGradient>` `gradients.flux.stops`, wrapper `...nativeShadows.glowAccent` |
| Aura flow | `animation: lk-avatar-aura 9s var(--ease-soft) infinite` (background-position drift) | gradient layer oversized `1.5×` + `Animated.loop` 9s linear `rotate 0→360°` (native driver) |

- The dark monogram text `#07080d` is intentional (dark-on-bright gradient) — identical on both platforms.
- The aura orb carries **no text** — it's a pure gradient + glow. Web flows via CSS `background-position`; native rotates an oversized clipped gradient layer (no edge ever shows). Both honor reduced/disabled motion gracefully (see §5).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Image | `<img>` with `src` + `alt={name ?? ''}` | `<Image source={{ uri: src }}>` |
| Monogram | `.lk-avatar-mono` gradient + initials | `<LinearGradient>` + initials `Text` |
| Empty name | initials → `'?'` | initials → `'?'` |
| Rounded | `.lk-avatar-rounded` (30%) | `borderRadius: size*0.3` |
| Aura | `.lk-avatar--aura` flux orb, flowing | flux orb, gradient slowly rotating |
| Aura, reduced motion | global `prefers-reduced-motion` rule (base.css) holds the gradient static | (no OS reduced-motion hook) — gentle non-blocking rotation; static flux + glow is the acceptable fallback |

No hover/focus/disabled — it's a passive display tile (wrap in a control if interactive).

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, one platform-shaped prop.** Identical `name`/`initials`/`src`/`size`/`shape` semantics, identical `initialsFor` fallback chain, identical `0.38×` font scale, identical dark `#07080d` monogram text. The only real difference:

- **`gradient` prop shape:** web takes a CSS gradient **string**; native takes an ordered **stop array** (`readonly [string, string, ...]`) for `expo-linear-gradient` (RN can't parse CSS gradient strings). The defaults render the same violet→cyan flux. App code reads 1:1 — just pass the platform-appropriate form.
- **Image element:** web `<img object-fit: cover>` vs native `<Image resizeMode="cover">` — same crop behavior.
- **`variant="aura"` flow:** the **API is identical** (`variant="aura"`, same `size`/`shape`, same default `'Aura'` label, same `--grad-flux`/`gradients.flux` spectrum + `--glow-accent`/`nativeShadows.glowAccent`). Only the **animation substrate** differs: web drifts the gradient via CSS `background-position` (honoring `prefers-reduced-motion` through the global base.css rule); native slowly rotates an oversized, clipped gradient layer on the native driver. Native has no OS reduced-motion hook, so a static flux + glow orb is the documented acceptable fallback. App code reads 1:1.

No capability gap blocks use — the aura difference is platform-shaped motion, not a missing capability.

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
- Use `variant="aura"` for the **AI coach (Aura)** anywhere a human user would get a normal avatar (coach feed, chat, attribution) — it's the canonical Aura mark.

**Don't**
- ✗ Don't hand-roll an initials-on-gradient tile — use `Avatar`.
- ✗ Don't pass a CSS gradient string on native (or a stop array on web).
- ✗ Don't hardcode the monogram text color or gradient — they trace to tokens (`--accent`/`--cyan` / `gradients.cta`).
- ✗ Don't make the bare `Avatar` clickable — wrap it in a real control.
- ✗ **Don't use `variant="aura"` for a human user** — the flux orb means "this is Aura, the AI". A person gets `default` (image/monogram).
- ✗ Don't hand-roll a glowing flux orb for the coach — use `variant="aura"` (tokens-only, parity-matched), never a local lookalike.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom circle-with-initials is a parity violation — import `Avatar`. A custom glowing flux orb for the AI coach is the same violation — use `variant="aura"`.
- **New need → both platforms.** A new shape or a status ring goes on `Avatar` web **and** native (same prop name, same tokens), never a local variant. `variant="aura"` shipped on both platforms together (same API, same `--grad-flux`/`gradients.flux` + glow).
- **Tokens only.** The default gradient resolves to `--accent`/`--cyan` (`gradients.cta`); the aura orb to `--grad-flux`/`gradients.flux` + `--glow-accent`/`nativeShadows.glowAccent`; the `#07080d` text and radii are fixed in the component — don't fork them per app.
- **Parity gate.** Before shipping a profile/roster surface, diff web phone-width vs native: same size, shape, monogram/image, and gradient.
