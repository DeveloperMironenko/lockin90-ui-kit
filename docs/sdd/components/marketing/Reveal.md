# SDD — `Reveal` (scroll-reveal wrapper)

> **Package:** `@lockin90/ui/marketing` — web-only marketing primitive (Aurora marketing site).
> **Import as:** `import { Reveal } from '@lockin90/ui/marketing'`.
> **Source:** `packages/ui/src/marketing/Reveal/index.tsx` (`'use client'`) · CSS `packages/ui/src/marketing/Reveal/styles.css` (`.lk-reveal` / `.lk-in`, folded into `dist/styles.css` by `tsup.config.ts`).
> **Exports:** `Reveal`, type `RevealProps`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (marketing) — no native counterpart by design.
> **Stories:** none — rendered live on the marketing site (`lockin90-marketing`).

---

## 1. Overview

A **lightweight scroll-into-view wrapper**: it fades + lifts its children into place the **first time** they intersect the viewport, then stops observing. It's the marketing site's one sanctioned way to do on-scroll reveal, so sections animate in consistently (same distance, easing, duration) instead of each page wiring its own observer.

Key behaviors, all code-grounded:

- **One-shot** — once revealed it `disconnect()`s the observer; it never re-hides on scroll-out.
- **Fail-safe** — if `IntersectionObserver` is missing (old/SSR-ish runtime), it sets `shown = true` immediately so content is **never stuck hidden**.
- **Reduced-motion safe** — users who prefer reduced motion get the content instantly (handled in CSS, see §3/§4).
- **Staggerable** — `delay` is applied as a `transition-delay`, so siblings can cascade.

## 2. API contract

| Prop | Type | Default | Web | Notes |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — (required) | ✓ | the content to reveal |
| `delay` | `number` | `0` | ✓ | stagger in **ms**, applied as inline `transitionDelay` once revealed |
| `as` | `'div' \| 'li'` | `'div'` | ✓ | element tag — use `'li'` to wrap a list item without breaking `<ul>`/`<ol>` semantics |
| `className` | `string` | — | ✓ | merged after `lk-reveal` (and `lk-in` when shown) via `cn(...)` |

