---
"@lockin90/ui": minor
"@lockin90/ui-native": minor
---

**Web + mobile rebuild — kit gap closure (+21 primitives, 2 extensions, +12 icons).**
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
- **Social** — `SocialPost`, `EngagementBar`, `FollowButton`, `ProfileHeader`, `LeaderboardRow`, `ShareCard`.

Extended (additive, backward-compatible):
- `LineChart` — `band` (uncertainty ribbon on a shared expanded y-scale) + `dashedFromIndex`
  (dashed forecast tail). No-prop output is byte-identical to before.
- `Slider` — `labels[]` row under the rail (mood/focus scales).
- `Icon` — 60 → 72 glyphs (+5 mood faces, +7 provider logos: oura/whoop/garmin/polar/
  apple-health/dexcom/strava); `IconName` identical on both platforms.

Four requested items are covered by existing primitives (no new export) — see
`REUSE_RECIPES.md`: ConfidenceMeter→Meter, ConversationRow→ListRow,
E2EEBadge→Chip, GlycemicCurve→PkChart/band-LineChart.
