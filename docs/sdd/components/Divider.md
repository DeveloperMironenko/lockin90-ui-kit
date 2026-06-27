# SDD — `Divider`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Divider.tsx` · `packages/ui-native/src/components/Divider.tsx` ·
> web CSS `packages/ui/src/styles/base.css` (`.lk-hr`, `.lk-hr-grad`).
> **Exports:** `Divider`, type `DividerProps`.
> **Status:** Shipped. **Parity:** ✅ identical — same API & visuals; the `gradient` fade variant is implemented on BOTH platforms.
> **Stories:** `packages/ui/src/stories/Divider.stories.tsx` · `packages/ui-native/src/stories/Divider.stories.tsx`.

---

## 1. Overview

The kit's **hairline rule** — a single 1px separator line. Two visual forms:

- **default** — a flat 1px line in `--border` / `colors.border`. The neutral section/list separator.
- **`gradient`** — a 1px rule that **fades to transparent at both ends** (`transparent → --border-2 → transparent`). Used to separate hero/marketing sections where a hard edge would read too heavy.

It is the *only* sanctioned divider primitive; any other `<hr>` / 1px `View` is a tokens/parity violation (see §9). It carries no spacing of its own — margins are the consumer's job. It is **horizontal only** — there is no vertical orientation prop on either platform (add one to BOTH if needed, §9).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `gradient` | `boolean` | `false` | ✓ | ✓ | fade-to-transparent rule (`--border-2`); else a flat `--border` line |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only — lets the consumer set margins/length |
| _rest_ | `HTMLAttributes<HTMLHRElement>` (web) | — | ✓ | — | spreads to the `<hr>` (e.g. `aria-*`, `id`) |

- **Web:** renders a real `<hr className="lk-hr">` (+ `lk-hr-grad` when `gradient`, classes merged via `cn`). Plain function component, no `forwardRef`; `DividerProps extends HTMLAttributes<HTMLHRElement>`, so any `<hr>` attribute (`id`, `aria-*`, `role`) passes through.
- **Native:** renders a 1px `View` (flat) or an `expo-linear-gradient` `LinearGradient` (gradient). No `...rest` spread — the interface is only `gradient` + `style` (use `style` for length/margins).

## 3. Visual spec (tokens — never hardcode)

| Aspect | default | `gradient` |
| --- | --- | --- |
| Height | `1px` | `1px` |
| Fill | `--border` / `colors.border` | `linear-gradient(90deg, transparent, --border-2, transparent)` / native `LinearGradient ['transparent', colors.border2, 'transparent']` |
| Border | none (`border: 0`) | none |
| Margin | `0` (web `.lk-hr`) — consumer adds spacing | none — consumer adds via `style` |

- **Web:** `.lk-hr { height: 1px; border: 0; background: var(--border); margin: 0; }`; `.lk-hr-grad` swaps the background to the horizontal fade gradient over `--border-2`.
- **Native gradient:** `start {0,0}` → `end {1,0}` (left→right) so the fade runs horizontally, matching the web `90deg`.

## 4. States

A divider is **static** — it has no interactive states (no hover, press, focus, disabled, loading). The only axis is the `gradient` boolean (§3). It is decorative by nature: the web `<hr>` is a semantic separator but not focusable, and the native `View` carries no accessibility role.

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-hr` — flat `--border` line | `View` 1px `colors.border` |
| Gradient | `.lk-hr-grad` — fade over `--border-2` | `LinearGradient` `transparent → border2 → transparent` |

## 5. Web ↔ native parity

**Verdict: ✅ identical.** Same 1px height, same default `--border` fill, same fade-to-transparent `gradient` variant over `--border-2` running horizontally. The `gradient` fade — once a web-only gap — is **closed**: native draws the identical fade via `expo-linear-gradient`. Differences are substrate only:

- **Substrate:** web `<hr>` + CSS background vs native `View` / `LinearGradient`. No visual difference.
- **Spacing:** web `.lk-hr` zeroes its margin; native has no implicit margin — both leave spacing to the consumer, so they read 1:1.

There is **no capability gap**.

## 6. Composition & usage

- **Section separators:** between stacked cards, settings groups, list sections.
- **Gradient form:** marketing/hero section breaks, footer tops — anywhere a hard hairline is too harsh.
- **Note:** `ListRow` draws its OWN inter-row hairline (`.lk-listrow + .lk-listrow` / native `divider` prop) — don't stack `Divider`s between `ListRow`s.

```tsx
// web
<Divider />
<Divider gradient />

// native
<Divider style={{ marginVertical: 16 }} />
<Divider gradient style={{ marginVertical: 24 }} />
```

## 7. Accessibility

- **Web:** `<hr>` is a semantic separator (implicit `role="separator"`), announced by screen readers as a thematic break. Decorative use is fine — no extra aria needed.
- **Native:** a plain `View` with no accessibility role — correct for a decorative rule (not focusable, not announced).
- **Contrast:** the line is intentionally low-contrast (`--border` ≈ `rgba(255,255,255,.09)`); it is decoration, not content, so it is exempt from text-contrast minimums.

## 8. Usage rules — Do / Don't

**Do**
- Use `Divider` for every 1px separator.
- Use `gradient` only where a faded edge is wanted (hero/marketing breaks).
- Add spacing via the consumer's layout (`margin` / `style`), not by wrapping.

**Don't**
- ✗ Don't hand-roll a 1px `<hr>` / `View` with a hardcoded color — use `Divider`.
- ✗ Don't hardcode `rgba(255,255,255,.09)` or `--border-2` — they come from `@lockin90/tokens`.
- ✗ Don't use a `Divider` between `ListRow`s — they self-separate.
- ✗ Don't rely on `Divider` for layout width/length semantics; it's a hairline, not a spacer.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A local `<hr style={{ background: '#1c1c1c' }}>` or a 1px `View` with a literal border color is a **tokens + parity violation** — it will drift on the next token rename (Aurora Flux).
- **New need → add to BOTH platforms.** If a screen needs a vertical rule or a thicker divider, add a prop (e.g. `orientation`/`weight`) to `Divider` on web AND native with the same name + tokens — never a one-off.
- **Tokens only.** The fill is `--border` / `--border-2`; never a literal.
- **Parity gate.** Both forms render identically at phone width and on native — confirm before shipping a screen that relies on the gradient fade.
