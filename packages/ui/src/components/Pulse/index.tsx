export interface PulseProps {
  /** Status tone: ok (mint), warn (amber), bad (coral). */
  tone?: 'ok' | 'warn' | 'bad';
  /** Diameter in px. */
  size?: number;
  className?: string;
}

const TONE: Record<NonNullable<PulseProps['tone']>, string> = {
  ok: 'var(--ok)',
  warn: 'var(--warn)',
  bad: 'var(--bad)',
};

/** Live, breathing status dot — a pinging ring in the tone color. */
export default function Pulse({ tone = 'ok', size = 9, className = '' }: PulseProps) {
  return (
    <span
      className={`ea-pulse-dot ${className}`.trim()}
      style={{ background: TONE[tone], width: size, height: size }}
      aria-hidden="true"
    />
  );
}
