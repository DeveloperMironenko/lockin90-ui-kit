import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { VideoThumbnail } from '../components/VideoThumbnail';

const meta = {
  title: 'Native/VideoThumbnail',
  component: VideoThumbnail,
  args: { width: 150, aspect: 1.4 },
} satisfies Meta<typeof VideoThumbnail>;
export default meta;

type Story = StoryObj<typeof VideoThumbnail>;

/** The Guide "Videos" strip — a row of thumbnails (gradient placeholders), some
 *  with a duration badge. (No remote images so it renders offline.) */
export const Strip: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <VideoThumbnail alt="Warm-up routine" duration="0:45" />
      <VideoThumbnail alt="Recovery breathing" duration="2:10" />
      <VideoThumbnail alt="Mobility flow" />
    </View>
  ),
};
