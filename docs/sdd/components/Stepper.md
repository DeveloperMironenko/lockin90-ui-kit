# SDD — `Stepper` (+ `NumberStepper` cross-ref)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitives.
> **Source:** `packages/ui/src/components/Stepper.tsx` · `packages/ui-native/src/components/Stepper.tsx` ·
> web CSS `packages/ui/src/styles/components/stepper.css` (`.lk-step*`, `.lk-numstep*`).
> **Exports:** `Stepper`, `NumberStepper`, types `Step`, `StepperProps`, `NumberStepperProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; platform-shaped impl (web CSS gradients/hover vs native `expo-linear-gradient`/press feedback). Two distinct components share the file.
> **Stories:** `packages/ui/src/stories/Stepper.stories.tsx` · `packages/ui-native/src/stories/Stepper.stories.tsx`.

---

## 1. Overview

Two atoms from one file — note they are unrelated despite the shared name:

- **`Stepper`** — a **horizontal numbered progress rail** for multi-step flows (Account → Profile → Goals → Done). Completed nodes fill **mint** with a check, the current node fills **accent**, future nodes stay faint glass; the connecting line fills accent up to the current step and faint beyond. Pass `complete` to also render the **current** node as done (mint check) so the whole rail reads finished — the onboarding "Complete" state where all nodes are done. Display-only (no per-node click).
- **`NumberStepper`** (secondary export) — a **compact quantity control**: a glass pill grouping a `−` button, the mono centered value, and a `+` button; the ends dim and disable at `min`/`max`. The sanctioned `±` quantity input (use it instead of two `Button`s, per the `Button` SDD).

Both are the *only* sanctioned forms of their pattern (§9).

## 2. API contract

### `Stepper`

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `steps` | `Step[]` (`{ label: string }`) | Account/Profile/Goals/Done | ✓ | ✓ | ordered; each a numbered node + label |
| `current` | `number` | `1` | ✓ | ✓ | 0-based active index; clamped to `[0, steps.length-1]` |
| `complete` | `boolean` | `false` | ✓ | ✓ | when true, the **current** node (and all before it) read **done** (mint check) — the whole rail shows finished (onboarding "Complete") |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web) · `ViewProps` (native) | — | ✓ | ✓ | spreads to the rail root |

- **Web:** `forwardRef<HTMLDivElement>`; renders `<div className="lk-step">` with `Fragment`-joined nodes + lines.
- **Native:** plain function (`View`); nodes are `LinearGradient` (done/current) or `View` (future); lines are `LinearGradient` (filled) or `View` (faint).

### `NumberStepper`

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `number` | `3` | ✓ | ✓ | clamped to `[min, max]` |
| `min` | `number` | `0` | ✓ | ✓ | floor; `−` disables at `min` |
| `max` | `number` | `99` | ✓ | ✓ | ceiling; `+` disables at `max` |
| `step` | `number` | `1` | ✓ | ✓ | increment per press |
| `onChange` | `(value: number) => void` | — | ✓ | ✓ | fires with the clamped next value; no-op if unchanged |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` minus `onChange` (web) · `ViewProps` minus `onChange` (native) | — | ✓ | ✓ | spreads to the pill |

- **Web:** `forwardRef<HTMLDivElement>`; `−`/`+` are `<button type="button">`.
- **Native:** plain function; `−`/`+` are `Pressable`.

## 3. Visual spec (tokens — never hardcode)

**Stepper node** (`.lk-step-node` / native `styles.node`, web `30×30` / native `30×30`, round):

| State | Background | Border | Glyph color | Glow |
| --- | --- | --- | --- | --- |
| future | `--glass-2` / `colors.glass2` | `1px --border-2` / `colors.border2` | `--text-faint` / `colors.textFaint` | none |
| current | `--grad-cta` / `gradients.cta` | transparent | `--bg-1` / `colors.bg1` | `--glow-accent` / `nativeShadows.glowAccent` |
| done | `--grad-mint` / `gradients.mint` | transparent | `--bg-1` / `colors.bg1` (check) | `--glow-mint` / `nativeShadows.glowMint` |

