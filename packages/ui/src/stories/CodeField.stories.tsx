import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeField } from '../components/CodeField';

const meta = {
  title: 'Primitives/CodeField',
  component: CodeField,
  args: { value: '', onChange: () => {} },
} satisfies Meta<typeof CodeField>;
export default meta;

function Controlled(props: Partial<ComponentProps<typeof CodeField>>) {
  const [value, setValue] = useState(props.value ?? '');
  return <CodeField {...props} value={value} onChange={setValue} />;
}

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ width: 480 }}>
      <Controlled placeholder="Paste an embed or code snippet…" />
    </div>
  ),
};

export const WithLanguage: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ width: 480 }}>
      <Controlled
        language="html"
        value={'<iframe\n  src="https://example.com/embed"\n  loading="lazy"\n></iframe>'}
      />
    </div>
  ),
};

export const Wrapped: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ width: 480 }}>
      <Controlled
        language="json"
        wrap
        value={'{ "id": "evt_01HXYZ", "type": "session.completed", "data": { "score": 87, "streak": 12 } }'}
      />
    </div>
  ),
};

export const Invalid: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ width: 480 }}>
      <Controlled language="js" invalid value={'const broken = (;'} />
    </div>
  ),
};
