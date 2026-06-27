# SDD — `RecoveryCodeGrid`

> **Package:** `@lockin90/ui/admin` — web-only operator-console primitive (admin app is web-only).
> **Import as:** `import { RecoveryCodeGrid } from '@lockin90/ui/admin'`.
> **Source:** `packages/ui/src/admin/RecoveryCodeGrid.tsx` · web CSS `packages/ui/src/styles/components/recoverycodes.css` (`.lk-reccodes*`, `.lk-reccode*`). NO native counterpart.
> **Exports:** `RecoveryCodeGrid`, type `RecoveryCodeGridProps`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (admin) — operator console has no native surface.
> **Stories:** `packages/ui/src/stories/AdminSecurity.stories.tsx`.

---

## 1. Overview

A **read-only grid of masked MFA recovery (backup) codes** for the operator console's security
panel. Each cell shows a zero-padded 1-based index + the **masked** code in mono; `used` codes are
struck-through and dimmed. An optional header carries a `"N of M unused"` status chip.

It is a **pure render** component (no state): the caller owns generation / regeneration / reveal —
this only *displays* what it's given, and only ever the **masked** string (it never receives or
renders plaintext codes). Column count is configurable (default 2). Matches the
`.rec-grid` / `.rec-code` block from `lockin90-design/admin/settings.html`.

## 2. API contract

### `RecoveryCodeGridProps` (extends `Omit<HTMLAttributes<HTMLDivElement>, 'children'>`)

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `codes` | `{ masked: string; used?: boolean }[]` | — | the codes, in order; `masked` is the display string (e.g. `'7•••-•••2'`); `used` strikes it through |
| `unusedCount` | `number?` | — | remaining unused count for the header chip (`N of M unused`); **omit to hide the header** |
| `columns` | `number?` | `2` | number of grid columns (matches the design) |
| `className` | `string` | — | merged onto `.lk-reccodes` via `cn` |
| `style` | `CSSProperties?` | — | merged into the grid element's style alongside the cols var |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | spread on the root `<div>`; `children` omitted |

- The header renders **iff** `unusedCount != null` (`showHeader`); `M` in the chip is `codes.length`.
- Index is rendered via `String(i + 1).padStart(2, '0')` → `01, 02, … 10`.
- `columns` is applied through a CSS custom property `--lk-reccodes-cols` set on the grid element
  (merged with any caller `style`), driving `grid-template-columns: repeat(var(...), 1fr)`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Token / value |
| --- | --- |
| Container | `flex` column, full width |
| Header row | `gap 10px`, `margin-bottom 12px`, wraps |
| Header title | `--font-mono`, `11px`/500, uppercase `0.12em`, `--text-faint` |
| Unused-count chip | `--font-mono`, `11px`, `--text-dim`, `1px --border-2`, `--r-pill`, `--glass-2` bg, `padding 3px 10px` |
| Grid | `repeat(var(--lk-reccodes-cols, 2), 1fr)`, `gap 8px` |
| Code cell | `gap 9px`, `padding 8px 11px`, `--r-sm`, `--bg-0` bg, `1px --border`, `--font-mono`, `12.5px`, `letter-spacing 0.08em`, `--text` |
| Used cell | `--text-faint` + `text-decoration: line-through` |
| Index | `10px`, `--text-faint`, `flex:none` |
| Code value | ellipsised (`overflow:hidden`, `white-space:nowrap`) |

All surfaces are token-driven; there are no literal colours in this component.

## 4. States

| State | Behaviour |
| --- | --- |
| With header | `unusedCount != null` → title + `N of M unused` chip shown |
| Headerless | `unusedCount` omitted → grid only |
| Unused code | default cell (mono, `--text`) |
| Used code | `.lk-reccode-used` → dimmed `--text-faint` + line-through |
| Custom columns | `columns` drives `--lk-reccodes-cols` |
| Empty `codes` | renders an empty grid (header still shows if `unusedCount` given) |

No hover / focus / pressed / disabled — the grid is read-only (`role="list"`, items `role="listitem"`).

## 5. Platform & relationship to root kit

**Web-only by design.** Recovery-code management lives only in the admin security console (web),
so there is no native `RecoveryCodeGrid` and none is planned — web≡native parity does not apply.
The component is fully self-contained (no root-primitive composition; only `cn`). It uses the CSS
`repeat()` grid + a custom property for the column count — standard web layout with no native
analogue needed. CSS folds into the shared `dist/styles.css`.

## 6. Composition & usage

- **Composes:** nothing from the kit beyond the `cn` classname helper.
- **Used by:** admin Settings → security / MFA panel, alongside a "Regenerate codes" action the
  caller owns. Pair the grid with a separate kit `Button` for regenerate; this component only displays.

```tsx
import { RecoveryCodeGrid } from '@lockin90/ui/admin';

<RecoveryCodeGrid
  unusedCount={8}
  codes={[
    { masked: '7•••-•••2' },
    { masked: '3•••-•••9', used: true },
    { masked: 'A•••-•••4' },
    // …
  ]}
/>

// headerless, 3-up
<RecoveryCodeGrid columns={3} codes={codes} />
```

## 7. Accessibility

- The grid is `role="list"` with `aria-label="Recovery codes"`; each cell is `role="listitem"`
  with an `aria-label` of `"Code <NN>"` (+ `", used"` when consumed) — so the masked dots aren't
  read as noise and used-state is conveyed beyond the strike-through.
- The numeric index span is `aria-hidden` (decorative; the index is already in the cell's label).
- Used-state is signalled by **both** the dimmed colour and the `, used` in the accessible label —
  never colour/strike alone.
- Read-only: there are no focusable controls inside the grid (it conveys status, not actions).

## 8. Usage rules — Do / Don't

**Do**
- Pass only **masked** strings — masking is the caller's job; this component must never see plaintext.
- Provide `unusedCount` to surface remaining-codes status; omit it for a bare grid.
- Use `columns` to fit the panel width (default 2 matches the design).
- Render a separate kit action (e.g. `Button`) for regenerate; keep this display-only.

**Don't**
- ✗ Don't pass unmasked recovery codes — it renders whatever string it's given verbatim.
- ✗ Don't add interactivity (copy/reveal) inside the grid — it is read-only status.
- ✗ Don't hardcode the cell/chip surfaces, radii, or mono type — all token-sourced.
- ✗ Don't expect a native version — it is `/admin` web-only.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-built list of `<code>` chips for backup codes re-creates this
  primitive and will drift from the index/used/header conventions — import `RecoveryCodeGrid`.
- **New need → extend here.** A new affordance (e.g. a per-code reveal/copy) belongs on this
  component (guarded, opt-in), not as a one-off in an admin route.
- **Tokens only.** Cell, chip, border, radius, and mono type come from `@lockin90/tokens`.
- **Masked-only is canonical.** The contract is "display masked codes" — never widen it to render
  plaintext; secret reveal/clipboard belongs to `SecretField`, not here.
