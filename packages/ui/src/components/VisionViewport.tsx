import { type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip, type ChipTone } from './Chip';

/** A HUD overlay chip (top-left), e.g. a "LIVE" indicator or a context note. */
export interface VisionHudChip {
  /** stable key + label text */
  label: string;
  /** chip tone (matches the shared `Chip` tones) */
  tone?: ChipTone;
  /** render the pulsing red "live" dot before the label */
  live?: boolean;
}

/** One selectable scan mode pill in the footer (Food / Barcode / Posture…). */
export interface VisionMode {
  /** stable id passed back to `onModeChange` (defaults to the lowercased label) */
  id?: string;
  /** pill label */
  label: string;
}

/** The detected-item readout shown on the detection box. */
export interface VisionDetection {
  /** recognized item name, e.g. "Greek yogurt" */
  name: string;
  /** optional extra detail (e.g. a barcode number) appended after the name */
  detail?: string;
  /** confidence 0–100; rendered as "· 89%" after the name/detail */
  confidence?: number;
}

export interface VisionViewportProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** mode tag, top-right of the frame (e.g. "Food") */
  label?: ReactNode;
  /** HUD chips, top-left of the frame */
  hud?: VisionHudChip[];
  /** the detected-item readout on the detection box; `null` hides the box */
  detected?: VisionDetection | null;
  /** scan-mode pills in the footer */
  modes?: VisionMode[];
  /** id of the currently-active mode (defaults to the first mode's id) */
  activeMode?: string;
  /** fired with the chosen mode (and its resolved id) when a pill is pressed */
  onModeChange?: (mode: VisionMode, id: string) => void;
  /** capture/scan control label (set to `null` to hide the control) */
  captureLabel?: ReactNode;
  /** fired when the capture/scan control is pressed */
  onCapture?: () => void;
}

const DEFAULT_HUD: VisionHudChip[] = [
  { label: 'LIVE', live: true },
  { label: 'AI vision' },
  { label: 'good light' },
];

const DEFAULT_MODES: VisionMode[] = [
  { label: 'Food' },
  { label: 'Barcode' },
  { label: 'Posture' },
];

const DEFAULT_DETECTION: VisionDetection = { name: 'Greek yogurt', confidence: 89 };

function modeId(m: VisionMode): string {
  return m.id ?? m.label.toLowerCase();
}

/** Compose the detection readout: "Greek yogurt · 0123456 · 89%". */
function detectionText(d: VisionDetection): string {
  const parts = [d.name];
  if (d.detail) parts.push(d.detail);
  if (d.confidence != null) parts.push(`${Math.round(d.confidence)}%`);
  return parts.join(' · ');
}

/**
 * Vision / AR viewport — a camera scan surface: a framed canvas with corner
 * brackets, a breathing reticle, a sweeping scan-line and HUD chips, a mode
 * tag, a dashed detection box reading out the recognized item (food / barcode)
 * + confidence, a row of mode pills and a capture/scan control. Defaults to the
 * design example ("Food" mode, LIVE HUD, "Greek yogurt · 89%").
 */
export function VisionViewport({
  label = 'Food',
  hud = DEFAULT_HUD,
  detected = DEFAULT_DETECTION,
  modes = DEFAULT_MODES,
  activeMode,
  onModeChange,
  captureLabel = 'Capture',
  onCapture,
  className,
  ...rest
}: VisionViewportProps) {
  const active = activeMode ?? (modes.length ? modeId(modes[0]) : undefined);

  return (
    <div className={cn('lk-card', 'lk-vp-card', className)} {...rest}>
      <div className="lk-vp-frame" role="img" aria-label="Camera scan viewport">
        <span className="lk-vp-bracket lk-vp-tl" aria-hidden="true" />
        <span className="lk-vp-bracket lk-vp-tr" aria-hidden="true" />
        <span className="lk-vp-bracket lk-vp-bl" aria-hidden="true" />
        <span className="lk-vp-bracket lk-vp-br" aria-hidden="true" />

        {hud.length > 0 ? (
          <div className="lk-vp-hud">
            {hud.map((c) => (
              <Chip key={c.label} tone={c.tone} className={cn('lk-mono', c.live && 'lk-vp-live')}>
                {c.label}
              </Chip>
            ))}
          </div>
        ) : null}

        {label != null ? <span className="lk-vp-tag lk-mono">{label}</span> : null}

        <span className="lk-vp-scanline" aria-hidden="true" />

        <div className="lk-vp-reticle" aria-hidden="true">
          <i className="lk-vp-l" />
          <i className="lk-vp-r" />
        </div>

        {detected ? (
          <div className="lk-vp-detect">
            <span>{detectionText(detected)}</span>
          </div>
        ) : null}
      </div>

      <div className="lk-vp-foot">
        <div className="lk-vp-modes" role="group" aria-label="Scan mode">
          {modes.map((m) => {
            const id = modeId(m);
            return (
              <button
                key={id}
                type="button"
                className="lk-vp-pill"
                aria-pressed={id === active}
                onClick={(_e: MouseEvent<HTMLButtonElement>) => onModeChange?.(m, id)}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {captureLabel != null ? (
          <button
            type="button"
            className="lk-btn lk-btn-primary lk-btn-sm lk-vp-capture"
            onClick={() => onCapture?.()}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="13" r="3.5" />
              <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7H8l1.2-2h5.6L16 7h2.5A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5z" />
            </svg>
            {captureLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
