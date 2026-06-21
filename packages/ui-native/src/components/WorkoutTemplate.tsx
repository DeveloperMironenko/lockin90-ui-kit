import { View, Text, StyleSheet, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';
import { Card } from './Card';
import { Chip, type ChipTone } from './Chip';

/** A single saved workout template shown as a card. Mirrors the web prop API. */
export interface WorkoutTemplateItem {
  /** Template name, e.g. "Push Day A". */
  name: string;
  /** Short focus / target line, e.g. "Strength · upper push". */
  focus: string;
  /** Tiny meta footer, e.g. "6 ex · ~52 min · last 4d ago". */
  meta: string;
  /** Ordered exercise names (the short preview list). */
  exercises: string[];
  /** CTA label, e.g. "Start" or "Apply". */
  applyLabel: string;
  /** Optional focus-muscle chips (first is the accent primary). */
  focusTags?: string[];
}

export interface WorkoutTemplateProps {
  /** The templates to render (stacked; web lays them out in a 2-col grid). */
  templates?: WorkoutTemplateItem[];
  /** Cap the previewed exercises per card; extras roll into a "+N more" row. */
  maxExercises?: number;
  /** Fired when a card's apply / start button is pressed. */
  onApply?: (template: WorkoutTemplateItem, index: number) => void;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_TEMPLATES: WorkoutTemplateItem[] = [
  {
    name: 'Push Day A',
    focus: 'Strength · upper push',
    meta: '6 ex · ~52 min · last 4d ago',
    focusTags: ['Chest', 'Shoulders', 'Triceps'],
    exercises: ['Bench Press', 'Overhead Press', 'Incline DB Press', 'Lateral Raise', 'Cable Fly', 'Triceps Pushdown'],
    applyLabel: 'Start',
  },
  {
    name: 'Lower Power',
    focus: 'Power · lower body',
    meta: '5 ex · ~48 min · last 6d ago',
    focusTags: ['Quads', 'Hamstrings', 'Glutes'],
    exercises: ['Back Squat', 'Romanian Deadlift', 'Leg Press', 'Walking Lunge', 'Calf Raise'],
    applyLabel: 'Start',
  },
];

/** Saved-workout templates — stacked cards: an icon + the template name and
 *  focus line, focus-muscle chips, a short exercise preview list, and a
 *  gradient apply / start CTA. Mirrors the web `.lk-tpl-*` card pair. */
export function WorkoutTemplate({
  templates = DEFAULT_TEMPLATES,
  maxExercises = 4,
  onApply,
  style,
}: WorkoutTemplateProps) {
  return (
    <View style={[styles.grid, style]}>
      {templates.map((t, ti) => {
        const shown = t.exercises.slice(0, maxExercises);
        const extra = t.exercises.length - shown.length;
        return (
          <Card flat key={`${t.name}-${ti}`} style={styles.card}>
            <View style={styles.head}>
              <View style={styles.ico}>
                <Svg width={18} height={18} viewBox="0 0 24 24">
                  <Path
                    d="M6.5 6.5h11M6.5 17.5h11M4 9v6M20 9v6M9 7v10M15 7v10"
                    stroke={colors.accent}
                    strokeWidth={1.6}
                    fill="none"
                  />
                </Svg>
              </View>
              <View style={styles.headText}>
                <Text style={styles.title} numberOfLines={1}>
                  {t.name}
                </Text>
                <Text style={styles.target} numberOfLines={1}>
                  {t.focus.toUpperCase()}
                </Text>
              </View>
            </View>

            {t.focusTags && t.focusTags.length > 0 ? (
              <View style={styles.focus}>
                {t.focusTags.map((m, i) => (
                  <Chip key={m} tone={(i === 0 ? 'accent' : 'default') as ChipTone} label={m} />
                ))}
              </View>
            ) : null}

            <View style={styles.list}>
              {shown.map((ex, i) => (
                <View style={styles.exRow} key={`${ex}-${i}`}>
                  <View style={styles.exDot} />
                  <Text style={styles.exLabel} numberOfLines={1}>
                    {ex}
                  </Text>
                </View>
              ))}
              {extra > 0 ? <Text style={styles.more}>+{extra} MORE</Text> : null}
            </View>

            <View style={styles.foot}>
              <Text style={styles.meta} numberOfLines={1}>
                {t.meta}
              </Text>
              <Pressable onPress={() => onApply?.(t, ti)}>
                {({ pressed }) => (
                  <LinearGradient
                    colors={gradients.cta.stops as unknown as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.go, pressed && styles.goPressed]}
                  >
                    <Svg width={13} height={13} viewBox="0 0 24 24">
                      <Path d="M8 5v14l11-7z" fill="#0a0a10" />
                    </Svg>
                    <Text style={styles.goLabel}>{t.applyLabel}</Text>
                  </LinearGradient>
                )}
              </Pressable>
            </View>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 14 },
  card: { padding: 16, gap: 11 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ico: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass2,
    borderWidth: 1,
    borderColor: colors.border2,
  },
  headText: { flex: 1 },
  title: { fontFamily: fonts.display, fontWeight: '700', fontSize: 15, color: colors.text, lineHeight: 17 },
  target: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.textFaint, marginTop: 2, letterSpacing: 0.2 },
  focus: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  list: {
    gap: 2,
    paddingVertical: 11,
    paddingHorizontal: 2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  exRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  exDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent3,
    shadowColor: colors.accent3,
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  exLabel: { flex: 1, fontSize: 12.5, color: colors.textDim, lineHeight: 19 },
  more: { fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: 0.6, color: colors.textFaint, marginTop: 2 },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 1 },
  meta: { flex: 1, fontFamily: fonts.mono, fontSize: 9, color: colors.textFaint, letterSpacing: 0.36 },
  go: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: radii.pill,
  },
  goPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  goLabel: { fontFamily: fonts.ui, fontWeight: '700', fontSize: 12, color: '#0a0a10' },
});
