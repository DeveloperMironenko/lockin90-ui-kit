import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { colors } from '@lockin90/tokens';
import { MessageComposer } from '../components/MessageComposer';

const meta = { title: 'Native/MessageComposer' } satisfies Meta;
export default meta;

type Story = StoryObj;

function Demo(props: { placeholder?: string; e2ee?: boolean; disabled?: boolean }) {
  const [sent, setSent] = useState<string[]>([]);
  return (
    <View style={{ width: 360, gap: 12 }}>
      {sent.map((m, i) => (
        <View
          key={i}
          style={{
            alignSelf: 'flex-end',
            maxWidth: '80%',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 14,
            backgroundColor: colors.glass2,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ color: colors.text, fontSize: 13 }}>{m}</Text>
        </View>
      ))}
      <MessageComposer {...props} onSend={(t) => setSent((s) => [...s, t])} />
    </View>
  );
}

export const Default: Story = {
  render: () => <Demo placeholder="Message Dr. Petrov…" />,
};

export const Encrypted: Story = {
  render: () => <Demo e2ee placeholder="Encrypted message…" />,
};

export const Disabled: Story = {
  render: () => <Demo disabled placeholder="You can't reply here" />,
};
