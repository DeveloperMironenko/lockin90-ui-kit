# SDD — `Field` (`Input` · `Textarea`) (marketing form controls)

> **Package:** `@lockin90/ui/marketing` — web-only marketing primitive (Aurora marketing site).
> **Import as:** `import { Input, Textarea } from '@lockin90/ui/marketing'`.
> **Source:** `packages/ui/src/marketing/Field/index.tsx` · CSS `packages/ui/src/marketing/Field/styles.css` (`.lk-field*`) on top of the base control class `.lk-input` (`styles/components/input.css`), folded into `dist/styles.css` by `tsup.config.ts`.
> **Exports:** `Input`, `Textarea`, type `InputProps`, type `TextareaProps`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (marketing) — no native counterpart by design.
> **Stories:** none — rendered live on the marketing site (`lockin90-marketing`).

---

## 1. Overview

The **labelled, controlled form controls** for the marketing site's contact/newsletter forms. The folder exports two components that share one wrapper layout (`.lk-field`: a mono uppercase label stacked over the control):

- **`Input`** — a labelled single-line `<input>` (any HTML `type`).
- **`Textarea`** — a labelled multi-line `<textarea>` (default 5 rows).

Both are **fully controlled** (`value` + `onChange(v: string)`), render their own `<label htmlFor>` tied to the control's `id`, and show a `*` in the accent color when `required`. They exist so marketing forms don't re-build the label/required/field-stack treatment per form.

> **Note:** these are the **marketing** `Input`/`Textarea`, deliberately distinct from the root kit's cross-platform `Input` (different, simpler API — see §5).

## 2. API contract

**Shared base (`BaseProps`)** — both components:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `id` | `string` | — (required) | used for `htmlFor`, the control `id`, **and** `name` |
| `label` | `string` | — (required) | the field label text |
| `required` | `boolean` | — | renders the accent `*` and sets the control `required` |
| `className` | `string` | — | merged onto the `.lk-field` wrapper |

**`Input`** adds:

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `type` | `string` | `'text'` | any HTML input type (`email`, `tel`, …) |
| `value` | `string` | — (required) | controlled value |
| `onChange` | `(v: string) => void` | — (required) | receives the **string value** (not the event) |
| `placeholder` | `string` | — | placeholder text |
| `autoComplete` | `string` | — | forwarded to the `<input>` |

**`Textarea`** adds: `value: string` (req), `onChange: (v: string) => void` (req), `placeholder?: string`, `rows?: number` (default `5`).

- Both are plain function components — **no `forwardRef`, no `...rest`** spread. The only props that reach the DOM control are the listed ones; arbitrary attributes (e.g. `maxLength`, `aria-describedby`, `inputMode`, `onBlur`) are **not** forwarded.
- `onChange` is pre-unwrapped: the component calls `onChange(e.target.value)`, so consumers get the string directly.
- `name` is **derived from `id`** — there is no separate `name` prop.

## 3. Visual spec (tokens — never hardcode)

**Wrapper + label (`.lk-field*`, this folder):**

| Element | Spec |
| --- | --- |
| Field (`.lk-field`) | `flex`, column, `gap 7px` |
| Label (`.lk-field-label`) | `--font-mono`, 11px, weight 500, uppercase, `letter-spacing 0.12em`, color `--text-dim` |
| Required mark (`.lk-field-required`) | the ` *`, color `--accent` (`#7C5CFF`) |

**Control:** `Input` emits `class="lk-input"`, `Textarea` emits `class="lk-textarea"`.

- The base **`.lk-input`** rule (`styles/components/input.css`) is typography-only: `width: 100%`, no border, `outline: 0`, transparent background, `--text` color, `--font-ui`, 14px, line-height 1.4, placeholder `--text-faint`.
- ⚠️ **Gap to flag:** the source comment in `Field/styles.css` says the control's glass/border/focus-ring (`--accent`) styling "lives in the package styles.css", **but the kit ships no `.lk-textarea` rule and no glass/border/padding on the standalone `.lk-input`** (that styling lives on the `.lk-input-field` *wrapper*, which `Field` does **not** use). So out of the box the marketing control surface (glass box, border, focus ring) is **supplied by the consuming marketing app's own CSS**, not by the kit. Treat the kit's contribution here as the **label + field-stack layout**; document/track the missing control rules rather than assuming they ship.

## 4. States

