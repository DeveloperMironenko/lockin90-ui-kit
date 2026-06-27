# SDD — `TagCloud` (+ `TagCloudItem` / `TagCloudSize` types, `weightToSize` helper)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/TagCloud.tsx` · `packages/ui-native/src/components/TagCloud.tsx` ·
> web CSS `packages/ui/src/styles/components/tagcloud.css` (`.lk-tagcloud*`).
> **Exports:** `TagCloud`, `weightToSize`, type `TagCloudItem`, type `TagCloudSize` (`'sm' | 'md' | 'lg' | 'xl'`), type `TagCloudProps`.
> **Status:** Shipped. **Parity:** ✅ identical API + buckets; native carries the bucket font-size + gradient tints in JS maps (web uses CSS).
> **Stories:** `packages/ui/src/stories/TagCloud.stories.tsx` · `packages/ui-native/src/stories/TagCloud.stories.tsx`.

---

## 1. Overview

A **flex-wrapped collection of weighted tag pills**, sized by weight (bigger = more frequent / important) — for journal topic clouds, interest tags, etc. Distinct from `TagInput` (a form control) and `Chip` (a single pill).

Each tag's `weight` maps to **one of 4 size buckets** (`sm` / `md` / `lg` / `xl`) via the exported `weightToSize` helper. `colorMode='mono'` (default) keeps every pill neutral glass/dim and varies **only size**; `colorMode='gradient'` tints the heavier buckets with the energy spectrum (lg = cyan, xl = violet). Tags render as `<button>`/`Pressable` when a press handler is present (per-tag `onPress` or the cloud-level `onTagPress`), else as a static `<span>`/`View`. Mirrors `.tagcloud` from the journal design.

## 2. API contract

**`TagCloudProps`**

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `tags` | `TagCloudItem[]` | _required_ | ✓ | ✓ | the weighted tags to render |
| `colorMode` | `'mono' \| 'gradient'` | `'mono'` | ✓ | ✓ | `gradient` tints lg/xl buckets |
| `onTagPress` | `(tag: TagCloudItem) => void` | — | ✓ | ✓ | cloud-level handler; fires for any tag without its own `onPress` |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web) / `ViewProps` (native) | — | ✓ | ✓ | container attrs |

**`TagCloudItem`**: `{ label: string; weight?: number; onPress?: () => void }` — `onPress` (per-tag) overrides the cloud-level `onTagPress`.

**`weightToSize(weight?: number): TagCloudSize`** — `>=4 → 'xl'`, `>=3 → 'lg'`, `>=2 → 'md'`, else `'sm'`; defaults to `2` (`'md'`) when `weight` is undefined. Maps the canonical 1..4 scale directly and clamps any positive number to the nearest bucket.

- **Web:** `forwardRef<HTMLDivElement>`; container `<div>`, each tag a `<button type="button">` (if pressable) or `<span>`.
- **Native:** plain function component; container `View`, each tag a `Pressable` or `View` wrapping a `Text`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Token | Value |
| --- | --- | --- |
| Cloud gap | `8px` | flex-wrapped |
| Pill padding | `4px / 11px` | both platforms |
| Pill radius | `--r-pill` / `radii.pill` | 999 |
| Pill border | `1px --border` / `colors.border` | neutral |
| Pill background | `--glass` / `colors.glass` | neutral |
| Text font | `--font-mono` / `fonts.mono` | mono |
| Text color (mono) | `--text-dim` / `colors.textDim` | `#AAB2C6` |

**Size buckets (font-size):**

| Bucket | Web class | Web px | Native px |
| --- | --- | --- | --- |
| `sm` | `.lk-tagcloud-sm` | 11px | 11 |
| `md` | `.lk-tagcloud-md` | 12.5px | 12.5 |
| `lg` | `.lk-tagcloud-lg` | 14.5px | 14.5 |
| `xl` | `.lk-tagcloud-xl` | 17px | 17 |

**Gradient mode (`lk-tagcloud-grad` / `GRAD_TINT`):**

| Bucket | Text | Border | Background |
| --- | --- | --- | --- |
| `lg` | `--accent-2` / `colors.accent2` (cyan) | `rgba(34,211,238,.3)` | — (web) / `colors.glass` (native) |
| `xl` | `#cbbcff` (violet) | `rgba(124,92,255,.4)` | `rgba(124,92,255,.08)` |

