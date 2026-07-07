import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { Alert } from './Alert';

export interface ReauthDialogProps {
  /** Show the dialog. When false, nothing renders. */
  open: boolean;
  /** Called on scrim tap, Android back, close-button, or Cancel. */
  onClose: () => void;
  /** Password re-auth path — receives the field value on Confirm. */
  onSubmitPassword?: (password: string) => void;
  /** Google re-auth path — invoked by the "Continue with Google" button. */
  onGoogle?: () => void;
  /** Apple re-auth path — invoked by the "Continue with Apple" button. */
  onApple?: () => void;
  /** Header title. */
  title?: string;
  /** Short reassurance line under the title. */
  description?: string;
  /** Show the password field + Confirm button (default true). */
  hasPassword?: boolean;
  /** Show the "Continue with Google" button (default false). */
  hasGoogle?: boolean;
  /** Show the "Continue with Apple" button (default false). */
  hasApple?: boolean;
  /** Disable inputs + show loading on submit. */
  loading?: boolean;
  /** Error message rendered in a danger Alert above the fields. */
  error?: string;
  /** Localizable labels — English defaults; pass translated strings to localize. */
  passwordLabel?: string;
  passwordPlaceholder?: string;
  confirmLabel?: string;
  confirmingLabel?: string;
  cancelLabel?: string;
  googleLabel?: string;
  appleLabel?: string;
  orLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Google "G" mark — matches the auth design's SSO glyph. */
function GoogleMark() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
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

/** Apple mark — the SSO glyph, tinted to the current text color. */
function AppleMark() {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24">
      <Path
        fill={colors.text}
        d="M16.37 12.7c.03 3.02 2.65 4.02 2.68 4.03-.02.07-.42 1.44-1.38 2.85-.83 1.22-1.7 2.44-3.06 2.46-1.34.03-1.77-.79-3.3-.79-1.53 0-2.01.77-3.28.82-1.32.05-2.32-1.32-3.16-2.54-1.72-2.5-3.03-7.05-1.27-10.12.87-1.53 2.44-2.5 4.14-2.52 1.3-.03 2.52.87 3.31.87.79 0 2.28-1.08 3.84-.92.65.03 2.49.26 3.67 1.99-.1.06-2.19 1.28-2.17 3.51M14.06 4.5c.7-.85 1.17-2.03 1.04-3.2-1 .04-2.22.67-2.94 1.51-.64.75-1.2 1.95-1.05 3.1 1.12.09 2.25-.57 2.95-1.41"
      />
    </Svg>
  );
}

/**
 * Step-up re-authentication dialog — "confirm it's you" before a sensitive
 * action. A centered Modal with an optional password path + optional Google /
 * Apple SSO paths; local password state is kept internal and cleared on close.
 */
export function ReauthDialog({
  open,
  onClose,
  onSubmitPassword,
  onGoogle,
  onApple,
  title = "Confirm it's you",
  description = 'For your security, re-enter your password to continue.',
  hasPassword = true,
  hasGoogle = false,
  hasApple = false,
  loading = false,
  error,
  passwordLabel = 'Password',
  passwordPlaceholder = 'Your password',
  confirmLabel = 'Confirm',
  confirmingLabel = 'Confirming…',
  cancelLabel = 'Cancel',
  googleLabel = 'Continue with Google',
  appleLabel = 'Continue with Apple',
  orLabel = 'or',
  style,
}: ReauthDialogProps) {
  const [password, setPassword] = useState('');

  // Drop the field whenever the dialog closes so it never leaks across opens.
  useEffect(() => {
    if (!open) setPassword('');
  }, [open]);

  const close = () => {
    setPassword('');
    onClose();
  };

  const submit = () => {
    if (loading || !password) return;
    onSubmitPassword?.(password);
  };

  return (
    <Modal open={open} onClose={close} title={title} size="sm">
      <View style={[styles.body, style]}>
        {description ? <Text style={styles.desc}>{description}</Text> : null}

        {error ? (
          <Alert tone="danger" style={styles.error}>
            {error}
          </Alert>
        ) : null}

        {hasPassword ? (
          <View style={styles.pw}>
            <Input
              label={passwordLabel}
              secureTextEntry
              autoComplete="current-password"
              textContentType="password"
              placeholder={passwordPlaceholder}
              value={password}
              editable={!loading}
              invalid={Boolean(error)}
              onChangeText={setPassword}
              onSubmitEditing={submit}
            />
            <Button
              variant="primary"
              title={loading ? confirmingLabel : confirmLabel}
              style={styles.submit}
              disabled={loading || !password}
              onPress={submit}
            />
          </View>
        ) : null}

        {hasPassword && (hasGoogle || hasApple) ? (
          <View style={styles.or}>
            <View style={styles.ln} />
            <Text style={styles.orText}>{orLabel}</Text>
            <View style={styles.ln} />
          </View>
        ) : null}

        {hasGoogle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            disabled={loading}
            onPress={() => onGoogle?.()}
          >
            {({ pressed }) => (
              <View style={[styles.google, pressed && styles.pressed, loading && styles.disabled]}>
                <GoogleMark />
                <Text style={styles.googleLabel}>{googleLabel}</Text>
              </View>
            )}
          </Pressable>
        ) : null}

        {hasApple ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue with Apple"
            disabled={loading}
            onPress={() => onApple?.()}
          >
            {({ pressed }) => (
              <View style={[styles.apple, pressed && styles.pressed, loading && styles.disabled]}>
                <AppleMark />
                <Text style={styles.appleLabel}>{appleLabel}</Text>
              </View>
            )}
          </Pressable>
        ) : null}

        <Button
          variant="ghost"
          title={cancelLabel}
          style={styles.submit}
          disabled={loading}
          onPress={close}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  body: { gap: 16 },
  desc: {
    fontFamily: fonts.ui,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textDim,
  },
  error: {},
  // match web: input→Confirm gap == the body's 16px column gap (== Confirm→Cancel)
  pw: { gap: 16 },
  submit: { width: '100%' },
  or: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ln: { flex: 1, height: 1, backgroundColor: colors.border },
  orText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  // Mirrors Button's `default` variant (glass2 bg + border2 pill) so the
  // Google glyph + label sit in the same chrome as the web Button.
  google: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    backgroundColor: colors.glass2,
    borderWidth: 1,
    borderColor: colors.border2,
  },
  googleLabel: {
    fontFamily: fonts.ui,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  apple: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    backgroundColor: colors.glass2,
    borderWidth: 1,
    borderColor: colors.border2,
  },
  appleLabel: {
    fontFamily: fonts.ui,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
});
