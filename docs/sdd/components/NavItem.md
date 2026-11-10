# SDD — `NavItem`

> **Package:** `@lockin90/ui` (web only, see §5).
> **Source:** `packages/ui/src/components/NavItem.tsx` · web CSS `packages/ui/src/styles/components/navitem.css` (`.lk-nav-item*`).
> **Exports:** `NavItem`, type `NavItemProps`.
> **Status:** Shipped (web 2026-11-11). **Parity:** web only: a phone navigates with `TabBar` (§5).

---

## 1. Overview

A **sidebar's link row**: an icon, the page's name, an optional badge; the current page tinted accent
with a glowing bar on the sidebar's edge, as `lockin90-design/web/settings.html` draws it. For the
LockIn90 web shell's sidebar (1.34h, owner 2026-11-10). `ListRow` is a list's row, not a navigation
link; `TabBar` is the phone's bottom bar.

## 2. API contract

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | — (required) | the page's name |
| `icon` | `ReactNode` | — | a kit `Icon` (18 px), before the label, hidden from screen readers |
| `active` | `boolean` | `false` | the page shown: highlighted, the bar, `aria-current="page"` |
| `badge` | `ReactNode` | — | a small count after the label |
| _rest_ | `AnchorHTMLAttributes` | — | `href` and the app router's `onClick`; ref forwarded |

## 3. Visual spec (tokens — never hardcode)

`10px 12px`, gap 12, `--r-sm`, `--font-ui` 14 / 500, `--text-dim`; hover `--glass` + `--text`. Active:
`--text`, the accent at 10% behind it and at 28% as its border, and a 3 × 22 px `--grad-cta` bar with
the accent glow, `--lk-nav-bar-offset` (16 px: the sidebar's padding) left of the row. Badge: mono
10px, `--accent-2` on its 12% tint, a pill.

## 4. States

| State | What |
| --- | --- |
| Rest | `--text-dim` |
| Hover | `--glass`, `--text` |
| Focus | a 2px `--accent-2` outline, 2px off |
| Active | tint, border, the bar |

## 5. Web ↔ native parity

**Web only, on purpose.** The phone has no sidebar: the app's pages are reached through the bottom
`TabBar`. A native `NavItem` is added if a native screen ever gets a sidebar (a tablet layout).

## 6. Composition & usage

```tsx
<nav aria-label={t('web:shell.nav')}>
  <NavItem href="/settings" label={t('account.menu.settings')}
    icon={<Icon name="settings" size={18} />} active={pathname === '/settings'}
    onClick={(e) => { e.preventDefault(); navigate('/settings') }} />
</nav>
```

## 7. Accessibility

A real `<a href>`; the current page `aria-current="page"`. Put the rows in a `<nav>` named by the app.

## 8. Usage rules — Do / Don't

- **Do** list only pages that exist.
- **Don't** use it for actions (a `Button`) or for a list of records (`ListRow`).

## 9. Anti-patterns & lookalike ban

A hand-styled sidebar link in an app is a lookalike: use this.
