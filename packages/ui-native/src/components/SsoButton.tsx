import { Pressable, Text, View, StyleSheet, type PressableProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, radii } from '@lockin90/tokens';

export type SsoProvider = 'google' | 'apple';

export interface SsoButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  provider: SsoProvider;
}

/** SSO sign-in button — full-color Google G or monochrome Apple glyph + label.
 *  Mirrors the `.sso` design CSS (10×12 padding, 12.5px/600 label, 16×16 icon,
 *  rgba(255,255,255,.04) bg, subtle border). Stretches to fill its grid cell. */
export function SsoButton({ provider, ...rest }: SsoButtonProps) {
  const label = provider === 'google' ? 'Google' : 'Apple';
  return (
    <Pressable
      {...rest}
      accessibilityRole="button"
      accessibilityLabel={`Continue with ${label}`}
      style={({ pressed }) => [
        styles.btn,
        pressed && styles.pressed,
        rest.disabled === true ? styles.disabled : undefined,
      ]}
    >
      <View style={styles.iconSlot}>
        {provider === 'google' ? <GoogleBrandIcon /> : <AppleBrandIcon color={colors.text} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

function GoogleBrandIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <Path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <Path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"
      />
      <Path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </Svg>
  );
}

function AppleBrandIcon({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M16.37 12.78c.02 2.5 2.19 3.33 2.21 3.34-.02.06-.35 1.2-1.15 2.37-.69 1.02-1.41 2.03-2.55 2.05-1.11.02-1.47-.66-2.74-.66-1.27 0-1.67.64-2.72.68-1.1.04-1.93-1.1-2.63-2.11-1.43-2.07-2.53-5.86-1.06-8.42a4.1 4.1 0 0 1 3.46-2.1c1.08-.02 2.1.73 2.76.73.66 0 1.9-.9 3.2-.77.54.02 2.07.22 3.05 1.65-.08.05-1.82 1.07-1.8 3.21M14.3 4.6c.58-.71.98-1.69.87-2.68-.84.04-1.86.56-2.47 1.26-.54.62-1.02 1.62-.89 2.58.94.07 1.9-.48 2.49-1.16" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  pressed: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.16)',
  },
  disabled: { opacity: 0.5 },
  iconSlot: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  label: {
    color: colors.text,
    fontFamily: fonts.ui,
    fontWeight: '600',
    fontSize: 12.5,
    letterSpacing: 0.1,
  },
});
