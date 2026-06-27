# SDD — `Pagination` (+ `Breadcrumb` cross-ref)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitives.
> **Source:** `packages/ui/src/components/Pagination.tsx` · `packages/ui-native/src/components/Pagination.tsx` ·
> web CSS `packages/ui/src/styles/components/pager.css` (`.lk-pager*`, `.lk-crumb*`).
> **Exports:** `Pagination`, `Breadcrumb`, types `PaginationProps`, `Crumb`, `BreadcrumbProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; platform-shaped impl (web `<button>`/`<a href>` vs native `Pressable`; web has hover, no `href` navigation on native).
> **Stories:** `packages/ui/src/stories/Pagination.stories.tsx` · `packages/ui-native/src/stories/Pagination.stories.tsx`.

---

## 1. Overview

Two **admin/CMS navigation atoms** shipped from one file:

- **`Pagination`** — a numbered pager: chevron prev/next, a row of ~32px page buttons with **mono numerals**, the active page filled with the violet `--accent`, and `…` gaps for collapsed ranges. Prev/next dim and disable at the ends.
- **`Breadcrumb`** (secondary export) — an inline ancestor trail: dim clickable ancestors that brighten on hover, a bold current leaf, and faint chevron separators.

Both are the *only* sanctioned forms of their pattern — hand-rolling a pager or crumb trail is a parity violation (§9). The page list uses **ellipsis truncation**: ≤7 pages show all; otherwise always first, last, current, and current±1, with `'…'` marking collapsed runs (identical `pageItems()` helper on both platforms).

## 2. API contract

### `Pagination`

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `page` | `number` | `1` | ✓ | ✓ | current page, 1-based; clamped to `[1, count]` |
| `pageCount` | `number` | `8` | ✓ | ✓ | total pages; floored to `1` minimum |
| `onChange` | `(page: number) => void` | — | ✓ | ✓ | fires with the target page; no-op for same/out-of-range |
| `className` | `string` | — | ✓ | — | web only |
| _rest_ | `HTMLAttributes<HTMLElement>` minus `onChange` (web) | — | ✓ | — | spreads to the `<nav>` |

- **Web:** `forwardRef<HTMLElement>`; renders a `<nav aria-label="Pagination">` of `<button>`s.
- **Native:** plain function; renders a `View` row of `Pressable`s. No `...rest`/`style`/`ref`.

### `Breadcrumb`

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `items` | `Crumb[]` | `[Admin, Users, Profile]` | ✓ | ✓ | `Crumb = { label: string; href?: string }` |
| `onNavigate` | `(index: number) => void` | — | ✓ | ✓ | fires with the clicked ancestor index |
| `className` | `string` | — | ✓ | — | web only |
| _rest_ | `HTMLAttributes<HTMLElement>` minus `onNavigate` (web) | — | ✓ | — | spreads to the `<nav>` |

- **Web:** `forwardRef<HTMLElement>`; ancestors render `<a href={crumb.href}>` (real link; `preventDefault` if no `href`) + the current leaf is a `<span aria-current="page">`.
- **Native:** ancestors are `Pressable` (no `href` — press only); the current leaf is a `Text`.

## 3. Visual spec (tokens — never hardcode)

**Pagination button** (`.lk-pager-btn` / native `styles.btn`):

| Aspect | Value |
| --- | --- |
| Size | `min-width 32px`, `height 32px`, `padding 0 8px` |
| Border | `1px --border` / `colors.border`, radius `--r-sm` / `radii.sm` |
| Background | `--glass` / `colors.glass` |
| Numerals | `--font-mono` / `fonts.mono`, `12.5px`, weight `500`, `--text-dim` |
| Hover (web) | text `--text`, bg `--glass-2`, border `--border-2` |
| Active page | bg + border `--accent`, text `--text`, weight `600` |
| Disabled (edge) | `opacity 0.4`, text `--text-faint` (native: edge chevron tinted `colors.textFaint`) |
| `…` gap | `min-width 20px`, `--font-mono` `12.5px`, `--text-faint` |
| Track gap | `4px` |

- Edge chevrons use `Icon name="back"` (prev) and `Icon name="chevron"` (next), `size 16`.
- **Native pressed (non-active):** bg `colors.glass2`, border `colors.border2` (the press analogue of web hover).

**Breadcrumb** (`.lk-crumb*` / native `styles.crumb*`):

| Aspect | Value |
| --- | --- |
| Font | `--font-ui` / `fonts.ui`, `12.5px`, gap `6px` |
| Ancestor | `--text-dim`; hover (web) / pressed (native) → `--text` |
| Current leaf | `--text`, weight `600` |
| Separator | `Icon name="chevron"` `size 13`, `--text-faint`, `opacity 0.6` |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Page rest | `.lk-pager-btn` glass | `styles.btn` glass |
| Page hover | `--glass-2` + brighter | n/a |
| Page pressed | `:active` (browser) | `btnPressed` (`glass2`/`border-2`) |
| Active page | `.is-active` accent fill; `aria-current="page"` | `btnActive` accent fill |
| Edge disabled | `:disabled` opacity .4; `disabled` attr | `btnDisabled` opacity .4; `disabled` |
| Crumb ancestor | `.lk-crumb-link` dim; hover `--text` | `Pressable` dim; pressed `--text` |
| Crumb current | `.is-current` bold `--text`; `aria-current` | `crumbCurrent` bold `--text` |

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped impl.** Both share the exact `pageItems()` truncation logic, the same clamps, the same 32px mono buttons, accent active fill, and the same crumb trail layout. Differences are substrate only:

- **Element:** web `<button>`/`<a>` + `<nav>` vs native `Pressable`/`Text` + `View`. No visual difference.
- **Hover:** web pager buttons and crumb links have hover states; native uses press feedback. Not a blocking gap.
- **`href`:** web `Breadcrumb` ancestors are real `<a href>` (SSR-crawlable, middle-click, copy-link); native ancestors are press-only (`onNavigate`). This is the one genuine substrate difference — native has no URL navigation primitive — but `onNavigate` covers in-app routing 1:1, so it doesn't block use.

These are admin/CMS surfaces (web-primary); the native twins exist for parity but are rarely on phone screens.

## 6. Composition & usage

- **Pagination:** under admin tables/lists; pair with `Table`. Controlled — owner holds `page` state.
- **Breadcrumb:** at the top of an admin detail screen; pair with `BackLink` for the primary back affordance.
- **Composes:** `Icon` (chevrons / `back`).

```tsx
// web
<Pagination page={page} pageCount={42} onChange={setPage} />
<Breadcrumb
  items={[{ label: 'Admin', href: '/admin' }, { label: 'Users', href: '/admin/users' }, { label: user.name }]}
  onNavigate={(i) => router.push(crumbs[i].href!)}
