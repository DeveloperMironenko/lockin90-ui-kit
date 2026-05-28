import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import FilterChips from './index';

const meta = {
  title: 'Primitives/FilterChips',
  component: FilterChips,
} satisfies Meta<typeof FilterChips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('all');
    return (
      <FilterChips
        active={active}
        onChange={setActive}
        chips={[
          { id: 'all', label: 'All', count: 42 },
          { id: 'strength', label: 'Strength', count: 18 },
          { id: 'cardio', label: 'Cardio', count: 15 },
          { id: 'mobility', label: 'Mobility', count: 9 },
        ]}
      />
    );
  },
};
