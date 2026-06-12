import { useId } from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import type {
  ViewStyle,
  TextStyle,
  StyleProp,
  GestureResponderEvent,
  PressableStateCallbackType,
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

/**
 * Aurora pill button — the native counterpart of the web @lockin90/ui Button.
 * Primary/danger render the same diagonal gradient fill (via react-native-svg) +
 * accent glow; ghost is a bordered transparent pill. Same 14px ui-600 label,
 * pill radius, and 12×20 padding as the web button so the two render identically.
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
  const isDisabled = disabled || loading;
  const hasGradient = variant === 'primary' || variant === 'danger';
  const spinnerColor =
    variant === 'primary' ? '#0a0a12' : variant === 'danger' ? '#ffffff' : colors.textDim;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={(state: PressableStateCallbackType): StyleProp<ViewStyle> => [
        styles.base,
        variant === 'ghost' && styles.ghost,
        variant === 'primary' && styles.glow,
        state.pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {hasGradient ? (
        <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none">
          <Defs>
            <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              {GRADIENTS[variant].map((color, i) => (
                <Stop
                  key={color}
                  offset={i / (GRADIENTS[variant].length - 1)}
                  stopColor={color}
                />
              ))}
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" rx={23} ry={23} fill={`url(#${gradId})`} />
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
    minHeight: 46,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg, // 20 — matches web .lk-btn padding
    paddingVertical: 12, // matches web .lk-btn padding
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
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
    fontSize: 14, // matches web .lk-btn font-size
  },
});

const textStyles = StyleSheet.create<{ primary: TextStyle; ghost: TextStyle; danger: TextStyle }>({
  primary: { color: '#0a0a12' },
  ghost: { color: colors.textDim },
  danger: { color: '#ffffff' },
});
