import BrandMark from '../BrandMark';
import { cn } from '../../cn';
import type { AuthPanelProps } from './types';

export type { AuthPanelProps };

/**
 * The brand side-panel of an auth split-screen — Aurora glass column with the
 * gradient wordmark centered, an optional tagline under a flux hairline, and
 * small mono corner labels. Pairs with the form on the right.
 */
export default function AuthPanel({ tagline, topLeftLabel, topRightLabel }: AuthPanelProps) {
  return (
    <div className={cn('lk-auth-panel')}>
      {topLeftLabel && <div className="lk-auth-panel-tl">{topLeftLabel}</div>}
      {topRightLabel && <div className="lk-auth-panel-tr">{topRightLabel}</div>}

      <BrandMark size={34} />

      {tagline && (
        <div className="lk-auth-panel-tagwrap">
          <span className="lk-auth-panel-rule" />
          <div className="lk-auth-panel-tagline">{tagline}</div>
        </div>
      )}
    </div>
  );
}
