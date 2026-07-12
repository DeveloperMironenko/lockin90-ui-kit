# SDD — `TemplateCard`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/TemplateCard.tsx` · `packages/ui-native/src/components/TemplateCard.tsx` ·
> web CSS `packages/ui/src/styles/components/templatecard.css` (`.lk-templatecard*`).
> **Exports:** `TemplateCard`, type `TemplateSource`, type `TemplateCardProps`.
> **Status:** Shipped. **Parity:** ✅ identical API & visuals — substrate-only differences (web `<button>`/`<div>` + hover ↔ native `Pressable` + pressed feedback + haptics).
> **Stories:** `packages/ui/src/stories/TemplateCard.stories.tsx` · `packages/ui-native/src/stories/TemplateCard.stories.tsx`.

---

## 1. Overview

The **workout-template row card**: a glass row with the template name in the display font, a dim meta summary (`'Chest · Arms · 5 ex · ~48m'`), a faint mono "last used" footer, a small **mint `COACH` / violet `AI`** source pill when the template wasn't hand-built, an optional tinted left edge bar, and a right-pinned `trailing` slot. The template picker's list item.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `name` | `string` | — (required) | ✓ | ✓ | display font, truncates |
| `meta` | `string` | — | ✓ | ✓ | dim summary line |
| `lastUsed` | `string` | — | ✓ | ✓ | pre-formatted (`'Last used 2d ago'`) |
| `source` | `TemplateSource` (`'coach'·'ai'·'manual'`) | `'manual'` | ✓ | ✓ | `manual` shows no pill |
| `tint` | `string` | — | ✓ | ✓ | left edge bar color (token, e.g. `'var(--cyan)'` / `colors.cyan`) |
| `onPress` | `() => void` | — | ✓ | ✓ | web renders `<button>`; native `Pressable` + `hapticSelection()` |
| `trailing` | `ReactNode` | — | ✓ | ✓ | chevron / menu / duration |
| `className` / _rest_ | — | — | ✓ | — | web spreads to button/div |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |

## 3. Visual spec (tokens — never hardcode)

| Element | Web | Native |
| --- | --- | --- |
| Card | `--glass` on 1px `--border`, `--r` (16), padding `13px 15px`, flex row gap 12, `overflow:hidden` | `colors.glass`, `colors.border`, `radii.md`, same padding/gap |
| Hover/press | `--glass-2` + `--border-2` (transition `--dur --ease`, reduced-motion gated) | pressed → `glass2` + `border2` |
| Tint bar | absolute left, 3px wide, inset 10px top/bottom, radius `0 3px 3px 0` | same numbers |
| Name | `--font-display` 700 15px `-.01em`, ellipsis | `fonts.display` 700 15, `numberOfLines={1}` |
| Meta | 12px `--text-dim` | same |
| Last used | `--font-mono` 10.5px `--text-faint` | same |
| Source pill | mono 8.5px 600 uppercase `.08em`, `--r-pill`, 1px border, padding `3px 7px` | same (label pre-uppercased) |

**Pill tones (matched literals):** coach = `--mint` on `rgba(52,245,197,.10)` border `.32` · ai = `--accent` on `rgba(124,92,255,.12)` border `.4`. These are the same recipe family as `Chip`'s high/accent md tones; the pill is component-owned because the `Chip sm accent` treatment is a filled gradient count badge, not this tag.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Static (`no onPress`) | `<div>` | `View` |
| Tappable | `<button>` + hover raise + pointer | `Pressable` pressed tint + haptic |
| Coach / AI / manual | mint pill / violet pill / none | same |
| Tinted | left edge bar in `tint` | same |

## 5. Web ↔ native parity

**Verdict: ✅ identical.** Same layout, numbers, tones, and slots; substrate-only differences (button/hover ↔ Pressable/pressed + optional haptics; CSS uppercase ↔ pre-uppercased pill label). No capability gap.

## 6. Composition & usage

- **Used in:** the "Your templates" picker list, the training hub's start flow.
- **Composes from:** none (the pill is intentionally local — see §3); pair with `Icon name="chevron"` as `trailing`.

```tsx
// web
<TemplateCard name="5×5 Strength" meta="Full body · 5 ex · ~52m" source="coach" tint="var(--mint)" onPress={open} />

// native
<TemplateCard name="Peaking Block · W3" meta="Squat focus · 4 ex · ~40m" source="ai" tint={colors.accent} onPress={open} trailing={<Icon name="chevron" size={16} />} />
```

## 7. Accessibility

- **Web:** tappable card is a real `<button type="button">` — keyboard + AT for free; the tint bar is `aria-hidden`.
- **Native:** `accessibilityRole="button"`; the name/meta Texts are read in order.
- Source is conveyed by the pill **text** (COACH/AI), not color alone.

## 8. Usage rules — Do / Don't

**Do**
- Pre-format `meta`/`lastUsed` strings in the app (the card doesn't pluralize or relative-time).
- Use spectrum tokens for `tint` (cyan/mint/violet…) to key template categories.

**Don't**
- ✗ Don't rebuild this from `ListRow` + a local pill — this is the canonical template row.
- ✗ Don't invent new source kinds per call site — extend `TemplateSource` on both platforms.
- ✗ Don't put long prose in `name` — it truncates to one line by design.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A glass row with name + meta + source tag for templates IS this component.
- **New need → both platforms** with the same prop + matched pill literals.
- **Tokens only** (pill rgba tints are canonical matched values — don't fork them).
- **Parity gate.** Web phone-width card ≡ native card (pill, tint bar, truncation) before shipping.
