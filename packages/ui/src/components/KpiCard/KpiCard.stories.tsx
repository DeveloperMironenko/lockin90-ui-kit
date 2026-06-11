import type { Meta, StoryObj } from '@storybook/react-vite';
import KpiCard from './index';

const meta = {
  title: 'Patterns/KpiCard',
  component: KpiCard,
} satisfies Meta<typeof KpiCard>;

export default meta;
type Story = StoryObj;

const series = [62, 64, 61, 66, 68, 65, 70, 72, 69, 74, 73, 78];

export const Single: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <KpiCard
        label="HRV"
        value="74"
        unit="ms"
        delta={{ value: '8% vs 7-day', direction: 'up' }}
        spark={series}
        lit
      />
    </div>
  ),
};

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 240px)', gap: 16 }}>
      <KpiCard label="RESTING HR" value="52" unit="bpm" delta={{ value: '3 bpm', direction: 'down' }} spark={[58, 57, 56, 55, 54, 53, 52]} />
      <KpiCard label="SLEEP" value="7.4" unit="h" delta={{ value: '0.6h', direction: 'up' }} spark={[6.2, 6.8, 7.0, 6.5, 7.1, 7.4]} lit />
      <KpiCard label="STRESS" value="32" delta={{ value: '5 pts', direction: 'down' }} spark={[44, 40, 38, 36, 34, 32]} />
      <KpiCard label="READINESS" value="81" delta={{ value: '6 pts', direction: 'up' }} spark={series} lit />
    </div>
  ),
};
