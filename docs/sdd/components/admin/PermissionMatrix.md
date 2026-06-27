# SDD — `PermissionMatrix` (+ `MatrixToggle`, `MatrixState`, `MatrixRow`, `MatrixCol`)

> **Package:** `@lockin90/ui/admin` — web-only operator-console primitive (admin app is web-only).
> **Import as:** `import { PermissionMatrix, MatrixToggle } from '@lockin90/ui/admin'`.
> **Source:** `packages/ui/src/admin/PermissionMatrix.tsx` (`'use client'`) · web CSS `packages/ui/src/styles/components/permissionmatrix.css` (`.lk-matrix*`, `.lk-mtog*`). NO native counterpart.
> **Exports:** `PermissionMatrix`, `MatrixToggle`, types `PermissionMatrixProps`, `MatrixToggleProps`, `MatrixState`, `MatrixRow`, `MatrixCol`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (admin) — operator console has no native surface.
> **Stories:** `packages/ui/src/stories/PermissionMatrix.stories.tsx`.

---

## 1. Overview

The operator **capability × role permission grid** for the admin settings console. A
horizontally-scrollable `<table>` with a **sticky first column** of capability rows (label +
optional description; `danger` rows tinted bad) and one column per role. Every body cell is a
**`MatrixToggle`** reflecting one of four `MatrixState`s.

It is a **controlled** component: it holds **no cell state of its own** — toggling a cell
delegates to the parent via `onToggle(rowKey, colKey)`. Matches `table.matrix` + `.mtog` from
`lockin90-design/admin/settings.html`.

**Secondary exports (all documented here):**

- **`MatrixToggle`** — a single permission cell; also exported standalone for bespoke layouts.
  Renders one of four states (see §4).
- **`MatrixState`** = `'on' | 'off' | 'locked' | 'na'` — the cell's visual + interaction state.
- **`MatrixRow`** = `{ key; label; desc?; danger? }` — a capability (table row); `danger` tints
  the label red and renders the granted toggle in the warm gradient.
- **`MatrixCol`** = `{ key; label }` — a role (table column).

## 2. API contract

### `PermissionMatrixProps`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `rows` | `MatrixRow[]` | — | capabilities, top-to-bottom |
| `cols` | `MatrixCol[]` | — | roles, left-to-right |
| `cells` | `Record<string, Record<string, MatrixState>>` | — | states keyed `cells[rowKey][colKey]`; a missing entry renders `off` |
| `onToggle` | `(rowKey: string, colKey: string) => void` | — | fired when a toggleable (`on`/`off`) cell is activated; omit → cells are display-only |

### `MatrixToggleProps`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `state` | `MatrixState` | — | `on` / `off` / `locked` / `na` |
| `danger` | `boolean?` | — | warm/bad treatment for danger capabilities |
| `label` | `string` | — | accessible label, e.g. `"billing: users.read"` |
| `onToggle` | `() => void` | — | fired on click / Space / Enter when toggleable |

### `MatrixRow` / `MatrixCol`

| Type | Fields |
| --- | --- |
| `MatrixRow` | `key: string`, `label: string`, `desc?: string`, `danger?: boolean` |
| `MatrixCol` | `key: string`, `label: string` |

- Neither component spreads `...rest` — the prop sets are closed.
- `PermissionMatrix` passes each cell `label={`${col.label}: ${row.label}`}` and only forwards a
  bound `onToggle` when the parent supplied one (else the cell is inert even if `on`/`off`).

## 3. Visual spec (tokens — never hardcode)

### Table (`.lk-matrix*`)

| Aspect | Token / value |
| --- | --- |
| Wrap | `.lk-matrix-wrap` `overflow-x:auto` |
| Table | `12px`, `min-width 720px`, separate borders |
| Cell padding | `10px`, centered; `border-bottom 1px --border` |
| Header role | `--font-mono`, `10px`, `--text-dim` |
| Role pill (`.lk-matrix-role`) | `--font-mono`, `999px`, `1px --border-2`, `--glass` bg, `--text-dim` |
| Sticky cap column | `--font-mono`, `11.5px`, `--text`, `position:sticky left:0`, `--glass` bg, `border-right 1px --border` |
| Cap desc | `9.5px`, `--text-faint` |
| Danger cap label | `--bad` |
| Row hover | body cells → `--glass`; sticky cap → `--glass-2` |

### Toggle (`.lk-mtog*`)

| State | Token / value |
| --- | --- |
| Base | `22px`, `6px` radius, `1.5px --border-2`, `--glass` bg, transition `--ease` |
| Focus-visible | border `--accent` + `3px` `--accent` (30% mix) ring |
| `on` (`aria-checked=true`) | `--grad-cta` bg, transparent border, `--bg-0` check glyph (visible) |
| `on` + `danger` | `--grad-warm` bg |
| `locked` | `--accent` glyph, `--accent` (22%) bg, `--accent` (40%) border, `cursor:not-allowed` |
| `locked` + `danger` | `--warn` glyph + `--warn` (20%/40%) bg/border |
| `na` (`.lk-mtog-dash`) | dashed border, `cursor:default`, `::after` `–` in `--font-mono` `--text-faint` |

