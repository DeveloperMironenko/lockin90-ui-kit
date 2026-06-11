import type { ReactNode } from 'react';
import Chip, { type ChipTone } from '../Chip';
import SparkLine from '../SparkLine';

export interface InsightChip {
  label: string;
  tone?: ChipTone;
}

export interface InsightCardProps {
  title: string;
  body: string;
  /** Mono eyebrow above the title, e.g. "PATTERN DETECTED". */
  eyebrow?: string;
  /** Leading icon (inline SVG) beside the eyebrow. */
  icon?: ReactNode;
  /** Meta chips under the body. */
  chips?: InsightChip[];
  /** Optional trailing sparkline series. */
  spark?: number[];
  /** Gradient top hairline (on by default). */
  lit?: boolean;
  className?: string;
}

/**
 * Insight / detected-pattern card — eyebrow + title + explanation, signal chips,
 * and an optional sparkline. The product's surfaced "here's what we noticed".
 */
export default function InsightCard({
  title,
  body,
  eyebrow,
  icon,
  chips,
  spark,
  lit = true,
  className = '',
}: InsightCardProps) {
  const hasSpark = !!spark && spark.length > 1;
  return (
    <div className={`ea-card ${lit ? 'ea-card-lit' : ''} ${className}`.trim()}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: hasSpark ? '1fr auto' : '1fr',
          gap: 16,
          alignItems: 'center',
        }}
      >
        <div className="min-w-0">
          {(eyebrow || icon) && (
            <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--accent-2)' }}>
              {icon}
              {eyebrow && <span className="ea-eyebrow" style={{ color: 'inherit' }}>{eyebrow}</span>}
            </div>
          )}
          <h4 className="text-[15px] font-semibold m-0" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h4>
          <p className="text-[13px] leading-[1.55] mt-1.5 m-0" style={{ color: 'var(--text-secondary)' }}>
            {body}
          </p>
          {chips && chips.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {chips.map((c, i) => (
                <Chip key={i} tone={c.tone ?? 'neutral'} dot>
                  {c.label}
                </Chip>
              ))}
            </div>
          )}
        </div>
        {hasSpark && <SparkLine values={spark!} width={132} height={56} color="#22D3EE" />}
      </div>
    </div>
  );
}