- **Node number font:** `--font-mono` / `fonts.mono`, `12px`, weight `600`. Done node shows `Icon name="check" size={14}`.
- **Label** (`.lk-step-label`): `--font-ui` / `fonts.ui`, `11px`; future `--text-faint`, done `--text-dim`, current `--text` weight `600`.
- **Connecting line** (`.lk-step-line`): `2px`, `min-width 18px`, `margin-top 14px`; faint `--border` / `colors.border`; filled `linear-gradient(90deg, --accent, --accent-2)` / native `[colors.accent, colors.accent2]` for `i <= current`.
- **Overflow (native):** each step cell is `flexShrink: 1` / `minWidth: 30` and the label ellipsizes (`numberOfLines={1}`), while the flexing connectors absorb remaining space — a width-constrained rail shrinks + truncates instead of overflowing (the native twin of web's fixed 30px node track + flexing `.lk-step-line`).

**NumberStepper** (`.lk-numstep` / native `styles.numstep`):

| Aspect | Value |
| --- | --- |
| Pill | `padding 3px`, `1px --border-2` / `colors.border2`, radius `--r-pill` / `radii.pill`, bg `--glass-2` / `colors.glass2` |
| `−`/`+` button | `30×30` round; `--font-display` / `fonts.display`, `18px`, weight `600`, `--text-dim` |
| Button hover (web) | text `--text`, bg `--glass` |
| Button disabled | `opacity 0.35`, `--text-faint` |
| Value | `--font-mono` / `fonts.mono`, `14px`, weight `600`, `--text`, `min-width 36px`, tabular-nums |

## 4. States

| Component | State | Web | Native |
| --- | --- | --- | --- |
| Stepper | future / current / done | `.is-future` / `.is-current` / `.is-done` (§3) | `nodeFuture` / cta gradient / mint gradient |
| Stepper | line filled | `.is-filled` accent→accent-2 | filled `LinearGradient` for `i <= active` |
| Stepper | complete → final node checked | current node renders `.is-done` (mint check), not `.is-current`; whole rail done | current node renders mint gradient + check, not cta number |
| NumberStepper | rest | `.lk-numstep-btn` | `styles.btn` |
| NumberStepper | hover (web) | text `--text`, bg `--glass` | n/a |
| NumberStepper | disabled (at min/max) | `:disabled` opacity .35, `--text-faint` | `btnLabelDisabled` opacity .35; `disabled`/`accessibilityState` |

- **Stepper** has no per-node interaction (display-only). **NumberStepper** is interactive but has no hover on native (press only).

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped impl.** Both `Stepper` and `NumberStepper` share identical props, the same node/line/pill sizing, the same mint-done / accent-current / faint-future treatment, the same clamps, the same `complete` collapse (current node → done) logic, and the same disabled-at-ends logic. By-necessity differences:

- **Gradients:** web fills nodes/lines via CSS `--grad-cta`/`--grad-mint`/`linear-gradient(--accent,--accent-2)`; native uses `expo-linear-gradient` (`gradients.cta`/`gradients.mint`/`[accent, accent2]`). Same look, no native animation.
- **Hover:** web `NumberStepper` buttons have a hover (`--glass`); native uses press feedback. Not blocking.
- **Glow on nodes:** web box-shadow `--glow-accent`/`--glow-mint` vs native `nativeShadows.glowAccent`/`glowMint`. Equivalent.
- **Substrate:** `<div>`/`<button>` + CSS vs `View`/`Pressable` + `LinearGradient`.

No capability gap blocks use — both render equivalent steppers.

## 6. Composition & usage

- **`Stepper`:** the progress header of a multi-step flow (onboarding, checkout). Drive `current` from the flow's step index.
- **`NumberStepper`:** quantity inputs (sets/reps, item counts) — the sanctioned `±` control (don't use two `Button`s, per the Button SDD §6).
- **Composes:** `Icon` (the done check).

```tsx
// web
<Stepper steps={[{ label: 'Account' }, { label: 'Profile' }, { label: 'Goals' }, { label: 'Done' }]} current={step} />
<Stepper current={3} complete />  {/* onboarding Complete — all 4 nodes checked */}
<NumberStepper value={reps} min={1} max={50} onChange={setReps} />

// native
<Stepper steps={steps} current={step} />
<NumberStepper value={reps} min={1} max={50} onChange={setReps} />
```

## 7. Accessibility

- **Stepper:** display-only; nodes/labels convey progress visually. Web nodes are `aria-hidden` decorations; the consumer should expose flow progress textually (e.g. "Step 2 of 4") near the rail. Native renders plain `Text`/`View`.
- **NumberStepper:** web `−`/`+` are real `<button>`s with `aria-label="Decrease"/"Increase"`; the value is `aria-live="polite"` so changes are announced; ends use the native `disabled` attribute. Native mirrors this — `accessibilityRole="button"` + `accessibilityLabel`, `accessibilityState={{ disabled }}`, value `accessibilityLiveRegion="polite"`.
- **Hit target:** `30×30` `±` buttons — acceptable for desktop; on touch-dense native screens consider surrounding spacing.
- **Contrast:** node glyphs use `--bg-1` on bright gradients (dark-on-bright); value `--text` clears minimums.

## 8. Usage rules — Do / Don't

**Do**
- Use `Stepper` for multi-step flow progress; pass a 0-based `current`.
- Use `NumberStepper` for every `±` quantity input.
- Keep both controlled (owner holds `current` / `value`).
- Set sensible `min`/`max`/`step` on `NumberStepper`.

**Don't**
- ✗ Don't hand-roll a numbered progress rail or a `±` quantity widget — use these primitives.
- ✗ Don't use two `Button`s for a quantity control — use `NumberStepper`.
- ✗ Don't make `Stepper` nodes clickable (it's display-only); drive `current` from flow state.
- ✗ Don't hardcode the node gradients, glow, accent line, or pill colors — they come from `@lockin90/tokens`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom step rail (mint-done / accent-current dots) or a `−value+` pill is a **parity violation** — it diverges web↔native and breaks on token renames; the `grad-cta`/`grad-mint` fills + glows are owned by the kit.
- **New need → add to BOTH platforms.** Need vertical steps, clickable nodes, or a long-press repeat on `NumberStepper`? Add it on web AND native (same prop, same tokens) — never a one-off.
- **Tokens only.** Node fills (`--grad-cta`/`--grad-mint`), the accent line, glows, pill bg, and mono value come from tokens; never literals.
- **Parity gate.** Before shipping a flow or a quantity input, confirm the web phone-width and native renders match (same node states, same line fill, same disabled ends).
