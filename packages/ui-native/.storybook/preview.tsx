import type { Preview, Decorator } from '@storybook/react-native-web-vite';
import { View } from 'react-native';

/** Wrap every native story in the Aurora-Flux "void" surface, sized like a phone
 *  column so it reads as the mobile app (and screenshot-diffs against web phone width). */
const withApp: Decorator = (Story) => (
  <View style={{ backgroundColor: '#080A12', padding: 24, maxWidth: 420, minHeight: '100%' }}>
    <Story />
  </View>
);

const preview: Preview = {
  decorators: [withApp],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'void',
      values: [{ name: 'void', value: '#080A12' }],
    },
  },
};

export default preview;
