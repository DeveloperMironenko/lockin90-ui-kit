import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  AuroraBackground,
  Avatar,
  Badge,
  Banner,
  BarFill,
  Button,
  Card,
  Chip,
  CountUp,
  Divider,
  EnergyCurve,
  EnergyRing,
  Eyebrow,
  GradientText,
  InsightCard,
  KpiCard,
  Modal,
  PageHeader,
  Pulse,
  Reveal,
  SparkLine,
  Stat,
  Toggle,
} from '../index';

describe('@lockin90/ui — Aurora Flux smoke', () => {
  it('renders foundation primitives', () => {
    render(
      <Card hover lit>
        <Eyebrow>Today</Eyebrow>
        <GradientText>78</GradientText>
        <Chip tone="high" dot>
          recovered
        </Chip>
        <Badge>PRO</Badge>
        <Pulse tone="ok" />
        <Divider gradient />
        <Avatar name="Marek Kowalczyk" />
      </Card>,
    );
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('recovered')).toBeInTheDocument();
    expect(screen.getByText('MK')).toBeInTheDocument();
  });

  it('renders a primary button and fires onClick', () => {
    let clicked = 0;
    render(
      <Button variant="primary" magnetic onClick={() => (clicked += 1)}>
        Log event
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Log event' });
    expect(btn).toHaveClass('lk-btn', 'lk-btn-primary');
    fireEvent.click(btn);
    expect(clicked).toBe(1);
  });

  it('renders a button as a link when href is given', () => {
    render(<Button href="/start">Get started</Button>);
    const link = screen.getByRole('link', { name: 'Get started' });
    expect(link).toHaveAttribute('href', '/start');
  });

  it('renders the energy ring (SVG) with its score', () => {
    const { container } = render(<EnergyRing score={78} size={120} animate={false} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(screen.getByText('78')).toBeInTheDocument();
  });

  it('renders charts (EnergyCurve + SparkLine) without crashing', () => {
    const { container } = render(
      <div>
        <EnergyCurve data={[60, 72, 85, 70, 58, 66, 78]} labels={['6a', '12p', '6p']} nowIndex={4} />
        <SparkLine data={[2, 5, 3, 8, 6, 9]} />
      </div>,
    );
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2);
  });

  it('renders data + pattern compositions', () => {
    render(
      <div>
        <Stat label="HRV" value={<CountUp value={68} immediate />} delta="+6" deltaDir="up" />
        <KpiCard label="MRR" value="$12,480" delta="+3%" deltaDir="up" />
        <BarFill value={0.75} tone="pos" />
        <InsightCard title="Late caffeine costs ~9 pts" meta={<Chip tone="high">p &lt; 0.01</Chip>}>
          Across 18 espressos, intake after 16:00 lowered next-morning energy.
        </InsightCard>
      </div>,
    );
    expect(screen.getByText('HRV')).toBeInTheDocument();
    expect(screen.getByText('Late caffeine costs ~9 pts')).toBeInTheDocument();
  });

  it('toggles a switch via aria-pressed', () => {
    let value = false;
    const { rerender } = render(<Toggle checked={value} onChange={(n) => (value = n)} label="Hide done" />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(sw);
    expect(value).toBe(true);
    rerender(<Toggle checked={value} onChange={(n) => (value = n)} label="Hide done" />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-pressed', 'true');
  });

  it('reveals content and renders page chrome', () => {
    render(
      <div>
        <AuroraBackground />
        <PageHeader title="System Overview" subtitle="Operator view" />
        <Reveal>
          <Banner tone="warn">Impersonating a user — read-only session.</Banner>
        </Reveal>
      </div>,
    );
    expect(screen.getByText('System Overview')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Impersonating');
  });

  it('opens a modal into a portal and closes it', () => {
    let open = true;
    const { rerender } = render(
      <Modal open={open} onClose={() => (open = false)} title="Refund $19.99?" danger>
        This issues a Stripe refund.
      </Modal>,
    );
    expect(screen.getByRole('alertdialog')).toHaveTextContent('Refund $19.99?');
    rerender(
      <Modal open={false} onClose={() => {}} title="Refund $19.99?" danger>
        This issues a Stripe refund.
      </Modal>,
    );
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});
