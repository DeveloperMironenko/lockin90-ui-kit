import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Chip, type ChipTone } from './Chip';

/** Built-in row icon keys — each maps to a stroked 24×24 glyph. */
export type AccountRowIcon = 'bell' | 'lock' | 'link' | 'trash' | 'sliders' | 'devices' | 'logout';

/** One settings row: leading icon + title/subtitle + trailing chevron. */
export interface AccountRow {
  /** Stable key for the row. */
  key: string;
  /** Built-in icon glyph. */
  icon?: AccountRowIcon;
  /** Row title, e.g. "Notifications". */
  title: string;
  /** Mono-tone subtitle / current value, e.g. "Push, email, quiet hours". */
  subtitle?: string;
  /** Destructive styling (red) — for delete / sign out. */
  danger?: boolean;
}

/** Identity shown in the hero. */
export interface AccountUser {
  /** Display name. */
  name?: string;
  /** Initials for the avatar (falls back to first two letters of `name`). */
  initials?: string;
  /** Email address. */
  email?: string;
  /** Whether the email is verified — shows the mint "verified" pill. */
  verified?: boolean;
  /** Plan label, e.g. "Pro". */
  plan?: string;
  /** Optional secondary role chip, e.g. "Coach". */
  role?: string;
  /** Mono "member since" line, e.g. "member since Apr 2024". */
  since?: string;
  /** Short user id line, e.g. "user · #41207". */
  uid?: string;
}

export interface AccountPanelProps {
  /** Identity rendered in the hero card. */
  user?: AccountUser;
  /** Settings rows rendered below the hero. */
  rows?: AccountRow[];
  /** Plan chip tone. */
  planTone?: ChipTone;
  /** Show the camera badge on the avatar. */
  editableAvatar?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Render a built-in icon glyph at the given stroke color. */
function RowIcon({ name, stroke }: { name: AccountRowIcon; stroke: string }) {
  const p = { stroke, strokeWidth: 1.6, fill: 'none' as const };
  switch (name) {
    case 'bell':
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" {...p} />
          <Path d="M10.5 21a2 2 0 0 0 3 0" {...p} />
        </Svg>
      );
    case 'lock':
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Rect x={5} y={11} width={14} height={9} rx={2} {...p} />
          <Path d="M8 11V8a4 4 0 0 1 8 0v3" {...p} />
        </Svg>
      );
    case 'link':
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path d="M9 15l6-6" {...p} />
          <Path d="M7 11l-2 2a3 3 0 0 0 4 4l2-2" {...p} />
          <Path d="M17 13l2-2a3 3 0 0 0-4-4l-2 2" {...p} />
        </Svg>
      );
    case 'trash':
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" {...p} />
        </Svg>
      );
    case 'sliders':
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" {...p} />
          <Path d="M1 14h6M9 8h6M17 16h6" {...p} />
        </Svg>
      );
    case 'devices':
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Rect x={2} y={4} width={14} height={11} rx={2} {...p} />
          <Path d="M8 19h6M11 15v4" {...p} />
          <Rect x={16} y={9} width={6} height={11} rx={1.5} {...p} />
        </Svg>
      );
    case 'logout':
      return (
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" {...p} />
          <Path d="M16 17l5-5-5-5M21 12H9" {...p} />
        </Svg>
      );
  }
}

/** Default settings rows matching the design example. */
const DEFAULT_ROWS: AccountRow[] = [
  { key: 'notifications', icon: 'bell', title: 'Notifications', subtitle: 'Push, email, quiet hours' },
  { key: 'privacy', icon: 'lock', title: 'Privacy & data', subtitle: 'Sharing, exports, deletion' },
  { key: 'connected', icon: 'link', title: 'Connected accounts', subtitle: '3 connected' },
  { key: 'delete', icon: 'trash', title: 'Delete account', subtitle: 'Permanently erase your data', danger: true },
];

const DEFAULT_USER: AccountUser = {
  name: 'Marcus Kane',
  initials: 'MK',
  email: 'marcus@example.com',
  verified: true,
  plan: 'Pro',
  role: 'Coach',
  since: 'member since Apr 2024',
  uid: 'user · #41207',
};

const DANGER = 'rgba(255,77,109,0.30)';

