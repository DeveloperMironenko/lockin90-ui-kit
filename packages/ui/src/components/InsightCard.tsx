import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

export interface InsightChips {
  /** sample size, e.g. 24 */
  n?: number;
  /** p-value label, e.g. 'p < 0.01' */
  p?: string;
  /** confidence percent 0..100, e.g. 86 */
  confidence?: number;
}

export interface InsightCardProps extends HTMLAttributes<HTMLDivElement> {
  /** headline of the finding */
  title?: string;
  /** plain-language body; ReactNode so consumers can pass <b>…</b> emphasis */
  body?: ReactNode;
  /** status pill text, e.g. 'CONFIRMED' (omit to hide) */
  status?: string;
  /** signed effect size shown large on the right, e.g. '−9.2' */
  effect?: string;
  /** sign of the effect — drives the effect color (high/low) */
  effectSign?: 'pos' | 'neg';
  /** evidence sparkline points (y values, any scale) */
  spark?: number[];
  /** p · n · confidence chips */
  chips?: InsightChips;
}

const SPARK_W = 150;
const SPARK_H = 64;
const PAD_X = 2;
const PAD_TOP = 16;
const PAD_BOTTOM = 14;

/** Map raw spark values to an SVG "x y" point list spanning the viewBox. */
function sparkPoints(values: number[]): { x: number; y: number }[] {
  const n = values.length;
  if (n === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const usableW = SPARK_W - PAD_X * 2;
  const usableH = SPARK_H - PAD_TOP - PAD_BOTTOM;
  return values.map((v, i) => ({
    x: PAD_X + (n === 1 ? usableW / 2 : (usableW * i) / (n - 1)),
    y: PAD_TOP + usableH * (1 - (v - min) / range),
  }));
}

/** AI insight surface — headline + prose, effect size, evidence sparkline,
 *  and p · n · confidence stat chips. Renders the showcase example by default. */
export function InsightCard({
  title = 'Late caffeine is draining your evenings',
  body = (
    <>
      <b>Caffeine after 2pm costs you ~9 energy points</b> on the same evening. Across 24 logged afternoons your
      wind-down score dropped from a typical 71 to 62 whenever coffee landed past 14:00.
    </>
  ),
  status = 'CONFIRMED',
  effect = '−9.2',
  effectSign = 'neg',
  spark = [42, 46, 38, 43, 30, 23, 26, 14],
  chips = { n: 24, p: 'p < 0.01', confidence: 86 },
  className,
  ...rest
}: InsightCardProps) {
  const fillId = useId();
  const pts = sparkPoints(spark);
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  const fill = pts.length
    ? `${line} L${(SPARK_W - PAD_X).toFixed(1)} ${(SPARK_H - PAD_BOTTOM).toFixed(1)} L${PAD_X.toFixed(1)} ${(
        SPARK_H - PAD_BOTTOM
      ).toFixed(1)} Z`
    : '';

  return (
    <div className={cn('lk-card', 'lk-ins-card', className)} {...rest}>
      <div className="lk-ins-main">
        <div className="lk-ins-head">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1v.2h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z" />
          </svg>
          <h4 className="lk-ins-title">{title}</h4>
        </div>
        <p className="lk-ins-body">{body}</p>
        <div className="lk-ins-meta">
          {status && (
            <Chip tone="accent" dot className="lk-mono">
              {status}
            </Chip>
          )}
          {chips?.p && (
            <Chip className="lk-mono">
              <span className="lk-tnum">{chips.p}</span>
            </Chip>
          )}
          {chips?.n != null && (
            <Chip className="lk-mono">
              <span className="lk-tnum">n = {chips.n}</span>
            </Chip>
          )}
          {chips?.confidence != null && (
            <Chip tone="high" className="lk-mono">
              <span className="lk-tnum">{chips.confidence}%</span> conf
            </Chip>
          )}
        </div>
      </div>
      <div className="lk-ins-right">
        <span className={cn('lk-ins-eff', effectSign === 'pos' ? 'lk-pos' : 'lk-neg', 'lk-tnum')}>{effect}</span>
        <svg className="lk-ins-spark" viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--accent-2)" stopOpacity="0.28" />
              <stop offset="1" stopColor="var(--accent-2)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {fill && <path className="lk-ins-spark-fill" d={fill} fill={`url(#${fillId})`} />}
          {line && <path className="lk-ins-spark-line" d={line} />}
          {last && <circle cx={last.x} cy={last.y} r="3" />}
        </svg>
      </div>
    </div>
  );
}
