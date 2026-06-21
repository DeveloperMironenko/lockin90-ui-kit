// @lockin90/ui-native — Aurora Flux React Native component library.
// Peers: react-native, react-native-svg, expo-linear-gradient.

export * from './theme';

export { BrandMark } from './components/BrandMark';
export type { BrandMarkProps, BrandMarkVariant } from './components/BrandMark';
export { Card } from './components/Card';
export type { CardProps } from './components/Card';
export { Chip } from './components/Chip';
export type { ChipProps, ChipTone } from './components/Chip';
export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant } from './components/Button';
export { BarFill } from './components/BarFill';
export type { BarFillProps } from './components/BarFill';
export { GradientText } from './components/GradientText';
export type { GradientTextProps } from './components/GradientText';
export { Skeleton } from './components/Skeleton';
export type { SkeletonProps } from './components/Skeleton';
export { Stat } from './components/Stat';
export type { StatProps } from './components/Stat';
export { Pulse } from './components/Pulse';
export type { PulseProps } from './components/Pulse';
export { Divider } from './components/Divider';
export type { DividerProps } from './components/Divider';
export { HabitRow } from './components/HabitRow';
export type { HabitRowProps } from './components/HabitRow';
export { DataSourceCard } from './components/DataSourceCard';
export type { DataSourceCardProps, DataSourceStatus } from './components/DataSourceCard';
export { InsightCard } from './components/InsightCard';
export type { InsightCardProps, InsightChips } from './components/InsightCard';
export { GoalProgress } from './components/GoalProgress';
export type { GoalProgressProps, GoalDomain, GoalProgressTone } from './components/GoalProgress';
export { ActivityTimeline } from './components/ActivityTimeline';
export type {
  ActivityTimelineProps,
  ActivityTimelineItem,
  TimelineItem,
  TimelineTone,
} from './components/ActivityTimeline';
export { MealEntry } from './components/MealEntry';
export type { MealEntryProps, MealMacros } from './components/MealEntry';

// — Wave 2 —
export { CalendarHeatmap } from './components/CalendarHeatmap';
export type { CalendarHeatmapProps, CalendarDay, CalendarZone } from './components/CalendarHeatmap';
export { BiomarkerRow, BiomarkerGroupHead } from './components/BiomarkerRow';
export type { BiomarkerRowProps, BiomarkerGroupHeadProps, BiomarkerStatus, BiomarkerTrend } from './components/BiomarkerRow';
export { SupplementCard } from './components/SupplementCard';
export type { SupplementCardProps, AdherenceTone } from './components/SupplementCard';
export { AchievementBadges } from './components/AchievementBadges';
export type { AchievementBadgesProps, Achievement, AchievementTier, AchievementIcon } from './components/AchievementBadges';
export { QuickCapture, QUICK_CAPTURE_TILES } from './components/QuickCapture';
export type { QuickCaptureProps, QuickCaptureTile } from './components/QuickCapture';
export { ChangelogEntry } from './components/ChangelogEntry';
export type { ChangelogEntryProps, ChangelogGroups } from './components/ChangelogEntry';

// — Wave 3 —
export { WorkoutSetLogger } from './components/WorkoutSetLogger';
export type { WorkoutSetLoggerProps, WorkoutSet } from './components/WorkoutSetLogger';
export { ExerciseCard } from './components/ExerciseCard';
export type { ExerciseCardProps, ExerciseLevel } from './components/ExerciseCard';
export { Hypnogram } from './components/Hypnogram';
export type { HypnogramProps, SleepStage, SleepSegment, SleepStageTotal } from './components/Hypnogram';
export { CyclePhaseWheel } from './components/CyclePhaseWheel';
export type { CyclePhaseWheelProps, CyclePhase } from './components/CyclePhaseWheel';
export { AccountPanel } from './components/AccountPanel';
export type { AccountPanelProps, AccountUser, AccountRow, AccountRowIcon } from './components/AccountPanel';
export { RestTimer } from './components/RestTimer';
export type { RestTimerProps } from './components/RestTimer';

