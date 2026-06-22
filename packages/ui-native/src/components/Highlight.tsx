import { Text, type TextProps, type TextStyle } from 'react-native';
import { colors } from '@lockin90/tokens';

export type HighlightTone = 'accent' | 'mint' | 'warm' | 'low';

export interface HighlightProps extends TextProps {
  /** signal color for the emphasized keyword */
  tone?: HighlightTone;
}

/** color + faint tinted background per tone — mirrors web .lk-hl* exactly.
 *  Accent text uses the design's softened violet (#cbbcff), not a raw token,
 *  so web and native render the identical color. */
const TONE: Record<HighlightTone, { color: string; backgroundColor: string }> = {
  accent: { color: '#cbbcff', backgroundColor: 'rgba(124,92,255,0.10)' },
  mint: { color: colors.zoneHigh, backgroundColor: 'rgba(52,245,197,0.10)' },
  warm: { color: colors.zoneMid, backgroundColor: 'rgba(255,176,32,0.10)' },
  low: { color: colors.zoneLow, backgroundColor: 'rgba(255,77,109,0.10)' },
};

/** Inline tone-colored text emphasis for AI-summary / insight prose.
 *  A bare <Text> so it flows inline when nested inside a parent <Text>:
 *  colored bold keyword on a faint tinted background. */
export function Highlight({ tone = 'accent', style, ...rest }: HighlightProps) {
  const t = TONE[tone];
  const base: TextStyle = { color: t.color, backgroundColor: t.backgroundColor, fontWeight: '600' };
  return <Text {...rest} style={[base, style]} />;
}
