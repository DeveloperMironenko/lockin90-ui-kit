import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, radii } from '@lockin90/tokens';

/** One HR training zone — its `value` (time-in-zone) drives the segment width. */
export interface ZoneBarZone {
  /** zone label shown under the bar; defaults to `Z1`..`Zn` by index */
  label?: string;
  /** time-in-zone (seconds) or share — sizes this segment relative to the others */
  value: number;
  /** override the segment color (a hex/rgb string, e.g. colors.lime); defaults to the Z1→Z5 ramp */
  color?: string;
}

export interface ZoneBarProps {
  /** the HR zones left→right (cool/recovery → hot/max), typically 5 (Z1..Z5); width ∝ value */
  zones: ZoneBarZone[];
  /** index 0..n-1 of the active zone → lit segment + marker tick (omit for none) */
  current?: number;
  /** render the zone labels (Z1..Z5) under the bar */
  showLabels?: boolean;
  /** bar thickness in px (default 8) */
  height?: number;
  /** optional wrapper style */
  style?: StyleProp<ViewStyle>;
}

/**
 * Default Z1→Z5 color ramp — cool recovery → hot max, mirroring the web ZoneBar
 * (the design's `.z1`..`.z5`): cyan → mint/teal → lime → amber → red.
 */
const ZONE_RAMP = [
  colors.cyan, // Z1 — recovery
  colors.zoneHigh, // Z2 — easy (mint/teal)
  colors.lime, // Z3 — aerobic
  colors.zoneMid, // Z4 — threshold (amber)
  colors.zoneLow, // Z5 — max (red)
] as const;

/**
 * ZoneBar — a horizontal heart-rate training-zone bar (native).
 *
 * Renders the 5 HR zones (Z1..Z5) as a row of token-colored pill segments whose
 * widths are proportional to time-in-zone, with the cool→hot Z1→Z5 ramp. The
 * `current` zone is lit (the rest dim) and carries a bright marker tick showing
 * where the athlete is right now. Mirrors the web ZoneBar 1:1 (same export +
 * prop API) — apps use this, never hand-roll a zone bar (see SDD §9).
 */
export function ZoneBar({ zones, current, showLabels = false, height = 8, style }: ZoneBarProps) {
  const sum = zones.reduce((acc, z) => acc + (z.value > 0 ? z.value : 0), 0);
  const hasCurrent = typeof current === 'number' && current >= 0 && current < zones.length;
  const baseOpacity = hasCurrent ? 0.42 : 0.85;
  const markH = height + 6;

  const zoneName = (z: ZoneBarZone, i: number) => z.label ?? `Z${i + 1}`;
  const zoneColor = (z: ZoneBarZone, i: number) => z.color ?? ZONE_RAMP[i] ?? colors.accent;

  const ariaLabel = `Heart-rate zones: ${zones
    .map((z, i) => `${zoneName(z, i)}${hasCurrent && current === i ? ' (current)' : ''}`)
    .join(', ')}.`;

  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.track, { height }]} accessibilityRole="image" accessibilityLabel={ariaLabel}>
        {zones.map((z, i) => {
          const v = z.value > 0 ? z.value : 0;
          // weight by share; if every zone is empty, fall back to equal widths
          const grow = sum > 0 ? v : 1;
          const isCurrent = hasCurrent && current === i;
          const color = zoneColor(z, i);
          return (
            <View
              key={`${zoneName(z, i)}-${i}`}
              style={[
                styles.seg,
                { flexGrow: grow, backgroundColor: color, opacity: isCurrent ? 1 : baseOpacity },
                isCurrent && {
                  shadowColor: color,
                  shadowOpacity: 0.7,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: 3,
                },
              ]}
            >
              {isCurrent && <View style={[styles.mark, { height: markH }]} pointerEvents="none" />}
            </View>
          );
        })}
      </View>

      {showLabels && (
        <View style={styles.labels}>
          {zones.map((z, i) => (
            <Text
              key={`lab-${zoneName(z, i)}-${i}`}
              style={[styles.lab, hasCurrent && current === i && styles.labOn]}
            >
              {zoneName(z, i)}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', gap: 6 },
  track: {
    position: 'relative',
    flexDirection: 'row',
    width: '100%',
    gap: 3,
  },
  seg: {
    flexBasis: 0,
    minWidth: 3,
    height: '100%',
    borderRadius: radii.pill,
  },
  /* the bright "you are here" marker, centered on the current zone */
  mark: {
    position: 'absolute',
    top: -3,
    left: '50%',
    marginLeft: -1.5,
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.text,
    shadowColor: colors.text,
    shadowOpacity: 0.85,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
    zIndex: 2,
  },
  labels: { flexDirection: 'row', gap: 3 },
  lab: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.mono,
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 0.57,
    color: colors.textFaint,
  },
  labOn: { color: colors.text },
});
