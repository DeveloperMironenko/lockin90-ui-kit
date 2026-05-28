export type StatusTone = 'green' | 'amber' | 'red' | 'neutral' | 'info';

export interface StatusBadgeProps {
  tone: StatusTone;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}
