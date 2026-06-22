---
"@lockin90/ui-native": minor
---

Close web↔native parity gaps in the native primitives so the mobile app matches
the web at phone width. All additions degrade gracefully when their optional peer
dependency is absent (same pattern as CopyButton/expo-clipboard):

- **Divider** — new `gradient` prop (fade-to-transparent rule via expo-linear-gradient), matching the web `gradient` variant.
- **CodeInput** — paste / iOS SMS-autofill now spreads a multi-digit code across the boxes (was single-char only).
- **ProGate** — real frosted gated content via the optional `expo-blur` peer (matches web `filter: blur`); falls back to the existing dim.
- **Dropzone** — tapping now opens the OS file picker via the optional `expo-document-picker` peer and forwards results through `onFiles`.
- **DateField** — tapping opens the platform date picker via the optional `@react-native-community/datetimepicker` peer (the native analogue of `<input type="date">`); falls back to the editable text field.
- **Card** — new opt-in `blur` prop for a real frosted surface via the optional `expo-blur` peer (default unchanged).

Adds `expo-blur`, `expo-document-picker`, and `@react-native-community/datetimepicker`
as **optional** peer dependencies.
