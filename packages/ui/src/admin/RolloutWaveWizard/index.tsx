'use client';

import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Button from '../../components/Button';
import FormRow from '../../components/FormRow';
import Input from '../../components/Input';
import Stat from '../../components/Stat';
import Modal from '../../components/Modal';
import { cn } from '../../cn';
import type { PipelinePath, RolloutBody, RolloutResponse, RolloutWaveWizardProps } from './types';

type Step = 'paths' | 'wave' | 'preview';

/**
 * Aurora multi-wave pipeline-rollout wizard.
 *
 * Three steps — pick the from/to pipeline paths, set the wave size + reason,
 * then review a dry-run preview before committing. Commit is gated behind a
 * typed-confirm modal (operator must retype the wave size). Composes the base
 * Button / FormRow / Input / Stat / Modal primitives.
 */
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
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const percentNum = parseFloat(targetPercent) || 0;
  const reasonValid = reason.trim().length >= 8;
  const percentValid = percentNum > 0 && percentNum <= 100;
  const pathsValid = fromPath !== toPath;
  const confirmMatches = confirmText.trim() === String(percentNum);

  async function runDryRun() {
    setError(null);
    setPending(true);
    try {
      const body: RolloutBody = { fromPath, toPath, targetPercent: percentNum, reason, dryRun: true };
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
      const body: RolloutBody = { fromPath, toPath, targetPercent: percentNum, reason, dryRun: false };
      const res = await onCommit(body);
      setConfirmOpen(false);
      setConfirmText('');
      onCompleted?.(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Rollout failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="lk-wave-wizard">
      {/* Step indicator */}
      <div className="lk-wave-steps" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
        <StepPill active={step === 'paths'} done={step !== 'paths'}>1 &middot; Paths</StepPill>
        <Slash />
        <StepPill active={step === 'wave'} done={step === 'preview'}>2 &middot; Wave</StepPill>
        <Slash />
        <StepPill active={step === 'preview'} done={false}>3 &middot; Preview</StepPill>
      </div>

      {step === 'paths' && (
        <div>
          <FormRow label="From path" className="lk-wave-field">
            <PathPicker value={fromPath} onChange={setFromPath} totals={totals} />
          </FormRow>
          <FormRow label="To path" className="lk-wave-field">
            <PathPicker value={toPath} onChange={setToPath} totals={totals} />
          </FormRow>
          {!pathsValid && (
            <div className="lk-error" style={{ fontSize: 12, marginBottom: 12 }}>
              From and to paths must differ.
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 8 }}>
            <Button variant="primary" size="sm" disabled={!pathsValid} onClick={() => setStep('wave')}>
              Next
            </Button>
          </div>
        </div>
      )}

      {step === 'wave' && (
        <div>
          <FormRow label="Wave size (%)" htmlFor="rollout-wave-percent" className="lk-wave-field">
            <Input
              id="rollout-wave-percent"
              type="number"
              min={0.5}
              max={100}
              step={0.5}
              value={targetPercent}
              onChange={(e) => setTargetPercent(e.target.value)}
              invalid={!percentValid}
            />
          </FormRow>
          <FormRow
            label="Reason (min 8 chars)"
            htmlFor="rollout-wave-reason"
            className="lk-wave-field"
            hint="Recorded in the audit log."
          >
            <Input
              id="rollout-wave-reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Promote new pipeline to 10% of legacy users (R-26 wave 2)"
            />
          </FormRow>
          {error && (
            <div className="lk-error" style={{ fontSize: 12, marginBottom: 12 }}>
              {error}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, paddingTop: 8 }}>
            <Button variant="ghost" size="sm" onClick={() => setStep('paths')}>
              Back
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!percentValid || !reasonValid || pending}
              loading={pending}
              onClick={runDryRun}
            >
              {pending ? 'Computing…' : 'Run dry-run'}
            </Button>
          </div>
        </div>
      )}

      {step === 'preview' && preview && (
        <div>
          <div
            className="lk-wave-stats"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}
          >
            <Stat label="Cohort size" value={preview.cohortSize.toLocaleString()} />
            <Stat label="Would flip" value={preview.flipped.toLocaleString()} />
            <Stat label="Wave at" value={preview.waveTimestamp.slice(5, 16).replace('T', ' ')} />
          </div>
          <div
            className="lk-card lk-pad-sm lk-wave-sample"
            style={{ marginBottom: 16 }}
          >
            <div className="lk-eyebrow" style={{ marginBottom: 8 }}>
              Sample user ids
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {preview.sampleUserIds.slice(0, 20).map((uid) => (
                <span key={uid} className="lk-mono" style={{ fontSize: 12, color: 'var(--text)' }}>
                  {uid}
                </span>
              ))}
            </div>
          </div>
          {error && (
            <div className="lk-error" style={{ fontSize: 12, marginBottom: 12 }}>
              {error}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, paddingTop: 8 }}>
            <Button variant="ghost" size="sm" onClick={() => setStep('wave')}>
              Back
            </Button>
            <Button variant="danger" size="sm" magnetic disabled={pending} onClick={() => setConfirmOpen(true)}>
              Commit wave
            </Button>
          </div>
        </div>
      )}

      {/* Typed-confirm gate — operator retypes the wave size before the flip. */}
      <Modal
        open={confirmOpen}
        onClose={() => {
          if (!pending) {
            setConfirmOpen(false);
            setConfirmText('');
          }
        }}
        title="Commit pipeline rollout"
        danger
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={() => {
                setConfirmOpen(false);
                setConfirmText('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={!confirmMatches || pending}
              loading={pending}
              onClick={runCommit}
            >
              Commit wave
            </Button>
          </>
        }
      >
        <p style={{ margin: '0 0 14px' }}>
          This will flip up to{' '}
          <span className="lk-mono" style={{ color: 'var(--text)' }}>
            {preview?.flipped ?? 0}
          </span>{' '}
          users from{' '}
          <span className="lk-mono" style={{ color: 'var(--text)' }}>
            {fromPath}
          </span>{' '}
          to{' '}
          <span className="lk-mono" style={{ color: 'var(--text)' }}>
            {toPath}
          </span>
          . The action is rate-limited and audit-logged. Type the target wave size to confirm.
        </p>
        <FormRow label={`Type the wave size (%) to confirm`} htmlFor="rollout-wave-confirm">
          <Input
            id="rollout-wave-confirm"
            type="text"
            inputMode="decimal"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={String(percentNum)}
            invalid={confirmText.length > 0 && !confirmMatches}
            autoFocus
          />
        </FormRow>
        {error && (
          <div className="lk-error" style={{ fontSize: 12, marginTop: 8 }}>
            {error}
          </div>
        )}
      </Modal>
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
    <div style={{ display: 'flex', gap: 8 }}>
      {(['legacy', 'new'] as const).map((p) => {
        const count = totals ? (p === 'legacy' ? totals.legacyCount : totals.newCount) : null;
        const active = value === p;
        const style: CSSProperties = {
          flex: 1,
          padding: '12px 16px',
          textAlign: 'left',
          borderRadius: 'var(--r-sm)',
          border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
          background: active ? 'var(--glass-2)' : 'var(--glass)',
          color: 'var(--text)',
          cursor: 'pointer',
          transition: 'border-color 0.2s var(--ease), background 0.2s var(--ease)',
        };
        return (
          <button
            type="button"
            key={p}
            onClick={() => onChange(p)}
            aria-pressed={active}
            className={cn('lk-wave-path', active && 'lk-active')}
            style={style}
          >
            <div className="lk-eyebrow" style={{ letterSpacing: '0.08em', color: 'var(--text)' }}>
              {p}
            </div>
            {count !== null && (
              <div className="lk-mono" style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>
                {count.toLocaleString()} users
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function StepPill({ active, done, children }: { active: boolean; done: boolean; children: ReactNode }) {
  const color = active ? 'var(--text)' : done ? 'var(--text-dim)' : 'var(--text-faint)';
  const borderColor = active ? 'var(--accent)' : done ? 'var(--border-2)' : 'var(--border)';
  return (
    <span
      className={cn('lk-wave-step', active && 'lk-active', done && 'lk-done')}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        padding: '3px 9px',
        borderRadius: 'var(--r-pill)',
        border: `1px solid ${borderColor}`,
        background: active ? 'var(--glass-2)' : 'transparent',
        color,
      }}
    >
      {children}
    </span>
  );
}

function Slash() {
  return <span style={{ color: 'var(--text-faint)' }}>/</span>;
}
