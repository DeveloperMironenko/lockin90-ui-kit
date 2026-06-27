# SDD — `Alert`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Alert.tsx` · `packages/ui-native/src/components/Alert.tsx` ·
> web CSS `packages/ui/src/styles/components/alert.css` (`.lk-alert*`).
> **Exports:** `Alert`, type `AlertTone`, type `AlertProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; native draws its own inline svg glyphs (web uses `Icon` for info/check).
> **Stories:** `packages/ui/src/stories/Alert.stories.tsx` · `packages/ui-native/src/stories/Alert.stories.tsx`.

---

## 1. Overview

A **tinted callout box** — info / success / warn / danger banner. A tone-tinted background + 1px tone border + a 3px left accent bar, with a tone-colored leading glyph, a bold `font-display` title, a dim `font-ui` body, and an optional top-right `×` dismiss button.

It's the kit's single sanctioned inline-message surface (form errors, success confirmations, warnings). `AlertTone` (`'info' | 'success' | 'warn' | 'danger'`) drives both the accent color and the default leading icon.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `tone` | `'info' \| 'success' \| 'warn' \| 'danger'` | `'info'` | ✓ | ✓ | accent color + default icon |
| `title` | `string` | — | ✓ | ✓ | bold heading (`font-display`) |
| `children` | `ReactNode` | — | ✓ | ✓ | body text under the title |
| `icon` | `ReactNode` | tone default | ✓ | ✓ | override the leading glyph |
| `onDismiss` | `() => void` | — | ✓ | ✓ | when set, renders the `×` close button |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `Omit<HTMLAttributes, 'title'>` (web) / `Omit<ViewProps, 'children'>` (native) | — | ✓ | ✓ | spread onto root |

- **Web:** `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` (so `title` is the heading prop, not the HTML tooltip attr); root has `role="status"`.
- **Native:** `Omit<ViewProps, 'children'>` (so `children` is the body prop). A string `children` is wrapped in a styled `Text`; a non-string node renders as-is.
- **Default icons** (`DEFAULT_ICON` / `defaultIcon`): `info`→info "i", `success`→check, `warn`/`danger`→warning triangle.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`alert.css`) | Native (`StyleSheet`) |
| --- | --- | --- |
| Box | `padding: 14px 15px 14px 17px`, `--r-sm`, `border 1px`, `bg --glass-2` + tone tint, `overflow: hidden` | `paddingTop 14 / right 15 / bottom 14 / left 17`, `radii.sm`, `border 1px`, tone bg |
| Left accent bar | `::before` `width: 3px`, `--lk-alert-c` (tone color) | absolute `<View>` `width: 3`, tone `c` |
| Layout | flex row, `align-items: flex-start`, `gap: 12px` | row, `flex-start`, `gap: 12` |
| Icon | `--lk-alert-c`, `margin-top: 1px` | tone `c`, `marginTop: 1` |
| Title | `--font-display`, `14px`, 700, `--text` | `fonts.display`, `14`, `'700'`, `colors.text` |
| Body | `--font-ui`, `13px`, `line-height 1.5`, `--text-dim` | `fonts.ui`, `13`, `lineHeight 19`, `colors.textDim` |
| Close `×` | `26×26`, `--r-sm`, `--text-faint`; hover → `--text` + `--glass-2` | `26×26`, `radii.sm`, `colors.textFaint`, `hitSlop 6` |

**Tone tints** (identical raw values both platforms):

| Tone | Accent (`--lk-alert-c`) | Background | Border |
| --- | --- | --- | --- |
| `info` | `--accent` `colors.accent` | `rgba(124,92,255,.08)` | `rgba(124,92,255,.3)` |
| `success` | `--mint` `colors.mint` | `rgba(52,245,197,.08)` | `rgba(52,245,197,.3)` |
| `warn` | `--zone-mid` `colors.zoneMid` | `rgba(255,176,32,.08)` | `rgba(255,176,32,.3)` |
| `danger` | `--zone-low` `colors.zoneLow` | `rgba(255,77,109,.08)` | `rgba(255,77,109,.3)` |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | base `.lk-alert` + tone class | base View + tone bg/border |
| With title only / body only | both optional; either may render alone | same (null-guarded) |
| Dismissible | `onDismiss` → `.lk-alert-close` `×` | `onDismiss` → `Pressable` `×` |
| Close hover | `.lk-alert-close:hover` → `--text` + `--glass-2` | n/a (press only) |
| Focus | native `<button>` focus on close | Pressable focus |

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, platform-shaped glyphs.** Identical tone union, identical tint/border rgba values, identical 3px accent bar, title/body typography, and dismiss affordance. Differences are substrate-only:

- **Icons:** web's `DEFAULT_ICON` uses the kit `Icon` component for `info`/`success` (and a local warning-triangle svg for `warn`/`danger`); native hand-draws **all** glyphs as inline `react-native-svg` (`InfoIcon`/`CheckIcon`/`WarningIcon`) since it can't share the web `Icon` DOM. The warning triangle path is identical (`M12 4 2.5 20.5h19z`).
- **Accent bar:** web is a CSS `::before` pseudo-element; native is an absolute `<View>` — same 3px bar.
- **Semantics:** web root carries `role="status"`; native conveys via content (close button has `accessibilityRole="button"`).
- **Close hover:** web-only; native uses press + `hitSlop`.

No capability gap — the alert is visually equivalent on both.

## 6. Composition & usage

- **Used by:** form error/success banners, settings warnings, destructive-action notices, page-level info callouts.
- **Composes:** web uses `Icon` for default info/check glyph; otherwise self-contained.
- **vs Toast:** `Alert` is an **inline, persistent** callout; `Toast` is a transient floating notification. Don't substitute one for the other.

```tsx
// web
<Alert tone="danger" title="Payment failed" onDismiss={dismiss}>
  Your card was declined — update it to keep Pro.