/** Resolve the avatar initials from explicit prop or the name. */
function initialsFor(user: AccountUser): string {
  if (user.initials) return user.initials;
  return (user.name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

/**
 * Account / settings surface: an avatar hero (initials avatar + name + plan/role
 * chips + verified email + edit/uid aside) over a stack of grouped settings rows
 * (icon + title/subtitle + chevron). Mirrors the web `AccountPanel` 1:1.
 */
export function AccountPanel({
  user = DEFAULT_USER,
  rows = DEFAULT_ROWS,
  planTone = 'accent',
  editableAvatar = true,
  style,
}: AccountPanelProps) {
  return (
    <View style={[styles.panel, style]}>
      {/* hero */}
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTxt}>{initialsFor(user)}</Text>
          {editableAvatar ? (
            <View style={styles.cam}>
              <Svg width={14} height={14} viewBox="0 0 24 24">
                <Path
                  d="M14.5 4h-5L8 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4z"
                  stroke={colors.text}
                  strokeWidth={1.7}
                  fill="none"
                />
                <Circle cx={12} cy={13} r={3.5} stroke={colors.text} strokeWidth={1.7} fill="none" />
              </Svg>
            </View>
          ) : null}
        </View>

        <View style={styles.identity}>
          <Text style={styles.name} numberOfLines={1}>
            {user.name}
          </Text>
          <View style={styles.meta}>
            {user.plan ? <Chip tone={planTone} dot label={user.plan} /> : null}
            {user.role ? <Chip tone="high" label={user.role} /> : null}
          </View>
          {user.since ? <Text style={styles.since}>{user.since}</Text> : null}
          {user.email ? (
            <View style={styles.emailRow}>
              <Text style={styles.email} numberOfLines={1}>
                {user.email}
              </Text>
              {user.verified ? (
                <View style={styles.verified}>
                  <Svg width={11} height={11} viewBox="0 0 24 24">
                    <Path d="M5 12l5 5L20 6" stroke={colors.zoneHigh} strokeWidth={2.2} fill="none" />
                  </Svg>
                  <Text style={styles.verifiedTxt}>verified</Text>
                </View>
              ) : null}
            </View>
          ) : null}
          {user.uid ? <Text style={styles.uid}>{user.uid}</Text> : null}
        </View>
      </View>

      {/* rows */}
      <View style={styles.rows}>
        {rows.map((row) => {
          const danger = !!row.danger;
          return (
            <View key={row.key} style={[styles.row, danger && styles.rowDanger]}>
              <View style={[styles.ico, danger && styles.icoDanger]}>
                {row.icon ? <RowIcon name={row.icon} stroke={danger ? colors.zoneLow : colors.accent2} /> : null}
              </View>
              <View style={styles.main}>
                <Text style={[styles.title, danger && styles.titleDanger]} numberOfLines={1}>
                  {row.title}
                </Text>
                {row.subtitle ? (
                  <Text style={styles.subtitle} numberOfLines={1}>
                    {row.subtitle}
                  </Text>
                ) : null}
              </View>
              <Svg width={16} height={16} viewBox="0 0 24 24">
                <Path
                  d="M9 6l6 6-6 6"
                  stroke={danger ? 'rgba(255,77,109,0.6)' : colors.textFaint}
                  strokeWidth={1.8}
                  fill="none"
                />
              </Svg>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { gap: 14 },

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    padding: 22,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  avatarTxt: { fontFamily: fonts.display, fontWeight: '700', fontSize: 26, color: '#07080d' },
  cam: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border2,
  },

  identity: { flex: 1, minWidth: 0 },
  name: { fontFamily: fonts.display, fontSize: 22, fontWeight: '700', letterSpacing: -0.4, color: colors.text },
  meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 7 },
  since: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint, marginTop: 7 },
  emailRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 7 },
  email: { fontFamily: fonts.ui, fontSize: 13, color: colors.textDim },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'rgba(52,245,197,0.35)',
    backgroundColor: 'rgba(52,245,197,0.08)',
  },
  verifiedTxt: { fontFamily: fonts.mono, fontSize: 10, color: colors.zoneHigh },
  uid: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint, marginTop: 8 },

  rows: { gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  rowDanger: { borderColor: DANGER, backgroundColor: 'rgba(255,77,109,0.04)' },
  ico: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass2,
  },
  icoDanger: { borderColor: DANGER, backgroundColor: 'rgba(255,77,109,0.06)' },
  main: { flex: 1, minWidth: 0 },
  title: { fontFamily: fonts.ui, fontWeight: '600', fontSize: 14, color: colors.text },
  titleDanger: { color: colors.zoneLow },
  subtitle: { fontFamily: fonts.ui, fontSize: 12, color: colors.textDim, marginTop: 1 },
});
