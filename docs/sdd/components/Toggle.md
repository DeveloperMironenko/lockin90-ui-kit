# SDD — `Toggle` (+ `ToggleSize` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Toggle.tsx` · `packages/ui-native/src/components/Toggle.tsx` ·
> web CSS `packages/ui/src/styles/components/toggle.css` (`.lk-toggle*`).
> **Exports:** `Toggle`, type `ToggleSize` (`'sm' | 'md'`), type `ToggleProps`.
> **Status:** Shipped. **Parity:** ✅ identical API + visuals; native rewritten to match web (always-gradient knob on a tinted, never-filled track).
> **Stories:** `packages/ui/src/stories/Toggle.stories.tsx` · `packages/ui-native/src/stories/Toggle.stories.tsx`.

---

## 1. Overview

The **accessible on/off switch** of the kit. A glass pill **track** (`glass-2` + `border-2`) holds a **gradient knob** (`grad-cta` + soft glow) that slides L→R when on; the track itself **lights up with an accent tint** (NOT a gradient fill) when on. Built on a real `<button role="switch">` (web) / `Pressable` with `accessibilityRole="switch"` (native) so keyboard + AT work. An optional `label` lays the switch out in a flex row beside the text.

Controlled: the parent owns `checked` and flips it in `onChange(next)`. Two sizes — `md` (58×32, 24px knob; mirrors the marketing pricing toggle) and `sm` (44×26, 20px knob).

**Knob is ALWAYS the CTA gradient — on AND off.** Only the *track* changes between off (glass) and on (accent tint). The native implementation was rewritten to match this exactly (see §5).

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

- **Web:** plain function component (no ref). Renders `<button type="button" role="switch" aria-checked={checked}>` containing the knob `<span aria-hidden>`. When `label` is set it wraps the button + a clickable `<span class="lk-toggle-label">` in `.lk-toggle-row`; `className` goes to the row (labelled) or button (unlabelled).
- **Native:** plain function component. Renders a `Pressable` track (`accessibilityRole="switch"`, `accessibilityState={{ checked, disabled }}`) holding the gradient knob; when `label` is set the whole thing is wrapped in an outer `Pressable` row (label tap also toggles).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Off | On |
| --- | --- | --- |
| Track bg | `--glass-2` / `colors.glass2` | accent tint `color-mix(--accent 18%)` / `rgba(124,92,255,.18)` |
| Track border | `1px --border-2` / `colors.border2` | `color-mix(--accent 40%)` / `rgba(124,92,255,.40)` |
| Knob | `--grad-cta` / `gradients.cta` (violet→cyan) — **same on and off** | same gradient, slid right |
| Knob shadow | `--glow-accent` + `0 1px 2px rgba(0,0,0,.35)` (web) / `nativeShadows.glowAccent` (native) | same |
| Track radius | `--r-pill` / `radii.pill` (999) | same |
| Knob radius | `50%` / `knob/2` | same |

| Size | Track | Knob | Pad | Knob travel |
| --- | --- | --- | --- | --- |
| `md` | 58×32 | 24px | 3px | `translateX(26px)` (web) / `track − knob − pad×2` = 28 (native) |
| `sm` | 44×26 | 20px | 3px | `translateX(18px)` (web) / 18 (native) |

- **Label:** `--font-ui` / `fonts.ui`, 14px, 500, `--text` / `colors.text`; row gap `10px`.
- **Knob slide motion:** web `transition: transform .35s var(--ease)`; native sets `transform: [{ translateX }]` directly (no spring in this component).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Off | `.lk-toggle` glass-2 track, knob left | `trackOff` (glass-2 + border-2), knob `translateX(0)` |
| On | `.lk-toggle.is-on` accent-tint track, knob slid right | `trackOn` (`rgba(124,92,255,.18)` bg + `.40` border), knob `translateX(knobOffset)` |
| Focus | `:focus-visible` → `box-shadow: 0 0 0 3px color-mix(--accent 45%)` | platform focus (Pressable) |
| Pressed | `:active` (browser) | Pressable press (no extra style here) |
| Disabled | `:disabled` opacity .5, `cursor: not-allowed`; labelled row `.is-disabled` dims label to `--text-dim` | `disabled` → opacity .5; press blocked |

## 5. Web ↔ native parity

