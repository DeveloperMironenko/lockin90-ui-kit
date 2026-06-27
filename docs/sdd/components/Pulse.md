# SDD — `Pulse`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Pulse.tsx` · `packages/ui-native/src/components/Pulse.tsx` ·
> web CSS `packages/ui/src/styles/primitives.css` (`.lk-pulse`, `@keyframes lk-ping`).
> **Exports:** `Pulse`, type `PulseProps`.
> **Status:** Shipped. **Parity:** 🟡 same `tone` API; **web** is a live breathing dot (CSS `ping` ring), **native** is a static glowing dot (no animation).
> **Stories:** `packages/ui/src/stories/Pulse.stories.tsx` · native equivalent.

---

## 1. Overview

A tiny **live status dot**. On web it "breathes" — a colored dot with an expanding/fading ring behind it
(`lk-ping`) signalling liveness (online, syncing, healthy). On native it's the same dot with a soft glow but
**no animation** (RN has no cheap CSS-keyframe equivalent here). One prop: `tone`.

- `ok` (default) — `--ok`/`colors.ok` mint, "healthy / live".
- `warn` — `--warn`/`colors.warn` amber, "degraded".
- `bad` — `--bad`/`colors.bad` rose, "down / error".

Distinct from `StatusDot` (which adds an optional label + 5 zone tones and is for inline status badges); `Pulse`
is the minimal liveness indicator — no label, three semantic tones, and on web it animates.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `tone` | `'ok' \| 'warn' \| 'bad'` | `'ok'` | ✓ | ✓ | identical union both sides |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLSpanElement>` | — | ✓ | — | **web only** — spread onto the `<span>` |

- **Web:** `<span className="lk-pulse [lk-warn|lk-bad]" {...rest} />` — a 9px dot with a `::after` ping ring.
- **Native:** `<View style={[dot, { backgroundColor, shadowColor }, style]} />` — a 9px glowing dot; `style` only,
  no rest props.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`.lk-pulse`) | Native (`styles.dot`) |
| --- | --- | --- |
| Dot | 9×9, `border-radius 50%`, `display: inline-block` | 9×9, `borderRadius 5` |
| Color (ok) | `background: var(--ok)` | `colors.ok` |
| Color (warn) | `.lk-warn` → `var(--warn)` | `colors.warn` |
| Color (bad) | `.lk-bad` → `var(--bad)` | `colors.bad` |
| Glow / motion | `::after` ring inherits the dot color, `@keyframes lk-ping` 1.8s `var(--ease)` infinite (scale 1→2.6, opacity .7→0) | static `shadowColor` = tone, `shadowOpacity .9`, `shadowRadius 6`, no offset |

`--ok`/`--warn`/`--bad` are the status tokens (`#34F5C5` / `#FFB020` / `#FF4D6D`).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default (ok) | `.lk-pulse` + animated ping ring | static glowing dot |
| warn / bad | `.lk-warn` / `.lk-bad` recolor (ring + dot) | recolored dot + glow |
| Hover / focus / press | none (presentational) | none |
| Reduced motion | ping continues (no `prefers-reduced-motion` guard on `lk-ping`) | static (no motion) |

## 5. Web ↔ native parity

**Verdict: 🟡 — same `tone` API, animation is web-only.** The dot size, the three semantic tones, and their
status-token colors are identical. The one real difference:

- **Motion:** web renders a breathing **ping ring** (`lk-ping`, 1.8s) that visibly pulses; native shows a
  **static glow** (`shadowRadius 6`) and never animates. The "live" cue therefore moves on web but is steady on
  native. Documented, accepted (no perf-cheap RN equivalent), and **not blocking** — the dot still reads as a
  colored status indicator on both.

No capability gap beyond the missing animation; both platforms render an equivalent colored liveness dot.

## 6. Composition & usage

- **Used in:** connection/sync status (data-source rows), "live" badges, admin health indicators, header
  presence dots.
- **Composes from:** nothing — a leaf. Place it before a label or inside a row; pair with text for meaning.

```tsx
// web
<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
  <Pulse tone="ok" /> Live
</span>

// native
<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
  <Pulse tone="ok" /><Text>Live</Text>
</View>
```

## 7. Accessibility

- **Web:** the dot is decorative (`<span>`, no role). When it conveys required status (live/degraded/down), **add
  a text label or `aria-label`** on the surrounding element — color/motion alone is not accessible (colorblind +
  reduced-motion users).
- **Native:** the `<View>` carries no accessibility info; provide the status as adjacent `<Text>` or via
  `accessibilityLabel` on a wrapper.
- **Motion sensitivity:** the web ping has no reduced-motion guard — if a screen must respect
  `prefers-reduced-motion`, gate the indicator at the app level or prefer a labeled `StatusDot`.

## 8. Usage rules — Do / Don't

**Do**
- Use `Pulse` for a minimal liveness dot where motion (web) signals "live".
- Map `tone` to real status semantics: `ok` live, `warn` degraded, `bad` down.
- Always pair it with a text label / accessible name when status is required information.

**Don't**
- ✗ Don't hardcode the dot color — use `tone` (status tokens).
- ✗ Don't rely on the animation being present on native (it's a static glow).
- ✗ Don't use `Pulse` when you need a label + zone tones — that's `StatusDot`.
- ✗ Don't convey status by the dot alone with no accessible name.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled colored circle with a ping ring re-creates `Pulse` and will drift from the
  status tokens — import it.
- **New need → add to BOTH platforms.** A new tone or a native animation must be added to both (same `tone`
  name, same tokens) — never a one-off dot.
- **Tokens only.** `--ok/--warn/--bad` are the source of truth; any hardcoded green/amber/red is a bug.
- **Parity gate.** Before shipping, diff web phone-width vs native — same size + tone color — and accept that the
  ping animation is web-only.
