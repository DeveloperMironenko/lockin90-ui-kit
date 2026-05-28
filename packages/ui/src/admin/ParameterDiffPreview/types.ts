import type { ParamValue } from '../_vendor-types';

export interface ParameterDiffPreviewProps {
  /** Family + key being edited. Surfaced in the header for context. */
  family: string;
  paramKey: string;
  /** Currently-active value (server-truth). May be undefined for first-write. */
  before: ParamValue | undefined;
  /** Pending value (operator input). */
  after: ParamValue;
  /** The version number the PATCH will create. Surfaced so the operator sees
   *  "This will create version N" before submitting. */
  nextVersion?: number;
  className?: string;
}