- `'use client'` component — it runs an effect with `useRef` + `useState` + `IntersectionObserver`; it must render in a client boundary.
- **No `forwardRef`, no `...rest`.** Only the four props above apply; the internal `ref` is held by the component (you can't pass your own ref through). Arbitrary DOM attributes are not forwarded onto the wrapper.
- `delay` is written to `style={{ transitionDelay: '<delay>ms' }}` unconditionally (it's a stagger applied to the reveal transition, not a setTimeout).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Hidden (`.lk-reveal`) | Revealed (`.lk-reveal.lk-in`) |
| --- | --- | --- |
| Opacity | `0` | `1` |
| Transform | `translateY(26px)` | `none` |
| Transition | `opacity 0.7s --ease`, `transform 0.7s --ease` | (same) |
| `will-change` | `opacity, transform` | — |

- **Easing:** `--ease` (the kit's standard cubic-bezier). **Duration:** `0.7s` for both opacity + transform. **Lift distance:** `26px` upward.
- **Stagger:** the per-instance `delay` adds an inline `transition-delay` so a row of `Reveal`s can cascade (e.g. `0`, `80`, `160`).
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` forces `.lk-reveal { opacity: 1 !important; transform: none !important; }` — content shows with no motion.

## 4. States

| State | Behavior |
| --- | --- |
| Initial (in view later) | `.lk-reveal` only → opacity 0, lifted 26px, awaiting intersection |
| Intersecting (≥ threshold) | observer fires → `shown = true` → `.lk-in` added → fades/lifts into place over 0.7s (after `delay`) |
| Revealed | stays visible; observer is `disconnect()`ed — **no re-hide** on scroll away |
| No `IntersectionObserver` | `shown` set `true` on mount → content visible immediately (never stuck hidden) |
| Reduced motion | CSS forces visible/no-transform regardless of JS state |

- **Trigger geometry:** `IntersectionObserver` with `threshold: 0.15` and `rootMargin: '0px 0px -40px 0px'` — reveals when ~15% of the element is visible, with the trigger line pulled up 40px from the viewport bottom.

## 5. Platform & relationship to root kit

**Web-only by design** — scroll-reveal is a marketing-site effect; there is no `@lockin90/ui-native` counterpart.

- **Related to root `useReveal` (different mechanism).** The root kit exports a **`useReveal` hook** (`packages/ui/src/hooks/useReveal.tsx`) that calls `initMotion({ root })` to wire reveal + count-up across a whole subtree (the root motion system, driven by `data-*` attributes). The marketing `Reveal` is a **self-contained component** that owns its own `IntersectionObserver` per instance and toggles `.lk-reveal`/`.lk-in` — it does **not** depend on `initMotion`/`useReveal`. Same intent (reveal on scroll), independent implementations: the marketing one is per-element and zero-config; the root one is subtree-wide.
- There is no root **component** named `Reveal`; this primitive is marketing-scoped.
- Native apps achieve entrance motion via Animated/Reanimated, not this component.

## 6. Composition & usage

- **Composes from:** native DOM + `cn` + `IntersectionObserver`. No other primitives.
- **Wraps:** any marketing content — a `Section` block, a `Card`, a feature row, or (with `as="li"`) a list item in a staggered grid.
- **Stagger pattern:** map an index to `delay` to cascade siblings.

```tsx
// reveal a section block
<Reveal>
  <Heading as="h2" size="title">Built on evidence</Heading>
  <Body>Every score traces back to its inputs.</Body>
</Reveal>

// staggered feature grid (preserve list semantics with as="li")
<ul className="feature-grid">
  {features.map((f, i) => (
    <Reveal as="li" key={f.id} delay={i * 80}>
      <IconBadge name={f.icon} accent={i === 0} />
      <Heading as="h3" size="sub">{f.title}</Heading>
      <Body>{f.copy}</Body>
    </Reveal>
  ))}
</ul>
```

## 7. Accessibility

- **Respects `prefers-reduced-motion`** at the CSS layer — reduced-motion users see content immediately with no fade/lift, independent of the observer. This is the key a11y guarantee.
- **Never traps content hidden:** the `IntersectionObserver`-missing fallback shows content on mount, so non-supporting/SSR-degraded runtimes still render fully.
- `Reveal` is a **presentational wrapper** — it adds no role/label and doesn't change tab order or semantics, except that `as` lets you keep correct structure (use `as="li"` inside lists so the wrapper doesn't break `<ul>`/`<ol>` parsing).
- Keep meaningful content inside it as real DOM (it's not removed when hidden — only opacity/transform change), so screen readers and in-page find still reach it before it animates in.

## 8. Usage rules — Do / Don't

**Do**
- Use `Reveal` for marketing on-scroll entrance motion so distance/easing/duration stay uniform.
- Use `as="li"` when wrapping list items to preserve `<ul>`/`<ol>` semantics.
- Use `delay` to stagger sibling reveals (small steps, e.g. 60–120ms).
- Keep wrapped content as normal DOM — let CSS handle the hide/show.

**Don't**
- ✗ Don't use `delay` as an arbitrary timer — it's a `transition-delay` on the reveal, not a mount delay.
- ✗ Don't rely on re-hiding on scroll-out — `Reveal` is one-shot by design.
- ✗ Don't nest a `Reveal` directly inside another `Reveal` (compounded delays/transforms) — reveal at one level and stagger children via `delay`.
- ✗ Don't hardcode the 26px lift, 0.7s, or `--ease` elsewhere to fake it — use `Reveal`.
- ✗ Don't put essential, must-be-immediately-visible content's *only* copy behind it without trusting the fallbacks (they exist, but reveal is for enhancement).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled `IntersectionObserver` + opacity/translate on a marketing element re-creates `Reveal` and will drift from the 26px/0.7s/`--ease` spec and the reduced-motion + no-IO fallbacks — import `Reveal`.
- **New reveal behavior → extend the primitive.** A different distance, direction, or a re-animating mode should be a prop on `Reveal` (tokens-driven), not a one-off observer in app code.
- **Tokens only.** Easing (`--ease`) and the reveal geometry come from the kit; hardcoded timings/distances are bugs even when they match today.
- **Don't defeat the a11y guarantees.** Never strip the reduced-motion override or the no-`IntersectionObserver` fallback when adapting it — those are the contract that keeps content accessible.
