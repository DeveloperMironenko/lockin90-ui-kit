import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** A single waveform bar in the voice-note player. */
export interface ChatxWaveBar {
  /** Active bars are teal + animated; inactive bars are faint/static. */
  on?: boolean;
  /** Animation delay (seconds) applied to active bars, e.g. 0.1. */
  delay?: number;
}

export interface ChatExtrasProps extends HTMLAttributes<HTMLDivElement> {
  /** Section label above the typing bubble. */
  typingLabel?: string;
  /** Accessible label for the typing bubble (e.g. who is typing). */
  typingAria?: string;
  /** Section label above the voice-note player. */
  voiceLabel?: string;
  /** Voice-note duration text, e.g. '0:14'. */
  duration?: string;
  /** Waveform bars — leading active bars animate, trailing bars stay faint. */
  waveform?: ChatxWaveBar[];
  /** Section label above the encryption pill. */
  encryptionLabel?: string;
  /** E2EE pill text. */
  e2eeLabel?: string;
  /** Supporting line beneath the E2EE pill. */
  e2eeSubtext?: string;
}

/** Default waveform — 8 leading active (animated) bars with staggered delays, the rest faint. */
const DEFAULT_WAVEFORM: ChatxWaveBar[] = [
  { on: true, delay: 0 },
  { on: true, delay: 0.1 },
  { on: true, delay: 0.2 },
  { on: true, delay: 0.05 },
  { on: true, delay: 0.25 },
  { on: true, delay: 0.15 },
  { on: true, delay: 0.3 },
  { on: true, delay: 0.12 },
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
];

/** Play triangle glyph for the voice-note play button. */
function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/** Padlock glyph for the E2EE encryption pill. */
function LockGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

/** ChatExtras — three messaging primitives in one card: a typing indicator (3 animated dots
 *  in a bubble), a voice-note player (gradient play button + animated waveform bars + duration),
 *  and an E2EE encryption badge (pulsing lock pill + subtext). Renders the showcase example
 *  by default. */
export function ChatExtras({
  typingLabel = 'Typing',
  typingAria = 'Coach is typing',
  voiceLabel = 'Voice note',
  duration = '0:14',
  waveform = DEFAULT_WAVEFORM,
  encryptionLabel = 'Encryption',
  e2eeLabel = 'End-to-end encrypted',
  e2eeSubtext = 'Messages in this chat are secured — the server only ever sees ciphertext.',
  className,
  ...rest
}: ChatExtrasProps) {
  return (
    <div className={cn('lk-card', 'lk-chatx', className)} {...rest}>
      <div className="lk-chatx-row">
        <span className="lk-chatx-lbl">{typingLabel}</span>
        <div className="lk-chatx-typing" aria-label={typingAria}>
          <i />
          <i />
          <i />
        </div>
      </div>

      <div className="lk-chatx-row">
        <span className="lk-chatx-lbl">{voiceLabel}</span>
        <div className="lk-chatx-rich">
          <div className="lk-chatx-voice">
            <button type="button" className="lk-chatx-play" aria-label="Play">
              <PlayGlyph />
            </button>
            <div className="lk-chatx-wave" aria-hidden="true">
              {waveform.map((bar, i) => (
                <i
                  key={i}
                  className={cn(bar.on && 'lk-chatx-on')}
                  style={bar.on ? { animationDelay: `${bar.delay ?? 0}s` } : undefined}
                />
              ))}
            </div>
            <span className="lk-chatx-time lk-mono">{duration}</span>
          </div>
        </div>
      </div>

      <div className="lk-chatx-row">
        <span className="lk-chatx-lbl">{encryptionLabel}</span>
        <div className="lk-chatx-enc">
          <span className="lk-chatx-e2ee lk-mono">
            <LockGlyph />
            {e2eeLabel}
          </span>
          <span className="lk-chatx-enc-sub">{e2eeSubtext}</span>
        </div>
      </div>
    </div>
  );
}