- `sm`/`md` are unaffected by `gradient` mode (only lg/xl pick up tints).
- **Web hover:** `.lk-tagcloud-tag:hover` → text `--text`, border `--border-2`, `transform: translateY(-2px)`.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Static tag | `<span class="lk-tagcloud-tag …">` (`cursor: default`) | `<View>` wrapping `<Text>` |
| Interactive tag | `<button class="lk-tagcloud-tag …">` (`cursor: pointer`) | `<Pressable>` wrapping `<Text>` |
| Hover (web) | text `--text`, border `--border-2`, lift `-2px` | n/a |
| Gradient lg/xl | spectrum tints from `.lk-tagcloud-grad` | tints from `GRAD_TINT` |

No disabled state; "interactive" is decided purely by the presence of a handler.

## 5. Web ↔ native parity

**Verdict: ✅ identical API + buckets.** Same exports (`TagCloud`, `weightToSize`, `TagCloudItem`, `TagCloudSize`), same `weightToSize` thresholds and default, same 4-bucket font sizes (11 / 12.5 / 14.5 / 17), same mono/glass/dim pill, same 8px gap + 4/11 padding + pill radius, same gradient tints (lg cyan, xl violet) on the same buckets, and the same "render as button when a handler exists" rule.

The only difference is substrate: web declares bucket sizes + gradient tints as CSS classes (`.lk-tagcloud-sm…-xl`, `.lk-tagcloud-grad`); native carries them as JS maps (`FONT_SIZE`, `GRAD_TINT`) applied inline. Web adds a hover lift (pointer-only); native has none. Values match exactly. No capability gap.

## 6. Composition & usage

- **Composes from:** raw pills (no other kit primitive).
- **Used by:** journal topic clouds, interest/tag pickers, "what you talk about" summaries.
- **Handlers:** set a per-tag `onPress` for tag-specific behavior, or one cloud-level `onTagPress` to handle all; per-tag wins when both exist.

```tsx
// web — gradient cloud, cloud-level handler
<TagCloud
  colorMode="gradient"
  tags={[
    { label: 'sleep', weight: 4 },
    { label: 'caffeine', weight: 3 },
    { label: 'stress', weight: 2 },
    { label: 'travel', weight: 1 },
  ]}
  onTagPress={(t) => filterBy(t.label)}
/>

// native — identical props
<TagCloud tags={topics} onTagPress={(t) => filterBy(t.label)} />
```

## 7. Accessibility

- **Web:** interactive tags are real `<button type="button">` (focusable, Enter/Space activate); static tags are `<span>` text. Pass an accessible label via the tag `label` text itself.
- **Native:** interactive tags are `Pressable` (add `accessibilityRole`/label via the parent if needed); static tags are `View`+`Text`.
- **Size ≠ meaning for AT:** the weight→size mapping is visual only; screen readers read every tag's `label` equally regardless of bucket — keep labels self-describing.
- **Contrast:** mono `--text-dim` on glass and the gradient tints all clear contrast on the void background; the `sm` 11px bucket is the smallest readable size — don't go below it.

## 8. Usage rules — Do / Don't

**Do**
- Use the canonical 1..4 `weight` scale (maps directly to sm/md/lg/xl).
- Use `colorMode='gradient'` when you want the heaviest tags to pop; `mono` for neutral clouds.
- Provide a handler (`onPress` or `onTagPress`) only when tags are actually actionable.

**Don't**
- ✗ Don't hand-roll a weighted pill cloud — use `TagCloud`.
- ✗ Don't use it for a single pill (use `Chip`) or for tag entry (use the form tag input).
- ✗ Don't hardcode the bucket sizes or gradient tints — use `weightToSize` + the kit tints.
- ✗ Don't pass arbitrary huge weights expecting more than 4 buckets — they clamp to `xl`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom weighted tag cloud is a parity violation — import `TagCloud` and `weightToSize`.
- **New bucket / tint?** If you need a 5th size or a different spectrum tint, add it to the bucket maps + CSS on **both** platforms (same token) — never a local fork.
- **Tokens only.** Pill glass/border, mono font, and the cyan/violet gradient tints come from `@lockin90/tokens`; a hardcoded color/size is a bug even if it matches today.
- **Parity gate.** Before shipping a topic-cloud surface, confirm web phone-width and native render the same buckets and `gradient` tints for the same weights.
