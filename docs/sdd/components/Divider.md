# SDD — `Divider`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Divider.tsx` · `packages/ui-native/src/components/Divider.tsx` ·
> web CSS `packages/ui/src/styles/base.css` (`.lk-hr`, `.lk-hr-grad`, `.lk-hr-labeled`/`.lk-hr-line`/`.lk-hr-label`).
> **Exports:** `Divider`, type `DividerProps`.
> **Status:** Shipped. **Parity:** ✅ identical — same API & visuals; both the `gradient` fade and the `label` (centered-label) variants share the same prop API on BOTH platforms.
> **Stories:** `packages/ui/src/stories/Divider.stories.tsx` · `packages/ui-native/src/stories/Divider.stories.tsx`.

---

## 1. Overview

The kit's **hairline rule** — a single 1px separator line. Three visual forms:

- **default** — a flat 1px line in `--border` / `colors.border`. The neutral section/list separator.
- **`gradient`** — a 1px rule that **fades to transparent at both ends** (`transparent → --border-2 → transparent`). Used to separate hero/marketing sections where a hard edge would read too heavy.
- **`label`** — a centered caption flanked by two hairlines (`hairline · label · hairline`). The **"or continue with"** pattern used between an email/password form and the `SsoButton` row on auth screens.

It is the *only* sanctioned divider primitive; any other `<hr>` / 1px `View` is a tokens/parity violation (see §9). It carries no spacing of its own — margins are the consumer's job. It is **horizontal only** — there is no vertical orientation prop on either platform (add one to BOTH if needed, §9).

`label` and `gradient` are independent props; when `label` is set the row renders as the labeled variant (the plain/gradient `<hr>` form applies only when `label` is absent).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `gradient` | `boolean` | `false` | ✓ | ✓ | fade-to-transparent rule (`--border-2`); else a flat `--border` line (ignored when `label` is set) |
| `label` | `string` | — | ✓ | ✓ | centered caption between two hairlines (the "or continue with" form) |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only — lets the consumer set margins/length |
| _rest_ | `HTMLAttributes<HTMLHRElement>` (web) | — | ✓ | — | spreads to the `<hr>` (plain/gradient) or the wrapping `<div role="separator">` (labeled) |

- **Web:** without `label`, renders a real `<hr className="lk-hr">` (+ `lk-hr-grad` when `gradient`, classes merged via `cn`). With `label`, renders a `<div className="lk-hr-labeled" role="separator" aria-label={label}>` wrapping two `.lk-hr-line` spans around a `.lk-hr-label`. Plain function component, no `forwardRef`; `DividerProps extends HTMLAttributes<HTMLHRElement>`, so `<hr>`/aria attributes pass through (cast onto the `<div>` in the labeled branch).
- **Native:** renders a 1px `View` (flat) or an `expo-linear-gradient` `LinearGradient` (gradient); the labeled form is a flex row of two 1px `View` hairlines flanking a centered mono `Text`. Same `label` prop.

## 3. Visual spec (tokens — never hardcode)

| Aspect | default | `gradient` |
| --- | --- | --- |
| Height | `1px` | `1px` |
| Fill | `--border` / `colors.border` | `linear-gradient(90deg, transparent, --border-2, transparent)` / native `LinearGradient ['transparent', colors.border2, 'transparent']` |
| Border | none (`border: 0`) | none |
| Margin | `0` (web `.lk-hr`) — consumer adds spacing | none — consumer adds via `style` |

- **Web:** `.lk-hr { height: 1px; border: 0; background: var(--border); margin: 0; }`; `.lk-hr-grad` swaps the background to the horizontal fade gradient over `--border-2`.
- **Native gradient:** `start {0,0}` → `end {1,0}` (left→right) so the fade runs horizontally, matching the web `90deg`.
- **Labeled** (`label` set): a flex row (`gap 12px`, `align-items: center`) of two flexing hairlines (`.lk-hr-line` — `flex:1`, `1px`, `--border`) around a centered caption (`.lk-hr-label` — `--font-mono`, 11px/500, `.14em` uppercase tracking, `--text-faint`). Native mirrors this with two 1px `View`s flanking a mono `Text`.

## 4. States

