import type { Preview } from '@storybook/react-vite';

// The new kit uses zero Tailwind utilities — components emit `lk-*` classes from
// styles.css. So we just load the design tokens + the component layer directly
// (Vite resolves these CSS modules) plus a small docs-canvas base. No Tailwind /
// postcss needed for Storybook.
import '@lockin90/tokens/tokens.css';
import '../src/styles.css';
import './preview-base.css';

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
