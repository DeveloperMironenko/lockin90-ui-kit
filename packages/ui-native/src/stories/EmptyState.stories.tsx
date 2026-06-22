import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';

const meta = { title: 'Native/EmptyState' } satisfies Meta;
export default meta;

export const Default: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <EmptyState
        title="No achievements yet"
        description="Your streak, XP and badges all grow from what you log. Log your first event to begin."
        action={<Button title="Get started" variant="primary" />}
      />
    </View>
  ),
};

export const Compact: StoryObj = {
  render: () => (
    <View style={{ width: 320 }}>
      <EmptyState
        compact
        title="No baseline yet"
        description="Once you've logged for a couple of weeks, then-vs-now shows up here."
      />
    </View>
  ),
};
