import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';
import { ForecastCallout } from '../components/ForecastCallout';

const meta = {
  title: 'Native/ForecastCallout',
  component: ForecastCallout,
} satisfies Meta<typeof ForecastCallout>;
export default meta;

type Story = StoryObj<typeof ForecastCallout>;

const prose = (lead: string, rest: string) => (
  <Text style={{ fontFamily: fonts.ui, fontSize: 13, lineHeight: 19, color: colors.textDim }}>
    <Text style={{ fontWeight: '700', color: colors.text }}>{lead}</Text>
    {rest}
  </Text>
);

export const Default: Story = {
  args: {
    chip: 'Forecast',
    icon: 'sparkle',
    children: prose('31-day outlook', ' trends steady — no major swings projected this cycle.'),
  },
};

export const PositivePeak: Story = {
  args: {
    tone: 'positive',
    chip: 'peak',
    children: prose('Projected 88', ' on Fri, Jun 26 — deload week. Best max-effort window.'),
  },
};

export const NegativeDip: Story = {
  args: {
    tone: 'negative',
    chip: 'dip',
    children: prose('Dips to 54', ' on Tue, Jun 16 — back-to-back meetings + short sleep.'),
  },
};

export const Warn: Story = {
  args: {
    tone: 'warn',
    chip: 'caution',
    icon: 'warning',
    children: prose('Recovery lagging', ' — three high-strain days in a row may flatten your peak.'),
  },
};

export const AllTones: Story = {
  render: () => (
    <View style={{ gap: 12, width: 320 }}>
      <ForecastCallout chip="Forecast" icon="sparkle">
        {prose('31-day outlook', ' trends steady — no major swings projected this cycle.')}
      </ForecastCallout>
      <ForecastCallout tone="positive" chip="peak">
        {prose('Projected 88', ' on Fri, Jun 26 — deload week. Best max-effort window.')}
      </ForecastCallout>
      <ForecastCallout tone="negative" chip="dip">
        {prose('Dips to 54', ' on Tue, Jun 16 — back-to-back meetings + short sleep.')}
      </ForecastCallout>
      <ForecastCallout tone="warn" chip="caution" icon="warning">
        {prose('Recovery lagging', ' — three high-strain days in a row may flatten your peak.')}
      </ForecastCallout>
    </View>
  ),
};
