import type { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import { colors, fonts, spacing, letterSpacing, fontSizes } from '@lockin90/tokens';
import { Avatar } from './Avatar';

export interface AppHeaderProps {
  /** Display title, e.g. "Today". */
  title?: string;
  /** Small mono label shown above the title, e.g. "LOCKIN90". */
  eyebrow?: string;
  /** Account display name — used for avatar initials + the a11y label. */
  accountName?: string;
  /** Explicit override of the avatar initials (else derived from `accountName`). */
  accountInitials?: string;
  /** Tap handler for the account button (router nav happens in the app). */
  onAccountPress?: () => void;
  /** WEB ONLY — ignored on native. */
  accountHref?: string;
  /** Optional extra right-side node placed BEFORE the avatar (e.g. a sync icon). */
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Top app bar — brand/title on the left, an account avatar button on the right.
 * The native counterpart of the web @lockin90/ui AppHeader; shares the same prop
 * API and visual (eyebrow + display title left, trailing + gradient avatar right).
 */
export function AppHeader({
  title,
  eyebrow,
  accountName,
  accountInitials,
  onAccountPress,
  trailing,
  style,
}: AppHeaderProps) {
  const accountLabel = accountName ?? 'Account';
  // `Avatar` derives initials from `name` (first letter of up to 2 words). To honor
  // an explicit `accountInitials` override (e.g. "ZZ") feed a name whose derivation
  // reproduces it verbatim — space the chars out ("Z Z") — matching web parity.
  const avatarName = accountInitials
    ? accountInitials.trim().split('').join(' ')
    : accountName;

  // Account avatar on the LEFT, then the (optional) eyebrow + title stack; any
  // trailing node is right-aligned.
  return (
    <View style={[styles.row, style]}>
      <View style={styles.left}>
        <Pressable
          onPress={onAccountPress}
          accessibilityRole="button"
          accessibilityLabel={accountLabel}
          hitSlop={8}
        >
          <Avatar gradient="flux" name={avatarName} size={36} />
        </Pressable>
        {eyebrow || title ? (
          <View style={styles.titles}>
            {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
            {title ? <Text style={styles.title}>{title}</Text> : null}
          </View>
        ) : null}
      </View>
      {trailing ? <View style={styles.right}>{trailing}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.pageX,
    paddingVertical: spacing.md,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexShrink: 1,
    minWidth: 0,
  },
  titles: {
    flexShrink: 1,
    minWidth: 0,
    gap: 2,
  },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.xs,
    letterSpacing: letterSpacing.eyebrow,
    textTransform: 'uppercase',
    color: colors.textDim,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    letterSpacing: -0.4,
    color: colors.text,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});
