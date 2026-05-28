import type { ComparisonUserResult } from '../_vendor-types';

export interface ComparisonResultRowProps {
  result: ComparisonUserResult;
  /** Optional click handler — wires to the per-user drill-in (future). */
  onClick?: (result: ComparisonUserResult) => void;
}
