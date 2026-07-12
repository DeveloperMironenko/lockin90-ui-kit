import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { SetTable, type WorkoutSet } from '../components/SetTable';

const meta = { title: 'Native/SetTable' } satisfies Meta;
export default meta;

type Story = StoryObj;

const SESSION: WorkoutSet[] = [
  { id: 'w', setType: 'warmup', weight: 40, reps: 10, unit: 'kg', reference: '40×10', referenceTone: 'coach', done: true },
  { id: '1', setType: 'working', weight: 80, reps: 5, reference: '80×5', referenceTone: 'coach', done: true, isPr: true },
  { id: '2', setType: 'working', weight: 80, reps: 5, reference: '80×5', referenceTone: 'coach', isCurrent: true },
  { id: '3', setType: 'working', reference: '82.5×5', referenceTone: 'ai' },
  { id: 'd', setType: 'drop', weight: 60, reps: 12, reference: '60×12', referenceTone: 'ai' },
];

export const Session: Story = {
  render: () => (
    <View style={{ width: 420 }}>
      <SetTable sets={SESSION} onSetPress={() => {}} onTogglePress={() => {}} onAddSet={() => {}} />
    </View>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <View style={{ width: 420 }}>
      <SetTable sets={SESSION.map((s) => ({ ...s, isCurrent: false }))} />
    </View>
  ),
};

export const Editable: Story = {
  render: () => (
    <View style={{ width: 420 }}>
      <SetTable sets={SESSION} editable onSetPress={() => {}} onTogglePress={() => {}} />
    </View>
  ),
};

export const NoReference: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <SetTable sets={SESSION} columns={['set', 'value', 'check']} onTogglePress={() => {}} />
    </View>
  ),
};

export const WithFailureSet: Story = {
  render: () => (
    <View style={{ width: 420 }}>
      <SetTable
        sets={[
          ...SESSION,
          { id: 'f', setType: 'failure', weight: 60, reps: 8, reference: 'to failure', referenceTone: 'ai' },
        ]}
        onAddSet={() => {}}
        addLabel="Add drop set"
      />
    </View>
  ),
};
