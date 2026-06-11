import type { Meta, StoryObj } from '@storybook/react-vite';
import CoachPlanItem from './index';

const meta = {
  title: 'Patterns/CoachPlanItem',
  component: CoachPlanItem,
} satisfies Meta<typeof CoachPlanItem>;

export default meta;
type Story = StoryObj;

const Dot = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l3 2" />
  </svg>
);

export const Plan: Story = {
  render: () => (
    <div style={{ width: 380 }} className="ea-card">
      <CoachPlanItem icon={<Dot />} title="Cut caffeine after 2pm" detail="Protects deep sleep tonight" done />
      <div className="ea-divider" style={{ margin: 0 }} />
      <CoachPlanItem icon={<Dot />} title="10-min wind-down walk" detail="Lowers evening cortisol" done />
      <div className="ea-divider" style={{ margin: 0 }} />
      <CoachPlanItem icon={<Dot />} title="Lights out by 10:30pm" detail="Targets 8h sleep window" />
      <div className="ea-divider" style={{ margin: 0 }} />
      <CoachPlanItem icon={<Dot />} title="Log tomorrow's breakfast" detail="Improves energy attribution" />
    </div>
  ),
};
