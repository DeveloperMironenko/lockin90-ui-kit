import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarFill } from '../components/BarFill';

const meta: Meta<typeof BarFill> = {
  title: 'Primitives/BarFill',
  component: BarFill,
  parameters: { layout: 'centered' },
  // BarFill is width:100% — give it a real width so it doesn't collapse to a sliver
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

export const Default: StoryObj<typeof BarFill> = { args: { value: 0.72 } };

/** Gradient variants — mint for healthy coverage / unlimited bars, warm for
 *  warn-threshold quota bars (mock `.barfill.q-unlimited` / `.q-warn`). */
export const Gradients: StoryObj<typeof BarFill> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <BarFill value={0.72} />
      <BarFill value={0.96} gradient="mint" />
      <BarFill value={0.34} gradient="warm" />
      <BarFill value={0.6} gradient="violet" />
      <BarFill value={0.85} gradient="flux" />
    </div>
  ),
};
