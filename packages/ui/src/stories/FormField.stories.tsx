import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from '../components/FormField';
import { SearchInput } from '../components/FormField';
import { Input } from '../components/Input';

const meta = {
  title: 'Primitives/FormField',
  component: FormField,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FormField>;
export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <FormField label="Email" help="We'll never share it.">
      <Input placeholder="you@example.com" />
    </FormField>
  ),
};

export const Error: StoryObj<typeof meta> = {
  render: () => (
    <FormField label="Email" required error="Enter a valid email address.">
      <Input placeholder="you@example.com" invalid defaultValue="not-an-email" />
    </FormField>
  ),
};

export const Search: StoryObj<typeof meta> = {
  render: () => <SearchInput />,
};

export const SearchWithKbdHint: StoryObj<typeof meta> = {
  render: () => <SearchInput kbdHint="⌘K" placeholder="Search anything…" />,
};
