# SDD — `Input`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Input.tsx` · `packages/ui-native/src/components/Input.tsx` ·
> web CSS `packages/ui/src/styles/components/input.css` (`.lk-input*`).
> **Exports:** `Input`, type `InputProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; web adds a focus glow-ring (`box-shadow`), native uses an accent border only.
> **Stories:** `packages/ui/src/stories/Input.stories.tsx` · `packages/ui-native/src/stories/Input.stories.tsx`.

---

## 1. Overview

The kit's **dark glassy single-line text input**. A glass field shell with an optional mono uppercase label
above, an optional leading icon inside, an optional faint **unit** suffix on the right (e.g. `kg`, `bpm`), an
`invalid` red state, and two densities (`md`/`sm`). It is the canonical text field — `PasswordInput` is built
on the same shell, and `FormField` wraps it for labels/help/error in forms.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `label` | `string` | — | ✓ | ✓ | mono uppercase caption above the field |
| `unit` | `string` | — | ✓ | ✓ | faint suffix inside the field, right side |
| `invalid` | `boolean` | `false` | ✓ | ✓ | red border (web also reddens the focus ring) |
| `inputSize` | `'sm' \| 'md'` | `'md'` | ✓ | ✓ | density; `sm` = tighter padding + 12.5px text |
| `leading` | `ReactNode` | — | ✓ | ✓ | icon/node inside the shell, left of the input |
| `className` / `style` | — | — | `className` | `style` | web → `<input>` class · native → `TextInput` style |
| **value/change** | — | — | `value` + `onChange(e)` | `value` + `onChangeText(t)` | **platform-shaped** — web DOM event, native string callback |
| _rest_ | `InputHTMLAttributes` minus `size` (web) / `TextInputProps` (native) | — | ✓ | ✓ | `placeholder`, `type`, `disabled`, `onFocus`/`onBlur`, etc. |

- **Web:** `InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>` — `size` is omitted so the
  custom `inputSize` doesn't collide with the HTML `size` attribute. `className` lands on the inner `<input>`,
  not the shell. `aria-invalid` is set from `invalid`.
- **Native:** `InputProps extends TextInputProps`. Focus is tracked in component state (`onFocus`/`onBlur` are
  intercepted, then forwarded) to swap the border color; `style` lands on the `TextInput`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | `md` | `sm` |
| --- | --- | --- |
| Shell bg | `--glass-2` / `colors.glass2` | same |
| Border | `1px --border-2` / `colors.border2` | same |
| Radius | `--r-sm` / `radii.sm` (10) | same |
| Padding | `9px 12px` | `6px 10px` |
| Input text | `--font-ui` / `fonts.ui`, `--text` / `colors.text`, 14px | 12.5px |
| Label | `--font-mono` / `fonts.mono`, `--text-faint`, 10px / weight 500 / letter-spacing 0.12em (native `1.2`) | same |
| Unit | `--font-mono` / `fonts.mono`, `--text-faint`, 11px | 10px |
| Leading | `--text-faint`; web auto-sizes `svg` to 16px (sm 14px) | — |

- **Focus:** web `:focus-within` → `--accent` border **+** `box-shadow 0 0 0 3px rgba(124,92,255,.14)`; native →
  border color flips to `colors.accent` (no ring).
- **Invalid:** border `--zone-low` / `colors.zoneLow`. Web focus ring reddens to `rgba(255,77,109,.16)`; native shows the red border only.
- **Placeholder:** `--text-faint` / `colors.textFaint`. Gap leading↔input↔unit: `8px` (web 6px in `sm`).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-input-field` | `styles.field` border `--border-2` |
| Focus | `:focus-within` accent border + glow-ring | `focused` state → accent border |
| Invalid | `.lk-input-invalid` red border | `invalid` → `colors.zoneLow` border |
| Invalid + focus | red border + red ring | red border (no ring) |
| Disabled | pass HTML `disabled` (browser dims) | pass `editable={false}` via rest |
| Density `sm` | `.lk-input-sm` | `styles.fieldSm` + `inputSm` |

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped impl.** Identical props, label, unit, leading, sizes, padding, radius,
colors, and invalid treatment. Substrate-only differences:

- **Focus affordance** — web paints a soft `box-shadow` glow-ring around the accent border; native flips the
  border to accent with **no ring** (RN box-shadow is costly/uneven). Visually close; documented.
- **Value/change** — web `onChange` receives a DOM event; native `onChangeText` receives the string. Standard
  web↔RN substrate; app code adapts the handler, the contract is the same.

No capability gap blocks use — the field is fully usable and visually equivalent on both platforms.

## 6. Composition & usage

- **Composed by:** `PasswordInput` (same shell + a trailing eye toggle). Wrap in `FormField` for label/help/error.
- **Composes:** an optional `leading` node — typically an `Icon`.
- Use `unit` for measurement fields (`kg`, `cm`, `bpm`) instead of putting the unit in the placeholder.

