export interface KAnonymizedNoticeProps {
  /** The cohort size the backend returned. Surface this so the analyst sees the gap. */
  cohortSize?: number;
  /** The minimum bucket size for results to be shown. Defaults to 10 per backend K_THRESHOLD. */
  threshold?: number;
  /** Optional label for the bucket / cell so the notice can say what's missing. */
  bucketLabel?: string;
  className?: string;
}
