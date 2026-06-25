import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateField, TreeItem } from '../components/DateField';

const meta = {
  title: 'Primitives/DateField',
  component: DateField,
  args: { label: 'Publish date' },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DateField>;
export default meta;

export const Default: StoryObj<typeof meta> = {};

export const Tree: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ width: 320 }}>
      <TreeItem label="Product" depth={0} expandable expanded active dragHandle>
        <TreeItem label="Features" depth={1} dragHandle />
        <TreeItem label="Science" depth={1} dragHandle />
      </TreeItem>
    </div>
  ),
};