```tsx
// web
<Input label="Weight" unit="kg" value={w} onChange={(e) => setW(e.target.value)} />
<Input leading={<Icon name="search" />} placeholder="Filter…" inputSize="sm" />

// native
<Input label="Weight" unit="kg" value={w} onChangeText={setW} keyboardType="numeric" />
<Input leading={<Icon name="search" />} placeholder="Filter…" inputSize="sm" />
```

## 7. Accessibility

- **Kit rule:** CONVENTIONS "Accessibility" (2026-11-10) applies: contrast 4.5:1 text / 3:1 UI, 44pt native / 24px web targets, names from props, errors and changes announced, reduced motion, text scaling never disabled.
- **Web:** real `<input>` (focusable, typeable). `aria-invalid` is set automatically when `invalid`. Provide a
  label via `FormField`'s `htmlFor`, or pass `aria-label` directly when there's no visible label.
- **Native:** `TextInput` — pass `accessibilityLabel` for an unlabeled field; the `label` text is a sibling `Text`.
- **Hit target:** `md` padding yields a comfortable touch height; prefer `md` on mobile, reserve `sm` for dense desktop/admin.
- **Contrast:** text `--text` on `--glass-2` and the `--accent` focus border both clear contrast on the void surfaces.

## 8. Usage rules — Do / Don't

**Do**
- Use `Input` for every single-line text field; wrap it in `FormField` when it needs a label/help/error.
- Use `inputSize="sm"` only for dense desktop/admin rows.
- Set `invalid` from validation state so the border + (web) ring turn red.
- Use `unit` for units; use `leading` for an inline icon.

**Don't**
- ✗ Don't hand-roll a glass text field — import `Input`.
- ✗ Don't pass the HTML `size` attribute (it's omitted); use `inputSize`.
- ✗ Don't hardcode the glass fill, border, radius, or focus color — they're tokens.
- ✗ Don't stuff the unit into the placeholder — use the `unit` prop.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A "custom glass input" that re-creates the shell, label, and focus glow is a parity
  violation — it drifts from the kit and breaks web≡native.
- **New need → both platforms.** A new affordance (e.g. a trailing action) gets added to `Input` (or a sibling
  built on its shell, like `PasswordInput`) on web **and** native — never a one-off.
- **Tokens only.** Every color/space/radius comes from `@lockin90/tokens`; hardcoded equivalents are bugs even
  when they "look the same" today.
- **Parity gate.** Confirm the web phone-width field and the native field match (same label, unit, leading, size, invalid state) before shipping.

## Update — 2026-11-02 (native sizes match web)
- **Native height = web height:** the field has `minHeight` 39.6 (sm 31.5), the web box `9 + 14×1.4 + 9 + 2`, so it matches the web field to the point (it was 36). The `label` caption is 11px / 500 `text-dim`, line height 17, as the web shows.

## Update — 2026-11-10 (accessibility, 1.35)

- **Edge:** `--border-control` / `colors.borderControl` (3.3:1 on the card, CONVENTIONS "Accessibility")
  instead of `--border-2`; focus and invalid still recolour it.
- **Text 16px / 16pt** (owner, 2026-11-10): no iOS zoom on web. The box keeps its size: web `md` line height
  19.6px (39.6 tall), `sm` 17.5px (31.5 tall), `numeral` keeps 20px × 1.4; native `sm` padding 5 (min height
  31.5), md unchanged (min height 39.6).
- **Native:** the field box is a `Pressable` (`accessible={false}`): a tap on its padding, icon or unit focuses
  the `TextInput`.
- **`ref`** (web + native): forwarded to the field itself — web the `<input>` (`forwardRef<HTMLInputElement>`), native the `TextInput` — so an app moves focus to the next field on Return (`returnKeyType="next"` + `onSubmitEditing={() => next.current?.focus()}`). Works on React 18 and 19.
- **Native ref type:** `TextInputRef` = `ComponentRef<typeof TextInput>` (exported), and the component is annotated `ForwardRefExoticComponent<InputProps & RefAttributes<TextInputRef>>`, so the emitted `.d.ts` keeps that form. On RN 0.88 the type `TextInput` is the component (no `focus()`), so the old emitted `RefAttributes<TextInput>` broke apps there; the `ComponentRef` form has `focus()` on 0.81 and 0.88 (checked against the mobile app's RN 0.88.1 types).

## Update — 2026-11-10 (running-app audit, 1.35)

- **Fill:** the opaque `--field` / `colors.field` (`#25272E`), so the placeholder keeps 4.6:1 over the aurora. **Focus (web):** the kit's 2px `--accent-2` ring (offset 2) on the field box. **Height:** at least 44 at phone width (web) and on native (all sizes), CONVENTIONS. Label 11px.

## Update — 2026-11-10 (simulator check, 1.35)

- **Increase Contrast** (native `useContrastColors`; web `prefers-contrast: more`): faint / dim text and the edge step up.
