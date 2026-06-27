# SDD — `RedactedField`

> **Package:** `@lockin90/ui/admin` — web-only operator-console primitive (admin app is web-only). **Import as** `import { RedactedField } from '@lockin90/ui/admin'`.
> **Source:** `packages/ui/src/admin/RedactedField.tsx` · web CSS `packages/ui/src/styles/components/redacted.css` (`.lk-redacted*`). NO native counterpart.
> **Exports:** `RedactedField`, type `RedactedFieldProps`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (admin) — no native surface by design.
> **Stories:** `packages/ui/src/stories/AdminFields.stories.tsx`.

---

## 1. Overview

A hatched/striped pill communicating **"contents encrypted — unreadable"**. Operators see it in place
of E2EE coach-DM bodies: a `lock` glyph + a diagonally-striped surface signal *you cannot see this*.
Two tones: `default` (neutral/faint) and `danger` (bad-tinted, for flagged/abuse contexts). Matches
the `.redacted` pill from `lockin90-design/admin/moderation.html`.

It is presentational only — there is no value to reveal (unlike `SecretField`, which masks a secret the
operator *could* reveal; `RedactedField` stands in for content the operator fundamentally **cannot** read).

## 2. API contract

**`RedactedFieldProps`**

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | `'Encrypted — unreadable'` | visible label; also set as the `title` tooltip |
| `tone` | `'default' \| 'danger'` | `'default'` | `default` = neutral/faint; `danger` = bad-tinted |

- A `TONE_CLASS` record maps the tone to its modifier (`lk-redacted-default` / `lk-redacted-danger`).
- Renders `<span class="lk-redacted …" title={label}>` containing an `Icon name="lock"` + the label
  `<span>`. No `className`, no `...rest` — a closed component.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Value / token |
| --- | --- |
| Pill | inline-flex `gap: 6px`, `padding: 2px 9px`, `border: 1px solid --border`, radius `--r-sm` |
| Font | `--font-mono` 11px, `letter-spacing: .12em` |
| Lock icon | `Icon name="lock" size={12}`, `opacity: .85`, `stroke-width: 1.8` (`aria-hidden`) |
| Hatching | `repeating-linear-gradient(45deg, rgba(255,255,255,.05) 0 6px, transparent 6px 12px)` over `--glass-2` |

**Per-tone:**

| Tone | Text | Border | Surface |
| --- | --- | --- | --- |
| `default` | `--text-faint` | `--border-2` | white-hatch over `--glass-2` |
| `danger` | `--bad` | `rgba(255,77,109,.35)` | `rgba(255,77,109,.1)` hatch over `rgba(255,77,109,.06)` |

The diagonal hatching (45° repeating stripes) is the load-bearing visual cue: it makes the
"unreadable" state unmistakable at a glance versus a plain pill.

## 4. States

Presentational only — **no interactive states** (no hover/focus/pressed/disabled). The only variation
is the `tone` modifier. No animation, so reduced-motion is N/A. It is a `<span>`, not a control.

## 5. Platform & relationship to root kit

**Web-only by design.** It appears in the moderation/operator console reviewing E2EE coach-DM
threads, which has no native surface — so there is no `@lockin90/ui-native` counterpart and no parity
obligation. It composes one **root** primitive, `Icon` (the `lock` glyph), and wraps no root component.
It is intentionally distinct from `SecretField` (revealable secret) and from a generic status `Badge`
(it carries the hatch-pattern "encrypted" semantics).

## 6. Composition & usage

- **Used by:** the moderation console wherever an E2EE message body would otherwise render — the
  operator sees the redacted pill instead of plaintext.
- **Composes:** `Icon`.

```tsx
import { RedactedField } from '@lockin90/ui/admin';

// default — neutral stand-in for an encrypted DM body
<RedactedField />

// danger — flagged / reported thread
<RedactedField tone="danger" label="Reported — encrypted body" />
```

## 7. Accessibility

- The visible `label` text is real, readable content (read by screen readers verbatim); the same
  string is mirrored to the `title` attribute as a hover tooltip.
- The lock icon is `aria-hidden` (decorative reinforcement).
- Tone is communicated by an always-present text label (never colour alone) — colour-blind safe.
- Not focusable / not interactive — correct for a static stand-in.

## 8. Usage rules — Do / Don't

**Do**
- Use it everywhere an unreadable E2EE body would otherwise be shown — never render ciphertext or a
  placeholder string.
- Use `tone="danger"` for flagged/reported contexts; keep `default` for routine encrypted content.
- Override `label` to add context (e.g. "Reported — encrypted body") when helpful.

**Don't**
- ✗ Don't hand-roll a "🔒 encrypted" pill — use `RedactedField`.
- ✗ Don't use it to mask a secret the operator may reveal — that's `SecretField`.
- ✗ Don't hardcode the hatch gradient, border, or tone colors — `--glass-2`, `--border-2`, `--bad`
  come from tokens.
- ✗ Don't add a reveal affordance — the content is fundamentally unreadable by design.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A local striped "encrypted" chip will drift from the hatch pattern and tone
  palette — import `RedactedField`.
- **New need → add a tone here.** If a new context needs a different tint, add a `tone` value +
  modifier class — never a one-off pill at the call site.
- **Tokens only.** Hatch overlay, surface, border, and `danger` red come from `@lockin90/tokens`;
  hardcoded equivalents are bugs.
- **Web-only.** Admin primitive — no native counterpart, no parity to hold.
