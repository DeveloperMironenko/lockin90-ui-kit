import { type ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

/** One most-logged favorite, rendered as a one-tap "+ add" chip. */
export interface QuickAddFavorite {
  /** stable id passed back to `onAdd` (defaults to the lowercased label) */
  id?: string;
  /** primary label, e.g. "Coffee" */
  label: string;
  /** mono sub-label under the label, e.g. "130mg · 18×" */
  sub?: string;
  /** accent color (resolved hex/rgba) — drives the icon tint. Falls back to `colors.accent`. */
  accent?: string;
  /** SVG path `d` (rendered inside a 0 0 24 24 viewBox). Ignored for a custom `icon`. */
  path?: string;
  /** full custom icon node (overrides `path`) */
  icon?: ReactNode;
  /** accessible label for the chip (defaults to `Add {label}`) */
  ariaLabel?: string;
}

export interface QuickAddFavoritesProps {
  /** the favorites to render — defaults to the design's full example set */
  favorites?: QuickAddFavorite[];
  /** card heading */
  title?: string;
  /** mono sub-label in the head, e.g. "most-logged this week" */
  sub?: string;
  /** label for the trailing dashed ghost chip */
  newLabel?: string;
  /** fired with the resolved id when a favorite's "+ add" chip is pressed */
  onAdd?: (id: string) => void;
  /** fired when the trailing "＋ New favorite" ghost chip is pressed */
  onNew?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** The design's example most-logged favorites (label · sub · accent · icon), in
 *  order. Accents are resolved token values (native has no `var(--x)`). */
export const QUICK_ADD_FAVORITES: QuickAddFavorite[] = [
  { label: 'Coffee', sub: '130mg · 18×', accent: colors.zoneMid, path: 'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4zM6 1v3M10 1v3M14 1v3' },
  { label: 'Lunch', sub: '520 kcal · 12×', accent: colors.lime, path: 'M3 11h18M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M7 11v8M17 11v8' },
  { label: 'Magnesium', sub: '400mg · 11×', accent: colors.accent3, path: 'M3 9h18v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 18zM12 9v9' },
  { label: 'Run', sub: 'easy 5K · 7×', accent: colors.magenta, path: 'M13 4a2 2 0 1 0 0 .01M5 22l3-6 4-2 2 4 3 1M9 12l2-4 4 1 2 3' },
  { label: 'Water', sub: '500ml · 24×', accent: colors.cyan, path: 'M12 2.5C12 2.5 5 10 5 15a7 7 0 0 0 14 0c0-5-7-12.5-7-12.5z' },
  { label: 'Nap', sub: '20 min · 5×', accent: colors.accent2, path: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z' },
];

function favoriteId(f: QuickAddFavorite): string {
  return f.id ?? f.label.toLowerCase();
}

const PLUS_PATH = 'M12 5v14M5 12h14';

/** Quick-add favorites — a horizontal scroll row of most-logged items as
 *  one-tap "+ add" chips (icon + label + sub + a "+" affordance), plus a
 *  trailing dashed "＋ New favorite" ghost chip. Native counterpart of the web
 *  QuickAddFavorites (same prop API). */
export function QuickAddFavorites({
  favorites = QUICK_ADD_FAVORITES,
  title = 'Quick add',
  sub = 'most-logged this week',
  newLabel = 'New favorite',
  onAdd,
  onNew,
  style,
}: QuickAddFavoritesProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
        {sub ? (
          <Text style={styles.sub}>
            <Text style={styles.dot}>● </Text>
            {sub}
          </Text>
        ) : null}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {favorites.map((f) => {
          const id = favoriteId(f);
          const accent = f.accent ?? colors.accent;
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityLabel={f.ariaLabel ?? `Add ${f.label}`}
              onPress={() => onAdd?.(id)}
              style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
            >
              <View style={styles.ico}>
                {f.icon ?? (
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path d={f.path} stroke={accent} strokeWidth={1.6} />
                  </Svg>
                )}
              </View>
              <View style={styles.main}>
                <Text style={styles.label}>{f.label}</Text>
                {f.sub ? <Text style={styles.detail}>{f.sub}</Text> : null}
              </View>
              <View style={styles.plus}>
                <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
                  <Path d={PLUS_PATH} stroke={colors.textDim} strokeWidth={2.2} />
                </Svg>
              </View>
            </Pressable>
          );
        })}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={newLabel}
          onPress={() => onNew?.()}
          style={({ pressed }) => [styles.new, pressed && styles.newPressed]}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path d={PLUS_PATH} stroke={colors.textDim} strokeWidth={2.2} />
          </Svg>
          <Text style={styles.newLabel}>{newLabel}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.glass,
  },
  head: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  title: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.15,
    color: colors.text,
  },
  sub: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    letterSpacing: 0.42,
    color: colors.textFaint,
    marginLeft: 'auto',
  },
  dot: { color: colors.zoneHigh },
  row: { flexDirection: 'row', gap: 12, paddingTop: 14, paddingBottom: 2, paddingHorizontal: 2 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingTop: 11,
    paddingBottom: 11,
    paddingRight: 16,
    paddingLeft: 12,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  chipPressed: { borderColor: colors.border2, backgroundColor: colors.glass2 },
  ico: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  main: { flexDirection: 'column' },
  label: { fontFamily: fonts.ui, fontWeight: '600', fontSize: 13.5, color: colors.text, lineHeight: 17 },
  detail: { fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint, lineHeight: 13 },
  plus: {
    width: 22,
    height: 22,
    borderRadius: radii.pill,
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border2,
  },
  new: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border2,
    backgroundColor: 'transparent',
  },
  newPressed: { borderColor: colors.accent2, backgroundColor: colors.glass },
  newLabel: { fontFamily: fonts.ui, fontWeight: '600', fontSize: 13, color: colors.textDim },
});
