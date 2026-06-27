# SDD — `SideNav` (+ `NavItemData` / `NavGroupData` types)

> **Package:** `@lockin90/ui/admin` — web-only operator-console primitive (admin app is web-only). **Import as** `import { SideNav } from '@lockin90/ui/admin'`.
> **Source:** `packages/ui/src/admin/SideNav.tsx` · web CSS `packages/ui/src/styles/components/sidenav.css` (`.lk-snav*`). NO native counterpart.
> **Exports:** `SideNav`, type `SideNavProps`, type `NavItemData`, type `NavGroupData`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (admin) — no native surface by design.
> **Stories:** `packages/ui/src/stories/SideNav.stories.tsx`.

---

## 1. Overview

The load-bearing **operator (admin) left rail**. A sticky, full-height glass rail with a brand
lockup, optionally-labelled groups of nav items, a gradient active-indicator bar, per-item count
badges, and a status footer. On narrow widths it collapses to an **off-canvas drawer + scrim**
driven by `mobileOpen`. It is the only sanctioned admin-shell rail and matches the `.nav` rail from
`lockin90-design/admin/*.html`.

Secondary exports describe the data the rail renders:

- **`NavItemData`** — one navigable row: `icon` + `label`, optional `href` (→ `<a>`, else `<button>`),
  `active`, a tone-tinted `count` badge, and an `onSelect` handler (also closes the mobile drawer).
- **`NavGroupData`** — a cluster of items with an optional mono uppercase `label`.

## 2. API contract

**`SideNavProps`**

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items` | `NavItemData[]` | — | flat list — use this **OR** `groups` |
| `groups` | `NavGroupData[]` | — | labelled clusters — use this **OR** `items` |
| `brand` | `ReactNode` | a `BrandMark` lockup | top brand slot |
| `footer` | `ReactNode` | — | bottom status / user slot (only rendered when non-null) |
| `mobileOpen` | `boolean` | `false` | controlled drawer state on narrow widths |
| `onMobileOpenChange` | `(open: boolean) => void` | — | fired on toggle, scrim tap, item-select, Esc |

**`NavItemData`**

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `icon` | `IconName` | — | leading glyph from the shared icon set |
| `label` | `string` | — | visible row label |
| `href` | `string` | — | when present row renders as `<a>`, else `<button>` |
| `active` | `boolean` | — | current page → gradient bar + accent text + `aria-current="page"` |
| `count` | `number` | — | trailing count badge (e.g. pending refunds) |
| `countTone` | `'accent' \| 'ok' \| 'warn' \| 'danger'` | `'accent'` | badge tone |
| `onSelect` | `() => void` | — | click handler; also closes the drawer |

**`NavGroupData`** — `{ label?: string; items: NavItemData[] }`.

- `resolvedGroups = groups ?? (items ? [{ items }] : [])` — `groups` wins; a flat `items` is wrapped
  in a single label-less group.
- A `useEffect` adds a `keydown` listener while `mobileOpen` and closes on **Escape**.
- `NavItem`: when `onSelect` is set it fires on click (and `preventDefault()`s for the button case so
  no navigation occurs), then always calls `onClose()`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Value / token |
| --- | --- |
| Rail | `width: 264px`, `sticky top:0`, `height: 100vh`, `padding: 16px 12px`, `flex` column `gap: 4px` |
| Rail surface | `linear-gradient(180deg, rgba(12,15,26,.7), rgba(8,10,18,.55))` + `backdrop-filter: blur(18px) saturate(120%)` |
| Rail border | `border-right: 1px solid --border` |
| Brand slot | `padding: 6px 8px 14px`, inline-flex `gap: 10px`; default `BrandMark variant="lockup" size={17}` |
| Group label | `--font-mono` 9.5px, `letter-spacing: .2em`, uppercase, `--text-faint`, `padding: 14px 10px 6px` |
| Item | `gap: 11px`, `padding: 8px 10px`, radius `--r-sm`, `--text-dim`, `--font-ui` 12.5px/500 |
| Item icon | 16px (`Icon size={16}`), `opacity: .85` |
| Count badge | `--font-mono` 10px, `padding: 1px 7px`, radius `--r-pill` |
| Footer | `margin-top: auto`, `padding: 10px`, 11px, `--text-faint` |

- **Item hover:** `background: --glass`, `color: --text`.
- **Active item:** `color: --accent`, `background: rgba(124,92,255,.12)`; a `::before` indicator bar at
  `left: -12px`, `width: 3px`, `background: --grad-cta`, `box-shadow: --glow-accent`.
- **Count tones:** accent → `--accent`, ok → `--ok`, warn → `--warn`, danger → `--zone-low`, each on a
  matching ~14–16%-tinted fill + ~30% border.
- **Transitions:** item `background`/`color` 0.25s `--ease`. Drawer `transform` 0.3s `--ease`.

## 4. States

| State | Class / behavior |
| --- | --- |
| Default | `.lk-snav-item` — dim label, transparent bg |
| Hover | `--glass` fill, `--text` label |
| Active | `.is-active` — accent label + tinted fill + gradient `::before` bar; `aria-current="page"` |
| Drawer closed (narrow) | `.lk-snav` `transform: translateX(-100%)`; `.lk-snav-scrim` `display: none` |
| Drawer open (narrow) | `.lk-snav.is-open` `transform: none` + `--elev-2`; `.lk-snav-scrim.is-open` painted `rgba(3,4,9,.6)` + `blur(2px)` |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` zeroes `.lk-snav` / `.lk-snav-item` transitions |

