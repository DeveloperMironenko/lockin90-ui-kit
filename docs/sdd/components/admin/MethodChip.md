# SDD — `MethodChip` (+ `Method` type)

> **Package:** `@lockin90/ui/admin` — web-only operator-console primitive (admin app is web-only). **Import as** `import { MethodChip } from '@lockin90/ui/admin'`.
> **Source:** `packages/ui/src/admin/MethodChip.tsx` · web CSS `packages/ui/src/styles/components/methodchip.css` (`.lk-method-chip*`). NO native counterpart.
> **Exports:** `MethodChip`, type `MethodChipProps`, type `Method`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (admin) — no native surface by design.
> **Stories:** `packages/ui/src/stories/AdminFields.stories.tsx`.

---

## 1. Overview

A fixed-width, uppercase, **mono HTTP-method chip** tinted per verb. It labels routes in the operator
API explorer and the errors-by-endpoint table. The verb drives both the label text and the color
mapping; there are no other props. Matches the `.method-chip` chips from
`lockin90-design/admin/system.html`.

The secondary export **`Method`** is the verb union — `'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'` —
reused anywhere route methods are typed.

## 2. API contract

**`MethodChipProps`**

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `method` | `Method` | — (required) | the HTTP verb — drives the label **and** the colour mapping |

- `Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'`.
- Internally a `METHOD_CLASS` record maps each verb to its modifier class
  (`lk-method-get`/`-post`/`-patch`/`-put`/`-delete`); the chip renders
  `<span className={cn('lk-method-chip', METHOD_CLASS[method])}>{method}</span>`.
- No `className`, no `...rest` — the component is intentionally closed (single-responsibility label).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Value / token |
| --- | --- |
| Box | `display: inline-block`, `min-width: 48px` (fixed alignment), `padding: 2px 8px` |
| Border | `1px solid --border` (overridden per verb) |
| Radius | `6px` |
| Font | `--font-mono` 10px / 600, `letter-spacing: .04em`, `line-height: 1.5`, uppercase, centered |

**Per-method colour mapping** (text + border + ~8–10%-tinted fill in the method colour):

| Verb | Text token | Border | Fill |
| --- | --- | --- | --- |
| `GET` | `--mint` | `rgba(52,245,197,.35)` | `rgba(52,245,197,.08)` |
| `POST` | `--cyan` | `rgba(34,211,238,.35)` | `rgba(34,211,238,.08)` |
| `PATCH` | `--warn` (amber) | `rgba(255,176,32,.35)` | `rgba(255,176,32,.08)` |
| `PUT` | `--violet` | `rgba(168,85,247,.4)` | `rgba(168,85,247,.1)` |
| `DELETE` | `--bad` (red) | `rgba(255,77,109,.35)` | `rgba(255,77,109,.08)` |

The `min-width: 48px` is deliberate: in a column of mixed verbs every chip is the same width so the
following route paths align.

## 4. States

The chip is **purely presentational** — there are no interactive states (no hover, focus, pressed,
disabled). The only variation is the `method`-driven colour modifier. It is a `<span>`, not a
control. Reduced motion is N/A (no animation).

## 5. Platform & relationship to root kit

**Web-only by design.** The API explorer / errors table are admin-console surfaces with no native
counterpart, so there is no `@lockin90/ui-native` `MethodChip` and no parity obligation. It is a
self-contained `<span>` — it composes no other kit primitive and wraps no root component. (The
generic chip role elsewhere in the kit is `Badge`/`Tag`; `MethodChip` is the verb-specific, fixed-width
admin specialization and should not be replaced by a generic chip.)

## 6. Composition & usage

- **Used by:** the operator API explorer (route list) and the errors-by-endpoint table — anywhere a
  route's verb is shown next to its path.
- **Composes:** nothing — leaf component.

```tsx
import { MethodChip } from '@lockin90/ui/admin';

<tr>
  <td><MethodChip method="GET" /> <code>/v1/users/:id</code></td>
</tr>
<tr>
  <td><MethodChip method="DELETE" /> <code>/v1/sessions/:id</code></td>
</tr>
```

## 7. Accessibility

- Renders the verb as **visible text** inside the `<span>`, so it is read verbatim by screen readers
  — no `aria-label` needed.
- Colour is reinforced by the always-present text label, so the verb is never communicated by colour
  alone (colour-blind safe).
- Not focusable / not interactive — correct, since it is a static label, not a control.

## 8. Usage rules — Do / Don't

**Do**
- Use it for every HTTP verb label in admin route tables/explorers.
- Keep it adjacent to the route path it labels; rely on `min-width: 48px` for column alignment.
- Type route data with the exported `Method` union.

**Don't**
- ✗ Don't hand-roll a colored verb pill — use `MethodChip`.
- ✗ Don't pass a non-`Method` string (TS will reject it; there is no fallback class).
- ✗ Don't hardcode the per-verb colors — they come from `--mint/--cyan/--warn/--violet/--bad`.
- ✗ Don't add interactivity (links/handlers) to the chip; wrap the surrounding row instead.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A local `<span class="get-chip">` with hand-picked colors will drift from the kit
  verb palette — import `MethodChip`.
- **New verb?** If a new HTTP method must be labelled, add it to the `Method` union **and** the
  `METHOD_CLASS` map + a CSS modifier here — never special-case it at the call site.
- **Tokens only.** Verb colors are `@lockin90/tokens` spectrum/status vars; any hardcoded hue is a bug.
- **Web-only.** Admin primitive — there is no native counterpart to keep in parity.
