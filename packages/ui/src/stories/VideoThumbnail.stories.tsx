import type { Meta, StoryObj } from '@storybook/react-vite';
import { VideoThumbnail } from '../components/VideoThumbnail';

const meta = {
  title: 'Primitives/VideoThumbnail',
  component: VideoThumbnail,
  args: { width: 150, aspect: 1.4 },
} satisfies Meta<typeof VideoThumbnail>;
export default meta;

type Story = StoryObj<typeof meta>;

/** The Guide "Videos" strip — a row of thumbnails, some with a duration badge. */
export const Strip: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 10 }}>
      <VideoThumbnail src="https://picsum.photos/240/170" alt="Warm-up routine" duration="0:45" />
      <VideoThumbnail duration="2:10" alt="Recovery breathing" />
      <VideoThumbnail src="https://picsum.photos/241/171" alt="Mobility flow" />
    </div>
  ),
};
