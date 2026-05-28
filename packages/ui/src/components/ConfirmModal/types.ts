import type { ReactNode } from 'react';

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  consequence: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  reauthRequired?: boolean;
  /** Overrides the default re-auth note text (admin shows a confirmed/required variant). */
  reauthNote?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  /** Disables the confirm button without the loading spinner (e.g. a required field is empty). */
  confirmDisabled?: boolean;
}
