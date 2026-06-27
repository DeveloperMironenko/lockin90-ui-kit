# SDD — `PushPreview` (NotificationPreview)

> **Package:** `@lockin90/ui/admin` — web-only operator-console primitive (admin app is web-only).
> **Import as:** `import { PushPreview } from '@lockin90/ui/admin'`.
> **Source:** `packages/ui/src/admin/PushPreview.tsx` · web CSS `packages/ui/src/styles/components/pushpreview.css` (`.lk-pushprev*`). NO native counterpart.
> **Exports:** `PushPreview`, type `PushPreviewProps`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (admin) — operator console has no native surface.
> **Stories:** `packages/ui/src/stories/PushPreview.stories.tsx`.

---

## 1. Overview

The live **OS-style notification preview** that sits beside the admin broadcast composer and
updates in real time from the composer's title / body / channel inputs. The `channel` prop
switches the card chrome between the three delivery surfaces:

- **`push`** — an iOS lock-screen-style rounded **glass** card (`backdrop-filter` blur): icon
  tile · app name · time, then bold title + body.
- **`in-app`** — a toast-like inline banner with a left **accent edge** (`--grad-cta`): a top
  header row (icon · name · time · close glyph) over the copy.
- **`email`** — a mini **email header**: from-row (icon + name + synthesized `hello@<app>.com`
  address) over a `Subject` label, bold subject, and preview body.

It is a **pure render, stateless** component — the composer drives every prop. The wrapping
`.lk-pushprev` frame carries a dashed border and a `LIVE PREVIEW · <channel>` corner stamp.
`placeholder` dims the whole frame to a "type to preview…" empty hint. Matches the
`.bc-preview` / `.push-card` live preview from `lockin90-design/admin/growth.html` +
`overview.html`.

## 2. API contract

### `PushPreviewProps`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `appName` | `string` | — | shown in the chrome; also lowercased into the email from-address `hello@<appname>.com` |
| `appIcon` | `ReactNode?` | `<BrandMark variant="icon" size={30} />` | app icon tile; defaults to the kit BrandMark icon |
| `title` | `string` | — | notification / email subject — the bold headline |
| `body` | `string` | — | notification / email body copy |
| `timeLabel` | `string?` | `'now'` | trailing timestamp (e.g. `'9:41'`) |
| `channel` | `'push' \| 'in-app' \| 'email'` | — | which delivery channel's chrome to render |
| `placeholder` | `boolean` | `false` | dim the card to the "type to preview…" empty state |

- No `forwardRef`, no `...rest` spread — the prop set is closed (it is a leaf preview, not a styleable container).
- Root carries `data-channel={channel}` (drives the CSS `::after` stamp), `role="figure"`, and
  `aria-label="<channel> preview"`.
- Body is only rendered when `!placeholder && body` is truthy (an empty body collapses the row).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Token / value |
| --- | --- |
| Frame `.lk-pushprev` | `1px dashed --border-2`, `--r` radius, bg `rgba(8,10,18,.4)`, `--font-ui`, `padding 28px 14px 14px` |
| `LIVE PREVIEW` stamp (`::after`) | `--font-mono`, `8.5px`, `--bg-1` chip, `--text-faint`, uppercase `0.14em` |
| Card base | `gap 11px`, `padding 12px`, `--r-sm`, bg `rgba(20,24,34,.9)`, `1px --border`, `--elev-1` shadow |
| Icon tile | `30px`, `8px` radius, `overflow:hidden` |
| App name | `11.5px`/600, `--text-dim` |
| Time | `--font-mono`, `9px`, `--text-faint` |
| Title | `12.5px`/700, `--text`, `overflow-wrap:anywhere` |
| Body | `11.5px`, `--text-dim` |
| **push** card | `--r` radius, `--glass-2` bg, `backdrop-filter: blur(20px)`, `--border-2` |
| **in-app** card | column, `--r-lg`, `--bg-2` bg, `--elev-1` + `--glow-accent`; left `3px` `--grad-cta` accent bar (`::before`); close glyph on `--glass` |
| **email** card | `display:block`, `--bg-1` bg; from-row border-bottom `1px --border`; from-name `12px`/700 `--text`; address `--font-mono` `9.5px` `--text-faint`; `Subject` label `--font-mono` `8.5px` uppercase; subject `13.5px` |
| **placeholder** | frame `opacity .55`; title `--text-faint`, italic, weight 500; icon `opacity .7` |

