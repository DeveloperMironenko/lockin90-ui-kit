import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sheet } from '../components/Sheet';

const meta = {
  title: 'Primitives/Sheet',
  component: Sheet,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Sheet>;
export default meta;

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 4px',
  borderBottom: '1px solid var(--border)',
  color: 'var(--text)',
};

function BottomDemo() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open sheet
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} side="bottom" title="Choose set type">
        <div style={rowStyle}>Working set</div>
        <div style={rowStyle}>Warm-up</div>
        <div style={rowStyle}>Drop set</div>
        <div style={{ ...rowStyle, borderBottom: 'none' }}>Failure</div>
      </Sheet>
    </>
  );
}

export const Bottom: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      description: {
        story:
          'Drag the handle (or the title strip) down to dismiss — past ~25% of the sheet height, or with a quick downward fling. A shorter drag snaps back.',
      },
    },
  },
  render: () => <BottomDemo />,
};

export const Right: StoryObj<typeof meta> = {
  render: () => (
    <Sheet open side="right" title="Filters">
      <div style={rowStyle}>Date range</div>
      <div style={rowStyle}>Energy zone</div>
      <div style={{ ...rowStyle, borderBottom: 'none' }}>Source</div>
    </Sheet>
  ),
};
