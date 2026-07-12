import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Easing, View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, radii } from '@lockin90/tokens';
import { Button } from './Button';

export interface SessionBannerStat {
  /** Mono stat value (e.g. `'142'`). */
  value: string;
  /** Faint mono label under it (e.g. `'BPM'`). */
  label: string;
}

export interface SessionBannerAction {
  label: string;
  /** `ghost` (default) or `primary` — maps to the kit `Button` variants. */
  variant?: 'primary' | 'ghost';
  onPress?: () => void;
}

export interface SessionBannerProps {
  /** Session name (e.g. `'Push Day A'`) — truncates, never wraps. */
  title: string;
  /** Right-pinned mono status (e.g. `'Live · 24:18'`) — never wraps. */
  status?: string;
  /** Dim line under the header (e.g. `'Bench Press · set 2 of 5'`). */
  subtitle?: string;
  /** Up to 3 mono stat readouts (value + label). */
  stats?: SessionBannerStat[];
  /** Action buttons (kit `Button`, `sm`). Render on their own row; when there
   *  is no `subtitle` and no `stats` they fold INLINE into the head row
   *  (single-row banner — design 5 `.at`). */
  actions?: SessionBannerAction[];
  /** Pulsing red-pink live dot (magenta `#FF3D81`); also tints `status`. */
  live?: boolean;
  /** Optional leading slot (app icon / exercise glyph). */
  leading?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** The pulsing magenta live dot — Animated loop (scale 1→1.35, fade),
 *  mirroring the web CSS keyframes; same unconditional-loop substrate as
 *  DotsLoader/TypingIndicator. */
function LiveDot() {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v]);
  return (
    <Animated.View
      style={[
        styles.dot,
        {
          opacity: v.interpolate({ inputRange: [0, 1], outputRange: [1, 0.55] }),
          transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.35] }) }],
        },
      ]}
    />
  );
}

/**
 * SessionBanner — the active-session live banner. Native twin of the web
 * `SessionBanner` (same prop API): a dark glass card with a one-line header
 * (optional leading slot, pulsing magenta live dot, truncating title,
 * no-wrap status), a dim subtitle, up to 3 mono stats split by hairlines,
 * and a row of kit-Button actions. When there is no subtitle AND no stats,
 * the actions render INLINE at the end of the head row (after the status) so
 * the whole banner is ONE row — the Active screen's top bar (design 5 `.at`:
 * live dot + title left, status right, Finish button far right).
 */
export function SessionBanner({
  title,
  status,
  subtitle,
  stats,
  actions,
  live = false,
  leading,
  style,
}: SessionBannerProps) {
  const shownStats = stats?.slice(0, 3) ?? [];
  const hasActions = actions != null && actions.length > 0;
  /* just a bar — no second row to sit above: fold the actions into the head */
  const inlineActions = hasActions && subtitle == null && shownStats.length === 0;
  const actionButtons = hasActions
    ? actions.map((a, i) => (
        <Button
          key={i}
          size="sm"
          variant={a.variant === 'primary' ? 'primary' : 'ghost'}
          title={a.label}
          onPress={a.onPress}
        />
      ))
    : null;
  return (
    <View style={[styles.card, style]}>
      <View style={styles.head}>
        {leading != null && <View style={styles.leading}>{leading}</View>}
        {live ? <LiveDot /> : null}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {status != null && (
          <Text style={[styles.status, live && styles.statusLive]} numberOfLines={1}>
            {status}
          </Text>
        )}
        {inlineActions && <View style={styles.actionsInline}>{actionButtons}</View>}
      </View>
      {subtitle != null && <Text style={styles.sub}>{subtitle}</Text>}
      {shownStats.length > 0 && (
        <View style={styles.stats}>
          {shownStats.map((s, i) => (
            <View key={i} style={[styles.stat, i === 0 && styles.statFirst, i > 0 && styles.statDivider]}>
              <Text style={styles.statVal}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      )}
      {hasActions && !inlineActions && <View style={styles.actions}>{actionButtons}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 9,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    /* dark glass — matched web literal (no backdrop blur on native views) */
    backgroundColor: 'rgba(10,12,20,0.72)',
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  leading: { flexShrink: 0, flexDirection: 'row', alignItems: 'center' },
  dot: {
    flexShrink: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.magenta,
    shadowColor: colors.magenta,
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  title: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.15,
    color: colors.text,
  },
  status: {
    flexShrink: 0,
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    color: colors.textDim,
  },
  statusLive: { color: colors.magenta },
  sub: { fontSize: 12.5, color: colors.textDim },

  stats: { flexDirection: 'row', alignItems: 'stretch' },
  stat: { flex: 1, gap: 2, paddingHorizontal: 12 },
  statFirst: { paddingLeft: 0 },
  statDivider: { borderLeftWidth: 1, borderLeftColor: colors.border },
  statVal: {
    fontFamily: fonts.mono,
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: colors.text,
  },
  statLabel: { fontFamily: fonts.mono, fontSize: 8.5, letterSpacing: 1, color: colors.textFaint },

  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  // single-row banner — actions fold into the head row (design 5 `.at`);
  // they never shrink or wrap, the title alone truncates
  actionsInline: { flexShrink: 0, flexDirection: 'row', alignItems: 'center', gap: 8 },
});
