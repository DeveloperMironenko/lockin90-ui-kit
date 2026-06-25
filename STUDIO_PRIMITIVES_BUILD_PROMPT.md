# Build prompt — Studio primitives for `@lockin90/ui` + `@lockin90/ui-native`

**For:** the UI-kit build agent working inside `/Users/miron/app/lockin90-ui-kit`.
**Why:** `lockin90-studio` (the admin brand/social asset generator) is being rebuilt on this kit. An
audit of the studio's UI (`lockin90-studio/app/page.js`, `app/login/page.js`, `app/globals.css`) against
the current kit (~85 primitives on `main`) found the studio is **already visually Aurora-aligned** and
maps almost entirely onto existing primitives — **Card, Button, Input, Select, NoteField, FormField,
GradientText, Icon, Toggle, Slider, Tabs, SegmentedTabs, Toast, Alert, Modal, Dropzone, Spinner**.

**One real gap + one small nicety** remain. Build them to the kit's existing conventions, on **both platforms**.

> Companion: this maps the studio's hand-rolled `.pill`/`.eyebrow` classes (`app/globals.css`) to kit
> primitives. The studio's image-render templates (`lib/templates.mjs`, HTML→Playwright screenshot) stay
> standalone and are **out of scope** — they are not kit components.

---

## 0. Hard rules (mirror existing code — do not invent new patterns)

Identical to `CMS_PRIMITIVES_BUILD_PROMPT.md` §0 — restated briefly:

**Web (`packages/ui`)**
- One file per component: `packages/ui/src/components/<Name>.tsx` (React `forwardRef`).
- `import { cn } from '../cn';` — emit **`lk-*` classes ONLY**. No Tailwind; inline styles only for genuinely
  dynamic values.
- Styling in `packages/ui/src/styles/components/<name>.css`, **registered** in `styles/index.css`.
- **Tokens only** (`@lockin90/tokens` vars) — no hardcoded hex/px palette.
- Export component **+ types** from `packages/ui/src/index.ts` (keep the block alphabetical).
- Storybook story `packages/ui/src/stories/<Name>.stories.tsx` (mirror `Chip.stories.tsx`,
  `SegmentedTabs.stories.tsx`).
- Mirror these exemplars: `Chip.tsx`, `Button.tsx`, `Toggle.tsx`, `SegmentedTabs.tsx`.

**Native (`packages/ui-native`)**
- `packages/ui-native/src/components/<Name>.tsx` — StyleSheet + `theme.ts`. Export from `index.ts`.
- **Parity invariant:** identical **export name, prop names, and variant unions** on both platforms.

**General**
- **No new runtime dependencies.** Don't modify unrelated components; keep `main` buildable (every app
  builds the kit from `main`).

---

## 1. Components to build

### S1 — `ChoiceChip` (NEW) — selectable / multi-select filter pill  **[primary]**
The kit has no **pressable** pill: `Chip` is a display-only `<span>` (status tones), `SegmentedTabs` is
single-select, `Toggle` is a switch. The studio uses pills *everywhere* as **multi-select toggle filters**
(target platforms, template kinds, @-mentions, resources) and as single toggles — the `.pill` / `.pill.on`
pattern in `lockin90-studio/app/globals.css`:

```css
.pill   { border:1px solid var(--border); background:var(--glass); border-radius:999px;
          padding:7px 13px; font-size:13px; color:var(--text-dim); cursor:pointer; user-select:none; }
.pill.on{ border-color:rgba(124,92,255,.5); background:rgba(124,92,255,.12); color:var(--text); }
```

- **Web API:** `ChoiceChip` with:
  - `selected?: boolean` — the `.on` state (accent border + tint + brighter text).
  - `onClick?` (standard button handler — it renders a real `<button type="button">` for a11y).
  - `leadingDot?: boolean` (glow dot, reuse the `lk-dot` look) **or** `icon?: ReactNode` (leading glyph).
  - `size?: 'sm' | 'md'` (def `md`), `disabled?`.
  - children = the label. Spreads the rest onto the button.
  - `role`/`aria-pressed={selected}` for the toggle semantics; keyboard = native button (Enter/Space).
  - Emit `lk-choicechip` (+ `lk-choicechip-on`, `lk-choicechip-sm`) classes; tokens only (the selected tint
    is the existing `--accent`/violet token, matching `.pill.on`).
- **Native:** same API; a `Pressable` pill, `selected` → accent tint/border, `aria-pressed`/`accessibilityState={{selected}}`. Same export name + props.
- **Serves (studio):** “Resources · platforms”, template-kind picker, @-mentions, and any multi-select filter
  row. (Single-select rows like AI vs Schedule, IG feed/story, Photo/Video already use `SegmentedTabs`/`Tabs`.)
- **Do NOT** fold this into `Chip` (keep `Chip` a display span) or `SegmentedTabs` (that's single-select).

### S2 — `Eyebrow` (NEW, tiny) — mono uppercase overline label  **[optional / nice-to-have]**
The studio's `.eyebrow` (mono, uppercase, `letter-spacing:.2em`, faint) labels section headers
("Generated · 6", "Targets", …). Currently each app re-declares it.
- **Web API:** `Eyebrow` — renders a `<span>` (or `as` prop) with `lk-eyebrow`; children = text. No variants.
- **Native:** `<Text>` twin with the mono/tracked/uppercase style from `theme.ts`.
- **Serves:** section eyebrows across studio (and reusable elsewhere).
- If the kit's convention is to do overlines via a utility/`Text` rather than a component, **skip S2** and
  say so — it's marginal. S1 is the only must-have.

> Note: `Card`, `Button` (incl. `ghost`/`sm`), `Input`, `Select`, `NoteField`, `FormField`, `GradientText`,
> `Icon` (has `sparkle`), `Toggle`, `Slider`, `Tabs`, `SegmentedTabs`, `Toast`, `Alert`, `Modal`, `Dropzone`,
> `Spinner`/`DotsLoader` already exist — **do not rebuild them.** The studio's preview iframe, publish-target
> cards, schedule/program lists, and image templates are **app-level** composites built in `lockin90-studio`.

---

## 2. Acceptance criteria (all must pass)
- `pnpm -C packages/ui typecheck` **and** `pnpm -C packages/ui-native typecheck` green.
- `pnpm -C packages/ui build` **and** `pnpm -C packages/ui-native build` green.
- New component(s) exported (component **+ types**) from both `index.ts` files.
- Web component(s) have a Storybook story; `pnpm -C packages/ui build-storybook` green.
- New web CSS registered in `styles/index.css`; tokens-only; `lk-*` classes.
- Parity: identical export names/props/variant unions on both platforms.
- `COMPONENT-INVENTORY.md` updated with the new primitive(s).
- **No new runtime deps.**
- Commit in the repo's conventional style, e.g.:
  `feat(ui,ui-native): ChoiceChip (selectable filter pill) + Eyebrow`

---

## 3. Summary checklist
- [ ] S1 `ChoiceChip` — web (`<button aria-pressed>`) + native (`Pressable`, `accessibilityState.selected`)
- [ ] S2 `Eyebrow` — web + native (or skip with a note if it should be a utility)
- [ ] exports + CSS + stories + inventory updated; typecheck/build/storybook green on both packages
