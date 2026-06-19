import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Rect, Path, Circle } from 'react-native-svg';

export interface MarkProps {
  /** Icon size in px (square). */
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * LockIn90 icon mark — green outlined rounded-square tile with the energy "N"
 * line + endpoint dot (the iOS app-icon style). Native counterpart of the
 * @lockin90/ui Mark; pairs with {@link BrandMark} (the wordmark) to form the
 * full lockup.
 */
export function Mark({ size = 28, style }: MarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" style={style}>
      <Rect x={2.5} y={2.5} width={31} height={31} rx={9} fill="#0E1320" stroke="#A8FF35" strokeWidth={2.5} />
      <Path
        d="M10 25.5 L15 14 L20.5 21 L26 11"
        fill="none"
        stroke="#A8FF35"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={26} cy={11} r={2.6} fill="#A8FF35" />
    </Svg>
  );
}
