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
