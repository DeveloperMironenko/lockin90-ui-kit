import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';
import { SectionDivider } from '../components/SectionDivider';

const meta = { title: 'Native/SectionDivider' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <SectionDivider label="Explainability" />
    </View>
  ),
};

export const InPage: Story = {
  render: () => (
    <View style={{ width: 320, gap: 12 }}>
      <SectionDivider label="Today" />
      <Text style={{ fontFamily: fonts.ui, color: colors.textDim }}>
        Your energy is trending up after two solid nights of sleep.
      </Text>
      <SectionDivider label="This week" style={{ marginTop: 8 }} />
      <Text style={{ fontFamily: fonts.ui, color: colors.textDim }}>
        Three workouts logged · one recovery day.
      </Text>
    </View>
  ),
};
