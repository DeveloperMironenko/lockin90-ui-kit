# SDD — `ProGate`

> **Package:** `@lockin90/ui-native` (native) — **native-only**; there is **no web `ProGate`** export.
> **Source:** `packages/ui-native/src/components/ProGate.tsx` (exports `ProGate` + `LockedRow`) · native blur shim `packages/ui-native/src/internal/optionalBlur.ts`.
> **Web reality:** `packages/ui/src/components/LockedRow.tsx` exports **only `LockedRow`** — no `ProGate`. The web index re-exports `LockedRow` alone; web CSS `pro.css` contains only `.lk-lockrow*` (no `.lk-pro*`). The native source's doc-comment ("Web uses `filter: blur(6px); opacity: 0.35`") describes the *intended* web treatment, but **no exported web `ProGate` component/stylesheet currently ships**.
> **Exports:** `ProGate`, type `ProGateProps` (native only).
> **Status:** Shipped (native). **Parity:** 🔵 **capability/coverage gap** — native-only; no web counterpart, and native dims via opacity + optional `expo-blur` frost (no `backdrop-filter`).
> **Stories:** native — `packages/ui-native/src/stories/ProGate.stories.tsx`. (No web story — no web component.)

---

## 1. Overview

A **premium-lock overlay** for native: it renders gated content dimmed and frosted behind a centered glass "lock" card (padlock + title + subtitle), signalling "upgrade to see this". It's the **panel-level** paywall surface; `LockedRow` (shipped on both platforms) is the **row-level** sibling for truncated lists.

This is currently a **native primitive only** — the web kit has no `ProGate`. Web surfaces that need a locked panel compose their own treatment (or use `LockedRow` for rows); if/when a web `ProGate` is needed it must be **added to both platforms** with the same prop API (see §9).

## 2. API contract (native)

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string` | `'PRO Feature'` | lock-card heading |
| `subtitle` | `string` | `'Visualize PR progression with PRO'` | lock-card supporting line |
| `children` | `ReactNode` | — | gated content, shown dimmed behind the overlay; when `null`, a 150px `--glass` placeholder fills the area |
| `style` | `StyleProp<ViewStyle>` | — | merged onto the root |
| _rest_ | `Omit<ViewProps,'children'>` | — | spread onto the root `View` |

- Plain function. The root is `position: relative`, `overflow: hidden`, `radii.md`. Three stacked layers (all `pointerEvents="none"` — the gate is non-interactive; a tappable CTA lives in the host): the **dimmed content** (`opacity 0.35`), an optional **frost** (`OptionalBlurView`), and the **lock card** overlay.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Native value |
| --- | --- |
| Root | `position: relative`, `radii.md` (16), `overflow: hidden` |
| Gated content | `opacity 0.35`; empty → `minHeight 150` + `colors.glass` |
| Frost | `OptionalBlurView intensity={12} tint="dark"` filling the root (only when `expo-blur` is installed) |
| Overlay | absolute fill, centered, `padding 12` |
| Lock card | centered, `gap 8`, `maxWidth 70%`, `16/22` pad, `colors.glass2`, `1px colors.border`, `radii.md` |
| Lock glyph | `LockIcon` 24, `colors.textFaint`, sw 1.8 |
| Title | `fonts.display` 700, 15px, `-0.15` ls, `colors.text`, centered |
| Subtitle | `fonts.ui` 12.5px, `colors.textDim`, centered |

## 4. States (native)

| State | Behavior |
| --- | --- |
| With content | child rendered at `opacity 0.35` behind the frost + lock card |
| Empty | `contentEmpty` → 150px `--glass` placeholder behind the overlay |
| Blur available | `expo-blur` present → real frosted blur over the dimmed content |
| Blur absent | `OptionalBlurView` is `null` → dim-only fallback (no frost), graceful |

The gate is presentational and non-interactive (all layers `pointerEvents="none"`); put the upgrade CTA in the surrounding host UI.

## 5. Web ↔ native parity

**Verdict: 🔵 native-only — no shipped web counterpart.** This is the genuine coverage gap:

- **No web `ProGate`.** The web kit exports only `LockedRow` (from `LockedRow.tsx`); there is no `ProGate` component, no `.lk-pro*` CSS, and no web story. Web phone-width has **nothing** to diff against this native component.
- **Native frost is best-effort.** Native can't `backdrop-filter`-blur arbitrary content, so the design degrades to `opacity 0.35` dim + an **optional** `expo-blur` frost (only when the peer is installed). The doc-comment's "web uses `filter: blur(6px)`" is the intended web behavior, not a shipped export.

**Consequence for parity:** any screen that needs a locked panel on **both** web and native must first **add a web `ProGate`** (same prop API + tokens, web `filter: blur` / `opacity` treatment) — otherwise the web↔native parity rule can't be satisfied for that surface. Until then, prefer `LockedRow` (which *is* cross-platform) for gating, or compose a web-local panel and flag the gap.

## 6. Composition & usage (native)

- **Composes from:** an inline `LockIcon` SVG + `OptionalBlurView`. The gated `children` are whatever the screen would show unlocked.
- **Used by:** native premium/paywalled panels (e.g. a locked PR-progression chart). Row-level gating uses `LockedRow`.

```tsx
// native — wrap the premium content
<ProGate title="PRO Feature" subtitle="Visualize PR progression with PRO">
  <PkChart doses={doses} thresholds={thresholds} />
</ProGate>

// empty gate (placeholder fill)
<ProGate title="PRO Feature" subtitle="Unlock advanced insights" />
```

## 7. Accessibility (native)

- The whole gate is `pointerEvents="none"` — it doesn't intercept touches; the host screen owns the upgrade affordance (which carries its own `accessibilityRole`/label).
- Title/subtitle are plain `Text` read in order; the padlock SVG is decorative (no a11y text).
- Because the gated content is dimmed to `0.35`, do **not** rely on it being readable behind the frost — the lock card + host CTA must convey the locked state.
- **Contrast:** title is full `colors.text` on the `glass2` card; subtitle `textDim` at 12.5px stays legible over the frosted/dimmed backdrop.

## 8. Usage rules — Do / Don't

**Do** (native)
- Use `ProGate` to lock a whole panel/chart; use `LockedRow` to lock a list tail.
- Install `expo-blur` in the app to get the real frost (otherwise it dims only — fine, but flatter).
- Put the upgrade CTA in the surrounding host UI, not inside the (non-interactive) gate.

**Don't**
- ✗ Don't import `ProGate` on web — it doesn't exist there. Use `LockedRow` or flag the gap.
- ✗ Don't hardcode the dim opacity, frost intensity, card glass, or lock color — tokens.
- ✗ Don't make the gated content interactive (it's `pointerEvents="none"` by design).
- ✗ Don't treat the dimmed content as readable — it's a teaser, not the value.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom dim+lock overlay drifts from the card/lock tokens and the `expo-blur` fallback. Use `ProGate` (native).
- **The parity debt is real.** Because there's **no web `ProGate`**, this is the one overlay in this set without web↔native parity. The correct fix is to **add a web `ProGate`** (`@lockin90/ui`, `.lk-pro*` CSS, `filter: blur(6px)` + `opacity: .35`, same `ProGateProps`) so both platforms gate panels identically — not to hand-roll a web lookalike per screen.
- **Tokens only.** Card `glass2`/`border`, `radii.md`, faint lock, and display/ui type all come from `@lockin90/tokens`.
- **Parity gate.** Until a web `ProGate` exists, a screen using native `ProGate` cannot pass the web≡native gate for that panel — surface the gap explicitly when shipping such a screen.
