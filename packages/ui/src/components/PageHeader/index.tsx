import type { PageHeaderProps } from './types';

export default function PageHeader({ eyebrow, title, slashWidth = 60, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-3">
      <div>
        <div className="ea-eyebrow mb-1">{eyebrow}</div>
        <div className="ea-display text-[28px] text-white">{title}</div>
        <div
          className="mt-2 h-0.5 bg-accent origin-left rotate-[-8deg]"
          style={{ width: slashWidth }}
        />
      </div>
      {actions}
    </div>
  );
}