| State | Behavior (web) |
| --- | --- |
| Default | label (mono/uppercase/`--text-dim`) above the control; control text `--text`, placeholder `--text-faint` |
| Required | accent `*` appended to the label; `required` set on the control (native HTML constraint validation) |
| Focus | base `.lk-input` removes the outline (`outline: 0`); the visible focus ring (`--accent`) is part of the control glass styling supplied per §3's gap — ensure the marketing app provides it |
| Filled / empty | controlled — reflects `value`; empty shows `placeholder` |
| Error/invalid | **not built in** — no `error`/`invalid` prop; rely on native `required`/`type` validation or compose messaging around the field |
| Disabled | **not supported** — no `disabled` prop is forwarded |

## 5. Platform & relationship to root kit

**Web-only by design** — no `@lockin90/ui-native` counterpart for marketing form controls.

- **Distinct from the root `Input`.** The root cross-platform kit exports its **own** `Input` + `InputProps` (`packages/ui/src/components/Input.tsx`) built on the `.lk-input-field` wrapper shell (lead/trail/unit slots, `sm` size, invalid state). The marketing `Input` is a **different, simpler** component: a stacked mono label + a bare `.lk-input`, controlled via `onChange(v: string)`, with no slots/sizes/invalid state. The names collide but the contracts don't — import from the matching subpath.
- **`Textarea` has no root export** — it exists only here.
- **Class reuse without the shell:** marketing `Input` reuses the base `.lk-input` *typography* class but **not** the `.lk-input-field` container that gives root inputs their glass box — hence the §3 control-surface gap. The two should not be assumed visually identical.
- Native parity is N/A (marketing is web-only); product forms use the root/native `Input` instead.

## 6. Composition & usage

- **Composes from:** native `<label>`/`<input>`/`<textarea>` + `cn`. No other primitives.
- **Composes into:** marketing contact and newsletter forms (paired with the marketing `Button` for submit).
- **Controlled pattern:** hold `value` in the form's state; `onChange` gives you the string.

```tsx
const [email, setEmail] = useState('');
const [message, setMessage] = useState('');

<Input
  id="email"
  label="Email"
  type="email"
  required
  autoComplete="email"
  value={email}
  onChange={setEmail}
  placeholder="you@domain.com"
/>
<Textarea
  id="message"
  label="Message"
  required
  rows={6}
  value={message}
  onChange={setMessage}
/>
```

## 7. Accessibility

- The `<label htmlFor={id}>` is correctly associated with the control's `id`, so clicking the label focuses the control and screen readers announce the name — **always pass a meaningful `label`** (it doubles as the accessible name).
- `required` sets the native HTML `required` attribute → built-in constraint validation and `aria-required` semantics; the visible `*` is a sighted cue layered on top.
- **Limitation:** because no `...rest` is forwarded, you **cannot** add `aria-describedby`, `aria-invalid`, `inputMode`, `autoCapitalize`, etc. through these components. If a marketing form needs richer a11y/validation wiring, that's a reason to extend the kit (see §9), not to bypass it.
- Ensure the control's focus indicator is visible (the base `.lk-input` clears the outline — the focus ring must come from the control glass styling per §3).

## 8. Usage rules — Do / Don't

**Do**
- Use `Input`/`Textarea` for marketing form fields so the label + field-stack treatment stays uniform.
- Always pass a unique `id` (it wires `htmlFor`, `id`, and `name`) and a real `label`.
- Keep them controlled — own `value` in state and update from `onChange(v)`.
- Set `type`/`autoComplete` appropriately (`email`, `tel`, etc.) for native validation + autofill.

**Don't**
- ✗ Don't expect `onChange` to give you an event — it gives the **string** value.
- ✗ Don't rely on these for disabled/error/`aria-describedby` states — they aren't forwarded; extend the kit instead of hand-rolling.
- ✗ Don't hand-roll a labelled input/textarea with mono labels — use these components.
- ✗ Don't hardcode the label font/size/tracking or the accent `*` color — they come from the kit/tokens.
- ✗ Don't reach for the **root** `Input` when you want the marketing field (and vice versa) — match the subpath.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom `<div><label/><input/></div>` with a mono uppercase label re-creates `Field` and will drift — import `Input`/`Textarea`.
- **New capability → extend the primitive.** Disabled state, inline errors, `aria-describedby`, or a `name` distinct from `id` should be **added to these components** (with tokens), not bolted on locally.
- **Close the control-surface gap properly.** The missing `.lk-textarea`/glass `.lk-input` rules (§3) are a real gap — fix it by adding the control styling to the kit (so the marketing app stops owning it), not by sprinkling per-form CSS that diverges.
- **Tokens only.** The label treatment and accent `*` must come from the kit/tokens; hardcoded mono/uppercase/`#7C5CFF` is a bug even when it matches today.
