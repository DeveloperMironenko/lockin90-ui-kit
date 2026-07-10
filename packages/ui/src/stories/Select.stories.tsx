import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../components/Icon';
import { Select } from '../components/Select';

const meta: Meta<typeof Select> = {
  title: 'Primitives/Select',
  component: Select,
  parameters: { layout: 'centered' },
  // the trigger is width:100% — give it width so it doesn't collapse to the chevron
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

export const Default: StoryObj<typeof Select> = {
  args: { placeholder: 'Select an option' },
};

export const WithLabel: StoryObj<typeof Select> = {
  args: {
    label: 'Unit system',
    options: [
      { value: 'metric', label: 'Metric (kg)' },
      { value: 'imperial', label: 'Imperial (lb)' },
    ],
  },
};

/** `searchable` — long catalogs (like timezones) open a FIXED-height panel with a
 *  kit `SearchInput` (shape="sm", autofocused) that filters options by label,
 *  case-insensitively. Arrows/Enter work within the filtered list; Esc closes.
 *  Mirrors the native Select's searchable option sheet. */
export const Searchable: StoryObj<typeof Select> = {
  args: {
    label: 'Timezone',
    placeholder: 'Select a timezone',
    searchable: true,
    searchPlaceholder: 'Search timezones…',
    options: [
      { value: 'utc', label: 'UTC (GMT+0)' },
      { value: 'london', label: 'London (GMT+0)' },
      { value: 'lisbon', label: 'Lisbon (GMT+0)' },
      { value: 'warsaw', label: 'Warsaw (GMT+1)' },
      { value: 'berlin', label: 'Berlin (GMT+1)' },
      { value: 'paris', label: 'Paris (GMT+1)' },
      { value: 'madrid', label: 'Madrid (GMT+1)' },
      { value: 'rome', label: 'Rome (GMT+1)' },
      { value: 'kyiv', label: 'Kyiv (GMT+2)' },
      { value: 'athens', label: 'Athens (GMT+2)' },
      { value: 'helsinki', label: 'Helsinki (GMT+2)' },
      { value: 'istanbul', label: 'Istanbul (GMT+3)' },
      { value: 'dubai', label: 'Dubai (GMT+4)' },
      { value: 'karachi', label: 'Karachi (GMT+5)' },
      { value: 'dhaka', label: 'Dhaka (GMT+6)' },
      { value: 'bangkok', label: 'Bangkok (GMT+7)' },
      { value: 'singapore', label: 'Singapore (GMT+8)' },
      { value: 'tokyo', label: 'Tokyo (GMT+9)' },
      { value: 'sydney', label: 'Sydney (GMT+10)' },
      { value: 'auckland', label: 'Auckland (GMT+12)' },
      { value: 'sao-paulo', label: 'São Paulo (GMT-3)' },
      { value: 'new-york', label: 'New York (GMT-5)' },
      { value: 'chicago', label: 'Chicago (GMT-6)' },
      { value: 'denver', label: 'Denver (GMT-7)' },
      { value: 'los-angeles', label: 'Los Angeles (GMT-8)' },
    ],
  },
};

/** `size="sm"` — the design settings `.pref-select` compact mono glass pill,
 *  with an optional `leading` icon (the `.lang-wrap` globe on Language). */
export const SmallPill: StoryObj<typeof Select> = {
  args: {
    size: 'sm',
    value: 'en',
    leading: <Icon name="globe" size={14} style={{ color: 'var(--accent-2)' }} />,
    options: [
      { value: 'en', label: 'English' },
      { value: 'uk', label: 'Українська' },
    ],
  },
};