**Verdict: ✅ identical API + visuals (native rewritten to match web).** Same props (`checked` / `onChange` / `label` / `size` / `disabled`), same controlled contract (`onChange(!checked)`), same two sizes (58×32 / 44×26 with 24/20 knobs, 3px pad), same pill radius, and the same crucial visual decision:

- **Knob is the `grad-cta` gradient in BOTH states** (off and on) — never a flat knob. Web: `.lk-toggle-knob { background: var(--grad-cta) }`. Native: the knob is always an `expo-linear-gradient` over `gradients.cta.stops` (`{0,0}→{1,1}`).
- **Track is TINTED, never gradient-filled.** Off = `glass-2` + `border-2`; on = a low-alpha accent tint (`rgba(124,92,255,.18)` bg / `.40` border), the RN literal of web's `color-mix(--accent 18%/40%)`. The track does **not** fill with the CTA gradient — only the knob carries it.

This is a recent native rewrite to eliminate a prior divergence; the two now match. Substrate-only differences remain: web slides the knob with a CSS `transition`, native sets `translateX` directly; web has a `:focus-visible` ring, native uses the platform focus. No capability gap.

## 6. Composition & usage

- **Composes from:** raw track + gradient knob (native uses `expo-linear-gradient`); no other kit primitive.
- **Used by:** settings/preferences rows, the marketing **pricing monthly↔annual** toggle (the `md` size is sized to it), feature flags, consent switches.
- **Controlled only** — drive `checked` from state and flip it in `onChange`; the component stores no internal state.
- **Labelled vs bare:** pass `label` for a row with tappable text; omit it for a bare switch (label it via `aria-label` / `accessibilityLabel` through `...rest`/parent).

```tsx
// web — labelled, controlled
const [on, setOn] = useState(false);
<Toggle checked={on} onChange={setOn} label="Email notifications" />
<Toggle checked={annual} onChange={setAnnual} size="md" />   // pricing toggle

// native — identical API
<Toggle checked={on} onChange={setOn} label="Email notifications" />
<Toggle checked={on} onChange={setOn} size="sm" disabled />
```

## 7. Accessibility

- **Web:** a real `<button role="switch" aria-checked={checked}>` — focusable, Enter/Space toggle, `:focus-visible` accent ring. `disabled` honored. The knob is `aria-hidden`. The labelled `<span>` is click-to-toggle (guarded by `!disabled`); for AT, associate it via surrounding context or pass `aria-label`.
- **Native:** `Pressable` with `accessibilityRole="switch"` + `accessibilityState={{ checked, disabled }}`; the label row is itself a `Pressable` so tapping the text toggles too.
- **Hit target:** `md` (58×32) is the comfortable touch size; the labelled row extends the tap area across the text. Prefer `md` on touch surfaces.
- **State is not color-only:** `role="switch"` + `aria-checked` / `accessibilityState.checked` convey on/off to AT regardless of the tint.

## 8. Usage rules — Do / Don't

**Do**
- Keep it controlled: drive `checked`, flip it in `onChange`.
- Use `label` for settings rows so the text is part of the tap target.
- Use `md` on touch, `sm` for dense desktop/admin.
- Provide an accessible name (`label` or `aria-label`/`accessibilityLabel`) for bare switches.

**Don't**
- ✗ Don't hand-roll a switch (e.g. a styled checkbox) — use `Toggle`.
- ✗ Don't flat-fill the knob or gradient-fill the track — the knob is always `grad-cta`, the track only tints accent when on.
- ✗ Don't hardcode the gradient/tint/glow — they come from `@lockin90/tokens`.
- ✗ Don't leave it uncontrolled (no internal state — nothing toggles visually).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom on/off switch that re-creates the gradient knob + accent-tint track is a parity violation — import `Toggle`.
- **New size/variant?** If a surface needs another size or an indeterminate state, add it to `Toggle` on **both** platforms (same prop, same tokens) — never a one-off.
- **Tokens only.** The `grad-cta` knob, `glass-2`/`border-2` track, accent tint, and `glow-accent` come from `@lockin90/tokens`; a hardcoded gradient/tint is a bug even if it matches today — and re-introduces the exact native↔web divergence the rewrite removed.
- **Parity gate.** Before shipping a settings/pricing surface, confirm web phone-width and native render the same: gradient knob in both states, tinted (not filled) on-track, same size, same slide.
