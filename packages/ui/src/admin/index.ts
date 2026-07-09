// @lockin90/ui/admin — operator-console primitives for the LockIn90 admin app.
// Web-only (admin is web-only). Components emit `lk-*` classes; their CSS is folded
// into the shared dist/styles.css (no extra import). Tokens-driven (no hardcoded values).
// Imported as `import { SideNav } from '@lockin90/ui/admin'`.

// --- App shell ---
export { SideNav } from './SideNav';
export type { SideNavProps, NavItemData, NavGroupData } from './SideNav';
export { CommandPalette } from './CommandPalette';
export type { CommandPaletteProps, CommandPaletteItem } from './CommandPalette';
export { Panel } from './Panel';
export type { PanelProps } from './Panel';

// --- Overview / dashboard ---
export { StatCard } from './StatCard';
export type { StatCardProps, StatDeltaDir, StatValueTone } from './StatCard';
export { TrendCard, type TrendCardProps, type SparkDeltaDir } from './TrendCard';
/** @deprecated Renamed to `TrendCard` — it is a titled stat+area-chart card, not a
 *  bare sparkline, and clashed with the root cross-platform `Sparkline`. Use `TrendCard`. */
export { TrendCard as Sparkline } from './TrendCard';
/** @deprecated Renamed to `TrendCardProps`. Use `TrendCardProps`. */
export type { TrendCardProps as SparklineProps } from './TrendCard';
export { StatusChip } from './StatusChip';
export type { StatusChipProps, StatusChipTone } from './StatusChip';
export { AuditEntry } from './AuditEntry';
export type { AuditEntryProps } from './AuditEntry';
export { QueueTile } from './QueueTile';
export type { QueueTileProps, QueueTileTone } from './QueueTile';
export { WorkerRow } from './WorkerRow';
export type { WorkerRowProps, WorkerTone } from './WorkerRow';
export { MetricRow } from './MetricRow';
export type { MetricRowProps } from './MetricRow';
export { ChecklistRow } from './ChecklistRow';
export type { ChecklistRowProps } from './ChecklistRow';
export { Statistic } from './Statistic';
export type { StatisticProps, StatisticSize, StatisticTone } from './Statistic';
export { MiniBar } from './MiniBar';
export type { MiniBarProps, MiniBarTone } from './MiniBar';

// --- Data / display ---
export { MethodChip, type MethodChipProps, type Method } from './MethodChip';
export { SecretField, type SecretFieldProps } from './SecretField';
export { RedactedField, type RedactedFieldProps } from './RedactedField';
export { InlineEdit, type InlineEditProps } from './InlineEdit';
export { PulseStrip, type PulseStripProps, type PulseStripItem } from './PulseStrip';

// --- Charts / widgets ---
export { OperatorFunnel, type OperatorFunnelProps, type FunnelStep } from './OperatorFunnel';
/** @deprecated Renamed to `OperatorFunnel` to avoid clashing with the root
 *  `@lockin90/ui` chart `FunnelChart`. Import `OperatorFunnel` instead. */
export { OperatorFunnel as FunnelChart } from './OperatorFunnel';
/** @deprecated Renamed to `OperatorFunnelProps`. Use `OperatorFunnelProps`. */
export type { OperatorFunnelProps as FunnelChartProps } from './OperatorFunnel';
export { ReferenceRangeBar, type ReferenceRangeBarProps } from './ReferenceRangeBar';
export { PushPreview, type PushPreviewProps } from './PushPreview';

// --- Settings / security ---
export {
  PermissionMatrix,
  MatrixToggle,
  type PermissionMatrixProps,
  type MatrixToggleProps,
  type MatrixState,
  type MatrixRow,
  type MatrixCol,
} from './PermissionMatrix';
export { RecoveryCodeGrid, type RecoveryCodeGridProps } from './RecoveryCodeGrid';
