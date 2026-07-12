import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { TemplateCard } from '../components/TemplateCard';
import { Icon } from '../components/Icon';

const meta = { title: 'Native/TemplateCard' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 380 }}>
      <TemplateCard name="Push Day A" meta="Chest · Arms · 5 ex · ~48m" lastUsed="Last used 2d ago" />
    </View>
  ),
};

export const CoachTemplate: Story = {
  render: () => (
    <View style={{ width: 380 }}>
      <TemplateCard
        name="5×5 Strength"
        meta="Full body · 5 ex · ~52m"
        lastUsed="Last used 5d ago"
        source="coach"
        tint={colors.mint}
        onPress={() => {}}
      />
    </View>
  ),
};

export const AiTemplate: Story = {
  render: () => (
    <View style={{ width: 380 }}>
      <TemplateCard
        name="Peaking Block · W3"
        meta="Squat focus · 4 ex · ~40m"
        source="ai"
        tint={colors.accent}
        onPress={() => {}}
      />
    </View>
  ),
};

export const WithTrailing: Story = {
  render: () => (
    <View style={{ width: 380 }}>
      <TemplateCard
        name="Pull Day B"
        meta="Back · Biceps · 6 ex · ~55m"
        lastUsed="Last used yesterday"
        tint={colors.cyan}
        onPress={() => {}}
        trailing={<Icon name="chevron" size={16} />}
      />
    </View>
  ),
};

export const List: Story = {
  render: () => (
    <View style={{ width: 380, gap: 9 }}>
      <TemplateCard name="Push Day A" meta="Chest · Arms · 5 ex · ~48m" lastUsed="Last used 2d ago" tint={colors.cyan} onPress={() => {}} />
      <TemplateCard name="5×5 Strength" meta="Full body · 5 ex · ~52m" source="coach" tint={colors.mint} onPress={() => {}} />
      <TemplateCard name="Peaking Block · W3" meta="Squat focus · 4 ex · ~40m" source="ai" tint={colors.accent} onPress={() => {}} />
    </View>
  ),
};
