import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RichTextEditor } from '../components/RichTextEditor';

const meta = {
  title: 'Primitives/RichTextEditor',
  component: RichTextEditor,
  args: { value: '', onChange: () => {} },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof RichTextEditor>;
export default meta;

type Story = StoryObj<typeof meta>;

function Controlled({ initial = '' }: { initial?: string }) {
  const [html, setHtml] = useState(initial);
  return (
    <div style={{ width: 560, maxWidth: '100%' }}>
      <RichTextEditor value={html} onChange={setHtml} />
    </div>
  );
}

export const Default: Story = {
  render: () => <Controlled />,
};

export const WithContent: Story = {
  render: () => (
    <Controlled
      initial={
        '<h2>Sleep is the foundation</h2><p>A consistent schedule beats <b>any</b> supplement. Try these:</p><ul><li>Same wake time daily</li><li>No screens 30m before bed</li></ul><blockquote>Energy compounds.</blockquote>'
      }
    />
  ),
};

export const Invalid: Story = {
  render: () => {
    function Demo() {
      const [html, setHtml] = useState('');
      return (
        <div style={{ width: 560, maxWidth: '100%' }}>
          <RichTextEditor value={html} onChange={setHtml} invalid placeholder="This field is required" />
        </div>
      );
    }
    return <Demo />;
  },
};

export const LimitedToolbar: Story = {
  render: () => {
    function Demo() {
      const [html, setHtml] = useState('');
      return (
        <div style={{ width: 560, maxWidth: '100%' }}>
          <RichTextEditor
            value={html}
            onChange={setHtml}
            toolbar={['bold', 'italic', 'link', 'clear']}
            minRows={3}
          />
        </div>
      );
    }
    return <Demo />;
  },
};
