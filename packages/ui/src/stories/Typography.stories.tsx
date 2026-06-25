import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode } from 'react';

const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'padded' },
} satisfies Meta;
export default meta;

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '150px 1fr',
        gap: 18,
        alignItems: 'baseline',
        padding: '12px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>{label}</span>
      <div>{children}</div>
    </div>
  );
}

export const Typography: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 720, color: 'var(--text)' }}>
      <Row label="display / 32">
        <span className="lk-display" style={{ fontSize: 32 }}>
          Energy by weekday
        </span>
      </Row>
      <Row label="display / 24">
        <span className="lk-display" style={{ fontSize: 24 }}>
          Barbell Squat
        </span>
      </Row>
      <Row label="display / 19">
        <span className="lk-display" style={{ fontSize: 19 }}>
          Sleep stages
        </span>
      </Row>
      <Row label="gradient text">
        <span className="lk-display lk-gradient-text" style={{ fontSize: 30 }}>
          LockIn90
        </span>
      </Row>
      <Row label="body / 14">
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-dim)' }}>
          Optimizing recovery between long runs. Early sleeper, caffeine-cutter.
        </span>
      </Row>
      <Row label="mono / 12">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)' }}>135 × 3 · 1RM 143</span>
      </Row>
      <Row label="eyebrow">
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            color: 'var(--text-faint)',
          }}
        >
          Vitals · this morning
        </span>
      </Row>
    </div>
  ),
};
