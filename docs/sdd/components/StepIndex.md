# SDD — `StepIndex`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/StepIndex.tsx` · web CSS `packages/ui/src/styles/components/stepindex.css` (`.lk-stepindex`) · native `packages/ui-native/src/components/StepIndex.tsx` (next PR).
> **Exports:** `StepIndex`, type `StepIndexProps`.
> **Status:** Web shipped; native in the following PR. **Parity:** ✅ identical API (once native ships).
> **Stories:** `packages/ui/src/stories/StepIndex.stories.tsx`.

---

## 1. Overview

The step's number beside a step's title in a guided flow (design `web/onboarding.html` / `mobile/auth-onboarding.html` `.ob-index`): a CTA-gradient tile with the number, or, once the flow is done, a mint-tinted tile with a check (the Finish head). It exists so every step head shares one tile instead of each app hand-styling a square.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `step` | `number` | — | ✓ | ✓ | the number shown while not done |
| `done` | `boolean` | `false` | ✓ | ✓ | a check instead of the number |
| _rest_ | `HTMLAttributes<HTMLSpanElement>` (no `children`) | — | ✓ | — | `className`, `style`… |

## 3. Visual spec

| Aspect | Value |
| --- | --- |
| Size | 44×44, radius 13px; ≤ 540px 38×38, radius 12px |
| Fill | `--grad-cta`, `--glow-accent`, 1px transparent border |
| Number | `--font-display` 700, 18px (16px ≤ 540px), `#07080d` (dark on the gradient, as the design) |
| Done | bg `--zone-high` @12%, border `--zone-high` @35%, no glow; the kit `check` icon 20px, stroke 2.6, `--zone-high` |

## 4. States

Default (number) and done (check). Not interactive.

## 5. Web ↔ native parity

Native draws the same tile at the mobile size (38) in the next PR.

## 6. Composition & usage

```tsx
<div className="flex items-start gap-4">
  <StepIndex step={1} />
  <h1>Your physiological profile</h1>
</div>
<StepIndex step={2} done />
```

## 7. Accessibility

`aria-hidden`: the title beside it names the step; the flow's tracker (`Stepper`) announces the position.

## 8. Do / Don't

- **Do** use it for a step head in a guided flow. **Don't** hand-roll a gradient square in an app.
