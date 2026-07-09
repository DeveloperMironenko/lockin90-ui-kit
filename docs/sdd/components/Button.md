# SDD — `Button` (+ `FAB` cross-ref)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Button.tsx` · `packages/ui-native/src/components/Button.tsx` ·
> web CSS `packages/ui/src/styles/primitives.css` (`.lk-btn*`).
> **Exports:** `Button`, type `ButtonVariant`, type `ButtonTone`, type `ButtonProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; one platform-shaped prop (web `children` ↔ native `title`).
> **Stories:** `packages/ui/src/stories/Button.stories.tsx` · `packages/ui-native/src/stories/Button.stories.tsx`.

---

## 1. Overview

The primary **pill action button** of the kit. Three variants:

- `default` — glass surface, hairline border. The neutral/secondary action.
- `primary` — the **animated energy-gradient CTA** (`grad-cta`, violet→cyan), glow shadow, slow 6s gradient drift on web. The single most-important action on a surface.
- `ghost` — transparent, dimmed label. Tertiary / inline action.
- `sso` (web only) — full-width rounded-square social sign-in button (see §3).

An orthogonal **`tone="danger"`** flag composes with any variant for **destructive actions** (delete / remove / revoke), using the `--bad` status token:

- `tone="danger"` on the `default` variant → a **solid `--bad` fill** (the primary destructive action, dark-on-bright label like `primary`).
- `tone="danger"` on `ghost` → a **red-tinted transparent** button (the account "danger zone" delete): `--bad` @10% fill, `--bad` @42% border, `--bad` label.

It is intentionally the *only* sanctioned way to render a button-shaped action in any LockIn90 app; the `primary` variant is the *only* sanctioned gradient CTA, and `tone="danger"` the *only* sanctioned destructive treatment. Hand-rolling any of these is a parity/maintenance violation (see §9).

`leading` renders an optional node before the label (e.g. an SSO brand logo, a `+` icon); `trailing` renders one after the label (e.g. a trailing-arrow CTA) — both auto-spaced by the row's `gap: 9` and symmetric in behavior.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | web `'default' \| 'primary' \| 'ghost' \| 'sso'` · native `'default' \| 'primary' \| 'ghost'` | `'default'` | ✓ | ✓ | `sso` is web-only (2-up social grid) |
| `tone` | `'danger'` | — | ✓ | ✓ | destructive; **composes with `variant`** — solid `--bad` on `default`, red-tinted on `ghost`. Emits `.lk-btn--tone-danger` |
| `size` | `'sm' \| 'md'` | `'md'` | ✓ | ✓ | `sm` = tighter padding + 13px label |
| `leading` | `ReactNode` | — | ✓ | ✓ | icon/node before the label |
| `trailing` | `ReactNode` | — | ✓ | ✓ | icon/node after the label — symmetric with `leading` (e.g. a trailing arrow) |
| **label** | — | — | `children` | `title: string` | **platform-shaped** — web takes children, native takes a `title` string |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `ButtonHTMLAttributes` (web) / `PressableProps` (native) | — | ✓ | ✓ | `onClick`/`onPress`, `disabled`, `aria-*`/`accessibilityLabel`, etc. |

- **Web:** `forwardRef<HTMLButtonElement>`; `type` defaults to `'button'` (not `'submit'`) — guards against accidental form submits.
- **Native:** `Omit<PressableProps, 'children' | 'style'>` + explicit `title`/`style` — `children` is reserved (native composes its own label `Text`).

## 3. Visual spec (tokens — never hardcode)

| Aspect | `default` | `primary` | `ghost` |
| --- | --- | --- | --- |
| Background | `--glass-2` / `colors.glass2` | `--grad-cta` / `gradients.cta` | transparent |
| Border | `1px --border-2` / `colors.border2` | none | `1px --border` / `colors.border` |
| Text | `--text` / `colors.text` | `#0A0A12` (dark-on-bright, both platforms) | `--text-dim` / `colors.textDim` |
| Shadow | none | `--glow-accent` / `nativeShadows.glowAccent` | none |
| Radius | `--r-pill` / `radii.pill` (999) | same | same |
| Font | `--font-ui` / `fonts.ui`, 600 | same | same |