## 4. States

`MatrixToggle` renders four mutually-exclusive states:

| `state` | Render | Interactive | Role / a11y |
| --- | --- | --- | --- |
| `on` | grad-cta fill + check glyph | ✓ | `role="switch"` `aria-checked=true`, `tabIndex 0` |
| `off` | empty outline | ✓ | `role="switch"` `aria-checked=false`, `tabIndex 0` |
| `locked` | lock glyph (`Icon name="lock"`), accent fill | ✗ | `role="img"`, `aria-label="…: granted (locked)"`, `title` tooltip |
| `na` | faint dashed `–` | ✗ | `role="img"`, `aria-label="…: not applicable"` |

- **Interactivity** = `state === 'on' || state === 'off'`. Only those cells take `tabIndex 0`,
  fire `onClick`, and respond to **Space / Enter** (`onKeyDown` calls `preventDefault()` then
  `onToggle?.()`). `locked` / `na` are inert with `tabIndex -1`.
- **Table-level:** `tr:hover` highlights the row (incl. the sticky cap); the cap column stays
  pinned on horizontal scroll.

## 5. Platform & relationship to root kit

**Web-only by design.** The permission editor lives only in the admin settings console (web), so
there is no native `PermissionMatrix`/`MatrixToggle` and none is planned — web≡native parity does
not apply. It relies on web-only substrate that has no native equivalent: a real `<table>` with
`position: sticky` first column and `overflow-x: auto` scrolling, plus pointer hover. It composes
the root `Icon` (`lock`, `check`) but is otherwise self-contained. CSS folds into the shared
`dist/styles.css`. This is the file marked `'use client'` (it wires keyboard/click handlers).

## 6. Composition & usage

- **Composes:** `Icon` (`lock`, `check`) from the root kit.
- **Used by:** admin Settings → roles/permissions editor. The parent owns the `cells` map and
  flips a state inside `onToggle`, then re-renders (controlled pattern).

```tsx
import { PermissionMatrix, type MatrixState } from '@lockin90/ui/admin';

const rows = [
  { key: 'users.read',   label: 'users.read' },
  { key: 'users.delete', label: 'users.delete', desc: 'Hard-delete accounts', danger: true },
];
const cols = [{ key: 'viewer', label: 'Viewer' }, { key: 'root', label: 'Root' }];
const [cells, setCells] = useState<Record<string, Record<string, MatrixState>>>({
  'users.read':   { viewer: 'on',  root: 'locked' },
  'users.delete': { viewer: 'na',  root: 'on' },
});

<PermissionMatrix
  rows={rows}
  cols={cols}
  cells={cells}
  onToggle={(r, c) =>
    setCells((p) => ({ ...p, [r]: { ...p[r], [c]: p[r]?.[c] === 'on' ? 'off' : 'on' } }))
  }
/>
```

## 7. Accessibility

- Toggleable cells are `role="switch"` with `aria-checked` reflecting `on`/`off`, a descriptive
  `aria-label` (`"<role>: <capability>"`), and full keyboard support (**Space/Enter** flip, focus
  ring via `:focus-visible`).
- `locked` and `na` are `role="img"` with explanatory `aria-label`s and are removed from the tab
  order (`tabIndex -1`) so keyboard users skip immutable cells.
- Table semantics: `<th scope="col">` role headers, sticky `Capability` header; the cap column is
  a `<td>` carrying the label + description text.
- State is **not** conveyed by colour alone — the check glyph (on), lock glyph (locked), and dash
  (na) each carry a distinct shape + label.

## 8. Usage rules — Do / Don't

**Do**
- Treat it as **controlled**: own `cells` and update inside `onToggle`.
- Use `locked` for immutable grants (e.g. root) and `na` for capabilities that don't apply to a role.
- Mark destructive capabilities `danger` so their granted cells render the warm gradient.
- Provide a `desc` for non-obvious capability keys.

**Don't**
- ✗ Don't expect the matrix to mutate `cells` itself — it has no internal state.
- ✗ Don't make `locked`/`na` cells interactive — those states are intentionally inert.
- ✗ Don't hardcode the grad-cta/grad-warm/accent colours, radii, or fonts — all token-sourced.
- ✗ Don't expect a native version — it is `/admin` web-only (sticky table + hover).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-built checkbox grid for permissions re-creates this primitive and
  will drift from the four-state / sticky-column / danger conventions — import `PermissionMatrix`.
- **New cell state → add to `MatrixState`.** A new intersection meaning (e.g. "inherited") is a
  new `MatrixState` value + branch in `MatrixToggle`, not a one-off cell renderer.
- **Tokens only.** The on/danger gradients, locked/na tones, radii, and mono type come from
  `@lockin90/tokens`.
- **Controlled contract is canonical.** Keep state in the parent; never bolt local `useState` onto
  `PermissionMatrix` to "make it work" — that breaks the single-source-of-truth the editor relies on.
