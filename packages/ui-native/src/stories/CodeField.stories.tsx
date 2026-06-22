import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { CodeField } from '../components/CodeField';

const meta = { title: 'Native/CodeField' } satisfies Meta;
export default meta;

type Story = StoryObj;

function Controlled(props: Partial<ComponentProps<typeof CodeField>>) {
  const [value, setValue] = useState(props.value ?? '');
  return <CodeField {...props} value={value} onChange={setValue} />;
}

export const Default: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <Controlled placeholder="Paste an embed or code snippet…" />
    </View>
  ),
};

export const WithLanguage: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <Controlled
        language="html"
        value={'<iframe\n  src="https://example.com/embed"\n  loading="lazy"\n></iframe>'}
      />
    </View>
  ),
};

export const Invalid: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <Controlled language="js" invalid value={'const broken = (;'} />
    </View>
  ),
};
