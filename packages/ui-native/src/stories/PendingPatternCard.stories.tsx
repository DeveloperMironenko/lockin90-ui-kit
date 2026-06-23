import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { PendingPatternCard } from '../components/PendingPatternCard';

const meta = {
  title: 'Native/PendingPatternCard',
  component: PendingPatternCard,
} satisfies Meta<typeof PendingPatternCard>;
export default meta;

type Story = StoryObj<typeof PendingPatternCard>;

export const Default: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <PendingPatternCard
        interpretation="On days you logged caffeine after 14:00, your deep-sleep minutes dropped and overnight resting HR rose. The engine thinks this is a real, repeatable effect — confirm if it matches your experience."
        effect="−18m deep sleep / late-caffeine night"
        confidence={[
          { label: 'p', value: '< 0.01' },
          { label: 'n', value: '22 events' },
          { label: 'confidence', value: '94%' },
        ]}
        onAccept={() => {}}
        onDismiss={() => {}}
      />
    </View>
  ),
};

export const NoActions: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <PendingPatternCard
        interpretation="Energy reliably drops in your 14:00–16:00 band on workdays — averaging 14 points below the same window on weekends."
        effect="−14 pts vs weekend 2–4pm avg"
        confidence={[{ label: 'n', value: '41 days' }]}
      />
    </View>
  ),
};

export const HighConfidence: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <PendingPatternCard
        interpretation="Sleeping more than 7 hours lifts your next-day energy. This pattern held across nearly every night in the window."
        effect="+8 energy when sleep > 7h"
        confidence={[
          { label: 'p', value: '< 0.001' },
          { label: 'n', value: '63 nights' },
          { label: 'confidence', value: '98%' },
        ]}
        onAccept={() => {}}
        onDismiss={() => {}}
      />
    </View>
  ),
};