- **Padding:** `md` = `12px / 20px`; `sm` = `8px / 14px` (web `.lk-btn-sm`, native `padSm`). Label: `md` 14px, `sm` 13px.
- **Gap (leading/trailing↔label):** `9px` both platforms. Web auto-sizes any slot `svg` (leading or trailing) to 16px (17px on primary, 14px on sm) via the shared `.lk-btn svg` rule — no per-slot class needed.
- **Web-only motion:** `primary` runs `@keyframes lk-btn-flow` (6s gradient-position drift); hover `translateY(-2px)`; active `scale(.98)`. Native mirrors press feedback via `pressed` (opacity .85 + `scale .98`).
- **`tone="danger"`** (composes with variant; token `--bad` / `colors.bad`):

  | Aspect | solid danger (`default` + tone) | ghost danger (`ghost` + tone) |
  | --- | --- | --- |
  | Background | `--bad` / `colors.bad` | `--bad` @10% (`color-mix …10% transparent` web · `rgba(255,77,109,.10)` native) |
  | Border | none | `1px` `--bad` @42% (web `color-mix` · native `rgba(255,77,109,.42)`) |
  | Text | `#0A0A12` (dark-on-bright, like `primary`) | `--bad` / `colors.bad` |
  | Shadow | web `0 0 24px -6px` `--bad` @55% · native `shadowColor: colors.bad` | none |

  The `rgba(255,77,109,…)` alpha tints are the sanctioned paired literal for `--bad` on native (same pattern as `Alert`/`Badge`/`Chip` danger).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | base `.lk-btn` | base View/LinearGradient |
| Hover | `translateY(-2px)`; primary glow intensifies to `0 0 56px rgba(124,92,255,.55)` | n/a (no hover) |
| Pressed / active | `:active scale(.98)` | `pressed` → opacity .85 + `scale(.98)` |
| Focus | native focus ring (`<button>`) | platform focus ring (Pressable) |
| Disabled | `:disabled` opacity .5, `cursor: not-allowed`, no transform | pass `disabled` → Pressable dims; honor in consumer |
| Loading | not built-in — compose with `Spinner` in `leading` and disable | same |

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped impl.** Identical variant union, sizes, padding, radius, colors, and the dark-on-gradient label color. Differences are substrate-only and by necessity:

