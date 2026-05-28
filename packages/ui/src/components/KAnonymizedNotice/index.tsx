import type { KAnonymizedNoticeProps } from './types';

/**
 * Inline notice surfaced when a cohort or per-bucket cell sits below the
 * k-anonymization threshold (default 10) and the backend has suppressed the
 * payload. The analyst MUST see this rather than a zero — zero implies "no
 * users landed here" which is qualitatively different from "we cannot tell
 * you who landed here without leaking identity".
 */
export default function KAnonymizedNotice({
  cohortSize,
  threshold = 10,
  bucketLabel,
  className,
}: KAnonymizedNoticeProps) {
  return (
    <div
      role="status"
      className={`bg-amber-zone/10 border border-amber-zone/40 rounded px-4 py-3 flex items-start gap-3 ${className ?? ''}`}
    >
      <span className="font-display italic font-bold text-[10px] tracking-[0.12em] uppercase text-amber-zone shrink-0 mt-1">
        INSUFFICIENT DATA
      </span>
      <div className="text-[12px] text-secondary leading-relaxed">
        {bucketLabel ? (
          <>
            The <span className="text-white">{bucketLabel}</span> bucket is suppressed for privacy.
          </>
        ) : (
          <>This cohort is suppressed for privacy.</>
        )}
        <div className="font-mono text-[11px] text-muted mt-1">
          k-anonymity threshold: {threshold} users
          {typeof cohortSize === 'number' && <> · cohort size: {cohortSize}</>}
        </div>
      </div>
    </div>
  );
}
