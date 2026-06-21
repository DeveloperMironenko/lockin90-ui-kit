import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode } from 'react';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { NoteField } from '../components/NoteField';
import { Skeleton } from '../components/Skeleton';
import { BarFill } from '../components/BarFill';
import { Stat } from '../components/Stat';
import { Pulse } from '../components/Pulse';
import { Divider } from '../components/Divider';
import { GradientText } from '../components/GradientText';
import { BrandMark } from '../components/BrandMark';
import { Icon } from '../components/Icon';
import { Avatar } from '../components/Avatar';
import { SegmentedTabs } from '../components/SegmentedTabs';
import { LockedRow } from '../components/ProGate';

const meta = { title: 'Docs/Primitives' } satisfies Meta;
export default meta;

function Cell({ name, desc, children }: { name: string; desc: string; children: ReactNode }) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: 16,
        background: 'var(--bg-1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        minWidth: 0,
      }}
    >
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--text)' }}>{name}</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>{desc}</div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', minHeight: 36 }}>{children}</div>
    </div>
  );
}

export const Primitives: StoryObj = {
  render: () => (
    <div style={{ color: 'var(--text)' }}>
      <span className="lk-display" style={{ fontSize: 22 }}>
        Primitives
      </span>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-dim)', margin: '6px 0 18px', maxWidth: 560 }}>
        The small, reusable building blocks. Every product component is assembled from these — reach for them first.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 16 }}>
        <Cell name="Button" desc="primary action">
          <Button>Log check-in</Button>
        </Cell>
        <Cell name="Chip" desc="status pill (tones + dot)">
          <Chip tone="high" dot>
            on track
          </Chip>
          <Chip tone="mid" dot>
            at risk
          </Chip>
          <Chip>default</Chip>
        </Cell>
        <Cell name="Card" desc="glass surface container">
          <Card style={{ padding: 12, fontSize: 12.5, color: 'var(--text-dim)' }}>Glass card surface</Card>
        </Cell>
        <Cell name="Stat" desc="label + value readout">
          <Stat label="Energy" value="76" />
        </Cell>
        <Cell name="BarFill" desc="progress bar">
          <div style={{ width: '100%' }}>
            <BarFill value={0.7} />
          </div>
        </Cell>
        <Cell name="Input" desc="text field (label · unit)">
          <Input label="Weight" unit="kg" defaultValue="100" />
        </Cell>
        <Cell name="NoteField" desc="multiline note">
          <div style={{ width: '100%' }}>
            <NoteField placeholder="Add a note…" rows={2} />
          </div>
        </Cell>
        <Cell name="SegmentedTabs" desc="tab switcher">
          <div style={{ width: '100%' }}>
            <SegmentedTabs tabs={['Day', 'Week', 'Month']} />
          </div>
        </Cell>
        <Cell name="Avatar" desc="monogram / image">
          <Avatar name="Maya Kane" size={40} />
          <Avatar name="Leo P" size={40} shape="rounded" />
        </Cell>
        <Cell name="Icon" desc="shared icon set">
          {(['back', 'share', 'more', 'lock', 'play', 'timer', 'plus', 'check'] as const).map((n) => (
            <Icon key={n} name={n} size={20} />
          ))}
        </Cell>
        <Cell name="BrandMark" desc="logo mark / lockup">
          <BrandMark variant="mark" size={34} />
          <BrandMark variant="lockup" size={30} />
        </Cell>
        <Cell name="GradientText" desc="energy-spectrum text">
          <GradientText style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28 }}>90</GradientText>
        </Cell>
        <Cell name="Skeleton" desc="loading placeholder">
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton width={180} height={12} />
            <Skeleton width={120} height={12} />
          </div>
        </Cell>
        <Cell name="Pulse" desc="live indicator">
          <Pulse />
        </Cell>
        <Cell name="Divider" desc="hairline separator">
          <div style={{ width: '100%' }}>
            <Divider />
          </div>
        </Cell>
        <Cell name="LockedRow" desc="premium-gated row">
          <div style={{ width: '100%' }}>
            <LockedRow label="3 more locked" />
          </div>
        </Cell>
      </div>
    </div>
  ),
};
