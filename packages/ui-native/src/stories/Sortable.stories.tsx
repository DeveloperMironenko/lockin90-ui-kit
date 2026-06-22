import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { Sortable, type SortableItem } from '../components/Sortable';

const meta = { title: 'Native/Sortable' } satisfies Meta;
export default meta;

type Story = StoryObj;

const ROWS: Record<string, string> = {
  hero: 'Hero — cover image',
  rich: 'Rich text — intro',
  quote: 'Quote — testimonial',
  gallery: 'Gallery — 6 photos',
  cta: 'Call to action',
};

function Demo({ handle = true, disabled = false }: { handle?: boolean; disabled?: boolean }) {
  const [order, setOrder] = useState(Object.keys(ROWS));
  const items: SortableItem[] = order.map((id) => ({ id, node: ROWS[id] }));
  return (
    <View style={{ width: 340 }}>
      <Sortable items={items} onReorder={setOrder} handle={handle} disabled={disabled} />
    </View>
  );
}

export const Default: Story = { render: () => <Demo /> };

export const WholeRowDrag: Story = { render: () => <Demo handle={false} /> };

export const Disabled: Story = { render: () => <Demo disabled /> };
