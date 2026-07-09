# SDD — `Chip` (+ `ChipTone`, `ChipSize`)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Chip.tsx` · `packages/ui-native/src/components/Chip.tsx` ·
> web CSS `packages/ui/src/styles/primitives.css` (`.lk-chip*`).
> **Exports:** `Chip`, type `ChipTone`, type `ChipSize`, type `ChipProps` — all re-exported from `packages/ui/src/index.ts`.
> **Status:** Shipped. **Parity:** 🟡 same tone/dot/`size` API; web takes `children`, native takes a `label`
> string (platform-shaped). `size="sm"` (compact badge, filled-gradient accent, bare-dot mode) now on **both**
> platforms — see §5.
> **Stories:** `packages/ui/src/stories/Chip.stories.tsx` · `packages/ui-native/src/stories/Chip.stories.tsx`.

---

## 1. Overview

The **status pill** — a small, mono-label, signal-colored badge for state ("Active", "High", "3 generated"), category tags, and inline metadata. Display-only (a `<span>` / `<View>`, not interactive); for a pressable/selectable filter pill use `ChoiceChip`.

`ChipTone` (the secondary type export) selects the color family:

- `default` — dimmed glass (neutral metadata).
- `neutral` — fainter glass-2 (de-emphasized).
- `high` / `mid` / `low` — the zone signal colors (mint / amber / red) for energy-band or status semantics.
- `accent` — violet-tinted, for the primary/branded tag.

`dot` adds a leading glowing dot in the current tone color.

`ChipSize` (the new secondary type export, web-only prop) picks the box scale:

- `md` (default) — the standard status pill described above.
- `sm` — the compact count/status badge: a tighter box, 10px tabular mono, and a **filled**-gradient
  `accent` tone. This is the exact visual recipe the old standalone `Badge` used — `Badge` (in
  `Toast.tsx`), admin `StatusChip`, and marketing `Pill` are now thin wrappers over `Chip` (see §6).
  Combined with `dot`, `sm` collapses to a bare glowing circle with no text.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `tone` | `'default' \| 'neutral' \| 'high' \| 'mid' \| 'low' \| 'accent'` | `'default'` | ✓ | ✓ | identical union both sides |
| `dot` | `boolean` | `false` | ✓ | ✓ | leading glowing dot in the current color |
| `size` | `ChipSize` (`'sm' \| 'md'`) | `'md'` | ✓ | ✓ | `sm` = compact count/status badge (filled-gradient accent tone, bare-dot mode); both platforms |
| **label** | — | — | `children` | `label: string` | **platform-shaped** — web takes children, native takes a `label` string |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLSpanElement>` (web) / `ViewProps` (native) | — | ✓ | ✓ | `id`, `title`, `onPress` (native View), etc. |

- **Web:** `forwardRef<HTMLSpanElement>`; renders a `<span>` and spreads HTML attrs; the dot is a CSS `::before` pseudo-element (no DOM node). `size="sm"` emits the extra `.lk-chip-sm` class alongside the base `.lk-chip` + tone class (`className={cn('lk-chip', size === 'sm' && 'lk-chip-sm', TONE[tone], dot && 'lk-dot', className)}`).
- **Native:** renders a `<View>` row with a `<Text>` label; the dot is a real `<View>`. `label` is required. `size="sm"` swaps in the compact `StyleSheet` variant — the `accent` tone fills with an `expo-linear-gradient` (`gradients.cta`) behind dark text, and `sm` + `dot` renders a bare 8px glowing circle `<View>` — see §5.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Layout | `inline-flex`, `gap: 7px`, `white-space: nowrap` | `flexDirection:row`, `gap: 7`, `alignSelf:flex-start` |
| Padding | `5px 11px` | `5 / 11` |
| Radius | `--r-pill` (999) | `radii.pill` (999) |
| Border | `1px` (tone-dependent) | `1` (tone-dependent) |
| Font | `--font-mono`, `11px`, `500`, letter-spacing `0.04em` | `fonts.mono`, `11`, `'500'`, letterSpacing `0.4` |
| Dot | `6×6px` circle, `flex: none`, `background currentColor`, `box-shadow 0 0 8px currentColor` | `6×6`, `shadowColor = tone color`, `shadowOpacity .9`, `shadowRadius 6` |

`white-space:nowrap` (base `.lk-chip`) and the dot's `flex:none` are additive housekeeping from the
`size` rollout (prevent the pill/dot from wrapping or squashing in flex rows); the `md` box, colors,
and dot are otherwise byte-unchanged.

**Tone colors** (web class / native `TONE` map — identical values):

| Tone | Text | Border | Background |
| --- | --- | --- | --- |
| `default` | `--text-dim` / `colors.textDim` | `--border` / `colors.border` | `--glass` / `colors.glass` |
| `neutral` | `--text-faint` / `colors.textFaint` | `--border-2` / `colors.border2` | `--glass-2` / `colors.glass2` |
| `high` | `--zone-high` / `colors.zoneHigh` | `rgba(52,245,197,.35)` | `rgba(52,245,197,.08)` |
| `mid` | `--zone-mid` / `colors.zoneMid` | `rgba(255,176,32,.35)` | `rgba(255,176,32,.08)` |
| `low` | `--zone-low` / `colors.zoneLow` | `rgba(255,77,109,.35)` | `rgba(255,77,109,.08)` |
| `accent` | `#cbbcff` (both) | `rgba(124,92,255,.4)` | `rgba(124,92,255,.10)` |

