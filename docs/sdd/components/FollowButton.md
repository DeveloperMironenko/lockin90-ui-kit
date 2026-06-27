# SDD — `FollowButton`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/FollowButton.tsx` · `packages/ui-native/src/components/FollowButton.tsx` ·
> web CSS `packages/ui/src/styles/components/followbtn.css` (`.lk-followbtn*`).
> **Exports:** `FollowButton`, type `FollowButtonProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; the hover→"Unfollow" swap is web-only (pointer affordance).
> **Stories:** `packages/ui/src/stories/FollowButton.stories.tsx` · `packages/ui-native/src/stories/FollowButton.stories.tsx`.

---

## 1. Overview

The **controlled follow/unfollow pill** for profiles and people lists. Two visual states driven by the `following` boolean:

- **Not following** — accent-tinted "＋ Follow" (violet text `#cbbcff` on a `rgba(124,92,255,.10)` fill, `rgba(124,92,255,.45)` border).
- **Following** — neutral glass/outlined "✓ Following" (`--text-dim` on `--glass` + `--border`).

It is a **controlled** component: the parent owns `following` and flips it inside `onToggle`. On web, hovering the "Following" pill swaps the label to **"Unfollow"** in the `bad` (rose) tone — a pure-CSS pointer nicety. The glyph is `plus` when not following, `check` when following.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `following` | `boolean` | _required_ | ✓ | ✓ | controlled state — drives glyph, color, label |
| `onToggle` | `() => void` | _required_ | ✓ | ✓ | fired on press; flip `following` in the parent |
| `size` | `'sm' \| 'md'` | `'md'` | ✓ | ✓ | `sm` = tighter padding + smaller glyph/label |
| `followLabel` | `string` | `'Follow'` | ✓ | ✓ | label when not following |
| `followingLabel` | `string` | `'Following'` | ✓ | ✓ | label when following |
| `disabled` | `boolean` | — | ✓ | ✓ | dims + blocks press |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `Omit<ButtonHTMLAttributes, 'onToggle'>` (web) | — | ✓ | — | spreads onto `<button>`; `type` defaults to `'button'` |

- **Web:** `forwardRef<HTMLButtonElement>`; renders a real `<button>` with `aria-pressed={following}`.
- **Native:** plain function component; renders a `Pressable` with `accessibilityState={{ selected, disabled }}`. No `...rest`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Not following | Following |
| --- | --- | --- |
| Text | `#cbbcff` (violet tint, both platforms) | `--text-dim` / `colors.textDim` |
| Border | `rgba(124,92,255,.45)` | `--border` / `colors.border` |
| Background | `rgba(124,92,255,.10)` | `--glass` / `colors.glass` |
| Glyph | `plus`, 13px (md) / 12px (sm) | `check`, same sizes |
| Radius | `--r-pill` / `radii.pill` (999) | same |
| Font | `--font-ui` / `fonts.ui`, 600, 12.5px (md) / 12px (sm) | same |

- **Padding:** `md` = `7px / 15px`; `sm` = `6px / 13px` (web `.lk-followbtn-sm`, native `padSm`). Native `md` label is `12.5px`, `sm` is `12px`.
- The violet tint `#cbbcff` / `rgba(124,92,255,…)` is the literal Aurora accent (`--accent` = `#7C5CFF`) expressed at low alpha; it appears identically as a string on both platforms.
- **Web hover (not following):** border → `--accent`, bg → `rgba(124,92,255,.18)`.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Not following | `.lk-followbtn` (accent tint) | `tone` = violet (`#cbbcff` / `.45` border / `.10` bg) |
| Following | `.lk-followbtn-following` (glass/dim) | `tone` = `textDim` / `border` / `glass` |
| Hover (following) | `:hover` → label swaps to **"Unfollow"**, color `--bad`, border `rgba(255,77,109,.40)`, bg `rgba(255,77,109,.08)` | **n/a** — no hover; label stays `followingLabel` |
| Hover (not following) | border `--accent`, bg `rgba(124,92,255,.18)` | n/a |
| Pressed | `:active` (browser) | `pressed && !disabled` → opacity .85 + `scale(.98)` |
| Disabled | `:disabled` opacity .5, `cursor: not-allowed` | `disabled` → opacity .5; press blocked |

## 5. Web ↔ native parity

**Verdict: 🟡 same API & visuals, one web-only affordance.** Identical prop contract, both states' colors/borders/backgrounds (same literal violet/glass values), glyph swap (`plus` ↔ `check`), sizes, padding, and radius. App code reads 1:1.

The one genuine difference is the **hover→"Unfollow" label swap**: web does it in pure CSS (`.lk-followbtn-following:hover .lk-followbtn-label::after { content: 'Unfollow' }` + `font-size:0` on the original) because hover is a pointer-only affordance. **Native has no hover**, so the following pill always shows `followingLabel` ("Following") and confirms intent on press instead. This is substrate-shaped, not a capability gap — the toggle is fully functional on both; native simply can't preview "Unfollow" before the tap.

## 6. Composition & usage

- **Composes:** `Icon` (`plus` / `check`). No other primitive.
- **Used by:** profile headers, follower/following lists, `LeaderboardRow` trailing actions, coach/people cards.
- **Controlled only** — always pass both `following` and `onToggle`; the component never stores its own state.

```tsx
// web
const [following, setFollowing] = useState(false);
<FollowButton following={following} onToggle={() => setFollowing(v => !v)} />
<FollowButton following size="sm" onToggle={unfollow} />

// native — identical
<FollowButton following={following} onToggle={() => setFollowing(v => !v)} />
```

## 7. Accessibility

- **Web:** real `<button>` with `aria-pressed={following}` (announces toggle state), `disabled` honored, focusable, Enter/Space activate. `type` defaults to `'button'` (won't submit forms).
- **Native:** `Pressable` with `accessibilityRole="button"` and `accessibilityState={{ selected: following, disabled }}`.
- **Label** is real text on both states (web's "Unfollow" swap is visual/hover-only; AT reads the underlying `followingLabel`).
- **Hit target:** `md` padding gives a comfortable touch target; prefer `md` on touch surfaces, `sm` for dense desktop lists.

## 8. Usage rules — Do / Don't

**Do**
- Keep it controlled: drive `following` from state and flip it in `onToggle`.
- Use `md` on touch surfaces, `sm` in dense lists/rows.
- Localize via `followLabel` / `followingLabel` rather than wrapping with custom text.

**Don't**
- ✗ Don't hand-roll a follow pill — use `FollowButton`.
- ✗ Don't try to force the "Unfollow" hover text onto native — it's a pointer affordance by design.
- ✗ Don't hardcode the violet tint or rose hover — they're accent/`bad`-derived.
- ✗ Don't leave it uncontrolled (it has no internal state — nothing will change visually).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom "Follow"/"Following" pill duplicating the accent-tint ↔ glass-outline states is a parity violation — import `FollowButton`.
- **New state/variant?** If a surface needs e.g. a "Requested" pending state, add it to `FollowButton` on **both** platforms (same prop, same tokens) — never a local fork.
- **Tokens only.** The violet/glass/`bad` colors and pill radius come from `@lockin90/tokens`; a hardcoded value is a bug even if it matches today.
- **Parity gate.** Before shipping a profile/people surface, confirm web phone-width and native render the same two states; accept that the "Unfollow" hover preview is web-only.
