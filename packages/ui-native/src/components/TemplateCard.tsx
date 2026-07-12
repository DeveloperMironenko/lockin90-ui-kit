import { type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, radii } from '@lockin90/tokens';
import { hapticSelection } from '../internal/optionalHaptics';

/** Who authored the template — coach/AI show a tinted source pill. */
export type TemplateSource = 'coach' | 'ai' | 'manual';

export interface TemplateCardProps {
  /** Template name (display font). */
  name: string;
  /** Dim summary line (e.g. `'Chest · Arms · 5 ex · ~48m'`). */
  meta?: string;
  /** Bold emphasized fragment appended to the meta line after a `' · '`
   *  separator (e.g. the exercise count `'5 ex'` — design `.tpl .mt b`,
   *  reads slightly brighter than the rest of the meta line). */
  metaCount?: string;
  /** Faint mono footer (e.g. `'Last used 2d ago'`). */
  lastUsed?: string;
  /** Authoring source — `coach` mint pill · `ai` violet pill · `manual` none (default). */
  source?: TemplateSource;
  /** Accent color for the left edge bar (any token, e.g. `colors.cyan`) — the
   *  edge bar renders only when `leading` is absent (see `leading`). */
  tint?: string;
  /**
   * Leading 34×34 tinted icon tile (design `.tpl .ti.tile` — the row's
   * primary identifier, e.g. `<Icon name={workoutTypeIcon(type)} />`).
   * Colored from `tint` (13%-fill / 33%-border, the app's tile convention).
   * When set, this REPLACES the plain `tint` edge bar (the mockup never
   * shows both together).
   */
  leading?: ReactNode;
  /** When set, the card becomes a `Pressable` (mirrors the web `onPress`). */
  onPress?: () => void;
  /** Trailing slot pinned right (chevron, menu, duration…). */
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const SOURCE_PILL: Record<Exclude<TemplateSource, 'manual'>, { label: string; color: string; border: string; bg: string }> = {
  coach: { label: 'COACH', color: colors.mint, border: 'rgba(52,245,197,0.32)', bg: 'rgba(52,245,197,0.10)' },
  ai: { label: 'AI', color: colors.accent, border: 'rgba(124,92,255,0.4)', bg: 'rgba(124,92,255,0.12)' },
};

/**
 * TemplateCard — a workout-template row card. Native twin of the web
 * `TemplateCard` (same prop API): glass surface, display-font name, dim meta
 * line, faint mono "last used", a small mint `Coach` / violet `AI` source
 * pill when the template wasn't hand-built, and a `tint` accent bar down the
 * left edge. With `onPress` the whole card is the tap target.
 */
export function TemplateCard({
  name,
  meta,
  metaCount,
  lastUsed,
  source = 'manual',
  tint,
  leading,
  onPress,
  trailing,
  style,
}: TemplateCardProps) {
  const pill = source !== 'manual' ? SOURCE_PILL[source] : null;

  const body = (
    <>
      {leading == null && tint ? <View style={[styles.tint, { backgroundColor: tint }]} /> : null}
      {leading != null ? (
        <View
          style={[
            styles.leadTile,
            tint
              ? { backgroundColor: `${tint}1F`, borderColor: `${tint}52` }
              : { backgroundColor: colors.glass, borderColor: colors.border },
          ]}
        >
          {leading}
        </View>
      ) : null}
      <View style={styles.main}>
        <View style={styles.top}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {pill ? (
            <View style={[styles.src, { borderColor: pill.border, backgroundColor: pill.bg }]}>
              <Text style={[styles.srcText, { color: pill.color }]}>{pill.label}</Text>
            </View>
          ) : null}
        </View>
        {(meta != null || metaCount != null) && (
          <Text style={styles.meta}>
            {meta}
            {meta != null && metaCount != null ? ' · ' : null}
            {metaCount != null ? <Text style={styles.metaCount}>{metaCount}</Text> : null}
          </Text>
        )}
        {lastUsed != null && <Text style={styles.last}>{lastUsed}</Text>}
      </View>
      {trailing != null && <View style={styles.trailing}>{trailing}</View>}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          hapticSelection();
          onPress();
        }}
        style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      >
        {body}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{body}</View>;
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    overflow: 'hidden',
  },
  pressed: { backgroundColor: colors.glass2, borderColor: colors.border2 },
  tint: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 3,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  // leading icon tile (design `.tpl .ti.tile`) — 34×34, tint-colored fill/border
  leadTile: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: { flex: 1, minWidth: 0, gap: 3 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: {
    flexShrink: 1,
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.15,
    color: colors.text,
  },
  meta: { fontSize: 12, color: colors.textDim },
  // design `.tpl .mt b` — the bold count fragment reads one step brighter
  // than the dim meta line (mirrors the design's faint→dim relationship).
  metaCount: { color: colors.text, fontWeight: '700' },
  last: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint, marginTop: 1 },
  trailing: { flexShrink: 0, flexDirection: 'row', alignItems: 'center' },

  src: {
    flexShrink: 0,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  srcText: { fontFamily: fonts.mono, fontSize: 8.5, fontWeight: '600', letterSpacing: 0.7, lineHeight: 9 },
});