The dot inherits the tone's text color (web via `currentColor`; native via `t.color`).

### `size="sm"` (web-only) — the compact count/status badge

`.lk-chip.lk-chip-sm` retunes the box and, per-tone, the fill — it does **not** just scale `md` down:

| Aspect | Value |
| --- | --- |
| Layout | `gap: 4px`, `justify-content: center`, `min-width: 16px`, `min-height: 16px` |
| Padding | `2px 6px` |
| Font | `--font-mono`, `10px`, `600`, `letter-spacing: 0`, `line-height: 1`, `font-variant-numeric: tabular-nums` |

Tone deltas vs `md` (only what changes):

| Tone | `sm` treatment |
| --- | --- |
| `default` | unchanged — inherits base `.lk-chip` (dim text on `--glass`) |
| `high` / `mid` / `low` | text/border unchanged; background tint bumped `.08` → `.10` |
| `neutral` | text swaps `--text-faint` → `--text-dim`; border swaps `--border-2` → `--border`; background stays `--glass-2` |
| `accent` | **filled**, not outlined: `color:#0A0A12` on `background:var(--grad-cta)`, `border-color:transparent` (vs `md`'s tinted-outline `#cbbcff` on `rgba(124,92,255,.10)`) |

**`sm` + `dot`** collapses the whole chip to an **8×8px bare glowing circle**, no text — text/label
children are ignored (`.lk-chip.lk-chip-sm.lk-dot { gap:0; min-width:0; min-height:0; width:8px;
height:8px; padding:0; border:0; border-radius:50%; background:currentColor; box-shadow:0 0 8px
currentColor }`, and `::before` is suppressed). Per-tone dot color:

| Tone | Dot color | Glow |
| --- | --- | --- |
| `default` / `high` / `mid` / `low` | tone's normal text color (`currentColor` from the base tone rule) | `0 0 8px currentColor` |
| `accent` | `var(--accent)` (**not** the `md` `#cbbcff`) | `0 0 8px currentColor` |
| `neutral` | `--text-faint` | **none** — `box-shadow: none` |

This is a byte-exact reproduction of the retired `Badge`'s dot behavior (see `Toast.md` §3).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-chip` (+ tone class) | base `<View>` (+ tone style) |
| With dot | `.lk-dot::before` glowing dot | leading `<View>` dot, glowing |
| `size="sm"` | `.lk-chip-sm` (+ tone) — compact filled/tinted pill | — (no native `size`, see §5) |
| `size="sm"` + `dot` | collapses to a bare 8px glowing circle, label ignored | — |
| Hover / pressed / focus | none — display-only | none — display-only |
| Disabled | n/a | n/a |

`Chip` has no interactive states by design. If you need press/hover/selection, that's `ChoiceChip`.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals both sizes, one platform-shaped prop.** At `md`, identical tone union, identical resolved tone colors (the native `TONE` map is a 1:1 transcription of the CSS tone rules), identical 11px mono label, pill radius, padding, and the glowing 6px dot. `size="sm"` is now built on **both** platforms with matching deltas. Differences:

- **Label prop:** web takes `children` (`<Chip>Active</Chip>`), native takes a required `label` string (`<Chip label="Active" />`) — the same reason as `Button` (RN composes its own `Text` typography contract). App code still reads 1:1.
- **Dot rendering:** web `::before` pseudo vs native a real `<View>` — substrate-only; same 6px glowing dot.
- **`size="sm"` (both platforms):** native `Chip.tsx` now carries `size?: ChipSize` + the compact `StyleSheet` variant mirroring the CSS deltas in §3 — tighter box (min 16×16, 2×6 padding), 10px tabular-mono weight-600 label, gap 4; the `accent` tone fills with `gradients.cta` (`expo-linear-gradient`) behind `#0A0A12` text; `sm` + `dot` collapses to a bare 8px glowing circle. Native still has its **own separate** `Badge.tsx` (unaffected — see `Toast.md` §5) that renders the equivalent compact/dot badge.

No genuine (inherent) capability gap — `size="sm"` is buildable and now built on both sides.

## 6. Composition & usage

- **Composes:** nothing — leaf primitive.
- **Composed by (thin wrappers, web):** `Badge` (`Toast.tsx`, `size="sm"`, `BadgeTone` ⊂ `ChipTone`), admin `StatusChip` (`md`, tone-remapped — see `admin/StatusChip.md`), and marketing `Pill` (`md`, `variant`→`tone` — see `marketing/Pill.md`) all now render `<Chip>` under the hood rather than shipping their own CSS. Their own SDDs cover the wrapper-specific prop/tone mapping; this file is the canonical spec for the underlying visuals.
- **Used by:** status columns in tables/list rows, energy-zone badges, category tags, count badges ("Generated · 6"), card headers, and metadata strips throughout `lockin90-frontend` / `lockin90-mobile` / `lockin90-admin`.
- Pair with `Eyebrow` for an overline + chip header row; pair with `DeltaPill` for trend deltas (a different primitive).

```tsx
// web
<Chip tone="high" dot>Active</Chip>
<Chip tone="accent">Pro</Chip>
<Chip>Draft</Chip>

// web — compact size (what Badge renders internally)
<Chip size="sm" tone="accent">3</Chip>
<Chip size="sm" tone="high" dot />

// native
<Chip tone="high" dot label="Active" />
<Chip tone="accent" label="Pro" />
<Chip label="Draft" />
```

## 7. Accessibility

- **Web:** a `<span>` — purely presentational. When the chip conveys state not otherwise in the text, ensure the surrounding context names it (color is not the only signal — the mono label carries the meaning).
- **Native:** a `<View>` + `<Text>` — the label is read by SRs. The dot is decorative.
- **Contrast:** zone tones use the bright signal colors on a low-opacity tinted bg — high contrast against the void. Don't lower the tint or swap the text color off-tone.

## 8. Usage rules — Do / Don't

**Do**
- Use `tone` to carry status semantics (`high`/`mid`/`low` = the energy zones).
- Use `dot` when the chip marks a live/active state.
- Keep labels short (1–2 words / a count) — it's a pill, not a sentence.
- Pass `label` on native, `children` on web.
- Use web `size="sm"` for compact inline counts/status (table cells, tab badges, list-row metadata); leave `size` at the `'md'` default for standalone status pills.

**Don't**
- ✗ Don't make a `Chip` clickable — use `ChoiceChip` (a real `<button>`/`Pressable`).
- ✗ Don't hand-roll a status pill (rounded span + mono text + tinted border) — import `Chip`.
- ✗ Don't hardcode the tone colors / rgba tints — they're tokens (and literal rgba mirrored across both platforms).
- ✗ Don't pass `children` on native or `label` on web (wrong-platform prop).
- ✗ Don't reach for `size="sm"` on native — the prop doesn't exist there yet; use native `Badge` (its own component) for the compact treatment until `Chip` is ported (§5).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A "custom badge" re-creating the mono label + pill + tinted border/dot is a parity violation — it will drift from the tone palette and break web≡native. Import `Chip`. This still holds for the compact size: `Badge`/`StatusChip`/`Pill` are the **sanctioned** thin wrappers (§6) — don't add a fourth one; if a screen needs the compact recipe with a new prop shape, extend one of the existing three or use `Chip size="sm"` directly.
- **New tone?** If a screen needs a color the `ChipTone` union lacks, **add the tone to `Chip` on BOTH platforms** (same name, same tokens) — never a one-off chip.
- **New size?** A third size (or a native `size` port) goes on `Chip` itself — never a wrapper-local hack (e.g. don't shrink `Badge` with inline `style`/`fontSize` overrides; extend `ChipSize` + the CSS/`StyleSheet` variant).
- **Tokens only.** Tone colors come from `@lockin90/tokens`; the rgba tints are kept byte-identical between the CSS and the native `TONE` map — keep them in sync, never fork.
- **Parity gate.** Before shipping, confirm the web phone-width and native chip read identically (same tone, dot, label); for `size="sm"` call sites, confirm against native `Badge` until native `Chip` gets the prop.
