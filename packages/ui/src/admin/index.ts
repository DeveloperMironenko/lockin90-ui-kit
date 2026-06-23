// @lockin90/ui/admin — operator-console primitives for the LockIn90 admin app.
// Web-only (admin is web-only). Components emit `lk-*` classes; their CSS is folded
// into the shared dist/styles.css (no extra import). Tokens-driven (no hardcoded values).
// Imported as `import { SideNav } from '@lockin90/ui/admin'`.

// --- App shell ---
export { SideNav } from './SideNav';
export type { SideNavProps, NavItemData, NavGroupData } from './SideNav';

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
