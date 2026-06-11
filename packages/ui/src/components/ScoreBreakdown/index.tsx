import BarFill from '../BarFill';

export interface ScoreContribution {
  /** Driver name, e.g. "Deep sleep". */
  name: string;
  /** Short explanation. */
  detail?: string;
  /** Signed contribution to the score (+/-). */
  value: number;
}

export interface ScoreBreakdownProps {
  items: ScoreContribution[];
  className?: string;
}

const ZONE_HIGH = '#34F5C5';
const ZONE_LOW = '#FF4D6D';

/**
 * "What moved the score" list — one row per driver: name + detail, a signed
 * value (mint up / coral down) and a spectrum bar sized by relative magnitude.
 */
export default function ScoreBreakdown({ items, className = '' }: ScoreBreakdownProps) {
  const maxAbs = Math.max(1, ...items.map((i) => Math.abs(i.value)));
  return (
    <div className={`flex flex-col gap-4 ${className}`.trim()}>
      {items.map((item, i) => {
        const positive = item.value >= 0;
        return (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>
                  {item.name}
                </span>
                {item.detail && (
                  <span className="text-[12.5px] ml-2" style={{ color: 'var(--text-muted)' }}>
                    {item.detail}
                  </span>
                )}
              </div>
              <span
                className="font-mono text-[13px] tabular-nums shrink-0"
                style={{ color: positive ? ZONE_HIGH : ZONE_LOW }}
              >
                {positive ? '+' : '−'}
                {Math.abs(item.value)}
              </span>
            </div>
            <BarFill value={Math.abs(item.value) / maxAbs} tone={positive ? 'mint' : 'warm'} height={8} />
          </div>
        );
      })}
    </div>
  );
}