## 4. States

| State | Behaviour |
| --- | --- |
| `channel="push"` | iOS lock-screen glass card (blur), icon-left layout |
| `channel="in-app"` | toast banner: top header (icon·name·time·close) over copy, accent edge |
| `channel="email"` | email header (from-row + Subject label) over subject + body |
| `placeholder` | frame dims, title becomes italic "type to preview…", body hidden |
| empty `body` | body row omitted (non-placeholder) |
| stamp | `LIVE PREVIEW · <channel>` always shown via `::after` from `data-channel` |

No hover / focus / pressed / disabled — it is a non-interactive `role="figure"` (the email/push
close glyph is decorative `aria-hidden`).

## 5. Platform & relationship to root kit

**Web-only by design.** The broadcast composer lives only in the admin console (web), so there
is no native `PushPreview` and none is planned — web≡native parity does not apply. It composes
two root primitives — `BrandMark` (default icon tile) and `Icon` (the in-app close glyph) — but
is otherwise self-contained. The `push` chrome leans on `backdrop-filter: blur(20px)`, a
web-only capability, which is acceptable here precisely because the component never needs a
native render. CSS folds into the shared `dist/styles.css`.

## 6. Composition & usage

- **Composes:** `BrandMark` (default `appIcon`) and `Icon` (`close`) from the root kit.
- **Used by:** the admin broadcast composer (Growth / Overview) — wired so the preview re-renders
  on every keystroke of the composer's title/body and on channel switch.
- **Driven entirely by the composer** — keep all editing state in the composer and pass it down.

```tsx
import { PushPreview } from '@lockin90/ui/admin';

// live-wired beside the composer
<PushPreview
  appName="LockIn90"
  channel={channel}            // 'push' | 'in-app' | 'email'
  title={draft.title}
  body={draft.body}
  timeLabel="9:41"
  placeholder={!draft.title && !draft.body}
/>
```

## 7. Accessibility

- Root is `role="figure"` with `aria-label="<channel> preview"` — assistive tech announces it as
  a non-interactive preview, not a real notification.
- The `close` glyph (in-app) and icon tiles are `aria-hidden` — they are chrome, not controls.
- The preview is presentational; the actual editable controls live in the composer, which owns
  labels/focus. Don't add interactivity here.
- Contrast: title/body use `--text`/`--text-dim` on the dark card; the placeholder state is a
  deliberate low-emphasis hint, not primary content.

## 8. Usage rules — Do / Don't

**Do**
- Mirror the composer's live `channel`, `title`, `body` straight into the props.
- Use `placeholder` while the composer is empty so the preview reads as a hint, not a real message.
- Override `appIcon` only when previewing a non-LockIn90 brand; otherwise let BrandMark default.
- Keep `timeLabel` short (`now`, `9:41`).

**Don't**
- ✗ Don't add click handlers or make the card interactive — it is a preview (`role="figure"`).
- ✗ Don't hand-roll a notification card per channel — switch `channel` on this one primitive.
- ✗ Don't hardcode the glass/accent/email colours, radii, or fonts — all token-sourced.
- ✗ Don't expect a native version — it is `/admin` web-only and uses web-only `backdrop-filter`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke "fake iOS notification" or email-header mock re-creates this
  primitive and will drift from the three canonical chromes — import `PushPreview`.
- **New channel → add it here.** A new delivery surface (e.g. SMS) is a new `channel` value +
  branch on `PushPreview`, not a one-off composer component.
- **Tokens only.** The glass blur, accent gradient, email surfaces, radii, and fonts come from
  `@lockin90/tokens`.
- **Preview, not product.** This renders a *facsimile* of a notification — never reuse it to
  render a real in-product toast/banner (that's the root `Toast`/`Alert`).
