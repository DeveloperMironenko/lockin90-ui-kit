import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { Highlight } from '../components/Highlight';

const meta = { title: 'Native/Highlight' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Text style={{ color: '#EEF1F8', fontSize: 14 }}>
        <Highlight tone="accent">5:40pm espresso</Highlight>
      </Text>
    </View>
  ),
};

export const InProse: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Text style={{ color: '#EEF1F8', fontSize: 14, lineHeight: 22 }}>
        From your first <Highlight tone="warm">5 logged days</Highlight>, today's energy estimates to roughly{' '}
        <Highlight tone="warm">71 / 100</Highlight>. We can already see your{' '}
        <Highlight tone="accent">5:40pm espresso</Highlight> in the data. What helps most is to{' '}
        <Highlight tone="mint">keep logging</Highlight> — you're <Highlight tone="mint">2 days</Highlight> from
        the first confirmed insights, and we flag a <Highlight tone="low">post-lunch dip</Highlight>.
      </Text>
    </View>
  ),
};
