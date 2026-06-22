import { type ReactNode } from 'react';
import Svg, { Path, Polyline, Circle, Rect, Line, G } from 'react-native-svg';
import { colors } from '@lockin90/tokens';

export type IconName =
  | 'back'
  | 'chevron'
  | 'share'
  | 'more'
  | 'lock'
  | 'play'
  | 'info'
  | 'timer'
  | 'plus'
  | 'check'
  | 'star';

export interface IconProps {
  name: IconName;
  /** pixel size of the rendered glyph (width = height) @default 18 */
  size?: number;
  /**
   * Glyph color. Native has no `currentColor` inheritance, so this stands in
   * for the web's parent-driven `currentColor`. @default colors.text
   */
  color?: string;
}

/** Inner SVG geometry per glyph — drawn with the resolved `color`. */
function glyphFor(name: IconName, color: string): ReactNode {
  switch (name) {
    case 'back':
      return <Polyline points="15 6 9 12 15 18" />;
    case 'chevron':
      return <Polyline points="9 6 15 12 9 18" />;
    case 'share':
      return (
        <>
          <Path d="M12 3v12" />
          <Polyline points="8 7 12 3 16 7" />
          <Path d="M7 11H5v9h14v-9h-2" />
        </>
      );
    case 'more':
      return (
        <G fill={color} stroke="none">
          <Circle cx="5" cy="12" r="1.6" />
          <Circle cx="12" cy="12" r="1.6" />
          <Circle cx="19" cy="12" r="1.6" />
        </G>
      );
    case 'lock':
      return (
        <>
          <Rect x="5" y="11" width="14" height="9" rx="2" />
          <Path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </>
      );
    case 'play':
      return <Path d="M8 5.5v13l11-6.5z" fill={color} stroke="none" />;
    case 'info':
      return (
        <>
          <Circle cx="12" cy="12" r="9" />
          <Path d="M12 11v5" />
          <Circle cx="12" cy="7.75" r="0.9" fill={color} stroke="none" />
        </>
      );
    case 'timer':
      return (
        <>
          <Line x1="9" y1="3" x2="15" y2="3" />
          <Line x1="12" y1="3" x2="12" y2="6" />
          <Circle cx="12" cy="14" r="8" />
          <Path d="M12 14V9.5" />
          <Path d="M12 14l3 2" />
        </>
      );
    case 'plus':
      return (
        <>
          <Line x1="12" y1="5" x2="12" y2="19" />
          <Line x1="5" y1="12" x2="19" y2="12" />
        </>
      );
    case 'check':
      return <Polyline points="5 12.5 10 17.5 19 6.5" />;
    case 'star':
      return (
        <Path d="M12 3.5l2.6 5.3 5.9.86-4.25 4.14 1 5.86L12 17.1l-5.25 2.76 1-5.86L3.5 9.66l5.9-.86z" />
      );
  }
}

/**
 * Shared icon set — mirrors the web `@lockin90/ui` `Icon`. Glyphs are drawn on
 * a 24-unit viewBox with round caps/joins and a 1.9 stroke; color defaults to
 * the body text token (native has no `currentColor`).
 */
export function Icon({ name, size = 18, color = colors.text }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glyphFor(name, color)}
    </Svg>
  );
}
