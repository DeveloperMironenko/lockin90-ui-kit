import type { Preview } from '@storybook/react-vite';

// Pulls in the design tokens, the shared ea-* component classes, and the
// Tailwind utility layer (generated from ./tailwind.css via postcss).
import './tailwind.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'void',
      values: [
        { name: 'void', value: '#080A12' },
        { name: 'panel', value: '#0C0F1A' },
        { name: 'deep-void', value: '#05060B' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
