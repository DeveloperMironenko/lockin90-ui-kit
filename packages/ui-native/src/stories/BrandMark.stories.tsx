import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { BrandMark } from '../components/BrandMark';

const meta = {
  title: 'Native/BrandMark',
  component: BrandMark,
} satisfies Meta<typeof BrandMark>;
export default meta;

type Story = StoryObj<typeof BrandMark>;

/** Default `mark` variant — energy line climbing to a glowing lime peak. */
export const Mark: Story = { args: { variant: 'mark', size: 64 } };

/** Wordmark lockup — mark + LockIn90 text. */
export const Lockup: Story = { args: { variant: 'lockup', size: 28 } };

export const Variants: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <BrandMark variant="mark" size={48} />
        <BrandMark variant="icon" size={48} />
        <BrandMark variant="mono" size={48} />
      </View>
      <BrandMark variant="lockup" size={28} />
    </View>
  ),
};
