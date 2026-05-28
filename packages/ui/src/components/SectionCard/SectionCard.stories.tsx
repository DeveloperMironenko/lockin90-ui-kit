import type { Meta, StoryObj } from '@storybook/react-vite';
import SectionCard from './index';
import { Body } from '../Typography';
import { Button } from '../Button';

const meta = {
  title: 'Primitives/SectionCard',
  component: SectionCard,
  args: {
    eyebrow: 'OVERVIEW',
    title: 'Weekly Readiness',
    subtitle: 'Last 7 days',
    padding: 'normal',
    children: <Body color="secondary">Aggregated readiness across your tracked sessions.</Body>,
  },
  argTypes: {
    padding: { control: 'inline-radio', options: ['tight', 'normal', 'loose', 'none'] },
  },
  render: (args) => (
    <div style={{ width: 420 }}>
      <SectionCard {...args} />
    </div>
  ),
} satisfies Meta<typeof SectionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActionAndFooter: Story = {
  args: {
    action: <Button variant="ghost">View all</Button>,
    footer: 'Updated 4 minutes ago',
  },
};

export const BodyOnly: Story = {
  args: {
    eyebrow: undefined,
    title: undefined,
    subtitle: undefined,
    children: <Body color="white">A card with no header chrome — just content.</Body>,
  },
};