The drawer is **controlled** — `mobileOpen` + `onMobileOpenChange` are owned by the host shell.

## 5. Platform & relationship to root kit

**Web-only by design.** The admin operator console has no native surface, so there is no
`@lockin90/ui-native` counterpart and no parity obligation. The rail relies on web-only substrate:
`position: sticky`, `backdrop-filter` glass blur, a responsive off-canvas `@media` drawer, and a
document-level `keydown` listener for Escape — none of which map to a React Native shell.

It composes two **root** kit primitives: `Icon` (per-item glyphs, `size={16}`) and `BrandMark`
(the default `variant="lockup"` brand slot). It is not a wrapper of any root primitive — it is an
admin-shell-specific layout component.

## 6. Composition & usage

- **Used by:** the admin app shell as the persistent left rail; the host owns the `mobileOpen` state
  and renders a hamburger toggle in its topbar.
- **Composes:** `Icon`, `BrandMark`; tone-tinted count badges; arbitrary `brand` / `footer` slots.

```tsx
import { SideNav, type NavGroupData } from '@lockin90/ui/admin';

const groups: NavGroupData[] = [
  { label: 'Overview', items: [
    { icon: 'grid', label: 'Dashboard', href: '/admin', active: true },
    { icon: 'users', label: 'Users', href: '/admin/users' },
  ]},
  { label: 'Ops', items: [
    { icon: 'refund', label: 'Refunds', href: '/admin/refunds', count: 3, countTone: 'warn' },
  ]},
];

function Shell() {
  const [open, setOpen] = useState(false);
  return (
    <SideNav
      groups={groups}
      mobileOpen={open}
      onMobileOpenChange={setOpen}
      footer={<span>build a1b2c3 · prod</span>}
    />
  );
}
```

## 7. Accessibility

- **Rail:** `<aside aria-label="Admin navigation">` wrapping `<nav aria-label="Primary">`.
- **Items:** real `<a>` (with `href`) or `<button type="button">` (otherwise) — both focusable and
  keyboard-activatable; the active item carries `aria-current="page"`.
- **Icons** are `aria-hidden`; the visible `label` is the accessible name.
- **Drawer:** Escape closes it (document listener); the scrim is a focusable-by-key dismiss region
  (`onKeyDown` handles Enter/Space) and `aria-hidden` while closed.
- **Hit target:** item padding (`8px 10px`) + 16px icon yields a comfortable click row; the
  `12.5px` label keeps the dense-admin rhythm.

## 8. Usage rules — Do / Don't

**Do**
- Pass **either** `items` **or** `groups` — not both (groups wins if you pass both).
- Own `mobileOpen` in the shell and wire a topbar toggle to `onMobileOpenChange`.
- Use `count` + `countTone` for actionable queues (pending refunds → `warn`/`danger`).
- Mark exactly one item `active` per route.

**Don't**
- ✗ Don't hand-roll an admin rail — use `SideNav`.
- ✗ Don't hardcode the 264px width, gradient surface, or active-bar gradient — they come from tokens / the kit CSS.
- ✗ Don't leave the drawer uncontrolled — without `onMobileOpenChange` the scrim/Esc can't close it.
- ✗ Don't put more than one `active` item in a single rail.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom sticky admin rail re-creating the glass surface + gradient active bar
  is a maintenance/drift violation — import `SideNav`.
- **New need → extend the type.** If a row needs a new affordance (e.g. a secondary badge), add a
  field to `NavItemData` here — never fork the component per screen.
- **Tokens only.** The active-bar `--grad-cta` + `--glow-accent`, count-tone colors, and radii come
  from `@lockin90/tokens`; any hardcoded equivalent is a bug (Aurora Flux renames will break it).
- **Web-only.** This is an admin primitive; do not attempt to consume it from a native surface or
  claim web≡native parity — there is none to hold.
