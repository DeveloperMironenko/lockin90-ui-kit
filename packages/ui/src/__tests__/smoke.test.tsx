import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import {
  Alert,
  AttributionCard,
  Badge,
  BarFill,
  Button,
  Chip,
  Divider,
  EmptyState,
  Eyebrow,
  GradientText,
  KpiCard,
  Pulse,
  PulseDot,
  ScoreBreakdown,
  Skeleton,
  StatusBadge,
  SyncBadge,
} from '../index';

describe('@lockin90/ui smoke', () => {
  it('renders core primitives without throwing', () => {
    const { getByText } = render(
      <div>
        <Button onClick={() => {}}>Go</Button>
        <Badge variant="active">Connected</Badge>
        <PulseDot />
        <Alert variant="info">Heads up</Alert>
        <Divider />
        <Eyebrow>Section</Eyebrow>
        <Skeleton h="40px" />
        <StatusBadge tone="green">Live</StatusBadge>
        <EmptyState icon="⚡" eyebrow="None" heading="Nothing here" description="Try later" />
      </div>,
    );
    expect(getByText('Go')).toBeInTheDocument();
    expect(getByText('Connected')).toBeInTheDocument();
    expect(getByText('Heads up')).toBeInTheDocument();
    expect(getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders the Aurora Flux components without throwing', () => {
    const { getByText } = render(
      <div>
        <GradientText variant="flux">78</GradientText>
        <Chip tone="high" dot>HIGH ZONE</Chip>
        <Pulse tone="ok" />
        <BarFill value={0.6} immediate />
        <SyncBadge status="synced" time="2m ago" />
        <KpiCard label="HRV" value="74" unit="ms" delta={{ value: '8%', direction: 'up' }} />
        <AttributionCard title="WHY 78?">Driven by <b>late caffeine</b>.</AttributionCard>
        <ScoreBreakdown items={[{ name: 'Deep sleep', value: 9 }, { name: 'Late caffeine', value: -7 }]} />
      </div>,
    );
    expect(getByText('HIGH ZONE')).toBeInTheDocument();
    expect(getByText('HRV')).toBeInTheDocument();
    expect(getByText('Deep sleep')).toBeInTheDocument();
  });

  it('applies the ea-btn class to buttons', () => {
    const { getByRole } = render(<Button>Save</Button>);
    expect(getByRole('button').className).toContain('ea-btn');
  });
});
