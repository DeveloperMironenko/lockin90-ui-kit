# @lockin90/ui

## 3.9.0

### Minor Changes

- 263bee9: UX and accessibility (1.35b–h, CONVENTIONS "Accessibility"):

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
    - **Simulator check (native, web twin where it applies):**
      - **CodeInput** boxes are measured: 44 wide where 44 fits (6 digits in 300, gap down to 4), 44 tall always; new `codeBoxLayout`.
      - **SegmentedTabs** never break a word: shrink first, wrap only at spaces; web segments go on two rows as a last resort.
      - **ListRow** `pref` / `action` stack at a text scale over 1.35 (web: an em container query); a plain row's title wraps.
      - **Text size:** Badge grows with its text; Avatar initials fit the circle; GradientText / Stat gradient follow the text size.
      - **Avatar** `accessible={false}` hides its initials.
      - **FormField** native error has its icon.
      - **DotsLoader** slows under Reduce Motion.
      - **Increase Contrast:** new `useHighContrast` / `useContrastColors` / `contrastColors` (native) and `prefers-contrast: more` (web tokens).
      - **Alert:** a danger / warn Alert announces itself on iOS.
    - **Review fixes:**
      - **tokens:** `--border-control-strong` / `colors.borderControlStrong` and `highContrastColors` (one Increase Contrast mapping for web and native).
      - **Menu:** Tab closes it back to the trigger; Enter / Space toggle it closed.
      - **SegmentedTabs:** the fit re-runs in rows mode.
      - **Text:** native 11px labels keep a line height of 13 or more.
      - **Alert:** iOS announces on mount for danger only (new `announceOnMount`).
      - **Increase Contrast:** ignores Bold Text, and a change event beats the first read.
      - **DotsLoader:** the web stagger slows with the dots.
    - **Nothing cut off, no word split:** native SegmentedTabs measure every label and word on one unconstrained line (a hidden measurer, plus ref `measure` for trees mounted hidden) and, from the track's width, shrink a `fill` label (never below the default text size or 11pt) or stack the segments (a word too wide, or more than 2 lines; always above text size 1.35, where a word still too wide for a narrow column shrinks, to the default text size at most); the row stays invisible until measured (no jump); new exported `segmentFit` / `stackedScales` (`labelProblem` is gone). A stacked track takes `radii.md` and its segments `radii.sm` (web `.lk-seg--rows`: `--r` / `--r-sm`), not the pill. Select is at least its value's widest word wide (native measured `minWidth`, web `min-width: min-content`); values still wrap between words and the trigger grows. Native Stepper turns vertical above text size 1.35 (labels unclamped, nodes grow with the text).
    - **No word split anywhere (native, web twin where it applies):** new exported native **`FitText`** — a `Text` that wraps between words and, when its widest word is wider than its width, shrinks (size, line height, letter spacing) until it fits, never below the default text size or 11pt (`fitFloor`: at the default text size nothing shrinks, the layout changes instead); measured by the shared hidden word measurer (`internal/wordFit.tsx`: `breakableWords`, `wordFitScale`, `WordMeasurer`, `useWordFit`), which SegmentedTabs and Select now use too. MetricTile (label, value), ListRow (a wrapping title / subtitle), Alert (title, text; new `measureText` for a rich body), FormField (label), Eyebrow, PasswordStrengthMeter (rules, hint) and Button (label) use it; a styled part (a `Trans` tag, a nested element) is measured at bold; `FitText` takes `measureText` for rich children, and `useWordFit` is exported for a title laid out as a row of pieces. Native Card pads 16 above text size 1.35, and a plain ListRow's subtitle wraps there instead of being cut; native PasswordStrengthMeter rules are one column there. Web: new internal `useWordFit` on MetricTile's label and value and ListRow's title and subtitle (shrinks a word that overflows, never below the default text size or 11px: at the browser's default size nothing shrinks; `overflow-wrap: anywhere` stays the last resort; also in SegmentedTabs `fill`, which went to 60 %).
    - **SegmentedTabs inline with a field:** an `md` track is 44 tall with its edge (was 54), segments the track's whole height with a 1pt hit slop (44pt target kept) and the pill drawn inset (4 top / bottom, 2 each side); web at phone width the same for `fill` (transparent border + `background-clip: padding-box`).
    - **Word fit, review fixes:** `FitText` drops `minScale` and gains `onMinWidth` (the narrowest width its words fit whole in); new MetricTile `onMinWidth` (the tile's minimum, padding and edge included) so a grid can choose fewer columns. Lines break as iOS and Android do: after a slash (a time zone: "America/" "Argentina/"; not between digits), not after a hyphen before a digit ("GMT-3"), never beside a word joiner or a no-break space, CJK closing punctuation stays with its character. An email or web address never shrinks its paragraph (left out of the measure) and breaks after "@" and "." where the new exported `breakableAddress` puts zero-width spaces; a piece running across a styled part with no space ("…</email>.") is one piece, measured at bold. Shrunk, `FitText` still follows its room (a squeeze shrinks it more; a wider box draws it at full size and re-reads it). In a row, the MetricTile label and value and the Button label can shrink (`flexShrink: 1, minWidth: 0`), so their room is the row's (web MetricTile label and value `min-width: 0`). SegmentedTabs: a stacked track stretches to its parent and never shrinks its labels again from its own narrower width; a tint segment's hairline takes no label room; zh / ja labels wrap between characters. Select: the leading icon is measured from its ref too.
    - **SegmentedTabs `fill` (web), final check:** a one-line fill choice is a field's height (39.6) in every script (a fixed 15.6px line; zh / ja were 43 / 45 beside the Age field at desktop width); the fit runs again after a render that rewrites the track's or a tab's class (`invalid`, the chosen tab), which dropped `lk-seg--rows` / `lk-seg-wrap` (labels overflowed at 320px after Continue on an empty form).
    - **SegmentedTabs choice rows (owner, 2026-11-11), web and native the same:** labels that don't fit one row first shrink (a `fill` label down to 11pt / 11px drawn at the default text size, the only shrink below the design size: `fitFloor(size, fontScale, true)` / `fitFloorPercent(base, root, true)`; at a larger text size never below the default size), then wrap into as few balanced rows of pills as fit (3 + 2, 2 + 2, 2 + 2 + 1…), centred (above text size 1.35 they wrap without shrinking first; only a label alone on its row shrinks), in a track with a card's corners, each segment a 44 target; a label gets a row of its own only when it needs the full width; never a column list (large text included; `sm` wraps its pills there). Internally `segmentRows` replaces `segmentFit` / `stackedScales` (web `segRows.ts` replaces `segFitPercent`). A zh / ja label is one word (never "アスリー / ト").
    - **MetricTile word values (owner, 2026-11-11):** a `textValue` word shrinks to fit its tile at the default text size, to 11pt / 11px (native `FitText` new `belowDefault` prop, `useWordFit(text, style, belowDefault)`; web `useWordFit(text, belowDefault)`), so a grid keeps its columns in every language.
    - **Owner, 2026-11-11, one focus indicator on fields (web):** Input, PasswordInput, SearchInput, Select (and open), DateField, CodeInput boxes, TagInput, NoteField, RichTextEditor, CodeField and the composer turn their own edge `--accent` 2px (border + 1px inset shadow, no layout shift; 3.4:1 on the field) on focus, mouse or keyboard, with no `--accent-2` outer ring and no glow (the two read as "2 outlines"). Invalid: the same in `--zone-low`. Buttons, links and chips keep the ring.
    - **Owner, 2026-11-11, Toast variant C (web + native, supersedes the line below):** slim (6 / 6 / 6 / 10, icon circle 22, 13.5 / 600, radius 16); tones set the edge and icon, new `info`; the action is filled with the CTA gradient (26 tall, 44 target, corners 10) and, with `duration`, holds a 16 seconds ring (number rounded up, hidden from screen readers) that drains to 0, holds on hover / press / focus (and a screen reader on native), steps under reduced motion; no bottom line.
    - **Owner, 2026-11-11, the Toast (web + native):** the dark glass card (card blur, solid under Reduce Transparency) with a tone edge (3:1), a soft shadow, the icon in a tone circle, white text; fades in with a small slide (a fade under reduced motion). New `actionLabel` / `onAction` (a 44pt / 44px action, "Undo") and, with an action, `duration` / `onTimeout`: a 2px countdown line along the bottom edge that holds while hovered, pressed or focused (WCAG 2.2.1), steps once a second under reduced motion, and calls `onTimeout` only when it runs out (native: held while a screen reader is on, its × ends it). `filled` is deprecated and ignored. New web **`TopLayer`** (a click-through layer at `z-index: 10000`, above every dialog and popover).
    - **Owner, 2026-11-11 (native):**
      - **New `TopLayer`:** draws its children (an app's toast) above everything: inside the top-most open `Sheet` / `Modal` (RN Modals are native windows the page can't draw over; a toast showed under an open sheet), in place when none is open; touches pass through. `Sheet`, `Modal`, `Select`'s list, `Menu`, `Popover` and `Tooltip` host it.
      - **Sheet body scrolls to the edge:** the body is a `ScrollView` (taps kept, a drag puts the keyboard away) whose content ends 18 + the safe-area inset above the bottom; the panel has no bottom padding (it was an opaque band the content was cut at, 52pt above the bottom). Apps drop their own ScrollView inside a Sheet.
  - **Corner radii (owner, 2026-11-11, CONVENTIONS "Corner radii"):** every control 10, a piece inside a control 10 less its inset, containers 16, Modal / Sheet 22, round only for avatars, dots, icon circles, the grab handle and the seconds ring.
    - **SegmentedTabs** (web + native): the track is 10 at every size and on rows (was the pill / 16 on rows); the lit segment 5 (one row, rows) / 6 (`sm`), parallel to the track. The track takes a field's fill and edge (`borderControlStrong` under Increase Contrast, `zoneLow` when invalid); web: a focused choice draws the field's accent edge.
    - **tokens:** new `--card-solid` / `colors.cardSolid` (`#13151D`, the card on `bg-0`, opaque). **Toast** (web + native) uses it: the card's surface, opaque, no blur (native `useReduceTransparency` removed, unused).
    - **Other strays** (web + native unless noted): Alert box 16 (was 10); Menu, Popover and the web Select panels 16 (were 10), Select options 10 (were 6), the native Select sheet top 22 (was 24); SearchInput 10 (was the pill; `shape` deprecated and ignored); TagInput tags 10 (were the pill); ChoiceChip 10, stacked too (were the pill / 16); MetricTile `sm` in a card 10 (was 16); Input `numeral` 10 (was 9); NumberStepper track 10, buttons 6 (were the pill / circles); web Modal close 10 (was 16); EmptyState tile 10 (was 20 / 15); native Badge 10 (was the pill); native ReauthDialog Google / Apple 10 (were the pill); SegmentedTabs count badge 10 (was the pill).
    - **Final, every corner 10 (owner, 2026-11-11):** `radii.md` / `radii.lg` / `radii.xl` and `--r` / `--r-lg` / `--r-xl` are 10 (were 16 / 22 / 28), so cards, toasts, alerts, panels, Modal and the Sheet's top corners are 10; Avatar is a rounded square (10) at every size (`shape` deprecated and ignored); Stepper nodes 10; the bare Menu trigger 10. Kept: the lit segment 10 less its inset (5 / 6), NumberStepper buttons 6, true circles (status dots, icon circles, toggle knobs, the grab handle, the seconds ring) and thin bars.
  - **Audit batch (owner, 2026-11-11), kit half:**
    - **tokens:** new `--accent-soft` / `colors.accentSoft` (`#CBBCFF`, the accent for text on dark) and `--ink-on-bright` / `colors.inkOnBright` (`#0A0A12`, the one dark label on a bright surface); every hand-typed `#cbbcff` / `#CBBEFF` / `#0A0A12` / `#07080D` / `#080A12` in Button, Chip, Badge, Highlight, TagCloud, FollowButton, Toggle, SegmentedTabs, StepIndex, Avatar, Toast, SplitButton, TabBar, PricingTierCard and the web CSS is the token now. New type table `textStyles` (tokens), `--fs-*` / `--ls-label` (web), `textStyle(role)` (native; CONVENTIONS "Type").
    - **Native haptics:** new exported `hapticSuccess()` (a save went through), beside `hapticSelection()`; `expo-haptics` is now a declared optional peer (no-op without it).
    - **Alert (V5 / V8 / V17 / V25):** one box for every tone (padding 12 / 16, text 13, icon 16, a container's corners); new `bar` (the 3px tone bar: default on for signal tones, off for notes); `info` uses `--info`; emphasis is 600 in `--text`, the violet note's `--accent-soft` (native `AlertStrong` follows the tone). Web: new `announceOnMount` (default danger, as native) — the live region mounts first and shows its text 100 ms later (new internal `useLiveReveal`), so it is announced (U10).
    - **Toast (U9 / U10 / U20):** web announces by mounting its region first and showing the text 100 ms later; the countdown holds while focus is anywhere in the toast; new `paused` (web + native, the app's own Undo in use) and web `actionKeys` (a shortcut, e.g. `"Control+Z Meta+Z"`, that runs the action; `aria-keyshortcuts` on it). Native: the ring's number scales with the text size (`allowFontScaling={false}` removed) and the ring grows to fit it.
    - **Two control sizes (V2 / V4, CONVENTIONS "Control sizes"):** `md` 44 tall, `sm` 36 with a 44 target, web and native. Button md is 44 (padding 10 / 20), sm 36 (6 / 14); IconButton 44 / 36 squares (were 40 / 32); ChoiceChip 44 / 36 (were 32 / 28), label 14; BackLink new `size` (`md` default, 44; `sm` 36) on its `pill` / `bar` surface. Native Button / ChoiceChip size an icon passed without its own `size` by the slot (16 / 14 / 19).
    - **Fills and edges (V19):** Button `default`, IconButton, SsoButton, BackLink's surface, ChoiceChip and IconTile are on the opaque `--field` (were glass / `--bg-1`; IconButton drops its blur); ChoiceChip's edge `--border-2`; Tooltip's bubble the overlays' `--border`. Web ChoiceChip, Popover and Menu triggers use the shared `--accent-2` focus ring.
    - **Native primary Button glow (V15):** drawn by a View around the gradient (it never rendered on the gradient).
    - **Popover** "?" trigger: 10 corners (was the pill).
    - **Dialog actions (V10, CONVENTIONS "Dialog actions"):** `Sheet` gains `footer` (pinned "Cancel | Primary", equal halves), `closeLabel` (a named ×), `subheader` (pinned outside the scroll) and `height` (`tall` = fixed 80%), native `padded`; Sheet title 17 (was 16). `Modal`'s footer actions are equal at phone width (web `.lk-dialog-actions`); on a wider screen both Modal and Sheet put them at the end at their own width, wrapping when they don't fit. **ImageCrop** (web) gains `description` (`aria-describedby`: how the keys move the frame). A `sm` ChoiceChip takes a `sm` Select's padding and line, so the two stay one height as the text grows (web + native). Native FormField's required star is joined to the label by a no-break space (never on a line of its own, as web). Native `FitText` (and every text that fits its words with it): a tracked word still too wide at its size floor tightens its letter spacing (never below 0) before it would split.
    - **Native Modal / Sheet keyboard (U20):** Modal's body scrolls and the card avoids the keyboard; Sheet and Modal rise by the keyboard's height on Android (RN Modal windows aren't resized).
    - **Select (V4 / V9 / V11 / V17 / V20 / U4 / U5 / U12):** `md` 44 tall, value 16; `sm` 36 with a 44 target, value Inter 14 (was mono 11 / 13); the leading icon 16 faint; the label mono 11 .14em dim. Native opens the kit `Sheet` (title, ×, a tall sheet with the search pinned; Android keyboard padding) instead of its own. New `clearLabel` and `noMatchesLabel` (shown and announced when the search finds nothing); search matches the value too, with underscores as spaces and each "/" part on its own ("New York" finds `America/New_York`). Web options 44 tall at phone width.
    - **FormField (V6 / U20, native):** with one control child the field is said once (the control carries label and hint; the visible label / error / help are hidden from screen readers; a new error is announced once on both platforms); a `help` node that isn't text is laid out outside the help `Text`.
    - **One label style (V20):** mono 11 / 500, .14em, uppercase — FormField and Input labels `--text-dim` (web was faint .12em), Eyebrow (.2em / 2pt → .14em), MetricTile labels (.16em, sm 1pt / .1em → .14em), Select label.
    - **Web focus (U11):** a focused invalid field (Input, Select, SegmentedTabs choice, TagInput, CodeInput, CodeField, RichTextEditor) adds a soft red halo to its 2px red edge; the Menu trigger uses the shared `--accent-2` ring (was 1.79:1) and a focused Menu item an inset ring. CONVENTIONS now cites WCAG 1.4.11 for a field edge's contrast.
    - **Web targets (U12):** Menu items and Select options 44 tall at phone width; a bare Menu trigger reaches 44 there.
    - **Avatar (V1 / V16):** a photo that fails to load shows the initials (web + native); a photo gets a thin `--border-control` edge; native initials drop `adjustsFontSizeToFit` (it lost the display font on iOS) and size from the box and the text size instead.
    - **ReauthDialog (U1 / U14):** Cancel and × never disabled while `loading`; the password field read-only + busy (not disabled); Google / Apple `aria-disabled` (presses ignored, focus kept). Web Button styles `aria-disabled="true"` as disabled.
    - **SsoButton `loading` (U6, web + native):** spinner over the kept content, busy, presses ignored.
    - **Native icon slots (V17):** a kit `Icon` without its own size gets the slot's: Button 16 / 14 / 19, Input and Select leading 16 faint, ListRow leading 18, ChoiceChip 16 (other nodes untouched).
    - **Native CodeInput (U20):** box 0 `autoComplete="sms-otp"` on Android (`one-time-code` elsewhere), so the SMS code autofills.

### Patch Changes

- Updated dependencies [263bee9]
  - @lockin90/tokens@1.2.0

## 3.8.0

### Minor Changes

- 78873a0: BackLink `variant="bar"`: the signed-in top bar's back chip (Inter 13px, a 15px icon, the control's 10px corners and `--border-2` line).
- ea6182a: ListRow `variant="pref" | "action"`: the design's settings rows (web/settings.html .pref-row / .acct-row): their padding, a 16px gap, the title 600 on the page's line height.
- 8084f88: MetricTile `size="sm"`: the design's settings readout tile (web/settings.html .field); its label and a word value cut with an ellipsis when they don't fit; at phone width the phone's tile (three across). `hint` shows under a value too, not only in empty mode; `textValue` marks a word value (as native).
- 172fc22: ReauthDialog takes its texts as props (`passwordLabel`, `passwordPlaceholder`, `confirmLabel`, `confirmingLabel`, `cancelLabel`, `googleLabel`, `orLabel`, `closeLabel`), English by default; Modal takes `closeLabel` too, as native: it showed English in every language.

### Patch Changes

- 6496a5a: Card `tone="danger"` takes the design's danger zone colours (web/settings.html `.danger`): `--bad` at 30% for the line, 4% for the fill, lit red to amber.

## 3.7.0

### Minor Changes

- ef37ad7: IconButton: a square button with one kit icon and no text (its `label` is required and spoken), on Button's glass surface with a control's 10px corners; `size` `sm` (32px, a 44px touch target) or `md` (40px).
- 75dbea5: ImageCrop: frame a square of an image (drag, wheel, pinch, keys, zoom slider); `cropRect` gives the pixels to cut.
- 6c46bc9: Menu: `iconTrigger` puts the trigger on IconButton's surface, `label` gives it a spoken name, `disabled` stops it (and closes an open panel). The trigger shows the kit's focus ring, and a `bare` trigger is fully rounded.
- f6bef32: NavItem: a sidebar's link row (icon, label, badge; the current page with the accent bar).

### Patch Changes

- 1aadcd9: Avatar: a caller's `style` is merged with the size instead of replacing it, so `style={undefined}` no longer collapses the avatar to zero width.
- 2d60d8d: Button and SegmentedTabs keep their own line height (normal), as the design's `.btn`: under an app's CSS reset (Tailwind's preflight) they inherited the page's and drew about 4px taller (`sm` 38 instead of 34).
- b7d9e36: Slider: `aria-label` names its range input (it was put on the wrapper, which screen readers ignore).

## 3.6.0

### Minor Changes

- 5c52465: Menu items and ListRow: `disabled` — shown but unavailable (e.g. "coming soon"): dimmed, announced disabled, not pressable.

## 3.5.0

### Minor Changes

- 45e8ee4: Toast: `filled` — the tone's color fills the card (no rail), its title, message, icon and dismiss dark on it. SegmentedTabs `fill`: a label wider than its segment shrinks to fit, to 80 % (native already does).

## 3.4.0

### Minor Changes

- 1063906: Onboarding primitives (design web/onboarding.html): `StepIndex` (the step number tile, or a check once done), `IconTile` (an icon on a bordered tile), `ListRow` `boxed`, `Alert` tone `violet` (the "why we ask" note), `Button` tone `muted` for the `text` variant (the faint "Skip setup") and `size="lg"` (a flow's closing CTA); `SegmentedTabs` `fill` (equal segments that fit a phone row) and `invalid`; `AlertStrong`.

## 3.3.1

### Patch Changes

- 2f0f949: PasswordStrengthMeter: a hint too long to sit beside the label moves to its own line below it; the label ("Strength: Good") never breaks.

## 3.3.0

### Minor Changes

- 9ab6342: PasswordStrengthMeter: the rules stay in 2 columns at phone width too (the ≤ 540px one-column rule is gone); a long label wraps inside its column.

## 3.2.0

### Minor Changes

- 7dd3407: Button: `variant="text"`, a bare mono accent action inside a line of text ("Resend code"): no surface or padding, `--accent-2`, underlined on hover, `--text-faint` when disabled.

## 3.1.0

### Minor Changes

- 6e7054e: Alert: two quiet note tones from the sign-in designs. `neutral` is a glass box with a border, and `cyan` is a cyan-tinted box. Neither has the left accent bar. Both use a cyan 17px icon (the info glyph unless you pass one) and 12.5px dim body text. A text-only neutral note centres its icon. In every tone, `<b>` / `<strong>` in the body now reads in full text colour at 600.

## 3.0.0

### Major Changes

- 8e7b86b: PasswordStrengthMeter: `rules` (a checklist under the meter: a round tick that fills mint when met, 2 columns, 1 at ≤ 540px, long labels wrap; each rule reads the required `metLabel` / `unmetLabel` exactly as given, so include the leading punctuation, e.g. ", done"), `accessibleLabel` (a translated name for the meter, default `Password strength: <label>`), `labelPrefix` (faint text before the label, e.g. "Strength:"), and a faint label at score 0. The hint now describes the meter (`aria-describedby`).

  Breaking: `role="meter"` moved from the root to the segment row (a meter's children are presentational, so the label row and the rules sit beside it). An `aria-*` prop passed to the component now lands on the plain root container, not on the meter; name the meter with `accessibleLabel`. The root also applies `style` now (it was dropped).

### Minor Changes

- 11d59ca: CodeInput: the boxes are fluid, as the sign-in design draws them, so an 8-digit code fits a sign-in card and a phone. They share the row's width (aspect 1 : 1.18, 28–60px wide; at ≤ 540px no upper cap, a 6px gap and 20px digits) instead of a fixed 44×52. This changes the layout of every existing CodeInput: the row is now full width with the boxes spread across it, not a centred group of fixed boxes.

## 2.3.0

### Minor Changes

- ff16baf: FormField: `labelAction`, a link or action at the end of the label row (e.g. "Forgot password?").

## 2.2.0

### Minor Changes

- 692867b: One shape, one line (buttons and chips): Button, Chip, BackLink and FollowButton corners go from pill to 10px (`--r-sm`); their outlines, and SplitButton's and SsoButton's, use the shared `--border-2` line.

### Patch Changes

- e91c4a0: CodeInput: each box's digit stays selected (on focus, on click, after writing), so typing always replaces it, the last box too; a changed `length` re-draws the boxes with each digit in its place (a `value` changed with it wins), as native.

## 2.1.0

### Minor Changes

- 9bcfce6: CodeInput, ready for its first real screens:
  - `digitLabel(position, length)` for each box's label. The default changes from `Digit N` to `Digit N of L` (English, for stories: pass a translated one).
  - The row is a `role="group"`, named by the `aria-label` / `aria-labelledby` you pass; `aria-invalid` moves from the row onto every box.
  - Fixed: clearing a middle box no longer shifts the later digits left; box 0 takes a whole autofilled code (`one-time-code`) and spreads it; paste and typing keep digits only; typing into a filled box replaces its digit; a new `value` from the app (e.g. `''` after a wrong code) replaces what's shown.

## 2.0.0

### Major Changes

- e87bb00: PasswordInput: `toggleLabel` is replaced by `showLabel` + `hideLabel`, so the eye toggle names the action it does in each state. Icon: new `qr-code` glyph.

## 1.0.2

### Patch Changes

- 5acb55d: Select: the combobox now has an accessible name — `aria-label` lands on the trigger (and the search input), and a visible `label` names it via aria-labelledby. Before, `aria-label` only reached the wrapper div.

## 1.0.1

### Patch Changes

- Updated dependencies [a881fa2]
  - @lockin90/tokens@1.1.0

## 1.0.0

### Major Changes

- 43e2a35: **Aurora Flux — clean rebuild from `mockups/design/1`.** The kit was stripped to
  its build env and rebuilt as one curated core component set grounded in the
  canonical design preview. This is a breaking API + styling change.

  - **`@lockin90/tokens`** — re-derived to mirror `design/1/shared/tokens.css`
    exactly. CSS-var names now match the design (`--bg-0/1/2`, `--text`,
    `--text-dim`, `--text-faint`, `--accent`, `--accent-2/3`, spectrum
    `--lime…--magenta`, `--grad-*`, `--glow-*`, `--r-*`, `--ease`). The structured
    TS API (`colors`, `gradients`, `gradientStops`, `shadows`, `fonts`, `radius`,
    `spacing`, `energyColor`/`energyLabel`/`zoneGradient`) is retained for RN.
    _Breaking:_ legacy color keys (`bgBase`, `textPrimary`, `--bg-base`,
    `--ease-smooth`, …) were renamed/removed.

  - **`@lockin90/ui`** — all ~85 previous components (incl. the app-specific
    admin/marketing one-offs) were removed and replaced by **~40 curated
    components** derived from the five design surfaces: foundation
    (`AuroraBackground`, `GradientText`, `Card`, `Button`, `Chip`, `Badge`,
    `StatusBadge`, `Pulse`, `Divider`, `Skeleton`, `Avatar`, `SectionLabel`,
    `Marquee`, `Eyebrow`), a React **motion layer** (`Reveal`, `CountUp`,
    `useInView`/`useCountUp`/`useTilt`/`useMagnetic`/`useReducedMotion`), form
    controls, data/viz (`Stat`, `KpiCard`, `BarFill`, `ProgressBar`, `MixBar`,
    `SparkLine`, `EnergyRing`, `EnergyCurve`, `Table`), navigation, feedback
    (`Modal`/`ConfirmModal`, `Toast`, `Banner`, `EmptyState`), and patterns
    (`InsightCard`, `PlanItem`, `EventRow`, `ContributionRow`, `CalendarStrip`,
    `FeatureCard`, `StepCard`, `PricingCard`, `Accordion`, `PhoneFrame`,
    `WearableCard`). _Breaking:_ the `ea-*` classes, the `@lockin90/ui/admin` and
    `@lockin90/ui/marketing` subpath exports, and the `next`/`next-intl` peer deps
    are gone. Components now emit `lk-*` classes from a rewritten `styles.css` and
    require **no Tailwind** — import `@lockin90/tokens/tokens.css` +
    `@lockin90/ui/styles.css` and go.

  - **`@lockin90/ui-native`** — rebuilt as a clean Aurora Flux primitive set
    (Card, Button, Chip, Badge, StatusBadge, Pulse, Divider, Skeleton, Avatar,
    StatBlock, BarFill, ProgressBar, Input, FormRow, Toggle, Banner, EmptyState,
    SectionCard, Typography, MiniEnergyRing, BrandMark) from `@lockin90/tokens`.

  Consuming apps must migrate to the new component set + the
  `tokens.css` + `styles.css` import model (no Tailwind step).

### Minor Changes

- fbeeb1f: **Admin operator-console kit gate (`lockin90-admin/docs/rebuild/UI_KIT_REQUIREMENTS.md`).**
  New **`@lockin90/ui/admin`** subpath (web-only operator primitives) + 3 root utilities + 6
  enhancements. Tokens-driven, Storybook on each.

  New `@lockin90/ui/admin` subpath (restored: barrel + tsup entry + `./admin` export):

  - **App shell:** `SideNav` (+ `NavItem`/`NavGroup` — sticky rail, gradient active-indicator,
    count badges, mobile drawer + scrim).
  - **Data/display:** `MethodChip` (per-method color map), `SecretField` (masked reveal + copy),
    `RedactedField` (E2EE "unreadable" hatch), `InlineEdit` (click-to-edit cell), `PulseStrip`
    (live-ingest equalizer + idle).
  - **Charts/widgets:** `FunnelChart` (+`FunnelStep`), `ReferenceRangeBar` (thin `RangeBar`
    wrapper), `PushPreview` (push/in-app/email notification card).
  - **Settings/security:** `PermissionMatrix` (+`MatrixToggle` — role×capability grid),
    `RecoveryCodeGrid`.

  Root (`@lockin90/ui`): `ScrollProgress`, `AuroraBackground` (web twin), `QRCode`
  (dependency-free QR encoder — real scannable otpauth QR).

  Enhancements (additive, backward-compatible): `Table` per-row `rowTone` + expandable detail
  rows (`expandable`/`renderDetail`/`expandedKeys`) + sort indicator · `Card` `tone` +
  `variant: 'ghost'|'dashed'` · `Stat`/`MetricTile` `empty`+`hint` placeholder · `SegmentedTabs`
  per-item `count`+`tone` · `SearchInput` `kbdHint` · `Icon` `stripe` glyph (web + native).

- 30d758b: **Aurora Flux redesign.** Replace the retired shipped brand (single red `#FF1F1F`,
  Barlow Condensed, flat / no shadows, sharp 4–6px radii) with the **Aurora Flux**
  visual language: deep-void glassmorphism, a flowing energy-spectrum gradient
  (lime → mint → cyan → indigo → violet → magenta), glow + soft elevation, rounded
  10–28px radii, and **Space Grotesk** display type.

  - **`@lockin90/tokens`** — palette, fonts (Space Grotesk / Inter / JetBrains Mono),
    radii, easing all re-valued. New tokens: spectrum colors (`lime…magenta`),
    `accent2`/`accent3`, glass surfaces, `gradients` + `gradientStops` (web CSS +
    RN/SVG stops), `shadows` (glow/elevation). Existing key & `--css-var` names are
    preserved (so consumers keep resolving); only their values changed, plus the new
    `--grad-*`, `--glow-*`, `--glass*`, `--r*`, spectrum vars are emitted.
  - **`@lockin90/ui`** — `styles.css` `ea-*` classes re-themed to glass/gradient/glow
    (names unchanged). All hardcoded red/green/amber routed to tokens. `EnergyRing`
    and `EnergyCurve` now render the spectrum gradient (EnergyRing gains `gradient`,
    `label`, `showZone` props). `BrandMark` is the new gradient-check + "LockIn90"
    lockup. **16 new components**: `GradientText`, `Chip`, `Pulse`, `BarFill`,
    `AuroraBackground`, `Marquee`, `PhoneFrame`, `KpiCard`, `InsightCard`,
    `AttributionCard`, `ScoreBreakdown`, `Timeline`/`TimelineItem`, `CoachPlanItem`,
    `CalendarStrip`, `SyncBadge`.
  - **`@lockin90/ui-native`** — re-themed automatically via tokens; `Alert` error/success
    colors routed to the new palette.

  Consuming apps adopt the new look on their next build. **Action required:** load the
  Space Grotesk font and expose `--font-space-grotesk` (web, via next/font) /
  `@expo-google-fonts/space-grotesk` (native) — see `MIGRATION-AURORA.md`.

- 328242d: Add `Avatar` `variant="aura"` (animated energy-spectrum orb for the AI coach) and a new `ShareCard` component (branded, shareable progress/score card composing BrandMark + Ring/GradientText + Stat). Both platforms, tokens-only, with per-component SDDs and a ShareCard Storybook story. Closes two genuine gaps from the mobile design audit (the others — LineChart band/markers, Meter target, RangeBar marker, NumberStepper — already existed).
- 79cdd13: Two cross-platform additions (web + native, identical prop APIs, tokens-only):

  - **`Button` gains `tone="danger"`** — a destructive tone that composes with `variant`. On the `default` variant it paints a solid `--bad` fill (the primary destructive action); on `ghost` it becomes a red-tinted transparent button (the account "danger zone" delete). Web emits `.lk-btn--tone-danger`; native mirrors with `colors.bad` + the paired `rgba(255,77,109,…)` tint. Existing variants are unchanged.
  - **`PricingTierCard` supports per-feature included/excluded** — `features` now accepts `Array<string | { label; included? }>` (new exported `PricingFeature` type). A plain string or `included !== false` renders the mint check ✓; `included: false` renders a muted cross ✗ (`close` glyph in `--text-faint`, label in `--text-dim`). Fully back-compatible with the existing `string[]` API.

  Both ship with updated SDDs (`Button.md`, `PricingTierCard.md`) and Storybook stories (danger Button example, excluded-feature PricingTierCard example).

- 2929196: **Charts catalog program — the full `lockin90-design/charts/` design catalog (251 variants /
  35 families) lands in the kit, web + native in lockstep.** Ask-by-ID map: catalog ID →
  component + `variant` + SELECT-option props lives in `docs/sdd/CHART-MAP.md`
  (plan: `docs/sdd/CHARTS-PLAN.md`).

  **Extends 9 existing chart primitives** with catalog `variant` unions + option props
  (all previous defaults unchanged):

  - `LineChart` — `variant` (solid/gradient/veil/tide-split/glass-fill/curve-styles/dash-dot/
    stroke-weight/neon/aurora-halo/ghost-echo/bead-chain/comet-head/peak-flag + marker/compare/
    band/forecast forms), multi-`series`, `curve`, `pattern`, gradient stops, labels.
  - `BarChart` — `variant` (spectrum/zone/lollipop/diverging-tide/stacked/grouped-pair/value-caps/
    fade-history/today-pulse/rank-rows/waterfall/goal-bars/sparkbar-micro), legend.
  - `ProgressBar` — `variant` (zone-progress/step-cells/milestone-line/ghost-compare/
    overflow-badge/head-pill/countdown-drain).
  - `Ring` — `variant` (score/dual/triple/thin-halo/dashed-track/pulse/delta), `zone`, `delta`.
  - `Gauge` — `sweep`, `ticks`, `cap`, `shine`, `zone`, `label`/`showValue`.
  - `DonutChart` — `variant` (duo-split/split-arcs/zone-share/hero-arc/callout-arcs/…),
    `hero`, `callouts`, nested `innerSegments`, `shine`.
  - `Heatmap` — `variant` grid/strip, `scale` (zone/spectrum/diverge), row/col labels,
    day letters, dots, glass, focus row, today ring/pulse, `showValues`.
  - `Hypnogram` — `variant` (hypnogram/efficiency-bars/sleep-week/bedtime-drift/night-coach).
  - `PhaseWheel` — `variant` (circadian/phase-wheel/coach-wheel/phase-strip), cycle `phases`.

  **Adds 27 new chart components** (same names/props/variants on both platforms; web = inline
  SVG + `lk-*` classes, native = `react-native-svg`, glow via wide faint duplicate shapes):

  `AreaChart`, `BeeswarmChart`, `BiomarkerRange` (promoted cross-platform from the admin
  `ReferenceRangeBar` family), `BodyBattery`, `BulletChart`, `CaffeineClock`, `ChartState`
  (skeleton/loading/empty/locked/error/partial-sync chart states), `ComboChart`, `CompareChart`,
  `CompositeChart`, `DayWheel`, `DistributionChart`, `EnvironmentChart`, `FunnelChart` (promoted
  cross-platform; the legacy web-only `@lockin90/ui/admin` FunnelChart is unchanged),
  `MetaphorWidget`, `RadarChart`, `RoseChart`, `SankeyChart`, `ScatterChart`, `SessionChart`
  (+ `DEFAULT_SESSION_ZONES`), `StatTile`, `SupplementChart`, `TimelineChart`, `UnitChart`,
  `VitalsStrip`, `WatchComplication`, `ZonePyramid`.

  Every chart is tokens-driven, takes real data via props, supports the catalog SELECT options
  as props and the `shine` glow modifier, and ships a Storybook story per platform reproducing
  its catalog card.

- 61e4abe: **Consumer-screen glyph audit (`KIT_GLYPHS_REMAINING.md`): +15 Icon glyphs.** Both
  platforms, identical names, Storybook grids updated. Icon set 95 → 110.

  `send`, `attach`, `emoji`, `mic` (chat composer) · `comment`, `bookmark` (feed) ·
  `target` (goals) · `medal` (achievements, covers trophy) · `drop`, `utensil`,
  `barcode-scan` (nutrition) · `pill` (substances) · `flask`, `syringe` (labs) ·
  `camera` (vision). All stroke glyphs in the kit style (`currentColor`, viewBox 24).
  `mail` already shipped in `10df287`. Completes the consumer-screen icon set — the
  Section-B candidates (`plug`/`connect`→`link`/`data-source`, `rocket`→`sparkle`,
  `chart-line`→`insights`, `trophy`→`medal`, `clock-check`→compose) reuse existing glyphs.

- 0628034: **Domain charts + native parity completions.** Three new energy/sleep-domain
  chart primitives, in full web↔native parity, plus two native primitives brought
  up to match their web twins.

  - **`Hypnogram`** — a sleep-stage timeline. Four bands (Awake / REM / Light /
    Deep, top→bottom) hold rounded capsule bars whose widths are proportional to
    each segment's minutes, with thin vertical connectors so the eye follows the
    stage transitions like a stepped line. Optional left stage-label gutter +
    x-axis time row. Exports `SleepStage`, `HypnogramSegment`, `HypnogramProps`.
  - **`PhaseWheel`** — a circular 24-hour circadian clock. A faint track ring with
    colored phase bands (sleep / focus / dip / wind-down), hour ticks (longer +
    brighter + labeled at the quarters), point markers on the ring, an optional
    "now" hand (pass `now={null}` to hide), and centered content. Exports
    `PhaseArc`, `PhaseMarker`, `PhaseWheelProps`.
  - **`PkChart`** — a pharmacokinetics concentration-over-time curve. Builds the
    curve from raw `samples` or by summing each dose's normalized one-compartment
    **Bateman** absorption/elimination curve; renders a smooth area+line, a dashed
    threshold reference line with danger-zone tint, vertical dose markers, a peak
    callout and a y-axis. Exports `PkDose`, `PkThreshold`, `PkChartProps`.

  Native parity completed (no API change):

  - **`Tooltip`** (native) now renders the diamond arrow pointer on the edge facing
    the trigger — resolved-placement aware (the `top`→below fallback flips the
    arrow), mirroring the web `.lk-tip-bubble::after`.
  - **`FocalPointPicker`** (native) now supports tap **and drag** (via
    `PanResponder`), matching the web pointer-drag twin (previously tap-only).

  All three packages typecheck + build green; the new web CSS is folded into the
  single `styles.css`; Storybook catalogs added on both platforms.

- b00c53b: Initial extraction of the P90 cross-platform design system into publishable packages.
- 0902f57: **Web-rebuild punch-list (`KIT_MISSING_COMPONENTS.md`): +13 Icon glyphs + `PasswordInput`.**
  Both platforms, same API/visuals, Storybook on both.

  - **Icon** — 74 → 87 glyphs: `energy`, `sleep`, `insights`, `billing`, `globe`, `heart`,
    `flame`, `height`, `weight`, `arrow-right`, `shield` (stroke glyphs in the kit style) +
    multicolor **`google`** and fill **`apple`** brand logos (these two render their own
    fills rather than `currentColor`). `IconName` identical on web + native.
  - **`PasswordInput`** — a password field with a built-in show/hide eye toggle, mirroring
    `Input` (`label`/`leading`/`invalid`/`inputSize`); owns `type`/`secureTextEntry`
    internally, swapping the existing `eye`/`eyeOff` glyph. Pairs with `PasswordStrengthMeter`.

- 19736bb: Close four parity gaps surfaced by the mobile auth/onboarding rebuild (all additive, back-compat, both platforms):
  - `Button` gains a `trailing` slot (symmetric with `leading`) — trailing-arrow CTAs.
  - `SegmentedTabs` gains a control-level `tone` ('accent' | 'mint') colouring the selected segment.
  - `Ring` `gradient` now accepts an N-stop `string[]` (full flux spectrum), not just a 2-stop `[from,to]`.
  - `Stepper` gains `complete` — renders the current/final node as done (the onboarding "calibrated" state).
- 79cdd13: **Web kit wave 1 (`@lockin90/ui`).** New primitives + a Divider variant + two CSS-class collision fixes + two admin renames (back-compat aliased), all tokens-driven (`lk-*` classes + `@lockin90/tokens`), no new dependencies.

  - **`ProGate` (new, web)** — premium-lock overlay: gated `children` blurred (`filter: blur(6px)`) + dimmed (`opacity 0.35`) behind a centered glass lock card (padlock + `title` + `subtitle`). Web twin of the native `ProGate`, same `ProGateProps`; closes the prior web coverage gap. `.lk-pro*` CSS.
  - **`SsoButton` (new, web)** — brand-icon SSO sign-in button (`provider: 'google' | 'apple'`): full-color Google "G" / monochrome Apple mark + label, glass pill, `disabled` state, renders a real `<button>`. Web twin of the native `SsoButton`. `.lk-sso*` CSS.
  - **`NotificationRow` (new)** — a notification list item: optional unread accent dot + optional typed leading `Icon` + `title` + right-aligned relative `time` + optional `body`; `onClick` makes it a `<button>`. Shared cross-platform contract with the native `NotificationRow` (`onClick` ↔ `onPress`).
  - **`Divider` `label` variant** — optional `label?: string` renders `hairline · centered label · hairline` (the "or continue with" pattern). Existing `gradient` / default behavior unchanged. `.lk-hr-labeled`/`.lk-hr-line`/`.lk-hr-label` CSS.
  - **CSS collision fix — `lk-dots`:** `ProgressDots` (in `MetricTile.tsx`) no longer emits `.lk-dots` (which collided with `DotsLoader`); its container is now `.lk-pdots` (dots stay `.lk-pdot*`). `DotsLoader` keeps the canonical `.lk-dots`.
  - **CSS collision fix — `lk-metric`:** admin `MetricRow` no longer emits `.lk-metric*` (which collided with the root `MetricTile`); it now emits `.lk-mrow*`. `MetricTile` keeps `.lk-metric*`.
  - **Admin rename — `FunnelChart` → `OperatorFunnel`:** the admin operator funnel (`@lockin90/ui/admin`) is renamed to avoid clashing with the root chart `FunnelChart`. Deprecated `FunnelChart` / `FunnelChartProps` aliases kept for back-compat.
  - **Admin rename — `Sparkline` → `TrendCard`:** the admin titled stat+area-chart card (`@lockin90/ui/admin`) is renamed (it's a card, not a bare sparkline) to avoid clashing with the root cross-platform `Sparkline`. Deprecated `Sparkline` / `SparklineProps` aliases kept for back-compat.

- 79cdd13: Wave 2 — consolidate the web tone-pill, stat-tile, proportion-bar, and card families onto single sources of truth. Every existing export name + its `*Props`/`*Tone` types keep working (admin/marketing apps import them); the duplicates are now thin wrappers of the canonical primitive, with no visual regressions. New canonical props (a native twin should mirror these for parity):

  - **`Chip` gains `size?: 'sm' | 'md'`** (default `'md'`; new `ChipSize` type). `size="sm"` is the compact count/status badge — tighter box, 10px tabular mono, a FILLED-gradient `accent`, and a bare glowing `dot`. `Badge` (`Toast.tsx`), admin `StatusChip`, and marketing `Pill` are now thin wrappers of `Chip` (the retired `.lk-badge*` / `.lk-schip*` / `.lk-pill` CSS was deleted). `StatusChip`'s `neutral` maps to `Chip`'s `default` (its true equivalent). Base `.lk-chip` gained `white-space: nowrap`.
  - **`Stat` gains `tone?: 'default' | 'gradient' | 'mint'`, `valueColor?`, `size?: 'sm' | 'md' | 'lg' | 'hero'`, `sub?`** (new `StatTone`/`StatSize` types; default `md` unchanged). `sm`/`lg` mirror admin `Statistic` (20/28px); `hero` is the marketing `Stat` (oversized value, label below, animated spectrum gradient). The `gradient` tone renders static flux on sm/md/lg and the animated full-spectrum on `hero`. Admin `Statistic` + marketing `Stat` are now thin wrappers of `Stat` (retired `.lk-statistic*` / `.lk-mkt-stat*` CSS deleted).
  - **`MetricTile` gains `spark?: number[]`** (+ `sparkColor?`) — a bottom fill bar (single value in `[0,1]`, or a series filled to `last/max`). Admin `StatCard` is now a thin wrapper of `MetricTile` via `spark` (KPI-cell chrome re-scoped onto `.lk-metric.lk-statcard`; delta line + value tone preserved).
  - **`Card` gains a polymorphic `as?: ElementType`** (default `div`). Marketing `Card` is now a thin wrapper of the root `Card` (`as` lives on root; `.lk-mk-card` padding kept).
  - **Fixed a `.lk-spark*` CSS collision:** admin `TrendCard` shared `.lk-spark` / `.lk-spark-line` / `.lk-spark-area` with the root `Sparkline`, polluting both. TrendCard's classes are renamed `.lk-trend*` (CSS file `sparkline.css` → `trendcard.css`); its component API is unchanged.

- 10df287: **Mobile rebuild round 3 (`MOBILE_KIT_NEEDS_OUTSTANDING.md`): +8 Icon glyphs + `Button` leading slot.**
  Both platforms, same API/visuals, Storybook on both.

  - **Icon** — 87 → 95 glyphs: `mail`, `caffeine`, `meal`, `mood`, `scale`, `ruler`, `card`,
    `data-source` (exact stroke paths from the mobile mockups). `IconName` identical on web +
    native. (`mail` also covers the frontend auth email-field follow-up.) The doc's `sleep` /
    `heart` already shipped in `0902f57` and are kept as-is.
  - **`Button`** — new optional `leading?: ReactNode` slot (icon before the label, auto-spaced
    by the existing `.lk-btn` gap / native row), so SSO brand buttons (`<Button leading={<Icon
name="google"/>}>`) need no app-level composition. Additive — existing usages unchanged.

- d456791: **Mobile shell + bottom-nav kit updates** (from `MOBILE_KIT_UPDATES_SHELL_NAV.md`).
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

- 86c9e88: **Web + mobile rebuild — kit gap closure (+21 primitives, 2 extensions, +12 icons).**
  Adds every genuine kit gap from `MOBILE_PRIMITIVES_BUILD_PROMPT.md` and the web
  `UI_KIT_REQUIREMENTS.md`, each shipped on BOTH `@lockin90/ui` (web) and
  `@lockin90/ui-native` (native) with the same export name, prop API and visuals
  (tokens-driven), cataloged in Storybook on both sides.

  New primitives:

  - **Messaging** — `MessageBubble`, `MessageComposer`, `TypingIndicator`.
  - **AI / insights** — `InsightCard`, `PendingPatternCard`, `EffectAttributionLine`, `ForecastCallout`.
  - **Sensitive actions** — `ReauthDialog` (Modal step-up: password + Google SSO).
  - **Achievements / billing** — `AchievementBadge` (tiered medal + progress ring),
    `PricingTierCard` (featured ribbon), `CreditCardVisual` (gradient card art).
  - **Domain** — `MuscleDiagram` (SVG body map), `DayTimelineBlocks` (24h rail + now marker).
  - **Forms** — `PasswordStrengthMeter`, `Combobox` (search + results).
  - **Social** — `EngagementBar`, `FollowButton`, `LeaderboardRow`.

  Extended (additive, backward-compatible):

  - `LineChart` — `band` (uncertainty ribbon on a shared expanded y-scale) + `dashedFromIndex`
    (dashed forecast tail). No-prop output is byte-identical to before.
  - `Slider` — `labels[]` row under the rail (mood/focus scales).
  - `Icon` — 60 → 72 glyphs (+5 mood faces, +7 provider logos: oura/whoop/garmin/polar/
    apple-health/dexcom/strava); `IconName` identical on both platforms.

  Some requested items are NOT kit exports — composed in-app instead (see
  `REUSE_RECIPES.md`): ConfidenceMeter→Meter, ConversationRow→ListRow, E2EEBadge→Chip,
  GlycemicCurve→PkChart/band-LineChart, plus the page-specific layouts SocialPost /
  ProfileHeader / ShareCard (Card/Avatar/Ring compositions).

- fc607b7: Restore the `@lockin90/ui/marketing` subpath. Ports the marketing presentational
  primitives — Container, Section/SectionHeader, Typography (Heading/Body/Lead/Eyebrow/
  Mono), Pill, Reveal, IconBadge, Field (Input/Textarea), Icon (+IconName, with `star`/
  `topic` added), Stat, Accordion, Card — from the archived kit onto the rebuilt Aurora
  tokens/classes, and re-wires the subpath: a second tsup entry (`src/marketing/index.ts`
  → `dist/marketing/index.{mjs,cjs,d.ts}`), the `./marketing` package export, and the
  marketing CSS folded into the single `dist/styles.css` (no extra app CSS import).
  Unblocks `lockin90-marketing`, which imports `@lockin90/ui/marketing` on every page.
- cca32e9: Restore two things the clean-slate rebuild dropped that `lockin90-marketing` depends
  on:

  - **`@lockin90/tokens/tailwind-preset`** — the opt-in, token-driven Tailwind preset
    (colors / fonts / radii / gradients / shadows), rebuilt from the current tokens and
    re-wired as a second tsup entry + `./tailwind-preset` package export.
  - **Main-kit props the app still uses** (additive, backward-compatible, web + native):
    `GradientText` gains an `as` prop; `Card` gains `pad` (`'none' | 'sm' | 'md' | 'lg'`);
    `Chip`/`ChipTone` gains a `'neutral'` tone.

  Together with the `@lockin90/ui/marketing` subpath restore, `lockin90-marketing` now
  typechecks with zero errors.

- eacd99c: Add the 6 training primitives (web + native, identical prop APIs): `SetTable` — the per-set workout table (colored W/1/2/D/F set labels, centered mono weight×reps, coach/AI reference column, mint done-check, cyan current-row tint, red PR badge, + Add set row; helper `setLabels`); `PrBadge` — the solid red personal-record flag (#FF4757, 4px radius, red glow); `RestTimer` — the between-sets countdown ring (mint arc on faint track, mono time, Skip transport, trailing HR slot; helpers `formatRestTime`/`restFraction`); `TemplateCard` — workout-template row card (source pill mint Coach / violet AI, tint edge bar); `PrCard` — personal-record card (red border/glow + PrBadge tag for new/atPeak, amber text for offPeak); `SessionBanner` — active-session live banner (one-line header, pulsing magenta live dot, ≤3 mono stats, kit-Button actions). All tokens-driven, with SDDs, Storybook stories, and render tests on both platforms.
- bde4f15: Add `ZoneBar` — an HR training-zone bar (time-in-zone across the 5 heart-rate zones Z1–Z5 with a current-zone marker), both platforms, tokens-only (cool→hot spectrum ramp), with an SDD and Storybook story. Grounded in the watch-v2 `zonebar`/`zgauge` pattern; closes the #3 gap from the watch-v2 design comparison so the training screens stop hand-rolling zone bars.

### Patch Changes

- Updated dependencies [43e2a35]
- Updated dependencies [30d758b]
- Updated dependencies [b00c53b]
- Updated dependencies [cca32e9]
  - @lockin90/tokens@1.0.0
