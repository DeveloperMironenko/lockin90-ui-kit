import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, radii, fonts, nativeShadows } from '@lockin90/tokens';

export type DataSourceStatus = 'connected' | 'disconnected';

export interface DataSourceCardProps extends ViewProps {
  /** Provider name, e.g. "Oura Ring 4". */
  name?: string;
  /** Kind line, e.g. "Wearable · OAuth". */
  kind?: string;
  /** Connection state — drives the status pill. */
  status?: DataSourceStatus;
  /** Provider logo. Defaults to a concentric Oura-style ring tinted with `accentColor`. */
  icon?: ReactNode;
  /** Tint for the default logo (ignored when `icon` is supplied). */
  accentColor?: string;
  /** Override the status pill label (defaults: "Connected" / "Disconnected"). */
  statusLabel?: string;
}

/** Concentric ring — the Oura default logo. */
function RingLogo({ color }: { color: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.6} />
      <Circle cx={12} cy={12} r={4.5} stroke={color} strokeWidth={1.6} />
    </Svg>
  );
}

/**
 * A connected-integration card: a provider logo tile, name + kind, and a
 * connected / disconnected status pill. Native counterpart of the web
 * DataSourceCard (same prop API).
 */
export function DataSourceCard({
  name = 'Oura Ring 4',
  kind = 'Wearable · OAuth',
  status = 'connected',
  icon,
  accentColor = '#A855F7',
  statusLabel,
  style,
  ...rest
}: DataSourceCardProps) {
  const connected = status === 'connected';
  const label = statusLabel ?? (connected ? 'Connected' : 'Disconnected');
  const pillColor = connected ? colors.zoneHigh : colors.textDim;

  return (
    <View style={[styles.card, style]} {...rest}>
      <View style={styles.top}>
        <View style={styles.logo}>{icon ?? <RingLogo color={accentColor} />}</View>
        <View style={styles.head}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.kind}>{kind}</Text>
        </View>
        <View
          style={[
            styles.status,
            connected && {
              borderColor: 'rgba(52,245,197,0.35)',
              backgroundColor: 'rgba(52,245,197,0.08)',
            },
          ]}
        >
          <View style={[styles.dot, { backgroundColor: pillColor, shadowColor: pillColor }]} />
          <Text style={[styles.statusLabel, { color: pillColor }]}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 20,
    ...nativeShadows.elev1,
  },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg1,
    overflow: 'hidden',
  },
  head: { flex: 1, minWidth: 0 },
  name: {
    fontFamily: fonts.display,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.17,
    color: colors.text,
  },
  kind: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    color: colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  status: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  dot: { width: 6, height: 6, borderRadius: 3, shadowOpacity: 0.9, shadowRadius: 6 },
  statusLabel: { fontFamily: fonts.mono, fontSize: 11, fontWeight: '500', letterSpacing: 0.44 },
});
