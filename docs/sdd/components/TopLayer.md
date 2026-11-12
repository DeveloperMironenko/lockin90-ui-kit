# SDD — `TopLayer`

> **Package:** `@lockin90/ui-native` (native). Web: see §5.
> **Source:** `packages/ui-native/src/components/TopLayer.tsx` (with the internal `TopLayerHost` that `Sheet` and `Modal` render).
> **Exports:** `TopLayer`, type `TopLayerProps`.
> **Status:** Shipped (2026-11-11, 1.35). **Parity:** 🟡 native needs it because an RN `Modal` is a native window; web stacks by `z-index` (§5).
> **Stories:** none (it draws nothing of its own).

---

## 1. Overview

Draws its children **above everything**, including an open `Sheet` or `Modal`. Those are RN `Modal`s: a
native window over the whole page (iOS a presented view controller, Android a `Dialog`), so nothing in
the page can be drawn over them, whatever its `zIndex`. An app's toast placed in the page showed **under**
an open sheet (owner, 2026-11-11: "Units updated" behind the Physiological profile sheet).

`TopLayer` hands its children to the **top-most open** kit `Sheet` / `Modal`, which draws them as the last
child of its window (over its scrim and panel); with none open, it draws them in place. Reach for it for
toasts and other short notices that must stay visible whatever is open.

## 2. API contract

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | what to draw on top; usually an absolutely placed box holding a `Toast` |

- **Coordinates:** inside a Sheet / Modal the box it is placed in is the whole screen (the window is
  `statusBarTranslucent`); in place it is the `TopLayer`'s parent. Put it in a screen-sized parent (a
  screen's root view) so both are the same, and place the content from the safe-area top inset.
- **Touches:** the host is `pointerEvents="box-none"`: taps go through to the scrim and the panel. Give
  the content `pointerEvents="none"` unless it should take touches.
- **No provider.** One module-level store: the open hosts in the order they opened (the latest is the top)
  and what each `TopLayer` draws. A `Sheet` / `Modal` is a host while `open` (from the render that opens it
  to the render that closes it; the toast goes back to the page as the close animation starts).
- **Context:** the children render in the host's tree. Build them where the `TopLayer` is (translated
  text, values); kit primitives inside need nothing else.

## 3. Visual spec

None of its own: it adds two full-screen transparent boxes (`absoluteFill`) in the host.

## 4. States

| State | Where the children are drawn |
| --- | --- |
| No Sheet / Modal open | in place |
| One open | in its window, after the scrim and panel |
| Several open (a Modal over a Sheet) | in the one opened last; back to the one below when it closes |
| The Sheet closes while shown | back in place |

## 5. Web ↔ native parity

**Verdict: 🟡.** Native needs a layer because the page can't draw over a native window. On web a Sheet is
`position: fixed` and the Modal a portal at the end of `<body>`, both stacking by `z-index` in one
document, so an app's toast is above them when its `z-index` is higher (see the web app's toast); no
web export is needed for that.

## 6. Composition & usage

- **Hosts:** `Sheet` and `Modal` render `TopLayerHost` as the last child of their RN `Modal`; so do
  `Select`'s list, `Menu`, `Popover` and `Tooltip` (their own RN Modals; not `statusBarTranslucent`, so on
  Android their window starts under the status bar and a toast in it sits that much lower).
- **Used by:** the app's saved toast (mobile `SavedToast`).

```tsx
// native — a toast under the status bar, above any open sheet
<TopLayer>
  <View style={{ position: 'absolute', top: insets.top + 48, left: 16, right: 16, alignItems: 'center' }} pointerEvents="none">
    <Toast tone="success" filled title={t('account.updated.units')} />
  </View>
</TopLayer>
```

## 7. Accessibility

- **Kit rule:** CONVENTIONS "Accessibility" (2026-11-10) applies.
- Inside a Sheet / Modal the toast sits outside the panel, which is `accessibilityViewIsModal`, so
  VoiceOver does not move to it; announce the notice (`AccessibilityInfo.announceForAccessibility`), as
  the app's toast does. The kit `Toast` keeps its role and live region.

## 8. Usage rules — Do / Don't

**Do**
- Wrap every app toast / transient notice that may show while a Sheet or Modal is open.
- Keep the content `pointerEvents="none"` (a notice never blocks the sheet under it).

**Don't**
- ✗ Don't put dialogs or forms in it (it is for notices; use `Sheet` / `Modal`).
- ✗ Don't raise a toast with `zIndex` / `elevation` on native: it can't pass a native window.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** No app-side portals, `FullWindowOverlay` or a second RN `Modal` for a toast: a
  second window would take the touches (Android) or stack in the wrong order (iOS, a toast opened before
  the sheet). Use `TopLayer`.
- **New host → kit.** A new kit overlay built on RN `Modal` renders `TopLayerHost` as its last child.
- **Why not `FullWindowOverlay`:** react-native-screens' overlay is iOS-only (Android needs another way)
  and its view, added to the window before a sheet is presented, can end up under the sheet (reasoned, not tried); drawing inside the top window works the same
  on both platforms, with no new dependency.
