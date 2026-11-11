---
"@lockin90/tokens": minor
"@lockin90/ui": minor
"@lockin90/ui-native": minor
---

UX and accessibility (1.35b–h, CONVENTIONS "Accessibility"):

- **tokens:** new `--border-control` / `colors.borderControl` (`rgba(255,255,255,.36)`, 3.3:1 on the card) for a field's edge; `--text-faint` / `colors.textFaint` raised to `#868FA3` (4.6:1 on a field's fill; was 4.4:1).
- **Fields:** Input, PasswordInput, SearchInput, Select (md and sm), TagInput and CodeInput boxes use the control edge. Input / PasswordInput / SearchInput text is 16px / 16pt (no iOS zoom) with the box heights kept. Native: a tap on an Input's padding focuses it. `Input` and `PasswordInput` forward `ref` to the field (web `<input>`, native `TextInput`) so apps can focus the next field on Return.
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
