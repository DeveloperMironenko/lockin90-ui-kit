# SDD — `IconButton`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native).
> **Source:** `packages/ui/src/components/IconButton.tsx` · `packages/ui-native/src/components/IconButton.tsx` ·
> web CSS `packages/ui/src/styles/primitives.css` (`.lk-icon-btn*`).
> **Exports:** `IconButton`, type `IconButtonProps`.
> **Status:** Shipped (web 2026-11-10; native the PR after). **Parity:** 🟡 same API and look; the frosted glass needs
> the optional `expo-blur` peer on native (as `Card blur`), else the translucent fill alone.
> **Stories:** `packages/ui/src/stories/IconButton.stories.tsx` · `packages/ui-native/src/stories/IconButton.stories.tsx`.

---

## 1. Overview

A square button showing **one kit icon and no text**: an action whose icon says it in a tight spot,
such as the camera button in the corner of a profile picture (LockIn90 1.33, owner 2026-11-09). The kit
had no icon-only button: `Button` always shows a label, and `Chip` / `ChoiceChip` are choices, not
actions.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `label` | `string` | — (required) | ✓ | ✓ | the spoken name (`aria-label` / `accessibilityLabel`); it can't be overridden (`aria-label`, `aria-labelledby`, `role` are not props) |
| `icon` | `IconName` | — (required) | ✓ | ✓ | the kit icon, drawn by the button at its size (18 / 16 px) in `--text` / `colors.text`, so both platforms match |
| `size` | `'sm' \| 'md'` | `'md'` | ✓ | ✓ | a 32 / 40 px square |
| _rest_ | `ButtonHTMLAttributes` (web, minus `children`) / `PressableProps` (native) | — | ✓ | ✓ | `onClick` / `onPress`, `disabled`, `testID`, …; native `style` goes on the touch target (for layout: `position`, margins) |

## 3. Visual spec (tokens — never hardcode)

Button's default surface: `--glass-2` / `colors.glass2`, a 1px `--border-2` / `colors.border2` border,
the icon in `--text` / `colors.text`. **A control's corners**, `--r-sm` / `radii.sm` (10), per
`CONVENTIONS.md` "one shape, one line": it is a box you press, not a shape like `Avatar`. Frosted
(`backdrop-filter: blur(12px)` on web, `expo-blur` on native), so it stays readable over a photo.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Hover | `translateY(-1px)` (pointer devices) | n/a |
| Pressed | `scale(.96)` | opacity .85 + `scale(.96)` |
| Focus | the kit's ring (`0 0 0 3px` accent at 45%), keyboard only | the platform's |
| Disabled | opacity .5, `cursor: not-allowed`, no transform | opacity .5, presses ignored (as `Button`, 2026-11-09) |

## 5. Web ↔ native parity

**🟡 same API and look.** The icon is the kit `Icon` on both, sized and coloured by the button. The one
gap: native's blur needs the optional `expo-blur` peer (as `Card blur`); without it, the translucent
fill alone. The touch target is 44 px on both: web extends `sm` with a `::before` inset; native makes
the `Pressable` itself at least 44 × 44 with the square centred in it (no `hitSlop`, which Android
ignores outside the parent's bounds, where a corner button sits).

## 6. Composition & usage

```tsx
// web
<IconButton label={t('account.photo.change')} icon="camera" onClick={openPhotoMenu} />
// native: positioned through `style`, on the touch target
<IconButton label={t('account.photo.change')} icon="camera" onPress={openPhotoSheet}
  testID="photo-change" style={{ position: 'absolute', top: 8, right: 8 }} />
```

## 7. Accessibility

A real `<button type="button">` with `aria-label`; native a `Pressable` with `accessibilityRole="button"`
and `accessibilityLabel`, both required by the type and set after the rest props, so nothing passed
can replace them. The icon is hidden from screen readers. 44 px touch target on both.

## 8. Usage rules — Do / Don't

- **Do** use it where the icon alone is clear (camera, close, more) and space is tight.
- **Don't** use it where a word helps: a `Button` with `leading` and a label instead.
- **Don't** add text, a badge or a second icon.

## 9. Anti-patterns & lookalike ban

A `Pressable` / `<button>` with an `Icon` styled by hand in an app is a lookalike (`Button.md` §9): use
this. A round version is a different shape: it needs the owner's call in `CONVENTIONS.md` first.
