# Component SDDs — LockIn90 UI Kit

Per-component **spec + usage rules** for every primitive in `@lockin90/ui` (web) ↔
`@lockin90/ui-native` (native), plus the web-only `@lockin90/ui/admin` and `@lockin90/ui/marketing`
sub-packages. One file per component, full 9-section format. These are the **rules of engagement**:
the contract (props/tokens/states), the web↔native parity verdict, and — most importantly — the
**Do/Don't + lookalike-ban** that keep apps from hand-rolling or diverging.

- **Format & token vocabulary:** [`CONVENTIONS.md`](./CONVENTIONS.md)
- **Skeleton for new components:** [`TEMPLATE.md`](./TEMPLATE.md)
- **Gold-standard reference:** [`Button.md`](./Button.md)

> **When you add or change a component, write/update its SDD in the same unit of work.** A component
> without a current SDD is treated like a component without a test — not done. Code-grounded only:
> every prop/token/value comes from the source.

Parity legend: ✅ identical API · 🟡 same API, platform-shaped impl · 🔵 capability gap on native ·
🖥️ web-only (admin/marketing).

---

## Foundations & brand
[BrandMark](./BrandMark.md) · [GradientText](./GradientText.md) · [Icon](./Icon.md) ·
[Divider](./Divider.md) · [Pulse](./Pulse.md) · [Skeleton](./Skeleton.md) · [Avatar](./Avatar.md) ·
[AvatarStack](./AvatarStack.md) · [Eyebrow](./Eyebrow.md) · [AuroraBackground](./AuroraBackground.md) ·
[ScrollProgress](./ScrollProgress.md) · [VersionBadge](./VersionBadge.md) · [QRCode](./QRCode.md) ·
[ShareCard](./ShareCard.md)

## Buttons & form inputs
[Button](./Button.md) · [SplitButton](./SplitButton.md) · [Input](./Input.md) ·
[PasswordInput](./PasswordInput.md) · [FormField](./FormField.md) (+ SearchInput) ·
[NoteField](./NoteField.md) · [Checkbox](./Checkbox.md) (+ Radio/RadioGroup) · [Toggle](./Toggle.md) ·
[Slider](./Slider.md) · [Select](./Select.md) · [DateField](./DateField.md) (+ TreeItem) ·
[TagInput](./TagInput.md) (+ CodeInput) · [Stepper](./Stepper.md) (+ NumberStepper) ·
[Combobox](./Combobox.md) · [CharCounter](./CharCounter.md) ·
[PasswordStrengthMeter](./PasswordStrengthMeter.md) · [ColorPicker](./ColorPicker.md) ·
[CodeField](./CodeField.md)

## Data display & charts
[Card](./Card.md) · [Stat](./Stat.md) · [MetricTile](./MetricTile.md) (+ ProgressDots) ·
[KeyValue](./KeyValue.md) (+ StatusDot) · [Chip](./Chip.md) · [ChoiceChip](./ChoiceChip.md) ·
[Meter](./Meter.md) · [DeltaPill](./DeltaPill.md) · [Highlight](./Highlight.md) ·
[TagCloud](./TagCloud.md) · [Ring](./Ring.md) · [BarFill](./BarFill.md) ·
[ProgressBar](./ProgressBar.md) · [Sparkline](./Sparkline.md) · [BarChart](./BarChart.md) ·
[LineChart](./LineChart.md) · [DonutChart](./DonutChart.md) · [Gauge](./Gauge.md) ·
[StackedBar](./StackedBar.md) · [RangeBar](./RangeBar.md) · [Heatmap](./Heatmap.md) ·
[Hypnogram](./Hypnogram.md) · [PhaseWheel](./PhaseWheel.md) · [PkChart](./PkChart.md) ·
[Table](./Table.md) · [CodeBlock](./CodeBlock.md) · [Countdown](./Countdown.md)

## Navigation & layout
[TabBar](./TabBar.md) (+ FAB) · [Tabs](./Tabs.md) · [SegmentedTabs](./SegmentedTabs.md) ·
[Pagination](./Pagination.md) (+ Breadcrumb) · [BackLink](./BackLink.md) · [Toolbar](./Toolbar.md)
(+ Dropzone) · [ListRow](./ListRow.md) · [Timeline](./Timeline.md) · [Accordion](./Accordion.md) ·
[DayTimelineBlocks](./DayTimelineBlocks.md)

