import type { Meta, StoryObj } from '@storybook/react-vite';
import { BackLink } from '../components/BackLink';

const meta = {
  title: 'Primitives/BackLink',
  component: BackLink,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof BackLink>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Custom: StoryObj<typeof meta> = { args: { label: 'Exercises' } };

/**
 * Glass-chip mono affordance. Matches the auth brand-panel "Back to site"
 * button — bordered glass surface, dim mono label, static icon (no hover
 * nudge). Shown here on a glass card to read against translucent chrome.
 */
export const Pill: StoryObj<typeof meta> = {
  args: { label: 'Back to site', variant: 'pill' },
  render: (args) => (
    <div
      style={{
        padding: 28,
        borderRadius: 22,
        border: '1px solid var(--border)',
        background: 'var(--glass)',
      }}
    >
      <BackLink {...args} />
    </div>
  ),
};
