# SDD — `ProGate`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — cross-platform premium-lock overlay.
> **Source:** `packages/ui/src/components/ProGate.tsx` · `packages/ui-native/src/components/ProGate.tsx` (native file also exports `LockedRow`) · web CSS `packages/ui/src/styles/components/pro.css` (`.lk-pro*`) · native blur shim `packages/ui-native/src/internal/optionalBlur.ts`.
> **Exports:** `ProGate`, type `ProGateProps` (both platforms). (Web `LockedRow` ships from its own `LockedRow.tsx`; native bundles `LockedRow` in the same file.)
> **Status:** Shipped (web + native). **Parity:** 🟡 same API, structure & lock card; the **frost substrate differs** — web blurs the gated content with `filter: blur(6px)` + `opacity 0.35`; native dims to `opacity 0.35` and lays a real `expo-blur` frost over it **only when** the optional peer is installed (else dim-only).
> **Stories:** `packages/ui/src/stories/ProGate.stories.tsx` · `packages/ui-native/src/stories/ProGate.stories.tsx`.

---

## 1. Overview

A **premium-lock overlay**: it renders gated content blurred + dimmed behind a centered glass "lock" card (padlock + title + subtitle), signalling "upgrade to see this". It's the **panel-level** paywall surface; `LockedRow` (shipped on both platforms) is the **row-level** sibling for truncated lists.

It now ships on **both platforms** with the same prop API (`title` / `subtitle` / `children`). Web wraps the gated `children` in a blurred (`filter: blur(6px)`), dimmed (`opacity 0.35`) layer with a centered lock-card overlay; native mirrors the structure with `opacity 0.35` + an optional `expo-blur` frost. The whole gate is non-interactive on both — the upgrade CTA lives in the surrounding host UI.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `title` | `string` | `'PRO Feature'` | ✓ | ✓ | lock-card heading |
| `subtitle` | `string` | `'Visualize PR progression with PRO'` | ✓ | ✓ | lock-card supporting line |
| `children` | `ReactNode` | — | ✓ | ✓ | gated content, shown blurred+dimmed behind the overlay; when `null`, a 150px `--glass` placeholder fills the area |
| `className` | `string` | — | ✓ | — | web only — merged onto `.lk-pro` via `cn` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only — merged onto the root |
| _rest_ | web `Omit<HTMLAttributes<HTMLDivElement>,'children'\|'title'>` · native `Omit<ViewProps,'children'>` | — | ✓ | ✓ | spread onto the root |

- Plain function on both. The root is `position: relative`, `overflow: hidden`, radius `--r` (web) / `radii.md` (native).
- **Web:** two stacked layers, both `pointer-events: none` (the gate is non-interactive — the CTA lives in the host): the **blurred+dimmed content** (`.lk-pro-content` — `filter: blur(6px)` + `opacity 0.35`; `aria-hidden`) and the centered **lock-card** overlay (`.lk-pro-overlay` → `.lk-pro-card`). Empty `children` → `.lk-pro-content-empty` (150px `--glass` placeholder).
- **Native:** three stacked layers (all `pointerEvents="none"`): the **dimmed content** (`opacity 0.35`), an optional **frost** (`OptionalBlurView`), and the **lock card** overlay.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`.lk-pro*`) | Native |
| --- | --- | --- |
| Root | `position: relative`, `--r` (16), `overflow: hidden` | `position: relative`, `radii.md` (16), `overflow: hidden` |
| Gated content | `filter: blur(6px)` + `opacity 0.35`; empty → `min-height 150px` + `--glass` | `opacity 0.35`; empty → `minHeight 150` + `colors.glass` |
| Frost | (blur applied directly to the content via `filter`) | `OptionalBlurView intensity={12} tint="dark"` filling the root (only when `expo-blur` is installed) |
| Overlay | absolute `inset:0`, `place-items:center`, `padding 12px` | absolute fill, centered, `padding 12` |
| Lock card | centered, `gap 8px`, `max-width 70%`, `16/22` pad, `--glass-2`, `1px --border`, `--r` | `gap 8`, `maxWidth 70%`, `16/22` pad, `colors.glass2`, `1px colors.border`, `radii.md` |
| Lock glyph | `LockIcon` 24, `--text-faint`, sw 1.8 | `LockIcon` 24, `colors.textFaint`, sw 1.8 |
| Title | `--font-display` 700, 15px, `-0.15px` ls, `--text`, centered | `fonts.display` 700, 15px, `-0.15` ls, `colors.text`, centered |
| Subtitle | `--font-ui` 12.5px, `--text-dim`, centered | `fonts.ui` 12.5px, `colors.textDim`, centered |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| With content | child blurred (`blur(6px)`) + dimmed (`opacity 0.35`) behind the lock card | child at `opacity 0.35` behind the frost + lock card |
| Empty | `.lk-pro-content-empty` → 150px `--glass` placeholder behind the overlay | `contentEmpty` → 150px `--glass` placeholder |
| Blur available | always (CSS `filter: blur`) | `expo-blur` present → real frosted blur over the dimmed content |
| Blur absent | n/a | `OptionalBlurView` is `null` → dim-only fallback (no frost), graceful |

