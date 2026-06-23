import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Combobox, type ComboboxOption } from '../components/Combobox';

const meta = { title: 'Native/Combobox' } satisfies Meta;
export default meta;

const FOODS: ComboboxOption[] = [
  { value: 'whey', label: 'Whey shake', sublabel: '28g protein · 1 scoop · 120 kcal' },
  { value: 'eggs', label: '3 whole eggs', sublabel: '18g protein · scanned · 210 kcal' },
  { value: 'banana', label: 'Banana', sublabel: 'GL 11 · medium · 105 kcal' },
  { value: 'salmon', label: 'Salmon fillet', sublabel: '34g protein · 180g · 367 kcal' },
  { value: 'oats', label: 'Rolled oats', sublabel: '5g protein · 50g · 190 kcal' },
  { value: 'rice', label: 'Jasmine rice', sublabel: '4g protein · 1 cup · 205 kcal' },
];

export const Default: StoryObj = {
  render: () => {
    function Demo() {
      const [results, setResults] = useState<ComboboxOption[]>([]);
      return (
        <View style={{ width: 360 }}>
          <Combobox
            options={results}
            placeholder="Search foods…"
            onSearch={(q) => {
              const query = q.trim().toLowerCase();
              setResults(
                query.length === 0
                  ? []
                  : FOODS.filter((f) => f.label.toLowerCase().includes(query)),
              );
            }}
            onSelect={() => {}}
          />
        </View>
      );
    }
    return <Demo />;
  },
};

// Loading — type anything (or focus) to surface the spinner row. `loading`
// keeps the panel open even with zero options.
export const Loading: StoryObj = {
  render: () => {
    function Demo() {
      const [query, setQuery] = useState('salmon');
      return (
        <View style={{ width: 360 }}>
          <Combobox
            options={[]}
            value={query}
            loading
            placeholder="Search foods…"
            onSearch={setQuery}
            onSelect={() => {}}
          />
        </View>
      );
    }
    return <Demo />;
  },
};

// Empty — a non-empty query with no matches (and not loading) shows emptyText.
export const Empty: StoryObj = {
  render: () => {
    function Demo() {
      const [query, setQuery] = useState('quinoa');
      return (
        <View style={{ width: 360 }}>
          <Combobox
            options={[]}
            value={query}
            emptyText="No foods match “quinoa”"
            placeholder="Search foods…"
            onSearch={setQuery}
            onSelect={() => {}}
          />
        </View>
      );
    }
    return <Demo />;
  },
};