/>

// native
<Pagination page={page} pageCount={42} onChange={setPage} />
<Breadcrumb items={crumbs} onNavigate={(i) => router.push(crumbs[i].route)} />
```

## 7. Accessibility

- **Pagination:** web `<nav aria-label="Pagination">`; each page button has `aria-label="Page N"`, the active one `aria-current="page"`; prev/next have `aria-label="Previous/Next page"` and the native `disabled` attribute at the ends. The `…` gap is `aria-hidden`.
- **Breadcrumb:** web `<nav aria-label="Breadcrumb">`; the current leaf is `aria-current="page"`; separators are `aria-hidden`.
- **Native:** consumers should add `accessibilityRole="button"` + labels to the `Pressable`s; disabled edges set `disabled` (no press).
- **Hit target:** 32px buttons are slightly under 44px — acceptable for desktop/admin density; on touch-heavy native surfaces, prefer larger nav.

## 8. Usage rules — Do / Don't

**Do**
- Use `Pagination` for paged tables/lists; keep `page` controlled.
- Use `Breadcrumb` for ancestor trails; pass real `href`s on web for crawlable links.
- Let `pageItems()` handle truncation — pass the true `pageCount`, not a pre-sliced range.

**Don't**
- ✗ Don't hand-roll page buttons or a crumb trail — use these primitives.
- ✗ Don't compute your own ellipsis ranges — pass `page`/`pageCount` and let the component truncate.
- ✗ Don't hardcode the accent fill, mono font, or border — they come from `@lockin90/tokens`.
- ✗ Don't expect `href` navigation on native `Breadcrumb` — wire `onNavigate` to the router.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom numbered pager or `>` crumb trail that re-creates the accent-active button or the chevron separators is a **parity violation** — it diverges web↔native and breaks on token renames.
- **New need → add to BOTH platforms.** Need a "jump to page" input, a compact pager, or icon-only crumbs? Add it to `Pagination`/`Breadcrumb` on web AND native (same prop, same tokens) — never a one-off.
- **Tokens only.** Sizes, mono font, accent fill, and borders come from tokens — never literals.
- **Parity gate.** Before shipping an admin screen with a pager or crumbs, confirm the web and native renders match (same truncation, same active fill, same separators).
