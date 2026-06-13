import type { CSSProperties } from 'react';
import { cn } from '../../cn';
import type { KAnonymizedNoticeProps } from './types';

export type { KAnonymizedNoticeProps } from './types';

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
  const wrap: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '12px 16px',
    border: '1px solid rgba(255,176,32,.4)',
    borderRadius: 'var(--r)',
    background: 'rgba(255,176,32,.1)',
  };
  const tag: CSSProperties = {
    flexShrink: 0,
    marginTop: 2,
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'var(--warn)',
  };
  const body: CSSProperties = {
    fontSize: 12,
    color: 'var(--text-dim)',
    lineHeight: 1.6,
  };
  const meta: CSSProperties = {
    marginTop: 4,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--text-faint)',
  };

  return (
    <div role="status" className={cn(className)} style={wrap}>
      <span style={tag}>INSUFFICIENT DATA</span>
      <div style={body}>
        {bucketLabel ? (
          <>
            The <span style={{ color: 'var(--text)' }}>{bucketLabel}</span> bucket is suppressed for
            privacy.
          </>
        ) : (
          <>This cohort is suppressed for privacy.</>
        )}
        <div style={meta}>
          k-anonymity threshold: {threshold} users
          {typeof cohortSize === 'number' && <> · cohort size: {cohortSize}</>}
        </div>
      </div>
    </div>
  );
}
