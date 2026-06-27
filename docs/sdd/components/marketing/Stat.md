# SDD — `Stat` (marketing)

> **Package:** `@lockin90/ui/marketing` — web-only marketing primitive (Aurora marketing site).
> **Import as:** `import { Stat } from '@lockin90/ui/marketing'`.
> **Source:** `packages/ui/src/marketing/Stat/index.tsx` · CSS `packages/ui/src/marketing/Stat/styles.css` (`.lk-mkt-stat*`) + shared `.lk-gradient-text` in `packages/ui/src/styles/base.css`.
> **Exports:** `Stat`, type `StatProps`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (marketing) — shares a name with the root `Stat` but is a SEPARATE, oversized hero figure.
> **Stories:** none — rendered live on the marketing site (`lockin90-marketing`).

---

## 1. Overview

A **marketing figure block** — one big **flux-gradient display number** over a mono uppercase eyebrow label. The "90", "2.4×", "12k" hero/section figures that anchor a metrics band ("90-day program", "2.4× faster recovery"). It is intentionally **oversized and decorative** — distinct from the compact dashboard `Stat` in the root kit (see §5).

Single fixed shape: a value string + a label string, stacked. No variants, no delta, no empty state — marketing figures are authored copy, not live data.

## 2. API contract

| Prop | Type | Default | Web | Notes |
| --- | --- | --- | --- | --- |
| `value` | `string` | — (required) | ✓ | the headline figure, e.g. `"90"`, `"2.4×"`, `"12k"` — a **string** (pre-formatted) |
| `label` | `string` | — (required) | ✓ | the mono caption beneath it |
| `className` | `string` | — | ✓ | appended via `cn(...)` |

- Plain function component; renders `<div class="lk-mkt-stat"><div class="lk-mkt-stat-value lk-gradient-text">{value}</div><div class="lk-mkt-stat-label">{label}</div></div>`.
- No `forwardRef`, no `...rest` spread. `value`/`label` are plain strings (not `ReactNode`) — figures are static copy.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Token / value |
| --- | --- |
| Container | `flex`, `flex-direction: column`, `gap: 8px` |
| Value font | `--font-display`, weight `700`, `font-size: clamp(40px, 6vw, 60px)`, `letter-spacing: -0.03em`, `line-height: 1` |
| Value fill | `.lk-gradient-text` — the animated **mirrored energy spectrum** (`lime→mint→cyan→violet→magenta→…`), clipped to text, `animation: lk-flow-text 9s linear infinite` |
| Label font | `--font-mono`, `11px`, weight `500`, `text-transform: uppercase`, `letter-spacing: 0.18em` |
| Label color | `--text-dim` |

The value is the only gradient-animated text on the figure; the `clamp()` makes it fluidly responsive from 40px (mobile) to 60px (desktop).

## 4. States

Stat is **static** — no hover / focus / pressed / disabled / loading / empty / error states. The value's gradient continuously animates (`lk-flow-text`, 9s loop). It is non-interactive and never receives focus. (Unlike the root `Stat`, there is **no `empty` placeholder mode** here — see §5.)

## 5. Platform & relationship to root kit

**🖥️ web-only (marketing).** Marketing is web-only — no native counterpart, no parity obligation.

**Relationship to root `Stat` (`@lockin90/ui`, `packages/ui/src/components/Stat.tsx`) — SEPARATE component, same name, different role.** Do not confuse them:

- **Root `Stat`** (class `.lk-stat`) is the **compact app dashboard tile**: `label` + `value` + optional signed `delta`/`deltaDir`, an `empty` em-dash placeholder mode with a `hint`, `ReactNode` value, spreads `HTMLAttributes`. Used in account/dashboard surfaces with live data.
- **Marketing `Stat`** (class `.lk-mkt-stat`) is the **oversized hero/section figure**: a big `clamp(40–60px)` `--font-display` gradient number over a wide-tracked mono label. **String** value, no delta, no empty mode, no rest-spread.
- They emit different classes (`.lk-stat` vs `.lk-mkt-stat`) and are **not interchangeable imports** — use the root `Stat` in app screens, this one on the marketing site.

## 6. Composition & usage

- **Composes from:** the shared `.lk-gradient-text` treatment; otherwise a leaf.
- **Used as:** a metrics/proof band — several `Stat`s in a row/grid (often inside `Card`s or a `Section`).

```tsx
// A proof band of figures:
<div className="stat-row">
  <Stat value="90" label="Day program" />
  <Stat value="2.4×" label="Faster recovery" />
  <Stat value="12k" label="Athletes" />
</div>
```

## 7. Accessibility

- Renders plain `<div>`s with no role — the value + label read as ordinary text in source order (value first, then label).
- `value` should be a human-readable string already (e.g. `"2.4×"`, `"12k"`) so screen readers announce the same thing a sighted user sees — don't rely on the gradient to convey meaning.
- The continuous gradient animation is on a text fill (not motion/transform); it is low-distraction. If a global reduced-motion treatment is desired, handle it at the `.lk-flow-text` keyframe level (shared), not per-instance.

## 8. Usage rules — Do / Don't

**Do**
- Use marketing `Stat` for big hero/section proof figures.
- Pre-format the `value` string (`"2.4×"`, `"12k"`, `"90"`) so it reads correctly to everyone.
- Keep `label` short and mono-friendly (it's uppercased + wide-tracked).

**Don't**
- ✗ Don't use marketing `Stat` for live dashboard metrics — use the root `@lockin90/ui` `Stat` (it has delta + empty mode).
- ✗ Don't hand-roll a giant gradient number — import `Stat` (and `.lk-gradient-text` is shared, don't reinvent it).
- ✗ Don't pass a `delta`/`empty`/`hint` here — those props don't exist on the marketing `Stat`.
- ✗ Don't hardcode the display font size / gradient — they come from tokens + `.lk-gradient-text`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke big number with a hand-built gradient + mono caption is a parity hazard — the figure recipe lives once in `Stat` and the gradient once in `.lk-gradient-text`. Import them.
- **Don't confuse the two `Stat`s.** Reaching for the wrong one (marketing figure in a dashboard, or compact tile in a hero band) is the #1 risk of the shared name — pick by package + role (§5).
- **New figure need → extend `Stat`.** If marketing needs a sub-caption or a unit suffix slot, add it to this component (mapping to `.lk-mkt-stat*`) — never a one-off styled block.
- **Tokens only.** Display font, mono label, gradient, and spacing all come from tokens / shared classes — no raw font sizes or colors at the call site (the responsive `clamp()` is encoded here, not per-instance).
