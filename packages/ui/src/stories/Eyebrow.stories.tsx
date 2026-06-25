import type { Meta, StoryObj } from '@storybook/react-vite';
import { Eyebrow } from '../components/Eyebrow';

const meta = {
  title: 'Primitives/Eyebrow',
  component: Eyebrow,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Eyebrow>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Generated · 6' } };

export const SectionHeader: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Eyebrow>Targets</Eyebrow>
      <div style={{ color: '#EEF1F8', fontSize: 20, fontWeight: 700 }}>Publish destinations</div>
    </div>
  ),
};
