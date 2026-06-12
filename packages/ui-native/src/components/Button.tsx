import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import type {
  ViewStyle,
  TextStyle,
  StyleProp,
  GestureResponderEvent,
  PressableStateCallbackType,
} from 'react-native';
import { colors, radius, spacing, fonts, fontSizes } from '@lockin90/tokens';

export type ButtonVariant = 'primary' | 'ghost' | 'danger';

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const variantStyle = styles[variant];
  const variantText = textStyles[variant];
  const spinnerColor = variant === 'primary' ? '#07080d' : colors.textDim;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={(state: PressableStateCallbackType): StyleProp<ViewStyle> => [
        styles.base,
        variantStyle,
        state.pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <Text style={[styles.label, variantText]}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: colors.accent,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.bad,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: fonts.uiSemibold,
    fontSize: fontSizes.base,
  },
});

const textStyles = StyleSheet.create<{
  primary: TextStyle;
  ghost: TextStyle;
  danger: TextStyle;
}>({
  primary: {
    color: '#07080d',
  },
  ghost: {
    color: colors.textDim,
  },
  danger: {
    color: '#ffffff',
  },
});
