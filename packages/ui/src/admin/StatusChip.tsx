import type { HTMLAttributes } from 'react';
import { Chip, type ChipTone } from '../components/Chip';

/* StatusChip — small mono signal chip. Now a thin wrapper over the canonical
   cross-platform `Chip` (they were byte-identical `.chip` mirrors). `tone` maps
   to the zone palette; `dot` adds a glowing leading dot. Export + types kept for
   back-compat. Web-only. */

export type StatusChipTone = 'neutral' | 'high' | 'mid' | 'low' | 'accent';

export interface StatusChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Colour tone. high=mint/ok, mid=amber/warn, low=red/danger, accent=indigo, neutral=grey. */
  tone?: StatusChipTone;
  /** Show a glowing leading dot in the current colour. */
  dot?: boolean;
}

/** StatusChip's `neutral` is the base chip (dim on glass) — i.e. Chip's `default`,
 *  NOT Chip's greyer `neutral` — so the visuals stay identical. */
const TONE_MAP: Record<StatusChipTone, ChipTone> = {
  neutral: 'default',
  high: 'high',
  mid: 'mid',
  low: 'low',
  accent: 'accent',
};

/** Mono status chip. `tone` colours it; `dot` prepends a glowing dot. */
export function StatusChip({ tone = 'neutral', dot = false, children, ...rest }: StatusChipProps) {
  return (
    <Chip tone={TONE_MAP[tone]} dot={dot} {...rest}>
      {children}
    </Chip>
  );
}
