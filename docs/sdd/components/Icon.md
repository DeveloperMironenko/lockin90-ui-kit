# SDD — `Icon`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Icon.tsx` · `packages/ui-native/src/components/Icon.tsx` ·
> web CSS `packages/ui/src/styles/components/icon.css` (`.lk-icon`).
> **Exports:** `Icon`, types `IconName`, `IconProps`.
> **Status:** Shipped. **Parity:** 🟡 same glyph set & geometry; web inherits `currentColor` (+ `.lk-icon` wrapper span), native takes an explicit `color` prop (no `currentColor`).
> **Stories:** `packages/ui/src/stories/Icon.stories.tsx` · native equivalent.

---

## 1. Overview

The kit's **single inline-SVG glyph set** — one component, ~111 named glyphs, drawn on a 24-unit viewBox with a
1.9 stroke and round caps/joins. It is the **only** sanctioned source of icons in any LockIn90 app; hand-drawing
or importing a second icon library is a parity/maintenance violation (see §9).

Glyphs inherit color from context: on **web** via `currentColor` (the SVG takes the text color of whatever it
sits in); on **native** via an explicit `color` prop (RN has no `currentColor`), defaulting to the body text
token. Most glyphs are stroked outlines; a few primitives (dots, filled triangles, mood eyes) are filled in the
resolved color. **Brand marks:** `google` is genuinely **multicolor** (its four brand fills are preserved on both
platforms); `apple` and `stripe` are filled silhouettes rendered in the resolved/`currentColor` color (not brand-hued).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `name` | `IconName` | — (required) | ✓ | ✓ | which glyph to render — identical union both sides |
| `size` | `number` | `18` | ✓ | ✓ | px width = height |
| `color` | `string` | — | ✗ | ✓ | **native only** — stands in for `currentColor`; defaults to `colors.text` |
| `className` | `string` | — | ✓ | ✗ | web only (on the wrapper span) |
| _rest_ | `HTMLAttributes<HTMLSpanElement>` | — | ✓ | ✗ | **web only** — spread onto the wrapper span |

- **Web:** `<span className="lk-icon …" {...rest}><svg width={size} … stroke="currentColor" strokeWidth={1.9}>
  {GLYPHS[name]}</svg></span>` — color is inherited from the parent's text color (set color on the wrapper or any
  ancestor).
- **Native:** `<Svg width={size} … stroke={color} strokeWidth={1.9}>{glyphFor(name, color)}</Svg>` — no wrapper,
  no `className`/`style`/rest; pass `color` explicitly. Same paths, drawn with `react-native-svg` primitives.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Value |
| --- | --- |
| viewBox | `0 0 24 24` (both) |
| Stroke | `currentColor` (web) / `color` (native), `stroke-width 1.9`, round caps + joins |
| Fill | `none` by default; filled glyphs use `fill="currentColor"`/`fill={color}` |
| Default size | `18` px |
| Wrapper (web) | `.lk-icon` — `inline-flex`, centered, `vertical-align: middle`; inner `svg { display:block }` |
| Color source | not a fixed token — **inherits** the surrounding text color (`--text`, `--text-dim`, `--accent`, status tokens…) |

`size` is unitless px; pass e.g. `16`/`17`/`14` to match a row's type (the `Button` row auto-sizes its leading
`svg` via CSS, but standalone you set `size`).

### IconName categories (≈111 glyphs — representative, not exhaustive)

| Category | Notable names |
| --- | --- |
| Core | `back` `chevron` `share` `more` `lock` `play` `info` `timer` `plus` `check` `star` |
| Content / block types | `image` `text` `heading` `quote` `embed` `code` `grid` `table` `columns` `list` `listOrdered` |
| Text formatting | `bold` `italic` `link` `unlink` `externalLink` |
| Files / media | `file` `fileText` `video` `folder` `folderOpen` |
| Editor actions | `grip` `eye` `eyeOff` `copy` `duplicate` `trash` `edit` `save` `translate` `settings` `search` `close` |
| Data / lists | `calendar` `filter` `sort` `upload` `download` |
| Status / feedback | `sparkle` `warning` `checkCircle` `xCircle` `refresh` |
| Navigation | `chevronDown` `chevronUp` `bell` `user` `home` `activity` |
| Domain / nav (web rebuild) | `energy` `sleep` `insights` `billing` `globe` `heart` `flame` `height` `weight` `arrow-right` `shield` |
| Mobile domain | `mail` `caffeine` `meal` `mood` `scale` `ruler` `card` `data-source` |
| Consumer screens | `send` `attach` `emoji` `mic` `comment` `bookmark` `target` `medal` `drop` `utensil` `barcode-scan` `pill` `flask` `syringe` `camera` |
| Mood faces (escalating) | `mood-rough` `mood-low` `mood-ok` `mood-good` `mood-great` |
| Provider marks (mono silhouette) | `oura` `whoop` `garmin` `polar` `apple-health` `dexcom` `strava` |
| Brand marks | `google` (**multicolor**), `apple` `stripe` (filled silhouette in resolved color) |

