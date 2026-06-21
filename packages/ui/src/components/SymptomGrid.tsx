import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip, type ChipTone } from './Chip';

/** A symptom tile in the quick-log grid. */
export interface SymptomTile {
  /** Symptom name, e.g. "Headache". */
  name: string;
  /** Tile icon (svg). Defaults to a generic dot glyph when omitted. */
  icon?: ReactNode;
  /** Frequency / recency line, e.g. "4 this mo · 3d ago". */
  freq: string;
  /** Count tag shown top-right, e.g. "4×". Defaults to nothing. */
  count?: string;
  /** Whether the symptom is logged today (tints the tile + shows severity dot). */
  logged?: boolean;
  /** Severity-dot color (CSS color/var). Shown only when `logged`. */
  severityColor?: string;
  /** Log-button label override (defaults to "Log" / "Logged"). */
  logLabel?: string;
}

/** A recent symptom entry in the list below the grid. */
export interface SymptomRecent {
  /** Symptom title, e.g. "Brain fog". */
  title: string;
  /** Severity badge label, e.g. "mild". Hidden when empty. */
  severity?: string;
  /** Tone of the severity badge + leading dot. */
  severityTone?: ChipTone;
  /** Leading dot color (CSS color/var). Defaults to the tone color. */
  dotColor?: string;
  /** Context line, e.g. "Morning · no breakfast before 11am". */
  sub: string;
  /** Timestamp, e.g. "9:10am". */
  time: string;
}

export interface SymptomGridProps extends HTMLAttributes<HTMLElement> {
  /** Eyebrow over the grid. */
  eyebrow?: string;
  /** Manage-link label (rendered as a button). Hidden when empty. */
  manageLabel?: string;
  /** Called when the manage link is pressed. */
  onManage?: () => void;
  /** Quick-log tiles. */
  tiles?: SymptomTile[];
  /** Eyebrow over the recent list. */
  recentEyebrow?: string;
  /** Window tag shown on the recent header, e.g. "6 days". Hidden when empty. */
  recentTag?: string;
  /** Recent symptom entries. */
  recent?: SymptomRecent[];
  /** Called with a tile when its Log button is pressed. */
  onLog?: (tile: SymptomTile) => void;
  className?: string;
}

const TONE_COLOR: Record<ChipTone, string> = {
  default: 'var(--text-faint)',
  high: 'var(--zone-high)',
  mid: 'var(--zone-mid)',
  low: 'var(--zone-low)',
  accent: 'var(--accent)',
};

const PLUS_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const CHECK_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const DEFAULT_TILE_ICON = (
  <svg viewBox="0 0 24 24" style={{ stroke: 'var(--text-dim)' }} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const DEFAULT_TILES: SymptomTile[] = [
  {
    name: 'Headache',
    freq: '4 this mo · 3d ago',
    count: '4×',
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: 'var(--accent-2)' }} aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 9l2 2M16 9l-2 2M9 16h6" />
      </svg>
    ),
  },
  {
    name: 'Bloating',
    freq: '7 this mo · 4d ago',
    count: '7×',
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: 'var(--zone-mid)' }} aria-hidden="true">
        <path d="M7 11a5 5 0 0 1 10 0c0 3-1.5 4.5-1.5 7h-7C8.5 15.5 7 14 7 11z" />
        <path d="M9 21h6" />
      </svg>
    ),
  },
  {
    name: 'Brain fog',
    freq: '6 this mo · today',
    count: '6×',
    logged: true,
    severityColor: 'var(--accent)',
    logLabel: 'Logged · mild',
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: 'var(--accent)' }} aria-hidden="true">
        <path d="M9.5 2a2.5 2.5 0 0 0-2 4 2.5 2.5 0 0 0-1 4.5 2.5 2.5 0 0 0 2 4.5 2.5 2.5 0 0 0 5 0V4.5A2.5 2.5 0 0 0 9.5 2z" />
        <path d="M14.5 2a2.5 2.5 0 0 1 2 4 2.5 2.5 0 0 1 1 4.5" />
      </svg>
    ),
  },
  {
    name: 'Sore',
    freq: '9 this mo · today',
    count: '9×',
    logged: true,
    severityColor: 'var(--zone-mid)',
    logLabel: 'Logged · mod',
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: 'var(--zone-mid)' }} aria-hidden="true">
        <path d="M6 4l2 6m0 0l-2 10m2-10h8m0 0l2-6m-2 6l2 10" />
        <circle cx="12" cy="6" r="2.4" />
      </svg>
    ),
  },
  {
    name: 'Anxious',
    freq: '3 this mo · 1d ago',
    count: '3×',
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: 'var(--accent-3)' }} aria-hidden="true">
        <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m13.5-6.5-2 2m-7 7-2 2m11 0-2-2m-7-7-2-2" />
      </svg>
    ),
  },
  {
    name: 'Low mood',
    freq: '5 this mo · 2d ago',
    count: '5×',
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: 'var(--zone-low)' }} aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 15.5c1-1.2 2.4-1.8 4-1.8s3 .6 4 1.8M9 10h.01M15 10h.01" />
      </svg>
    ),
  },
  {
    name: 'Nausea',
    freq: '2 this mo · 5d ago',
    count: '2×',
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: 'var(--accent-2)' }} aria-hidden="true">
        <path d="M12 3c4 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2-6 6-10z" />
      </svg>
    ),
  },
  {
    name: 'Congested',
    freq: '4 this mo · 6d ago',
    count: '4×',
    icon: (
      <svg viewBox="0 0 24 24" style={{ stroke: 'var(--accent-3)' }} aria-hidden="true">
        <path d="M12 4v6m0 0c-2 0-4 1.5-4 4.5S10 20 12 20s4-2.5 4-5-2-4.5-4-4.5z" />
        <path d="M9 7l-2-2m10 2 2-2" />
      </svg>
    ),
  },
];

