import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Card } from './Card';
import { Chip, type ChipTone } from './Chip';

/** Difficulty rung: 1 = beginner, 2 = intermediate, 3 = advanced. */
export type ExerciseLevel = 1 | 2 | 3;

/** Default difficulty labels per level (mono uppercase footer label). */
const LEVEL_LABEL: Record<ExerciseLevel, string> = {
  1: 'Beginner',
  2: 'Inter',
  3: 'Advanced',
};

/** Lit-dot color per level — mirrors web `.lk-ex-diff.lvl{n} i.on`. */
const LEVEL_COLOR: Record<ExerciseLevel, string> = {
  1: colors.accent3,
  2: colors.zoneMid,
  3: colors.zoneHigh,
};

export interface ExerciseCardProps {
  /** Exercise name, e.g. "Barbell Back Squat". */
  name?: string;
  /** Target muscle groups — first is the primary (accent + dot), rest plain. */
  muscles?: string[];
  /** 16:9 thumbnail gradient stop colors (native has no CSS gradient string). */
  gradient?: readonly [string, string, ...string[]];
  /** Path data for the waveline overlay drawn on the thumb (160×90 viewBox). */
  wavePath?: string;
  /** Duration badge, e.g. "4:12". Hidden when empty. */
  duration?: string;
  /** Difficulty rung 1–3. */
  level?: ExerciseLevel;
  /** Difficulty label. Defaults to a label derived from the level. */
  levelLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Exercise-library card — a 16:9 video-style thumb (gradient + waveline +
 *  centered play button + duration badge), the exercise name, muscle-group
 *  chips (first is the accent primary), and a level-dot difficulty footer.
 *  Mirrors the web `.lk-ex-*` card. */
export function ExerciseCard({
  name = 'Barbell Back Squat',
  muscles = ['Quads', 'Glutes', 'Core'],
  gradient = ['#7C5CFF', '#22D3EE'],
  wavePath = 'M0,64 C30,40 50,72 80,52 C110,32 130,60 160,44',
  duration = '4:12',
  level = 3,
  levelLabel,
  style,
}: ExerciseCardProps) {
  const lbl = levelLabel ?? LEVEL_LABEL[level];
  const litColor = LEVEL_COLOR[level];
  return (
    <Card flat style={[styles.card, style]}>
      <View style={styles.thumb}>
        <LinearGradient
          colors={[...gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Svg style={StyleSheet.absoluteFill} viewBox="0 0 160 90" preserveAspectRatio="none">
          <Path d={wavePath} fill="none" stroke="#fff" strokeWidth={2} opacity={0.35} />
        </Svg>
        <View style={styles.scrim} pointerEvents="none" />
        {duration ? (
          <View style={styles.dur}>
            <Text style={styles.durLabel}>{duration}</Text>
          </View>
        ) : null}
        <View style={styles.play} pointerEvents="none">
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path d="M6 4l14 8-14 8z" fill="#fff" />
          </Svg>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.tags}>
          {muscles.map((m, i) => (
            <Chip key={m} tone={(i === 0 ? 'accent' : 'default') as ChipTone} dot={i === 0} label={m} />
          ))}
        </View>
        <View style={styles.foot}>
          <View style={styles.diff}>
            {([1, 2, 3] as const).map((n) => (
              <View
                key={n}
                style={[
                  styles.dot,
                  n <= level
                    ? { backgroundColor: litColor, shadowColor: litColor, shadowOpacity: 0.9, shadowRadius: 4 }
                    : null,
                ]}
              />
            ))}
            <Text style={styles.diffLbl}>{lbl.toUpperCase()}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 0, overflow: 'hidden' },
  thumb: { width: '100%', aspectRatio: 16 / 9, overflow: 'hidden' },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(5,6,11,0.28)' },
  dur: {
    position: 'absolute',
    right: 9,
    bottom: 9,
    zIndex: 3,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(5,6,11,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  durLabel: { fontFamily: fonts.mono, fontSize: 10.5, color: '#fff' },
  play: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -26,
    marginLeft: -26,
    width: 52,
    height: 52,
    borderRadius: 26,
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(8,10,18,0.42)',
  },
  body: { padding: 14, paddingBottom: 16, gap: 9 },
  name: { fontFamily: fonts.display, fontWeight: '700', fontSize: 16, letterSpacing: -0.16, color: colors.text },
  tags: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 7 },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 },
  diff: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: 'rgba(255,255,255,0.14)' },
  diffLbl: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.textFaint, marginLeft: 3, letterSpacing: 0.76 },
});
