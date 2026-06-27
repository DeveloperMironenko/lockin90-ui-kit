# SDD — `Chip` (+ `ChipTone`)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Chip.tsx` · `packages/ui-native/src/components/Chip.tsx` ·
> web CSS `packages/ui/src/styles/primitives.css` (`.lk-chip*`).
> **Exports:** `Chip`, type `ChipTone`, type `ChipProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; web takes `children`, native takes a `label` string.
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

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `tone` | `'default' \| 'neutral' \| 'high' \| 'mid' \| 'low' \| 'accent'` | `'default'` | ✓ | ✓ | identical union both sides |
| `dot` | `boolean` | `false` | ✓ | ✓ | leading glowing dot in the current color |
| **label** | — | — | `children` | `label: string` | **platform-shaped** — web takes children, native takes a `label` string |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLSpanElement>` (web) / `ViewProps` (native) | — | ✓ | ✓ | `id`, `title`, `onPress` (native View), etc. |

- **Web:** `forwardRef<HTMLSpanElement>`; renders a `<span>` and spreads HTML attrs; the dot is a CSS `::before` pseudo-element (no DOM node).
- **Native:** renders a `<View>` row with a `<Text>` label; the dot is a real `<View>`. `label` is required.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Layout | `inline-flex`, `gap: 7px` | `flexDirection:row`, `gap: 7`, `alignSelf:flex-start` |
| Padding | `5px 11px` | `5 / 11` |
| Radius | `--r-pill` (999) | `radii.pill` (999) |
| Border | `1px` (tone-dependent) | `1` (tone-dependent) |
| Font | `--font-mono`, `11px`, `500`, letter-spacing `0.04em` | `fonts.mono`, `11`, `'500'`, letterSpacing `0.4` |
| Dot | `6×6px` circle, `background currentColor`, `box-shadow 0 0 8px currentColor` | `6×6`, `shadowColor = tone color`, `shadowOpacity .9`, `shadowRadius 6` |

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

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-chip` (+ tone class) | base `<View>` (+ tone style) |
| With dot | `.lk-dot::before` glowing dot | leading `<View>` dot, glowing |
| Hover / pressed / focus | none — display-only | none — display-only |
| Disabled | n/a | n/a |

`Chip` has no interactive states by design. If you need press/hover/selection, that's `ChoiceChip`.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, one platform-shaped prop.** Identical tone union, identical resolved tone colors (the native `TONE` map is a 1:1 transcription of the CSS tone rules), identical 11px mono label, pill radius, padding, and the glowing 6px dot. The single intentional difference:

- **Label prop:** web takes `children` (`<Chip>Active</Chip>`), native takes a required `label` string (`<Chip label="Active" />`) — the same reason as `Button` (RN composes its own `Text` typography contract). App code still reads 1:1.
- **Dot rendering:** web `::before` pseudo vs native a real `<View>` — substrate-only; same 6px glowing dot.

No capability gap — visually equivalent on both platforms.

## 6. Composition & usage

- **Composes:** nothing — leaf primitive.
- **Used by:** status columns in tables/list rows, energy-zone badges, category tags, count badges ("Generated · 6"), card headers, and metadata strips throughout `lockin90-frontend` / `lockin90-mobile` / `lockin90-admin`.
- Pair with `Eyebrow` for an overline + chip header row; pair with `DeltaPill` for trend deltas (a different primitive).

```tsx
// web
<Chip tone="high" dot>Active</Chip>
<Chip tone="accent">Pro</Chip>
<Chip>Draft</Chip>

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

**Don't**
- ✗ Don't make a `Chip` clickable — use `ChoiceChip` (a real `<button>`/`Pressable`).
- ✗ Don't hand-roll a status pill (rounded span + mono text + tinted border) — import `Chip`.
- ✗ Don't hardcode the tone colors / rgba tints — they're tokens (and literal rgba mirrored across both platforms).
- ✗ Don't pass `children` on native or `label` on web (wrong-platform prop).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A "custom badge" re-creating the mono label + pill + tinted border/dot is a parity violation — it will drift from the tone palette and break web≡native. Import `Chip`.
- **New tone?** If a screen needs a color the `ChipTone` union lacks, **add the tone to `Chip` on BOTH platforms** (same name, same tokens) — never a one-off chip.
- **Tokens only.** Tone colors come from `@lockin90/tokens`; the rgba tints are kept byte-identical between the CSS and the native `TONE` map — keep them in sync, never fork.
- **Parity gate.** Before shipping, confirm the web phone-width and native chip read identically (same tone, dot, label).
