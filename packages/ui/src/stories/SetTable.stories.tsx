import type { Meta, StoryObj } from '@storybook/react-vite';
import { SetTable, type WorkoutSet } from '../components/SetTable';

const meta: Meta<typeof SetTable> = {
  title: 'Primitives/SetTable',
  component: SetTable,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SetTable>;

const SESSION: WorkoutSet[] = [
  { id: 'w', setType: 'warmup', weight: 40, reps: 10, unit: 'kg', reference: '40×10', referenceTone: 'coach', done: true },
  { id: '1', setType: 'working', weight: 80, reps: 5, reference: '80×5', referenceTone: 'coach', done: true, isPr: true },
  { id: '2', setType: 'working', weight: 80, reps: 5, reference: '80×5', referenceTone: 'coach', isCurrent: true },
  { id: '3', setType: 'working', reference: '82.5×5', referenceTone: 'ai' },
  { id: 'd', setType: 'drop', weight: 60, reps: 12, reference: '60×12', referenceTone: 'ai' },
];

export const Session: Story = {
  args: { sets: SESSION, onSetPress: () => {}, onTogglePress: () => {}, onAddSet: () => {} },
};

export const ReadOnly: Story = {
  args: { sets: SESSION.map((s) => ({ ...s, isCurrent: false })) },
};

export const Editable: Story = {
  args: { sets: SESSION, editable: true, onSetPress: () => {}, onTogglePress: () => {} },
};

export const NoReference: Story = {
  args: { sets: SESSION, columns: ['set', 'value', 'check'], onTogglePress: () => {} },
};

export const AiReference: Story = {
  args: {
    sets: SESSION.map((s) => ({ ...s, referenceTone: 'ai' as const })),
    referenceHeader: 'AI target',
  },
};

export const WithFailureSet: Story = {
  args: {
    sets: [
      ...SESSION,
      { id: 'f', setType: 'failure', weight: 60, reps: 8, reference: 'to failure', referenceTone: 'ai' },
    ],
    onAddSet: () => {},
    addLabel: 'Add drop set',
  },
};
