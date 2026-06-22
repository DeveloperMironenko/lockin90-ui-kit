import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { RichTextEditor } from '../components/RichTextEditor';

const meta = { title: 'Native/RichTextEditor' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => {
    function Demo() {
      const [text, setText] = useState('');
      return (
        <View style={{ width: 320 }}>
          <RichTextEditor value={text} onChange={setText} />
        </View>
      );
    }
    return <Demo />;
  },
};

export const WithContent: Story = {
  render: () => {
    function Demo() {
      const [text, setText] = useState(
        'Sleep is the foundation.\n\nA consistent schedule beats any supplement.',
      );
      return (
        <View style={{ width: 320 }}>
          <RichTextEditor value={text} onChange={setText} />
        </View>
      );
    }
    return <Demo />;
  },
};

export const Invalid: Story = {
  render: () => {
    function Demo() {
      const [text, setText] = useState('');
      return (
        <View style={{ width: 320 }}>
          <RichTextEditor value={text} onChange={setText} invalid placeholder="This field is required" />
        </View>
      );
    }
    return <Demo />;
  },
};