// — Wave 4 —
export { GlycemicCurve } from './components/GlycemicCurve';
export type { GlycemicCurveProps, GlycemicStat } from './components/GlycemicCurve';
export { CaffeineDecayCurve } from './components/CaffeineDecayCurve';
export type { CaffeineDecayCurveProps, PkSample, PkDose } from './components/CaffeineDecayCurve';
export { SleepDebtChart } from './components/SleepDebtChart';
export type { SleepDebtChartProps, SleepDebtChip } from './components/SleepDebtChart';
export { CheckinSliders } from './components/CheckinSliders';
export type { CheckinSlidersProps, CheckinSlider, CheckinComposite } from './components/CheckinSliders';
export { CoverageMatrix } from './components/CoverageMatrix';
export type { CoverageMatrixProps, CoverageCell } from './components/CoverageMatrix';
export { NotificationCenter } from './components/NotificationCenter';
export type { NotificationCenterProps, NotifItem, NotifFilter, NotifType } from './components/NotificationCenter';

// — Wave 5 —
export { OnboardingWizard } from './components/OnboardingWizard';
export type { OnboardingWizardProps, OnboardingStep, OnboardingProvider } from './components/OnboardingWizard';
export { ActiveSubstanceCard } from './components/ActiveSubstanceCard';
export type { ActiveSubstanceCardProps, ActiveSubstance } from './components/ActiveSubstanceCard';
export { MacroRings } from './components/MacroRings';
export type { MacroRingsProps, Macro } from './components/MacroRings';
export { EnergyForecast } from './components/EnergyForecast';
export type { EnergyForecastProps } from './components/EnergyForecast';
export { GeneticInsightCard } from './components/GeneticInsightCard';
export type { GeneticInsightCardProps, GeneInsight } from './components/GeneticInsightCard';
export { BillingCard } from './components/BillingCard';
export type { BillingCardProps, BillingPaymentCard, BillingQuota } from './components/BillingCard';

// — Wave 6 —
export { PendingPatternCard } from './components/PendingPatternCard';
export type { PendingPatternCardProps, PendingPatternChips } from './components/PendingPatternCard';
export { DayTimeline } from './components/DayTimeline';
export type { DayTimelineProps, DayBlock, DayLegendItem } from './components/DayTimeline';
export { MuscleMap } from './components/MuscleMap';
export type { MuscleMapProps, MuscleGroup, MuscleTone } from './components/MuscleMap';
export { SymptomGrid } from './components/SymptomGrid';
export type { SymptomGridProps, SymptomTile, SymptomRecent } from './components/SymptomGrid';
export { ReauthSheet } from './components/ReauthSheet';
export type { ReauthSheetProps, ReauthAction } from './components/ReauthSheet';
export { TagCloud } from './components/TagCloud';
export type { TagCloudProps, TagCloudItem, TagSize } from './components/TagCloud';

// — Wave 7 —
export { ProfileHeader } from './components/ProfileHeader';
export type { ProfileHeaderProps, ProfileUser, ProfileStat } from './components/ProfileHeader';
export { FeedPost } from './components/FeedPost';
export type { FeedPostProps, FeedPostAuthor, FeedPostEngagement } from './components/FeedPost';
export { Leaderboard } from './components/Leaderboard';
export type { LeaderboardProps, LeaderboardRow } from './components/Leaderboard';
export { ShareCard } from './components/ShareCard';
export type { ShareCardProps, ShareTarget } from './components/ShareCard';
export { ConversationList } from './components/ConversationList';
export type { ConversationListProps, ConvThread, ConvFollow } from './components/ConversationList';
export { AiRationaleCard } from './components/AiRationaleCard';
export type { AiRationaleCardProps, AiFactor, AiProseSegment } from './components/AiRationaleCard';
