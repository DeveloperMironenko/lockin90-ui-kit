// Parameter value shapes the diff preview renders. Inlined here (rather than
// imported from a shared admin vendor-types module) so the component dir is
// self-contained; consumer apps pass their own structurally-compatible values.
export type ParamScalar = number | string | boolean;
export type ParamValue = ParamScalar | Record<string, ParamScalar>;

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
