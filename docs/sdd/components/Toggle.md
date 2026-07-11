# SDD — `Toggle` (+ `ToggleSize` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Toggle.tsx` · `packages/ui-native/src/components/Toggle.tsx` ·
> web CSS `packages/ui/src/styles/components/toggle.css` (`.lk-toggle*`).
> **Exports:** `Toggle`, type `ToggleSize` (`'sm' | 'md'`), type `ToggleProps`.
> **Status:** Shipped. **Parity:** ✅ identical API + treatment (sizes are the per-platform design values).
> **Stories:** `packages/ui/src/stories/Toggle.stories.tsx` · `packages/ui-native/src/stories/Toggle.stories.tsx`.

---

## 1. Overview

The **accessible on/off switch** of the kit — the design `.switch` (settings screens, web + mobile mockups). **OFF:** a glass pill track (`rgba(255,255,255,.06)` fill + `--border-2` hairline) holding a **solid `--text-dim` knob**. **ON:** the **track fills with the CTA gradient** (`--grad-cta`, violet→cyan) + accent glow, its border goes transparent, and the knob slides L→R and darkens to ink `#07080D`. Built on a real `<button role="switch">` (web) / `Pressable` with `accessibilityRole="switch"` (native) so keyboard + AT work. An optional `label` lays the switch out in a flex row beside the text.

Controlled: the parent owns `checked` and flips it in `onChange(next)`. Two sizes per platform's design spec — web `md` 46×26 (20px knob) / `sm` 38×22 (16px knob); native `md` 42×24 (18px knob) / `sm` 36×21 (15px knob); knob inset 2px.

> **History:** an earlier kit treatment (always-gradient knob on a tinted, never-filled track,
> 58×32/44×26) diverged from the design mockups and was replaced 2026-07 with the design
> `.switch` treatment above (owner-flagged "different toggles" during the mobile settings rebuild).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `checked` | `boolean` | `false` | ✓ | ✓ | controlled on/off state |
| `onChange` | `(checked: boolean) => void` | — | ✓ | ✓ | fired with the **next** state on toggle |
| `label` | `string` | — | ✓ | ✓ | optional text beside the switch (renders the row layout) |
| `size` | `ToggleSize` (`'sm' \| 'md'`) | `'md'` | ✓ | ✓ | control scale |
| `disabled` | `boolean` | `false` | ✓ | ✓ | non-interactive + dimmed (.5) |
| `className` | `string` | — | ✓ | — | web only (applied to the row when labelled, else the button) |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `Omit<ButtonHTMLAttributes,'onChange'>` (web) | — | ✓ | — | spreads onto the `<button>` |

- **Web:** `<button type="button" role="switch" aria-checked>` containing the knob `<span aria-hidden>`; labelled form wraps button + clickable `.lk-toggle-label` span in `.lk-toggle-row`.
- **Native:** `Pressable` track (`accessibilityRole="switch"`, `accessibilityState`) holding a plain `View` knob; when ON an absolute `expo-linear-gradient` (`gradients.cta`) fills the track. Labelled form wraps in an outer `Pressable` row.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Off | On |
| --- | --- | --- |
| Track bg | `rgba(255,255,255,.06)` (design `.switch` literal) | `--grad-cta` / `gradients.cta` gradient FILL |
| Track border | `1px --border-2` / `colors.border2` | transparent |
| Track glow | none | web `0 0 16px rgba(124,92,255,.45)` · native `0 0 14px …` (mobile design value) |
| Knob | solid `--text-dim` / `colors.textDim` | solid ink `#07080D`, slid right |
| Track radius | `--r-pill` / `radii.pill` (999) | same |
| Knob radius | `50%` / `knob/2` | same |

| Platform | Size | Track | Knob | Pad | Knob travel |
| --- | --- | --- | --- | --- | --- |
| web | `md` | 46×26 | 20px | 2px | `translateX(20px)` |
| web | `sm` | 38×22 | 16px | 2px | `translateX(16px)` |
| native | `md` | 42×24 | 18px | 2px | `track − 2·border − knob − 2·pad` = 18 |
| native | `sm` | 36×21 | 15px | 2px | 15 |

- **Label:** `--font-ui` / `fonts.ui`, 14px, 500, `--text`; row gap `10px`.
- **Motion:** web `transition` on transform/background/border/box-shadow (.3s var(--ease)); native sets `translateX` directly.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Off | `.lk-toggle` glass track, dim knob left | `trackOff`, knob `translateX(0)`, `colors.textDim` |
| On | `.lk-toggle.is-on` gradient-filled track + glow, dark knob right | gradient `trackFill` + `boxShadow` glow, ink knob `translateX(knobOffset)` |
| Focus | `:focus-visible` → accent ring | platform focus (Pressable) |
| Disabled | `:disabled` opacity .5; labelled row dims label | `disabled` → opacity .5; press blocked |

## 5. Web ↔ native parity

**Verdict: ✅ identical API + treatment.** Same props, same controlled contract, same OFF/ON visuals (glass track + dim knob ↔ gradient track + ink knob). Sizes are deliberately the **per-platform design values** (web `.switch` 46×26/38×22 · mobile `.switch` 42×24/36×21 — the design itself sizes them per platform). Substrate differences: CSS transition vs direct transform; glow radius 16 (web design) vs 14 (mobile design).

## 6. Composition & usage

- **Used by:** settings/preferences rows (units, feature modules, notifications matrix, consents), feature flags.
- **Controlled only** — no internal state.

```tsx
const [on, setOn] = useState(false);
<Toggle checked={on} onChange={setOn} label="Email notifications" />
<Toggle checked={on} onChange={setOn} size="sm" />   // settings rows (design `.switch.sm`)
```

## 7. Accessibility

- **Web:** real `role="switch"` button, Enter/Space, `:focus-visible` ring, knob `aria-hidden`.
- **Native:** `accessibilityRole="switch"` + `accessibilityState={{ checked, disabled }}`; labelled row is one tap target.
- **State is not color-only:** `aria-checked` / `accessibilityState.checked` convey on/off to AT.

## 8. Usage rules — Do / Don't

**Do**
- Keep it controlled; use `label` for settings rows; `sm` for dense rows (the design settings screens use `sm`).
- Provide an accessible name for bare switches.

**Don't**
- ✗ Don't hand-roll a switch — use `Toggle`.
- ✗ Don't gradient-fill the knob or tint-only the track — the design is dim-knob/glass-track OFF, ink-knob/gradient-track ON.
- ✗ Don't hardcode the gradient/glow — `@lockin90/tokens` (`gradients.cta`); the ink `#07080D` and `.06` glass literal are the design's sanctioned constants.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom switch re-creating the gradient track is a parity violation — import `Toggle`.
- **New size/variant?** Add it on **both** platforms (same prop, same tokens) — never a one-off.
- **Parity gate.** Before shipping a settings surface, confirm web phone-width and native render the same: dim knob off, gradient track + ink knob on, same per-platform design size, same slide.

## Update — 2026-07-10
- **Haptics:** flipping the toggle fires `hapticSelection()` (native, via `optionalHaptics`; no-op without expo-haptics).
