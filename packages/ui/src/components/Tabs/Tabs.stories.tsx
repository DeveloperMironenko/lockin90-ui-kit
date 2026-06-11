import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Tabs from './index';

const meta = {
  title: 'Primitives/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj; // render-only stories (no required args supplied)

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('overview');
    return (
      <div style={{ width: 480 }}>
        <Tabs
          active={active}
          onChange={setActive}
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'sessions', label: 'Sessions', count: 12 },
            { id: 'devices', label: 'Devices', count: 2 },
          ]}
        />
      </div>
    );
  },
};
