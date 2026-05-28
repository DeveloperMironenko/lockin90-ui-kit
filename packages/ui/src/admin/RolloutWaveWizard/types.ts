import type { PipelinePath, RolloutBody, RolloutResponse } from '../_vendor-types';

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
