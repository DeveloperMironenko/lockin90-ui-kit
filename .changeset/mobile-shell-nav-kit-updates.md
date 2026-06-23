---
"@lockin90/ui": minor
"@lockin90/ui-native": minor
---

**Mobile shell + bottom-nav kit updates** (from `MOBILE_KIT_UPDATES_SHELL_NAV.md`).
Makes the mobile bottom nav fully kit-native (drops the app's inline-SVG + FAB-overlay
workarounds). Both platforms, same API/visuals, Storybook on both.

- **Icon** — +2 glyphs `home` (Today tab) and `activity` (Insights bar-chart), exact paths
  from the mockup, matching the existing stroke style. 72 → 74 glyphs; `IconName` identical
  on web + native.
- **TabBar** — the icon resolver now maps **any** string `icon` through the FULL `IconName`
  set (previously gated on a hardcoded 11 names, so modern names like `calendar`/`home`/
  `activity` fell through to raw text). Web `TabBarItem.icon` widened `ReactNode` →
  `ReactNode | IconName` to match native (the `ReactNode` slot still works); web default
  items aligned to string icons.
- **TabBar** — new optional `fabIndex` + `onFabPress`: renders that slot as an elevated
  energy-gradient (`grad-cta`) rounded-square FAB overhanging the bar top with the label
  beneath, matching `home.html .tabbar .tab.fab`. Omit `fabIndex` for the flat bar
  (unchanged).

Added a `MobileNav` Storybook story on both platforms (Today · Calendar · ⊕Log · Coach ·
Insights, `fabIndex={2}`). tokens/ui/ui-native typecheck + build green.