## 4. States

`Icon` is stateless/presentational — no hover, press, focus, disabled, or selected state. Color, size, and
emphasis come entirely from the surrounding context (set the text color / `color` prop). Interaction belongs to
the wrapping `Button`/`Pressable`, not the icon.

## 5. Web ↔ native parity

**Verdict: 🟡 — identical glyph set + geometry, platform-shaped coloring/wrapper.** Every `IconName`, every SVG
path, the 24 viewBox, the 1.9 stroke, round caps, default size 18, and the `google` brand fills are 1:1. The
differences are substrate:

- **Color model:** web strokes/fills with `currentColor` and inherits the ambient text color via the `.lk-icon`
  wrapper span; native has no `currentColor`, so it takes an explicit **`color` prop** (default `colors.text`).
  App code differs only at the call site (set ancestor text color on web vs `color={…}` on native).
- **Wrapper + rest props:** web wraps the SVG in a `<span class="lk-icon">` and accepts `className`/`...rest`
  (HTML attrs); native renders the bare `<Svg>` with **no** `style`/`className`/rest — only `name`/`size`/`color`.
- **Brand marks:** `google` keeps its multicolor fills on both; `apple`/`stripe` are mono silhouettes in the
  resolved color on both.

No capability gap — the same icon renders the same on both platforms; only the color is sourced differently.

## 6. Composition & usage

- **Used by:** `Button` `leading` (SSO logos `google`/`apple`, `+`), nav/tab bars, `MetricTile` corner `icon`,
  empty states, table sort/expand (those use inline SVG, not `Icon`), and virtually every interactive surface.
- **Composes from:** nothing — a leaf. Color it by setting text color (web) or `color` (native).

```tsx
// web — inherits the surrounding text color
<span style={{ color: 'var(--accent)' }}><Icon name="sparkle" size={16} /></span>
<Button leading={<Icon name="google" />}>Continue with Google</Button>

// native — explicit color
<Icon name="sparkle" size={16} color={colors.accent} />
<Icon name="google" size={18} /> {/* brand fills preserved */}
```

## 7. Accessibility

- **Web:** the `<svg>` is `aria-hidden="true"` — it's decorative by default. When an icon is the **only** label
  (icon-only button), put the accessible name on the **interactive wrapper** (`aria-label` on the `Button`), not
  the icon. The `.lk-icon` span passes through `...rest` if you need to add attributes.
- **Native:** the bare `<Svg>` carries no accessibility role/label — provide the name on the wrapping
  `Pressable`/`Button` via `accessibilityLabel`.
- **Hit target:** the icon itself is not a target — size the surrounding pressable to ≥44px for touch.
- **Color contrast:** because color is inherited, ensure the ambient text/`color` meets contrast against its
  background (a faint icon on glass can fall below AA — bump to `--text`/`--text-dim` when it must be read).

## 8. Usage rules — Do / Don't

**Do**
- Use `Icon name="…"` for every glyph; size it to match its row's type.
- Color via inherited text color (web) or the `color` prop (native) — never bake a hex into the icon.
- Use the brand marks (`google`/`apple`/`stripe`) for SSO/payment; let `google` keep its multicolor fills.
- Give the **wrapping** control an accessible label when the icon stands alone.

**Don't**
- ✗ Don't import a second icon library or inline a one-off SVG — add the glyph to `Icon` instead.
- ✗ Don't pass `color` on web or `className`/`style`/rest on native (wrong-platform prop).
- ✗ Don't recolor the `google` brand mark (its fills are intentional brand color).
- ✗ Don't rely on the icon for meaning without an accessible name on its control.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-drawn SVG or a `react-icons`/`lucide` import is a parity violation — it won't share
  the 24-viewBox/1.9-stroke/round-cap geometry. If a glyph is missing, **add it to `IconName` + `GLYPHS`
  (web) and `glyphFor` (native)** with the same name and paths.
- **New need → add to BOTH platforms.** Every new glyph lands in the `IconName` union and both render maps
  (web `GLYPHS`, native `glyphFor`) simultaneously, same name, same path data.
- **Tokens / inheritance only.** Color comes from the surrounding text token (web) or the `color` prop (native);
  hardcoding a hex on an icon breaks theming.
- **Parity gate.** Before shipping, confirm the same `name` renders identically web vs native (same size, same
  inherited color, brand fills intact).
