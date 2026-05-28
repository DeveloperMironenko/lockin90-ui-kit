import type { ReactNode } from 'react';

export interface ApprovalTimelineEntry {
  id: string;
  /** ISO timestamp the event happened at. */
  at: string;
  /** Operator email or display name. */
  actor: string;
  /** Short verb-phrase: e.g. "approved canary scope" or "rolled back". */
  action: string;
  /** Optional secondary line (affected users, comparison links, etc.). */
  detail?: ReactNode;
  /** Pill tint to render at the dot. Defaults to neutral. */
  tone?: 'approved' | 'rolled_back' | 'neutral';
}

export interface ApprovalTimelineProps {
  entries: ApprovalTimelineEntry[];
  className?: string;
}
