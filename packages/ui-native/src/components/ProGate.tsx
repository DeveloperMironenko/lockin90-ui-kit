import { type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, type ViewProps } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

export interface ProGateProps extends Omit<ViewProps, 'children'> {
  /** Lock-card heading. */
  title?: string;
  /** Lock-card supporting line. */
  subtitle?: string;
  /** Gated content, shown dimmed behind the overlay. */
  children?: ReactNode;
}

/** Padlock — body + shackle. Native has no `currentColor`, so color is explicit. */
function LockIcon({ size, color, strokeWidth }: { size: number; color: string; strokeWidth: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={4} y={10.5} width={16} height={10} rx={2.2} />
      <Path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </Svg>
  );
}

/**
 * Premium-lock overlay: dimmed gated content behind a centered lock card.
 * Native has no `backdrop-filter` blur — the gated content is dimmed (opacity)
 * rather than blurred, otherwise visually identical to the web `ProGate`.
 */
export function ProGate({
  title = 'PRO Feature',
  subtitle = 'Visualize PR progression with PRO',
  children,
  style,
  ...rest
}: ProGateProps) {
  return (
    <View style={[styles.pro, style]} {...rest}>
      <View style={[styles.content, children == null && styles.contentEmpty]} pointerEvents="none">
        {children}
      </View>
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.card}>
          <LockIcon size={24} color={colors.textFaint} strokeWidth={1.8} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.sub}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

export interface LockedRowProps extends Omit<ViewProps, 'children'> {
  /** Row label, e.g. "19 more similar exercises". */
  label?: string;
  /** Tap handler. */
  onPress?: () => void;
}

/** Tappable gated list row: red lock badge + label + chevron, red-tinted border + red left accent. */
export function LockedRow({
  label = '19 more similar exercises',
  onPress,
  style,
  ...rest
}: LockedRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed, style]}
      {...rest}
    >
      <View style={styles.accent} pointerEvents="none" />
      <View style={styles.badge}>
        <LockIcon size={14} color="#fff" strokeWidth={2} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.textFaint} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={styles.chev}>
        <Path d="m9 6 6 6-6 6" />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // ---- ProGate ----
  pro: {
    position: 'relative',
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  content: {
    opacity: 0.35,
  },
  contentEmpty: {
    minHeight: 150,
    backgroundColor: colors.glass,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  card: {
    alignItems: 'center',
    gap: 8,
    maxWidth: '70%',
    paddingVertical: 16,
    paddingHorizontal: 22,
    backgroundColor: colors.glass2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.15,
    color: colors.text,
    textAlign: 'center',
  },
  sub: {
    fontFamily: fonts.ui,
    fontSize: 12.5,
    color: colors.textDim,
    textAlign: 'center',
  },

  // ---- LockedRow ----
  row: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: 'rgba(255,77,109,0.28)',
    borderRadius: radii.sm,
  },
  rowPressed: {
    backgroundColor: colors.glass2,
    borderColor: 'rgba(255,77,109,0.45)',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 4,
    bottom: 4,
    width: 3,
    borderRadius: 999,
    backgroundColor: colors.zoneLow,
  },
  badge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.zoneLow,
    shadowColor: colors.zoneLow,
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  label: {
    flex: 1,
    fontFamily: fonts.ui,
    fontSize: 14,
    color: colors.text,
  },
  chev: {
    marginLeft: 'auto',
  },
});
