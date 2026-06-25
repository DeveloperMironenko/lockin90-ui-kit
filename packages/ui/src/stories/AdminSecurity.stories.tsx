import type { Meta, StoryObj } from '@storybook/react-vite';
import { RecoveryCodeGrid } from '../admin/RecoveryCodeGrid';
import { ReferenceRangeBar } from '../admin/ReferenceRangeBar';

/* Combined catalog for the two operator-console primitives:
   RecoveryCodeGrid (MFA backup codes) + ReferenceRangeBar (lab reference ranges). */
const meta = {
  title: 'Primitives/RecoveryCodeGrid & ReferenceRangeBar',
  parameters: { layout: 'padded' },
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

// 10 masked recovery codes, two of them already consumed (struck through).
const CODES = [
  { masked: '7•••-•••2' },
  { masked: '4•••-•••9' },
  { masked: 'b•••-•••e' },
  { masked: '1•••-•••0', used: true },
  { masked: '9•••-•••3' },
  { masked: 'c•••-•••a' },
  { masked: '8•••-•••f', used: true },
  { masked: '2•••-•••7' },
  { masked: 'e•••-•••5' },
  { masked: '3•••-•••b' },
];

/** The 10-code MFA recovery grid with 2 used codes + an "8 of 10 unused" header. */
export const RecoveryCodes: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <RecoveryCodeGrid codes={CODES} unusedCount={8} />
    </div>
  ),
};

/** A lab reference-range bar (Vitamin D 25-OH) with a measured value marked. */
export const LabReferenceRange: Story = {
  render: () => (
    <div style={{ maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Vitamin D — value below the normal band → warn-toned marker */}
      <ReferenceRangeBar
        low={30}
        high={80}
        displayMin={0}
        displayMax={100}
        unit="ng/mL"
        value={22}
      />
      {/* Ferritin — value inside the normal band → ok-toned marker */}
      <ReferenceRangeBar
        low={30}
        high={300}
        displayMin={0}
        displayMax={400}
        unit="ng/mL"
        value={142}
      />
      {/* hs-CRP — no value supplied → pure reference range, no marker */}
      <ReferenceRangeBar low={0} high={3} displayMin={0} displayMax={10} unit="mg/L" />
    </div>
  ),
};

/** Both primitives side by side, as they'd appear across the admin surfaces. */
export const Combined: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ maxWidth: 420, flex: '1 1 360px' }}>
        <RecoveryCodeGrid codes={CODES} unusedCount={8} />
      </div>
      <div style={{ maxWidth: 280, flex: '0 1 280px' }}>
        <ReferenceRangeBar
          low={400}
          high={800}
          displayMin={264}
          displayMax={916}
          unit="ng/dL"
          value={742}
        />
      </div>
    </div>
  ),
};
