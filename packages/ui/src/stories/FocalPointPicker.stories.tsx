import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FocalPointPicker, type FocalPoint } from '../components/FocalPointPicker';

const meta = {
  title: 'Primitives/FocalPointPicker',
  component: FocalPointPicker,
  args: { src: '', value: { x: 0.5, y: 0.5 }, onChange: () => {} },
} satisfies Meta<typeof FocalPointPicker>;
export default meta;

const SAMPLE =
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80';

function Interactive(args: { aspect?: number; showGrid?: boolean }) {
  const [point, setPoint] = useState<FocalPoint>({ x: 0.5, y: 0.4 });
  return (
    <div style={{ width: 420 }}>
      <FocalPointPicker src={SAMPLE} value={point} onChange={setPoint} {...args} />
      <p style={{ fontFamily: 'monospace', color: '#AAB2C6', marginTop: 10 }}>
        x: {point.x.toFixed(3)} · y: {point.y.toFixed(3)}
      </p>
    </div>
  );
}

export const Default: StoryObj<typeof meta> = {
  render: () => <Interactive />,
};

export const Portrait: StoryObj<typeof meta> = {
  render: () => <Interactive aspect={0.8} />,
};

export const NoGrid: StoryObj<typeof meta> = {
  render: () => <Interactive showGrid={false} />,
};
