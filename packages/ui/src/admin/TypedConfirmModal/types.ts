import type { ReactNode } from 'react';

export interface TypedConfirmModalProps {
  open: boolean;
  /** Modal title — e.g. "Rollback approval". */
  title: string;
  /** Human-readable warning copy describing the action's effect. */
  consequence: ReactNode;
  /**
   * Verbatim string the operator must type into the confirm input.
   * For the bulk-recompute endpoint, this is `I-CONFIRM-BULK-RECOMPUTE-ALL`.
   * For versioning rollback we surface the version id; etc.
   */
  expected: string;
  /** Label rendered above the typing input. */
  promptLabel?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Treat the action as destructive — uses the accent tone for the eyebrow + button. */
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
