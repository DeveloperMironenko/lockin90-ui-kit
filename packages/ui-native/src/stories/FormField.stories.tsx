import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { FormField, SearchInput } from '../components/FormField';
import { Input } from '../components/Input';

const meta = { title: 'Native/FormField' } satisfies Meta;
export default meta;

export const Default: StoryObj = {
  render: () => (
    <View style={{ width: 320 }}>
      <FormField label="Email" help="We'll never share it.">
        <Input placeholder="you@example.com" />
      </FormField>
    </View>
  ),
};

export const Error: StoryObj = {
  render: () => (
    <View style={{ width: 320 }}>
      <FormField label="Email" required error="Enter a valid email address.">
        <Input placeholder="you@example.com" invalid defaultValue="not-an-email" />
      </FormField>
    </View>
  ),
};

export const Search: StoryObj = {
  render: () => (
    <View style={{ width: 320 }}>
      <SearchInput placeholder="Search…" />
    </View>
  ),
};
