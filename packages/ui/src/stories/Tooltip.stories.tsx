import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from '../components/Tooltip';
import { Button } from '../components/Button';

const meta = {
  title: 'Primitives/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tooltip>;
export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <Tooltip content="Estimated 1-rep max">
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const Placements: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', gap: 48, padding: 60, flexWrap: 'wrap' }}>
      <Tooltip content="Top" placement="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="Bottom" placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="Left" placement="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip content="Right" placement="right">
        <Button>Right</Button>
      </Tooltip>
    </div>
  ),
};
