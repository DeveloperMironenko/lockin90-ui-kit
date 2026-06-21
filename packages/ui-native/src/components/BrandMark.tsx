import { View, Text, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

export type BrandMarkVariant = 'mark' | 'lockup' | 'icon' | 'mono';

export interface BrandMarkProps {
  variant?: BrandMarkVariant;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const LINE = '#78CEDF';
const DOT = '#C6F84E';

function Glyph({ mono = false }: { mono?: boolean }) {
  const stroke = mono ? colors.text : LINE;
  const dot = mono ? colors.text : DOT;
  return (
    <>
      {!mono && (
        <>
          <Circle cx={288} cy={90} r={42} fill="none" stroke={DOT} strokeOpacity={0.28} strokeWidth={6} />
          <Circle cx={288} cy={90} r={58} fill="none" stroke={DOT} strokeOpacity={0.13} strokeWidth={5} />
        </>
      )}
      <Path d="M48 256 L128 120 L184 204 L262 116" fill="none" stroke={stroke} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={288} cy={90} r={30} fill={dot} />
    </>
  );
}

/** LockIn90 brand mark for native — energy line climbing to a glowing lime peak. */
export function BrandMark({ variant = 'mark', size = 28, style }: BrandMarkProps) {
  if (variant === 'lockup') {
    return (
      <View style={[{ flexDirection: 'row', alignItems: 'center', gap: Math.round(size * 0.42) }, style]}>
        <BrandMark variant="mark" size={size} />
        <Text style={{ fontFamily: fonts.display, fontWeight: '700', fontSize: Math.round(size * 1.05), color: colors.text, letterSpacing: -0.4 }}>
          LockIn<Text style={{ color: colors.lime }}>90</Text>
        </Text>
      </View>
    );
  }

  if (variant === 'icon') {
    const h = Math.round((size * 302) / 343);
    return (
      <View style={[{ width: size, height: h, borderRadius: Math.round(size * 0.22), overflow: 'hidden' }, style]}>
        <Svg width={size} height={h} viewBox="0 0 343 302">
          <Defs>
            <LinearGradient id="lkNbg" x1="0" y1="0" x2="343" y2="302">
              <Stop offset="0" stopColor="#1b2438" />
              <Stop offset="1" stopColor="#0b0f18" />
            </LinearGradient>
            <RadialGradient id="lkNgl" cx="0.26" cy="0.16" r="0.6">
              <Stop offset="0" stopColor="#5d40ad" stopOpacity={0.6} />
              <Stop offset="1" stopColor="#5d40ad" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect width={343} height={302} fill="url(#lkNbg)" />
          <Rect width={343} height={302} fill="url(#lkNgl)" />
          <Glyph />
        </Svg>
      </View>
    );
  }

  const h = Math.round((size * 248) / 320);
  return (
    <View style={style}>
      <Svg width={size} height={h} viewBox="30 28 320 248">
        <Glyph mono={variant === 'mono'} />
      </Svg>
    </View>
  );
}
