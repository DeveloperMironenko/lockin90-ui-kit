import type { Preview, Decorator } from '@storybook/react-vite';
import '@lockin90/tokens/tokens.css';
import '../src/styles/index.css';

const withApp: Decorator = (Story) => (
  <div className="lk-app" style={{ padding: 28, maxWidth: 720 }}>
    <Story />
  </div>
);

const preview: Preview = {
  decorators: [withApp],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'void',
      values: [{ name: 'void', value: '#080A12' }],
    },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
};

export default preview;
