---
"@lockin90/tokens": minor
"@lockin90/ui": minor
"@lockin90/ui-native": minor
---

UX and accessibility (1.35b–h, CONVENTIONS "Accessibility"):

- **tokens:** new `--border-control` / `colors.borderControl` (`rgba(255,255,255,.36)`, 3.3:1 on the card) for a field's edge; `--text-faint` / `colors.textFaint` raised to `#868FA3` (4.6:1 on a field's fill; was 4.4:1).
- **Fields:** Input, PasswordInput, SearchInput, Select (md and sm), TagInput and CodeInput boxes use the control edge. Input / PasswordInput / SearchInput text is 16px / 16pt (no iOS zoom) with the box heights kept. Native: a tap on an Input's padding focuses it. `Input` and `PasswordInput` forward `ref` to the field (web `<input>`, native `TextInput`) so apps can focus the next field on Return (native ref type `TextInputRef` = `ComponentRef<typeof TextInput>`, which has `focus()` on RN 0.81 and 0.88). `CodeInput` forwards a ref (`CodeInputHandle`) whose `focus()` goes to the first empty box.
- **FormField:** web gives the control an id (label `for`), `aria-describedby` to its error / help and `aria-required`; native passes the label (plus the new `requiredLabel`) as the child's `accessibilityLabel`, the error / help as `accessibilityHint`, puts the error in a live region and announces it.
- **Button `loading`** (web + native): the kit Spinner over the kept label, busy state, presses ignored.
- **Names via props:** `Alert` / `Toast` `dismissLabel`, `DotsLoader` `label`, `SearchInput` `clearLabel` (English defaults stay as fallbacks).
- **Alert:** web `role="alert"` for danger, `status` otherwise; native danger `accessibilityRole="alert"` + live region; new `titleAs` (default `'p'`, was an `h5`). Toast: web `alert` for danger.
- **SegmentedTabs `kind="choice"`:** radiogroup / radio with arrow keys (web), radio + checked (native); native `accessibilityLabel` / `accessibilityHint`.
- **Targets (same look):** native hitSlop to 44pt on BackLink, Select, Button sm, the password eye, ChoiceChip, Alert / Toast / Modal close, SegmentedTabs, SearchInput clear; web ≥ 24px (44 at phone width) on the text button, BackLink, the password eye, the search clear, Alert / Toast close, IconButton md.
- **Web focus:** one visible `:focus-visible` ring (`2px solid --accent-2`) on Button, SsoButton, IconButton, BackLink, tappable ListRow and the small close / clear / eye buttons. Modal and Sheet take focus, trap Tab (the topmost one only), give it back to the opener on close and are named by their title.
- **Native reduced motion:** new exported `useReducedMotion()` (one shared store); AuroraBackground holds still and every loop (DotsLoader, ProgressBar, Avatar, GradientText, TypingIndicator, SessionBanner, VitalsStrip, chart pulse rings) stops at a defined still frame while it is on; Spinner slows to 8s, as web.
- **Native Sheet** clears the home indicator via the new optional peer `react-native-safe-area-context`.
- **Web:** SideNav and Modal use `100dvh` (with a `100vh` fallback).
- **Running-app audit:**
  - **tokens:** `--card` / `colors.card` (`rgba(22,24,32,.79)`: the old glass colour on the page, but opaque enough that the aurora never drops text below 4.5:1) and `--field` / `colors.field` (`#25272E`, opaque). Card uses `--card`; Input, PasswordInput, SearchInput, Select, CodeInput and TagInput use `--field`.
  - **Web:** every field shows the 2px `--accent-2` focus ring (not just an accent edge).
  - **44px controls:** at ≤ 540px Button, SsoButton, Input, Select (both sizes), SearchInput, SegmentedTabs segments and the Modal close are at least 44px tall; native draws the same controls 44pt. CodeInput boxes are 44 tall, 8 apart.
  - **Spinner:** under Reduce Motion it turns at 2.5s on web (exempt from the global freeze) and native.
  - **Select:** `aria-required` goes on the combobox.
  - **ProgressBar:** names itself (web `aria-label` / `aria-labelledby`; native progressbar role + `accessibilityLabel`).
  - **CodeInput:** a whole pasted code fills from box 1; `aria-required` sits on the boxes and the group takes FormField's name / description; native boxes read the field's name and hint.
  - **Divider / SectionDivider / SegmentedTabs `fill`:** labels wrap instead of overflowing.
  - **ReauthDialog:** opens on its field, Confirm stays enabled and shows the new `passwordRequiredLabel`, busy via Button `loading`; native gets `closeLabel` and translated SSO names.
  - **Menu:** opens from the keyboard on its first item, the arrows move and Escape returns focus to the trigger.
  - **Text size:** no meaningful text under 11px (chips, badges, eyebrows, labels, counts).
  - **Alert:** new `live` and `footer` (a countdown outside the live region).
  - **MetricTile:** the `sm` label and a word value wrap instead of being cut with an ellipsis; label and hint are 11px; the unit wraps under the value when the row doesn't fit (web and native).
  - **FormField / Button `text`:** the label row wraps (a long action goes to its own line, end-aligned) and a text button's label wraps instead of overflowing (web and native).
  - **ListRow `pref` / `action`:** under 300 wide the trailing control drops under the text (full width, start-aligned) instead of squeezing it (web container query, native `onLayout`).
  - **Narrow phones:** new `--bp-narrow` / `breakpoints.narrow` (360, max-width; Tailwind preset `narrow`); Card `padLg` drops to 16 there (native by window width) so an 8-box CodeInput fits 320; Chip labels wrap instead of overflowing (web and native).
  - **ReauthDialog (web):** `hasApple`, `onApple`, `appleLabel`, as native; Google and Apple both show when both are linked, disabled while loading.
