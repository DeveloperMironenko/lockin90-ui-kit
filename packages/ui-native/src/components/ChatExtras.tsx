import { View, Text, StyleSheet, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';

/** A single waveform bar in the voice-note player. */
export interface ChatxWaveBar {
  /** Active bars are teal; inactive bars are faint. */
  on?: boolean;
  /** Animation delay (seconds) on web; ignored on native (static v1). */
  delay?: number;
}

export interface ChatExtrasProps {
  /** Section label above the typing bubble. */
  typingLabel?: string;
  /** Accessible label for the typing bubble (e.g. who is typing). */
  typingAria?: string;
  /** Section label above the voice-note player. */
  voiceLabel?: string;
  /** Voice-note duration text, e.g. '0:14'. */
  duration?: string;
  /** Waveform bars — leading active bars are teal, trailing bars stay faint. */
  waveform?: ChatxWaveBar[];
  /** Section label above the encryption pill. */
  encryptionLabel?: string;
  /** E2EE pill text. */
  e2eeLabel?: string;
  /** Supporting line beneath the E2EE pill. */
  e2eeSubtext?: string;
  style?: StyleProp<ViewStyle>;
}

/** Default waveform — 8 leading active bars, the rest faint (delays only affect web). */
const DEFAULT_WAVEFORM: ChatxWaveBar[] = [
  { on: true, delay: 0 },
  { on: true, delay: 0.1 },
  { on: true, delay: 0.2 },
  { on: true, delay: 0.05 },
  { on: true, delay: 0.25 },
  { on: true, delay: 0.15 },
  { on: true, delay: 0.3 },
  { on: true, delay: 0.12 },
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
];

/** Static heights for the active waveform bars (px), so the line reads as a waveform. */
const WAVE_HEIGHTS = [16, 22, 12, 26, 18, 24, 14, 20];

/** ChatExtras — three messaging primitives in one card: a typing indicator (3 static dots in
 *  a bubble), a voice-note player (gradient play button + waveform bars + duration), and an
 *  E2EE encryption badge (lock pill + subtext). Animations are static on native v1.
 *  Renders the showcase example by default. */
export function ChatExtras({
  typingLabel = 'Typing',
  typingAria = 'Coach is typing',
  voiceLabel = 'Voice note',
  duration = '0:14',
  waveform = DEFAULT_WAVEFORM,
  encryptionLabel = 'Encryption',
  e2eeLabel = 'End-to-end encrypted',
  e2eeSubtext = 'Messages in this chat are secured — the server only ever sees ciphertext.',
  style,
}: ChatExtrasProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.row}>
        <Text style={styles.lbl}>{typingLabel}</Text>
        <View style={styles.typing} accessibilityLabel={typingAria}>
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.lbl}>{voiceLabel}</Text>
        <View style={styles.rich}>
          <View style={styles.voice}>
            <Pressable accessibilityRole="button" accessibilityLabel="Play">
              <LinearGradient
                colors={gradients.cta.stops as readonly [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.play}
              >
                <Svg width={15} height={15} viewBox="0 0 24 24">
                  <Path d="M8 5v14l11-7z" fill="#08090f" />
                </Svg>
              </LinearGradient>
            </Pressable>
            <View style={styles.wave}>
              {waveform.map((bar, i) => {
                const h = bar.on ? WAVE_HEIGHTS[i % WAVE_HEIGHTS.length] : 3;
                return (
                  <View
                    key={i}
                    style={[styles.waveBar, bar.on ? styles.waveBarOn : styles.waveBarOff, { height: h }]}
                  />
                );
              })}
            </View>
            <Text style={styles.time}>{duration}</Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.lbl}>{encryptionLabel}</Text>
        <View style={styles.enc}>
          <View style={styles.e2ee}>
            <Svg width={13} height={13} viewBox="0 0 24 24">
              <Rect x={4} y={11} width={16} height={9} rx={2} stroke={colors.zoneHigh} strokeWidth={1.8} fill="none" />
              <Path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={colors.zoneHigh} strokeWidth={1.8} fill="none" />
            </Svg>
            <Text style={styles.e2eeText}>{e2eeLabel}</Text>
          </View>
          <Text style={styles.encSub}>{e2eeSubtext}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
    padding: 18,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  row: { gap: 9 },
  lbl: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },

  typing: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 5,
    backgroundColor: colors.glass2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textDim },

  rich: {
    width: 300,
    maxWidth: '100%',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: colors.glass,
  },
  voice: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 11, paddingHorizontal: 14 },
  play: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.35,
    shadowRadius: 40,
  },
  wave: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 2, height: 28 },
  waveBar: { flex: 1, borderRadius: 999, minHeight: 3 },
  waveBarOn: { backgroundColor: colors.accent2 },
  waveBarOff: { backgroundColor: colors.textFaint, opacity: 0.42 },
  time: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint },

  enc: { gap: 6, alignItems: 'flex-start' },
  e2ee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(52,245,197,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(52,245,197,0.28)',
  },
  e2eeText: { fontFamily: fonts.mono, fontSize: 10.5, letterSpacing: 0.3, color: colors.zoneHigh },
  encSub: { fontSize: 12, color: colors.textDim, lineHeight: 18 },
});