The gate is presentational and non-interactive on both (web `pointer-events: none` on both layers; native `pointerEvents="none"`); put the upgrade CTA in the surrounding host UI.

## 5. Web ↔ native parity

**Verdict: 🟡 same API/structure, frost substrate differs.** Both platforms take the same props (`title`/`subtitle`/`children`), lay out the same three visual elements (dimmed content · lock-card overlay · centered padlock + title + subtitle), and share the same glass/border/radius/type tokens. The only difference is *how* the frost is produced:

- **Web** blurs the gated content directly with `filter: blur(6px)` + `opacity 0.35` — a real, always-on frost.
- **Native** dims to `opacity 0.35` and lays a real `expo-blur` frost **only when** the optional `expo-blur` peer is installed; without it, it degrades to dim-only (RN-SVG can't `backdrop-filter` arbitrary content). Cosmetic — the lock card + dim still read identically.

No capability gap blocks use: the panel reads the same at web phone width and on native (accepting the documented frost-availability nuance on native).

## 6. Composition & usage

- **Composes from:** an inline `LockIcon` SVG (web) / `LockIcon` + `OptionalBlurView` (native). The gated `children` are whatever the screen would show unlocked.
- **Used by:** premium/paywalled panels (e.g. a locked PR-progression chart) on both platforms. Row-level gating uses `LockedRow`.

```tsx
// web — wrap the premium content
<ProGate title="PRO Feature" subtitle="Visualize PR progression with PRO">
  <PkChart doses={doses} thresholds={thresholds} />
</ProGate>

// native — same API
<ProGate title="PRO Feature" subtitle="Visualize PR progression with PRO">
  <PkChart doses={doses} thresholds={thresholds} />
</ProGate>

// empty gate (placeholder fill) — both platforms
<ProGate title="PRO Feature" subtitle="Unlock advanced insights" />
```

## 7. Accessibility

- The whole gate is non-interactive (web `pointer-events: none` on both layers; native `pointerEvents="none"`) — it doesn't intercept clicks/touches; the host screen owns the upgrade affordance (which carries its own role/label).
- **Web:** the gated content layer and the overlay are `aria-hidden="true"` — the blurred teaser + decorative padlock are hidden from AT; the host CTA conveys the locked state.
- **Native:** title/subtitle are plain `Text` read in order; the padlock SVG is decorative (no a11y text).
- Because the gated content is dimmed to `0.35`, do **not** rely on it being readable behind the frost — the lock card + host CTA must convey the locked state.
- **Contrast:** title is full `colors.text` on the `glass2` card; subtitle `textDim` at 12.5px stays legible over the frosted/dimmed backdrop.

## 8. Usage rules — Do / Don't

**Do**
- Use `ProGate` to lock a whole panel/chart; use `LockedRow` to lock a list tail.
- On native, install `expo-blur` in the app to get the real frost (otherwise it dims only — fine, but flatter). Web always frosts via CSS `filter`.
- Put the upgrade CTA in the surrounding host UI, not inside the (non-interactive) gate.

**Don't**
- ✗ Don't hardcode the dim opacity, blur radius, card glass, or lock color — tokens.
- ✗ Don't make the gated content interactive (both layers are non-interactive by design).
- ✗ Don't treat the blurred/dimmed content as readable — it's a teaser, not the value.
- ✗ Don't hand-roll a web/native lookalike overlay — import `ProGate`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom dim+lock overlay drifts from the card/lock tokens and the blur treatment. Use `ProGate` on both platforms.
- **Parity is closed.** `ProGate` now ships on **both** web (`@lockin90/ui`, `.lk-pro*` CSS, `filter: blur(6px)` + `opacity 0.35`) and native (same `ProGateProps`), so panel gating is identical across platforms — the earlier web coverage gap is resolved.
- **Tokens only.** Card `--glass-2`/`--border`, `--r`, faint lock, and display/ui type all come from `@lockin90/tokens`.
- **New need → add to BOTH platforms.** A new gate variant (e.g. a CTA slot, a different dim level) is a prop added to web AND native with the same name + tokens — never a one-off per screen.