## Overlays & feedback
[Modal](./Modal.md) · [Sheet](./Sheet.md) · [Popover](./Popover.md) (+ CopyButton) ·
[Menu](./Menu.md) · [Tooltip](./Tooltip.md) · [Toast](./Toast.md) (+ Badge) · [Alert](./Alert.md) ·
[EmptyState](./EmptyState.md) · [ProGate](./ProGate.md) · [LockedRow](./LockedRow.md) ·
[ReauthDialog](./ReauthDialog.md) · [Spinner](./Spinner.md) · [DotsLoader](./DotsLoader.md)

## Domain · messaging · AI · social · billing
[MuscleDiagram](./MuscleDiagram.md) · [MessageBubble](./MessageBubble.md) ·
[MessageComposer](./MessageComposer.md) · [TypingIndicator](./TypingIndicator.md) ·
[InsightCard](./InsightCard.md) · [PendingPatternCard](./PendingPatternCard.md) ·
[EffectAttributionLine](./EffectAttributionLine.md) · [ForecastCallout](./ForecastCallout.md) ·
[AchievementBadge](./AchievementBadge.md) · [PricingTierCard](./PricingTierCard.md) ·
[CreditCardVisual](./CreditCardVisual.md) · [EngagementBar](./EngagementBar.md) ·
[FollowButton](./FollowButton.md) · [LeaderboardRow](./LeaderboardRow.md) ·
[VideoThumbnail](./VideoThumbnail.md) · [FocalPointPicker](./FocalPointPicker.md) ·
[RichTextEditor](./RichTextEditor.md) · [Sortable](./Sortable.md)

## Admin — `@lockin90/ui/admin` (web-only operator console)
[SideNav](./admin/SideNav.md) · [MethodChip](./admin/MethodChip.md) ·
[SecretField](./admin/SecretField.md) · [RedactedField](./admin/RedactedField.md) ·
[InlineEdit](./admin/InlineEdit.md) · [PulseStrip](./admin/PulseStrip.md) ·
[FunnelChart](./admin/FunnelChart.md) · [ReferenceRangeBar](./admin/ReferenceRangeBar.md) ·
[PushPreview](./admin/PushPreview.md) · [PermissionMatrix](./admin/PermissionMatrix.md)
(+ MatrixToggle) · [RecoveryCodeGrid](./admin/RecoveryCodeGrid.md)

## Marketing — `@lockin90/ui/marketing` (web-only)
[Container](./marketing/Container.md) · [Section](./marketing/Section.md) (+ SectionHeader) ·
[Card](./marketing/Card.md) · [Pill](./marketing/Pill.md) · [Stat](./marketing/Stat.md) ·
[Icon](./marketing/Icon.md) · [IconBadge](./marketing/IconBadge.md) ·
[Typography](./marketing/Typography.md) (Heading/Body/Lead/Eyebrow/Mono) ·
[Accordion](./marketing/Accordion.md) · [Field](./marketing/Field.md) (Input/Textarea) ·
[Reveal](./marketing/Reveal.md)

---

## Parity debts surfaced while authoring these SDDs

The audit read every web + native implementation and flagged these **real divergences** (documented
in the relevant SDD's §5/§9, **not** silently fixed — each is its own scoped follow-up):

| Component | Debt |
| --- | --- |
| [Select](./Select.md) | Selected option + checkmark use `--accent-2` (cyan) on web vs `colors.accent` (violet) on native — align the token. |
| [TagInput](./TagInput.md) | Tag-pill text `--mint` (web) vs `colors.accent2` cyan (native); native `TagInput`/`CodeInput` omit the `invalid` prop (no native error state). |
| [ProGate](./ProGate.md) | **Native-only** — there is no web `ProGate` component (web exports only `LockedRow`); native's "web blurs" doc-comment references a component that doesn't ship. Add a web `ProGate`. |
| [Table](./Table.md) | `rowTone` + the entire `expandable`/`renderDetail`/`expandedKeys` detail-row system are web-only (not implemented on native). |
| [Stat](./Stat.md) / [MetricTile](./MetricTile.md) | Native lacks the `empty`/`hint` placeholder mode web has; `Stat` value is `string` (native) vs `ReactNode` (web). |
| [ReauthDialog](./ReauthDialog.md) | Native Google button is a hand-rolled `Pressable` lookalike — should use `Button` + `leading` (lookalike-ban). |
| [SegmentedTabs](./SegmentedTabs.md) | Rich item form (`count` badge + `tone` dot) is web-only; native `tabs` is `string[]`. |
| [marketing/Field](./marketing/Field.md) | The glass control surface for `.lk-input`/`.lk-textarea` isn't shipped in-kit (relies on consuming app CSS); no `...rest` forwarding (a11y gap). |

> These are **observations to triage**, not part of this docs task. Raise each as its own change
> (with approval) per the scope rule before touching shared component code.
