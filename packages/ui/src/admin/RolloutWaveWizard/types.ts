// Self-contained admin domain shapes the RolloutWaveWizard drives. These mirror
// lockin90-admin's pipeline-rollout types so the kit needs no shared vendor
// module; consumer apps pass their own (structurally compatible) resolvers.

/** Which estimation pipeline a user is routed through. */
export type PipelinePath = 'legacy' | 'new';

/** Request body for `POST /admin/pipeline/rollout`. */
export interface RolloutBody {
  fromPath: PipelinePath;
  toPath: PipelinePath;
  targetPercent: number;
  reason: string;
  dryRun?: boolean;
}

/** Response from a dry-run or committed rollout wave. */
export interface RolloutResponse {
  flipped: number;
  cohortSize: number;
  sampleUserIds: number[];
  waveTimestamp: string;
  dryRun: boolean;
}

export interface RolloutWaveWizardProps {
  /** Current distribution snapshot, used to size the wave preview. */
  totals?: { legacyCount: number; newCount: number };
  /** Dry-run resolver — wires to `POST /admin/pipeline/rollout` with `dryRun: true`. */
  onDryRun: (body: RolloutBody) => Promise<RolloutResponse>;
  /** Commit resolver — wires to `POST /admin/pipeline/rollout` with `dryRun: false`. */
  onCommit: (body: RolloutBody) => Promise<RolloutResponse>;
  /** Optional terminal callback once the commit succeeds. */
  onCompleted?: (result: RolloutResponse) => void;
}

export type WizardStep = 'paths' | 'wave' | 'preview' | 'confirm';

export type WizardState =
  | { step: 'paths'; fromPath?: PipelinePath; toPath?: PipelinePath }
  | { step: 'wave'; fromPath: PipelinePath; toPath: PipelinePath; targetPercent: number; reason: string }
  | {
      step: 'preview';
      fromPath: PipelinePath;
      toPath: PipelinePath;
      targetPercent: number;
      reason: string;
      preview: RolloutResponse;
    }
  | {
      step: 'confirm';
      fromPath: PipelinePath;
      toPath: PipelinePath;
      targetPercent: number;
      reason: string;
      preview: RolloutResponse;
    };