- **Label prop:** web `children` vs native `title` — the one intentional API difference (RN can't cleanly forward arbitrary children into a styled gradient row while keeping the `Text` typography contract). App code still reads 1:1 (`<Button variant="primary">Save</Button>` ↔ `<Button variant="primary" title="Save" />`).
- **Gradient:** web CSS `--grad-cta` + animated `background-position`; native `expo-linear-gradient` `gradients.cta.stops`, `start {0,0}` → `end {1,1}`. No animation on native (no perf-cheap equivalent) — acceptable, documented.
- **Hover:** web-only (pointer); native has no hover state. Press feedback exists on both.
- **`tone="danger"`:** identical prop + identical intent both sides (solid `--bad` fill vs red-tinted transparent). Web tints via `color-mix(in srgb, var(--bad) …%, transparent)`; native uses the equivalent `rgba(255,77,109,…)` `--bad` alpha literal — reads 1:1.
- **`sso` variant:** web-only (native uses the dedicated `SsoButton`) — a pre-existing, documented asymmetry, unrelated to `tone`.

There is **no capability gap** that blocks use — the button is fully usable and visually equivalent on both platforms.

## 6. Composition & usage

- **Primary CTA:** one per surface. `<Button variant="primary">` (web) / `title=` (native).
- **SSO buttons:** `leading={<Icon name="google" />}` (or `apple`) — the multicolor brand logos resolve via `Icon`.
- **Trailing-arrow CTA:** `trailing={<Icon name="arrow-right" />}` — symmetric with `leading`, rendered after the label.
- **Quantity ± / steppers:** use `NumberStepper`, not two `Button`s.
- **Used by:** `ReauthDialog` (password + Google SSO step-up), auth screens, `PricingTierCard` CTA, `EmptyState` action, modals' footer actions.
- **Composition with Spinner:** for an async action, put `<Spinner size="sm" />` in `leading` and set `disabled` while pending.

- **Destructive action:** `<Button tone="danger">Delete</Button>` for the solid destructive CTA; `<Button variant="ghost" tone="danger">` for the low-emphasis "danger zone" delete (account settings).

```tsx
// web
<Button variant="primary" onClick={save}>Save changes</Button>
<Button variant="ghost" onClick={cancel}>Cancel</Button>
<Button leading={<Icon name="google" />} onClick={sso}>Continue with Google</Button>
<Button tone="danger" onClick={del}>Delete account</Button>
<Button variant="ghost" tone="danger" onClick={del}>Delete account</Button>

// native
<Button variant="primary" title="Save changes" onPress={save} />
<Button variant="ghost" title="Cancel" onPress={cancel} />
<Button leading={<Icon name="google" />} title="Continue with Google" onPress={sso} />
<Button tone="danger" title="Delete account" onPress={del} />
<Button variant="ghost" tone="danger" title="Delete account" onPress={del} />
```

## 7. Accessibility

- **Web:** real `<button>` (focusable, Enter/Space activate). `type="button"` by default — set `type="submit"` explicitly for form submits. Pass `aria-label` when the label is icon-only. Disabled via native `disabled`.
- **Native:** `Pressable` — pass `accessibilityRole="button"` and `accessibilityLabel`/`accessibilityState={{ disabled }}` via rest props for screen readers.
- **Hit target:** `md` padding yields a ≥44px height target; prefer `md` for touch. `sm` is for dense desktop/admin contexts.
- **Contrast:** primary uses `#0A0A12` on the bright gradient — meets contrast on every gradient stop (chosen deliberately over white).

## 8. Usage rules — Do / Don't

**Do**
- Use `variant="primary"` for the one most-important action on a surface.
- Use `default` for secondary, `ghost` for tertiary/inline.
- Put exactly **one** `primary` per visual group/screen.
- Use `leading`/`trailing` for icons; let the `gap` space them (don't add manual margins). Use `trailing` for forward/arrow CTAs.
- Use `tone="danger"` for destructive actions — solid (`default`) for the primary destructive CTA, `ghost` for the low-emphasis settings "danger zone" delete.
- Set `type="submit"` (web) only when the button submits a form.

**Don't**
- ✗ Don't hand-roll a gradient/pill button — use `variant="primary"`.
- ✗ Don't hardcode a red delete button or convey "destructive" with a raw red — use `tone="danger"` (`--bad`).
- ✗ Don't place more than one `primary` in the same decision context.
- ✗ Don't hardcode the gradient, radius, padding, or shadow — they come from `@lockin90/tokens`.
- ✗ Don't pass `children` on native or `title` on web (wrong-platform prop).
- ✗ Don't nest interactive elements inside a Button.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A "custom CTA" that re-creates the violet→cyan gradient + glow + pill is a **parity violation** — it will drift from the kit and break the web≡native rule. If you need a button, import `Button`.
- **New variant?** If a screen needs a button style that doesn't exist, **add a `variant` to `Button` on BOTH platforms** (same prop name, same tokens) — never a one-off local component.
- **Tokens only.** Any color/space/radius/shadow not sourced from tokens is a bug, even if it "looks the same" today — token renames (Aurora Flux) will silently break hardcoded values.
- **Parity gate.** Before shipping a screen that uses Button, confirm the web phone-width render and the native render are identical (same variant, size, leading, label).
