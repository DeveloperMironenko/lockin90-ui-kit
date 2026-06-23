import { cn } from '../cn';

/* MethodChip — a fixed-width mono HTTP-method chip, tinted per method. Used in
   the operator API explorer and the errors-by-endpoint table to label routes.
   Web-only (admin has no native surface). Matches the `.method-chip` chips from
   lockin90-design/admin/system.html. */

/** The HTTP verb the chip labels. */
export type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface MethodChipProps {
  /** The HTTP method — drives both the label and the colour mapping. */
  method: Method;
}

/** Per-method modifier class (colour mapping lives in methodchip.css). */
const METHOD_CLASS: Record<Method, string> = {
  GET: 'lk-method-get',
  POST: 'lk-method-post',
  PATCH: 'lk-method-patch',
  PUT: 'lk-method-put',
  DELETE: 'lk-method-delete',
};

/**
 * Fixed-width, uppercase, mono chip labelling an HTTP method. GET=mint,
 * POST=cyan, PATCH=amber, PUT=violet, DELETE=red — tinted bg + border + text
 * in the method colour.
 */
export function MethodChip({ method }: MethodChipProps) {
  return <span className={cn('lk-method-chip', METHOD_CLASS[method])}>{method}</span>;
}
