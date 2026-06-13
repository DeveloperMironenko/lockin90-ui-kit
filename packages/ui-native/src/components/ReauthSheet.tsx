import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { colors, fonts, fontSizes, radius, spacing } from '@lockin90/tokens';
import { Button } from './Button';
import { PasswordInput } from './PasswordInput';

export interface ReauthSheetProps {
  open: boolean;
  /** Resolve = correct password (proceed). Throw an Error = wrong password / failure; its `.message` is shown. */
  verify: (password: string) => Promise<void>;
  /** Called after `verify()` resolves. */
  onConfirmed: () => void;
  /** Cancel / close. */
  onCancel: () => void;
  /** Sheet heading (default "Confirm your password"). */
  title?: string;
  /** Body copy (default explains sensitive-action re-auth, valid 5 minutes). */
  description?: string;
  /** External loading (e.g. a parent action is pending) — disables the form. */
  loading?: boolean;
}

const DEFAULT_TITLE = 'Confirm your password';
const DEFAULT_DESCRIPTION =
  'For your security, re-enter your password to continue with this sensitive action. This confirmation stays valid for 5 minutes.';

/**
 * Aurora re-authentication prompt (native) — gates a sensitive action behind a
 * password re-entry. Bottom-sheet over a dimmed, pressable backdrop, composing
 * the kit's PasswordInput + Button. Transport-agnostic: ALL network goes through
 * the injected `verify` (no fetch/URL inside). Shares the EXACT prop API of the
 * web `@lockin90/ui` ReauthDialog (`open` maps to RN Modal's `visible`).
 */
export function ReauthSheet({
  open,
  verify,
  onConfirmed,
  onCancel,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  loading = false,
}: ReauthSheetProps) {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Tracks the live `open` value so an in-flight verify() that resolves AFTER the
  // sheet is cancelled/closed can bail before firing the gated (destructive) action.
  const openRef = useRef(open);

  // Reset local state whenever the sheet (re)opens; keep openRef in sync.
  useEffect(() => {
    openRef.current = open;
    if (open) {
      setPassword('');
      setSubmitting(false);
      setError(null);
    }
  }, [open]);

  const busy = submitting || loading;
  const canSubmit = password.length > 0 && !busy;

  // Mark the sheet cancelled SYNCHRONOUSLY (before the openRef effect runs), so a
  // verify() that resolves right after a dismiss can't slip past the liveness guard.
  // Dismissal is always allowed — never trap the user behind a slow/hung verify().
  function handleCancel() {
    openRef.current = false;
    onCancel();
  }

  async function handleConfirm() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await verify(password);
      // Bail if the sheet was cancelled/closed while verify() was in flight — a
      // cancelled prompt must NOT fire the gated (destructive) action.
      if (!openRef.current) return;
      onConfirmed();
    } catch (err) {
      if (!openRef.current) return;
      setError(err instanceof Error && err.message ? err.message : 'Incorrect password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <View style={styles.root}>
        {/* Dimmed, pressable backdrop — tap to cancel. */}
        <Pressable
          style={styles.backdrop}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={handleCancel}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.kav}
          pointerEvents="box-none"
        >
          <View style={styles.sheet}>
            <View style={styles.grabber} />
            <Text style={styles.eyebrow}>SECURITY CHECK</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            <View style={styles.field}>
              <Text style={styles.label}>PASSWORD</Text>
              <PasswordInput
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (error) setError(null);
                }}
                placeholder="Enter your password"
                invalid={Boolean(error)}
                editable={!busy}
                autoComplete="current-password"
                textContentType="password"
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>

            <View style={styles.actions}>
              <View style={styles.action}>
                <Button variant="ghost" onPress={handleCancel} disabled={busy}>
                  Cancel
                </Button>
              </View>
              <View style={styles.action}>
                <Button
                  variant="primary"
                  onPress={handleConfirm}
                  loading={submitting}
                  disabled={!canSubmit}
                >
                  Confirm
                </Button>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,6,11,0.7)',
  },
  kav: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.bg2,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border2,
    marginBottom: spacing.lg,
  },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.xs,
    color: colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: fontSizes.lg,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontFamily: fonts.ui,
    fontSize: fontSizes.sm,
    lineHeight: 20,
    color: colors.textDim,
    marginBottom: spacing.lg,
  },
  field: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  error: {
    fontFamily: fonts.ui,
    fontSize: fontSizes.sm,
    color: colors.bad,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  action: {
    flex: 1,
  },
});
