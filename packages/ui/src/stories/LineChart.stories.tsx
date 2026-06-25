import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from '../components/LineChart';

const meta = {
  title: 'Primitives/LineChart',
  component: LineChart,
  parameters: { layout: 'padded' },
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

// Actual (solid) → forecast (dashed) with an uncertainty ribbon that widens over
// the forecast horizon, plus an event marker at the forecast boundary.
export const Forecast: StoryObj<typeof meta> = {
  args: {
    color: 'var(--accent)',
    // indices 0..6 are observed; 6..11 are the forecast continuation
    data: [60, 64, 71, 78, 84, 88, 90, 93, 95, 96, 95, 92],
    dashedFromIndex: 6,
    band: {
      // ribbon hugs the line over the actuals, fans out over the forecast
      upper: [60, 64, 71, 78, 84, 88, 92, 98, 103, 107, 110, 112],
      lower: [60, 64, 71, 78, 84, 88, 88, 88, 87, 85, 80, 72],
    },
    markers: [{ index: 6, color: 'var(--accent)', label: 'now' }],
    axis: ['9am', '12pm', '3pm', '6pm', '9pm'],
  },
};
