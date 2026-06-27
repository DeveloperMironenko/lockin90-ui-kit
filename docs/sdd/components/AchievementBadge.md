# SDD — `AchievementBadge`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/AchievementBadge.tsx` · `packages/ui-native/src/components/AchievementBadge.tsx` ·
> web CSS `packages/ui/src/styles/components/achievement.css` (`.lk-achv*`).
> **Exports:** `AchievementBadge`, type `AchievementBadgeProps`, type `AchievementTier`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; native flux border is static (no flow anim), web adds hover lift.
> **Stories:** `packages/ui/src/stories/AchievementBadge.stories.tsx` · `packages/ui-native/src/stories/AchievementBadge.stories.tsx`.

---

## 1. Overview

A **centered medal card** for gamification: a tier-colored medallion holding an `Icon`, optionally wrapped by a progress `Ring` (for in-progress achievements), with the title, an optional description line, and either a `progress` percentage or an `unlockedAt` date below.

Two states drive the whole look: **unlocked** badges get an animated gradient hairline (`--grad-flux`) + glow + hover lift; **locked** badges are desaturated, dimmed, and carry a small corner lock overlay.

`AchievementTier` (`'bronze' | 'silver' | 'gold' | 'platinum'`) selects the medal accent color. The web CSS class is `.lk-achv` — **deliberately not `.lk-badge`**, which belongs to Toast.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `title` | `string` | — (required) | ✓ | ✓ | badge name |
| `description` | `string` | — | ✓ | ✓ | short criteria line |
| `icon` | `IconName` | `'star'` | ✓ | ✓ | medal glyph (rendered at 30px) |
| `locked` | `boolean` | `false` | ✓ | ✓ | desaturated + dimmed + lock overlay |
| `tier` | `AchievementTier` | `'gold'` | ✓ | ✓ | medal accent color |
| `progress` | `number` (0..1) | — | ✓ | ✓ | clamped; draws a `Ring` + shows `%` |
| `unlockedAt` | `string` | — | ✓ | ✓ | date label (shown only when no `progress`) |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `CSSProperties` / `StyleProp<ViewStyle>` | — | ✓ | ✓ | both, platform-typed |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | **web only** — native props are explicit (no `ViewProps` spread) |

- **Web:** extends `HTMLAttributes<HTMLDivElement>`; sets the tier color as the `--lk-achv-tier` CSS var on the root + medal.
- **Native:** explicit prop interface (only `style` passes through — no rest spread). Uses a `tint(hex, alpha)` helper (RN has no `color-mix`).
- **Tier→color map** (`TIER_COLOR`): `bronze`→`--warn`/`colors.warn`, `silver`→`--text-dim`/`colors.textDim`, `gold`→`--zone-mid`/`colors.zoneMid`, `platinum`→`--cyan`/`colors.cyan`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`achievement.css`) | Native (`StyleSheet`) |
| --- | --- | --- |
| Card | `width: 160px`, `min-height: 200px`, `padding: 22px`, `--r-lg`, `overflow: hidden` | `minHeight: 200`, `padding: 22`, `radii.lg`; width 160 via border layer |
| Card bg (locked) | `--glass`, `border 1px --border`, `opacity .62`, `filter: saturate(.55)` | `colors.glass`, `border 1px colors.border`, `opacity: .62` |
| Card bg (unlocked) | radial tint of `--lk-achv-tier` over `--bg-1`; `::before` = `--grad-flux` hairline | `colors.bg1` inside a `FLUX` `LinearGradient` 1.5px pad border |
| Flux border | `--grad-flux`, `lk-achv-flow 5s ease-in-out infinite alternate` | static `FLUX` = `['#A8FF35','#34F5C5','#22D3EE','#7C5CFF','#FF3D81']`, start→end diagonal |
| Medal | 64px disc (56px inside Ring), radial tier glow, `1px` tier border | 64px / 56px disc, `tint(accent,.22/.5)` bg+border, shadow `accent` (unlocked) |
| Title | `--font-display`, 700, `14.5px` | `fonts.display`, `'700'`, `14.5` |
| Description | `11.5px`, `--text-dim`, `line-height 1.4` | `11.5`, `colors.textDim`, `lineHeight 16` |
| Date | `--font-mono`, `10px`, `--zone-high` + check icon | `fonts.mono`, `10`, `colors.zoneHigh` + check icon |
| Progress % | `--font-mono`, `10px`, `--text-dim` (`.lk-tnum`) | `fonts.mono`, `10`, `colors.textDim` |

