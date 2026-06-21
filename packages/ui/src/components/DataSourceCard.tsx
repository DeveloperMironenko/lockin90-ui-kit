import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export type DataSourceStatus = 'connected' | 'disconnected';

export interface DataSourceCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Provider name, e.g. "Oura Ring 4". */
  name?: ReactNode;
  /** Kind line, e.g. "Wearable · OAuth". */
  kind?: ReactNode;
  /** Connection state — drives the status pill. */
  status?: DataSourceStatus;
  /** Provider logo. Defaults to a concentric Oura-style ring tinted with `accentColor`. */
  icon?: ReactNode;
  /** Tint for the default logo (ignored when `icon` is supplied). */
  accentColor?: string;
  /** Override the status pill label (defaults: "Connected" / "Disconnected"). */
  statusLabel?: ReactNode;
}

/** Concentric ring — the Oura default logo, color via `currentColor`. */
function RingLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
    </svg>
  );
}

/**
 * A connected-integration card: a provider logo tile, name + kind, and a
 * connected / disconnected status pill. Reuses the `lk-card` + `lk-chip`
 * primitives; renders `lk-src-*` for its own structure.
 */
export function DataSourceCard({
  name = 'Oura Ring 4',
  kind = 'Wearable · OAuth',
  status = 'connected',
  icon,
  accentColor = '#A855F7',
  statusLabel,
  className,
  ...rest
}: DataSourceCardProps) {
  const connected = status === 'connected';
  const label = statusLabel ?? (connected ? 'Connected' : 'Disconnected');

  return (
    <article className={cn('lk-card lk-hover lk-src-card', className)} {...rest}>
      <div className="lk-src-top">
        <div className="lk-src-logo" style={{ color: accentColor }}>
          {icon ?? <RingLogo />}
        </div>
        <div className="lk-src-head">
          <div className="lk-src-name">{name}</div>
          <div className="lk-src-kind">{kind}</div>
        </div>
        <span className={cn('lk-chip lk-src-status', connected && 'lk-connected')}>{label}</span>
      </div>
    </article>
  );
}
