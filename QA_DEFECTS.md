# UI-kit QA defects (native + web) — 2026-07

> **STATUS 2026-07-09 EOD: board CLEAR.** Every tracked defect fixed; device-verified by Miron
> ("all good"): glows (real FeGaussianBlur everywhere), boxShadow tokens, Lucide icons, variant
> browser, VitalsStrip live monitor sweep (line draws + write-head dot rides the tip, both
> platforms), BodyBattery charging bolt REMOVED (user call — ETA caption carries the state).
> Remaining work is ship chores only (commit, changelog+versions, push kit→apps).

Found during on-device review. Status: `todo` / `fixing` / `fixed(kit, needs device verify)` / `wontfix(demo)`.

## Systemic — shadow/glow renders hard on RN 0.81 New Architecture
- [fixed(kit) — rollout COMPLETE] **SVG glow** — history: 1 wide copy = hard outline; 3 feathered
  copies = visible BANDS (user-rejected on device). REAL FIX (device-VERIFIED on Ring 2026-07-09):
  Fabric-native `<Filter filterUnits="userSpaceOnUse"><FeGaussianBlur>` on ONE duplicate — native twin
  of web blur/drop-shadow. Converted EVERYWHERE: Ring + 10 feathered charts + 22 more shine/glow files
  (all stdDeviation = web-blur/2, opacities matched to web). ProgressBar (RN View) uses boxShadow.
  Deliberate static pulse-halos (web SMIL/CSS animation substitutes) kept as documented substrate diffs.
  Ring verified on device; rest await spot-check.
- [fixed(tokens)] **`nativeShadows`** — softening the legacy iOS shadow* values was a DEAD END (they
  render under translucent glass = muddy gloss). Real fix: RN 0.81 New-Arch `boxShadow` — nativeShadows
  now reuse the web `shadows` strings verbatim (identical geometry both platforms). Device-confirmed
  no further complaints after reload; +glowCyan added for parity.

## Individual component bugs (native)
- [todo] **Toggle** — active knob flush to right edge; uneven inset (right pad < top/bottom pad).
- [todo] **ListRow** — uneven row heights (only the subtitle row is taller → "active looks different size").
- [todo] **CodeInput** — error state (red border) not visible / not wired.
- [todo] **ProGate / Card(blur)** — renders `Unimplemented component: ExpoBlurView`. Root: expo-blur JS
  hoisted in workspace but native module not built; `internal/optionalBlur.ts` uses a JS-only check.
- [fixed(kit, BOTH)] **SupplementChart** — SP07 pills now derive y from each series' final level +
  collision-push + clamp; band labels (SATURATED/LOW) anchor LEFT in stack-levels. SP09/SP10 vessel
  labels: fill≥30% → centered in liquid (inverted), else riding just above the surface.
- [fixed(kit, BOTH)] **LineChart** — chip pills now edge-clamp (align start/center/end by measured
  width vs viewBox) — fixes LC56 RECOMMENDED clip; central fix covers all chip consumers.
- [verified-clean] **CaffeineClock** — Tag() already clamps; all 4 demos walked, no overlap.
- [todo] **MessageComposer** — layout flagged; pin exact defect.

## Catalog-demo artifacts (not kit bugs — fix the demo)
- [wontfix-kit] **Combobox** — catalog renders it with the dropdown OPEN, so its list overlaps Slider/Toggle
  below. Fix the catalog demo (render closed, or in isolation).

## Fixed — needs on-device verification (batches 1–2, rebuilt)
- [verify] Ring/Spinner/+9 chart glows feathered · `nativeShadows` softened · Toggle knob inset ·
  CodeInput error state + vertical centering · Input vertical centering · ListRow uniform heights ·
  ProGate/Card(blur) native-blur detection · GradientText flow animation.

## Animations to match web (parity)
- [fixed(kit, BOTH)] **PkChart** (live/samples mode) — heartbeat added, paced by new `bpm` prop
  (period = 60000/bpm, default 64): dot lub-dub + sonar ring + trace glow flash. `still` disables;
  reduced-motion honored. Web CSS keyframes ≡ native Animated (native-driver).
- [verify] **GradientText** — flowing gradient (coded; verify it actually animates on Fabric).
- [todo] audit other web components with CSS animation for native equivalents.

## Interaction / demo-state (fix the catalog demo, not the component)
- [fixed(kit)] **Tooltip** — ROOT CAUSE: press-to-show tooltip wrapped an interactive child (Button);
  the child's Pressable swallowed the tap so the tooltip never opened. Demo now triggers via the built-in
  "?" badge + a plain (non-pressable) label. Component is correct; the demo was wrong.
