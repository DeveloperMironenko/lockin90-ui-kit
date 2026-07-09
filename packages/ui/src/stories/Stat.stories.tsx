import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stat } from '../components/Stat';

const meta = {
  title: 'Primitives/Stat',
  component: Stat,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Stat>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { label: 'Energy', value: '76' } };

export const Empty: StoryObj<typeof meta> = {
  args: { label: 'Energy', value: '76', empty: true, hint: 'No data yet — connect a wearable' },
};

/** Value tone (gradient / mint) + explicit `valueColor`, mirroring admin `Statistic`. */
export const Tones: StoryObj<typeof meta> = {
  args: { label: 'Members', value: '1,204' },
  render: () => (
    <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
      <Stat label="Members" value="1,204" tone="gradient" />
      <Stat label="Uptime" value="99.9%" tone="mint" />
      <Stat label="Error rate" value="1.8%" valueColor="#FFB020" />
    </div>
  ),
};

/** Size scale: `sm`/`lg` mirror admin `Statistic` (with `sub`); `hero` is the
 *  oversized marketing figure (label below, animated spectrum gradient). */
export const Sizes: StoryObj<typeof meta> = {
  args: { label: 'MRR', value: '$48.2k' },
  render: () => (
    <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
      <Stat label="MRR" value="$48.2k" size="sm" sub="30d" />
      <Stat label="Active" value="1,204" size="lg" tone="gradient" />
      <Stat label="Members" value="12k" size="hero" tone="gradient" />
    </div>
  ),
};
