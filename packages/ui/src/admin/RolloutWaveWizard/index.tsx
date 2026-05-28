'use client';

import { useState } from 'react';
import { Button } from '../../components/Button';
import { FormRow } from '../../components/FormRow';
import { Input, NumberInput } from '../../components/Input';
import { Mono } from '../../components/Typography';
import TypedConfirmModal from '../TypedConfirmModal';
import type { PipelinePath, RolloutBody, RolloutResponse } from '../_vendor-types';
import type { RolloutWaveWizardProps } from './types';

type Step = 'paths' | 'wave' | 'preview';

export default function RolloutWaveWizard({
  totals,
  onDryRun,
  onCommit,
  onCompleted,
}: RolloutWaveWizardProps) {
  const [step, setStep] = useState<Step>('paths');
  const [fromPath, setFromPath] = useState<PipelinePath>('legacy');
  const [toPath, setToPath] = useState<PipelinePath>('new');
  const [targetPercent, setTargetPercent] = useState<string>('5');
  const [reason, setReason] = useState<string>('');
  const [preview, setPreview] = useState<RolloutResponse | null>(null);
  const [pending, setPending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const percentNum = parseFloat(targetPercent) || 0;
  const reasonValid = reason.trim().length >= 8;
  const percentValid = percentNum > 0 && percentNum <= 100;
  const pathsValid = fromPath !== toPath;

  async function runDryRun() {
    setError(null);
    setPending(true);
    try {
      const body: RolloutBody = {
        fromPath,
        toPath,
        targetPercent: percentNum,
        reason,
        dryRun: true,
      };
      const res = await onDryRun(body);
      setPreview(res);
      setStep('preview');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Dry run failed');
    } finally {
      setPending(false);
    }
  }

  async function runCommit() {
    setError(null);
    setPending(true);
    try {
      const body: RolloutBody = {
        fromPath,
        toPath,
        targetPercent: percentNum,
        reason,
        dryRun: false,
      };
      const res = await onCommit(body);
      setConfirmOpen(false);
      onCompleted?.(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Rollout failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-5 text-[10px] tracking-[0.14em] uppercase font-mono">
        <Pill active={step === 'paths'} done={step !== 'paths'}>1 · Paths</Pill>
        <Slash />
        <Pill active={step === 'wave'} done={step === 'preview'}>2 · Wave</Pill>
        <Slash />
        <Pill active={step === 'preview'} done={false}>3 · Preview</Pill>
      </div>

      {step === 'paths' && (
        <div>
          <FormRow label="From path">
            <PathPicker value={fromPath} onChange={setFromPath} totals={totals} />
          </FormRow>
          <FormRow label="To path" last>
            <PathPicker value={toPath} onChange={setToPath} totals={totals} />
          </FormRow>
          {!pathsValid && (
            <div className="text-accent text-[12px] mb-3">From and to paths must differ.</div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="primary"
              disabled={!pathsValid}
              onClick={() => setStep('wave')}
              className="!h-9 !text-[12px] !w-auto !px-5"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {step === 'wave' && (
        <div>
          <FormRow label="Wave size (%)">
            <NumberInput
              id="rollout-wave-percent"
              value={targetPercent}
              onChange={setTargetPercent}
              min={0.5}
              max={100}
              step={0.5}
              unit="%"
            />
          </FormRow>
          <FormRow label="Reason (min 8 chars)" last>
            <Input
              id="rollout-wave-reason"
              type="text"
              value={reason}
              onChange={setReason}
              placeholder="e.g. Promote new pipeline to 10% of legacy users (R-26 wave 2)"
            />
          </FormRow>
          {error && <div className="text-accent text-[12px] mb-3">{error}</div>}
          <div className="flex justify-between gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => setStep('paths')}
              className="!h-9 !text-[12px] !w-auto !px-5"
            >
              Back
            </Button>
            <Button
              variant="primary"
              disabled={!percentValid || !reasonValid || pending}
              loading={pending}
              onClick={runDryRun}
              className="!h-9 !text-[12px] !w-auto !px-5"
            >
              {pending ? 'Computing…' : 'Run dry-run'}
            </Button>
          </div>
        </div>
      )}

      {step === 'preview' && preview && (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Stat label="Cohort size" value={preview.cohortSize.toLocaleString()} />
            <Stat label="Would flip" value={preview.flipped.toLocaleString()} accent />
            <Stat label="Wave at" value={preview.waveTimestamp.slice(5, 16).replace('T', ' ')} />
          </div>
          <div className="bg-surface border border-border rounded p-3 mb-4">
            <div className="ea-eyebrow text-secondary mb-2">SAMPLE USER IDS</div>
            <div className="flex flex-wrap gap-1.5">
              {preview.sampleUserIds.slice(0, 20).map((uid) => (
                <Mono key={uid} color="white">
                  {uid}
                </Mono>
              ))}
            </div>
          </div>
          {error && <div className="text-accent text-[12px] mb-3">{error}</div>}
          <div className="flex justify-between gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => setStep('wave')}
              className="!h-9 !text-[12px] !w-auto !px-5"
            >
              Back
            </Button>
            <Button
              variant="primary"
              disabled={pending}
              onClick={() => setConfirmOpen(true)}
              className="!h-9 !text-[12px] !w-auto !px-5 !bg-accent !border-accent"
            >
              Commit wave
            </Button>
          </div>
        </div>
      )}

      <TypedConfirmModal
        open={confirmOpen}
        title="Commit pipeline rollout"
        consequence={
          <>
            This will flip up to <Mono color="white">{preview?.flipped ?? 0}</Mono> users from{' '}
            <Mono color="white">{fromPath}</Mono> to <Mono color="white">{toPath}</Mono>. The action
            is rate-limited and audit-logged. Type the target wave size to confirm.
          </>
        }
        expected={String(percentNum)}
        promptLabel="Type the wave size (%) to confirm"
        confirmLabel="Commit wave"
        loading={pending}
        onConfirm={runCommit}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

function PathPicker({
  value,
  onChange,
  totals,
}: {
  value: PipelinePath;
  onChange: (p: PipelinePath) => void;
  totals?: { legacyCount: number; newCount: number };
}) {
  return (
    <div className="flex gap-2">
      {(['legacy', 'new'] as const).map((p) => {
        const count = totals ? (p === 'legacy' ? totals.legacyCount : totals.newCount) : null;
        const active = value === p;
        return (
          <button
            type="button"
            key={p}
            onClick={() => onChange(p)}
            className={`flex-1 px-4 py-3 rounded border text-left ${
              active
                ? 'border-accent bg-accent/10'
                : 'border-border bg-surface hover:border-border-strong'
            }`}
          >
            <div className="font-display italic font-bold uppercase text-[12px] tracking-[0.08em] text-white">
              {p}
            </div>
            {count !== null && (
              <div className="ea-eyebrow text-secondary mt-1">
                {count.toLocaleString()} users
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="ea-stat-block">
      <div className="ea-stat-block-label">{label}</div>
      <div
        className={`font-display italic font-black text-[22px] tabular-nums mt-1 ${
          accent ? 'text-accent' : 'text-white'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Pill({
  active,
  done,
  children,
}: {
  active: boolean;
  done: boolean;
  children: React.ReactNode;
}) {
  const tone = active
    ? 'text-white border-accent bg-accent/10'
    : done
      ? 'text-secondary border-border-strong'
      : 'text-muted border-border';
  return <span className={`px-2 py-0.5 rounded border ${tone}`}>{children}</span>;
}

function Slash() {
  return <span className="text-muted">/</span>;
}
