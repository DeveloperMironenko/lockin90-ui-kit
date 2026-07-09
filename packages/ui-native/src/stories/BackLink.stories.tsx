import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { BackLink } from '../components/BackLink';

const meta = { title: 'Native/BackLink' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <BackLink />,
};

export const Custom: Story = {
  render: () => <BackLink label="Exercises" />,
};

/**
 * Glass-chip mono affordance. Matches the auth brand-panel "Back to site"
 * button — bordered glass surface, dim mono label, static icon (no hover
 * nudge). Shown here on a glass card to read against translucent chrome.
 */
export const Pill: Story = {
  render: () => (
    <View
      style={{
        padding: 28,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.glass,
        alignSelf: 'flex-start',
      }}
    >
      <BackLink label="Back to site" variant="pill" />
    </View>
  ),
};
