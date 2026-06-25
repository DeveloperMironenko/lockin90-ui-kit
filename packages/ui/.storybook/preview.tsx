import type { Preview, Decorator } from '@storybook/react-vite';
import '@lockin90/tokens/tokens.css';
import '../src/styles/index.css';

const withApp: Decorator = (Story, context) => {
  const layout = context.parameters?.layout ?? 'padded';

  // fullscreen: Storybook manages the canvas — just apply the theme root.
  if (layout === 'fullscreen') {
    return (
      <div className="lk-app">
        <Story />
      </div>
    );
  }

  // centered: dark void bg + comfortable padding so pseudo-elements aren't clipped.
  if (layout === 'centered') {
    return (
      <div className="lk-app" style={{ padding: 40, background: 'var(--bg-0, #080A12)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Story />
      </div>
    );
  }

  // padded: give a comfortable reading width with consistent padding.
  return (
    <div
      className="lk-app"
      style={{ padding: '32px 40px', maxWidth: 1080, margin: '0 auto' }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withApp],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'void',
      values: [{ name: 'void', value: '#080A12' }],
    },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
};

export default preview;