</Alert>
<Alert tone="success" title="Saved" />

// native
<Alert tone="danger" title="Payment failed" onDismiss={dismiss}>
  Your card was declined — update it to keep Pro.
</Alert>
<Alert tone="success" title="Saved" />
```

## 7. Accessibility

- **Web:** root `role="status"` (polite live region). Close button is a real `<button>` with `aria-label="Dismiss"`; leading icon is `aria-hidden`.
- **Native:** close `Pressable` has `accessibilityRole="button"` + `accessibilityLabel="Dismiss"` + `hitSlop={6}` for a comfortable tap target.
- **Tone is not the only signal** — the `title`/body text must carry the meaning (don't rely on color alone for colorblind users).

## 8. Usage rules — Do / Don't

**Do**
- Pick `tone` by meaning: `info` neutral, `success` confirmation, `warn` caution, `danger` error/destructive.
- Provide a `title` for scannability; use `children` for the explanation.
- Add `onDismiss` only when the alert is genuinely dismissible.
- Override `icon` only for a domain-specific glyph; otherwise let the tone default stand.

**Don't**
- ✗ Don't use `Alert` for transient notifications — that's `Toast`.
- ✗ Don't hardcode the tone rgba tints, accent bar, or radius — they're tokenized.
- ✗ Don't pass `title` expecting an HTML tooltip (web omits the native `title` attr).
- ✗ Don't stack many alerts — collapse to one with the highest-severity tone.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled tinted callout with a left bar + icon is a parity violation — import `Alert`.
- **New tone → both platforms.** Add to `AlertTone` + the `TONE` maps on web **and** native (same rgba, same token), never a local one-off.
- **Tokens only.** Accent colors (`--accent`/`--mint`/`--zone-mid`/`--zone-low`), `--glass-2`, `--r-sm` come from `@lockin90/tokens`.
- **Parity gate.** Before shipping a screen with an Alert, diff web phone-width vs native: same tone color, same title/body, same dismiss presence.
