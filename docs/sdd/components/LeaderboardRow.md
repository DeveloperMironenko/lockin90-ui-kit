# SDD — `LeaderboardRow`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/LeaderboardRow.tsx` · `packages/ui-native/src/components/LeaderboardRow.tsx` ·
> web CSS `packages/ui/src/styles/components/leaderboard.css` (`.lk-lbrow*`).
> **Exports:** `LeaderboardRow`, type `LeaderboardRowProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; native adds an opt-out `divider` prop (no CSS sibling selector).
> **Stories:** `packages/ui/src/stories/LeaderboardRow.stories.tsx` · `packages/ui-native/src/stories/LeaderboardRow.stories.tsx`.

---

## 1. Overview

One **ranked entry in a standings list**: rank (display font) + `Avatar` + name (+ optional sublabel) on the left, the ranked `value` on the right. Ranks **1 / 2 / 3** swap the number for a gold / silver / bronze crown glyph (the `star` icon, tinted + glow). `highlight` accent-tints the row to mark the current user ("you"). A stack of `LeaderboardRow`s makes a leaderboard; adjacent rows share a hairline.

Composed from `Avatar` (monogram fallback when no image) + `Icon` (the medal). Mirrors its cross-platform twin 1:1 in structure.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `rank` | `number` | _required_ | ✓ | ✓ | 1-based; 1/2/3 render a medal crown instead of the number |
| `name` | `string` | _required_ | ✓ | ✓ | display name; also seeds the `Avatar` monogram |
| `avatar` | `string` | — | ✓ | ✓ | avatar image URL; falls back to monogram from `name` |
| `value` | `string` | _required_ | ✓ | ✓ | the ranked stat, pre-formatted (e.g. `'1,240 pts'`) |
| `sublabel` | `string` | — | ✓ | ✓ | dimmer second line under the name |
| `highlight` | `boolean` | — | ✓ | ✓ | accent tint + border, marks the current user |
| `divider` | `boolean` | `true` | — | ✓ | **native only** — hairline top border; set `false` on the first row of a stack |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `Omit<HTMLAttributes,'title'>` (web) / `ViewProps` (native) | — | ✓ | ✓ | row container attrs |

- **Web:** `forwardRef<HTMLDivElement>`; the `title` HTML attr is `Omit`-ted (the row has no tooltip role). Inter-row hairline is drawn by CSS `.lk-lbrow + .lk-lbrow`.
- **Native:** plain function component; since RN has **no sibling selectors**, the hairline is an opt-out `divider` prop (default `true`) drawn per row.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Token | Value |
| --- | --- | --- |
| Row padding | `12px / 14px` | both platforms |
| Row gap | `12px` | rank ↔ avatar ↔ main ↔ value |
| Radius | `--r` / `radii.md` | 16 |
| Rank column | `28px` wide, centered | fixed |
| Rank number | `--font-display` / `fonts.display`, 700, 17px, `-0.02em` | dim |
| Medal (1/2/3) | `star` icon 20px | gold `--warn`/`colors.warn`, silver `--text-dim`/`colors.textDim`, bronze `#C77B3A` |
| Name | `--font-ui`, 600, 14.5px | `--text` / `colors.text`, ellipsized |
| Sublabel | 12.5px | `--text-faint` / `colors.textFaint`, ellipsized |
| Value | `--font-display`, 700, 16px, `-0.02em` | `--text`; right-pinned `margin-left:auto` |
| Highlight bg | `color-mix(--accent 12%)` / `rgba(124,92,255,.12)` | accent tint |
| Highlight border | `color-mix(--accent 45%)` / `rgba(124,92,255,.45)` | accent outline |

