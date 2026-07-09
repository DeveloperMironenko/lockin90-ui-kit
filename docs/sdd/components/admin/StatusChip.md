# SDD — `StatusChip` (+ `StatusChipTone` type)

> **Package:** `@lockin90/ui/admin` — web-only operator-console primitive (admin app is web-only).
> **Import as** `import { StatusChip } from '@lockin90/ui/admin'`.
> **Source:** `packages/ui/src/admin/StatusChip.tsx`. **No own CSS** — thin wrapper over
> `packages/ui/src/components/Chip.tsx` (web CSS `packages/ui/src/styles/primitives.css`, `.lk-chip*`).
> The old standalone `.lk-schip*` rules were **deleted**. NO native counterpart.
> **Exports:** `StatusChip`, type `StatusChipProps`, type `StatusChipTone`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (admin) — no native surface by design.
> **Stories:** `packages/ui/src/stories/AdminFields.stories.tsx`.

---

## 1. Overview

The admin operator console's small mono status pill — "Active", "Degraded", "High", a queue-depth
zone — used across debug tools, the API explorer, and status columns wherever a tone-coded label is
needed next to a value.

`StatusChip` is **now a thin wrapper that renders the canonical cross-platform `Chip`** instead of its
own markup. It used to be a byte-identical mirror of `.lk-chip` (the component's own doc comment
called it out: "Mirrors `.chip`") — since the two were never actually different, the wrapper is an
**equivalent shim**, not a behavior change: every existing call site renders pixel-for-pixel the same
as before. `.lk-schip*` was deleted from the stylesheet; there is nothing left to keep in sync.

The secondary export **`StatusChipTone`** is `'neutral' | 'high' | 'mid' | 'low' | 'accent'` — a
5-tone union that maps onto `Chip`'s 6-tone `ChipTone` (see §2 for the mapping, which is **not** a
same-name passthrough on `neutral`).

## 2. API contract

**`StatusChipProps`**

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `tone` | `StatusChipTone` (`'neutral' \| 'high' \| 'mid' \| 'low' \| 'accent'`) | `'neutral'` | mapped to a `ChipTone` before being passed to `Chip` — see mapping below |
| `dot` | `boolean` | `false` | passed straight through to `Chip`'s leading glowing dot |
| `children` | `ReactNode` | — | passed straight through as `Chip`'s label |
| _rest_ | `HTMLAttributes<HTMLSpanElement>` | — | spread onto `Chip` (and from there onto the `<span>`) |

**Tone map** (`TONE_MAP` in source) — the one non-trivial detail of this wrapper:

| `StatusChipTone` | → `ChipTone` | Why |
| --- | --- | --- |
| `neutral` | `'default'` | **Not** `Chip`'s own (greyer) `'neutral'` tone — `StatusChip`'s `neutral` was always the *base* chip look (dim text on `--glass`), so it maps to `Chip`'s `default` to keep the visual identical. Mapping it to `Chip`'s `neutral` would have been a silent color regression. |
| `high` | `'high'` | same name, same zone color |
| `mid` | `'mid'` | same name, same zone color |
| `low` | `'low'` | same name, same zone color |
| `accent` | `'accent'` | same name, same violet tint |

```tsx
export function StatusChip({ tone = 'neutral', dot = false, children, ...rest }: StatusChipProps) {
  return (
    <Chip tone={TONE_MAP[tone]} dot={dot} {...rest}>
      {children}
    </Chip>
  );
}
```

Plain function component (no `forwardRef`); renders `Chip` at its default `size="md"` — `StatusChip`
has no `size` prop of its own and doesn't forward one (there's nowhere to put it; add it to
`StatusChipProps` first if the console ever needs the compact badge here).

## 3. Visual spec (tokens — never hardcode)

Identical to `Chip` at `size="md"` — see `Chip.md` §3 for the authoritative token table (layout,
padding, radius, border, font, dot). Nothing here is worth restating since `StatusChip` contributes
zero CSS: whatever `Chip.md` documents is exactly what renders. The only thing to know locally is the
tone *name* remap in §2 — the *values* are 100% `Chip`'s.

## 4. States

Purely presentational, same as `Chip`: no hover/focus/pressed/disabled. The only variation is
`tone` (via the map above) × `dot`. It is a `<span>`, not a control.

## 5. Platform & relationship to root kit

**Web-only by design; no parity obligation.** The admin console is a web-only surface, so there is no
native `StatusChip` to keep in sync.

`StatusChip` is **not** an admin-specific visual — it is the generic root `Chip` under an
admin-flavored name and a 5-tone prop surface, kept because admin call sites already type against
`StatusChipTone`/`StatusChipProps`. New admin code that doesn't need back-compat should generally
prefer importing `Chip` directly from `@lockin90/ui`; `StatusChip` exists for the existing call sites,
not as a second design language. Contrast with `MethodChip` (`docs/sdd/components/admin/MethodChip.md`),
which *is* a genuinely admin-specific fixed-width verb chip with its own CSS and color mapping —
`StatusChip` has no such independent visual identity anymore.

## 6. Composition & usage

- **Composes:** `Chip` (`@lockin90/ui`) — the *only* thing `StatusChip` does is remap `tone` and
  delegate. No other kit primitive involved.
- **Used by:** the admin debug tools, API explorer status columns, and any operator-console row/card
  that needs a tone-coded mono label with the console's existing 5-tone prop shape.

```tsx
import { StatusChip } from '@lockin90/ui/admin';

<StatusChip tone="high" dot>Healthy</StatusChip>
<StatusChip tone="low">Degraded</StatusChip>
<StatusChip>Idle</StatusChip>{/* tone='neutral' → Chip tone='default' */}
```

## 7. Accessibility

- Renders a `<span>` — purely presentational, same as `Chip`. The label text carries the meaning;
  color is reinforcement, not the sole signal.
- Not focusable / not interactive.
- Contrast: identical to `Chip`'s zone tones — bright signal color on a low-opacity tint, chosen to
  read against the void background.

## 8. Usage rules — Do / Don't

**Do**
- Use `StatusChip` for existing admin call sites that already type against `StatusChipTone`.
- Remember `tone="neutral"` renders as `Chip`'s `default` look (dim on glass), not `Chip`'s own
  `neutral` (fainter glass-2) — don't "fix" this expecting a different color; it's intentional.
- For **new** admin code with no back-compat need, consider importing `Chip` directly instead — same
  result, one less indirection.

**Don't**
- ✗ Don't hand-roll a status pill in admin screens — use `StatusChip` (existing call sites) or `Chip`
  (new code).
- ✗ Don't add CSS under a `.lk-schip` class name — it's gone; any new visual belongs on `Chip` itself.
- ✗ Don't assume `StatusChipTone`'s `neutral` and `ChipTone`'s `neutral` are the same tone — they are
  deliberately not (see §2 mapping).
- ✗ Don't pass a `size` prop expecting the compact badge treatment — `StatusChip` doesn't forward one.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A local `<span class="status-pill">` re-creating the mono label + tinted border/dot
  duplicates `Chip`'s recipe twice over (once already via this wrapper) — import `StatusChip` (or
  `Chip` directly).
- **New tone?** Add it to `Chip`'s `ChipTone` (root kit, both platforms per `Chip.md` §9) first, then
  extend `StatusChipTone` + `TONE_MAP` here to expose it under the console's existing prop shape —
  never invent a parallel color system inside `StatusChip.tsx`.
- **Tokens only.** All colors are `Chip`'s (i.e. `@lockin90/tokens`) — there is no local token to drift.
- **Web-only.** Admin primitive — there is no native counterpart to keep in parity, and none is planned.
