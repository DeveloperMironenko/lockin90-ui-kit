import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from '../components/LineChart';

const meta = {
  title: 'Primitives/LineChart',
  component: LineChart,
} satisfies Meta<typeof LineChart>;
export default meta;

export const Default: StoryObj<typeof meta> = {};

export const Sharp: StoryObj<typeof meta> = { args: { smooth: false } };

export const WithMarkers: StoryObj<typeof meta> = {
  args: { markers: [{ index: 9, color: 'var(--zone-low)', label: 'peak' }] },
};

export const WithYAxis: StoryObj<typeof meta> = {
  args: {
    yAxis: true,
    data: [280, 286, 292, 288, 296, 302, 308, 305, 300, 296, 290, 284],
    axis: ['Mon', 'Wed', 'Fri', 'Sun'],
  },
};
