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
import Svg, { Path, Rect } from 'react-native-svg';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';

/** A single message in the thread. */
export interface ChatMessage {
  /** `them` = left/glass bubble, `me` = right/gradient-tinted bubble. */
  from: 'them' | 'me';
  /** Message body text. */
  text: string;
  /** Timestamp / meta line under the bubble, e.g. 'Coach Mara · 2:04 PM' or '2:09 PM'. */
  time?: string;
}

export interface ChatThreadProps {
  /** Optional E2EE badge text shown centered above the thread. Pass `null` to hide. */
  e2eeLabel?: string | null;
  /** Optional day divider label (e.g. 'TODAY'). Pass `null` to hide. */
  dayLabel?: string | null;
  /** Ordered list of messages, oldest first. */
  messages?: ChatMessage[];
  /** Placeholder for the composer text input. */
  composerPlaceholder?: string;
  style?: StyleProp<ViewStyle>;
}

/** Default conversation mirroring the design showcase example. */
const DEFAULT_MESSAGES: ChatMessage[] = [
  { from: 'them', text: 'How was your energy after the schedule change?', time: 'Coach Mara · 2:04 PM' },
  { from: 'me', text: 'Way better — peak held till 3pm 💪', time: '2:09 PM' },
  { from: 'them', text: "Love that. Let's lock the new morning block in.", time: 'Coach Mara · 2:11 PM' },
  { from: 'me', text: 'Done. Logging it now.', time: '2:12 PM' },
];

/** ChatThread — a coach/DM conversation: an E2EE badge, a day divider, message bubbles
 *  (them = left/glass, me = right/gradient-tinted) with timestamps + delivery ticks, and a
 *  composer bar (attach + text input + gradient send button). Renders the showcase example
 *  by default. */
export function ChatThread({
  e2eeLabel = 'End-to-end encrypted · keys verified',
  dayLabel = 'TODAY',
  messages = DEFAULT_MESSAGES,
  composerPlaceholder = 'Message — encrypted end-to-end',
  style,
}: ChatThreadProps) {
  return (
    <View style={[styles.card, style]}>
      {e2eeLabel != null && (
        <View style={styles.e2ee}>
          <Svg width={13} height={13} viewBox="0 0 24 24">
            <Rect x={5} y={11} width={14} height={9} rx={2} stroke={colors.zoneHigh} strokeWidth={1.8} fill="none" />
            <Path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={colors.zoneHigh} strokeWidth={1.8} fill="none" />
          </Svg>
          <Text style={styles.e2eeText}>{e2eeLabel}</Text>
        </View>
      )}

      <View style={styles.body}>
        {dayLabel != null && <Text style={styles.day}>{dayLabel}</Text>}

        {messages.map((msg, i) => {
          const me = msg.from === 'me';
          return (
            <View key={i} style={[styles.msg, me ? styles.msgMe : styles.msgThem]}>
              <View style={[styles.bubble, me ? styles.bubbleMe : styles.bubbleThem]}>
                <Text style={[styles.bubbleText, me && styles.bubbleTextMe]}>{msg.text}</Text>
              </View>
              {msg.time != null && (
                <View style={styles.meta}>
                  <Text style={styles.metaText}>{msg.time}</Text>
                  {me && (
                    <Svg width={11} height={11} viewBox="0 0 24 24">
                      <Path d="M20 6 9 17l-5-5" stroke={colors.zoneHigh} strokeWidth={2} fill="none" />
                    </Svg>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.composer}>
        <Pressable accessibilityRole="button" accessibilityLabel="Attach" style={styles.attach}>
          <Svg width={17} height={17} viewBox="0 0 24 24">
            <Path
              d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
              stroke={colors.textDim}
              strokeWidth={1.8}
              fill="none"
            />
          </Svg>
        </Pressable>

        <TextInput
          style={styles.input}
          placeholder={composerPlaceholder}
          placeholderTextColor={colors.textFaint}
          accessibilityLabel="Message"
        />

        <Pressable accessibilityRole="button" accessibilityLabel="Send">
          <LinearGradient
            colors={gradients.cta.stops as readonly [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.send}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path d="m22 2-7 20-4-9-9-4z" stroke="#0A0A12" strokeWidth={2} fill="none" />
              <Path d="M22 2 11 13" stroke="#0A0A12" strokeWidth={2} fill="none" />
            </Svg>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 0,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.bg1,
    overflow: 'hidden',
  },

  e2ee: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 14,
    marginBottom: 4,
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(52,245,197,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(52,245,197,0.28)',
  },
  e2eeText: { fontFamily: fonts.mono, fontSize: 10.5, letterSpacing: 0.3, color: colors.zoneHigh },

  body: { gap: 12, paddingHorizontal: 20, paddingTop: 6, paddingBottom: 14 },
  day: {
    textAlign: 'center',
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.textFaint,
    marginTop: 6,
    marginBottom: 2,
  },

  msg: { maxWidth: '76%', gap: 4 },
  msgThem: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  msgMe: { alignSelf: 'flex-end', alignItems: 'flex-end' },

  bubble: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  bubbleThem: {
    backgroundColor: colors.glass2,
    borderColor: colors.border,
    borderBottomLeftRadius: 5,
  },
  bubbleMe: {
    backgroundColor: 'rgba(124,92,255,0.16)',
    borderColor: 'rgba(124,92,255,0.34)',
    borderBottomRightRadius: 5,
  },
  bubbleText: { fontFamily: fonts.ui, fontSize: 13.5, lineHeight: 20, color: colors.text },
  bubbleTextMe: { color: '#ECE8FF' },

  meta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.textFaint },

  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  attach: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: 11,
    paddingHorizontal: 16,
    color: colors.text,
    fontFamily: fonts.ui,
    fontSize: 13.5,
  },
  send: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.35,
    shadowRadius: 40,
  },
});
