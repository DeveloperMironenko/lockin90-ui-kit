import type { Preview } from '@storybook/react-vite';

// Pulls in the design tokens, the shared ea-* component classes, and the
// Tailwind utility layer (generated from ./tailwind.css via postcss).
import './tailwind.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'surface', value: '#0A0A0A' },
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
