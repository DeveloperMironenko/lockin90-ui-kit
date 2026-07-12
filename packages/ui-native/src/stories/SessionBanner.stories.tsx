import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { SessionBanner } from '../components/SessionBanner';
import { Icon } from '../components/Icon';

const meta = { title: 'Native/SessionBanner' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Live: Story = {
  render: () => (
    <View style={{ width: 380 }}>
      <SessionBanner
        title="Push Day A"
        status="Live · 24:18"
        subtitle="Bench Press · set 2 of 5"
        live
        stats={[
          { value: '142', label: 'BPM' },
          { value: '12', label: 'Sets' },
          { value: '8 400', label: 'KG vol' },
        ]}
        actions={[
          { label: 'Resume', variant: 'primary', onPress: () => {} },
          { label: 'Finish', variant: 'ghost', onPress: () => {} },
        ]}
      />
    </View>
  ),
};

export const Minimal: Story = {
  render: () => (
    <View style={{ width: 380 }}>
      <SessionBanner title="Push Day A" status="Live · 02:41" live />
    </View>
  ),
};

export const PausedSession: Story = {
  render: () => (
    <View style={{ width: 380 }}>
      <SessionBanner
        title="Pull Day B"
        status="Paused · 31:07"
        subtitle="Barbell Row · set 4 of 4"
        actions={[{ label: 'Resume', variant: 'primary', onPress: () => {} }]}
      />
    </View>
  ),
};

export const WithLeading: Story = {
  render: () => (
    <View style={{ width: 380 }}>
      <SessionBanner
        title="A very long session name that truncates before the status"
        status="Live · 1:02:44"
        live
        leading={<Icon name="activity" size={16} />}
        subtitle="Cooldown · zone 1"
      />
    </View>
  ),
};