- **Medal glow:** web `.lk-lbrow-medal` uses `filter: drop-shadow(0 0 6px currentColor)`; native relies on the icon color (no per-glyph drop-shadow filter).
- **Highlight** recolors both the rank number and the value to `--accent` / `colors.accent`.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-lbrow`, transparent border | base `row`, transparent border |
| Top-3 | `star` medal in gold/silver/bronze | same medal + tints |
| Highlight ("you") | `.lk-lbrow-highlight` → accent tint bg + border; rank/value → `--accent` | `highlight` style → `rgba(124,92,255,.12)` bg + `.45` border; `rankNumHighlight`/`valueHighlight` → `colors.accent` |
| Row divider | `.lk-lbrow + .lk-lbrow` top hairline `--border` | `divider` (default true) → `borderTopColor: colors.border` |

The row is **presentational** — no hover/pressed/disabled states; tap handling (open profile, etc.) is the consumer's via `...rest`/`style`.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, one extra native prop.** Identical layout (rank → avatar → name/sublabel → value), medal logic for ranks 1–3, fonts, sizes, padding, radius, and highlight tint. App code reads 1:1 for the shared props.

The single difference is the **divider**: web draws the inter-row hairline with the adjacent-sibling selector `.lk-lbrow + .lk-lbrow` (so the first row automatically has none). RN has no sibling selectors, so native exposes a `divider` prop (default `true`) and the consumer sets `divider={false}` on the first row of the stack. The medal glow is a CSS `drop-shadow` on web; native shows the medal in color but without the per-glyph halo. Neither blocks use — both render an identical-looking ranked row.

## 6. Composition & usage

- **Composes:** `Avatar` (40px, monogram fallback) + `Icon` (`star` medal).
- **Used by:** leaderboard / standings screens, "you vs peers" surfaces, cohort comparisons.
- **Stack pattern:** render rows in rank order; on native set `divider={false}` on the first.

```tsx
// web — hairlines are automatic
{entries.map((e) => (
  <LeaderboardRow key={e.id} rank={e.rank} name={e.name} avatar={e.avatar}
    value={`${e.points} pts`} sublabel={e.streak} highlight={e.isMe} />
))}

// native — opt the first row out of the top hairline
{entries.map((e, i) => (
  <LeaderboardRow key={e.id} rank={e.rank} name={e.name} avatar={e.avatar}
    value={`${e.points} pts`} highlight={e.isMe} divider={i > 0} />
))}
```

## 7. Accessibility

- **Web:** a `<div>` row (not interactive by default); pass an `onClick`/`role` via `...rest` if the row navigates. The medal `Icon` is decorative; the rank/name/value are real text.
- **Native:** a `View` (`ViewProps` spread); add `accessibilityRole`/`onPress` via rest if tappable. `Text` nodes are read in order (rank, name, sublabel, value).
- **Value is pre-formatted text** — format numbers (`1,240 pts`) before passing so AT reads them correctly.
- **Highlight** conveys "you" with color; pair with a textual cue (e.g. sublabel "You") if color alone is insufficient.

## 8. Usage rules — Do / Don't

**Do**
- Pass `value` already formatted (locale number + unit).
- Use `highlight` for exactly the current user's row.
- On native, set `divider={false}` on the first row of each stack.
- Pass a real `avatar` URL when available; otherwise rely on the monogram fallback.

**Don't**
- ✗ Don't hand-roll a ranked row — use `LeaderboardRow`.
- ✗ Don't hardcode the medal colors or the highlight tint — they're `warn`/`textDim`/`accent`-derived.
- ✗ Don't put multiple `highlight` rows in one list (one "you").
- ✗ Don't pass a raw number as `value` (it won't be locale-formatted).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom "rank + avatar + score" row duplicating the medal/highlight logic is a parity violation — import `LeaderboardRow`.
- **New rank treatment?** If you need e.g. a 4th-place tint or a delta arrow, add it to `LeaderboardRow` on **both** platforms (same prop, same tokens) — never a local variant.
- **Tokens only.** Medal/highlight colors, fonts, radius come from `@lockin90/tokens`; a hardcoded gold/violet is a bug even if it matches today.
- **Parity gate.** Before shipping a standings screen, confirm web phone-width and native render the same rows, medals, and highlight — and that native's first row has `divider={false}`.
