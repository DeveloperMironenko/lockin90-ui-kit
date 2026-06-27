# SDD — `ColorPicker`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/ColorPicker.tsx` · `packages/ui-native/src/components/ColorPicker.tsx` ·
> web CSS `packages/ui/src/styles/components/colorpicker.css` (`.lk-colorpicker*`).
> **Exports:** `ColorPicker`, type `ColorPickerProps`.
> **Status:** Shipped. **Parity:** 🔵 capability gap — native has **no OS color wheel** (`<input type="color">`); native picks via hex field + preset swatches only.
> **Stories:** `packages/ui/src/stories/ColorPicker.stories.tsx` · `packages/ui-native/src/stories/ColorPicker.stories.tsx`.

---

## 1. Overview

A **swatch-trigger color field**. A small chip shows the current color; activating it opens a floating panel
(web `Popover`) / sheet (native `Modal`) with a hex `Input` and a grid of preset swatches. On **web** the
panel additionally hosts the **native OS picker** (`<input type="color">`); on **native** there is no OS color
wheel, so you choose a preset or type a hex.

The default swatches are the **Aurora energy-spectrum** hexes (lime → mint → cyan → indigo → accent → violet →
magenta → warn → zone-low → text). These ten hexes are **data, not chrome** — they're literal color values the
field offers, so they're written inline (not as tokens) by design.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `string` | — (required) | ✓ | ✓ | hex (`#7C5CFF`, or `#7C5CFF80` with alpha) |
| `onChange` | `(hex: string) => void` | — (required) | ✓ | ✓ | next normalized hex on any change |
| `swatches` | `string[]` | `DEFAULT_SWATCHES` (10 Aurora hexes) | ✓ | ✓ | preset grid contents |
| `allowAlpha` | `boolean` | `false` | ✓ | ✓ | accept 8-digit `#RRGGBBAA`; widens `maxLength` 7→9 |
| `label` | `string` | — | ✓ | ✓ | small mono label above the trigger (native uppercases it) |
| `invalid` | `boolean` | `false` | ✓ | ✓ | red hex `Input` |
| `className` | `string` | — | ✓ | — | web only |

- Both sides normalize loose input via `normalizeHex` (trim, uppercase, ensure leading `#`) and gate the
  "selected" swatch ring on `isCompleteHex` (`#` + 6 or 8 hex digits).
- **Web only:** `toBaseHex` strips any alpha pair to feed the 6-digit-only `<input type="color">`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`colorpicker.css`) | Native (`StyleSheet`) |
| --- | --- | --- |
| Label | `--font-mono` `10px`, weight `500`, `letter-spacing 1.2px`, `uppercase`, `--text-faint` | `fonts.mono` `10`, weight `500`, `letterSpacing 1.2`, `colors.textFaint` (`.toUpperCase()`) |
| Trigger | `Popover` chip — `22px`, `--r-sm`, alpha checkerboard from `--glass-2` | `Pressable` row: chip + hex `Text`; `--r-sm`, `1px --border-2`, `--glass-2`, pad `7/9` |
| Chip fill | `inset 0 0 0 1px --border-2` | `radii.sm-2`, `1px colors.border2`, over `colors.bg2` |
| OS picker | `38px` `<input type="color">`, `1px --border-2`, `--glass-2`, hover `--accent` | — (not present on native) |
| Hex field | reused `Input` (`inputSize="sm"`), `--font-mono`, `uppercase`, `letter-spacing .04em` | reused `Input` (`label="Hex"`, `inputSize="sm"`, `autoCapitalize="characters"`) |
| Swatch grid | `grid` `repeat(5,1fr)`, gap `7px`; preset `aspect 1/1`, `1px --border`, inset shadow | `flexWrap` row, gap `10`; preset `40×40`, `radii.sm`, `1px --border` |
| Selected | `--text` border + `inset 0 0 0 1px --text` + `--glow-accent`, hover lift `translateY(-1px)` | `colors.text` border, width `2` |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Closed | chip-only trigger inside `.lk-pop-trigger` | trigger row (chip + hex text) |
| Open | `Popover` panel (`width 232px`), `align="left"` | `Modal` titled `Color` |
| Hover (preset) | `translateY(-1px)`, `--border-2`, `:focus-visible` ring | n/a (press only) |
| Selected swatch | `.is-selected` — text-color border + glow | `presetSelected` — text-color 2px border |
| Invalid | red hex `Input` | red hex `Input` |

## 5. Web ↔ native parity

**Verdict: 🔵 capability gap on native.** Same prop surface, same default swatches, same normalize/complete
helpers, same hex-`Input` + preset-grid model. The genuine gap:

- **No OS color wheel on native.** Web renders `<input type="color">` (the system picker) in the panel;
  React Native has no equivalent control. Native therefore offers **hex entry + preset swatches only**. This
  is a real platform limit, not a styling choice — callers needing arbitrary color on native must rely on the
  hex field (or a future custom HSV picker added to both sides).
- **Overlay substrate:** web `Popover` (portaled floating panel, outside-click close) vs native `Modal`
  (titled sheet). Behaviorally equivalent (open → pick → close), visually substrate-shaped.
- **Web-only `className`.**

The `value`/`onChange(hex)` contract is identical, so app code reads 1:1 — but a screen relying on the OS
wheel must accept it degrades to hex+presets on native.

## 6. Composition & usage

- **Composes:** `Input` (hex field) + `Popover` (web) / `Modal` (native). The chip + grid are local chrome.
- **Used by:** theme/brand-color editors, CMS block style controls, admin appearance settings.

```tsx
// web
<ColorPicker label="Accent" value={hex} onChange={setHex} allowAlpha />

// native
<ColorPicker label="Accent" value={hex} onChange={setHex} allowAlpha />
```

## 7. Accessibility

- **Web:** OS picker `<input>` carries `aria-label="Pick a color"`; the hex `Input` `aria-label="Hex color"`;
  each preset `<button>` is labelled with its hex and exposes `aria-pressed`; the chip is `aria-hidden`.
- **Native:** the trigger `Pressable` is `accessibilityRole="button"` labelled `Color {hex}`; each preset is a
  `button` labelled with its hex and reports `accessibilityState={{ selected }}`.
- **Contrast:** presets carry an inner dark inset (`inset 0 0 0 1px rgba(0,0,0,.18)` web / `1px --border`
  native) so light swatches stay visible on the dark panel; the selected ring uses `--text` for max contrast.

## 8. Usage rules — Do / Don't

**Do**
- Bind `value`/`onChange` to a hex string; trust `normalizeHex` for partial typing.
- Customize `swatches` to your brand palette when the Aurora defaults aren't right.
- Set `allowAlpha` only when the consumer truly handles 8-digit hex.

**Don't**
- ✗ Don't assume the OS color wheel exists on native — it doesn't; design for hex + presets.
- ✗ Don't pass non-hex values (named colors / rgb()) — the field is hex-only.
- ✗ Don't re-key the default swatch hexes into tokens — they're intentional inline data, not chrome.
- ✗ Don't hardcode the chip, panel, or grid chrome — those are tokens-only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom swatch chip + popover with a hex box is a parity violation — import
  `ColorPicker`.
- **Capability honesty.** Don't fake an OS wheel on native with a half-built gradient slider; if a real HSV
  picker is needed, add it to **both** platforms with the same prop API.
- **Tokens only (chrome).** Chip / panel / grid styling is tokens-only; the swatch *values* are data.
- **Parity gate.** Confirm web phone-width and native renders match (trigger, hex field, preset grid, selected
  ring) and that the screen tolerates native's hex-only entry before shipping.
