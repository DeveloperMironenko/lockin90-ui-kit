import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';

/** Which of the 5 mood faces to draw — controls the mouth geometry. */
export type JournalMoodFace = 'drained' | 'low' | 'neutral' | 'good' | 'charged';

/** One guided-prompt chip in the prompt row. */
export interface JournalPrompt {
  /** chip label, e.g. "Wins today" */
  label: string;
  /** whether the prompt is already applied (lit gradient pill + check) */
  selected?: boolean;
}

/** One mood option in the mood-face row. */
export interface JournalMood {
  /** accessible label, e.g. "Good" */
  label: string;
  /** which face glyph to render (mouth shape) — defaults per the design set */
  face?: JournalMoodFace;
  /** whether this is the currently chosen mood (exactly one expected) */
  selected?: boolean;
}

export interface JournalComposerProps {
  /** card title, top-left (e.g. "New entry") */
  title?: string;
  /** mono timestamp, top-right (e.g. "Wed Jun 11") */
  time?: string;
  /** textarea placeholder */
  placeholder?: string;
  /** initial textarea value */
  value?: string;
  /** label above the prompt-chip row */
  promptsLabel?: string;
  /** the guided-prompt chips */
  prompts?: JournalPrompt[];
  /** label before the mood-face row */
  moodLabel?: string;
  /** the mood faces (one selected) */
  moods?: JournalMood[];
  /** the Save button label */
  saveLabel?: string;
  /** fired when a prompt chip is pressed (index + prompt) */
  onPromptToggle?: (prompt: JournalPrompt, index: number) => void;
  /** fired when a mood face is pressed (index + mood) */
  onMoodSelect?: (mood: JournalMood, index: number) => void;
  /** fired when the Save button is pressed */
  onSave?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** The design example's guided prompts, in order (first one applied). */
export const JOURNAL_PROMPTS: JournalPrompt[] = [
  { label: 'Wins today', selected: true },
  { label: 'What drained me' },
  { label: 'Sleep notes' },
  { label: "Tomorrow's focus" },
];

/** The design example's five mood faces (the "Good" face selected). */
export const JOURNAL_MOODS: JournalMood[] = [
  { label: 'Drained', face: 'drained' },
  { label: 'Low', face: 'low' },
  { label: 'Neutral', face: 'neutral' },
  { label: 'Good', face: 'good', selected: true },
  { label: 'Charged', face: 'charged' },
];

/** Faithful SVG faces from the mobile design's mood scale (0 0 32 32 viewBox). */
function FaceGlyph({ face, color }: { face: JournalMoodFace; color: string }) {
  const common = { stroke: color, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' as const };
  return (
    <Svg width={20} height={20} viewBox="0 0 32 32" fill="none">
      <Circle cx={16} cy={16} r={13} {...common} />
      {face === 'charged' ? (
        <>
          <Path d="M10.5 12.5 13 14M21.5 12.5 19 14" {...common} />
          <Path d="M10.5 18s2.5 4 5.5 4 5.5-4 5.5-4" {...common} />
        </>
      ) : (
        <>
          <Path d="M11 13h.5M20.5 13h.5" {...common} />
          {face === 'drained' && <Path d="M11 22s2-3 5-3 5 3 5 3" {...common} />}
          {face === 'low' && <Path d="M11 21s2-2 5-2 5 2 5 2" {...common} />}
          {face === 'neutral' && <Path d="M11 20h10" {...common} />}
          {face === 'good' && <Path d="M11 19s2 3 5 3 5-3 5-3" {...common} />}
        </>
      )}
    </Svg>
  );
}

/** Journal composer (native) — the "new entry" surface: a titled prompt + a
 *  free-text area, a row of guided-prompt chips, a mood-face selector row, and a
 *  gradient Save button. Same prop API as the web component. The mood faces use
 *  the mobile design's hand-drawn SVG glyphs (web uses emoji). */
export function JournalComposer({
  title = 'New entry',
  time = 'Wed Jun 11',
  placeholder = 'What shaped your energy today?',
  value = '',
  promptsLabel = 'Guided prompts',
  prompts = JOURNAL_PROMPTS,
  moodLabel = 'Mood',
  moods = JOURNAL_MOODS,
  saveLabel = 'Save entry',
  onPromptToggle,
  onMoodSelect,
  onSave,
  style,
}: JournalComposerProps) {
  const [text, setText] = useState(value);

  return (
    <View style={[styles.card, style]}>
      <View style={styles.head}>
        <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
            stroke={colors.accent}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>

      <TextInput
        style={styles.textarea}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        value={text}
        onChangeText={setText}
        multiline
        textAlignVertical="top"
      />

      <Text style={styles.promptLabel}>{promptsLabel.toUpperCase()}</Text>
      <View style={styles.prompts}>
        {prompts.map((p, i) => (
          <Pressable
            key={p.label}
            accessibilityRole="button"
            accessibilityState={{ selected: !!p.selected }}
            onPress={() => onPromptToggle?.(p, i)}
          >
            {p.selected ? (
              <LinearGradient
                colors={gradients.cta.stops as unknown as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.chipSelected}
              >
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M20 6 9 17l-5-5" stroke="#07080d" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={styles.chipSelectedLabel}>{p.label}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.chip}>
                <Text style={styles.chipPlus}>+</Text>
                <Text style={styles.chipLabel}>{p.label}</Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      <View style={styles.mood}>
        <Text style={styles.moodLabel}>{moodLabel.toUpperCase()}</Text>
        <View style={styles.faces}>
          {moods.map((m, i) => {
            const face = m.face ?? 'neutral';
            return (
              <Pressable
                key={m.label}
                accessibilityRole="button"
                accessibilityState={{ selected: !!m.selected }}
                accessibilityLabel={m.label}
                onPress={() => onMoodSelect?.(m, i)}
                style={[styles.face, m.selected && styles.faceSelected]}
              >
                <FaceGlyph face={face} color={m.selected ? colors.zoneHigh : colors.textDim} />
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.foot}>
        <Pressable accessibilityRole="button" accessibilityLabel={saveLabel} onPress={() => onSave?.()}>
          {({ pressed }) => (
            <LinearGradient
              colors={gradients.cta.stops as unknown as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.save, pressed && styles.savePressed]}
            >
              <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
                <Path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" stroke="#07080d" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M17 21v-8H7v8M7 3v5h8" stroke="#07080d" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={styles.saveLabel}>{saveLabel}</Text>
            </LinearGradient>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },

  head: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 13 },
  title: { fontFamily: fonts.display, fontWeight: '700', fontSize: 15, color: colors.text },
  time: { marginLeft: 'auto', fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint },

  textarea: {
    minHeight: 96,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: 'rgba(0,0,0,0.18)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontFamily: fonts.ui,
    fontSize: 13.5,
    color: colors.text,
    lineHeight: 22,
  },

  promptLabel: { fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: 1.14, color: colors.textFaint, marginTop: 14, marginBottom: 9 },
  prompts: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  chipPlus: { fontFamily: fonts.mono, fontSize: 13, color: colors.textDim, opacity: 0.7 },
  chipLabel: { fontFamily: fonts.ui, fontSize: 13, fontWeight: '500', color: colors.textDim },
  chipSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
  },
  chipSelectedLabel: { fontFamily: fonts.ui, fontSize: 13, fontWeight: '700', color: '#07080d' },

  mood: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  moodLabel: { fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: 1.14, color: colors.textFaint },
  faces: { flexDirection: 'row', gap: 8, marginLeft: 'auto' },
  face: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  faceSelected: {
    borderColor: 'rgba(52,245,197,0.5)',
    backgroundColor: 'rgba(52,245,197,0.1)',
    shadowColor: colors.zoneHigh,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    transform: [{ scale: 1.08 }],
  },

  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  save: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 8 },
  },
  savePressed: { opacity: 0.9, transform: [{ translateY: 1 }] },
  saveLabel: { fontFamily: fonts.ui, fontSize: 13, fontWeight: '700', color: '#07080d' },
});
