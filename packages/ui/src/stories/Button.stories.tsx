import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';

const meta = {
  title: 'Primitives/Button',
  component: Button,
} satisfies Meta<typeof Button>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { children: 'Log check-in', variant: 'primary' } };

/** `leading` icon slot — e.g. SSO brand buttons. */
export const Sso: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button variant="ghost" leading={<Icon name="google" />}>
        Continue with Google
      </Button>
      <Button variant="ghost" leading={<Icon name="apple" />}>
        Continue with Apple
      </Button>
    </div>
  ),
};