- **Ring:** when `progress` is set, both wrap the medal in `<Ring value={pct} size={84} thickness={6} color={accent} glow={!locked}>`.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Unlocked | `.lk-achv--unlocked` — animated flux hairline + tier glow | `FLUX` gradient border (static) + medal shadow |
| Unlocked hover | `translateY(-5px)` + `--glow-accent` | n/a (no hover) |
| Locked | `.lk-achv--locked` — `opacity .62` + `saturate(.55)` + corner lock | `opacity .62`, plain `--border`, corner lock |
| In-progress | `progress` → Ring + `N%` label (medal shrinks to 56px) | same |
| Focus | `:focus-within` → `2px --accent-2` outline | n/a (non-interactive) |
| Reduced motion | `lk-achv-flow` animation disabled | native border is already static |

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, platform-shaped impl.** Identical props, tier map, medal/Ring composition, title/description/date/progress layout. Real differences are substrate-only:

- **Flux border motion:** web animates the gradient hairline (`lk-achv-flow`, 5s alternate, disabled under reduced-motion); native renders the same `FLUX` ramp as a **static** `LinearGradient` padding border (no cheap RN flow animation) — documented and acceptable.
- **Tinting:** web uses `color-mix(in srgb …)` for the medal/card tints; native uses a hand-rolled `tint(hex, alpha)` → `rgba()` (no `color-mix` in RN). Same resulting colors.
- **Hover/focus:** web has `:hover` lift + `:focus-within` outline; native is non-interactive (no rest spread, no hover).
- **Prop surface:** web spreads `HTMLAttributes`; native exposes only `style`. Minor surface difference, not a usage blocker.

No capability gap blocks use.

## 6. Composition & usage

- **Composes:** `Icon` (medal glyph + lock + check) and `Ring` (progress arc) — both from the kit.
- **Used by:** profile/achievements grids, gamification surfaces, onboarding reward screens.
- **Grids:** lay out at the fixed `160px` width in a wrap/grid; don't stretch the card.

```tsx
// web
<AchievementBadge title="7-Day Streak" tier="gold" icon="flame" unlockedAt="Jun 12" />
<AchievementBadge title="Marathoner" tier="platinum" progress={0.6} locked />

// native
<AchievementBadge title="7-Day Streak" tier="gold" icon="flame" unlockedAt="Jun 12" />
<AchievementBadge title="Marathoner" tier="platinum" progress={0.6} locked />
```

## 7. Accessibility

- **Non-interactive by default** — it's a display card, not a button. Wrap in a `Pressable`/`<button>` only if the badge is tappable (e.g. opens detail).
- **Web:** the corner lock + chevron-free card are `aria-hidden` glyphs; the title/description are real text. `:focus-within` outline supports a focusable child if you add one.
- **Contrast:** tier accents are tokenized; the medal disc keeps the icon on a tinted-over-`#080A12` base for legibility.
- **Locked semantics:** convey "locked" in surrounding copy too — the visual dim alone isn't announced.

## 8. Usage rules — Do / Don't

**Do**
- Use `tier` to pick the medal color; use `locked` for not-yet-earned badges.
- Pass `progress` (0..1) for in-progress badges — it draws the Ring + `%` automatically.
- Use `unlockedAt` for earned badges (it's hidden while `progress` is present).
- Keep titles short — the card is a fixed `160px`.

**Don't**
- ✗ Don't reuse `.lk-badge` styling — this is `.lk-achv` (Toast owns `.lk-badge`).
- ✗ Don't hardcode tier colors, the flux gradient, or the medal glow — tokens only.
- ✗ Don't pass both `progress` and `unlockedAt` expecting both to show — `progress` wins.
- ✗ Don't hand-roll a "medal + ring" lookalike — compose `AchievementBadge`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom medal card that re-creates the tier disc + flux hairline + Ring is a parity violation — import `AchievementBadge`.
- **New tier/variant → both platforms.** Add to `AchievementTier` + `TIER_COLOR` on web **and** native (same token), never a local color.
- **Tokens only.** Tier colors (`--warn`/`--text-dim`/`--zone-mid`/`--cyan`), `--grad-flux`, `--r-lg`, `--glow-accent` come from `@lockin90/tokens` — hardcoding them breaks Aurora-Flux renames.
- **Parity gate.** Before shipping an achievements surface, diff web phone-width vs native: same tier color, same locked/unlocked state, same Ring/% or date.
