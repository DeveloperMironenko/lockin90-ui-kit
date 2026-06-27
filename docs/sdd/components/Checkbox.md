# SDD — `Checkbox` (+ `Radio`, `RadioGroup` cross-ref)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Checkbox.tsx` · `packages/ui-native/src/components/Checkbox.tsx` ·
> web CSS `packages/ui/src/styles/components/check.css` (`.lk-check*` / `.lk-radio*`).
> **Exports:** `Checkbox`, `Radio`, `RadioGroup`, types `CheckboxProps`, `RadioProps`, `RadioOption`, `RadioGroupProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; web layers a custom control over a hidden native input, native uses `Pressable` (no `name` form-grouping).
> **Stories:** `packages/ui/src/stories/Checkbox.stories.tsx` · `packages/ui-native/src/stories/Checkbox.stories.tsx`.

---

## 1. Overview

The kit's **custom boolean/selection controls** — an accent-filled box (Checkbox) and an accent-dot ring (Radio), both over the kit's glass surface, the only sanctioned check/radio house style.

Three exports live in `Checkbox.tsx`:

- **`Checkbox`** — a square box with a white tick when checked, or a dash when `indeterminate` (mixed selection).
- **`Radio`** — a circular ring whose center fills with an accent dot when selected.
- **`RadioGroup`** — a vertical column of mutually-exclusive `Radio`s driven by an `options[]` + single `value`.

`RadioOption` (`{ value, label }`) is the item shape consumed by `RadioGroup`.

## 2. API contract

### `Checkbox`
| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `checked` | `boolean` | `false` | ✓ | ✓ | controlled checked state |
| `indeterminate` | `boolean` | `false` | ✓ | ✓ | render a dash (mixed) instead of a tick |
| `onChange` | `(checked: boolean) => void` | — | ✓ | ✓ | fires with the *next* checked value |
| `label` | `string` | — | ✓ | ✓ | text beside the box |
| `disabled` | `boolean` | `false` | ✓ | ✓ | dims + blocks interaction |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `InputHTMLAttributes` (sans `onChange`/`type`/`checked`) | — | ✓ | — | **web only** — spreads to the hidden `<input>` |

### `Radio`
Same as `Checkbox` minus `indeterminate`, plus `value?: string`. **`name?: string`** is **web only** (form grouping). Web spreads `InputHTMLAttributes`; native has no `...rest`.

### `RadioGroup`
| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `options` | `RadioOption[]` | `[]` | ✓ | ✓ | `{ value, label }[]` |
| `value` | `string` | — | ✓ | ✓ | currently selected value |
| `onChange` | `(value: string) => void` | — | ✓ | ✓ | fires with the chosen option value |
| `name` | `string` | — | ✓ | — | **web only** — shared input name |
| `disabled` | `boolean` | `false` | ✓ | ✓ | disables all rows |
| `className` / `style` | — | — | ✓ / — | — / ✓ | platform-shaped |

- **Web:** `Checkbox`/`Radio` render a visually-hidden native `<input type="checkbox|radio">` (sr-only clip) under a custom `<span>` box/ring, wrapped in a `<label>` — so clicks, focus, and form semantics are real. `indeterminate` is set as a DOM *property* on the node via a ref callback (it's not an attribute).
- **Native:** a `Pressable` row with `accessibilityRole="checkbox"|"radio"`; `onChange` is `!checked` on press. No hidden input, no `name`, no rest spread.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Box/ring size | `18×18px` | `18×18` |
| Box radius | `5px` | `5` |
| Ring radius | `50%` | `9` (circle) |
| Border (idle) | `1.5px --border-2` | `1.5 colors.border2` |
| Surface (idle) | `--glass-2` | `colors.glass2` |
| Filled bg | `--accent`, border `transparent` | `colors.accent`, border `transparent` |
| Tick | `#fff`, 12×12, `stroke-width 2.4` | `#fff`, 12×12, `strokeWidth 2.4` |
| Dash (indeterminate) | `9×2px` `#fff`, radius 1 | `9×2` `#fff`, radius 1 |
| Radio dot | `9×9px` `--accent` | `9×9` `colors.accent` |
| Label | `13.5px`, `--text`, `--font-ui`, line 1.3 | `13.5`, `colors.text`, `fonts.ui`, line 18 |
| Row gap | `9px` | `9` |
| RadioGroup gap | `10px` column | `10` column |

