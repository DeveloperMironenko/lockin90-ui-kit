// Vendored admin domain types — the minimal shapes the @p90/ui/admin components
// render. Mirrors p90-admin/src/lib/api/admin/*.types.ts so the kit is
// self-contained; consumer apps pass their own (structurally compatible) types.

// --- parameters ---
export type ParamScalar = number | string | boolean;
export type ParamValue = ParamScalar | Record<string, ParamScalar>;

// --- pipeline ---
export type PipelinePath = 'legacy' | 'new';

export interface RolloutBody {
  fromPath: PipelinePath;
  toPath: PipelinePath;
  targetPercent: number;
  reason: string;
  dryRun?: boolean;
}

export interface RolloutResponse {
  flipped: number;
  cohortSize: number;
  sampleUserIds: number[];
  waveTimestamp: string;
  dryRun: boolean;
}

// --- comparisons ---
export type UserResultStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ContributingChange {
  generatorFamily: string;
  generatorIdA: string | null;
  generatorIdB: string | null;
  contributionA: number;
  contributionB: number;
  contributionDelta: number;
}

export interface PerDayResult {
  date: string;
  scoreA: number;
  scoreB: number;
  delta: number;
  contributingChanges: ContributingChange[];
}

export interface AggregateStats {
  meanDelta: number;
  maxAbsDelta: number;
  nDays: number;
}

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

// --- interaction-rules ---
export type TriggerType =
  | 'eventTypeMatches'
  | 'substanceIdMatches'
  | 'withinTimeWindow'
  | 'interactionWith'
  | 'slotInRange'
  | 'dayOfWeekMatches';

export type ActionType =
  | 'multiplyEffect'
  | 'suppressEffect'
  | 'addEffect'
  | 'modifyContribution'
  | 'addCarryOver';
