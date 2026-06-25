import type { Preview, Decorator } from '@storybook/react-vite';
import '@lockin90/tokens/tokens.css';
import '../src/styles/index.css';

const withApp: Decorator = (Story, context) => {
  const layout = context.parameters?.layout ?? 'padded';
  // fullscreen stories (SideNav, AuroraBackground, ScrollProgress) manage their
  // own sizing — don't constrain them with a wrapper div.
  if (layout === 'fullscreen') {
    return (
      <div className="lk-app">
        <Story />
      </div>
    );
  }
  return (
    <div
      className="lk-app"
      style={{
        padding: '32px 40px',
        maxWidth: layout === 'centered' ? 560 : 1080,
        margin: '0 auto',
        minHeight: '100vh',
      }}
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
