import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { MuscleDiagram } from '../components/MuscleDiagram';

const meta = { title: 'Native/MuscleDiagram' } satisfies Meta;
export default meta;

export const Default: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <MuscleDiagram />
    </View>
  ),
};

export const PushDay: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <MuscleDiagram
        view="front"
        targets={[
          { group: 'chest', role: 'primary' },
          { group: 'triceps', role: 'secondary' },
          { group: 'shoulders', role: 'secondary' },
        ]}
      />
    </View>
  ),
};

export const PullDay: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <MuscleDiagram
        view="back"
        targets={[
          { group: 'lats', role: 'primary' },
          { group: 'back', role: 'primary' },
          { group: 'biceps', role: 'secondary' },
        ]}
      />
    </View>
  ),
};

export const Legs: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <MuscleDiagram
        view="front"
        targets={[
          { group: 'quads', role: 'primary' },
          { group: 'glutes', role: 'secondary' },
          { group: 'calves', role: 'stabilizer' },
        ]}
      />
    </View>
  ),
};

export const NoLegend: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <MuscleDiagram showLegend={false} />
    </View>
  ),
};
