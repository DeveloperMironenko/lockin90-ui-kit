import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Sortable, type SortableItem } from '../components/Sortable';

const meta = {
  title: 'Primitives/Sortable',
  component: Sortable,
  args: { items: [], onReorder: () => {} },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Sortable>;
export default meta;

const ROWS: Record<string, string> = {
  hero: 'Hero — cover image',
  rich: 'Rich text — intro paragraph',
  quote: 'Quote — testimonial',
  gallery: 'Gallery — 6 photos',
  cta: 'Call to action — get started',
};

/** Interactive wrapper that owns the order and re-renders on reorder. */
function Demo({ handle = true, disabled = false }: { handle?: boolean; disabled?: boolean }) {
  const [order, setOrder] = useState(Object.keys(ROWS));
  const items: SortableItem[] = order.map((id) => ({
    id,
    node: <span style={{ display: 'block', padding: '8px 10px' }}>{ROWS[id]}</span>,
  }));
  return (
    <div style={{ width: 360 }}>
      <Sortable
        items={items}
        onReorder={setOrder}
        handle={handle}
        disabled={disabled}
      />
    </div>
  );
}

export const Default: StoryObj<typeof meta> = { render: () => <Demo /> };

export const WholeRowDrag: StoryObj<typeof meta> = { render: () => <Demo handle={false} /> };

export const Disabled: StoryObj<typeof meta> = { render: () => <Demo disabled /> };