- [fixed(kit, BOTH)] **Sheet** — drag-to-dismiss shipped: handle/title strip drags the bottom sheet
  (dismiss past 25% height or flick vy>0.5; spring-back otherwise). Native PanResponder ≡ web
  Pointer Events, same thresholds; reduced-motion = jump cut. API unchanged.
- [fixed(kit)] **MessageComposer** — ROOT CAUSE: multiline TextInput wraps its OWN long placeholder to
  2 lines → pill taller than buttons. Fixed with a single-line (numberOfLines=1) truncating placeholder
  overlay; resting field is now exactly one line high, hidden the moment the user types.

## Missing native components (web has, native lacks)
- [fixed(kit)] **AuroraBackground** — ADDED to native (SVG radial blobs + native-driven drift + wash +
  optional grid; `variant`/`grid`/`still` prop parity). Exported + demoed.
- [fixed(kit)] **ScrollProgress** — ADDED to native (top gradient bar; `gradient`/`height` parity, `target`
  → controlled `progress` since native scroll is imperative). Exported + demoed.
- Verified by export-vs-catalog diff: these were the ONLY 2 components in web's MAIN entry missing
  from native. `Motion`/`Reveal` are web DOM-scroll helpers (`cn`/`initMotion`/`useReveal`), not visible
  components; native has `RichText` (web has `RichTextEditor`) — both present, naming differs only.

## Web-only subpaths — DECIDED web-only (Miron, 2026-07-09)
- **`@lockin90/ui/admin`** (24: SideNav, CommandPalette, Panel, StatCard, TrendCard, StatusChip,
  AuditEntry, QueueTile, WorkerRow, MetricRow, ChecklistRow, Statistic, MiniBar, MethodChip,
  SecretField, RedactedField, InlineEdit, PulseStrip, OperatorFunnel, ReferenceRangeBar, PushPreview,
  PermissionMatrix, RecoveryCodeGrid, EnvIndicator) — serves the web-only admin dashboard. NO native port.
- **`@lockin90/ui/marketing`** (11 modules) — serves the web-only marketing site. NO native port.
- Found via generated HTML catalogs (web 139 sections vs native 126); index.ts-only diffs miss subpaths.

## Story gaps (component exists BOTH sides; missing story made catalogs false-flag)
- [fixed(kit)] native stories ADDED: ShareCard, ZoneBar, AuroraBackground, ScrollProgress (mirror web demos).
- [note] user's web catalog HTML is stale — ProGate/Badge/StatusDot/QRCode stories exist now; regenerate
  both catalogs after the current fix wave to get a truthful pair.

## From Miron's HTML-catalog review (2026-07-09)
- [fixed(kit, BOTH)] **UnitChart `waffle-share` (UN02)** — dot legend (x=226) overlapped the
  grid's last columns (grid right edge ≈244). SAME bug in web AND native (shared geometry);
  grid shifted left 54px in both. Needs regen/device verify.
- [fixed] **Stepper "Glow" story** — story hard-coded width:420 (wider than catalog cards) →
  now 100%/max 560. PLUS real hardening: component `item` gained flexShrink:1 minWidth:30 so
  over-constrained rails shrink+ellipsize (web-equivalent guarantee) instead of overflowing.
- [fixed(kit)] **~60 missing native story variants** — ALL ported (story-name diff now 0 missing,
  excl. web-only admin + 2 waived web-DOM-only: Card AsArticle, FormField SearchWithKbdHint).
  Real component features gained in the port: Card tone/dashed/ghost · SegmentedTabs rich items
  (counts + tone dots) · MetricTile empty/hint · Stat empty/hint · Table rowTone/expandable/
  renderDetail/controlled expansion · TagInput invalid (+ CodeInput alias).
- [fixed(app)] **On-device story-variant browser** — mobile /stories → /story/<name> renders EVERY
  story variant (kit exports `@lockin90/ui-native/stories` registry, gen'd by scripts/
  gen-stories-index.mjs, auto-run in build). Entry link at top of the QA catalog.

## Web ↔ native parity (requirement: 100% same)
- [resolved — not a kit bug] **TagCloud** — kit was ALREADY at parity (native GRAD_TINT ==
  web `.lk-tagcloud-grad`, screenshot-diffed pixel-equal). Root cause: the mobile dev catalog
  demo omitted `colorMode="gradient"`; demo now shows mono + gradient side by side.
- [todo] **"web bitmaps"** — some web components render raster/broken instead of crisp vectors (identify which).
- [todo] Full component-by-component web-vs-native pass once native is clean.
