import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import {
  Alert,
  Badge,
  Button,
  Divider,
  EmptyState,
  Eyebrow,
  PulseDot,
  Skeleton,
  StatusBadge,
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

  it('applies the ea-btn class to buttons', () => {
    const { getByRole } = render(<Button>Save</Button>);
    expect(getByRole('button').className).toContain('ea-btn');
  });
});
