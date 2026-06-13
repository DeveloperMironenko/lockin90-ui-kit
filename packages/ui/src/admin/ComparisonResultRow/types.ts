// Self-contained admin domain shapes the ComparisonResultRow renders. These
// mirror lockin90-admin's comparison result types so the kit needs no shared
// vendor module; consumer apps pass their own (structurally compatible) values.

/** Lifecycle of a single per-user replay/compare job. */
export type UserResultStatus = 'pending' | 'running' | 'completed' | 'failed';

/** One generator family's contribution on a given day, version A vs B. */
export interface ContributingChange {
  generatorFamily: string;
  generatorIdA: string | null;
  generatorIdB: string | null;
  contributionA: number;
  contributionB: number;
  contributionDelta: number;
}

/** Per-day score delta between the two compared versions. */
export interface PerDayResult {
  date: string;
  scoreA: number;
  scoreB: number;
  delta: number;
  contributingChanges: ContributingChange[];
}

/** Roll-up across the compared interval. */
export interface AggregateStats {
  meanDelta: number;
  maxAbsDelta: number;
  nDays: number;
}

/** A single user's A/B comparison result row. */
export interface ComparisonUserResult {
  id: string;
  comparisonRunId: string;
  userId: number;
  versionA: string;
  versionB: string;
  intervalFrom: string;
  intervalTo: string;
  status: UserResultStatus;
  perDayResults: PerDayResult[] | null;
  aggregateStats: AggregateStats | null;
  error: string | null;
  startedAt: string | null;
  completedAt: string | null;
}

export interface ComparisonResultRowProps {
  result: ComparisonUserResult;
  /** Optional click handler — wires to the per-user drill-in (future). */
  onClick?: (result: ComparisonUserResult) => void;
}
