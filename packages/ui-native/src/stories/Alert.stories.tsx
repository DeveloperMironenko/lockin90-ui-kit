import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Alert } from '../components/Alert';

const meta = {
  title: 'Native/Alert',
  component: Alert,
} satisfies Meta<typeof Alert>;
export default meta;

type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: { title: 'Heads up', children: 'Your estimates use data from 30+ days ago.' },
};

export const Success: Story = {
  args: { tone: 'success', title: 'Saved' },
};

export const Warn: Story = {
  args: { tone: 'warn', title: 'Late caffeine detected' },
};

export const Danger: Story = {
  args: { tone: 'danger', title: 'Payment failed', onDismiss: () => {} },
};

export const Dismissable: Story = {
  args: { tone: 'danger', title: 'Payment failed', onDismiss: () => {} },
};

export const AllTones: Story = {
  render: () => (
    <View style={{ gap: 12, width: 320 }}>
      <Alert tone="info" title="Heads up">Your estimates use data from 30+ days ago.</Alert>
      <Alert tone="success" title="Saved" />
      <Alert tone="warn" title="Late caffeine detected" />
      <Alert tone="danger" title="Payment failed" onDismiss={() => {}} />
    </View>
  ),
};

/** A quiet note on a glass box (sign-up's timezone note): no accent bar, a cyan icon. */
export const Neutral: Story = {
  args: { tone: 'neutral', children: 'Timezone auto-detected: Europe/Warsaw — used to align your energy curve to your day.' },
};

/** A quiet note on a cyan tint (the forgot-password privacy note). */
export const Cyan: Story = {
  args: {
    tone: 'cyan',
    children: "For your security, we'll show the same confirmation whether or not an account exists for that address.",
  },
};
