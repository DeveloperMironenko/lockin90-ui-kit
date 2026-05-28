import React from 'react';
import { Pressable, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import { colors, fonts, radius } from '@p90/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps {
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', loading = false, disabled = false, onPress, children }: ButtonProps) {
  const isDisabled = disabled || loading;
  const bg = variant === 'primary' ? '#FFFFFF' : variant === 'secondary' ? colors.bgElevated : 'transparent';
  const fg = variant === 'primary' ? '#000000' : variant === 'ghost' ? colors.textSecondary : colors.textPrimary;
  const border = variant === 'ghost' ? colors.border : variant === 'secondary' ? colors.borderStrong : 'transparent';
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, borderColor: border, opacity: isDisabled ? 0.6 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      {loading
        ? <ActivityIndicator color={fg} />
        : (typeof children === 'string'
            ? <Text style={[styles.label, { color: fg }]}>{children}</Text>
            : children)}
      {variant === 'primary' && <View style={styles.accentBar} pointerEvents="none" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    height: 56,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  label: {
    fontFamily: fonts.displayItalic,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  accentBar: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: 3,
    backgroundColor: colors.accent,
  },
});
