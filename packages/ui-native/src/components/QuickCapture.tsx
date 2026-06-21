import { type ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

/** One quick-capture action tile in the log-hub grid. */
export interface QuickCaptureTile {
  /** stable id passed back to `onCapture` (defaults to the lowercased label) */
  id?: string;
  /** primary label, e.g. "Energy" */
  label: string;
  /** mono sub-label under the label, e.g. "how you feel now" */
  sub?: string;
  /** accent color (resolved hex/rgba) — drives the icon tint + glow. Falls back to `colors.accent`. */
  accent?: string;
  /** SVG path `d` (rendered inside a 0 0 24 24 viewBox). Ignored for a custom `icon`. */
  path?: string;
  /** full custom icon node (overrides `path`) */
  icon?: ReactNode;
  /** show the "Most used" flag pill + tinted "hot" surface */
  hot?: boolean;
  /** accessible label for the button (defaults to `Log {label}`) */
  ariaLabel?: string;
}

export interface QuickCaptureProps {
  /** the tiles to render — defaults to the design's full example set */
  tiles?: QuickCaptureTile[];
  /** fired with the tile (and its resolved id) when a tile is pressed */
  onCapture?: (tile: QuickCaptureTile, id: string) => void;
  style?: StyleProp<ViewStyle>;
}

/** The design's example log-hub tiles (label · accent · icon path), in order.
 *  Accents are resolved token values (native has no `var(--x)`). */
export const QUICK_CAPTURE_TILES: QuickCaptureTile[] = [
  { label: 'Energy', sub: 'how you feel now', accent: colors.accent, hot: true, ariaLabel: 'Log energy or mood', path: 'M13 2 4 14h7l-1 8 9-12h-7z' },
  { label: 'Meal', sub: 'macros & timing', accent: colors.lime, hot: true, ariaLabel: 'Log a meal', path: 'M3 11h18M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M7 11v8M17 11v8' },
  { label: 'Caffeine', sub: 'mg & sensitivity', accent: colors.zoneMid, ariaLabel: 'Log caffeine', path: 'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4zM6 1v3M10 1v3M14 1v3' },
  { label: 'Supplement', sub: 'dose & type', accent: colors.accent3, ariaLabel: 'Log a supplement', path: 'M3 9h18v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 18zM12 9v13.5' },
  { label: 'Workout', sub: 'load & RPE', accent: colors.magenta, ariaLabel: 'Log a workout', path: 'M6.5 6.5h11M6.5 17.5h11M4 9v6M20 9v6M9 7v10M15 7v10' },
  { label: 'Sleep', sub: 'override & naps', accent: colors.accent2, ariaLabel: 'Log sleep override', path: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z' },
  { label: 'Water', sub: 'hydration ml', accent: colors.cyan, ariaLabel: 'Log water', path: 'M12 2.5C12 2.5 5 10 5 15a7 7 0 0 0 14 0c0-5-7-12.5-7-12.5z' },
  { label: 'Mood', sub: 'how you feel', accent: colors.zoneLow, ariaLabel: 'Log mood', path: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01' },
  { label: 'Journal', sub: 'free text', accent: colors.violet, ariaLabel: 'Write a journal note', path: 'M4 4h13l3 3v13H4zM8 9h8M8 13h8M8 17h5' },
];

function tileId(t: QuickCaptureTile): string {
  return t.id ?? t.label.toLowerCase();
}

/** Log-hub quick-capture grid — large tappable tiles (icon + label + sub), each
 *  a one-tap action to log something. Native counterpart of the web
 *  QuickCapture (same prop API); the responsive auto-fill grid is approximated
 *  with a flex-wrap of fixed-width tiles. */
export function QuickCapture({ tiles = QUICK_CAPTURE_TILES, onCapture, style }: QuickCaptureProps) {
  return (
    <View style={[styles.grid, style]}>
      {tiles.map((t) => {
        const id = tileId(t);
        const accent = t.accent ?? colors.accent;
        return (
          <Pressable
            key={id}
            accessibilityRole="button"
            accessibilityLabel={t.ariaLabel ?? `Log ${t.label}`}
            onPress={() => onCapture?.(t, id)}
            style={({ pressed }) => [
              styles.tile,
              t.hot && styles.tileHot,
              pressed && styles.tilePressed,
            ]}
          >
            {t.hot ? (
              <Text style={styles.flag}>MOST USED</Text>
            ) : null}
            <View
              style={[
                styles.ico,
                t.hot && { borderColor: accent, shadowColor: accent, shadowOpacity: 0.5, shadowRadius: 14 },
              ]}
            >
              {t.icon ?? (
                <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
                  <Path d={t.path} stroke={accent} strokeWidth={1.6} />
                </Svg>
              )}
            </View>
            <Text style={styles.label}>{t.label}</Text>
            {t.sub ? <Text style={styles.sub}>{t.sub}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  tile: {
    position: 'relative',
    width: 150,
    flexGrow: 1,
    minHeight: 132,
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.glass,
    overflow: 'hidden',
  },
  tileHot: {
    backgroundColor: 'rgba(124,92,255,0.07)',
    borderColor: 'rgba(124,92,255,0.28)',
  },
  tilePressed: { backgroundColor: colors.glass2, borderColor: colors.border2 },
  ico: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  label: {
    fontFamily: fonts.display,
    fontWeight: '600',
    fontSize: 15.5,
    letterSpacing: -0.15,
    color: colors.text,
  },
  sub: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    color: colors.textFaint,
    marginTop: -7,
  },
  flag: {
    position: 'absolute',
    top: 12,
    right: 12,
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.08,
    color: colors.accent2,
    backgroundColor: 'rgba(34,211,238,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.3)',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
});