A divider is **static** — it has no interactive states (no hover, press, focus, disabled, loading). The only axes are the `gradient` boolean and the presence of `label` (§3). It is decorative by nature: the web `<hr>` / labeled `<div role="separator">` are semantic separators but not focusable, and the native `View`s carry no interactive role.

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-hr` — flat `--border` line | `View` 1px `colors.border` |
| Gradient | `.lk-hr-grad` — fade over `--border-2` | `LinearGradient` `transparent → border2 → transparent` |
| Labeled | `.lk-hr-labeled` — hairline · `.lk-hr-label` · hairline | row of two 1px `View`s + centered mono `Text` |

## 5. Web ↔ native parity

**Verdict: ✅ identical.** Same 1px height, same default `--border` fill, same fade-to-transparent `gradient` variant over `--border-2`, and the same `label` (centered-caption) variant — all sharing one prop API. The `gradient` fade and the `label` form are both implemented on BOTH platforms. Differences are substrate only:

- **Substrate:** web `<hr>` / `<div>` + CSS vs native `View` / `LinearGradient` / `Text`. No visual difference.
- **Spacing:** web `.lk-hr` zeroes its margin; native has no implicit margin — both leave spacing to the consumer, so they read 1:1.
- **Labeled caption:** same mono uppercase `--text-faint` caption flanked by flexing hairlines on both.

There is **no capability gap**.

## 6. Composition & usage

- **Section separators:** between stacked cards, settings groups, list sections.
- **Gradient form:** marketing/hero section breaks, footer tops — anywhere a hard hairline is too harsh.
- **Labeled form:** auth screens — between the email/password form and the `SsoButton` row ("or continue with").
- **Note:** `ListRow` draws its OWN inter-row hairline (`.lk-listrow + .lk-listrow` / native `divider` prop) — don't stack `Divider`s between `ListRow`s.

```tsx
// web
<Divider />
<Divider gradient />
<Divider label="or continue with" />

// native
<Divider style={{ marginVertical: 16 }} />
<Divider gradient style={{ marginVertical: 24 }} />
<Divider label="or continue with" style={{ marginVertical: 20 }} />
```

## 7. Accessibility

- **Web:** the plain/gradient `<hr>` is a semantic separator (implicit `role="separator"`); the labeled form is a `<div role="separator" aria-label={label}>` so the caption is announced as the separator's name (the flanking hairlines are `aria-hidden`). Decorative use needs no extra aria.
- **Native:** plain `View`s with no interactive role — correct for a decorative rule; the labeled caption `Text` is readable in order.
- **Contrast:** the line is intentionally low-contrast (`--border` ≈ `rgba(255,255,255,.09)`); it is decoration, exempt from text-contrast minimums. The labeled caption is faint by design (a low-emphasis section marker, not body content).

## 8. Usage rules — Do / Don't

**Do**
- Use `Divider` for every 1px separator.
- Use `gradient` only where a faded edge is wanted (hero/marketing breaks).
- Use `label` for the "or continue with" section marker on auth screens.
- Add spacing via the consumer's layout (`margin` / `style`), not by wrapping.

**Don't**
- ✗ Don't hand-roll a 1px `<hr>` / `View` with a hardcoded color — use `Divider`.
- ✗ Don't hand-roll a "line · label · line" row — pass `label` to `Divider`.
- ✗ Don't hardcode `rgba(255,255,255,.09)` or `--border-2` — they come from `@lockin90/tokens`.
- ✗ Don't use a `Divider` between `ListRow`s — they self-separate.
- ✗ Don't rely on `Divider` for layout width/length semantics; it's a hairline, not a spacer.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A local `<hr style={{ background: '#1c1c1c' }}>` or a 1px `View` with a literal border color is a **tokens + parity violation** — it will drift on the next token rename (Aurora Flux).
- **New need → add to BOTH platforms.** If a screen needs a vertical rule or a thicker divider, add a prop (e.g. `orientation`/`weight`) to `Divider` on web AND native with the same name + tokens — never a one-off.
- **Tokens only.** The fill is `--border` / `--border-2`; never a literal.
- **Parity gate.** Both forms render identically at phone width and on native — confirm before shipping a screen that relies on the gradient fade.
