import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { Icon } from '../components/Icon';
import { Select } from '../components/Select';

const meta = { title: 'Native/Select' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Select placeholder="Select an option" />
    </View>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Select
        label="Unit system"
        value="metric"
        options={[
          { value: 'metric', label: 'Metric (kg)' },
          { value: 'imperial', label: 'Imperial (lb)' },
        ]}
      />
    </View>
  ),
};

/** `size="sm"` — the design settings `.pref-select` compact mono glass pill,
 *  with an optional `leading` icon (the `.lang-wrap` globe on Language). */
export const SmallPill: Story = {
  render: () => (
    <View style={{ width: 320, gap: 12, alignItems: 'flex-start' }}>
      <Select
        size="sm"
        value="warsaw"
        options={[
          { value: 'warsaw', label: 'Warsaw (GMT+1)' },
          { value: 'london', label: 'London (GMT+0)' },
        ]}
      />
      <Select
        size="sm"
        leading={<Icon name="globe" size={14} color={colors.accent2} />}
        value="en"
        options={[
          { value: 'en', label: 'English' },
          { value: 'uk', label: 'Українська' },
        ]}
      />
    </View>
  ),
};
