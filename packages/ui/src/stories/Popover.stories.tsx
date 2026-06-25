import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover, CopyButton } from '../components/Popover';
import { Button } from '../components/Button';

const meta = {
  title: 'Primitives/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Popover>;
export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <Popover trigger={<Button size="sm">Why?</Button>}>
      <p className="lk-pop-text">
        Your readiness score blends recent training load, sleep, and recovery
        into one number — higher means you can push harder today.
      </p>
    </Popover>
  ),
};

export const Copy: StoryObj<typeof meta> = {
  render: () => <CopyButton value="LOCKIN-2026" label="LOCKIN-2026" />,
};
