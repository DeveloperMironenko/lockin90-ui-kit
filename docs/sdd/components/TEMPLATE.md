# SDD — `<ComponentName>` (+ `<SecondaryExport>` cross-ref if any)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> _(Admin: `@lockin90/ui/admin` — web-only. Marketing: `@lockin90/ui/marketing` — web-only. State the truth.)_
> **Source:** `packages/ui/src/components/<X>.tsx` · `packages/ui-native/src/components/<X>.tsx` · web CSS `packages/ui/src/styles/...` (the real class/file).
> **Exports:** `<X>`, type `<X>Props`, … (every symbol the index re-exports from this file).
> **Status:** Shipped. **Parity:** ✅ identical API · 🟡 same API/platform-shaped impl · 🔵 capability gap on native — pick one + one-line reason.
> **Stories:** `packages/ui/src/stories/<X>.stories.tsx` · native equivalent.

---

## 1. Overview
What the component is, its role in the system, the variants it offers, and the one-sentence "why it exists / when to reach for it". If it has secondary exports (e.g. `Radio` lives in `Checkbox.tsx`), name them and their role.

## 2. API contract
A full prop table: **every** prop, its type/union, default, web?, native?, and a note. Mark platform-shaped props (e.g. web `children` ↔ native `title`/`label`). Note `forwardRef`, `Omit<...>`, what `...rest` spreads to (HTML attrs / PressableProps). List secondary exports' props too.

## 3. Visual spec (tokens — never hardcode)
Exact tokens used: colors/gradients (`--grad-cta` / `gradients.cta`), radii (`--r-md` / `radii.md`), spacing (real px), typography (`--font-ui/display/mono` / `fonts.*`), shadows (`--glow-*` / `nativeShadows.*`). Give the REAL values from source (read the CSS + StyleSheet). Tables welcome.

## 4. States
Default / hover (web) / pressed·active / focus / disabled / loading / empty / error / selected — only those that apply. Web vs native column where they differ. Cite the real class (`:disabled`, `pressed`, etc.).

## 5. Web ↔ native parity
The verdict (✅/🟡/🔵) + WHY, grounded in the actual two implementations. List each real difference (substrate-only vs genuine capability gap) and whether it blocks use. If 🔵, say exactly what native can't do and why (e.g. no `backdrop-filter`, no drag-drop, no clipboard paste).

## 6. Composition & usage
Where it's used / what composes it, what it composes from (other kit primitives), and 1–2 short `tsx` examples (web + native). Note REUSE_RECIPES patterns if relevant.

## 7. Accessibility
Web roles/aria/focus/keyboard; native `accessibilityRole`/`accessibilityLabel`/`accessibilityState`; hit-target size; contrast notes. Be concrete to THIS component.

## 8. Usage rules — Do / Don't
Bulleted **Do** and **Don't**. The Don'ts are the enforceable rules (one primary per screen, correct prop per platform, etc.).

## 9. Anti-patterns & lookalike ban
The governance teeth: no hand-rolled lookalikes, add-a-variant-on-both-platforms instead of a one-off, tokens-only, and the parity gate before shipping. Tailor to this component.

---

### Authoring rules for this SDD (delete this block in the final file)
- **Code-grounded only.** READ the real web + native source (and the CSS for web visuals) before writing. Every prop, token, and px value must come from the code — no guessing, no inventing props.
- **Parity must be the truth.** Diff the two implementations yourself; the badge + §5 must match what the code actually does (use COMPONENT-INVENTORY.md's parity column as a hint, but verify).
- Keep `tsx` examples real (valid props only).
- ~120–260 lines. Terse, technical, accurate. Match `Button.md` exactly in structure and tone.
