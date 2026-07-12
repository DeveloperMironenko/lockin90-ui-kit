import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { PrCard } from '../components/PrCard';

const meta = { title: 'Native/PrCard' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const NewRecord: Story = {
  render: () => (
    <View style={{ width: 240 }}>
      <PrCard name="Back Squat" kind="Estimated 1RM" value="130 kg" detail="today · +2kg" state="new" onPress={() => {}} />
    </View>
  ),
};

export const AtPeak: Story = {
  render: () => (
    <View style={{ width: 240 }}>
      <PrCard name="Deadlift" kind="Estimated 1RM" value="180 kg" detail="3d ago" state="atPeak" />
    </View>
  ),
};

export const OffPeak: Story = {
  render: () => (
    <View style={{ width: 240 }}>
      <PrCard name="Bench Press" kind="Estimated 1RM" value="95 kg" detail="peak 102 kg · 5w ago" state="offPeak" />
    </View>
  ),
};

export const Plain: Story = {
  render: () => (
    <View style={{ width: 240 }}>
      <PrCard name="Overhead Press" kind="Rep max · 5RM" value="55 kg" />
    </View>
  ),
};

export const Grid: Story = {
  render: () => (
    <View style={{ width: 420, flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
      <View style={{ width: 200 }}>
        <PrCard name="Back Squat" kind="Estimated 1RM" value="130 kg" detail="today · +2kg" state="new" onPress={() => {}} />
      </View>
      <View style={{ width: 200 }}>
        <PrCard name="Deadlift" kind="Estimated 1RM" value="180 kg" detail="3d ago" state="atPeak" onPress={() => {}} />
      </View>
      <View style={{ width: 200 }}>
        <PrCard name="Bench Press" kind="Estimated 1RM" value="95 kg" detail="peak 102 kg · 5w ago" state="offPeak" onPress={() => {}} />
      </View>
      <View style={{ width: 200 }}>
        <PrCard name="Overhead Press" kind="Rep max · 5RM" value="55 kg" onPress={() => {}} />
      </View>
    </View>
  ),
};
