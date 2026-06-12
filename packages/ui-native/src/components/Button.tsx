import { useId, useState } from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import type {
  ViewStyle,
  TextStyle,
  StyleProp,
  GestureResponderEvent,
  PressableStateCallbackType,
  LayoutChangeEvent,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { colors, radius, spacing, fonts, gradientStops } from '@lockin90/tokens';

export type ButtonVariant = 'primary' | 'ghost' | 'danger';

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

// Gradient fills mirror the web kit: primary = --grad-cta (violet→cyan),
// danger = --grad-warm (amber→red). Ghost is a bordered transparent pill.
const GRADIENTS: Record<'primary' | 'danger', readonly string[]> = {
  primary: gradientStops.cta,
  danger: gradientStops.warm,
};

const HEIGHT = 48;

/**
 * Aurora pill button — the native counterpart of the web @lockin90/ui Button.
 * Primary/danger render the same diagonal gradient (via react-native-svg, sized
 * from the measured layout so it always fills the pill) over a solid fallback +
 * accent glow; ghost is a bordered transparent pill. 14px ui-600 label, fixed
 * 48px height, pill radius — full-width via its parent (stretch), like web `block`.
 */
export function Button({
  children,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
}: ButtonProps) {
  const gradId = `lkbtn-${useId().replace(/:/g, '')}`;
  const [width, setWidth] = useState(0);
  const isDisabled = disabled || loading;
  const hasGradient = variant === 'primary' || variant === 'danger';
  const spinnerColor =
    variant === 'primary' ? '#0a0a12' : variant === 'danger' ? '#ffffff' : colors.textDim;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      style={(state: PressableStateCallbackType): StyleProp<ViewStyle> => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'danger' && styles.danger,
        variant === 'ghost' && styles.ghost,
        variant === 'primary' && styles.glow,
        state.pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {hasGradient && width > 0 ? (
        <Svg
          width={width}
          height={HEIGHT}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Defs>
            <LinearGradient
              id={gradId}
              x1="0"
              y1="0"
              x2={width}
              y2={HEIGHT}
              gradientUnits="userSpaceOnUse"
            >
              {GRADIENTS[variant].map((color, i) => (
                <Stop
                  key={color}
                  offset={i / (GRADIENTS[variant].length - 1)}
                  stopColor={color}
                />
              ))}
            </LinearGradient>
          </Defs>
          <Rect
            x={0}
            y={0}
            width={width}
            height={HEIGHT}
            rx={HEIGHT / 2}
            ry={HEIGHT / 2}
            fill={`url(#${gradId})`}
          />
        </Svg>
      ) : null}

      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <Text style={[styles.label, textStyles[variant]]}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: HEIGHT,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  // Solid fallbacks sit under the SVG gradient (shown for the first frame before
  // onLayout measures, and as a safety net).
  primary: { backgroundColor: colors.accent },
  danger: { backgroundColor: colors.bad },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  glow: {
    shadowColor: colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  pressed: { opacity: 0.9 },
  disabled: { opacity: 0.5 },
  label: {
    fontFamily: fonts.uiSemibold,
    fontSize: 14,
  },
});

const textStyles = StyleSheet.create<{ primary: TextStyle; ghost: TextStyle; danger: TextStyle }>({
  primary: { color: '#0a0a12' },
  ghost: { color: colors.textDim },
  danger: { color: '#ffffff' },
});
