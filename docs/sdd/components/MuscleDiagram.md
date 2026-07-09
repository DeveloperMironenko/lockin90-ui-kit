# SDD — `MuscleDiagram` (+ `MuscleTarget` / `MuscleRole` / `MuscleGroup` / `BodyType`)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/MuscleDiagram.tsx` · `packages/ui-native/src/components/MuscleDiagram.tsx` ·
> web CSS `packages/ui/src/styles/components/muscle.css` (`.lk-muscle*`).
> **Exports:** `MuscleDiagram`, type `MuscleDiagramProps`, type `MuscleTarget`, type `MuscleRole`, type `MuscleGroup`, type `BodyType`.
> **Status:** Shipped. **Parity:** 🟡 same API, identical path geometry; native omits the per-region glow (RN-SVG can't cheaply `drop-shadow` a `<Path>`) + takes `style` not `className`/rest.
> **Stories:** `packages/ui/src/stories/MuscleDiagram.stories.tsx` · native equivalent.

---

## 1. Overview

An **anatomical body map**. It draws a smooth front- or back-view silhouette for the chosen `bodyType` (male / female / nonbinary proportions), then tints the targeted muscle groups by **role**:

- `primary` — **mint** (`--mint`), the strongest highlight; the muscle a movement works hardest.
- `secondary` — **cyan** (`--cyan`), medium emphasis.
- `stabilizer` — **faint gray** (`--text-faint`), subtle supporting work.

Beside the figure an optional **legend** lists each worked group (a glowing role dot + label + a role `Chip`). It exists to show "what this exercise works" identically on web and native: the silhouette + region path strings come from a **deterministic generator that is byte-identical in both twins**, so the figure is pixel-for-pixel the same across platforms.

Secondary type exports: `MuscleTarget` (`{ group, role }`), `MuscleRole`, the 14-member `MuscleGroup` union, and `BodyType`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `targets` | `MuscleTarget[]` | `[chest/primary, triceps/secondary, shoulders/secondary]` | ✓ | ✓ | de-duped by group (first wins); only groups the current `view` can draw are rendered |
| `view` | `'front' \| 'back'` | `'front'` | ✓ | ✓ | switches which region set is drawn |
| `bodyType` | `BodyType` (`'male' \| 'female' \| 'nonbinary'`) | `'male'` | ✓ | ✓ | picks silhouette half-width proportions |
| `showLegend` | `boolean` | `true` | ✓ | ✓ | legend rows beside the figure |
| `size` | `number` | `240` | ✓ | ✓ | SVG height in px; width = `(120/248) × size` |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web spreads onto the wrapper `<div>` |

- **Web:** plain function component; spreads `...rest` (HTML attrs) onto the wrapper. `useId()` reserved (currently unused).
- **Native:** props are `style`-only — no `className`/HTML-attr passthrough.
- `MuscleTarget = { group: MuscleGroup; role: MuscleRole }`. `MuscleGroup` = chest · shoulders · biceps · triceps · forearms · abs · obliques · quads · hamstrings · glutes · calves · back · lats · traps.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native | Value |
| --- | --- | --- | --- |
| viewBox | `0 0 120 248` | same | `MUSCLE_VB_W=120`, `MUSCLE_VB_H=248`, centerline x=60 |
| Body fill | `--bg-2` | `colors.bg2` | `#0C0F1A` |
| Body stroke | `--border-2`, 1px | `colors.border2`, 1px | `rgba(255,255,255,.16)` |
| Highlight `primary` | fill `rgba(52,245,197,.55)` · stroke `--mint` | fill same · stroke `colors.mint` | `#34F5C5` |
| Highlight `secondary` | fill `rgba(34,211,238,.45)` · stroke `--cyan` | fill same · stroke `colors.cyan` | `#22D3EE` |
| Highlight `stabilizer` | fill `rgba(130,139,159,.35)` · stroke `--text-faint` | fill same · stroke `colors.textFaint` | `#828B9F` |
| Region glow | `filter: drop-shadow(0 0 5px currentColor)` | — (not applied) | role-colored |
| Legend gap | `9px` | `9px` | row gap `10px` |
| Legend dot | `10×10`, radius `3px`, `box-shadow 0 0 8px currentColor` | `10×10`, radius `3`, `shadowRadius 8` | role-colored glow |
| Legend name | `13.5px`, weight 600, `--text` | `13.5px`, weight 600, `colors.text` (`fonts.ui`) | — |
| Root gap | `18px` (figure ↔ legend) | `18` | flex row, centered |
| Role chip tone | primary→`high` · secondary→`accent` · stabilizer→`neutral` | same | via `Chip` |

- Geometry is generated, not authored: a Catmull-Rom `smoothClosed` outline mirrored across x=60, plus `plate`/`pairEllipse` muscle regions sized to the `bodyType` proportions. The function is duplicated **verbatim** in both files (same `TYPES`, `buildBody`, `buildRegions`).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | base `.lk-muscle` figure + legend | base `View` figure + legend |
| Targeted region | tinted path + `drop-shadow` glow | tinted path (no glow) |
| Untargeted region | not drawn (only `drawn` groups render) | same |
| Empty (`targets=[]`) | figure only; legend hidden (no rows) | same |
| `showLegend={false}` | figure only | figure only |
| Hover / pressed / focus | none (static `role="img"`) | none |

There is no hover/press/disabled affordance — `MuscleDiagram` is a non-interactive illustration.

## 5. Web ↔ native parity

**Verdict: 🟡 same API, identical geometry, two substrate-shaped visual gaps.** The headline parity win: the silhouette + region **path strings are byte-identical** because the generator (`smoothClosed`, `mirror`, `buildBody`, `buildRegions`, `TYPES`) is copied verbatim into both twins. Same `targets` → same `d` attributes → pixel-identical figure.

Real differences (neither blocks use):

- **Region glow:** web adds `filter: drop-shadow(0 0 5px currentColor)` to each highlighted region; native renders the region fill+stroke without the soft glow — the kit's Fabric `FeGaussianBlur` pattern hasn't been applied to this component. The legend dot glow exists on both (native via `shadowColor`/`shadowRadius`).
- **Props surface:** web extends `HTMLAttributes<HTMLDivElement>` (`className` + spread); native exposes only `style`.

No capability gap blocks the component — the body map is fully usable and geometrically identical on both platforms.

## 6. Composition & usage

- **Composes:** `Chip` (role tag in each legend row). Native also pulls `colors`/`fonts` from `@lockin90/tokens`.
- **Used by:** exercise / workout detail screens — "muscles worked" for a movement; the Guide library.

```tsx
// web
<MuscleDiagram
  bodyType="female"
  view="front"
  targets={[
    { group: 'chest', role: 'primary' },
    { group: 'triceps', role: 'secondary' },
    { group: 'shoulders', role: 'secondary' },
  ]}
/>

// native
<MuscleDiagram
  bodyType="female"
  view="front"
  targets={[
    { group: 'chest', role: 'primary' },
    { group: 'triceps', role: 'secondary' },
  ]}
/>
```

## 7. Accessibility

- **Web:** the `<svg>` is `role="img"` with a generated `aria-label` summarizing body type, view, and each worked group + role (e.g. *"Body map (female, front view): Chest primary, Triceps secondary."*). Legend dots are `aria-hidden`; the muscle name + `Chip` carry the readable text.
- **Native:** the figure is a decorative `Svg`; the legend `Text` rows are the accessible content. (No explicit `accessibilityLabel` on the `Svg` — consider adding one for parity with the web `aria-label`.)
- **Contrast:** legend names use `--text` on the surface; role colors are decoration, never the sole signal (each row also carries a text `Chip`).

## 8. Usage rules — Do / Don't

**Do**
- Drive it from real "muscles worked" data — map each worked group to a `role`.
- Use `primary`/`secondary`/`stabilizer` to encode emphasis, not arbitrary colors.
- Match `view` to what you're showing (e.g. `back` for rows/pulls so lats/traps are visible).
- Keep `showLegend` on unless the figure already sits next to its own text list.

**Don't**
- ✗ Don't hand-draw an anatomy SVG or fork the geometry — import `MuscleDiagram` so web ≡ native stays automatic.
- ✗ Don't pass a group the chosen `view` can't draw (it's silently skipped — pick the right `view`).
- ✗ Don't hardcode the role colors/glow — they come from `@lockin90/tokens`.
- ✗ Don't rely on color alone to convey role — the legend `Chip` is the text fallback.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom body diagram will drift from this one and break the parity rule. There is exactly one sanctioned body map.
- **Geometry stays shared.** The generator MUST remain character-identical between the two files — that's what makes the figure pixel-identical. A change to proportions or regions is applied to **both** twins in the same unit of work, or the parity gate fails.
- **New body type / muscle group?** Extend `BodyType` / `MuscleGroup` + the `TYPES`/`buildRegions` tables on **both** platforms (same names, same numbers) — never a one-off.
- **Tokens only.** Role strokes, body fill, and glow colors are tokens; the literal `rgba()` region fills are the *only* sanctioned hardcodes (they're alpha tints of the same spectrum colors and live in both twins identically).
