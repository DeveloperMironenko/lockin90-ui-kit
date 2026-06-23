import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Card } from './Card';
import { Button } from './Button';
import { Chip } from './Chip';
import { Icon } from './Icon';

export interface PendingPatternConfidence {
  label: string;
  value: string;
}

export interface PendingPatternCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The detected-pattern prose — what the engine thinks it found. */
  interpretation: ReactNode;
  /** Effect line, e.g. '+8 energy when sleep > 7h'. Signed value is highlighted
   *  (mint for +, red for −). */
  effect?: string;
  /** Optional supporting chips, e.g. `[{ label: 'n', value: '22 events' }]`. */
  confidence?: PendingPatternConfidence[];
  onAccept?: () => void;
  onDismiss?: () => void;
  /** @default 'Accept' */
  acceptLabel?: string;
  /** @default 'Dismiss' */
  dismissLabel?: string;
}

/** Split an effect string into its leading signed token and the trailing prose,
 *  so the magnitude (e.g. `+8`, `−18m`) can be emphasized and tone-colored. */
function splitEffect(effect: string): { sign: 'pos' | 'neg' | 'none'; value: string; rest: string } {
  const match = /^\s*([+\-−]\s*[\d.,]+\s*[^\s]*)(.*)$/.exec(effect);
  if (!match) return { sign: 'none', value: '', rest: effect.trim() };
  const value = match[1].trim();
  const rest = match[2].trim();
  const sign = value.startsWith('-') || value.startsWith('−') ? 'neg' : 'pos';
  return { sign, value, rest };
}

/** A detected-but-unconfirmed pattern surfaced for review — glass card with a
 *  "Pending pattern" eyebrow, the interpretation prose, an emphasized effect
 *  line, optional confidence chips, and an Accept / Dismiss action row. */
export function PendingPatternCard({
  interpretation,
  effect,
  confidence,
  onAccept,
  onDismiss,
  acceptLabel = 'Accept',
  dismissLabel = 'Dismiss',
  className,
  ...rest
}: PendingPatternCardProps) {
  const eff = effect ? splitEffect(effect) : null;
  const hasActions = onAccept != null || onDismiss != null;

  return (
    <Card hover lit className={cn('lk-pcard', className)} {...rest}>
      <div className="lk-pcard-head">
        <span className="lk-pcard-ic" aria-hidden="true">
          <Icon name="sparkle" size={18} />
        </span>
        <span className="lk-pcard-eyebrow">Pending pattern</span>
      </div>

      <p className="lk-pcard-prose">{interpretation}</p>

      {eff && (
        <div className="lk-pcard-effect">
          {eff.value && (
            <span
              className={cn(
                'lk-pcard-effect-val',
                eff.sign === 'pos' && 'lk-pos',
                eff.sign === 'neg' && 'lk-neg',
              )}
            >
              {eff.value}
            </span>
          )}
          {eff.rest && <span className="lk-pcard-effect-label">{eff.rest}</span>}
        </div>
      )}

      {confidence && confidence.length > 0 && (
        <div className="lk-pcard-meta">
          {confidence.map((c, i) => (
            <Chip key={`${c.label}-${i}`} tone="neutral">
              {c.label} · {c.value}
            </Chip>
          ))}
        </div>
      )}

      {hasActions && (
        <div className="lk-pcard-actions">
          {onAccept != null && (
            <Button variant="primary" className="lk-pcard-accept" onClick={onAccept}>
              {acceptLabel}
            </Button>
          )}
          {onDismiss != null && (
            <Button variant="ghost" className="lk-pcard-dismiss" onClick={onDismiss}>
              {dismissLabel}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
