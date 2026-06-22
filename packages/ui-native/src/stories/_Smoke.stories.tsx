import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Avatar } from '../components/Avatar';
import { Icon } from '../components/Icon';
import { Ring } from '../components/Ring';
import { Toggle } from '../components/Toggle';
import { Stat } from '../components/Stat';
import { Card } from '../components/Card';

const meta = { title: 'Native/Smoke' } satisfies Meta;
export default meta;

/** Broad smoke test — exercises StyleSheet, react-native-svg (Icon/Ring) and
 *  expo-linear-gradient (Button/Toggle/Ring) through react-native-web. */
export const Smoke: StoryObj = {
  render: () => (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button title="Log check-in" variant="primary" />
        <Button title="Cancel" variant="ghost" />
      </View>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Chip tone="high" dot label="on track" />
        <Chip tone="mid" dot label="at risk" />
        <Chip label="default" />
      </View>
      <View style={{ flexDirection: 'row', gap: 18, alignItems: 'center' }}>
        <Avatar name="Maya Kane" size={44} />
        <Icon name="check" size={24} color="#34F5C5" />
        <Ring value={72} size={88} />
        <Toggle checked />
        <Stat label="Energy" value="76" />
      </View>
      <Card lit>
        <Text style={{ color: '#E8ECF8', fontSize: 13 }}>Glass card surface</Text>
      </Card>
    </View>
  ),
};