- **Hover (web):** box/ring border → `--accent`.
- **Focus (web):** `:focus-visible` → `box-shadow: 0 0 0 3px rgba(124,92,255,.3)` (accent focus ring).
- **Transitions (web):** background/border/box-shadow 0.2s; tick/dash/dot opacity+scale 0.18s (scale 0.6/0.4 → 1). Native is instant.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Unchecked | box/ring `--glass-2` + `--border-2` | same tokens |
| Checked | `:checked + .lk-check-box` accent fill, tick scale→1 | `boxFilled`/`ringChecked` accent, glyph/dot shown |
| Indeterminate | `.lk-check-mixed` accent fill + dash | `dash` view shown (no tick) |
| Hover | border → `--accent` | n/a (no hover) |
| Pressed | n/a | `Pressable` press (no explicit style) |
| Focus | accent 3px focus ring | platform focus (Pressable) |
| Disabled | `.lk-check-disabled` opacity .5, `cursor:not-allowed` | `disabled` → opacity .5, press blocked |

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, platform-shaped impl.** Identical box/ring geometry (18px, 5px/circle), the same accent fill + white tick / accent dot, the same 13.5px label, and the same `checked`/`indeterminate`/`label`/`disabled` contract with `onChange(next)`. Differences are substrate-driven:

- **Substrate:** web composes a custom control over a **visually-hidden real `<input>`** (so native form submission, keyboard, and `:checked`/`:focus-visible` work for free); native is a `Pressable` with `accessibilityState`. App code reads 1:1.
- **`name` (web only):** `Radio`/`RadioGroup` accept `name` for HTML form grouping — there's no native analogue (RN has no `<form>`), so it's omitted on native. Not a capability gap for app logic (state is driven by `value`/`onChange`).
- **Rest spread:** web spreads `InputHTMLAttributes` to the input; native exposes only the explicit props. Pass extra attrs only on web.
- **Hover/focus-ring:** web-only pointer/keyboard affordances; native uses press + a11y state.

None of these block use — the controls are visually and behaviorally equivalent.

## 6. Composition & usage

- **`RadioGroup` composes `Radio`** (one per `option`, `checked = value === opt.value`).
- **Used by:** settings toggles, consent/legal opt-ins, table-row "select all" (indeterminate), filter forms, onboarding choice lists.
- For a *pressable filter pill* (multi-select), use `ChoiceChip`, not a `Checkbox`. For a single-select segmented control, use `SegmentedTabs`.

```tsx
// web
<Checkbox checked={agree} onChange={setAgree} label="I agree to the terms" />
<Checkbox indeterminate={someSelected} checked={allSelected} onChange={toggleAll} label="Select all" />
<RadioGroup name="plan" options={plans} value={plan} onChange={setPlan} />

// native
<Checkbox checked={agree} onChange={setAgree} label="I agree to the terms" />
<RadioGroup options={plans} value={plan} onChange={setPlan} />
```

## 7. Accessibility

- **Web:** a real `<input type="checkbox|radio">` inside a `<label>` — focusable, Space toggles, label click toggles, form-associated. `indeterminate` is set as the DOM property so SRs announce "mixed". `RadioGroup` wraps the rows in `role="radiogroup"`.
- **Native:** `Pressable` with `accessibilityRole="checkbox"|"radio"` and `accessibilityState={{ checked: 'mixed'|boolean, disabled }}`; `RadioGroup` is a `role="radiogroup"` `View`.
- **Hit target:** the 18px box plus the `9px` gap + label widen the touch target; prefer always rendering a `label` for a larger tap area.
- **Contrast:** white tick / accent dot on the accent fill meets contrast; the idle `--border-2` ring is visible on the void surface.

## 8. Usage rules — Do / Don't

**Do**
- Use `Checkbox` for independent booleans; `Radio`/`RadioGroup` for mutually-exclusive choice.
- Use `indeterminate` for partial/mixed "select all" rows.
- Always pass a `label` (or an external `<label>`/`accessibilityLabel`) — never a bare box.
- Drive selection through `value`/`onChange` (controlled).

**Don't**
- ✗ Don't hand-roll a checkbox/radio (styled `<input>` or a bordered box) — import these.
- ✗ Don't use a `Radio` outside a single-select group, or a `Checkbox` for mutually-exclusive choice.
- ✗ Don't rely on `name`/rest-spread on native (web-only).
- ✗ Don't hardcode the accent fill, 18px box, or focus ring — tokens only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom-styled `<input type=checkbox>` or a div "checkbox" re-creating the accent fill + tick is a parity violation — import `Checkbox`/`Radio`.
- **New need → add to BOTH platforms.** A new size, a tri-state radio, or a horizontal `RadioGroup` is a prop added on web *and* native with the same name + tokens — never a one-off.
- **Tokens only.** The accent fill, border, and focus ring come from `@lockin90/tokens`; never inline.
- **Parity gate.** Before shipping, confirm the web phone-width and native control look identical (box size, fill, tick/dot, label) and behave 1:1 (`checked`/`indeterminate`/`disabled`).
