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
export { Sparkline } from './Sparkline';
export type { SparklineProps, SparkDeltaDir } from './Sparkline';
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
export { FunnelChart, type FunnelChartProps, type FunnelStep } from './FunnelChart';
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