const DEFAULT_RECENT: SymptomRecent[] = [
  {
    title: 'Brain fog',
    severity: 'mild',
    severityTone: 'accent',
    dotColor: 'var(--accent)',
    sub: 'Morning · no breakfast before 11am',
    time: '9:10am',
  },
  {
    title: 'Sore legs',
    severity: 'moderate',
    severityTone: 'mid',
    dotColor: 'var(--zone-mid)',
    sub: 'Post-workout · heavy squat session',
    time: 'Today 2:40p',
  },
  {
    title: 'Headache',
    severity: 'severe',
    severityTone: 'low',
    dotColor: 'var(--zone-low)',
    sub: '2 days after poor sleep + 8.4h screen',
    time: 'Jun 8',
  },
];

/** Symptom log grid — a quick-log grid of common symptoms (selectable tiles
 *  with icon, frequency and a Log button; logged-today tiles tint mint and
 *  carry a severity dot) plus a recent-entries list below. */
export function SymptomGrid({
  eyebrow = 'Log a symptom',
  manageLabel = 'Manage →',
  onManage,
  tiles = DEFAULT_TILES,
  recentEyebrow = 'Recent entries',
  recentTag = '6 days',
  recent = DEFAULT_RECENT,
  onLog,
  className,
  ...rest
}: SymptomGridProps) {
  return (
    <section className={cn('lk-symp lk-card', className)} {...rest}>
      <div className="lk-symp-head">
        <span className="lk-symp-eyebrow">{eyebrow}</span>
        <span className="lk-symp-ln" />
        {manageLabel ? (
          <button type="button" className="lk-symp-manage" onClick={onManage}>
            {manageLabel}
          </button>
        ) : null}
      </div>

      <div className="lk-symp-grid">
        {tiles.map((tile, i) => {
          const logged = !!tile.logged;
          const label = tile.logLabel ?? (logged ? 'Logged' : 'Log');
          return (
            <article key={`${tile.name}-${i}`} className={cn('lk-symp-tile', logged && 'lk-symp-logged')}>
              <div className="lk-symp-top">
                <span className="lk-symp-ico">
                  {tile.icon ?? DEFAULT_TILE_ICON}
                  {logged ? (
                    <span
                      className="lk-symp-sev"
                      style={{
                        background: tile.severityColor ?? 'var(--zone-high)',
                        boxShadow: `0 0 6px ${tile.severityColor ?? 'var(--zone-high)'}`,
                      }}
                    />
                  ) : null}
                </span>
                {tile.count ? <span className="lk-chip lk-mono lk-symp-tag">{tile.count}</span> : null}
              </div>
              <div className="lk-symp-name">{tile.name}</div>
              <div className="lk-symp-freq">{tile.freq}</div>
              <button type="button" className="lk-symp-log" onClick={() => onLog?.(tile)}>
                {logged ? CHECK_ICON : PLUS_ICON}
                {label}
              </button>
            </article>
          );
        })}
      </div>

      {recent.length ? (
        <>
          <div className="lk-symp-head" style={{ marginTop: 13 }}>
            <span className="lk-symp-eyebrow">{recentEyebrow}</span>
            <span className="lk-symp-ln" />
            {recentTag ? (
              <span className="lk-chip lk-mono lk-symp-tag" style={{ color: 'var(--text-faint)' }}>
                {recentTag}
              </span>
            ) : null}
          </div>
          <div className="lk-symp-recent lk-card">
            {recent.map((r, i) => {
              const tone = r.severityTone ?? 'default';
              const dot = r.dotColor ?? TONE_COLOR[tone];
              return (
                <div key={`${r.title}-${i}`} className="lk-symp-item">
                  <span className="lk-symp-dot" style={{ background: dot, boxShadow: `0 0 8px ${dot}` }} />
                  <div className="lk-symp-main">
                    <div className="lk-symp-title">
                      {r.title}
                      {r.severity ? (
                        <Chip tone={tone} className="lk-symp-tag">
                          {r.severity}
                        </Chip>
                      ) : null}
                    </div>
                    <div className="lk-symp-sub">{r.sub}</div>
                  </div>
                  <div className="lk-symp-time">{r.time}</div>
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </section>
  );
}
