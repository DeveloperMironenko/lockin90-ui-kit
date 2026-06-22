import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';

export type VersionEnv = 'prod' | 'staging' | 'dev';

export interface VersionBadgeProps extends ViewProps {
  /** version string, e.g. `v1.6.0` */
  version: string;
  /** short build hash, e.g. `a1b2c3d` */
  build?: string;
  /** deployment environment — tints the leading dot + env label (default `prod`) */
  env?: VersionEnv;
  /** optional build/release date segment */
  date?: string;
  /** show the leading env-colored status dot (default true) */
  dot?: boolean;
}

const ENV_COLOR: Record<VersionEnv, string> = {
  prod: colors.mint,
  staging: colors.warn,
  dev: colors.accent,
};

const ENV_LABEL: Record<VersionEnv, string> = {
  prod: 'PROD',
  staging: 'STAGING',
  dev: 'DEV',
};

/** Compact monospace build/version chip — version · build · env · date, with an env-colored status dot. */
export function VersionBadge({
  version,
  build,
  env = 'prod',
  date,
  dot = true,
  style,
  ...rest
}: VersionBadgeProps) {
  const tint = ENV_COLOR[env];

  return (
    <View style={[styles.badge, env !== 'prod' && { borderColor: hexAlpha(tint, 0.4) }, style]} {...rest}>
      <View style={styles.seg}>
        {dot && (
          <View
            style={[
              styles.dot,
              { backgroundColor: tint, shadowColor: tint, shadowOpacity: 1, shadowRadius: 4 },
            ]}
          />
        )}
        <Text style={styles.ver}>{version}</Text>
      </View>
      {build != null && (
        <View style={[styles.seg, styles.segDivider]}>
          <Text style={styles.faint}>build {build}</Text>
        </View>
      )}
      {date != null && (
        <View style={[styles.seg, styles.segDivider]}>
          <Text style={styles.faint}>{date}</Text>
        </View>
      )}
      <View style={[styles.seg, styles.segDivider]}>
        <Text style={[styles.env, { color: tint }]}>{ENV_LABEL[env]}</Text>
      </View>
    </View>
  );
}

/** `#RRGGBB` + alpha → `rgba(...)`. */
function hexAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass2,
    overflow: 'hidden',
  },
  seg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  segDivider: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  ver: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    lineHeight: 14,
    color: colors.textDim,
  },
  faint: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    lineHeight: 14,
    color: colors.textFaint,
  },
  env: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowOffset: { width: 0, height: 0 },
  },
});
